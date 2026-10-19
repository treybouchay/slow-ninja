import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col justify-center px-5 py-20 md:px-8">
      <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.22em] text-[var(--copper)]">
        404
      </p>
      <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-bold text-[var(--paper)]">
        This sector is empty
      </h1>
      <p className="mt-4 text-[var(--mist)]">
        The page you requested is not in our catalog. Try the games list or the
        journal archive.
      </p>
      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          href="/"
          className="rounded-sm bg-[var(--signal)] px-4 py-2.5 font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.14em] text-[var(--ink)]"
        >
          Return home
        </Link>
        <Link
          href="/journal"
          className="rounded-sm border border-[var(--line)] px-4 py-2.5 font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.14em] text-[var(--paper)]"
        >
          Open journal
        </Link>
      </div>
    </div>
  );
}
