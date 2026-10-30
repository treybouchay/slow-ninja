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

  return (
    <div className="relative grid min-h-24 place-items-center">
      {arrived ? null : (
        <p className="logo-word-in col-start-1 row-start-1 flex items-end gap-3 text-white" aria-hidden>
          <PixelWord text="loading" />
          <span className="mb-0.5 flex gap-1.5">
            <Dot delay="0s" />
            <Dot delay="0.22s" />
            <Dot delay="0.44s" />
          </span>
        </p>
      )}
      <div className={cn("col-start-1 row-start-1", arrived ? "opacity-100" : "opacity-0")}>
        <Wordmark fillLines={arrived && !reduce} />
        <h1 className="sr-only">Slow Ninja</h1>
      </div>
    </div>
  );
}

/** The real wordmark. Its two rules draw on after the loading line. */
function Wordmark({ fillLines }: { fillLines: boolean }) {
  return (
    <div className="relative h-24 w-32 md:h-[6.75rem] md:w-36">
      <LogoSlice part="letters" />
      <LogoSlice part="top" fill={fillLines} delay="0.08s" />
      <LogoSlice part="bottom" fill={fillLines} delay="0.32s" />
    </div>
  );
}

function LogoSlice({
  part,
  fill = false,
  delay,
}: {
  part: "letters" | "top" | "bottom";
  fill?: boolean;
  delay?: string;
}) {
  const line = part !== "letters";
  return (
    <Image
      src="/slow-ninja-logo.png"
      alt=""
      fill
      priority={part === "letters"}
      unoptimized
      aria-hidden={line}
      className={cn(
        "object-contain [image-rendering:pixelated]",
        part === "letters" && "logo-slice-letters",
        part === "top" && "logo-slice-bar-top",
        part === "bottom" && "logo-slice-bar-bottom",
        line && fill && "logo-line-fill",
      )}
      style={line && fill ? { animationDelay: delay } : undefined}
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

function Dot({ delay }: { delay: string }) {
  return (
    <span
      className="logo-boot-dot size-1.5 bg-white"
      style={{ animationDelay: delay }}
    />
  );
}
