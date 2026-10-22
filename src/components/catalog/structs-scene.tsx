"use client";

import { LottieClip } from "@/components/catalog/lottie-clip";
import { cn } from "@/lib/utils";

const SHIP_DELAY_MS = 2000;
const SAT_DELAY_MS = 1000;

/**
 * Structs atmosphere — command ship upper-right; satellite above the dossier.
 * All motion starts after a 1s delay.
 */
export function StructsScene({ active }: { active: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="universe-nebula absolute inset-0 opacity-55" />

      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-700",
          active ? "opacity-100" : "opacity-0",
        )}
      >
        {active ? (
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
            {/* Command ship — upper-right pocket */}
            <div className="structs-ship-drift pointer-events-none absolute top-[316px] left-[1092px] flex h-[152px] w-[200px] items-center justify-center max-lg:left-auto max-lg:right-6 max-lg:top-[280px]">
              <LottieClip
                src="/lottie/structs/move_arrive"
                className="h-[110px] w-[110px] md:h-[128px] md:w-[128px]"
                loop={false}
                opacity={0.9}
                speed={0.95}
                delayMs={SHIP_DELAY_MS}
              />
            </div>

            {/* Satellite idle — above the left dossier card */}
            <div className="structs-sat-drift pointer-events-none absolute top-[300px] left-[168px] h-[100px] w-[100px] md:left-[180px] md:h-[120px] md:w-[120px] max-lg:left-6">
              <LottieClip
                src="/lottie/structs/sat_idle"
                className="h-full w-full"
                loop
                opacity={0.85}
                speed={0.9}
                delayMs={SAT_DELAY_MS}
              />
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
