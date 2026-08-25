/**
 * Jollof Color Mismatch: Naija vs Ghana
 * ---------------------------------------------------------------
 * Ported from the original single-file HTML build. Game logic is
 * unchanged. What's new is a real lifecycle:
 *
 *   - the rAF loop is cancellable, so unmounting stops it;
 *   - the 1-second countdown interval is tracked and cleared on
 *     destroy, instead of outliving the component;
 *   - every listener is registered through `on()` for teardown;
 *   - name-entry keystrokes are captured on the canvas rather than
 *     the document. The original swallowed EVERY printable key
 *     while the name prompt was open, which on a full page would
 *     eat the visitor's typing anywhere else.
 *
 * Pointer coordinates were already mapped correctly in the source
 * (`* (800 / rect.width)`), so they are left as they were.
 *
 * @param {HTMLCanvasElement} canvas
 * @returns {{ destroy: () => void }}
 */
export function createGame(canvas) {
const ctx = canvas.getContext('2d');

/** Listener registry, drained by destroy(). */
const listeners = [];
const on = (target, type, handler) => {
  target.addEventListener(type, handler);
  listeners.push([target, type, handler]);
};

/** Loop handle and run flag, both read by destroy(). */
let rafId = 0;
let running = true;

// Canvas display faces. The original pulled "Fredoka One" from
// Google Fonts; the self-hosted equivalent (@fontsource/fredoka)
// ships the family as "Fredoka", whose 600 weight matches the
// original's heft. See src/games/gameFonts.js.
const gameFont = 'Fredoka, cursive';
const titleFont = 'Bangers, cursive';

// Game States
const STATE = { TITLE: 0, PLAYING: 1, GAMEOVER: 2 };
let state = STATE.TITLE;

// Grid
const COLS = 5, ROWS = 5;
const TILE_SIZE = 90;
const GRID_X = (800 - COLS * TILE_SIZE - (COLS-1)*6) / 2;
const GRID_Y = 165;
const GAP = 6;

// Game Data
let grid = [];
let targetColor = null;
let score = 0;
let combo = 1;
let timeLeft = 60;
let timerInterval = null;
let particles = [];
let ripples = [];
let feedbackMsg = null;
let feedbackTimer = 0;
let steamOffset = 0;
let titlePulse = 0;
let targetPulse = 0;
let highscores = JSON.parse(localStorage.getItem('jollofHighscores') || '[]');
let shakeTimer = 0;
let shakeX = 0;
let comboParticles = [];
let lastClickedRow = -1;
let rowExplodeTimer = 0;
let rowExplodeRow = -1;
let playerName = '';
let inputActive = false;
let nameSubmitted = false;
let finalScore = 0;

function randomJollofColor(isTarget = false) {
  if (isTarget) {
    // Naija hot orange
    const h = 15 + Math.random() * 8;
    const s = 85 + Math.random() * 10;
    const l = 45 + Math.random() * 8;
    return { h, s, l };
  } else {
    const h = 10 + Math.random() * 35;
    const s = 65 + Math.random() * 35;
    const l = 30 + Math.random() * 32;
    return { h, s, l };
  }
}

function colorToHSL(c) {
  return `hsl(${c.h},${c.s}%,${c.l}%)`;
}

function colorDiff(a, b) {
  return Math.abs(a.h - b.h) + Math.abs(a.s - b.s) * 0.3 + Math.abs(a.l - b.l) * 0.5;
}

function isMatch(tileColor) {
  return colorDiff(tileColor, targetColor) < 22;
}

function initGrid() {
  grid = [];
  for (let r = 0; r < ROWS; r++) {
    grid[r] = [];
    for (let c = 0; c < COLS; c++) {
      grid[r][c] = { color: randomJollofColor(), exploding: false, opacity: 1 };
    }
  }
  // Ensure at least 1 match per row
  for (let r = 0; r < ROWS; r++) {
    const c = Math.floor(Math.random() * COLS);
    const h = targetColor.h + (Math.random()*8-4);
    const s = targetColor.s + (Math.random()*8-4);
    const l = targetColor.l + (Math.random()*6-3);
    grid[r][c].color = { h, s, l };
  }
}

function startGame() {
  score = 0;
  combo = 1;
  timeLeft = 60;
  particles = [];
  ripples = [];
  comboParticles = [];
  feedbackMsg = null;
  shakeTimer = 0;
  rowExplodeRow = -1;
  targetColor = randomJollofColor(true);
  initGrid();
  state = STATE.PLAYING;
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (state === STATE.PLAYING) {
      timeLeft -= 1;
      if (timeLeft <= 0) {
        timeLeft = 0;
        endGame();
      }
    }
  }, 1000);
}

