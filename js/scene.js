import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.155/build/three.module.js";

export function setupScene() {
  // =====================
  // SCENE
  // =====================
  const scene = new THREE.Scene();
  // scene.background = new THREE.Color(0x050508);
// =====================
// STAR BACKGROUND (MILKY WAY)
// =====================
const textureLoader = new THREE.TextureLoader();

const starTexture = textureLoader.load("assets/textures/stars.jpg");
starTexture.colorSpace = THREE.SRGBColorSpace;

// Huge sphere surrounding entire scene
const starGeometry = new THREE.SphereGeometry(1500, 64, 64);

// IMPORTANT: BackSide so we see inside of sphere
const starMaterial = new THREE.MeshBasicMaterial({
  map: starTexture,
  side: THREE.BackSide,
});

const starSphere = new THREE.Mesh(starGeometry, starMaterial);

// Prevent interaction & lighting
starSphere.frustumCulled = false;

scene.add(starSphere);

  // =====================
  // CAMERA
  // =====================
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
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

  // ✅ Correct color + tone mapping
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  // ✅ SHADOWS (CRITICAL)
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  document.body.appendChild(renderer.domElement);

  // =====================
  // LIGHTING (SPACE CORRECT)
  // =====================

  // VERY subtle ambient fill (space is dark)
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.05);
  scene.add(ambientLight);

  // ❌ REMOVE directional / rim lights
  // Sun PointLight handles real illumination

  // =====================
  // RESIZE HANDLER
  // =====================
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  return {
    scene,
    camera,
    renderer,
  };
}
