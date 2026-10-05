import * as THREE from "three";

import {
  OrbitControls
} from "https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/controls/OrbitControls.js";


/* =========================================================
   PERFORMANCE
========================================================= */

const mobile =
  /Android|iPhone|iPad|iPod/i.test(
    navigator.userAgent
  );

const low =
  mobile ||
  (navigator.hardwareConcurrency || 4) <= 4;

const DPR = low ? 1 : 1.35;

const STAR_COUNT =
  low ? 1000 : 2200;


/* =========================================================
   DOM
========================================================= */

const app =
  document.querySelector("#app");

const chapter =
  document.querySelector("#chapter");

const eyebrow =
  document.querySelector("#eyebrow");

const title =
  document.querySelector("#title");

const description =
  document.querySelector("#description");

const action =
  document.querySelector("#action");

const back =
  document.querySelector("#back");

const hint =
  document.querySelector("#hint");

const toast =
  document.querySelector("#toast");

const emote =
  document.querySelector("#emote");


/* =========================================================
   SCENE
========================================================= */

const scene =
  new THREE.Scene();

scene.background =
  new THREE.Color(0x05030d);

scene.fog =
  new THREE.FogExp2(
    0x08051a,
    0.0045
  );


/* =========================================================
   CAMERA
========================================================= */

const camera =
  new THREE.PerspectiveCamera(
    55,
    innerWidth / innerHeight,
    0.1,
    2200
  );

camera.position.set(
  0,
  13,
  52
);


/* =========================================================
   RENDERER
========================================================= */

const renderer =
  new THREE.WebGLRenderer({
    antialias: !low,

    powerPreference:
      "high-performance"
  });

renderer.setPixelRatio(
  Math.min(
    devicePixelRatio,
    DPR
  )
);

renderer.setSize(
  innerWidth,
  innerHeight
);

renderer.outputColorSpace =
  THREE.SRGBColorSpace;

renderer.toneMapping =
  THREE.ACESFilmicToneMapping;

renderer.toneMappingExposure =
  1.15;

app.appendChild(
  renderer.domElement
);


/* =========================================================
   CONTROLS
========================================================= */

const controls =
  new OrbitControls(
    camera,
    renderer.domElement
  );

controls.enableDamping = true;

controls.dampingFactor =
  0.055;

controls.enablePan = false;

controls.rotateSpeed =
  0.45;

controls.zoomSpeed =
  0.65;

controls.minDistance =
  2.5;

controls.maxDistance =
  120;


/* =========================================================
   LIGHTING
========================================================= */

scene.add(
  new THREE.HemisphereLight(
    0xffb4d8,
    0x161326,
    1.7
  )
);

const moonLight =
  new THREE.DirectionalLight(
    0xffb3d9,
    1.2
  );

moonLight.position.set(
  -20,
  40,
  20
);

scene.add(
  moonLight
);

const cityLight =
  new THREE.PointLight(
    0xff65b5,
    30,
    180
  );

cityLight.position.set(
  0,
  20,
  0
);

scene.add(
  cityLight
);


/* =========================================================
   WORLD GROUPS
========================================================= */

const groups = {

  universe:
    new THREE.Group(),

  india:
    new THREE.Group(),

  city:
    new THREE.Group()

};

scene.add(
  groups.universe,
  groups.india,
  groups.city
);

groups.india.visible =
  false;

groups.city.visible =
  false;


/* =========================================================
   HELPERS
========================================================= */

function mat(
  color,
  rough = 0.65,
  emissive = 0,
  intensity = 0
) {

  return new THREE.MeshStandardMaterial({

    color,

    roughness: rough,

    metalness: 0.08,

    emissive,

    emissiveIntensity:
      intensity

  });

}


function sphere(
  radius,
  color,
  emissive = 0,
  intensity = 0
) {

  return new THREE.Mesh(

    new THREE.SphereGeometry(
      radius,
      low ? 18 : 28,
      low ? 12 : 18
    ),

    mat(
      color,
      0.55,
      emissive,
      intensity
    )

  );

}


function makeLabel(
  text,
  color = "#fff",
  width = 3.2
) {

  const canvas =
    document.createElement(
      "canvas"
    );

  canvas.width = 512;
  canvas.height = 128;

  const ctx =
    canvas.getContext("2d");

  ctx.clearRect(
    0,
    0,
    512,
    128
  );

  ctx.font =
    "900 50px Arial";

  ctx.fillStyle =
    color;

  ctx.textAlign =
    "center";

  ctx.textBaseline =
    "middle";

  ctx.shadowColor =
    "rgba(255,100,190,.8)";

  ctx.shadowBlur = 18;

  ctx.fillText(
    text,
    256,
    64
  );

  const texture =
    new THREE.CanvasTexture(
      canvas
    );

  texture.colorSpace =
    THREE.SRGBColorSpace;

  const sprite =
    new THREE.Sprite(

      new THREE.SpriteMaterial({
        map: texture,

        transparent: true,

        depthWrite: false
      })

    );

  sprite.scale.set(
    width,
    width * 0.25,
    1
  );

  return sprite;
}


function glowSprite(
  color,
  size,
  opacity = 0.22
) {

  const canvas =
    document.createElement(
      "canvas"
    );

  canvas.width = 256;
  canvas.height = 256;

  const ctx =
    canvas.getContext("2d");

  const gradient =
    ctx.createRadialGradient(
      128,
      128,
      2,
      128,
      128,
      128
    );

  gradient.addColorStop(
    0,
    color
  );

  gradient.addColorStop(
    1,
    "rgba(0,0,0,0)"
  );

  ctx.fillStyle =
    gradient;

  ctx.fillRect(
    0,
    0,
    256,
    256
  );

  const texture =
    new THREE.CanvasTexture(
      canvas
    );

  const sprite =
    new THREE.Sprite(

      new THREE.SpriteMaterial({

        map: texture,

        transparent: true,

        opacity,

        depthWrite: false,

        blending:
          THREE.AdditiveBlending

      })

    );

  sprite.scale.set(
    size,
    size,
    1
  );

  return sprite;
}


function say(text) {

  toast.textContent =
    text;

  toast.classList.add(
    "show"
  );

  setTimeout(() => {

    toast.classList.remove(
      "show"
    );

  }, 1800);
}


function showEmote(text) {

  emote.textContent =
    text;

  emote.classList.add(
    "show"
  );

  setTimeout(() => {

    emote.classList.remove(
      "show"
    );

  }, 900);
}


/* =========================================================
   COSMIC NEBULAS
========================================================= */

const nebulaData = [

  [
    "rgba(255,60,165,.18)",
    [-45, 20, -70],
    110
  ],

  [
    "rgba(110,75,255,.16)",
    [45, -10, -85],
    120
  ],

  [
    "rgba(255,145,205,.12)",
    [0, 45, -120],
    100
  ],

  [
    "rgba(50,140,255,.09)",
    [-70, -30, -110],
    100
  ]

];


