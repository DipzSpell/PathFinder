import { NavLink } from 'react-router-dom'

const LINKS = [
  { to: '/about', label: 'About' },
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/terms', label: 'Terms & Conditions' },
  { to: '/contact', label: 'Contact' },
]

export default function Footer() {
  return (
    <footer className="app-footer mt-20 border-t border-line/70 px-6 py-10">
      <div className="max-w-2xl mx-auto flex flex-col items-center gap-5 text-center">
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm transition-colors ${
                  isActive ? 'text-ink font-medium' : 'text-ink-soft hover:text-ink'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <span className="font-mono text-xs text-ink-soft">
          PathFinder — clear next steps after Class 10 &amp; 12
        </span>

        <span className="font-mono text-xs text-ink-soft/70">
          Roadmaps are AI-generated. Always confirm exam dates and eligibility on official
          sites.
        </span>
      </div>
    </footer>
  )
}
