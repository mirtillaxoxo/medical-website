import { readdir } from "fs/promises";
import { resolve } from "path";
import tailwindcss from "@tailwindcss/vite";
import pluginVue from "@vitejs/plugin-vue";

import { brandInfo } from "./config/brand-info";

import { varlockCloudflareVitePlugin } from "@varlock/cloudflare-integration";
import { varlockVitePlugin } from "@varlock/vite-integration";

const cssFolder = resolve("./app/assets/css");

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@pinia/nuxt",
    "@pinia/colada-nuxt",
    "@nuxt/fonts",
    "@nuxt/image",
    "@nuxtjs/sanity",
    "@nuxtjs/leaflet",
    "@nuxt/icon",
    "@nuxtjs/html-validator",
    "@nuxtjs/seo",
    "@nuxthub/core",
    "vue3-carousel-nuxt",
  ],

  css: [...(await readdir(cssFolder)).map((f: string) => `${cssFolder}/${f}`)],

  app: {
    head: {
      meta: [
        {
          property: "og:image",
          content: `${brandInfo.websiteUrl}/graphics/logo.png`,
        },
        { property: "og:image:type", content: "image/png" },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { name: "twitter:card", content: "summary_large_image" },
        {
          name: "twitter:image",
          content: `${brandInfo.websiteUrl}/graphics/logo.png`,
        },
      ],
    },
  },

  site: {
    name: brandInfo.title,
    description: brandInfo.description,
    url: brandInfo.websiteUrl,
    defaultLocale: "it-IT",
  },

  runtimeConfig: {
    sanity: {
      token: process.env.SANITY_TOKEN_READ_ONLY,
    },
    sanityWriteToken: process.env.SANITY_TOKEN,
    // external to be verified in webhooks
    sanityProjectId: process.env.SANITY_PROJECT_ID,

    google: {
      maps_places_api_key: process.env.GOOGLE_MAPS_PLACES_API_KEY,
      place_id: process.env.GOOGLE_MAPS_PLACE_ID,
    },
    brevoApiKey: process.env.BREVO_API_KEY,
    reservationsApiToken: process.env.RESERVATIONS_API_TOKEN,
  },

  fonts: {
    defaults: {
      weights: [400, 500, 600],
    },
  },

  icon: {
    customCollections: [
      {
        prefix: "cg",
        dir: "./app/assets/icons",
      },
    ],
  },

  image: {
    sanity: {
      projectId: process.env.SANITY_PROJECT_ID!,
      dataset: process.env.SANITY_DATASET!,
    },
  },

  leaflet: {
    markerCluster: true,
  },

  pinia: {
    storesDirs: ["./app/stores/**"],
  },

  sanity: {
    apiVersion: "v2026-02-27",
    projectId: process.env.SANITY_PROJECT_ID,
    dataset: process.env.SANITY_DATASET,
  },

  ogImage: {
    enabled: false,
  },

  hub: {
    kv: true,
    db: {
      dialect: "sqlite",
      // driver: 'd1',
      casing: "snake_case",
      // connection: {
      //   // @ts-ignore
      //   databaseId: ENV.NUXT_HUB_CLOUDFLARE_DATABASE_ID,
      // },
      // for Cloudflare D1 we need to disable auto-migrations during build
      // https://hub.nuxt.com/docs/database/migrations#automatic-migrations
      applyMigrationsDuringBuild: false,

      /**
       * To disable automatic migrations during nuxt dev,
       * set applyMigrationsDuringDev to false
       * (useful when running dev with production env vars):
       *
       * https://hub.nuxt.com/docs/database/migrations#automatic-migrations
       */
      // applyMigrationsDuringDev: false,
    },
  },
  nitro: {
    compatibilityDate: "2026-06-22",
    preset: "cloudflare_module",
    cloudflare: {
      deployConfig: true,
    },

    rollupConfig: {
      plugins: [pluginVue()],
    },

    experimental: {
      openAPI: true,
    },
  },

  vite: {
    plugins: [
      process.env.NODE_ENV === "development"
        ? varlockVitePlugin()
        : varlockCloudflareVitePlugin(),

      tailwindcss(),
    ],
    optimizeDeps: {
      include: [
        "leaflet", // CJS
        "leaflet.markercluster", // CJS
        "@pinia/colada-devtools",
        "@vueuse/core",
      ],
    },
  },

  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
});
