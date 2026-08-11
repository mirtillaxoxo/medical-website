import type { BrandInfo } from '~~/config/brand-info'

export function createContactUrl({
  type,
  value,
}: {
  type: BrandInfo['contacts'][number]['type']
  value: string
}) {
  const contactMapping: { [key in typeof type]: string } = {
    phone: 'tel:',
    email: 'mailto:',
  }

  return `${contactMapping[type]}${value}`
}
