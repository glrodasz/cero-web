import PageLayout from './PageLayout'
import { render } from '@testing-library/react'

describe('[ features / common / components / PageLayout ]', () => {
  describe('when `PageLayout` is mounted', () => {
    it('should render the content and the footer', () => {
      // Arrange
      const props = {
        content: 'content-component',
        footer: 'footer-component',
      }

      // Act
      const { asFragment } = render(<PageLayout {...props} />)

      // Assert
      expect(asFragment()).toMatchSnapshot()
    })
  })
})
