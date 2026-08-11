import { BrevoClient } from '@getbrevo/brevo'
import {
  ReservationsSchema,
  ReservationsSchemaType,
} from '~~/shared/schemas/reservations'
import { render } from '@vue-email/render'
import ApprovedEmail from '~/components/email/Approved.vue'
import RefusedEmail from '~/components/email/Refused.vue'
import { databaseClient } from '~~/server/services/database-client'
import { generateIcsEvent } from '~~/server/utils/calendar'

export default eventHandler(async (event) => {
  try {
    const { _id, status, confirmation_email_timestamp, email_status } =
      await readValidatedBody(
        event,
        ReservationsSchema.pick({
          _id: true,
          status: true,
          confirmation_email_timestamp: true,
          email_status: true,
        }).parse,
      )

    const { sanityProjectId } = useRuntimeConfig()

    const projectId = getRequestHeader(event, 'sanity-project-id')

    if (sanityProjectId !== projectId) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized',
      })
    }

    /**
     * STATUS CHECK
     */
    const watchedStatuses: Array<ReservationsSchemaType['status']> = [
      'APPROVED',
      'REFUSED',
    ]

    if (!watchedStatuses.includes(status)) {
      return {
        webhook: 'status not watched',
      }
    }

    /**
     * IDEMPOTENCY CHECK
     * blocca webhook duplicati
     */
    if (email_status === 'SENDING' || email_status === 'SENT') {
      console.log('EMAIL ALREADY PROCESSED', {
        _id,
        email_status,
      })

      return {
        webhook: 'email already processed',
      }
    }

    const { reservationsApiToken } = useRuntimeConfig()

    /**
     * RECUPERO DATI PRENOTAZIONE
     */
    const user = await $fetch(`/api/studio/reservations/${_id}`, {
      headers: {
        'x-api-token': reservationsApiToken,
      },
    })

    const isApproved = status === 'APPROVED'

    const {
      name,
      surname,
      datetime,
      email,
      exam_name,
      struttura,
      structure_id,
    } = user

    /**
     * BLOCCO IMMEDIATO
     * evita doppio webhook contemporaneo
     */
    await databaseClient
      .patch(_id!)
      .set({
        email_status: 'SENDING',
      })
      .commit()

    let structure: Pick<
      StructuresDocument,
      '_id' | 'location' | 'contacts'
    > | null = null

    if (isApproved) {
      structure = await databaseClient.fetch(
        '*[_type == "structures" && structure_id == $structure_id][0]{_id, location, contacts}',
        {
          structure_id,
        },
      )
    }

    /**
     * ICS SOLO APPROVATE
     */
    const icsAttachment =
      isApproved && datetime
        ? [
            {
              filename: 'prenotazione-visita-dottor-Carmine-Gentile.ics',

              content: generateIcsEvent({
                uid: `${_id}@dottorcarminegentile.it`,
                title: `Prenotazione: ${exam_name ?? ''}`,
                location: structure?.location?.address ?? struttura,
                startIso: datetime,
                durationMinutes: 60,
                organizerEmail: 'segreteria@dottorcarminegentile.it',
                organizerName: 'Dott. Carmine Gentile',
              }),
            },
          ]
        : []

    /**
     * BREVO
     */
    const { brevoApiKey } = useRuntimeConfig()

    if (!brevoApiKey) {
      throw new Error('Brevo API key mancante')
    }

    const brevo = new BrevoClient({
      apiKey: brevoApiKey,
    })

    const emailComponent = isApproved ? ApprovedEmail : RefusedEmail

    const htmlContent = await render(emailComponent, user)

    const textContent = await render(emailComponent, user, {
      plainText: true,
    })

    console.log('SENDING EMAIL', {
      _id,
      status,
      email,
      isApproved,
      attachments: icsAttachment.length,
    })

    await brevo.transactionalEmails.sendTransacEmail({
      sender: {
        name: 'Dottor Carmine Gentile',
        email: 'segreteria@dottorcarminegentile.it',
      },

      to: [
        {
          email,
          name: `${name} ${surname}`,
        },
      ],

      subject: `${
        isApproved ? 'Prenotazione confermata' : 'Prenotazione NON confermata'
      } - Dottor Carmine Gentile`,

      htmlContent,
      textContent,

      ...(icsAttachment.length > 0 && {
        attachment: icsAttachment.map((file) => ({
          name: file.filename,
          content: Buffer.from(file.content).toString('base64'),
        })),
      }),
    })

    /**
     * EMAIL INVIATA
     */
    await databaseClient
      .patch(_id!)
      .set({
        email_status: 'SENT',
        confirmation_email_timestamp: new Date().toISOString(),
      })
      .commit()

    /**
     * RIMUOVE DISPONIBILITÀ
     */
    if (isApproved) {
      const structureDocumentId = await databaseClient.fetch(
        '*[_type == "structures" && structure_id == $structure_id][0]{_id}._id',
        {
          structure_id,
        },
      )

      await databaseClient
        .patch(structureDocumentId)
        .unset([`exams..datetime.dates[@=="${datetime}"]`])
        .commit()
    }

    return {
      webhook: 'ok',
    }
  } catch (e) {
    console.error(e)

    throw e
  }
})

defineRouteMeta({
  openAPI: {
    parameters: [
      {
        in: 'header',
        name: 'sanity-project-id',
        schema: {
          type: 'string',
          example: 'onujmo16',
        },
      },
    ],
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
          },
        },
      },
    },
  },
})
