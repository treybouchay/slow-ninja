"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { games } from "@/lib/content";
import { cn } from "@/lib/utils";

/** Center-to-center spacing from Figma (~494px). */
const SLOT_DESKTOP = 494;
const SLOT_MOBILE = 280;
/** Active / inactive diameters from Figma (304 / 68). */
const ACTIVE_DESKTOP = 304;
const INACTIVE_DESKTOP = 68;
const ACTIVE_MOBILE = 180;
const INACTIVE_MOBILE = 52;

/**
 * Screenshot timeline that pans like the Figma frames:
 * click a neighbor → whole lane translateX-centers it while it grows
 * and the previous focus shrinks. No URL changes, no page jump.
 */
export function GamesTimeline() {
  const [active, setActive] = useState(games.length - 1);
  const [slot, setSlot] = useState(SLOT_DESKTOP);
  const [activeSize, setActiveSize] = useState(ACTIVE_DESKTOP);
  const [inactiveSize, setInactiveSize] = useState(INACTIVE_DESKTOP);
  const [offset, setOffset] = useState(0);
  const viewportRef = useRef<HTMLDivElement>(null);
  const current = games[active];

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => {
      const mobile = mq.matches;
      setSlot(mobile ? SLOT_MOBILE : SLOT_DESKTOP);
      setActiveSize(mobile ? ACTIVE_MOBILE : ACTIVE_DESKTOP);
      setInactiveSize(mobile ? INACTIVE_MOBILE : INACTIVE_DESKTOP);
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const recenter = () => {
      const vw = viewport.clientWidth;
      // Center of active slot lands at viewport midpoint (Figma pan)
      setOffset(vw / 2 - (active + 0.5) * slot);
    };

    recenter();
    const ro = new ResizeObserver(recenter);
    ro.observe(viewport);
    return () => ro.disconnect();
  }, [active, slot]);

  const select = (index: number) => {
    if (index === active) return;
    setActive(index);
  };

  const trackWidth = games.length * slot;

  return (
    <section
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
          Click a circle—the lane slides to focus it and opens the dossier
          below. Your place on the page stays put.
        </p>
      </div>

      {/* Sliding starlane — overflow clips off-screen neighbors like Figma */}
      <div
        ref={viewportRef}
        className="relative mt-10 overflow-hidden md:mt-14"
        style={{
          minHeight: activeSize + 120,
        }}
      >
        <div
          className="relative flex items-center transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
          style={{
            width: trackWidth,
            transform: `translate3d(${offset}px, 0, 0)`,
            minHeight: activeSize + 120,
          }}
        >
          {/* Line rides with the track */}
          <div
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-0 h-px -translate-y-1/2 bg-white/40"
            style={{ width: trackWidth }}
          />

          {games.map((game, index) => {
            const selected = index === active;
            const size = selected ? activeSize : inactiveSize;

            return (
              <button
                key={game.slug}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => select(index)}
                aria-pressed={selected}
                className="relative z-10 flex shrink-0 flex-col items-center justify-center border-0 bg-transparent p-0 outline-none"
                style={{ width: slot }}
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
                  className="relative block overflow-hidden rounded-full border-4 transition-[width,height,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{
                    width: size,
                    height: size,
                    borderColor: selected
                      ? game.accent
                      : "rgba(255,255,255,0.25)",
                    boxShadow: selected
                      ? `0 0 48px ${game.accent}66`
                      : "none",
                  }}
                >
                  <Image
                    src={game.artwork}
                    alt={game.name}
                    fill
                    sizes={`${size}px`}
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
          onClick={() => setActive((i) => Math.max(0, i - 1))}
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
          onClick={() => setActive((i) => Math.min(games.length - 1, i + 1))}
          disabled={active === games.length - 1}
          className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition enabled:hover:border-[var(--lime)] disabled:opacity-30"
        >
          Later →
        </button>
      </div>

      <div
        key={current.slug}
        className="pop-in mx-auto mt-10 grid max-w-6xl overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0a1220] md:mt-14 md:grid-cols-[1.2fr_0.8fr]"
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