function endGame() {
  clearInterval(timerInterval);
  finalScore = score;
  state = STATE.GAMEOVER;
  playerName = '';
  inputActive = true;
  nameSubmitted = false;
}

function saveScore(name) {
  highscores.push({ name: name || 'Anon', score: finalScore });
  highscores.sort((a, b) => b.score - a.score);
  highscores = highscores.slice(0, 3);
  localStorage.setItem('jollofHighscores', JSON.stringify(highscores));
  nameSubmitted = true;
  inputActive = false;
}

function spawnParticles(x, y, count, color) {
  for (let i = 0; i < count; i++) {
    particles.push({
      x, y,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.9) * 9,
      life: 1,
      size: 3 + Math.random() * 6,
      color,
      type: 'fire'
    });
  }
}

function spawnComboText(x, y, text) {
  comboParticles.push({ x, y, text, life: 1.5, timer: 1.5 });
}

function addRipple(x, y) {
  ripples.push({ x, y, r: 0, maxR: 60, life: 1 });
}

function explodeRow(row) {
  rowExplodeRow = row;
  rowExplodeTimer = 1;
  for (let c = 0; c < COLS; c++) {
    const tx = GRID_X + c * (TILE_SIZE + GAP) + TILE_SIZE / 2;
    const ty = GRID_Y + row * (TILE_SIZE + GAP) + TILE_SIZE / 2;
    spawnParticles(tx, ty, 12, '#FF4500');
    spawnParticles(tx, ty, 6, '#FFD700');
  }
  setTimeout(() => {
    if (grid[row]) {
      for (let c = 0; c < COLS; c++) {
        grid[row][c].color = randomJollofColor();
        // Chance to plant a match
        if (Math.random() < 0.3) {
          const h = targetColor.h + (Math.random()*8-4);
          const s = targetColor.s + (Math.random()*6-3);
          const l = targetColor.l + (Math.random()*6-3);
          grid[row][c].color = { h, s, l };
        }
      }
    }
    rowExplodeRow = -1;
  }, 400);
}

on(canvas, 'click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const mx = (e.clientX - rect.left) * (800 / rect.width);
  const my = (e.clientY - rect.top) * (600 / rect.height);

  if (state === STATE.TITLE) {
    // Play button
    if (mx > 280 && mx < 520 && my > 340 && my < 410) {
      startGame();
    }
    return;
  }

  if (state === STATE.GAMEOVER) {
    // Restart button
    if (!inputActive && mx > 260 && mx < 540 && my > 490 && my < 545) {
      startGame();
    }
    // Submit name
    if (inputActive && mx > 270 && mx < 530 && my > 430 && my < 475) {
      saveScore(playerName);
    }
    return;
  }

  if (state === STATE.PLAYING) {
    // Check grid click
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const tx = GRID_X + c * (TILE_SIZE + GAP);
        const ty = GRID_Y + r * (TILE_SIZE + GAP);
        if (mx >= tx && mx <= tx + TILE_SIZE && my >= ty && my <= ty + TILE_SIZE) {
          addRipple(mx, my);
          const tile = grid[r][c];
          if (isMatch(tile.color)) {
            // Check whole row for matches
            let rowMatches = 0;
            for (let cc = 0; cc < COLS; cc++) {
              if (isMatch(grid[r][cc].color)) rowMatches++;
            }
            const pts = 10 * combo * rowMatches;
            score += pts;
            combo = Math.min(combo + 1, 10);
            spawnComboText(tx + TILE_SIZE / 2, ty, `+${pts}`);
            feedbackMsg = { text: '🔥 NAIJA WINS!', color: '#00FF44', row: r };
            feedbackTimer = 1.5;
            explodeRow(r);
            // New target occasionally
            if (Math.random() < 0.35) {
              targetColor = randomJollofColor(true);
            }
            // Speed up: reduce time gain but increase score speed
            if (score % 50 === 0) timeLeft = Math.min(timeLeft + 3, 60);
          } else {
            // Miss
            combo = 1;
            timeLeft = Math.max(timeLeft - 4, 0);
            feedbackMsg = { text: '💀 Ghana Stole It!', color: '#FF3300', row: r };
            feedbackTimer = 1.2;
            shakeTimer = 0.4;
          }
          return;
        }
      }
    }
  }
});

