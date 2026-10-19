<script setup lang="ts">
// components/DashboardRadiusInfo.vue
// Raggiature globali: preset + regolazione di ogni misura + anteprima in diretta.
// Il salvataggio sta nella pagina.
import type { RadiusKey, RadiusSettings } from "~/composables/useRadiusInfo";

const form = defineModel<RadiusSettings>({ required: true });

const cardClass =
  "space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm";

/* ---------- Preset ---------- */

// factor = moltiplicatore dei valori predefiniti. null = predefinito di Tailwind
const presets = [
  { label: "Squadrato", factor: 0 },
  { label: "Leggero", factor: 0.5 },
  { label: "Standard", factor: null },
  { label: "Arrotondato", factor: 1.5 },
  { label: "Molto arrotondato", factor: 2.5 },
] as const;

function presetValue(def: number, factor: number | null): number | null {
  return factor === null
    ? null
    : Math.min(RADIUS_MAX, Math.round(def * factor));
}

function applyPreset(factor: number | null) {
  for (const field of radiusFields) {
    form.value[field.key] = presetValue(field.default, factor);
  }
}

const activePreset = computed(
  () =>
    presets.find((p) =>
      radiusFields.every(
        (f) => form.value[f.key] === presetValue(f.default, p.factor),
      ),
    )?.label ?? null,
);

/* ---------- Regolazione singola ---------- */

function setRadius(key: RadiusKey, value: string) {
  const n = Number(value);
  form.value[key] = Number.isFinite(n)
    ? Math.min(RADIUS_MAX, Math.max(0, Math.round(n)))
    : null;
}

function resetRadius(key: RadiusKey) {
  form.value[key] = null;
}

function resetAll() {
  form.value = emptyRadius();
}

/* ---------- Anteprima in diretta ---------- */

function setPreview(on: boolean) {
  if (!import.meta.client) return;
  try {
    const root = document.documentElement;
    for (const { key } of radiusFields) {
      const v = form.value[key];
      if (on && typeof v === "number") {
        root.style.setProperty(`--radius-${key}`, pxToRem(v));
      } else {
        root.style.removeProperty(`--radius-${key}`);
      }
    }
  } catch (e) {
    console.warn("Anteprima raggiature non disponibile", e);
  }
}

onMounted(() => {
  setPreview(true);
  watch(form, () => setPreview(true), { deep: true });
});
onBeforeUnmount(() => setPreview(false));
</script>

<template>
  <div class="flex flex-col gap-8">
    <h2 class="text-xl font-bold text-gray-900">Raggiature</h2>
    <section :class="cardClass">
      <div class="flex items-start justify-between gap-4">
        <div>
          <h2 class="text-lg font-medium text-gray-900">Raggiature</h2>
          <p class="mt-1 text-xs text-gray-500">
            Arrotondamento degli angoli di pulsanti, card e immagini in tutto il
            sito. Un valore vuoto usa quello predefinito.
          </p>
        </div>
        <button
          type="button"
          class="shrink-0 rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
          @click="resetAll"
        >
          Ripristina predefiniti
        </button>
      </div>

      <!-- Preset -->
      <div>
        <p class="mb-2 text-sm font-medium text-gray-900">Stile</p>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="preset in presets"
            :key="preset.label"
            type="button"
            class="rounded-md border px-4 py-1.5 text-sm font-medium"
            :class="
              activePreset === preset.label
                ? 'border-gray-900 bg-gray-900 text-white'
                : 'border-gray-300 text-gray-700 hover:bg-gray-100'
            "
            @click="applyPreset(preset.factor)"
          >
            {{ preset.label }}
          </button>
        </div>
      </div>

      <!-- Regolazione di ogni misura -->
      <div
        v-for="field in radiusFields"
        :key="field.key"
        class="flex flex-wrap items-center gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4"
      >
        <div
          class="h-12 w-12 shrink-0 border-2 border-gray-400 bg-white"
          :style="{
            borderRadius: `var(--radius-${field.key}, ${pxToRem(field.default)})`,
          }"
        />
        <div class="min-w-32 flex-1">
          <p class="text-sm font-medium text-gray-900">{{ field.label }}</p>
          <p class="font-mono text-xs text-gray-500">rounded-{{ field.key }}</p>
        </div>
        <input
          type="range"
          min="0"
          :max="RADIUS_MAX"
          step="1"
          class="min-w-40 flex-1 accent-gray-900"
          :value="form[field.key] ?? field.default"
          :aria-label="`Raggiatura ${field.label}`"
          @input="
            setRadius(field.key, ($event.target as HTMLInputElement).value)
          "
        />
        <span class="w-28 text-sm text-gray-700">
          <template v-if="form[field.key] === null">
            Predefinito ({{ field.default }} px)
          </template>
          <template v-else>{{ form[field.key] }} px</template>
        </span>
        <button
          type="button"
          class="text-sm text-gray-500 hover:text-gray-900 hover:underline disabled:opacity-30"
          :disabled="form[field.key] === null"
          @click="resetRadius(field.key)"
        >
          Predefinito
        </button>
      </div>
    </section>

    <!-- Anteprima -->
    <section :class="cardClass">
      <h2 class="text-lg font-medium text-gray-900">Anteprima raggiature</h2>
      <div class="rounded-lg bg-white p-6 ring-1 ring-gray-200">
        <div class="flex flex-wrap items-center gap-4">
          <button
            type="button"
            class="rounded-md bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white"
          >
            Pulsante
          </button>
          <button
            type="button"
            class="rounded-lg border border-gray-400 px-5 py-2.5 text-sm font-semibold text-gray-800"
          >
            Pulsante grande
          </button>
          <span
            class="rounded-full bg-gray-200 px-4 py-1.5 text-xs font-medium uppercase tracking-wide text-gray-700"
          >
            Etichetta (sempre tonda)
          </span>
        </div>
        <div
          class="mt-5 max-w-sm rounded-xl border border-gray-300 bg-gray-50 p-5"
        >
          <p class="text-sm font-semibold text-gray-900">Card di esempio</p>
          <p class="mt-1 text-sm text-gray-600">
            Così si vedono gli angoli di un riquadro con la raggiatura "extra
            grande".
          </p>
          <div class="mt-4 h-20 rounded-lg bg-gray-300" />
        </div>
      </div>
    </section>
  </div>
</template>
