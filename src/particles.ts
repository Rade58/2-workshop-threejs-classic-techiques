// particles can be used to create effects like rain, stars, smoke, dust, fire etc.
// you can have thousands of particles with a reasonable frame rate
// each particle is compose of a plane (two triangles) always facing a camera

// We will be using some new constructors ike Points and PointsMaterial

import * as THREE from "three";
import { /* FontLoader, */ OrbitControls } from "three/examples/jsm/Addons.js";
// import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
// import gsap from "gsap";
import GUI from "lil-gui";

/**
 * @description Debug UI - lil-ui
 */
const gui = new GUI({
  width: 340,
  title: "My Debugging",
  closeFolders: false,
});

gui.hide(); //

/* const debugObject = {
  color: "#90315f",
  subdivisions: 1,
  //
  // spin: () => {},
}; */

const sizes = {
  // width: 800,
  width: window.innerWidth,
  // height: 600,
  height: window.innerHeight,
};

const canvas: HTMLCanvasElement | null = document.querySelector("canvas.webgl");

if (canvas) {
  // -------------------------------------------------------

  const scene = new THREE.Scene();

  // -----------------------------------

  const textureLoader = new THREE.TextureLoader();

  const particleTexture = textureLoader.load("/particles/2.png");

  // ------  LIGHTS
  // --------------------------------------------------------------------------------------
  //---------------------------------------------------------------------------------------
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 30);
  pointLight.position.x = 2;
  pointLight.position.y = 3;
  pointLight.position.z = 4;
  scene.add(pointLight);

  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  /**
   * @description Particles
   */

  /**
   * @name Parrticles-Geometry
   */
  // instead of this
  // const particlesGeometry = new THREE.SphereGeometry(1, 32, 32); // each vertex of the geomery will become particle
  // we will use BufferGeometry
  const particlesGeometry = new THREE.BufferGeometry();
  // const count = 50000;
  const count = 5000; // number of vertices
  const positions = new Float32Array(count * 3); // every verices is represented with 3 coordinates, that is why we multiply

  for (let i = 0; i < count; i++) {
    // minus 0.5 because we also want negative vlues
    positions[i] = (Math.random() - 0.5) * 10;
    // we will have array with 3 * 500 floating point numbers
    // and when geometry uses these array it bill go through it
    // in a way that every 3 numbers represent coordinate of a vertice
  }

  particlesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3) // actually this 3 determines how much numbers to take for a coordinate
  );

  /**
   * @name Particles-Material
   */
  const particlesMaterial = new THREE.PointsMaterial({
    // size: 0.02,
    // sizeAttenuation: true,
  });

  // particlesMaterial.size = 4;
  // particlesMaterial.sizeAttenuation = false;
  // particlesMaterial.size = 0.02;
  particlesMaterial.size = 0.1;
  particlesMaterial.sizeAttenuation = true;
  // particlesMaterial.color = new THREE.Color("crimson");
  // particlesMaterial.color = new THREE.Color("#ff88cc");
  particlesMaterial.map = particleTexture;
  /**
   * @name Particles
   */
  const particles = new THREE.Points(particlesGeometry, particlesMaterial);

  scene.add(particles);

  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------

  const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,

    0.1,
    100
  );

  camera.position.z = 3;
  camera.position.x = 1;
  camera.position.y = 1;
  scene.add(camera);

  const axHelp = new THREE.AxesHelper(4);
  axHelp.setColors("red", "green", "blue");
  scene.add(axHelp);

  const orbit_controls = new OrbitControls(camera, canvas);
  // orbit_controls.enabled = false
  orbit_controls.enableDamping = true;

  const renderer = new THREE.WebGLRenderer({
    canvas,
  });
  // handle pixel ratio
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // more than 2 is unnecessary

  renderer.setSize(sizes.width, sizes.height);

  renderer.render(scene, camera);

  // -------------------------------------------------
  // -------------------------------------------------
  // -------------------------------------------------
  // -------------------------------------------------
  // -------------------------------------------------
  // -------------------------------------------------
  // toggle debug ui on key `h`
  window.addEventListener("keydown", (e) => {
    if (e.key === "h") {
      gui.show(gui._hidden);
    }
  });

  // ------------- Animation loop ------------------
  const clock = new THREE.Clock();
  const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // for dumping to work
    orbit_controls.update();

    renderer.render(scene, camera);

    window.requestAnimationFrame(tick);
  };

  tick();

  // ------------------------------------------------------
  // --------------- handle resize ------------------------
  window.addEventListener("resize", (e) => {
    console.log("resizing");
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  // ------------------------------------------------------
  // ----------------- enter fulll screen with double click

  window.addEventListener("dblclick", () => {
    console.log("double click");

    // handling safari
    const fullscreenElement =
      // @ts-ignore webkit
      document.fullscreenElement || document.webkitFullScreenElement;
    //

    // if (!document.fullscreenElement) {
    if (!fullscreenElement) {
      if (canvas.requestFullscreen) {
        // go fullscreen
        canvas.requestFullscreen();

        // @ts-ignore webkit
      } else if (canvas.webkitRequestFullScreen) {
        // @ts-ignore webkit
        canvas.webkitRequestFullScreen();
      }
    } else {
      // @ts-ignore
      if (document.exitFullscreen) {
        document.exitFullscreen();

        // @ts-ignore webkit
      } else if (document.webkitExitFullscreen) {
        // @ts-ignore webkit
        document.webkitExitFullscreen();
      }
    }
  });
}
