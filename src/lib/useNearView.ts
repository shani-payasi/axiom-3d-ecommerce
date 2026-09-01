import { useEffect, useState, type RefObject } from "react";

/** Mounts heavy scenes only while their container is anywhere near the viewport. */
export function useNearView<T extends HTMLElement>(ref: RefObject<T | null>, margin = "400px") {
  const [near, setNear] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver((entries) => setNear(entries[0].isIntersecting), { rootMargin: margin });
    io.observe(node);
    return () => io.disconnect();
  }, [ref, margin]);
  return near;
}
