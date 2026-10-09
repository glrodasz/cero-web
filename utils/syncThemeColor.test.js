import syncThemeColor from './syncThemeColor'

const addThemeColorMeta = (content) => {
  const meta = document.createElement('meta')
  meta.setAttribute('name', 'theme-color')
  meta.setAttribute('content', content)
  document.head.appendChild(meta)
  return meta
}

describe('[ utils / syncThemeColor ]', () => {
  afterEach(() => {
    document.head.innerHTML = ''
    document.documentElement.style.removeProperty('--background')
  })

  describe('when the CSS variable has a value', () => {
    it('should set it as the content of every `theme-color` meta', () => {
      // Arrange
      const metas = [addThemeColorMeta('#fff'), addThemeColorMeta('#000')]
      document.documentElement.style.setProperty('--background', ' #111827')

      // Act
      syncThemeColor('--background')
      const result = metas.map((meta) => meta.getAttribute('content'))
      const expected = ['#111827', '#111827']

      // Assert
      expect(result).toEqual(expected)
    })
  })

  describe('when the CSS variable is not defined', () => {
    it('should leave the `theme-color` metas as they are', () => {
      // Arrange
      const meta = addThemeColorMeta('#fff')

      // Act
      syncThemeColor('--background')
      const result = meta.getAttribute('content')
      const expected = '#fff'

      // Assert
      expect(result).toBe(expected)
    })
  })
})
