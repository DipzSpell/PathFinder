import { NavLink } from 'react-router-dom'
import { useLang } from '../prefs'

const LINKS = [
  { to: '/about', label: 'footer.about' },
  { to: '/privacy', label: 'footer.privacy' },
  { to: '/terms', label: 'footer.terms' },
  { to: '/contact', label: 'footer.contact' },
]

export default function Footer() {
  const { t } = useLang()

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
              {t(link.label)}
            </NavLink>
          ))}
        </nav>

        <span className="font-mono text-xs text-ink-soft">
          {t('footer.tagline')}
        </span>

        <span className="font-mono text-xs text-ink-soft/70">
          {t('footer.disclaimer')}
        </span>
      </div>
    </footer>
  )
}
