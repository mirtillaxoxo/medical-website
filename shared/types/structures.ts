import type { ExamsDocument } from '~~/shared/types/exams'

export type StructuresDocument = {
  _id: string
  title: string
  structure_id: string

  contacts?: Contact[]

  exams?: StructureExam[]

  location: Location

  note?: string
}

export type Contact = {
  email: string
  tel: string
  url: string
}

export type StructureExam = {
  exam: ExamsDocument
  datetime: Recurrence
}

export type Recurrence = {
  _type: 'recurrence'
  dates: string[]
}

export interface Location {
  title: string

  coordinates?: {
    lat: number
    lng: number
  }

  address: string
}
