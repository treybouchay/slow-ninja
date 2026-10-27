"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/brand-logo";
import { cn } from "@/lib/utils";

const links = [
  { href: "/#games", label: "Games" },
  { href: "/#studio", label: "Studio" },
  { href: "/team", label: "Team" },
  { href: "/journal", label: "Journal" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 px-4 pt-3 md:px-6 md:pt-4">
      <div
        className={cn(
          "mx-auto flex max-w-6xl items-center justify-between gap-4 py-2 pr-2 pl-8 transition-all duration-300 md:pr-3 md:pl-12",
          scrolled
            ? "rounded-full border border-white/10 bg-[#070d16]/55 shadow-[0_8px_30px_rgba(0,0,0,0.25)] backdrop-blur-md"
            : "border border-transparent bg-transparent",
        )}
      >
        <BrandLogo size="nav" priority />

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => {
            const active =
              !link.href.includes("#") &&
              (pathname === link.href || pathname.startsWith(`${link.href}/`));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-3 py-2 text-sm font-semibold transition-colors",
                  active
                    ? "text-[var(--lime)]"
                    : "text-white/65 hover:text-white",
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <a
            href="https://www.playstructs.com/"
            target="_blank"
            rel="noreferrer"
            className="btn-bounce ml-2 rounded-full bg-[var(--lime)] px-4 py-2 text-sm font-bold text-[var(--ink)] shadow-[3px_3px_0_var(--cyan)]"
          >
            Launch Structs
          </a>
        </nav>

        <button
          type="button"
          className="rounded-full bg-[var(--lime)] px-4 py-2 text-sm font-bold text-[var(--ink)] md:hidden"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open ? (
        <nav className="mx-auto mt-2 flex max-w-6xl flex-col gap-2 rounded-2xl border border-white/10 bg-[#070d16]/90 p-4 backdrop-blur-md md:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3 font-semibold text-white hover:bg-white/10"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://www.playstructs.com/"
            target="_blank"
            rel="noreferrer"
            className="rounded-xl bg-[var(--lime)] px-4 py-3 text-center font-bold text-[var(--ink)]"
          >
            Launch Structs
          </a>
        </nav>
      ) : null}
    </header>
  );
}
