import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.155/build/three.module.js";

export function createSun(scene) {
  const geometry = new THREE.SphereGeometry(1.2, 48, 48);
  const material = new THREE.MeshStandardMaterial({
    color: 0xffcc33,
    emissive: 0xffaa00,
    emissiveIntensity: 1.2,
  });

  const sun = new THREE.Mesh(geometry, material);
  scene.add(sun);

  const light = new THREE.PointLight(0xffddaa, 3.0, 50);
  light.position.set(0, 0, 0);
  scene.add(light);

  return sun;
}
