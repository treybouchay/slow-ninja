"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { CatalogViewPicker } from "@/components/catalog/catalog-view-picker";
import { featuredGameIndex, games, type Game } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * Catalog experiment: three titles as physical game boxes on a shelf.
 * Click a box to pull it out like a cartridge; the others stay seated.
 * Starlane snapshot archived at catalog/games-timeline.starlane.tsx
 * (tag: timeline-starlane-v1).
 */

const CART_W = {
  idle: "w-[7.5rem] md:w-40",
  pulled: "w-[9.5rem] md:w-52",
};

function Cartridge({
  game,
  pulled,
  seated,
  onSelect,
}: {
  game: Game;
  pulled: boolean;
  seated: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onSelect}
      aria-pressed={pulled}
      aria-label={`${pulled ? "Reseat" : "Pull out"} ${game.name}`}
      className={cn(
        "group relative flex shrink-0 flex-col items-center border-0 bg-transparent p-0 outline-none transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        pulled
          ? "-translate-y-10 scale-105 md:-translate-y-14 md:scale-110"
          : seated
            ? "translate-y-3 opacity-70 hover:translate-y-1 hover:opacity-100"
            : "translate-y-0",
      )}
    >
      {/* Slot shadow on the shelf */}
      <span
        aria-hidden
        className={cn(
          "absolute -bottom-3 h-3 w-[85%] rounded-[100%] bg-black/50 blur-md transition-all duration-500",
          pulled ? "scale-75 opacity-40" : "scale-100 opacity-80",
        )}
      />

      {/* Cartridge body */}
      <span
        className={cn(
          "relative block overflow-hidden rounded-sm border-2 bg-[#0a1220] shadow-[6px_10px_0_rgba(0,0,0,0.45)] transition-all duration-500",
          pulled ? CART_W.pulled : CART_W.idle,
          pulled ? "h-56 md:h-72" : "h-48 md:h-60",
        )}
        style={{
          borderColor: pulled ? game.accent : "rgba(255,255,255,0.18)",
          boxShadow: pulled
            ? `6px 14px 0 rgba(0,0,0,0.5), 0 0 36px ${game.accent}55`
            : undefined,
        }}
      >
        {/* Left plastic spine / ridge */}
        <span
          aria-hidden
          className="absolute inset-y-0 left-0 z-20 flex w-4 flex-col justify-between border-r border-black/40 py-3 md:w-5"
          style={{
            background: `linear-gradient(90deg, color-mix(in oklab, ${game.accent} 55%, #0b1220), #152033)`,
          }}
        >
          <span className="mx-auto h-8 w-1 rounded-full bg-black/35" />
          <span
            className="mx-auto origin-center -rotate-180 font-mono-label text-[6px] tracking-widest text-[var(--ink)] uppercase md:text-[7px]"
            style={{ writingMode: "vertical-rl" }}
          >
            {game.era}
          </span>
          <span className="mx-auto h-8 w-1 rounded-full bg-black/35" />
        </span>

        {/* Cover art */}
        <span className="absolute inset-0 left-4 md:left-5">
          <Image
            src={game.artwork}
            alt=""
            fill
            sizes="220px"
            className={cn(
              "pointer-events-none object-cover transition-all duration-500",
              pulled ? "grayscale-0" : "grayscale-[30%]",
            )}
            draggable={false}
          />
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
        </span>

        {/* Label plate at bottom of cart */}
        <span className="absolute right-2 bottom-2 left-6 z-10 rounded-sm border border-white/10 bg-black/70 px-2 py-1.5 backdrop-blur-sm md:left-7">
          <span className="font-mono-label block text-[6px] tracking-widest text-white/50 uppercase md:text-[7px]">
            Slow Ninja · {game.era}
          </span>
          <span className="font-display mt-0.5 block text-sm font-bold text-white md:text-base">
            {game.name}
          </span>
        </span>

        {/* Pull tab notch */}
        <span
          aria-hidden
          className="absolute top-2 right-2 z-10 h-2 w-6 rounded-sm border border-white/20 bg-white/10"
        />
      </span>

      <span
        className={cn(
          "font-mono-label mt-4 text-[8px] tracking-widest uppercase transition-colors duration-300",
          pulled ? "text-white" : "text-white/35 group-hover:text-white/70",
        )}
        style={pulled ? { color: game.accent } : undefined}
      >
        {pulled ? "▲ seated / pull" : "▼ pull cart"}
      </span>
    </button>
  );
}

