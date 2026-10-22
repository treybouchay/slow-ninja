"use client";

import { useEffect, useState, type ReactNode } from "react";
import { LottieClip, StealthCycle } from "@/components/catalog/lottie-clip";
import { cn } from "@/lib/utils";

type Beat = {
  id: string;
  /** How long this beat stays on screen */
  ms: number;
  render: () => ReactNode;
};

const BEATS: Beat[] = [
  {
    id: "shield",
    ms: 5200,
    render: () => (
      <LottieClip
        src="/lottie/structs/shield_generator/idle"
        className="structs-float-a absolute top-[42%] left-[8%] h-[130px] w-[130px] md:top-[38%] md:left-[12%] md:h-[168px] md:w-[168px]"
        opacity={0.88}
        speed={0.85}
      />
    ),
  },
  {
    id: "stealth",
    ms: 4200,
    render: () => (
      <StealthCycle
        className="structs-float-b absolute top-[18%] left-[28%] h-[100px] w-[100px] md:top-[16%] md:left-[32%] md:h-[120px] md:w-[120px]"
        opacity={0.92}
      />
    ),
  },
  {
    id: "arrive",
    ms: 3800,
    render: () => (
      <LottieClip
        src="/lottie/structs/move_arrive"
        className="structs-float-a absolute top-[46%] right-[12%] h-[110px] w-[110px] md:top-[42%] md:right-[16%] md:h-[140px] md:w-[140px]"
        opacity={0.88}
        speed={0.95}
      />
    ),
  },
  {
    id: "jam",
    ms: 4000,
    render: () => (
      <LottieClip
        src="/lottie/structs/signal_jamming"
        className="structs-float-b absolute bottom-[14%] left-[16%] h-[100px] w-[100px] md:bottom-[16%] md:left-[20%] md:h-[128px] md:w-[128px]"
        opacity={0.82}
        speed={0.85}
      />
    ),
  },
  {
    id: "destroy",
    ms: 3600,
    render: () => (
      <LottieClip
        src="/lottie/structs/destroy_space"
        className="structs-float-c absolute right-[20%] bottom-[12%] h-[100px] w-[100px] md:right-[24%] md:bottom-[14%] md:h-[128px] md:w-[128px]"
        opacity={0.8}
        speed={0.9}
      />
    ),
  },
];

/**
 * Structs battlefield vignette — one Lottie beat at a time over the violet wash.
 */
export function StructsScene({ active }: { active: boolean }) {
  const [beat, setBeat] = useState(0);

  useEffect(() => {
    if (!active) {
      setBeat(0);
      return;
    }
    const ms = BEATS[beat]?.ms ?? 4000;
    const t = window.setTimeout(() => {
      setBeat((i) => (i + 1) % BEATS.length);
    }, ms);
    return () => window.clearTimeout(t);
  }, [active, beat]);

  const current = BEATS[beat];

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="universe-nebula absolute inset-0 opacity-55" />

      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-700",
          active ? "opacity-100" : "opacity-0",
        )}
      >
        {active && current ? (
          <>
            <div
              className="absolute inset-0"
              style={{
                background: `
                  radial-gradient(ellipse 40% 35% at 18% 62%, color-mix(in oklab, var(--violet) 22%, transparent), transparent 70%),
                  radial-gradient(ellipse 35% 30% at 78% 28%, color-mix(in oklab, var(--cyan) 10%, transparent), transparent 65%)
                `,
              }}
            />
            <div
              key={current.id}
              className="absolute inset-0 animate-[pop-in_0.55s_cubic-bezier(0.22,1,0.36,1)_both]"
            >
              {current.render()}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
