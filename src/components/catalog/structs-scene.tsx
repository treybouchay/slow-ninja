"use client";

import { LottieClip } from "@/components/catalog/lottie-clip";
import { cn } from "@/lib/utils";

const CANNON_DELAY_MS = 700;
/** Shell reaches the lower-right of the cannon frame, then the impact plays. */
const IMPACT_DELAY_MS = 1000;

/**
 * Structs atmosphere — cannon fires down-right once, and the impact blooms where the shot lands.
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

            {/* Cannon upper left. Impact is offset along the shot, which exits the lower-right of the sprite. */}
            <div className="absolute top-[268px] left-[5%] h-[100px] w-[90px] max-lg:top-[248px] max-lg:left-2 max-lg:h-[90px] max-lg:w-[80px]">
              <FleetPiece className="inset-0 h-full w-full" delayMs={CANNON_DELAY_MS}>
                <LottieClip
                  src="/lottie/structs/canon_downwards"
                  className="h-full w-full"
                  loop={false}
                  opacity={0.95}
                  delayMs={CANNON_DELAY_MS}
                />
              </FleetPiece>
              <div className="absolute h-[130%] w-[130%]" style={{ left: "86%", top: "80%" }}>
                <LottieClip
                  src="/lottie/structs/impact_angled_down_cannon"
                  className="h-full w-full"
                  loop={false}
                  opacity={1}
                  delayMs={IMPACT_DELAY_MS}
                />
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

function FleetPiece({
  className,
  delayMs,
  children,
}: {
  className?: string;
  delayMs: number;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn("structs-fade-in pointer-events-none absolute", className)}
      style={{ animationDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
  );
}
