/** Site colour scheme — Rose only. */
export const ROSE = {
  id: "rose",
  label: "Rose",
  primary: "#ffc0d4",
  secondary: "#ff4d7a",
} as const;

/** Clears any leftover palette preference and locks Rose before paint. */
export const paletteBootScript = `try{localStorage.removeItem('slow-ninja-palette');var r=document.documentElement;r.dataset.palette='rose';r.style.setProperty('--lime','${ROSE.primary}');r.style.setProperty('--cyan','${ROSE.secondary}')}catch(e){}`;
