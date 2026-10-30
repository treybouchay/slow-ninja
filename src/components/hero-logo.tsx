"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
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
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (motion) {
      setReduce(true);
      setPhase("logo");
      return;
    }
    const timer = window.setTimeout(() => setPhase("logo"), BOOT_MS);
    return () => window.clearTimeout(timer);
  }, []);

  const arrived = phase === "logo";
  const draw = arrived && !reduce;

  return (
    <div className="relative grid min-h-24 place-items-center">
      {arrived ? null : (
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
      )}
      <div className={cn("col-start-1 row-start-1 overflow-hidden", !arrived && "invisible")}>
        <Wordmark draw={draw} />
        <h1 className="sr-only">Slow Ninja</h1>
      </div>
    </div>
  );
}

/** Letters rise in from below. The two rules draw across as the rise finishes. */
function Wordmark({ draw }: { draw: boolean }) {
  return (
    <div className={cn("relative h-24 w-32 md:h-[6.75rem] md:w-36", draw && "logo-rise-in")}>
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
