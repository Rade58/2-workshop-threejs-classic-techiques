// introduce easing in parallax animation
// some people call it "smoothing" or "lerping" because we will ue lerp formula

// What we want is same speed on every frequency screen

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

gui.hide(); //
// gui parameters
const parameters = {
  // color: "#90315f",
  // subdivisions: 1,
  //
  // spin: () => {},
  materialColor: "#ffeded",
};

const sizes = {
  // width: 800,
  width: window.innerWidth,
  // height: 600,
  height: window.innerHeight,
};

const canvas: HTMLCanvasElement | null = document.querySelector("canvas.webgl");

if (canvas) {
  // const objectDistance = 2;
  const objectDistance = 4;

  // -------------------------------------------------------

  const scene = new THREE.Scene();

  // TEXTURES
  const textureLoader = new THREE.TextureLoader();
  const gradientTexture = textureLoader.load(
    "/textures/scroll_based/gradients/3.jpg"
  );

  gradientTexture.magFilter = THREE.NearestFilter;

  // ------  LIGHTS
  // --------------------------------------------------------------------------------------
  //---------------------------------------------------------------------------------------

  const directionalLight = new THREE.DirectionalLight("#ffffff", 1);
  directionalLight.position.set(1, 1, 0);
  scene.add(directionalLight);

  // ------ MESHES ------
  // const cube = new THREE.Mesh(cubeGeo, material);

  // scene.add(cube);
  // -----------------------------------------------------------------------

  const material = new THREE.MeshToonMaterial({
    color: parameters.materialColor,
    gradientMap: gradientTexture,
  });

  const mesh1 = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.4, 16, 60),
    // new THREE.MeshBasicMaterial({
    //   color: "#ff0000",
    // })
    material
  );
  const mesh2 = new THREE.Mesh(
    new THREE.ConeGeometry(1, 2, 32),
    // new THREE.MeshBasicMaterial({
    //   color: "#ff0000",
    // })
    material
  );
  const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
    // new THREE.MeshBasicMaterial({
    //   color: "#ff0000",
    // })
    material
  );

  mesh1.position.y = -objectDistance * 0;
  mesh2.position.y = -objectDistance * 1;
  mesh3.position.y = -objectDistance * 2;

  mesh1.position.x = 2;
  mesh2.position.x = -2;
  mesh3.position.x = 2;

  //

  scene.add(mesh1, mesh2, mesh3);

  // to animate them easier
  const sectionMeshes = [mesh1, mesh2, mesh3];

  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------

  //  GUI

  gui.addColor(parameters, "materialColor").onChange(() => {
    material.color.set(parameters.materialColor);
  });

  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------

  const cameraGroup = new THREE.Group();
  scene.add(cameraGroup);

  const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,

    0.1,
    100
  );

  camera.position.z = 4;
  /* 
  camera.position.x = 1;
  camera.position.y = 1; */

  cameraGroup.add(camera);
  // scene.add(camera);

  const axHelp = new THREE.AxesHelper(4);
  axHelp.setColors("red", "green", "blue");
  scene.add(axHelp);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    //  we want to ue transparent background for canvas
    alpha: true,
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

  // ------ ANIMATING ON SCROLL ------
  // ---------------------------------
  // ---------------------------------
  // ---------------------------------
  // ---------------------------------
  // ---------------------------------
  // ---------------------------------
  // ---------------------------------
  // we will use this value to update camera in tick function
  /**
   * Scroll
   */
  let scrollY = window.screenY;

  // console.log({ scrollY });

  window.addEventListener("scroll", () => {
    // like I said, we will use this value to update camera in tick function
    scrollY = window.scrollY;

    // console.log({ scrollY });
  });

  // --------------------------------------------------
  // ---------- FOR PARALLAX --------------------------
  /**
   * Cursor
   */
  const cursor = { x: 0, y: 0 };
  cursor.x = 0;
  cursor.y = 0;

  window.addEventListener("mousemove", (e) => {
    // console.log(e.offsetX, e.offsetY);
    // cursor.x = e.clientX; // value in pixels, keep that in mind
    // cursor.y = e.clientY;
    // console.log(cursor.x, cursor.y);
    // console.log(cursor);

    // cursor.x = e.clientX / sizes.width; // normalizing valus to be between 0 and 1
    // cursor.y = e.clientY / sizes.height;

    // but since we want positive and negative values we do it like this
    // values are going to be between -0.5 and 0.5
    // we define this because we want to move camera up and down and left and right
    cursor.x = e.clientX / sizes.width - 0.5;
    cursor.y = e.clientY / sizes.height - 0.5;
    // we are using this values in tick function

    // console.log(cursor);
  });

  // --------------------------------------------------
  // --------------------------------------------------
  // --------------------------------------------------

  // ------------- Animation loop ------------------
  const clock = new THREE.Clock();

  //
  let previousTime = 0; // for calculating time spent between eaach frame

  const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    const deltaTime = elapsedTime - previousTime; // for calculating time spent between eaach frame
    previousTime = elapsedTime;
    // console.log({ deltaTime }); // higher frequency of screen the smaller value will be, because you will have more frames
    //                              which means less time between each frame

    camera.position.y = (-scrollY / sizes.height) * objectDistance;
    // -------------------------------------
    // For parallax
    // we can also use amplitude (multiply by aamplitude)
    // in this case amplitude is 0.5
    const parallaxX = cursor.x * 0.5;
    const parallaxY = -cursor.y * 0.5;

    // instead of this
    // cameraGroup.position.x = parallaxX;
    // cameraGroup.position.y = parallaxY;
    // we will 1/10 to the previous value
    // we will increment
    // cameraGroup.position.x += parallaxX;
    // cameraGroup.position.y += parallaxY;
    // but we need to calculate distance from current position to the destination
    // cameraGroup.position.x += parallaxX - cameraGroup.position.x;
    // cameraGroup.position.y += parallaxY - cameraGroup.position.y;
    // but we want to move only 1/10 so we multiply it by 0.1
    // cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 0.1;
    // cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 0.1;

    // but tick will be called more offten on high frequency screens
    // so we need to use time spent between each frame
    // you will think that thi is broken
    // but it is not since everything moving slowly
    // especially on 60fps screens
    /* cameraGroup.position.x +=
      (parallaxX - cameraGroup.position.x) * 0.1 * deltaTime;
    cameraGroup.position.y +=
      (parallaxY - cameraGroup.position.y) * 0.1 * deltaTime; */
    // so insteadd of using 1/10
    // we will make it faster, by multiplying by 5
    cameraGroup.position.x +=
      (parallaxX - cameraGroup.position.x) * 5 * deltaTime;
    cameraGroup.position.y +=
      (parallaxY - cameraGroup.position.y) * 5 * deltaTime;

    // -------------------------------------

    // rotaitng our meshes
    for (const mesh of sectionMeshes) {
      mesh.rotation.x = elapsedTime * 0.1;
      mesh.rotation.y = elapsedTime * 0.12;
    }
    //

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
