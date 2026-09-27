import { Link } from 'react-router-dom'
import { useLang } from '../prefs'

export default function NotFound() {
  const { t } = useLang()

  return (
    <main className="max-w-xl mx-auto px-6 py-24 text-center space-y-6">
      <p className="rise font-mono uppercase text-xs tracking-widest text-saffron">404</p>
      <h1
        className="rise font-display font-semibold text-3xl sm:text-4xl text-ink"
        style={{ '--i': 1 }}
      >
        {t('notfound.title')}
      </h1>
      <p className="rise text-ink-soft leading-relaxed" style={{ '--i': 2 }}>
        {t('notfound.body')}
      </p>
      <Link
        to="/"
        state={{ reset: Date.now() }}
        style={{ '--i': 3 }}
        className="rise press inline-block rounded-full bg-ink text-paper font-display font-semibold px-7 py-3 transition-all hover:bg-ink/90 hover:shadow-lift"
      >
        {t('notfound.cta')}
      </Link>
    </main>
  )
}
