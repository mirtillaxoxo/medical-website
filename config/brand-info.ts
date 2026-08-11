export const brandInfo: {
  title: string
  titleShort: string
  subtitle: string
  description: string
  name: string
  surname: string
  websiteUrl: string
  contacts: Array<{
    title: string
    type: 'phone' | 'email'
    value: string
    icon?: string
  }>
  accounts: Array<{
    title: string
    value: string
    icon: string
  }>
} = {
  title: 'Dottor Carmine Gentile',
  titleShort: 'Dr. Carmine Gentile',
  subtitle: 'Gastroenterologo',
  description: 'Gastroenterologia',
  name: 'Carmine',
  surname: 'Gentile',
  websiteUrl: 'dottorcarminegentile.it',
  contacts: [
    {
      title: 'Telefono',
      type: 'phone',
      value: '+393513877510',
      icon: 'i-ph:phone-fill',
    },
    {
      title: 'Email',
      type: 'email',
      value: 'segreteria@dottorcarminegentile.it',
      icon: 'i-ph:envelope-open-fill',
    },
  ],
  accounts: [
    // {
    //   title: 'iDoctors',
    //   value: 'https://www.idoctors.it/medico/18873/0',
    // },
    {
      title: 'Humanitas',
      value: 'https://prenota.humanitas.it/medico/dott-gentile-carmine',
      icon: 'i-ph:hospital-fill',
    },
    {
      title: 'Linkedin',
      value: 'https://it.linkedin.com/in/carmine-gentile-63a7a8169',
      icon: 'i-ph:linkedin-logo-fill',
    },
    {
      title: 'Google',
      value: 'https://share.google/w17qOmGwCHIMx3le7',
      icon: 'i-ph:google-logo-fill',
    },
  ],
}

export type BrandInfo = typeof brandInfo
