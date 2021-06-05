import FocusSessionFooter from './FocusSessionFooter'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

jest.mock('@glrodasz/components', () => {
  const { dummyRender } = require('../../../utils/testing')
  const originalModule = jest.requireActual('@glrodasz/components')
  return {
    ...originalModule,
    Spacer: { Horizontal: dummyRender('Spacer') },
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
      userEvent.click(screen.getByText('Finalizar tu sesión'))

      // Assert
      expect(onClickEndSessionMock).toHaveBeenCalled()
    })
  })
})
