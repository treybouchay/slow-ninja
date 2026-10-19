"use client";

import { useEffect, useRef, useState } from "react";
import { games } from "@/lib/content";
import { cn } from "@/lib/utils";

/** Display labels matching the Figma frames (node 1:3 / 1:21). */
const labels: Record<string, string> = {
  schemaverse: "schemaverse",
  coindroids: "Coindroids",
  structs: "Structs",
};

/**
 * Figma timeline: hollow circles on a starlane.
 * Click a neighbor → it grows to ~304px and the track slides to center it.
 * Selection is local state only (no URL) so the page never jumps.
 */
export function GamesTimeline() {
  // Default matches Figma frame 1:3 (Coindroids focused)
  const [active, setActive] = useState(1);
  const trackRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const track = trackRef.current;
    const item = itemRefs.current[active];
    if (!track || !item) return;

    const centerTrack = () => {
      const left =
        item.offsetLeft - track.clientWidth / 2 + item.offsetWidth / 2;
      track.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
    };

    // Center after layout + mid-transition (sizes animate ~500ms)
    const frame = window.requestAnimationFrame(centerTrack);
    const mid = window.setTimeout(centerTrack, 280);
    const end = window.setTimeout(centerTrack, 520);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(mid);
      window.clearTimeout(end);
    };
  }, [active]);

  const select = (index: number) => {
    if (index === active) return;
    setActive(index);
  };

  return (
    <section
      id="games"
      className="scroll-mt-28 bg-[#070c16] py-16 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <p className="font-mono-label text-[8px] tracking-widest text-[var(--cyan)] uppercase md:text-[9px]">
          Project timeline
        </p>
        <h2 className="font-display mt-3 text-3xl font-bold tracking-tight text-white md:text-5xl">
          Browse the catalog
        </h2>
        <p className="mt-3 max-w-xl text-white/60">
          Tap a circle to bring it into focus—the lane slides, nothing else
          moves.
        </p>
      </div>

      <div className="relative mt-12 md:mt-16">
        {/* Starlane through circle centers */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/2 right-0 left-0 h-px -translate-y-1/2 bg-white/50"
        />

        <div
          ref={trackRef}
          className="flex items-center overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{
            // Pad so the first/last slot can sit at viewport center
            paddingInline: "max(1rem, calc(50% - 10rem))",
          }}
        >
          {games.map((game, index) => {
            const selected = index === active;
            const label = labels[game.slug] ?? game.name;

            return (
              <button
                key={game.slug}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                type="button"
                // preventDefault on mousedown stops browser focus-scroll
                // (the usual cause of jumping back to the top of the page)
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => select(index)}
                aria-pressed={selected}
                aria-label={`${label}, ${game.era}`}
                className={cn(
                  // Fixed slot width ≈ Figma center-to-center spacing (~494px)
                  // so neighbors stay evenly placed while the active circle grows
                  "relative flex shrink-0 flex-col items-center justify-center border-0 bg-transparent p-0 outline-none",
                  "w-[min(72vw,28rem)] py-8 md:w-[30.875rem] md:py-10",
                )}
              >
                <span
                  className={cn(
                    "font-body text-xl font-normal text-white transition-all duration-500 md:text-2xl",
                    selected ? "mb-4 opacity-100" : "mb-3 opacity-90",
                  )}
                >
                  {game.era}
                </span>

                <span
                  className={cn(
                    "block rounded-full border border-white bg-[#070c16] transition-all duration-500 ease-out",
                    selected
                      ? "size-[min(56vw,16rem)] md:size-[304px]"
                      : "size-14 md:size-[68px]",
                  )}
                />

                <span
                  className={cn(
                    "font-body text-xl font-normal text-white transition-all duration-500 md:text-2xl",
                    selected ? "mt-5 opacity-100" : "mt-3 opacity-90",
                  )}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active game dossier — in-place, no navigation */}
      <div className="mx-auto mt-8 max-w-xl px-4 text-center md:mt-10 md:px-6">
        <p className="text-sm leading-relaxed text-white/55 md:text-base">
          {games[active].summary}
        </p>
        <a
          href={games[active].href}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex text-sm font-semibold text-white underline-offset-4 hover:underline"
        >
          Explore {labels[games[active].slug] ?? games[active].name} →
        </a>
      </div>
    </section>
  );
}
