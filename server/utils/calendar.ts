export function generateIcsEvent({
  uid,
  title,
  description,
  location,
  startIso,
  durationMinutes = 30,
  organizerEmail,
  organizerName,
}: {
  uid: string
  title: string
  description?: string
  location?: string
  startIso: string
  durationMinutes?: number
  organizerEmail?: string
  organizerName?: string
}) {
  const start = new Date(startIso)
  const end = new Date(start.getTime() + durationMinutes * 60000)

  const formatDate = (d: Date) =>
    d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'

  const escapeText = (str: string) =>
    str
      .replace(/\\/g, '\\\\')
      .replace(/;/g, '\\;')
      .replace(/,/g, '\\,')
      .replace(/\n/g, '\\n')

  const organizerLine = organizerEmail
    ? `ORGANIZER${organizerName ? `;CN=${escapeText(organizerName)}` : ''}:mailto:${organizerEmail}`
    : ''

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Dott. Carmine Gentile//Prenotazioni//IT',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${formatDate(new Date())}`,
    `DTSTART:${formatDate(start)}`,
    `DTEND:${formatDate(end)}`,
    `SUMMARY:${escapeText(title)}`,
    location ? `LOCATION:${escapeText(location)}` : '',
    description ? `DESCRIPTION:${escapeText(description)}` : '',
    organizerLine,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean)

  return lines.join('\r\n')
}
