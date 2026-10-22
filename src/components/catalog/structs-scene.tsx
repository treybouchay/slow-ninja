"use client";

import { LottieClip, StealthCycle } from "@/components/catalog/lottie-clip";
import { cn } from "@/lib/utils";

/**
 * Structs battlefield vignette — Lottie unit clips staged over the violet wash.
 * Mount only while Structs is the focused universe.
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
            {/* Soft depth veils so sprites read as a scene, not stickers */}
            <div
              className="absolute inset-0"
              style={{
                background: `
                  radial-gradient(ellipse 40% 35% at 18% 62%, color-mix(in oklab, var(--violet) 22%, transparent), transparent 70%),
                  radial-gradient(ellipse 35% 30% at 78% 28%, color-mix(in oklab, var(--cyan) 10%, transparent), transparent 65%)
                `,
              }}
            />

            {/* Shield generator — mid-left anchor */}
            <LottieClip
              src="/lottie/structs/shield_generator/idle"
              className="structs-float-a absolute top-[42%] left-[6%] h-[120px] w-[120px] md:top-[38%] md:left-[10%] md:h-[160px] md:w-[160px]"
              opacity={0.85}
              speed={0.85}
            />

            {/* Stealth bomber cycle — upper left */}
            <StealthCycle
              className="structs-float-b absolute top-[14%] left-[22%] h-[88px] w-[88px] md:top-[12%] md:left-[26%] md:h-[110px] md:w-[110px]"
              opacity={0.9}
            />

            {/* Air deployment — upper right */}
            <LottieClip
              src="/lottie/structs/deployment_air"
              className="structs-float-c absolute top-[10%] right-[8%] h-[100px] w-[100px] md:top-[8%] md:right-[12%] md:h-[130px] md:w-[130px]"
              opacity={0.8}
              speed={0.9}
            />

            {/* Command arrive — mid right */}
            <LottieClip
              src="/lottie/structs/move_arrive"
              className="structs-float-a absolute top-[48%] right-[10%] h-[96px] w-[96px] md:top-[44%] md:right-[14%] md:h-[124px] md:w-[124px]"
              opacity={0.82}
              speed={0.95}
            />

            {/* Signal jamming — lower left */}
            <LottieClip
              src="/lottie/structs/signal_jamming"
              className="structs-float-b absolute bottom-[12%] left-[14%] h-[90px] w-[90px] md:bottom-[14%] md:left-[18%] md:h-[118px] md:w-[118px]"
              opacity={0.75}
              speed={0.8}
            />

            {/* Destroyed unit — lower right, quieter */}
            <LottieClip
              src="/lottie/structs/destroy_space"
              className="structs-float-c absolute right-[18%] bottom-[10%] h-[86px] w-[86px] md:right-[22%] md:bottom-[12%] md:h-[112px] md:w-[112px]"
              opacity={0.7}
              speed={0.85}
            />

            {/* Distant duplicates for depth */}
            <LottieClip
              src="/lottie/structs/move_arrive"
              className="absolute top-[22%] left-[48%] h-[56px] w-[56px] scale-x-[-1] md:h-[72px] md:w-[72px]"
              opacity={0.35}
              speed={0.7}
            />
            <LottieClip
              src="/lottie/structs/deployment_air"
              className="absolute bottom-[28%] left-[40%] h-[48px] w-[48px] md:h-[64px] md:w-[64px]"
              opacity={0.3}
              speed={0.65}
            />
          </>
        ) : null}
      </div>
    </div>
  );
}
