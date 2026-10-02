export default function ProgressBar({
  value = 0,
  max = 100,
  size = 'md',
  color,
  segments,
  className = '',
  barClassName = '',
  ariaLabel,
  summary,
}) {
  const numericValue = typeof value === 'number' && !Number.isNaN(value) ? value : 0
  const numericMax = typeof max === 'number' && max > 0 ? max : 100
  const pct = Math.round(Math.min(100, Math.max(0, (numericValue / numericMax) * 100)))

  const heightClass =
    {
      xs: 'h-1',
      sm: 'h-1.5',
      md: 'h-2.5',
      lg: 'h-3.5',
    }[size] || 'h-2.5'

  const bar = (
    <div
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={ariaLabel || (typeof summary === 'string' ? summary : `${pct}% completed`)}
      className={`relative w-full overflow-hidden rounded-full bg-line/80 ${heightClass} ${className}`}
    >
      <div
        className={`progress-fill h-full rounded-full ${barClassName}`}
        style={{
          width: `${pct}%`,
          transition: 'width 0.65s cubic-bezier(0.16, 1, 0.3, 1)',
          willChange: 'width',
          ...(color ? { backgroundColor: color } : {}),
        }}
      />
      {segments && segments > 1 && (
        <div
          className="pointer-events-none absolute inset-0 flex"
          aria-hidden="true"
        >
          {Array.from({ length: segments - 1 }).map((_, i) => (
            <div
              key={i}
              className="absolute top-0 bottom-0 w-0.5 -ml-[1px] bg-paper/70 transition-opacity"
              style={{ left: `${((i + 1) / segments) * 100}%` }}
            />
          ))}
        </div>
      )}
    </div>
  )

  if (!summary) return bar

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
      <div className="flex-1 min-w-0">{bar}</div>
      <span className="shrink-0 font-mono text-xs sm:text-sm font-medium text-ink tabular-nums">
        {typeof summary === 'string' ? summary : `${numericValue} of ${numericMax} steps completed`}
      </span>
    </div>
  )
}
