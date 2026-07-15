/**
 * Install irreversible-ish visitor safeguards for kiosk stations.
 * Returns a cleanup function.
 */
export function installKioskSafeguards(): () => void {
  if (typeof document === "undefined") return () => undefined;

  const onContextMenu = (event: Event) => {
    event.preventDefault();
  };

  const onDragStart = (event: DragEvent) => {
    const target = event.target as HTMLElement | null;
    if (!target) return;
    if (target.tagName === "IMG" || target.closest("img")) {
      event.preventDefault();
    }
  };

  const onGesture = (event: Event) => {
    event.preventDefault();
  };

  const onTouchMove = (event: TouchEvent) => {
    // Block multi-touch pinch where possible
    if (event.touches.length > 1) {
      event.preventDefault();
    }
  };

  document.addEventListener("contextmenu", onContextMenu, { capture: true });
  document.addEventListener("dragstart", onDragStart, { capture: true });
  document.addEventListener("gesturestart", onGesture as EventListener, {
    capture: true,
    passive: false,
  } as AddEventListenerOptions);
  document.addEventListener("gesturechange", onGesture as EventListener, {
    capture: true,
    passive: false,
  } as AddEventListenerOptions);
  document.addEventListener("gestureend", onGesture as EventListener, {
    capture: true,
    passive: false,
  } as AddEventListenerOptions);
  document.addEventListener("touchmove", onTouchMove, {
    capture: true,
    passive: false,
  });

  document.documentElement.classList.add("kiosk-locked");

  return () => {
    document.removeEventListener("contextmenu", onContextMenu, true);
    document.removeEventListener("dragstart", onDragStart, true);
    document.removeEventListener("gesturestart", onGesture as EventListener, true);
    document.removeEventListener("gesturechange", onGesture as EventListener, true);
    document.removeEventListener("gestureend", onGesture as EventListener, true);
    document.removeEventListener("touchmove", onTouchMove, true);
    document.documentElement.classList.remove("kiosk-locked");
  };
}
