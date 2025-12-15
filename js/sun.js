import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.155/build/three.module.js";

const textureLoader = new THREE.TextureLoader();

export function createSun(scene) {

  // =====================
  // SUN TEXTURE
  // =====================
  const sunTexture = textureLoader.load("assets/textures/sun.jpg");
  sunTexture.colorSpace = THREE.SRGBColorSpace;

  // =====================
  // SUN MESH (UNLIT)
  // =====================
  const sunGeometry = new THREE.SphereGeometry(6, 64, 64);
  const sunMaterial = new THREE.MeshBasicMaterial({
    map: sunTexture
  });

  const sun = new THREE.Mesh(sunGeometry, sunMaterial);
  sun.position.set(0, 0, 0);
  scene.add(sun);

  // =====================
  // SUN LIGHT (REAL ILLUMINATION)
  // =====================
  const sunLight = new THREE.PointLight(0xffffff, 12.0, 2000, 1.2);

  sunLight.position.set(0, 0, 0);
  sunLight.castShadow = true;

  sunLight.shadow.mapSize.width = 2048;
  sunLight.shadow.mapSize.height = 2048;
  sunLight.shadow.camera.near = 1;
  sunLight.shadow.camera.far = 800;
sunLight.shadow.camera.near = 1;
sunLight.shadow.camera.far = 1500;

  scene.add(sunLight);

  return sun;
}
