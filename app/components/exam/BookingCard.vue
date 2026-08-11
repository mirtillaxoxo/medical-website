<script lang="ts" setup>
import { useStructures } from "~/composables/useStructures";

const route = useRoute();
const structures = useStructures();

const emit = defineEmits<{
  (e: "price-ready", value: string | null): void;
}>();

// --------------------------------------------------
// QUERY PARAMS
// --------------------------------------------------

const exam_name = computed(() =>
  typeof route.query.exam_name === "string" ? route.query.exam_name : undefined,
);

const datetime = computed(() =>
  typeof route.query.datetime === "string" ? route.query.datetime : undefined,
);

const struttura = computed(() =>
  typeof route.query.struttura === "string" ? route.query.struttura : undefined,
);

const structure_id = computed(() =>
  typeof route.query.structure_id === "string"
    ? route.query.structure_id
    : undefined,
);

const source = computed(() =>
  typeof route.query.source === "string" ? route.query.source : undefined,
);

// --------------------------------------------------
// HELPERS
// --------------------------------------------------

function capitalize(str: string | undefined | null) {
  if (!str) return "";

  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function formatStructureLabel(structure: string | undefined | null) {
  if (!structure) return "";

  return structure
    .replace(/[-_]+/g, " ")
    .trim()
    .split(/\s+/)
    .map((word) => capitalize(word))
    .join(" ");
}

function toTitleCase(str: string = "") {
  return str
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// --------------------------------------------------
// ESAME SANITY
// --------------------------------------------------

const query = groq`
  *[
    _type == "exams" &&
    title == $title
  ][0]{
    _id,
    title,
    description,

    prices[]{
      "structure_id": structure->structure_id,
      amount,
      currency
    },

    slug,
    strumentations
  }
`;

const { data: currentExam } = useSanityQuery<ExamsDocument | null>(query, {
  title: exam_name,
});

// --------------------------------------------------
// PREZZO
// --------------------------------------------------

const priceDisplay = computed<string | null>(() => {
  const prices = currentExam.value?.prices;

  if (!prices?.length) {
    return null;
  }

  const price = prices.find(
    (price) => price?.structure_id === structure_id.value,
  );

  if (!price || price.amount == null) {
    return null;
  }

  return `${price.amount} €`;
});

// --------------------------------------------------
// STRUTTURA
// --------------------------------------------------

const currentStructure = computed(() => {
  const structureList = structures.data.value;

  if (!structureList?.length) {
    return null;
  }

  if (!struttura.value) {
    return null;
  }

  const structureValue = struttura.value.toLowerCase();

  return (
    structureList.find((structure) => {
      const title = structure?.title?.toLowerCase();

      const structureId = structure?.structure_id;

      return title === structureValue || structureId === struttura.value;
    }) ?? null
  );
});

// --------------------------------------------------
// INDIRIZZO
// --------------------------------------------------

const structureAddress = computed<string | null>(() => {
  const structure = currentStructure.value;

  if (!structure) {
    return null;
  }

  return structure.location?.address || null;
});

// --------------------------------------------------
// GOOGLE MAPS
// --------------------------------------------------

const googleMapsLink = computed(() => {
  if (!structureAddress.value) {
    return "#";
  }

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    structureAddress.value,
  )}`;
});

// --------------------------------------------------
// EMIT PREZZO
// --------------------------------------------------

watch(
  priceDisplay,
  (value) => {
    emit("price-ready", value);
  },
  {
    immediate: true,
  },
);
</script>

<template>
  <div class="w-full bg-white shadow-lg rounded-md p-6 border border-gray-100">
    <div class="flex flex-col gap-4">
      <!-- ESAME -->

      <h2
        class="text-2xl md:text-3xl font-display italic text-dark mb-3 normal-case"
      >
        {{ toTitleCase(exam_name || currentExam?.title || "") }}
      </h2>

      <!-- STRUTTURA -->

      <div class="space-y-2">
        <p v-if="struttura" class="text-sm md:text-base flex items-center">
          <Icon name="ph:map-pin" class="mr-3 text-lg text-secondary" />

          {{ formatStructureLabel(struttura) }}
        </p>

        <!-- INDIRIZZO -->

        <a
          v-if="structureAddress"
          :href="googleMapsLink"
          target="_blank"
          rel="noopener noreferrer"
          class="text-xs md:text-base text-dark/50 ml-7 mb-6 block hover:text-primary hover:underline transition-all"
        >
          {{ structureAddress }}
        </a>

        <!-- DATA -->

        <p v-if="datetime" class="text-sm md:text-base flex items-center">
          <Icon name="ph:calendar" class="mr-3 text-lg text-secondary" />

          <NuxtTime
            :datetime="datetime"
            day="2-digit"
            month="long"
            year="numeric"
            hour="numeric"
            minute="2-digit"
            time-zone="Europe/Rome"
          />
        </p>
      </div>

      <!-- PREZZO -->

      <section class="pt-4 mt-4 border-t border-gray-100">
        <!-- PREZZO DISPONIBILE -->

        <div v-if="priceDisplay">
          <div class="flex flex-col items-end w-full">
            <p
              class="text-xs md:text-base uppercase text-dark/50 font-bold tracking-wider"
            >
              Costo della prestazione
            </p>

            <p class="text-xl font-bold text-dark">
              {{ priceDisplay }}
            </p>
          </div>
        </div>

        <!-- SANITY SENZA PREZZO -->

        <p
          v-else-if="source === 'sanity'"
          class="text-xs md:text-sm italic text-dark/50 mt-3"
        >
          Informazione sul prezzo disponibile in struttura
        </p>

        <!-- HUMANITAS -->

        <p v-else class="text-xs md:text-sm italic text-dark/40 mt-3">
          Redirect automatico al sito della struttura
        </p>
      </section>
    </div>
  </div>
</template>
