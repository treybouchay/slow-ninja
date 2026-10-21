"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { games, type Game } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * Catalog experiment: top-down diagonal cartridge case.
 * Three carts sit in a storage box; pull one out and it expands toward you.
 * Starlane snapshot: catalog/games-timeline.starlane.tsx (tag timeline-starlane-v1).
 */

function CartFace({
  game,
  size,
}: {
  game: Game;
  size: "docked" | "pulled";
}) {
  const dims =
    size === "pulled"
      ? "h-44 w-32 md:h-64 md:w-48"
      : "h-28 w-20 md:h-36 md:w-28";

  return (
    <span
      className={cn(
        "relative block overflow-hidden rounded-[3px] border-2 bg-[#0a1220]",
        dims,
      )}
      style={{ borderColor: game.accent }}
    >
      {/* Spine ridge */}
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 z-10 w-2.5 border-r border-black/50 md:w-3.5"
        style={{
          background: `linear-gradient(90deg, color-mix(in oklab, ${game.accent} 70%, #0b1220), #1a2740)`,
        }}
      />
      <span className="absolute inset-0 left-2.5 md:left-3.5">
        <Image
          src={game.artwork}
          alt=""
          fill
          sizes={size === "pulled" ? "200px" : "120px"}
          className="pointer-events-none object-cover"
          draggable={false}
        />
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/15" />
      </span>
      <span className="absolute right-1.5 bottom-1.5 left-4 z-10 rounded-sm bg-black/65 px-1.5 py-1 backdrop-blur-[2px] md:left-5">
        <span className="font-mono-label block text-[5px] tracking-widest text-white/55 uppercase md:text-[6px]">
          {game.era}
        </span>
        <span className="font-display block text-[10px] leading-tight font-bold text-white md:text-sm">
          {game.name}
        </span>
      </span>
    </span>
  );
}

function Cartridge({
  game,
  index,
  pulled,
  onSelect,
}: {
  game: Game;
  index: number;
  pulled: boolean;
  onSelect: () => void;
}) {
  // Slot positions inside the isometric box (percent of box floor)
  const slots = [
    { left: "12%", top: "28%" },
    { left: "38%", top: "28%" },
    { left: "64%", top: "28%" },
  ];
  const slot = slots[index];

  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onSelect}
      aria-pressed={pulled}
      aria-label={`${pulled ? "Reseat" : "Pull out"} ${game.name}`}
      className={cn(
        "absolute border-0 bg-transparent p-0 outline-none transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        pulled
          ? "z-40 cursor-pointer"
          : "z-20 cursor-pointer hover:brightness-110",
      )}
      style={
        pulled
          ? {
              // Slide out of the open corner toward the viewer and expand
              left: "58%",
              top: "78%",
              transform:
                "translate(-20%, -10%) rotateX(-48deg) rotateZ(22deg) scale(1.55)",
              filter: `drop-shadow(0 28px 28px rgba(0,0,0,0.65)) drop-shadow(0 0 24px ${game.accent})`,
            }
          : {
              left: slot.left,
              top: slot.top,
              transform: "translateZ(2px)",
            }
      }
    >
      <CartFace game={game} size={pulled ? "pulled" : "docked"} />
    </button>
  );
}

