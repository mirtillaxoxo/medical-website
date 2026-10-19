<script setup lang="ts">
import "maplibre-gl/dist/maplibre-gl.css";
import L from "leaflet";

import { useStructures } from "~/composables/useStructures";

const { data: structures } = useStructures();

const markerIcon = L.divIcon({
  className: "custom-marker",
  html: `<div class="marker-shape"></div>`,
  iconSize: [25, 25],
  iconAnchor: [12, 25],
});

const allStructures = computed(() => [
  ...Array.from(
    Object.keys(structures.value || {}).map((k) => ({
      structure_id: k,
      ...structures.value[k],
    })),
  ),

  ...(structures.value ?? []),
]);

const locations = computed(() =>
  allStructures.value
    .map((s) =>
      s.location
        ? {
            name: s.title,
            address: s.location?.address,
            lat: s.location?.coordinates?.lat,
            lng: s.location?.coordinates?.lng,
            structure_id: s.structure_id,
            contacts: Array.isArray(s.contacts)
              ? s.contacts
              : s.contacts
                ? [s.contacts]
                : [],
            options: {
              icon: markerIcon,
            },
          }
        : {},
    )
    .filter((loc) => loc.lat),
);

const initialCenter = computed<[number, number] | null>(() => {
  const firstLocation = locations.value[0];

  if (!firstLocation) return null;

  return [firstLocation.lat, firstLocation.lng];
});

const map = useTemplateRef("map");

async function onMapReady() {
  if (!locations.value.length || !map.value) return;

  const leafletMap = map.value.leafletObject;

  // MapLibre + plugin Leaflet (solo client, caricati on demand)
  const maplibreModule = await import("maplibre-gl");
  const maplibregl = (maplibreModule as any).default ?? maplibreModule;
  // @ts-ignore
  window.maplibregl = maplibregl;
  await import("@maplibre/maplibre-gl-leaflet");

  // Base layer vettoriale OpenFreeMap (gratuito, senza API key)
  // @ts-ignore
  const gl = (L as any)
    .maplibreGL({
      style: "https://tiles.openfreemap.org/styles/liberty", // alternative: 'positron', 'bright'
    })
    .addTo(leafletMap);

  gl.getMaplibreMap().on("error", (e: any) =>
    console.error("MapLibre error", e),
  );

  const markers: any[] = [];

  locations.value.forEach((loc) => {
    const marker = L.marker(
      [Number(loc.lat), Number(loc.lng)],
      loc.options,
    ).addTo(leafletMap).bindPopup(`
      <div class="custom-popup">
        <h3 class="custom-popup__title">${loc.name}</h3>
        <p> <a  class="address-link"
    href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.address)}" 
    target="_blank"
    class="text-dark hover:text-secondary transition-colors"
  >
    ${loc.address}
  </a></p>
         <div >
      ${loc.contacts
        .map(
          (c) => `
        ${
          c.tel
            ? `<p class="icon"> <img src="/graphics/phone.svg" class="w-4 h-4" /><a class="contact-link" href="tel:${c.tel}">${c.tel}</a></p>`
            : ""
        }
        ${c.email ? `<p class="icon"> <img src="/graphics/email.svg" class="w-4 h-4" />  <a class="contact-link" href="mailto:${c.email}">${c.email}</a></p>` : ""}
        ${c.url ? `<p class="icon"> <img src="/graphics/website_window.svg" class="w-4 h-4" /><a class="contact-link" href="${c.url}" target="_blank">Website</a></p>` : ""}
      `,
        )
        .join("")}
    </div>

        <a href="/booking/?struttura=${loc.structure_id}" class="flex justify-center">
          <div class=" font-bold text-lg bg-primary text-white border border-white rounded-md px-3  uppercase shadow-md hover:bg-dark ">
            Prenota
          </div>
        </a>
      </div>
    `);

    markers.push(marker);
  });

  if (!markers.length) return;

  // zoom su tutti i marker
  const group = L.featureGroup(markers);
  leafletMap.fitBounds(group.getBounds().pad(0.03), { maxZoom: 9 });

  leafletMap.attributionControl.setPrefix(false);
}
</script>

<template>
  <div
    id="structures-map"
    v-if="initialCenter"
    class="relative w-full rounded-md overflow-hidden shadow-md border border-white"
  >
    <!-- Nessun LTileLayer: il base layer è aggiunto in onMapReady -->
    <LMap
      ref="map"
      style="height: 300px"
      :zoom="9.5"
      :center="initialCenter"
      :use-global-leaflet="true"
      :options="{ scrollWheelZoom: false }"
      @ready="onMapReady"
    />
  </div>
</template>

<style>
@reference '~/assets/css/main.css';

.leaflet-control-zoom {
  display: none;
}

.custom-marker {
  background: transparent;
  border: none;
}

.marker-shape {
  width: 25px;
  height: 25px;
  background-color: var(--color-dark);

  mask-image: url("/graphics/mapMarker.svg");
  mask-repeat: no-repeat;
  mask-position: center;
  mask-size: contain;
}

/* bordo popup */
.leaflet-popup-content-wrapper {
  @apply border border-gray-50;
}

.custom-popup {
  @apply w-60 rounded-md;
}
/* freccetta sotto */
.leaflet-popup-tip {
  @apply bg-dark;
}

/* titolo */
.custom-popup__title {
  @apply font-body font-bold uppercase text-dark text-base md:text-lg;
}

/* indirizzo */

.leaflet-popup-content a.address-link {
  @apply text-dark hover:text-primary underline;
}

/*contatti*/

.leaflet-popup-content a.contact-link {
  @apply text-dark hover:text-secondary;
}

.leaflet-popup-content p.icon {
  @apply flex items-center gap-2;
}

.iconify {
  width: 18px;
  height: 18px;
}

/* attribuzione piccola */
.leaflet-control-attribution {
  font-size: 3px;
  line-height: 1.2;
  padding: 0 4px;
  background: rgba(255, 255, 255, 0.6);
}
</style>
