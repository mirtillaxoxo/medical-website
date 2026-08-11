import { eq } from 'drizzle-orm'

export default eventHandler(async (event) => {
  const { reservationsApiToken } = useRuntimeConfig()
  const providedToken = getRequestHeader(event, 'x-api-token')

  if (!reservationsApiToken || providedToken !== reservationsApiToken) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing id',
    })
  }

  console.log({ id })

  const reservation = await db.query.users.findFirst({
    where: eq(schema.users.id, id),
  })

  if (!reservation) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Reservation not found',
    })
  }
  return reservation
})
