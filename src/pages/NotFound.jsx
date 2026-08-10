import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main className="max-w-xl mx-auto px-6 py-24 text-center space-y-6">
      <p className="rise font-mono uppercase text-xs tracking-widest text-saffron">404</p>
      <h1
        className="rise font-display font-semibold text-3xl sm:text-4xl text-ink"
        style={{ '--i': 1 }}
      >
        This path doesn&rsquo;t exist.
      </h1>
      <p className="rise text-ink-soft leading-relaxed" style={{ '--i': 2 }}>
        Ironic, for a site about finding the right route. The page you were looking for
        isn&rsquo;t here.
      </p>
      <Link
        to="/"
        state={{ reset: Date.now() }}
        style={{ '--i': 3 }}
        className="rise press inline-block rounded-full bg-ink text-paper font-display font-semibold px-7 py-3 transition-all hover:bg-ink/90 hover:shadow-lift"
      >
        Back to the start
      </Link>
    </main>
  )
}
