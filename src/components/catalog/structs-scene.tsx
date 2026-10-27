"use client";

import { useRef, useState, type CSSProperties } from "react";
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
 * Two identical 2×2 grids, one on each side of the circle.
 * Column 2 on the left and column 1 on the right are the inner files, so those
 * units sit on the same rows and face each other.
 */
const WINGS = [
  { id: "inner", column: 1, row: 1 },
  { id: "outer", column: 2, row: 1 },
] as const;

const FLANK_EDGE = "calc(50% + clamp(84px, 9vw, 132px))";

function flankStyle(side: "left" | "right"): CSSProperties {
  return {
    position: "absolute",
    top: 488,
    width: "clamp(156px, 40vw, 280px)",
    height: "clamp(156px, 40vw, 280px)",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gridTemplateRows: "1fr 1fr",
    pointerEvents: "none",
    ...(side === "left" ? { right: FLANK_EDGE } : { left: FLANK_EDGE }),
  };
}

const UNIT = "relative h-[68px] w-[68px] md:h-[104px] md:w-[104px]";

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
 * Each side has the same invisible 2×2 grid. The battleship faces the inner bomber,
 * and the command ship faces the bomber taking the hit.
 * After the impact finishes, the right-hand bombers decloak once, facing left, then hold.
 */
export function StructsScene({ active }: { active: boolean }) {
  const [cannonHover, setCannonHover] = useState(false);
  const [stealthHover, setStealthHover] = useState(false);
  const [shipHover, setShipHover] = useState(false);
  const [settledWings, setSettledWings] = useState(0);
  const [wasActive, setWasActive] = useState(active);

  if (active !== wasActive) {
    setWasActive(active);
    if (!active) {
      setCannonHover(false);
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
            <StructsSky meteors={settledWings >= WINGS.length} />

            <div style={flankStyle("left")}>
              <FleetPiece column={2} row={1} delayMs={CANNON_DELAY_MS}>
                <div className={cn(UNIT, cannonHover && "structs-ship-hover")}>
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

              <FleetPiece column={2} row={2} delayMs={SHIP_DELAY_MS}>
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

            <div style={flankStyle("right")}>
              <FleetPiece column={1} row={2} delayMs={STEALTH_DELAY_MS} className="z-10">
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

              {WINGS.map((ship) => (
                <WingBomber
                  key={ship.id}
                  column={ship.column}
                  row={ship.row}
                  onDone={() => setSettledWings((count) => count + 1)}
                />
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

function WingBomber({
  column,
  row,
  onDone,
}: {
  column: number;
  row: number;
  onDone: () => void;
}) {
  const [hover, setHover] = useState(false);
  const reported = useRef(false);

  return (
    <FleetPiece column={column} row={row} delayMs={WING_DELAY_MS}>
      <div className={cn(UNIT, hover && "structs-ship-hover")}>
        <div className="h-full w-full" style={{ transform: "scaleX(-1)" }}>
          <StealthCycle
            className="h-full w-full"
            opacity={0.92}
            delayMs={WING_DELAY_MS}
            once
            onSettled={() => {
              setHover(true);
              if (reported.current) return;
              reported.current = true;
              onDone();
            }}
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
