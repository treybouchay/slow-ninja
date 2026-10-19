import Link from "next/link";
import { HeroField } from "@/components/hero-field";
import { games, journalPosts } from "@/lib/content";

const chips = [
  "Skill-based",
  "On-chain worlds",
  "SQL space wars",
  "Since 2014",
  "DEF CON DNA",
  "Player-run galaxies",
];

export default function HomePage() {
  const featured = games[0];
  const others = games.slice(1);
  const posts = journalPosts.slice(0, 3);

  return (
    <>
      {/* Hero — Sophun-style big statement, Slow Ninja twist */}
      <section className="relative isolate min-h-[min(88vh,860px)] overflow-hidden px-4 pb-16 pt-10 md:px-6 md:pb-24 md:pt-16">
        <HeroField />
        <div className="relative mx-auto flex min-h-[min(72vh,700px)] max-w-6xl flex-col items-center justify-center text-center">
          <p className="pop-in font-mono-label mb-5 rounded-full border border-[var(--ink)]/10 bg-white/70 px-4 py-1.5 text-xs font-bold tracking-[0.2em] text-[var(--mist)] uppercase">
            Est. 2014 · Toronto
          </p>
          <h1 className="pop-in-delay font-display max-w-5xl text-[clamp(3.2rem,11vw,7.5rem)] leading-[0.92] font-bold tracking-tight text-[var(--ink)]">
            Slow Ninja
          </h1>
          <p className="pop-in-late mt-4 font-display text-[clamp(1.6rem,4.5vw,3rem)] font-semibold text-[var(--coral)]">
            Deliberately Fun
          </p>
          <p className="pop-in-late mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[var(--mist)] md:text-xl">
            We craft skill-based games with serious systems and a playful
            streak—built for players who like brains, battles, and a little
            mischief.
          </p>
          <div className="pop-in-late mt-10 flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://www.playstructs.com/"
              target="_blank"
              rel="noreferrer"
              className="btn-bounce rounded-full bg-[var(--ink)] px-6 py-3.5 text-sm font-bold text-[var(--lime)] shadow-[4px_4px_0_var(--coral)]"
            >
              Play Structs
            </a>
            <a
              href="#games"
              className="btn-bounce rounded-full border-2 border-[var(--ink)] bg-white px-6 py-3.5 text-sm font-bold text-[var(--ink)] shadow-[4px_4px_0_var(--sun)]"
            >
              See our games
            </a>
          </div>
        </div>
      </section>

      {/* Marquee chips */}
      <div className="overflow-hidden border-y-2 border-[var(--ink)] bg-[var(--lime)] py-3">
        <div className="marquee flex w-max gap-8 whitespace-nowrap">
          {[...chips, ...chips].map((chip, i) => (
            <span
              key={`${chip}-${i}`}
              className="font-display text-lg font-bold text-[var(--ink)] md:text-xl"
            >
              {chip}
              <span className="mx-8 text-[var(--coral)]">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* Featured game — like Match Jong block */}
      <section id="games" className="scroll-mt-28 px-4 py-20 md:px-6 md:py-28">
        <div className="mx-auto max-w-6xl">
          <p className="font-mono-label text-xs font-bold tracking-[0.22em] text-[var(--coral)] uppercase">
            Now playing
          </p>
          <div className="mt-6 grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <h2 className="font-display text-4xl font-bold tracking-tight text-[var(--ink)] md:text-6xl">
                {featured.name}
              </h2>
              <p className="mt-3 text-xl font-semibold text-[var(--mist)]">
                {featured.tagline}
              </p>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--mist)] md:text-lg">
                {featured.summary}
              </p>
              <p className="mt-4 font-mono-label text-xs font-bold tracking-wide text-[var(--ink)] uppercase">
                {featured.mechanic} · {featured.status}
              </p>
              <a
                href={featured.href}
                target="_blank"
                rel="noreferrer"
                className="btn-bounce mt-8 inline-flex rounded-full bg-[var(--coral)] px-6 py-3.5 text-sm font-bold text-white shadow-[4px_4px_0_var(--ink)]"
              >
                Dive into Structs →
              </a>
            </div>

            <div className="tilt-hover relative aspect-square overflow-hidden rounded-[2.5rem] border-2 border-[var(--ink)] bg-[var(--night)] shadow-[10px_10px_0_var(--lime)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(200,245,66,0.35),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(255,94,77,0.3),transparent_40%)]" />
              <div className="float-a absolute top-[18%] left-[14%] h-24 w-24 rounded-full bg-[var(--lime)]" />
              <div className="float-b absolute top-[35%] right-[16%] h-16 w-16 rotate-12 rounded-2xl bg-[var(--sun)]" />
              <div className="float-c absolute bottom-[22%] left-[28%] h-20 w-32 rounded-full bg-[var(--coral)]/90" />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                <p className="font-display text-5xl font-bold text-white md:text-6xl">
                  5X
                </p>
                <p className="mt-2 max-w-[12rem] text-sm font-semibold text-white/70">
                  Explore · Extract · Expand · Exterminate · Exchange
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other games / coming-soon style */}
      <section className="px-4 pb-8 md:px-6">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
          {others.map((game, i) => (
            <a
              key={game.slug}
              href={game.href}
              target="_blank"
              rel="noreferrer"
              className={`tilt-hover block rounded-[2rem] border-2 border-[var(--ink)] p-8 shadow-[8px_8px_0_var(--ink)] transition-shadow hover:shadow-[12px_12px_0_var(--ink)] ${
                i === 0 ? "bg-[var(--sun)]" : "bg-[var(--blush)]"
              }`}
            >
              <p className="font-mono-label text-xs font-bold tracking-[0.18em] uppercase opacity-70">
                {game.years}
              </p>
              <h3 className="font-display mt-3 text-3xl font-bold text-[var(--ink)]">
                {game.name}
              </h3>
              <p className="mt-3 text-[var(--ink)]/75">{game.tagline}</p>
              <p className="mt-6 text-sm font-bold text-[var(--ink)]">
                Open project →
              </p>
            </a>
          ))}
        </div>
      </section>

      {/* Studio — Sophun about energy */}
      <section id="studio" className="scroll-mt-28 px-4 py-20 md:px-6 md:py-28">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] border-2 border-[var(--ink)] bg-white shadow-[10px_10px_0_var(--coral)]">
          <div className="grid md:grid-cols-2">
            <div className="bg-[var(--mint)] p-8 md:p-12">
              <p className="font-mono-label text-xs font-bold tracking-[0.22em] text-[var(--ink)] uppercase">
                The studio
              </p>
              <h2 className="font-display mt-4 text-3xl font-bold text-[var(--ink)] md:text-5xl">
                Ambition, craft, and a ninja sense of humor
              </h2>
              <p className="mt-5 leading-relaxed text-[var(--mist)]">
                Slow Ninja combines decades of oddball game experiments with
                real systems chops. We pick ideas that can become spectacular—
                then we ship them slowly, carefully, and a little weird.
              </p>
            </div>
            <div className="space-y-6 p-8 md:p-12">
              <div>
                <h3 className="font-display text-xl font-bold text-[var(--ink)]">
                  Passion drives us
                </h3>
                <p className="mt-2 text-[var(--mist)]">
                  Games aren&apos;t just launched—they&apos;re crafted with heart,
                  care, and a willingness to break things at DEF CON.
                </p>
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-[var(--ink)]">
                  Skill over spectacle
                </h3>
                <p className="mt-2 text-[var(--mist)]">
                  Wins should come from reading the system, not buying a
                  shortcut. Fun first, fair always.
                </p>
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-[var(--ink)]">
                  Worlds that outlive us
                </h3>
                <p className="mt-2 text-[var(--mist)]">
                  Structs stays online as long as players keep the chain alive.
                  Continuity is the feature.
                </p>
              </div>
              <Link
                href="/studio"
                className="inline-flex font-bold text-[var(--coral)] hover:underline"
              >
                Full studio story →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Journal */}
      <section className="px-4 pb-24 md:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono-label text-xs font-bold tracking-[0.22em] text-[var(--coral)] uppercase">
                Journal
              </p>
              <h2 className="font-display mt-3 text-3xl font-bold text-[var(--ink)] md:text-5xl">
                Notes from the machine room
              </h2>
            </div>
            <Link
              href="/journal"
              className="font-bold text-[var(--ink)] hover:text-[var(--coral)]"
            >
              All posts →
            </Link>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {posts.map((post, i) => (
              <Link
                key={post.slug}
                href={`/journal/${post.slug}`}
                className={`tilt-hover rounded-[1.75rem] border-2 border-[var(--ink)] p-6 shadow-[6px_6px_0_var(--ink)] ${
                  i === 0
                    ? "bg-[var(--lime)]"
                    : i === 1
                      ? "bg-white"
                      : "bg-[var(--sun)]"
                }`}
              >
                <p className="font-mono-label text-[10px] font-bold tracking-wide uppercase opacity-70">
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
