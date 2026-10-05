import * as THREE from "three";

import {
  OrbitControls
} from "https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/controls/OrbitControls.js";


/* =========================================================
   PERFORMANCE
========================================================= */

const isMobile =
  /Android|iPhone|iPad|iPod/i.test(
    navigator.userAgent
  );


const cores =
  navigator.hardwareConcurrency || 4;


const lowPower =
  isMobile || cores <= 4;


const DPR =
  lowPower ? 1 : 1.25;


const STAR_COUNT =
  lowPower ? 750 : 1400;


/* =========================================================
   DOM
========================================================= */

const app =
  document.getElementById("app");

const chapter =
  document.getElementById("chapter");

const eyebrow =
  document.getElementById("eyebrow");

const title =
  document.getElementById("title");

const description =
  document.getElementById("description");

const actionButton =
  document.getElementById("actionButton");

const backButton =
  document.getElementById("backButton");

const interactionHint =
  document.getElementById(
    "interactionHint"
  );


/* =========================================================
   SCENE
========================================================= */

const scene =
  new THREE.Scene();


scene.background =
  new THREE.Color(
    0x02030b
  );


scene.fog =
  new THREE.FogExp2(
    0x02030b,
    .006
  );


/* =========================================================
   CAMERA
========================================================= */

const camera =
  new THREE.PerspectiveCamera(
    55,

    innerWidth / innerHeight,

    .1,

    1800
  );


camera.position.set(
  0,
  14,
  48
);


/* =========================================================
   RENDERER
========================================================= */

const renderer =
  new THREE.WebGLRenderer({

    antialias:
      !lowPower,

    powerPreference:
      "high-performance",

    alpha: false

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
  1.12;


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


controls.enableDamping =
  true;


controls.dampingFactor =
  .055;


controls.enablePan =
  false;


controls.rotateSpeed =
  lowPower ? .4 : .6;


controls.zoomSpeed =
  .7;


controls.minDistance =
  3;


controls.maxDistance =
  100;


/* =========================================================
   LIGHT
========================================================= */

scene.add(
  new THREE.AmbientLight(
    0x72758f,
    1.1
  )
);


const sunLight =
  new THREE.PointLight(
    0xffc36c,
    40,
    160
  );


sunLight.position.set(
  0,
  0,
  0
);


scene.add(
  sunLight
);


/* =========================================================
   MATERIAL HELPER
========================================================= */

function material(
  color,
  emissive = 0,
  intensity = 0
) {

  return new THREE.MeshStandardMaterial({

    color,

    roughness: .65,

    metalness: .05,

    emissive,

    emissiveIntensity:
      intensity

  });

}


/* =========================================================
   SPHERE
========================================================= */

function sphere(
  radius,
  color,
  emissive = 0,
  intensity = 0
) {

  return new THREE.Mesh(

    new THREE.SphereGeometry(

      radius,

      lowPower ? 18 : 26,

      lowPower ? 12 : 18

    ),

    material(
      color,
      emissive,
      intensity
    )

  );

}


/* =========================================================
   SPACE
========================================================= */

const space =
  new THREE.Group();


scene.add(
  space
);


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

  const r =
    100 +
    Math.random() * 450;


  const theta =
    Math.random() *
    Math.PI * 2;


  const phi =
    Math.acos(
      2 * Math.random() - 1
    );


  starPositions[i * 3] =
    r *
    Math.sin(phi) *
    Math.cos(theta);


  starPositions[i * 3 + 1] =
    r *
    Math.cos(phi);


  starPositions[i * 3 + 2] =
    r *
    Math.sin(phi) *
    Math.sin(theta);

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
        lowPower ? .7 : .85,

      transparent: true,

      opacity: .85,

      depthWrite: false

    })

  );


space.add(
  stars
);


/* =========================================================
   COLORED DISTANT STARS
========================================================= */

const coloredStars =
  new THREE.Group();


for (
  let i = 0;
  i < (lowPower ? 30 : 55);
  i++
) {

  const star =
    sphere(
      .06 +
      Math.random() * .1,

      Math.random() > .5
        ? 0xff9fca
        : 0x8eb8ff,

      Math.random() > .5
        ? 0xff5fa7
        : 0x4c75ff,

      2
    );


  star.position.set(

    -90 +
      Math.random() * 180,

    -50 +
      Math.random() * 100,

    -80 +
      Math.random() * 180

  );


  coloredStars.add(
    star
  );

}


