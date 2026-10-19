<script setup lang="ts">
import type { BrandInfo } from "~/composables/UseBarndInfo";
import type { ThemeColors } from "~/composables/useThemeColors";
import type { RadiusSettings } from "~/composables/useRadiusInfo";

useHead({ title: "Dashboard" });
// Pagina di servizio: non indicizzare
useSeoMeta({ robots: "noindex, nofollow" });

const { brandInfo, load: loadBrand, save: saveBrand } = useBrandInfo();
const { colors, load: loadTheme, save: saveTheme } = useThemeColors();
const { radius, load: loadRadius, save: saveRadius } = useRadiusSettings();

function copy<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

await Promise.all([loadBrand(), loadTheme(), loadRadius()]);

// Stato dei form: i componenti li modificano con v-model
const form = ref<BrandInfo>(copy(brandInfo.value));
const themeForm = ref<ThemeColors>({ ...colors.value });
const radiusForm = ref<RadiusSettings>({ ...radius.value });

// true quando un form è diverso dai dati salvati
const brandDirty = computed(
  () => JSON.stringify(form.value) !== JSON.stringify(brandInfo.value),
);
const themeDirty = computed(() =>
  themeFields.some(({ key }) => themeForm.value[key] !== colors.value[key]),
);
const radiusDirty = computed(() =>
  radiusFields.some(({ key }) => radiusForm.value[key] !== radius.value[key]),
);

const logoFile = ref<File | null>(null);
const logoDirty = computed(() => logoFile.value !== null);

const dirty = computed(
  () =>
    brandDirty.value ||
    themeDirty.value ||
    radiusDirty.value ||
    logoDirty.value,
);

const dirtyLabels = computed(() => {
  const labels: string[] = [];

  if (brandDirty.value) labels.push("Dati del sito");
  if (themeDirty.value) labels.push("Colori");
  if (radiusDirty.value) labels.push("Raggiature");
  if (logoDirty.value) labels.push("Logo");

  return labels;
});

const saving = ref(false);
const status = ref<{ type: "ok" | "error"; message: string } | null>(null);

// L'esito positivo resta visibile finché non modifichi qualcos'altro,
// così "Modifiche salvate" non si confonde con "Nessuna modifica"
function flash(type: "ok" | "error", message: string) {
  status.value = { type, message };
  if (type === "error") {
    setTimeout(() => {
      if (status.value?.message === message) status.value = null;
    }, 8000);
  }
}

watch(dirty, (isDirty) => {
  if (isDirty && status.value?.type === "ok") status.value = null;
});

async function onSubmit() {
  saving.value = true;
  const failed: string[] = [];

  // Salva solo ciò che è cambiato
  if (brandDirty.value) {
    try {
      await saveBrand(form.value);
      form.value = copy(brandInfo.value);
    } catch (e) {
      console.error("Salvataggio fallito: dati del sito", e);
      failed.push("Dati del sito");
    }
  }

  if (themeDirty.value) {
    try {
      await saveTheme(themeForm.value);
      themeForm.value = { ...colors.value };
    } catch (e) {
      console.error("Salvataggio fallito: colori", e);
      failed.push("Colori");
    }
  }

  if (radiusDirty.value) {
    try {
      await saveRadius(radiusForm.value);
      radiusForm.value = { ...radius.value };
    } catch (e) {
      console.error("Salvataggio fallito: raggiature", e);
      failed.push("Raggiature");
    }
  }

  saving.value = false;
  if (failed.length) {
    flash("error", `Errore nel salvataggio: ${failed.join(", ")}`);
  } else {
    const time = new Date().toLocaleTimeString("it-IT", {
      hour: "2-digit",
      minute: "2-digit",
    });
    flash("ok", `Modifiche salvate alle ${time}`);
  }
}
</script>

```vue
<template>
  <div class="min-h-screen">
    <div class="mx-auto max-w-3xl px-4 pb-32 pt-10">
      <h1 id="dashboard-title" class="text-2xl font-semibold text-gray-900">
        Dashboard
      </h1>

      <p class="mt-1 text-sm text-gray-500">
        I dati salvati qui sono quelli usati dal sito.
      </p>

      <form
        id="dashboard-form"
        aria-labelledby="dashboard-title"
        class="mt-8 flex flex-col gap-8"
        @submit.prevent="onSubmit"
      >
        <DashboardBrandInfo v-model="form" />
        <DashboardColorInfo v-model="themeForm" />
        <DashboardRadiusInfo v-model="radiusForm" />
        <!-- <DashboardLogoUpload v-model="logoFile" /> -->
      </form>
    </div>

    <!-- Barra delle azioni -->
    <div
      class="fixed inset-x-0 bottom-0 z-50 border-t border-gray-300 bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.08)]"
    >
      <div
        class="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3"
      >
        <p
          role="status"
          aria-live="polite"
          class="text-sm"
          :class="
            status
              ? status.type === 'ok'
                ? 'font-medium text-green-700'
                : 'font-medium text-red-600'
              : dirty
                ? 'text-amber-600'
                : 'text-gray-400'
          "
        >
          {{
            status
              ? status.message
              : dirty
                ? `Modifiche non salvate: ${dirtyLabels.join(", ")}`
                : "Nessuna modifica da salvare"
          }}
        </p>

        <button
          type="submit"
          form="dashboard-form"
          class="rounded-md bg-green-600 px-6 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="saving || !dirty"
        >
          {{ saving ? "Salvataggio…" : "Salva modifiche" }}
        </button>
      </div>
    </div>
  </div>
</template>
