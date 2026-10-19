"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { games } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * Working timeline version — pan + grow/shrink animation verified.
 * Circles wake when the section enters view; dossier sits beside the
 * expanded focus (not a separate card). Starlane segments stop at
 * each circle edge and never run past the last bubble.
 */

/** Tighter center-to-center spacing. */
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

function circleSize(
  index: number,
  active: number,
  expanded: boolean,
  activeSize: number,
  inactiveSize: number,
) {
  return expanded && index === active ? activeSize : inactiveSize;
}

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
    // Nudge focus left when the side dossier is visible so circle + copy balance
    const dossierShift = expanded && !mobile ? Math.min(160, vw * 0.12) : 0;
    setOffset(vw / 2 - (active + 0.5) * slot - dossierShift);
    setReady(true);
  }, [active, slot, expanded, mobile]);

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
          minHeight: mobile
            ? activeSize + (expanded ? 360 : 140)
            : activeSize + 160,
        }}
      >
        {/* Sliding starlane */}
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
          {/*
            Line segments between circle edges only — never through a bubble,
            never past the last circle.
          */}
          {games.slice(0, -1).map((_, index) => {
            const leftSize = circleSize(
              index,
              active,
              expanded,
              activeSize,
              inactiveSize,
            );
            const rightSize = circleSize(
              index + 1,
              active,
              expanded,
              activeSize,
              inactiveSize,
            );
            const leftEdge = (index + 0.5) * slot + leftSize / 2;
            const rightEdge = (index + 1.5) * slot - rightSize / 2;
            const width = Math.max(0, rightEdge - leftEdge);

            return (
              <div
                key={`lane-${index}`}
                aria-hidden
                className="pointer-events-none absolute top-1/2 z-0 h-px -translate-y-1/2 bg-white/40 transition-all duration-500"
                style={{ left: leftEdge, width }}
              />
            );
          })}

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

        {/* Dossier beside the expanded focus — not a separate card */}
        <aside
          className={cn(
            "z-30 px-4 transition-all duration-500 md:absolute md:top-1/2 md:left-[calc(50%+0.5rem)] md:max-w-md md:-translate-y-1/2 md:px-0 md:pl-[calc(var(--focus)/2+1.25rem)]",
            expanded
              ? "pointer-events-auto translate-y-0 opacity-100"
              : "pointer-events-none translate-y-2 opacity-0 md:translate-y-[-40%]",
          )}
          style={
            {
              ["--focus" as string]: `${activeSize}px`,
            } as CSSProperties
          }
          aria-hidden={!expanded}
        >
          <div className="mt-6 md:mt-0">
            <p
              className="font-mono-label text-[8px] tracking-widest uppercase md:text-[9px]"
              style={{ color: current.accent }}
            >
              {current.mechanic}
            </p>
            <h3 className="font-display mt-3 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
              {current.name}
            </h3>
            <p className="mt-2 text-base text-white/75 md:text-lg">
              {current.tagline}
            </p>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/55 md:text-base">
              {current.summary}
            </p>
            <p className="mt-4 text-xs font-semibold tracking-wide text-white/40 uppercase">
              {current.status}
            </p>
            <a
              href={current.href}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex w-fit rounded-full px-6 py-3.5 text-sm font-bold text-[var(--ink)]"
              style={{ background: current.accent }}
            >
              Explore more →
            </a>
          </div>
        </aside>
      </div>

      <div className="mx-auto mt-4 flex max-w-6xl items-center justify-between px-4 md:mt-6 md:px-6">
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
    </section>
  );
}
