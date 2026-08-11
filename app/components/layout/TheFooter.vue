<script lang="ts" setup>
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

import { websitePages } from '~~/config/website-pages'
import { brandInfo } from '~~/config/brand-info'

const breakpoints = useBreakpoints(breakpointsTailwind, {
  ssrWidth: breakpointsTailwind.md,
})
</script>

<template>
  <footer class="relative mt-9 grid grid-cols-6 text-white">
    <NuxtImg
      src="/graphics/doctor_logo_half-white.svg"
      class="absolute h-6 md:h-9 -top-3 md:-top-4.5 left-padding"
      :alt="`${brandInfo.name} ${brandInfo.surname} logo`"
    />

    <!-- left -->
    <section
      class="bg-primary section-padding section-padding-r-half col-span-3 md:col-span-4 flex flex-col justify-between"
    >
      <div>
        <p
          class="font-display font-semibold -mt-1.5 md:-mt-3 lg:-mt-6 text-lg md:text-2xl"
        >
          {{ brandInfo.titleShort }}
        </p>
        <p class="text-sm md:text-base text-dark uppercase">
          {{ brandInfo.subtitle }}
        </p>
      </div>

      <BrandContactsList v-if="breakpoints.isGreater('md')" class="my-6" />

      <div class="flex flex-col gap-3">
        <p>Medico Chirurgo</p>

        <div class="text-xs md:text-sm">
          <p>
            <NuxtLink
              external
              to="https://omceo.latraccia.it/omceomi/f?p=111:103:::NO::P103_ID_ANAGRAFICA:742AAC62A0865928F7E920CF7CB79B12&cs=1E7983EB38A8D6835BEA54C3A210DAB20"
              target="_blank"
            >
              Iscritto all'Albo Provinciale dei Medici Chirurghi di MILANO
            </NuxtLink>
          </p>
          <p>
            dal 13 Aprile 2021 ~
            <NuxtLink
              external
              to="https://omceo.latraccia.it/omceomi/f?p=111:103:::NO::P103_ID_ANAGRAFICA:742AAC62A0865928F7E920CF7CB79B12&cs=1E7983EB38A8D6835BEA54C3A210DAB20"
              target="_blank"
            >
              Numero <span class="font-black">47968</span>
            </NuxtLink>
          </p>
        </div>

        <p class="text-[0.5rem] md:text-xs">
          © <NuxtTime :datetime="Date.now()" year="numeric" />
          {{ brandInfo.name }} {{ brandInfo.surname }} <br />Tutti i diritti
          riservati
        </p>
      </div>
    </section>

    <!-- right -->
    <section class="col-span-3 md:col-span-2">
      <nav
        aria-label="Navigazione pagine e sezioni sito footer"
        class="bg-dark section-padding-l-half flex flex-col gap-3"
        :class="
          breakpoints.isSmallerOrEqual('md')
            ? 'section-padding-y'
            : 'section-padding-y-half'
        "
      >
        <div
          v-for="p in websitePages"
          :key="p.slug"
          class="first:bg-white first:text-primary first:rounded-sm first:px-3 first:max-w-min wrap-break-word first:shadow-md group"
        >
          <NuxtLink :to="p.slug" class="text-sm md:text-base"
            ><span class="text-primary group-first:hidden">•</span>
            {{ p.title }}</NuxtLink
          >
          <div
            v-if="p.sections && p.sections.length > 0"
            class="flex flex-col section-padding-l"
          >
            <NuxtLink
              v-for="s in p.sections"
              :to="`${p.slug}${s.slug}`"
              class="text-xs md:text-sm"
              >{{ s.title }}</NuxtLink
            >
          </div>
        </div>
      </nav>
      <div
        class="bg-secondary text-white section-padding flex flex-col md:flex-row items-center justify-center md:justify-between"
      >
        <p class="font-black hidden md:block">Account</p>

        <BrandContactsList v-if="breakpoints.isSmallerOrEqual('md')" />

        <nav
          aria-label="Navigazione account e link esterni footer"
          class="mt-6 md:mt-0 flex flex-wrap gap-6"
        >
          <NuxtLink
            v-for="a in brandInfo.accounts"
            :key="a.value"
            :to="a.value"
            external
            target="_blank"
            :aria-label="a.title"
          >
            <Icon :name="a.icon" class="size-5 -mb-1.5" />
          </NuxtLink>
        </nav>
      </div>
    </section>
  </footer>
</template>
