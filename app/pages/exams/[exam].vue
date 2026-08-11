<script setup lang="ts">
import type { PortableTextBlock } from 'sanity'
import { useRoute } from 'vue-router'

const route = useRoute()
const slug = route.params.exam as string

type InstrumentType = {
  _id: string
  title?: string
  name?: string
  description?: PortableTextBlock[]
}

type ExamType = {
  title?: string
  description?: PortableTextBlock[]
  exam?: { title: string; link: string }[]
  prices?: { amount: number; currency: string }[]
  slug?: { current: string }
  strumentations?: InstrumentType[]
}

const query = groq`
  *[_type == "exams" && slug.current == $exam][0]`

const { data } = useSanityQuery<ExamsDocument>(query, {
  exam: slug,
})
</script>

<template>
  <article class="section-padding-b">
    <section
      class="flex justify-between items-center md:grid md:grid-cols-4 md:gap-6"
    >
      <h1
        class="font-display italic text-primary text-4xl md:text-5xl md:col-start-2"
      >
        {{ data?.title }}
      </h1>
      <NuxtLink
        :to="{
          path: '/booking',
          query: {
            exam: data?.title,
            type: data?.slug?.current,
          },
        }"
        class="flex items-center justify-end md:col-start-3"
      >
        <div
          class="font-bold text-lg md:text-2xl bg-dark text-white border border-white rounded-md px-3 py-1.5 max-w-min uppercase shadow-md"
        >
          Prenota
        </div>
      </NuxtLink>
    </section>

    <section
      class="flex flex-col md:grid md:grid-cols-4 md:gap-6 mt-6 portable-text"
    >
      <div class="md:col-start-2 md:col-span-2 text-dark/90">
        <SanityContent :value="data?.description" />

        <div
          v-if="data?.when"
          class="section-padding-y md:section-padding-y-half text-dark/90 font-body"
        >
          <span class="section-title">
            {{ data?.when?.title }}
          </span>
          <div class="when-list section-padding-y-half">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <template
                v-for="block in data?.when?.description"
                :key="block?._key"
              >
                <div
                  v-if="block?.listItem === 'bullet'"
                  class="flex items-center bg-white border border-primary/50 rounded-md px-4 py-3 shadow-sm"
                >
                  <Icon
                    name="ph:pill"
                    class="text-primary shrink-0 mr-1.5 -ml-1"
                  />

                  <div class="md:text-sm when-text">
                    <SanityContent :value="[block]" />
                  </div>
                </div>
              </template>
            </div>

            <template
              v-for="block in data?.when?.description"
              :key="block?._key"
            >
              <div
                v-if="block?.listItem !== 'bullet'"
                class="text-neutral-700 leading-relaxed mt-3"
              >
                <SanityContent :value="[block]" />
              </div>
            </template>
          </div>

          <ExamBaseButton
            v-if="data.when.cta == true"
            :to="{
              path: '/booking',
              query: {
                exam: data?.title,
                type: data?.slug?.current,
              },
            }"
            label="Prenota"
          />
        </div>

        <div
          v-if="data?.how"
          class="section-padding-y md:section-padding-y-half"
        >
          <span class="section-title">{{ data?.how?.title }} </span>
          <SanityContent :value="data?.how?.description" />
          <ExamBaseButton
            v-if="data.how.cta == true"
            :to="{
              path: '/booking',
              query: {
                exam: data?.title,
                type: data?.slug?.current,
              },
            }"
            label="Prenota"
          />
        </div>

        <div
          v-if="data?.preparation"
          class="section-padding-y md:section-padding-y-half"
        >
          <span class="section-title">{{ data?.preparation?.title }} </span>
          <SanityContent :value="data?.preparation?.description" />
          <ExamBaseButton
            v-if="data.preparation.cta == true"
            :to="{
              path: '/booking',
              query: {
                exam: data?.title,
                type: data?.slug?.current,
              },
            }"
            label="Prenota"
          />
        </div>

        <div v-if="data?.info">
          <div
            v-for="item in data?.info"
            :key="item.title"
            class="section-padding-y md:section-padding-y-half relative"
          >
            <span class="section-title">
              {{ item.title }}
            </span>

            <div class="relative pl-6 mt-3">
              <span
                class="absolute left-0 top-0 bottom-0 w-[1.5px] bg-primary rounded-md"
              ></span>

              <SanityContent :value="item.description" />
            </div>

            <ExamBaseButton
              v-if="item.cta == true"
              :to="{
                path: '/booking',
                query: {
                  exam: data?.title,
                  type: data?.slug?.current,
                },
              }"
              label="Prenota"
            />
          </div>
        </div>

        <div class="section-padding-y md:section-padding-y-half">
          <div
            class="bg-secondary/10 border border-primary/50 rounded-md p-6 md:p-10 shadow-sm"
          >
            <span class="section-title block mb-4">
              {{ data?.FAQ?.title }}
            </span>

            <SanityContent :value="data?.FAQ?.description" />
          </div>
          <div class="flex justify-center section-padding-t">
            <ExamBaseButton
              v-if="data?.FAQ?.cta == true"
              :to="{
                path: '/booking',
                query: {
                  exam: data?.title,
                  type: data?.slug?.current,
                },
              }"
              label="Prenota la tua visita"
              icon="i-ph:arrow-right"
            />
          </div>
        </div>
      </div>
    </section>
  </article>
</template>
