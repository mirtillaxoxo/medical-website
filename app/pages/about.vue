<script lang="ts" setup>
import { brandInfo } from '~~/config/brand-info'
const { data } = useAbout()
</script>

<template>
  <section class="grid grid-cols-1 md:grid-cols-12">
    <div class="md:col-start-2 md:col-end-12 flex flex-col items-center">
      <article v-if="data">
        <!-- HERO GRID -->
        <section class="grid grid-cols-1 lg:grid-cols-3 items-stretch">
          <!-- LEFT -->
          <div class="lg:col-span-2 flex items-center section-padding-y">
            <div class="w-full">
              <!-- TITLE -->
              <h1
                class="font-serif text-5xl lg:text-7xl leading-none tracking-tight text-dark mb-6"
              >
                Dottor
                <br />
                <em class="italic text-primary font-light whitespace-nowrap">
                  {{ brandInfo.name }} {{ brandInfo.surname }}
                </em>
              </h1>

              <!-- SUBTITLE + DOCUMENTS -->
              <div class="flex flex-wrap items-center gap-6 mb-8">
                <!-- Subtitle -->
                <div
                  class="inline-flex items-center gap-2 rounded-full border border-secondary bg-secondary/20 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.1em] text-primary"
                >
                  <Icon name="ph:stethoscope" />
                  profilo professionale
                </div>

                <!-- DOCUMENTS -->
                <section
                  v-if="data?.documents?.length"
                  class="flex flex-wrap items-center gap-3"
                >
                  <div v-for="doc in data.documents" :key="doc._key">
                    <SanityFile
                      v-if="doc.documents?.length"
                      :asset-id="doc.documents[0].asset._ref"
                      :download="doc.title + '.pdf'"
                    >
                      <template #default="{ src }">
                        <a
                          :href="src"
                          target="_blank"
                          class="group inline-flex items-center gap-2 rounded-full border border-secondary bg-white px-4 py-1.5 text-sm font-medium uppercase tracking-wide text-dark transition hover:border-primary hover:bg-primary hover:text-white"
                        >
                          <Icon
                            name="ph:download-simple-bold"
                            class="size-4 transition-transform group-hover:translate-y-0.5"
                          />

                          {{ doc.title }}
                        </a>
                      </template>
                    </SanityFile>
                  </div>
                </section>
              </div>

              <!-- DESCRIPTION -->
              <article
                v-if="data?.description_fields?.length"
                class="max-w-2xl text-base lg:text-lg font-light text-dark/90 mb-6"
              >
                <SanityContent
                  :value="data.description_fields[0]?.description"
                />
              </article>
            </div>
          </div>

          <!-- RIGHT -->
          <div class="lg:col-span-1 flex items-center justify-center">
            <div class="relative flex items-center justify-center md:mt-13">
              <AboutPhotoCard />
            </div>
          </div>
        </section>

        <!-- CONTENT SECTIONS -->
        <section class="flex flex-col gap-16 section-padding-t">
          <article
            v-for="d in data.description_fields.slice(1)"
            :key="d._key"
            class="border-t border-secondary/30 section-padding-t"
          >
            <div class="max-w-4xl">
              <h2
                class="font-display italic text-3xl lg:text-4xl text-primary mb-6 leading-tight"
              >
                {{ d.title }}
              </h2>

              <div
                class="portable-text text-base lg:text-lg leading-relaxed text-dark/80 font-light"
              >
                <SanityContent :value="d.description" />
              </div>
            </div>
          </article>
        </section>
      </article>
    </div>
  </section>
</template>
