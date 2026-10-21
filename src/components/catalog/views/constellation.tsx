"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { games } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * Constellation — starts zoomed out on the full V.
 * Travel dots float above the centered planet; first interact zooms in.
 */

const ACTIVE_DESKTOP = 280;
const INACTIVE_DESKTOP = 72;
const OVERVIEW_DESKTOP = 96;
const ACTIVE_MOBILE = 168;
const INACTIVE_MOBILE = 52;
const OVERVIEW_MOBILE = 64;

/** World-space planet centers — far enough apart that only one fills the frame. */
const WORLD = [
  { x: 280, y: 260 }, // Schemaverse — upper left of the V
  { x: 980, y: 480 }, // Coindroids — lower center
  { x: 1680, y: 280 }, // Structs — upper right
] as const;

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

function rimPoint(
  ax: number,
  ay: number,
  bx: number,
  by: number,
  radius: number,
) {
  const dx = bx - ax;
  const dy = by - ay;
  const len = Math.hypot(dx, dy) || 1;
  return {
    x: ax + (dx / len) * radius,
    y: ay + (dy / len) * radius,
  };
}

export function ConstellationView() {
  const [active, setActive] = useState(0);
  /** False = zoomed-out map; true = camera locked on a planet */
  const [engaged, setEngaged] = useState(false);
  const [camera, setCamera] = useState({ x: 0, y: 0, scale: 1 });
  const [ready, setReady] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const mobile = useIsMobile();
  const activeSize = mobile ? ACTIVE_MOBILE : ACTIVE_DESKTOP;
  const inactiveSize = mobile ? INACTIVE_MOBILE : INACTIVE_DESKTOP;
  const overviewSize = mobile ? OVERVIEW_MOBILE : OVERVIEW_DESKTOP;
  const current = games[active];

  const centers = useMemo(
    () =>
      WORLD.map((p) =>
        mobile ? { x: p.x * 0.62, y: p.y * 0.78 } : { x: p.x, y: p.y },
      ),
    [mobile],
  );

  const worldWidth = centers[centers.length - 1].x + 480;
  const worldHeight = Math.max(...centers.map((c) => c.y)) + 420;

  const sizeOf = useCallback(
    (index: number) => {
      if (!engaged) return overviewSize;
      return index === active ? activeSize : inactiveSize;
    },
    [active, activeSize, engaged, inactiveSize, overviewSize],
  );

  const updateCamera = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    const w = el.clientWidth;
    const h = el.clientHeight;
    if (w <= 0 || h <= 0) return;

    if (!engaged) {
      // Fit the whole constellation in frame.
      const pad = mobile ? 48 : 80;
      const scale = Math.min(
        (w - pad * 2) / worldWidth,
        (h - pad * 2) / worldHeight,
      );
      const clamped = Math.min(scale, mobile ? 0.72 : 0.55);
      setCamera({
        x: w / 2 - (worldWidth / 2) * clamped,
        y: h / 2 - (worldHeight / 2) * clamped,
        scale: clamped,
      });
    } else {
      const focus = centers[active];
      // Nudge planet up/left so the floating dossier fits below-right.
      const biasX = mobile ? 0 : Math.min(120, w * 0.1);
      setCamera({
        x: w / 2 - focus.x - biasX,
        y: h / 2 - focus.y - (mobile ? 24 : 40),
        scale: 1,
      });
    }
    setReady(true);
  }, [active, centers, engaged, mobile, worldHeight, worldWidth]);

  useEffect(() => {
    updateCamera();
    const el = viewportRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => updateCamera());
    ro.observe(el);
    window.addEventListener("resize", updateCamera);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateCamera);
    };
  }, [updateCamera]);

  // Zoom back out to the map when the section leaves focus / view.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const focused =
          entry.isIntersecting && entry.intersectionRatio >= 0.35;
        if (!focused) {
          setEngaged(false);
          setActive(0);
        }
      },
      { threshold: [0, 0.2, 0.35, 0.55], rootMargin: "-10% 0px -14% 0px" },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const engage = (index: number) => {
    setActive(index);
    setEngaged(true);
  };

  /** First interaction from overview always opens the first planet. */
  const beginJourney = () => {
    if (!engaged) engage(0);
  };

  const select = (index: number) => {
    if (!engaged) {
      engage(index);
      return;
    }
    setActive(index);
  };

  return (
    <section
      ref={sectionRef}
      id="games"
      className="relative scroll-mt-28 overflow-hidden bg-[#070c16] py-16 md:py-28"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {games.map((game, index) => (
          <div
            key={`wash-${game.slug}`}
            className={cn(
              "absolute inset-0 transition-opacity duration-700",
              engaged && index === active ? "opacity-100" : "opacity-0",
            )}
            style={{
              background: `radial-gradient(ellipse 55% 45% at 50% 45%, color-mix(in oklab, ${game.accent} 20%, transparent), transparent 70%)`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 md:px-6">
        <p className="font-mono-label text-[8px] tracking-widest text-[var(--cyan)] uppercase md:text-[9px]">
          Project timeline · constellation
        </p>
        <h2 className="font-display mt-3 text-3xl font-bold tracking-tight text-white md:text-5xl">
          Explore our universes
        </h2>
        <p className="mt-3 max-w-xl text-white/60">
          {engaged
            ? "Use the dots above the planet to jump between worlds."
            : "The full constellation at a glance. Tap a world or a travel dot to zoom into the first planet and begin."}
        </p>
      </div>

      <div
        ref={viewportRef}
        className="relative z-10 mx-auto mt-6 w-full max-w-6xl overflow-hidden md:mt-8"
        style={{ height: mobile ? 580 : 680 }}
        onClick={(e) => {
          if (!engaged && e.target === e.currentTarget) beginJourney();
        }}
      >
        {/* Travel dots — float above the focused planet */}
        <div
          className="pointer-events-none absolute top-5 z-50 flex flex-col items-center gap-2 md:top-7"
          style={{
            left: mobile ? "50%" : "calc(50% - 8%)",
            transform: "translateX(-50%)",
          }}
        >
          <div
            role="tablist"
            aria-label="Travel between universes"
            className="pointer-events-auto flex h-[43px] w-[98px] items-center justify-center gap-3"
          >
            {games.map((game, index) => {
              const selected = engaged && index === active;
              return (
                <button
                  key={`dot-${game.slug}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-label={
                    engaged
                      ? `Travel to ${game.name}`
                      : `Begin journey at ${game.name}`
                  }
                  title={game.name}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!engaged) {
                      beginJourney();
                      return;
                    }
                    select(index);
                  }}
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
            {engaged
              ? `${current.name} · ${active + 1} / ${games.length}`
              : "Overview · tap to zoom in"}
          </p>
        </div>
        <div
          className={cn(
            "relative origin-top-left will-change-transform",
            ready &&
              "transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
          )}
          style={{
            width: worldWidth,
            height: worldHeight,
            transform: `translate3d(${camera.x}px, ${camera.y}px, 0) scale(${camera.scale})`,
          }}
        >
          <svg
            className="pointer-events-none absolute inset-0 z-0"
            width={worldWidth}
            height={worldHeight}
            aria-hidden
          >
            {games.slice(0, -1).map((_, index) => {
              const a = centers[index];
              const b = centers[index + 1];
              const ra = sizeOf(index) / 2 + 2;
              const rb = sizeOf(index + 1) / 2 + 2;
              const start = rimPoint(a.x, a.y, b.x, b.y, ra);
              const end = rimPoint(b.x, b.y, a.x, a.y, rb);
              return (
                <line
                  key={`edge-${index}`}
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                  stroke="rgba(255,255,255,0.28)"
                  strokeWidth={1 / Math.max(camera.scale, 0.35)}
                  className="transition-all duration-500"
                />
              );
            })}
          </svg>

          {games.map((game, index) => {
            const selected = engaged && index === active;
            const size = sizeOf(index);
            const center = centers[index];

            return (
              <button
                key={game.slug}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  if (!engaged) {
                    beginJourney();
                    return;
                  }
                  select(index);
                }}
                aria-pressed={selected}
                aria-label={`Select ${game.name}`}
                className="absolute z-20 flex -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col items-center border-0 bg-transparent p-0 outline-none"
                style={{
                  left: center.x,
                  top: center.y,
                  width: Math.max(size + 32, 110),
                  zIndex: selected ? 30 : 20,
                }}
              >
                <span
                  className={cn(
                    "font-mono-label tracking-widest uppercase transition-all duration-500",
                    selected
                      ? "mb-3 text-[10px] text-white md:text-[11px]"
                      : "mb-2 text-[8px] text-white/45",
                  )}
                >
                  {game.era}
                </span>

                <span
                  className="relative block overflow-hidden rounded-full border bg-[#070c16] transition-[width,height,box-shadow,border-color,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{
                    width: size,
                    height: size,
                    borderWidth: selected ? 3 : 1.5,
                    borderColor: selected
                      ? game.accent
                      : "rgba(255,255,255,0.45)",
                    boxShadow: selected
                      ? `0 0 48px ${game.accent}55`
                      : "none",
                    opacity: engaged ? (selected ? 1 : 0.55) : 0.9,
                  }}
                >
                  <Image
                    src={game.artwork}
                    alt=""
                    fill
                    sizes={`${Math.ceil(activeSize)}px`}
                    className={cn(
                      "pointer-events-none object-cover transition-all duration-500",
                      selected || !engaged
                        ? "grayscale-0"
                        : "grayscale-[50%]",
                    )}
                    draggable={false}
                  />
                </span>

                <span
                  className={cn(
                    "font-display text-center font-bold transition-all duration-500",
                    selected
                      ? "mt-4 text-xl text-white md:text-2xl"
                      : "mt-2 text-sm text-white/55",
                  )}
                >
                  {game.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Compact floating dossier — bottom-right of the stage, not full-bleed */}
        <div
          key={current.slug}
          className={cn(
            "pointer-events-none absolute z-40 w-[min(340px,calc(100%-1.5rem))] rounded-[1.25rem] border border-white/10 bg-[#0a1220]/95 p-4 backdrop-blur-md transition-opacity duration-500 md:p-5",
            engaged ? "pop-in opacity-100" : "invisible opacity-0",
            mobile ? "right-3 bottom-3 left-3 w-auto" : "right-5 bottom-5",
          )}
          style={{
            maxHeight: "min(320px, 46%)",
            boxShadow: `0 0 0 1px ${current.accent}33, 0 24px 60px rgba(0,0,0,0.55)`,
          }}
        >
          <div className="max-h-full overflow-y-auto overscroll-contain pr-1">
            <p
              className="font-mono-label text-[8px] tracking-widest uppercase"
              style={{ color: current.accent }}
            >
              {current.mechanic}
            </p>
            <h3 className="font-display mt-2 text-xl font-bold text-white md:text-2xl">
              {current.name}
            </h3>
            <p className="mt-1 text-sm text-white/75">{current.tagline}</p>
            <p className="mt-3 text-xs leading-relaxed text-white/55 md:text-sm">
              {current.summary}
            </p>
            <p className="mt-3 text-[10px] font-semibold tracking-wide text-white/35 uppercase">
              {current.status}
            </p>
            <a
              href={current.href}
              target="_blank"
              rel="noreferrer"
              className="pointer-events-auto mt-4 inline-flex w-fit rounded-full px-5 py-2.5 text-sm font-bold text-[var(--ink)]"
              style={{ background: current.accent }}
            >
              Explore more →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