space.add(
  coloredStars
);


/* =========================================================
   NEBULA
========================================================= */

function createNebula(
  color,
  position,
  scale
) {

  const canvas =
    document.createElement(
      "canvas"
    );


  canvas.width = 256;

  canvas.height = 256;


  const ctx =
    canvas.getContext(
      "2d"
    );


  const gradient =
    ctx.createRadialGradient(
      128,
      128,
      5,
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

        depthWrite: false,

        blending:
          THREE.AdditiveBlending

      })

    );


  sprite.position.copy(
    position
  );


  sprite.scale.set(
    scale,
    scale,
    1
  );


  space.add(
    sprite
  );

}


createNebula(
  "rgba(100,40,140,.16)",
  new THREE.Vector3(
    -45,
    15,
    -40
  ),
  80
);


createNebula(
  "rgba(20,80,180,.13)",
  new THREE.Vector3(
    50,
    -10,
    -60
  ),
  100
);


createNebula(
  "rgba(255,50,130,.08)",
  new THREE.Vector3(
    0,
    40,
    -100
  ),
  90
);


/* =========================================================
   SHOOTING STARS
========================================================= */

const shootingStars = [];


for (
  let i = 0;
  i < (lowPower ? 4 : 8);
  i++
) {

  const line =
    new THREE.Line(

      new THREE.BufferGeometry()
        .setFromPoints([

          new THREE.Vector3(
            0,
            0,
            0
          ),

          new THREE.Vector3(
            -2,
            .4,
            0
          )

        ]),

      new THREE.LineBasicMaterial({

        color: 0xffffff,

        transparent: true,

        opacity: .6

      })

    );


  line.position.set(

    -35 +
      Math.random() * 70,

    -10 +
      Math.random() * 40,

    -30 -
      Math.random() * 50

  );


  line.userData.speed =
    .08 +
    Math.random() * .08;


  line.userData.reset =
    line.position.x;


  space.add(
    line
  );


  shootingStars.push(
    line
  );

}


/* =========================================================
   ASTRONAUT
========================================================= */

function createAstronaut() {

  const astronaut =
    new THREE.Group();


  /* helmet */

  const helmet =
    new THREE.Mesh(

      new THREE.SphereGeometry(
        .48,
        lowPower ? 12 : 16,
        lowPower ? 8 : 12
      ),

      material(
        0xe9edf4,
        0x111827,
        .15
      )

    );


  helmet.position.y =
    .85;


  astronaut.add(
    helmet
  );


  /* visor */

  const visor =
    new THREE.Mesh(

      new THREE.SphereGeometry(
        .3,
        12,
        8
      ),

      material(
        0x152238,
        0x07152c,
        .5
      )

    );


  visor.position.set(
    0,
    .87,
    .37
  );


  visor.scale.z =
    .35;


  astronaut.add(
    visor
  );


  /* body */

  const body =
    new THREE.Mesh(

      new THREE.BoxGeometry(
        .65,
        .8,
        .42
      ),

      material(
        0xe5e7eb
      )

    );


  body.position.y =
    .2;


  astronaut.add(
    body
  );


  /* arms */

  [-1, 1].forEach(
    side => {

      const arm =
        new THREE.Mesh(

          new THREE.BoxGeometry(
            .18,
            .65,
            .18
          ),

          material(
            0xd9dde4
          )

        );


      arm.position.set(

        side * .46,

        .2,

        0

      );


      arm.rotation.z =
        side * .3;


      astronaut.add(
        arm
      );

    }
  );


  /* legs */

  [-1, 1].forEach(
    side => {

      const leg =
        new THREE.Mesh(

          new THREE.BoxGeometry(
            .2,
            .6,
            .2
          ),

          material(
            0xd8dce3
          )

        );


      leg.position.set(

        side * .18,

        -.55,

        0

      );


      astronaut.add(
        leg
      );

    }
  );


  return astronaut;

}


const astronauts = [];


