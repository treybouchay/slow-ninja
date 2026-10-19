import Link from "next/link";
import { studio } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[var(--line)] bg-[var(--ink-deep)]">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 md:grid-cols-[1.4fr_1fr] md:px-8">
        <div>
          <p className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--paper)]">
            {studio.name}
          </p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--mist)]">
            {studio.tagline}. Toronto-born studio shipping skill-first systems
            for players who like to look under the hood.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6 font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.16em] text-[var(--mist)]">
          <div className="flex flex-col gap-3">
            <Link href="/games" className="hover:text-[var(--signal)]">
              Games
            </Link>
            <Link href="/journal" className="hover:text-[var(--signal)]">
              Journal
            </Link>
            <Link href="/studio" className="hover:text-[var(--signal)]">
              Studio
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            <a
              href="https://www.playstructs.com/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[var(--signal)]"
            >
              Structs
            </a>
            <a
              href="https://schemaverse.com/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[var(--signal)]"
            >
              Schemaverse
            </a>
            <a
              href="https://blog.coindroids.com/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[var(--signal)]"
            >
              Coindroids
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-[var(--line)] px-5 py-4 md:px-8">
        <p className="mx-auto max-w-6xl font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-[var(--mist)]">
          © 2026 Slow Ninja Inc. · Built with deliberate haste
        </p>
      </div>
    </footer>
  );
}
