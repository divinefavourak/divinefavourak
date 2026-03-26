import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const rnd = (r) => Array.isArray(r) ? r[0] + Math.random() * (r[1] - r[0]) : Math.random() * r;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const distortionFns = {
  turbulentDistortion: (p) => ({
    x: Math.sin(p * 2.5 * Math.PI * 2) * 0.5,
    y: Math.sin(p * 1.5 * Math.PI * 2 + Math.PI / 2) * 0.15,
  }),
  mountainDistortion: (p) => ({
    x: 0,
    y: Math.sin(p * Math.PI * 4) * 0.4,
  }),
  xyDistortion: (p) => ({
    x: Math.cos(p * Math.PI * 4) * 0.3,
    y: Math.sin(p * Math.PI * 6) * 0.15,
  }),
  LongRaceDistortion: (p) => ({
    x: Math.sin(p * Math.PI) * 0.5,
    y: 0,
  }),
  deepDistortion: (p) => ({
    x: Math.sin(p * Math.PI * 2) * 0.45,
    y: -(p * p) * 0.5,
  }),
};

const roadVert = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const roadFrag = `
  uniform float uTime;
  uniform float uLanes;
  uniform vec3 uRoadColor;
  uniform vec3 uLineColor;
  uniform float uBrokenPct;
  varying vec2 vUv;
  void main() {
    float x = vUv.x;
    float y = mod(vUv.y - uTime * 0.12, 1.0);
    float lanes = uLanes;
    float laneW = 1.0 / lanes;
    float shoulderW = 0.045;
    float lineW = 0.025;
    bool shoulder = x < shoulderW || x > 1.0 - shoulderW;
    float lx = mod(x, laneW);
    bool laneLine = lx < lineW * laneW && !shoulder;
    bool dashOn = mod(y * 8.0, 1.0) < uBrokenPct;
    vec3 col = uRoadColor;
    if (shoulder) col = uLineColor;
    else if (laneLine && dashOn) col = uLineColor;
    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function Hyperspeed({ preset, style, className }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !preset) return;

    const {
      length, roadWidth, islandWidth, lanesPerRoad,
      fov, speedUp, carLightsFade,
      totalSideLightSticks, lightPairsPerRoadWay,
      lightStickWidth, lightStickHeight,
      movingAwaySpeed, movingCloserSpeed,
      carLightsLength,
      carWidthPercentage, carShiftX, carFloorSeparation,
      brokenLinesLengthPercentage,
      colors, distortion: distType,
    } = preset;

    const distFn = distortionFns[distType] || distortionFns.turbulentDistortion;
    const totalW = roadWidth * 2 + islandWidth;

    // ── Renderer ──────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(el.clientWidth, el.clientHeight);
    el.appendChild(renderer.domElement);

    // ── Scene ─────────────────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(colors.background);
    scene.fog = new THREE.Fog(colors.background, length * 0.2, length * 0.85);

    // ── Camera ────────────────────────────────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(fov, el.clientWidth / el.clientHeight, 0.1, length * 2);
    camera.position.set(0, 4, 0);
    camera.rotation.x = -0.06;

    // ── Roads ─────────────────────────────────────────────────────────────────
    const mats = [];
    const makeRoad = (cx) => {
      const geo = new THREE.PlaneGeometry(roadWidth, length, 1, 200);
      geo.rotateX(-Math.PI / 2);
      const mat = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uLanes: { value: lanesPerRoad },
          uRoadColor: { value: new THREE.Color(colors.roadColor) },
          uLineColor: { value: new THREE.Color(colors.shoulderLines) },
          uBrokenPct: { value: brokenLinesLengthPercentage },
        },
        vertexShader: roadVert,
        fragmentShader: roadFrag,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(cx, 0, -length / 2);
      scene.add(mesh);
      mats.push(mat);
      return mat;
    };

    const leftX = -(islandWidth / 2 + roadWidth / 2);
    const rightX = islandWidth / 2 + roadWidth / 2;
    makeRoad(leftX);
    makeRoad(rightX);

    // Island
    const iGeo = new THREE.PlaneGeometry(islandWidth, length);
    iGeo.rotateX(-Math.PI / 2);
    const island = new THREE.Mesh(iGeo, new THREE.MeshBasicMaterial({ color: colors.islandColor }));
    island.position.set(0, 0, -length / 2);
    scene.add(island);

    // ── Car Lights ────────────────────────────────────────────────────────────
    const cars = [];

    const addCars = (isLeft) => {
      const colorList = isLeft ? colors.leftCars : colors.rightCars;
      const speedRange = isLeft ? movingAwaySpeed : movingCloserSpeed;
      const roadX = isLeft ? leftX : rightX;
      const laneW = roadWidth / lanesPerRoad;
      const sideSign = isLeft ? -1 : 1;

      for (let i = 0; i < lightPairsPerRoadWay; i++) {
        const lane = Math.floor(Math.random() * lanesPerRoad);
        const lc = roadX + sideSign * (-roadWidth / 2 + (lane + 0.5) * laneW);
        const hw = rnd(carWidthPercentage) * laneW * 0.4;
        const sx = rnd(carShiftX);
        const fy = rnd(carFloorSeparation);
        const ll = rnd(carLightsLength);
        const speed = rnd(speedRange);
        const col = new THREE.Color(pick(colorList));

        for (const lx of [lc + sx - hw, lc + sx + hw]) {
          const pts = [new THREE.Vector3(lx, fy, 0), new THREE.Vector3(lx, fy, -ll)];
          const geo = new THREE.BufferGeometry().setFromPoints(pts);
          const mat = new THREE.LineBasicMaterial({
            color: col,
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          });
          const line = new THREE.Line(geo, mat);
          line.position.z = -Math.random() * length;
          scene.add(line);
          cars.push({ line, speed, isLeft });
        }
      }
    };

    addCars(true);
    addCars(false);

    // ── Light Sticks ──────────────────────────────────────────────────────────
    const sticks = [];
    const stickGap = length / totalSideLightSticks;

    for (let i = 0; i < totalSideLightSticks; i++) {
      const sw = rnd(lightStickWidth);
      const sh = rnd(lightStickHeight);
      for (const sx of [-(totalW / 2 + 1.5), totalW / 2 + 1.5]) {
        const geo = new THREE.PlaneGeometry(sw, sh);
        const mat = new THREE.MeshBasicMaterial({
          color: colors.sticks,
          transparent: true,
          opacity: 0.85,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          side: THREE.DoubleSide,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(sx, sh / 2, -i * stickGap);
        scene.add(mesh);
        sticks.push({ mesh, mat, baseZ: -i * stickGap });
      }
    }

    // ── Animation Loop ────────────────────────────────────────────────────────
    let raf;
    const clock = new THREE.Clock();
    let elapsed = 0;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(clock.getDelta(), 0.05);
      elapsed += dt;

      // Scroll road markings
      for (const mat of mats) mat.uniforms.uTime.value = elapsed * speedUp;

      // Move car lights
      for (const car of cars) {
        car.line.position.z -= car.speed * dt;
        if (car.isLeft && car.line.position.z < -length) car.line.position.z = 0;
        if (!car.isLeft && car.line.position.z > 0) car.line.position.z = -length;
        const prog = Math.abs(car.line.position.z) / length;
        const fade = car.isLeft ? prog : 1 - prog;
        car.line.material.opacity = Math.max(0, 0.9 - fade * carLightsFade * 2);
      }

      // Scroll light sticks toward camera
      for (const s of sticks) {
        const dz = (elapsed * speedUp * 80) % length;
        const z = ((s.baseZ + dz) % length);
        s.mesh.position.z = z > 0 ? z - length : z;
        s.mesh.lookAt(camera.position);
        const prog = Math.abs(s.mesh.position.z) / length;
        s.mat.opacity = Math.max(0, 0.85 - prog * 0.9);
      }

      // Subtle camera sway from distortion
      const p = (elapsed * speedUp * 0.04) % 1;
      const d = distFn(p);
      camera.rotation.z = d.x * 0.015;
      camera.rotation.x = -0.06 + d.y * 0.02;

      renderer.render(scene, camera);
    };

    tick();

    // ── Resize ────────────────────────────────────────────────────────────────
    const onResize = () => {
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(el.clientWidth, el.clientHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      scene.traverse((obj) => {
        obj.geometry?.dispose();
        obj.material?.dispose();
      });
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, [preset]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ width: '100%', height: '100%', ...style }}
    />
  );
}
