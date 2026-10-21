"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Subtle scroll parallax for the hero composition.
 * Respects prefers-reduced-motion.
 */
export function HeroParallax({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const applyMq = () => setReduce(mq.matches);
    applyMq();
    mq.addEventListener("change", applyMq);

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        // Move content slower than scroll while hero is in view.
        const progress = Math.min(1, Math.max(0, -rect.top / (rect.height || 1)));
        setOffset(progress * 48);
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      mq.removeEventListener("change", applyMq);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="will-change-transform"
      style={
        reduce
          ? undefined
          : {
              transform: `translate3d(0, ${offset}px, 0)`,
              transition: "transform 0.08s linear",
            }
      }
    >
      {children}
    </div>
  );
}
