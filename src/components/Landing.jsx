import { Link } from 'react-router-dom'
import useReveal from '../useReveal'
import { useLang } from '../prefs'
import useSavedCount from '../useSavedCount'

/* Positioned in the outer margins only, and hidden until the viewport is wide enough to
   actually have margins — otherwise they collide with the headline. */
const CONFUSION_BUBBLES = [
  { text: 'Science or Commerce?', top: '5%', left: '1%', duration: '15s', delay: '0s', rest: '-6deg' },
  { text: 'Engineering or Design?', top: '17%', right: '0.5%', duration: '18s', delay: '1.5s', rest: '5deg' },
  { text: 'Which exam?', top: '46%', left: '2%', duration: '13s', delay: '3s', rest: '4deg' },
  { text: 'What should I do?', top: '58%', right: '2%', duration: '17s', delay: '0.8s', rest: '-3deg' },
  { text: 'Which stream?', top: '30%', left: '0.5%', duration: '16s', delay: '2.2s', rest: '2deg' },
]

const HOW_IT_WORKS = [
  { step: '01', title: 'landing.how1t', detail: 'landing.how1d' },
  { step: '02', title: 'landing.how2t', detail: 'landing.how2d' },
  { step: '03', title: 'landing.how3t', detail: 'landing.how3d' },
]

function CompassIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M15.4 8.6l-2 4.8-4.8 2 2-4.8 4.8-2z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function FlagIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
      <path d="M6 21V4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path
        d="M6 4.5h9.5l-1.8 3.4 1.8 3.4H6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="choice-arrow h-4 w-4" aria-hidden="true">
      <path
        d="M5 12h13m0 0l-5-5m5 5l-5 5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function Landing({ onPick }) {
  const revealRef = useReveal()
  const { t } = useLang()
  const savedCount = useSavedCount()

  return (
    <main ref={revealRef} className="relative overflow-hidden px-6 pt-10 pb-20">
      <div
        className="hero-glow"
        style={{
          top: '-6rem',
          left: '8%',
          width: '26rem',
          height: '26rem',
          background: 'radial-gradient(circle, rgba(232,121,46,0.30), transparent 70%)',
        }}
      />
      <div
        className="hero-glow"
        style={{
          top: '6rem',
          right: '4%',
          width: '24rem',
          height: '24rem',
          background: 'radial-gradient(circle, rgba(47,111,94,0.24), transparent 70%)',
          animationDelay: '-8s',
        }}
      />

      <div className="absolute inset-0 pointer-events-none hidden xl:block">
        {CONFUSION_BUBBLES.map((bubble, i) => (
          <span
            key={bubble.text}
            className="confusion-bubble fade-in absolute rounded-full bg-ink-soft/5 text-ink-soft/40 font-mono text-xs px-4 py-2 whitespace-nowrap"
            style={{
              top: bubble.top,
              left: bubble.left,
              right: bubble.right,
              animationDelay: `${i * 120}ms`,
              '--duration': bubble.duration,
              '--delay': bubble.delay,
              '--rest-r': bubble.rest,
            }}
          >
            {bubble.text}
          </span>
        ))}
      </div>

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <p
          className="rise font-mono uppercase text-xs tracking-widest text-ink-soft"
          style={{ '--i': 0 }}
        >
          {t('landing.eyebrow')}
        </p>

        <h1 className="mt-6 font-display font-semibold text-4xl sm:text-5xl leading-tight">
          <span className="rise block text-ink" style={{ '--i': 1 }}>
            {t('landing.h1a')}
          </span>
          <span className="rise block text-saffron" style={{ '--i': 2 }}>
            {t('landing.h1b')}
          </span>
        </h1>

        <p
          className="rise mt-6 text-ink-soft max-w-xl mx-auto leading-relaxed"
          style={{ '--i': 3 }}
        >
          {t('landing.intro')}
        </p>

        <div className="mt-10 grid sm:grid-cols-2 gap-4 text-left">
          <button
            type="button"
            onClick={() => onPick('forward')}
            style={{ '--i': 4 }}
            className="choice-card rise lift press group rounded-2xl border border-saffron/25 bg-saffron-soft/70 p-6 text-left hover:border-saffron/50"
          >
            <span className="flex items-center justify-between text-saffron">
              <CompassIcon />
              <span className="font-mono text-[0.65rem] uppercase tracking-widest text-ink-soft">
                {t('landing.fwdTag')}
              </span>
            </span>
            <span className="mt-4 block font-display font-semibold text-lg text-ink">
              {t('landing.fwdTitle')}
            </span>
            <span className="mt-1.5 block text-sm text-ink-soft leading-relaxed">
              {t('landing.fwdBody')}
            </span>
            <span className="mt-4 flex items-center gap-1.5 font-medium text-sm text-saffron">
              {t('landing.fwdCta')} <ArrowIcon />
            </span>
          </button>

          <button
            type="button"
            onClick={() => onPick('reverse')}
            style={{ '--i': 5 }}
            className="choice-card rise lift press group rounded-2xl border border-teal/25 bg-teal-soft/70 p-6 text-left hover:border-teal/50"
          >
            <span className="flex items-center justify-between text-teal">
              <FlagIcon />
              <span className="font-mono text-[0.65rem] uppercase tracking-widest text-ink-soft">
                {t('landing.revTag')}
              </span>
            </span>
            <span className="mt-4 block font-display font-semibold text-lg text-ink">
              {t('landing.revTitle')}
            </span>
            <span className="mt-1.5 block text-sm text-ink-soft leading-relaxed">
              {t('landing.revBody')}
            </span>
            <span className="mt-4 flex items-center gap-1.5 font-medium text-sm text-teal">
              {t('landing.revCta')} <ArrowIcon />
            </span>
          </button>
        </div>

        <p className="rise mt-6 font-mono text-xs text-ink-soft" style={{ '--i': 6 }}>
          {t('landing.noSignup')}
        </p>

        {savedCount > 0 && (
          <p className="rise mt-4 text-sm text-ink-soft" style={{ '--i': 6 }}>
            {t('landing.savedCount', { count: savedCount })}{' '}
            <Link
              to="/saved"
              className="choice-card inline-flex items-center gap-1 font-medium text-saffron underline underline-offset-4 decoration-saffron/30 hover:decoration-saffron"
            >
              {t('landing.savedOpen')} <ArrowIcon />
            </Link>
          </p>
        )}

        <p className="rise mt-8 text-sm text-ink-soft" style={{ '--i': 7 }}>
          {t('landing.stuck')}{' '}
          <Link
            to="/compare"
            className="choice-card inline-flex items-center gap-1 font-medium text-teal underline underline-offset-4 decoration-teal/30 hover:decoration-teal"
          >
            {t('landing.compareLink')} <ArrowIcon />
          </Link>
        </p>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto mt-20">
        <div className="flex items-center gap-4">
          <span className="h-px flex-1 bg-line" />
          <span className="font-mono uppercase text-xs tracking-widest text-ink-soft">
            {t('landing.how')}
          </span>
          <span className="h-px flex-1 bg-line" />
        </div>

        <div className="relative mt-10">
          {/* A strip of road joining the three stops — sideways on wide screens, down the
              left edge on phones. */}
          <span
            aria-hidden="true"
            className="mini-road absolute hidden sm:block left-[8%] right-[8%] top-[1.05rem] h-2.5 rounded-full"
          />
          <span
            aria-hidden="true"
            className="absolute sm:hidden left-[1.05rem] top-4 bottom-4 w-2.5 rounded-full bg-[var(--color-road)]"
          />

          <ol className="relative grid sm:grid-cols-3 gap-8 sm:gap-6">
            {HOW_IT_WORKS.map((item, i) => (
              <li
                key={item.step}
                className="reveal flex gap-4 sm:block sm:text-center"
                style={{ '--i': i }}
              >
                <span className="relative z-10 flex h-[2.6rem] w-[2.6rem] shrink-0 items-center justify-center rounded-full bg-saffron font-mono text-sm font-medium text-paper shadow-[0_0_0_4px_var(--color-paper)] sm:mx-auto">
                  {item.step}
                </span>
                <div>
                  <h2 className="font-display font-semibold text-ink sm:mt-4">{t(item.title)}</h2>
                  <p className="mt-1.5 text-sm text-ink-soft leading-relaxed">{t(item.detail)}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </main>
  )
}
