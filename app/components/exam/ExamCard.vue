<script setup lang="ts">
const route = useRoute()

const query = groq`*[_type=='exams']`
const { data: exam } = useSanityQuery<ExamsDocument[]>(query)

function extractText(pt: any): string {
  if (!pt) return ''

  if (typeof pt === 'string') return pt

  return pt
    .map((block: any) => {
      if (block._type !== 'block' || !block.children) return ''
      return block.children.map((child: any) => child.text).join('')
    })
    .join(' ')
}

function limitWords(pt: any, maxWords = 15) {
  const text = extractText(pt)
  return text.split(' ').slice(0, maxWords).join(' ') + '...'
}

const icons = ['ph:clipboard-text', 'ph:scan', 'ph:activity', 'ph:stethoscope']

function getIcon(i: number) {
  return icons[i % icons.length]
}

const isHome = computed(() => route.path === '/')
</script>

<template>
  <section class="section-padding-y-half">
    <!-- HEADER -->
    <div class="flex items-start justify-between mb-4">
      <div>
        <p
          class="text-xs md:text-lg font-medium uppercase tracking-[0.12em] text-primary mb-4"
        >
          TIPOLOGIA DI ESAMI
        </p>
        <h2
          class="font-display italic text-3xl md:text-5xl font-light leading-[1.1] text-dark"
        >
          Esami <span class="not-italic">& </span>
          <span class="text-primary">Prestazioni</span>
        </h2>
      </div>
      <!-- CTA BUTTON -->
      <div v-if="!isHome" class="mt-5">
        <LayoutTheButton />
      </div>
    </div>
    <!-- GRID -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-0.5 bg-secondary/10">
      <div
        v-for="(e, index) in exam"
        :key="e._id"
        tabindex="0"
        role="link"
        class="group bg-white p-10 hover:bg-primary/0.5 cursor-pointer"
        @click="navigateTo(`/exams/${e.slug?.current}`)"
        @keydown.enter="navigateTo(`/exams/${e.slug?.current}`)"
      >
        <div
          class="w-12 h-12 mb-5 flex items-center justify-center rounded-md bg-primary/10"
        >
          <Icon :name="getIcon(index)" />
        </div>
        <h3 class="font-display text-2xl font-normal text-dark mb-2">
          {{ e.title }}
        </h3>
        <p class="text-sm text-dark/90 leading-relaxed font-light">
          {{ limitWords(e.description, 15) }}
        </p>
        <NuxtLink
          :to="{
            path: '/booking',
            query: {
              exam: e.title,
              type: e?.slug?.current,
            },
          }"
          class="flex items-center md:col-start-3"
          @click.stop
        >
          <div
            class="font-bold text-base text-dark px-3 py-1.5 max-w-min uppercase shadow-md bg-white rounded-md mt-3"
          >
            Prenota
          </div>
        </NuxtLink>
        <div
          class="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary tracking-wide"
        >
          Approfondisci
          <Icon name="ph:arrow-right" />
        </div>
      </div>
    </div>
  </section>
</template>
