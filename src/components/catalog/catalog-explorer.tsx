"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ConstellationView } from "@/components/catalog/views/constellation";
import { DiagonalCaseView } from "@/components/catalog/views/diagonal-case";
import { DiagonalLaneView } from "@/components/catalog/views/diagonal-lane";
import { FileCaseView } from "@/components/catalog/views/file-case";
import { ShelfView } from "@/components/catalog/views/shelf";
import { StarlaneView } from "@/components/catalog/views/starlane";

export type CatalogViewId =
  | "starlane"
  | "diagonal-lane"
  | "constellation"
  | "shelf"
  | "diagonal-case"
  | "file-case";

const VIEWS: {
  id: CatalogViewId;
  label: string;
}[] = [
  { id: "constellation", label: "Constellation" },
  { id: "starlane", label: "Starlane" },
  { id: "diagonal-lane", label: "Diagonal lane" },
  { id: "shelf", label: "Shelf" },
  { id: "diagonal-case", label: "Diagonal case" },
  { id: "file-case", label: "File case" },
];

const STORAGE_KEY = "slow-ninja-catalog-view";
const DEFAULT_VIEW: CatalogViewId = "constellation";

function isViewId(value: string | null): value is CatalogViewId {
  return VIEWS.some((v) => v.id === value);
}

export function CatalogExplorer() {
  const [view, setView] = useState<CatalogViewId>(DEFAULT_VIEW);
  const [ready, setReady] = useState(false);
  const [labsOpen, setLabsOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (isViewId(saved)) setView(saved);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, view);
    } catch {
      /* ignore */
    }
  }, [view, ready]);

  return (
    <div>
      {/* Quiet labs toggle — no sticky chrome on the first scroll */}
      <div className="mx-auto flex max-w-6xl items-center justify-end px-4 pt-2 md:px-6">
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setLabsOpen((v) => !v)}
          className="font-mono-label text-[8px] tracking-widest text-white/35 uppercase transition hover:text-white/60"
          aria-expanded={labsOpen}
        >
          {labsOpen ? "Hide labs ←" : "Labs →"}
        </button>
      </div>

      {labsOpen ? (
        <div
          role="tablist"
          aria-label="Catalog interaction views"
          className="mx-auto mt-2 flex max-w-6xl flex-wrap gap-2 px-4 pb-2 md:px-6"
        >
          {VIEWS.map((option) => {
            const selected = option.id === view;
            return (
              <button
                key={option.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setView(option.id)}
                className={cn(
                  "rounded-full border px-3 py-1.5 font-mono-label text-[8px] tracking-widest uppercase transition",
                  selected
                    ? "border-white/40 bg-white/10 text-white"
                    : "border-white/10 text-white/40 hover:border-white/25 hover:text-white/70",
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      ) : null}

      {view === "constellation" && <ConstellationView />}
      {view === "starlane" && <StarlaneView />}
      {view === "diagonal-lane" && <DiagonalLaneView />}
      {view === "shelf" && <ShelfView />}
      {view === "diagonal-case" && <DiagonalCaseView />}
      {view === "file-case" && <FileCaseView />}
    </div>
  );
}
