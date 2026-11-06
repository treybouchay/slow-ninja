export const PALETTES = [
  { id: "signal", label: "Signal", primary: "#c8f542", secondary: "#4de2e8" },
  { id: "gold", label: "Gold", primary: "#f3c15b", secondary: "#e08a3c" },
  { id: "lilac", label: "Lilac", primary: "#e4d4ff", secondary: "#ff7a59" },
  { id: "mint", label: "Mint", primary: "#9af0c8", secondary: "#1aa58a" },
  { id: "sky", label: "Sky", primary: "#c5e4ff", secondary: "#3d7dff" },
  { id: "rose", label: "Rose", primary: "#ffc0d4", secondary: "#ff4d7a" },
  { id: "ember", label: "Ember", primary: "#ffc48c", secondary: "#ff5a36" },
] as const;

export type PaletteId = (typeof PALETTES)[number]["id"];

/** Boot script so a saved scheme is applied before paint. */
export const paletteBootScript = `try{var m=${JSON.stringify(
  Object.fromEntries(
    PALETTES.filter((palette) => palette.id !== "signal").map((palette) => [
      palette.id,
      [palette.primary, palette.secondary],
    ]),
  ),
)};var p=localStorage.getItem('slow-ninja-palette');if(m[p]){document.documentElement.dataset.palette=p;document.documentElement.style.setProperty('--lime',m[p][0]);document.documentElement.style.setProperty('--cyan',m[p][1])}}catch(e){}`;
