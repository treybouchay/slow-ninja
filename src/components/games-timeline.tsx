"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { games, type Game } from "@/lib/content";
import { cn } from "@/lib/utils";

export function GamesTimeline() {
  const [active, setActive] = useState(games.length - 1);
  const trackRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = games[active];

  useEffect(() => {
    const track = trackRef.current;
    const node = nodeRefs.current[active];
    if (!track || !node) return;

    const centerActive = () => {
      const trackRect = track.getBoundingClientRect();
      const nodeRect = node.getBoundingClientRect();
      const offset =
        nodeRect.left -
        trackRect.left -
        trackRect.width / 2 +
        nodeRect.width / 2 +
        track.scrollLeft;
      track.scrollTo({ left: offset, behavior: "smooth" });
    };

    // Center once sizes start changing, then again mid-transition
    const frame = requestAnimationFrame(centerActive);
    const mid = window.setTimeout(centerActive, 220);
    const end = window.setTimeout(centerActive, 520);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(mid);
      window.clearTimeout(end);
    };
  }, [active]);

  return (
    <section
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
          Click a preview—it centers and expands while the others minimize.
        </p>
      </div>

      <div className="relative mt-10 md:mt-14">
        <div className="pointer-events-none absolute top-1/2 right-0 left-0 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <div
          ref={trackRef}
          className="flex min-h-[300px] items-center gap-6 overflow-x-auto px-[max(1.5rem,calc(50%-6rem))] py-10 md:min-h-[380px] md:gap-10 md:px-[max(2rem,calc(50%-8rem))] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {games.map((game, index) => (
            <PreviewCircle
              key={game.slug}
              game={game}
              active={active === index}
              onSelect={() => setActive(index)}
              buttonRef={(el) => {
                nodeRefs.current[index] = el;
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative mx-auto flex max-w-6xl items-center justify-between px-4 md:px-6">
        <button
          type="button"
          onClick={() => setActive((i) => Math.max(0, i - 1))}
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
          onClick={() => setActive((i) => Math.min(games.length - 1, i + 1))}
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

function PreviewCircle({
  game,
  active,
  onSelect,
  buttonRef,
}: {
  game: Game;
  active: boolean;
  onSelect: () => void;
  buttonRef: (el: HTMLButtonElement | null) => void;
}) {
  return (
    <div
      className={cn(
        "relative flex shrink-0 flex-col items-center gap-3 transition-all duration-500 ease-out",
        active ? "z-10 w-44 md:w-56" : "z-0 w-24 opacity-55 md:w-28",
      )}
    >
      <p
        className={cn(
          "font-mono-label text-[8px] tracking-widest uppercase transition-all duration-500 md:text-[9px]",
          active ? "text-white opacity-100" : "text-white/40",
        )}
      >
        {game.era}
      </p>

      <button
        ref={buttonRef}
        type="button"
        onClick={onSelect}
        aria-pressed={active}
        aria-label={`Focus ${game.name}`}
        className={cn(
          "group relative rounded-full transition-transform duration-500 ease-out",
          active ? "scale-100" : "scale-90 hover:scale-95 hover:opacity-90",
        )}
      >
        <span
          className={cn(
            "pointer-events-none absolute rounded-full border-2 transition-all duration-500",
            active
              ? "-inset-3 opacity-100 md:-inset-4"
              : "-inset-1 border-white/15 opacity-40",
          )}
          style={
            active
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
            active
              ? "h-40 w-40 border-white/30 md:h-52 md:w-52"
              : "h-20 w-20 border-white/10 md:h-24 md:w-24",
          )}
          style={
            active
              ? {
                  borderColor: game.accent,
                  boxShadow: `0 0 48px ${game.accent}55`,
                }
              : undefined
          }
        >
          <Image
            src={game.artwork}
            alt={`${game.name} preview`}
            fill
            className={cn(
              "object-cover transition-all duration-500",
              active
                ? "scale-100 grayscale-0"
                : "scale-110 grayscale-[50%] group-hover:grayscale-[20%]",
            )}
            sizes={active ? "208px" : "96px"}
          />
          <span
            className={cn(
              "pointer-events-none absolute inset-0 transition-opacity duration-500",
              active
                ? "bg-gradient-to-t from-black/40 via-transparent to-black/10 opacity-100"
                : "bg-black/35 opacity-100",
            )}
          />
        </span>
      </button>

      <div className="text-center">
        <p
          className={cn(
            "font-display font-bold transition-all duration-500",
            active
              ? "text-lg text-white md:text-2xl"
              : "text-sm text-white/45 md:text-base",
          )}
        >
          {game.name}
        </p>
        <p
          className={cn(
            "mt-1 overflow-hidden text-xs transition-all duration-500",
            active
              ? "max-h-10 text-white/60 opacity-100"
              : "max-h-0 opacity-0",
          )}
        >
          {game.tagline}
        </p>
      </div>
    </div>
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
