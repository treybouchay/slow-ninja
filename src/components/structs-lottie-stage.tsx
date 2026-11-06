"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { StructsScene } from "@/components/catalog/structs-scene";
import { games } from "@/lib/content";

const structsHref = games.find((game) => game.slug === "structs")?.href ?? "https://www.playstructs.com/";

/**
 * Planet-constellation fleet, on the same full-bleed sky as the original page.
 * No planet circle. The two columns sit close. The command line sits in the
 * open sky under the ships, centered on the fleet.
 */
export function StructsLottieStage() {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

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
      root.style.setProperty("--fleet-launch-x", `${cx}px`);
      root.style.setProperty("--fleet-launch-y", `${anchorBottom - 12}px`);
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
      <StructsScene active onSettled={() => setReady(true)} />
      {ready ? (
        <a
          href={structsHref}
          target="_blank"
          rel="noreferrer"
          data-fleet-launch
          className="btn-bounce structs-fade-in pointer-events-auto absolute z-40 inline-flex -translate-x-1/2 -translate-y-full rounded-full bg-[var(--lime)] px-6 py-3.5 text-sm font-bold text-[var(--ink)] shadow-[4px_4px_0_var(--cyan)]"
          style={{ left: "var(--fleet-launch-x)", top: "var(--fleet-launch-y)" }}
        >
          Play Structs
        </a>
      ) : null}
    </div>
  );
}
