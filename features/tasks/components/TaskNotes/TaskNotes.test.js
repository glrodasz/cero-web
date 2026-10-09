import { render, screen, fireEvent, act } from '@testing-library/react'
import TaskNotes from './TaskNotes'

jest.mock('@glrodasz/components', () => {
  const { dummyRender } = require('../../../../utils/testUtils/dummyRender')
  return { Icon: dummyRender('Icon') }
})

describe('[ features / tasks / components / TaskNotes ]', () => {
  describe('when there are no notes', () => {
    it('should invite to add them', () => {
      // Act
      const { asFragment } = render(<TaskNotes onSave={() => {}} />)

      // Assert
      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('when there are notes', () => {
    it('should show them', () => {
      // Act
      const { asFragment } = render(
        <TaskNotes notes="Primero marketing" onSave={() => {}} />
      )

      // Assert
      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('when the notes are edited and the field loses focus', () => {
    it('should save the new text', () => {
      // Arrange
      const onSave = jest.fn()
      render(<TaskNotes notes="Antes" onSave={onSave} />)
      fireEvent.click(screen.getByLabelText('Editar notas'))
      const textarea = screen.getByLabelText('Notas')
      fireEvent.change(textarea, { target: { value: 'Después' } })

      // Act
      fireEvent.blur(textarea)

      // Assert
      expect(onSave).toHaveBeenCalledWith('Después')
      expect(screen.queryByLabelText('Notas')).toBeNull()
    })
  })

  describe('when the user stops typing', () => {
    it('should save without waiting for the blur', () => {
      // Arrange
      jest.useFakeTimers()
      const onSave = jest.fn()
      render(<TaskNotes onSave={onSave} />)
      fireEvent.click(screen.getByText('Agregar notas'))
      fireEvent.change(screen.getByLabelText('Notas'), {
        target: { value: 'Llamar a ventas' },
      })

      // Act
      act(() => {
        jest.runOnlyPendingTimers()
      })

      // Assert
      expect(onSave).toHaveBeenLastCalledWith('Llamar a ventas')
      jest.useRealTimers()
    })
  })
})
