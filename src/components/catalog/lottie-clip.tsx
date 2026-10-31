"use client";

import { useEffect, useState, type CSSProperties, type Ref } from "react";
import { Lottie, type LottieHandle } from "lottie-react";
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
  /** Fires once the clip has loaded. Frames may still be decoding. */
  onReady?: () => void;
  /** Playback handle. Pair with autoplay={false} to warm a clip before it plays. */
  lottieRef?: Ref<LottieHandle>;
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
  onReady,
  lottieRef,
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
        lottieRef={lottieRef}
        src={`${base}/data.json`}
        assetsPath={`${base}/images/`}
        loop={loop}
        autoplay={autoplay}
        speed={speed}
        className="h-full w-full"
        subscriptions={{
          ready: () => {
            onReady?.();
          },
          complete: () => {
            onComplete?.();
          },
        }}
      />
    </div>
  );
}

/**
 * Plays the cloak, then the reveal.
 * `once` holds the last frame of the reveal instead of looping.
 */
export function StealthCycle({
  className,
  style,
  opacity = 1,
  delayMs = 0,
  once = false,
  onSettled,
}: {
  className?: string;
  style?: CSSProperties;
  opacity?: number;
  /** Delay before the cloak cycle starts (ms) */
  delayMs?: number;
  /** Play activate → deactivate a single time, then hold the last frame */
  once?: boolean;
  /** Fires when a one-shot cycle is holding its last frame */
  onSettled?: () => void;
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
    if (!ready || once) return;
    const t = window.setTimeout(() => {
      setPhase((p) => (p === "activate" ? "deactivate" : "activate"));
      setTick((n) => n + 1);
    }, 2200);
    return () => window.clearTimeout(t);
  }, [phase, tick, ready, once]);

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
        onComplete={() => {
          if (!once) return;
          if (phase === "activate") {
            setPhase("deactivate");
            setTick((n) => n + 1);
            return;
          }
          onSettled?.();
        }}
      />
    </div>
  );
}
