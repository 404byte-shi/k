import * as THREE from "three";

import {
  OrbitControls
} from "https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/controls/OrbitControls.js";


/* =====================================================
   DEVICE / PERFORMANCE
===================================================== */

const isMobile =
  /Android|iPhone|iPad|iPod/i.test(
    navigator.userAgent
  );


const isLowPower =
  isMobile ||
  navigator.hardwareConcurrency <= 4;


/*
  Lower pixel ratio is one of the biggest
  performance improvements for phones.
*/

const MAX_PIXEL_RATIO =
  isLowPower ? 1 : 1.25;


/*
  Fewer stars on mobile.
*/

const STAR_COUNT =
  isLowPower ? 650 : 1100;


/* =====================================================
   DOM
===================================================== */

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


/* =====================================================
   SCENE
===================================================== */

const scene =
  new THREE.Scene();


scene.background =
  new THREE.Color(
    0x02030b
  );


/*
  Fog adds depth but is very cheap.
*/

scene.fog =
  new THREE.FogExp2(
    0x02030b,
    0.009
  );


/* =====================================================
   CAMERA
===================================================== */

const camera =
  new THREE.PerspectiveCamera(
    55,

    window.innerWidth /
      window.innerHeight,

    0.1,

    1500
  );


camera.position.set(
  0,
  13,
  45
);


/* =====================================================
   RENDERER
===================================================== */

const renderer =
  new THREE.WebGLRenderer({

    /*
      Antialiasing is disabled
      on mobile to save GPU power.
    */

    antialias: !isLowPower,

    powerPreference:
      "high-performance",

    alpha: false

  });


renderer.setPixelRatio(
  Math.min(
    window.devicePixelRatio,
    MAX_PIXEL_RATIO
  )
);


renderer.setSize(
  window.innerWidth,
  window.innerHeight
);


renderer.outputColorSpace =
  THREE.SRGBColorSpace;


renderer.toneMapping =
  THREE.ACESFilmicToneMapping;


renderer.toneMappingExposure =
  1.05;


app.appendChild(
  renderer.domElement
);


/* =====================================================
   CONTROLS
===================================================== */

const controls =
  new OrbitControls(
    camera,
    renderer.domElement
  );


controls.enableDamping =
  true;


controls.dampingFactor =
  0.055;


controls.enablePan =
  false;


controls.rotateSpeed =
  isMobile ? 0.45 : 0.65;


controls.zoomSpeed =
  isMobile ? 0.7 : 1;


controls.minDistance =
  4;


controls.maxDistance =
  90;


/* =====================================================
   LIGHTING
===================================================== */

scene.add(

  new THREE.AmbientLight(
    0x777791,
    1
  )

);


const sunLight =
  new THREE.PointLight(
    0xffc66d,
    35,
    140
  );


sunLight.position.set(
  0,
  0,
  0
);


scene.add(
  sunLight
);


/* =====================================================
   MATERIAL
===================================================== */

function createMaterial(
  color,
  emissive = 0,
  emissiveIntensity = 0
) {

  return new THREE.MeshStandardMaterial({

    color,

    roughness: 0.7,

    metalness: 0,

    emissive,

    emissiveIntensity

  });

}


/* =====================================================
   SPHERE
===================================================== */

function createSphere(
  radius,
  color,
  emissive = 0,
  intensity = 0
) {

  return new THREE.Mesh(

    new THREE.SphereGeometry(

      radius,

      isLowPower ? 18 : 24,

      isLowPower ? 12 : 16

    ),

    createMaterial(
      color,
      emissive,
      intensity
    )

  );

}


/* =====================================================
   3D LABEL
===================================================== */

function createLabel(
  text,
  color = "#ffffff"
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


  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );


  ctx.font =
    "700 52px Arial";


  ctx.fillStyle =
    color;


  ctx.textAlign =
    "center";


  ctx.textBaseline =
    "middle";


  ctx.shadowColor =
    "rgba(255,255,255,.35)";


  ctx.shadowBlur = 10;


  ctx.fillText(
    text,
    canvas.width / 2,
    canvas.height / 2
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
    4.5,
    1.125,
    1
  );


  return sprite;

}


/* =====================================================
   STAR FIELD
===================================================== */

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
    Math.random() * 350;


  const theta =
    Math.random() *
    Math.PI *
    2;


  const phi =
    Math.acos(
      2 * Math.random() - 1
    );


  starPositions[
    i * 3
  ] =
    radius *
    Math.sin(phi) *
    Math.cos(theta);


  starPositions[
    i * 3 + 1
  ] =
    radius *
    Math.cos(phi);


  starPositions[
    i * 3 + 2
  ] =
    radius *
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


