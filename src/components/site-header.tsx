"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/games", label: "Games" },
  { href: "/journal", label: "Journal" },
  { href: "/studio", label: "Studio" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="relative z-50 border-b border-[var(--line)] bg-[color-mix(in_oklab,var(--ink)_82%,transparent)] backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-4 md:px-8">
        <Link
          href="/"
          className="font-[family-name:var(--font-display)] text-lg font-bold tracking-tight text-[var(--paper)] transition-colors hover:text-[var(--signal)]"
        >
          Slow Ninja
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => {
            const active =
              pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.18em] transition-colors",
                  active
                    ? "text-[var(--signal)]"
                    : "text-[var(--mist)] hover:text-[var(--paper)]",
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
            className="rounded-sm bg-[var(--signal)] px-3 py-2 font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.14em] text-[var(--ink)] transition-transform hover:scale-[1.02]"
          >
            Play Structs
          </a>
        </nav>

        <button
          type="button"
          className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.18em] text-[var(--mist)] md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open ? (
        <nav
          id="mobile-nav"
          className="border-t border-[var(--line)] px-5 py-4 md:hidden"
        >
          <div className="flex flex-col gap-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="font-[family-name:var(--font-mono)] text-sm uppercase tracking-[0.16em] text-[var(--paper)]"
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://www.playstructs.com/"
              target="_blank"
              rel="noreferrer"
              className="font-[family-name:var(--font-mono)] text-sm uppercase tracking-[0.16em] text-[var(--signal)]"
            >
              Play Structs
            </a>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
