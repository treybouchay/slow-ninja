"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { games, type Game } from "@/lib/content";
import { cn } from "@/lib/utils";

export function GamesTimeline() {
  const [active, setActive] = useState(games.length - 1);
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = games[active];

  const focusIndex = useCallback((index: number) => {
    setActive(index);

    // Bring the whole timeline into the viewport
    sectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, []);

  // After active changes (and sizes update), slide the track so the
  // selected circle sits in the horizontal center.
  useEffect(() => {
    const track = trackRef.current;
    const item = itemRefs.current[active];
    if (!track || !item) return;

    const scrollToCenter = () => {
      const left =
        item.offsetLeft + item.offsetWidth / 2 - track.clientWidth / 2;
      track.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
    };

    const frames: number[] = [];
    frames.push(requestAnimationFrame(() => scrollToCenter()));
    const t1 = window.setTimeout(scrollToCenter, 80);
    const t2 = window.setTimeout(scrollToCenter, 280);
    const t3 = window.setTimeout(scrollToCenter, 560);

    return () => {
      frames.forEach((id) => cancelAnimationFrame(id));
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [active]);

  return (
    <section
      ref={sectionRef}
      id="games"
      className="relative scroll-mt-28 overflow-hidden bg-[#070d16] py-16 md:py-28"
    >
      <div className="pointer-events-none absolute inset-0 starfield opacity-50" />
      <div className="pointer-events-none absolute inset-0 space-grid opacity-15" />

      <div className="relative mx-auto max-w-6xl px-4 md:px-6">
        <p className="font-mono-label text-[8px] tracking-widest text-[var(--cyan)] uppercase md:text-[9px]">
          Project timeline
        </p>
        <h2 className="font-display mt-3 text-3xl font-bold tracking-tight text-white md:text-5xl">
          Browse the catalog
        </h2>
        <p className="mt-3 max-w-xl text-white/60">
          Click any circle—the timeline slides to focus it while the others
          shrink.
        </p>
      </div>

      <div className="relative mt-10 md:mt-14">
        <div className="pointer-events-none absolute top-1/2 right-0 left-0 z-0 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <div
          ref={trackRef}
          className="relative z-10 flex min-h-[320px] items-center gap-8 overflow-x-auto scroll-smooth px-[calc(50%-3.5rem)] py-12 md:min-h-[400px] md:gap-12 md:px-[calc(50%-6.5rem)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {games.map((game, index) => {
            const isActive = active === index;
            return (
              <button
                key={game.slug}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                type="button"
                onClick={() => focusIndex(index)}
                aria-pressed={isActive}
                aria-label={`Focus ${game.name}`}
                className={cn(
                  "relative flex shrink-0 cursor-pointer flex-col items-center gap-3 border-0 bg-transparent p-2 transition-all duration-500 ease-out",
                  // Inactive stays above active glow so they remain clickable
                  isActive ? "z-10 w-44 md:w-56" : "z-20 w-28 opacity-70 md:w-32",
                )}
              >
                <span
                  className={cn(
                    "font-mono-label text-[8px] tracking-widest uppercase transition-colors duration-500 md:text-[9px]",
                    isActive ? "text-white" : "text-white/45",
                  )}
                >
                  {game.era}
                </span>

                <span className="relative block">
                  {/* Glow ring — never captures clicks */}
                  <span
                    aria-hidden
                    className={cn(
                      "pointer-events-none absolute rounded-full border-2 transition-all duration-500",
                      isActive
                        ? "-inset-2 opacity-100 md:-inset-3"
                        : "inset-0 border-transparent opacity-0",
                    )}
                    style={
                      isActive
                        ? {
                            borderColor: game.accent,
                            boxShadow: `0 0 36px ${game.accent}77`,
                          }
                        : undefined
                    }
                  />

                  <span
                    className={cn(
                      "relative block overflow-hidden rounded-full border-2 bg-[#0a1220] transition-all duration-500 ease-out",
                      isActive
                        ? "h-40 w-40 md:h-52 md:w-52"
                        : "h-24 w-24 hover:border-white/35 md:h-28 md:w-28",
                    )}
                    style={{
                      borderColor: isActive ? game.accent : "rgba(255,255,255,0.18)",
                      boxShadow: isActive
                        ? `0 0 48px ${game.accent}55`
                        : "none",
                    }}
                  >
                    <Image
                      src={game.artwork}
                      alt=""
                      fill
                      className={cn(
                        "pointer-events-none object-cover transition-all duration-500",
                        isActive
                          ? "scale-100 grayscale-0"
                          : "scale-110 grayscale-[45%]",
                      )}
                      sizes={isActive ? "208px" : "112px"}
                    />
                    <span
                      aria-hidden
                      className={cn(
                        "pointer-events-none absolute inset-0",
                        isActive
                          ? "bg-gradient-to-t from-black/40 via-transparent to-black/10"
                          : "bg-black/40",
                      )}
                    />
                  </span>
                </span>

                <span className="text-center">
                  <span
                    className={cn(
                      "font-display block font-bold transition-all duration-500",
                      isActive
                        ? "text-lg text-white md:text-2xl"
                        : "text-sm text-white/55 md:text-base",
                    )}
                  >
                    {game.name}
                  </span>
                  <span
                    className={cn(
                      "mt-1 block overflow-hidden text-xs transition-all duration-500",
                      isActive
                        ? "max-h-12 text-white/60 opacity-100"
                        : "max-h-0 opacity-0",
                    )}
                  >
                    {game.tagline}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-4 md:px-6">
        <button
          type="button"
          onClick={() => focusIndex(Math.max(0, active - 1))}
          disabled={active === 0}
          className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 transition enabled:hover:border-[var(--cyan)] enabled:hover:text-[var(--cyan)] disabled:opacity-30"
        >
          ← Earlier
        </button>
        <p className="font-mono-label text-[8px] tracking-widest text-white/35 uppercase">
          {active + 1} / {games.length}
        </p>
        <button
          type="button"
          onClick={() => focusIndex(Math.min(games.length - 1, active + 1))}
          disabled={active === games.length - 1}
          className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 transition enabled:hover:border-[var(--lime)] enabled:hover:text-[var(--lime)] disabled:opacity-30"
        >
          Later →
        </button>
      </div>

      <div className="relative mx-auto mt-10 max-w-6xl px-4 md:mt-14 md:px-6">
        <ExpandedProject key={current.slug} game={current} />
      </div>
    </section>
  );
}

function ExpandedProject({ game }: { game: Game }) {
  return (
    <div
      className="pop-in grid overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0a1220] md:grid-cols-[1.2fr_0.8fr]"
      style={{
        boxShadow: `0 0 0 1px ${game.accent}44, 0 24px 80px rgba(0,0,0,0.55)`,
      }}
    >
      <div className="relative min-h-[280px] border-b border-white/10 md:min-h-[440px] md:border-r md:border-b-0">
        <Image
          src={game.artwork}
          alt={`${game.name} artwork`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 65vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070d16] via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#0a1220]/70" />
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span
            className="h-3 w-3 rounded-full"
            style={{
              background: game.accent,
              boxShadow: `0 0 12px ${game.accent}`,
            }}
          />
          <span className="font-mono-label rounded-full border border-white/10 bg-[#070d16]/80 px-3 py-1.5 text-[8px] tracking-widest text-white uppercase">
            {game.years}
          </span>
        </div>
      </div>

      <div className="relative flex flex-col justify-center bg-[#0a1220] p-6 md:p-10">
        <p
          className="font-mono-label text-[8px] tracking-widest uppercase md:text-[9px]"
          style={{ color: game.accent }}
        >
          {game.mechanic}
        </p>
        <h3 className="font-display mt-3 text-3xl font-bold text-white md:text-5xl">
          {game.name}
        </h3>
        <p className="mt-2 text-lg font-semibold text-white/75">{game.tagline}</p>
        <p className="mt-5 text-sm leading-relaxed text-white/60 md:text-base">
          {game.summary}
        </p>
        <p className="mt-4 text-xs font-semibold tracking-wide text-white/40 uppercase">
          {game.status}
        </p>
        <a
          href={game.href}
          target="_blank"
          rel="noreferrer"
          className="btn-bounce mt-8 inline-flex w-fit rounded-full px-6 py-3.5 text-sm font-bold text-[var(--ink)]"
          style={{
            background: game.accent,
            boxShadow: `0 0 24px ${game.accent}55`,
          }}
        >
          Explore more →
        </a>
      </div>
    </div>
  );
}