for (
  const [color, position, size]
  of nebulaData
) {

  const glow =
    glowSprite(
      color,
      size,
      0.85
    );

  glow.position.set(
    ...position
  );

  groups.universe.add(
    glow
  );

}


/* =========================================================
   STARS
========================================================= */

const starGeometry =
  new THREE.BufferGeometry();

const starPositions =
  new Float32Array(
    STAR_COUNT * 3
  );

for (
  let i = 0;
  i < STAR_COUNT;
  i++
) {

  const radius =
    100 +
    Math.random() * 600;

  const angle =
    Math.random() *
    Math.PI *
    2;

  const vertical =
    Math.acos(
      2 * Math.random() - 1
    );

  starPositions[i * 3] =
    radius *
    Math.sin(vertical) *
    Math.cos(angle);

  starPositions[i * 3 + 1] =
    radius *
    Math.cos(vertical);

  starPositions[i * 3 + 2] =
    radius *
    Math.sin(vertical) *
    Math.sin(angle);

}


starGeometry.setAttribute(

  "position",

  new THREE.BufferAttribute(
    starPositions,
    3
  )

);


const stars =
  new THREE.Points(

    starGeometry,

    new THREE.PointsMaterial({

      color: 0xffffff,

      size:
        low ? 0.75 : 1.05,

      transparent: true,

      opacity: 0.92,

      depthWrite: false

    })

  );


groups.universe.add(
  stars
);


/* =========================================================
   TWINKLING STARS
========================================================= */

const twinkles = [];

for (
  let i = 0;
  i < (low ? 45 : 80);
  i++
) {

  const star =
    sphere(
      0.045 +
      Math.random() * 0.09,

      i % 2
        ? 0x9bbcff
        : 0xff9acb,

      i % 2
        ? 0x426dff
        : 0xff3f9c,

      3
    );

  star.position.set(

    -80 +
      Math.random() * 160,

    -45 +
      Math.random() * 90,

    -30 -
      Math.random() * 180

  );

  groups.universe.add(
    star
  );

  twinkles.push(
    star
  );

}


/* =========================================================
   SUN
========================================================= */

const sun =
  sphere(
    3.5,
    0xffc14f,
    0xff6d00,
    3
  );

groups.universe.add(
  sun
);


groups.universe.add(

  glowSprite(
    "rgba(255,150,50,.35)",
    17,
    0.9
  )

);


/* =========================================================
   PLANETS
========================================================= */

const planetDefinitions = [

  {
    distance: 8,
    radius: 0.45,
    color: 0xbfc2ca,
    speed: 0.19
  },

  {
    distance: 11,
    radius: 0.72,
    color: 0xc99b71,
    speed: 0.15
  },

  {
    distance: 15,
    radius: 1.35,
    color: 0x3e74ff,
    speed: 0.10,
    her: true
  },

  {
    distance: 20,
    radius: 0.76,
    color: 0xc95745,
    speed: 0.075
  },

  {
    distance: 27,
    radius: 1.9,
    color: 0xb88f63,
    speed: 0.042,
    ring: true
  }

];


const planets = [];


for (
  const data
  of planetDefinitions
) {

  const orbit =
    new THREE.Mesh(

      new THREE.RingGeometry(
        data.distance - 0.012,
        data.distance + 0.012,
        low ? 64 : 96
      ),

      new THREE.MeshBasicMaterial({

        color: 0x8b86a0,

        transparent: true,

        opacity: 0.23,

        side:
          THREE.DoubleSide

      })

    );

  orbit.rotation.x =
    Math.PI / 2;

  groups.universe.add(
    orbit
  );


  const planet =
    sphere(
      data.radius,
      data.color,
      data.her
        ? 0x123cc0
        : 0,
      data.her
        ? 0.8
        : 0
    );


  planet.userData = {

    her:
      !!data.her,

    distance:
      data.distance,

    speed:
      data.speed,

    angle:
      Math.random() *
      Math.PI *
      2

  };


  groups.universe.add(
    planet
  );

  planets.push(
    planet
  );


  /* Saturn ring */

  if (data.ring) {

    const ring =
      new THREE.Mesh(

        new THREE.RingGeometry(
          2.4,
          3.3,
          48
        ),

        new THREE.MeshBasicMaterial({

          color: 0xdab88c,

          transparent: true,

          opacity: 0.55,

          side:
            THREE.DoubleSide

        })

      );

    ring.rotation.x =
      Math.PI / 2.5;

    planet.add(
      ring
    );

  }


  /* HER */

  if (data.her) {

    const atmosphere =
      new THREE.Mesh(

        new THREE.SphereGeometry(
          1.48,
          28,
          18
        ),

        new THREE.MeshBasicMaterial({

          color: 0x68a8ff,

          transparent: true,

          opacity: 0.13,

          side:
            THREE.BackSide,

          blending:
            THREE.AdditiveBlending

        })

      );

    planet.add(
      atmosphere
    );


    const herLabel =
      makeLabel(
        "HER",
        "#ffd0e7",
        2.5
      );

    herLabel.position.y =
      2.1;

    planet.add(
      herLabel
    );


    /* ME */

    const me =
      sphere(
        0.32,
        0xff75b9,
        0xff2d88,
        4
      );

    me.userData.me =
      true;

    planet.add(
      me
    );


    const meLabel =
      makeLabel(
        "ME",
        "#ffc1dd",
        1.5
      );

    meLabel.position.y =
      0.7;

    me.add(
      meLabel
    );


    /* Heart particles */

    for (
      let i = 0;
      i < 9;
      i++
    ) {

      const heart =
        sphere(
          0.035,
          0xff9bc9,
          0xff4c9d,
          3
        );

      heart.userData.h =
        i;

      planet.add(
        heart
      );

    }

  }

}


/* =========================================================
   ASTEROID BELT
========================================================= */

const asteroidGeometry =
  new THREE.DodecahedronGeometry(
    0.09,
    0
  );

const asteroidMaterial =
  mat(
    0x76717d,
    0.95
  );

const asteroidCount =
  low ? 130 : 220;

const asteroids =
  new THREE.InstancedMesh(
    asteroidGeometry,
    asteroidMaterial,
    asteroidCount
  );

const dummy =
  new THREE.Object3D();


for (
  let i = 0;
  i < asteroids.count;
  i++
) {

  const angle =
    Math.random() *
    Math.PI *
    2;

  const radius =
    23 +
    Math.random() * 5;

  dummy.position.set(

    Math.cos(angle) *
      radius,

    (Math.random() - 0.5) *
      1.5,

    Math.sin(angle) *
      radius

  );

  const scale =
    0.4 +
    Math.random() * 1.5;

  dummy.scale.setScalar(
    scale
  );

  dummy.rotation.set(
    Math.random() * 3,
    Math.random() * 3,
    Math.random() * 3
  );

  dummy.updateMatrix();

  asteroids.setMatrixAt(
    i,
    dummy.matrix
  );

}

