import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  priority?: boolean;
  href?: string | null;
  size?: "nav" | "hero" | "footer";
};

const sizes = {
  nav: { width: 120, height: 69, className: "h-10 w-auto md:h-11" },
  hero: { width: 420, height: 242, className: "h-auto w-[min(100%,22rem)] md:w-[28rem]" },
  footer: { width: 160, height: 92, className: "h-12 w-auto" },
};

export function BrandLogo({
  className,
  priority = false,
  href = "/",
  size = "nav",
}: BrandLogoProps) {
  const dims = sizes[size];
  const image = (
    <Image
      src="/slow-ninja-logo.png"
      alt="Slow Ninja"
      width={dims.width}
      height={dims.height}
      priority={priority}
      className={cn(dims.className, "object-contain", className)}
    />
  );

  if (href === null) return image;

  return (
    <Link href={href} className="inline-flex items-center" aria-label="Slow Ninja home">
      {image}
    </Link>
  );
}
