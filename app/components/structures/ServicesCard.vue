<script setup>
const { allStructures } = usebookingAvailabilities()
</script>

<template>
  <div>
    <!-- HEADER -->
    <div class="">
      <p
        class="text-xs md:text-lg font-medium uppercase tracking-[0.12em] text-primary mb-4"
      >
        Dove puoi effettuare una visita
      </p>

      <h2
        class="font-display text-3xl italic md:text-5xl font-light leading-[1.1] text-dark"
      >
        Strutture <span class="not-italic">& </span>
        <span class="text-primary">Sedi</span>
      </h2>
    </div>

    <!-- GRID -->
    <div class="section-padding grid grid-cols-1 md:grid-cols-12 gap-9">
      <!-- STRUTTURE -->
      <div
        class="md:col-span-6 bg-white border border-dark/10 rounded-md overflow-hidden"
      >
        <div
          class="bg-dark text-white section-padding-x section-padding-y-half flex items-center gap-3"
        >
          <Icon name="ph:hospital-fill" class="text-secondary" />
          <h3 class="text-xs uppercase tracking-widest font-medium">
            Visita in struttura
          </h3>
        </div>

        <div class="section-padding">
          <div
            v-for="s in allStructures.filter(
              (s) =>
                s.id !== 'all' &&
                s.label &&
                !s.label.toLowerCase().includes('domicilio'),
            )"
            :key="s.id"
            class="flex items-center justify-between py-3 px-1.5 border-b border-dark/10 last:border-0"
          >
            <p class="text-sm md:text-base text-dark font-normal">
              {{ s.label }}
            </p>

            <NuxtLink
              :to="`/booking?struttura=${s.id}`"
              class="text-xs md:text-base font-medium px-3 py-1.5 rounded-md bg-primary/10 text-primary hover:bg-primary hover:text-white transition"
            >
              Prenota
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- DOMICILIO -->
      <div
        class="md:col-span-6 bg-secondary text-white rounded-md section-padding flex flex-col justify-between min-h-[260px]"
      >
        <div>
          <h3
            class="italic font-display text-3xl font-light leading-snug mb-[calc(var(--spacer)/2)]"
          >
            Visita a domicilio
          </h3>

          <p
            class="text-sm text-white/80 leading-relaxed mb-[calc(var(--spacer))]"
          >
            Prenota una visita direttamente a casa tua, con la stessa qualità
            della struttura.
          </p>
        </div>

        <NuxtLink
          to="/booking?struttura=ADC"
          class="inline-flex items-center gap-2 border border-white/60 px-6 py-3 rounded-md text-sm md:text-base font-medium hover:bg-white/10 transition self-start"
        >
          Vedi disponibilità
        </NuxtLink>
      </div>

      <div class="md:col-span-12">
        <ClientOnly>
          <LazyStructuresMap />
        </ClientOnly>
      </div>
    </div>
  </div>
</template>
