<script setup lang="ts">
const { brandInfo } = useBrandInfo();
const route = useRoute();
const { data } = useAbout();
</script>

<template>
  <SanityImage
    v-if="data?.image.asset"
    :asset-id="data.image.asset._ref"
    class="w-50 md:w-60 object-cover profile-image-container rounded-xl"
    :alt="`${brandInfo.name} ${brandInfo.surname} photo profile`"
  />
</template>

<style>
@reference '~/assets/css/main.css';

.profile-image-container {
  @apply flex md:inline-flex rounded-full items-center justify-center p-1.5;
  background-image: linear-gradient(
    to right,
    var(--color-primary),
    var(--color-secondary)
  );
}
.profile-image-container > img {
  @apply rounded-full;
}
</style>
