<script setup lang="ts">
import { brandInfo } from '~~/config/brand-info'
const { data } = useAbout()
</script>
<template>
  <section class="grid grid-cols-1 lg:grid-cols-3 bg-white items-stretch">
    <!-- LEFT -->
    <div class="lg:col-span-2 flex items-center section-padding-y">
      <div class="w-full">
        <!-- Badge -->

        <!-- Title -->
        <h1
          class="font-serif text-5xl lg:text-7xl leading-none tracking-tight text-dark mb-3"
        >
          Dottor
          <br />
          <em class="italic text-primary font-light whitespace-nowrap">
            {{ brandInfo.name }} {{ brandInfo.surname }}
          </em>
        </h1>

        <!-- Subtitle -->
        <div
          class="inline-flex items-center gap-2 rounded-full border border-secondary bg-secondary/20 px-4 py-1.5 mb-8 text-xs font-medium uppercase tracking-[0.1em] text-primary"
        >
          <Icon name="ph:stethoscope" />

          {{ brandInfo.subtitle }}
        </div>

        <!-- Description -->
        <article
          v-if="data?.description_fields?.length"
          class="max-w-2xl text-base lg:text-lg font-light text-dark/90 mb-6"
        >
          <SanityContent :value="data.description_fields[0]?.description" />
        </article>

        <!-- Actions -->
        <div class="flex items-center gap-9">
          <ExamBaseButton
            to="/booking"
            label="Prenota adesso"
            class="items-center"
          />

          <NuxtLink
            to="/about"
            class="whitespace-nowrap mt-6 inline-flex items-center text-sm lg:text-base font-medium text-dark border-b-[1.5px] border-secondary pb-0.5 transition hover:border-primary hover:text-primary"
          >
            Scopri di più

            <Icon name="ph:arrow-right" class="ml-2 size-4" />
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- RIGHT -->
    <div class="lg:col-span-1 flex items-center justify-center">
      <div class="relative flex items-center justify-center">
        <AboutPhotoCard />
      </div>
    </div>
  </section>
</template>
