import type { Metadata } from "next";
import Link from "next/link";
import { games } from "@/lib/content";

export const metadata: Metadata = {
  title: "Games",
  description: "Structs, Coindroids, and Schemaverse from Slow Ninja.",
};

const accents = ["bg-[var(--lime)]", "bg-[var(--cyan)]", "bg-[var(--sun)]"];

export default function GamesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
      <p className="font-mono-label text-[8px] tracking-widest md:text-[9px] text-[var(--coral)] uppercase">
        Games
      </p>
      <h1 className="font-display mt-4 max-w-3xl text-4xl font-bold tracking-tight text-[var(--ink)] md:text-6xl">
        Three experiments in deliberately fun play
      </h1>
      <p className="mt-5 max-w-2xl text-lg text-[var(--mist)]">
        From SQL space fleets to on-chain galaxies—each title is a playground
        with real rules under the hood.
      </p>

      <div className="mt-14 space-y-6">
        {games.map((game, i) => (
          <article
            key={game.slug}
            className={`rounded-[2rem] border-2 border-[var(--ink)] p-8 shadow-[8px_8px_0_var(--ink)] md:p-10 ${accents[i % accents.length]}`}
          >
            <div className="flex flex-wrap items-baseline gap-3">
              <h2 className="font-display text-3xl font-bold text-[var(--ink)] md:text-4xl">
                {game.name}
              </h2>
              <span className="font-mono-label text-[8px] uppercase md:text-[9px] opacity-70">
                {game.years}
              </span>
            </div>
            <p className="mt-2 text-lg font-semibold text-[var(--ink)]/80">
              {game.tagline}
            </p>
            <p className="mt-4 max-w-3xl leading-relaxed text-[var(--ink)]/75">
              {game.summary}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={game.href}
                target="_blank"
                rel="noreferrer"
                className="btn-bounce rounded-full bg-[var(--ink)] px-5 py-3 text-sm font-bold text-[var(--lime)] shadow-[3px_3px_0_var(--coral)]"
              >
                Open {game.name}
              </a>
              <Link
                href="/journal"
                className="rounded-full border-2 border-[var(--ink)] bg-white/70 px-5 py-3 text-sm font-bold text-[var(--ink)]"
              >
                Related writing
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
