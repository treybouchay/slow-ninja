"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const BOOT_MS = 1600;
const STORAGE_KEY = "slow-ninja-logo-option";

const OPTIONS = [
  { id: "rise", label: "Rise" },
  { id: "still", label: "Still" },
  { id: "word", label: "Word" },
] as const;

type LogoOption = (typeof OPTIONS)[number]["id"];

function isLogoOption(value: string | null): value is LogoOption {
  return OPTIONS.some((option) => option.id === value);
}

/** Block letters in the same pixel construction as the Slow Ninja wordmark. */
const GLYPHS: Record<string, string[]> = {
  s: [".###", "#...", ".##.", "...#", "###."],
  l: ["#...", "#...", "#...", "#...", "####"],
  o: [".##.", "#..#", "#..#", "#..#", ".##."],
  w: ["#...#", "#...#", "#.#.#", "##.##", "#...#"],
  a: [".##.", "#..#", "####", "#..#", "#..#"],
  d: ["###.", "#..#", "#..#", "#..#", "###."],
  i: ["#", "#", "#", "#", "#"],
  n: ["#..#", "##.#", "#.##", "#..#", "#..#"],
  j: ["..#", "..#", "..#", "#.#", ".#."],
  g: [".###", "#...", "#..#", "#..#", ".###"],
};

export function HeroLogo() {
  const [option, setOption] = useState<LogoOption>("rise");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (isLogoOption(saved)) setOption(saved);
    } catch {
      /* ignore */
    }
  }, []);

  const choose = (next: LogoOption) => {
    setOption(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="flex flex-col items-center">
      <LogoStage key={option} option={option} />
      <div role="tablist" aria-label="Slow Ninja logo options" className="mt-4 flex gap-2">
        {OPTIONS.map((choice) => {
          const selected = choice.id === option;
          return (
            <button
              key={choice.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => choose(choice.id)}
              className={cn(
                "rounded-full px-3 py-1.5 font-mono-label text-[8px] tracking-widest uppercase transition",
                selected
                  ? "bg-[var(--lime)] font-bold text-[var(--ink)] shadow-[3px_3px_0_var(--cyan)]"
                  : "border border-white/15 text-white/55 hover:border-white/30 hover:text-white/80",
              )}
            >
              {choice.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function LogoStage({ option }: { option: LogoOption }) {
  const [phase, setPhase] = useState<"loading" | "logo">(option === "rise" ? "loading" : "logo");
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (motion) {
      setReduce(true);
      setPhase("logo");
      return;
    }
    if (option !== "rise") return;
    const timer = window.setTimeout(() => setPhase("logo"), BOOT_MS);
    return () => window.clearTimeout(timer);
  }, [option]);

  const arrived = phase === "logo";
  const draw = option === "rise" && arrived && !reduce;

  return (
    <div className="relative grid min-h-24 place-items-center">
      {option === "rise" && !arrived ? (
        <p
          className="logo-loading-flash col-start-1 row-start-1 flex items-end gap-3 text-white"
          aria-hidden
        >
          <PixelWord text="loading" />
          <span className="mb-0.5 flex gap-1.5">
            <span className="size-1.5 bg-white" />
            <span className="size-1.5 bg-white" />
            <span className="size-1.5 bg-white" />
          </span>
        </p>
      ) : null}
      {option === "word" ? (
        <p className={cn("text-white", !reduce && "logo-word-in")}>
          <PixelWord text="slow ninja" compact />
          <span className="sr-only">Slow Ninja</span>
        </p>
      ) : (
        <div className={cn("col-start-1 row-start-1 overflow-hidden", option === "rise" && !arrived && "invisible")}>
          <Wordmark draw={draw} rise={option === "rise" && arrived && !reduce} />
          <h1 className="sr-only">Slow Ninja</h1>
        </div>
      )}
    </div>
  );
}

/** Letters rise in from below. The two rules draw across as the rise finishes. */
function Wordmark({ draw, rise }: { draw: boolean; rise: boolean }) {
  return (
    <div className={cn("relative h-24 w-32 md:h-[6.75rem] md:w-36", rise && "logo-rise-in")}>
      <Slice part="letters" priority />
      <Slice part="top" draw={draw} />
      <Slice part="bottom" draw={draw} />
    </div>
  );
}

function Slice({
  part,
  draw = false,
  priority = false,
}: {
  part: "letters" | "top" | "bottom";
  draw?: boolean;
  priority?: boolean;
}) {
  return (
    <Image
      src="/slow-ninja-mark.png"
      alt=""
      fill
      priority={priority}
      unoptimized
      aria-hidden
      className={cn(
        "object-contain [image-rendering:pixelated]",
        part === "letters" && "logo-slice-letters",
        part === "top" && "logo-slice-bar-top",
        part === "bottom" && "logo-slice-bar-bottom",
        draw && part !== "letters" && "logo-line-draw",
      )}
    />
  );
}

function PixelWord({ text, compact = false }: { text: string; compact?: boolean }) {
  const cell = compact ? "size-1 md:size-1.5" : "size-1.5";
  return (
    <span className="inline-flex items-end gap-1.5 md:gap-2">
      {text.split("").map((letter, index) => {
        if (letter === " ") return <span key={index} className="w-2 md:w-3" />;
        const rows = GLYPHS[letter] ?? [];
        return (
          <span key={`${letter}-${index}`} className="inline-flex flex-col gap-px">
            {rows.map((row, y) => (
              <span key={y} className="flex gap-px">
                {row.split("").map((pixel, x) => (
                  <span
                    key={x}
                    className={cn(cell, pixel === "#" ? "bg-white" : "bg-transparent")}
                  />
                ))}
              </span>
            ))}
          </span>
        );
      })}
    </span>
  );
}
