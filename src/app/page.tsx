import Link from "next/link";
import { StructsHome } from "@/components/structs-home";
import { journalPosts } from "@/lib/content";

export default function HomePage() {
  const posts = journalPosts.filter(
    (post) =>
      post.tags.includes("structs") &&
      !post.tags.includes("coindroids") &&
      !post.tags.includes("schemaverse"),
  );

  return (
    <>
      <StructsHome />

      <section id="studio" className="scroll-mt-28 px-4 py-20 md:px-6 md:py-28">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] border-2 border-[var(--ink)] bg-[var(--hull)] text-white shadow-[10px_10px_0_var(--lime)]">
          <div className="grid md:grid-cols-2">
            <div className="relative overflow-hidden p-8 md:p-12">
              <div className="space-grid absolute inset-0 opacity-30" />
              <div className="relative">
                <p className="font-mono-label text-[8px] tracking-widest text-[var(--cyan)] uppercase md:text-[9px]">
                  Studio / HQ
                </p>
                <h2 className="font-display mt-4 text-3xl font-bold md:text-5xl">
                  Ambition, craft, and orbital mischief
                </h2>
                <p className="mt-5 leading-relaxed text-white/70">
                  Slow Ninja builds sci-fi systems you can play—and peek into.
                  Serious tech, playful streak, ninja patience.
                </p>
              </div>
            </div>
            <div className="space-y-6 border-t-2 border-white/10 p-8 md:border-t-0 md:border-l-2 md:p-12">
              <div>
                <h3 className="font-display text-xl font-bold text-[var(--lime)]">
                  Passion drives us
                </h3>
                <p className="mt-2 text-white/65">
                  Games aren&apos;t just launched—they&apos;re crafted with
                  heart, care, and a willingness to break things at DEF CON.
                </p>
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-[var(--cyan)]">
                  Skill over spectacle
                </h3>
                <p className="mt-2 text-white/65">
                  Wins should come from reading the system, not buying a
                  shortcut.
                </p>
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-[var(--coral)]">
                  Worlds that outlive us
                </h3>
                <p className="mt-2 text-white/65">
                  Structs stays online as long as players keep the chain alive.
                </p>
              </div>
              <Link
                href="/studio"
                className="inline-flex font-bold text-[var(--lime)] hover:underline"
              >
                Full mission brief →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-24 md:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono-label text-[8px] tracking-widest text-[var(--cyan)] uppercase md:text-[9px]">
                Mission log
              </p>
              <h2 className="font-display mt-3 text-3xl font-bold text-white md:text-5xl">
                Notes from the machine room
              </h2>
            </div>
            <Link
              href="/journal"
              className="font-bold text-white/80 hover:text-[var(--cyan)]"
            >
              All logs →
            </Link>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {posts.map((post, i) => (
              <Link
                key={post.slug}
                href={`/journal/${post.slug}`}
                className={`tilt-hover rounded-[1.5rem] border-2 border-[var(--ink)] p-6 shadow-[6px_6px_0_var(--ink)] ${
                  i === 0
                    ? "bg-[var(--lime)]"
                    : i === 1
                      ? "bg-white"
                      : "bg-[var(--cyan)]"
                }`}
              >
                <p className="font-mono-label text-[7px] leading-relaxed tracking-wide text-[var(--ink)] uppercase opacity-70 md:text-[8px]">
                  {post.date} · {post.readingTime}
                </p>
                <h3 className="font-display mt-3 text-xl font-bold text-[var(--ink)]">
                  {post.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--ink)]/70">
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
