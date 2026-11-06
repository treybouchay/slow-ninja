"use client";

import { useLayoutEffect, useRef } from "react";
import { StructsScene } from "@/components/catalog/structs-scene";

/**
 * Planet-constellation fleet, on the same full-bleed sky as the original page.
 * No planet circle. The two columns sit close. The command line sits in the
 * open sky under the ships, centered on the fleet.
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
      if (a.width <= 0 || a.height <= 0 || s.width <= 0) return;
      const previous = Math.min(a.width / 4.2, a.height / 2.8) * 0.81;
      const ship = Math.min(previous * 1.22, (a.height - 12) / 3);
      const gap = ship * 0.58;
      const cx = a.left - s.left + a.width / 2;
      const cy = a.top - s.top + a.height / 2;
      root.style.setProperty("--structs-cx", `${cx}px`);
      root.style.setProperty("--structs-cy", `${cy}px`);
      root.style.setProperty("--structs-ship", `${ship}px`);
      root.style.setProperty("--structs-col-top", `${cy - ship * 1.5}px`);
      root.style.setProperty("--structs-left", `${s.width - (cx - gap / 2)}px`);
      root.style.setProperty("--structs-right", `${cx + gap / 2}px`);
      const shipBottom = cy + ship * 1.5;
      const anchorBottom = a.bottom - s.top;
      root.style.setProperty("--dialog-x", `${cx}px`);
      root.style.setProperty("--dialog-anchor", `${(shipBottom + anchorBottom) / 2}px`);
      root.style.setProperty("--dialog-shift", "-50%");
    };
    place();
    const observer = new ResizeObserver(place);
    observer.observe(root);
    const anchor = root.parentElement?.querySelector("[data-fleet-anchor]");
    if (anchor) observer.observe(anchor);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      id="games"
      className="pointer-events-none absolute inset-0"
    >
      <StructsScene active />
    </div>
  );
}
