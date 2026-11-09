import Image from "next/image";
import { StructsLottieStage } from "@/components/structs-lottie-stage";
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
      <section className="relative overflow-hidden bg-[#070d16] px-4 pt-10 pb-16 md:flex md:min-h-[calc(100svh-4.5rem)] md:flex-col md:justify-center md:px-6 md:py-16">
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
                radial-gradient(ellipse 70% 55% at 72% 42%, color-mix(in oklab, ${structs.accent} 34%, transparent), transparent 70%),
                radial-gradient(ellipse 45% 40% at 18% 80%, color-mix(in oklab, var(--cyan) 16%, transparent), transparent 65%),
                linear-gradient(180deg, #070d1690 0%, #070d164d 46%, #070d16ee 100%)
              `,
            }}
          />
        </div>
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
        {latest ? (
          <div className="relative mx-auto mt-8 w-full max-w-6xl translate-y-[10vh] md:mt-10">
            <a
              href={latest.href}
              target="_blank"
              rel="noreferrer"
              className="group relative block w-36 overflow-hidden rounded-lg border border-white/15"
            >
              <span className="relative block h-[4.5rem]">
                {latest.image ? (
                  <Image
                    src={latest.image}
                    alt=""
                    fill
                    sizes="144px"
                    className="object-cover [image-rendering:pixelated]"
                  />
                ) : null}
                <span className="absolute inset-0 bg-gradient-to-t from-[#070d16]/90 via-[#070d16]/45 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 p-1.5">
                  <span className="block text-[8px] text-white/60">
                    {latest.date || "Latest"}
                  </span>
                  <span className="mt-0.5 line-clamp-2 block font-display text-[11px] font-bold leading-tight text-white group-hover:text-[var(--lime)]">
                    {latest.title}
                  </span>
                </span>
              </span>
            </a>
          </div>
        ) : null}
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
