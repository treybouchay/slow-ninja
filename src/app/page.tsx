import Link from "next/link";
import { HeroField } from "@/components/hero-field";
import { games, journalPosts, studio } from "@/lib/content";

export default function HomePage() {
  const featuredPosts = journalPosts.slice(0, 3);

  return (
    <>
      <section className="relative isolate min-h-[min(92vh,920px)] overflow-hidden">
        <HeroField />
        <div className="relative mx-auto flex min-h-[min(92vh,920px)] max-w-6xl flex-col justify-end px-5 pb-16 pt-28 md:px-8 md:pb-24">
          <p className="reveal-up font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.28em] text-[var(--signal)]">
            Est. {studio.founded}
          </p>
          <h1 className="reveal-up-delay mt-4 max-w-4xl font-[family-name:var(--font-display)] text-[clamp(3.4rem,12vw,7.5rem)] leading-[0.9] font-extrabold tracking-[-0.04em] text-[var(--paper)]">
            Slow Ninja
          </h1>
          <p className="reveal-up-late mt-6 max-w-xl text-lg leading-relaxed text-[var(--mist)] md:text-xl">
            Skill-based systems you can read. Games where transactions are
            moves, SQL is a controller, and mastery beats spectacle.
          </p>
          <div className="reveal-up-late mt-10 flex flex-wrap items-center gap-4">
            <a
              href="https://www.playstructs.com/"
              target="_blank"
              rel="noreferrer"
              className="rounded-sm bg-[var(--signal)] px-5 py-3 font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.16em] text-[var(--ink)] transition-transform hover:scale-[1.02]"
            >
              Enter Structs
            </a>
            <Link
              href="/journal"
              className="rounded-sm border border-[var(--line)] px-5 py-3 font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.16em] text-[var(--paper)] transition-colors hover:border-[var(--signal)] hover:text-[var(--signal)]"
            >
              Read the journal
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--line)]">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 md:grid-cols-[0.9fr_1.1fr] md:px-8 md:py-28">
          <div>
            <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.22em] text-[var(--copper)]">
              The thesis
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-[var(--paper)] md:text-4xl">
              Readable machines win longer games.
            </h2>
          </div>
          <div className="space-y-5 text-base leading-relaxed text-[var(--mist)] md:text-lg">
            <p>
              Slow Ninja has been defining skill-based blockchain gaming since
              2014—not as casino chrome, but as systems players can inspect,
              stress, and eventually outthink.
            </p>
            <p>
              That is why Schemaverse lives inside PostgreSQL, why Coindroids
              made every action a transaction, and why Structs keeps its galaxy
              on a chain the community can keep alive.
            </p>
            <Link
              href="/studio"
              className="signal-underline inline-flex font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.18em] text-[var(--paper)]"
            >
              Meet the studio
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--line)] bg-[var(--ink-deep)]">
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.22em] text-[var(--signal)]">
                Catalog
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-[var(--paper)] md:text-4xl">
                Worlds we shipped
              </h2>
            </div>
            <Link
              href="/games"
              className="signal-underline font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.18em] text-[var(--mist)]"
            >
              All games
            </Link>
          </div>

          <ul className="mt-12 divide-y divide-[var(--line)] border-y border-[var(--line)]">
            {games.map((game) => (
              <li key={game.slug}>
                <a
                  href={game.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group grid gap-3 py-8 transition-colors md:grid-cols-[160px_1fr_auto] md:items-baseline md:gap-8"
                >
                  <span className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.16em] text-[var(--mist)]">
                    {game.years}
                  </span>
                  <div>
                    <p className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--paper)] transition-colors group-hover:text-[var(--signal)] md:text-3xl">
                      {game.name}
                    </p>
                    <p className="mt-2 max-w-2xl text-[var(--mist)]">
                      {game.tagline}. {game.mechanic}.
                    </p>
                  </div>
                  <span className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.16em] text-[var(--copper)]">
                    {game.status}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-[var(--line)]">
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.22em] text-[var(--copper)]">
                Journal
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-[var(--paper)] md:text-4xl">
                Notes from under the hood
              </h2>
              <p className="mt-3 max-w-xl text-[var(--mist)]">
                Technical writing on combat ticks, SQL arenas, guild
                permissions, and the decade of lessons between Coindroids and
                Structs.
              </p>
            </div>
            <Link
              href="/journal"
              className="signal-underline font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.18em] text-[var(--mist)]"
            >
              Full archive
            </Link>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {featuredPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/journal/${post.slug}`}
                className="group border-t border-[var(--line)] pt-6 transition-colors hover:border-[var(--signal)]"
              >
                <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--mist)]">
                  {post.date} · {post.readingTime}
                </p>
                <h3 className="mt-3 font-[family-name:var(--font-display)] text-xl font-bold text-[var(--paper)] transition-colors group-hover:text-[var(--signal)]">
                  {post.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--mist)]">
                  {post.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
