import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import ComparisonTable from '../components/ComparisonTable'
import Loading from '../components/Loading'
import ErrorState from '../components/ErrorState'
import { Callout } from '../components/PageShell'
import useReveal from '../useReveal'
import { getComparison } from '../gemini'

const MAX_ITEMS = 4

const PRESETS = {
  Degrees: ['B.Tech', 'B.Sc', 'BCA', 'B.Com', 'BBA', 'MBBS', 'B.A', 'B.Des', 'LLB', 'B.Arch'],
  Diplomas: ['Polytechnic Diploma', 'Diploma in Hotel Management', 'ITI', 'Diploma in Animation'],
  Careers: ['Software Engineer', 'Chartered Accountant', 'Doctor', 'Pilot', 'Data Analyst'],
}

export default function Compare() {
  const [picked, setPicked] = useState(['B.Tech', 'B.Sc', 'BCA'])
  const [custom, setCustom] = useState('')
  const [screen, setScreen] = useState('picker')
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const requestRef = useRef(null)
  // Callout carries `.reveal`, so the results view needs its own observer or the salary
  // disclaimer never becomes visible on screen.
  const revealRef = useReveal([result])

  const abortPending = () => {
    requestRef.current?.abort()
    requestRef.current = null
  }

  useEffect(() => abortPending, [])

  const toggle = (option) => {
    setPicked((prev) => {
      if (prev.includes(option)) return prev.filter((p) => p !== option)
      if (prev.length >= MAX_ITEMS) return prev
      return [...prev, option]
    })
  }

  const addCustom = () => {
    const value = custom.trim()
    if (!value || picked.length >= MAX_ITEMS) return
    if (!picked.some((p) => p.toLowerCase() === value.toLowerCase())) {
      setPicked((prev) => [...prev, value])
    }
    setCustom('')
  }

  const run = useCallback(async (options) => {
    abortPending()
    const controller = new AbortController()
    requestRef.current = controller

    setError(null)
    setScreen('loading')

    try {
      const data = await getComparison({ items: options }, controller.signal)
      if (controller.signal.aborted) return
      setResult(data)
      setScreen('results')
    } catch (err) {
      if (controller.signal.aborted) return
      setError(err.message)
      setScreen('error')
    } finally {
      if (requestRef.current === controller) requestRef.current = null
    }
  }, [])

  const backToPicker = () => {
    abortPending()
    setScreen('picker')
  }

  if (screen === 'loading') return <Loading flow="reverse" />

  if (screen === 'error') {
    return (
      <ErrorState message={error} onRetry={() => run(picked)} onRestart={backToPicker} />
    )
  }

  if (screen === 'results' && result) {
    return (
      <div ref={revealRef} className="compare-sheet max-w-5xl mx-auto px-6 py-16">
        <button
          type="button"
          onClick={backToPicker}
          className="no-print group inline-flex items-center gap-1.5 font-mono text-sm text-ink-soft hover:text-ink transition-colors"
        >
          <span
            aria-hidden="true"
            className="inline-block transition-transform duration-200 group-hover:-translate-x-1"
          >
            ←
          </span>
          change options
        </button>

        <header className="mt-8 space-y-4">
          <p className="rise font-mono uppercase text-xs tracking-widest text-teal">
            side by side
          </p>
          <h1
            className="rise font-display font-semibold text-3xl sm:text-4xl leading-tight text-ink"
            style={{ '--i': 1 }}
          >
            {result.title}
          </h1>
          <span className="rise block h-1 w-14 rounded-full bg-teal" style={{ '--i': 2 }} />
          {result.summary && (
            <p className="rise text-ink-soft leading-relaxed max-w-2xl" style={{ '--i': 3 }}>
              {result.summary}
            </p>
          )}
        </header>

        <div className="mt-10">
          <ComparisonTable items={result.items} />
        </div>

        <div className="mt-10 space-y-8 max-w-2xl">
          <Callout tone="coral" title="about those salary figures">
            <p>
              These are indicative ranges, not promises. Actual pay swings hugely with your
              college tier, city, company and skills — two people with the same degree can earn
              very differently. Treat them as rough scale, and check current figures on job
              sites before making a decision on money alone.
            </p>
          </Callout>

          {result.verdict && (
            <section className="rounded-2xl border border-teal/25 bg-teal-soft px-6 py-5 space-y-2">
              <p className="font-mono uppercase text-xs tracking-widest text-teal">
                How to actually choose
              </p>
              <p className="text-sm text-ink leading-relaxed">{result.verdict}</p>
            </section>
          )}

          <div className="no-print flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={backToPicker}
              className="press rounded-full bg-ink text-paper font-display font-semibold px-7 py-3 transition-all hover:bg-ink/90 hover:shadow-lift"
            >
              Compare something else
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="press rounded-full border border-line text-ink-soft font-medium px-7 py-3 transition-colors hover:border-ink/40 hover:text-ink"
            >
              Save as PDF
            </button>
          </div>

          <p className="font-mono text-xs text-ink-soft">
            AI-generated comparison — confirm eligibility and fees on official college sites.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-16 space-y-10">
      <Link
        to="/"
        state={{ reset: Date.now() }}
        className="rise group inline-flex items-center gap-1.5 font-mono text-sm text-ink-soft hover:text-ink transition-colors"
      >
        <span
          aria-hidden="true"
          className="inline-block transition-transform duration-200 group-hover:-translate-x-1"
        >
          ←
        </span>
        back to PathFinder
      </Link>

      <div className="rise space-y-3" style={{ '--i': 1 }}>
        <p className="font-mono uppercase text-xs tracking-widest text-teal">compare</p>
        <h1 className="font-display font-semibold text-3xl text-ink">
          B.Tech or B.Sc or BCA?
        </h1>
        <p className="text-ink-soft leading-relaxed">
          Pick two to four options and see them side by side — duration, eligibility, exams,
          salary and what each one actually leads to.
        </p>
      </div>

      <div className="rise space-y-3" style={{ '--i': 2 }}>
        <div className="flex items-baseline justify-between gap-4">
          <p className="font-mono uppercase text-xs tracking-widest text-ink-soft">
            Your selection
          </p>
          <span className="font-mono text-xs text-ink-soft">
            {picked.length} of {MAX_ITEMS}
          </span>
        </div>

        {picked.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-line px-5 py-6 text-center text-sm text-ink-soft">
            Nothing picked yet — choose at least two below.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {picked.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => toggle(option)}
                className="press inline-flex items-center gap-2 rounded-full border border-teal bg-teal px-4 py-2 text-sm font-medium text-paper shadow-card"
              >
                {option}
                <span aria-hidden="true" className="text-paper/70">
                  ✕
                </span>
                <span className="sr-only">Remove {option}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {Object.entries(PRESETS).map(([group, options], groupIndex) => (
        <section key={group} className="rise space-y-3" style={{ '--i': 3 + groupIndex }}>
          <p className="font-mono uppercase text-xs tracking-widest text-ink-soft">{group}</p>
          <div className="flex flex-wrap gap-2">
            {options.map((option) => {
              const active = picked.includes(option)
              const full = !active && picked.length >= MAX_ITEMS
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggle(option)}
                  disabled={full}
                  aria-pressed={active}
                  className={`press rounded-full border px-4 py-2 text-sm transition-all duration-200 ${
                    active
                      ? 'border-teal bg-teal-soft text-teal font-medium'
                      : 'border-line bg-paper-raised text-ink-soft hover:border-teal/50 hover:text-ink'
                  } ${full ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  {option}
                </button>
              )
            })}
          </div>
        </section>
      ))}

      <section className="rise space-y-3" style={{ '--i': 6 }}>
        <p className="font-mono uppercase text-xs tracking-widest text-ink-soft">
          Something else
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustom())}
            placeholder="e.g. B.Pharm"
            aria-label="Add another option to compare"
            disabled={picked.length >= MAX_ITEMS}
            className="flex-1 rounded-full border border-line bg-paper-raised px-5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/50 focus:border-teal disabled:opacity-40"
          />
          <button
            type="button"
            onClick={addCustom}
            disabled={!custom.trim() || picked.length >= MAX_ITEMS}
            className="press rounded-full border border-line px-5 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:border-ink/40 hover:text-ink disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>
      </section>

      <button
        type="button"
        onClick={() => picked.length >= 2 && run(picked)}
        disabled={picked.length < 2}
        style={{ '--i': 7 }}
        className="rise press w-full rounded-full bg-teal text-paper font-display font-semibold py-3.5 transition-all hover:bg-teal/90 hover:shadow-lift disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-teal disabled:hover:shadow-none"
      >
        {picked.length < 2 ? 'Pick at least two to compare' : `Compare ${picked.length} options`}
      </button>
    </div>
  )
}
