"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { CommandDialog } from "@/components/catalog/command-dialog";
import { LottieClip, StealthCycle } from "@/components/catalog/lottie-clip";
import { cn } from "@/lib/utils";

/** Matches the fleet fade, so the next ship starts once this one is on screen. */
const FADE_MS = 900;
const BATTLESHIP_LEAD_MS = 400;
/** Shell travel after the cannon clip starts. */
const IMPACT_AFTER_CANNON_MS = 450;
/** destroy_air is 39 frames at 30fps. The bomber leaves a quarter of the way in. */
const DESTROY_AIR_MS = 1300;
/** The command line is up for three seconds and leaves before the next wave. */
const DIALOG_MS = 3000;
const DIALOG_OUT_MS = 600;

const STEP = {
  battleship: 0,
  bomber: 1,
  cannon: 2,
  second: 4,
  command: 5,
  wingTop: 6,
  wingMiddle: 7,
  replacement: 8,
  done: 9,
} as const;

/**
 * One column on each side: battleship, battleship, command — and bomber,
 * bomber, the ship taking the hit. A small pad sits between the column and
 * the circle, the same on both sides.
 */
const UNIT = "relative h-full w-full";

/** Ship is 0.81 of the circle radius, matching the phone column beside a 148px circle. */
const SHIP = "calc(var(--structs-r, 74px) * 0.81)";

function flankStyle(side: "left" | "right"): CSSProperties {
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
      ? { right: "calc(100% - (var(--structs-cx, 50%) - var(--structs-r, 74px) * 1.16))" }
      : { left: "calc(var(--structs-cx, 50%) + var(--structs-r, 74px) * 1.16)" }),
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
 * The firing battleship appears, then the bomber plays stealth. The cannon
 * fires, the impact lands, and destroy_air plays out. The bomber leaves a
 * quarter of the way through that clip. When the blast finishes, the command
 * dialog plays, and then reinforcements arrive in order: the second
 * battleship, the command ship, the two spare bombers, and a new stealth
 * bomber in the empty slot. Each bomber hovers once its stealth clip settles.
 */
export function StructsScene({ active }: { active: boolean }) {
  const [meteors, setMeteors] = useState(false);
  const [wasActive, setWasActive] = useState(active);

  if (active !== wasActive) {
    setWasActive(active);
    if (!active) setMeteors(false);
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
            <StructsSky meteors={meteors} />
            <StructsFleet onSettled={() => setMeteors(true)} />
          </>
        ) : null}
      </div>
    </div>
  );
}

function StructsFleet({ onSettled }: { onSettled: () => void }) {
  const [step, setStep] = useState<number>(STEP.battleship);
  const [openingDone, setOpeningDone] = useState(false);
  const [dialogDone, setDialogDone] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setStep(STEP.bomber), BATTLESHIP_LEAD_MS + FADE_MS);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!openingDone || !dialogDone) return;
    setStep((current) => (current < STEP.second ? STEP.second : current));
  }, [openingDone, dialogDone]);

  const advance = (next: number) => {
    setStep((current) => (current < next ? next : current));
  };

  return (
    <div className="absolute inset-0" data-fleet-step={step}>
      <ReinforcementsDialog play={openingDone} onDone={setDialogDone} />

      <div style={flankStyle("left")}>
        <FiringBattleship firing={step >= STEP.cannon} />
        {step >= STEP.second ? <RestingBattleship onDone={() => advance(STEP.command)} /> : null}
        {step >= STEP.command ? <CommandShip onDone={() => advance(STEP.wingTop)} /> : null}
      </div>

      <div style={flankStyle("right")}>
        {step >= STEP.replacement ? (
          <HoverBomber row={3} onDone={() => {
            advance(STEP.done);
            onSettled();
          }} />
        ) : step >= STEP.bomber ? (
          <StruckBomber
            cannon={step >= STEP.cannon}
            onStealthDone={() => advance(STEP.cannon)}
            onDestroyDone={() => setOpeningDone(true)}
          />
        ) : null}
        {step >= STEP.wingTop ? <HoverBomber row={1} onDone={() => advance(STEP.wingMiddle)} /> : null}
        {step >= STEP.wingMiddle ? <HoverBomber row={2} onDone={() => advance(STEP.replacement)} /> : null}
      </div>
    </div>
  );
}

