<script lang="ts" setup>
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";

import { websitePages } from "~~/config/website-pages";
const { brandInfo } = useBrandInfo();

const breakpoints = useBreakpoints(breakpointsTailwind, {
  ssrWidth: breakpointsTailwind.md,
});
</script>

<template>
  <footer class="relative mt-9 grid grid-cols-6 text-white">
    <GraphicsMedicalLogo
      :label="`${brandInfo.name} ${brandInfo.surname} logo`"
      class="text-dark absolute h-6 md:h-9 -top-6.5 md:-top-7 left-padding"
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
        <p>{{ brandInfo.role }}</p>

        <div v-if="brandInfo.registration?.number" class="text-xs md:text-sm">
          <p>
            <NuxtLink
              external
              :to="brandInfo.registration.url || '#'"
              target="_blank"
            >
              Iscritto all'Albo Provinciale dei Medici Chirurghi di
              {{ brandInfo.registration.province }}
            </NuxtLink>
          </p>
          <p>
            dal {{ brandInfo.registration.date }} ~
            <NuxtLink
              external
              :to="brandInfo.registration.url || '#'"
              target="_blank"
            >
              Numero
              <span class="font-black">{{
                brandInfo.registration.number
              }}</span>
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
