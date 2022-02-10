import { useEffect, useState } from 'react'

export const persistColorScheme = ({ isDarkMode, setIsDarkMode }) => {
  const colorScheme = isDarkMode ? 'dark' : 'light'
  document.querySelector('html').dataset.colorScheme = colorScheme
  localStorage.setItem('prefers-color-scheme', colorScheme)
  setIsDarkMode && setIsDarkMode(isDarkMode)
}
const useColorScheme = (__persistColorScheme = persistColorScheme) => {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
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
  }, [])

  return {
    isDarkMode,
    setIsDarkMode,
  }
}

export default useColorScheme
