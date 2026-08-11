import { z } from 'zod'

export const ReservationsSchema = z.object({
  _id: z.string().optional(),
  exam_id: z
    .object({
      _type: z.literal('reference'),
      _ref: z.string().optional(),
    })
    .optional(), // presente solo per prenotazioni interne (Sanity)
  status: z.enum(['PENDING', 'APPROVED', 'REFUSED', 'EXTERNAL']).optional(),
  confirmation_email_timestamp: z.string().optional(),
  email_status: z.enum(['PENDING', 'SENDING', 'SENT']).optional(),
  name: z.string(),
  surname: z.string(),
  email: z.email(),
  telephone: z.string().regex(/^\+?\d{9,15}$/),
  address: z.string().optional(),
  privacy_policy_date: z.string().optional(),
  exam_name: z.string(),
  datetime: z.string(),
  struttura: z.string(),
  priceDisplay: z.string().optional().nullable(),
  source: z.string().optional(),
  structure_id: z.string(),
})
export type ReservationsSchemaType = z.infer<typeof ReservationsSchema>
