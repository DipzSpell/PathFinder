import { useState } from 'react'
import useReveal from '../useReveal'
import { useLang } from '../prefs'
import { findSaved, removeSaved, roadmapSignature, saveRoadmap, updateProgress } from '../saved'
import ShareMenu from './ShareMenu'
import {
  BookmarkIcon,
  CautionIcon,
  CheckIcon,
  FlagIcon,
  PinIcon,
  PrintIcon,
  TicketIcon,
} from './Icons'

const ACCENTS = {
  forward: { '--accent': 'var(--color-saffron)' },
  reverse: { '--accent': 'var(--color-teal)' },
}

/* Where each marker sits across its lane, as a percentage. The road bends between the two
   values; on wide screens it also swings toward whichever side the card is on. */
const LANE_X = {
  mobile: { center: 50, a: 36, b: 64 },
  desktop: { center: 50, left: 30, right: 70 },
}

function startLabel(flow, input, t) {
  if (flow === 'reverse') return t('roadmap.startRev')
  if (input?.stage === '10th') return t('roadmap.startFwd10')
  if (input?.stage === '12th') return t('roadmap.startFwd12')
  return t('roadmap.startGeneric')
}

function RoadSegment({ from, to, className }) {
  const d = `M ${from} 0 C ${from} 55, ${to} 45, ${to} 100`
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={`road-segment ${className}`}>
      <path className="road-asphalt" d={d} vectorEffect="non-scaling-stroke" />
      <path className="road-mark" d={d} vectorEffect="non-scaling-stroke" />
      <path className="road-travel" d={d} pathLength="1" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

/** One stop on the road: the lane (marker + the stretch of road down to the next stop), the
    card, and on wide screens a signpost on the opposite side. */
function Stop({ side, x, nextX, node, card, signpost, last }) {
  const cardCol = side === 'left' ? 'sm:col-start-1' : 'sm:col-start-3'
  const signCol = side === 'left' ? 'sm:col-start-3 sm:justify-start' : 'sm:col-start-1 sm:justify-end'

  return (
    <li className="road-stop reveal grid grid-cols-[3.25rem_1fr] gap-x-3 sm:grid-cols-[1fr_6rem_1fr] sm:gap-x-4">
      <div
        className="road-lane col-start-1 row-start-1 sm:col-start-2"
        style={{ '--x': `${x.mobile}%` }}
      >
        {!last && (
          <>
            <RoadSegment from={x.mobile} to={nextX.mobile} className="sm:hidden" />
            <RoadSegment from={x.desktop} to={nextX.desktop} className="hidden sm:block" />
          </>
        )}
        <span className="road-node flex sm:hidden">{node}</span>
        <span className="road-node hidden sm:flex" style={{ '--x': `${x.desktop}%` }}>
          {node}
        </span>
      </div>

      <div className={`col-start-2 row-start-1 ${cardCol} ${last ? '' : 'pb-9'}`}>{card}</div>

      {signpost && (
        <div className={`hidden sm:flex row-start-1 items-start pt-[0.4rem] ${signCol}`}>
          {signpost}
        </div>
      )}
    </li>
  )
}

export default function Roadmap({
  roadmap,
  flow,
  lang = 'en',
  input = null,
  eyebrow,
  onRestart,
  restartLabel,
  onTranslate,
}) {
  const { t, lang: uiLang } = useLang()
  const { title, summary, steps, examsToWatch, commonMistake } = roadmap
  const revealRef = useReveal([roadmap])
  const accentColor = flow === 'reverse' ? 'text-teal' : 'text-saffron'

  const signature = roadmapSignature({ roadmap, flow, lang })
  const [savedId, setSavedId] = useState(() => findSaved(signature)?.id ?? null)
  const [done, setDone] = useState(() => findSaved(signature)?.progress ?? [])

  const toggleSave = () => {
    if (savedId) {
      removeSaved(savedId)
      setSavedId(null)
      return
    }
    const entry = saveRoadmap({ roadmap, flow, lang, input, progress: done })
    setSavedId(entry?.id ?? null)
  }

  const toggleDone = (index) => {
    const next = done.includes(index)
      ? done.filter((i) => i !== index)
      : [...done, index].sort((a, b) => a - b)
    setDone(next)
    if (savedId) updateProgress(savedId, next)
  }

  const doneCount = done.filter((i) => i < steps.length).length
  const pct = Math.round((doneCount / steps.length) * 100)

  // Lane positions for every stop: start, each step, destination.
  const positions = [
    { mobile: LANE_X.mobile.center, desktop: LANE_X.desktop.center },
    ...steps.map((_, i) => ({
      mobile: i % 2 === 0 ? LANE_X.mobile.a : LANE_X.mobile.b,
      desktop: i % 2 === 0 ? LANE_X.desktop.right : LANE_X.desktop.left,
    })),
    { mobile: LANE_X.mobile.center, desktop: LANE_X.desktop.center },
  ]

  return (
    <div
      ref={revealRef}
      style={ACCENTS[flow] ?? ACCENTS.forward}
      className="roadmap-sheet max-w-3xl mx-auto px-6 py-16"
    >
      <header className="space-y-4 max-w-2xl">
        <p className={`rise font-mono uppercase text-xs tracking-widest ${accentColor}`}>
          {eyebrow ?? t('roadmap.eyebrow')}
        </p>
        <h1
          className="rise font-display font-semibold text-3xl sm:text-4xl leading-tight text-ink"
          style={{ '--i': 1 }}
        >
          {title}
        </h1>
        <span className="roadmap-rule rise block h-1 w-14 rounded-full" style={{ '--i': 2 }} />
        {summary && (
          <p className="rise text-ink-soft leading-relaxed" style={{ '--i': 3 }}>
            {summary}
          </p>
        )}

        <div
          className="rise flex flex-wrap gap-x-6 gap-y-2 pt-2 font-mono text-xs text-ink-soft"
          style={{ '--i': 4 }}
        >
          <span>{t('roadmap.steps', { count: steps.length })}</span>
          {examsToWatch.length > 0 && (
            <span>{t('roadmap.exams', { count: examsToWatch.length })}</span>
          )}
          <span>{flow === 'reverse' ? t('roadmap.revFlow') : t('roadmap.fwdFlow')}</span>
        </div>
      </header>

      {onTranslate && lang !== uiLang && (
        <div className="no-print rise mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-paper-raised px-5 py-3 text-sm text-ink-soft">
          <span>{lang === 'hi' ? t('roadmap.translateEn') : t('roadmap.translate')}</span>
          <button
            type="button"
            onClick={onTranslate}
            className={`press font-medium underline underline-offset-4 ${accentColor}`}
          >
            {lang === 'hi' ? t('roadmap.translateEnCta') : t('roadmap.translateCta')}
          </button>
        </div>
      )}

      <div className="no-print rise mt-8 flex flex-wrap items-center gap-2" style={{ '--i': 5 }}>
        <button
          type="button"
          onClick={toggleSave}
          aria-pressed={Boolean(savedId)}
          aria-label={savedId ? t('roadmap.unsaveAria') : undefined}
          className={`press inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors ${
            savedId
              ? 'border-ink bg-ink text-paper'
              : 'border-line bg-paper-raised text-ink-soft hover:border-ink/40 hover:text-ink'
          }`}
        >
          <BookmarkIcon filled={Boolean(savedId)} />
          {savedId ? t('roadmap.saved') : t('roadmap.save')}
        </button>
        <ShareMenu roadmap={roadmap} flow={flow} lang={lang} />
        <button
          type="button"
          onClick={() => window.print()}
          className="press inline-flex items-center gap-2 rounded-full border border-line bg-paper-raised px-4 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:border-ink/40 hover:text-ink"
        >
          <PrintIcon />
          {t('common.savePdf')}
        </button>
      </div>

      <div className="no-print rise mt-6 max-w-md space-y-2" style={{ '--i': 6 }}>
        <div className="flex items-baseline justify-between gap-4 font-mono text-xs text-ink-soft">
          <span>{t('roadmap.progress', { done: doneCount, total: steps.length })}</span>
          <span>{pct}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-line overflow-hidden">
          <div className="progress-fill h-full rounded-full" style={{ width: `${pct}%` }} />
        </div>
        <p className="text-xs text-ink-soft">
          {savedId || doneCount === 0 ? t('roadmap.progressHint') : t('roadmap.progressSaveHint')}
        </p>
      </div>

      <ol className="mt-12">
        <Stop
          side="right"
          x={positions[0]}
          nextX={positions[1]}
          node={
            <span className="road-endpoint flex h-10 w-10 items-center justify-center rounded-full">
              <PinIcon className="h-5 w-5" />
            </span>
          }
          card={
            <div className="pt-1.5 pb-2">
              <p className={`font-mono uppercase text-xs tracking-widest ${accentColor}`}>
                {t('roadmap.start')}
              </p>
              <p className="mt-1 font-display font-semibold text-ink">
                {startLabel(flow, input, t)}
              </p>
            </div>
          }
        />

        {steps.map((step, i) => {
          const side = i % 2 === 0 ? 'right' : 'left'
          const isDone = done.includes(i)
          return (
            <Stop
              key={`${step.title}-${i}`}
              side={side}
              x={positions[i + 1]}
              nextX={positions[i + 2]}
              node={
                <span
                  className={`roadmap-node flex h-10 w-10 items-center justify-center rounded-full font-mono text-sm font-medium ${
                    isDone ? 'is-done' : ''
                  }`}
                >
                  {isDone ? <CheckIcon className="h-4 w-4" /> : i + 1}
                </span>
              }
              signpost={
                step.stage && (
                  <span className="signpost rounded-lg border px-3 py-1.5 font-mono text-[0.7rem] uppercase tracking-wider shadow-card">
                    {step.stage}
                  </span>
                )
              }
              card={
                <article
                  data-side={side}
                  className={`road-card relative rounded-2xl border border-line bg-paper-raised p-5 shadow-card ${
                    isDone ? 'is-done' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-mono uppercase text-[0.7rem] tracking-widest text-ink-soft">
                      <span className="sm:hidden">{step.stage || t('roadmap.milestone', { n: i + 1 })}</span>
                      <span className="hidden sm:inline">{t('roadmap.milestone', { n: i + 1 })}</span>
                    </p>
                    <button
                      type="button"
                      onClick={() => toggleDone(i)}
                      aria-pressed={isDone}
                      className={`no-print press -mt-1 inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                        isDone
                          ? 'border-teal bg-teal-soft text-teal'
                          : 'border-line text-ink-soft hover:border-teal/50 hover:text-teal'
                      }`}
                    >
                      <CheckIcon className="h-3.5 w-3.5" />
                      {isDone ? t('roadmap.done') : t('roadmap.markDone')}
                    </button>
                  </div>
                  {step.title && (
                    <h2 className="mt-2 font-display font-semibold text-lg text-ink leading-snug">
                      {step.title}
                    </h2>
                  )}
                  {step.detail && (
                    <p className="mt-2 text-sm text-ink-soft leading-relaxed">{step.detail}</p>
                  )}
                  {step.requirement && (
                    <p className="roadmap-chip mt-3 inline-block rounded-xl border px-3.5 py-1.5 font-mono text-xs text-ink">
                      {step.requirement}
                    </p>
                  )}
                </article>
              }
            />
          )
        })}

        <Stop
          side="right"
          x={positions[positions.length - 1]}
          last
          node={
            <span className="road-endpoint flex h-10 w-10 items-center justify-center rounded-full">
              <FlagIcon className="h-5 w-5" />
            </span>
          }
          card={
            <div className="pt-1.5">
              <p className={`font-mono uppercase text-xs tracking-widest ${accentColor}`}>
                {t('roadmap.destination')}
              </p>
              <p className="mt-1 font-display font-semibold text-lg text-ink">{title}</p>
            </div>
          }
        />
      </ol>

      {examsToWatch.length > 0 && (
        <section className="reveal mt-14 space-y-4">
          <p className="flex items-center gap-2 font-mono uppercase text-xs tracking-widest text-ink-soft">
            <TicketIcon className={`h-4 w-4 ${accentColor}`} />
            {t('roadmap.examsTitle')}
          </p>
          <div className="flex flex-wrap gap-2">
            {examsToWatch.map((exam) => (
              <span
                key={exam}
                className="roadmap-chip rounded-xl border px-4 py-2 text-sm font-medium text-ink shadow-card"
              >
                {exam}
              </span>
            ))}
          </div>
        </section>
      )}

      {commonMistake && (
        <section className="roadmap-callout reveal mt-12 flex gap-4 rounded-2xl border border-coral/25 bg-coral-soft px-6 py-5">
          <CautionIcon className="mt-0.5 h-6 w-6 shrink-0 text-coral" />
          <div className="space-y-2">
            <p className="font-mono uppercase text-xs tracking-widest text-coral">
              {t('roadmap.mistakeTitle')}
            </p>
            <p className="text-sm text-ink leading-relaxed">{commonMistake}</p>
          </div>
        </section>
      )}

      {onRestart && (
        <div className="no-print reveal mt-12">
          <button
            type="button"
            onClick={onRestart}
            className="press rounded-full bg-ink text-paper font-display font-semibold px-7 py-3 transition-colors hover:bg-ink/90"
          >
            {restartLabel ?? t('roadmap.again')}
          </button>
        </div>
      )}

      <p className="mt-8 font-mono text-xs text-ink-soft">{t('roadmap.disclaimer')}</p>
    </div>
  )
}
