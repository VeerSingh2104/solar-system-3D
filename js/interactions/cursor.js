let cursorEl;
let smoothX = window.innerWidth / 2;
let smoothY = window.innerHeight / 2;

export function initCursor() {
  cursorEl = document.createElement("div");
  cursorEl.id = "finger-cursor";

  document.body.appendChild(cursorEl);
}

export function updateCursor(finger) {
  if (!finger.handDetected) {
    cursorEl.style.opacity = "0";
    return;
  }

  cursorEl.style.opacity = "1";

  const targetX = finger.x * window.innerWidth;
  const targetY = finger.y * window.innerHeight;

  // Smooth interpolation
  smoothX += (targetX - smoothX) * 0.2;
  smoothY += (targetY - smoothY) * 0.2;

  cursorEl.style.transform = `translate(${smoothX}px, ${smoothY}px)`;
}
