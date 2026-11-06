import Image from "next/image";
import { games } from "@/lib/content";
import { getLatestStructsPost } from "@/lib/structs-blog";

const structs = games.find((game) => game.slug === "structs")!;

const pastProjects = ["schemaverse", "coindroids"]
  .map((slug) => games.find((game) => game.slug === slug))
  .filter((game) => game != null);

const pastBrief: Record<string, string> = {
  schemaverse:
    "A space war played in SQL. Every player is a database role—buy ships with INSERT, steer with a function, and read the battle in a view.",
  coindroids:
    "Skill-based combat played with coins. Every move was a transaction in the ruins of 20X5. Archived in 2021; the lessons carried into Structs.",
};

export default async function HomePage() {
  const latest = await getLatestStructsPost();

  return (
    <>
      <section className="px-4 pt-10 pb-16 md:px-6 md:pt-16 md:pb-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[1.15fr_0.85fr]">
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
            <a
              href={structs.href}
              target="_blank"
              rel="noreferrer"
              className="btn-bounce mt-8 inline-flex rounded-full bg-[var(--lime)] px-6 py-3.5 text-sm font-bold text-[var(--ink)] shadow-[4px_4px_0_var(--cyan)]"
            >
              Launch Structs
            </a>
            {latest ? (
              <a
                href={latest.href}
                target="_blank"
                rel="noreferrer"
                className="group mt-4 flex max-w-xl items-center gap-4 rounded-2xl border border-white/15 bg-[#0a1220]/80 p-2 pr-4 text-left backdrop-blur transition hover:border-white/30"
              >
                {latest.image ? (
                  <span className="relative size-24 shrink-0 overflow-hidden rounded-xl border border-white/10 md:size-28">
                    <Image
                      src={latest.image}
                      alt=""
                      fill
                      sizes="112px"
                      className="object-cover [image-rendering:pixelated]"
                    />
                  </span>
                ) : null}
                <span className="min-w-0">
                  <span className="font-mono-label block text-[8px] tracking-widest text-white/45 uppercase">
                    Latest from Structs
                  </span>
                  <span className="mt-1 block font-display text-base font-bold leading-snug text-white group-hover:text-[var(--lime)] md:text-lg">
                    {latest.title}
                  </span>
                  {latest.date ? (
                    <span className="mt-1 block text-xs text-white/45">
                      {latest.date}
                    </span>
                  ) : null}
                </span>
              </a>
            ) : null}
          </div>
          <div className="flex justify-center">
            <span
              className="relative block size-64 overflow-hidden rounded-full border-4 bg-[#070d16] md:size-80"
              style={{
                borderColor: structs.accent,
                boxShadow: `0 0 64px ${structs.accent}55`,
              }}
            >
              <Image
                src={structs.artwork}
                alt=""
                fill
                priority
                sizes="320px"
                className="object-cover"
              />
            </span>
          </div>
        </div>
      </section>

      <section id="about" className="scroll-mt-28 px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-6xl">
          <p className="font-mono-label text-[8px] tracking-widest text-[var(--cyan)] uppercase md:text-[9px]">
            About us
          </p>
          <h2 className="font-display mt-3 text-3xl font-bold text-white md:text-5xl">
            Past projects
          </h2>
          <p className="mt-4 max-w-2xl text-white/65">
            Slow Ninja has been building readable game systems since 2014.
            Before Structs, two worlds taught us how play and machinery fit
            together.
          </p>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {pastProjects.map((game) => (
              <a
                key={game.slug}
                href={game.href}
                target="_blank"
                rel="noreferrer"
                className="group overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#0a1220]/80 transition hover:border-white/25"
              >
                <span className="relative block h-40">
                  <Image
                    src={game.artwork}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </span>
                <span className="block p-6">
                  <span className="font-mono-label text-[8px] tracking-widest text-white/45 uppercase">
                    {game.years}
                  </span>
                  <span className="font-display mt-2 block text-2xl font-bold text-white group-hover:text-[var(--lime)]">
                    {game.name}
                  </span>
                  <span className="mt-2 block text-sm leading-relaxed text-white/60">
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
            Contact us
          </p>
          <h2 className="font-display mt-3 text-3xl font-bold text-white md:text-5xl">
            Write the studio
          </h2>
          <p className="mt-4 max-w-xl text-white/65">
            Questions, playtest notes, and collaboration go to one address.
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
