"use client";

import { useEffect, useRef, useState } from "react";
import { PALETTES, type PaletteId } from "@/lib/palettes";
import { cn } from "@/lib/utils";

export { PALETTES, type PaletteId };

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

export function PaletteSwitch({ onChange }: { onChange?: (id: PaletteId) => void }) {
  const [palette, setPalette] = useState<PaletteId>("signal");

  useEffect(() => {
    const current = document.documentElement.dataset.palette ?? null;
    if (isPalette(current)) setPalette(current);
  }, []);

  const choose = (id: PaletteId) => {
    setPalette(id);
    applyPalette(id);
    onChange?.(id);
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

/** A closed swatch that opens the scheme list. */
export function PaletteMenu() {
  const [open, setOpen] = useState(false);
  const [palette, setPalette] = useState<PaletteId>("signal");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const current = document.documentElement.dataset.palette ?? null;
    if (isPalette(current)) setPalette(current);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const current = PALETTES.find((item) => item.id === palette) ?? PALETTES[0];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="palette-panel"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold text-white/80 transition hover:border-white/30 hover:text-white"
      >
        <span className="flex items-center" aria-hidden>
          <span
            className="size-3 rounded-full border border-black/30"
            style={{ background: current.primary }}
          />
          <span
            className="-ml-1 size-3 rounded-full border border-black/30"
            style={{ background: current.secondary }}
          />
        </span>
        Colors
      </button>
      {open ? (
        <div
          id="palette-panel"
          className="absolute right-0 z-50 mt-2 w-max max-w-[min(100vw-2rem,40rem)] rounded-2xl border border-white/10 bg-[#070d16]/95 p-3 shadow-xl backdrop-blur"
        >
          <PaletteSwitch onChange={setPalette} />
        </div>
      ) : null}
    </div>
  );
}