groups.universe.add(
  asteroids
);


/* =========================================================
   ASTRONAUT
========================================================= */

function createAstronaut() {

  const group =
    new THREE.Group();

  group.userData.emote =
    "idle";


  /* Helmet */

  const helmet =
    new THREE.Mesh(

      new THREE.SphereGeometry(
        0.5,
        16,
        12
      ),

      mat(
        0xf1f2f5,
        0.35,
        0x111827,
        0.15
      )

    );

  helmet.position.y =
    0.85;

  group.add(
    helmet
  );


  /* Visor */

  const visor =
    new THREE.Mesh(

      new THREE.SphereGeometry(
        0.3,
        14,
        10
      ),

      mat(
        0x162b4c,
        0.2,
        0x071a38,
        0.8
      )

    );

  visor.position.set(
    0,
    0.88,
    0.38
  );

  visor.scale.z =
    0.35;

  group.add(
    visor
  );


  /* Body */

  const body =
    new THREE.Mesh(

      new THREE.BoxGeometry(
        0.65,
        0.8,
        0.42
      ),

      mat(
        0xe8e9ec,
        0.55
      )

    );

  body.position.y =
    0.15;

  group.add(
    body
  );


  /* Arms + legs */

  for (
    const side
    of [-1, 1]
  ) {

    const arm =
      new THREE.Mesh(

        new THREE.BoxGeometry(
          0.17,
          0.62,
          0.17
        ),

        mat(
          0xd7d9df,
          0.55
        )

      );

    arm.position.set(
      side * 0.45,
      0.2,
      0
    );

    arm.rotation.z =
      side * 0.35;

    arm.userData.arm =
      side;

    group.add(
      arm
    );


    const leg =
      new THREE.Mesh(

        new THREE.BoxGeometry(
          0.2,
          0.62,
          0.2
        ),

        mat(
          0xd7d9df,
          0.55
        )

      );

    leg.position.set(
      side * 0.18,
      -0.55,
      0
    );

    leg.userData.leg =
      side;

    group.add(
      leg
    );

  }


  const badge =
    glowSprite(
      "rgba(255,100,190,.8)",
      1.8,
      0.08
    );

  badge.position.set(
    0,
    0.1,
    -0.25
  );

  group.add(
    badge
  );


  return group;

}


const astronauts = [];


for (
  let i = 0;
  i < (low ? 3 : 6);
  i++
) {

  const astronaut =
    createAstronaut();

  astronaut.position.set(

    -26 +
      Math.random() * 52,

    -3 +
      Math.random() * 20,

    -20 -
      Math.random() * 45

  );

  astronaut.scale.setScalar(
    0.65 +
    Math.random() * 0.45
  );

  astronaut.userData.phase =
    Math.random() * 10;

  astronaut.userData.baseY =
    astronaut.position.y;

  groups.universe.add(
    astronaut
  );

  astronauts.push(
    astronaut
  );

}


/* =========================================================
   INDIA
========================================================= */

const indiaFloor =
  new THREE.Mesh(

    new THREE.CylinderGeometry(
      12,
      13,
      0.55,
      48
    ),

    mat(
      0x34563a,
      0.9
    )

  );

indiaFloor.position.y =
  -0.4;

groups.india.add(
  indiaFloor
);


for (
  let i = 0;
  i < 120;
  i++
) {

  const light =
    sphere(
      0.05,
      0xffcf79,
      0xffa61a,
      4
    );

  const angle =
    Math.random() *
    Math.PI *
    2;

  const radius =
    2 +
    Math.random() * 10;

  light.position.set(

    Math.cos(angle) *
      radius,

    0.2,

    Math.sin(angle) *
      radius

  );

  groups.india.add(
    light
  );

}


const indiaLabel =
  makeLabel(
    "INDIA",
    "#ffd0e5",
    5
  );

indiaLabel.position.y =
  4;

groups.india.add(
  indiaLabel
);


/* Patna marker */

const patna =
  sphere(
    0.42,
    0xff69b3,
    0xff237e,
    5
  );

patna.position.set(
  0.5,
  0.6,
  1.4
);

patna.userData.patna =
  true;

groups.india.add(
  patna
);


const patnaLabel =
  makeLabel(
    "PATNA",
    "#ffe0ee",
    3.5
  );

patnaLabel.position.y =
  1;

patna.add(
  patnaLabel
);


/* =========================================================
   PATNA CITY
========================================================= */

const city =
  groups.city;


/* Pink sky */

const skyGlow =
  glowSprite(
    "rgba(255,100,180,.25)",
    180,
    0.85
  );

skyGlow.position.set(
  0,
  45,
  -90
);

city.add(
  skyGlow
);


const blueGlow =
  glowSprite(
    "rgba(90,120,255,.15)",
    160,
    0.7
  );

blueGlow.position.set(
  80,
  30,
  -120
);

city.add(
  blueGlow
);


/* =========================================================
   CITY GROUND
========================================================= */

const ground =
  new THREE.Mesh(

    new THREE.PlaneGeometry(
      180,
      150
    ),

    mat(
      0x18251e,
      0.95
    )

  );

ground.rotation.x =
  -Math.PI / 2;

city.add(
  ground
);


/* =========================================================
   GANGA
========================================================= */

const ganga =
  new THREE.Mesh(

    new THREE.PlaneGeometry(
      180,
      30
    ),

    new THREE.MeshStandardMaterial({

      color: 0x245879,

      roughness: 0.18,

      metalness: 0.35,

      emissive: 0x06243a,

      emissiveIntensity: 0.35

    })

  );

ganga.rotation.x =
  -Math.PI / 2;

ganga.position.set(
  0,
  0.03,
  43
);

city.add(
  ganga
);


/* Water reflections */

for (
  let i = 0;
  i < 120;
  i++
) {

  const light =
    sphere(
      0.035,
      0xffd98b,
      0xffa400,
      2.5
    );

  light.position.set(

    -80 +
      Math.random() * 160,

    0.08,

    30 +
      Math.random() * 25

  );

  city.add(
    light
  );

}


/* =========================================================
   ROADS
========================================================= */

function createRoad(
  x,
  z,
  width,
  depth,
  rotation = 0
) {

  const road =
    new THREE.Mesh(

      new THREE.PlaneGeometry(
        width,
        depth
      ),

      mat(
        0x292a30,
        0.95
      )

    );

  road.rotation.x =
    -Math.PI / 2;

  road.rotation.z =
    rotation;

  road.position.set(
    x,
    0.06,
    z
  );

  city.add(
    road
  );

}


createRoad(
  0,
  0,
  170,
  5
);

createRoad(
  -30,
  8,
  5,
  80
);

createRoad(
  30,
  8,
  5,
  80
);

