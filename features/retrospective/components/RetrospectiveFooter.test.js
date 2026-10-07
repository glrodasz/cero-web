import { render, screen, fireEvent } from '@testing-library/react'
import RetrospectiveFooter from './RetrospectiveFooter'

jest.mock('@glrodasz/components', () => {
  const { dummyRender } = require('../../../utils/testUtils/dummyRender')
  const originalModule = jest.requireActual('@glrodasz/components')
  return {
    ...originalModule,
    Spacer: { Vertical: dummyRender('Spacer.Vertical') },
  }
})

const buildProps = (props) => ({
  onClickRegisterSession: jest.fn(),
  onClickSkipRegisterSession: jest.fn(),
  ...props,
})

describe('[ features / retrospective / components / RetrospectiveFooter ]', () => {
  describe('when `RetrospectiveFooter` is mounted', () => {
    it('should render', () => {
      // Arrange
      const props = buildProps({ isRegisterMuted: true })

      // Act
      const { asFragment } = render(<RetrospectiveFooter {...props} />)

      // Assert
      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('when "Registrar sesión" is clicked', () => {
    it('should call `onClickRegisterSession`', () => {
      // Arrange
      const props = buildProps()
      render(<RetrospectiveFooter {...props} />)

      // Act
      fireEvent.click(screen.getByText('Registrar sesión'))

      // Assert
      expect(props.onClickRegisterSession).toHaveBeenCalled()
    })
  })

  describe('when "No registrar esta sesión" is clicked', () => {
    it('should call `onClickSkipRegisterSession`', () => {
      // Arrange
      const props = buildProps()
      render(<RetrospectiveFooter {...props} />)

      // Act
      fireEvent.click(screen.getByText('No registrar esta sesión'))

      // Assert
      expect(props.onClickSkipRegisterSession).toHaveBeenCalled()
    })
  })
})
