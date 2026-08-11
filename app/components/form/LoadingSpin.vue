<script lang="ts" setup>
defineProps<{
  loading: boolean
}>()
</script>
<template>
  <Transition name="fade">
    <div
      v-if="loading"
      class="w-full flex flex-col items-center justify-center py-16"
    >
      <div class="relative h-12 w-12">
        <div
          class="absolute inset-0 rounded-full border-4 border-gray-200"
        ></div>
        <div
          class="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin"
        ></div>
      </div>

      <p class="section-padding-y-half text-lg text-dark">Invio in corso...</p>
    </div>
  </Transition>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
