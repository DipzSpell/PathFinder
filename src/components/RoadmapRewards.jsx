import { useState, useEffect, useRef, useCallback } from 'react'
import confetti from 'canvas-confetti'
import { useLang } from '../prefs'
import { CheckIcon } from './Icons'

const BADGES = [
  {
    id: 'first-step',
    title: 'First Footprint',
    titleHi: 'पहला कदम',
    description: 'Completed your very first milestone on this roadmap.',
    descriptionHi: 'अपने सफर का पहला पड़ाव सफलतापूर्वक पूरा किया।',
    threshold: 1,
    type: 'count',
    icon: 'compass',
    tier: 'Bronze',
    tierColor: 'bg-amber-700/15 text-amber-800 dark:text-amber-200 border-amber-600/30',
    gradient: 'from-amber-600 via-amber-700 to-stone-800',
    glow: 'rgba(217, 119, 6, 0.25)',
  },
  {
    id: 'quarter-way',
    title: 'Quarter Wayfinder',
    titleHi: 'दिशा सूचक',
    description: 'Reached 25% roadmap completion. Foundational milestones conquered.',
    descriptionHi: '25% सफर पूरा — शुरुआती तैयारी और बुनियादी पड़ाव पार किए।',
    threshold: 25,
    type: 'pct',
    tier: 'Silver',
    tierColor: 'bg-cyan-700/15 text-cyan-800 dark:text-cyan-200 border-cyan-600/30',
    gradient: 'from-cyan-600 via-teal-700 to-slate-800',
    glow: 'rgba(6, 182, 212, 0.25)',
  },
  {
    id: 'halfway',
    title: 'Midway Navigator',
    titleHi: 'आधा सफर तय',
    description: 'Crossed the 50% milestone mark. Momentum is now unstoppable.',
    descriptionHi: '50% का पड़ाव पार — आपकी तैयारी अब मजबूत स्थिति में है।',
    threshold: 50,
    type: 'pct',
    tier: 'Gold',
    tierColor: 'bg-emerald-700/15 text-emerald-800 dark:text-emerald-200 border-emerald-600/30',
    gradient: 'from-emerald-600 via-teal-700 to-stone-900',
    glow: 'rgba(16, 185, 129, 0.25)',
  },
  {
    id: 'three-quarters',
    title: 'Summit Contender',
    titleHi: 'अंतिम चढ़ाई',
    description: 'Reached 75% completion. Major entrance prep and degrees in order.',
    descriptionHi: '75% सफर पूरा — अब लक्ष्य बिल्कुल सामने है।',
    threshold: 75,
    type: 'pct',
    tier: 'Platinum',
    tierColor: 'bg-indigo-700/15 text-indigo-800 dark:text-indigo-200 border-indigo-600/30',
    gradient: 'from-indigo-600 via-purple-700 to-slate-900',
    glow: 'rgba(99, 102, 241, 0.25)',
  },
  {
    id: 'trailblazer',
    title: 'Pathfinder Master',
    titleHi: 'सफलता का शिखर',
    description: '100% roadmap completed! Fully equipped to achieve your career dream.',
    descriptionHi: '100% पूरा! आप अपने लक्ष्य को हासिल करने के लिए पूरी तरह तैयार हैं।',
    threshold: 100,
    type: 'pct',
    tier: 'Legendary',
    tierColor: 'bg-amber-500/20 text-amber-900 dark:text-amber-100 border-amber-500/50',
    gradient: 'from-amber-400 via-amber-500 to-rose-600',
    glow: 'rgba(245, 158, 11, 0.35)',
  },
]

function BadgeIcon({ name, className = 'w-6 h-6' }) {
  switch (name) {
    case 'compass':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="12" cy="12" r="10" />
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor" fillOpacity="0.2" />
        </svg>
      )
    case 'map':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" fill="currentColor" fillOpacity="0.15" />
          <line x1="8" y1="2" x2="8" y2="18" />
          <line x1="16" y1="6" x2="16" y2="22" />
        </svg>
      )
    case 'mountain':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="m8 3 4 8 5-5 5 15H2L8 3z" fill="currentColor" fillOpacity="0.15" />
          <path d="M4.14 15.08 7 11l2 2 3-3 4 4" />
        </svg>
      )
    case 'shield':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="currentColor" fillOpacity="0.15" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      )
    case 'crown':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14v2H5v-2z" fill="currentColor" fillOpacity="0.2" />
          <circle cx="12" cy="4" r="1.5" fill="currentColor" />
          <circle cx="2" cy="4" r="1.5" fill="currentColor" />
          <circle cx="22" cy="4" r="1.5" fill="currentColor" />
        </svg>
      )
    default:
      return null
  }
}

function fireBadgeConfetti() {
  if (typeof window === 'undefined') return
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) return

  confetti({
    particleCount: 40,
    spread: 60,
    origin: { y: 0.7 },
    colors: ['#f59e0b', '#10b981', '#06b6d4', '#6366f1', '#ec4899'],
    zIndex: 9999,
  })
}

