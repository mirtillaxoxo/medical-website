<script setup lang="ts">
import {
  Button,
  Container,
  Heading,
  Hr,
  Html,
  Img,
  Section,
  Text,
} from '@vue-email/components'

import { default as EmailLayout } from '~/components/email/Layout.vue'
import EmailFooter from '~/components/email/Footer.vue'
//props
interface Props {
  name: string
  surname: string
  email: string
  telephone: string
  address?: string

  exam_name?: string
  datetime?: string
  struttura?: string
  priceDisplay?: string
}
defineProps<Props>()

const formatDatetime = (iso?: string) => {
  if (!iso) return ''

  const normalized = /Z|[+-]\d{2}:\d{2}$/.test(iso) ? iso : iso + 'Z'

  return new Date(normalized).toLocaleString('it-IT', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Rome',
  })
}
</script>

<template>
  <EmailLayout
    :title="`${name} ${surname} ha effettuato una richiesta di prenotazione - ${exam_name} presso ${struttura}`"
    :preview="`
    ${name} ${surname} ha effettuato una richiesta di prenotazione`"
  >
    <Section class="flex justify-center mt-6 mb-6" style="margin-top: 24px">
      <Img
        src="https://res.cloudinary.com/df6u4754l/image/upload/v1778163547/doctor_logo_fko1ga.svg"
        alt="Logo carmine gentile"
        width="80"
        height="auto"
      />
    </Section>

    <Container class="mt-6">
      <Heading as="h1" class="text-dark font-bold text-2xl my-6">
        Nuova richiesta di prenotazione per {{ exam_name }} da {{ name }}
        {{ surname }} presso
        {{ struttura }}
      </Heading>
      <br />

      <br />
      <Heading as="h2" class="text-dark text-xl my-6">
        Repilogo della richiesta di prenotazione:
      </Heading>

      <Section class="mt-6 text-left text-sm">
        <Text class="font-bold text-base mb-2 uppercase text-primary"
          >Anagrafica:</Text
        >

        <Text class="font-medium"
          >NOME: <span class="font-bold">{{ name }} </span> <br />
          COGNOME: <span class="font-bold"> {{ surname }} </span></Text
        >

        <Text
          >EMAIL: <span class="font-bold"> {{ email }} </span><br />
          TELEFONO: <span class="font-bold"> {{ telephone }} </span> <br />
          <span v-if="address">
            INDIRIZZO:
            <a
              class="font-bold text-primary underline"
              :href="`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ address }}
            </a>
            <br />
          </span>
        </Text>
      </Section>

      <Hr />

      <Section class="mt-6 text-left text-sm">
        <Text class="font-bold text-base mb-2 uppercase text-primary"
          >Dettagli della richiesta:</Text
        >
        <Text
          >ESAME: <span class="font-bold"> {{ exam_name }} </span><br />
          DATA:
          <span class="font-bold">
            {{ formatDatetime(datetime) }}
          </span>
          <br />
          STRUTTURA:
          <span class="font-bold"> {{ struttura }} </span><br />
          <span v-if="priceDisplay">
            PREZZO: <span class="font-bold">{{ priceDisplay }}</span
            ><br />
          </span>
        </Text>
      </Section>

      <Hr />

      <EmailFooter email="email" />
    </Container>
  </EmailLayout>
</template>