for (
  let i = 0;
  i < (lowPower ? 2 : 4);
  i++
) {

  const astronaut =
    createAstronaut();


  astronaut.position.set(

    -20 +
      Math.random() * 40,

    -4 +
      Math.random() * 18,

    -18 -
      Math.random() * 25

  );


  astronaut.scale.setScalar(
    .7 +
    Math.random() * .5
  );


  astronaut.userData.phase =
    Math.random() * 10;


  space.add(
    astronaut
  );


  astronauts.push(
    astronaut
  );

}


/* =========================================================
   SOLAR SYSTEM
========================================================= */

const solarSystem =
  new THREE.Group();


space.add(
  solarSystem
);


/* =========================================================
   SUN
========================================================= */

const sun =
  sphere(
    3.3,
    0xffb341,
    0xff6500,
    2.5
  );


solarSystem.add(
  sun
);


/* =========================================================
   PLANETS
========================================================= */

const planets = [];


const planetData = [

  {
    distance: 8,
    size: .5,
    color: 0xa8adb8,
    speed: .18
  },

  {
    distance: 11,
    size: .72,
    color: 0xc89a68,
    speed: .14
  },

  {
    distance: 15,
    size: 1.35,
    color: 0x3e72ff,
    speed: .105,
    her: true
  },

  {
    distance: 20,
    size: .75,
    color: 0xc05242,
    speed: .08
  },

  {
    distance: 27,
    size: 1.9,
    color: 0xb99364,
    speed: .045
  }

];


function label(
  text,
  color = "#fff"
) {

  const canvas =
    document.createElement(
      "canvas"
    );


  canvas.width = 512;

  canvas.height = 128;


  const ctx =
    canvas.getContext(
      "2d"
    );


  ctx.font =
    "700 52px Arial";


  ctx.fillStyle =
    color;


  ctx.textAlign =
    "center";


  ctx.textBaseline =
    "middle";


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
    4,
    1,
    1
  );


  return sprite;

}


planetData.forEach(
  data => {

    /* orbit */

    const orbit =
      new THREE.Mesh(

        new THREE.RingGeometry(

          data.distance - .012,

          data.distance + .012,

          lowPower
            ? 48
            : 72

        ),

        new THREE.MeshBasicMaterial({

          color: 0x626474,

          transparent: true,

          opacity: .16,

          side:
            THREE.DoubleSide

        })

      );


    orbit.rotation.x =
      Math.PI / 2;


    solarSystem.add(
      orbit
    );


    /* planet */

    const planet =
      sphere(

        data.size,

        data.color,

        data.her
          ? 0x153caa
          : 0,

        data.her
          ? .65
          : 0

      );


    planet.userData.distance =
      data.distance;


    planet.userData.speed =
      data.speed;


    planet.userData.angle =
      Math.random() *
      Math.PI * 2;


    planet.userData.her =
      Boolean(data.her);


    solarSystem.add(
      planet
    );


    planets.push(
      planet
    );


    /* HER */

    if (
      data.her
    ) {

      const herLabel =
        label(
          "HER"
        );


      herLabel.position.y =
        2;


      herLabel.scale.set(
        2.5,
        .625,
        1
      );


      planet.add(
        herLabel
      );


      /* ME */

      const me =
        sphere(
          .38,
          0xff72b5,
          0xff277e,
          2
        );


      me.userData.me =
        true;


      planet.add(
        me
      );


      const meLabel =
        label(
          "ME",
          "#ffb5d6"
        );


      meLabel.position.y =
        .7;


      meLabel.scale.set(
        1.8,
        .45,
        1
      );


      me.add(
        meLabel
      );

    }

  }
);


/* =========================================================
   INDIA
========================================================= */

const india =
  new THREE.Group();


india.visible =
  false;


scene.add(
  india
);


/* stylized large India */

const indiaShape =
  new THREE.Shape();


indiaShape.moveTo(
  -7, 6
);

indiaShape.lineTo(
  -3, 7
);

indiaShape.lineTo(
  2, 6
);

indiaShape.lineTo(
  6, 2
);

indiaShape.lineTo(
  4, -2
);

indiaShape.lineTo(
  2, -7
);

indiaShape.lineTo(
  -1, -5
);

