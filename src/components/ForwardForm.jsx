import { useState } from 'react'
import BackLink from './BackLink'
import { useLang } from '../prefs'

const STAGES = [
  { value: '10th', label: 'fwd.stage10', hint: 'fwd.stage10hint' },
  { value: '12th', label: 'fwd.stage12', hint: 'fwd.stage12hint' },
]

/* Values stay English whatever the UI language — they go into the prompt and the cache key. */
const INTERESTS = [
  'Math & Logic',
  'Science & Experiments',
  'Business & Money',
  'Art & Design',
  'Writing & Communication',
  'People & Helping others',
  'Computers & Tech',
  'Not sure yet',
]

export default function ForwardForm({ onSubmit, onBack }) {
  const { t } = useLang()
  const [stage, setStage] = useState(null)
  const [interests, setInterests] = useState([])

  const toggleInterest = (interest) => {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest],
    )
  }

  const filled = (stage ? 1 : 0) + (interests.length ? 1 : 0)

  return (
    <div className="max-w-2xl mx-auto px-6 py-16 space-y-10">
      <BackLink onBack={onBack} />

      <div className="rise space-y-4">
        <div className="flex items-center justify-between font-mono text-xs text-ink-soft">
          <span className="uppercase tracking-widest">
            {t('fwd.step', { n: Math.min(filled + 1, 2) })}
          </span>
          <span>{filled === 2 ? t('fwd.ready') : t('fwd.progress')}</span>
        </div>
        <div className="h-1 rounded-full bg-line overflow-hidden">
          <div
            className="h-full rounded-full bg-saffron transition-[width] duration-500 ease-out"
            style={{ width: `${(filled / 2) * 100}%` }}
          />
        </div>
      </div>

      <h1 className="rise font-display font-semibold text-3xl text-ink" style={{ '--i': 1 }}>
        {t('fwd.title')}
      </h1>

      <section className="rise space-y-4" style={{ '--i': 2 }}>
        <p className="font-mono uppercase text-xs tracking-widest text-ink-soft">
          {t('fwd.stageLabel')}
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {STAGES.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => setStage(s.value)}
              aria-pressed={stage === s.value}
              className={`lift press rounded-2xl border p-4 text-left transition-colors ${
                stage === s.value
                  ? 'bg-ink text-paper border-ink'
                  : 'bg-paper-raised border-line text-ink hover:border-ink/40'
              }`}
            >
              <span className="block font-medium">{t(s.label)}</span>
              <span
                className={`mt-0.5 block text-xs ${
                  stage === s.value ? 'text-paper/70' : 'text-ink-soft'
                }`}
              >
                {t(s.hint)}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="rise space-y-4" style={{ '--i': 3 }}>
        <div className="flex items-baseline justify-between gap-4">
          <p className="font-mono uppercase text-xs tracking-widest text-ink-soft">
            {t('fwd.interestLabel')}
          </p>
          <span className="font-mono text-xs text-ink-soft">
            {interests.length ? t('fwd.selected', { count: interests.length }) : t('fwd.optional')}
          </span>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {INTERESTS.map((interest) => {
            const active = interests.includes(interest)
            return (
              <button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                aria-pressed={active}
                className={`press inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium border transition-all duration-200 ${
                  active
                    ? 'bg-saffron text-paper border-saffron shadow-card'
                    : 'bg-paper-raised border-line text-ink-soft hover:border-saffron/50 hover:text-ink'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`text-xs transition-transform duration-200 ${
                    active ? 'scale-110' : 'scale-100'
                  }`}
                >
                  {active ? '✓' : '+'}
                </span>
                {t(`interest.${interest}`)}
              </button>
            )
          })}
        </div>
      </section>

      <button
        type="button"
        onClick={() => stage && onSubmit({ stage, interests })}
        disabled={!stage}
        style={{ '--i': 4 }}
        className="rise press w-full rounded-full bg-ink text-paper font-display font-semibold py-3.5 transition-all hover:bg-ink/90 hover:shadow-lift disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-ink disabled:hover:shadow-none"
      >
        {stage ? t('fwd.submit') : t('fwd.pickStage')}
      </button>
    </div>
  )
}
