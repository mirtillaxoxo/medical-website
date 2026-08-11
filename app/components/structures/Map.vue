<script setup lang="ts">
import L from "leaflet";
import { useStructures } from "~/composables/useStructures";

const { data: structures } = useStructures();

const markerIcon = L.divIcon({
  className: "custom-marker",
  html: `<div class="marker-shape"></div>`,
  iconSize: [25, 25],
  iconAnchor: [12, 25],
});

const locations = computed(() =>
  (structures.value ?? [])
    .filter((s) => s.location?.coordinates)
    .map((s) => ({
      name: s.title,
      address: s.location?.address ?? "",
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
    })),
);

const initialCenter = computed<[number, number] | null>(() => {
  const firstLocation = locations.value[0];

  if (!firstLocation) return null;

  return [Number(firstLocation.lat), Number(firstLocation.lng)];
});

const map = useTemplateRef("map");

function onMapReady() {
  if (!locations.value.length || !map.value) return;

  const leafletMap = map.value.leafletObject;
  const markers: L.Marker[] = [];

  locations.value.forEach((loc) => {
    const marker = L.marker(
      [Number(loc.lat), Number(loc.lng)],
      loc.options,
    ).addTo(leafletMap).bindPopup(`
        <div class="custom-popup">
          <h3 class="custom-popup__title">
            ${loc.name}
          </h3>

          ${
            loc.address
              ? `
                <p>
                  <a
                    class="address-link"
                    href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.address)}"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ${loc.address}
                  </a>
                </p>
              `
              : ""
          }

          <div>
            ${loc.contacts
              .map(
                (c) => `
                  ${
                    c.tel
                      ? `
                        <p class="icon">
                          <img
                            src="/graphics/phone.svg"
                            class="w-4 h-4"
                          />
                          <a
                            class="contact-link"
                            href="tel:${c.tel}"
                          >
                            ${c.tel}
                          </a>
                        </p>
                      `
                      : ""
                  }

                  ${
                    c.email
                      ? `
                        <p class="icon">
                          <img
                            src="/graphics/email.svg"
                            class="w-4 h-4"
                          />
                          <a
                            class="contact-link"
                            href="mailto:${c.email}"
                          >
                            ${c.email}
                          </a>
                        </p>
                      `
                      : ""
                  }

                  ${
                    c.url
                      ? `
                        <p class="icon">
                          <img
                            src="/graphics/website_window.svg"
                            class="w-4 h-4"
                          />
                          <a
                            class="contact-link"
                            href="${c.url}"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Website
                          </a>
                        </p>
                      `
                      : ""
                  }
                `,
              )
              .join("")}
          </div>

          <a
            href="/booking/?struttura=${loc.structure_id}"
            class="flex justify-center"
          >
            <div
              class="font-bold text-lg bg-primary text-white border border-white rounded-md px-3 uppercase shadow-md hover:bg-dark"
            >
              Prenota
            </div>
          </a>
        </div>
      `);

    markers.push(marker);
  });

  if (!markers.length) return;

  const group = L.featureGroup(markers);

  leafletMap.fitBounds(group.getBounds().pad(0.03), {
    maxZoom: 9,
  });
}
</script>

<template>
  <div
    v-if="initialCenter"
    id="structures-map"
    class="relative w-full rounded-md overflow-hidden shadow-md border border-white"
  >
    <LMap
      ref="map"
      style="height: 300px"
      :zoom="9.5"
      :center="initialCenter"
      :use-global-leaflet="true"
      :options="{ scrollWheelZoom: false }"
      @ready="onMapReady"
    >
      <LTileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution="© OpenStreetMap © CARTO"
        layer-type="base"
        name="Structures"
        class="z-0"
      />
    </LMap>
  </div>
</template>

<style>
@reference '~/assets/css/main.css';

.leaflet-control-zoom {
  display: none;
}

.leaflet-control-attribution {
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

.leaflet-popup-content-wrapper {
  @apply border border-gray-50;
}

.custom-popup {
  @apply w-60 rounded-md;
}

.leaflet-popup-tip {
  @apply bg-dark;
}

.custom-popup__title {
  @apply font-body font-bold uppercase text-dark text-base md:text-lg;
}

.leaflet-popup-content a.address-link {
  @apply text-dark hover:text-primary underline;
}

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
</style>
