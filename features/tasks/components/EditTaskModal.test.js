import { render, screen, fireEvent } from '@testing-library/react'
import EditTaskModal from './EditTaskModal'

jest.mock('@glrodasz/components', () => {
  const { dummyRender } = require('../../../utils/testUtils/dummyRender')
  return {
    Modal: ({ children, onClose }) => (
      <div>
        <button type="button" onClick={onClose}>
          back
        </button>
        {children}
      </div>
    ),
    Heading: ({ children, onBlur }) => (
      <h1 contentEditable suppressContentEditableWarning onBlur={onBlur}>
        {children}
      </h1>
    ),
    Paragraph: dummyRender('Paragraph'),
    Icon: dummyRender('Icon'),
    Check: dummyRender('Check'),
  }
})

jest.mock('../../../utils/timeAgo', () => () => 'hace 5 minutos')

const TASK = {
  id: 7,
  description: 'Responder los correos',
  createdAt: 1,
  duration: 60,
  subtasks: [{ id: 'a', description: 'Crear plantilla', isCompleted: true }],
  notes: 'Primero marketing',
}

describe('[ features / tasks / components / EditTaskModal ]', () => {
  describe('when `EditTaskModal` is mounted with a task', () => {
    it('should render every section of the detail', () => {
      // Act
      const { asFragment } = render(<EditTaskModal task={TASK} />)

      // Assert
      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('when a save failed', () => {
    it('should tell the user', () => {
      // Act
      render(<EditTaskModal task={TASK} hasSaveError />)

      // Assert
      expect(screen.getByRole('alert')).toBeTruthy()
    })
  })

  describe('when the title is renamed', () => {
    it('should save the trimmed name', () => {
      // Arrange
      const onUpdate = jest.fn()
      render(<EditTaskModal task={TASK} onUpdate={onUpdate} />)
      const title = screen.getByText(TASK.description)
      title.textContent = '  Responder solo los críticos '

      // Act
      fireEvent.blur(title)

      // Assert
      expect(onUpdate).toHaveBeenCalledWith({
        id: TASK.id,
        data: { description: 'Responder solo los críticos' },
      })
    })
  })

  describe('when the title is left empty', () => {
    it('should put the last name back without saving', () => {
      // Arrange
      const onUpdate = jest.fn()
      render(<EditTaskModal task={TASK} onUpdate={onUpdate} />)
      const title = screen.getByText(TASK.description)
      title.textContent = '   '

      // Act
      fireEvent.blur(title)

      // Assert
      expect(onUpdate).not.toHaveBeenCalled()
      expect(title.textContent).toBe(TASK.description)
    })
  })

  describe('when Enter is pressed in the title', () => {
    it('should finish editing and save', () => {
      // Arrange
      const onUpdate = jest.fn()
      render(<EditTaskModal task={TASK} onUpdate={onUpdate} />)
      const title = screen.getByText(TASK.description)
      title.focus()
      title.textContent = 'Nuevo nombre'

      // Act
      fireEvent.keyDown(title, { key: 'Enter' })

      // Assert
      expect(onUpdate).toHaveBeenCalledWith({
        id: TASK.id,
        data: { description: 'Nuevo nombre' },
      })
    })
  })

  describe('when the modal is closed while editing the notes', () => {
    it('should save the notes before closing', () => {
      // Arrange
      const onSaveNotes = jest.fn()
      const onClose = jest.fn()
      render(
        <EditTaskModal
          task={TASK}
          onSaveNotes={onSaveNotes}
          onClose={onClose}
        />
      )
      fireEvent.click(screen.getByLabelText('Editar notas'))
      const textarea = screen.getByLabelText('Notas')
      textarea.focus()
      fireEvent.change(textarea, { target: { value: 'Primero ventas' } })

      // Act
      fireEvent.click(screen.getByText('back'))

      // Assert
      expect(onSaveNotes).toHaveBeenCalledWith('Primero ventas')
      expect(onClose).toHaveBeenCalled()
    })
  })
})
