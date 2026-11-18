"use client";

import { cn } from "@/lib/utils";
import { structsTokens } from "@/components/structs/tokens";

type StructsPrimaryButtonProps = React.ComponentPropsWithoutRef<"a"> & {
  href: string;
  children: React.ReactNode;
};

const { accentPrimary, accentPrimaryActive, surfaceDefault } = structsTokens;

const outline = (color: string) =>
  `-2px 0 0 0 ${color}, 2px 0 0 0 ${color}, 0 -2px 0 0 ${color}, 0 2px 0 0 ${color}`;

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
  onMouseEnter,
  onMouseLeave,
  ...props
}: StructsPrimaryButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      data-structs-button="primary"
      className={cn(className)}
      {...props}
      style={{ ...btnStyle, ...style }}
      onMouseEnter={(event) => {
        const face = event.currentTarget.querySelector<HTMLElement>("[data-face]");
        const label = event.currentTarget.querySelector<HTMLElement>("[data-label]");
        if (face) face.style.boxShadow = outline(accentPrimaryActive);
        if (label) label.style.color = accentPrimaryActive;
        onMouseEnter?.(event);
      }}
      onMouseLeave={(event) => {
        const face = event.currentTarget.querySelector<HTMLElement>("[data-face]");
        const label = event.currentTarget.querySelector<HTMLElement>("[data-label]");
        if (face) face.style.boxShadow = outline(accentPrimary);
        if (label) label.style.color = accentPrimary;
        onMouseLeave?.(event);
      }}
    >
      <span data-face style={faceStyle}>
        <span data-label style={labelStyle}>
          {children}
        </span>
      </span>
    </a>
  );
}
