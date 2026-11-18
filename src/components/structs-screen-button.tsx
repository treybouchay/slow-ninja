import { cn } from "@/lib/utils";

type StructsScreenButtonProps = React.ComponentPropsWithoutRef<"a"> & {
  href: string;
  children: React.ReactNode;
};

/**
 * Structs Design System — Screen Button / Primary
 * Figma: zCYgKFmyToGXCrunrH8tGY · 2300:416294 (label 2300:416297)
 * Matches structs-webapp `.sui-screen-btn.sui-mod-primary` + ExtremeHazard.
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
      className={cn("structs-screen-btn", className)}
      {...props}
    >
      {children}
    </a>
  );
}
