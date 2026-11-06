"use client";

import { useLayoutEffect, useRef } from "react";
import { StructsScene } from "@/components/catalog/structs-scene";

/**
 * Planet-constellation fleet, on the same full-bleed sky as the original page.
 * Ships stay in the right-hand slot. The planet circle is not drawn.
 */
export function StructsLottieStage() {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const place = () => {
      const anchor = root.parentElement?.querySelector("[data-fleet-anchor]");
      if (!anchor) return;
      const s = root.getBoundingClientRect();
      const a = anchor.getBoundingClientRect();
      if (a.width <= 0 || a.height <= 0) return;
      const radius = Math.min(a.width / 4.2, a.height / 2.8);
      root.style.setProperty("--structs-cx", `${a.left - s.left + a.width / 2}px`);
      root.style.setProperty("--structs-cy", `${a.top - s.top + a.height / 2}px`);
      root.style.setProperty("--structs-r", `${radius}px`);
      root.style.setProperty(
        "--dialog-anchor",
        `${a.top - s.top + a.height / 2 + radius * 0.2}px`,
      );
    };
    place();
    const observer = new ResizeObserver(place);
    observer.observe(root);
    const anchor = root.parentElement?.querySelector("[data-fleet-anchor]");
    if (anchor) observer.observe(anchor);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} id="games" className="pointer-events-none absolute inset-0">
      <StructsScene active />
    </div>
  );
}
