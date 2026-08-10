const ROWS = [
  { key: 'kind', label: 'Type' },
  { key: 'duration', label: 'Duration' },
  { key: 'eligibility', label: 'Eligibility' },
  { key: 'entranceExams', label: 'Entrance exams', type: 'list' },
  { key: 'studyFocus', label: 'What you study' },
  { key: 'startingSalary', label: 'Starting salary', type: 'salary' },
  { key: 'experiencedSalary', label: 'After 5–8 years', type: 'salary' },
  { key: 'topRoles', label: 'Common roles', type: 'list' },
  { key: 'higherStudies', label: 'Higher studies' },
  { key: 'bestFor', label: 'Best suited to' },
  { key: 'watchOut', label: 'Watch out for', type: 'warn' },
]

function Cell({ row, value }) {
  if (row.type === 'list') {
    if (!value?.length) return <span className="text-ink-soft/60">—</span>
    return (
      <div className="flex flex-wrap gap-1.5">
        {value.map((entry) => (
          <span
            key={entry}
            className="rounded-full border border-line bg-paper px-2.5 py-1 font-mono text-[0.7rem] text-ink-soft"
          >
            {entry}
          </span>
        ))}
      </div>
    )
  }

  if (row.type === 'salary') {
    return <span className="font-display font-semibold text-ink">{value}</span>
  }

  if (row.type === 'warn') {
    return <span className="text-coral">{value}</span>
  }

  if (row.key === 'kind') {
    return (
      <span className="inline-block rounded-full bg-ink/5 px-2.5 py-1 font-mono text-[0.7rem] uppercase tracking-wide text-ink-soft">
        {value}
      </span>
    )
  }

  return <span>{value}</span>
}

export default function ComparisonTable({ items }) {
  // The per-column minimum is what forces a horizontal scroll on narrow screens; the grid
  // itself must stay at container width, or max-content sizing blows every column up.
  const columns = `minmax(7rem, 9rem) repeat(${items.length}, minmax(13rem, 1fr))`

  return (
    <div className="compare-scroll -mx-6 overflow-x-auto px-6 pb-2">
      <div className="compare-grid" style={{ '--n': items.length }}>
        <div className="grid gap-px" style={{ gridTemplateColumns: columns }}>
          <div className="compare-corner sticky left-0 z-10 bg-paper" />
          {items.map((item) => (
            <div key={item.name} className="rounded-t-2xl bg-paper-raised px-5 pt-5 pb-4">
              <p className="font-display font-semibold text-lg text-ink leading-tight">
                {item.name}
              </p>
              {item.fullName && item.fullName !== item.name && (
                <p className="mt-1 text-xs text-ink-soft leading-snug">{item.fullName}</p>
              )}
            </div>
          ))}
        </div>

        {ROWS.map((row, rowIndex) => (
          <div
            key={row.key}
            className="compare-row grid gap-px"
            style={{ gridTemplateColumns: columns }}
          >
            <div
              className={`compare-label sticky left-0 z-10 bg-paper py-4 pr-4 font-mono text-xs uppercase tracking-widest text-ink-soft ${
                rowIndex === 0 ? '' : 'border-t border-line/70'
              }`}
            >
              {row.label}
            </div>
            {items.map((item) => (
              <div
                key={item.name}
                className={`bg-paper-raised px-5 py-4 text-sm leading-relaxed text-ink-soft ${
                  rowIndex === 0 ? '' : 'border-t border-line/70'
                } ${rowIndex === ROWS.length - 1 ? 'rounded-b-2xl' : ''}`}
              >
                <Cell row={row} value={item[row.key]} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
