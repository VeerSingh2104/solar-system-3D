import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.155/build/three.module.js";

export function createPlanet(data) {
  const geometry = new THREE.SphereGeometry(data.radius, 32, 32);
  const material = new THREE.MeshStandardMaterial({
    color: data.color,
    roughness: 0.6,
    metalness: 0.1,
    emissive: new THREE.Color(data.color).multiplyScalar(0.15),
  });

  const planet = new THREE.Mesh(geometry, material);

  planet.userData = {
    ...data,
    angle: Math.random() * Math.PI * 2,
  };

  // =====================
  // SATURN RINGS
  // =====================
  if (data.name === "Saturn") {
    const ringInnerRadius = data.radius * 1.4;
    const ringOuterRadius = data.radius * 2.4;

    const ringGeometry = new THREE.RingGeometry(
      ringInnerRadius,
      ringOuterRadius,
      64
    );

    const ringMaterial = new THREE.MeshStandardMaterial({
      color: 0xdccaa0,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7,
      roughness: 0.8,
      metalness: 0.0,
    });

    const rings = new THREE.Mesh(ringGeometry, ringMaterial);

    // Rotate rings to lie flat
    rings.rotation.x = Math.PI / 2;

    // Saturn axial tilt (~26.7°)
    planet.rotation.z = THREE.MathUtils.degToRad(26.7);

    planet.add(rings);
  }

  return planet;
}
