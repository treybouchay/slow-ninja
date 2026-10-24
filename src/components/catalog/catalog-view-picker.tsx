"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

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
  { id: "starlane", label: "Starlane" },
  { id: "constellation", label: "Constellation" },
  { id: "diagonal-lane", label: "Diagonal lane" },
  { id: "shelf", label: "Shelf" },
  { id: "diagonal-case", label: "Diagonal case" },
  { id: "file-case", label: "File case" },
];

const STORAGE_KEY = "slow-ninja-catalog-view-v2";
const DEFAULT_VIEW: CatalogViewId = "starlane";

function isViewId(value: string | null): value is CatalogViewId {
  return VIEWS.some((v) => v.id === value);
}

const CatalogViewContext = createContext<{
  view: CatalogViewId;
  setView: (view: CatalogViewId) => void;
} | null>(null);

export function CatalogViewProvider({ children }: { children: ReactNode }) {
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

  return (
    <CatalogViewContext.Provider value={{ view, setView }}>
      {children}
    </CatalogViewContext.Provider>
  );
}

export function useCatalogView() {
  const ctx = useContext(CatalogViewContext);
  if (!ctx) {
    throw new Error("useCatalogView must be used within CatalogViewProvider");
  }
  return ctx;
}

/** View choices under the catalog intro. The selected pill is lime with a cyan underlay. */
export function CatalogViewPicker() {
  const ctx = useContext(CatalogViewContext);
  if (!ctx) return null;
  const { view, setView } = ctx;

  return (
    <div
      role="tablist"
      aria-label="Catalog interaction views"
      className="mt-5 flex flex-wrap gap-3 pb-1"
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
              "rounded-full px-3 py-1.5 font-mono-label text-[8px] tracking-widest uppercase transition",
              selected
                ? "bg-[var(--lime)] font-bold text-[var(--ink)] shadow-[4px_4px_0_var(--cyan)]"
                : "border border-white/15 text-white/55 hover:border-white/30 hover:text-white/80",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
