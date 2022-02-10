import { useEffect, useState } from 'react'

const queries = [
  {
    name: 'desktop',
    media: '(min-width: 992px)',
  },
]

const useBreakpoints = () => {
  const [breakpoints, setBreakpoints] = useState({
    isDesktop: false,
    isMobile: false,
  })

  useEffect(() => {
    function handleResize() {
      const mediaQueries = queries.map((query) => {
        const mediaQuery = window.matchMedia(query.media)
        return {
          name: query.name,
          media: mediaQuery.media,
          matches: mediaQuery.matches,
        }
      })

      const matchedQuery = mediaQueries.find((mediaQuery) => mediaQuery.matches)

      if (matchedQuery?.name === 'desktop') {
        setBreakpoints({ isDesktop: true, isMobile: false })
      } else {
        setBreakpoints({ isDesktop: false, isMobile: true })
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return breakpoints
}

export default useBreakpoints