indiaShape.lineTo(
  -4, -2
);

indiaShape.lineTo(
  -6, 2
);

indiaShape.closePath();


const indiaGeometry =
  new THREE.ExtrudeGeometry(

    indiaShape,

    {

      depth: .65,

      bevelEnabled: true,

      bevelSize: .14,

      bevelThickness: .1,

      bevelSegments:
        lowPower ? 1 : 2

    }

  );


const indiaMesh =
  new THREE.Mesh(

    indiaGeometry,

    material(
      0x426746,
      0x122a15,
      .2
    )

  );


indiaMesh.rotation.x =
  -Math.PI / 2;


india.add(
  indiaMesh
);


/* =========================================================
   INDIA LIGHTS
========================================================= */

for (
  let i = 0;
  i < (lowPower ? 40 : 75);
  i++
) {

  const light =
    sphere(
      .045,
      0xffd27a,
      0xffa600,
      2
    );


  light.position.set(

    -6 +
      Math.random() * 12,

    .7,

    -5 +
      Math.random() * 10

  );


  india.add(
    light
  );

}


/* =========================================================
   PATNA
========================================================= */

const patna =
  sphere(
    .4,
    0xff6eaf,
    0xff2383,
    3
  );


patna.position.set(
  .7,
  1,
  1.4
);


patna.userData.patna =
  true;


india.add(
  patna
);


const patnaLabel =
  label(
    "PATNA",
    "#ffd2e6"
  );


patnaLabel.position.y =
  1;


patnaLabel.scale.set(
  3,
  .75,
  1
);


patna.add(
  patnaLabel
);


/* =========================================================
   PATNA CITY
========================================================= */

const city =
  new THREE.Group();


city.visible =
  false;


scene.add(
  city
);


/* =========================================================
   CITY GROUND
========================================================= */

const cityGround =
  new THREE.Mesh(

    new THREE.PlaneGeometry(
      80,
      65
    ),

    material(
      0x17231c
    )

  );


cityGround.rotation.x =
  -Math.PI / 2;


city.add(
  cityGround
);


/* =========================================================
   GANGA
========================================================= */

const ganga =
  new THREE.Mesh(

    new THREE.PlaneGeometry(
      80,
      13
    ),

    new THREE.MeshStandardMaterial({

      color: 0x234f6a,

      roughness: .2,

      metalness: .25

    })

  );


ganga.rotation.x =
  -Math.PI / 2;


ganga.position.set(
  0,
  .03,
  18
);


city.add(
  ganga
);


/* =========================================================
   ROADS
========================================================= */

function road(
  x,
  z,
  width,
  depth
) {

  const mesh =
    new THREE.Mesh(

      new THREE.PlaneGeometry(
        width,
        depth
      ),

      material(
        0x28272b
      )

    );


  mesh.rotation.x =
    -Math.PI / 2;


  mesh.position.set(
    x,
    .06,
    z
  );


  city.add(
    mesh
  );

}


road(
  0,
  4,
  80,
  3
);


road(
  -16,
  0,
  3,
  60
);


road(
  17,
  0,
  3,
  60
);


/* =========================================================
   BUILDINGS
========================================================= */

const buildingCount =
  lowPower ? 70 : 105;


for (
  let i = 0;
  i < buildingCount;
  i++
) {

  const width =
    .7 +
    Math.random() * 1.8;


  const depth =
    .7 +
    Math.random() * 1.8;


  const height =
    .8 +
    Math.random() * 4.5;


  const building =
    new THREE.Mesh(

      new THREE.BoxGeometry(
        width,
        height,
        depth
      ),

      material(

        Math.random() > .8
          ? 0x655765
          : 0x46464e

      )

    );


  building.position.set(

    -35 +
      Math.random() * 70,

    height / 2,

    -27 +
      Math.random() * 42

  );


  city.add(
    building
  );

}


/* =========================================================
   STREET LIGHTS
========================================================= */

const streetLights =
  new THREE.Group();


