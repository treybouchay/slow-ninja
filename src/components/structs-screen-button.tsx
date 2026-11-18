import { cn } from "@/lib/utils";

type StructsScreenButtonProps = React.ComponentPropsWithoutRef<"a"> & {
  href: string;
  children: React.ReactNode;
};

/** Compact Structs DS command button (pre–Screen Button width). */
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
      className={cn("structs-command-btn", className)}
      {...props}
    >
      {children}
    </a>
  );
}
