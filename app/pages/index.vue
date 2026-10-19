<script setup lang="ts">
const { load } = useBrandInfo();
await callOnce(() => load());
</script>

<template>
  <article class="flex flex-col">
    <!-- HERO / ABOUT -->
    <section class="grid grid-cols-1 md:grid-cols-12">
      <div class="md:col-start-2 md:col-end-12 flex flex-col items-center">
        <div class="flex flex-col md:flex-row items-center justify-center">
          <AboutHeroSection />
        </div>
      </div>
    </section>

    <!-- RECENSIONI -->
    <!-- 
    <section
      class="grid grid-cols-1 md:grid-cols-12 section-padding-y mt-9 bg-secondary/10 -mx-(--spacer)"
    >
      <div class="md:col-start-2 md:col-end-12">
        <LazyAboutReviewsContainer />
      </div>
    </section> -->

    <!-- ESAMI -->
    <section class="grid grid-cols-1 md:grid-cols-12 section-padding-y">
      <div class="md:col-start-2 md:col-end-12">
        <ExamCard />
      </div>
    </section>

    <!-- STRUTTURE -->

    <section
      class="grid grid-cols-1 md:grid-cols-12 bg-secondary/10 border-t border-dark/10 -mx-(--spacer)"
    >
      <div class="md:col-start-2 md:col-end-12 section-padding">
        <StructuresServicesCard />
      </div>
    </section>

    <section
      class="grid grid-cols-1 md:grid-cols-12 section-padding-y border-t border-primary/20 -mx-(--spacer)<"
    >
      <div
        class="md:col-start-2 md:col-end-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-10 section-padding-x"
      >
        <div>
          <h2
            class="italic font-display text-4xl md:text-5xl font-light leading-[1.1]"
          >
            Prenota la tua <br />
            visita <em class="text-primary"> adesso</em>
          </h2>

          <p class="text-base mt-3 font-light text-dark/80">
            Disponibile in struttura e a domicilio — Milano e provincia
          </p>
        </div>

        <!-- CTA -->
        <NuxtLink
          to="/booking"
          class="inline-flex items-center justify-center bg-primary text-white px-6 py-3 rounded-md text-base font-medium tracking-wide hover:bg-dark transition whitespace-nowrap"
        >
          Prenota ora →
        </NuxtLink>
      </div>
    </section>
  </article>
</template>
