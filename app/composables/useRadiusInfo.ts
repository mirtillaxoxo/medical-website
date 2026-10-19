export const radiusFields = [
  { key: "sm", label: "Piccola", default: 4 },
  { key: "md", label: "Media", default: 6 },
  { key: "lg", label: "Grande", default: 8 },
  { key: "xl", label: "Extra grande", default: 12 },
  { key: "2xl", label: "2XL", default: 16 },
  { key: "3xl", label: "3XL", default: 24 },
] as const;

export const RADIUS_MAX = 64;

export type RadiusKey = (typeof radiusFields)[number]["key"];
export type RadiusSettings = Record<RadiusKey, number | null>;

export function emptyRadius(): RadiusSettings {
  return Object.fromEntries(
    radiusFields.map((f) => [f.key, null]),
  ) as RadiusSettings;
}

function validPx(v: unknown): v is number {
  return (
    typeof v === "number" && Number.isFinite(v) && v >= 0 && v <= RADIUS_MAX
  );
}

// px → rem (così segue la dimensione del testo del browser)
export function pxToRem(px: number): string {
  return `${+(px / 16).toFixed(4)}rem`;
}

// Nel CSS finiscono solo numeri validi: niente testo libero
export function radiusToCss(radius: RadiusSettings): string {
  const rules = radiusFields.flatMap(({ key }) => {
    const v = radius[key];
    return validPx(v) ? [`--radius-${key}:${pxToRem(v)};`] : [];
  });
  return rules.length ? `:root{${rules.join("")}}` : "";
}

export function useRadiusSettings() {
  const radius = useState<RadiusSettings>("radius-settings", emptyRadius);
  const loaded = useState<boolean>("radius-settings-loaded", () => false);

  async function load(force = false) {
    if (loaded.value && !force) return;
    try {
      const data = await $fetch<Partial<RadiusSettings> | null>(
        "/api/brand/radius-info",
      );
      if (data) {
        const next = emptyRadius();
        for (const { key } of radiusFields) {
          next[key] = validPx(data[key]) ? data[key]! : null;
        }
        radius.value = next;
      }
    } catch {
      // API non raggiungibile: restano le raggiature predefinite
    }
    loaded.value = true;
  }

  async function save(next: RadiusSettings) {
    await $fetch("/api/brand/radius-info", { method: "PUT", body: next });
    radius.value = { ...next };
  }

  return { radius, load, save };
}

/** Inserisce le raggiature salvate come <style> nell'head (anche in SSR). */
export function useRadiusStyle() {
  const { radius } = useRadiusSettings();
  const css = computed(() => radiusToCss(radius.value));
  useHead({ style: [{ key: "radius-settings", innerHTML: css }] });
}
