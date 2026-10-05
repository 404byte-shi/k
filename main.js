import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

/* ---------- TEXT & CAMERAS (edit freely) ---------- */
const TXT = [
  ["01 · THE UNIVERSE","A LITTLE UNIVERSE","Find HER.","A brighter little universe made for the girl who turns distance into something beautiful.","Begin the journey ✦","Drag · pinch · tap Earth, Moon & Sun"],
  ["02 · INDIA","HOME, IN COLOUR","Her country is celebrating.","Every light on this map is glowing for one birthday, and one pin in Bihar is glowing brightest.","Zoom into Patna ✦","Tap the map for fireworks"],
  ["03 · PATNA","THE CITY OF LIGHTS","Patna knows it's your day.","The Ganga is full of lanterns, Gandhi Setu is lit, and every street is hung with flags just for you.","Climb Golghar ✦","Drag to look around · tap for fireworks"],
  ["04 · GOLGHAR","THE TOP OF THE WORLD","Happy Birthday, my Earth. ❤️","I'm the Moon: far away, but I never stop circling you.","Make a wish ✨","Tap for hearts"],
  ["05 · FOREVER","ONE LAST WISH","Distance is just space between two orbits.","Close your eyes, make a wish, and know I'm already on my way around to you.","Replay the universe ↺","Happy 20th ❤️"]
];
const CAM = [[[0,13,52],[0,0,0]],[[0,17,25],[0,-1,0]],[[0,34,60],[0,4,-20]],[[0,14,26],[0,8,0]],[[0,20,36],[0,13,0]]];
const SC = [0,1,2,2,2]; // which world each chapter lives in

/* ---------- BASICS ---------- */
const $ = s => document.querySelector(s), R = Math.random, TAU = Math.PI * 2, V = (x=0,y=0,z=0) => new THREE.Vector3(x,y,z);
const ease = t => t < .5 ? 4*t*t*t : 1 - (-2*t + 2) ** 3 / 2;
const low = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.hardwareConcurrency || 4) <= 4;
const el = {}; for (const k of ["app","chapter","eyebrow","title","description","action","back","hint","toast","emote","fade"]) el[k] = $("#" + k);
const story = $(".story");

const renderer = new THREE.WebGLRenderer({ antialias: !low, powerPreference: "high-performance" });
renderer.setPixelRatio(Math.min(devicePixelRatio, low ? 1 : 1.5));
renderer.setSize(innerWidth, innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.1;
el.app.appendChild(renderer.domElement);
const scene = new THREE.Scene(); scene.background = new THREE.Color(0x05030d);
const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, .1, 3000);
const controls = new OrbitControls(camera, renderer.domElement);
Object.assign(controls, { enableDamping: true, dampingFactor: .055, enablePan: false, rotateSpeed: .45, zoomSpeed: .65, minDistance: 3, maxDistance: 140, autoRotateSpeed: .6 });
const G = { space: new THREE.Group(), india: new THREE.Group(), city: new THREE.Group() };
scene.add(G.space, G.india, G.city, new THREE.HemisphereLight(0xffb4d8, 0x161326, 1.4));
const pl = (c, i, x, y, z, g) => { const l = new THREE.PointLight(c, i, 0, 2); l.position.set(x, y, z); g.add(l); return l; };

