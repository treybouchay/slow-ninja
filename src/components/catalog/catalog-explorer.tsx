"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { DiagonalCaseView } from "@/components/catalog/views/diagonal-case";
import { FileCaseView } from "@/components/catalog/views/file-case";
import { ShelfView } from "@/components/catalog/views/shelf";
import { StarlaneView } from "@/components/catalog/views/starlane";

export type CatalogViewId =
  | "starlane"
  | "shelf"
  | "diagonal-case"
  | "file-case";

const VIEWS: {
  id: CatalogViewId;
  label: string;
  blurb: string;
}[] = [
  {
    id: "starlane",
    label: "Starlane",
    blurb: "Circles on a lane — wake, grow, pan",
  },
  {
    id: "shelf",
    label: "Shelf",
    blurb: "Standing boxes that pull like carts",
  },
  {
    id: "diagonal-case",
    label: "Diagonal case",
    blurb: "Top-down box, carts slide out & expand",
  },
  {
    id: "file-case",
    label: "File case",
    blurb: "Icon-style stack, pull up to expand",
  },
];

const STORAGE_KEY = "slow-ninja-catalog-view";
const DEFAULT_VIEW: CatalogViewId = "file-case";

function isViewId(value: string | null): value is CatalogViewId {
  return VIEWS.some((v) => v.id === value);
}

export function CatalogExplorer() {
  const [view, setView] = useState<CatalogViewId>(DEFAULT_VIEW);
  const [ready, setReady] = useState(false);

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

  const active = VIEWS.find((v) => v.id === view) ?? VIEWS[0];

  return (
    <div>
      {/* View switcher */}
      <div className="sticky top-[4.5rem] z-40 border-b border-white/10 bg-[#070d16]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between md:px-6">
          <div>
            <p className="font-mono-label text-[7px] tracking-widest text-[var(--cyan)] uppercase md:text-[8px]">
              Catalog views · experiment switcher
            </p>
            <p className="mt-1 text-sm text-white/55">{active.blurb}</p>
          </div>
          <div
            role="tablist"
            aria-label="Catalog interaction views"
            className="flex flex-wrap gap-2"
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
                      ? "border-[var(--lime)] bg-[var(--lime)] text-[var(--ink)]"
                      : "border-white/20 text-white/55 hover:border-white/40 hover:text-white",
                  )}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {view === "starlane" && <StarlaneView />}
      {view === "shelf" && <ShelfView />}
      {view === "diagonal-case" && <DiagonalCaseView />}
      {view === "file-case" && <FileCaseView />}
    </div>
  );
}
