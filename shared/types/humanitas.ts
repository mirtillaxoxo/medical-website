type StructureCodes = 'ARS' | 'HMD' | string

export interface DoctorService {
  // hasssn: boolean
  // isssn: boolean
  // insurance: string
  // doctor: string
  structurelist: [
    {
      // contracts: [
      //   {
      //     code: string
      //     name: string
      //     type: string
      //     idcontract: string
      //   },
      // ]
      id: string
      code: StructureCodes
      name: string
      // text: string
    },
  ]
  // order: number
  exam_id: number
  // exam_area_id: number
  // exam_area: string
  // exam_tags: []
  name: string
  // price: number
  // is_htn: boolean
  // is_price_hidden: boolean
  // is_price_zero: boolean
  // is_pay_immediately: boolean
  // is_at_home: boolean
  // is_price_based_on_treatment: boolean
  // external_providercode: string | number | null
  // duration: number
  // description: string
  // short_description: string
  // required_docs: null
  // published_start_date: null
  // published_end_date: null
  external_code: string
  // seo_metas: null
  // seo_keywords: string
  seo_name: string
  is_reservable: boolean
  is_visible: boolean
  // standards_of_preparation: string
  // prescription: string
  // note: string
  // foracceptance: string
  // ready_for_publish: boolean
  // indexer_status: number
  // logourl: string | null
  // building: string
  // building_ssn: null
  // parking: string
  // type: string
  // price_type: 'General' | string
  // sala_pref_ssn: null
  // sala_excl_ssn: null
  // price_pkg_ssn: number
  // sala_pref_ist: null
  // sala_excl_ist: null
  // price_pkg_ist: number
  // price_form: number
  // exclude_hospital: null
  // athome_type: string
  // has_form_ssn: boolean
  // channel_availability: number
  // medicilio_department_id: null
  // medicilio_variant_id: null
  // exam_tags_string: string
  // publish_date: null
  // is_publish: boolean
  // id: number
  // created_at: string
  // updated_at: string
  // created_at_string: string
  // updated_at_string: string
}

export interface DoctorServiceAvailability {
  exam_id: number
  exam_name: string
  exam_code: string
  exam_description: string
  // standards_of_preparation: null
  doctorseoname: string // 'dott-gentile-carmine'
  struttura: StructureCodes
  // tipo_contratto: null
  // is_range: boolean
  // durata: 0
  datetime: string
  // room: string
  doctor_id: number // 10000
  // doctor_unique_code: null
  // doctor_code: string
  doctor_fullname: string
  doctor_description: null
  // doctor_vatcode: null
  // provider_code: 'I'
  // provider_type: 'L'
  // is_filtered: boolean
  // is_ssn: boolean
  availability: 'AVAILABLE' | string
  // first_occurrance: string
  price?: number
  // check_ctrl: string
  // price_ist: number
  // time_string: string
  // first_occurrance_tooltip: string
  price_string?: string
  // basedate1000: number
  // basedate: number
  // datetime_double: number
  // is_chronic: boolean
  time: string
  // token: string
  // idcontract: string
  // channel: string
  // doctor_title: null
  // doctor_seoname: null
  // resourceid: string
  // last_occurrance: null
}
