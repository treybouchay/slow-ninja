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
  nav: { width: 128, height: 96, className: "h-8 w-auto md:h-9" },
  hero: { width: 128, height: 96, className: "h-auto w-[min(100%,11rem)] md:w-[13rem]" },
  footer: { width: 128, height: 96, className: "h-10 w-auto" },
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
      className={cn(
        dims.className,
        "object-contain [image-rendering:pixelated]",
        className,
      )}
    />
  );

  if (href === null) return image;

  return (
    <Link href={href} className="inline-flex items-center" aria-label="Slow Ninja home">
      {image}
    </Link>
  );
}
