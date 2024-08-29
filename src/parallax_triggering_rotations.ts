// we want to trigger animation when
// you scroll to particular section of the page
// we will add new variable called currentSection, that will have
// number of page section as a value, for us that is 0 or 1 or 2 since we have 3 sections
// and we will define logic where we calculate that value, and we trigger animation on a specific mesh
// we are using this for animation     `pnpm add gsap@3.5.1`

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

gui.hide();
// gui parameters
const parameters = {
  // color: "#90315f",
  // subdivisions: 1,
  //
  // spin: () => {},
  // materialColor: "#ffeded",
  materialColor: "#e481a4",
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
  // ---------- PARTICLES ----------
  // -----------------------------------------------------------------------
  /**
   * Particles
   */
  const particlesCount = 200;

  const positions = new Float32Array(particlesCount * 3); // 3 values per particle x, y, z

  for (let i = 0; i < particlesCount; i++) {
    //
    positions[i * 3 + 0] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 1] =
      objectDistance * 0.5 -
      Math.random() /* * 10 */ * objectDistance * sectionMeshes.length;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
  }

  const particlesGeometry = new THREE.BufferGeometry();
  particlesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );

  const particlesMaterial = new THREE.PointsMaterial({
    color: parameters.materialColor,
    sizeAttenuation: true,
    size: 0.03,
  });

  const particles = new THREE.Points(particlesGeometry, particlesMaterial);

  scene.add(particles);

  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------

  //  GUI

  gui.addColor(parameters, "materialColor").onChange(() => {
    material.color.set(parameters.materialColor);
    particlesMaterial.color.set(parameters.materialColor);
  });

  const o = { showBorders: false };
  gui.add(o, "showBorders").onChange(() => {
    const els = document.querySelectorAll(".content div");
    if (o.showBorders === false) {
      if (els) {
        els.forEach((el) => {
          el.classList.remove("show_border");
        });
      }
    } else {
      if (els) {
        els.forEach((el) => {
          el.classList.add("show_border");
        });
      }
    }
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
  axHelp.visible = false;

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

  let currentSection = 0; //

  // console.log({ scrollY });

  window.addEventListener("scroll", () => {
    scrollY = window.scrollY;

    // console.log({ scrollY });
    // we will add this
    // to calculate what is our current section
    const newSection = Math.round(scrollY / sizes.height);

    // changing sections
    if (newSection !== currentSection) {
      currentSection = newSection;
      // console.log("changed", currentSection);

      gsap.to(sectionMeshes[currentSection].rotation, {
        duration: 1.5,
        ease: "power2.inOut",
        x: "+=6",
        y: "+=3",
        z: "+=1.5",
      });
    }

    // console.log(newSection);
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
    cursor.x = e.clientX / sizes.width - 0.5;
    cursor.y = e.clientY / sizes.height - 0.5;
  });

  // --------------------------------------------------
  // --------------------------------------------------
  // --------------------------------------------------

  // ------------- Animation loop ------------------
  const clock = new THREE.Clock();

  //
  let previousTime = 0;

  const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;

    camera.position.y = (-scrollY / sizes.height) * objectDistance;

    // -------------------------------------------------
    const parallaxX = cursor.x * 0.5;
    const parallaxY = -cursor.y * 0.5;

    cameraGroup.position.x +=
      (parallaxX - cameraGroup.position.x) * 5 * deltaTime;
    cameraGroup.position.y +=
      (parallaxY - cameraGroup.position.y) * 5 * deltaTime;

    // -------------------------------------
    // because of this our gsap animation will not be visible
    // so, do increment instead,
    /* for (const mesh of sectionMeshes) {
      mesh.rotation.x = elapsedTime * 0.1;
      mesh.rotation.y = elapsedTime * 0.12;
    } */
    for (const mesh of sectionMeshes) {
      mesh.rotation.x += deltaTime * 0.1;
      mesh.rotation.y += deltaTime * 0.12;
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
