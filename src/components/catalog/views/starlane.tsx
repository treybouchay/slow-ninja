"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { games } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * Starlane — horizontal lane with travel dots above the focused circle.
 * Dossier always floats to the left of the focused circle.
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

function circleSize(
  index: number,
  active: number,
  expanded: boolean,
  activeSize: number,
  inactiveSize: number,
) {
  return expanded && index === active ? activeSize : inactiveSize;
}

export function StarlaneView() {
  const [active, setActive] = useState(0);
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
    // Bias circle right so the left-side dossier has room.
    const bias = mobile ? 0 : Math.min(120, vw * 0.1);
    setOffset(vw / 2 - (active + 0.5) * slot + bias);
    setReady(true);
  }, [active, mobile, slot]);

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
      className="relative scroll-mt-28 overflow-hidden bg-[#070d16] py-16 md:py-28"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {games.map((game, index) => {
          const lit = expanded && index === active;
          return (
            <div
              key={`atmosphere-${game.slug}`}
              className={cn(
                "absolute inset-0 transition-opacity duration-700 ease-out",
                lit ? "opacity-100" : "opacity-0",
              )}
            >
              <Image
                src={game.artwork}
                alt=""
                fill
                sizes="100vw"
                className="object-cover scale-110 blur-2xl saturate-125"
                style={{ opacity: 0.38 }}
                priority={index === 0}
              />
              <div
                className="absolute inset-0"
                style={{
                  background: `
                    radial-gradient(ellipse 70% 55% at 18% 30%, color-mix(in oklab, ${game.accent} 28%, transparent), transparent 70%),
                    radial-gradient(ellipse 55% 45% at 88% 70%, color-mix(in oklab, ${game.accent} 18%, transparent), transparent 65%),
                    linear-gradient(180deg, #070d16e6 0%, #070d16aa 45%, #070d16f2 100%)
                  `,
                }}
              />
              {game.slug === "schemaverse" ? (
                <div className="universe-sql-grid absolute inset-0 opacity-35" />
              ) : null}
              {game.slug === "coindroids" ? (
                <div className="universe-ruins absolute inset-0 opacity-40" />
              ) : null}
              {game.slug === "structs" ? (
                <div className="universe-nebula absolute inset-0 opacity-50" />
              ) : null}
            </div>
          );
        })}
        <div
          className={cn(
            "absolute inset-0 bg-[#070d16]/55 transition-opacity duration-700",
            expanded ? "opacity-0" : "opacity-100",
          )}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 md:px-6">
        <p className="font-mono-label text-[8px] tracking-widest text-[var(--cyan)] uppercase md:text-[9px]">
          Project timeline · starlane
        </p>
        <h2 className="font-display mt-3 text-3xl font-bold tracking-tight text-white md:text-5xl">
          Explore our universes
        </h2>
        <p className="mt-3 max-w-xl text-white/60">
          Use the dots above the focused world to travel the lane—each jump
          opens its dossier beside the circle.
        </p>
      </div>

      <div
        ref={viewportRef}
        className="relative z-10 mx-auto mt-8 w-full max-w-6xl overflow-hidden md:mt-12"
        style={{ height: mobile ? 520 : 600 }}
      >
        {/* Travel dots — above the centered circle */}
        <div
          className="pointer-events-none absolute top-4 z-50 flex flex-col items-center gap-2 md:top-6"
          style={{
            left: mobile ? "50%" : "calc(50% + 8%)",
            transform: "translateX(-50%)",
          }}
        >
          <div
            role="tablist"
            aria-label="Travel between universes"
            className="pointer-events-auto flex h-[43px] w-[98px] items-center justify-center gap-3"
          >
            {games.map((game, index) => {
              const selected = expanded && index === active;
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
            {current.name} · {active + 1} / {games.length}
          </p>
        </div>

        <div
          className={cn(
            "relative flex items-center will-change-transform",
            ready && "camera-glide",
          )}
          style={{
            width: trackWidth,
            transform: `translate3d(${offset}px, 0, 0)`,
            minHeight: activeSize + 180,
            marginTop: mobile ? 72 : 88,
          }}
        >
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

        {/* Floating dossier — always to the left of the focused circle */}
        <div
          key={current.slug}
          className={cn(
            "pointer-events-none absolute z-40 w-[min(320px,calc(100%-1.5rem))] rounded-[1.25rem] border border-white/10 bg-[#0a1220]/95 p-4 backdrop-blur-md md:p-5",
            expanded ? "dossier-spring opacity-100" : "invisible opacity-0",
            mobile
              ? "right-3 bottom-3 left-3 w-auto"
              : "top-1/2 left-4 -translate-y-1/2",
          )}
          style={{
            maxHeight: mobile ? "38%" : "min(340px, 72%)",
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
