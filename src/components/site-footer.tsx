import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto px-4 pb-8 md:px-6">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-[var(--night)] px-6 py-12 text-white md:px-10">
        <div className="space-grid pointer-events-none absolute inset-0 opacity-25" />
        <div className="relative grid gap-10 md:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="font-display text-3xl font-bold">
              Slow Ninja
              <span className="ml-2 inline-block h-3 w-3 rounded-full bg-[var(--cyan)] shadow-[0_0_12px_var(--cyan)]" />
            </p>
            <p className="mt-3 max-w-md text-white/65">
              Deliberately fun sci-fi systems since 2014. Skill first, galaxies
              you can peek into, vibes included.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6 text-sm font-semibold">
            <div className="flex flex-col gap-3">
              <Link href="/#games" className="hover:text-[var(--lime)]">
                Games
              </Link>
              <Link href="/#studio" className="hover:text-[var(--lime)]">
                Studio
              </Link>
              <Link href="/journal" className="hover:text-[var(--lime)]">
                Journal
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              <a
                href="https://www.playstructs.com/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[var(--lime)]"
              >
                Structs
              </a>
              <a
                href="https://schemaverse.com/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[var(--lime)]"
              >
                Schemaverse
              </a>
              <a
                href="https://blog.coindroids.com/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[var(--lime)]"
              >
                Coindroids
              </a>
            </div>
          </div>
        </div>
        <p className="font-mono-label mt-10 text-xs tracking-wide text-white/40">
          © 2026 Slow Ninja Inc. · Built with deliberate haste
        </p>
      </div>
    </footer>
  );
}