export default function RoadmapRewards({ doneCount = 0, total = 0, flow: _flow = 'forward' }) {
  const { lang } = useLang()
  const [selectedBadge, setSelectedBadge] = useState(null)
  const [newlyUnlocked, setNewlyUnlocked] = useState(null)
  const [isExpanded, setIsExpanded] = useState(true)

  const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0

  const isBadgeUnlocked = useCallback(
    (b) => {
      if (b.type === 'count') return doneCount >= b.threshold
      return pct >= b.threshold
    },
    [doneCount, pct]
  )

  const unlockedCount = BADGES.filter(isBadgeUnlocked).length

  // Track unlocking of new badges to show celebration toast
  const prevUnlockedIdsRef = useRef(new Set())
  const hasInitializedRef = useRef(false)

  useEffect(() => {
    const currentUnlockedIds = new Set(BADGES.filter(isBadgeUnlocked).map((b) => b.id))

    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true
      prevUnlockedIdsRef.current = currentUnlockedIds
      return
    }

    // Find any newly unlocked badges that were not in prevUnlockedIds
    const justUnlocked = BADGES.find(
      (b) => currentUnlockedIds.has(b.id) && !prevUnlockedIdsRef.current.has(b.id)
    )

    if (justUnlocked) {
      setNewlyUnlocked(justUnlocked)
      fireBadgeConfetti()
      const timer = setTimeout(() => {
        setNewlyUnlocked(null)
      }, 5000)
      prevUnlockedIdsRef.current = currentUnlockedIds
      return () => clearTimeout(timer)
    }

    prevUnlockedIdsRef.current = currentUnlockedIds
  }, [isBadgeUnlocked])

  const getBadgeRequirementText = (badge) => {
    if (badge.type === 'count') {
      return lang === 'hi' ? '1 पड़ाव पूरा करें' : 'Complete 1 milestone'
    }
    const neededSteps = Math.ceil((badge.threshold / 100) * total)
    const remaining = Math.max(0, neededSteps - doneCount)
    if (lang === 'hi') {
      return remaining > 0 ? `${remaining} और पड़ाव बाकी (${badge.threshold}%)` : 'सफलतापूर्वक हासिल'
    }
    return remaining > 0 ? `${remaining} more step${remaining === 1 ? '' : 's'} needed (${badge.threshold}%)` : 'Unlocked!'
  }

  return (
    <div className="rounded-xl border border-line bg-paper-raised/70 p-3.5 sm:p-4 transition-all">
      {/* Newly Unlocked Toast Banner */}
      {newlyUnlocked && (
        <div
          role="status"
          aria-live="polite"
          className="mb-3 flex items-center justify-between gap-3 rounded-lg border border-amber-500/40 bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-transparent p-3 animate-bounce"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500 text-paper font-bold shadow-md">
              🏆
            </span>
            <div className="min-w-0">
              <p className="font-mono text-[0.7rem] uppercase tracking-wider text-amber-700 dark:text-amber-300 font-semibold">
                {lang === 'hi' ? 'नया बैज अनलॉक हुआ!' : 'New Badge Unlocked!'}
              </p>
              <p className="font-display text-sm font-bold text-ink truncate">
                {lang === 'hi' ? newlyUnlocked.titleHi : newlyUnlocked.title}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSelectedBadge(newlyUnlocked)}
            className="press shrink-0 rounded-md border border-amber-500/30 bg-paper px-2.5 py-1 font-mono text-xs font-medium text-amber-800 dark:text-amber-200 hover:bg-paper-raised"
          >
            {lang === 'hi' ? 'देखें' : 'View'}
          </button>
        </div>
      )}

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-base sm:text-lg" aria-hidden="true">
            🏆
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-sm font-semibold text-ink">
                {lang === 'hi' ? 'माइलस्टोन रिवार्ड्स' : 'Milestone Badges'}
              </h3>
              <span className="rounded-full border border-line bg-paper px-2 py-0.5 font-mono text-[0.68rem] font-medium text-ink-soft">
                {unlockedCount} / {BADGES.length} {lang === 'hi' ? 'अनलॉक' : 'unlocked'}
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="press font-mono text-xs text-ink-soft hover:text-ink underline underline-offset-2 transition-colors"
        >
          {isExpanded
            ? (lang === 'hi' ? 'छुपाएं' : 'Hide badges')
            : (lang === 'hi' ? 'बैज दिखाएं' : 'Show badges')}
        </button>
      </div>

      {/* Badges Grid / Strip */}
      {isExpanded && (
        <div className="mt-3.5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {BADGES.map((b) => {
            const unlocked = isBadgeUnlocked(b)
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => {
                  setSelectedBadge(b)
                  if (unlocked) fireBadgeConfetti()
                }}
                className={`press group relative flex flex-col items-center rounded-xl border p-3 text-center transition-all ${
                  unlocked
                    ? 'border-line bg-paper shadow-sm hover:border-ink/30 hover:shadow-md'
                    : 'border-line/40 bg-line/20 opacity-60 hover:opacity-85'
                }`}
                style={
                  unlocked
                    ? {
                        boxShadow: `0 4px 14px -3px ${b.glow}`,
                      }
                    : undefined
                }
              >
                {/* Badge Icon Emblem */}
                <div
                  className={`relative flex h-12 w-12 items-center justify-center rounded-2xl transition-transform group-hover:scale-105 ${
                    unlocked
                      ? `bg-gradient-to-br ${b.gradient} text-paper shadow-inner`
                      : 'bg-ink/10 text-ink/40'
                  }`}
                >
                  <BadgeIcon name={b.icon} className="h-6 w-6" />
                  {unlocked ? (
                    <span
                      className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-teal text-paper text-[0.6rem] font-bold shadow"
                      title="Unlocked"
                    >
                      <CheckIcon className="h-2.5 w-2.5 stroke-[3]" />
                    </span>
                  ) : (
                    <span
                      className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-paper border border-line text-[0.6rem] text-ink-soft"
                      title="Locked"
                    >
                      🔒
                    </span>
                  )}
                </div>

                {/* Badge Title */}
                <span className="mt-2 font-display text-xs font-semibold text-ink line-clamp-1">
                  {lang === 'hi' ? b.titleHi : b.title}
                </span>

                {/* Tier & Requirement pill */}
                <span
                  className={`mt-1 inline-block rounded border px-1.5 py-0.5 font-mono text-[0.65rem] font-medium ${
                    unlocked ? b.tierColor : 'border-line/40 bg-transparent text-ink-soft'
                  }`}
                >
                  {unlocked ? b.tier : `${b.threshold}%`}
                </span>
              </button>
            )
          })}
        </div>
      )}

      {/* Selected Badge Modal / Details Popover */}
      {selectedBadge && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-xs animate-fade-in"
          onClick={() => setSelectedBadge(null)}
        >
          <div
            className="relative w-full max-w-sm rounded-2xl border border-line bg-paper p-5 sm:p-6 shadow-lift transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setSelectedBadge(null)}
              aria-label="Close"
              className="press absolute top-3.5 right-3.5 flex h-7 w-7 items-center justify-center rounded-full border border-line text-ink-soft hover:text-ink hover:border-ink/40"
            >
              ✕
            </button>

            {/* Modal Content */}
            <div className="flex flex-col items-center text-center">
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-2xl shadow-lift ${
                  isBadgeUnlocked(selectedBadge)
                    ? `bg-gradient-to-br ${selectedBadge.gradient} text-paper`
                    : 'bg-ink/10 text-ink/40'
                }`}
              >
                <BadgeIcon name={selectedBadge.icon} className="h-8 w-8" />
              </div>

              <div className="mt-3">
                <span
                  className={`inline-block rounded-full border px-2.5 py-0.5 font-mono text-xs font-semibold ${
                    isBadgeUnlocked(selectedBadge)
                      ? selectedBadge.tierColor
                      : 'border-line bg-line/30 text-ink-soft'
                  }`}
                >
                  {isBadgeUnlocked(selectedBadge)
                    ? `${selectedBadge.tier} · ${lang === 'hi' ? 'अनलॉक' : 'Unlocked'}`
                    : (lang === 'hi' ? 'लॉक किया हुआ' : 'Locked')}
                </span>
              </div>

              <h4 className="mt-2 font-display text-lg font-bold text-ink">
                {lang === 'hi' ? selectedBadge.titleHi : selectedBadge.title}
              </h4>

              <p className="mt-2 text-xs sm:text-sm text-ink-soft leading-relaxed">
                {lang === 'hi' ? selectedBadge.descriptionHi : selectedBadge.description}
              </p>

              {/* Requirement bar in modal */}
              <div className="mt-4 w-full rounded-xl border border-line bg-paper-raised p-3 text-left">
                <div className="flex items-center justify-between text-xs font-mono text-ink-soft mb-1.5">
                  <span>{lang === 'hi' ? 'शर्त' : 'Requirement'}</span>
                  <span className="font-semibold text-ink">
                    {getBadgeRequirementText(selectedBadge)}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-line">
                  <div
                    className="h-full rounded-full bg-teal transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        100,
                        selectedBadge.type === 'count'
                          ? (doneCount / selectedBadge.threshold) * 100
                          : (pct / selectedBadge.threshold) * 100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-5 flex w-full gap-2">
                {isBadgeUnlocked(selectedBadge) && (
                  <button
                    type="button"
                    onClick={() => fireBadgeConfetti()}
                    className="press flex-1 rounded-xl bg-ink py-2 text-xs font-display font-semibold text-paper hover:bg-ink/90"
                  >
                    🎉 {lang === 'hi' ? 'जश्न मनाएं!' : 'Celebrate!'}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedBadge(null)}
                  className="press flex-1 rounded-xl border border-line py-2 text-xs font-mono text-ink hover:border-ink/40"
                >
                  {lang === 'hi' ? 'बंद करें' : 'Done'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