export function ShelfView() {
  const [active, setActive] = useState<number | null>(featuredGameIndex);
  const [awake, setAwake] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const current = active !== null ? games[active] : null;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
          setAwake(true);
        }
      },
      { threshold: [0, 0.25, 0.5], rootMargin: "-6% 0px -10% 0px" },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const select = (index: number) => {
    setAwake(true);
    setActive((prev) => (prev === index ? null : index));
  };

  return (
    <section
      ref={sectionRef}
      id="games"
      className="scroll-mt-28 bg-[#070d16] py-16 md:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <p className="font-mono-label text-[8px] tracking-widest text-[var(--cyan)] uppercase md:text-[9px]">
          Cartridge bay · catalog
        </p>
        <h2 className="font-display mt-3 text-3xl font-bold tracking-tight text-white md:text-5xl">
          Explore our universes
        </h2>
        <p className="mt-3 max-w-xl text-white/60">
          Three boxes on the shelf. Click one to slide it out like a cart—the
          rest stay docked.
        </p>
        <CatalogViewPicker />
      </div>

      {/* Shelf / bay */}
      <div className="relative mx-auto mt-12 max-w-5xl px-4 md:mt-16 md:px-6">
        {/* Ambient bay glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-8 top-8 bottom-16 rounded-[2rem] bg-[radial-gradient(ellipse_at_center,rgba(77,226,232,0.08),transparent_65%)]"
        />

        <div
          className={cn(
            "relative flex items-end justify-center gap-4 pt-16 pb-10 transition-all duration-700 md:gap-8 md:pt-20 md:pb-14",
            awake ? "opacity-100" : "opacity-60",
          )}
        >
          {games.map((game, index) => (
            <Cartridge
              key={game.slug}
              game={game}
              pulled={awake && active === index}
              seated={awake && active !== null && active !== index}
              onSelect={() => select(index)}
            />
          ))}
        </div>

        {/* Physical shelf plank */}
        <div className="relative mx-auto h-4 max-w-3xl">
          <div className="absolute inset-x-0 top-0 h-3 rounded-sm border border-white/10 bg-gradient-to-b from-[#2a3a52] to-[#121c2e] shadow-[0_12px_24px_rgba(0,0,0,0.55)]" />
          <div className="absolute inset-x-4 top-3 h-2 rounded-b-md bg-black/50 blur-sm" />
        </div>
        <div className="mx-auto mt-1 h-8 max-w-3xl rounded-b-xl border border-t-0 border-white/5 bg-[#0a1220]" />
      </div>

      {/* Dossier for the pulled cartridge */}
      {current ? (
        <div
          key={current.slug}
          className={cn(
            "pop-in mx-auto mt-10 grid max-w-6xl overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0a1220] px-0 transition-opacity duration-500 md:mt-14 md:grid-cols-[1.15fr_0.85fr]",
            awake && active !== null ? "opacity-100" : "opacity-40",
          )}
          style={{ boxShadow: `0 0 0 1px ${current.accent}44` }}
        >
          <div className="relative min-h-[260px] md:min-h-[420px]">
            <Image
              src={current.artwork}
              alt={current.name}
              fill
              className="pointer-events-none object-cover"
              sizes="(max-width:768px) 100vw, 55vw"
              priority
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent to-[#0a1220]/80" />
            <div className="absolute top-4 left-4 rounded-sm border border-white/10 bg-black/55 px-3 py-1.5 font-mono-label text-[8px] tracking-widest text-white uppercase">
              Cart {String(active! + 1).padStart(2, "0")} · {current.years}
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
      ) : (
        <p className="mx-auto mt-12 max-w-6xl px-4 text-center text-sm text-white/40 md:px-6">
          Pull a cartridge from the bay to load its dossier.
        </p>
      )}
    </section>
  );
}
