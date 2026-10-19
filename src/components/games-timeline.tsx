"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type Ref,
} from "react";
import { games, type Game } from "@/lib/content";
import { cn } from "@/lib/utils";

export function GamesTimeline() {
  const [active, setActive] = useState(games.length - 1);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const node = cardRefs.current[active];
    node?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [active]);

  const current = games[active];

  return (
    <section id="games" className="scroll-mt-28 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <p className="font-mono-label text-[8px] tracking-widest text-[var(--cyan)] uppercase md:text-[9px]">
          Project timeline
        </p>
        <h2 className="font-display mt-3 text-3xl font-bold tracking-tight text-white md:text-5xl">
          Browse the catalog
        </h2>
        <p className="mt-3 max-w-xl text-white/60">
          Scroll the timeline sideways—each project expands with art from the
          field and a path to explore more.
        </p>
      </div>

      <div className="relative mt-10">
        <div className="pointer-events-none absolute top-[4.25rem] right-0 left-0 hidden h-px bg-gradient-to-r from-transparent via-[var(--cyan)]/50 to-transparent md:block" />

        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 md:gap-6 md:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="w-[8vw] shrink-0 md:w-[12vw]" aria-hidden />
          {games.map((game, index) => (
            <TimelineCard
              key={game.slug}
              game={game}
              active={active === index}
              onSelect={() => setActive(index)}
              buttonRef={(el) => {
                cardRefs.current[index] = el;
              }}
            />
          ))}
          <div className="w-[8vw] shrink-0 md:w-[12vw]" aria-hidden />
        </div>

        <div className="mx-auto mt-4 flex max-w-6xl items-center justify-between px-4 md:px-6">
          <button
            type="button"
            onClick={() => setActive((i) => Math.max(0, i - 1))}
            disabled={active === 0}
            className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white/80 transition enabled:hover:border-[var(--cyan)] enabled:hover:text-[var(--cyan)] disabled:opacity-30"
          >
            ← Earlier
          </button>
          <p className="font-mono-label text-[8px] tracking-widest text-white/40 uppercase">
            {active + 1} / {games.length}
          </p>
          <button
            type="button"
            onClick={() => setActive((i) => Math.min(games.length - 1, i + 1))}
            disabled={active === games.length - 1}
            className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white/80 transition enabled:hover:border-[var(--lime)] enabled:hover:text-[var(--lime)] disabled:opacity-30"
          >
            Later →
          </button>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-6xl px-4 md:mt-12 md:px-6">
        <ExpandedProject key={current.slug} game={current} />
      </div>
    </section>
  );
}

function TimelineCard({
  game,
  active,
  onSelect,
  buttonRef,
}: {
  game: Game;
  active: boolean;
  onSelect: () => void;
  buttonRef: Ref<HTMLButtonElement>;
}) {
  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onSelect}
      className={cn(
        "group relative shrink-0 snap-center overflow-hidden rounded-2xl border-2 text-left transition-all duration-500 ease-out",
        active
          ? "w-[min(85vw,28rem)] scale-100 md:w-[32rem]"
          : "w-[11rem] border-white/15 opacity-70 hover:border-white/40 hover:opacity-100 md:w-[14rem]",
      )}
      style={
        active
          ? {
              borderColor: game.accent,
              boxShadow: `8px 8px 0 ${game.accent}`,
            }
          : undefined
      }
      aria-pressed={active}
    >
      <div
        className={cn(
          "relative overflow-hidden bg-[var(--hull)] transition-all duration-500",
          active ? "aspect-[16/10]" : "aspect-[4/5]",
        )}
      >
        <Image
          src={game.artwork}
          alt={`${game.name} artwork`}
          fill
          className={cn(
            "object-cover transition-transform duration-700",
            active ? "scale-100" : "scale-110 grayscale-[30%]",
          )}
          sizes={active ? "512px" : "224px"}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span
            className={cn(
              "h-3 w-3 rounded-full border-2 border-[var(--night)] transition-transform",
              active ? "scale-125" : "scale-100",
            )}
            style={{ background: game.accent }}
          />
          <span className="font-mono-label rounded-full bg-black/50 px-2 py-1 text-[7px] tracking-widest text-white uppercase backdrop-blur">
            {game.era}
          </span>
        </div>

        <div className="absolute right-3 bottom-3 left-3">
          <p className="font-display text-xl font-bold text-white md:text-2xl">
            {game.name}
          </p>
          {active ? (
            <p className="mt-1 line-clamp-2 text-sm text-white/70">
              {game.tagline}
            </p>
          ) : (
            <p className="mt-1 text-xs text-white/50">{game.years}</p>
          )}
        </div>
      </div>
    </button>
  );
}

function ExpandedProject({ game }: { game: Game }) {
  return (
    <div
      className="grid overflow-hidden rounded-[1.75rem] border-2 bg-[var(--hull)] md:grid-cols-[1.15fr_0.85fr]"
      style={{
        borderColor: game.accent,
        boxShadow: `10px 10px 0 ${game.accent}`,
      }}
    >
      <div className="relative min-h-[240px] md:min-h-[360px]">
        <Image
          src={game.artwork}
          alt={`${game.name} artwork`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 60vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/30" />
        <div className="absolute bottom-4 left-4 rounded-full bg-black/55 px-3 py-1.5 font-mono-label text-[8px] tracking-widest text-white uppercase backdrop-blur">
          {game.years}
        </div>
      </div>

      <div className="flex flex-col justify-center p-6 md:p-10">
        <p
          className="font-mono-label text-[8px] tracking-widest uppercase md:text-[9px]"
          style={{ color: game.accent }}
        >
          {game.mechanic}
        </p>
        <h3 className="font-display mt-3 text-3xl font-bold text-white md:text-4xl">
          {game.name}
        </h3>
        <p className="mt-2 text-lg font-semibold text-white/75">{game.tagline}</p>
        <p className="mt-4 text-sm leading-relaxed text-white/60 md:text-base">
          {game.summary}
        </p>
        <p className="mt-4 text-xs font-semibold tracking-wide text-white/45 uppercase">
          {game.status}
        </p>
        <a
          href={game.href}
          target="_blank"
          rel="noreferrer"
          className="btn-bounce mt-8 inline-flex w-fit rounded-full px-6 py-3.5 text-sm font-bold text-[var(--ink)]"
          style={{
            background: game.accent,
            boxShadow: "4px 4px 0 rgba(255,255,255,0.25)",
          }}
        >
          Explore more →
        </a>
      </div>
    </div>
  );
}
