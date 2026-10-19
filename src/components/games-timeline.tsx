"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { games, type Game } from "@/lib/content";
import { cn } from "@/lib/utils";

export function GamesTimeline() {
  const [active, setActive] = useState(games.length - 1);
  const [expanded, setExpanded] = useState(true);
  const nodeRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = games[active];

  useEffect(() => {
    nodeRefs.current[active]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [active]);

  function selectGame(index: number) {
    if (index === active && expanded) {
      setExpanded(false);
      return;
    }
    setActive(index);
    setExpanded(true);
  }

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
          Scroll the starlane sideways. Click a preview circle to expand
          artwork, details, and Explore more.
        </p>
      </div>

      {/* Horizontal timeline of circular screenshot previews */}
      <div className="relative mt-12 md:mt-16">
        <div className="pointer-events-none absolute top-1/2 right-0 left-0 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="pointer-events-none absolute top-1/2 right-0 left-0 h-[2px] -translate-y-1/2 bg-gradient-to-r from-transparent via-[var(--cyan)]/25 to-transparent blur-sm" />

        <div className="flex min-h-[260px] snap-x snap-mandatory items-center gap-12 overflow-x-auto px-8 py-8 md:min-h-[340px] md:gap-20 md:px-16 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="w-[8vw] shrink-0 md:w-[14vw]" aria-hidden />

          {games.map((game, index) => (
            <PreviewCircle
              key={game.slug}
              game={game}
              active={active === index}
              expanded={active === index && expanded}
              onSelect={() => selectGame(index)}
              buttonRef={(el) => {
                nodeRefs.current[index] = el;
              }}
            />
          ))}

          <div className="w-[8vw] shrink-0 md:w-[14vw]" aria-hidden />
        </div>
      </div>

      <div className="relative mx-auto mt-2 flex max-w-6xl items-center justify-between px-4 md:px-6">
        <button
          type="button"
          onClick={() => {
            setActive((i) => Math.max(0, i - 1));
            setExpanded(true);
          }}
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
          onClick={() => {
            setActive((i) => Math.min(games.length - 1, i + 1));
            setExpanded(true);
          }}
          disabled={active === games.length - 1}
          className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 transition enabled:hover:border-[var(--lime)] enabled:hover:text-[var(--lime)] disabled:opacity-30"
        >
          Later →
        </button>
      </div>

      <div
        className={cn(
          "relative mx-auto max-w-6xl overflow-hidden px-4 transition-all duration-500 ease-out md:px-6",
          expanded
            ? "mt-10 max-h-[920px] opacity-100 md:mt-14"
            : "mt-0 max-h-0 opacity-0",
        )}
      >
        <ExpandedProject
          key={current.slug}
          game={current}
          onClose={() => setExpanded(false)}
        />
      </div>
    </section>
  );
}

function PreviewCircle({
  game,
  active,
  expanded,
  onSelect,
  buttonRef,
}: {
  game: Game;
  active: boolean;
  expanded: boolean;
  onSelect: () => void;
  buttonRef: (el: HTMLButtonElement | null) => void;
}) {
  return (
    <div className="relative flex shrink-0 snap-center flex-col items-center gap-4">
      <p
        className={cn(
          "font-mono-label text-[8px] tracking-widest uppercase transition-colors md:text-[9px]",
          active ? "text-white" : "text-white/40",
        )}
      >
        {game.era}
      </p>

      <button
        ref={buttonRef}
        type="button"
        onClick={onSelect}
        aria-pressed={active && expanded}
        aria-label={`Open ${game.name}`}
        className={cn(
          "group relative rounded-full transition-transform duration-500 ease-out",
          active && expanded ? "scale-110" : "scale-100 hover:scale-105",
        )}
      >
        {/* Accent ring */}
        <span
          className={cn(
            "pointer-events-none absolute -inset-2 rounded-full border-2 transition-all duration-500 md:-inset-3",
            active ? "opacity-100" : "border-white/20 opacity-50 group-hover:opacity-80",
          )}
          style={
            active
              ? {
                  borderColor: game.accent,
                  boxShadow: `0 0 28px ${game.accent}66`,
                }
              : undefined
          }
        />

        {/* Circular screenshot preview */}
        <span
          className={cn(
            "relative block overflow-hidden rounded-full border-2 border-white/15 bg-[#0a1220] transition-all duration-500",
            active && expanded
              ? "h-36 w-36 md:h-48 md:w-48"
              : "h-28 w-28 md:h-36 md:w-36",
          )}
          style={
            active
              ? { borderColor: game.accent, boxShadow: `0 0 40px ${game.accent}44` }
              : undefined
          }
        >
          <Image
            src={game.artwork}
            alt={`${game.name} preview`}
            fill
            className={cn(
              "object-cover transition-all duration-500",
              active ? "scale-100 grayscale-0" : "scale-110 grayscale-[35%] group-hover:grayscale-0",
            )}
            sizes="192px"
          />
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />
        </span>
      </button>

      <div className="max-w-[9rem] text-center md:max-w-[11rem]">
        <p
          className={cn(
            "font-display text-lg font-bold transition-colors md:text-xl",
            active ? "text-white" : "text-white/55",
          )}
        >
          {game.name}
        </p>
        <p
          className={cn(
            "mt-1 text-xs transition-colors",
            active && expanded ? "text-white/65" : "text-white/35",
          )}
        >
          {active && expanded ? "Selected" : "Click for more"}
        </p>
      </div>
    </div>
  );
}

function ExpandedProject({
  game,
  onClose,
}: {
  game: Game;
  onClose: () => void;
}) {
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
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full border border-white/15 px-3 py-1 text-xs font-semibold text-white/50 hover:text-white"
        >
          Close
        </button>
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