const starMaterial =
  new THREE.PointsMaterial({

    color: 0xffffff,

    size:
      isLowPower
        ? 0.75
        : 0.8,

    transparent: true,

    opacity: 0.75,

    depthWrite: false

  });


const stars =
  new THREE.Points(
    starGeometry,
    starMaterial
  );


scene.add(
  stars
);


/* =====================================================
   SOLAR SYSTEM
===================================================== */

const solarSystem =
  new THREE.Group();


scene.add(
  solarSystem
);


/* =====================================================
   SUN
===================================================== */

const sun =
  createSphere(
    3.2,
    0xffa52e,
    0xff6500,
    2
  );


solarSystem.add(
  sun
);


/* =====================================================
   PLANETS
===================================================== */

const planets = [];


const planetData = [

  {
    distance: 8,
    size: 0.48,
    color: 0xaeb3bd,
    speed: 0.22
  },

  {
    distance: 11,
    size: 0.68,
    color: 0xd1a87b,
    speed: 0.17
  },

  {
    distance: 15,
    size: 1.25,
    color: 0x3f75ff,
    speed: 0.12,
    her: true
  },

  {
    distance: 20,
    size: 0.72,
    color: 0xb94c3c,
    speed: 0.09
  },

  {
    distance: 28,
    size: 2,
    color: 0xc39b69,
    speed: 0.055
  }

];


planetData.forEach(
  (data) => {

    /* -----------------------------
       ORBIT
    ----------------------------- */

    const orbit =
      new THREE.Mesh(

        new THREE.RingGeometry(

          data.distance - 0.012,

          data.distance + 0.012,

          isLowPower
            ? 48
            : 72

        ),

        new THREE.MeshBasicMaterial({

          color: 0x666675,

          transparent: true,

          opacity: 0.15,

          side:
            THREE.DoubleSide

        })

      );


    orbit.rotation.x =
      Math.PI / 2;


    solarSystem.add(
      orbit
    );


    /* -----------------------------
       PLANET
    ----------------------------- */

    const planet =
      createSphere(

        data.size,

        data.color,

        data.her
          ? 0x143a9d
          : 0,

        data.her
          ? 0.65
          : 0

      );


    planet.userData.distance =
      data.distance;


    planet.userData.speed =
      data.speed;


    planet.userData.angle =
      Math.random() *
      Math.PI *
      2;


    planet.userData.her =
      Boolean(data.her);


    solarSystem.add(
      planet
    );


    planets.push(
      planet
    );


    /* -----------------------------
       HER
    ----------------------------- */

    if (
      data.her
    ) {

      const herLabel =
        createLabel(
          "HER"
        );


      herLabel.position.y =
        1.9;


      herLabel.scale.set(
        2.5,
        0.625,
        1
      );


      planet.add(
        herLabel
      );


      /* ---------------------------
         ME
      --------------------------- */

      const me =
        createSphere(

          0.38,

          0xff69ae,

          0xff267d,

          2

        );


      me.userData.me =
        true;


      me.position.set(
        2.4,
        0,
        0
      );


      planet.add(
        me
      );


      const meLabel =
        createLabel(
          "ME",
          "#ffb6d7"
        );


      meLabel.position.y =
        0.7;


      meLabel.scale.set(
        1.8,
        0.45,
        1
      );


      me.add(
        meLabel
      );

    }

  }
);


/* =====================================================
   INDIA
===================================================== */

const india =
  new THREE.Group();


india.visible =
  false;


scene.add(
  india
);


/*
  Stylized India geometry.

  This is intentionally lightweight.
*/

const indiaShape =
  new THREE.Shape();


indiaShape.moveTo(
  -5,
  4
);

indiaShape.lineTo(
  -2,
  5
);

indiaShape.lineTo(
  1,
  4.3
);

indiaShape.lineTo(
  4,
  1
);

indiaShape.lineTo(
  2,
  -2
);

indiaShape.lineTo(
  1,
  -6
);

indiaShape.lineTo(
  -1,
  -4
);

indiaShape.lineTo(
  -3,
  -2
);

indiaShape.lineTo(
  -4,
  1
);

indiaShape.closePath();


const indiaGeometry =
  new THREE.ExtrudeGeometry(

    indiaShape,

    {

      depth: 0.55,

      bevelEnabled: true,

      bevelSize: 0.12,

      bevelThickness: 0.1,

      bevelSegments:
        isLowPower ? 1 : 2

    }

  );


const indiaMesh =
  new THREE.Mesh(

    indiaGeometry,

    createMaterial(
      0x56704e
    )

  );


