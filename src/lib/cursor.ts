export type CursorMode = "default" | "view" | "link" | "drag" | "text";

export type CursorState = { label?: string; mode: CursorMode };

let current: CursorState = { mode: "default" };

export const getCursorState = () => current;

export function setCursor(next: CursorState) {
  current = next;
  window.dispatchEvent(new CustomEvent<CursorState>("axiom-cursor", { detail: next }));
}

export function onCursor(cb: (s: CursorState) => void) {
  const handler = (e: Event) => cb((e as CustomEvent<CursorState>).detail);
  window.addEventListener("axiom-cursor", handler);
  return () => window.removeEventListener("axiom-cursor", handler);
}

/** Fired when a product is flung into the cart so the UI can react. */
export function flyToCart(rect: DOMRect, color: string) {
  window.dispatchEvent(
    new CustomEvent("axiom-fly", {
      detail: { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, w: rect.width, color },
    }),
  );
}

export function onFly(cb: (d: { x: number; y: number; w: number; color: string }) => void) {
  const handler = (e: Event) => cb((e as CustomEvent).detail);
  window.addEventListener("axiom-fly", handler);
  return () => window.removeEventListener("axiom-fly", handler);
}
