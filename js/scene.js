import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.155/build/three.module.js";

export function setupScene() {
  // =====================
  // SCENE
  // =====================
  const scene = new THREE.Scene();

  // Slightly lifted black for contrast
  scene.background = new THREE.Color(0x050508);

  // =====================
  // CAMERA
  // =====================
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
camera.position.set(0, 20, 280);
camera.lookAt(0, 0, 0);


  // =====================
  // RENDERER
  // =====================
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: "high-performance",
  });
renderer.domElement.style.position = "absolute";
renderer.domElement.style.top = "0";
renderer.domElement.style.left = "0";

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  // Correct color + tone mapping (VERY IMPORTANT)
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  document.body.appendChild(renderer.domElement);

  // =====================
  // LIGHTING
  // =====================

  // Soft global fill (prevents darkness)
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  // Main directional light (sun-like)
  const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
  keyLight.position.set(5, 6, 5);
  scene.add(keyLight);

  // Rim / back light (adds depth & contrast)
  const rimLight = new THREE.DirectionalLight(0x88ccff, 0.6);
  rimLight.position.set(-5, 3, -5);
  scene.add(rimLight);

  // Optional: subtle hemisphere light for realism
  const hemiLight = new THREE.HemisphereLight(
    0x8899ff,
    0x080820,
    0.25
  );
  scene.add(hemiLight);

  // =====================
  // RESIZE HANDLER
  // =====================
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // =====================
  // RETURN EVERYTHING
  // =====================
  return {
    scene,
    camera,
    renderer,
  };
}