/* ---------- PROCEDURAL TEXTURES ---------- */
const tex = (w, h, fn) => { const c = document.createElement("canvas"); c.width = w; c.height = h; fn(c.getContext("2d"), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t; };
const hash = (x, y) => { const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return s - Math.floor(s); };
const noise = (x, y) => { const i = Math.floor(x), j = Math.floor(y), f = a => a*a*(3 - 2*a), a = f(x - i), b = f(y - j); return (hash(i,j)*(1-a) + hash(i+1,j)*a)*(1-b) + (hash(i,j+1)*(1-a) + hash(i+1,j+1)*a)*b; };
const fbm = (x, y) => { let s = 0, w = .5; for (let i = 0; i < 5; i++) { s += noise(x, y) * w; x *= 2; y *= 2; w /= 2; } return s; };
const surf = (f, w = 512, h = 256, sd = 0) => tex(w, h, c => {
  const d = c.createImageData(w, h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const a = x / w * TAU, v = y / h, n = fbm(Math.cos(a)*2 + 9 + sd, Math.sin(a)*2 + v*4 + sd); d.data.set([...f(n, v, a), 255], (y*w + x) * 4); }
  c.putImageData(d, 0, 0);
});
const dot = tex(64, 64, c => { const g = c.createRadialGradient(32,32,0,32,32,32); g.addColorStop(0,"#fff"); g.addColorStop(.3,"rgba(255,255,255,.6)"); g.addColorStop(1,"rgba(255,255,255,0)"); c.fillStyle = g; c.fillRect(0,0,64,64); });
const glow = (col, size, op = .5) => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: dot, color: col, transparent: true, opacity: op, blending: THREE.AdditiveBlending, depthWrite: false, fog: false })); s.scale.set(size, size, 1); return s; };
const emo = (ch, s) => { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex(128,128,c => { c.font = "96px serif"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(ch, 64, 70); }), transparent: true, depthWrite: false, fog: false })); sp.scale.set(s, s, 1); return sp; };
const label = (t, col = "#fff", w = 6) => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex(512,128,c => { c.font = "900 56px Inter,Arial"; c.fillStyle = col; c.textAlign = "center"; c.textBaseline = "middle"; c.shadowColor = "rgba(255,100,190,.9)"; c.shadowBlur = 20; c.fillText(t, 256, 64); }), transparent: true, depthWrite: false, fog: false })); s.scale.set(w, w / 4, 1); return s; };
const ring = (r, o = .14) => { const p = []; for (let i = 0; i <= 128; i++) p.push(V(Math.cos(i/128*TAU)*r, 0, Math.sin(i/128*TAU)*r)); return new THREE.Line(new THREE.BufferGeometry().setFromPoints(p), new THREE.LineBasicMaterial({ color: 0xffb4da, transparent: true, opacity: o })); };

const PAL = [0xff78bb,0xffd36e,0x86a7ff,0xffffff,0xff9933,0x7dffb2].map(c => new THREE.Color(c));
const TRI = ["#ff9933","#ffffff","#138808","#ff78bb"];
const pts = (p, c, size, extra = {}) => { const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(p, 3)); if (c) g.setAttribute("color", new THREE.BufferAttribute(c, 3)); const o = new THREE.Points(g, new THREE.PointsMaterial({ size, map: dot, vertexColors: !!c, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false, ...extra })); o.frustumCulled = false; return o; };
function floaters(n, [w, h, d], size, vy) {
  const p = new Float32Array(n*3), c = new Float32Array(n*3), ph = [];
  for (let i = 0; i < n; i++) { p.set([(R()-.5)*w, (R()-.5)*h, (R()-.5)*d], i*3); const k = PAL[i % 6]; c.set([k.r,k.g,k.b], i*3); ph.push(R()*TAU); }
  const o = pts(p, c, size);
  o.tick = (t, dt) => { for (let i = 0; i < n; i++) { p[i*3+1] += vy*dt; p[i*3] += Math.sin(t + ph[i])*dt*.6; if (p[i*3+1] > h/2) p[i*3+1] -= h; if (p[i*3+1] < -h/2) p[i*3+1] += h; } o.geometry.attributes.position.needsUpdate = true; };
  return o;
}

/* ---------- STARS & NEBULAE (shared by every world) ---------- */
{
  const N = low ? 1200 : 2800, p = new Float32Array(N*3), c = new Float32Array(N*3);
  for (let i = 0; i < N; i++) { const r = 200 + R()*600, a = R()*TAU, b = Math.acos(2*R()-1), k = .6 + R()*.4, t = R(); p.set([r*Math.sin(b)*Math.cos(a), r*Math.cos(b), r*Math.sin(b)*Math.sin(a)], i*3); c.set(t < .2 ? [k,.7*k,.9*k] : t < .4 ? [.7*k,.8*k,k] : [k,k,k], i*3); }
  scene.add(pts(p, c, 3.2));
  for (const [x, y, z, col, s, o] of [[-45,20,-70,"#ff3ca5",110,.2],[45,-10,-85,"#6e4bff",120,.18],[0,45,-120,"#ff91cd",100,.14],[-70,-30,-110,"#328cff",100,.1]]) { const g = glow(col, s, o); g.position.set(x, y, z); scene.add(g); }
}

