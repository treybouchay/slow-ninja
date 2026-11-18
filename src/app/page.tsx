import Image from "next/image";
import { StructsLottieStage } from "@/components/structs-lottie-stage";
import { games } from "@/lib/content";
import { getStructsPosts } from "@/lib/structs-blog";

const structs = games.find((game) => game.slug === "structs")!;

const pastProjects = ["schemaverse", "coindroids"]
  .map((slug) => games.find((game) => game.slug === slug))
  .filter((game) => game != null);

const pastBrief: Record<string, string> = {
  schemaverse:
    "A space war you play by writing SQL. Players are database roles; the map lives in tables.",
  coindroids:
    "Robot combat where every attack was a crypto transaction. Ran 2014–2021.",
};

export default async function HomePage() {
  const posts = await getStructsPosts();

  return (
    <>
      <div className="relative overflow-hidden bg-[#070d16]">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <Image
            src={structs.artwork}
            alt=""
            fill
            priority
            sizes="100vw"
            className="scale-110 object-cover opacity-40 blur-2xl saturate-125"
          />
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse 70% 55% at 72% 28%, color-mix(in oklab, ${structs.accent} 34%, transparent), transparent 70%),
                radial-gradient(ellipse 50% 45% at 18% 58%, color-mix(in oklab, var(--cyan) 16%, transparent), transparent 65%),
                radial-gradient(ellipse 55% 40% at 78% 78%, color-mix(in oklab, ${structs.accent} 18%, transparent), transparent 70%),
                linear-gradient(180deg, #070d1690 0%, #070d164d 36%, #070d16c8 72%, #070d16f2 100%)
              `,
            }}
          />
        </div>

        <section className="relative overflow-hidden px-4 pt-10 pb-8 md:px-6 md:pt-[124px] md:pb-10">
          <StructsLottieStage />
          <div className="relative mx-auto grid w-full max-w-6xl items-center gap-10 md:grid-cols-[1.15fr_0.85fr] md:gap-12">
            <div>
              <p className="font-mono-label text-[8px] tracking-widest text-[var(--violet)] uppercase md:text-[9px]">
                {structs.status}
              </p>
              <h1 className="font-display mt-3 text-5xl font-extrabold tracking-tight text-white md:text-7xl">
                {structs.name}
              </h1>
              <p className="mt-4 max-w-xl text-lg text-white/75 md:text-xl">
                {structs.tagline}
              </p>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/55 md:text-base">
                {structs.summary}
              </p>
            </div>
            <div
              data-fleet-anchor
              className="pointer-events-none h-[400px] w-full md:h-[460px]"
            />
          </div>
        </section>

        {posts.length ? (
          <section
            id="blog"
            className="relative scroll-mt-28 px-4 py-10 md:px-6 md:py-12"
          >
            <div className="mx-auto max-w-6xl">
              <p className="font-mono-label text-[8px] tracking-widest text-[var(--lime)] uppercase md:text-[9px]">
                Updates
              </p>
              <h2 className="font-display mt-3 text-3xl font-bold text-white md:text-5xl">
                Blog
              </h2>
              <p className="mt-3 max-w-xl text-white/60">
                Short notes from the Structs playtest.
              </p>
              <div className="mt-8 flex flex-wrap gap-3 md:mt-10">
                {posts.map((post) => (
                  <a
                    key={post.href}
                    href={post.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative block w-36 shrink-0 overflow-hidden rounded-lg border border-white/15 bg-[#0a1220]/85 transition-transform duration-300 ease-out hover:z-10 hover:scale-105 hover:border-white/35"
                  >
                    <span className="relative block h-[4.5rem]">
                      {post.image ? (
                        <Image
                          src={post.image}
                          alt=""
                          fill
                          sizes="144px"
                          className="object-cover [image-rendering:pixelated]"
                        />
                      ) : null}
                      <span className="absolute inset-0 bg-gradient-to-t from-[#070d16] via-[#070d16]/55 to-transparent" />
                    </span>
                    <span className="flex h-[3.6rem] flex-col justify-between gap-0.5 px-1.5 pt-1 pb-1.5">
                      <span className="font-mono-label block truncate text-[8px] tracking-[0.14em] text-[var(--lime)] uppercase">
                        {post.date || "Latest"}
                      </span>
                      <span className="line-clamp-2 min-h-[2em] font-display text-[11px] font-bold leading-tight text-white group-hover:text-[var(--lime)]">
                        {post.title}
                      </span>
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </div>

      <section id="about" className="scroll-mt-28 px-4 py-12 md:px-6 md:py-16">
        <div className="mx-auto max-w-6xl">
          <p className="font-mono-label text-[8px] tracking-widest text-[var(--cyan)] uppercase md:text-[9px]">
            About
          </p>
          <h2 className="font-display mt-2 text-2xl font-bold text-white md:text-4xl">
            Past projects
          </h2>
          <p className="mt-3 max-w-xl text-sm text-white/65 md:text-base">
            Before Structs, we built two games that put the rules in plain
            sight.
          </p>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {pastProjects.map((game) => (
              <a
                key={game.slug}
                href={game.href}
                target="_blank"
                rel="noreferrer"
                className="group flex overflow-hidden rounded-xl border border-white/10 bg-[#0a1220]/80 transition hover:border-white/25"
              >
                <span className="relative block h-24 w-24 shrink-0 sm:h-28 sm:w-28">
                  <Image
                    src={game.artwork}
                    alt=""
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                </span>
                <span className="flex min-w-0 flex-1 flex-col justify-center gap-0.5 px-3.5 py-3">
                  <span className="font-mono-label text-[7px] tracking-widest text-white/45 uppercase md:text-[8px]">
                    {game.years}
                  </span>
                  <span className="font-display text-lg font-bold text-white group-hover:text-[var(--lime)]">
                    {game.name}
                  </span>
                  <span className="line-clamp-2 text-xs leading-relaxed text-white/55">
                    {pastBrief[game.slug]}
                  </span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="scroll-mt-28 px-4 pt-4 pb-24 md:px-6">
        <div className="mx-auto max-w-6xl rounded-[2rem] border border-white/10 bg-[#0a1220]/80 px-6 py-12 md:px-12 md:py-16">
          <p className="font-mono-label text-[8px] tracking-widest text-[var(--cyan)] uppercase md:text-[9px]">
            Contact
          </p>
          <h2 className="font-display mt-3 text-3xl font-bold text-white md:text-5xl">
            Get in touch
          </h2>
          <p className="mt-4 max-w-xl text-white/65">
            Playtest notes, press, or just hello.
          </p>
          <a
            href="mailto:info@slow.ninja"
            className="btn-bounce mt-8 inline-flex rounded-full border-2 border-[var(--lime)] px-6 py-3.5 text-sm font-bold text-[var(--lime)]"
          >
            info@slow.ninja
          </a>
        </div>
      </section>
    </>
  );
}
