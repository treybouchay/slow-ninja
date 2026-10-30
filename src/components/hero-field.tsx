export function HeroField() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden bg-[var(--night)]"
    >
      <div className="absolute inset-0 bg-[#070d16]" />
      <div className="space-grid hero-grid-fade absolute inset-0 opacity-25" />
      <div className="page-seam-rise pointer-events-none absolute inset-x-0 bottom-0 h-24" />
    </div>
  );
}