/* ---------- FIREWORKS (one pooled particle system) ---------- */
const FN = low ? 900 : 2200, fp = new Float32Array(FN*3), fv = new Float32Array(FN*3), fc = new Float32Array(FN*3), fb = new Float32Array(FN*3), fl = new Float32Array(FN);
let fi = 0;
const sparks = pts(fp, fc, 1.0); scene.add(sparks);
const spawn = (p, vx, vy, vz, c, life) => { const i = fi++ % FN; fp.set([p.x,p.y,p.z], i*3); fv.set([vx,vy,vz], i*3); fb.set([c.r,c.g,c.b], i*3); fl[i] = life; };
function burst(p, col, n = 70, sp = 8) {
  const c = new THREE.Color(col ?? `hsl(${R()*360},100%,65%)`);
  for (let k = 0; k < n; k++) { const a = R()*TAU, b = Math.acos(2*R()-1), s = sp*(.4 + R()*.6); spawn(p, Math.sin(b)*Math.cos(a)*s, Math.cos(b)*s, Math.sin(b)*Math.sin(a)*s, c, 1 + R()*.7); }
}
function heart(p, col = "#ff4fa3", s = .45) { // heart-shaped burst that always faces the camera
  const c = new THREE.Color(col), r = V().setFromMatrixColumn(camera.matrixWorld, 0), u = V().setFromMatrixColumn(camera.matrixWorld, 1);
  for (let k = 0; k < 120; k++) { const a = k/120*TAU, x = 16*Math.sin(a)**3*s, y = (13*Math.cos(a) - 5*Math.cos(2*a) - 2*Math.cos(3*a) - Math.cos(4*a))*s; spawn(p, r.x*x + u.x*y, r.y*x + u.y*y, r.z*x + u.z*y, c, 1.8); }
}
function stepSparks(dt) {
  const drag = Math.pow(.35, dt);
  for (let i = 0; i < FN; i++) {
    if (fl[i] <= 0) { fc[i*3] = fc[i*3+1] = fc[i*3+2] = 0; continue; }
    fl[i] -= dt; fv[i*3+1] -= 3*dt;
    for (let k = 0; k < 3; k++) { fv[i*3+k] *= drag; fp[i*3+k] += fv[i*3+k]*dt; fc[i*3+k] = fb[i*3+k]*Math.min(1, fl[i]); }
  }
  sparks.geometry.attributes.position.needsUpdate = sparks.geometry.attributes.color.needsUpdate = true;
}

/* =========================================================
   WORLD 1 · SPACE — Sun, planets, Earth (HER) and Moon (ME)
========================================================= */
const S = G.space;
const sun = new THREE.Mesh(new THREE.SphereGeometry(5, 48, 32), new THREE.MeshBasicMaterial({ map: surf((n) => [255, 170 + n*80, 60 + n*80]) }));
sun.add(glow("#ffb060", 36, .8), glow("#ff78bb", 78, .3)); S.add(sun);
pl(0xffe0b0, 70, 0, 0, 0, S).decay = 1;

const bands = (k, c) => (n, v) => { const m = .78 + .22*Math.sin(v*k + n*6); return [c[0]*m, c[1]*m, c[2]*m]; };
const PL = [
  [.9, 10, .9, n => [110 + n*100, 105 + n*90, 100 + n*80]],
  [1.5, 15, .7, n => [225 + n*30, 175 + n*50, 110 + n*50]],
  [1.3, 33, .4, n => [170 + n*70, 70 + n*50, 40 + n*30]],
  [3.3, 44, .25, bands(38, [215,170,125])],
  [2.7, 58, .18, bands(30, [230,200,150])]
].map(([r, d, s, f], i) => {
  const m = new THREE.Mesh(new THREE.SphereGeometry(r, 32, 24), new THREE.MeshStandardMaterial({ map: surf(f, 256, 128), roughness: .9 }));
  if (i === 4) { const rg = new THREE.Mesh(new THREE.RingGeometry(3.6, 5.6, 64), new THREE.MeshBasicMaterial({ color: 0xe9c9a0, side: 2, transparent: true, opacity: .55 })); rg.rotation.x = 1.2; m.add(rg); }
  S.add(m, ring(d, .1)); return { m, d, s, a0: R()*TAU };
});