for (
  let i = 0;
  i < 22;
  i++
) {

  const pole =
    new THREE.Mesh(

      new THREE.CylinderGeometry(
        .035,
        .055,
        2.2,
        6
      ),

      material(
        0x50505a
      )

    );


  pole.position.set(

    -35 +
      i * 3.3,

    1.1,

    5.4

  );


  streetLights.add(
    pole
  );


  const lamp =
    sphere(
      .1,
      0xffd58a,
      0xffa91c,
      4
    );


  lamp.position.set(

    pole.position.x,

    2.25,

    pole.position.z

  );


  streetLights.add(
    lamp
  );

}


city.add(
  streetLights
);


/* =========================================================
   POSTERS
========================================================= */

function createPoster(
  text,
  subtext
) {

  const canvas =
    document.createElement(
      "canvas"
    );


  canvas.width = 512;

  canvas.height = 700;


  const ctx =
    canvas.getContext(
      "2d"
    );


  /* background */

  const gradient =
    ctx.createLinearGradient(
      0,
      0,
      0,
      700
    );


  gradient.addColorStop(
    0,
    "#25132b"
  );


  gradient.addColorStop(
    1,
    "#130b20"
  );


  ctx.fillStyle =
    gradient;


  ctx.fillRect(
    0,
    0,
    512,
    700
  );


  /* stars */

  for (
    let i = 0;
    i < 50;
    i++
  ) {

    ctx.fillStyle =
      "rgba(255,255,255,.7)";


    ctx.beginPath();

    ctx.arc(

      Math.random() * 512,

      Math.random() * 300,

      Math.random() * 2,

      0,

      Math.PI * 2

    );

    ctx.fill();

  }


  /* heart */

  ctx.fillStyle =
    "#ff6fae";


  ctx.font =
    "100px Arial";


  ctx.textAlign =
    "center";


  ctx.fillText(
    "♥",
    256,
    180
  );


  /* main */

  ctx.fillStyle =
    "#ffffff";


  ctx.font =
    "bold 46px Arial";


  ctx.fillText(
    text,
    256,
    300
  );


  ctx.font =
    "bold 25px Arial";


  ctx.fillStyle =
    "#ffb7d4";


  ctx.fillText(
    subtext,
    256,
    355
  );


  ctx.font =
    "18px Arial";


  ctx.fillStyle =
    "#c5bdc9";


  ctx.fillText(
    "20 years of being wonderful ✦",
    256,
    440
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
        4.1
      ),

      new THREE.MeshBasicMaterial({

        map: texture,

        side:
          THREE.DoubleSide

      })

    );


  return poster;

}


const poster1 =
  createPoster(
    "HAPPY",
    "BIRTHDAY ❤️"
  );


poster1.position.set(
  -8,
  2.8,
  3
);


poster1.rotation.y =
  Math.PI / 2;


city.add(
  poster1
);


const poster2 =
  createPoster(
    "20 ✦",
    "JUST FOR HER"
  );


poster2.position.set(
  10,
  2.8,
  3
);


poster2.rotation.y =
  -Math.PI / 2;


city.add(
  poster2
);


const poster3 =
  createPoster(
    "FOR HER",
    "WITH LOVE"
  );


poster3.position.set(
  -5,
  2.8,
  -10
);


city.add(
  poster3
);


/* =========================================================
   GOLGHAR
========================================================= */

const golghar =
  new THREE.Group();


golghar.position.set(
  0,
  0,
  -5
);


golghar.userData.golghar =
  true;


/* base */

const base =
  new THREE.Mesh(

    new THREE.CylinderGeometry(
      3.4,
      3.8,
      1.2,
      lowPower ? 24 : 32
    ),

    material(
      0xc68d58
    )

  );


base.position.y =
  .6;


golghar.add(
  base
);


/* dome */

const dome =
  new THREE.Mesh(

    new THREE.SphereGeometry(
      3.7,
      lowPower ? 22 : 30,
      lowPower ? 14 : 18,
      0,
      Math.PI * 2,
      0,
      Math.PI / 2
    ),

    material(
      0xb97842
    )

  );


dome.scale.y =
  1.25;


dome.position.y =
  1.1;


golghar.add(
  dome
);


/* stairs */

const stairs =
  lowPower ? 65 : 100;


