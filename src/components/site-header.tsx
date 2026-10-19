"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BrandLogo } from "@/components/brand-logo";
import { cn } from "@/lib/utils";

const links = [
  { href: "/#games", label: "Games" },
  { href: "/#studio", label: "Studio" },
  { href: "/journal", label: "Journal" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 px-4 pt-4 md:px-6">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-full border border-[var(--ink)]/15 bg-[var(--night)]/90 px-4 py-2.5 shadow-[0_8px_30px_rgba(11,18,32,0.25)] backdrop-blur-xl md:px-5">
        <BrandLogo size="nav" priority />

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => {
            const active =
              link.href === "/journal" && pathname.startsWith("/journal");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                  active
                    ? "bg-[var(--lime)] text-[var(--ink)]"
                    : "text-white/70 hover:bg-white/10 hover:text-white",
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
        <nav className="mx-auto mt-2 flex max-w-6xl flex-col gap-2 rounded-3xl border border-white/10 bg-[var(--night)] p-4 shadow-lg md:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-2xl px-4 py-3 font-semibold text-white hover:bg-white/10"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://www.playstructs.com/"
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl bg-[var(--lime)] px-4 py-3 text-center font-bold text-[var(--ink)]"
          >
            Launch Structs
          </a>
        </nav>
      ) : null}
    </header>
  );
}
