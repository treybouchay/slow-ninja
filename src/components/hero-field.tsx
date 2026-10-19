export function HeroField() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Deep space wash behind playful hero */}
      <div className="absolute inset-x-0 top-0 h-[78%] bg-[radial-gradient(ellipse_at_50%_0%,#152238_0%,#0b1220_55%,transparent_78%)]" />
      <div className="starfield absolute inset-x-0 top-0 h-[75%]" />
      <div className="space-grid absolute inset-x-0 top-0 h-[70%] opacity-40" />

      {/* Orbital rings */}
      <div className="orbit-spin absolute top-[8%] right-[-12%] h-[58vmin] w-[58vmin] rounded-full border border-[var(--cyan)]/35" />
      <div className="orbit-spin-rev absolute top-[14%] right-[-4%] h-[42vmin] w-[42vmin] rounded-full border border-dashed border-[var(--lime)]/40" />
      <div className="absolute top-[28%] right-[12%] h-3 w-3 rounded-full bg-[var(--cyan)] shadow-[0_0_18px_var(--cyan)]" />

      {/* Fun neon shapes with sci-fi edges */}
      <div className="float-a absolute top-20 left-[6%] h-28 w-28 rounded-[1.5rem] border-2 border-[var(--lime)]/50 bg-[var(--lime)]/80 md:h-40 md:w-40" />
      <div className="float-b absolute top-28 right-[18%] h-20 w-20 rotate-12 rounded-full border-2 border-white/20 bg-[var(--coral)] md:h-28 md:w-28" />
      <div className="float-c absolute bottom-[28%] left-[20%] h-16 w-24 -rotate-6 rounded-2xl border border-[var(--cyan)]/40 bg-[var(--cyan)]/70 md:h-20 md:w-32" />
      <div className="float-a absolute right-[30%] bottom-[34%] h-14 w-14 rounded-full bg-[var(--sun)]" />

      <div className="scanlines absolute inset-x-0 top-0 h-[75%] opacity-40" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[var(--paper)] via-[var(--paper)]/80 to-transparent" />
    </div>
  );
}
