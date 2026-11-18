"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { structsTokens } from "@/components/structs/tokens";

type StructsPrimaryButtonProps = React.ComponentPropsWithoutRef<"a"> & {
  href: string;
  children: React.ReactNode;
  /** Soft opacity flash after the button appears. */
  flash?: boolean;
};

const { accentPrimary, accentPrimaryActive, surfaceDefault } = structsTokens;

const outline = (color: string) =>
  `-2px 0 0 0 ${color}, 2px 0 0 0 ${color}, 0 -2px 0 0 ${color}, 0 2px 0 0 ${color}`;

const FLASH_MS = 1600;
const FLASH_OPACITY_MIN = 0.35;
const FLASH_OPACITY_MAX = 1;

const btnStyle: React.CSSProperties = {
  boxSizing: "border-box",
  display: "inline-flex",
  width: 256,
  maxWidth: "calc(100vw - 2rem)",
  flexDirection: "column",
  alignItems: "stretch",
  padding: 2,
  border: 0,
  borderRadius: 0,
  background: "transparent",
  color: accentPrimary,
  textDecoration: "none",
  cursor: "pointer",
};

const faceStyle: React.CSSProperties = {
  boxSizing: "border-box",
  display: "flex",
  width: "100%",
  minHeight: 36,
  flexShrink: 0,
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  overflow: "hidden",
  padding: "4px 12px",
  borderRadius: 0,
  background: surfaceDefault,
  boxShadow: outline(accentPrimary),
};

const labelStyle: React.CSSProperties = {
  flex: "1 0 0",
  minWidth: 1,
  color: accentPrimary,
  fontFamily:
    "var(--font-extreme-hazard), ExtremeHazard, ui-monospace, monospace",
  fontSize: 8,
  fontWeight: 500,
  fontStyle: "normal",
  lineHeight: "16px",
  letterSpacing: 0,
  textAlign: "center",
  textTransform: "uppercase",
  WebkitFontSmoothing: "none",
};

/**
 * Primary Structs game button (Screen Button / Primary).
 *
 * Figma: https://www.figma.com/design/zCYgKFmyToGXCrunrH8tGY/Structs-Design-System?node-id=2300-416294
 *
 * Use this for Structs CTAs (e.g. Play Structs). Styles are inline so they
 * cannot be dropped by CSS/HMR after load.
 */
export function StructsPrimaryButton({
  href,
  children,
  className,
  style,
  flash = false,
  onMouseEnter,
  onMouseLeave,
  ...props
}: StructsPrimaryButtonProps) {
  const rootRef = useRef<HTMLAnchorElement>(null);
  const faceRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const hoveringRef = useRef(false);

  const paintAccent = (color: string) => {
    if (faceRef.current) faceRef.current.style.boxShadow = outline(color);
    if (labelRef.current) labelRef.current.style.color = color;
  };

  useEffect(() => {
    if (!flash) return;
    const root = rootRef.current;
    if (!root) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      if (!hoveringRef.current) {
        const phase = ((now - start) % FLASH_MS) / FLASH_MS;
        const t = 0.5 - 0.5 * Math.cos(phase * Math.PI * 2);
        root.style.opacity =
          String(FLASH_OPACITY_MIN + (FLASH_OPACITY_MAX - FLASH_OPACITY_MIN) * t);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      root.style.opacity = "1";
    };
  }, [flash]);

  return (
    <a
      ref={rootRef}
      href={href}
      target="_blank"
      rel="noreferrer"
      data-structs-button="primary"
      data-flash={flash ? "" : undefined}
      className={cn(className)}
      {...props}
      style={{ ...btnStyle, ...style }}
      onMouseEnter={(event) => {
        hoveringRef.current = true;
        if (rootRef.current) rootRef.current.style.opacity = "1";
        paintAccent(accentPrimaryActive);
        onMouseEnter?.(event);
      }}
      onMouseLeave={(event) => {
        hoveringRef.current = false;
        paintAccent(accentPrimary);
        onMouseLeave?.(event);
      }}
    >
      <span data-face ref={faceRef} style={faceStyle}>
        <span data-label ref={labelRef} style={labelStyle}>
          {children}
        </span>
      </span>
    </a>
  );
}
