import { Link } from 'react-router-dom'
import useReveal from '../useReveal'

export default function PageShell({ eyebrow, title, intro, meta, children }) {
  const revealRef = useReveal()

  return (
    <main ref={revealRef} className="max-w-2xl mx-auto px-6 py-16">
      <Link
        to="/"
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

      <header className="mt-10 space-y-4">
        {eyebrow && (
          <p className="rise font-mono uppercase text-xs tracking-widest text-saffron">
            {eyebrow}
          </p>
        )}
        <h1
          className="rise font-display font-semibold text-3xl sm:text-4xl leading-tight text-ink"
          style={{ '--i': 1 }}
        >
          {title}
        </h1>
        <span className="rise block h-1 w-14 rounded-full bg-saffron" style={{ '--i': 2 }} />
        {intro && (
          <p className="rise text-ink-soft leading-relaxed text-lg" style={{ '--i': 3 }}>
            {intro}
          </p>
        )}
        {meta && (
          <p className="rise font-mono text-xs text-ink-soft" style={{ '--i': 4 }}>
            {meta}
          </p>
        )}
      </header>

      <div className="mt-12 space-y-10">{children}</div>
    </main>
  )
}

export function Section({ title, children }) {
  return (
    <section className="reveal space-y-3">
      <h2 className="font-display font-semibold text-xl text-ink">{title}</h2>
      <div className="space-y-3 text-ink-soft leading-relaxed">{children}</div>
    </section>
  )
}

export function Callout({ tone = 'saffron', title, children }) {
  const tones = {
    saffron: 'border-saffron/25 bg-saffron-soft',
    teal: 'border-teal/25 bg-teal-soft',
    coral: 'border-coral/25 bg-coral-soft',
  }
  const labels = {
    saffron: 'text-saffron',
    teal: 'text-teal',
    coral: 'text-coral',
  }

  return (
    <section className={`reveal rounded-2xl border px-6 py-5 space-y-2 ${tones[tone]}`}>
      {title && (
        <p className={`font-mono uppercase text-xs tracking-widest ${labels[tone]}`}>{title}</p>
      )}
      <div className="text-sm text-ink leading-relaxed space-y-2">{children}</div>
    </section>
  )
}