export function DiagonalCaseView() {
  const [active, setActive] = useState<number | null>(games.length - 1);
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
          Cartridge case · top-down
        </p>
        <h2 className="font-display mt-3 text-3xl font-bold tracking-tight text-white md:text-5xl">
          Explore our universes
        </h2>
        <p className="mt-3 max-w-xl text-white/60">
          Three carts docked in the box. Pull one toward you—it slides out and
          expands.
        </p>
      </div>

      {/* Stage */}
      <div className="relative mx-auto mt-6 flex min-h-[420px] max-w-5xl items-center justify-center px-4 md:mt-4 md:min-h-[560px] md:px-6">
        <div
          className={cn(
            "relative h-[340px] w-full max-w-3xl transition-opacity duration-700 md:h-[460px]",
            awake ? "opacity-100" : "opacity-55",
          )}
          style={{ perspective: "1200px" }}
        >
          {/* Floor glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-[10%] bottom-[8%] h-24 rounded-[100%] bg-[radial-gradient(ellipse,rgba(77,226,232,0.12),transparent_70%)] blur-md"
          />

          {/* Isometric storage box */}
          <div
            className="absolute top-[6%] left-[8%] h-[78%] w-[84%] origin-center"
            style={{
              transform: "rotateX(58deg) rotateZ(-32deg)",
              transformStyle: "preserve-3d",
            }}
          >
            {/* Box outer shell */}
            <div className="absolute inset-0 rounded-lg border border-white/15 bg-gradient-to-br from-[#1a2740] via-[#0f1828] to-[#0a1220] shadow-[0_40px_60px_rgba(0,0,0,0.55)]">
              {/* Inner well */}
              <div className="absolute inset-[7%] rounded-md border border-white/10 bg-[#060b14]">
                {/* Felt / foam lining */}
                <div className="absolute inset-[4%] rounded-sm bg-[linear-gradient(135deg,#101a2c_0%,#0a1220_50%,#142033_100%)] opacity-90" />
                {/* Slot rails */}
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    aria-hidden
                    className="absolute top-[18%] bottom-[18%] w-px bg-white/10"
                    style={{ left: `${22 + i * 26}%` }}
                  />
                ))}
                {/* Case label */}
                <div className="absolute top-2 right-3 left-3 flex items-center justify-between">
                  <span className="font-mono-label text-[6px] tracking-widest text-white/35 uppercase md:text-[7px]">
                    Slow Ninja · Field case
                  </span>
                  <span className="font-mono-label text-[6px] tracking-widest text-[var(--lime)] uppercase md:text-[7px]">
                    3 carts
                  </span>
                </div>
              </div>

              {/* Open lip / front edge of case */}
              <div
                aria-hidden
                className="absolute right-[-2%] bottom-[-3%] left-[-2%] h-[10%] rounded-b-lg border border-white/10 bg-gradient-to-b from-[#24344f] to-[#121c2e]"
                style={{ transform: "translateZ(6px)" }}
              />
            </div>

            {/* Docked carts (still in the isometric scene) */}
            {games.map((game, index) =>
              awake && active === index ? null : (
                <Cartridge
                  key={game.slug}
                  game={game}
                  index={index}
                  pulled={false}
                  onSelect={() => select(index)}
                />
              ),
            )}
          </div>

          {/* Pulled cart rendered above the isometric scene so it can expand freely */}
          {awake &&
            active !== null &&
            (() => {
              const game = games[active];
              return (
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => select(active)}
                  aria-pressed
                  aria-label={`Reseat ${game.name}`}
                  className="absolute top-[42%] right-[4%] z-50 border-0 bg-transparent p-0 outline-none transition-transform duration-500 md:top-[36%] md:right-[8%]"
                  style={{
                    transform: "rotate(-8deg)",
                    filter: `drop-shadow(0 24px 32px rgba(0,0,0,0.6)) drop-shadow(0 0 28px ${game.accent})`,
                  }}
                >
                  <span className="pop-in block origin-bottom scale-100 md:scale-110">
                    <CartFace game={game} size="pulled" />
                  </span>
                  <span
                    className="font-mono-label mt-3 block text-center text-[8px] tracking-widest uppercase"
                    style={{ color: game.accent }}
                  >
                    ▲ click to reseat
                  </span>
                </button>
              );
            })()}

          {/* Empty slot hint when one is out */}
          {awake && active !== null && (
            <div
              aria-hidden
              className="pointer-events-none absolute top-[38%] left-[28%] font-mono-label text-[7px] tracking-widest text-white/25 uppercase md:left-[32%]"
              style={{ transform: "rotate(-32deg)" }}
            >
              empty slot
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl items-center justify-center gap-3 px-4 md:px-6">
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
          className={cn(
            "pop-in mx-auto mt-10 grid max-w-6xl overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0a1220] transition-opacity duration-500 md:mt-14 md:grid-cols-[1.15fr_0.85fr]",
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
          Pull a cartridge from the case to load its dossier.
        </p>
      )}
    </section>
  );
}
