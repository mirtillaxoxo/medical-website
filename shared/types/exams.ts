import type { PortableTextBlock, Image } from 'sanity'
import type { StructuresDocument } from '~~/shared/types/structures'

export interface ExamsDocument {
  _id: string
  title: string
  slug: {
    current: string
  }
  description?: PortableTextBlock

  when?: ExamDescription

  how?: ExamDescription

  preparation?: ExamDescription

  FAQ?: ExamDescription

  info?: ExamDescription[]

  prices?: Array<{
    structure_id: string
    amount: number
    currency?: string
  }>

  // strumentations?: Array<{
  //   title: string
  //   description: string
  //   slug: {
  //     current: string
  //   }
  // }>
}

export interface ExamDescription {
  _type: 'exam_description'
  title?: string
  cta?: boolean
  description?: PortableTextBlock[]
  image?: Image
}

export type Timeslot = {
  examKey?: string
  exam_name: string
  datetime: string
  struttura: string
  structure_id: string
  seo_name?: string
  exam_id?: string
  source?: 'api' | 'sanity'
}
