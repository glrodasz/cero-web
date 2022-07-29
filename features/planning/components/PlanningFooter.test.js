import { render, screen, fireEvent } from '@testing-library/react'
import PlanningFooter from './PlanningFooter'

jest.mock('@glrodasz/components', () => {
  const { dummyRender } = require('../../../utils/testUtils/dummyRender')
  const originalModule = jest.requireActual('@glrodasz/components')
  return {
    ...originalModule,
    Spacer: { Vertical: dummyRender('Spacer.Vertical') },
    Paragraph: dummyRender('Paragraph'),
  }
})

describe('[ features / planning / components / PlanningFooter ]', () => {
  describe('when `tasksLength` is greater or equal to one', () => {
    it('should return the footer', () => {
      // Arrange
      const props = {
        tasksLength: 1,
        onClickStartSession: () => {},
      }

      // Act
      const { asFragment } = render(<PlanningFooter {...props} />)
      const result = asFragment()

      // Assert
      expect(result).toMatchSnapshot()
    })
  })

  describe('when `tasksLength` is less than one', () => {
    it('should return null', () => {
      // Arrange
      const props = {
        tasksLength: 0,
        onClickStartSession: () => {},
      }
      const expected = null

      // Act
      const { container } = render(<PlanningFooter {...props} />)
      const result = container.firstChild

      // Assert
      expect(result).toBe(expected)
    })
  })

  describe('when the `Button` is clicked', () => {
    it('should call `onClickStartSession`', () => {
      // Arrange
      const onClickStartSessionStub = jest.fn()
      const props = {
        tasksLength: 1,
        onClickStartSession: onClickStartSessionStub,
      }

      // Act
      render(<PlanningFooter {...props} />)
      fireEvent.click(screen.getByText('Empieza ahora'))

      // Assert
      expect(onClickStartSessionStub).toHaveBeenCalled()
    })
  })
})
