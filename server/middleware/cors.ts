export default defineEventHandler((event) => {
  const origin = getHeader(event, 'origin')

  const allowedOrigins = [
    'http://localhost:3333',
    'https://carmine-gentile.sanity.studio',
  ]

  if (origin && allowedOrigins.includes(origin)) {
    setHeader(event, 'Access-Control-Allow-Origin', origin)
  }

  setHeader(event, 'Access-Control-Allow-Methods', 'GET, OPTIONS')
  setHeader(
    event,
    'Access-Control-Allow-Headers',
    'Content-Type, x-api-token, Authorization',
  )

  if (event.method === 'OPTIONS') {
    setResponseStatus(event, 204)
    return ''
  }
})
