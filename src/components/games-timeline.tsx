"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { games } from "@/lib/content";
import { cn } from "@/lib/utils";

export function GamesTimeline() {
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const track = trackRef.current;
    const item = itemRefs.current[active];
    if (!track || !item) return;

    const scroll = () => {
      const target =
        item.offsetLeft - track.clientWidth / 2 + item.offsetWidth / 2;
      track.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
    };

    scroll();
    const t = window.setTimeout(scroll, 300);
    return () => window.clearTimeout(t);
  }, [active]);

  const current = games[active];

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
          Click a circle to focus it—the timeline slides over and the others
          shrink.
        </p>
      </div>

      {/* Controls always work even if circles misbehave */}
      <div className="mx-auto mt-8 flex max-w-6xl items-center justify-center gap-3 px-4 md:px-6">
        {games.map((game, index) => (
          <button
            key={`tab-${game.slug}`}
            type="button"
            onClick={() => setActive(index)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-bold transition",
              active === index
                ? "bg-[var(--lime)] text-[var(--ink)]"
                : "border border-white/20 bg-white/5 text-white/70 hover:border-white/40 hover:text-white",
            )}
          >
            {game.name}
          </button>
        ))}
      </div>

      <div
        ref={trackRef}
        className="mt-8 flex min-h-[280px] items-center gap-10 overflow-x-auto scroll-smooth px-[calc(50%-5rem)] py-8 md:min-h-[340px] md:gap-14 md:px-[calc(50%-7rem)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {games.map((game, index) => {
          const selected = active === index;
          return (
            <div
              key={game.slug}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              role="button"
              tabIndex={0}
              onClick={() => setActive(index)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setActive(index);
                }
              }}
              className={cn(
                "flex shrink-0 cursor-pointer flex-col items-center gap-3 outline-none transition-all duration-500 select-none",
                selected ? "w-48 scale-100 md:w-60" : "w-28 scale-90 opacity-60 md:w-32",
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

              <div
                className={cn(
                  "relative overflow-hidden rounded-full border-4 transition-all duration-500",
                  selected
                    ? "h-44 w-44 md:h-56 md:w-56"
                    : "h-24 w-24 md:h-28 md:w-28",
                )}
                style={{
                  borderColor: selected ? game.accent : "rgba(255,255,255,0.2)",
                  boxShadow: selected ? `0 0 40px ${game.accent}66` : "none",
                }}
              >
                <Image
                  src={game.artwork}
                  alt={game.name}
                  fill
                  draggable={false}
                  className={cn(
                    "object-cover transition-all duration-500",
                    selected ? "grayscale-0" : "grayscale-[40%]",
                  )}
                  sizes={selected ? "224px" : "112px"}
                />
              </div>

              <span
                className={cn(
                  "font-display text-center font-bold",
                  selected
                    ? "text-xl text-white md:text-2xl"
                    : "text-sm text-white/50",
                )}
              >
                {game.name}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mx-auto mt-4 flex max-w-6xl items-center justify-between px-4 md:px-6">
        <button
          type="button"
          onClick={() => setActive((i) => Math.max(0, i - 1))}
          disabled={active === 0}
          className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white disabled:opacity-30"
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
          className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white disabled:opacity-30"
        >
          Later →
        </button>
      </div>

      <div
        className="mx-auto mt-10 grid max-w-6xl overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0a1220] md:mt-14 md:grid-cols-[1.2fr_0.8fr]"
        style={{ boxShadow: `0 0 0 1px ${current.accent}44` }}
      >
        <div className="relative min-h-[260px] md:min-h-[420px]">
          <Image
            src={current.artwork}
            alt={current.name}
            fill
            className="object-cover"
            sizes="(max-width:768px) 100vw, 60vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a1220]/70" />
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
