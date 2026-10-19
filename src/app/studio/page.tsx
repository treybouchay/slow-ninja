import type { Metadata } from "next";
import Link from "next/link";
import { studio } from "@/lib/content";

export const metadata: Metadata = {
  title: "Studio",
  description:
    "Slow Ninja is a Toronto-born game studio defining skill-based blockchain gaming since 2014.",
};

const pillars = [
  {
    title: "Skill over spectacle",
    body: "Wins should come from reading the system, not from buying a shortcut. That bias runs from Coindroids arenas to Structs guild wars.",
  },
  {
    title: "Readable rules",
    body: "Put truth somewhere players can inspect—SQL views, signed transactions, on-chain state—then build interfaces that reveal rather than obscure.",
  },
  {
    title: "Worlds that outlive us",
    body: "Structs is designed to stay online as long as players keep the chain alive. Decentralization is continuity, not a buzzword.",
  },
];

export default function StudioPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
      <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.22em] text-[var(--signal)]">
        Studio
      </p>
      <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight text-[var(--paper)] md:text-6xl">
        Deliberate since {studio.founded}
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--mist)]">
        {studio.pitch} The name is the method: move carefully, strike with
        precision, leave the system cleaner than you found it.
      </p>

      <div className="mt-16 grid gap-8 border-y border-[var(--line)] py-12 md:grid-cols-3">
        {pillars.map((pillar) => (
          <div key={pillar.title}>
            <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-[var(--paper)]">
              {pillar.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--mist)]">
              {pillar.body}
            </p>
          </div>
        ))}
      </div>

      <section className="mt-16 grid gap-10 md:grid-cols-[0.9fr_1.1fr]">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold text-[var(--paper)]">
            A short timeline of stubborn ideas
          </h2>
        </div>
        <ol className="space-y-8 border-l border-[var(--line)] pl-6">
          <li>
            <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.16em] text-[var(--copper)]">
              2010
            </p>
            <p className="mt-2 text-[var(--paper)]">
              Schemaverse launches a space war played entirely in PostgreSQL—a
              teaching tool, DEF CON contest fixture, and living proof that
              databases can be arenas.
            </p>
          </li>
          <li>
            <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.16em] text-[var(--copper)]">
              2014
            </p>
            <p className="mt-2 text-[var(--paper)]">
              Coindroids helps kick off skill-based blockchain gaming:
              actions are transactions, money is power, and contests find a
              home at DEF CON year after year.
            </p>
          </li>
          <li>
            <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.16em] text-[var(--copper)]">
              2021–now
            </p>
            <p className="mt-2 text-[var(--paper)]">
              Lessons from Coindroids feed Structs—a decentralized 5X strategy
              game in the Cosmos ecosystem, built game-first for players who
              want depth that survives hype cycles.
            </p>
          </li>
        </ol>
      </section>

      <section className="mt-20 rounded-sm border border-[var(--line)] bg-[var(--panel)] px-6 py-10 md:px-10">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--paper)]">
          Build with us, or break our stuff
        </h2>
        <p className="mt-3 max-w-2xl text-[var(--mist)]">
          Structs beta needs sharp players. The journal needs curious readers.
          If you reverse-engineer systems for fun, you are already our
          audience.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href="https://www.playstructs.com/"
            target="_blank"
            rel="noreferrer"
            className="rounded-sm bg-[var(--signal)] px-4 py-2.5 font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.14em] text-[var(--ink)]"
          >
            Join the Structs playtest
          </a>
          <Link
            href="/journal"
            className="rounded-sm border border-[var(--line)] px-4 py-2.5 font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.14em] text-[var(--paper)]"
          >
            Browse the journal
          </Link>
        </div>
      </section>
    </div>
  );
}
