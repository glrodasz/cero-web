import { persistColorScheme } from './helpers'

export const createClickHandler =
  ({ isDarkMode, setIsDarkMode }) =>
  () => {
    persistColorScheme({ isDarkMode: !isDarkMode, setIsDarkMode })
  }
