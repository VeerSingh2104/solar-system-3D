let isPinching = false;
let pinchJustStarted = false;

export function updateGestures(landmarks) {
  pinchJustStarted = false;

  if (!landmarks) {
    isPinching = false;
    return;
  }

  const thumb = landmarks[4];
  const index = landmarks[8];

  const dist = Math.hypot(
    thumb.x - index.x,
    thumb.y - index.y
  );

  const PINCH_THRESHOLD = 0.04;

  if (dist < PINCH_THRESHOLD && !isPinching) {
    pinchJustStarted = true;
    isPinching = true;
  }

  if (dist >= PINCH_THRESHOLD) {
    isPinching = false;
  }
}

export function didPinch() {
  return pinchJustStarted;
}