// Keyboard input for name entry.
// Bound to the canvas, not the document: this handler consumes any
// single printable character, so at document level it would steal
// keystrokes from the rest of the page whenever the name prompt was
// open. preventDefault stops Backspace and Space from scrolling or
// navigating while the player is typing.
on(canvas, 'keydown', (e) => {
  if (state === STATE.GAMEOVER && inputActive) {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveScore(playerName);
    } else if (e.key === 'Backspace') {
      e.preventDefault();
      playerName = playerName.slice(0, -1);
    } else if (e.key.length === 1 && playerName.length < 12) {
      e.preventDefault();
      playerName += e.key;
    }
  }
});

// Drawing helpers
function drawRoundRect(x, y, w, h, r, fill, stroke, lineWidth = 2) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lineWidth; ctx.stroke(); }
}

function drawBackground() {
  // Wooden table gradient
  const grad = ctx.createLinearGradient(0, 0, 0, 600);
  grad.addColorStop(0, '#3d1a00');
  grad.addColorStop(0.4, '#6b2e00');
  grad.addColorStop(1, '#1a0800');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 800, 600);

  // Wood grain lines
  ctx.strokeStyle = 'rgba(255,140,0,0.06)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 20; i++) {
    ctx.beginPath();
    ctx.moveTo(0, 200 + i * 22 + Math.sin(i * 0.7) * 10);
    ctx.lineTo(800, 200 + i * 22 + Math.cos(i * 0.5) * 10);
    ctx.stroke();
  }

  // Naija flag watermark
  ctx.save();
  ctx.globalAlpha = 0.04;
  ctx.fillStyle = '#008751';
  ctx.fillRect(100, 150, 80, 300);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(180, 150, 240, 300);
  ctx.fillStyle = '#008751';
  ctx.fillRect(420, 150, 80, 300);
  ctx.restore();

  // Steam rising
  steamOffset = (steamOffset + 0.3) % 100;
  ctx.save();
  ctx.globalAlpha = 0.07;
  for (let i = 0; i < 6; i++) {
    const sx = 100 + i * 120;
    const sy = 580;
    ctx.beginPath();
    for (let t = 0; t < 80; t++) {
      const x = sx + Math.sin((t * 0.15) + i + steamOffset * 0.05) * 18;
      const y = sy - t - steamOffset;
      if (t === 0) ctx.moveTo(x, y % 600);
      else ctx.lineTo(x, y % 600);
    }
    ctx.strokeStyle = `hsl(${20 + i * 10}, 80%, 70%)`;
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.stroke();
  }
  ctx.restore();
}

