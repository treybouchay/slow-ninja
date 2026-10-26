import type { Metadata } from "next";
import Link from "next/link";
import { journalPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Journal",
  description: "Technical notes from Slow Ninja — fun systems, serious craft.",
};

const accents = ["bg-[var(--lime)]", "bg-white", "bg-[var(--cyan)]", "bg-[var(--sun)]"];

export default function JournalPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
      <p className="font-mono-label text-[8px] tracking-widest md:text-[9px] text-[var(--coral)] uppercase">
        Journal
      </p>
      <h1 className="font-display mt-4 max-w-3xl text-4xl font-bold text-white md:text-6xl">
        Field notes with personality
      </h1>
      <p className="mt-5 max-w-2xl text-lg text-white/70">
        Design rationale, postmortems, and implementation detail—written for
        players and builders who want the why.
      </p>

      <ul className="mt-14 grid gap-5 md:grid-cols-2">
        {journalPosts.map((post, i) => (
          <li key={post.slug}>
            <Link
              href={`/journal/${post.slug}`}
              className={`tilt-hover block h-full rounded-[1.75rem] border-2 border-[var(--ink)] p-6 shadow-[6px_6px_0_var(--ink)] md:p-8 ${accents[i % accents.length]}`}
            >
              <p className="font-mono-label text-[8px] tracking-wide uppercase opacity-70">
                {post.date} · {post.readingTime}
              </p>
              <h2 className="font-display mt-3 text-2xl font-bold text-[var(--ink)]">
                {post.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[var(--ink)]/70">
                {post.excerpt}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
