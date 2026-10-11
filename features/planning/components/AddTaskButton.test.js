import AddTaskButton from './AddTaskButton'
import { render, screen } from '@testing-library/react'

jest.mock('@glrodasz/components', () => {
  const { dummyRender } = require('../../../utils/testUtils/dummyRender')
  return {
    Spacer: { Vertical: dummyRender('Spacer.Vertical') },
    AddButton: dummyRender('Button'),
    Paragraph: dummyRender('Paragraph'),
  }
})

describe('[ features / planning / components / AddTaskButton ]', () => {
  describe('when `AddTaskButton` is mounted', () => {
    it('should render', () => {
      const props = {
        isShown: true,
        onAddTask: () => {},
      }
      const { asFragment } = render(<AddTaskButton {...props} />)
      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('when there is no room for another task', () => {
    it('should say why it cannot add one', () => {
      // Arrange
      const props = { isShown: false, onAddTask: () => {} }

      // Act
      render(<AddTaskButton {...props} />)
      const result = screen.queryByText(/Llegaste al máximo de tareas/)

      // Assert
      expect(result).not.toBeNull()
    })
  })
})
