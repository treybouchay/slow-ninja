import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col justify-center px-4 py-20 md:px-6">
      <div className="rounded-[2rem] border-2 border-[var(--ink)] bg-[var(--sun)] p-10 shadow-[10px_10px_0_var(--ink)]">
        <p className="font-mono-label text-[8px] uppercase md:text-[9px] tracking-widest">
          404
        </p>
        <h1 className="font-display mt-3 text-4xl font-bold text-[var(--ink)]">
          Whoops—ninja missed that page
        </h1>
        <p className="mt-4 text-[var(--ink)]/70">
          That URL isn&apos;t in our catalog. Try home or the journal.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/"
            className="btn-bounce rounded-full bg-[var(--ink)] px-5 py-3 text-sm font-bold text-[var(--lime)] shadow-[3px_3px_0_var(--coral)]"
          >
            Back home
          </Link>
          <Link
            href="/journal"
            className="rounded-full border-2 border-[var(--ink)] bg-white px-5 py-3 text-sm font-bold"
          >
            Journal
          </Link>
        </div>
      </div>
    </div>
  );
}
