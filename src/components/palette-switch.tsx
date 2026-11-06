"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export const PALETTES = [
  {
    id: "signal",
    label: "Signal",
    primary: "#c8f542",
    secondary: "#4de2e8",
  },
  {
    id: "gold",
    label: "Gold",
    primary: "#f3c15b",
    secondary: "#e08a3c",
  },
  {
    id: "lilac",
    label: "Lilac",
    primary: "#e4d4ff",
    secondary: "#ff7a59",
  },
] as const;

export type PaletteId = (typeof PALETTES)[number]["id"];

const STORAGE_KEY = "slow-ninja-palette";

function isPalette(value: string | null): value is PaletteId {
  return PALETTES.some((palette) => palette.id === value);
}

/** Sets the action colors on the document so every var(--lime) / var(--cyan) updates. */
export function applyPalette(id: PaletteId) {
  const root = document.documentElement;
  const palette = PALETTES.find((item) => item.id === id) ?? PALETTES[0];
  if (palette.id === "signal") {
    delete root.dataset.palette;
    root.style.removeProperty("--lime");
    root.style.removeProperty("--cyan");
    return;
  }
  root.dataset.palette = palette.id;
  root.style.setProperty("--lime", palette.primary);
  root.style.setProperty("--cyan", palette.secondary);
}

export function PaletteSwitch() {
  const [palette, setPalette] = useState<PaletteId>("signal");

  useEffect(() => {
    const current = document.documentElement.dataset.palette ?? null;
    if (isPalette(current)) setPalette(current);
  }, []);

  const choose = (id: PaletteId) => {
    setPalette(id);
    applyPalette(id);
    try {
      window.localStorage.setItem(STORAGE_KEY, id);
    } catch {
      /* ignore */
    }
  };

  return (
    <div
      role="radiogroup"
      aria-label="Color schemes"
      className="flex flex-wrap items-center gap-2"
    >
      {PALETTES.map((option) => {
        const selected = option.id === palette;
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => choose(option.id)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition",
              selected
                ? "border-white/40 bg-white/10 text-white"
                : "border-white/15 text-white/55 hover:border-white/30 hover:text-white",
            )}
          >
            <span className="flex items-center">
              <span
                className="size-3 rounded-full border border-black/30"
                style={{ background: option.primary }}
              />
              <span
                className="-ml-1 size-3 rounded-full border border-black/30"
                style={{ background: option.secondary }}
              />
            </span>
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
