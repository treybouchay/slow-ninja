import { cn } from "@/lib/utils";
import styles from "./structs-screen-button.module.css";

type StructsScreenButtonProps = React.ComponentPropsWithoutRef<"a"> & {
  href: string;
  children: React.ReactNode;
};

/**
 * Structs Design System — Screen Button / Primary
 * Figma: zCYgKFmyToGXCrunrH8tGY · node 2300:416294
 *
 * Styles live in a CSS module so Turbopack/Tailwind cannot drop them from
 * globals.css after HMR (that was causing the correct → plain-text flash).
 */
export function StructsScreenButton({
  href,
  children,
  className,
  ...props
}: StructsScreenButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={cn(styles.btn, className)}
      {...props}
    >
      <span className={styles.face}>
        <span className={styles.label}>{children}</span>
      </span>
    </a>
  );
}
