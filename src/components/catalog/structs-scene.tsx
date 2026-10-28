"use client";

import Image from "next/image";
import { useEffect, useState, useSyncExternalStore, type CSSProperties } from "react";
import { LottieClip } from "@/components/catalog/lottie-clip";
import { cn } from "@/lib/utils";

const CANNON_DELAY_MS = 700;
const STEALTH_DELAY_MS = 250;
/** Impact lands on the stealth ship after the shell leaves the cannon. */
const IMPACT_DELAY_MS = 1150;
/** Command ship arrives after the stealth ship has taken the hit. */
const SHIP_DELAY_MS = 2600;
/** Fade length used by the fleet pieces. The spare bombers share the command ship's entrance. */
const FADE_MS = 900;

/**
 * Wide windows drop the outer ship column and open a gap the width of one
 * column between the remaining units and the circle. The lane slot grows
 * with that gap so the ships stay clear of the next world.
 */
export const WIDE_FLEET_QUERY = "(min-width: 1000px)";
/** Desktop spacing that clears one ship column plus a column of empty room. */
export const SLOT_WIDE = 372;

export function useWideFleet() {
  return useSyncExternalStore(
    (notify) => {
      const query = window.matchMedia(WIDE_FLEET_QUERY);
      query.addEventListener("change", notify);
      return () => query.removeEventListener("change", notify);
    },
    () => window.matchMedia(WIDE_FLEET_QUERY).matches,
    () => false,
  );
}

/**
 * One column on each side: battleship, battleship, command — and bomber,
 * bomber, the ship taking the hit. Wide screens keep that column and add a
 * ship-width of space between it and the circle, the same on both sides.
 */
const UNIT = "relative h-full w-full";
const INNER_WINGS = [
  { id: "top", row: 1 },
  { id: "middle", row: 2 },
] as const;

/** Ship is 0.81 of the circle radius, matching the phone column beside a 148px circle. */
const SHIP = "calc(var(--structs-r, 74px) * 0.81)";

function flankStyle(side: "left" | "right", spaced: boolean): CSSProperties {
  // 1.16 is a small pad. Wide screens add one ship (0.81) so the gap matches a column.
  const inset = spaced ? "1.97" : "1.16";
  return {
    position: "absolute",
    top: "calc(var(--structs-cy, 596px) - var(--structs-r, 74px) * 1.215)",
    width: SHIP,
    height: `calc(${SHIP} * 3)`,
    display: "grid",
    gridTemplateColumns: SHIP,
    gridTemplateRows: `repeat(3, ${SHIP})`,
    pointerEvents: "none",
    ...(side === "left"
      ? { right: `calc(100% - (var(--structs-cx, 50%) - var(--structs-r, 74px) * ${inset}))` }
      : { left: `calc(var(--structs-cx, 50%) + var(--structs-r, 74px) * ${inset})` }),
  };
}

/** A few fixed stars so the sky does not reshuffle between renders. */
const STARS = makeStars(16, 20261027);
/** Stationary glints. They stay put and flare in place. */
const SPARKLES = makeStars(22, 8675309);

/**
 * Two streaks, well apart. They mount only after the fleet clips have finished,
 * so these delays are measured from that moment, not from when Structs appears.
 * The flight itself is the first 6% of the cycle, about a second.
 */
const METEORS = [
  { id: "a", left: "8%", top: "12%", x: "460px", y: "250px", angle: "29deg", delay: "0.8s", duration: "16s" },
  { id: "b", left: "78%", top: "16%", x: "-420px", y: "230px", angle: "151deg", delay: "9s", duration: "18s" },
] as const;

