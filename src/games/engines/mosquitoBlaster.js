/**
 * Mosquito Blaster: Naija Malaria Slayer
 * ---------------------------------------------------------------
 * Ported from the original single-file HTML build. The game logic
 * is unchanged; what's new is a real lifecycle:
 *
 *   - the rAF loop is cancellable, so unmounting stops it (without
 *     this, React StrictMode's double-mount runs two loops and the
 *     game plays at double speed);
 *   - every listener is registered through `on()` so `destroy()`
 *     can remove all of them;
 *   - pointer coordinates are mapped from CSS pixels into the
 *     canvas's fixed 800x600 coordinate space, because all the
 *     game maths — including menu button hit-boxes — is written
 *     against those absolute numbers.
 *
 * @param {HTMLCanvasElement} canvas
 * @returns {{ destroy: () => void }}
 */
export function createGame(canvas) {
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

/** Listener registry, drained by destroy(). */
const listeners = [];
const on = (target, type, handler) => {
  target.addEventListener(type, handler);
  listeners.push([target, type, handler]);
};

/**
 * Map a pointer event into canvas coordinates.
 *
 * The canvas renders responsively (CSS width: 100%) while its
 * backing store stays 800x600, so the two spaces diverge and the
 * ratio has to be applied. The original `e.clientX - rect.left`
 * only worked because the standalone page never scaled the canvas.
 */
const pointer = (e) => {
  const r = canvas.getBoundingClientRect();
  return {
    x: (e.clientX - r.left) * (canvas.width / r.width),
    y: (e.clientY - r.top) * (canvas.height / r.height),
  };
};

// ─── STATE ───────────────────────────────────────────────────────────────────
let state = 'title'; // title | playing | paused | gameover
let kills = 0, hp = 3, wave = 1, waveTimer = 30;
// Radix 10 and a finite check: a junk value under this key would
// otherwise render as "BEST: NaN KILLS" on the title screen and
// never correct itself.
let highscore = (() => {
  const stored = parseInt(localStorage.getItem('mbs_hs') || '0', 10);
  return Number.isFinite(stored) ? stored : 0;
})();
let shakeFrames = 0;
let nepaSlow = false, nepaTimer = 0;
let doubleShot = false, doubleTimer = 0;
let lastTime = 0, waveTimerAcc = 0;

// ─── ENTITIES ────────────────────────────────────────────────────────────────
let player = { x: 400, y: 500, r: 15, angle: 0, shootCd: 0 };
let bullets = [], mosquitoes = [], particles = [], powerups = [], splats = [], floatTexts = [];
let mouse = { x: 400, y: 400 };

// ─── NAIJA QUOTES ────────────────────────────────────────────────────────────
const quotes = [
  '"E DON SHEGE!"', '"WAHALA DEY!"', '"SHI-NAIR!"',
  '"NO SLEEP!"', '"BLOOD!"', '"MALARIA!"', '"ABEG!"',
  '"EHEN!"', '"CHEI!"', '"WETIN?!"'
];

// ─── RAIN ────────────────────────────────────────────────────────────────────
let rainDrops = Array.from({length:120}, () => ({
  x: Math.random()*800, y: Math.random()*600,
  speed: 4+Math.random()*4, len: 10+Math.random()*15
}));

// ─── NEON SIGNS (corner decorations) ─────────────────────────────────────────
const neonTexts = [
  {x:60, y:220, lines:['HUSTLE','NO DEY','SLEEP'], color:'#ff6600'},
  {x:60, y:650, lines:['HUSTLE','NO DEY','SLEEP'], color:'#ff6600'},
  {x:730, y:270, lines:['HUSTLE','NO DEY','SLEEP'], color:'#cc8800'},
  {x:1350, y:650, lines:['BUKA','24/7'], color:'#cc8800'},
];

// ─── INPUT ────────────────────────────────────────────────────────────────────
on(canvas, 'mousemove', e => {
  const p = pointer(e);
  mouse.x = p.x;
  mouse.y = p.y;
});
on(canvas, 'click', e => {
  const p = pointer(e);
  const cx = p.x, cy = p.y;
  if (state === 'title') {
    if (cx>200&&cx<600&&cy>320&&cy<400) startGame();
  } else if (state === 'gameover') {
    if (cx>250&&cx<550&&cy>380&&cy<450) startGame();
  } else if (state === 'paused') {
    if (cx>280&&cx<520&&cy>280&&cy<340) state='playing';
    if (cx>280&&cx<520&&cy>360&&cy<420) { state='title'; }
  } else if (state === 'playing') {
    shoot(cx,cy);
  }
});
// Bound to the canvas rather than the document: the canvas is
// focusable and takes focus on Play, so Escape pauses the game
// without hijacking Escape for the rest of the page.
on(canvas, 'keydown', e => {
  if (e.key==='Escape') {
    e.preventDefault();
    if (state==='playing') state='paused';
    else if (state==='paused') state='playing';
  }
});

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function rnd(a,b){return Math.random()*(b-a)+a;}
function dist(a,b){return Math.hypot(a.x-b.x,a.y-b.y);}
function lerp(a,b,t){return a+(b-a)*t;}

function spawnMosquito() {
  const edge = Math.floor(Math.random()*4);
  let x,y;
  if(edge===0){x=rnd(0,800);y=-20;}
  else if(edge===1){x=820;y=rnd(0,600);}
  else if(edge===2){x=rnd(0,800);y=620;}
  else{x=-20;y=rnd(0,600);}
  const size = rnd(10,20);
  mosquitoes.push({
    x,y,size,
    vx: rnd(-1.5,1.5), vy: rnd(-1.5,1.5),
    hp:1, quote:null, quoteTimer:0,
    buzzeTimer: Math.random()*60,
    wings: 0, wingDir:1
  });
}

function spawnPowerup() {
  const type = Math.random()<0.6?'nepa':'double';
  powerups.push({
    x:rnd(80,720), y:rnd(80,520),
    type, pulse:0, life:300
  });
}

function shoot(tx,ty) {
  if(player.shootCd>0) return;
  player.shootCd = nepaSlow ? 3 : 8;
  const dx = tx-player.x, dy = ty-player.y;
  const d = Math.hypot(dx,dy);
  const speed = 12;
  const bx = dx/d*speed, by = dy/d*speed;
  bullets.push({x:player.x,y:player.y,vx:bx,vy:by,life:60,trail:[]});
  if(doubleShot) {
    const perp = 8;
    bullets.push({x:player.x+dy/d*perp,y:player.y-dx/d*perp,vx:bx,vy:by,life:60,trail:[]});
    bullets.push({x:player.x-dy/d*perp,y:player.y+dx/d*perp,vx:bx,vy:by,life:60,trail:[]});
  }
}

function explode(x,y) {
  for(let i=0;i<14;i++) {
    const angle=Math.random()*Math.PI*2, speed=rnd(1,5);
    particles.push({x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,
      life:rnd(20,40),maxLife:40,color:'#00ff44',size:rnd(3,7)});
  }
  splats.push({x,y,size:rnd(20,40),alpha:0.7});
}

function takeDamage() {
  hp--;
  shakeFrames=20;
  if(hp<=0) gameOver();
}

function startGame() {
  kills=0; hp=3; wave=1; waveTimer=30;
  bullets=[]; mosquitoes=[]; particles=[]; powerups=[]; splats=[]; floatTexts=[];
  player={x:400,y:500,r:15,angle:0,shootCd:0};
  nepaSlow=false; nepaTimer=0; doubleShot=false; doubleTimer=0;
  waveTimerAcc=0;
  // spawn initial mosquitoes
  for(let i=0;i<3+wave*2;i++) spawnMosquito();
  state='playing';
}

// Whether the run that just ended actually beat the record. The
// game-over screen cannot work this out for itself: gameOver()
// raises `highscore` to `kills`, so a later `kills >= highscore`
// test is true after every run that scored at all, and the banner
// always claimed a new highscore.
let beatHighscore = false;

function gameOver() {
  beatHighscore = kills > highscore;
  if(beatHighscore){highscore=kills;localStorage.setItem('mbs_hs',highscore);}
  state='gameover';
}

// ─── DRAW HELPERS ─────────────────────────────────────────────────────────────
function glow(color,blur=15){ctx.shadowColor=color;ctx.shadowBlur=blur;}
function noGlow(){ctx.shadowBlur=0;}

function drawBackground() {
  // gradient bg
  const grad = ctx.createLinearGradient(0,0,0,600);
  grad.addColorStop(0,'#001122');
  grad.addColorStop(1,'#003300');
  ctx.fillStyle=grad;
  ctx.fillRect(0,0,800,600);

  // rain
  ctx.strokeStyle='rgba(100,180,255,0.18)';
  ctx.lineWidth=1;
  rainDrops.forEach(d=>{
    ctx.beginPath();
    ctx.moveTo(d.x,d.y);
    ctx.lineTo(d.x-2,d.y+d.len);
    ctx.stroke();
    d.y+=d.speed;
    if(d.y>620){d.y=-20;d.x=Math.random()*800;}
  });

  // window frame
  ctx.strokeStyle='rgba(80,120,80,0.15)';
  ctx.lineWidth=4;
  ctx.strokeRect(40,40,720,520);
  ctx.strokeStyle='rgba(80,120,80,0.1)';
  ctx.lineWidth=2;
  ctx.beginPath();ctx.moveTo(400,40);ctx.lineTo(400,560);ctx.stroke();
  ctx.beginPath();ctx.moveTo(40,300);ctx.lineTo(760,300);ctx.stroke();

  // corner neon signs
  ctx.font='bold 18px "Courier New"';
  ctx.textAlign='center';
  // left
  glow('#ff6600',10);
  ctx.fillStyle='rgba(255,100,0,0.15)';
  ctx.fillRect(10,180,120,160);
  ctx.strokeStyle='#ff6600';ctx.lineWidth=2;ctx.strokeRect(10,180,120,160);
  ctx.fillStyle='#ff8800';
  ['HUSTLE','NO DEY','SLEEP'].forEach((t,i)=>ctx.fillText(t,70,215+i*30));
  // right
  glow('#cc8800',10);
  ctx.fillStyle='rgba(180,120,0,0.12)';
  ctx.fillRect(660,180,125,160);
  ctx.strokeStyle='#cc8800';ctx.strokeRect(660,180,125,160);
  ctx.fillStyle='#ddaa00';
  ['HUSTLE','NO DEY','SLEEP'].forEach((t,i)=>ctx.fillText(t,722,215+i*30));
  // bottom right BUKA
  glow('#cc8800',10);
  ctx.fillStyle='rgba(180,120,0,0.12)';
  ctx.fillRect(660,480,125,100);
  ctx.strokeStyle='#cc8800';ctx.strokeRect(660,480,125,100);
  ctx.fillStyle='#ddaa00';
  ['BUKA','24/7'].forEach((t,i)=>ctx.fillText(t,722,515+i*30));
  noGlow();
}

function drawSplats() {
  splats.forEach(s=>{
    ctx.save();
    ctx.globalAlpha=s.alpha*0.5;
    // blob splat
    ctx.fillStyle='#00cc22';
    ctx.beginPath();
    ctx.ellipse(s.x,s.y,s.size,s.size*0.7,0,0,Math.PI*2);
    ctx.fill();
    for(let i=0;i<4;i++) {
      const a=Math.PI*2/4*i, r=s.size*0.6;
      ctx.beginPath();
      ctx.ellipse(s.x+Math.cos(a)*r,s.y+Math.sin(a)*r,s.size*0.3,s.size*0.25,a,0,Math.PI*2);
      ctx.fill();
    }
    ctx.restore();
  });
}

function drawPlayer() {
  const px=player.x, py=player.y;
  // glow ring
  glow('#FFD700',20);
  ctx.beginPath();
  ctx.arc(px,py,player.r+3,0,Math.PI*2);
  ctx.strokeStyle='rgba(255,215,0,0.4)';
  ctx.lineWidth=3;
  ctx.stroke();
  // helmet body
  ctx.fillStyle='#FFD700';
  ctx.beginPath();
  ctx.arc(px,py,player.r,0,Math.PI*2);
  ctx.fill();
  // helmet stripe
  ctx.fillStyle='#cc0000';
  ctx.fillRect(px-player.r,py-3,player.r*2,6);
  ctx.fillStyle='#FFD700';
  ctx.beginPath();
  ctx.arc(px,py,player.r,0,Math.PI*2);
  ctx.save();
  ctx.clip();
  ctx.fillStyle='#cc0000';
  ctx.fillRect(px-player.r,py-3,player.r*2,6);
  ctx.restore();

  // swatter arm pointing at mouse
  const angle = Math.atan2(mouse.y-py,mouse.x-px);
  ctx.save();
  ctx.translate(px,py);
  ctx.rotate(angle);
  glow('#aaffaa',8);
  ctx.strokeStyle='#88ff88';
  ctx.lineWidth=3;
  ctx.beginPath();
  ctx.moveTo(player.r,0);
  ctx.lineTo(player.r+30,0);
  ctx.stroke();
  // swatter head
  ctx.strokeStyle='#00ff88';
  ctx.lineWidth=2;
  ctx.strokeRect(player.r+28,-10,14,20);
  // grid
  ctx.strokeStyle='rgba(0,255,100,0.5)';
  ctx.lineWidth=1;
  for(let i=1;i<3;i++){
    ctx.beginPath();ctx.moveTo(player.r+28+i*14/3,-10);ctx.lineTo(player.r+28+i*14/3,10);ctx.stroke();
  }
  ctx.restore();
  noGlow();
}

function drawMosquito(m) {
  const x=m.x, y=m.y, s=m.size;
  m.wings+=0.25*m.wingDir;
  if(m.wings>0.5||m.wings<-0.5) m.wingDir*=-1;

  ctx.save();
  // buzz aura
  glow('#003300',5);
  // body
  ctx.fillStyle='#111';
  ctx.beginPath();
  ctx.ellipse(x,y,s*0.5,s*0.3,0,0,Math.PI*2);
  ctx.fill();
  // head
  ctx.beginPath();
  ctx.arc(x+s*0.55,y,s*0.2,0,Math.PI*2);
  ctx.fill();
  // red eyes
  glow('#ff0000',8);
  ctx.fillStyle='#ff0000';
  ctx.beginPath();
  ctx.arc(x+s*0.62,y-s*0.08,s*0.07,0,Math.PI*2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x+s*0.62,y+s*0.08,s*0.07,0,Math.PI*2);
  ctx.fill();
  noGlow();
  // wings (flutter)
  ctx.strokeStyle='rgba(200,230,200,0.6)';
  ctx.lineWidth=1;
  const wf = m.wings;
  // top wings
  ctx.beginPath();
  ctx.ellipse(x,y-s*0.35+wf*s,s*0.6,s*0.25,wf,0,Math.PI*2);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(x,y+s*0.35-wf*s,s*0.6,s*0.25,-wf,0,Math.PI*2);
  ctx.stroke();
  // stinger
  ctx.strokeStyle='#555';
  ctx.lineWidth=1;
  ctx.beginPath();
  ctx.moveTo(x-s*0.5,y);
  ctx.lineTo(x-s*0.8,y+s*0.1);
  ctx.stroke();
  ctx.restore();

  // buzz lines
  ctx.strokeStyle='rgba(200,255,200,0.2)';
  ctx.lineWidth=1;
  for(let i=0;i<3;i++){
    const a=Date.now()*0.01+i*2;
    ctx.beginPath();
    ctx.arc(x,y,s+5+i*4,a,a+1.2);
    ctx.stroke();
  }

  // quote
  if(m.quote && m.quoteTimer>0) {
    ctx.font=`bold 11px "Courier New"`;
    ctx.fillStyle='#00ff88';
    glow('#00ff88',8);
    ctx.textAlign='center';
    ctx.fillText(m.quote, x, y-s-8);
    noGlow();
  }
}

function drawBullet(b) {
  glow('#ffffff',10);
  // trail
  if(b.trail.length>1){
    ctx.strokeStyle='rgba(255,255,255,0.3)';
    ctx.lineWidth=2;
    ctx.beginPath();
    b.trail.forEach((p,i)=>{
      if(i===0) ctx.moveTo(p.x,p.y);
      else ctx.lineTo(p.x,p.y);
    });
    ctx.stroke();
  }
  ctx.fillStyle='#ffffff';
  ctx.beginPath();
  ctx.arc(b.x,b.y,4,0,Math.PI*2);
  ctx.fill();
  noGlow();
}

function drawPowerup(p) {
  p.pulse = (p.pulse+0.05)%(Math.PI*2);
  const gscale = 1+Math.sin(p.pulse)*0.15;
  ctx.save();
  ctx.translate(p.x,p.y);
  ctx.scale(gscale,gscale);
  if(p.type==='nepa'){
    // lightbulb
    glow('#00ccff',20);
    ctx.fillStyle='rgba(0,100,200,0.3)';
    ctx.beginPath();
    ctx.arc(0,0,22,0,Math.PI*2);
    ctx.fill();
    ctx.strokeStyle='#00ccff';
    ctx.lineWidth=2;
    ctx.stroke();
    ctx.fillStyle='#00eeff';
    ctx.font='bold 20px sans-serif';
    ctx.textAlign='center';
    ctx.textBaseline='middle';
    ctx.fillText('💡',0,0);
    ctx.font='bold 8px "Courier New"';
    ctx.fillStyle='#00ffff';
    ctx.fillText('NEPA SLOW',0,28);
  } else {
    glow('#aa00ff',20);
    ctx.fillStyle='rgba(100,0,200,0.3)';
    ctx.beginPath();
    ctx.arc(0,0,22,0,Math.PI*2);
    ctx.fill();
    ctx.strokeStyle='#aa00ff';
    ctx.lineWidth=2;
    ctx.stroke();
    ctx.fillStyle='#cc44ff';
    ctx.font='bold 20px sans-serif';
    ctx.textAlign='center';
    ctx.textBaseline='middle';
    ctx.fillText('⚡',0,0);
    ctx.font='bold 8px "Courier New"';
    ctx.fillStyle='#dd88ff';
    ctx.fillText('2X SHOT',0,28);
  }
  noGlow();
  ctx.restore();
}

function drawHUD() {
  // kills
  glow('#00ff00',12);
  ctx.font='bold 28px "Courier New"';
  ctx.fillStyle='#00ff88';
  ctx.textAlign='left';
  ctx.textBaseline='top';
  ctx.fillText(`KILLS: ${kills}`,20,20);

  // wave top right
  ctx.textAlign='right';
  ctx.fillText(`WAVE: ${wave}`,780,20);
  noGlow();

  // wave timer circle
  const timerX=710, timerY=100, timerR=32;
  ctx.strokeStyle='rgba(0,80,0,0.5)';
  ctx.lineWidth=5;
  ctx.beginPath();ctx.arc(timerX,timerY,timerR,0,Math.PI*2);ctx.stroke();
  glow('#00ff00',15);
  ctx.strokeStyle='#00ff44';
  ctx.lineWidth=5;
  const frac=Math.max(0,Math.min(1,waveTimer/30));
  if(frac>0.01){
    ctx.beginPath();
    ctx.arc(timerX,timerY,timerR,-Math.PI/2,-Math.PI/2+frac*Math.PI*2,false);
    ctx.stroke();
  }
  noGlow();
  ctx.fillStyle='#ffffff';
  ctx.font='bold 18px "Courier New"';
  ctx.textAlign='center';
  ctx.textBaseline='middle';
  ctx.fillText(`${Math.ceil(waveTimer)}s`,timerX,timerY);
  ctx.font='bold 12px "Courier New"';
  ctx.fillStyle='#aaffaa';
  ctx.fillText('NEXT',timerX,timerY-48);

  // HP hearts top center
  const hpBox = {x:270,y:15,w:260,h:60};
  // box bg
  ctx.fillStyle='rgba(0,40,0,0.6)';
  ctx.strokeStyle='#00ff00';
  glow('#00ff00',15);
  ctx.lineWidth=2;
  ctx.beginPath();
  ctx.roundRect(hpBox.x,hpBox.y,hpBox.w,hpBox.h,8);
  ctx.fill();ctx.stroke();
  noGlow();
  for(let i=0;i<3;i++){
    const hx=hpBox.x+40+i*80, hy=hpBox.y+30;
    const filled = i<hp;
    ctx.font='28px sans-serif';
    ctx.textAlign='center';
    ctx.textBaseline='middle';
    if(filled){glow('#ff0000',10);}
    ctx.fillStyle = filled ? '#00ff00' : 'rgba(200,0,0,0.25)';
    // draw heart
    drawHeart(hx,hy,15,filled);
  }
  noGlow();

  // powerup indicators
  if(nepaSlow){
    glow('#00ccff',10);
    ctx.font='bold 13px "Courier New"';
    ctx.fillStyle='#00eeff';
    ctx.textAlign='left';
    ctx.fillText(`💡 NEPA SLOW: ${Math.ceil(nepaTimer/1000)}s`,20,580);
    noGlow();
  }
  if(doubleShot){
    glow('#aa00ff',10);
    ctx.font='bold 13px "Courier New"';
    ctx.fillStyle='#cc44ff';
    ctx.textAlign='left';
    ctx.fillText(`⚡ 2X SHOT: ${Math.ceil(doubleTimer/1000)}s`,20,nepaSlow?560:580);
    noGlow();
  }
  // NEPA FLICKER text if active
  if(nepaSlow){
    glow('#00aaff',20);
    ctx.font='bold 22px Orbitron, "Courier New"';
    ctx.fillStyle='#00ccff';
    ctx.textAlign='left';
    ctx.fillText('NEPA FLICKER',155,215);
    noGlow();
  }
}

function drawHeart(x,y,size,filled){
  ctx.save();
  ctx.translate(x,y);
  ctx.beginPath();
  ctx.moveTo(0,-size*0.3);
  ctx.bezierCurveTo(size*0.5,-size*1.0, size*1.2,-size*0.2, 0,size*0.7);
  ctx.bezierCurveTo(-size*1.2,-size*0.2, -size*0.5,-size*1.0, 0,-size*0.3);
  ctx.fillStyle= filled?'#00ee44':'rgba(200,0,0,0.3)';
  ctx.fill();
  ctx.strokeStyle= filled?'#ff3333':'#660000';
  ctx.lineWidth=1.5;
  ctx.stroke();
  ctx.restore();
}

function drawFloatTexts() {
  floatTexts.forEach(t=>{
    ctx.save();
    ctx.globalAlpha = t.life/40;
    glow('#00ff88',8);
    ctx.font=`bold ${t.size||13}px "Courier New"`;
    ctx.fillStyle='#00ff88';
    ctx.textAlign='center';
    ctx.fillText(t.text,t.x,t.y);
    noGlow();
    ctx.restore();
    t.y-=0.8;
    t.life--;
  });
  floatTexts = floatTexts.filter(t=>t.life>0);
}

// ─── SCREENS ──────────────────────────────────────────────────────────────────
function drawTitle(){
  drawBackground();
  // Big title
  ctx.textAlign='center';
  ctx.textBaseline='middle';
  glow('#00ff00',30);
  ctx.font='bold 56px Orbitron, "Courier New"';
  ctx.fillStyle='#00ff88';
  ctx.fillText('MOSQUITO',400,140);
  ctx.fillText('BLASTER',400,210);
  noGlow();
  ctx.font='bold 20px "Courier New"';
  ctx.fillStyle='#88ff88';
  ctx.fillText('Naija Malaria Slayer 🚀',400,265);

  // highscore
  ctx.font='bold 16px "Courier New"';
  ctx.fillStyle='#ffdd00';
  glow('#ffdd00',10);
  ctx.fillText(`🏆 BEST: ${highscore} KILLS`,400,305);
  noGlow();

  // Play button
  const pulse = Math.sin(Date.now()*0.004)*3;
  glow('#00ff00',20);
  ctx.fillStyle='rgba(0,150,0,0.8)';
  ctx.strokeStyle='#00ff44';
  ctx.lineWidth=3;
  ctx.beginPath();
  ctx.roundRect(200,320+pulse,400,75,12);
  ctx.fill();ctx.stroke();
  ctx.font='bold 28px Orbitron, "Courier New"';
  ctx.fillStyle='#ffffff';
  ctx.fillText("START BLASTIN'",400,360+pulse);
  noGlow();

  ctx.font='12px "Courier New"';
  ctx.fillStyle='rgba(150,255,150,0.6)';
  ctx.fillText('Click to shoot | ESC to pause | Collect powerups!',400,450);
  ctx.fillStyle='rgba(100,200,100,0.4)';
  ctx.fillText('@akcodex1',400,490);
}

function drawGameOver(){
  // dim overlay
  ctx.fillStyle='rgba(0,0,0,0.75)';
  ctx.fillRect(0,0,800,600);
  ctx.textAlign='center';
  ctx.textBaseline='middle';
  glow('#ff0000',30);
  ctx.font='bold 52px Orbitron, "Courier New"';
  ctx.fillStyle='#ff3333';
  ctx.fillText('MALARIA',400,170);
  ctx.fillText('GOT YOU!',400,240);
  noGlow();
  ctx.font='bold 28px "Courier New"';
  ctx.fillStyle='#00ff88';
  glow('#00ff88',10);
  ctx.fillText(`KILLS: ${kills}`,400,310);
  noGlow();
  if(beatHighscore && kills>0){
    glow('#ffdd00',15);
    ctx.font='bold 20px "Courier New"';
    ctx.fillStyle='#ffdd00';
    ctx.fillText('🏆 NEW HIGHSCORE! 🏆',400,355);
    noGlow();
  } else {
    ctx.font='16px "Courier New"';
    ctx.fillStyle='#aaaaaa';
    ctx.fillText(`BEST: ${highscore}`,400,355);
  }
  // restart button
  glow('#00ff00',15);
  ctx.fillStyle='rgba(0,120,0,0.85)';
  ctx.strokeStyle='#00ff44';
  ctx.lineWidth=3;
  ctx.beginPath();
  ctx.roundRect(250,380,300,65,12);
  ctx.fill();ctx.stroke();
  ctx.font='bold 24px Orbitron, "Courier New"';
  ctx.fillStyle='#ffffff';
  ctx.fillText('TRY AGAIN',400,415);
  noGlow();
  ctx.font='14px "Courier New"';
  ctx.fillStyle='rgba(100,255,100,0.5)';
  ctx.fillText('@akcodex1',400,510);
}

function drawPause(){
  ctx.fillStyle='rgba(0,0,0,0.65)';
  ctx.fillRect(0,0,800,600);
  ctx.textAlign='center';
  ctx.textBaseline='middle';
  glow('#ffff00',20);
  ctx.font='bold 50px Orbitron, "Courier New"';
  ctx.fillStyle='#ffff00';
  ctx.fillText('PAUSED',400,220);
  noGlow();
  // Resume
  ctx.fillStyle='rgba(0,100,0,0.8)';ctx.strokeStyle='#00ff44';ctx.lineWidth=2;
  glow('#00ff00',10);
  ctx.beginPath();ctx.roundRect(280,280,240,55,10);ctx.fill();ctx.stroke();
  ctx.font='bold 20px "Courier New"';ctx.fillStyle='#fff';ctx.fillText('RESUME',400,308);
  // Quit
  ctx.fillStyle='rgba(100,0,0,0.8)';ctx.strokeStyle='#ff4444';
  ctx.beginPath();ctx.roundRect(280,360,240,55,10);ctx.fill();ctx.stroke();
  ctx.fillStyle='#ffaaaa';ctx.fillText('QUIT TO MENU',400,388);
  noGlow();
}

// ─── MAIN UPDATE ──────────────────────────────────────────────────────────────
function update(dt) {
  if(state!=='playing') return;

  // shake
  if(shakeFrames>0) shakeFrames--;

  // timers
  if(player.shootCd>0) player.shootCd--;
  if(nepaSlow){nepaTimer-=dt;if(nepaTimer<=0)nepaSlow=false;}
  if(doubleShot){doubleTimer-=dt;if(doubleTimer<=0)doubleShot=false;}

  // wave timer
  waveTimerAcc+=dt/1000;
  if(waveTimerAcc>=1){
    waveTimerAcc=0;
    waveTimer--;
    if(waveTimer<=0){
      wave++;
      waveTimer=30;
      // spawn more mosquitoes
      for(let i=0;i<3+wave*2;i++) spawnMosquito();
      if(Math.random()<0.5) spawnPowerup();
      floatTexts.push({text:`WAVE ${wave}!`,x:400,y:300,life:90,size:30});
    }
  }

  const slowFactor = nepaSlow ? 0.4 : 1;

  // update mosquitoes
  mosquitoes.forEach(m=>{
    // home in on player weakly
    const dx=player.x-m.x, dy=player.y-m.y;
    const d=Math.hypot(dx,dy);
    m.vx = lerp(m.vx, dx/d*1.2*slowFactor, 0.03);
    m.vy = lerp(m.vy, dy/d*1.2*slowFactor, 0.03);
    m.x+=m.vx;
    m.y+=m.vy;

    // quote triggers
    m.buzzeTimer--;
    if(m.buzzeTimer<=0) {
      m.quote=quotes[Math.floor(Math.random()*quotes.length)];
      m.quoteTimer=90;
      m.buzzeTimer=rnd(80,160);
    }
    if(m.quoteTimer>0) m.quoteTimer--;

    // hit player
    if(dist(m,player)<player.r+m.size*0.5) {
      takeDamage();
      splats.push({x:m.x,y:m.y,size:25,alpha:0.6});
      m.hp=0;
    }
  });
  mosquitoes=mosquitoes.filter(m=>m.hp>0);

  // always keep some mosquitoes
  while(mosquitoes.length < 3+wave*2) spawnMosquito();

  // bullets
  bullets.forEach(b=>{
    b.trail.push({x:b.x,y:b.y});
    if(b.trail.length>8) b.trail.shift();
    b.x+=b.vx;b.y+=b.vy;b.life--;
    // hit mosquito
    mosquitoes.forEach(m=>{
      if(dist(b,m)<m.size*0.7+4){
        m.hp--;b.life=0;kills++;
        explode(m.x,m.y);
        if(m.quote) floatTexts.push({text:m.quote,x:m.x,y:m.y-20,life:45});
      }
    });
  });
  bullets=bullets.filter(b=>b.life>0&&b.x>-10&&b.x<810&&b.y>-10&&b.y<610);

  // particles
  particles.forEach(p=>{
    p.x+=p.vx;p.y+=p.vy;p.vy+=0.1;p.life--;p.vx*=0.95;
  });
  particles=particles.filter(p=>p.life>0);

  // powerups
  powerups.forEach(p=>{
    p.life--;
    if(dist(p,player)<28){
      if(p.type==='nepa'){nepaSlow=true;nepaTimer=8000;floatTexts.push({text:'NEPA SLOW!',x:p.x,y:p.y-20,life:60,size:18});}
      else{doubleShot=true;doubleTimer=10000;floatTexts.push({text:'2X SHOT!',x:p.x,y:p.y-20,life:60,size:18});}
      p.life=0;
    }
  });
  powerups=powerups.filter(p=>p.life>0);
}

function draw() {
  ctx.save();
  if(shakeFrames>0){
    const s=shakeFrames*0.5;
    ctx.translate(rnd(-s,s),rnd(-s,s));
  }

  if(state==='title'){
    drawTitle();
  } else if(state==='playing'||state==='paused'){
    drawBackground();
    drawSplats();

    // particles
    particles.forEach(p=>{
      ctx.save();
      ctx.globalAlpha=p.life/p.maxLife;
      ctx.fillStyle=p.color;
      glow(p.color,6);
      ctx.beginPath();ctx.arc(p.x,p.y,p.size,0,Math.PI*2);ctx.fill();
      noGlow();
      ctx.restore();
    });

    powerups.forEach(drawPowerup);
    mosquitoes.forEach(drawMosquito);
    bullets.forEach(drawBullet);
    drawPlayer();
    drawHUD();
    drawFloatTexts();

    if(state==='paused') drawPause();
  } else if(state==='gameover'){
    drawBackground();
    drawSplats();
    drawGameOver();
  }

  ctx.restore();
}

// ─── LOOP ─────────────────────────────────────────────────────────────────────
let rafId = 0;
let running = true;

function loop(ts) {
  if (!running) return;
  const dt = Math.min(ts-lastTime, 50);
  lastTime=ts;
  update(dt);
  draw();
  rafId = requestAnimationFrame(loop);
}

// The first frame only seeds `lastTime`; without it the initial dt
// would be the entire time since page load.
rafId = requestAnimationFrame(ts => {
  lastTime = ts;
  if (running) rafId = requestAnimationFrame(loop);
});

return {
  destroy() {
    running = false;
    cancelAnimationFrame(rafId);
    listeners.forEach(([target, type, handler]) =>
      target.removeEventListener(type, handler)
    );
    listeners.length = 0;
  },
};

} // end createGame
