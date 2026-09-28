import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Loading from '../components/Loading'
import Roadmap from '../components/Roadmap'
import { useLang } from '../prefs'
import { decodeShare } from '../share'

export default function SharedRoadmap() {
  const { t } = useLang()
  const { hash } = useLocation()
  const navigate = useNavigate()
  const [state, setState] = useState({ status: 'loading' })

  useEffect(() => {
    let alive = true
    decodeShare(hash.slice(1))
      .then((data) => alive && setState({ status: 'ready', ...data }))
      .catch(() => alive && setState({ status: 'error' }))
    return () => {
      alive = false
    }
  }, [hash])

  if (state.status === 'loading') return <Loading />

  if (state.status === 'error') {
    return (
      <main className="max-w-xl mx-auto px-6 py-24 text-center space-y-6">
        <p className="rise font-mono uppercase text-xs tracking-widest text-coral">
          {t('shared.eyebrow')}
        </p>
        <h1 className="rise font-display font-semibold text-3xl text-ink" style={{ '--i': 1 }}>
          {t('shared.bad')}
        </h1>
        <p className="rise text-ink-soft leading-relaxed" style={{ '--i': 2 }}>
          {t('shared.badBody')}
        </p>
        <Link
          to="/"
          state={{ reset: Date.now() }}
          style={{ '--i': 3 }}
          className="rise press inline-block rounded-full bg-ink text-paper font-display font-semibold px-7 py-3 transition-colors hover:bg-ink/90"
        >
          {t('shared.makeOwn')}
        </Link>
      </main>
    )
  }

  return (
    <Roadmap
      key={hash}
      roadmap={state.roadmap}
      flow={state.flow}
      lang={state.lang}
      eyebrow={t('shared.eyebrow')}
      onRestart={() => navigate('/', { state: { reset: Date.now() } })}
      restartLabel={t('shared.makeOwn')}
    />
  )
}