indiaMesh.rotation.x =
  -Math.PI / 2;


india.add(
  indiaMesh
);


/* =====================================================
   PATNA MARKER
===================================================== */

const patna =
  createSphere(
    0.38,
    0xff6eaf,
    0xff2d86,
    2.5
  );


patna.userData.patna =
  true;


patna.position.set(
  0.5,
  0.8,
  1.3
);


india.add(
  patna
);


const patnaLabel =
  createLabel(
    "PATNA"
  );


patnaLabel.position.y =
  1;


patnaLabel.scale.set(
  2.8,
  0.7,
  1
);


patna.add(
  patnaLabel
);


/* =====================================================
   PATNA CITY
===================================================== */

const city =
  new THREE.Group();


city.visible =
  false;


scene.add(
  city
);


/* =====================================================
   CITY GROUND
===================================================== */

const ground =
  new THREE.Mesh(

    new THREE.PlaneGeometry(
      42,
      30
    ),

    createMaterial(
      0x17231d
    )

  );


ground.rotation.x =
  -Math.PI / 2;


city.add(
  ground
);


/* =====================================================
   GANGA
===================================================== */

const ganga =
  new THREE.Mesh(

    new THREE.PlaneGeometry(
      42,
      6
    ),

    createMaterial(
      0x24506b
    )

  );


ganga.rotation.x =
  -Math.PI / 2;


ganga.position.set(
  0,
  0.03,
  7
);


city.add(
  ganga
);


/* =====================================================
   BUILDINGS
===================================================== */

const buildingCount =
  isLowPower ? 28 : 42;


for (
  let i = 0;
  i < buildingCount;
  i++
) {

  const width =
    0.8 +
    Math.random() * 1.4;


  const height =
    0.5 +
    Math.random() * 2;


  const depth =
    0.8 +
    Math.random() * 1.3;


  const building =
    new THREE.Mesh(

      new THREE.BoxGeometry(
        width,
        height,
        depth
      ),

      createMaterial(
        0x4d4b54
      )

    );


  building.position.set(

    -19 +
      Math.random() * 38,

    height / 2,

    -8 +
      Math.random() * 14

  );


  city.add(
    building
  );

}


/* =====================================================
   GOLGHAR
===================================================== */

const golghar =
  new THREE.Group();


golghar.userData.golghar =
  true;


golghar.position.set(
  0,
  0.1,
  -2
);


/* -----------------------------
   BASE
----------------------------- */

const golgharBase =
  new THREE.Mesh(

    new THREE.CylinderGeometry(
      2.3,
      2.5,
      1,
      isLowPower ? 24 : 32
    ),

    createMaterial(
      0xc68c55
    )

  );


golgharBase.position.y =
  0.5;


golghar.add(
  golgharBase
);


/* -----------------------------
   DOME
----------------------------- */

const dome =
  new THREE.Mesh(

    new THREE.SphereGeometry(

      2.5,

      isLowPower ? 20 : 28,

      isLowPower ? 12 : 16,

      0,

      Math.PI * 2,

      0,

      Math.PI / 2

    ),

    createMaterial(
      0xb97840
    )

  );


dome.scale.y =
  1.2;


dome.position.y =
  1;


golghar.add(
  dome
);


/* -----------------------------
   STAIRCASE
----------------------------- */

const stairCount =
  isLowPower ? 60 : 90;


for (
  let i = 0;
  i < stairCount;
  i++
) {

  const angle =
    (i / stairCount) *
    Math.PI *
    5.2;


  const y =
    0.35 +
    (i / stairCount) *
    4.5;


  const stair =
    new THREE.Mesh(

      new THREE.BoxGeometry(
        0.16,
        0.045,
        0.55
      ),

      createMaterial(
        0x795238
      )

    );


  stair.position.set(

    Math.cos(angle) *
      2.65,

    y,

    Math.sin(angle) *
      2.65

  );


  stair.rotation.y =
    -angle;


  golghar.add(
    stair
  );

}


/* -----------------------------
   LABEL
----------------------------- */

const golgharLabel =
  createLabel(
    "GOLGHAR",
    "#ffe1ae"
  );


golgharLabel.position.y =
  5;


golgharLabel.scale.set(
  3.2,
  0.8,
  1
);


golghar.add(
  golgharLabel
);


city.add(
  golghar
);


/* =====================================================
   STATE
===================================================== */

let currentScene =
  "space";


let travelling =
  false;


/*
  Used to make rendering cheaper when
  the browser tab is hidden.
*/

let pageVisible =
  true;


