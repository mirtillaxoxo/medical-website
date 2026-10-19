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
} from "@vue-email/components";
const { brandInfo } = useBrandInfo();

import { default as EmailLayout } from "~/components/email/Layout.vue";
import EmailFooter from "~/components/email/Footer.vue";

//PROPS
interface Props {
  name: string;
  surname: string;
  email: string;
  telephone: string;
  address?: string;

  exam_name?: string;
  datetime?: string;
  struttura?: string;
  priceDisplay?: string;
}
defineProps<Props>();
</script>

<template>
  <EmailLayout
    :title="`Prenotazione NON confermata ${name} ${surname} - ${exam_name}`"
    :preview="`
    ${name} ${surname} prenotazione NON confermata`"
  >
    <Section class="flex justify-center mt-6 mb-6">
      <Img
        src="https://res.cloudinary.com/df6u4754l/image/upload/v1778163547/doctor_logo_fko1ga.svg"
        alt="Logo carmine gentile"
        width="80"
        height="auto"
      />
    </Section>

    <Container class="mt-6">
      <Heading as="h1" class="text-dark font-bold text-2xl my-6 font-display">
        {{ name }}, purtroppo NON è stato possibile confermare la sua
        prenotazione
      </Heading>
      <br />

      <br />
      <Heading as="h2" class="text-primary text-xl my-6">
        NON siamo riusciti a confermare la sua prenotazione
      </Heading>

      <Text>
        Gentile {{ name }} {{ surname }}, la informiamo che la sua prenotazione
        con {{ brandInfo.title }} non è stata confermata a causa della mancata
        disponibilità per la data selezionata.
      </Text>
      <Text>
        La invitiamo a riprovare a effettuare una nuova prenotazione tramite il
        sito, scegliendo una delle altre date disponibili, oppure a contattare
        direttamente {{ brandInfo.titleShort }} rispondendo a questa e-mail.
      </Text>

      <Hr />

      <EmailFooter email="email" />
    </Container>
  </EmailLayout>
</template>
