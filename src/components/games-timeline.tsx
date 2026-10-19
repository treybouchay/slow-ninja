"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { games } from "@/lib/content";
import { cn } from "@/lib/utils";

export function GamesTimeline() {
  const params = useSearchParams();
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
    const t = window.setTimeout(center, 320);
    return () => window.clearTimeout(t);
  }, [active]);

  return (
    <section
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

      {/* Plain links — always clickable */}
      <div className="mx-auto mt-8 flex max-w-6xl flex-wrap items-center justify-center gap-3 px-4 md:px-6">
        {games.map((game) => {
          const selected = game.slug === current.slug;
          return (
            <Link
              key={`tab-${game.slug}`}
              href={`/?game=${game.slug}#games`}
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
        className="mt-8 flex min-h-[300px] items-center gap-12 overflow-x-auto scroll-smooth px-[calc(50%-5rem)] py-10 md:min-h-[380px] md:gap-16 md:px-[calc(50%-7rem)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {games.map((game, index) => {
          const selected = index === active;
          return (
            <Link
              key={game.slug}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              href={`/?game=${game.slug}#games`}
              scroll={false}
              className={cn(
                "flex shrink-0 flex-col items-center gap-3 transition-all duration-500",
                selected
                  ? "w-48 scale-100 md:w-60"
                  : "w-28 scale-90 opacity-55 hover:opacity-90 md:w-32",
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
                    ? "h-44 w-44 md:h-56 md:w-56"
                    : "h-24 w-24 md:h-28 md:w-28",
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
                  className={cn(
                    "object-cover transition-all duration-500",
                    selected ? "grayscale-0" : "grayscale-[40%]",
                  )}
                  sizes={selected ? "224px" : "112px"}
                />
              </span>

              <span
                className={cn(
                  "font-display text-center font-bold",
                  selected
                    ? "text-xl text-white md:text-2xl"
                    : "text-sm text-white/50",
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
            href={`/?game=${games[active - 1].slug}#games`}
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
            href={`/?game=${games[active + 1].slug}#games`}
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
            className="object-cover"
            sizes="(max-width:768px) 100vw, 60vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a1220]/70" />
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
