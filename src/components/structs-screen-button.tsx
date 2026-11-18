import { cn } from "@/lib/utils";

type StructsScreenButtonProps = React.ComponentPropsWithoutRef<"a"> & {
  href: string;
  children: React.ReactNode;
};

/** Visible Play Structs CTA — original lime pill style. */
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
      className={cn(
        "btn-bounce inline-flex rounded-full bg-[var(--lime)] px-6 py-3.5 text-sm font-bold text-[var(--ink)] shadow-[4px_4px_0_var(--cyan)]",
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}
