// shadows
// we activate shadowMap on renderer
/// in our case (we have very simple scene)
/// we `castShadow` from a sphere
/// and plane should `receiveShadow`

// works only with PointLight, DirectionalLight, SpotLight (you must `castShadow` from it)

// after we do all of mentioned, the shadow will be visible.
// but it won't look to good, we need to optimize it

import * as THREE from "three";
import { FontLoader, OrbitControls } from "three/examples/jsm/Addons.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import gsap from "gsap";
import GUI from "lil-gui";

/**
 * @description Debug UI - lil-ui
 */
const gui = new GUI({
  width: 340,
  title: "My Debugging",
  closeFolders: false,
});

// gui.hide();

const debugObject = {
  color: "#90315f",
  subdivisions: 1,
  //
  // spin: () => {},
};

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

  // ------  LIGHTS
  // --------------------------------------------------------------------------------------
  //---------------------------------------------------------------------------------------
  //---------------------------------------------------------------------------------------
  //---------------------------------------------------------------------------------------
  const ambientLight = new THREE.AmbientLight(0xffffff);

  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);

  directionalLight.position.set(2, 2, -1);

  scene.add(directionalLight);

  const directionalLightHelper = new THREE.DirectionalLightHelper(
    directionalLight,
    0.2,
    "purple"
  );
  scene.add(directionalLightHelper);
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // ------ MATERIAL ------
  const material = new THREE.MeshStandardMaterial();
  material.roughness = 0.7;

  // --------------------------------------------------------------
  // ------ GEOMETRIES ------
  const sphereGeo = new THREE.SphereGeometry(0.5, 32, 32);
  const planeGeo = new THREE.PlaneGeometry(5, 5);

  // --------------------------------------------------------------
  // ------ MESHES ------
  const sphere = new THREE.Mesh(sphereGeo, material);
  // sphere.position.x = -1.5;
  const plane = new THREE.Mesh(planeGeo, material);
  plane.rotation.x = -Math.PI * 0.5; // this is -90deg
  plane.position.y = -0.65;

  //  ---------------------- SHADOWS RELATED ----------------------
  // --------------------------------------------------------------
  // --------------------------------------------------------------

  directionalLight.castShadow = true;

  sphere.castShadow = true;

  plane.receiveShadow = true;

  // --------------------------------------------------------------
  // --------------------------------------------------------------
  // --------------------------------------------------------------

  scene.add(sphere, plane);
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  //  gui
  const directionalLightFolder = gui.addFolder("Directional Light");
  directionalLightFolder
    .add(directionalLight, "intensity")
    .min(0)
    .max(1)
    .step(0.001);
  directionalLightFolder
    .add(directionalLight.position, "x")
    .min(-2)
    .max(2)
    .step(0.001);
  directionalLightFolder
    .add(directionalLight.position, "y")
    .min(-2)
    .max(2)
    .step(0.001);
  directionalLightFolder
    .add(directionalLight.position, "z")
    .min(-2)
    .max(2)
    .step(0.001);

  const materialFolder = gui.addFolder("Material");
  materialFolder.add(material, "metalness").min(0).max(1).step(0.001);
  materialFolder.add(material, "roughness").min(0).max(1).step(0.001);
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

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // more than 2 is unnecessary

  // ------ ACTIVTING SHADOW MAPS ------
  // ---------------------------------------------------
  renderer.shadowMap.enabled = true;

  // ---------------------------------------------------
  // ---------------------------------------------------

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
