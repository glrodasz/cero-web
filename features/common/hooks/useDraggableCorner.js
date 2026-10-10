import { useEffect, useLayoutEffect, useRef, useState } from 'react'

import getNearestCorner from '../../../utils/getNearestCorner'

export const CORNERS = ['top-left', 'top-right', 'bottom-left', 'bottom-right']

// Far enough that a tap with an unsteady finger still counts as a tap.
export const DRAG_THRESHOLD = 6

const SNAP_TRANSITION = 'transform 0.25s ease-out'

// The server renders before there is a DOM; a layout effect there only warns.
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

// Storage can be missing or throw (private windows, blocked site data); the
// corner is a convenience, so it falls back to the default instead.
const readCorner = (storageKey, fallback) => {
  try {
    const stored = window.localStorage.getItem(storageKey)
    return CORNERS.includes(stored) ? stored : fallback
  } catch {
    return fallback
  }
}

const writeCorner = (storageKey, corner) => {
  try {
    window.localStorage.setItem(storageKey, corner)
  } catch {
    // Not remembered across loads, which is all it costs.
  }
}

// Lets a fixed element be dragged anywhere and snap to the nearest corner of
// the viewport on release. The corner itself is left to CSS (the caller maps
// `corner` to a class), so safe-area insets and breakpoints stay in the
// stylesheet; this hook only animates the jump from the drop point to it.
//
// A press that moves less than `DRAG_THRESHOLD` is a click, and the click a
// browser fires at the end of a real drag is swallowed.
const useDraggableCorner = ({ storageKey, defaultCorner = 'top-right' }) => {
  const ref = useRef(null)
  const drag = useRef(null)
  const drop = useRef(null)
  const isClickSuppressed = useRef(false)
  const [corner, setCorner] = useState(defaultCorner)
  const [snapCount, setSnapCount] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  // After mount: the server can't read the browser's storage, so the first
  // render is always at the default corner.
  useEffect(() => {
    setCorner(readCorner(storageKey, defaultCorner))
  }, [storageKey, defaultCorner])

  // FLIP: laid out at the new corner, moved back to where it was dropped, then
  // let go so the transition carries it the rest of the way.
  useIsomorphicLayoutEffect(() => {
    const element = ref.current
    const from = drop.current
    if (!element || !from) return
    drop.current = null

    element.style.transition = 'none'
    element.style.transform = ''
    const to = element.getBoundingClientRect()
    element.style.transform = `translate(${from.left - to.left}px, ${
      from.top - to.top
    }px)`
    // Commits the start position, or the browser would skip the transition.
    element.getBoundingClientRect()
    element.style.transition = SNAP_TRANSITION
    element.style.transform = ''
  }, [corner, snapCount])

  const onPointerDown = (event) => {
    if (event.button !== 0) return

    // Keeps the browser from starting a drag or a selection of its own, which
    // cancels the pointer: over the avatar, Chromium drags the image under it.
    event.preventDefault()
    isClickSuppressed.current = false
    drag.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      rect: event.currentTarget.getBoundingClientRect(),
      isMoving: false,
    }
    event.currentTarget.setPointerCapture?.(event.pointerId)
  }

  const onPointerMove = (event) => {
    const current = drag.current
    if (!current || event.pointerId !== current.pointerId) return

    const dx = event.clientX - current.startX
    const dy = event.clientY - current.startY

    if (!current.isMoving) {
      if (Math.hypot(dx, dy) < DRAG_THRESHOLD) return
      current.isMoving = true
      setIsDragging(true)
    }

    current.dx = dx
    current.dy = dy
    // Straight to the DOM: a render per pointer move would lag the finger.
    event.currentTarget.style.transition = 'none'
    event.currentTarget.style.transform = `translate(${dx}px, ${dy}px)`
  }

  const onPointerUp = (event) => {
    const current = drag.current
    if (!current || event.pointerId !== current.pointerId) return
    drag.current = null
    if (!current.isMoving) return

    const { rect, dx, dy } = current
    const left = rect.left + dx
    const top = rect.top + dy
    const nextCorner = getNearestCorner({
      x: left + rect.width / 2,
      y: top + rect.height / 2,
      width: window.innerWidth,
      height: window.innerHeight,
    })

    drop.current = { left, top }
    isClickSuppressed.current = true
    writeCorner(storageKey, nextCorner)
    setIsDragging(false)
    setCorner(nextCorner)
    // Re-runs the snap even when it lands back on the same corner.
    setSnapCount((count) => count + 1)
  }

  const onClickCapture = (event) => {
    if (!isClickSuppressed.current) return

    isClickSuppressed.current = false
    event.preventDefault()
    event.stopPropagation()
  }

  return {
    ref,
    corner,
    isDragging,
    dragHandlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
      onClickCapture,
    },
  }
}

export default useDraggableCorner
