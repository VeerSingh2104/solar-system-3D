import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.155/build/three.module.js";
import { createPlanet } from "./planetFactory.js";
import { PLANETS } from "./planetData.js";

// =====================
// ORBIT CREATION (WHITE)
// =====================
function createOrbit(scene, radius) {
  const segments = 128;
  const points = [];

  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    points.push(
      Math.cos(theta) * radius,
      0,
      Math.sin(theta) * radius
    );
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(points, 3)
  );

  const material = new THREE.LineBasicMaterial({
    color: 0xffffff,   // ✅ WHITE
    transparent: true,
    opacity: 0.4
  });

  const orbit = new THREE.Line(geometry, material);
  scene.add(orbit);
}

// =====================
// CREATE SOLAR SYSTEM
// =====================
export function createSolarSystem(scene) {
  const planets = [];

  PLANETS.forEach(data => {
    const planet = createPlanet(data);
    scene.add(planet);
    planets.push(planet);

    // ✅ ADD ORBIT FOR EACH PLANET
    createOrbit(scene, data.orbit);
  });

  // Create asteroid belt
  const asteroids = createAsteroidBelt(scene);

  return { planets, asteroids };
}

// =====================
// ANIMATE SOLAR SYSTEM
// =====================
export function animateSolarSystem(planets, asteroids, timeScale = 1) {
  planets.forEach(p => {
    p.userData.angle += p.userData.speed * timeScale;
    p.position.x = Math.cos(p.userData.angle) * p.userData.orbit;
    p.position.z = Math.sin(p.userData.angle) * p.userData.orbit;
  });

  animateAsteroidBelt(asteroids, timeScale);
}

// =====================
// ASTEROID BELT
// =====================
function createAsteroidBelt(scene, count = 1200) {
  const geometry = new THREE.SphereGeometry(0.12, 6, 6);
  const material = new THREE.MeshStandardMaterial({
    color: 0x888888,
    roughness: 0.9,
    metalness: 0.1,
  });

  const asteroids = [];

  for (let i = 0; i < count; i++) {
    const rock = new THREE.Mesh(geometry, material);

    // Between Mars (~12) and Jupiter (~42)
    const radius = THREE.MathUtils.randFloat(14, 38);
    const angle = Math.random() * Math.PI * 2;
    const height = THREE.MathUtils.randFloatSpread(1.5);

    rock.position.set(
      Math.cos(angle) * radius,
      height,
      Math.sin(angle) * radius
    );

    rock.scale.setScalar(Math.random() * 0.6 + 0.4);

    rock.userData = {
      angle,
      radius,
      speed: THREE.MathUtils.randFloat(0.0005, 0.0015),
    };

    scene.add(rock);
    asteroids.push(rock);
    rock.castShadow = false;
    rock.receiveShadow = true;
  }

  return asteroids;
}

function animateAsteroidBelt(asteroids, timeScale) {
  asteroids.forEach(a => {
    a.userData.angle += a.userData.speed * timeScale;
    a.position.x = Math.cos(a.userData.angle) * a.userData.radius;
    a.position.z = Math.sin(a.userData.angle) * a.userData.radius;
  });
}
