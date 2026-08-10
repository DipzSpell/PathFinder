import { useEffect, useState } from 'react'
import { clearLocal, localStats } from '../cache'

export default function ClearCacheButton() {
  const [stats, setStats] = useState({ count: 0, max: 0 })
  const [cleared, setCleared] = useState(false)

  useEffect(() => {
    setStats(localStats())
  }, [])

  const handleClear = () => {
    clearLocal()
    setStats(localStats())
    setCleared(true)
  }

  return (
    <div className="flex flex-wrap items-center gap-4 pt-2">
      <button
        type="button"
        onClick={handleClear}
        disabled={stats.count === 0}
        className="press rounded-full border border-line bg-paper-raised px-5 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:border-coral/50 hover:text-coral disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-line disabled:hover:text-ink-soft"
      >
        Clear saved results
      </button>
      <span className="font-mono text-xs text-ink-soft" aria-live="polite">
        {cleared && stats.count === 0
          ? 'cleared'
          : `${stats.count} of ${stats.max} saved on this device`}
      </span>
    </div>
  )
}