document.addEventListener(
  "visibilitychange",
  () => {

    pageVisible =
      document.visibilityState ===
      "visible";

  }
);


/* =====================================================
   UI UPDATE
===================================================== */

function updateUI({

  chapterText,

  eyebrowText,

  titleText,

  descriptionText,

  buttonText,

  hintText

}) {

  chapter.textContent =
    chapterText;


  eyebrow.textContent =
    eyebrowText;


  title.textContent =
    titleText;


  description.textContent =
    descriptionText;


  actionButton.textContent =
    buttonText;


  interactionHint.textContent =
    hintText;

}


/* =====================================================
   CAMERA TRAVEL
===================================================== */

function cameraTravel(
  destination,
  target,
  callback
) {

  travelling =
    true;


  controls.enabled =
    false;


  const startPosition =
    camera.position.clone();


  const startTarget =
    controls.target.clone();


  const startTime =
    performance.now();


  const duration =
    isLowPower
      ? 1400
      : 1700;


  function animateTravel(
    time
  ) {

    const progress =
      Math.min(

        (time - startTime) /
          duration,

        1

      );


    const eased =
      1 -
      Math.pow(
        1 - progress,
        4
      );


    camera.position.lerpVectors(

      startPosition,

      destination,

      eased

    );


    controls.target.lerpVectors(

      startTarget,

      target,

      eased

    );


    controls.update();


    if (
      progress < 1
    ) {

      requestAnimationFrame(
        animateTravel
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
    animateTravel
  );

}


/* =====================================================
   INDIA
===================================================== */

function enterIndia() {

  currentScene =
    "india";


  solarSystem.visible =
    false;


  india.visible =
    true;


  city.visible =
    false;


  camera.position.set(
    0,
    10,
    25
  );


  controls.target.set(
    0,
    0,
    0
  );


  controls.minDistance =
    5;


  controls.maxDistance =
    60;


  updateUI({

    chapterText:
      "02 · INDIA",

    eyebrowText:
      "CHAPTER TWO · HER SIDE OF THE WORLD",

    titleText:
      "Find her in India.",

    descriptionText:
      "The universe is getting smaller. Somewhere in this glowing map is the city where her story continues.",

    buttonText:
      "Find Patna →",

    hintText:
      "Tap the glowing PATNA marker"

  });


  backButton.style.display =
    "block";

}


/* =====================================================
   PATNA
===================================================== */

function enterPatna() {

  currentScene =
    "patna";


  india.visible =
    false;


  city.visible =
    true;


  camera.position.set(
    0,
    14,
    29
  );


  controls.target.set(
    0,
    0,
    0
  );


  controls.minDistance =
    6;


  controls.maxDistance =
    65;


  updateUI({

    chapterText:
      "03 · PATNA",

    eyebrowText:
      "CHAPTER THREE · PATNA",

    titleText:
      "Welcome to Patna.",

    descriptionText:
      "Now we're closer. Explore the little city and find the place waiting for you.",

    buttonText:
      "Find the destination →",

    hintText:
      "Tap Golghar"

  });

}


/* =====================================================
   GOLGHAR
===================================================== */

function enterGolghar() {

  currentScene =
    "golghar";


  updateUI({

    chapterText:
      "04 · GOLGHAR",

    eyebrowText:
      "CHAPTER FOUR · THE DESTINATION",

    titleText:
      "We found it.",

    descriptionText:
      "Golghar — recreated here as our first 3D destination. This is where our birthday journey begins its next chapter.",

    buttonText:
      "Continue →",

    hintText:
      "The journey continues…"

  });


  cameraTravel(

    new THREE.Vector3(
      6,
      5,
      11
    ),

    new THREE.Vector3(
      0,
      2,
      0
    )

  );

}


/* =====================================================
   NEXT CHAPTER
===================================================== */

function nextChapter() {

  if (
    currentScene !==
    "golghar"
  ) {
    return;
  }


  title.textContent =
    "And now…";


  description.textContent =
    "The real story begins here. ❤️";


  actionButton.textContent =
    "Coming soon ✦";


  interactionHint.textContent =
    "Next: your memories";


  actionButton.disabled =
    true;

}


/* =====================================================
   MAIN BUTTON
===================================================== */

actionButton.addEventListener(
  "click",
  () => {

    if (
      travelling
    ) {
      return;
    }


    if (
      currentScene ===
      "space"
    ) {

      enterIndia();

      return;

    }


    if (
      currentScene ===
      "india"
    ) {

      enterPatna();

      return;

    }


    if (
      currentScene ===
      "patna"
    ) {

      enterGolghar();

      return;

    }


    if (
      currentScene ===
      "golghar"
    ) {

      nextChapter();

    }

  }
);


/* =====================================================
   RAYCASTING
===================================================== */

const raycaster =
  new THREE.Raycaster();


const pointer =
  new THREE.Vector2();


renderer.domElement.addEventListener(

  "pointerup",

  (event) => {

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
      2 -
      1;


    pointer.y =
      -(
        (
          event.clientY -
          rect.top
        ) /
        rect.height
      ) *
      2 +
      1;


    raycaster.setFromCamera(
      pointer,
      camera
    );


    /* -----------------------------
       HER
    ----------------------------- */

    if (
      currentScene ===
      "space"
    ) {

      const hits =
        raycaster.intersectObjects(
          planets,
          true
        );


      const clickedHer =
        hits.some(
          (hit) => {

            let object =
              hit.object;


            while (
              object
            ) {

              if (
                object.userData &&
                object.userData.her
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
        clickedHer
      ) {

        enterIndia();

      }

    }


    /* -----------------------------
       PATNA
    ----------------------------- */

    else if (
      currentScene ===
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

        enterPatna();

      }

    }


    /* -----------------------------
       GOLGHAR
    ----------------------------- */

    else if (
      currentScene ===
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

        enterGolghar();

      }

    }

  }

);


/* =====================================================
   BACK BUTTON
===================================================== */

backButton.addEventListener(
  "click",
  () => {

    currentScene =
      "space";


    solarSystem.visible =
      true;


    india.visible =
      false;


    city.visible =
      false;


    camera.position.set(
      0,
      13,
      45
    );


    controls.target.set(
      0,
      0,
      0
    );


    controls.minDistance =
      4;


    controls.maxDistance =
      90;


    updateUI({

      chapterText:
        "01 · THE UNIVERSE",

      eyebrowText:
        "CHAPTER ONE",

      titleText:
        "Somewhere in the universe…",

      descriptionText:
        "Two people can be far apart and still belong to the same little universe.",

      buttonText:
        "Begin the journey ✦",

      hintText:
        "Drag · pinch · tap HER"

    });


    backButton.style.display =
      "none";


    actionButton.disabled =
      false;

  }
);


/* =====================================================
   RESIZE
===================================================== */

window.addEventListener(
  "resize",
  () => {

    camera.aspect =
      window.innerWidth /
      window.innerHeight;


    camera.updateProjectionMatrix();


    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );


    renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio,
        MAX_PIXEL_RATIO
      )
    );

  }
);


