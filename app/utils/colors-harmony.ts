// utils/colorHarmony.ts
// Calcoli sui colori per il generatore di palette (auto-importati).

export type HarmonyMode = "complementary" | "shades";

interface Hsl {
  h: number;
  s: number;
  l: number;
}

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));
const wrapHue = (h: number) => ((h % 360) + 360) % 360;

export function hexToHsl(hex: string): Hsl | null {
  const m = /^#([0-9a-f]{6})$/i.exec(hex ?? "");
  if (!m) return null;
  const n = parseInt(m[1]!, 16);
  const r = ((n >> 16) & 255) / 255;
  const g = ((n >> 8) & 255) / 255;
  const b = (n & 255) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  const l = (max + min) / 2;

  let h = 0;
  let s = 0;
  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1));
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
  }
  return { h: wrapHue(h), s: s * 100, l: l * 100 };
}

export function hslToHex(h: number, s: number, l: number): string {
  const sat = clamp(s, 0, 100) / 100;
  const lig = clamp(l, 0, 100) / 100;
  const c = (1 - Math.abs(2 * lig - 1)) * sat;
  const hp = wrapHue(h) / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));

  let rgb: [number, number, number];
  if (hp < 1) rgb = [c, x, 0];
  else if (hp < 2) rgb = [x, c, 0];
  else if (hp < 3) rgb = [0, c, x];
  else if (hp < 4) rgb = [0, x, c];
  else if (hp < 5) rgb = [x, 0, c];
  else rgb = [c, 0, x];

  const m = lig - c / 2;
  const toHex = (v: number) =>
    Math.round((v + m) * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(rgb[0])}${toHex(rgb[1])}${toHex(rgb[2])}`;
}

export interface PaletteSuggestion {
  secondary: string[]; // 5 varianti per il colore secondario
  dark: string[]; // 5 varianti per il testo scuro
  defaultSecondary: number; // indice proposto di default
  defaultDark: number;
}

/**
 * A partire dal colore principale propone secondario e testo scuro.
 * - complementary: il secondario è il colore opposto sulla ruota (+180°)
 * - shades: il secondario è una variante più chiara della stessa tinta
 * Il testo scuro è sempre una variante molto scura e poco satura della tinta base.
 */
export function suggestPalette(
  base: string,
  mode: HarmonyMode,
): PaletteSuggestion | null {
  const hsl = hexToHsl(base);
  if (!hsl) return null;
  const { h, s, l } = hsl;

  const dark = [8, 12, 16, 20, 25].map((lightness) =>
    hslToHex(h, Math.min(s, 40), lightness),
  );

  if (mode === "complementary") {
    const secondary = [-15, -7, 0, 7, 15].map((delta) =>
      hslToHex(h + 180, s, clamp(l + delta, 25, 85)),
    );
    return { secondary, dark, defaultSecondary: 2, defaultDark: 1 };
  }

  const secondary = [34, 26, 18, 10, -8].map((delta) =>
    hslToHex(h, s, clamp(l + delta, 25, 92)),
  );
  return { secondary, dark, defaultSecondary: 1, defaultDark: 1 };
}

function relativeLuminance(hex: string): number | null {
  const m = /^#([0-9a-f]{6})$/i.exec(hex ?? "");
  if (!m) return null;
  const n = parseInt(m[1]!, 16);
  const lin = (v: number) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return (
    0.2126 * lin((n >> 16) & 255) +
    0.7152 * lin((n >> 8) & 255) +
    0.0722 * lin(n & 255)
  );
}

/** Rapporto di contrasto WCAG tra due colori (1–21). 4.5 è il minimo per il testo. */
export function contrastRatio(a: string, b: string): number | null {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  if (la === null || lb === null) return null;
  const hi = Math.max(la, lb);
  const lo = Math.min(la, lb);
  return (hi + 0.05) / (lo + 0.05);
}
