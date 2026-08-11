import { defineQuery, useQuery } from '@pinia/colada'

export const useStructures = defineQuery(() => {
  const { data } = useQuery({
    key: ['structures'],
    query: () => $fetch('/api/structures'),
    gcTime: 10 * 60_000, // minutes before re-fetch
  })

  return { data }
})
