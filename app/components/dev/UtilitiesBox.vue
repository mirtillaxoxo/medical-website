<script setup lang="ts">
import { useWindowSize, breakpointsTailwind } from '@vueuse/core'

import { computed, ref } from 'vue'

defineEmits(['toggle-outline'])

const { width } = useWindowSize()

const activeBreakpoint = computed(() => {
  let breakpoint = 'base'

  for (const [key, value] of Object.entries(breakpointsTailwind)) {
    if ((value as number) <= width.value) {
      breakpoint = key
    }
  }

  return breakpoint
})

const isOpen = ref(true)
</script>

<template>
  <div
    id="utilities-box"
    class="fixed right-2 top-20 z-9999 text-xs text-sky-800 rounded-md transition-all duration-300"
    :class="{
      'w-64 p-2 border bg-white bg-opacity-30': isOpen,

      'w-10 p-0 border-0 bg-transparent': !isOpen,
    }"
  >
    <button
      @click="isOpen = !isOpen"
      class="absolute top-1 right-1 w-6 h-6 bg-sky-200 rounded-md flex items-center justify-center text-xs font-bold"
    >
      <span v-if="isOpen"> − </span>

      <span v-else> + </span>
    </button>

    <div v-show="isOpen" class="flex flex-col items-center space-y-2">
      <pre
        >{{ activeBreakpoint.toUpperCase() }}:
{{ width }}px
</pre
      >

      <button
        type="button"
        @click="$emit('toggle-outline')"
        class="border rounded-md uppercase px-1"
      >
        outline
      </button>

      <DevColorChanger />
    </div>
  </div>
</template>
