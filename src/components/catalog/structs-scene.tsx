"use client";

import { useState } from "react";
import { LottieClip, StealthCycle } from "@/components/catalog/lottie-clip";
import { cn } from "@/lib/utils";

const CANNON_DELAY_MS = 700;
const STEALTH_DELAY_MS = 250;
/** Impact lands on the stealth ship after the shell leaves the cannon. */
const IMPACT_DELAY_MS = 1150;
/** Impact clip is 63 frames at 30fps. */
const IMPACT_DURATION_MS = Math.round((63 / 30) * 1000);
/** Command ship arrives after the stealth ship has taken the hit. */
const SHIP_DELAY_MS = 2600;
/** Wing decloaks only once that impact clip has finished. */
const WING_DELAY_MS = IMPACT_DELAY_MS + IMPACT_DURATION_MS;

/**
 * Three bombers inside the open square to the right of the Structs circle.
 * Same box as the ship taking the hit, noses left toward that ship.
 * Tops are section-relative; horizontal offsets are from the page center.
 */
const WING_SIZE = "h-[76px] w-[76px] md:h-[104px] md:w-[104px]";

const RIGHT_WING = [
  {
    className: `top-[400px] right-1 md:top-[448px] md:right-auto md:left-[calc(50%+130px)] ${WING_SIZE}`,
  },
  {
    className: `top-[460px] right-1 md:top-[488px] md:right-auto md:left-[calc(50%+328px)] ${WING_SIZE}`,
  },
  {
    className: `top-[720px] right-1 md:top-[760px] md:right-auto md:left-[calc(50%+160px)] ${WING_SIZE}`,
  },
] as const;

/**
 * Structs atmosphere.
 * Cannon sits left, under the Structs counter, and fires down-right.
 * The battleship comes out of stealth on the left, in front of the command ship, and takes the impact.
 * After the impact finishes, three matching bombers decloak once in the square on the right, facing left, then hold.
 * The command ship flies in behind the battleship and stays.
 */
export function StructsScene({ active }: { active: boolean }) {
  const [cannonHover, setCannonHover] = useState(false);
  const [stealthHover, setStealthHover] = useState(false);
  const [shipHover, setShipHover] = useState(false);
  const [wasActive, setWasActive] = useState(active);

  if (active !== wasActive) {
    setWasActive(active);
    if (!active) {
      setCannonHover(false);
      setStealthHover(false);
      setShipHover(false);
    }
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
              <div className={cn("h-full w-full", cannonHover && "structs-ship-hover")}>
                <LottieClip
                  src="/lottie/structs/canon_downwards"
                  className="h-full w-full"
                  loop={false}
                  opacity={0.95}
                  delayMs={CANNON_DELAY_MS}
                  onComplete={() => setCannonHover(true)}
                />
              </div>
            </FleetPiece>

            {/* Command ship flies in behind the battleship, then holds. */}
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

            {/* Battleship on the left, in front of the command ship, taking the hit. */}
            <FleetPiece
              className="top-[620px] left-1 z-10 h-[76px] w-[76px] md:top-[640px] md:left-4 md:h-[104px] md:w-[104px]"
              delayMs={STEALTH_DELAY_MS}
            >
              <div
                className={cn(
                  "relative h-full w-full",
                  stealthHover && "structs-ship-hover",
                )}
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
                <div
                  className="absolute -top-[18%] -left-[12%] h-[140%] w-[140%]"
                  style={{ transform: "translateY(72px)" }}
                >
                  <LottieClip
                    src="/lottie/structs/impact_angled_down_cannon"
                    className="h-full w-full"
                    loop={false}
                    opacity={1}
                    delayMs={IMPACT_DELAY_MS}
                    onComplete={() => setStealthHover(true)}
                  />
                </div>
              </div>
            </FleetPiece>

            {RIGHT_WING.map((ship) => (
              <WingBomber key={ship.className} className={ship.className} />
            ))}
          </>
        ) : null}
      </div>
    </div>
  );
}

function WingBomber({ className }: { className: string }) {
  const [hover, setHover] = useState(false);

  return (
    <FleetPiece className={className} delayMs={WING_DELAY_MS}>
      <div className={cn("h-full w-full", hover && "structs-ship-hover")}>
        <div className="h-full w-full" style={{ transform: "scaleX(-1)" }}>
          <StealthCycle
            className="h-full w-full"
            opacity={0.92}
            delayMs={WING_DELAY_MS}
            once
            onSettled={() => setHover(true)}
          />
        </div>
      </div>
    </FleetPiece>
  );
}

function FleetPiece({
  className,
  delayMs,
  drift,
  children,
}: {
  className?: string;
  delayMs: number;
  drift?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn("structs-fade-in pointer-events-none absolute", className)}
      style={{ animationDelay: `${delayMs}ms` }}
    >
      {drift ? <div className={cn("h-full w-full", drift)}>{children}</div> : children}
    </div>
  );
}
