<script setup lang="ts">
import { tiks } from "@rexa-developer/tiks";

const route = useRoute();

onMounted(() => {
  tiks.init();
});

/**
 * FORM
 */
const name = ref<string>("");
const surname = ref<string>("");
const email = ref<string>("");
const telephone = ref<string>("");
const address = ref<string>("");
const privacyConsent = ref<boolean>(false);

const formSubmitted = ref(false);
const formError = ref(false);
const loading = ref(false);

/**
 * QUERY PARAMS
 */
const examName = computed(() =>
  typeof route.query.exam_name === "string" ? route.query.exam_name : "",
);

const datetime = computed(() =>
  typeof route.query.datetime === "string" ? route.query.datetime : "",
);

const struttura = computed(() =>
  typeof route.query.struttura === "string" ? route.query.struttura : "",
);

const examId = computed(() =>
  typeof route.query.exam_id === "string" ? route.query.exam_id : undefined,
);

const structureId = computed(() =>
  typeof route.query.structure_id === "string"
    ? route.query.structure_id
    : undefined,
);

const redirectUrl = computed(() =>
  typeof route.query.redirect === "string" ? route.query.redirect : undefined,
);

const source = computed(() =>
  typeof route.query.source === "string" ? route.query.source : undefined,
);

/**
 * TIPO ESAME
 */
const isSanityExam = computed(() => {
  return source.value === "sanity";
});

/**
 * VISITA A DOMICILIO
 */
const homeService = computed(() => {
  return struttura.value.toLowerCase().includes("domicilio");
});

/**
 * PREZZO
 */
const priceDisplay = ref<string | null>(null);

/**
 * CAPITALIZE
 */
const capitalize = (value: string | undefined | null) => {
  if (!value) return "";

  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

/**
 * INVIO PRENOTAZIONE
 */
const sendRegistration = async () => {
  loading.value = true;
  formError.value = false;

  try {
    const body = {
      name: capitalize(name.value),
      surname: capitalize(surname.value),
      email: email.value.trim(),
      telephone: telephone.value.trim(),
      address: homeService.value ? address.value.trim() : undefined,

      exam_name: examName.value,
      datetime: datetime.value,
      struttura: struttura.value,

      structure_id: structureId.value,

      priceDisplay: priceDisplay.value,

      source: source.value,

      /**
       * Il riferimento Sanity viene creato
       * solamente per gli esami provenienti da Sanity.
       */
      ...(isSanityExam.value && examId.value
        ? {
            exam_id: {
              _type: "reference",
              _ref: examId.value,
            },
          }
        : {}),
    };

    console.log("Reservation payload:", body);

    await $fetch("/api/reservations", {
      method: "POST",
      body,
    });

    tiks.success();

    /**
     * HUMANITAS
     *
     * Dopo aver salvato la prenotazione,
     * portiamo l'utente al sito Humanitas.
     */
    if (!isSanityExam.value && redirectUrl.value) {
      setTimeout(() => {
        window.location.assign(redirectUrl.value!);
      }, 250);

      return;
    }

    /**
     * SANITY
     *
     * Rimaniamo sulla pagina e mostriamo
     * il messaggio di conferma.
     */
    formSubmitted.value = true;
  } catch (error) {
    console.error("Errore invio prenotazione:", error);

    tiks.error?.();

    formError.value = true;
    formSubmitted.value = true;
  } finally {
    loading.value = false;
  }
};
</script>
<template>
  <div
    class="flex flex-col md:flex-row gap-10 items-start max-w-6xl mx-auto p-6"
  >
    <!-- CARD ESAME -->
    <aside class="w-full md:w-2/4 md:sticky md:top-10">
      <ExamBookingCard @price-ready="priceDisplay = $event" />
    </aside>

    <!-- FORM -->
    <section
      v-if="!loading && !formSubmitted"
      aria-label="form prenotazione"
      class="w-full md:w-2/4"
    >
      <form
        class="flex flex-col gap-6 w-full"
        @submit.prevent="sendRegistration"
      >
        <div class="grid grid-cols-1 gap-6">
          <!-- NOME -->
          <label class="flex flex-col gap-2">
            <span class="font-semibold text-dark"> Nome </span>

            <input
              v-model="name"
              type="text"
              name="name"
              autocomplete="given-name"
              required
            />
          </label>

          <!-- COGNOME -->
          <label class="flex flex-col gap-2">
            <span class="font-semibold text-dark"> Cognome </span>

            <input
              v-model="surname"
              type="text"
              name="surname"
              autocomplete="family-name"
              required
            />
          </label>

          <!-- EMAIL -->
          <label class="flex flex-col gap-2">
            <span class="font-semibold text-dark"> E-mail </span>

            <input
              v-model="email"
              type="email"
              name="email"
              autocomplete="email"
              required
            />
          </label>

          <!-- TELEFONO -->
          <label class="flex flex-col gap-2">
            <span class="font-semibold text-dark"> Telefono </span>

            <input
              v-model="telephone"
              type="tel"
              name="telephone"
              autocomplete="tel"
              required
            />
          </label>
        </div>

        <!-- INDIRIZZO -->
        <label v-if="homeService" for="address" class="flex flex-col gap-2">
          <span class="font-semibold text-dark"> Indirizzo </span>

          <input
            id="address"
            v-model="address"
            type="text"
            name="address"
            autocomplete="street-address"
            required
          />
        </label>

        <!-- PRIVACY -->
        <label class="flex items-start gap-3 cursor-pointer mt-2">
          <input
            v-model="privacyConsent"
            type="checkbox"
            name="privacyConsent"
            required
            class="mt-1 h-4 w-4 accent-primary"
          />

          <span class="text-sm text-gray-600 mt-0.5">
            Acconsento all'utilizzo dei dati secondo l'

            <a
              href="https://www.iubenda.com/privacy-policy/71476073"
              target="_blank"
              rel="noopener noreferrer"
              class="underline font-semibold text-primary"
            >
              informativa privacy
            </a>
          </span>
        </label>

        <!-- SUBMIT -->
        <button
          type="submit"
          :disabled="loading"
          class="bg-primary text-white rounded-md px-8 py-3 uppercase font-bold self-start hover:bg-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Prenota
        </button>
      </form>
    </section>

    <!-- LOADING -->
    <FormLoadingSpin
      v-if="loading"
      :loading="loading"
      class="w-full md:w-2/4"
    />

    <!-- STATUS -->
    <FormStatusMessage
      v-if="formSubmitted && !loading"
      :formSubmitted="formSubmitted"
      :formError="formError"
      :variant="isSanityExam ? 'sanity' : 'default'"
      class="w-full md:w-2/4"
    />
  </div>
</template>

<style scoped>
@reference '~/assets/css/main.css';

input:not([type="checkbox"]) {
  @apply border border-primary rounded-md bg-white shadow-md px-2 text-dark w-full;
}

label {
  @apply text-dark w-full;
}
</style>