createRoad(
  0,
  -18,
  150,
  4
);

createRoad(
  0,
  22,
  150,
  4
);


/* Road markings */

for (
  let x = -75;
  x < 75;
  x += 7
) {

  const marking =
    new THREE.Mesh(

      new THREE.PlaneGeometry(
        3,
        0.12
      ),

      mat(
        0xe8e3d2,
        0.7
      )

    );

  marking.rotation.x =
    -Math.PI / 2;

  marking.position.set(
    x,
    0.08,
    0
  );

  city.add(
    marking
  );

}


/* =========================================================
   BUILDINGS
========================================================= */

const buildingGeometry =
  new THREE.BoxGeometry(
    1,
    1,
    1
  );

const buildingMaterial =
  mat(
    0x55515e,
    0.8
  );


const buildingCount =
  low ? 220 : 360;


const buildings =
  new THREE.InstancedMesh(

    buildingGeometry,

    buildingMaterial,

    buildingCount

  );


for (
  let i = 0;
  i < buildings.count;
  i++
) {

  let x =
    -78 +
    Math.random() *
    156;

  let z =
    -40 +
    Math.random() *
    75;


  if (
    Math.abs(z) < 3 ||
    Math.abs(x) < 3 ||
    z > 30
  ) {

    i--;

    continue;

  }


  const width =
    0.8 +
    Math.random() * 2.7;

  const depth =
    0.8 +
    Math.random() * 2.7;

  const height =
    1.5 +
    Math.random() * 11;


  dummy.position.set(
    x,
    height / 2,
    z
  );

  dummy.scale.set(
    width,
    height,
    depth
  );

  dummy.rotation.y =
    Math.random() *
    Math.PI;

  dummy.updateMatrix();


  buildings.setMatrixAt(
    i,
    dummy.matrix
  );

}


city.add(
  buildings
);


/* =========================================================
   BUILDING WINDOWS
========================================================= */

const windowGeometry =
  new THREE.BoxGeometry(
    0.08,
    0.12,
    0.03
  );

const windowMaterial =
  mat(
    0xffd77c,
    0.35,
    0xffa31a,
    2.2
  );


const windowCount =
  low ? 650 : 1100;


const windows =
  new THREE.InstancedMesh(

    windowGeometry,

    windowMaterial,

    windowCount

  );


for (
  let i = 0;
  i < windows.count;
  i++
) {

  const x =
    -75 +
    Math.random() *
    150;

  const z =
    -38 +
    Math.random() *
    72;

  const y =
    0.8 +
    Math.random() *
    12;


  dummy.position.set(
    x,
    y,
    z
  );

  dummy.scale.set(
    1,
    1,
    1
  );

  dummy.updateMatrix();


  windows.setMatrixAt(
    i,
    dummy.matrix
  );

}


city.add(
  windows
);


/* =========================================================
   TREES
========================================================= */

const trunkGeometry =
  new THREE.CylinderGeometry(
    0.12,
    0.16,
    1.4,
    6
  );

const trunkMaterial =
  mat(
    0x523b2c
  );

const foliageGeometry =
  new THREE.SphereGeometry(
    0.8,
    8,
    6
  );

const foliageMaterial =
  mat(
    0x285d3c
  );


const trees =
  new THREE.Group();


for (
  let i = 0;
  i < (low ? 90 : 150);
  i++
) {

  const x =
    -78 +
    Math.random() *
    156;

  const z =
    -38 +
    Math.random() *
    72;


  if (
    Math.abs(x) < 4 ||
    Math.abs(z) < 4
  ) {

    continue;

  }


  const trunk =
    new THREE.Mesh(
      trunkGeometry,
      trunkMaterial
    );

  trunk.position.set(
    x,
    0.7,
    z
  );

  trees.add(
    trunk
  );


  const foliage =
    new THREE.Mesh(
      foliageGeometry,
      foliageMaterial
    );

  foliage.position.set(
    x,
    1.7,
    z
  );

  foliage.scale.setScalar(
    0.7 +
    Math.random() * 0.7
  );

  trees.add(
    foliage
  );

}


city.add(
  trees
);


/* =========================================================
   STREET LIGHTS
========================================================= */

for (
  let x = -70;
  x <= 70;
  x += 5
) {

  const pole =
    new THREE.Mesh(

      new THREE.CylinderGeometry(
        0.045,
        0.065,
        2.8,
        6
      ),

      mat(
        0x4c4d55
      )

    );

  pole.position.set(
    x,
    1.4,
    3.2
  );

  city.add(
    pole
  );


  const lamp =
    sphere(
      0.13,
      0xffd98a,
      0xffa71a,
      4
    );

  lamp.position.set(
    x,
    2.8,
    3.2
  );

  city.add(
    lamp
  );

}


/* =========================================================
   CARS
========================================================= */

const carGeometry =
  new THREE.BoxGeometry(
    1.1,
    0.35,
    0.55
  );

const carMaterial =
  mat(
    0x9b4d5d,
    0.5,
    0x21070e,
    0.2
  );


const cars =
  new THREE.InstancedMesh(

    carGeometry,

    carMaterial,

    low ? 35 : 65

  );


for (
  let i = 0;
  i < cars.count;
  i++
) {

  dummy.position.set(

    -75 +
      Math.random() * 150,

    0.35,

    Math.random() > 0.5
      ? -0.7
      : 0.7

  );

  dummy.scale.set(
    0.8 +
      Math.random() * 0.5,

    0.8,

    1
  );

  dummy.rotation.y =
    Math.random() > 0.5
      ? 0
      : Math.PI;

  dummy.updateMatrix();

  cars.setMatrixAt(
    i,
    dummy.matrix
  );

}


city.add(
  cars
);


/* =========================================================
   AUTO RICKSHAWS
========================================================= */

const autoGeometry =
  new THREE.BoxGeometry(
    0.9,
    0.5,
    0.65
  );

const autoMaterial =
  mat(
    0x1e9b70,
    0.6,
    0x063a2b,
    0.3
  );


const autos =
  new THREE.InstancedMesh(

    autoGeometry,

    autoMaterial,

    low ? 20 : 35

  );


for (
  let i = 0;
  i < autos.count;
  i++
) {

  dummy.position.set(

    -70 +
      Math.random() * 140,

    0.5,

    8 +
      Math.random() * 15

  );

  dummy.rotation.y =
    Math.random() > 0.5
      ? 0
      : Math.PI;

  dummy.updateMatrix();

  autos.setMatrixAt(
    i,
    dummy.matrix
  );

}


city.add(
  autos
);


/* =========================================================
   PEOPLE
========================================================= */

const personGeometry =
  new THREE.CapsuleGeometry(
    0.12,
    0.55,
    4,
    7
  );

const personMaterial =
  mat(
    0xd8b4a0,
    0.9
  );


const people =
  new THREE.InstancedMesh(

    personGeometry,

    personMaterial,

    low ? 180 : 320

  );


