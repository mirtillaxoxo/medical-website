<script lang="ts" setup>
// Carica una sola volta brand, colori e raggiature (anche in SSR)
const { load: loadBrand } = useBrandInfo();
const { load: loadTheme } = useThemeColors();
const { load: loadRadius } = useRadiusSettings();

await callOnce("site-data", async () => {
  await Promise.all([loadBrand(), loadTheme(), loadRadius()]);
});

// Inserisce colori e raggiature salvati come variabili CSS nell'head
useThemeStyle();
useRadiusStyle();
</script>

<template>
  <div class="font-body font-medium md:text-lg">
    <LayoutTheHeader class="section-padding-x py-3" />
    <main class="section-padding">
      <slot />
    </main>
    <LayoutTheFooter />
  </div>
</template>