function ReinforcementsDialog({ play, onDone }: { play: boolean; onDone: (done: boolean) => void }) {
  const [phase, setPhase] = useState<"wait" | "in" | "out">("wait");
  const [host, setHost] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setHost(document.getElementById("games"));
  }, []);

  useEffect(() => {
    if (!play) return;
    setPhase("in");
    const out = window.setTimeout(() => setPhase("out"), DIALOG_MS - DIALOG_OUT_MS);
    const hide = window.setTimeout(() => {
      setPhase("wait");
      onDone(true);
    }, DIALOG_MS);
    return () => {
      window.clearTimeout(out);
      window.clearTimeout(hide);
    };
  }, [play, onDone]);

  if (phase === "wait" || !host) return null;

  return createPortal(
    <div
      className={cn(
        "pointer-events-none absolute left-1/2 z-30 w-[315px] max-w-[calc(100%-2rem)]",
        phase === "out" ? "command-dialog-out" : "command-dialog-rise",
      )}
      style={{ top: "var(--dialog-anchor, 720px)" }}
      role="status"
    >
      <CommandDialog message="Reinforcements have arrived" />
    </div>,
    host,
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

function FiringBattleship({ firing }: { firing: boolean }) {
  const [hover, setHover] = useState(false);

  return (
    <FleetPiece column={1} row={1} delayMs={BATTLESHIP_LEAD_MS}>
      <div className={cn(UNIT, hover && "structs-ship-hover")}>
        {firing ? (
          <LottieClip
            src="/lottie/structs/canon_downwards"
            className="h-full w-full"
            loop={false}
            opacity={0.95}
            onComplete={() => setHover(true)}
          />
        ) : (
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
        )}
      </div>
    </FleetPiece>
  );
}

function RestingBattleship({ onDone }: { onDone: () => void }) {
  const done = useRef(onDone);
  done.current = onDone;

  useEffect(() => {
    const timer = window.setTimeout(() => done.current(), FADE_MS);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <FleetPiece column={1} row={2} delayMs={0}>
      <div className={cn(UNIT, "structs-ship-hover")}>
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
      </div>
    </FleetPiece>
  );
}

function CommandShip({ onDone }: { onDone: () => void }) {
  const [hover, setHover] = useState(false);

  return (
    <FleetPiece column={1} row={3} delayMs={0}>
      <div className={cn(UNIT, "flex items-center justify-center", hover && "structs-ship-hover")}>
        <LottieClip
          src="/lottie/structs/move_arrive"
          className="h-full w-full"
          loop={false}
          opacity={0.92}
          speed={0.95}
          onComplete={() => {
            setHover(true);
            onDone();
          }}
        />
      </div>
    </FleetPiece>
  );
}

function StruckBomber({
  cannon,
  onStealthDone,
  onDestroyDone,
}: {
  cannon: boolean;
  onStealthDone: () => void;
  onDestroyDone: () => void;
}) {
  const [destroying, setDestroying] = useState(false);
  const [shipGone, setShipGone] = useState(false);

  useEffect(() => {
    if (!destroying) return;
    const timer = window.setTimeout(() => setShipGone(true), DESTROY_AIR_MS / 4);
    return () => window.clearTimeout(timer);
  }, [destroying]);

  return (
    <FleetPiece column={1} row={3} delayMs={0} className="z-10" data-bomber={shipGone ? "gone" : "live"}>
      <div className={UNIT}>
        <div className="h-full w-full" style={{ transform: "scaleX(-1)", opacity: shipGone ? 0 : 0.95 }}>
          <StealthCycle className="h-full w-full" once opacity={1} onSettled={onStealthDone} />
        </div>
        {cannon ? (
          <div
            className="absolute -top-[18%] -left-[12%] h-[140%] w-[140%]"
            style={{ opacity: destroying ? 0 : 1 }}
          >
            <LottieClip
              src="/lottie/structs/impact_angled_down_cannon"
              className="h-full w-full"
              loop={false}
              opacity={1}
              delayMs={IMPACT_AFTER_CANNON_MS}
              onComplete={() => setDestroying(true)}
            />
          </div>
        ) : null}
        {destroying ? (
          <div className="absolute inset-0">
            <LottieClip
              src="/lottie/structs/destroy_air"
              className="h-full w-full"
              loop={false}
              opacity={1}
              onComplete={onDestroyDone}
            />
          </div>
        ) : null}
      </div>
    </FleetPiece>
  );
}

function HoverBomber({ row, onDone }: { row: number; onDone: () => void }) {
  const [hover, setHover] = useState(false);

  return (
    <FleetPiece column={1} row={row} delayMs={0} data-bomber="back">
      <div className={cn(UNIT, hover && "structs-ship-hover")}>
        <div className="h-full w-full" style={{ transform: "scaleX(-1)" }}>
          <StealthCycle
            className="h-full w-full"
            once
            opacity={0.95}
            onSettled={() => {
              setHover(true);
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
  ...data
}: {
  column: number;
  row: number;
  className?: string;
  delayMs: number;
  children: React.ReactNode;
  "data-bomber"?: string;
}) {
  return (
    <div
      className={cn("structs-fade-in pointer-events-none flex items-center justify-center", className)}
      style={{ gridColumn: column, gridRow: row, animationDelay: `${delayMs}ms` }}
      {...data}
    >
      {children}
    </div>
  );
}
