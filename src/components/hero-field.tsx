export function HeroField() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="float-a absolute -left-8 top-16 h-40 w-40 bg-[var(--lime)] opacity-80 blob md:h-56 md:w-56" />
      <div className="float-b absolute right-[8%] top-24 h-28 w-28 rounded-full bg-[var(--coral)] opacity-90 md:h-36 md:w-36" />
      <div className="float-c absolute bottom-24 left-[18%] h-20 w-20 rotate-12 rounded-3xl bg-[var(--sun)] md:h-28 md:w-28" />
      <div className="float-a absolute bottom-32 right-[22%] h-16 w-16 rounded-full border-4 border-[var(--ink)]/15 bg-[var(--blush)]" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[var(--paper)] to-transparent" />
    </div>
  );
}