function drawTitle() {
  titlePulse += 0.05;

  // Title text with fire glow
  ctx.save();
  ctx.shadowBlur = 30 + Math.sin(titlePulse) * 10;
  ctx.shadowColor = '#FF4500';
  ctx.fillStyle = '#FF8C00';
  ctx.font = `bold 62px Bangers, cursive`;
  ctx.textAlign = 'center';
  ctx.fillText('JOLLOF COLOR MISMATCH', 400, 120);
  ctx.fillStyle = '#FFD700';
  ctx.font = `bold 58px Bangers, cursive`;
  ctx.fillText('JOLLOF COLOR MISMATCH', 400, 118);
  ctx.restore();

  ctx.fillStyle = '#FFE0A0';
  ctx.font = `22px ${gameFont}`;
  ctx.textAlign = 'center';
  ctx.fillText('Naija vs Ghana Jollof Clash 🇳🇬🔥', 400, 160);
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font = `16px ${gameFont}`;
  ctx.fillText('Prove Naija Jollof Hottest! @akcodex1', 400, 190);

  // Preview jollof tiles
  for (let i = 0; i < 7; i++) {
    const h = 10 + i * 6;
    const x = 80 + i * 95;
    const s = 80 + Math.sin(titlePulse + i) * 10;
    const l = 38 + Math.sin(titlePulse * 0.7 + i) * 8;
    drawRoundRect(x, 220, 80, 80, 10, `hsl(${h},${s}%,${l}%)`, '#FF4500', 3);
  }

  // Rice texture suggestion
  ctx.save();
  ctx.globalAlpha = 0.12;
  for (let i = 0; i < 7; i++) {
    const x = 80 + i * 95;
    for (let j = 0; j < 30; j++) {
      const rx = x + Math.random() * 70 + 5;
      const ry = 225 + Math.random() * 68;
      ctx.fillStyle = `rgba(255,220,150,0.8)`;
      ctx.save();
      ctx.translate(rx, ry);
      ctx.rotate(Math.random() * Math.PI);
      ctx.fillRect(-5, -1.5, 10, 3);
      ctx.restore();
    }
  }
  ctx.restore();

  // Play button
  const bx = 280, by = 330, bw = 240, bh = 65;
  const btnGrad = ctx.createLinearGradient(bx, by, bx, by + bh);
  btnGrad.addColorStop(0, '#FF4500');
  btnGrad.addColorStop(1, '#CC2200');
  ctx.save();
  ctx.shadowBlur = 20 + Math.sin(titlePulse * 2) * 8;
  ctx.shadowColor = '#FF4500';
  drawRoundRect(bx, by, bw, bh, 14, btnGrad, '#FFD700', 3);
  ctx.restore();
  ctx.fillStyle = '#FFD700';
  ctx.font = `bold 32px Bangers, cursive`;
  ctx.textAlign = 'center';
  ctx.fillText("🍚 START COOKIN'! 🍚", 400, 374);

  // Instructions
  ctx.fillStyle = 'rgba(255,220,150,0.7)';
  ctx.font = `15px ${gameFont}`;
  ctx.fillText('Click tiles matching the Target Color • Clear rows for Naija Win!', 400, 430);
  ctx.fillText('Miss = time penalty ⏱️ | Combos = more points 🔥', 400, 455);
}

function drawCircularTimer() {
  const cx = 700, cy = 80, r = 42;
  const pct = Math.max(timeLeft / 60, 0);
  const angle = -Math.PI / 2;

  // BG circle
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fill();
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 6;
  ctx.stroke();

  // Progress arc
  const col = timeLeft > 20 ? '#FF8C00' : '#FF0000';
  ctx.save();
  if (timeLeft <= 10) {
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#FF0000';
  }
  ctx.beginPath();
  ctx.arc(cx, cy, r, angle, angle + pct * Math.PI * 2);
  ctx.strokeStyle = col;
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = '#FFD700';
  ctx.font = `bold 14px ${gameFont}`;
  ctx.textAlign = 'center';
  ctx.fillText('TIME', cx, cy - 8);
  ctx.font = `bold 20px ${gameFont}`;
  ctx.fillText(`${timeLeft}s`, cx, cy + 14);
}

function drawTargetColor() {
  targetPulse += 0.06;
  const cx = 400, cy = 72;
  const pulseR = 38 + Math.sin(targetPulse) * 4;

  ctx.save();
  ctx.shadowBlur = 25 + Math.sin(targetPulse) * 10;
  ctx.shadowColor = colorToHSL(targetColor);
  ctx.beginPath();
  ctx.arc(cx, cy, pulseR, 0, Math.PI * 2);
  ctx.fillStyle = colorToHSL(targetColor);
  ctx.fill();
  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = '#FFE0A0';
  ctx.font = `16px ${gameFont}`;
  ctx.textAlign = 'left';
  ctx.fillText('Target Color:', 270, 68);
  ctx.fillStyle = 'rgba(255,220,150,0.85)';
  ctx.font = `14px ${gameFont}`;
  ctx.textAlign = 'center';
  ctx.fillText('🔥 Match This Heat! 🔥', 400, 122);
}

function drawScoreCombo() {
  ctx.save();
  ctx.shadowBlur = 10;
  ctx.shadowColor = '#FFD700';
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `bold 28px ${gameFont}`;
  ctx.textAlign = 'left';
  ctx.fillText(`SCORE: ${score}`, 20, 60);

  const comboColor = combo >= 5 ? '#FF4500' : combo >= 3 ? '#FFD700' : '#AAFFAA';
  ctx.fillStyle = comboColor;
  ctx.font = `bold 22px ${gameFont}`;
  ctx.fillText(`COMBO: x${combo}`, 20, 92);
  ctx.restore();

  // Fire particles for high combo
  if (combo >= 3 && Math.random() < 0.3) {
    spawnParticles(20 + Math.random() * 120, 90, 2, '#FF4500');
  }
}

