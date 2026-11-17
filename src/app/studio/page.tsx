import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Studio",
  description: "Slow Ninja — skill-based games with systems you can inspect.",
};

export default function StudioPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
      <p className="font-mono-label text-[8px] tracking-widest text-[var(--coral)] uppercase md:text-[9px]">
        Studio
      </p>
      <h1 className="font-display mt-4 max-w-3xl text-4xl font-bold text-white md:text-6xl">
        Games you can read
      </h1>
      <p className="mt-5 max-w-2xl text-lg text-white/70">
        Slow Ninja builds skill-based games where the rules are inspectable—not
        hidden behind a black box.
      </p>
      <Link
        href="/team"
        className="mt-6 inline-flex font-bold text-[var(--lime)] hover:underline"
      >
        Meet the team →
      </Link>

      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {[
          {
            title: "Skill first",
            body: "Wins come from understanding the system, not buying a shortcut.",
            bg: "bg-[var(--lime)]",
          },
          {
            title: "Open rules",
            body: "SQL, signed transactions, on-chain state—truth you can check.",
            bg: "bg-[var(--sun)]",
          },
          {
            title: "Worlds that last",
            body: "Structs stays online as long as players keep the chain alive.",
            bg: "bg-[var(--cyan)]",
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

      <ol className="mt-16 space-y-6 border-l-4 border-white/25 pl-6">
        <li>
          <p className="font-mono-label text-[8px] text-[var(--coral)] uppercase md:text-[9px]">
            2010
          </p>
          <p className="mt-1 font-semibold text-white">
            Schemaverse — a space war played in SQL.
          </p>
        </li>
        <li>
          <p className="font-mono-label text-[8px] text-[var(--coral)] uppercase md:text-[9px]">
            2014
          </p>
          <p className="mt-1 font-semibold text-white">
            Coindroids — robot combat where every move was a transaction.
          </p>
        </li>
        <li>
          <p className="font-mono-label text-[8px] text-[var(--coral)] uppercase md:text-[9px]">
            Now
          </p>
          <p className="mt-1 font-semibold text-white">
            Structs — space strategy on a chain players can keep running.
          </p>
        </li>
      </ol>

      <div className="mt-16 rounded-[2rem] border-2 border-[var(--ink)] bg-[var(--night)] p-8 text-white md:p-10">
        <h2 className="font-display text-2xl font-bold md:text-3xl">
          Come try Structs
        </h2>
        <p className="mt-3 max-w-xl text-white/70">
          The playtest is open. Bring a sharp eye.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="https://www.playstructs.com/"
            target="_blank"
            rel="noreferrer"
            className="btn-bounce rounded-full bg-[var(--lime)] px-5 py-3 text-sm font-bold text-[var(--ink)] shadow-[3px_3px_0_var(--coral)]"
          >
            Join the playtest
          </a>
          <Link
            href="/#about"
            className="rounded-full border-2 border-white/30 px-5 py-3 text-sm font-bold text-white"
          >
            Past projects
          </Link>
        </div>
      </div>
    </div>
  );
}
