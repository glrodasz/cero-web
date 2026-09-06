import DevTools from './DevTools'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

jest.mock('@glrodasz/components', () => {
  const { dummyRender } = require('../../../../utils/testUtils/dummyRender')

  return {
    Icon: dummyRender('Icon'),
  }
})

jest.mock('./DevToolsModal', () => () => 'DevToolsModal')

jest.mock('./constants', () => ({
  ...jest.requireActual('./constants'),
  IS_DEV_TOOLS_ENABLED: true,
}))

describe('[ features / common / components / DevTools ]', () => {
  describe('when `DevTools` is mounted', () => {
    it('should render the floating button without the modal', () => {
      // Arrange
      const props = {}

      // Act
      const { asFragment } = render(<DevTools {...props} />)

      // Assert
      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('when the floating button is clicked', () => {
    it('should show the modal', async () => {
      // Arrange
      render(<DevTools />)

      // Act
      await userEvent.click(screen.getByRole('button', { name: 'Dev tools' }))
      const result = screen.getByText('DevToolsModal')

      // Assert
      expect(result).toBeTruthy()
    })
  })
})