for (
  let i = 0;
  i < people.count;
  i++
) {

  const x =
    -78 +
    Math.random() *
    156;

  const z =
    -35 +
    Math.random() *
    60;


  dummy.position.set(
    x,
    0.45,
    z
  );

  dummy.scale.setScalar(
    0.7 +
    Math.random() * 0.6
  );

  dummy.rotation.y =
    Math.random() *
    Math.PI *
    2;

  dummy.updateMatrix();

  people.setMatrixAt(
    i,
    dummy.matrix
  );

}


city.add(
  people
);


/* =========================================================
   BOATS
========================================================= */

const boats = [];


for (
  let i = 0;
  i < (low ? 8 : 14);
  i++
) {

  const boat =
    new THREE.Mesh(

      new THREE.BoxGeometry(
        2.4,
        0.25,
        0.65
      ),

      mat(
        0x6b4735,
        0.85
      )

    );

  boat.position.set(

    -70 +
      Math.random() * 140,

    0.25,

    35 +
      Math.random() * 20

  );

  boat.userData.speed =
    0.015 +
    Math.random() * 0.025;

  city.add(
    boat
  );

  boats.push(
    boat
  );

}


/* =========================================================
   LANDMARK HELPER
========================================================= */

function landmarkLabel(
  name,
  position
) {

  const label =
    makeLabel(
      name,
      "#ffe1ec",
      3.7
    );

  label.position.copy(
    position
  );

  city.add(
    label
  );

  return label;
}


/* =========================================================
   GOLGHAR
========================================================= */

const golghar =
  new THREE.Group();

golghar.position.set(
  -27,
  0,
  -8
);

golghar.userData.landmark =
  "Golghar";


const golgharBase =
  new THREE.Mesh(

    new THREE.CylinderGeometry(
      3.6,
      4,
      1.1,
      32
    ),

    mat(
      0xc48b57
    )

  );

golgharBase.position.y =
  0.55;

golghar.add(
  golgharBase
);


const golgharDome =
  new THREE.Mesh(

    new THREE.SphereGeometry(
      3.8,
      28,
      18,
      0,
      Math.PI * 2,
      0,
      Math.PI / 2
    ),

    mat(
      0xb97643
    )

  );

golgharDome.scale.y =
  1.25;

golgharDome.position.y =
  1.05;

golghar.add(
  golgharDome
);


/* spiral staircase illusion */

for (
  let i = 0;
  i < 75;
  i++
) {

  const angle =
    i / 75 *
    Math.PI *
    5.4;

  const step =
    new THREE.Mesh(

      new THREE.BoxGeometry(
        0.2,
        0.05,
        0.7
      ),

      mat(
        0x754d35
      )

    );

  step.position.set(

    Math.cos(angle) *
      3.9,

    0.5 +
      i / 75 * 5,

    Math.sin(angle) *
      3.9

  );

  step.rotation.y =
    -angle;

  golghar.add(
    step
  );

}


golghar.add(

  landmarkLabel(
    "GOLGHAR",
    new THREE.Vector3(
      0,
      7,
      0
    )
  )

);


city.add(
  golghar
);


/* =========================================================
   GANDHI MAIDAN
========================================================= */

const maidan =
  new THREE.Mesh(

    new THREE.CircleGeometry(
      8,
      40
    ),

    mat(
      0x3e7a48,
      0.95
    )

  );

maidan.rotation.x =
  -Math.PI / 2;

maidan.position.set(
  5,
  0.09,
  -4
);

city.add(
  maidan
);

landmarkLabel(
  "GANDHI MAIDAN",
  new THREE.Vector3(
    5,
    1,
    -4
  )
);


/* =========================================================
   OLD SECRETARIAT
========================================================= */

const secretariat =
  new THREE.Group();

secretariat.position.set(
  35,
  0,
  -12
);


const secretariatBody =
  new THREE.Mesh(

    new THREE.BoxGeometry(
      13,
      4,
      4
    ),

    mat(
      0x8c5041
    )

  );

secretariatBody.position.y =
  2;

secretariat.add(
  secretariatBody
);


const tower =
  new THREE.Mesh(

    new THREE.BoxGeometry(
      2.4,
      8,
      2.4
    ),

    mat(
      0x9b5947
    )

  );

tower.position.y =
  4;

secretariat.add(
  tower
);


const clock =
  sphere(
    0.55,
    0xf2dfbb,
    0xffc66e,
    0.4
  );

clock.position.set(
  0,
  6.4,
  1.23
);

secretariat.add(
  clock
);


secretariat.add(

  landmarkLabel(
    "OLD SECRETARIAT",
    new THREE.Vector3(
      0,
      9,
      0
    )
  )

);

city.add(
  secretariat
);


/* =========================================================
   BIHAR MUSEUM
========================================================= */

const museum =
  new THREE.Group();

museum.position.set(
  23,
  0,
  10
);


const museumBody =
  new THREE.Mesh(

    new THREE.BoxGeometry(
      9,
      3,
      5
    ),

    mat(
      0x6f625d
    )

  );

museumBody.position.y =
  1.5;

museum.add(
  museumBody
);


const museumRoof =
  new THREE.Mesh(

    new THREE.BoxGeometry(
      10,
      0.5,
      6
    ),

    mat(
      0x403a3a
    )

  );

museumRoof.position.y =
  3.2;

museum.add(
  museumRoof
);


museum.add(

  landmarkLabel(
    "BIHAR MUSEUM",
    new THREE.Vector3(
      0,
      5,
      0
    )
  )

);

city.add(
  museum
);


/* =========================================================
   PATNA JUNCTION + MAHAVIR MANDIR
========================================================= */

const station =
  new THREE.Group();

station.position.set(
  -2,
  0,
  20
);


const stationBody =
  new THREE.Mesh(

    new THREE.BoxGeometry(
      10,
      3.5,
      3
    ),

    mat(
      0x6c5a52
    )

  );

stationBody.position.y =
  1.75;

station.add(
  stationBody
);


const stationSign =
  makeLabel(
    "PATNA JUNCTION",
    "#fff1bf",
    4.5
  );

stationSign.position.set(
  0,
  4.6,
  0
);

station.add(
  stationSign
);


/* Mahavir Mandir */

const temple =
  new THREE.Mesh(

    new THREE.ConeGeometry(
      1.8,
      4,
      6
    ),

    mat(
      0xd76d42
    )

  );

temple.position.set(
  7,
  2,
  0
);

station.add(
  temple
);


const templeLabel =
  makeLabel(
    "MAHAVIR MANDIR",
    "#ffe0ad",
    3
  );

templeLabel.position.set(
  7,
  5,
  0
);

station.add(
  templeLabel
);


city.add(
  station
);


/* =========================================================
   GANDHI GHAT
========================================================= */

const ghat =
  new THREE.Group();

