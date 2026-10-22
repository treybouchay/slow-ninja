"use client";

import { LottieClip } from "@/components/catalog/lottie-clip";
import { cn } from "@/lib/utils";

/**
 * Structs atmosphere — command ship in the marked upper-right pocket
 * (≈200×152). Short settle float, then ±2px hover loop.
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
            {/* Region match: section left ~1092, top ~316 → stage upper-right */}
            <div className="structs-ship-drift pointer-events-none absolute top-[316px] left-[1092px] flex h-[152px] w-[200px] -translate-x-0 items-center justify-center max-lg:left-auto max-lg:right-6 max-lg:top-[280px]">
              <LottieClip
                src="/lottie/structs/move_arrive"
                className="h-[110px] w-[110px] md:h-[128px] md:w-[128px]"
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
