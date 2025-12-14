// =====================
// IMPORTS
// =====================
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.155/build/three.module.js";
import { createSun } from "./sun.js";
import { createSolarSystem, animateSolarSystem } from "./solarSystem.js";

import {
  initHandTracking,
  getFingerPosition,
  getLandmarks,
  getOpenFingerCount
} from "./interactions/handTracking.js";

import { initCursor, updateCursor } from "./interactions/cursor.js";
import { updateGestures, didPinch } from "./interactions/gestures.js";
import { setupScene } from "./scene.js";

// =====================
// CAMERA MODES
// =====================
let cameraMode = "system"; // "system" | "focus"
let focusedPlanet = null;
const focusOffset = new THREE.Vector3(0, 1.5, 4);

// =====================
// VIDEO
// =====================
const video = document.getElementById("video");

// =====================
// SCENE
// =====================
const { scene, camera, renderer } = setupScene();
const { planets, asteroids } = createSolarSystem(scene);
createSun(scene);

// =====================
// CAMERA ZOOM
// =====================
let targetCameraZ = camera.position.z;
const GESTURE_ZOOM_SPEED = 1.2;
const MIN_ZOOM = 5;
const MAX_ZOOM = 350;

// =====================
// GLOBAL TRACKPAD ZOOM
// =====================
window.addEventListener(
  "wheel",
  event => {
    event.preventDefault();
    targetCameraZ += event.deltaY * 0.002;
    targetCameraZ = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, targetCameraZ));
  },
  { passive: false }
);

// =====================
// INPUT
// =====================
initHandTracking(video);
initCursor();

// =====================
// RAYCASTING
// =====================
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let hoveredPlanet = null;

// =====================
// PLANET LABEL
// =====================
const planetLabel = document.getElementById("planet-label");

// =====================
// ANIMATION LOOP
// =====================
function animate() {
  requestAnimationFrame(animate);

  // ---------------------
  // CURSOR
  // ---------------------
  const finger = getFingerPosition();
  updateCursor(finger);

  // ---------------------
  // GESTURES
  // ---------------------
  updateGestures(getLandmarks());

  // ---------------------
  // HOVER DETECTION
  // ---------------------
  let newHoveredPlanet = null;

  if (finger.handDetected && cameraMode === "system") {
    mouse.x = finger.x * 2 - 1;
    mouse.y = -(finger.y * 2 - 1);

    raycaster.setFromCamera(mouse, camera);

    // IMPORTANT: recursive raycast
    const intersects = raycaster.intersectObjects(planets, true);

    if (intersects.length > 0) {
      newHoveredPlanet = intersects[0].object;

      // If child mesh (like Saturn ring), climb up
      while (newHoveredPlanet.parent && !newHoveredPlanet.userData.name) {
        newHoveredPlanet = newHoveredPlanet.parent;
      }
    }
  }

  // ---------------------
  // HOVER STATE CHANGE
  // ---------------------
  if (newHoveredPlanet !== hoveredPlanet) {
    if (hoveredPlanet) {
      hoveredPlanet.material.emissive.setHex(0x000000);
    }

    hoveredPlanet = newHoveredPlanet;

    if (hoveredPlanet) {
      hoveredPlanet.material.emissive.setHex(0x333333);
    }
  }

  // ---------------------
  // LABEL
  // ---------------------
  if (hoveredPlanet) {
    const worldPos = new THREE.Vector3();
    hoveredPlanet.getWorldPosition(worldPos);

    const screenPos = worldPos.project(camera);

    planetLabel.style.left =
      (screenPos.x * 0.5 + 0.5) * window.innerWidth + "px";
    planetLabel.style.top =
      (-screenPos.y * 0.5 + 0.5) * window.innerHeight + "px";

    planetLabel.textContent = hoveredPlanet.userData.name;
    planetLabel.style.opacity = 1;

    // Pinch → focus
    if (didPinch()) {
      focusedPlanet = hoveredPlanet;
      cameraMode = "focus";
      planetLabel.style.opacity = 0;
      console.log("Focused planet:", focusedPlanet.userData.name);
    }
  } else {
    planetLabel.style.opacity = 0;
  }

  // ---------------------
  // HAND ZOOM
  // ---------------------
  const openFingers = getOpenFingerCount();

  if (finger.handDetected && cameraMode === "system") {
    if (openFingers >= 4) targetCameraZ -= GESTURE_ZOOM_SPEED;
    else if (openFingers <= 1) targetCameraZ += GESTURE_ZOOM_SPEED;

    targetCameraZ = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, targetCameraZ));
  }

  // ---------------------
  // CAMERA CONTROL
  // ---------------------
  if (cameraMode === "system") {
    camera.position.z += (targetCameraZ - camera.position.z) * 0.12;
    camera.lookAt(0, 0, 0);
  } else if (cameraMode === "focus" && focusedPlanet) {
    const p = new THREE.Vector3();
    focusedPlanet.getWorldPosition(p);

    const camTarget = p.clone().add(focusOffset);
    camera.position.lerp(camTarget, 0.08);
    camera.lookAt(p);
  }

  // ---------------------
  // SOLAR SYSTEM
  // ---------------------
  animateSolarSystem(planets, asteroids);

  // ---------------------
  // RENDER
  // ---------------------
  renderer.render(scene, camera);
}

animate();
