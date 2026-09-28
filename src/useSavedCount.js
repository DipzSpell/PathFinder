import { useEffect, useState } from 'react'
import { SAVED_EVENT, savedCount } from './saved'

/** Live count of saved roadmaps, including changes made in another tab. */
export default function useSavedCount() {
  const [count, setCount] = useState(savedCount)

  useEffect(() => {
    const refresh = () => setCount(savedCount())
    window.addEventListener(SAVED_EVENT, refresh)
    window.addEventListener('storage', refresh)
    return () => {
      window.removeEventListener(SAVED_EVENT, refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [])

  return count
}
