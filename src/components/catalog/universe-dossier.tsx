import type { Game } from "@/lib/content";
import { cn } from "@/lib/utils";

/** Full universe card. Content is never clipped. */
export function UniverseDossier({
  game,
  className,
}: {
  game: Game;
  className?: string;
}) {
  return (
    <div
      data-dossier
      className={cn(
        "pointer-events-none rounded-[1rem] border border-white/10 bg-[#0a1220]/95 p-3 backdrop-blur-md",
        className,
      )}
      style={{
        boxShadow: `0 0 0 1px ${game.accent}33, 0 18px 40px rgba(0,0,0,0.55)`,
      }}
    >
      <p
        className="font-mono-label text-[8px] leading-tight tracking-widest uppercase"
        style={{ color: game.accent }}
      >
        {game.mechanic}
      </p>
      <h3 className="font-display mt-1 text-base font-bold text-white">
        {game.name}
      </h3>
      <p className="mt-0.5 text-xs text-white/75">{game.tagline}</p>
      <p className="mt-2 text-[11px] leading-relaxed text-white/55">
        {game.summary}
      </p>
      <p className="mt-2 text-[10px] font-semibold tracking-wide text-white/35 uppercase">
        {game.status}
      </p>
      <a
        href={game.href}
        target="_blank"
        rel="noreferrer"
        className="pointer-events-auto mt-2.5 inline-flex w-fit rounded-full px-3.5 py-1.5 text-xs font-bold text-[var(--ink)]"
        style={{ background: game.accent }}
      >
        Explore more →
      </a>
    </div>
  );
}
