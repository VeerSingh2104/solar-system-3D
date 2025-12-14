import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.155/build/three.module.js";
const PLANET_SCALE = 2; 

const textureLoader = new THREE.TextureLoader();

export function createPlanet(data) {
  
  const geometry = new THREE.SphereGeometry(
  data.radius * PLANET_SCALE,
  48,
  48
);


  let materialOptions = {
    roughness: 0.6,
    metalness: 0.1,
    emissive: new THREE.Color(data.color).multiplyScalar(0.15),
  };

  // =====================
  // TEXTURE SUPPORT
  // =====================
  if (data.texture) {
    const texture = textureLoader.load(data.texture);
    texture.colorSpace = THREE.SRGBColorSpace;

    materialOptions.map = texture;
  } else {
    materialOptions.color = data.color;
  }

  const material = new THREE.MeshStandardMaterial(materialOptions);

  const planet = new THREE.Mesh(geometry, material);

  // Required for hover & focus
  planet.userData = {
    ...data,
    angle: Math.random() * Math.PI * 2,
  };
planet.castShadow = true;
planet.receiveShadow = true;

  // =====================
  // SATURN RINGS (unchanged)
  // =====================
  if (data.name === "Saturn") {
    const ringInnerRadius = data.radius * PLANET_SCALE * 1.4;
    const ringOuterRadius = data.radius * PLANET_SCALE * 2.4;


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
    });

    const rings = new THREE.Mesh(ringGeometry, ringMaterial);
    rings.rotation.x = Math.PI / 2;

    planet.rotation.z = THREE.MathUtils.degToRad(26.7);
    planet.add(rings);
  }
// =====================
// PLANET GLOW (SUBTLE)
// =====================
const glowGeometry = new THREE.SphereGeometry(
  data.radius * 1.08, // slightly larger
  32,
  32
);

const glowMaterial = new THREE.MeshBasicMaterial({
  color: new THREE.Color(data.glowColor || 0x88ccff),
  transparent: true,
  opacity: 0.18,
  blending: THREE.AdditiveBlending,
  side: THREE.BackSide,
  depthWrite: false,
});

const glow = new THREE.Mesh(glowGeometry, glowMaterial);
glow.position.copy(planet.position);

planet.add(glow);

  return planet;
}
