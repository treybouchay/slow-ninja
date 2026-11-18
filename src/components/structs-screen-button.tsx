import { cn } from "@/lib/utils";

type StructsScreenButtonProps = React.ComponentPropsWithoutRef<"a"> & {
  href: string;
  children: React.ReactNode;
};

const ACCENT = "#43cdb6";
const ACCENT_HOVER = "#c2efdd";
const SURFACE = "#222034";

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
  color: ACCENT,
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
  background: SURFACE,
  // Cyan outline — Figma Screen Button Primary (2300:416294)
  boxShadow: `-2px 0 0 0 ${ACCENT}, 2px 0 0 0 ${ACCENT}, 0 -2px 0 0 ${ACCENT}, 0 2px 0 0 ${ACCENT}`,
};

const labelStyle: React.CSSProperties = {
  flex: "1 0 0",
  minWidth: 1,
  color: ACCENT,
  fontFamily: "var(--font-extreme-hazard), ExtremeHazard, ui-monospace, monospace",
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
 * Structs Design System — Screen Button / Primary
 * Figma: zCYgKFmyToGXCrunrH8tGY · node 2300:416294
 *
 * Visual styles are inline on purpose. Class-based CSS was getting dropped
 * after client load (cyan button → plain white text).
 */
export function StructsScreenButton({
  href,
  children,
  className,
  style,
  onMouseEnter,
  onMouseLeave,
  ...props
}: StructsScreenButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={cn(className)}
      style={{ ...btnStyle, ...style }}
      onMouseEnter={(event) => {
        const face = event.currentTarget.querySelector<HTMLElement>("[data-face]");
        const label = event.currentTarget.querySelector<HTMLElement>("[data-label]");
        if (face) {
          face.style.boxShadow = `-2px 0 0 0 ${ACCENT_HOVER}, 2px 0 0 0 ${ACCENT_HOVER}, 0 -2px 0 0 ${ACCENT_HOVER}, 0 2px 0 0 ${ACCENT_HOVER}`;
        }
        if (label) label.style.color = ACCENT_HOVER;
        onMouseEnter?.(event);
      }}
      onMouseLeave={(event) => {
        const face = event.currentTarget.querySelector<HTMLElement>("[data-face]");
        const label = event.currentTarget.querySelector<HTMLElement>("[data-label]");
        if (face) {
          face.style.boxShadow = `-2px 0 0 0 ${ACCENT}, 2px 0 0 0 ${ACCENT}, 0 -2px 0 0 ${ACCENT}, 0 2px 0 0 ${ACCENT}`;
        }
        if (label) label.style.color = ACCENT;
        onMouseLeave?.(event);
      }}
      {...props}
    >
      <span data-face style={faceStyle}>
        <span data-label style={labelStyle}>
          {children}
        </span>
      </span>
    </a>
  );
}
