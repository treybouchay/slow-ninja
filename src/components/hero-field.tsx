export function HeroField() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_10%,rgba(200,245,66,0.14),transparent_42%),radial-gradient(ellipse_at_85%_30%,rgba(72,140,130,0.22),transparent_45%),linear-gradient(165deg,#0b110f_0%,#121a17_48%,#0a0e0c_100%)]" />
      <div className="hero-grid absolute inset-0 opacity-[0.35]" />
      <div className="hero-orbit absolute -right-[18%] top-[8%] h-[70vmin] w-[70vmin] rounded-full border border-[var(--signal)]/20" />
      <div className="hero-orbit-delayed absolute -right-[8%] top-[18%] h-[48vmin] w-[48vmin] rounded-full border border-[var(--copper)]/25" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[var(--ink)] to-transparent" />
    </div>
  );
}
