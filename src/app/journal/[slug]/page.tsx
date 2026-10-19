import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, journalPosts } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return journalPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Not found" };
  return { title: post.title, description: post.excerpt };
}

export default async function JournalPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const index = journalPosts.findIndex((item) => item.slug === slug);
  const previous = journalPosts[index + 1];
  const next = journalPosts[index - 1];

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-24">
      <Link
        href="/journal"
        className="font-bold text-[var(--coral)] hover:underline"
      >
        ← Journal
      </Link>
      <div className="mt-8 rounded-[2rem] border-2 border-[var(--ink)] bg-[var(--lime)] p-8 shadow-[8px_8px_0_var(--ink)] md:p-10">
        <p className="font-mono-label text-[8px] tracking-wide uppercase md:text-[9px] opacity-70">
          {post.date} · {post.readingTime}
        </p>
        <h1 className="font-display mt-3 text-3xl font-bold text-[var(--ink)] md:text-5xl">
          {post.title}
        </h1>
        <p className="mt-4 text-[var(--ink)]/75">{post.excerpt}</p>
      </div>

      <div className="mt-10 space-y-5 text-base leading-relaxed text-[var(--ink)]/90 md:text-lg">
        {post.body.map((paragraph) => (
          <p key={paragraph.slice(0, 40)}>{paragraph}</p>
        ))}
      </div>

      <nav className="mt-16 grid gap-4 border-t-2 border-[var(--ink)]/10 pt-8 md:grid-cols-2">
        {previous ? (
          <Link
            href={`/journal/${previous.slug}`}
            className="rounded-2xl border-2 border-[var(--ink)] bg-white p-4 hover:bg-[var(--mint)]"
          >
            <p className="text-xs font-bold uppercase opacity-50">Older</p>
            <p className="font-display mt-1 font-bold">{previous.title}</p>
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link
            href={`/journal/${next.slug}`}
            className="rounded-2xl border-2 border-[var(--ink)] bg-white p-4 text-right hover:bg-[var(--sun)]"
          >
            <p className="text-xs font-bold uppercase opacity-50">Newer</p>
            <p className="font-display mt-1 font-bold">{next.title}</p>
          </Link>
        ) : null}
      </nav>
    </article>
  );
}
