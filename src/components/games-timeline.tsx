"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { games, type Game } from "@/lib/content";
import { cn } from "@/lib/utils";

const planetLooks: Record<
  string,
  { size: string; surface: string; ring?: string; glow: string }
> = {
  schemaverse: {
    size: "h-28 w-28 md:h-40 md:w-40",
    surface:
      "radial-gradient(circle at 30% 28%, #9ff7ff 0%, #4de2e8 28%, #1a6f8a 62%, #0a3040 100%)",
    ring: "border-[var(--cyan)]/50",
    glow: "0 0 48px rgba(77,226,232,0.55)",
  },
  coindroids: {
    size: "h-32 w-32 md:h-44 md:w-44",
    surface:
      "radial-gradient(circle at 32% 30%, #ffb4a8 0%, #ff5e4d 35%, #9a2a22 68%, #3a1010 100%)",
    glow: "0 0 48px rgba(255,94,77,0.5)",
  },
  structs: {
    size: "h-36 w-36 md:h-52 md:w-52",
    surface:
      "radial-gradient(circle at 28% 26%, #e8ff9a 0%, #c8f542 32%, #5a8a20 64%, #1a2a0a 100%)",
    ring: "border-[var(--lime)]/45",
    glow: "0 0 56px rgba(200,245,66,0.55)",
  },
};

