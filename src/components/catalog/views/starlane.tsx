"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type MouseEvent, type PointerEvent } from "react";
import {
  SchemaverseSqlStage,
  UniverseAtmosphere,
} from "@/components/catalog/universe-atmosphere";
import { CatalogViewPicker } from "@/components/catalog/catalog-view-picker";
import { useTravelSwipe } from "@/components/catalog/use-travel-swipe";
import { UniverseDossier } from "@/components/catalog/universe-dossier";
import { featuredGameIndex, games } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * Starlane — horizontal lane with travel dots above the focused circle.
 * Dossier sits centered under the focused circle.
 */

const SLOT_DESKTOP = 280;
const SLOT_MOBILE = 180;
const ACTIVE_DESKTOP = 220;
const INACTIVE_DESKTOP = 64;
const ACTIVE_MOBILE = 148;
const INACTIVE_MOBILE = 48;

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  return mobile;
}

export function StarlaneView() {
  const [active, setActive] = useState(featuredGameIndex);
  const [offset, setOffset] = useState(0);
  const [ready, setReady] = useState(false);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const mobile = useIsMobile();
  const slot = mobile ? SLOT_MOBILE : SLOT_DESKTOP;
  const activeSize = mobile ? ACTIVE_MOBILE : ACTIVE_DESKTOP;
  const inactiveSize = mobile ? INACTIVE_MOBILE : INACTIVE_DESKTOP;
  const current = games[active];
  const expanded = inView;

  const recenter = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const vw = viewport.clientWidth;
    if (vw <= 0) return;
    setOffset(vw / 2 - (active + 0.5) * slot);
    setReady(true);
  }, [active, slot]);

  useEffect(() => {
    recenter();
    const viewport = viewportRef.current;
    if (!viewport) return;
    const ro = new ResizeObserver(() => recenter());
    ro.observe(viewport);
    window.addEventListener("resize", recenter);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", recenter);
    };
  }, [recenter]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting && entry.intersectionRatio >= 0.28);
      },
      { threshold: [0, 0.28, 0.45, 0.7], rootMargin: "-8% 0px -12% 0px" },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const select = (index: number) => {
    setActive(index);
    if (!inView) setInView(true);
  };

  const travelSwipe = useTravelSwipe(active, games.length, select);
  const drag = useRef<{
    pointerId: number;
    x: number;
    y: number;
    axis: "x" | "y" | null;
    moved: boolean;
    xOff: number;
  } | null>(null);
  const suppressClick = useRef(false);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  /** Positive when the finger has moved toward the next universe. */
  const dragShift = slot > 0 ? -dragX / slot : 0;
  const visualFocus = Math.min(games.length - 1, Math.max(0, active + dragShift));
  const emphasized =
    dragShift >= 0.34
      ? Math.min(games.length - 1, active + 1)
      : dragShift <= -0.34
        ? Math.max(0, active - 1)
        : active;

  const schemaverseIndex = games.findIndex((game) => game.slug === "schemaverse");
  const schemaWeight = expanded
    ? Math.max(0, 1 - Math.abs(schemaverseIndex - visualFocus))
    : 0;

  const sizeFor = (index: number) => {
    if (!expanded) return inactiveSize;
    const blend = Math.max(0, 1 - Math.abs(index - visualFocus));
    return inactiveSize + (activeSize - inactiveSize) * blend;
  };

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section || dragging) return;
    const measure = () => {
      const circle = section.querySelector(
        'button[aria-pressed="true"] span.rounded-full',
      );
      if (!circle) return;
      const viewport = viewportRef.current;
      if (viewport) section.style.setProperty("--lane-top", `${viewport.offsetTop}px`);
      const s = section.getBoundingClientRect();
      const c = circle.getBoundingClientRect();
      section.style.setProperty("--structs-cx", `${c.left - s.left + c.width / 2}px`);
      section.style.setProperty("--structs-cy", `${c.top - s.top + c.height / 2}px`);
      section.style.setProperty("--structs-r", `${c.width / 2}px`);
      const name = section.querySelector('button[aria-pressed="true"] .font-display');
      if (name) {
        const title = name.getBoundingClientRect();
        if (title.height > 0) {
          section.style.setProperty("--dialog-anchor", `${title.top - s.top}px`);
        }
      }
    };
    measure();
    const timer = window.setTimeout(measure, 560);
    const settled = window.setTimeout(measure, 900);
    window.addEventListener("resize", measure);
    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(settled);
      window.removeEventListener("resize", measure);
    };
  }, [mobile, dragging, active, ready, offset, expanded]);

  const onLanePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!mobile) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    drag.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      axis: null,
      moved: false,
      xOff: 0,
    };
  };

  const onLanePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const start = drag.current;
    if (!start || start.pointerId !== event.pointerId) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (!start.axis) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      start.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
    }
    if (start.axis !== "x") return;
    start.moved = true;
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // The pointer can already be gone.
    }
    let x = dx;
    const atStart = active === 0 && x > 0;
    const atEnd = active === games.length - 1 && x < 0;
    if (atStart || atEnd) x *= 0.32;
    else x = Math.max(-slot, Math.min(slot, x));
    start.xOff = x;
    setDragging(true);
    setDragX(x);
  };

  const onLanePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const start = drag.current;
    if (!start || start.pointerId !== event.pointerId) return;
    drag.current = null;
    if (start.axis === "x" && start.moved) {
      suppressClick.current = true;
      const commit = slot * 0.34;
      let next = active;
      if (start.xOff <= -commit) next = Math.min(games.length - 1, active + 1);
      else if (start.xOff >= commit) next = Math.max(0, active - 1);
      if (next !== active) select(next);
    }
    setDragX(0);
    setDragging(false);
  };

  const onLanePointerCancel = () => {
    drag.current = null;
    setDragX(0);
    setDragging(false);
  };

  const onLaneClickCapture = (event: MouseEvent<HTMLDivElement>) => {
    if (!suppressClick.current) return;
    suppressClick.current = false;
    event.preventDefault();
    event.stopPropagation();
  };

  const trackWidth = games.length * slot;
  const laneHeight = mobile ? 420 : 500;
  const trackMargin = mobile ? 72 : 88;
  const trackShift = `translate3d(${offset + (mobile ? dragX : 0)}px, 0, 0)`;

  const laneLines = games.slice(0, -1).map((_, index) => {
    const leftSize = sizeFor(index);
    const rightSize = sizeFor(index + 1);
    const leftEdge = (index + 0.5) * slot + leftSize / 2;
    const rightEdge = (index + 1.5) * slot - rightSize / 2;
    const width = Math.max(0, rightEdge - leftEdge);

    return (
      <div
        key={`lane-${index}`}
        aria-hidden
        className={cn(
          "pointer-events-none absolute top-1/2 h-px -translate-y-1/2 bg-white/40",
          !dragging && "transition-all duration-500",
        )}
        style={{ left: leftEdge, width }}
      />
    );
  });

  return (
    <section
      ref={sectionRef}
      id="games"
      className="relative scroll-mt-28 overflow-hidden bg-[#070d16] py-16 md:py-28"
    >
      {ready ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 z-0 mx-auto w-full max-w-6xl overflow-hidden"
          style={{ top: "var(--lane-top, 0px)", height: laneHeight }}
        >
          <div
            className={cn(
              "relative flex items-center",
              ready && !dragging && "camera-glide",
            )}
            style={{
              width: trackWidth,
              transform: trackShift,
              minHeight: activeSize + 180,
              marginTop: trackMargin,
            }}
          >
            {laneLines}
          </div>
        </div>
      ) : null}

      <UniverseAtmosphere
        active={active}
        lit={expanded}
        focus={visualFocus}
        immediate={dragging}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 md:px-6">
        <p className="font-mono-label text-[8px] tracking-widest text-[var(--cyan)] uppercase md:text-[9px]">
          Project timeline · starlane
        </p>
        <h2 className="font-display mt-3 text-3xl font-bold tracking-tight text-white md:text-5xl">
          Explore our universes
        </h2>
        <p className="mt-3 max-w-xl text-white/60">
          Use the dots above the focused world to travel the lane—each jump
          opens its dossier under the circle.
        </p>
        <CatalogViewPicker />
      </div>

      <div
        ref={viewportRef}
        className={cn(
          "relative z-20 mx-auto mt-8 w-full max-w-6xl overflow-hidden md:mt-12",
          mobile && "touch-pan-y",
        )}
        style={{ height: laneHeight }}
        {...(mobile
          ? {
              onPointerDown: onLanePointerDown,
              onPointerMove: onLanePointerMove,
              onPointerUp: onLanePointerUp,
              onPointerCancel: onLanePointerCancel,
              onClickCapture: onLaneClickCapture,
            }
          : {})}
      >
        {/* Travel dots — above the centered circle */}
        <div className="pointer-events-none absolute top-4 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-2 md:top-6">
          <div
            role="tablist"
            aria-label="Travel between universes"
            className="pointer-events-auto flex h-[43px] w-[98px] touch-none items-center justify-center gap-3"
            {...(mobile ? {} : travelSwipe)}
          >
            {games.map((game, index) => {
              const selected = expanded && index === emphasized;
              return (
                <button
                  key={`dot-${game.slug}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-label={`Travel to ${game.name}`}
                  title={game.name}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => select(index)}
                  className={cn(
                    "rounded-full border transition-all duration-300",
                    selected
                      ? "h-3.5 w-3.5 scale-110"
                      : "h-2.5 w-2.5 border-white/35 bg-white/25 hover:border-white/60 hover:bg-white/45",
                  )}
                  style={
                    selected
                      ? {
                          background: game.accent,
                          borderColor: game.accent,
                          boxShadow: `0 0 16px ${game.accent}88`,
                        }
                      : undefined
                  }
                />
              );
            })}
          </div>
          <p className="font-mono-label text-[8px] tracking-widest text-white/45 uppercase">
            {games[emphasized].name} · {emphasized + 1} / {games.length}
          </p>
        </div>

        {schemaWeight > 0.04 ? (
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              opacity: schemaWeight,
              transition: dragging ? "none" : "opacity 700ms ease-out",
            }}
          >
            <SchemaverseSqlStage active />
          </div>
        ) : null}

        <div
          className={cn(
            "relative flex items-center will-change-transform",
            ready && !dragging && "camera-glide",
          )}
          style={{
            width: trackWidth,
            transform: trackShift,
            minHeight: activeSize + 180,
            marginTop: trackMargin,
          }}
        >
          {games.map((game, index) => {
            const selected = expanded && index === emphasized;
            const size = sizeFor(index);

            return (
              <button
                key={game.slug}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => select(index)}
                aria-pressed={selected}
                aria-label={`Select ${game.name}`}
                className="relative z-20 flex shrink-0 cursor-pointer flex-col items-center justify-center border-0 bg-transparent p-0 outline-none"
                style={{ width: slot, minHeight: activeSize + 120 }}
              >
                <span
                  className={cn(
                    "font-mono-label tracking-widest uppercase transition-all duration-500",
                    selected
                      ? "mb-3 text-[9px] text-white md:text-[10px]"
                      : "mb-2 text-[8px] text-white/45",
                  )}
                >
                  {game.era}
                </span>

                <span
                  className={cn(
                    "relative z-20 block overflow-hidden rounded-full border-4 bg-[#070d16]",
                    !dragging &&
                      "transition-[width,height,box-shadow,border-color,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  )}
                  style={{
                    width: size,
                    height: size,
                    borderColor: selected
                      ? game.accent
                      : "rgba(255,255,255,0.25)",
                    boxShadow: selected
                      ? `0 0 48px ${game.accent}66`
                      : "none",
                    opacity: !expanded ? 0.72 : selected ? 1 : 0.22,
                  }}
                >
                  <Image
                    src={game.artwork}
                    alt=""
                    fill
                    sizes={`${Math.ceil(activeSize)}px`}
                    className={cn(
                      "pointer-events-none object-cover transition-all duration-500",
                      selected ? "grayscale-0" : "grayscale-[80%]",
                    )}
                    draggable={false}
                  />
                </span>

                <span
                  className={cn(
                    "font-display text-center font-bold transition-all duration-500",
                    selected
                      ? "mt-4 text-xl text-white md:text-2xl"
                      : "mt-2 text-sm text-white/10",
                  )}
                >
                  {game.name}
                </span>
              </button>
            );
          })}
        </div>

      </div>

      <div className="relative z-10 mx-auto mt-2 w-full max-w-6xl px-4 md:px-6">
        <div
          className={cn(
            "mx-auto w-full max-w-[340px]",
            expanded ? "" : "hidden",
          )}
        >
          <UniverseDossier
            key={current.slug}
            game={current}
            className={expanded ? "dossier-spring" : "hidden"}
          />
        </div>
      </div>
    </section>
  );
}
