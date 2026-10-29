"use client";

import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/brand-logo";
import { cn } from "@/lib/utils";

const BOOT_MS = 1600;

/** Block letters in the same pixel construction as the Slow Ninja wordmark. */
const GLYPHS: Record<string, string[]> = {
  l: ["#...", "#...", "#...", "#...", "####"],
  o: [".##.", "#..#", "#..#", "#..#", ".##."],
  a: [".##.", "#..#", "####", "#..#", "#..#"],
  d: ["###.", "#..#", "#..#", "#..#", "###."],
  i: ["#", "#", "#", "#", "#"],
  n: ["#..#", "##.#", "#.##", "#..#", "#..#"],
  g: [".###", "#...", "#..#", "#..#", ".###"],
};

export function HeroLogo() {
  const [phase, setPhase] = useState<"loading" | "logo">("loading");

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setPhase("logo");
      return;
    }
    const timer = window.setTimeout(() => setPhase("logo"), BOOT_MS);
    return () => window.clearTimeout(timer);
  }, []);

  const arrived = phase === "logo";

  return (
    <div className="relative grid min-h-24 place-items-center">
      <p
        className={cn(
          "col-start-1 row-start-1 flex items-end gap-3 text-white",
          arrived ? "logo-word-out" : "logo-word-in",
        )}
        aria-hidden
      >
        <PixelWord text="loading" />
        <span className="mb-0.5 flex gap-1.5">
          <Dot delay="0s" />
          <Dot delay="0.22s" />
          <Dot delay="0.44s" />
        </span>
      </p>
      <div className={cn("col-start-1 row-start-1", arrived ? "logo-arrive" : "opacity-0")}>
        <BrandLogo size="hero" href={null} priority />
        <h1 className="sr-only">Slow Ninja</h1>
      </div>
    </div>
  );
}

function PixelWord({ text }: { text: string }) {
  return (
    <span className="inline-flex items-end gap-2">
      {text.split("").map((letter, index) => {
        const rows = GLYPHS[letter] ?? [];
        return (
          <span key={`${letter}-${index}`} className="inline-flex flex-col gap-px">
            {rows.map((row, y) => (
              <span key={y} className="flex gap-px">
                {row.split("").map((cell, x) => (
                  <span
                    key={x}
                    className={cn("size-1.5", cell === "#" ? "bg-white" : "bg-transparent")}
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

function Dot({ delay }: { delay: string }) {
  return (
    <span
      className="logo-boot-dot size-1.5 bg-white"
      style={{ animationDelay: delay }}
    />
  );
}
