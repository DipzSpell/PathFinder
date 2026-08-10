import useReveal from '../useReveal'

const ACCENTS = {
  forward: { '--accent': 'var(--color-saffron)' },
  reverse: { '--accent': 'var(--color-teal)' },
}

function PrintIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M7 9V4h10v5M7 18H5a1 1 0 01-1-1v-5a2 2 0 012-2h12a2 2 0 012 2v5a1 1 0 01-1 1h-2M7 15h10v5H7v-5z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function Roadmap({ roadmap, flow, onRestart }) {
  const { title, summary, steps, examsToWatch, commonMistake } = roadmap
  const revealRef = useReveal([roadmap])
  const accentColor = flow === 'reverse' ? 'text-teal' : 'text-saffron'

  return (
    <div
      ref={revealRef}
      style={ACCENTS[flow] ?? ACCENTS.forward}
      className="roadmap-sheet max-w-2xl mx-auto px-6 py-16"
    >
      <header className="space-y-4">
        <p className={`rise font-mono uppercase text-xs tracking-widest ${accentColor}`}>
          your roadmap
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
          <span>
            {steps.length} step{steps.length === 1 ? '' : 's'}
          </span>
          {examsToWatch.length > 0 && (
            <span>
              {examsToWatch.length} exam{examsToWatch.length === 1 ? '' : 's'} to track
            </span>
          )}
          <span>{flow === 'reverse' ? 'career → path' : 'interests → career'}</span>
        </div>
      </header>

      <ol className="mt-12">
        {steps.map((step, i) => (
          <li key={`${step.title}-${i}`} className="roadmap-step reveal flex gap-5">
            <div className="flex flex-col items-center">
              <span className="roadmap-node flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-mono text-sm font-medium">
                {i + 1}
              </span>
              {i < steps.length - 1 && (
                <div className="trail-connector flex-1 my-2">
                  <span className="trail-fill" />
                </div>
              )}
            </div>

            <div className={i < steps.length - 1 ? 'pb-10 space-y-2' : 'space-y-2'}>
              {step.stage && (
                <p className="font-mono uppercase text-xs tracking-widest text-ink-soft">
                  {step.stage}
                </p>
              )}
              {step.title && (
                <h2 className="font-display font-semibold text-lg text-ink">{step.title}</h2>
              )}
              {step.detail && (
                <p className="text-sm text-ink-soft leading-relaxed">{step.detail}</p>
              )}
              {step.requirement && (
                <p className="roadmap-chip inline-block rounded-full border px-3.5 py-1.5 font-mono text-xs text-ink">
                  {step.requirement}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>

      {examsToWatch.length > 0 && (
        <section className="reveal mt-12 space-y-4">
          <p className="font-mono uppercase text-xs tracking-widest text-ink-soft">
            Exams to watch
          </p>
          <div className="flex flex-wrap gap-2">
            {examsToWatch.map((exam) => (
              <span
                key={exam}
                className="rounded-full border border-line bg-paper-raised px-4 py-1.5 text-sm text-ink-soft shadow-card"
              >
                {exam}
              </span>
            ))}
          </div>
        </section>
      )}

      {commonMistake && (
        <section className="roadmap-callout reveal mt-12 rounded-2xl border border-coral/25 bg-coral-soft px-6 py-5 space-y-2">
          <p className="font-mono uppercase text-xs tracking-widest text-coral">
            The mistake most people make
          </p>
          <p className="text-sm text-ink leading-relaxed">{commonMistake}</p>
        </section>
      )}

      <div className="no-print reveal mt-12 flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={onRestart}
          className="press rounded-full bg-ink text-paper font-display font-semibold px-7 py-3 transition-colors hover:bg-ink/90"
        >
          Map another path
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="press inline-flex items-center justify-center gap-2 rounded-full border border-line text-ink-soft font-medium px-7 py-3 transition-colors hover:border-ink/40 hover:text-ink"
        >
          <PrintIcon />
          Save as PDF
        </button>
      </div>

      <p className="mt-8 font-mono text-xs text-ink-soft">
        AI-generated guidance — always confirm exam dates and eligibility on official sites.
      </p>
    </div>
  )
}
