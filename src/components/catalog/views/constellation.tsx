"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { games } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * Constellation layout from Figma (node 1:3):
 * shallow V / arch — side nodes high, center node lower.
 * Focused circle grows; dossier floats beside it (not a bottom section).
 * Wake / select / Earlier–Later interactions match Starlane.
 */

const ACTIVE_DESKTOP = 280;
const INACTIVE_DESKTOP = 68;
const ACTIVE_MOBILE = 168;
const INACTIVE_MOBILE = 52;

/** Normalized stage positions — V / arch matching Figma. */
const LAYOUT = [
  { x: 0.18, y: 0.36 }, // Schemaverse — upper left
  { x: 0.5, y: 0.58 }, // Coindroids — lower center
  { x: 0.82, y: 0.38 }, // Structs — upper right
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
  const [active, setActive] = useState(games.length - 1);
  const [inView, setInView] = useState(false);
  const [stageSize, setStageSize] = useState({ w: 1100, h: 520 });
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const mobile = useIsMobile();
  const activeSize = mobile ? ACTIVE_MOBILE : ACTIVE_DESKTOP;
  const inactiveSize = mobile ? INACTIVE_MOBILE : INACTIVE_DESKTOP;
  const current = games[active];
  const expanded = inView;

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const measure = () => {
      setStageSize({
        w: stage.clientWidth || 1100,
        h: stage.clientHeight || 520,
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(stage);
    return () => ro.disconnect();
  }, []);

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

  const centers = useMemo(
    () =>
      LAYOUT.map((p) => ({
        x: p.x * stageSize.w,
        y: p.y * stageSize.h,
      })),
    [stageSize.h, stageSize.w],
  );

  const select = (index: number) => {
    setActive(index);
    if (!inView) setInView(true);
  };

  const sizeOf = (index: number) =>
    expanded && index === active ? activeSize : inactiveSize;

  const focus = centers[active];
  const focusSize = sizeOf(active);

  // Float dossier near the focused circle (Figma: beside/below the node).
  const cardWidth = mobile ? Math.min(stageSize.w - 32, 340) : 360;
  const cardHeight = mobile ? 300 : 340;
  let cardLeft: number;
  let cardTop: number;
  if (active === games.length - 1) {
    // Structs (right) — Figma places the card under/right of the node.
    cardLeft = focus.x - cardWidth * 0.35;
    cardTop = focus.y + focusSize / 2 + 28;
  } else if (active === 0) {
    // Schemaverse (left) — open to the right.
    cardLeft = focus.x + focusSize / 2 + 16;
    cardTop = focus.y - 20;
  } else {
    // Coindroids (center) — open to the right, slightly below.
    cardLeft = focus.x + focusSize / 2 + 16;
    cardTop = focus.y + focusSize * 0.1;
  }
  cardLeft = Math.max(12, Math.min(cardLeft, stageSize.w - cardWidth - 12));
  cardTop = Math.max(8, Math.min(cardTop, stageSize.h - cardHeight));

  return (
    <section
      ref={sectionRef}
      id="games"
      className="relative scroll-mt-28 overflow-hidden bg-[#070c16] py-16 md:py-28"
    >
      {/* Soft universe wash — quieter than starlane so the V reads clean */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {games.map((game, index) => (
          <div
            key={`wash-${game.slug}`}
            className={cn(
              "absolute inset-0 transition-opacity duration-700",
              expanded && index === active ? "opacity-100" : "opacity-0",
            )}
            style={{
              background: `radial-gradient(ellipse 50% 40% at ${LAYOUT[index].x * 100}% ${LAYOUT[index].y * 100}%, color-mix(in oklab, ${game.accent} 18%, transparent), transparent 70%)`,
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
          A shallow arch of worlds—click a circle to grow it and open its
          dossier beside the node.
        </p>
      </div>

      <div
        ref={stageRef}
        className="relative z-10 mx-auto mt-8 w-full max-w-6xl px-2 md:mt-12 md:px-4"
        style={{ height: mobile ? 560 : 620 }}
      >
        <svg
          className="pointer-events-none absolute inset-0 z-0 h-full w-full"
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
                stroke="rgba(255,255,255,0.35)"
                strokeWidth={1}
                className="transition-all duration-500"
              />
            );
          })}
        </svg>

        {games.map((game, index) => {
          const selected = expanded && index === active;
          const size = sizeOf(index);
          const center = centers[index];

          return (
            <button
              key={game.slug}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => select(index)}
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
                    : "mb-2 text-[8px] text-white/50",
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
                    : "rgba(255,255,255,0.55)",
                  boxShadow: selected
                    ? `0 0 48px ${game.accent}55`
                    : "none",
                  opacity: expanded ? 1 : 0.75,
                }}
              >
                <Image
                  src={game.artwork}
                  alt=""
                  fill
                  sizes={`${Math.ceil(activeSize)}px`}
                  className={cn(
                    "pointer-events-none object-cover transition-all duration-500",
                    selected ? "grayscale-0" : "grayscale-[40%]",
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

        {/* Floating dossier — anchored to selected circle; clicks pass through except CTA */}
        <div
          key={current.slug}
          className={cn(
            "pop-in pointer-events-none absolute z-40 rounded-[1.25rem] border border-white/10 bg-[#0a1220]/95 p-5 shadow-[0_24px_60px_rgba(0,0,0,0.55)] backdrop-blur-md transition-[left,top,opacity] duration-500 md:p-6",
            expanded ? "opacity-100" : "opacity-0",
          )}
          style={{
            left: cardLeft,
            top: cardTop,
            width: cardWidth,
            boxShadow: `0 0 0 1px ${current.accent}33, 0 24px 60px rgba(0,0,0,0.55)`,
          }}
        >
          <p
            className="font-mono-label text-[8px] tracking-widest uppercase"
            style={{ color: current.accent }}
          >
            {current.mechanic}
          </p>
          <h3 className="font-display mt-2 text-2xl font-bold text-white md:text-3xl">
            {current.name}
          </h3>
          <p className="mt-1 text-sm text-white/75 md:text-base">
            {current.tagline}
          </p>
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
            className="pointer-events-auto mt-5 inline-flex w-fit rounded-full px-5 py-2.5 text-sm font-bold text-[var(--ink)]"
            style={{ background: current.accent }}
          >
            Explore more →
          </a>
        </div>
      </div>

      <div className="relative z-10 mx-auto mt-2 flex max-w-6xl items-center justify-between px-4 md:px-6">
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            setActive((i) => Math.max(0, i - 1));
            if (!inView) setInView(true);
          }}
          disabled={active === 0}
          className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition enabled:hover:border-[var(--cyan)] disabled:opacity-30"
        >
          ← Earlier
        </button>
        <span className="font-mono-label text-[8px] text-white/40 uppercase">
          {active + 1} / {games.length}
        </span>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            setActive((i) => Math.min(games.length - 1, i + 1));
            if (!inView) setInView(true);
          }}
          disabled={active === games.length - 1}
          className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition enabled:hover:border-[var(--violet)] disabled:opacity-30"
        >
          Later →
        </button>
      </div>
    </section>
  );
}
