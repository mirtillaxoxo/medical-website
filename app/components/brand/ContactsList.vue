<script lang="ts" setup>
const { brandInfo } = useBrandInfo();
</script>

<template>
  <nav
    aria-label="Link Contatti footer"
    class="text-[0.55rem] md:text-base flex flex-col gap-1.5"
  >
    <NuxtLink
      v-for="c in brandInfo.contacts"
      :key="c.value"
      external
      :href="createContactUrl({ type: c.type, value: c.value })"
      class="flex items-center gap-1.5 md:gap-3"
    >
      <Icon v-if="c.icon" :name="c.icon" />{{ c.value }}
    </NuxtLink>
  </nav>
</template>
