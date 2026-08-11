<script setup lang="ts">
import type { GooglePlaceReview } from '~~/server/api/reviews'

interface Props {
  r: GooglePlaceReview
}

defineProps<Props>()

function resizeText(text: string) {
  return text.substring(0, 210)
}

import { ref } from 'vue'

const isOpen = ref(false)
const detailsRef = ref<HTMLDetailsElement | null>(null)
const closeDetails = () => {
  if (detailsRef.value) {
    detailsRef.value.open = false
  }
  isOpen.value = false
}
</script>

<template>
  <article
    class="rounded-md border section-padding-y-half section-padding-l-half section-padding-r-half border-dark/15 font-google bg-white h-full flex flex-col"
  >
    <NuxtLink :to="r.authorAttribution.uri">
      <header aria-label="Autore recensione e valutazione">
        <div class="flex items-center section-padding-b-half">
          <img
            :src="r.authorAttribution.photoUri"
            :alt="`Foto profilo ${r.authorAttribution.displayName}`"
            class="w-8 h-8 mr-3"
          />
          <p class="capitalize text-lg font-body font-bold">
            {{ r.authorAttribution.displayName }}
          </p>
          <p class="hidden">Valutazione: {{ r.rating }} stelle</p>
        </div>
      </header>
    </NuxtLink>

    <div>
      <Icon
        v-for="i in Math.floor(r.rating) || 0"
        name="i-ph-star-fill"
        class="text-yellow-400 -mb-0.5"
      />
      <Icon
        v-if="r.rating % 1 !== 0"
        name="i-ph:star-half-fill"
        class="text-yellow-400 -mb-0.5"
      />
      <span class="ml-6 text-sm">{{ r.relativePublishTimeDescription }}</span>
    </div>

    <details
      ref="detailsRef"
      @toggle="isOpen = $event.target.open"
      class="font-google overflow-hidden flex-1 flex flex-col"
    >
      <summary class="flex cursor-pointer list-none gap-2 items-center py-2">
        <span v-if="!isOpen" class="text-sm flex-1 min-h-[4.5rem] block">
          <span>
            {{ isOpen ? r.text.text : resizeText(r.text.text) + '...' }}
          </span>
          <span class="font-bold text-[#007b8b] ml-1"> Altro </span>
        </span>
      </summary>

      <p class="mt-2 text-sm">
        {{ r.text.text }}

        <span
          @click="closeDetails"
          class="font-bold text-[#007b8b] ml-1 cursor-pointer"
        >
          Chiudi
        </span>
      </p>
    </details>

    <div class="section-padding-y-half mt-auto">
      <NuxtLink
        :to="r.googleMapsUri"
        target="_blank"
        external
        class="text-sm text-[#007b8b] underline"
        >Visualizza recensione origianale</NuxtLink
      >
    </div>
  </article>
</template>

<style scoped>
details[open] .more {
  display: none;
}
</style>
