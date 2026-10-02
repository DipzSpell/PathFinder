import { useEffect, useMemo, useRef } from 'react'
import confetti from 'canvas-confetti'
import ProgressBar from './ProgressBar'
import RoadmapRewards from './RoadmapRewards'
import { CheckIcon } from './Icons'
import { useLang } from '../prefs'

function triggerConfetti(flow = 'forward') {
  if (typeof window === 'undefined') return
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) return

  const primaryColors =
    flow === 'reverse'
      ? ['#0d9488', '#14b8a6', '#5eead4', '#f59e0b', '#3b82f6']
      : ['#d97706', '#f59e0b', '#fcd34d', '#10b981', '#6366f1']

  // Multi-angle festive burst
  confetti({
    particleCount: 50,
    angle: 60,
    spread: 55,
    origin: { x: 0.1, y: 0.65 },
    colors: primaryColors,
    zIndex: 9999,
  })

  confetti({
    particleCount: 50,
    angle: 120,
    spread: 55,
    origin: { x: 0.9, y: 0.65 },
    colors: primaryColors,
    zIndex: 9999,
  })

  setTimeout(() => {
    confetti({
      particleCount: 40,
      spread: 90,
      origin: { x: 0.5, y: 0.45 },
      colors: primaryColors,
      shapes: ['circle', 'square'],
      scalar: 1.1,
      zIndex: 9999,
    })
  }, 220)
}

