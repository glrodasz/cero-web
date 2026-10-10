import PropTypes from 'prop-types'
import { fireEvent, render, screen } from '@testing-library/react'
import useDraggableCorner from './useDraggableCorner'

const STORAGE_KEY = 'test-corner'
const BUTTON_RECT = { left: 340, top: 12, width: 40, height: 40 }

// jsdom has no `PointerEvent`; without one, `clientX` and `pointerId` never
// reach the handlers.
class PointerEventPolyfill extends MouseEvent {
  constructor(type, { pointerId = 1, ...init } = {}) {
    super(type, init)
    this.pointerId = pointerId
  }
}

const Draggable = ({ onClick }) => {
  const { ref, corner, isDragging, dragHandlers } = useDraggableCorner({
    storageKey: STORAGE_KEY,
  })

  return (
    <button
      ref={ref}
      type="button"
      data-corner={corner}
      data-dragging={isDragging}
      onClick={onClick}
      {...dragHandlers}
    >
      Drag me
    </button>
  )
}

Draggable.propTypes = { onClick: PropTypes.func }

const press = (element, { x, y }) =>
  fireEvent.pointerDown(element, { button: 0, clientX: x, clientY: y })
const move = (element, { x, y }) =>
  fireEvent.pointerMove(element, { clientX: x, clientY: y })
const release = (element, { x, y }) =>
  fireEvent.pointerUp(element, { clientX: x, clientY: y })

describe('[ features / common / hooks / useDraggableCorner ]', () => {
  const { PointerEvent } = window

  beforeAll(() => {
    window.PointerEvent = PointerEventPolyfill
    window.innerWidth = 400
    window.innerHeight = 800
  })

  afterAll(() => {
    window.PointerEvent = PointerEvent
  })

  beforeEach(() => {
    localStorage.clear()
    jest
      .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockReturnValue(BUTTON_RECT)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('when nothing was stored', () => {
    it('should start at the top right corner', () => {
      // Act
      render(<Draggable />)
      const result = screen.getByRole('button').dataset.corner
      const expected = 'top-right'

      // Assert
      expect(result).toBe(expected)
    })
  })

  describe('when a corner was stored', () => {
    it('should start there', () => {
      // Arrange
      localStorage.setItem(STORAGE_KEY, 'bottom-left')

      // Act
      render(<Draggable />)
      const result = screen.getByRole('button').dataset.corner
      const expected = 'bottom-left'

      // Assert
      expect(result).toBe(expected)
    })
  })

  describe('when something that is not a corner was stored', () => {
    it('should ignore it', () => {
      // Arrange
      localStorage.setItem(STORAGE_KEY, 'middle')

      // Act
      render(<Draggable />)
      const result = screen.getByRole('button').dataset.corner
      const expected = 'top-right'

      // Assert
      expect(result).toBe(expected)
    })
  })

  describe('when the pointer barely moves', () => {
    it('should count as a click and stay put', () => {
      // Arrange
      const onClick = jest.fn()
      render(<Draggable onClick={onClick} />)
      const button = screen.getByRole('button')

      // Act
      press(button, { x: 360, y: 32 })
      move(button, { x: 363, y: 34 })
      release(button, { x: 363, y: 34 })
      fireEvent.click(button)

      // Assert
      expect(onClick).toHaveBeenCalled()
      expect(button.dataset.corner).toBe('top-right')
    })
  })

  describe('when it is dragged to the bottom left', () => {
    it('should snap there and remember it', () => {
      // Arrange
      render(<Draggable />)
      const button = screen.getByRole('button')

      // Act
      press(button, { x: 360, y: 32 })
      move(button, { x: 60, y: 700 })
      release(button, { x: 60, y: 700 })
      const result = button.dataset.corner
      const expected = 'bottom-left'

      // Assert
      expect(result).toBe(expected)
      expect(localStorage.getItem(STORAGE_KEY)).toBe(expected)
    })

    it('should follow the pointer while dragging', () => {
      // Arrange
      render(<Draggable />)
      const button = screen.getByRole('button')

      // Act
      press(button, { x: 360, y: 32 })
      move(button, { x: 60, y: 700 })

      // Assert
      expect(button.dataset.dragging).toBe('true')
      expect(button.style.transform).toBe('translate(-300px, 668px)')
    })

    it('should swallow the click that ends the drag', () => {
      // Arrange
      const onClick = jest.fn()
      render(<Draggable onClick={onClick} />)
      const button = screen.getByRole('button')

      // Act
      press(button, { x: 360, y: 32 })
      move(button, { x: 60, y: 700 })
      release(button, { x: 60, y: 700 })
      fireEvent.click(button)

      // Assert
      expect(onClick).not.toHaveBeenCalled()
    })

    it('should let the next click through', () => {
      // Arrange
      const onClick = jest.fn()
      render(<Draggable onClick={onClick} />)
      const button = screen.getByRole('button')
      press(button, { x: 360, y: 32 })
      move(button, { x: 60, y: 700 })
      release(button, { x: 60, y: 700 })
      fireEvent.click(button)

      // Act
      fireEvent.click(button)

      // Assert
      expect(onClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('when storage is unavailable', () => {
    it('should still snap', () => {
      // Arrange
      jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('blocked')
      })
      render(<Draggable />)
      const button = screen.getByRole('button')

      // Act
      press(button, { x: 360, y: 32 })
      move(button, { x: 360, y: 700 })
      release(button, { x: 360, y: 700 })
      const result = button.dataset.corner
      const expected = 'bottom-right'

      // Assert
      expect(result).toBe(expected)
    })
  })
})