export function GamesTimeline() {
  const [active, setActive] = useState(games.length - 1);
  const [expanded, setExpanded] = useState(true);
  const planetRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = games[active];

  useEffect(() => {
    planetRefs.current[active]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [active]);

  function selectPlanet(index: number) {
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
      <div className="pointer-events-none absolute inset-0 starfield opacity-60" />
      <div className="pointer-events-none absolute inset-0 space-grid opacity-20" />

      <div className="relative mx-auto max-w-6xl px-4 md:px-6">
        <p className="font-mono-label text-[8px] tracking-widest text-[var(--cyan)] uppercase md:text-[9px]">
          Sector survey
        </p>
        <h2 className="font-display mt-3 text-3xl font-bold tracking-tight text-white md:text-5xl">
          Explore the planets
        </h2>
        <p className="mt-3 max-w-xl text-white/60">
          Navigate the horizontal starlane. Tap a planet to expand its
          dossier—artwork, systems, and a path to explore more.
        </p>
      </div>

      {/* Horizontal planetary corridor — more real estate */}
      <div className="relative mt-12 md:mt-16">
        <div className="pointer-events-none absolute top-1/2 right-0 left-0 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
        <div className="pointer-events-none absolute top-1/2 right-0 left-0 h-[2px] -translate-y-1/2 bg-gradient-to-r from-transparent via-[var(--cyan)]/30 to-transparent blur-sm" />

        <div className="flex min-h-[280px] snap-x snap-mandatory items-center gap-10 overflow-x-auto px-8 py-10 md:min-h-[360px] md:gap-24 md:px-16 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="w-[10vw] shrink-0 md:w-[18vw]" aria-hidden />

          {games.map((game, index) => (
            <PlanetNode
              key={game.slug}
              game={game}
              active={active === index}
              expanded={active === index && expanded}
              onSelect={() => selectPlanet(index)}
              buttonRef={(el) => {
                planetRefs.current[index] = el;
              }}
            />
          ))}

          <div className="w-[10vw] shrink-0 md:w-[18vw]" aria-hidden />
        </div>
      </div>

      <div className="relative mx-auto mt-2 flex max-w-6xl items-center justify-between px-4 md:px-6">
        <button
          type="button"
          onClick={() => {
            const next = Math.max(0, active - 1);
            setActive(next);
            setExpanded(true);
          }}
          disabled={active === 0}
          className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 transition enabled:hover:border-[var(--cyan)] enabled:hover:text-[var(--cyan)] disabled:opacity-30"
        >
          ← Warp earlier
        </button>
        <p className="font-mono-label text-[8px] tracking-widest text-white/35 uppercase">
          Orbit {active + 1} / {games.length}
        </p>
        <button
          type="button"
          onClick={() => {
            const next = Math.min(games.length - 1, active + 1);
            setActive(next);
            setExpanded(true);
          }}
          disabled={active === games.length - 1}
          className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 transition enabled:hover:border-[var(--lime)] enabled:hover:text-[var(--lime)] disabled:opacity-30"
        >
          Warp later →
        </button>
      </div>

      {/* Expanded planet dossier */}
      <div
        className={cn(
          "relative mx-auto max-w-6xl overflow-hidden px-4 transition-all duration-500 ease-out md:px-6",
          expanded
            ? "mt-10 max-h-[900px] opacity-100 md:mt-14"
            : "mt-0 max-h-0 opacity-0",
        )}
      >
        <PlanetDossier
          key={current.slug}
          game={current}
          onClose={() => setExpanded(false)}
        />
      </div>
    </section>
  );
}

function PlanetNode({
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
  const look = planetLooks[game.slug] ?? planetLooks.structs;

  return (
    <div className="relative flex shrink-0 snap-center flex-col items-center gap-5">
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
        aria-label={`Explore ${game.name}`}
        className={cn(
          "group relative flex items-center justify-center rounded-full transition-transform duration-500 ease-out",
          active && expanded ? "scale-110" : "scale-100 hover:scale-105",
        )}
      >
        {/* Orbital ring */}
        {look.ring ? (
          <span
            className={cn(
              "pointer-events-none absolute rounded-full border transition-opacity duration-500",
              look.ring,
              active ? "opacity-100" : "opacity-40",
              game.slug === "structs"
                ? "h-[130%] w-[165%] -rotate-12"
                : "h-[125%] w-[125%]",
            )}
          />
        ) : null}

        {/* Soft halo */}
        <span
          className={cn(
            "pointer-events-none absolute inset-[-18%] rounded-full blur-xl transition-opacity duration-500",
            active ? "opacity-90" : "opacity-40 group-hover:opacity-70",
          )}
          style={{ background: game.accent, opacity: active ? 0.35 : 0.15 }}
        />

        {/* Planet body */}
        <span
          className={cn(
            "relative block rounded-full border border-white/20 shadow-inner transition-all duration-500",
            look.size,
            active && expanded ? "border-white/40" : "",
          )}
          style={{
            background: look.surface,
            boxShadow: active
              ? look.glow
              : "inset -12px -16px 28px rgba(0,0,0,0.45), 0 0 20px rgba(0,0,0,0.35)",
          }}
        >
          {/* Surface highlight */}
          <span className="pointer-events-none absolute top-[14%] left-[18%] h-[28%] w-[34%] rounded-full bg-white/25 blur-[2px]" />
          {/* Crater detail */}
          <span className="pointer-events-none absolute top-[42%] right-[22%] h-[12%] w-[16%] rounded-full bg-black/25" />
          <span className="pointer-events-none absolute bottom-[28%] left-[30%] h-[8%] w-[10%] rounded-full bg-black/20" />
        </span>
      </button>

      <div className="text-center">
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
            active ? "text-white/65" : "text-white/35",
          )}
        >
          {active && expanded ? "Selected sector" : "Click planet"}
        </p>
      </div>
    </div>
  );
}

function PlanetDossier({
  game,
  onClose,
}: {
  game: Game;
  onClose: () => void;
}) {
  return (
    <div
      className="pop-in grid overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0a1220]/95 backdrop-blur-sm md:grid-cols-[1.2fr_0.8fr]"
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
        <div className="absolute inset-0 bg-gradient-to-t from-[#070d16] via-transparent to-[#070d16]/30 md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-[#0a1220]/80" />
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span
            className="h-3 w-3 rounded-full"
            style={{ background: game.accent, boxShadow: `0 0 12px ${game.accent}` }}
          />
          <span className="font-mono-label rounded-full border border-white/10 bg-[#070d16]/75 px-3 py-1.5 text-[8px] tracking-widest text-white uppercase">
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