export default function RoadmapProgressTracker({
  steps = [],
  done = [],
  flow = 'forward',
  onToggleStep,
  onReset,
  onMarkAll,
  savedId,
}) {
  const { t } = useLang()
  const total = steps.length
  const doneCount = done.filter((i) => i < total).length
  const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0
  const isComplete = total > 0 && doneCount === total

  const prevDoneCountRef = useRef(doneCount)
  const hasTriggeredRef = useRef(false)

  useEffect(() => {
    if (isComplete && (!hasTriggeredRef.current || prevDoneCountRef.current < total)) {
      hasTriggeredRef.current = true
      triggerConfetti(flow)
    } else if (!isComplete) {
      hasTriggeredRef.current = false
    }
    prevDoneCountRef.current = doneCount
  }, [isComplete, doneCount, total, flow])

  // Find the first milestone that hasn't been completed yet.
  const nextIncompleteIndex = useMemo(() => {
    for (let i = 0; i < total; i += 1) {
      if (!done.includes(i)) return i
    }
    return -1
  }, [done, total])

  const scrollToStep = (index) => {
    const el = document.getElementById(`road-step-${index}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      el.focus?.()
      const card = el.querySelector('.road-card') || el
      card.classList.add('ring-2', 'ring-current', 'ring-offset-2')
      setTimeout(() => {
        card.classList.remove('ring-2', 'ring-current', 'ring-offset-2')
      }, 1500)
    }
  }

  const accentColor = flow === 'reverse' ? 'text-teal' : 'text-saffron'
  const accentBg = flow === 'reverse' ? 'bg-teal' : 'bg-saffron'
  const accentSoftBg = flow === 'reverse' ? 'bg-teal-soft' : 'bg-saffron-soft'

  return (
    <section
      aria-label={t('roadmap.progressTracker')}
      className="no-print rise mb-8 rounded-2xl border border-line bg-paper-raised p-4 sm:p-5 shadow-card transition-shadow hover:shadow-lift"
      style={{ '--i': 0 }}
    >
      {/* Top Header Row: Tracker Title & Percentage */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={`flex h-2 w-2 rounded-full ${accentBg} ${
                pct > 0 && !isComplete ? 'animate-pulse' : ''
              }`}
              aria-hidden="true"
            />
            <p className={`font-mono text-xs uppercase tracking-widest ${accentColor}`}>
              {t('roadmap.progressTracker')}
            </p>
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <h2 className="font-display text-base sm:text-lg font-semibold text-ink">
              {isComplete ? t('roadmap.allCompleted') : t('roadmap.inProgress')}
            </h2>
            <span className="hidden sm:inline text-xs text-ink-soft" aria-hidden="true">
              ·
            </span>
            <span className="hidden sm:inline font-mono text-xs text-ink-soft">
              {isComplete
                ? t('roadmap.allCompletedSub')
                : doneCount === 0
                  ? t('roadmap.progressHint')
                  : `${total - doneCount} remaining`}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick jump to next step button */}
          {!isComplete && nextIncompleteIndex !== -1 && (
            <button
              type="button"
              onClick={() => scrollToStep(nextIncompleteIndex)}
              className="press inline-flex items-center gap-1.5 rounded-full border border-line bg-paper-raised px-3 py-1.5 font-mono text-xs font-medium text-ink transition-colors hover:border-ink/40"
              title={`Jump to Milestone ${nextIncompleteIndex + 1}`}
            >
              <span>{t('roadmap.nextUp')}: M{nextIncompleteIndex + 1}</span>
              <span aria-hidden="true">↓</span>
            </button>
          )}

          {/* Quick action: mark all or reset */}
          {!isComplete && onMarkAll && (
            <button
              type="button"
              onClick={onMarkAll}
              className="press hidden sm:inline-block font-mono text-[0.7rem] text-ink-soft hover:text-ink underline underline-offset-2 transition-colors"
            >
              {t('roadmap.markAllDone')}
            </button>
          )}

          {doneCount > 0 && onReset && (
            <button
              type="button"
              onClick={onReset}
              className="press hidden sm:inline-block font-mono text-[0.7rem] text-ink-soft hover:text-ink underline underline-offset-2 transition-colors"
            >
              {t('roadmap.resetProgress')}
            </button>
          )}

          {/* Percentage Callout */}
          <div className="flex items-baseline font-mono text-xl sm:text-2xl font-bold tabular-nums text-ink">
            <span>{pct}</span>
            <span className="text-xs text-ink-soft font-normal ml-0.5">%</span>
          </div>
        </div>
      </div>

      {/* Progress Bar Component with text summary next to the bar */}
      <div className="mt-3.5">
        <ProgressBar
          value={doneCount}
          max={total}
          segments={total}
          size="md"
          summary={t('roadmap.stepCompleted', { count: doneCount, total })}
          ariaLabel={t('roadmap.stepCompleted', { count: doneCount, total })}
        />
      </div>

      {/* Step nodes / Milestone pills track */}
      {total > 0 && (
        <div className="mt-3.5 flex items-center justify-between gap-1 overflow-x-auto pb-1 pt-0.5">
          {steps.map((step, i) => {
            const isDone = done.includes(i)
            const isNext = i === nextIncompleteIndex
            return (
              <button
                key={i}
                type="button"
                onClick={() => {
                  scrollToStep(i)
                }}
                onDoubleClick={() => {
                  if (onToggleStep) onToggleStep(i)
                }}
                title={`${step.title || t('roadmap.milestone', { n: i + 1 })}${
                  onToggleStep ? ' (Double-click to toggle)' : ''
                }`}
                aria-label={t('roadmap.stepAria', { n: i + 1, title: step.title || '' })}
                className={`group relative flex h-7 sm:h-8 flex-1 min-w-[2rem] max-w-[4.5rem] items-center justify-center rounded-lg border font-mono text-xs transition-all ${
                  isDone
                    ? 'border-teal bg-teal-soft text-teal font-semibold shadow-xs'
                    : isNext
                      ? `border-current ${accentColor} ${accentSoftBg} font-semibold ring-2 ring-current/30`
                      : 'border-line/80 bg-paper-raised text-ink-soft hover:border-ink/30 hover:text-ink'
                }`}
              >
                {isDone ? (
                  <CheckIcon className="h-3.5 w-3.5 shrink-0 stroke-[2.5]" />
                ) : (
                  <span>{i + 1}</span>
                )}
                {/* Visual tooltip on hover */}
                <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-ink px-2 py-0.5 text-[0.65rem] font-sans font-medium text-paper opacity-0 shadow-sm transition-opacity group-hover:opacity-100 z-30 hidden sm:block max-w-[160px] truncate">
                  {step.title || t('roadmap.milestone', { n: i + 1 })}
                </span>
              </button>
            )
          })}
        </div>
      )}

      {/* Footer hint / completion state banner */}
      <div className="mt-2.5 flex items-center justify-between gap-3 text-[0.75rem] text-ink-soft">
        <p className="truncate">
          {isComplete ? (
            <button
              type="button"
              onClick={() => triggerConfetti(flow)}
              className="group font-medium text-teal inline-flex items-center gap-1.5 transition-transform hover:scale-[1.02] active:scale-[0.98] text-left cursor-pointer"
              title="Click to celebrate again!"
            >
              <CheckIcon className="h-3.5 w-3.5 shrink-0" />
              <span>{t('roadmap.allCompletedSub')}</span>
              <span className="opacity-70 group-hover:opacity-100 transition-opacity">🎉</span>
            </button>
          ) : nextIncompleteIndex !== -1 && steps[nextIncompleteIndex] ? (
            <span>
              <span className="font-medium text-ink">
                {t('roadmap.nextUp')}:
              </span>{' '}
              {steps[nextIncompleteIndex].title}
            </span>
          ) : (
            <span>{t('roadmap.progressHint')}</span>
          )}
        </p>

        {savedId ? (
          <span className="shrink-0 font-mono text-[0.7rem] text-teal hidden sm:inline">
            ✓ {t('roadmap.saved')}
          </span>
        ) : (
          <span className="shrink-0 font-mono text-[0.7rem] text-ink-soft hidden sm:inline">
            {t('roadmap.progressSaveHint')}
          </span>
        )}
      </div>

      {/* Rewards & Unlockable Badges Component */}
      <div className="mt-3.5 border-t border-line/60 pt-3">
        <RoadmapRewards
          doneCount={doneCount}
          total={total}
          flow={flow}
        />
      </div>
    </section>
  )
}
