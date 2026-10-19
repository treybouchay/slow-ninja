"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { games } from "@/lib/content";
import { cn } from "@/lib/utils";

/** Tighter center-to-center spacing (was ~494). */
const SLOT_DESKTOP = 236;
const SLOT_MOBILE = 152;
/** Active grows; neighbors stay small. */
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

/**
 * Circles stay minimized until the timeline scrolls into view, then the
 * focused game expands and the lane pans. Click another bubble to refocus.
 */
export function GamesTimeline() {
  const [active, setActive] = useState(games.length - 1);
  const [offset, setOffset] = useState(0);
  const [ready, setReady] = useState(false);
  /** True once the starlane is on screen — unlocks the expanded focus state. */
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

  const trackWidth = games.length * slot;

  return (
    <section
      ref={sectionRef}
      id="games"
      className="scroll-mt-28 bg-[#070d16] py-16 md:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <p className="font-mono-label text-[8px] tracking-widest text-[var(--cyan)] uppercase md:text-[9px]">
          Project timeline
        </p>
        <h2 className="font-display mt-3 text-3xl font-bold tracking-tight text-white md:text-5xl">
          Browse the catalog
        </h2>
        <p className="mt-3 max-w-xl text-white/60">
          Scroll to wake the lane—then click a circle to focus it. Your place
          on the page stays put.
        </p>
      </div>

      <div
        ref={viewportRef}
        className="relative z-10 mt-10 w-full overflow-hidden md:mt-14"
        style={{
          minHeight: activeSize + 140,
        }}
      >
        <div
          className={cn(
            "relative flex items-center will-change-transform",
            ready &&
              "transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          )}
          style={{
            width: trackWidth,
            transform: `translate3d(${offset}px, 0, 0)`,
            minHeight: activeSize + 140,
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-0 z-0 h-px -translate-y-1/2 bg-white/40"
            style={{ width: trackWidth }}
          />

          {games.map((game, index) => {
            const selected = expanded && index === active;
            const size = selected ? activeSize : inactiveSize;

            return (
              <button
                key={game.slug}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => select(index)}
                aria-pressed={selected}
                aria-label={`Select ${game.name}`}
                className="relative z-20 flex shrink-0 cursor-pointer flex-col items-center justify-center border-0 bg-transparent p-0 outline-none"
                style={{ width: slot, minHeight: activeSize + 100 }}
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
                  className="relative z-20 block overflow-hidden rounded-full border-4 transition-[width,height,box-shadow,border-color,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
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

      <div className="mx-auto mt-2 flex max-w-6xl items-center justify-between px-4 md:px-6">
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
          className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition enabled:hover:border-[var(--lime)] disabled:opacity-30"
        >
          Later →
        </button>
      </div>

      <div
        key={current.slug}
        className={cn(
          "pop-in mx-auto mt-10 grid max-w-6xl overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0a1220] transition-opacity duration-500 md:mt-14 md:grid-cols-[1.2fr_0.8fr]",
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
