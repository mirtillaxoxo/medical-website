<script lang="ts" setup>
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import { websitePages } from '~~/config/website-pages'
import { brandInfo } from '~~/config/brand-info'

const breakpoints = useBreakpoints(breakpointsTailwind, {
  ssrWidth: breakpointsTailwind.md,
})

const attrs = useAttrs()
const [first, ...rest] = websitePages
const pages = [...rest, first] as typeof websitePages

const mobileMenu = ref(false)
const route = useRoute()

const isDesktop = computed(() => breakpoints.isGreater('md'))

const closeMobileMenu = () => (mobileMenu.value = false)
const toggleMobileMenu = () => (mobileMenu.value = !mobileMenu.value)

watch(isDesktop, (desktop) => {
  if (desktop) closeMobileMenu()
})

watch(
  () => route.fullPath,
  () => closeMobileMenu(),
)
</script>

<template>
  <header
    v-bind="attrs"
    class="sticky top-0 z-[999] bg-white/95 backdrop-blur-xl border-b border-primary/20"
  >
    <div class="flex items-center justify-between">
      <!-- LOGO -->
      <NuxtLink to="/" class="flex items-center gap-3 no-underline">
        <NuxtImg
          src="/graphics/doctor_logo.svg"
          :alt="`${brandInfo.name} ${brandInfo.surname} logo`"
          class="w-10 h-auto"
        />

        <div class="flex flex-col">
          <span
            class="font-display text-lg font-semibold text-dark leading-tight tracking-wide"
          >
            {{ brandInfo.title }}
          </span>

          <span
            class="text-xs uppercase tracking-widest font-medium text-primary"
          >
            {{ brandInfo.subtitle }}
          </span>
        </div>
      </NuxtLink>

      <!-- DESKTOP NAV -->
      <nav
        v-if="isDesktop"
        class="hidden md:flex items-center gap-10 font-body"
        aria-label="Navigazione header"
      >
        <NuxtLink
          v-for="p in pages"
          :key="p.slug"
          :to="p.slug"
          class="text-base text-dark/70 tracking-wide transition-colors hover:text-dark"
          :class="
            p === pages[pages.length - 1]
              ? 'bg-primary text-white px-5 py-2 rounded-md font-medium hover:bg-dark hover:text-white uppercase'
              : ''
          "
        >
          {{ p.title }}
        </NuxtLink>
      </nav>

      <!-- MOBILE BUTTON -->
      <div v-else class="flex items-center justify-end">
        <button
          type="button"
          :aria-label="mobileMenu ? 'Chiudi menu' : 'Apri menu'"
          id="mobile-navigation"
          aria-controls="mobile-navigation"
          :aria-expanded="mobileMenu"
          @click="toggleMobileMenu"
          class="flex items-center justify-center p-2.5 rounded-md border border-primary/20 bg-white text-dark shadow-md hover:bg-primary/10 hover:shadow-lg transition"
        >
          <Icon
            :name="mobileMenu ? 'i-ph:x-bold' : 'i-cg-menu-color'"
            class="size-6"
          />
        </button>
      </div>
    </div>
  </header>

  <LayoutMobileMenuModal
    :open="mobileMenu && !isDesktop"
    :pages="pages"
    @close="closeMobileMenu"
  />
</template>
