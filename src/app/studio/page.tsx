import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Studio",
  description: "Slow Ninja — deliberately fun skill-based games since 2014.",
};

export default function StudioPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
      <p className="font-mono-label text-xs font-bold tracking-[0.22em] text-[var(--coral)] uppercase">
        Studio
      </p>
      <h1 className="font-display mt-4 max-w-3xl text-4xl font-bold text-[var(--ink)] md:text-6xl">
        Deliberately fun since 2014
      </h1>
      <p className="mt-5 max-w-2xl text-lg text-[var(--mist)]">
        We build skill-based worlds with inspectable systems—and we refuse to
        make them boring while we&apos;re at it.
      </p>

      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {[
          {
            title: "Skill over spectacle",
            body: "Wins come from reading the system, not buying a shortcut.",
            bg: "bg-[var(--lime)]",
          },
          {
            title: "Readable rules",
            body: "SQL views, signed transactions, on-chain state—truth you can peek at.",
            bg: "bg-[var(--sun)]",
          },
          {
            title: "Worlds that last",
            body: "Structs stays online as long as players keep the chain alive.",
            bg: "bg-[var(--blush)]",
          },
        ].map((p) => (
          <div
            key={p.title}
            className={`rounded-[1.75rem] border-2 border-[var(--ink)] p-6 shadow-[6px_6px_0_var(--ink)] ${p.bg}`}
          >
            <h2 className="font-display text-xl font-bold text-[var(--ink)]">
              {p.title}
            </h2>
            <p className="mt-3 text-sm text-[var(--ink)]/75">{p.body}</p>
          </div>
        ))}
      </div>

      <ol className="mt-16 space-y-6 border-l-4 border-[var(--ink)] pl-6">
        <li>
          <p className="font-mono-label text-xs font-bold uppercase text-[var(--coral)]">
            2010
          </p>
          <p className="mt-1 font-semibold text-[var(--ink)]">
            Schemaverse — a space war played in SQL.
          </p>
        </li>
        <li>
          <p className="font-mono-label text-xs font-bold uppercase text-[var(--coral)]">
            2014
          </p>
          <p className="mt-1 font-semibold text-[var(--ink)]">
            Coindroids — skill-based crypto combat that helped kick off the
            genre.
          </p>
        </li>
        <li>
          <p className="font-mono-label text-xs font-bold uppercase text-[var(--coral)]">
            Now
          </p>
          <p className="mt-1 font-semibold text-[var(--ink)]">
            Structs — decentralized 5X strategy in the Cosmos ecosystem.
          </p>
        </li>
      </ol>

      <div className="mt-16 rounded-[2rem] border-2 border-[var(--ink)] bg-[var(--night)] p-8 text-white md:p-10">
        <h2 className="font-display text-2xl font-bold md:text-3xl">
          Come break our stuff
        </h2>
        <p className="mt-3 max-w-xl text-white/70">
          Structs beta needs sharp players. The journal needs curious readers.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="https://www.playstructs.com/"
            target="_blank"
            rel="noreferrer"
            className="btn-bounce rounded-full bg-[var(--lime)] px-5 py-3 text-sm font-bold text-[var(--ink)] shadow-[3px_3px_0_var(--coral)]"
          >
            Join Structs playtest
          </a>
          <Link
            href="/journal"
            className="rounded-full border-2 border-white/30 px-5 py-3 text-sm font-bold text-white"
          >
            Browse journal
          </Link>
        </div>
      </div>
    </div>
  );
}
