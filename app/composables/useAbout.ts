import type { Image, PortableTextBlock } from 'sanity'

export function useAbout() {
  const query = groq`*[_type == "about"][0]`

  return useSanityQuery<{
    description_fields: Array<{
      title?: string
      description: PortableTextBlock
    }>
    image: Image
    documents: Array<{
      _key: string
      title: string
      documents: Array<{
        _key: string
        asset: { _ref: string }
      }>
    }>
  }>(query)
}
