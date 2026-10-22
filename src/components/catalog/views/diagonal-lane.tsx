"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  SchemaverseSqlStage,
  UniverseAtmosphere,
} from "@/components/catalog/universe-atmosphere";
import { games } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * Diagonal starlane experiment — same wake/focus/dossier behavior as
 * Starlane, but circles climb a / lane (older lower-left → newer upper-right).
 */

const STEP_X_DESKTOP = 210;
const STEP_Y_DESKTOP = 118;
const STEP_X_MOBILE = 132;
const STEP_Y_MOBILE = 86;
const ACTIVE_DESKTOP = 220;
const INACTIVE_DESKTOP = 64;
const ACTIVE_MOBILE = 148;
const INACTIVE_MOBILE = 48;
const LABEL_ROOM = 56;

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

function circleSize(
  index: number,
  active: number,
  expanded: boolean,
  activeSize: number,
  inactiveSize: number,
) {
  return expanded && index === active ? activeSize : inactiveSize;
}

/** Point on the segment from A→B that sits on the rim of a circle at A. */
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

export function DiagonalLaneView() {
  const [active, setActive] = useState(games.length - 1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [ready, setReady] = useState(false);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const mobile = useIsMobile();
  const stepX = mobile ? STEP_X_MOBILE : STEP_X_DESKTOP;
  const stepY = mobile ? STEP_Y_MOBILE : STEP_Y_DESKTOP;
  const activeSize = mobile ? ACTIVE_MOBILE : ACTIVE_DESKTOP;
  const inactiveSize = mobile ? INACTIVE_MOBILE : INACTIVE_DESKTOP;
  const current = games[active];
  const expanded = inView;

  const centers = useMemo(() => {
    const padX = activeSize / 2 + 24;
    const padY = activeSize / 2 + LABEL_ROOM + 16;
    return games.map((_, index) => ({
      x: padX + index * stepX,
      // Climb the diagonal: earliest sits lower-left, latest upper-right.
      y: padY + (games.length - 1 - index) * stepY,
    }));
  }, [activeSize, stepX, stepY]);

  const stageWidth =
    centers[centers.length - 1].x + activeSize / 2 + 48;
  const stageHeight = centers[0].y + activeSize / 2 + LABEL_ROOM + 48;

  const recenter = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const vw = viewport.clientWidth;
    const vh = viewport.clientHeight;
    if (vw <= 0 || vh <= 0) return;
    const focus = centers[active];
    setPan({ x: vw / 2 - focus.x, y: vh / 2 - focus.y });
    setReady(true);
  }, [active, centers]);

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

  return (
    <section
      ref={sectionRef}
      id="games"
      className="relative scroll-mt-28 overflow-hidden bg-[#070d16] py-16 md:py-28"
    >
      <UniverseAtmosphere active={active} lit={expanded} />

      <div className="relative z-10 mx-auto max-w-6xl px-4 md:px-6">
        <p className="font-mono-label text-[8px] tracking-widest text-[var(--cyan)] uppercase md:text-[9px]">
          Project timeline · diagonal
        </p>
        <h2 className="font-display mt-3 text-3xl font-bold tracking-tight text-white md:text-5xl">
          Explore our universes
        </h2>
        <p className="mt-3 max-w-xl text-white/60">
          Circles climb a diagonal lane—earliest low-left, latest high-right.
          Click one to focus; the page stays put.
        </p>
      </div>

      <div
        ref={viewportRef}
        className="relative z-10 mt-10 w-full overflow-hidden md:mt-14"
        style={{ height: Math.max(activeSize + 220, mobile ? 360 : 480) }}
      >
        <SchemaverseSqlStage active={expanded && active === 0} />
        <div
          className={cn(
            "relative will-change-transform",
            ready &&
              "transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          )}
          style={{
            width: stageWidth,
            height: stageHeight,
            transform: `translate3d(${pan.x}px, ${pan.y}px, 0)`,
          }}
        >
          <svg
            className="pointer-events-none absolute inset-0 z-0"
            width={stageWidth}
            height={stageHeight}
            aria-hidden
          >
            {games.slice(0, -1).map((_, index) => {
              const a = centers[index];
              const b = centers[index + 1];
              const ra =
                circleSize(
                  index,
                  active,
                  expanded,
                  activeSize,
                  inactiveSize,
                ) / 2;
              const rb =
                circleSize(
                  index + 1,
                  active,
                  expanded,
                  activeSize,
                  inactiveSize,
                ) / 2;
              const start = rimPoint(a.x, a.y, b.x, b.y, ra + 2);
              const end = rimPoint(b.x, b.y, a.x, a.y, rb + 2);
              return (
                <line
                  key={`lane-${index}`}
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                  stroke="rgba(255,255,255,0.4)"
                  strokeWidth={1}
                  className="transition-all duration-500"
                />
              );
            })}
          </svg>

          {games.map((game, index) => {
            const selected = expanded && index === active;
            const size = selected ? activeSize : inactiveSize;
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
                  width: Math.max(size + 24, 120),
                }}
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
                  className="relative z-20 block overflow-hidden rounded-full border-4 bg-[#070d16] transition-[width,height,box-shadow,border-color,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{
                    width: size,
                    height: size,
                    borderColor: selected
                      ? game.accent
                      : "rgba(255,255,255,0.25)",
                    boxShadow: selected
                      ? `0 0 48px ${game.accent}66`
                      : "none",
                    opacity: expanded ? 1 : 0.72,
                  }}
                >
                  <Image
                    src={game.artwork}
                    alt=""
                    fill
                    sizes={`${Math.ceil(activeSize)}px`}
                    className={cn(
                      "pointer-events-none object-cover transition-all duration-500",
                      selected ? "grayscale-0" : "grayscale-[45%]",
                    )}
                    draggable={false}
                  />
                </span>

                <span
                  className={cn(
                    "font-display text-center font-bold transition-all duration-500",
                    selected
                      ? "mt-4 text-xl text-white md:text-2xl"
                      : "mt-2 text-sm text-white/50",
                  )}
                >
                  {game.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative z-10 mx-auto mt-4 flex max-w-6xl items-center justify-between px-4 md:mt-6 md:px-6">
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

      <div
        key={current.slug}
        className={cn(
          "pop-in relative z-10 mx-auto mt-10 grid max-w-6xl overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0a1220]/92 backdrop-blur-sm transition-opacity duration-500 md:mt-14 md:grid-cols-[1.2fr_0.8fr]",
          expanded ? "opacity-100" : "opacity-40",
        )}
        style={{ boxShadow: `0 0 0 1px ${current.accent}44` }}
      >
        <div className="relative min-h-[280px] md:min-h-[440px]">
          <Image
            src={current.artwork}
            alt={current.name}
            fill
            className="pointer-events-none object-cover"
            sizes="(max-width:768px) 100vw, 60vw"
            priority
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent to-[#0a1220]/75" />
          <div className="absolute top-4 left-4 rounded-full border border-white/10 bg-black/50 px-3 py-1.5 font-mono-label text-[8px] tracking-widest text-white uppercase">
            {current.years}
          </div>
        </div>
        <div className="flex flex-col justify-center p-6 md:p-10">
          <p
            className="font-mono-label text-[8px] tracking-widest uppercase"
            style={{ color: current.accent }}
          >
            {current.mechanic}
          </p>
          <h3 className="font-display mt-3 text-3xl font-bold text-white md:text-5xl">
            {current.name}
          </h3>
          <p className="mt-2 text-lg text-white/75">{current.tagline}</p>
          <p className="mt-4 text-sm leading-relaxed text-white/60 md:text-base">
            {current.summary}
          </p>
          <p className="mt-4 text-xs font-semibold tracking-wide text-white/40 uppercase">
            {current.status}
          </p>
          <a
            href={current.href}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex w-fit rounded-full px-6 py-3.5 text-sm font-bold text-[var(--ink)]"
            style={{ background: current.accent }}
          >
            Explore more →
          </a>
        </div>
      </div>
    </section>
  );
}
