/**
 * SANITY
 */
const sanity = useSanity()
const config = useRuntimeConfig()

export const databaseClient = sanity.client.withConfig({
  token: config.sanityWriteToken,
  useCdn: false,
})
