import { useState } from 'react'
import BackLink from './BackLink'

const EXAMPLE_CAREERS = [
  'Pilot',
  'Chartered Accountant',
  'Doctor',
  'Lawyer',
  'Software Engineer',
  'Fashion Designer',
]

export default function ReverseForm({ onSubmit, onBack }) {
  const [career, setCareer] = useState('')
  const canSubmit = career.trim().length >= 2

  const handleSubmit = () => {
    if (canSubmit) onSubmit({ career: career.trim() })
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-16 space-y-10">
      <BackLink onBack={onBack} />

      <div className="rise space-y-3" style={{ '--i': 1 }}>
        <p className="font-mono uppercase text-xs tracking-widest text-teal">the destination</p>
        <h1 className="font-display font-semibold text-3xl text-ink">
          What do you want to become?
        </h1>
        <p className="text-ink-soft leading-relaxed">
          Anything specific works — we&rsquo;ll work backwards to the stream you should pick.
        </p>
      </div>

      <div className="rise space-y-5" style={{ '--i': 2 }}>
        <div className="relative">
          <input
            type="text"
            value={career}
            onChange={(e) => setCareer(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="e.g. Commercial Pilot"
            aria-label="Career you want to pursue"
            className="w-full rounded-2xl border border-line bg-paper-raised px-5 py-4 pr-16 text-lg text-ink shadow-card outline-none transition-colors placeholder:text-ink-soft/50 focus:border-teal"
          />
          <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 font-mono text-xs text-ink-soft/60">
            {canSubmit ? '↵' : ''}
          </span>
        </div>

        <div className="space-y-2.5">
          <p className="font-mono uppercase text-xs tracking-widest text-ink-soft">
            or start from a common one
          </p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_CAREERS.map((example) => {
              const active = career.trim().toLowerCase() === example.toLowerCase()
              return (
                <button
                  key={example}
                  type="button"
                  onClick={() => setCareer(example)}
                  aria-pressed={active}
                  className={`press rounded-full border px-4 py-1.5 text-sm transition-all duration-200 ${
                    active
                      ? 'border-teal bg-teal text-paper shadow-card'
                      : 'border-line bg-paper-raised text-ink-soft hover:border-teal/50 hover:text-teal'
                  }`}
                >
                  {example}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!canSubmit}
        style={{ '--i': 3 }}
        className="rise press w-full rounded-full bg-teal text-paper font-display font-semibold py-3.5 transition-all hover:bg-teal/90 hover:shadow-lift disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-teal disabled:hover:shadow-none"
      >
        Build my roadmap
      </button>
    </div>
  )
}
