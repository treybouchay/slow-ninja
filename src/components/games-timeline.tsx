"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { games } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * In-place horizontal timeline — selection never changes the URL,
 * so the page does not jump to the top.
 */
export function GamesTimeline() {
  const [active, setActive] = useState(games.length - 1);
  const trackRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = games[active];

  useEffect(() => {
    const track = trackRef.current;
    const item = itemRefs.current[active];
    if (!track || !item) return;

    const center = () => {
      const left =
        item.offsetLeft - track.clientWidth / 2 + item.offsetWidth / 2;
      track.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
    };

    // Wait a frame so size transitions apply, then center the track only
    // (never window.scrollTo / scrollIntoView on the page).
    const id = window.requestAnimationFrame(center);
    const t = window.setTimeout(center, 320);
    return () => {
      window.cancelAnimationFrame(id);
      window.clearTimeout(t);
    };
  }, [active]);

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

      {/* Horizontal starlane */}
      <div className="relative mt-10 md:mt-14">
        <div
          aria-hidden
          className="pointer-events-none absolute top-[calc(50%-0.5rem)] right-0 left-0 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent"
        />

        <div
          ref={trackRef}
          className="flex min-h-[340px] items-center gap-8 overflow-x-auto scroll-smooth px-[calc(50%-8rem)] py-8 md:min-h-[420px] md:gap-10 md:px-[calc(50%-10rem)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {games.map((game, index) => {
            const selected = index === active;
            return (
              <button
                key={game.slug}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                type="button"
                onClick={() => setActive(index)}
                aria-pressed={selected}
                className={cn(
                  // Column width >= circle diameter so neighbors stay clickable
                  "relative flex shrink-0 flex-col items-center gap-3 border-0 bg-transparent p-0 transition-all duration-500 ease-out",
                  selected
                    ? "z-10 w-60 md:w-72"
                    : "z-20 w-36 opacity-55 hover:opacity-100 md:w-40",
                )}
              >
                <span
                  className={cn(
                    "font-mono-label text-[8px] tracking-widest uppercase md:text-[9px]",
                    selected ? "text-white" : "text-white/40",
                  )}
                >
                  {game.era}
                </span>

                <span
                  className={cn(
                    "relative block overflow-hidden rounded-full border-4 transition-all duration-500",
                    selected
                      ? "h-56 w-56 md:h-64 md:w-64"
                      : "h-28 w-28 md:h-32 md:w-32",
                  )}
                  style={{
                    borderColor: selected
                      ? game.accent
                      : "rgba(255,255,255,0.2)",
                    boxShadow: selected
                      ? `0 0 48px ${game.accent}66`
                      : "none",
                  }}
                >
                  <Image
                    src={game.artwork}
                    alt={game.name}
                    fill
                    sizes={selected ? "256px" : "128px"}
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
                      ? "text-xl text-white md:text-2xl"
                      : "text-sm text-white/50",
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
          onClick={() => setActive((i) => Math.min(games.length - 1, i + 1))}
          disabled={active === games.length - 1}
          className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition enabled:hover:border-[var(--lime)] disabled:opacity-30"
        >
          Later →
        </button>
      </div>

      {/* Expanded dossier — updates in place */}
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
