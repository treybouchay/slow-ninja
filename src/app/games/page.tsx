import type { Metadata } from "next";
import Link from "next/link";
import { games } from "@/lib/content";

export const metadata: Metadata = {
  title: "Games",
  description:
    "Structs, Coindroids, and Schemaverse—skill-based worlds from Slow Ninja.",
};

export default function GamesPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
      <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.22em] text-[var(--signal)]">
        Games
      </p>
      <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight text-[var(--paper)] md:text-6xl">
        Three experiments in legible play
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--mist)]">
        Each title pushes the same question further: what happens when the
        rules of a game are systems players can actually inspect?
      </p>

      <div className="mt-16 space-y-16">
        {games.map((game, index) => (
          <article
            key={game.slug}
            className="grid gap-8 border-t border-[var(--line)] pt-12 md:grid-cols-[120px_1fr]"
          >
            <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.18em] text-[var(--copper)]">
              0{index + 1}
            </p>
            <div>
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold text-[var(--paper)] md:text-4xl">
                  {game.name}
                </h2>
                <span className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.16em] text-[var(--mist)]">
                  {game.years}
                </span>
              </div>
              <p className="mt-2 text-[var(--signal)]">{game.tagline}</p>
              <p className="mt-5 max-w-3xl text-base leading-relaxed text-[var(--mist)] md:text-lg">
                {game.summary}
              </p>
              <p className="mt-4 font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.16em] text-[var(--copper)]">
                {game.mechanic} · {game.status}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href={game.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-sm bg-[var(--signal)] px-4 py-2.5 font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.14em] text-[var(--ink)] transition-transform hover:scale-[1.02]"
                >
                  Open {game.name}
                </a>
                <Link
                  href="/journal"
                  className="rounded-sm border border-[var(--line)] px-4 py-2.5 font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.14em] text-[var(--paper)] hover:border-[var(--signal)]"
                >
                  Related writing
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
