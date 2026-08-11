// https://github.com/nuxt-modules/leaflet/issues/75#issuecomment-2736480892

import L from 'leaflet'
import 'leaflet.markercluster'

export default defineNuxtPlugin((nuxtApp) => ({
  provide: {
    L,
  },
}))
