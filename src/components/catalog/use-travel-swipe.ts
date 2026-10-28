"use client";

import { useRef, type MouseEvent, type PointerEvent } from "react";

/**
 * Horizontal swipe between universes. A leftward swipe advances; a rightward
 * swipe returns. A mostly vertical gesture is left alone so the page can scroll.
 */
export function useTravelSwipe(
  active: number,
  count: number,
  onIndex: (index: number) => void,
) {
  const swipe = useRef<{ x: number; y: number; swiped: boolean } | null>(null);

  return {
    onPointerDown(event: PointerEvent<HTMLDivElement>) {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch {
        // A pointer that is no longer active cannot be captured.
      }
      swipe.current = { x: event.clientX, y: event.clientY, swiped: false };
    },
    onPointerUp(event: PointerEvent<HTMLDivElement>) {
      const start = swipe.current;
      if (!start || start.swiped) return;
      const dx = event.clientX - start.x;
      const dy = event.clientY - start.y;
      if (Math.abs(dx) >= 24 && Math.abs(dx) > Math.abs(dy)) {
        start.swiped = true;
        const next = Math.min(count - 1, Math.max(0, active + (dx < 0 ? 1 : -1)));
        if (next !== active) onIndex(next);
      }
    },
    onPointerCancel() {
      swipe.current = null;
    },
    onClickCapture(event: MouseEvent<HTMLDivElement>) {
      if (!swipe.current?.swiped) return;
      event.preventDefault();
      event.stopPropagation();
      swipe.current = null;
    },
  };
}
