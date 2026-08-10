import { useEffect, useState } from 'react'

const MESSAGES = [
  'Reading your answers…',
  'Mapping streams and entrance exams…',
  'Checking realistic timelines…',
  'Laying out your steps…',
]

export default function Loading({ flow }) {
  const [index, setIndex] = useState(0)
  const accent = flow === 'reverse' ? 'var(--color-teal)' : 'var(--color-saffron)'

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1 < MESSAGES.length ? prev + 1 : prev))
    }, 2200)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="max-w-2xl mx-auto px-6 py-24 flex flex-col items-center text-center">
      <svg viewBox="0 0 200 90" className="w-56 h-24" aria-hidden="true">
        <path
          d="M14 68 C 52 68, 46 22, 84 22 S 138 68, 186 30"
          fill="none"
          stroke="var(--color-line)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          className="route-line"
          d="M14 68 C 52 68, 46 22, 84 22 S 138 68, 186 30"
          fill="none"
          stroke={accent}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {[
          [14, 68],
          [84, 22],
          [186, 30],
        ].map(([cx, cy], i) => (
          <circle
            key={cx}
            className="route-pin"
            cx={cx}
            cy={cy}
            r="5"
            fill={accent}
            style={{ '--i': i }}
          />
        ))}
      </svg>

      <p className="mt-6 font-display font-semibold text-xl text-ink" aria-live="polite">
        Building your roadmap
      </p>

      <p key={index} className="fade-in mt-3 font-mono text-sm text-ink-soft">
        {MESSAGES[index]}
      </p>
    </div>
  )
}
