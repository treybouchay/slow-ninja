"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { games, type Game } from "@/lib/content";
import { cn } from "@/lib/utils";

const SCHEMAVERSE_QUERIES = [
  "SELECT * FROM ships WHERE player_id = current_user;",
  "INSERT INTO ships (name, location) VALUES ('Ninja', get_player_xy());",
  "SELECT attack(target_id) FROM my_ships WHERE fuel > 0;",
  "UPDATE planets SET conqueror = current_user WHERE id = $1;",
  "SELECT fleet_power(), remaining_tic();",
  "CREATE OR REPLACE FUNCTION fly_home() RETURNS void AS $$ … $$;",
];

const COINDROID_TXS = [
  "0x7a3f…b2e1  combat.engage(droid_04)",
  "0x91c0…44aa  wager.lock(1200 COIN)",
  "0xd8e2…19fc  arena.submit_move(STRIKE)",
  "0x2bf1…c770  loot.claim(round_88)",
  "0x55a9…0de3  repair.spend(scrap)",
  "0xe014…a61b  forge.mint(chassis)",
];

type Props = {
  active: number;
  lit: boolean;
};

function SchemaverseTyping({ active }: { active: boolean }) {
  const [queryIndex, setQueryIndex] = useState(0);
  const [chars, setChars] = useState(0);
  const [phase, setPhase] = useState<"typing" | "hold" | "clear">("typing");

  const query = SCHEMAVERSE_QUERIES[queryIndex];

  useEffect(() => {
    if (!active) return;

    if (phase === "typing") {
      if (chars >= query.length) {
        const t = window.setTimeout(() => setPhase("hold"), 1400);
        return () => window.clearTimeout(t);
      }
      const t = window.setTimeout(
        () => setChars((c) => c + 1),
        28 + (query[chars] === " " ? 40 : 0),
      );
      return () => window.clearTimeout(t);
    }

    if (phase === "hold") {
      const t = window.setTimeout(() => setPhase("clear"), 900);
      return () => window.clearTimeout(t);
    }

    const t = window.setTimeout(() => {
      setChars(0);
      setQueryIndex((i) => (i + 1) % SCHEMAVERSE_QUERIES.length);
      setPhase("typing");
    }, 280);
    return () => window.clearTimeout(t);
  }, [active, chars, phase, query]);

  useEffect(() => {
    if (!active) {
      setChars(0);
      setPhase("typing");
    }
  }, [active]);

  const history = SCHEMAVERSE_QUERIES.slice(
    Math.max(0, queryIndex - 3),
    queryIndex,
  );

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="universe-sql-grid absolute inset-0 opacity-30" />
      <div className="sql-scanlines absolute inset-0 opacity-40" />
      <div
        className="absolute top-[22%] right-4 left-[42%] flex flex-col justify-start gap-2 font-mono-label md:right-10 md:left-[48%]"
        style={{
          maskImage:
            "linear-gradient(180deg, black 0%, black 70%, transparent 100%)",
        }}
      >
        {history.map((line) => (
          <p
            key={`${queryIndex}-${line}`}
            className="truncate text-[10px] tracking-wide text-[var(--cyan)]/40 md:text-xs"
          >
            {line}
          </p>
        ))}
        <p className="min-h-[1.4em] text-[12px] leading-relaxed tracking-wide text-[var(--cyan)]/90 md:text-sm">
          <span className="text-[var(--cyan)]/55">ninja=# </span>
          {query.slice(0, chars)}
          <span className="sql-caret ml-0.5 inline-block h-[1em] w-[0.55ch] translate-y-[2px] bg-[var(--cyan)] align-baseline" />
        </p>
      </div>
    </div>
  );
}

function CoindroidsTxRain({ active }: { active: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="universe-ruins absolute inset-0 opacity-45" />
      <div
        className={cn(
          "absolute inset-0",
          active ? "tx-rain" : "opacity-0",
        )}
      >
        {COINDROID_TXS.map((tx, i) => (
          <p
            key={tx}
            className="absolute whitespace-nowrap font-mono-label text-[10px] tracking-wider text-[var(--coral)]/45 md:text-xs"
            style={{
              left: `${8 + (i % 3) * 28}%`,
              animationDelay: `${i * 1.1}s`,
              animationDuration: `${9 + (i % 3)}s`,
            }}
          >
            {tx}
          </p>
        ))}
      </div>
      <div className="coin-pulse absolute inset-0 opacity-50" />
    </div>
  );
}

function StructsOrbitField({ active }: { active: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="universe-nebula absolute inset-0 opacity-55" />
      <div
        className={cn(
          "absolute inset-0",
          active ? "opacity-100" : "opacity-0",
        )}
      >
        <div className="structs-orbit absolute top-[28%] left-[62%] h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--violet)]/25 md:h-[320px] md:w-[320px]" />
        <div className="structs-orbit-rev absolute top-[28%] left-[62%] h-[140px] w-[140px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--cyan)]/20 md:h-[200px] md:w-[200px]" />
        <div className="structs-orbit absolute top-[28%] left-[62%] h-[60px] w-[60px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15 md:h-[88px] md:w-[88px]" />
        {Array.from({ length: 8 }).map((_, i) => (
          <span
            key={i}
            className="alpha-matter absolute h-1.5 w-1.5 rounded-full bg-[var(--violet)]"
            style={{
              left: `${12 + i * 11}%`,
              top: `${20 + ((i * 17) % 55)}%`,
              animationDelay: `${i * 0.45}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function GameOverlay({ game, active }: { game: Game; active: boolean }) {
  if (game.slug === "schemaverse") {
    return <SchemaverseTyping active={active} />;
  }
  if (game.slug === "coindroids") {
    return <CoindroidsTxRain active={active} />;
  }
  if (game.slug === "structs") {
    return <StructsOrbitField active={active} />;
  }
  return null;
}

/** Color wash + per-game animated overlay for the catalog stage. */
export function UniverseAtmosphere({ active, lit }: Props) {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      {games.map((game, index) => {
        const show = lit && index === active;
        return (
          <div
            key={`atmosphere-${game.slug}`}
            className={cn(
              "absolute inset-0 transition-opacity duration-700 ease-out",
              show ? "opacity-100" : "opacity-0",
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
            <GameOverlay game={game} active={show} />
          </div>
        );
      })}
      <div
        className={cn(
          "absolute inset-0 bg-[#070d16]/55 transition-opacity duration-700",
          lit ? "opacity-0" : "opacity-100",
        )}
      />
    </div>
  );
}
