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
 * Two bombers in the open square to the right of the Structs circle.
 * Same box as the ship taking the hit, noses left toward the cannon.
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
] as const;

/**
 * Open column left of the Structs circle. The battleship (cannon unit) sits at the top.
 * The bomber that takes the hit returns to the lower right of the circle.
 */
const BATTLESHIP = "top-[320px] left-4 z-10 h-[90px] w-[80px] md:top-[436px] md:left-[calc(50%-360px)] md:h-[100px] md:w-[90px]";
const BOMBER_HIT = `top-[720px] right-1 z-10 md:top-[760px] md:right-auto md:left-[calc(50%+160px)] ${WING_SIZE}`;

/** Fixed field so the sky does not reshuffle between renders. */
const STARS = makeStars(64);

/** Occasional streaks. Angle matches the travel vector so the head leads. */
const METEORS = [
  { id: "a", left: "6%", top: "10%", x: "320px", y: "180px", angle: "29deg", delay: "0.4s", duration: "9s" },
  { id: "b", left: "70%", top: "8%", x: "-280px", y: "160px", angle: "150deg", delay: "3.4s", duration: "11s" },
  { id: "c", left: "84%", top: "42%", x: "-240px", y: "130px", angle: "152deg", delay: "6.2s", duration: "10s" },
  { id: "d", left: "18%", top: "54%", x: "260px", y: "140px", angle: "28deg", delay: "8s", duration: "12.5s" },
] as const;

function makeStars(count: number) {
  let seed = 20261027;
  const next = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  return Array.from({ length: count }, (_, id) => {
    const roll = next();
    const size = roll > 0.88 ? 2.5 : roll > 0.62 ? 1.5 : 1;
    const tintRoll = next();
    return {
      id,
      left: `${(next() * 100).toFixed(2)}%`,
      top: `${(next() * 100).toFixed(2)}%`,
      size,
      twinkle: next() > 0.45,
      dim: (0.28 + next() * 0.35).toFixed(2),
      bright: (0.75 + next() * 0.25).toFixed(2),
      delay: `${(next() * 5).toFixed(2)}s`,
      duration: `${(2.6 + next() * 3.4).toFixed(2)}s`,
      tint:
        tintRoll > 0.84
          ? "color-mix(in oklab, var(--cyan) 70%, white)"
          : tintRoll > 0.72
            ? "color-mix(in oklab, var(--violet) 55%, white)"
            : "white",
      glow: size > 2,
    };
  });
}

/**
 * Structs atmosphere.
 * The battleship (cannon unit) sits at the top of the open column left of the circle and fires down-right.
 * The bomber taking that hit decloaks at the lower right of the circle.
 * After the impact finishes, two matching bombers decloak once above it, facing left, then hold.
 * The command ship flies in on the lower left and stays.
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
            <StructsSky />

            {/* Battleship at the top of the column left of the circle. Fires down-right. */}
            <FleetPiece className={BATTLESHIP} delayMs={CANNON_DELAY_MS}>
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

            {/* Command ship flies in on the lower left, then holds. */}
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

            {/* Bomber at the lower right of the circle, facing left, taking the hit. */}
            <FleetPiece className={BOMBER_HIT} delayMs={STEALTH_DELAY_MS}>
              <div
                className={cn(
                  "relative h-full w-full",
                  stealthHover && "structs-ship-hover",
                )}
              >
                <div className="h-full w-full" style={{ transform: "scaleX(-1)" }}>
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

function StructsSky() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {STARS.map((star) => (
        <span
          key={star.id}
          className={cn("absolute rounded-full", star.twinkle && "structs-star")}
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            background: star.tint,
            opacity: Number(star.twinkle ? star.bright : star.dim),
            animationDelay: star.delay,
            animationDuration: star.duration,
            ["--star-dim" as string]: star.dim,
            ["--star-bright" as string]: star.bright,
            boxShadow: star.glow ? `0 0 ${star.size * 2}px ${star.tint}` : undefined,
          }}
        />
      ))}
      {METEORS.map((meteor) => (
        <span
          key={meteor.id}
          className="structs-meteor absolute"
          style={{
            left: meteor.left,
            top: meteor.top,
            animationDelay: meteor.delay,
            animationDuration: meteor.duration,
            ["--meteor-x" as string]: meteor.x,
            ["--meteor-y" as string]: meteor.y,
            ["--meteor-angle" as string]: meteor.angle,
          }}
        />
      ))}
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