const earth = new THREE.Group(); S.add(earth, ring(24, .2));
const eM = new THREE.Mesh(new THREE.SphereGeometry(2.4, 64, 48), new THREE.MeshStandardMaterial({
  roughness: .75,
  map: surf((n, v) => (v < .07 || v > .93) ? [235,245,255] : n > .55 ? [60 + Math.min(1, (n-.55)*5)*90, 130 - Math.min(1, (n-.55)*5)*30, 70] : [10, 40 + n*60, 110 + n*90], low ? 512 : 1024, low ? 256 : 512)
}));
eM.rotation.z = .4;
const cloudT = surf(n => { const g = Math.max(0, Math.min(255, (n - .52)*700)); return [g,g,g]; }, 512, 256, 40);
const cl = new THREE.Mesh(new THREE.SphereGeometry(2.47, 48, 32), new THREE.MeshStandardMaterial({ map: cloudT, alphaMap: cloudT, transparent: true, depthWrite: false, roughness: 1 }));
const moon = new THREE.Mesh(new THREE.SphereGeometry(.65, 32, 24), new THREE.MeshStandardMaterial({
  roughness: 1,
  map: surf((n, v, a) => { const g = 165 + n*70 - (noise(Math.cos(a)*10 + 3, Math.sin(a)*10 + v*20) > .72 ? 55 : 0); return [g, g, g*.97]; }, 256, 128)
}));
const her = label("HER", "#ffd1ea", 4), me = label("ME", "#cfe0ff", 2.4); her.position.y = 4.3; me.position.y = 1.3; moon.add(me);
const mr = ring(4.8, .22); mr.rotation.x = .165;
earth.add(eM, cl, moon, her, mr, glow("#6aa8ff", 9, .55), glow("#ff78bb", 15, .22));
const orb = ["🎈","🎁","🎂","✨","💖","🎉","🎈","🎊","💫"].map(ch => { const s = emo(ch, 1.5); earth.add(s); return s; });
const conf = floaters(low ? 120 : 260, [130, 50, 130], .5, -.8); S.add(conf);
const earthPos = () => earth.getWorldPosition(V());

/* =========================================================
   WORLD 2 · INDIA — glowing tricolour map, Patna pin
========================================================= */
const I = G.india, mapG = new THREE.Group(); mapG.rotation.x = -1.05; mapG.position.y = -2; I.add(mapG);
const OUT = "74.5,37 77.8,35.5 79,34 78.8,32.5 80.2,30.8 81,30.2 80.1,28.8 82,27.6 84,27.3 86,26.6 88,26.4 88.1,27.8 92,27.8 96.5,28.3 95,26.3 94.4,24.3 93.2,22.6 92.2,24 90.5,25.2 89,25.3 88.5,24.2 89,22 87,21.5 86.8,20 85,19.2 82.3,16.7 80.2,15.5 80.3,13 79.8,10.3 78.2,8.9 77.5,8.1 76.5,9.5 75,12.5 74,15 72.8,19 72.7,21.2 70.5,20.8 68.8,22.4 68.2,23.7 71,24.4 70,27.5 72,29 74.5,31 74.2,32.8 73.8,34.5".split(" ").map(s => s.split(",").map(Number));
const mx = lon => (lon - 68) * 17.5, my = lat => (37.6 - lat) * 17.5;
const mapT = tex(530, 540, (c, w, h) => {
  const path = () => { c.beginPath(); OUT.forEach(([lo, la], i) => c[i ? "lineTo" : "moveTo"](mx(lo), my(la))); c.closePath(); };
  path(); c.save(); c.clip();
  [["#ff9933", 0], ["#f4f1ff", .36], ["#138808", .66]].forEach(([col, s], i, a) => { c.fillStyle = col; c.fillRect(0, h*s, w, h*((a[i+1]?.[1] ?? 1) - s) + 1); });
  c.fillStyle = "rgba(20,0,40,.35)"; c.fillRect(0, 0, w, h);
  for (let i = 0; i < 700; i++) { const x = R()*w, y = R()*h; if (c.isPointInPath(x, y)) { c.fillStyle = `rgba(255,${200 + R()*55|0},${120 + R()*90|0},${.5 + R()*.5})`; c.beginPath(); c.arc(x, y, .8 + R()*1.8, 0, TAU); c.fill(); } }
  c.strokeStyle = "#2a4bd7"; c.lineWidth = 2; c.beginPath(); c.arc(mx(79), my(21.5), 30, 0, TAU); c.stroke();
  for (let i = 0; i < 24; i++) { const a = i/24*TAU; c.moveTo(mx(79), my(21.5)); c.lineTo(mx(79) + Math.cos(a)*30, my(21.5) + Math.sin(a)*30); } c.stroke();
  c.restore(); path(); c.strokeStyle = "#ffb4da"; c.lineWidth = 3; c.shadowColor = "#ff78bb"; c.shadowBlur = 24; c.stroke();
});
mapG.add(new THREE.Mesh(new THREE.PlaneGeometry(30, 30.6), new THREE.MeshBasicMaterial({ map: mapT, transparent: true })));
const pin = new THREE.Group(); pin.position.set((mx(85.14)/530 - .5)*30, (.5 - my(25.6)/540)*30.6, .2);
const beam = new THREE.Mesh(new THREE.CylinderGeometry(.08, .35, 9, 12, 1, true), new THREE.MeshBasicMaterial({ color: 0xff78bb, transparent: true, opacity: .45, blending: THREE.AdditiveBlending, depthWrite: false, side: 2 }));
beam.rotation.x = Math.PI/2; beam.position.z = 4.5;
const pl2 = label("PATNA ❤", "#fff", 5); pl2.position.set(0, 1.4, 9.5);
pin.add(glow("#ff4fa3", 4, .9), glow("#fff", 1.5, 1), beam, pl2); mapG.add(pin);
const pinGlow = glow("#ff78bb", 60, .12); pinGlow.position.set(0, -3, -4); I.add(pinGlow);
const spark = floaters(low ? 60 : 140, [34, 16, 24], .35, 1.5); spark.position.y = 5; I.add(spark);

