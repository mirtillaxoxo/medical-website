<script setup lang="ts">
type Props = {
  to: any
  label?: string
  icon?: string
}

const props = defineProps<Props>()
</script>

<template>
  <div class="mt-6 text-right">
    <NuxtLink :to="props.to" class="inline-flex !no-underline">
      <div
        class="inline-flex items-center gap-2 text-base md:text-lg bg-primary text-white px-4 py-2 rounded-md uppercase hover:bg-dark"
      >
        <span>{{ props.label ?? 'Prenota' }}</span>
        <Icon v-if="props.icon" :name="props.icon" class="size-5" />
      </div>
    </NuxtLink>
  </div>
</template>
