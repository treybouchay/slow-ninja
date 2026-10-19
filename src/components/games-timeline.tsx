"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { games } from "@/lib/content";
import { cn } from "@/lib/utils";

function gameHref(slug: string) {
  return `/?game=${slug}`;
}

export function GamesTimeline() {
  const params = useSearchParams();
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const activeSlug = params.get("game") ?? games[games.length - 1]?.slug;
  const active = useMemo(() => {
    const idx = games.findIndex((g) => g.slug === activeSlug);
    return idx >= 0 ? idx : games.length - 1;
  }, [activeSlug]);

  const current = games[active];

  useEffect(() => {
    const track = trackRef.current;
    const item = itemRefs.current[active];
    if (!track || !item) return;

    const center = () => {
      const left =
        item.offsetLeft - track.clientWidth / 2 + item.offsetWidth / 2;
      track.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
    };

    center();
    const t = window.setTimeout(center, 350);
    return () => window.clearTimeout(t);
  }, [active]);

  useEffect(() => {
    // Keep the catalog in view when switching games via query param
    if (!params.get("game")) return;
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [active, params]);

  return (
    <section
      ref={sectionRef}
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
          Click a circle to focus it—the timeline slides to that project.
        </p>
      </div>

      <div className="mx-auto mt-8 flex max-w-6xl flex-wrap items-center justify-center gap-3 px-4 md:px-6">
        {games.map((game) => {
          const selected = game.slug === current.slug;
          return (
            <Link
              key={`tab-${game.slug}`}
              href={gameHref(game.slug)}
              scroll={false}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-bold transition",
                selected
                  ? "bg-[var(--lime)] text-[var(--ink)]"
                  : "border border-white/20 bg-white/5 text-white/70 hover:border-white/40 hover:text-white",
              )}
            >
              {game.name}
            </Link>
          );
        })}
      </div>

      <div
        ref={trackRef}
        className="mt-8 flex min-h-[320px] items-center gap-8 overflow-x-auto scroll-smooth px-[calc(50%-7rem)] py-10 md:min-h-[400px] md:gap-10 md:px-[calc(50%-9rem)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {games.map((game, index) => {
          const selected = index === active;
          return (
            <Link
              key={game.slug}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              href={gameHref(game.slug)}
              scroll={false}
              className={cn(
                // Column must be at least as wide as the circle so neighbors stay clickable
                "relative z-10 flex shrink-0 flex-col items-center gap-3 transition-all duration-500",
                selected
                  ? "w-56 md:w-64"
                  : "z-20 w-32 opacity-60 hover:opacity-100 md:w-36",
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

              <span
                className={cn(
                  "relative block overflow-hidden rounded-full border-4 transition-all duration-500",
                  selected
                    ? "h-52 w-52 md:h-60 md:w-60"
                    : "h-28 w-28 md:h-32 md:w-32",
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
                  sizes={selected ? "240px" : "128px"}
                  className={cn(
                    "pointer-events-none object-cover transition-all duration-500",
                    selected ? "grayscale-0" : "grayscale-[40%]",
                  )}
                />
              </span>

              <span
                className={cn(
                  "font-display text-center font-bold",
                  selected
                    ? "text-xl text-white md:text-2xl"
                    : "text-sm text-white/55",
                )}
              >
                {game.name}
              </span>
            </Link>
          );
        })}
      </div>

      <div className="mx-auto mt-4 flex max-w-6xl items-center justify-between px-4 md:px-6">
        {active > 0 ? (
          <Link
            href={gameHref(games[active - 1].slug)}
            scroll={false}
            className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:border-[var(--cyan)]"
          >
            ← Earlier
          </Link>
        ) : (
          <span className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/30">
            ← Earlier
          </span>
        )}
        <span className="font-mono-label text-[8px] text-white/40 uppercase">
          {active + 1} / {games.length}
        </span>
        {active < games.length - 1 ? (
          <Link
            href={gameHref(games[active + 1].slug)}
            scroll={false}
            className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:border-[var(--lime)]"
          >
            Later →
          </Link>
        ) : (
          <span className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/30">
            Later →
          </span>
        )}
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
            className="pointer-events-none object-cover"
            sizes="(max-width:768px) 100vw, 60vw"
            priority
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent to-[#0a1220]/70" />
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
