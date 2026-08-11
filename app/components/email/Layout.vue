<script setup lang="ts">
import {
  Html,
  Head,
  Style,
  Font,
  Preview,
  Tailwind,
  Body,
} from '@vue-email/components'

interface Props {
  title: string
  preview?: string
}

defineProps<Props>()
</script>

<template>
  <Html lang="it">
    <Tailwind
      :config="{
        theme: {
          extend: {
            colors: {
              primary: '#029e9d',
              secondary: '#83c1c5',
              dark: '#014561',
            },
          },
        },
      }"
    >
      <Head>
        <title>{{ title }}</title>
        <Style> #email-template { font-family: 'DM Sans', sans-serif; } </Style>
        <Font
          font-family="DM Sans"
          fallback-font-family="sans-serif"
          :web-font="{
            url: 'https://cdn.jsdelivr.net/fontsource/fonts/dm-sans@latest/latin-400-normal.woff2',
            format: 'woff2',
          }"
        />
      </Head>
      <Preview v-if="preview">{{ preview }}</Preview>

      <Body id="email-template" class="m-6">
        <slot />
      </Body>
    </Tailwind>
  </Html>
</template>
