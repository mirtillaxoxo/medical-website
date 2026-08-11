<script setup lang="ts">
import { brandInfo } from "~~/config/brand-info";

const { data } = useAbout();
</script>

<template>
  <section
    class="flex flex-col md:flex-row items-center md:items-center gap-12"
  >
    <!-- IMAGE -->
    <div class="w-full md:w-60 flex justify-center">
      <SanityImage
        v-if="data?.image.asset"
        :asset-id="data.image.asset._ref"
        class="w-50 md:w-full object-cover profile-image-container rounded-xl"
        :alt="`${brandInfo.name} ${brandInfo.surname} photo profile`"
      />
    </div>

    <!-- TEXT -->
    <div class="w-full md:w-2/3 flex flex-col gap-3">
      <h1
        class="font-display font-black text-2xl text-dark uppercase md:text-left"
      >
        {{ brandInfo.name }} {{ brandInfo.surname }}
      </h1>

      <article
        v-if="data?.description_fields?.length"
        class="md:mb-12 p-3 border border-secondary rounded-xl shadow-md"
      >
        <SanityContent :value="data.description_fields[0]?.description" />

        <NuxtLink to="/about" class="flex justify-end">
          <div
            class="font-display font-bold text-base md:text-xl text-secondary border border-secondary rounded-full px-3 py-1 max-w-min uppercase shadow-md whitespace-nowrap mt-3"
          >
            Scopri di più
          </div>
        </NuxtLink>
      </article>
    </div>
  </section>
</template>

<style scoped>
@reference '~/assets/css/main.css';

.profile-image-container {
  @apply flex md:inline-flex rounded-full items-center justify-center p-1.5;
  background-image: url("~/assets/graphics/circle-color.svg");
}
.profile-image-container > img {
  @apply rounded-full;
}
</style>
