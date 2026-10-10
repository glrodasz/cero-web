import DevToolsModal from './DevToolsModal'
import { render, screen } from '@testing-library/react'

jest.mock('@glrodasz/components', () => {
  const { dummyRender } = require('../../../../utils/testUtils/dummyRender')

  return {
    Modal: ({ children }) => <div>{children}</div>,
    Heading: dummyRender('Heading'),
    Icon: dummyRender('Icon'),
  }
})

jest.mock('../ToggleColorScheme', () => () => 'ToggleColorScheme')

describe('[ features / common / components / DevTools / DevToolsModal ]', () => {
  describe('when `DevToolsModal` is mounted', () => {
    it('should render', () => {
      // Arrange
      const props = {
        onClose: jest.fn(),
        environment: [
          { label: 'Data source', value: 'json-server' },
          { label: 'Demo mode', value: false },
        ],
      }

      // Act
      const { asFragment } = render(<DevToolsModal {...props} />)

      // Assert
      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('when it is given a way to reset the data', () => {
    it('should render a reset button', () => {
      // Arrange
      const props = {
        onClose: jest.fn(),
        onResetData: jest.fn(),
        environment: [{ label: 'Data source', value: 'local-storage' }],
      }

      // Act
      const { asFragment } = render(<DevToolsModal {...props} />)

      // Assert
      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('when it is open on one of its pages', () => {
    it('should mark that page as the current one', () => {
      // Arrange
      const props = {
        onClose: jest.fn(),
        currentPath: '/retrospective',
        environment: [],
      }

      // Act
      render(<DevToolsModal {...props} />)
      const result = screen.getByRole('link', { current: 'page' })

      // Assert
      expect(result.getAttribute('href')).toBe('/retrospective')
    })
  })

  describe('when an environment value comes with a hint', () => {
    it('should render the hint next to the value', () => {
      // Arrange
      const props = {
        onClose: jest.fn(),
        environment: [
          { label: 'API URL', value: 'none', hint: 'answered in this browser' },
        ],
      }

      // Act
      render(<DevToolsModal {...props} />)
      const result = screen.getByText('answered in this browser')

      // Assert
      expect(result).toBeTruthy()
    })
  })
})