/* =====================================================
   ANIMATION
===================================================== */

const clock =
  new THREE.Clock();


let lastRender =
  0;


/*
  Mobile gets a 60fps target.
  On weaker devices this naturally
  becomes less aggressive.
*/

const frameInterval =
  isLowPower
    ? 1000 / 55
    : 1000 / 60;


function animate(
  currentTime
) {

  requestAnimationFrame(
    animate
  );


  /*
    Don't waste GPU resources when
    the page isn't visible.
  */

  if (
    !pageVisible
  ) {
    return;
  }


  /*
    Simple frame limiter.
  */

  if (
    currentTime -
    lastRender <
    frameInterval
  ) {

    return;

  }


  lastRender =
    currentTime;


  const time =
    clock.getElapsedTime();


  /* ===========================
     SOLAR SYSTEM
  =========================== */

  if (
    currentScene ===
    "space"
  ) {

    solarSystem.rotation.y =
      time * 0.012;


    planets.forEach(
      (planet) => {

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

      }
    );


    /*
      ME orbiting HER.
    */

    const her =
      planets.find(
        (planet) =>
          planet.userData.her
      );


    if (
      her
    ) {

      const me =
        her.children.find(
          (child) =>
            child.userData &&
            child.userData.me
        );


      if (
        me
      ) {

        const angle =
          time * 0.9;


        const radius =
          2.4;


        me.position.x =
          Math.cos(angle) *
          radius;


        me.position.z =
          Math.sin(angle) *
          radius;

      }

    }


    /*
      Very slow star movement.
    */

    stars.rotation.y =
      time * 0.0004;

  }


  /* ===========================
     PATNA
  =========================== */

  if (
    currentScene ===
    "patna"
  ) {

    /*
      Tiny movement makes the
      city feel alive without
      costing much.
    */

    golghar.rotation.y =
      Math.sin(
        time * 0.3
      ) *
      0.04;

  }


  controls.update();


  renderer.render(
    scene,
    camera
  );

}


/* =====================================================
   START
===================================================== */

requestAnimationFrame(
  animate
);
