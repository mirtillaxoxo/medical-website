<script lang="ts" setup>
import { PiniaColadaDevtools } from '@pinia/colada-devtools'
const { loadColors } = useThemeColors()

onMounted(() => {
  loadColors()
})
</script>

<template>
  <div class="font-body font-medium md:text-lg">
    <LayoutTheHeader class="section-padding-x py-3" />
    <main class="section-padding">
      <slot />
    </main>
    <LayoutTheFooter />
  </div>

  <!-- DEV -->

  <ClientOnly>
    <DevOnly>
      <DevUtilitiesBox class="mt-12" />
    </DevOnly>

    <PiniaColadaDevtools />
  </ClientOnly>
</template>
