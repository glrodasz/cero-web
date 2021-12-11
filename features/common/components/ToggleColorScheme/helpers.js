export const persistColorScheme = ({ isDarkMode, setIsDarkMode }) => {
  const colorScheme = isDarkMode ? 'dark' : 'light'
  document.querySelector('html').dataset.colorScheme = colorScheme
  localStorage.setItem('prefers-color-scheme', colorScheme)
  setIsDarkMode && setIsDarkMode(isDarkMode)
}

export const loadAndListenColorScheme = ({
  setIsDarkMode,
  __persistColorScheme = persistColorScheme,
} = {}) => {
  const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  darkModeMediaQuery?.addListener((event) => {
    const isDarkMode = event.matches
    __persistColorScheme({ isDarkMode, setIsDarkMode })
  })

  const localStorageColorScheme = localStorage.getItem('prefers-color-scheme')

  if (localStorageColorScheme) {
    const isDarkMode = localStorageColorScheme === 'dark'
    __persistColorScheme({ isDarkMode, setIsDarkMode })
  } else {
    const isDarkMode = darkModeMediaQuery?.matches
    __persistColorScheme({ isDarkMode, setIsDarkMode })
  }
}
