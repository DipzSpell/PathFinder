import { useEffect, useRef } from 'react'

const REVEAL_AT = 0.92 // reveal once the element's top is within the lower 8% of the viewport

/**
 * Reveals descendant `.reveal` elements as they come into view.
 *
 * Deliberately a scroll sweep rather than an IntersectionObserver: IO only fires when the
 * intersection ratio crosses a threshold, so a jump-scroll (End key, anchor link, restored
 * position) can move an element from below the fold to above it without ever firing, leaving
 * it stranded at opacity 0. A rAF-throttled sweep has no such gap, detaches as soon as
 * everything is visible, and only ever handles a handful of nodes.
 */
export default function useReveal(deps = []) {
  const ref = useRef(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return

    const targets = [...root.querySelectorAll('.reveal')].filter(
      (el) => !el.classList.contains('is-visible'),
    )
    if (!targets.length) return

    let pending = new Set(targets)
    let frame = 0
    let detached = false

    const revealAll = () => {
      for (const el of pending) el.classList.add('is-visible')
      pending.clear()
      detach()
    }

    const sweep = () => {
      frame = 0
      const limit = window.innerHeight * REVEAL_AT
      for (const el of [...pending]) {
        if (el.getBoundingClientRect().top < limit) {
          el.classList.add('is-visible')
          pending.delete(el)
        }
      }
      if (!pending.size) detach()
    }

    const schedule = () => {
      if (!frame && !detached) frame = requestAnimationFrame(sweep)
    }

    function detach() {
      if (detached) return
      detached = true
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      window.removeEventListener('beforeprint', revealAll)
    }

    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule, { passive: true })
    window.addEventListener('beforeprint', revealAll)
    schedule()

    return detach
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return ref
}