ghat.position.set(
  -15,
  0,
  31
);


for (
  let i = 0;
  i < 8;
  i++
) {

  const step =
    new THREE.Mesh(

      new THREE.BoxGeometry(
        12,
        0.18,
        1
      ),

      mat(
        0x89766d
      )

    );

  step.position.set(
    0,
    0.12,
    i
  );

  ghat.add(
    step
  );

}


/* Ghat lamps */

for (
  let i = 0;
  i < 18;
  i++
) {

  const lamp =
    sphere(
      0.11,
      0xffcf72,
      0xff9f13,
      5
    );

  lamp.position.set(

    -5.5 +
      (i % 2) * 11,

    0.8,

    i * 0.55

  );

  ghat.add(
    lamp
  );

}


ghat.add(

  landmarkLabel(
    "GANDHI GHAT",
    new THREE.Vector3(
      0,
      2.5,
      0
    )
  )

);


city.add(
  ghat
);


/* =========================================================
   GANDHI SETU
========================================================= */

const setu =
  new THREE.Group();

setu.position.set(
  58,
  4,
  22
);

setu.rotation.y =
  0.05;


const bridgeDeck =
  new THREE.Mesh(

    new THREE.BoxGeometry(
      85,
      0.6,
      2.2
    ),

    mat(
      0x69656b
    )

  );

setu.add(
  bridgeDeck
);


for (
  let i = 0;
  i < 18;
  i++
) {

  const pillar =
    new THREE.Mesh(

      new THREE.BoxGeometry(
        0.45,
        10,
        0.45
      ),

      mat(
        0x77737a
      )

    );

  pillar.position.set(
    -40 + i * 5,
    5,
    0
  );

  setu.add(
    pillar
  );

}


city.add(
  setu
);


/* =========================================================
   JP GANGA PATH
========================================================= */

const gangaPath =
  new THREE.Mesh(

    new THREE.PlaneGeometry(
      160,
      5
    ),

    mat(
      0x2d2d35,
      0.9
    )

  );

gangaPath.rotation.x =
  -Math.PI / 2;

gangaPath.position.set(
  0,
  0.11,
  26
);

city.add(
  gangaPath
);


for (
  let x = -75;
  x < 75;
  x += 6
) {

  const marking =
    new THREE.Mesh(

      new THREE.PlaneGeometry(
        3,
        0.12
      ),

      mat(
        0xf0e7d2,
        0.7
      )

    );

  marking.rotation.x =
    -Math.PI / 2;

  marking.position.set(
    x,
    0.13,
    26
  );

  city.add(
    marking
  );

}


landmarkLabel(
  "JP GANGA PATH",
  new THREE.Vector3(
    45,
    1,
    26
  )
);


/* =========================================================
   SABHYATA DWAR
========================================================= */

const dwar =
  new THREE.Group();

dwar.position.set(
  28,
  0,
  30
);


const leftPillar =
  new THREE.Mesh(

    new THREE.BoxGeometry(
      2,
      7,
      1.5
    ),

    mat(
      0xa45e4b
    )

  );

leftPillar.position.x =
  -2;

dwar.add(
  leftPillar
);


const rightPillar =
  leftPillar.clone();

rightPillar.position.x =
  2;

dwar.add(
  rightPillar
);


const dwarTop =
  new THREE.Mesh(

    new THREE.BoxGeometry(
      6,
      1.5,
      1.5
    ),

    mat(
      0xa45e4b
    )

  );

dwarTop.position.y =
  6.3;

dwar.add(
  dwarTop
);


dwar.add(

  landmarkLabel(
    "SABHYATA DWAR",
    new THREE.Vector3(
      0,
      8,
      0
    )
  )

);


city.add(
  dwar
);


/* =========================================================
   BIRTHDAY POSTERS
========================================================= */

function createPoster(
  text,
  sub,
  x,
  z,
  rotation = 0
) {

  const canvas =
    document.createElement(
      "canvas"
    );

  canvas.width = 512;
  canvas.height = 680;

  const ctx =
    canvas.getContext("2d");


  const gradient =
    ctx.createLinearGradient(
      0,
      0,
      0,
      680
    );

  gradient.addColorStop(
    0,
    "#3b123c"
  );

  gradient.addColorStop(
    1,
    "#13091d"
  );


  ctx.fillStyle =
    gradient;

  ctx.fillRect(
    0,
    0,
    512,
    680
  );


  ctx.textAlign =
    "center";


  ctx.fillStyle =
    "#ff75b9";

  ctx.font =
    "90px Arial";

  ctx.fillText(
    "♥",
    256,
    170
  );


  ctx.fillStyle =
    "#ffffff";

  ctx.font =
    "900 48px Arial";

  ctx.fillText(
    text,
    256,
    300
  );


  ctx.fillStyle =
    "#ffc0dc";

  ctx.font =
    "700 27px Arial";

  ctx.fillText(
    sub,
    256,
    355
  );


  ctx.fillStyle =
    "#d6cbd7";

  ctx.font =
    "20px Arial";

  ctx.fillText(
    "20 looks beautiful on you.",
    256,
    430
  );


  const texture =
    new THREE.CanvasTexture(
      canvas
    );

  texture.colorSpace =
    THREE.SRGBColorSpace;


  const poster =
    new THREE.Mesh(

      new THREE.PlaneGeometry(
        3,
        4
      ),

      new THREE.MeshBasicMaterial({
        map: texture,

        side:
          THREE.DoubleSide
      })

    );


  poster.position.set(
    x,
    2.6,
    z
  );

  poster.rotation.y =
    rotation;

  city.add(
    poster
  );

}


createPoster(
  "HAPPY 20TH",
  "BIRTHDAY, HER",
  -12,
  -1,
  0.2
);


createPoster(
  "FOR HER",
  "WITH LOVE",
  12,
  -1,
  -0.2
);


createPoster(
  "20 ✦",
  "MY FAVOURITE",
  0,
  15,
  0
);


/* =========================================================
   FLOATING HEART LIGHTS
========================================================= */

const hearts = [];


for (
  let i = 0;
  i < (low ? 25 : 45);
  i++
) {

  const heart =
    sphere(
      0.12,
      0xff7bb9,
      0xff2e8b,
      5
    );

  heart.position.set(

    -65 +
      Math.random() * 130,

    2 +
      Math.random() * 12,

    -35 +
      Math.random() * 70

  );

  heart.userData.phase =
    Math.random() * 8;

  city.add(
    heart
  );

  hearts.push(
    heart
  );

}


/* =========================================================
   CAMERA TRAVEL
========================================================= */

let state =
  "space";

let traveling =
  false;


function updateUI(
  chapterText,
  eyebrowText,
  titleText,
  descriptionText,
  buttonText,
  hintText
) {

  chapter.textContent =
    chapterText;

  eyebrow.textContent =
    eyebrowText;

  title.textContent =
    titleText;

  description.textContent =
    descriptionText;

  action.textContent =
    buttonText;

  hint.textContent =
    hintText;

}


