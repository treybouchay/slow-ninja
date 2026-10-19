export function HeroField() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden bg-[var(--night)]"
    >
      {/* Solid dark field — no soft radial blur wash */}
      <div className="absolute inset-0 bg-[#070d16]" />
      <div className="starfield absolute inset-0 opacity-70" />
      <div className="space-grid absolute inset-0 opacity-30" />

      {/* Orbital rings */}
      <div className="orbit-spin absolute top-[8%] right-[-12%] h-[58vmin] w-[58vmin] rounded-full border border-[var(--cyan)]/30" />
      <div className="orbit-spin-rev absolute top-[14%] right-[-4%] h-[42vmin] w-[42vmin] rounded-full border border-dashed border-[var(--lime)]/35" />
      <div className="absolute top-[28%] right-[12%] h-3 w-3 rounded-full bg-[var(--cyan)] shadow-[0_0_18px_var(--cyan)]" />

      {/* Fun neon shapes */}
      <div className="float-a absolute top-20 left-[6%] h-28 w-28 rounded-[1.5rem] border-2 border-[var(--lime)]/50 bg-[var(--lime)]/80 md:h-40 md:w-40" />
      <div className="float-b absolute top-28 right-[18%] h-20 w-20 rotate-12 rounded-full border-2 border-white/20 bg-[var(--coral)] md:h-28 md:w-28" />
      <div className="float-c absolute bottom-[22%] left-[20%] h-16 w-24 -rotate-6 rounded-2xl border border-[var(--cyan)]/40 bg-[var(--cyan)]/70 md:h-20 md:w-32" />
      <div className="float-a absolute right-[30%] bottom-[26%] h-14 w-14 rounded-full bg-[var(--sun)]" />

      <div className="scanlines absolute inset-0 opacity-25" />
    </div>
  );
}
