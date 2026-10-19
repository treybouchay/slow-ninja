import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { GamesTimeline } from "@/components/games-timeline";
import { HeroField } from "@/components/hero-field";
import { journalPosts } from "@/lib/content";

export default function HomePage() {
  const posts = journalPosts.slice(0, 3);

  return (
    <>
      <section className="relative isolate min-h-[min(90vh,900px)] overflow-hidden bg-[#070d16] px-4 pb-16 pt-10 md:px-6 md:pb-24 md:pt-14">
        <HeroField />
        <div className="relative mx-auto flex min-h-[min(74vh,740px)] max-w-6xl flex-col items-center justify-center text-center">
          <p className="pop-in font-mono-label mb-6 rounded-full border border-[var(--cyan)]/40 bg-black/40 px-4 py-2 text-[8px] leading-none tracking-widest text-[var(--cyan)] uppercase md:text-[9px]">
            Sector 2014 · Toronto uplink
          </p>
          <div className="pop-in-delay drop-shadow-[0_0_40px_rgba(77,226,232,0.35)]">
            <BrandLogo size="hero" href={null} priority />
            <h1 className="sr-only">Slow Ninja</h1>
          </div>
          <p className="pop-in-late mt-6 font-display text-[clamp(1.5rem,4.2vw,2.75rem)] font-extrabold tracking-tight text-[var(--lime)]">
            Deliberately Fun
          </p>
          <p className="pop-in-late mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/75 md:text-xl">
            Sci-fi playgrounds with serious systems—skill-based battles, SQL
            fleets, and on-chain galaxies built for curious commanders.
          </p>
          <div className="pop-in-late mt-10 flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://www.playstructs.com/"
              target="_blank"
              rel="noreferrer"
              className="btn-bounce rounded-full bg-[var(--lime)] px-6 py-3.5 text-sm font-bold text-[var(--ink)] shadow-[4px_4px_0_var(--cyan)]"
            >
              Launch Structs
            </a>
            <a
              href="#games"
              className="btn-bounce rounded-full border-2 border-white/40 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur hover:bg-white/20"
            >
              Scan catalog
            </a>
          </div>
        </div>
      </section>

      <GamesTimeline />

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
