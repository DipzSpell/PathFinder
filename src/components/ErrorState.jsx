export default function ErrorState({ message, onRetry, onRestart }) {
  return (
    <div className="max-w-xl mx-auto px-6 py-24 space-y-6 text-center">
      <p className="font-mono uppercase text-xs tracking-widest text-coral">
        that didn&rsquo;t work
      </p>

      <h1 className="font-display font-semibold text-3xl text-ink">
        We couldn&rsquo;t build your roadmap.
      </h1>

      <p className="rounded-2xl border border-coral/25 bg-coral-soft px-5 py-4 text-sm text-ink-soft">
        {message || 'Something went wrong on the way to the roadmap service.'}
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
        <button
          type="button"
          onClick={onRetry}
          className="press rounded-full bg-ink text-paper font-display font-semibold px-7 py-3 transition-all hover:bg-ink/90 hover:shadow-lift"
        >
          Try again
        </button>
        <button
          type="button"
          onClick={onRestart}
          className="press rounded-full border border-line text-ink-soft font-medium px-7 py-3 transition-colors hover:border-ink/40 hover:text-ink"
        >
          Start over
        </button>
      </div>
    </div>
  )
}
