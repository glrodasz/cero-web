import { render, screen, fireEvent } from '@testing-library/react'
import TaskDuration from './TaskDuration'

jest.mock('@glrodasz/components', () => {
  const { dummyRender } = require('../../../../utils/testUtils/dummyRender')
  return {
    Icon: dummyRender('Icon'),
    Paragraph: dummyRender('Paragraph'),
  }
})

describe('[ features / tasks / components / TaskDuration ]', () => {
  describe('when `TaskDuration` is mounted', () => {
    it('should render', () => {
      // Arrange
      const props = { duration: 60, onChange: () => {} }

      // Act
      const { asFragment } = render(<TaskDuration {...props} />)

      // Assert
      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('when a duration is picked', () => {
    it('should call `onChange` with the minutes as a number', () => {
      // Arrange
      const onChange = jest.fn()
      render(<TaskDuration onChange={onChange} />)

      // Act
      fireEvent.change(screen.getByLabelText('Duración de la tarea'), {
        target: { value: '90' },
      })

      // Assert
      expect(onChange).toHaveBeenCalledWith(90)
    })
  })

  describe('when "Sin definir" is picked', () => {
    it('should call `onChange` with `null`', () => {
      // Arrange
      const onChange = jest.fn()
      render(<TaskDuration duration={30} onChange={onChange} />)

      // Act
      fireEvent.change(screen.getByLabelText('Duración de la tarea'), {
        target: { value: '' },
      })

      // Assert
      expect(onChange).toHaveBeenCalledWith(null)
    })
  })
})
