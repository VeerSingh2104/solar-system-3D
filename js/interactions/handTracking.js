let currentLandmarks = null;
let openFingerCount = 0;
let handGesture = "none"; 
// "open" | "closed" | "point" | "none"

let fingerPos = { x: 0.5, y: 0.5 };
let handDetected = false;

// =====================
// GETTERS
// =====================
export function getFingerPosition() {
  return { ...fingerPos, handDetected };
}

export function getLandmarks() {
  return currentLandmarks;
}

export function getOpenFingerCount() {
  return openFingerCount;
}

export function getHandGesture() {
  return handGesture;
}

// =====================
// INIT HAND TRACKING
// =====================
export function initHandTracking(videoElement) {
  const hands = new window.Hands({
    locateFile: file =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
  });

  hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.6,
    minTrackingConfidence: 0.6,
  });

  hands.onResults(results => {
    // ---------------------
    // NO HAND
    // ---------------------
    if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
      handDetected = false;
      currentLandmarks = null;
      handGesture = "none";
      return;
    }

    // ---------------------
    // HAND FOUND
    // ---------------------
    const landmarks = results.multiHandLandmarks[0];
    currentLandmarks = landmarks;
    handDetected = true;

    // Index finger tip → cursor
    const tip = landmarks[8];
    fingerPos.x = 1 - tip.x; // mirror X
    fingerPos.y = tip.y;

    // ---------------------
    // OPEN FINGER COUNT
    // ---------------------
    const tips = [8, 12, 16, 20];
    const knuckles = [6, 10, 14, 18];

    openFingerCount = 0;

    for (let i = 0; i < tips.length; i++) {
      if (landmarks[tips[i]].y < landmarks[knuckles[i]].y) {
        openFingerCount++;
      }
    }

    // ---------------------
    // HAND GESTURE CLASSIFICATION
    // ---------------------
    const indexTip = landmarks[8];
    const indexKnuckle = landmarks[6];
    const thumbTip = landmarks[4];

    // ✋ Open hand
    if (openFingerCount >= 4) {
      handGesture = "open";
    }

    // ✊ Closed fist
    else if (
      openFingerCount === 0 &&
      Math.abs(thumbTip.x - indexTip.x) < 0.05
    ) {
      handGesture = "closed";
    }

    // ☝️ Pointing (cursor control)
    else if (
      openFingerCount === 1 &&
      indexTip.y < indexKnuckle.y
    ) {
      handGesture = "point";
    }

    // Neutral / unknown
    else {
      handGesture = "none";
    }
  });

  // =====================
  // CAMERA
  // =====================
  const camera = new window.Camera(videoElement, {
    onFrame: async () => {
      await hands.send({ image: videoElement });
    },
    width: 640,
    height: 480,
  });

  camera.start();
}
