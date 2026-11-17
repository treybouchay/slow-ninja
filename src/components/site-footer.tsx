import { BrandLogo } from "@/components/brand-logo";

export function SiteFooter() {
  return (
    <footer className="mt-auto px-4 pb-8 md:px-6">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-[var(--night)] px-6 py-12 text-white md:px-10">
        <div className="space-grid pointer-events-none absolute inset-0 opacity-25" />
        <div className="relative">
          <BrandLogo size="footer" />
          <p className="mt-4 max-w-md text-white/65">
            Building games for the sentient since 2014. Skill first, galaxies
            you can peek into, vibes included.
          </p>
        </div>
        <p className="font-mono-label relative mt-10 text-[8px] leading-relaxed tracking-wide text-white/40 md:text-[9px]">
          © 2026 Slow Ninja Inc. · Built with deliberate haste
        </p>
      </div>
    </footer>
  );
}
