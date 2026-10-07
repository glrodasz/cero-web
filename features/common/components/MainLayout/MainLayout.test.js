import MainLayout from './MainLayout'
import { render } from '@testing-library/react'

describe('[ features / common / components / MainLayout ]', () => {
  describe('when `MainLayout` is mounted', () => {
    it('should render', () => {
      // Arrange
      const props = {
        content: 'content-component',
        isPlayground: true,
      }

      // Act
      const { asFragment } = render(<MainLayout {...props} />)

      // Assert
      expect(asFragment()).toMatchSnapshot()
    })
  })
})
