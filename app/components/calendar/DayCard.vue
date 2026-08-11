```vue
<script lang="ts" setup>
interface Props {
  day: {
    date: string;
    timeslots: {
      time: string;
      slots: {
        exam_id: string;
        exam_name: string;
        datetime: string;
        struttura: string;
        structure_id: string;
      }[];
    }[];
  };
}

const props = defineProps<Props>();

const openGroups = ref<Record<string, boolean>>({});

const toggleGroup = (time: string) => {
  openGroups.value[time] = !openGroups.value[time];
};

const isOpen = (time: string) => {
  return !!openGroups.value[time];
};
</script>

<template>
  <article class="w-full h-full min-w-0">
    <section class="flex flex-col gap-3">
      <!-- DAY HEADER -->
      <div
        class="bg-dark text-white rounded-md section-padding-y-half section-padding-x text-center"
      >
        <NuxtTime
          :datetime="new Date(day.date)"
          locale="it-IT"
          weekday="long"
          day="numeric"
          month="short"
          time-zone="Europe/Rome"
          class="font-bold uppercase text-base md:text-lg whitespace-nowrap"
        />
      </div>

      <!-- TIMESLOTS -->
      <div
        v-for="group in day.timeslots"
        :key="group.time"
        class="border border-dark/40 rounded-md overflow-hidden bg-white"
        :class="{ 'border-dark!': isOpen(group.time) }"
      >
        <!-- HEADER -->
        <button
          type="button"
          class="w-full flex items-center justify-between section-padding-y-half section-padding-x bg-white hover:bg-dark/10 transition"
          @click="toggleGroup(group.time)"
        >
          <span class="font-medium text-dark text-sm md:text-base">
            {{ group.time }}
          </span>

          <Icon
            name="lucide:chevron-right"
            class="w-4 h-4 text-primary transition-transform duration-300"
            :class="{ 'rotate-90': isOpen(group.time) }"
          />
        </button>

        <!-- ESAMI -->
        <div
          v-if="isOpen(group.time)"
          class="section-padding-y-half section-padding-x flex flex-col gap-2"
        >
          <NuxtLink
            v-for="slot in group.slots"
            :key="`${slot.exam_id}-${slot.datetime}-${slot.structure_id}`"
            :to="{
              path: '/booking/reservation',
              query: {
                exam_id: slot.exam_id,
                exam_name: slot.exam_name,
                datetime: slot.datetime,
                struttura: slot.struttura,
                structure_id: slot.structure_id,
              },
            }"
            class="bg-white border border-dark/10 rounded-md section-padding-y-half section-padding-x hover:bg-primary/5 hover:border-primary/50 transition"
          >
            <!-- NOME ESAME DA SANITY -->
            <div
              class="text-sm font-medium text-dark wrap-break-word overflow-hidden text-ellipsis"
            >
              {{ slot.exam_name }}
            </div>

            <!-- STRUTTURA DA SANITY -->
            <div
              class="text-sm md:text-sm text-primary font-display italic wrap-break-word mt-1"
            >
              {{ slot.struttura }}
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>
  </article>
</template>
```
