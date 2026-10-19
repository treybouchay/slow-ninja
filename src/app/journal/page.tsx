import type { Metadata } from "next";
import Link from "next/link";
import { journalPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Technical notes on building readable, skill-based games at Slow Ninja.",
};

export default function JournalPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
      <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.22em] text-[var(--copper)]">
        Journal
      </p>
      <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight text-[var(--paper)] md:text-6xl">
        Field notes from the machine room
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--mist)]">
        Design rationale, postmortems, and implementation detail—written for
        players and builders who want the why behind the systems.
      </p>

      <ul className="mt-16 divide-y divide-[var(--line)] border-y border-[var(--line)]">
        {journalPosts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/journal/${post.slug}`}
              className="group grid gap-3 py-8 md:grid-cols-[180px_1fr] md:gap-10"
            >
              <div className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.16em] text-[var(--mist)]">
                <p>{post.date}</p>
                <p className="mt-2 text-[var(--copper)]">{post.readingTime}</p>
              </div>
              <div>
                <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--paper)] transition-colors group-hover:text-[var(--signal)] md:text-3xl">
                  {post.title}
                </h2>
                <p className="mt-3 max-w-2xl leading-relaxed text-[var(--mist)]">
                  {post.excerpt}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.16em] text-[var(--signal)]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
