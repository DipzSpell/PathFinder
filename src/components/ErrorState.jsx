import { useLang } from '../prefs'

export default function ErrorState({ message, onRetry, onRestart }) {
  const { t } = useLang()

  return (
    <div className="max-w-xl mx-auto px-6 py-24 space-y-6 text-center">
      <p className="font-mono uppercase text-xs tracking-widest text-coral">
        {t('error.eyebrow')}
      </p>

      <h1 className="font-display font-semibold text-3xl text-ink">
        {t('error.title')}
      </h1>

      <p className="rounded-2xl border border-coral/25 bg-coral-soft px-5 py-4 text-sm text-ink-soft">
        {message || t('error.fallback')}
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
        <button
          type="button"
          onClick={onRetry}
          className="press rounded-full bg-ink text-paper font-display font-semibold px-7 py-3 transition-all hover:bg-ink/90 hover:shadow-lift"
        >
          {t('error.retry')}
        </button>
        <button
          type="button"
          onClick={onRestart}
          className="press rounded-full border border-line text-ink-soft font-medium px-7 py-3 transition-colors hover:border-ink/40 hover:text-ink"
        >
          {t('error.restart')}
        </button>
      </div>
    </div>
  )
}