function makeStars(count: number, start: number) {
  let seed = start;
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
      twinkle: true,
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
 * The inner column is two battleships over the command ship. The bomber taking
 * the hit sits on the bottom row. Only the top battleship beside the circle
 * fires; the others fade in and float. The bombers that are not being hit
 * fade in with the command ship. Wide windows keep a single column and
 * leave a ship-width of space on both sides of the circle.
 */
export function StructsScene({ active }: { active: boolean }) {
  const [stealthHover, setStealthHover] = useState(false);
  const [shipHover, setShipHover] = useState(false);
  const [settledWings, setSettledWings] = useState(0);
  const [wasActive, setWasActive] = useState(active);
  const wide = useWideFleet();
  const wingCount = INNER_WINGS.length;

  useEffect(() => {
    if (!active) return;
    const timer = window.setTimeout(() => setSettledWings(wingCount), SHIP_DELAY_MS + FADE_MS);
    return () => window.clearTimeout(timer);
  }, [active, wingCount]);

  if (active !== wasActive) {
    setWasActive(active);
    if (!active) {
      setStealthHover(false);
      setShipHover(false);
      setSettledWings(0);
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
            <StructsSky meteors={settledWings >= wingCount} />

            <div style={flankStyle("left", wide)}>
              <Battleship column={1} row={1} />
              <Battleship column={1} row={2} still />
              <FleetPiece column={1} row={3} delayMs={SHIP_DELAY_MS}>
                <div className={cn(UNIT, "flex items-center justify-center", shipHover && "structs-ship-hover")}>
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
            </div>

            <div style={flankStyle("right", wide)}>
              <FleetPiece column={1} row={3} delayMs={STEALTH_DELAY_MS} className="z-10">
                <div className={cn(UNIT, stealthHover && "structs-ship-hover")}>
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

              {INNER_WINGS.map((ship) => (
                <StillBomber key={ship.id} column={1} row={ship.row} />
              ))}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

function StructsSky({ meteors }: { meteors: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {SPARKLES.map((star) => (
        <span
          key={`spark-${star.id}`}
          className="structs-sparkle absolute"
          style={{
            left: star.left,
            top: star.top,
            animationDelay: star.delay,
            animationDuration: `${(3.4 + Number(star.dim) * 3).toFixed(2)}s`,
            opacity: 0.4,
          }}
        >
          <span className="structs-sparkle-arm" />
          <span className="structs-sparkle-arm structs-sparkle-arm-y" />
        </span>
      ))}
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
      {meteors
        ? METEORS.map((meteor) => (
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
          ))
        : null}
    </div>
  );
}

const BATTLESHIP_STILL = "/lottie/structs/canon_downwards/images/img_0.png";
/** Last frame of the decloak clip: the bomber in the open, facing the battleships once flipped. */
const BOMBER_STILL = "/lottie/structs/stealth_deactivate/images/img_9.png";

function Battleship({
  column,
  row,
  still = false,
}: {
  column: number;
  row: number;
  /** Hold the resting frame and float. The top ship beside the circle still fires. */
  still?: boolean;
}) {
  const [hover, setHover] = useState(still);

  return (
    <FleetPiece column={column} row={row} delayMs={still ? 0 : CANNON_DELAY_MS}>
      <div className={cn(UNIT, hover && "structs-ship-hover")}>
        {still ? (
          <Image
            src={BATTLESHIP_STILL}
            alt=""
            width={128}
            height={128}
            unoptimized
            draggable={false}
            className="h-full w-full object-contain"
            style={{ opacity: 0.95 }}
          />
        ) : (
          <LottieClip
            src="/lottie/structs/canon_downwards"
            className="h-full w-full"
            loop={false}
            opacity={0.95}
            delayMs={CANNON_DELAY_MS}
            onComplete={() => setHover(true)}
          />
        )}
      </div>
    </FleetPiece>
  );
}

function StillBomber({ column, row }: { column: number; row: number }) {
  return (
    <FleetPiece column={column} row={row} delayMs={SHIP_DELAY_MS}>
      <div className={cn(UNIT, "structs-ship-hover")}>
        <div className="h-full w-full" style={{ transform: "scaleX(-1)" }}>
          <Image
            src={BOMBER_STILL}
            alt=""
            width={128}
            height={128}
            unoptimized
            draggable={false}
            className="h-full w-full object-contain"
            style={{ opacity: 0.92 }}
          />
        </div>
      </div>
    </FleetPiece>
  );
}

function FleetPiece({
  column,
  row,
  className,
  delayMs,
  children,
}: {
  column: number;
  row: number;
  className?: string;
  delayMs: number;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn("structs-fade-in pointer-events-none flex items-center justify-center", className)}
      style={{ gridColumn: column, gridRow: row, animationDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
  );
}
