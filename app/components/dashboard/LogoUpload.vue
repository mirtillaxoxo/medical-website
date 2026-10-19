<script setup lang="ts">
const model = defineModel<File | null>({ default: null });

const props = withDefaults(
  defineProps<{
    currentLogo?: string | null;
    maxSizeMB?: number;
  }>(),
  {
    currentLogo: null,
    maxSizeMB: 2,
  },
);

const previewUrl = ref<string | null>(null);
const errorMessage = ref("");
const inputRef = ref<HTMLInputElement | null>(null);

const displayedLogo = computed(
  () => previewUrl.value || props.currentLogo || null,
);

const hasNewLogo = computed(() => model.value instanceof File);

function openFilePicker() {
  inputRef.value?.click();
}

function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  errorMessage.value = "";

  if (!file) return;

  const allowedTypes = ["image/png", "image/svg+xml"];
  const allowedExtensions = /\.(png|svg)$/i;

  if (!allowedTypes.includes(file.type) || !allowedExtensions.test(file.name)) {
    errorMessage.value = "Seleziona un'immagine in formato PNG o SVG.";
    input.value = "";
    return;
  }

  if (file.size > props.maxSizeMB * 1024 * 1024) {
    errorMessage.value = `Il file supera il limite di ${props.maxSizeMB} MB.`;
    input.value = "";
    return;
  }

  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
  }

  model.value = file;
  previewUrl.value = URL.createObjectURL(file);
}

function removeSelection() {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
    previewUrl.value = null;
  }

  model.value = null;
  errorMessage.value = "";

  if (inputRef.value) {
    inputRef.value.value = "";
  }
}

onBeforeUnmount(() => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
  }
});
</script>

<template>
  <section class="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
    <div class="mb-5">
      <h2 class="text-lg font-semibold text-gray-900">Logo del sito</h2>

      <p class="mt-1 text-sm text-gray-500">
        Carica il logo che verrà utilizzato globalmente nel sito.
      </p>
    </div>

    <div
      class="flex min-h-40 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6"
    >
      <img
        v-if="displayedLogo"
        :src="displayedLogo"
        alt="Anteprima del logo del sito"
        class="max-h-32 max-w-full object-contain"
      />

      <div v-else class="flex flex-col items-center text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="mb-3 h-10 w-10 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3 16.5V19a2 2 0 002 2h14a2 2 0 002-2v-2.5M16 7l-4-4m0 0L8 7m4-4v12"
          />
        </svg>

        <p class="text-sm font-medium text-gray-700">Nessun logo selezionato</p>

        <p class="mt-1 text-xs text-gray-500">
          PNG con sfondo trasparente consigliato
        </p>
      </div>
    </div>

    <input
      ref="inputRef"
      type="file"
      accept="image/png,.png,image/svg+xml,.svg"
      class="hidden"
      @change="onFileChange"
    />

    <div class="mt-4 flex flex-wrap gap-3">
      <button
        type="button"
        class="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
        @click="openFilePicker"
      >
        {{ displayedLogo ? "Sostituisci logo" : "Carica logo PNG" }}
      </button>

      <button
        v-if="hasNewLogo"
        type="button"
        class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        @click="removeSelection"
      >
        Annulla selezione
      </button>
    </div>

    <p v-if="model" class="mt-3 break-all text-xs text-gray-500">
      File selezionato: {{ model.name }}
    </p>

    <p v-if="errorMessage" role="alert" class="mt-3 text-sm text-red-600">
      {{ errorMessage }}
    </p>

    <p class="mt-4 text-xs leading-relaxed text-gray-500">
      Formato PNG o SVG, massimo {{ maxSizeMB }} MB. Le modifiche saranno
      effettive sul sito dopo il caricamento definitivo e il salvataggio della
      configurazione.
    </p>
  </section>
</template>
