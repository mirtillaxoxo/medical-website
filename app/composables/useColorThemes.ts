import {
  colorsPrimary,
  colorsSecondary,
  colorsDark,
} from '~~/shared/utils/colors'

export const useThemeColors = () => {
  const primary = useState('theme-primary', () => colorsPrimary[0])

  const secondary = useState('theme-secondary', () => colorsSecondary[0])

  const dark = useState('theme-dark', () => colorsDark[0])

  const applyColors = () => {
    if (!import.meta.client) return

    document.documentElement.style.setProperty('--color-primary', primary.value)

    document.documentElement.style.setProperty(
      '--color-secondary',
      secondary.value,
    )

    document.documentElement.style.setProperty('--color-dark', dark.value)

    localStorage.setItem('color-primary', primary.value)

    localStorage.setItem('color-secondary', secondary.value)

    localStorage.setItem('color-dark', dark.value)
  }

  const loadColors = () => {
    if (!import.meta.client) return

    primary.value = localStorage.getItem('color-primary') ?? colorsPrimary[0]

    secondary.value =
      localStorage.getItem('color-secondary') ?? colorsSecondary[0]

    dark.value = localStorage.getItem('color-dark') ?? colorsDark[0]

    applyColors()
  }

  const setColor = (type: 'primary' | 'secondary' | 'dark', value: string) => {
    switch (type) {
      case 'primary':
        primary.value = value
        break

      case 'secondary':
        secondary.value = value
        break

      case 'dark':
        dark.value = value
        break
    }

    applyColors()
  }

  return {
    primary,
    secondary,
    dark,
    setColor,
    loadColors,
  }
}
