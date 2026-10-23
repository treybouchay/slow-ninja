"use client";

import { LottieClip } from "@/components/catalog/lottie-clip";
import { cn } from "@/lib/utils";

const CANNON_DELAY_MS = 700;

/**
 * Structs atmosphere — cannon appears upper left and plays its downward shot once.
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

            {/* Cannon sits where the command ship was and fires downward. */}
            <FleetPiece
              className="top-[268px] left-[5%] h-[100px] w-[90px] max-lg:top-[248px] max-lg:left-2 max-lg:h-[90px] max-lg:w-[80px]"
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
