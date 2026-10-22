"use client";

import { LottieClip } from "@/components/catalog/lottie-clip";
import { cn } from "@/lib/utils";

/**
 * Structs atmosphere — command ship at regular size.
 * Plays once (no loop), then drifts around the stage.
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
            <div className="structs-ship-drift pointer-events-none absolute top-[18%] left-[12%] h-[110px] w-[110px] md:h-[140px] md:w-[140px]">
              <LottieClip
                src="/lottie/structs/move_arrive"
                className="h-full w-full"
                loop={false}
                opacity={0.9}
                speed={0.95}
              />
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
