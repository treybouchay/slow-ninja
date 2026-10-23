"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { Lottie } from "lottie-react";
import { cn } from "@/lib/utils";

type ClipProps = {
  /** Folder under /public containing data.json + images/ */
  src: string;
  className?: string;
  style?: CSSProperties;
  loop?: boolean | number;
  autoplay?: boolean;
  speed?: number;
  /** 0–1 */
  opacity?: number;
  /** Delay before autoplay starts (ms) */
  delayMs?: number;
  /** Fires when a non-looping clip finishes */
  onComplete?: () => void;
};

export function LottieClip({
  src,
  className,
  style,
  loop = true,
  autoplay = true,
  speed = 1,
  opacity = 1,
  delayMs = 0,
  onComplete,
}: ClipProps) {
  const base = src.replace(/\/$/, "");
  const [ready, setReady] = useState(delayMs <= 0);

  useEffect(() => {
    if (delayMs <= 0) return;
    const t = window.setTimeout(() => setReady(true), delayMs);
    return () => window.clearTimeout(t);
  }, [delayMs, src]);

  if (!ready) {
    return (
      <div
        className={cn("pointer-events-none", className)}
        style={{ opacity: 0, ...style }}
        aria-hidden
      />
    );
  }

  return (
    <div
      className={cn("pointer-events-none", className)}
      style={{ opacity, ...style }}
      aria-hidden
    >
      <Lottie
        src={`${base}/data.json`}
        assetsPath={`${base}/images/`}
        loop={loop}
        autoplay={autoplay}
        speed={speed}
        className="h-full w-full"
        subscriptions={{
          complete: () => {
            onComplete?.();
          },
        }}
      />
    </div>
  );
}

/** Plays activate then deactivate in a loop (stealth bomber). */
export function StealthCycle({
  className,
  style,
  opacity = 1,
  delayMs = 0,
}: {
  className?: string;
  style?: CSSProperties;
  opacity?: number;
  /** Delay before the cloak cycle starts (ms) */
  delayMs?: number;
}) {
  const [phase, setPhase] = useState<"activate" | "deactivate">("activate");
  const [tick, setTick] = useState(0);
  const [ready, setReady] = useState(delayMs <= 0);

  useEffect(() => {
    if (delayMs <= 0) return;
    const t = window.setTimeout(() => setReady(true), delayMs);
    return () => window.clearTimeout(t);
  }, [delayMs]);

  useEffect(() => {
    if (!ready) return;
    const t = window.setTimeout(() => {
      setPhase((p) => (p === "activate" ? "deactivate" : "activate"));
      setTick((n) => n + 1);
    }, 2200);
    return () => window.clearTimeout(t);
  }, [phase, tick, ready]);

  if (!ready) {
    return (
      <div
        className={cn("pointer-events-none", className)}
        style={{ opacity: 0, ...style }}
        aria-hidden
      />
    );
  }

  return (
    <div
      className={cn("pointer-events-none relative", className)}
      style={{ opacity, ...style }}
      aria-hidden
    >
      <LottieClip
        key={`stealth-${phase}-${tick}`}
        src={`/lottie/structs/stealth_${phase}`}
        loop={false}
        className="absolute inset-0"
        opacity={1}
      />
    </div>
  );
}