/* =========================================================
   WORLD 3 · PATNA — Golghar, Ganga, Gandhi Setu, lit-up city
========================================================= */
const C = G.city;
const gT = tex(1024, 1024, (c, w, h) => {
  c.fillStyle = "#0d0818"; c.fillRect(0, 0, w, h); c.fillStyle = "#1b1430";
  for (let i = 0; i < 8; i++) { c.fillRect(i*128 + 54, 0, 20, h); c.fillRect(0, i*128 + 54, w, 20); }
  c.fillStyle = "#ffd36e"; for (let i = 0; i < 8; i++) for (let k = 0; k < h; k += 32) { c.fillRect(i*128 + 63, k, 2, 14); c.fillRect(k, i*128 + 63, 14, 2); }
});
const ground = new THREE.Mesh(new THREE.PlaneGeometry(220, 220), new THREE.MeshStandardMaterial({ map: gT, emissiveMap: gT, emissive: 0xffffff, emissiveIntensity: .35, roughness: .9 }));
ground.rotation.x = -Math.PI/2; C.add(ground);

const winT = tex(128, 256, (c, w, h) => { c.fillStyle = "#17112b"; c.fillRect(0, 0, w, h); for (let y = 6; y < h; y += 16) for (let x = 6; x < w; x += 16) { c.fillStyle = R() < .6 ? ["#ffd98a","#ffb4da","#fff6e0","#9fc0ff"][R()*4|0] : "#2a2144"; c.fillRect(x, y, 8, 10); } });
const bld = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ map: winT, emissiveMap: winT, emissive: 0xffffff, emissiveIntensity: .8, roughness: .8 }), 330);
{
  const D = new THREE.Object3D(); let n = 0;
  for (let i = -3; i <= 3; i++) for (let j = -2; j <= 3; j++) {
    if (!i && !j) continue; const bx = i*27.5, bz = j*27.5, near = Math.abs(i) < 2 && Math.abs(j) < 2;
    for (let a = 0; a < 2; a++) for (let b = 0; b < 2; b++) {
      const w = 8 + R()*3, h = 2.5 + R()*(near ? 3 : 13); D.position.set(bx + (a - .5)*11.5, h/2, bz + (b - .5)*11.5); D.scale.set(w, h, w); D.updateMatrix();
      bld.setMatrixAt(n, D.matrix); bld.setColorAt(n++, new THREE.Color().setHSL(.75 + R()*.2, .4, .5));
    }
  }
  bld.count = n; C.add(bld);
}

