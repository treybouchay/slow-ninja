import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Our Team",
  description:
    "Slow Ninja is a small studio building skill-based worlds you can inspect—Schemaverse, Coindroids, and Structs.",
};

const seats = [
  {
    label: "Systems",
    title: "The machine room",
    body: "PostgreSQL roles, signed transactions, Cosmos state. The people who put the rules where a curious player can open them.",
    bg: "bg-[var(--lime)]",
  },
  {
    label: "Worlds",
    title: "The slow read",
    body: "Galaxies that reward patience. Mastery is comprehension—reading a view, a block, or a guild permission—not a hidden stat.",
    bg: "bg-[var(--sun)]",
  },
  {
    label: "Players",
    title: "The long crew",
    body: "Structs stays online because players keep the chain alive. The people who reverse-engineer our systems for fun are part of the team.",
    bg: "bg-[var(--cyan)]",
  },
];

export default function TeamPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
      <p className="font-mono-label text-[8px] tracking-widest text-[var(--coral)] uppercase md:text-[9px]">
        Our team
      </p>
      <h1 className="font-display mt-4 max-w-3xl text-4xl font-bold text-white md:text-6xl">
        A small crew. Worlds you can read.
      </h1>
      <p className="mt-5 max-w-2xl text-lg text-white/70">
        Slow Ninja is a studio, not a crowd. Since Schemaverse in 2010 and the
        studio&apos;s founding in 2014, the same bias has held: skill first,
        inspectable systems, and a playful streak.
      </p>

      <ul className="mt-14 grid gap-5 md:grid-cols-3">
        {seats.map((seat) => (
          <li
            key={seat.title}
            className={`rounded-[1.75rem] border-2 border-[var(--ink)] p-6 shadow-[6px_6px_0_var(--ink)] ${seat.bg}`}
          >
            <p className="font-mono-label text-[8px] tracking-widest text-[var(--ink)]/60 uppercase md:text-[9px]">
              {seat.label}
            </p>
            <h2 className="font-display mt-3 text-xl font-bold text-[var(--ink)]">
              {seat.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--ink)]/75">
              {seat.body}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-16 max-w-3xl space-y-5 text-base leading-relaxed text-white/80 md:text-lg">
        <p>
          There is no separate marketing desk. The journal is written by the
          people who ship the games. If a combat tick, a guild permission, or
          a SQL view is worth playing, it is worth explaining in public.
        </p>
        <p>
          Toronto is the uplink. The work is the three worlds: Schemaverse,
          still a space war played in SQL; Coindroids, the skill-based combat
          that taught us what chain UX should not be; and Structs, the 5X
          galaxy the community can keep running.
        </p>
        <p>
          If you want to see how the crew thinks, read the field notes. If you
          want to see how the crew plays, join the Structs playtest and try to
          break something.
        </p>
      </div>

      <div className="mt-16 rounded-[2rem] border-2 border-[var(--ink)] bg-[var(--night)] p-8 text-white md:p-10">
        <h2 className="font-display text-2xl font-bold md:text-3xl">
          Come read with us
        </h2>
        <p className="mt-3 max-w-xl text-white/70">
          The longest members of this team are the players who stay. Start
          with a log, or take a fleet out.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/journal"
            className="btn-bounce rounded-full bg-[var(--lime)] px-5 py-3 text-sm font-bold text-[var(--ink)] shadow-[3px_3px_0_var(--cyan)]"
          >
            Read the journal
          </Link>
          <Link
            href="/studio"
            className="rounded-full border-2 border-white/30 px-5 py-3 text-sm font-bold text-white"
          >
            Studio brief
          </Link>
          <a
            href="https://www.playstructs.com/"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border-2 border-white/30 px-5 py-3 text-sm font-bold text-white"
          >
            Launch Structs
          </a>
        </div>
      </div>
    </div>
  );
}
