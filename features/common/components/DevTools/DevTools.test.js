import DevTools from './DevTools'
import DevToolsModal from './DevToolsModal'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

jest.mock('@glrodasz/components', () => {
  const { dummyRender } = require('../../../../utils/testUtils/dummyRender')

  return {
    Icon: dummyRender('Icon'),
  }
})

jest.mock('./DevToolsModal', () => jest.fn(() => 'DevToolsModal'))

jest.mock('./constants', () => ({
  ...jest.requireActual('./constants'),
  IS_DEV_TOOLS_ENABLED: true,
}))

describe('[ features / common / components / DevTools ]', () => {
  const ORIGINAL_ENV = process.env

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV }
    DevToolsModal.mockClear()
  })

  afterAll(() => {
    process.env = ORIGINAL_ENV
  })

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

  describe('when the data lives in the browser', () => {
    it('should offer to reset it', async () => {
      // Arrange
      process.env.NEXT_PUBLIC_DATA_SOURCE = 'local-storage'
      render(<DevTools />)

      // Act
      await userEvent.click(screen.getByRole('button', { name: 'Dev tools' }))
      const result = DevToolsModal.mock.calls.at(-1)[0].onResetData

      // Assert
      expect(result).toEqual(expect.any(Function))
    })
  })

  describe('when the data lives anywhere else', () => {
    it('should not offer a reset it could not perform', async () => {
      // Arrange
      process.env.NEXT_PUBLIC_DATA_SOURCE = 'json-server'
      render(<DevTools />)

      // Act
      await userEvent.click(screen.getByRole('button', { name: 'Dev tools' }))
      const result = DevToolsModal.mock.calls.at(-1)[0].onResetData

      // Assert
      expect(result).toBeUndefined()
    })
  })
})