const gol = new THREE.Group(), prof = [[0,0],[7,0],[6.9,1.2],[6.3,3.4],[5.2,5.8],[3.9,8],[2.5,9.8],[1.4,11],[1.3,11.6],[0,11.8]];
const rAt = y => { for (let i = 1; i < prof.length; i++) if (y <= prof[i][1]) { const [a, b] = [prof[i-1], prof[i]]; return a[0] + (b[0] - a[0])*(y - a[1])/(b[1] - a[1] || 1); } return 1.3; };
gol.add(new THREE.Mesh(new THREE.LatheGeometry(prof.map(p => new THREE.Vector2(...p)), 64), new THREE.MeshStandardMaterial({ color: 0xf4e4c8, roughness: .55, emissive: 0xff8fc8, emissiveIntensity: .18 })));
for (let k = 0; k < 2; k++) {
  const p = []; for (let i = 0; i <= 90; i++) { const y = .6 + i/90*10.2, a = i/90*TAU*1.4 + k*Math.PI, r = rAt(y) + .15; p.push(V(Math.cos(a)*r, y, Math.sin(a)*r)); }
  gol.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(p), 180, .13, 6), new THREE.MeshStandardMaterial({ color: 0xffc86b, emissive: 0xffa030, emissiveIntensity: .6 })));
}
const top = emo("❤️", 3); top.position.y = 14.5; const bday = label("HAPPY BIRTHDAY ❤", "#fff", 30); bday.position.y = 21;
const halo = new THREE.Mesh(new THREE.RingGeometry(8, 11, 64), new THREE.MeshBasicMaterial({ color: 0xff78bb, transparent: true, opacity: .35, blending: THREE.AdditiveBlending, side: 2, depthWrite: false })); halo.rotation.x = -Math.PI/2; halo.position.y = .08;
gol.add(top, bday, halo, glow("#ff9bd0", 30, .35)); C.add(gol);
const lightA = pl(0xff6fb8, 1500, 0, 22, 6, C), lightB = pl(0xffc070, 800, 0, 5, 22, C);

const flags = new THREE.InstancedMesh(new THREE.ConeGeometry(.5, 1.1, 3), new THREE.MeshBasicMaterial(), 420); let fn = 0;
const D2 = new THREE.Object3D(); D2.rotation.x = Math.PI;
function string(a, b, sag, n = 18) {
  const p = []; for (let i = 0; i <= n; i++) { const t = i/n, q = a.clone().lerp(b, t); q.y -= Math.sin(t*Math.PI)*sag; p.push(q); if (i < n && fn < 420) { D2.position.copy(q); D2.updateMatrix(); flags.setMatrixAt(fn, D2.matrix); flags.setColorAt(fn, PAL[fn++ % 6]); } }
  C.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(p), new THREE.LineBasicMaterial({ color: 0xffe6a8 })));
}
{
  const tops = [], apex = V(0, 11.8, 0);
  for (let k = 0; k < 10; k++) { const a = k/10*TAU, x = Math.cos(a)*17, z = Math.sin(a)*17, pole = new THREE.Mesh(new THREE.CylinderGeometry(.15, .15, 15, 6), new THREE.MeshBasicMaterial({ color: 0xffd36e })); pole.position.set(x, 7.5, z); const g = glow("#ffd36e", 3, .9); g.position.set(x, 15.3, z); C.add(pole, g); tops.push(V(x, 15, z)); }
  tops.forEach((t, k) => { string(t, tops[(k + 1) % 10], 2); string(apex, t, 1.2); });
  flags.count = fn; flags.instanceMatrix.needsUpdate = flags.instanceColor.needsUpdate = true; C.add(flags);
}

const wT = tex(256, 256, (c, w, h) => { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, "#0d1b4c"); g.addColorStop(1, "#2b1450"); c.fillStyle = g; c.fillRect(0, 0, w, h); for (let i = 0; i < 260; i++) { c.fillStyle = `rgba(255,${150 + R()*80|0},${200 + R()*50|0},${R()*.25})`; c.fillRect(R()*w, R()*h, 4 + R()*22, 1.5); } });
wT.wrapS = wT.wrapT = THREE.RepeatWrapping; wT.repeat.set(10, 1);
const river = new THREE.Mesh(new THREE.PlaneGeometry(500, 35), new THREE.MeshStandardMaterial({ map: wT, emissiveMap: wT, emissive: 0x6a5aff, emissiveIntensity: .5, roughness: .15, metalness: .4 }));
river.rotation.x = -Math.PI/2; river.position.set(0, .1, -92.5); C.add(river);