for (
  let i = 0;
  i < stairs;
  i++
) {

  const angle =
    i /
    stairs *
    Math.PI *
    5.4;


  const y =
    .4 +
    i / stairs *
    5;


  const stair =
    new THREE.Mesh(

      new THREE.BoxGeometry(
        .2,
        .045,
        .7
      ),

      material(
        0x754f37
      )

    );


  stair.position.set(

    Math.cos(angle) *
      3.9,

    y,

    Math.sin(angle) *
      3.9

  );


  stair.rotation.y =
    -angle;


  golghar.add(
    stair
  );

}


/* label */

const golgharLabel =
  label(
    "GOLGHAR",
    "#ffe2ad"
  );


golgharLabel.position.y =
  6.5;


golgharLabel.scale.set(
  4,
  1,
  1
);


golghar.add(
  golgharLabel
);


city.add(
  golghar
);


/* =========================================================
   CITY DECORATION
========================================================= */

const heartLights =
  new THREE.Group();


for (
  let i = 0;
  i < 14;
  i++
) {

  const light =
    sphere(
      .12,
      0xff76b8,
      0xff287f,
      4
    );


  const angle =
    i / 14 *
    Math.PI * 2;


  light.position.set(

    Math.cos(angle) *
      13,

    2 +
      Math.sin(
        i * 2
      ) * .7,

    Math.sin(angle) *
      13

  );


  heartLights.add(
    light
  );

}


city.add(
  heartLights
);


/* =========================================================
   STATE
========================================================= */

let state =
  "space";


let travelling =
  false;


/* =========================================================
   UI
========================================================= */

function setUI(
  data
) {

  chapter.textContent =
    data.chapter;


  eyebrow.textContent =
    data.eyebrow;


  title.textContent =
    data.title;


  description.textContent =
    data.description;


  actionButton.textContent =
    data.button;


  interactionHint.textContent =
    data.hint;

}


/* =========================================================
   CINEMATIC TRANSITION
========================================================= */

/*
   Instead of:

   camera A
        ↓
   camera B

   we use:

   A → HIGH ARC → B

   This makes the journey feel like
   actual travelling.
*/

function cinematicMove({

  position,

  target,

  duration = 1800,

  callback

}) {

  travelling =
    true;


  controls.enabled =
    false;


  const start =
    camera.position.clone();


  const startTarget =
    controls.target.clone();


  const end =
    position.clone();


  const endTarget =
    target.clone();


  const mid =
    start.clone()
      .lerp(
        end,
        .5
      );


  mid.y +=
    10;


  mid.z +=
    5;


  const startTime =
    performance.now();


  function frame(
    now
  ) {

    let p =
      (now - startTime) /
      duration;


    p =
      Math.min(
        p,
        1
      );


    /* smootherstep */

    const eased =
      p * p * p *
      (
        p *
          (p * 6 - 15)
        + 10
      );


    /*
      Quadratic curve:
      start → mid → end
    */

    const a =
      new THREE.Vector3();


    const b =
      new THREE.Vector3();


    a.lerpVectors(
      start,
      mid,
      eased
    );


    b.lerpVectors(
      mid,
      end,
      eased
    );


    camera.position.lerpVectors(
      a,
      b,
      eased
    );


    controls.target.lerpVectors(

      startTarget,

      endTarget,

      eased

    );


    controls.update();


    if (
      p < 1
    ) {

      requestAnimationFrame(
        frame
      );

    } else {

      travelling =
        false;


      controls.enabled =
        true;


      if (
        callback
      ) {

        callback();

      }

    }

  }


  requestAnimationFrame(
    frame
  );

}


/* =========================================================
   SPACE → INDIA
========================================================= */

