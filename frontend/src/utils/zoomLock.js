const ZOOM_KEYS = new Set(["+", "-", "=", "_", "0"]);
const ZOOM_CODES = new Set(["NumpadAdd", "NumpadSubtract", "Numpad0"]);

function isZoomShortcut(event) {
  return (event.ctrlKey || event.metaKey) && (ZOOM_KEYS.has(event.key) || ZOOM_CODES.has(event.code));
}

function preventZoomEvent(event) {
  if (event.cancelable) {
    event.preventDefault();
  }
}

export function installZoomLock() {
  window.addEventListener(
    "keydown",
    (event) => {
      if (isZoomShortcut(event)) {
        event.preventDefault();
      }
    },
    { passive: false }
  );

  window.addEventListener(
    "wheel",
    (event) => {
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
      }
    },
    { passive: false }
  );

  document.addEventListener(
    "touchmove",
    (event) => {
      if (event.touches.length > 1 && event.cancelable) {
        event.preventDefault();
      }
    },
    { passive: false }
  );

  let lastTouchEnd = 0;
  document.addEventListener(
    "touchend",
    (event) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300 && event.cancelable) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    },
    { passive: false }
  );

  document.addEventListener("gesturestart", preventZoomEvent, { passive: false });
  document.addEventListener("gesturechange", preventZoomEvent, { passive: false });
  document.addEventListener("gestureend", preventZoomEvent, { passive: false });
}
