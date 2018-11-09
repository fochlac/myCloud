import React from 'react'

const noop = Function.prototype

export function Swipeable(Elem) {
  const SwipeHOC = ({
    onSwipeUp = noop,
    onSwipeDown = noop,
    onSwipeLeft = noop,
    onSwipeRight = noop,
    onSwipe = noop,
    onSwipeEnd = noop,
    delta = 20,
    ...props
  }) => {
    let startPosition
    let triggered
    let direction

    const onTouchStart = evt => {
      startPosition = {
        x: parseFloat((evt.clientX || evt.touches[0].clientX).toFixed(2)),
        y: parseFloat((evt.clientY || evt.touches[0].clientY).toFixed(2)),
      }
      triggered = false
    }

    const onTouchMove = evt => {
      if (!startPosition || triggered) return

      const x = parseFloat((evt.clientX || evt.touches[0].clientX).toFixed(2))
      const y = parseFloat((evt.clientY || evt.touches[0].clientY).toFixed(2))
      const dX = parseFloat((x - startPosition.x).toFixed(2))
      const dY = parseFloat((y - startPosition.y).toFixed(2))
      const d = (document.body.scrollWidth * delta) / 100

      if (Math.abs(dX) >= d) {
        if (dX > d) {
          direction = 'right'
          triggered = true
          onSwipeRight()
        } else if (dX < -d) {
          direction = 'left'
          triggered = true
          onSwipeLeft()
        }
      } else if (Math.abs(dY) >= d) {
        if (dY > d) {
          direction = 'down'
          triggered = true
          onSwipeDown()
        } else if (dY < -d) {
          direction = 'up'
          triggered = true
          onSwipeUp()
        }
      }

      if (triggered) {
        onSwipe(direction)
      }
    }

    const onTouchEnd = () => {
      startPosition = null
      triggered = false
      onSwipeEnd(direction)
    }

    return (
      <Elem
        {...props}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      />
    )
  }

  return SwipeHOC
}
