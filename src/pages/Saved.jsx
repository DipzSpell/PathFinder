import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Roadmap from '../components/Roadmap'
import { ArrowIcon, TrashIcon } from '../components/Icons'
import { useLang } from '../prefs'
import { SAVED_EVENT, getSaved, listSaved, removeSaved } from '../saved'
import useReveal from '../useReveal'

function BackTo({ to, children }) {
  return (
    <Link
      to={to}
      className="rise group inline-flex items-center gap-1.5 font-mono text-sm text-ink-soft hover:text-ink transition-colors"
    >
      <span
        aria-hidden="true"
        className="inline-block transition-transform duration-200 group-hover:-translate-x-1"
      >
        ←
      </span>
      {children}
    </Link>
  )
}

function SavedRoadmap({ id }) {
  const { t } = useLang()
  // Read once: unsaving from inside the roadmap shouldn't yank it off the screen mid-read.
  const [entry] = useState(() => getSaved(id))

  if (!entry) {
    return (
      <main className="max-w-xl mx-auto px-6 py-24 text-center space-y-6">
        <p className="rise text-ink-soft">{t('saved.missing')}</p>
        <BackTo to="/saved">{t('saved.back')}</BackTo>
      </main>
    )
  }

  return (
    <>
      <div className="no-print max-w-3xl mx-auto px-6 pt-10 -mb-8">
        <BackTo to="/saved">{t('saved.back')}</BackTo>
      </div>
      <Roadmap
        key={entry.id}
        roadmap={entry.roadmap}
        flow={entry.flow}
        lang={entry.lang}
        input={entry.input}
      />
    </>
  )
}

function SavedList() {
  const { t, lang } = useLang()
  const navigate = useNavigate()
  const [entries, setEntries] = useState(listSaved)
  const revealRef = useReveal([entries.length])

  useEffect(() => {
    const refresh = () => setEntries(listSaved())
    window.addEventListener(SAVED_EVENT, refresh)
    window.addEventListener('storage', refresh)
    return () => {
      window.removeEventListener(SAVED_EVENT, refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [])

  const dateFormat = new Intl.DateTimeFormat(lang === 'hi' ? 'hi-IN' : 'en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  return (
    <main ref={revealRef} className="max-w-2xl mx-auto px-6 py-16">
      <BackTo to="/">{t('common.backHome')}</BackTo>

      <header className="mt-10 space-y-4">
        <p className="rise font-mono uppercase text-xs tracking-widest text-saffron">
          {t('saved.eyebrow')}
        </p>
        <h1
          className="rise font-display font-semibold text-3xl sm:text-4xl leading-tight text-ink"
          style={{ '--i': 1 }}
        >
          {t('saved.title')}
        </h1>
        <span className="rise block h-1 w-14 rounded-full bg-saffron" style={{ '--i': 2 }} />
        <p className="rise text-ink-soft leading-relaxed" style={{ '--i': 3 }}>
          {t('saved.intro')}
        </p>
      </header>

      {entries.length === 0 ? (
        <div
          className="rise mt-12 rounded-2xl border border-dashed border-line px-6 py-12 text-center space-y-3"
          style={{ '--i': 4 }}
        >
          <p className="font-display font-semibold text-lg text-ink">{t('saved.empty')}</p>
          <p className="text-sm text-ink-soft">{t('saved.emptyBody')}</p>
          <Link
            to="/"
            state={{ reset: Date.now() }}
            className="press mt-3 inline-block rounded-full bg-ink text-paper font-display font-semibold px-6 py-2.5 transition-colors hover:bg-ink/90"
          >
            {t('saved.emptyCta')}
          </Link>
        </div>
      ) : (
        <ul className="mt-12 space-y-4">
          {entries.map((entry, i) => {
            const total = entry.roadmap.steps?.length ?? 0
            const doneCount = (entry.progress ?? []).filter((n) => n < total).length
            const pct = total ? Math.round((doneCount / total) * 100) : 0
            const accent = entry.flow === 'reverse' ? 'bg-teal' : 'bg-saffron'

            return (
              <li
                key={entry.id}
                className="reveal lift group relative rounded-2xl border border-line bg-paper-raised p-5 shadow-card"
                style={{ '--i': i }}
              >
                <button
                  type="button"
                  onClick={() => navigate(`/saved/${entry.id}`)}
                  className="block w-full text-left"
                >
                  <span className="flex flex-wrap items-center gap-x-3 gap-y-1 pr-10 font-mono text-xs text-ink-soft">
                    <span className={`h-2 w-2 rounded-full ${accent}`} aria-hidden="true" />
                    <span>{entry.flow === 'reverse' ? t('roadmap.revFlow') : t('roadmap.fwdFlow')}</span>
                    <span>·</span>
                    <span>{t('saved.on', { date: dateFormat.format(entry.savedAt) })}</span>
                    {entry.lang === 'hi' && <span className="rounded bg-ink/5 px-1.5">हि</span>}
                  </span>
                  <span className="mt-2 block font-display font-semibold text-lg text-ink leading-snug">
                    {entry.roadmap.title}
                  </span>
                  <span className="mt-3 flex items-center gap-3">
                    <span className="h-1.5 flex-1 rounded-full bg-line overflow-hidden">
                      <span
                        className={`block h-full rounded-full ${accent}`}
                        style={{ width: `${pct}%` }}
                      />
                    </span>
                    <span className="font-mono text-xs text-ink-soft">
                      {t('saved.progress', { done: doneCount, total })}
                    </span>
                  </span>
                  <span className="choice-card mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink">
                    {t('saved.open')} <ArrowIcon />
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => removeSaved(entry.id)}
                  aria-label={t('saved.removeAria', { title: entry.roadmap.title })}
                  title={t('saved.remove')}
                  className="press absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-coral-soft hover:text-coral"
                >
                  <TrashIcon />
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </main>
  )
}

export default function Saved() {
  const { id } = useParams()
  return id ? <SavedRoadmap id={id} /> : <SavedList />
}
