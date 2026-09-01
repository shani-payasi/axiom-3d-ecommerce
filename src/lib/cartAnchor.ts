export const cartAnchor = { x: 0, y: 0, ready: false };

export function updateCartAnchor() {
  const el = document.querySelector<HTMLElement>("[data-cart-anchor]");
  if (!el) return;
  const r = el.getBoundingClientRect();
  cartAnchor.x = r.left + r.width / 2;
  cartAnchor.y = r.top + r.height / 2;
  cartAnchor.ready = true;
}