function drawGrid() {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const tx = GRID_X + c * (TILE_SIZE + GAP);
      const ty = GRID_Y + r * (TILE_SIZE + GAP);
      const tile = grid[r][c];
      const exploding = r === rowExplodeRow;

      ctx.save();
      if (exploding) {
        ctx.globalAlpha = 0.3 + Math.random() * 0.5;
        ctx.translate(tx + TILE_SIZE/2, ty + TILE_SIZE/2);
        ctx.rotate((Math.random()-0.5) * 0.3);
        ctx.translate(-TILE_SIZE/2, -TILE_SIZE/2);
        tx; // stay
      }

      const tileColor = colorToHSL(tile.color);
      // Slight glow on hover simulation (draw brighter edge)
      drawRoundRect(exploding ? 0 : tx, exploding ? 0 : ty, TILE_SIZE, TILE_SIZE, 10, tileColor, '#000', 2);

      // Rice grain texture
      ctx.globalAlpha = (exploding ? 0.05 : 0.15);
      for (let j = 0; j < 20; j++) {
        const rx = (exploding ? 0 : tx) + Math.random() * (TILE_SIZE - 10) + 5;
        const ry = (exploding ? 0 : ty) + Math.random() * (TILE_SIZE - 10) + 5;
        ctx.fillStyle = `rgba(255,240,180,0.9)`;
        ctx.save();
        ctx.translate(rx, ry);
        ctx.rotate(Math.random() * Math.PI);
        ctx.fillRect(-5, -1.5, 10, 3);
        ctx.restore();
      }
      ctx.globalAlpha = 1;

      // Match indicator glow
      if (isMatch(tile.color) && !exploding) {
        ctx.save();
        ctx.globalAlpha = 0.3 + Math.sin(Date.now() * 0.005) * 0.2;
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 4;
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#FFD700';
        ctx.beginPath();
        ctx.roundRect(tx + 2, ty + 2, TILE_SIZE - 4, TILE_SIZE - 4, 8);
        ctx.stroke();
        ctx.restore();
      }

      ctx.restore();
    }
  }
}

function drawFeedback() {
  if (!feedbackMsg || feedbackTimer <= 0) return;
  const alpha = Math.min(feedbackTimer, 1);
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.font = `bold 34px ${gameFont}`;
  ctx.textAlign = 'center';
  ctx.shadowBlur = 20;
  ctx.shadowColor = feedbackMsg.color;
  ctx.fillStyle = feedbackMsg.color;
  ctx.fillText(feedbackMsg.text, 400, 140);
  ctx.restore();
}

