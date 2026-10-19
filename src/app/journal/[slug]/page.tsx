import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, journalPosts } from "@/lib/content";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return journalPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Not found" };
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function JournalPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const index = journalPosts.findIndex((item) => item.slug === slug);
  const previous = journalPosts[index + 1];
  const next = journalPosts[index - 1];

  return (
    <article className="mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-24">
      <Link
        href="/journal"
        className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.18em] text-[var(--mist)] hover:text-[var(--signal)]"
      >
        ← Journal
      </Link>
      <p className="mt-8 font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.18em] text-[var(--copper)]">
        {post.date} · {post.readingTime}
      </p>
      <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight text-[var(--paper)] md:text-5xl">
        {post.title}
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-[var(--mist)]">
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

      <div className="mt-12 space-y-6 border-t border-[var(--line)] pt-12 text-base leading-relaxed text-[var(--paper)]/90 md:text-lg">
        {post.body.map((paragraph) => (
          <p key={paragraph.slice(0, 32)}>{paragraph}</p>
        ))}
      </div>

      <nav className="mt-16 grid gap-6 border-t border-[var(--line)] pt-8 md:grid-cols-2">
        {previous ? (
          <Link href={`/journal/${previous.slug}`} className="group">
            <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.16em] text-[var(--mist)]">
              Older
            </p>
            <p className="mt-2 font-[family-name:var(--font-display)] text-lg font-bold text-[var(--paper)] group-hover:text-[var(--signal)]">
              {previous.title}
            </p>
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link href={`/journal/${next.slug}`} className="group md:text-right">
            <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.16em] text-[var(--mist)]">
              Newer
            </p>
            <p className="mt-2 font-[family-name:var(--font-display)] text-lg font-bold text-[var(--paper)] group-hover:text-[var(--signal)]">
              {next.title}
            </p>
          </Link>
        ) : null}
      </nav>
    </article>
  );
}
