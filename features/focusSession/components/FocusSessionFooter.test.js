import FocusSessionFooter from './FocusSessionFooter'
import { render, screen, fireEvent } from '@testing-library/react'

jest.mock('@glrodasz/components', () => {
  const { dummyRender } = require('../../../utils/testUtils/dummyRender')
  const originalModule = jest.requireActual('@glrodasz/components')
  return {
    ...originalModule,
    Spacer: { Vertical: dummyRender('Spacer.Vertical') },
  }
})

describe('[ features / focusSession / components / FocusSessionFooter ]', () => {
  describe('when `FocusSessionFooter` is mounted', () => {
    it('should render', () => {
      // Arrange
      const props = {
        onClickEndSession: () => {},
      }

      // Act
      const { asFragment } = render(<FocusSessionFooter {...props} />)

      // Assert
      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('when then `Button` is clicked', () => {
    it('should call `onClickEndSession`', () => {
      // Arrange
      const onClickEndSessionMock = jest.fn()
      const props = {
        onClickEndSession: onClickEndSessionMock,
      }

      // Act
      render(<FocusSessionFooter {...props} />)
      fireEvent.click(screen.getByText('Finalizar tu sesión'))

      // Assert
      expect(onClickEndSessionMock).toHaveBeenCalled()
    })
  })
})
