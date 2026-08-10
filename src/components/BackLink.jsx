export default function BackLink({ onBack }) {
  return (
    <button
      type="button"
      onClick={onBack}
      className="rise group inline-flex items-center gap-1.5 font-mono text-sm text-ink-soft hover:text-ink transition-colors"
    >
      <span
        aria-hidden="true"
        className="inline-block transition-transform duration-200 group-hover:-translate-x-1"
      >
        ←
      </span>
      back
    </button>
  )
}