function drawParticles(dt) {
  particles = particles.filter(p => p.life > 0);
  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.25; // gravity
    p.life -= dt * 1.5;
    ctx.save();
    ctx.globalAlpha = Math.max(p.life, 0);
    ctx.fillStyle = p.color;
    ctx.shadowBlur = 10;
    ctx.shadowColor = p.color;
    const radius = Math.max(p.size * p.life, 0);
    ctx.beginPath();
    ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function drawRipples(dt) {
  ripples = ripples.filter(r => r.life > 0);
  for (const r of ripples) {
    r.r += 3;
    r.life -= dt * 2;
    ctx.save();
    ctx.globalAlpha = r.life * 0.5;
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}

function drawComboParticles(dt) {
  comboParticles = comboParticles.filter(p => p.timer > 0);
  for (const p of comboParticles) {
    p.timer -= dt;
    p.y -= 1.2;
    const alpha = Math.min(p.timer / p.life, 1);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#FFD700';
    ctx.font = `bold 24px ${gameFont}`;
    ctx.textAlign = 'center';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#FF4500';
    ctx.fillText(p.text, p.x, p.y);
    ctx.restore();
  }
}

function drawGameOver() {
  // Overlay
  ctx.fillStyle = 'rgba(0,0,0,0.75)';
  ctx.fillRect(0, 0, 800, 600);

  ctx.save();
  ctx.shadowBlur = 30;
  ctx.shadowColor = '#FF4500';
  ctx.fillStyle = '#FF8C00';
  ctx.font = `bold 70px Bangers, cursive`;
  ctx.textAlign = 'center';
  ctx.fillText('JOLLOF COLD! 🍚❄️', 400, 130);
  ctx.restore();

  ctx.fillStyle = '#FFD700';
  ctx.font = `bold 36px ${gameFont}`;
  ctx.textAlign = 'center';
  ctx.fillText(`Final Score: ${finalScore}`, 400, 195);

  // Highscores bar chart
  ctx.fillStyle = '#FFE0A0';
  ctx.font = `bold 20px ${gameFont}`;
  ctx.textAlign = 'center';
  ctx.fillText('🏆 Top Jollof Masters 🏆', 400, 235);

  const barColors = ['#FFD700', '#C0C0C0', '#CD7F32'];
  const maxScore = Math.max(...highscores.map(h => h.score), 1);
  highscores.forEach((hs, i) => {
    const bx = 130 + i * 185;
    const barH = Math.max((hs.score / maxScore) * 100, 8);
    const by = 370 - barH;
    ctx.fillStyle = barColors[i] || '#FF8C00';
    ctx.fillRect(bx, by, 120, barH);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(bx, by, 120, barH);
    ctx.fillStyle = '#FFF';
    ctx.font = `14px ${gameFont}`;
    ctx.textAlign = 'center';
    ctx.fillText(hs.name, bx + 60, 390);
    ctx.fillText(hs.score, bx + 60, by - 6);
  });

  // Name input
  if (!nameSubmitted) {
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    drawRoundRect(200, 405, 400, 50, 10, 'rgba(0,0,0,0.5)', '#FFD700', 2);
    ctx.fillStyle = '#FFE0A0';
    ctx.font = `18px ${gameFont}`;
    ctx.textAlign = 'center';
    ctx.fillText(playerName.length > 0 ? playerName + '|' : 'Enter your name...', 400, 436);

    const btnGrad = ctx.createLinearGradient(270, 445, 270, 490);
    btnGrad.addColorStop(0, '#FF4500');
    btnGrad.addColorStop(1, '#CC2200');
    drawRoundRect(270, 445, 260, 45, 10, btnGrad, '#FFD700', 2);
    ctx.fillStyle = '#FFD700';
    ctx.font = `bold 22px Bangers, cursive`;
    ctx.textAlign = 'center';
    ctx.fillText('SAVE SCORE', 400, 475);
  } else {
    // Restart
    const btnGrad = ctx.createLinearGradient(260, 490, 260, 545);
    btnGrad.addColorStop(0, '#008751');
    btnGrad.addColorStop(1, '#005530');
    drawRoundRect(260, 490, 280, 55, 12, btnGrad, '#FFD700', 3);
    ctx.fillStyle = '#FFD700';
    ctx.font = `bold 28px Bangers, cursive`;
    ctx.textAlign = 'center';
    ctx.fillText('🍚 COOK AGAIN! 🍚', 400, 524);
  }
}

let lastTime = 0;
function gameLoop(ts) {
  const dt = Math.min((ts - lastTime) / 1000, 0.1);
  lastTime = ts;

  // Shake
  if (shakeTimer > 0) {
    shakeTimer -= dt;
    shakeX = (Math.random() - 0.5) * 10 * shakeTimer;
  } else {
    shakeX = 0;
  }

  ctx.save();
  ctx.translate(shakeX, 0);

  drawBackground();

  if (state === STATE.TITLE) {
    drawTitle();
  } else if (state === STATE.PLAYING) {
    drawGrid();
    drawTargetColor();
    drawScoreCombo();
    drawCircularTimer();
    drawFeedback();
    drawParticles(dt);
    drawRipples(dt);
    drawComboParticles(dt);

    if (feedbackTimer > 0) feedbackTimer -= dt;
  } else if (state === STATE.GAMEOVER) {
    drawGrid();
    drawGameOver();
  }

  ctx.restore();
  if (running) rafId = requestAnimationFrame(gameLoop);
}

// The original registered a mousemove handler here that computed
// coordinates and discarded them ("redraw handles the glow
// naturally"). It did nothing, so it is not carried over.

// The loop reassigns rafId on every frame; see the `gameLoop`
// tail above.
rafId = requestAnimationFrame(gameLoop);

return {
  destroy() {
    running = false;
    cancelAnimationFrame(rafId);
    // The countdown is a setInterval, not part of the rAF loop, so
    // cancelling the loop alone would leave it ticking forever.
    clearInterval(timerInterval);
    listeners.forEach(([target, type, handler]) =>
      target.removeEventListener(type, handler)
    );
    listeners.length = 0;
  },
};

} // end createGame