function travel(
  endPosition,
  target,
  duration = 1900,
  finished
) {

  traveling = true;

  controls.enabled =
    false;


  const startPosition =
    camera.position.clone();

  const startTarget =
    controls.target.clone();


  const middle =
    startPosition.clone()
      .lerp(
        endPosition,
        0.5
      );


  middle.y += 10;

  middle.z += 7;


  const startTime =
    performance.now();


  function move(now) {

    let progress =
      Math.min(
        1,
        (now - startTime) /
          duration
      );


    const smooth =
      progress *
      progress *
      progress *
      (
        progress *
        (progress * 6 - 15)
        + 10
      );


    const first =
      new THREE.Vector3()
        .lerpVectors(
          startPosition,
          middle,
          smooth
        );


    const second =
      new THREE.Vector3()
        .lerpVectors(
          middle,
          endPosition,
          smooth
        );


    camera.position.lerpVectors(
      first,
      second,
      smooth
    );


    controls.target.lerpVectors(
      startTarget,
      target,
      smooth
    );


    controls.update();


    if (
      progress < 1
    ) {

      requestAnimationFrame(
        move
      );

    } else {

      traveling =
        false;

      controls.enabled =
        true;

      if (finished)
        finished();

    }

  }


  requestAnimationFrame(
    move
  );

}


/* =========================================================
   SPACE → INDIA
========================================================= */

function goToIndia() {

  if (traveling)
    return;


  updateUI(
    "01 → 02",
    "FOLLOW THE LIGHT",
    "Closer…",
    "The camera leaves the planets and dives toward home.",
    "Travelling…",
    "✦"
  );


  const her =
    planets.find(
      planet =>
        planet.userData.her
    );


  const position =
    her.position.clone()
      .add(
        new THREE.Vector3(
          0,
          4,
          8
        )
      );


  travel(
    position,
    her.position,
    low ? 1600 : 2200,

    () => {

      groups.universe.visible =
        false;

      groups.india.visible =
        true;

      state =
        "india";


      camera.position.set(
        0,
        13,
        31
      );

      controls.target.set(
        0,
        0,
        0
      );


      updateUI(
        "02 · INDIA",
        "HER WORLD",
        "There she is.",
        "One little glowing point on the map. Let's get closer.",
        "Find Patna →",
        "Tap the glowing PATNA"
      );


      back.style.display =
        "block";

    }
  );

}


/* =========================================================
   INDIA → PATNA
========================================================= */

function goToPatna() {

  if (traveling)
    return;


  updateUI(
    "02 → 03",
    "COMING CLOSER",
    "India becomes a city.",
    "Down through the lights…",
    "Travelling…",
    "✦"
  );


  travel(

    new THREE.Vector3(
      0,
      8,
      24
    ),

    patna.position,

    low ? 1600 : 2100,

    () => {

      groups.india.visible =
        false;

      groups.city.visible =
        true;

      state =
        "city";


      camera.position.set(
        0,
        30,
        52
      );

      controls.target.set(
        0,
        2,
        0
      );


      updateUI(
        "03 · PATNA",
        "A LIVING CITY",
        "Welcome to Patna.",
        "Not a dot on a map — a whole city of lights, roads, river, people and places.",
        "Explore Patna →",
        "Tap landmarks · drag · explore"
      );

    }

  );

}


/* =========================================================
   PATNA → GOLGHAR
========================================================= */

function goToGolghar() {

  if (traveling)
    return;


  updateUI(
    "03 → 04",
    "ONE LAST STOP",
    "Follow the pink lights.",
    "Something special is waiting near the heart of the city.",
    "Travelling…",
    "❤️"
  );


  travel(

    new THREE.Vector3(
      -10,
      8,
      10
    ),

    golghar.position.clone()
      .add(
        new THREE.Vector3(
          0,
          3,
          0
        )
      ),

    low ? 1500 : 1900,

    () => {

      state =
        "golghar";


      controls.target.set(
        golghar.position.x,
        2,
        golghar.position.z
      );


      updateUI(
        "04 · GOLGHAR",
        "WE FOUND IT",
        "Happy 20th ❤️",
        "A whole city just to deliver one tiny birthday wish.",
        "Continue ✦",
        "Tap the city · look around"
      );

    }

  );

}


/* =========================================================
   FINAL MESSAGE
========================================================= */

function finish() {

  updateUI(
    "05 · FOR HER",
    "THE REAL DESTINATION",
    "Distance is only a number.",
    "No matter how many kilometres are between us, I would still choose you in every universe.",
    "❤️",
    "The next chapter is yours"
  );


  action.disabled =
    true;


  for (
    let i = 0;
    i < 35;
    i++
  ) {

    const heart =
      sphere(
        0.06,
        0xff8cc5,
        0xff3c99,
        4
      );

    heart.position.set(

      golghar.position.x +
        (Math.random() - 0.5) *
        18,

      2 +
        Math.random() *
        15,

      golghar.position.z +
        (Math.random() - 0.5) *
        18

    );

    city.add(
      heart
    );

    hearts.push(
      heart
    );

  }

}


/* =========================================================
   RAYCASTING
========================================================= */

const raycaster =
  new THREE.Raycaster();

const pointer =
  new THREE.Vector2();


renderer.domElement.addEventListener(
  "pointerup",
  event => {

    if (traveling)
      return;


    const rect =
      renderer.domElement.getBoundingClientRect();


    pointer.x =
      (
        (event.clientX - rect.left) /
        rect.width
      ) *
      2 -
      1;


    pointer.y =
      -(
        (event.clientY - rect.top) /
        rect.height
      ) *
      2 +
      1;


    raycaster.setFromCamera(
      pointer,
      camera
    );


    /* =========================
       SPACE
    ========================= */

    if (
      state === "space"
    ) {

      const hits =
        raycaster.intersectObjects(
          [
            ...planets,
            ...astronauts
          ],
          true
        );


      if (!hits.length)
        return;


      for (
        const hit
        of hits
      ) {

        let object =
          hit.object;


        while (object) {

          if (
            object.userData?.her
          ) {

            goToIndia();

            return;

          }


          object =
            object.parent;

        }

      }


      for (
        const astronaut
        of astronauts
      ) {

        const astronautHit =
          hits.some(
            hit =>
              hit.object ===
                astronaut ||

              astronaut.children
                .includes(
                  hit.object
                )
          );


        if (
          astronautHit
        ) {

          astronaut.userData.emote =
            "wave";

          showEmote(
            "👋"
          );

          say(
            "Astronaut says hi!"
          );

          return;

        }

      }

    }


    /* =========================
       INDIA
    ========================= */

    if (
      state === "india"
    ) {

      if (
        raycaster
          .intersectObject(
            patna,
            true
          )
          .length
      ) {

        goToPatna();

      }

    }


    /* =========================
       CITY
    ========================= */

    if (
      state === "city"
    ) {

      const landmarks = [
        golghar,
        maidan,
        secretariat,
        museum,
        station,
        ghat,
        setu,
        dwar
      ];


      const hits =
        raycaster
          .intersectObjects(
            landmarks,
            true
          );


      if (!hits.length)
        return;


      let object =
        hits[0].object;


      while (object) {

        if (
          object.userData?.landmark ===
          "Golghar"
        ) {

          goToGolghar();

          return;

        }

        object =
          object.parent;

      }


      showEmote(
        "✨"
      );

      say(
        "Explore more of Patna — the city is alive."
      );

    }


    /* =========================
       GOLGHAR
    ========================= */

    if (
      state === "golghar"
    ) {

      showEmote(
        "❤️"
      );

      say(
        "Happy birthday, birthday girl!"
      );

    }

  }
);


