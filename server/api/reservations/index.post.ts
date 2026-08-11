import { BrevoClient } from '@getbrevo/brevo'
import { render } from '@vue-email/render'
import { monotonicFactory } from 'ulid'

import { databaseClient } from '~~/server/services/database-client'
import ClientEmail from '~/components/email/ReservationClient.vue'
import DocEmail from '~/components/email/ReservationDoc.vue'
import { ReservationsSchema } from '~~/shared/schemas/reservations'

export default eventHandler(async (event) => {
  /**
   * VALIDATION
   */
  const body = await readValidatedBody(event, ReservationsSchema.parse)
  const ulid = monotonicFactory()

  const reservationId = ulid()

  const sanityData = {
    id: reservationId,
    name: body.name,
    surname: body.surname,
    email: body.email,
    telephone: body.telephone,
    address: body.address,
    struttura: body.struttura,
    structure_id: body.structure_id,
    datetime: new Date(body.datetime).toISOString(),
    exam_name: body.exam_name,
    priceDisplay: body.priceDisplay,
    privacy_policy_date: new Date().toISOString(),
    status: body.source === 'sanity' ? 'PENDING' : 'EXTERNAL',
    ...(body.source === 'sanity' && body.exam_id?._ref
      ? { exam_id: body.exam_id }
      : {}),
  }
  const response = await databaseClient.create({
    _id: reservationId,
    _type: 'reservations',

    status: body.source === 'sanity' ? 'PENDING' : 'EXTERNAL',
  })

  /**
   * DATABASE mutation
   * Cloudflare D1
   */
  try {
    await db.insert(schema.users).values({
      id: reservationId,

      name: body.name,
      surname: body.surname,
      email: body.email,
      telephone: body.telephone,

      address: body.address ?? null,

      privacy_policy_date: new Date().toISOString(),

      exam_name: body.exam_name ?? null,
      datetime: new Date(body.datetime).toISOString(),

      struttura: body.struttura ?? null,
      priceDisplay: body.priceDisplay ?? null,

      source: body.source ?? null,
      structure_id: body.structure_id ?? null,
    })
  } catch (e) {
    console.error('DB INSERT ERROR (D1):', e)
  }

  /**
   * EMAIL
   */
  try {
    const { brevoApiKey } = useRuntimeConfig()
    if (!brevoApiKey) {
      throw new Error('Brevo API key mancante')
    }
    const brevo = new BrevoClient({ apiKey: brevoApiKey })
    const isSanity = body.source === 'sanity'
    const emailProps = {
      name: body.name,
      surname: body.surname,
      email: body.email,
      telephone: body.telephone,
      address: body.address ?? '',
      exam_name: body.exam_name ?? '',
      datetime: body.datetime ?? '',
      struttura: body.struttura ?? '',
      priceDisplay: body.priceDisplay ?? '',
    }
    const docHtml = await render(DocEmail, emailProps)
    if (isSanity) {
      const clientHtml = await render(ClientEmail, emailProps)
      await brevo.transactionalEmails.sendTransacEmail({
        sender: {
          name: 'Dottor Carmine Gentile',
          email: 'segreteria@dottorcarminegentile.it',
        },
        to: [{ email: body.email, name: `${body.name} ${body.surname}` }],
        subject: `Richiesta prenotazione per ${body.exam_name}`,
        htmlContent: clientHtml,
      })
    }
    await brevo.transactionalEmails.sendTransacEmail({
      sender: {
        name: 'Dottor Carmine Gentile',
        email: 'segreteria@dottorcarminegentile.it',
      },
      to: [{ email: 'segreteria@dottorcarminegentile.it' }],
      subject: `Nuova richiesta di prenotazione: ${body.name} ${body.surname} - ${body.exam_name}`,
      htmlContent: docHtml,
    })
  } catch (e) {
    console.error('Invio email fallito, prenotazione salvata comunque:', e)
  }
  return response
})

defineRouteMeta({
  openAPI: {
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              name: { type: 'string', default: 'test name' },
              surname: { type: 'string', default: 'test surname' },
              email: { type: 'string', default: 'test@ema.il' },
              telephone: { type: 'string', default: '+331231234567' },
              address: {
                type: 'string',
                default: 'A simple address, 1A, Milan, [MI]',
              },
            },
            required: ['name', 'surname', 'email', 'telephone', 'address'],
          },
        },
      },
    },
  },
})
