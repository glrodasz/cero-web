import DevToolsModal from './DevToolsModal'
import { render } from '@testing-library/react'

jest.mock('@glrodasz/components', () => {
  const { dummyRender } = require('../../../../utils/testUtils/dummyRender')

  return {
    Modal: dummyRender('Modal'),
    Button: dummyRender('Button'),
    Heading: dummyRender('Heading'),
    Paragraph: dummyRender('Paragraph'),
    Spacer: { Vertical: dummyRender('Spacer.Vertical') },
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
})
