<script lang="ts" setup>
import { useWindowSize, breakpointsTailwind } from '@vueuse/core'
const { data } = useFetch('/api/reviews')
const { width } = useWindowSize()
const isMobile = computed(() => width.value < breakpointsTailwind.md)

const reviews = computed(() => data.value?.reviews ?? [])
const rating = computed(() => data.value?.rating ?? 0)
const userRatingCount = computed(() => data.value?.userRatingCount ?? 0)
</script>

<template>
  <section class="section-padding-y">
    <div class="mx-auto section-padding-x">
      <!-- HEADER -->
      <div class="mb-12">
        <p
          class="text-xs md:text-lg font-medium uppercase tracking-[0.12em] text-primary mb-4"
        >
          Recensioni dei pazienti
        </p>

        <h2
          class="font-display italic text-3xl md:text-5xl font-light text-dark"
        >
          Cosa dicono di <span class="text-primary">me</span>
        </h2>
        <div class="mt-6 flex items-center gap-4 text-dark">
          <div class="flex items-center gap-3">
            <span class="text-xl font-medium">
              {{ rating.toFixed(1) }}
            </span>

            <div>
              <Icon
                v-for="i in Math.floor(rating) || 0"
                :key="`star-${i}`"
                name="i-ph-star-fill"
                class="text-yellow-400 -mb-0.5"
              />

              <Icon
                v-if="rating % 1 !== 0"
                name="i-ph:star-half-fill"
                class="text-yellow-400 -mb-0.5"
              />
            </div>
          </div>

          <span class="text-sm opacity-70">
            {{ userRatingCount }} recensioni Google
          </span>

          <NuxtLink
            to="https://www.google.com/search?sca_esv=fc15e49dbd266fb4&hl=it-IT&gl=it&sxsrf=APpeQnva38cFwcc3sM7Wspgw7i55uzoVww:1785852582110&uds=AJ5uw1_a2D0D09lxm8gpKKOTUn4r_qrbTxIuRPMiRG81FwjWW32Nhu5JleDg3BLde0KRusukPjBzXdfcJXqi24EHYnS2Fk6gAMlro5F-2GtIEU5nKcVV2zqNXbedmQwYqStcLXHEckXBHzai1WJlyKKt5zQyd8XHeE3p-mkESRQlBFxfPwm7DvxKd4pIhHlX3GK-uWgUBH-P_wERJJR4GUmtCKKeXhQYEYMGzKJE4cR9MGWxRcOfLYg&q=Dottor+Carmine+Gentile+Recensioni&si=APenkKm7iecQ4G6P-TsbSMFKIQtv3EFIqRAFw-i8uEbk55Z-_08DXAc_sF89z8T6gvVAZZwf6oJSoXjRJZmPHKodjv8Nl3BobTHHve49Z1KDNFzzNmqRDmoDLEzYJbFb9u4K4UcHmQQSUi5u9ydoquXMNIGaBsQEFw%3D%3D&sa=X&ved=2ahUKEwiviZumk4eWAxWs9LsIHQ2LE04Q_4MLegUIjwEQEA&cshid=1785852725271201&biw=1440&bih=778&dpr=2"
            target="_blank"
            rel="noopener noreferrer"
            class="text-sm text-primary underline underline-offset-4"
          >
            Vedi tutte le recensioni
          </NuxtLink>
        </div>
      </div>

      <!-- CAROUSEL -->
      <div class="relative group">
        <ClientOnly>
          <LazyCarousel
            :items-to-show="isMobile ? 1 : 3"
            :gap="24"
            :autoplay="2500"
            :transition="900"
            :wrap-around="true"
            :mouse-drag="true"
            :touch-drag="true"
            pauseAutoplayOnHover
          >
            <Slide v-for="r in reviews" :key="r.name">
              <AboutReviewCard :r="r" />
            </Slide>

            <template #addons>
              <div class="mt-10 flex justify-center">
                <Pagination />
              </div>
            </template>
          </LazyCarousel>
        </ClientOnly>
      </div>
    </div>
  </section>
</template>

<style scoped>
.carousel-pagination {
  display: flex;
  justify-content: center;
}

.carousel-pagination :deep(.carousel__pagination-button) {
  opacity: 0.25;
  width: 8px;
  height: 8px;
  border-radius: 999px;
  transition: all 0.3s ease;
}

.carousel-pagination :deep(.carousel__pagination-button--active) {
  opacity: 1;
  transform: scale(1.4);
}
</style>
