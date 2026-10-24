"use client";

import { useState } from "react";
import { LottieClip } from "@/components/catalog/lottie-clip";
import { cn } from "@/lib/utils";

const CANNON_DELAY_MS = 700;
const STEALTH_DELAY_MS = 250;
/** Impact lands on the stealth ship after the shell leaves the cannon. */
const IMPACT_DELAY_MS = 1150;
/** Command ship arrives after the stealth ship has taken the hit. */
const SHIP_DELAY_MS = 2600;

/**
 * Structs atmosphere.
 * Cannon sits left, under the Structs counter, and fires down-right.
 * A ship comes out of stealth, flipped toward the cannon, and takes the impact.
 * After that hit, the command ship flies in lower left and stays.
 */
export function StructsScene({ active }: { active: boolean }) {
  const [shipHover, setShipHover] = useState(false);
  const [wasActive, setWasActive] = useState(active);

  if (active !== wasActive) {
    setWasActive(active);
    if (!active) setShipHover(false);
  }

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

            {/* Below the Structs 1/3 label, still on the left. Fires down-right. */}
            <FleetPiece
              className="top-[468px] left-4 h-[90px] w-[80px] md:top-[456px] md:left-6 md:h-[100px] md:w-[90px]"
              delayMs={CANNON_DELAY_MS}
            >
              <LottieClip
                src="/lottie/structs/canon_downwards"
                className="h-full w-full"
                loop={false}
                opacity={0.95}
                delayMs={CANNON_DELAY_MS}
              />
            </FleetPiece>

            {/* Comes out of stealth, flipped toward the cannon, and dropped onto the impact. */}
            <FleetPiece
              className="top-[530px] left-[100px] h-[76px] w-[76px] md:top-[524px] md:left-[160px] md:h-[104px] md:w-[104px]"
              delayMs={STEALTH_DELAY_MS}
            >
              <div
                className="h-full w-full"
                style={{ transform: "translateY(72px) scaleX(-1)" }}
              >
                <LottieClip
                  src="/lottie/structs/stealth_deactivate"
                  className="h-full w-full"
                  loop={false}
                  opacity={0.95}
                  delayMs={STEALTH_DELAY_MS}
                />
              </div>
              <div className="absolute -top-[18%] -left-[12%] h-[140%] w-[140%]">
                <LottieClip
                  src="/lottie/structs/impact_angled_down_cannon"
                  className="h-full w-full"
                  loop={false}
                  opacity={1}
                  delayMs={IMPACT_DELAY_MS}
                />
              </div>
            </FleetPiece>

            {/* Command ship flies in lower left, then holds. */}
            <FleetPiece
              className="top-[590px] left-3 h-[92px] w-[104px] md:top-[680px] md:left-6 md:h-[112px] md:w-[124px]"
              delayMs={SHIP_DELAY_MS}
            >
              <div
                className={cn(
                  "flex h-full w-full items-center justify-center",
                  shipHover && "structs-ship-hover",
                )}
              >
                <LottieClip
                  src="/lottie/structs/move_arrive"
                  className="h-full w-full"
                  loop={false}
                  opacity={0.92}
                  speed={0.95}
                  delayMs={SHIP_DELAY_MS}
                  onComplete={() => setShipHover(true)}
                />
              </div>
            </FleetPiece>
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
