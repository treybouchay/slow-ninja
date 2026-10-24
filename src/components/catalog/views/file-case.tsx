"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { CatalogViewPicker } from "@/components/catalog/catalog-view-picker";
import { games, type Game } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * Storage-box catalog matching the three-quarter file-box icon:
 * open case, finger-pull on the front, three carts stacked front-to-back.
 * Pull a cart up to expand it. Starlane: catalog/games-timeline.starlane.tsx
 */

/** Front → back stack (index 0 = front-most). Large stagger so each cart peeks. */
const STACK = [
  { bottom: 4, scale: 1, z: 30 },
  { bottom: 56, scale: 0.97, z: 20 },
  { bottom: 108, scale: 0.94, z: 10 },
] as const;

function CartPlate({
  game,
  expanded,
  dimmed,
}: {
  game: Game;
  expanded?: boolean;
  dimmed?: boolean;
}) {
  return (
    <span
      className={cn(
        "relative block overflow-hidden border-[3px] bg-[#0a1220] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        expanded
          ? "h-56 w-44 rounded-md md:h-80 md:w-60"
          : "h-32 w-[7.25rem] rounded-[2px] md:h-40 md:w-36",
        dimmed && "opacity-55",
      )}
      style={{
        borderColor: expanded ? game.accent : "rgba(255,255,255,0.9)",
        boxShadow: expanded
          ? `0 32px 56px rgba(0,0,0,0.55), 0 0 36px ${game.accent}66`
          : "3px 4px 0 rgba(0,0,0,0.4)",
      }}
    >
      <Image
        src={game.artwork}
        alt=""
        fill
        sizes={expanded ? "240px" : "150px"}
        className="pointer-events-none object-cover"
        draggable={false}
      />
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
      <span className="absolute inset-x-0 bottom-0 z-10 p-2 md:p-2.5">
        <span className="font-mono-label block text-[6px] tracking-widest text-white/55 uppercase md:text-[7px]">
          {game.era}
        </span>
        <span
          className={cn(
            "font-display block font-bold text-white",
            expanded ? "text-xl md:text-3xl" : "text-sm md:text-base",
          )}
        >
          {game.name}
        </span>
      </span>
    </span>
  );
}

export function FileCaseView() {
  const [active, setActive] = useState<number | null>(null);
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
      className="scroll-mt-28 overflow-x-clip bg-[#070d16] py-16 md:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <p className="font-mono-label text-[8px] tracking-widest text-[var(--cyan)] uppercase md:text-[9px]">
          Field case · pull a cart
        </p>
        <h2 className="font-display mt-3 text-3xl font-bold tracking-tight text-white md:text-5xl">
          Explore our universes
        </h2>
        <p className="mt-3 max-w-xl text-white/60">
          Three titles stacked front-to-back. Pull one up—it lifts out and
          expands.
        </p>
        <CatalogViewPicker />
      </div>

      <div className="relative mx-auto mt-8 flex min-h-[400px] max-w-4xl items-end justify-center px-4 md:mt-10 md:min-h-[520px]">
        {/* Expanded cart floats above the case */}
        {awake && active !== null && (
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => select(active)}
            aria-pressed
            aria-label={`Reseat ${games[active].name}`}
            className="pop-in absolute top-2 left-1/2 z-50 -translate-x-1/2 border-0 bg-transparent p-0 outline-none md:top-0"
          >
            <CartPlate game={games[active]} expanded />
            <span
              className="font-mono-label mt-3 block text-center text-[8px] tracking-widest uppercase"
              style={{ color: games[active].accent }}
            >
              ▲ click to reseat
            </span>
          </button>
        )}

        {/* Icon-style case */}
        <div
          className={cn(
            "relative mb-4 w-[280px] transition-all duration-500 md:w-[360px]",
            awake && active !== null ? "translate-y-6 opacity-90" : "opacity-100",
            !awake && "opacity-65",
          )}
        >
          {/* Drop shadow */}
          <div
            aria-hidden
            className="absolute -right-2 -bottom-3 left-6 h-8 rounded-[100%] bg-black/45 blur-lg"
          />

          {/*
            Three-quarter box drawn with CSS shapes (front + right + interior),
            matching the storage-box icon proportions.
          */}
          <div className="relative aspect-[4/5] w-full md:aspect-[5/5.2]">
            {/* Right side panel */}
            <div
              aria-hidden
              className="absolute top-[6%] right-0 bottom-[4%] w-[22%] border-[3px] border-l-0 border-white/85 bg-[#152033]"
              style={{
                clipPath: "polygon(0 8%, 100% 0, 100% 92%, 0 100%)",
              }}
            />

            {/* Main box body (front + open top interior) */}
            <div className="absolute top-[10%] right-[18%] bottom-0 left-0 flex flex-col border-[3px] border-white/90 bg-[#0c1422]">
              {/* Interior well where carts sit */}
              <div className="relative min-h-0 flex-1 overflow-visible bg-[#080e18] px-4 pt-2 pb-0 md:px-5">
                <div className="relative mx-auto h-[210px] w-[78%] md:h-[250px]">
                  {games.map((game, index) => {
                    const stack = STACK[index];
                    const pulled = awake && active === index;

                    return (
                      <button
                        key={game.slug}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => select(index)}
                        aria-pressed={!!pulled}
                        aria-label={`${pulled ? "Reseat" : "Pull out"} ${game.name}`}
                        className={cn(
                          "absolute left-1/2 origin-bottom -translate-x-1/2 border-0 bg-transparent p-0 outline-none transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                          pulled
                            ? "pointer-events-none -translate-y-28 scale-75 opacity-0"
                            : "opacity-100 hover:-translate-y-3",
                        )}
                        style={{
                          zIndex: stack.z,
                          bottom: stack.bottom,
                          transform: pulled
                            ? undefined
                            : `translateX(-50%) scale(${stack.scale})`,
                        }}
                      >
                        <CartPlate
                          game={game}
                          dimmed={awake && active !== null && active !== index}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Front wall with finger-pull handle */}
              <div className="relative flex h-[22%] items-center justify-center border-t-[3px] border-white/90 bg-[#101a2c]">
                <div className="h-3.5 w-16 rounded-[3px] border-[3px] border-white/90 bg-[#070d16] md:h-4 md:w-20" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-2 px-4 md:px-6">
        {games.map((game, index) => (
          <button
            key={game.slug}
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => select(index)}
            className={cn(
              "rounded-full border px-3 py-1.5 font-mono-label text-[8px] tracking-widest uppercase transition",
              active === index
                ? "border-transparent text-[var(--ink)]"
                : "border-white/20 text-white/50 hover:border-white/40 hover:text-white",
            )}
            style={
              active === index
                ? { background: game.accent, borderColor: game.accent }
                : undefined
            }
          >
            {game.name}
          </button>
        ))}
      </div>

      {current ? (
        <div
          key={current.slug}
          className="pop-in mx-auto mt-10 grid max-w-6xl overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0a1220] md:mt-14 md:grid-cols-[1.15fr_0.85fr]"
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
          Pull a cartridge from the case to load its dossier.
        </p>
      )}
    </section>
  );
}
