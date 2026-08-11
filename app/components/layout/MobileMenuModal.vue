<script lang="ts" setup>
import { brandInfo } from '~~/config/brand-info'

type NavigationPage = {
  title: string
  slug: string
}

const props = defineProps<{
  open: boolean
  pages: NavigationPage[]
}>()

const emit = defineEmits<{
  close: []
}>()

const closeModal = () => emit('close')
</script>

<template>
  <Transition name="mobile-fade">
    <div v-if="open" class="fixed inset-0 z-[999] md:hidden">
      <button
        type="button"
        aria-label="Chiudi menu"
        class="absolute inset-0 bg-dark/60 backdrop-blur-sm"
        @click="closeModal"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menu di navigazione"
        class="relative flex h-full flex-col bg-white text-dark"
      >
        <!-- HEADER -->
        <div
          class="flex items-center justify-between section-padding-x py-3 border-b border-primary/10"
        >
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

          <!-- CLOSE -->
          <button
            type="button"
            aria-label="Chiudi menu"
            class="flex items-center justify-center w-10 h-10 rounded-md border border-primary/20 bg-white shadow-md hover:bg-primary/10 transition"
            @click="closeModal"
          >
            <Icon name="i-ph:x-bold" class="text-dark size-5" />
          </button>
        </div>

        <!-- NAV -->
        <nav
          id="mobile-navigation"
          aria-label="Navigazione header"
          class="flex flex-1 flex-col justify-between px-5 py-6 overflow-y-auto"
        >
          <!-- LINKS -->
          <div class="flex flex-col gap-3">
            <NuxtLink
              v-for="p in pages"
              :key="p.slug"
              :to="p.slug"
              class="text-center rounded-md border px-4 py-3 font-body text-base transition shadow-sm"
              :class="
                p.slug === '/booking'
                  ? 'bg-primary border-primary text-white uppercase hover:bg-dark'
                  : 'bg-white border-dark/10 text-dark hover:text-primary hover:border-primary/30'
              "
              @click="closeModal"
            >
              {{ p.title }}
            </NuxtLink>
          </div>

          <!-- FOOTER -->
          <div class="mt-8 border-t border-dark/10 pt-5 flex flex-col gap-3">
            <p class="text-sm uppercase tracking-widest text-primary">
              Navigazione
            </p>

            <BrandContactsList class="pt-2" />
          </div>
        </nav>
      </div>
    </div>
  </Transition>
</template>
