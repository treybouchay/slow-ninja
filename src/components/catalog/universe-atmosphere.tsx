"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { StructsScene } from "@/components/catalog/structs-scene";
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

/** Single light ink for every character — no keyword highlighting */
const SQL_INK = "color-mix(in oklab, var(--cyan) 28%, transparent)";

const SCHEMAVERSE_SECONDARY = [
  "SELECT attack($1);",
  "SELECT fleet_power();",
  "INSERT INTO ships DEFAULT VALUES;",
  "SELECT remaining_tic();",
  "UPDATE my_ships SET location = get_player_xy();",
  "SELECT * FROM planets WHERE conqueror IS NULL;",
];

type Props = {
  active: number;
  lit: boolean;
  /** Fractional catalog index. During a drag this sits between two worlds. */
  focus?: number;
  /** Track the finger instead of easing the crossfade. */
  immediate?: boolean;
};

function useTypewriter(lines: string[], active: boolean, msPerChar: number) {
  const [queryIndex, setQueryIndex] = useState(0);
  const [chars, setChars] = useState(0);
  const [phase, setPhase] = useState<"typing" | "hold" | "clear">("typing");
  const [wasActive, setWasActive] = useState(active);
  const query = lines[queryIndex];

  if (active !== wasActive) {
    setWasActive(active);
    if (!active) {
      setChars(0);
      setPhase("typing");
      setQueryIndex(0);
    }
  }

  useEffect(() => {
    if (!active) return;

    if (phase === "typing") {
      if (chars >= query.length) {
        const t = window.setTimeout(() => setPhase("hold"), 1200);
        return () => window.clearTimeout(t);
      }
      const t = window.setTimeout(
        () => setChars((c) => c + 1),
        msPerChar + (query[chars] === " " ? 30 : 0),
      );
      return () => window.clearTimeout(t);
    }

    if (phase === "hold") {
      const t = window.setTimeout(() => setPhase("clear"), 700);
      return () => window.clearTimeout(t);
    }

    const t = window.setTimeout(() => {
      setChars(0);
      setQueryIndex((i) => (i + 1) % lines.length);
      setPhase("typing");
    }, 220);
    return () => window.clearTimeout(t);
  }, [active, chars, phase, query, lines, msPerChar]);

  return { query, chars, queryIndex };
}

function SqlTerminal({
  lines,
  active,
  msPerChar,
  className,
  showHistory = 2,
}: {
  lines: string[];
  active: boolean;
  msPerChar: number;
  className?: string;
  showHistory?: number;
}) {
  const { query, chars, queryIndex } = useTypewriter(lines, active, msPerChar);
  const history = lines.slice(Math.max(0, queryIndex - showHistory), queryIndex);

  return (
    <div
      className={cn(
        "pointer-events-none absolute z-30 overflow-hidden font-mono-label",
        className,
      )}
      style={{ color: SQL_INK }}
      aria-hidden
    >
      <div className="flex h-full flex-col justify-end gap-1.5">
        {history.map((line) => (
          <p key={`${queryIndex}-${line}`} className="truncate text-[11px] leading-snug">
            ninja=# {line}
          </p>
        ))}
        <p className="min-h-[1.35em] text-[12px] leading-snug md:text-[13px]">
          ninja=# {query.slice(0, chars)}
          <span
            className="sql-caret ml-0.5 inline-block h-[1em] w-[0.55ch] translate-y-[2px] align-baseline"
            style={{ background: SQL_INK }}
          />
        </p>
      </div>
    </div>
  );
}

/**
 * Schemaverse SQL typing inside the stage:
 * 1) upper-left ~363×94 — slightly above the dossier, light ink
 * 2) lower-right ~434×121 — a few more typed lines
 */
export function SchemaverseSqlStage({ active }: { active: boolean }) {
  if (!active) return null;

  return (
    <>
      <SqlTerminal
        lines={SCHEMAVERSE_QUERIES}
        active={active}
        msPerChar={30}
        showHistory={1}
        className="top-2 left-1.5 h-[94px] w-[min(363px,calc(100%-1rem))] md:left-2"
      />
      <SqlTerminal
        lines={SCHEMAVERSE_SECONDARY}
        active={active}
        msPerChar={34}
        showHistory={3}
        className="right-4 bottom-2 h-[121px] w-[min(434px,calc(100%-1.5rem))] md:right-6"
      />
    </>
  );
}

function SchemaverseField() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="universe-sql-grid absolute inset-0 opacity-30" />
      <div className="sql-scanlines absolute inset-0 opacity-40" />
    </div>
  );
}

function CoindroidsField({ active }: { active: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="universe-ruins absolute inset-0 opacity-45" />
      <div
        className={cn(
          "absolute top-[54%] -right-8 md:top-[610px] md:-right-[42px]",
          !active && "opacity-0",
        )}
      >
        <Image
          src="/games/coindroid.png"
          alt=""
          width={750}
          height={750}
          unoptimized
          className="h-[min(50.4vh,476px)] w-[min(50.4vh,476px)] object-contain opacity-80"
        />
      </div>
    </div>
  );
}

function GameOverlay({ game, active }: { game: Game; active: boolean }) {
  if (game.slug === "schemaverse") {
    return <SchemaverseField />;
  }
  if (game.slug === "coindroids") {
    return <CoindroidsField active={active} />;
  }
  if (game.slug === "structs") {
    return <StructsScene active={active} />;
  }
  return null;
}

/** Color wash + per-game animated overlay for the catalog stage. */
export function UniverseAtmosphere({ active, lit, focus = active, immediate = false }: Props) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10" aria-hidden>
      {games.map((game, index) => {
        const weight = lit ? Math.max(0, 1 - Math.abs(index - focus)) : 0;
        return (
          <div
            key={`atmosphere-${game.slug}`}
            className={cn(
              "absolute inset-0",
              !immediate && "transition-opacity duration-700 ease-out",
            )}
            style={{ opacity: weight }}
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
            <GameOverlay game={game} active={lit && weight > 0.04} />
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
