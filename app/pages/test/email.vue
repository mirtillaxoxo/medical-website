<script setup lang="ts">
import { render } from '@vue-email/render'
import { EmailReservationClient } from '#components'
import { EmailReservationDoc } from '#components'
import { EmailApproved } from '#components'
import { EmailRefused } from '#components'

// const html = await render(EmailReservationDoc, {
//   name: 'Martina',
//   surname: 'Zoia',
//   email: 'test@example.com',
//   telephone: '1234567890',
//   address: 'via Roma 10, Milano',
//   privacyConsent: true,
//   exam_name: 'Gastroscopia',
//   datetime: '2026-04-18T10:00:00.000Z',
//   struttura: 'Humanitas',
//   priceDisplay: '€100.00',
// })

// const html = await render(EmailApproved, {
//   name: 'Martina',
//   surname: 'Zoia',
//   email: 'test@example.com',
//   telephone: '1234567890',
//   address: 'via Roma 10, Milano',
//   privacyConsent: true,
//   exam_name: 'Gastroscopia',
//   datetime: '2026-04-18T10:00:00.000Z',
//   struttura: 'Humanitas',
//   priceDisplay: '€100.00',
// })

// const html = await render(EmailRefused, {
//   name: 'Martina',
//   surname: 'Zoia',
//   email: 'test@example.com',
//   telephone: '1234567890',
//   address: 'via Roma 10, Milano',
//   privacyConsent: true,
//   exam_name: 'Gastroscopia',
//   datetime: '2026-04-18T10:00:00.000Z',
//   struttura: 'Humanitas',
//   priceDisplay: '€100.00',
// })

const html = await render(EmailReservationClient, {
  name: 'Martina',
  surname: 'Zoia',
  email: 'test@example.com',
  telephone: '1234567890',
  address: 'via Roma 10, Milano',
  privacyConsent: true,
  exam_name: 'Gastroscopia',
  datetime: '2026-04-18T10:00:00.000Z',
  struttura: 'Humanitas',
  priceDisplay: '€100.00',
})
</script>

<template>
  <!-- <EmailReservationDoc
    name="Martina"
    surname="Zoia"
    email="test@example.com"
    telephone="1234567890"
    address="via Roma 10, Milano"
    privacyConsent="true"
    exam_name="Gastroscopia"
    datetime="2026-04-18T10:00:00.000Z"
    struttura="Humanitas"
    priceDisplay="€100.00"
  /> -->

  <EmailReservationClient
    name="Martina"
    surname="Zoia"
    email="test@example.com"
    telephone="1234567890"
    address="via Roma 10, Milano"
    privacyConsent="true"
    exam_name="Gastroscopia"
    datetime="2026-04-18T10:00:00.000Z"
    struttura="Humanitas"
    priceDisplay="€100.00"
  />

  <!-- <EmailApproved
    name="Martina"
    surname="Zoia"
    email="test@example.com"
    telephone="1234567890"
    address="via Roma 10, Milano"
    privacyConsent="true"
    exam_name="Gastroscopia"
    datetime="2026-04-18T10:00:00.000Z"
    struttura="Humanitas"
    priceDisplay="€100.00"
  /> -->

  <!-- <EmailRefused
    name="Martina"
    surname="Zoia"
    email="test@example.com"
    telephone="1234567890"
    address="via Roma 10, Milano"
    privacyConsent="true"
    exam_name="Gastroscopia"
    datetime="2026-04-18T10:00:00.000Z"
    struttura="Humanitas"
    priceDisplay="€100.00"
  /> -->
</template>