function goToIndia() {

  travelling =
    true;


  setUI({

    chapter:
      "01 → 02",

    eyebrow:
      "FOLLOW THE LIGHT",

    title:
      "Closer…",

    description:
      "Let's find her."

    ,

    button:
      "Travelling…",

    hint:
      "✦"

  });


  actionButton.disabled =
    true;


  const her =
    planets.find(
      p =>
        p.userData.her
    );


  const destination =
    her.position
      .clone()
      .add(
        new THREE.Vector3(
          0,
          3,
          7
        )
      );


  cinematicMove({

    position:
      destination,

    target:
      her.position,

    duration:
      lowPower ? 1700 : 2200,

    callback() {

      space.visible =
        false;


      india.visible =
        true;


      camera.position.set(
        0,
        13,
        32
      );


      controls.target.set(
        0,
        0,
        0
      );


      state =
        "india";


      actionButton.disabled =
        false;


      setUI({

        chapter:
          "02 · INDIA",

        eyebrow:
          "HER WORLD",

        title:
          "There she is.",

        description:
          "From all those stars, we finally found the right place.",

        button:
          "Find Patna →",

        hint:
          "Tap the glowing PATNA"

      });

      backButton.style.display =
        "block";

    }

  });

}


/* =========================================================
   INDIA → PATNA
========================================================= */

function goToPatna() {

  actionButton.disabled =
    true;


  setUI({

    chapter:
      "02 → 03",

    eyebrow:
      "COMING CLOSER",

    title:
      "India…",

    description:
      "Now let's find the city.",

    button:
      "Travelling…",

    hint:
      "✦"

  });


  cinematicMove({

    position:
      new THREE.Vector3(
        0,
        5,
        17
      ),

    target:
      new THREE.Vector3(
        .7,
        0,
        1.4
      ),

    duration:
      lowPower ? 1600 : 2100,

    callback() {

      india.visible =
        false;


      city.visible =
        true;


      camera.position.set(
        0,
        20,
        42
      );


      controls.target.set(
        0,
        0,
        0
      );


      state =
        "patna";


      actionButton.disabled =
        false;


      setUI({

        chapter:
          "03 · PATNA",

        eyebrow:
          "THE CITY",

        title:
          "Welcome to Patna.",

        description:
          "A little city. A lot of memories waiting to be made.",

        button:
          "Explore the city →",

        hint:
          "Drag · pinch · explore"

      });

    }

  });

}


/* =========================================================
   PATNA → GOLGHAR
========================================================= */

function goToGolghar() {

  actionButton.disabled =
    true;


  setUI({

    chapter:
      "03 → 04",

    eyebrow:
      "ONE LAST STOP",

    title:
      "Almost there…",

    description:
      "Follow the lights.",

    button:
      "Travelling…",

    hint:
      "❤️"

  });


  cinematicMove({

    position:
      new THREE.Vector3(
        10,
        7,
        13
      ),

    target:
      golghar.position
        .clone()
        .add(
          new THREE.Vector3(
            0,
            2,
            0
          )
        ),

    duration:
      lowPower ? 1700 : 2200,

    callback() {

      state =
        "golghar";


      actionButton.disabled =
        false;


      setUI({

        chapter:
          "04 · GOLGHAR",

        eyebrow:
          "WE FOUND IT",

        title:
          "Happy 20th ❤️",

        description:
          "This is only the beginning of your little birthday journey.",

        button:
          "Continue ✦",

        hint:
          "Explore · look around · smile"

      });

    }

  });

}


/* =========================================================
   NEXT
========================================================= */

function continueJourney() {

  title.textContent =
    "For the girl I found among the stars.";


  description.textContent =
    "The next chapter is made of memories, places, photographs and all the little things that make you… you. ❤️";


  actionButton.textContent =
    "Next chapter →";


  interactionHint.textContent =
    "More is coming…";


  actionButton.disabled =
    true;

}


/* =========================================================
   BUTTON
========================================================= */