const bx = -96.25, deck = new THREE.Mesh(new THREE.BoxGeometry(4, .8, 90), new THREE.MeshStandardMaterial({ color: 0x3a2d5c, emissive: 0x7a5cff, emissiveIntensity: .25 })); deck.position.set(bx, 4, -92.5); C.add(deck);
{
  const lp = [];
  for (let z = -137; z <= -48; z += 2) lp.push(bx - 1.9, 4.8, z, bx + 1.9, 4.8, z);
  for (let z = -130; z <= -55; z += 11) { const p = new THREE.Mesh(new THREE.BoxGeometry(5, 9, 1), new THREE.MeshStandardMaterial({ color: 0x2c2150 })); p.position.set(bx, 4, z); C.add(p); }
  C.add(pts(new Float32Array(lp), null, 1.3, { color: 0xffd36e }));
}
const boats = Array.from({ length: 8 }, (_, i) => {
  const b = new THREE.Group(), hull = new THREE.Mesh(new THREE.BoxGeometry(3, .6, 1.1), new THREE.MeshStandardMaterial({ color: 0x5a3322 })), cab = new THREE.Mesh(new THREE.BoxGeometry(1, .7, .8), new THREE.MeshStandardMaterial({ color: 0xff9bd0, emissive: 0xff6fb8, emissiveIntensity: .5 }));
  cab.position.y = .6; const g = glow("#ffb04a", 5, .9); g.position.y = 1.4; b.add(hull, cab, g);
  b.position.set(-200 + i*55, .5, -78 - R()*28); b.userData.s = (i % 2 ? 1 : -1)*(2 + R()*2); C.add(b); return b;
});
const sg = label("GANDHI SETU", "#cfe0ff", 12); sg.position.set(bx, 13, -92); const gg = label("GANGA", "#9fc0ff", 12); gg.position.set(30, 6, -92); C.add(sg, gg);
const lanterns = floaters(low ? 90 : 170, [200, 70, 160], 1.2, 2.2); lanterns.position.set(0, 34, -20); C.add(lanterns);

/* =========================================================
   FLOW · camera flights, fades, chapters
========================================================= */
let st = 0, trav = false, tw = null, t = 0, ot = 0, fireT = 0, heartT = 0;
const say = s => { el.toast.textContent = s; el.toast.classList.add("show"); clearTimeout(say.t); say.t = setTimeout(() => el.toast.classList.remove("show"), 1900); };
const pop = s => { el.emote.textContent = s; el.emote.classList.add("show"); clearTimeout(pop.t); pop.t = setTimeout(() => el.emote.classList.remove("show"), 900); };
function ui(i) {
  const [c, e, ti, d, b, h] = TXT[i];
  Object.assign(el.chapter, { textContent: c }); el.eyebrow.textContent = e; el.title.textContent = ti; el.description.textContent = d; el.action.textContent = b; el.hint.textContent = h;
  el.back.style.display = i ? "block" : "none";
  story.classList.remove("in"); void story.offsetWidth; story.classList.add("in");
}
function apply(i) {
  const s = SC[i]; G.space.visible = s == 0; G.india.visible = s == 1; G.city.visible = s == 2;
  scene.fog = s == 2 ? new THREE.FogExp2(0x160c2a, .0045) : null;
  camera.position.set(...CAM[i][0]); controls.target.set(...CAM[i][1]); controls.update(); ui(i);
}
const fly = (pos, tgt, dur, done) => { tw = { p0: camera.position.clone(), t0: controls.target.clone(), p1: V(...pos), t1: V(...tgt), k: 0, dur, done }; };
function go(i) {
  if (trav || i < 0 || i > 4) return;
  const from = st; trav = true; el.action.disabled = true; controls.enabled = false;
  const done = () => { trav = false; el.action.disabled = false; controls.enabled = true; };
  const cut = () => { el.fade.style.opacity = 1; setTimeout(() => { st = i; apply(i); el.fade.style.opacity = 0; setTimeout(done, 900); }, 850); };
  if (SC[i] === SC[from]) { st = i; ui(i); fly(...CAM[i], 3.2, done); }
  else if (from === 0 && i === 1) { const p = earthPos(); fly([p.x, p.y + 1.5, p.z + 7], [p.x, p.y, p.z], 2.6, cut); }
  else cut();
}
el.action.onclick = () => go(st === 4 ? 0 : st + 1);
el.back.onclick = () => go(st - 1);

