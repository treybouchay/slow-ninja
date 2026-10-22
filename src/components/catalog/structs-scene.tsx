"use client";

import { LottieClip } from "@/components/catalog/lottie-clip";
import { cn } from "@/lib/utils";

/**
 * Structs atmosphere — command ship only (move_arrive / cmd-arrive), oversized.
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
            {/* Command ship — 4× prior ~140px stage size */}
            <LottieClip
              src="/lottie/structs/move_arrive"
              className="structs-float-a absolute top-1/2 right-[4%] h-[440px] w-[440px] -translate-y-1/2 md:right-[8%] md:h-[560px] md:w-[560px]"
              opacity={0.9}
              speed={0.9}
            />
          </>
        ) : null}
      </div>
    </div>
  );
}
