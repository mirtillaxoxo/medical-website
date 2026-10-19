```vue
<script setup lang="ts">
import type { ThemeColors, ThemeKey } from "~/composables/useThemeColors";
import { suggestPalette, contrastRatio } from "~/utils/colors-harmony";
import type { HarmonyMode } from "~/utils/colors-harmony";

const form = defineModel<ThemeColors>({ required: true });

const inputClass =
  "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20";

const labelClass = "mb-1 block text-xs font-medium text-gray-600";

const cardClass =
  "space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm";

function cleanHex(value: string) {
  let v = value.trim();

  if (v) {
    if (!v.startsWith("#")) v = `#${v}`;

    if (/^#[0-9a-fA-F]{3}$/.test(v)) {
      v = "#" + [...v.slice(1)].map((c) => c + c).join("");
    }
  }

  return v.toLowerCase();
}

/* ---------- Generatore di palette ---------- */

const baseColor = ref(form.value.primary || "#029e9d");
const mode = ref<HarmonyMode>("complementary");

const modes = [
  {
    value: "complementary",
    label: "Complementari",
    hint: "Il secondario è il colore opposto a quello principale sulla ruota dei colori.",
  },
  {
    value: "shades",
    label: "Sfumature",
    hint: "Il secondario è una variante più chiara dello stesso colore.",
  },
] as const;

const modeHint = computed(
  () => modes.find((m) => m.value === mode.value)?.hint ?? "",
);

const suggestion = computed(() => suggestPalette(baseColor.value, mode.value));

const secondaryIndex = ref(0);
const darkIndex = ref(0);

watch(
  suggestion,
  (s) => {
    if (!s) return;
    secondaryIndex.value = s.defaultSecondary;
    darkIndex.value = s.defaultDark;
  },
  { immediate: true },
);

const pickedSecondary = computed(
  () => suggestion.value?.secondary[secondaryIndex.value] ?? "",
);

const pickedDark = computed(
  () => suggestion.value?.dark[darkIndex.value] ?? "",
);

const applied = ref(false);

function applyPalette() {
  if (!suggestion.value) return;

  form.value.primary = baseColor.value;
  form.value.secondary = pickedSecondary.value;
  form.value.dark = pickedDark.value;

  applied.value = true;
  setTimeout(() => (applied.value = false), 2500);
}

/* ---------- Ritocco manuale ---------- */

function normalizeHex(key: ThemeKey) {
  form.value[key] = cleanHex(form.value[key]);
}
const defaultColors: ThemeColors = {
  primary: "#029e9d",
  secondary: "#83c1c5",
  dark: "#014561",
};

function resetColor(key: ThemeKey) {
  form.value[key] = defaultColors[key];

  if (key === "primary") {
    baseColor.value = defaultColors.primary;
  }
}

function resetAll() {
  form.value = {
    primary: "#029e9d",
    secondary: "#83c1c5",
    dark: "#014561",
  };

  baseColor.value = "#029e9d";
  mode.value = "complementary";
  applied.value = false;
}

const textKeys: ThemeKey[] = ["primary", "dark"];

function contrastOnWhite(hex: string) {
  const ratio = contrastRatio(hex, "#ffffff");
  return ratio === null ? null : Math.round(ratio * 10) / 10;
}
</script>