/* ---------- tap interactions ---------- */
const ray = new THREE.Raycaster(), gp = new THREE.Plane(V(0, 1, 0), 0); let down = null;
addEventListener("pointerdown", e => down = [e.clientX, e.clientY, performance.now()]);
addEventListener("pointerup", e => {
  if (!down || trav) return; const [x, y, t0] = down; down = null;
  if (Math.hypot(e.clientX - x, e.clientY - y) > 8 || performance.now() - t0 > 500) return;
  ray.setFromCamera({ x: e.clientX/innerWidth*2 - 1, y: -(e.clientY/innerHeight)*2 + 1 }, camera); tap();
});
function tap() {
  if (st === 0) {
    const h = ray.intersectObjects([eM, moon, sun])[0]?.object;
    if (h === eM) { heart(earthPos().add(V(0, 4, 0)), "#ff4fa3", .12); say("Found HER 🌍"); pop("❤️"); }
    else if (h === moon) { say("That's me — always circling you 🌙"); pop("🌙"); }
    else if (h === sun) { say("Even the Sun came to celebrate ☀️"); pop("🎉"); }
  } else if (st === 1) { burst(V((R()-.5)*22, 5 + R()*8, (R()-.5)*10), TRI[R()*4|0], 80, 5.5); say("India is lighting up for you 🇮🇳"); pop("🎆"); }
  else { const p = ray.ray.intersectPlane(gp, V()); if (p) { p.y = 14 + R()*10; st > 2 ? heart(p, "#ff4fa3", .4) : burst(p, null, 100, 11); } say(st > 2 ? "Happy birthday, birthday girl ❤️" : "Patna is celebrating you 🎆"); pop(st > 2 ? "❤️" : "🎆"); }
}

/* ---------- main loop ---------- */
const clk = new THREE.Clock();
(function loop() {
  requestAnimationFrame(loop); if (document.hidden) return;
  const dt = Math.min(clk.getDelta(), .05); t += dt; if (!trav) ot += dt;
  if (tw) { tw.k += dt/tw.dur; const k = ease(Math.min(1, tw.k)); camera.position.lerpVectors(tw.p0, tw.p1, k); controls.target.lerpVectors(tw.t0, tw.t1, k); if (tw.k >= 1) { const d = tw.done; tw = null; d?.(); } }
  controls.autoRotate = st >= 3 && !tw && !trav;

  if (S.visible) {
    sun.rotation.y = t*.05;
    PL.forEach(p => { const a = p.a0 + ot*p.s*.3; p.m.position.set(Math.cos(a)*p.d, 0, Math.sin(a)*p.d); p.m.rotation.y = t*.1; });
    const a = .5 + ot*.1; earth.position.set(Math.cos(a)*24, 0, Math.sin(a)*24); eM.rotation.y = t*.15; cl.rotation.y = t*.19;
    const m = ot*.9; moon.position.set(Math.cos(m)*4.8, Math.sin(m)*.8, Math.sin(m)*4.8);
    orb.forEach((o, i) => { const b = ot*.35 + i*TAU/orb.length, r = 6.5 + (i % 3)*.8; o.position.set(Math.cos(b)*r, Math.sin(b*2)*1.2 + 1, Math.sin(b)*r); });
    conf.tick(t, dt);
    if (!trav && t > fireT) { fireT = t + .9; const e = earth.position; burst(V(e.x + (R()-.5)*20, (R()-.3)*10, e.z + (R()-.5)*20), null, 60, 4.5); }
  }
  if (I.visible) {
    pin.scale.setScalar(1 + .25*Math.sin(t*4)); beam.material.opacity = .35 + .15*Math.sin(t*3); spark.tick(t, dt);
    if (t > fireT) { fireT = t + .5; burst(V((R()-.5)*26, 5 + R()*8, (R()-.5)*14), TRI[R()*4|0], 70, 5.5); }
  }
  if (C.visible) {
    wT.offset.x += dt*.01; lanterns.tick(t, dt); gol.rotation.y = Math.sin(t*.25)*.025;
    lightA.intensity = 1500 + Math.sin(t*1.2)*350; lightB.intensity = 800 + Math.sin(t*1.7)*200; halo.material.opacity = .3 + .12*Math.sin(t*2);
    boats.forEach(b => { b.position.x += b.userData.s*dt; if (b.position.x > 220) b.position.x = -220; if (b.position.x < -220) b.position.x = 220; b.position.y = .5 + Math.sin(t*1.5 + b.position.x)*.05; });
    if (t > fireT) { fireT = t + (st > 2 ? .22 : .55); burst(V((R()-.5)*160, 28 + R()*28, (R()-.5)*100 - 25), null, 90, 12); }
    if (st === 4 && t > heartT) { heartT = t + 1.4; heart(V((R() < .5 ? -1 : 1)*(10 + R()*14), 26 + R()*12, -10), "#ff4fa3", .5); }
  }
  stepSparks(dt); controls.update(); renderer.render(scene, camera);
})();

addEventListener("resize", () => { camera.aspect = innerWidth/innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); });
apply(0);
