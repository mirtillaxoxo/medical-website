export const websitePages: Array<{
  title: string
  slug: string
  sections?: Array<{ title: string; slug: string }>
}> = [
  { title: 'Prenota', slug: '/booking' },
  { title: 'Home', slug: '/' },
  {
    title: 'Servizi',
    slug: '/services',
    sections: [
      // { title: "Visita in Struttura", slug: "#structures" },
      // { title: "Visita a Domicilio", slug: "#homevisit" },
      // { title: 'Videoconsulto', slug: '#videoconsultation' },
    ],
  },
  { title: 'Esami', slug: '/exams' },
  { title: 'Chi sono', slug: '/about' },
]
