function Svg({ className = 'h-4 w-4', children }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

export function PrintIcon(props) {
  return (
    <Svg {...props}>
      <path d="M7 9V4h10v5M7 18H5a1 1 0 01-1-1v-5a2 2 0 012-2h12a2 2 0 012 2v5a1 1 0 01-1 1h-2M7 15h10v5H7v-5z" />
    </Svg>
  )
}

export function BookmarkIcon({ filled = false, ...props }) {
  return (
    <Svg {...props}>
      <path d="M7 4h10a1 1 0 011 1v15l-6-4-6 4V5a1 1 0 011-1z" fill={filled ? 'currentColor' : 'none'} />
    </Svg>
  )
}

export function ShareIcon(props) {
  return (
    <Svg {...props}>
      <path d="M12 15V4m0 0L8 8m4-4l4 4M5 13v5a2 2 0 002 2h10a2 2 0 002-2v-5" />
    </Svg>
  )
}

export function LinkIcon(props) {
  return (
    <Svg {...props}>
      <path d="M10 14a4 4 0 005.66 0l3-3a4 4 0 00-5.66-5.66l-1 1M14 10a4 4 0 00-5.66 0l-3 3a4 4 0 005.66 5.66l1-1" />
    </Svg>
  )
}

export function ChatIcon(props) {
  return (
    <Svg {...props}>
      <path d="M4.5 19.5l1.2-3.6A8 8 0 1112 20a8 8 0 01-3.9-1l-3.6.5z" />
      <path d="M9.5 9.5c0 2.5 2.5 5 5 5l1-1.3-1.8-1-.8.8c-.9-.4-1.5-1-1.9-1.9l.8-.8-1-1.8-1.3 1z" />
    </Svg>
  )
}

export function SunIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4L6 18M18 6l1.4-1.4" />
    </Svg>
  )
}

export function MoonIcon(props) {
  return (
    <Svg {...props}>
      <path d="M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z" />
    </Svg>
  )
}

export function PinIcon(props) {
  return (
    <Svg {...props}>
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0113 0c0 5.4-6.5 11-6.5 11z" />
      <circle cx="12" cy="10" r="2.3" />
    </Svg>
  )
}

export function FlagIcon(props) {
  return (
    <Svg {...props}>
      <path d="M6 21V4" />
      <path d="M6 4.5h11l-2 3.5 2 3.5H6" />
    </Svg>
  )
}

export function CheckIcon(props) {
  return (
    <Svg {...props}>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </Svg>
  )
}

export function CautionIcon(props) {
  return (
    <Svg {...props}>
      <path d="M12 3l9 9-9 9-9-9 9-9z" />
      <path d="M12 8.5v4.5M12 16h.01" />
    </Svg>
  )
}

export function TicketIcon(props) {
  return (
    <Svg {...props}>
      <path d="M4 8a2 2 0 002-2h12a2 2 0 002 2v2a2 2 0 000 4v2a2 2 0 00-2 2H6a2 2 0 00-2-2v-2a2 2 0 000-4V8z" />
      <path d="M10 6v12" strokeDasharray="2 2" />
    </Svg>
  )
}

export function TrashIcon(props) {
  return (
    <Svg {...props}>
      <path d="M5 7h14M10 7V5h4v2M7 7l1 12h8l1-12" />
    </Svg>
  )
}

export function ArrowIcon({ className = 'choice-arrow h-4 w-4' }) {
  return (
    <Svg className={className}>
      <path d="M5 12h13m0 0l-5-5m5 5l-5 5" />
    </Svg>
  )
}