<template>
  <div class="flex flex-col gap-8">
    <h2 class="text-xl font-bold text-gray-900">Colori</h2>

    <!-- Generatore di palette -->
    <section :class="cardClass" aria-labelledby="palette-generator-title">
      <div>
        <h3
          id="palette-generator-title"
          class="text-lg font-medium text-gray-900"
        >
          Generatore di palette
        </h3>

        <p class="mt-1 text-xs text-gray-500">
          Scegli il colore principale: il secondario e il testo scuro vengono
          proposti in automatico.
        </p>
      </div>

      <!-- Colore di base -->
      <div class="flex flex-wrap items-center gap-4">
        <div>
          <label for="palette-base-color-picker" class="sr-only">
            Selettore colore principale
          </label>
          <input
            id="palette-base-color-picker"
            v-model="baseColor"
            type="color"
            class="h-14 w-16 cursor-pointer rounded border border-gray-300 bg-white p-1"
          />
        </div>

        <div>
          <p class="text-sm font-medium text-gray-900">Colore principale</p>
          <p class="text-xs text-gray-500">
            Il punto di partenza della palette
          </p>
        </div>

        <div>
          <label for="palette-base-color-hex" class="sr-only">
            Codice esadecimale del colore principale
          </label>
          <input
            id="palette-base-color-hex"
            v-model="baseColor"
            :class="[inputClass, 'w-32 font-mono']"
            type="text"
            maxlength="7"
            pattern="#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})"
            placeholder="#3b82f6"
            title="Inserisci un colore esadecimale, ad esempio #3b82f6"
            @blur="baseColor = cleanHex(baseColor)"
          />
        </div>
      </div>

      <!-- Modalità -->
      <fieldset class="space-y-2">
        <legend class="mb-2 text-sm font-medium text-gray-900">
          Modalità di generazione
        </legend>

        <div class="inline-flex rounded-lg border border-gray-300 p-0.5">
          <button
            v-for="m in modes"
            :key="m.value"
            type="button"
            class="rounded-md px-4 py-1.5 text-sm font-medium"
            :aria-pressed="mode === m.value"
            :class="
              mode === m.value
                ? 'bg-gray-900 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            "
            @click="mode = m.value"
          >
            {{ m.label }}
          </button>
        </div>

        <p class="text-xs text-gray-500">{{ modeHint }}</p>
      </fieldset>

      <p v-if="!suggestion" class="text-sm text-amber-600" role="status">
        Inserisci un colore valido (#rrggbb) per vedere i suggerimenti.
      </p>

      <template v-else>
        <!-- Varianti proposte -->
        <div class="grid gap-6 sm:grid-cols-2">
          <fieldset>
            <legend class="text-sm font-medium text-gray-900">
              Secondario
            </legend>
            <p class="text-xs text-gray-500">Bordi, badge, sfondi tenui</p>

            <div class="mt-3 flex gap-2">
              <button
                v-for="(hex, i) in suggestion.secondary"
                :key="`s-${i}`"
                type="button"
                class="h-10 w-10 rounded-full"
                :class="
                  i === secondaryIndex
                    ? 'ring-2 ring-gray-900 ring-offset-2'
                    : 'ring-1 ring-gray-300'
                "
                :style="{ backgroundColor: hex }"
                :title="hex"
                :aria-label="`Seleziona colore secondario ${hex}`"
                :aria-pressed="i === secondaryIndex"
                @click="secondaryIndex = i"
              />
            </div>
          </fieldset>

          <fieldset>
            <legend class="text-sm font-medium text-gray-900">
              Testo scuro
            </legend>
            <p class="text-xs text-gray-500">Titoli e testo principale</p>

            <div class="mt-3 flex gap-2">
              <button
                v-for="(hex, i) in suggestion.dark"
                :key="`d-${i}`"
                type="button"
                class="h-10 w-10 rounded-full"
                :class="
                  i === darkIndex
                    ? 'ring-2 ring-gray-900 ring-offset-2'
                    : 'ring-1 ring-gray-300'
                "
                :style="{ backgroundColor: hex }"
                :title="hex"
                :aria-label="`Seleziona colore testo scuro ${hex}`"
                :aria-pressed="i === darkIndex"
                @click="darkIndex = i"
              />
            </div>
          </fieldset>
        </div>

        <!-- Anteprima palette -->
        <div
          class="overflow-hidden rounded-lg ring-1 ring-gray-200"
          role="group"
          aria-label="Anteprima della palette selezionata"
        >
          <div class="grid grid-cols-3 text-xs font-medium">
            <div
              class="px-3 py-5 text-white"
              :style="{ backgroundColor: baseColor }"
            >
              Principale
              <br />
              <span class="font-mono font-normal">{{ baseColor }}</span>
            </div>

            <div
              class="px-3 py-5 text-white"
              :style="{ backgroundColor: pickedSecondary }"
            >
              Secondario
              <br />
              <span class="font-mono font-normal">
                {{ pickedSecondary }}
              </span>
            </div>

            <div
              class="px-3 py-5 text-white"
              :style="{ backgroundColor: pickedDark }"
            >
              Testo scuro
              <br />
              <span class="font-mono font-normal">{{ pickedDark }}</span>
            </div>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <button
            type="button"
            class="rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black"
            @click="applyPalette"
          >
            Applica questa palette
          </button>

          <span
            v-if="applied"
            class="text-sm text-green-700"
            role="status"
            aria-live="polite"
          >
            Palette applicata: controlla i campi qui sotto
          </span>
        </div>
      </template>
    </section>

    <!-- Ritocco manuale -->
    <section :class="cardClass" aria-labelledby="site-colors-title">
      <div class="flex items-start justify-between gap-4">
        <div>
          <h3 id="site-colors-title" class="text-lg font-medium text-gray-900">
            Colori del sito
          </h3>
          <p class="mt-1 text-xs text-gray-500">
            Puoi ritoccarli a mano. Un campo vuoto usa il colore predefinito.
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

      <div
        v-for="field in themeFields"
        :key="field.key"
        class="flex flex-wrap items-center gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4"
      >
        <div>
          <label :for="`theme-color-picker-${field.key}`" class="sr-only">
            Selettore colore: {{ field.label }}
          </label>
          <input
            :id="`theme-color-picker-${field.key}`"
            type="color"
            class="h-12 w-14 cursor-pointer rounded border border-gray-300 bg-white p-1"
            :value="form[field.key] || '#000000'"
            @input="form[field.key] = ($event.target as HTMLInputElement).value"
          />
        </div>

        <div class="min-w-40 flex-1">
          <p class="text-sm font-medium text-gray-900">
            {{ field.label }}
          </p>
          <p class="text-xs text-gray-500">{{ field.hint }}</p>

          <p
            v-if="
              textKeys.includes(field.key) &&
              contrastOnWhite(form[field.key]) !== null
            "
            class="mt-1 text-xs"
            :class="
              contrastOnWhite(form[field.key])! >= 4.5
                ? 'text-green-700'
                : 'text-amber-600'
            "
          >
            Contrasto su bianco:
            {{ contrastOnWhite(form[field.key]) }}:1 ·
            {{
              contrastOnWhite(form[field.key])! >= 4.5
                ? "leggibile"
                : "basso, poco leggibile come testo"
            }}
          </p>
        </div>

        <div>
          <label :for="`theme-color-hex-${field.key}`" :class="labelClass">
            {{ field.label }} — codice HEX
          </label>
          <input
            :id="`theme-color-hex-${field.key}`"
            v-model="form[field.key]"
            :name="`theme-${field.key}`"
            :class="[inputClass, 'w-32 font-mono']"
            type="text"
            maxlength="7"
            pattern="#[0-9a-fA-F]{6}"
            placeholder="Predefinito"
            title="Formato #rrggbb, ad esempio #1a2b3c"
            @blur="normalizeHex(field.key)"
          />
        </div>

        <button
          type="button"
          class="text-sm text-gray-500 hover:text-gray-900 hover:underline disabled:opacity-30"
          :disabled="!form[field.key]"
          :aria-label="`Ripristina colore predefinito per ${field.label}`"
          @click="resetColor(field.key)"
        >
          Predefinito
        </button>
      </div>
    </section>
  </div>
</template>
