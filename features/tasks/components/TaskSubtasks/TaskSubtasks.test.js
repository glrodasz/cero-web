import { render, screen, fireEvent } from '@testing-library/react'
import TaskSubtasks from './TaskSubtasks'

jest.mock('@glrodasz/components', () => {
  const { dummyRender } = require('../../../../utils/testUtils/dummyRender')
  return {
    Check: dummyRender('Check'),
    Icon: dummyRender('Icon'),
    Paragraph: dummyRender('Paragraph'),
  }
})

const SUBTASKS = [
  { id: 'a', description: 'Crear plantilla', isCompleted: false },
  { id: 'b', description: 'Enviar correo', isCompleted: true },
]

const renderSubtasks = (props = {}) => {
  const handlers = {
    onAdd: jest.fn(),
    onToggle: jest.fn(),
    onRemove: jest.fn(),
  }
  const utils = render(<TaskSubtasks {...handlers} {...props} />)
  return { ...utils, ...handlers }
}

const openInput = () => {
  fireEvent.click(screen.getByText('Agregar subtarea'))
  return screen.getByLabelText('Nueva subtarea')
}

describe('[ features / tasks / components / TaskSubtasks ]', () => {
  describe('when there are subtasks', () => {
    it('should render them', () => {
      // Act
      const { asFragment } = renderSubtasks({ subtasks: SUBTASKS })

      // Assert
      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('when a subtask is typed and Enter is pressed', () => {
    it('should add it and keep the input open for the next one', () => {
      // Arrange
      const { onAdd } = renderSubtasks()
      const input = openInput()
      fireEvent.change(input, { target: { value: 'Crear plantilla' } })

      // Act
      fireEvent.keyDown(input, { key: 'Enter' })

      // Assert
      expect(onAdd).toHaveBeenCalledWith('Crear plantilla')
      expect(screen.getByLabelText('Nueva subtarea').value).toBe('')
    })

    it('should not let the Enter reach `window`', () => {
      // Arrange
      const windowListener = jest.fn()
      window.addEventListener('keydown', windowListener)
      renderSubtasks()
      const input = openInput()
      fireEvent.change(input, { target: { value: 'Crear plantilla' } })

      // Act
      fireEvent.keyDown(input, { key: 'Enter' })

      // Assert
      expect(windowListener).not.toHaveBeenCalled()
      window.removeEventListener('keydown', windowListener)
    })
  })

  describe('when Enter is pressed on an empty input', () => {
    it('should close the input without adding', () => {
      // Arrange
      const { onAdd } = renderSubtasks()
      const input = openInput()

      // Act
      fireEvent.keyDown(input, { key: 'Enter' })

      // Assert
      expect(onAdd).not.toHaveBeenCalled()
      expect(screen.queryByLabelText('Nueva subtarea')).toBeNull()
    })
  })

  describe('when the input loses focus with text in it', () => {
    it('should add what was typed', () => {
      // Arrange
      const { onAdd } = renderSubtasks()
      const input = openInput()
      fireEvent.change(input, { target: { value: 'Enviar correo' } })

      // Act
      fireEvent.blur(input)

      // Assert
      expect(onAdd).toHaveBeenCalledWith('Enviar correo')
    })
  })

  describe('when a subtask check is clicked', () => {
    it('should call `onToggle` with its id', () => {
      // Arrange
      const { onToggle } = renderSubtasks({ subtasks: SUBTASKS })

      // Act
      fireEvent.click(screen.getByLabelText('Completar: Crear plantilla'))

      // Assert
      expect(onToggle).toHaveBeenCalledWith('a')
    })
  })

  describe('when a subtask remove button is clicked', () => {
    it('should call `onRemove` with its id', () => {
      // Arrange
      const { onRemove } = renderSubtasks({ subtasks: SUBTASKS })

      // Act
      fireEvent.click(screen.getByLabelText('Eliminar: Enviar correo'))

      // Assert
      expect(onRemove).toHaveBeenCalledWith('b')
    })
  })
})
