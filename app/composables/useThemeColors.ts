// Per aggiungere un colore basta una riga qui (e in server/api/brand/theme.put.ts).
export const themeFields = [
  {
    key: "primary",
    label: "Colore principale",
    hint: "Parole in evidenza, link, pulsanti",
  },
  {
    key: "secondary",
    label: "Colore secondario",
    hint: "Bordi, badge, sfondi tenui",
  },
  {
    key: "dark",
    label: "Testo scuro",
    hint: "Titoli e testo principale",
  },
] as const;

export type ThemeKey = (typeof themeFields)[number]["key"];
export type ThemeColors = Record<ThemeKey, string>;

export function emptyTheme(): ThemeColors {
  return Object.fromEntries(themeFields.map((f) => [f.key, ""])) as ThemeColors;
}

// "#1a2b3c" → "26 43 60" (per Tailwind v3: rgb(var(--x-rgb) / <alpha-value>))
// Restituisce "" se non è un esadecimale valido: serve anche da sicurezza,
// perché nel CSS finisce solo ciò che passa da qui.
export function hexToRgbChannels(hex: string): string {
  const m = /^#([0-9a-f]{6})$/i.exec(hex ?? "");
  if (!m) return "";
  const n = parseInt(m[1]!, 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

export function themeToCss(colors: ThemeColors): string {
  const rules = themeFields.flatMap(({ key }) => {
    const rgb = hexToRgbChannels(colors[key]);
    return rgb
      ? [`--color-${key}:${colors[key]};`, `--color-${key}-rgb:${rgb};`]
      : [];
  });
  return rules.length ? `:root{${rules.join("")}}` : "";
}

export function useThemeColors() {
  const colors = useState<ThemeColors>("theme-colors", emptyTheme);
  const loaded = useState<boolean>("theme-colors-loaded", () => false);

  async function load(force = false) {
    if (loaded.value && !force) return;
    try {
      const data = await $fetch<Partial<ThemeColors> | null>(
        "/api/brand/colors-info",
      );
      if (data) colors.value = { ...emptyTheme(), ...data };
    } catch {
      // API non raggiungibile: restano i colori predefiniti
    }
    loaded.value = true;
  }

  async function save(next: ThemeColors) {
    await $fetch("/api/brand/colors-info", { method: "PUT", body: next });
    colors.value = { ...next };
  }

  return { colors, load, save };
}

/** Inserisce i colori salvati come <style> nell'head (anche in SSR, senza flash). */
export function useThemeStyle() {
  const { colors } = useThemeColors();
  const css = computed(() => themeToCss(colors.value));
  useHead({ style: [{ key: "theme-colors", innerHTML: css }] });
}
