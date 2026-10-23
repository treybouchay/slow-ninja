"use client";

import { useState } from "react";
import { LottieClip } from "@/components/catalog/lottie-clip";
import { cn } from "@/lib/utils";

const SHIP_DELAY_MS = 1000;

/**
 * Structs atmosphere — command ship arrives upper left after 1s, then hovers.
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
