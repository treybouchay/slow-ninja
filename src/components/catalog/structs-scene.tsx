"use client";

import { useState } from "react";
import { LottieClip, StealthCycle } from "@/components/catalog/lottie-clip";
import { cn } from "@/lib/utils";

const SHIP_DELAY_MS = 1000;

/**
 * Structs fleet, staggered so the field fills in like a live patrol.
 * The command ship arrives upper left after 1s, then the rest ease in around the planet.
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

            {/* Command ship — upper left, where the satellite sat. Arrives after 1s */}
            <FleetPiece
              className="top-[268px] left-[5%] h-[116px] w-[128px] max-lg:top-[248px] max-lg:left-2 max-lg:h-[96px] max-lg:w-[108px]"
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
                  className="h-[100px] w-[100px] md:h-[120px] md:w-[120px]"
                  loop={false}
                  opacity={0.92}
                  speed={0.95}
                  delayMs={SHIP_DELAY_MS}
                  onComplete={() => setShipHover(true)}
                />
              </div>
            </FleetPiece>

            {/* Distant jammer — high, left of the planet */}
            <FleetPiece
              className="top-[214px] left-[24%] h-[64px] w-[64px] max-md:hidden"
              delayMs={2200}
              drift="structs-float-c"
            >
              <LottieClip
                src="/lottie/structs/signal_jamming"
                className="h-full w-full"
                loop
                opacity={0.62}
                speed={0.75}
                delayMs={2200}
              />
            </FleetPiece>

            {/* Shield installation — lower left */}
            <FleetPiece
              className="top-[500px] left-[7%] h-[104px] w-[104px] max-md:hidden"
              delayMs={3400}
              drift="structs-float-a"
            >
              <LottieClip
                src="/lottie/structs/shield_generator/idle"
                className="h-full w-full"
                loop
                opacity={0.8}
                speed={0.7}
                delayMs={3400}
              />
            </FleetPiece>

            {/* Deployment craft — mid-right, in from the edge */}
            <FleetPiece
              className="top-[470px] right-[18%] h-[108px] w-[108px] max-md:hidden"
              delayMs={4800}
              drift="structs-float-b"
            >
              <LottieClip
                src="/lottie/structs/deployment_air"
                className="h-full w-full"
                loop
                opacity={0.78}
                speed={0.8}
                delayMs={4800}
              />
            </FleetPiece>

            {/* Stealth bomber — lower right, cloaks on its own beat */}
            <FleetPiece
              className="top-[600px] right-[6%] h-[96px] w-[96px] max-md:hidden"
              delayMs={6600}
              drift="structs-float-a"
            >
              <StealthCycle
                className="h-full w-full"
                opacity={0.74}
                delayMs={6600}
              />
            </FleetPiece>

            {/* Far flash — one shot, small, above the lane */}
            <FleetPiece
              className="top-[188px] right-[30%] h-[52px] w-[52px] max-md:hidden"
              delayMs={8600}
            >
              <LottieClip
                src="/lottie/structs/destroy_space"
                className="h-full w-full"
                loop={false}
                opacity={0.55}
                speed={0.85}
                delayMs={8600}
              />
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
      <div className={cn("h-full w-full", drift)}>{children}</div>
    </div>
  );
}
