"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  SchemaverseSqlStage,
  UniverseAtmosphere,
} from "@/components/catalog/universe-atmosphere";
import { UniverseDossier } from "@/components/catalog/universe-dossier";
import { featuredGameIndex, games } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * Starlane — horizontal lane with travel dots above the focused circle.
 * Dossier sits on the right of the focused circle.
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
  const focusBias = mobile ? 96 : 130;

  const recenter = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const vw = viewport.clientWidth;
    if (vw <= 0) return;
    // Shift the focused circle left so the dossier fits on the right.
    setOffset(vw / 2 - (active + 0.5) * slot - focusBias);
    setReady(true);
  }, [active, focusBias, slot]);

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
      <UniverseAtmosphere active={active} lit={expanded} />

      <div className="relative z-10 mx-auto max-w-6xl px-4 md:px-6">
        <p className="font-mono-label text-[8px] tracking-widest text-[var(--cyan)] uppercase md:text-[9px]">
          Project timeline · starlane
        </p>
        <h2 className="font-display mt-3 text-3xl font-bold tracking-tight text-white md:text-5xl">
          Explore our universes
        </h2>
        <p className="mt-3 max-w-xl text-white/60">
          Use the dots above the focused world to travel the lane—each jump
          opens its dossier to the right of the circle.
        </p>
      </div>

      <div
        ref={viewportRef}
        className="relative z-10 mx-auto mt-8 w-full max-w-6xl overflow-hidden md:mt-12"
        style={{ height: mobile ? 580 : 560 }}
      >
        {/* Travel dots — above the centered circle */}
        <div
          className="pointer-events-none absolute top-4 z-50 flex flex-col items-center gap-2 md:top-6"
          style={{
            left: `calc(50% - ${focusBias}px)`,
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

        <SchemaverseSqlStage
          active={expanded && current.slug === "schemaverse"}
        />

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
                      : "mt-2 text-sm text-white/30",
                  )}
                >
                  {game.name}
                </span>
              </button>
            );
          })}
        </div>

        <div
          className={cn(
            "absolute z-40",
            mobile
              ? "top-14 right-1 w-[42%]"
              : "top-[18%] right-5 w-[min(280px,34%)]",
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
