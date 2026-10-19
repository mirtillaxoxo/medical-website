<script setup lang="ts">
const { brandInfo } = useBrandInfo();
import { Section, Img, Text, Link } from "@vue-email/components";

function createContactUrl(type: string, value: string) {
  if (type === "email") return `mailto:${value}`;
  if (type === "phone") return `tel:${value}`;
  return value;
}
</script>

<template>
  <Section class="mt-12">
    <Img
      src="https://res.cloudinary.com/df6u4754l/image/upload/v1778163547/doctor_logo_fko1ga.svg"
      alt="Logo"
      width="80"
    />

    <Text class="text-dark font-bold mt-2">
      {{ brandInfo.titleShort }} <br />
      <span class="text-dark font-light"> Gastroenterologo </span>
    </Text>

    <Text>
      <div v-for="c in brandInfo.contacts" :key="c.value">
        <Link
          :href="createContactUrl(c.type, c.value)"
          class="text-sm text-secondary font-light"
        >
          {{ c.value }}
        </Link>
      </div>
    </Text>
  </Section>
</template>