/* =========================================================
   MAIN BUTTON
========================================================= */

action.addEventListener(
  "click",
  () => {

    if (traveling)
      return;


    if (
      state === "space"
    ) {

      goToIndia();

    }

    else if (
      state === "india"
    ) {

      goToPatna();

    }

    else if (
      state === "city"
    ) {

      goToGolghar();

    }

    else if (
      state === "golghar"
    ) {

      finish();

    }

  }
);


/* =========================================================
   BACK BUTTON
========================================================= */

back.addEventListener(
  "click",
  () => {

    traveling =
      false;

    state =
      "space";


    groups.universe.visible =
      true;

    groups.india.visible =
      false;

    groups.city.visible =
      false;


    camera.position.set(
      0,
      13,
      52
    );

    controls.target.set(
      0,
      0,
      0
    );


    action.disabled =
      false;


    back.style.display =
      "none";


    updateUI(
      "01 · THE UNIVERSE",
      "A LITTLE UNIVERSE",
      "Find HER.",
      "A brighter little universe made for the girl who turns distance into something beautiful.",
      "Begin the journey ✦",
      "Drag · pinch · tap objects"
    );

  }
);


/* =========================================================
   ANIMATION
========================================================= */

const clock =
  new THREE.Clock();

let lastFrame =
  0;

let visible =
  true;


document.addEventListener(
  "visibilitychange",
  () => {

    visible =
      document.visibilityState ===
      "visible";

  }
);


function animate(
  now
) {

  requestAnimationFrame(
    animate
  );


  if (!visible)
    return;


  if (
    now - lastFrame <
    (low
      ? 1000 / 50
      : 1000 / 60)
  ) {

    return;

  }


  lastFrame =
    now;


  const time =
    clock.getElapsedTime();


  /* =========================
     SPACE
  ========================= */

  if (
    state === "space"
  ) {

    groups.universe.rotation.y =
      time * 0.008;


    planets.forEach(
      planet => {

        const angle =
          time *
          planet.userData.speed +
          planet.userData.angle;


        const radius =
          planet.userData.distance;


        planet.position.set(

          Math.cos(angle) *
            radius,

          Math.sin(
            time * 0.25 +
            planet.userData.angle
          ) * 0.35,

          Math.sin(angle) *
            radius

        );


        planet.rotation.y +=
          0.002;


        /* HER + ME */

        if (
          planet.userData.her
        ) {

          const me =
            planet.children.find(
              child =>
                child.userData?.me
            );


          if (me) {

            const meAngle =
              time * 0.9;

            const meRadius =
              2.25;


            me.position.set(

              Math.cos(
                meAngle
              ) * meRadius,

              Math.sin(
                time * 0.7
              ) * 0.15,

              Math.sin(
                meAngle
              ) * meRadius

            );

          }


          const heartParticles =
            planet.children.filter(
              child =>
                child.userData?.h !==
                undefined
            );


          heartParticles.forEach(
            (heart, index) => {

              const angle =
                time * 0.55 +
                index * 0.7;


              heart.position.set(

                Math.cos(angle) *
                  2.8,

                0.3 +
                  Math.sin(angle) *
                  0.4,

                Math.sin(angle) *
                  2.8

              );

            }
          );

        }

      }
    );


    /* Astronauts */

    astronauts.forEach(
      astronaut => {

        const waving =
          astronaut.userData.emote ===
          "wave";


        astronaut.position.y =
          astronaut.userData.baseY +
          Math.sin(
            time * 0.7 +
            astronaut.userData.phase
          ) *
          0.8;


        astronaut.rotation.z =
          Math.sin(
            time * 0.45 +
            astronaut.userData.phase
          ) *
          0.08;


        if (waving) {

          const arm =
            astronaut.children.find(
              child =>
                child.userData?.arm ===
                1
            );


          if (arm) {

            arm.rotation.z =
              0.9 +
              Math.sin(
                time * 8
              ) *
              0.5;

          }


          if (
            Math.sin(
              time * 5
            ) < -0.8
          ) {

            astronaut.userData.emote =
              "idle";

          }

        }

      }
    );


    /* Stars */

    twinkles.forEach(
      (star, index) => {

        star.scale.setScalar(

          1 +
          Math.sin(
            time * 2 +
            index
          ) *
          0.25

        );

      }
    );

  }


  /* =========================
     CITY
  ========================= */

  if (
    state === "city" ||
    state === "golghar"
  ) {

    /* Boats */

    boats.forEach(
      boat => {

        boat.position.x +=
          boat.userData.speed;


        if (
          boat.position.x >
          85
        ) {

          boat.position.x =
            -85;

        }

      }
    );


    /* Hearts */

    hearts.forEach(
      (heart, index) => {

        heart.position.y +=
          Math.sin(
            time * 1.4 +
            index
          ) *
          0.003;

      }
    );


    /* City lighting */

    cityLight.intensity =
      26 +
      Math.sin(
        time * 1.2
      ) *
      6;


    /* Golghar subtle movement */

    if (
      state === "golghar"
    ) {

      golghar.rotation.y =
        Math.sin(
          time * 0.25
        ) *
        0.025;

    }

  }


  controls.update();

  renderer.render(
    scene,
    camera
  );

}


requestAnimationFrame(
  animate
);


/* =========================================================
   RESIZE
========================================================= */

window.addEventListener(
  "resize",
  () => {

    camera.aspect =
      innerWidth /
      innerHeight;

    camera.updateProjectionMatrix();


    renderer.setSize(
      innerWidth,
      innerHeight
    );


    renderer.setPixelRatio(
      Math.min(
        devicePixelRatio,
        DPR
      )
    );

  }
);


/* =========================================================
   INITIAL UI
========================================================= */

updateUI(

  "01 · THE UNIVERSE",

  "A LITTLE UNIVERSE",

  "Find HER.",

  "A brighter little universe made for the girl who turns distance into something beautiful.",

  "Begin the journey ✦",

  "Drag · pinch · tap objects"

);