actionButton.addEventListener(
  "click",
  () => {

    if (
      travelling
    ) {
      return;
    }


    if (
      state ===
      "space"
    ) {

      goToIndia();

    }

    else if (
      state ===
      "india"
    ) {

      goToPatna();

    }

    else if (
      state ===
      "patna"
    ) {

      goToGolghar();

    }

    else if (
      state ===
      "golghar"
    ) {

      continueJourney();

    }

  }
);


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

    if (
      travelling
    ) {
      return;
    }


    const rect =
      renderer.domElement
        .getBoundingClientRect();


    pointer.x =
      (
        event.clientX -
        rect.left
      ) /
      rect.width *
      2 - 1;


    pointer.y =
      -(
        (
          event.clientY -
          rect.top
        ) /
        rect.height
      ) *
      2 + 1;


    raycaster.setFromCamera(
      pointer,
      camera
    );


    /* HER */

    if (
      state ===
      "space"
    ) {

      const hits =
        raycaster.intersectObjects(
          planets,
          true
        );


      const herHit =
        hits.some(
          hit => {

            let object =
              hit.object;


            while (
              object
            ) {

              if (
                object.userData?.her
              ) {

                return true;

              }


              object =
                object.parent;

            }


            return false;

          }
        );


      if (
        herHit
      ) {

        goToIndia();

      }

    }


    /* PATNA */

    else if (
      state ===
      "india"
    ) {

      const hits =
        raycaster.intersectObject(
          patna,
          true
        );


      if (
        hits.length
      ) {

        goToPatna();

      }

    }


    /* GOLGHAR */

    else if (
      state ===
      "patna"
    ) {

      const hits =
        raycaster.intersectObject(
          golghar,
          true
        );


      if (
        hits.length
      ) {

        goToGolghar();

      }

    }

  }
);


/* =========================================================
   BACK
========================================================= */

backButton.addEventListener(
  "click",
  () => {

    travelling =
      false;


    state =
      "space";


    space.visible =
      true;


    india.visible =
      false;


    city.visible =
      false;


    camera.position.set(
      0,
      14,
      48
    );


    controls.target.set(
      0,
      0,
      0
    );


    actionButton.disabled =
      false;


    setUI({

      chapter:
        "01 · THE UNIVERSE",

      eyebrow:
        "A LITTLE UNIVERSE",

      title:
        "Made for her.",

      description:
        "Somewhere between billions of stars, I found my favourite person.",

      button:
        "Find HER ✦",

      hint:
        "Drag · pinch · tap HER"

    });


    backButton.style.display =
      "none";

  }
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
   ANIMATION
========================================================= */

const clock =
  new THREE.Clock();


let lastFrame =
  0;


const frameInterval =
  lowPower
    ? 1000 / 55
    : 1000 / 60;


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


  if (
    !visible
  ) {
    return;
  }


  if (
    now -
    lastFrame <
    frameInterval
  ) {
    return;
  }


  lastFrame =
    now;


  const time =
    clock.getElapsedTime();


  /* =====================================================
     SPACE ANIMATION
  ===================================================== */

  if (
    state ===
    "space"
  ) {

    solarSystem.rotation.y =
      time * .011;


    planets.forEach(
      planet => {

        const radius =
          planet.userData.distance;


        const speed =
          planet.userData.speed;


        const angle =
          planet.userData.angle;


        planet.position.x =
          Math.cos(
            time * speed +
            angle
          ) *
          radius;


        planet.position.z =
          Math.sin(
            time * speed +
            angle
          ) *
          radius;


        planet.rotation.y +=
          .002;

      }
    );


    /* ME around HER */

    const her =
      planets.find(
        p =>
          p.userData.her
      );


    if (
      her
    ) {

      const me =
        her.children.find(
          c =>
            c.userData?.me
        );


      if (
        me
      ) {

        const angle =
          time * .9;


        const radius =
          2.3;


        me.position.x =
          Math.cos(angle) *
          radius;


        me.position.z =
          Math.sin(angle) *
          radius;

      }

    }


    /* astronauts */

    astronauts.forEach(
      (astronaut, i) => {

        astronaut.position.y +=
          Math.sin(
            time * .7 +
            astronaut.userData.phase
          ) *
          .003;


        astronaut.rotation.y +=
          .0015;

      }
    );


    /* shooting stars */

    shootingStars.forEach(
      star => {

        star.position.x +=
          star.userData.speed;


        if (
          star.position.x >
          50
        ) {

          star.position.x =
            -50;

        }

      }
    );


    stars.rotation.y =
      time * .00035;

  }


  /* =====================================================
     CITY
  ===================================================== */

  if (
    state ===
    "patna" ||
    state ===
    "golghar"
  ) {

    golghar.rotation.y =
      Math.sin(
        time * .25
      ) *
      .025;


    heartLights.children
      .forEach(
        (light, i) => {

          light.material.emissiveIntensity =
            2.5 +
            Math.sin(
              time * 2 +
              i
            ) *
            1.2;

        }
      );

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
