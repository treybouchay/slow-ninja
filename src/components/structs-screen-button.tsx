import { cn } from "@/lib/utils";

type StructsScreenButtonProps = React.ComponentPropsWithoutRef<"a"> & {
  href: string;
  children: React.ReactNode;
};

/**
 * Structs Design System — Screen Button / Primary
 * Figma: zCYgKFmyToGXCrunrH8tGY · node 2300:416294
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
      <span className="structs-screen-btn__face">
        <span className="structs-screen-btn__label">{children}</span>
      </span>
    </a>
  );
}
