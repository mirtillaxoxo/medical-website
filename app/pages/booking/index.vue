<script lang="ts" setup>
import { usebookingAvailabilities } from "~/composables/useBookingAvailabilities";

const route = useRoute();

const initialStructure =
  typeof route.query.struttura === "string" ? route.query.struttura : undefined;

const {
  exams,
  selectedExamId,
  mergedAvailabilities,
  examStore,
  structuresMaster,
  hasNoAvailabilityForStructure,
} = usebookingAvailabilities(initialStructure);

const carouselRef = ref<HTMLElement | null>(null);

const canScrollPrev = ref(false);
const canScrollNext = ref(false);

let removeCarouselListeners: (() => void) | undefined;
let resizeObserver: ResizeObserver | undefined;

const updateCarouselControls = () => {
  const carousel = carouselRef.value;

  if (!carousel) {
    canScrollPrev.value = false;
    canScrollNext.value = false;
    return;
  }

  const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;

  canScrollPrev.value = carousel.scrollLeft > 8;
  canScrollNext.value = carousel.scrollLeft < maxScrollLeft - 8;
};

const scrollCarousel = (direction: -1 | 1) => {
  const carousel = carouselRef.value;

  if (!carousel) return;

  const firstCard = carousel.querySelector<HTMLElement>("[data-day-card]");

  const gap = 24;

  const scrollOffset = firstCard
    ? (firstCard.offsetWidth + gap) * 2
    : carousel.clientWidth * 0.85;

  carousel.scrollBy({
    left: direction * scrollOffset,
    behavior: "smooth",
  });
};

onMounted(async () => {
  await nextTick();

  const carousel = carouselRef.value;

  if (!carousel) return;

  const syncCarouselState = () => {
    updateCarouselControls();
  };

  carousel.addEventListener("scroll", syncCarouselState, {
    passive: true,
  });

  window.addEventListener("resize", syncCarouselState);

  resizeObserver = new ResizeObserver(() => {
    updateCarouselControls();
  });

  resizeObserver.observe(carousel);

  carousel.scrollTo({
    left: 0,
    behavior: "smooth",
  });

  updateCarouselControls();

  removeCarouselListeners = () => {
    carousel.removeEventListener("scroll", syncCarouselState);
    window.removeEventListener("resize", syncCarouselState);
    resizeObserver?.disconnect();
  };
});

onBeforeUnmount(() => {
  removeCarouselListeners?.();
});

watch(
  mergedAvailabilities,
  async () => {
    await nextTick();
    updateCarouselControls();
  },
  {
    deep: true,
  },
);
</script>

<template>
  <section class="grid grid-cols-1 md:grid-cols-12 section-padding-y">
    <div class="md:col-start-2 md:col-end-12">
      <article class="grid gap-4 md:grid-cols-2">
        <!-- ESAMI -->
        <div class="flex flex-col">
          <p class="text-primary uppercase mb-1 font-extrabold">
            tipo di esame
          </p>

          <select
            v-model="selectedExamId"
            aria-label="select tipo di esame"
            class="border border-dark bg-white shadow-md rounded-md text-dark text-sm md:text-lg p-1.5 w-full uppercase"
          >
            <option
              v-for="exam in exams"
              :key="exam.exam_id"
              :value="exam.exam_id"
            >
              {{ exam.exam_name }}
            </option>
          </select>
        </div>
        <!-- STRUTTURE -->
        <div class="flex flex-col">
          <p class="text-primary uppercase mb-1 font-extrabold">struttura</p>

          <select
            v-model="examStore.structureSelected"
            aria-label="select struttura"
            class="border border-dark bg-white shadow-md rounded-md text-dark text-sm md:text-lg p-1.5 w-full uppercase"
          >
            <option
              v-for="structure in structuresMaster"
              :key="structure.id"
              :value="structure.id"
            >
              {{ structure.label }}
            </option>
          </select>
        </div>
      </article>

      <section class="flex flex-col items-center">
        <div class="section-padding-y">
          <p class="font-bold uppercase text-primary">disponibilità:</p>
        </div>

        <!-- NESSUNA DISPONIBILITÀ -->
        <div
          v-if="hasNoAvailabilityForStructure"
          class="max-w-md w-full bg-primary/10 border border-primary/20 rounded-md p-6 text-center shadow-sm mx-auto"
        >
          <div
            class="mx-auto mb-4 flex items-center justify-center h-14 w-14 rounded-full bg-primary/20"
          >
            <Icon name="ph-calendar-x-bold" class="text-2xl text-primary" />
          </div>

          <h2 class="text-lg font-semibold text-primary">
            Nessuna disponibilità
          </h2>

          <p class="text-sm text-dark mt-3">
            Questa struttura non presenta disponibilità al momento. Scegli
            un'altra struttura per visualizzare gli appuntamenti disponibili.
          </p>
        </div>

        <!-- DISPONIBILITÀ -->
        <div v-else class="w-full">
          <!-- MOBILE -->
          <div class="grid gap-12 md:hidden">
            <CalendarDayCard
              v-for="day in mergedAvailabilities"
              :key="day.date"
              :day
            />
          </div>

          <!-- DESKTOP CONTROLS -->
          <div class="hidden md:flex items-center justify-end gap-3 mb-4">
            <button
              type="button"
              aria-label="Date precedenti"
              class="flex h-11 w-11 items-center justify-center rounded-md border border-dark bg-white text-primary shadow-md transition disabled:cursor-not-allowed disabled:opacity-40"
              :disabled="!canScrollPrev"
              @click="scrollCarousel(-1)"
            >
              <Icon name="lucide:chevron-left" class="h-5 w-5" />
            </button>

            <button
              type="button"
              aria-label="Date successive"
              class="flex h-11 w-11 items-center justify-center rounded-md border border-dark bg-white text-primary shadow-md transition disabled:cursor-not-allowed disabled:opacity-40"
              :disabled="!canScrollNext"
              @click="scrollCarousel(1)"
            >
              <Icon name="lucide:chevron-right" class="h-5 w-5" />
            </button>
          </div>

          <!-- CAROUSEL -->
          <div
            ref="carouselRef"
            class="calendar-carousel hidden md:flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4"
          >
            <div
              v-for="day in mergedAvailabilities"
              :key="day.date"
              data-day-card
              class="shrink-0 snap-start md:w-70 lg:w-88"
            >
              <CalendarDayCard :day />
            </div>
          </div>
        </div>
      </section>
    </div>
  </section>
</template>

<style scoped>
.calendar-carousel::-webkit-scrollbar {
  display: none;
}
</style>
