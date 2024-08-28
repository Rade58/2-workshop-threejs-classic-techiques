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
  // some varibles
  // const objectDistance = 2; // distance between our meshes
  const objectDistance = 4;

  // -------------------------------------------------------

  const scene = new THREE.Scene();

  // TEXTURES
  const textureLoader = new THREE.TextureLoader();
  const gradientTexture = textureLoader.load(
    "/textures/scroll_based/gradients/3.jpg"
  );
  // because we have image containing some pixel different color
  // we don't want to have gradient so we need different magFilter
  gradientTexture.magFilter = THREE.NearestFilter;

  // ------  LIGHTS
  // --------------------------------------------------------------------------------------
  //---------------------------------------------------------------------------------------
  // const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  // scene.add(ambientLight);

  // const pointLight = new THREE.PointLight(0xffffff, 30);
  // pointLight.position.x = 2;
  // pointLight.position.y = 3;
  // pointLight.position.z = 4;
  // scene.add(pointLight);

  const directionalLight = new THREE.DirectionalLight("#ffffff", 1);
  directionalLight.position.set(1, 1, 0);
  scene.add(directionalLight);

  // -----------------------------------------------------------------------
  // ------ MATERIAL ------
  // const material = new THREE.MeshStandardMaterial();
  // material.roughness = 0.4;
  // material.color = new THREE.Color(parameters.materialColor);
  // material.color = new THREE.Color("crimson");

  // --------------------------------------------------------------
  // ------ GEOMETRIES ------
  // const cubeGeo = new THREE.BoxGeometry(0.75, 0.75, 0.75);
  // --------------------------------------------------------------
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

  // now when we change width of browser window our meshes keep their size
  // but when we lower height of browser windows, or meshes are going to be smller
  // this is camera stuff, or to be precise this is "field of view" setting of the camera
  // and we want to keep our current setting of field of view being verticl
  // we want our meshhes to be relative to the viewprt, and we aleady have this applied
  // like I said

  // to see, or to notice that we have verticall field of viw for our camera
  // add this and try to change vertical dimension of browser window (comment out afterwards)
  // you wil see that your meshes will change size because we have verical field of view
  //

  /* mesh1.position.y = 2;
  mesh1.scale.set(0.5, 0.5, 0.5);

  mesh2.visible = false;

  mesh3.position.y = -2;
  mesh3.scale.set(0.5, 0.5, 0.5); */

  // moving our meshes and using objectDistance variable as a value to position evenly on y axis

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

  const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,

    0.1,
    100
  );

  camera.position.z = 3;
  /* 
  camera.position.x = 1;
  camera.position.y = 1; */

  scene.add(camera);

  const axHelp = new THREE.AxesHelper(4);
  axHelp.setColors("red", "green", "blue");
  scene.add(axHelp);

  // const orbit_controls = new OrbitControls(camera, canvas);
  // orbit_controls.enabled = false
  // orbit_controls.enableDamping = true;

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

  console.log({ scrollY });

  window.addEventListener("scroll", () => {
    // like I said, we will use this value to update camera in tick function
    scrollY = window.scrollY;

    console.log({ scrollY });
  });

  // ---------------------------------
  // ---------------------------------
  // ---------------------------------

  // ------------- Animation loop ------------------
  const clock = new THREE.Clock();
  const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // for dumping to work
    // orbit_controls.update();

    // using scrollY value to make camer move
    // -------------------------------------
    // at first let's pla around
    // camera.position.y = -scrollY * 0.001 - objectDistance;
    // keep in mind that     sizes.height     is height of our viewport
    // camera.position.y = -scrollY / sizes.height;
    // after playing around we came to this
    // mltiplying by distance between two object
    camera.position.y = (-scrollY / sizes.height) * objectDistance;

    // -------------------------------------
    //

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
