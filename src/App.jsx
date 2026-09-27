import { useEffect } from 'react'
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import logoSaffron from './assets/logo-saffron.png'
import Footer from './components/Footer'
import { BookmarkIcon, MoonIcon, SunIcon } from './components/Icons'
import Home from './pages/Home'
import Compare from './pages/Compare'
import Saved from './pages/Saved'
import SharedRoadmap from './pages/SharedRoadmap'
import About from './pages/About'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import { useLang, useTheme } from './prefs'
import useSavedCount from './useSavedCount'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

const navClass = ({ isActive }) =>
  `inline-flex items-center gap-1.5 rounded-full border px-3 sm:px-4 py-1.5 text-sm transition-colors ${
    isActive
      ? 'border-teal bg-teal-soft text-teal font-medium'
      : 'border-line text-ink-soft hover:border-teal/50 hover:text-ink'
  }`

const iconButtonClass =
  'press inline-flex h-8 min-w-8 items-center justify-center rounded-full border border-line px-2 text-sm text-ink-soft transition-colors hover:border-ink/40 hover:text-ink'

function App() {
  const { lang, setLang, t } = useLang()
  const { theme, toggleTheme } = useTheme()
  const savedCount = useSavedCount()

  return (
    <div className="app-shell min-h-screen flex flex-col">
      <ScrollToTop />

      <header className="app-header sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-line/60 bg-paper/80 px-4 sm:px-6 py-3.5 backdrop-blur-md">
        <Link
          to="/"
          state={{ reset: Date.now() }}
          className="group flex items-center gap-2"
          aria-label={t('nav.home')}
        >
          <img
            src={logoSaffron}
            alt=""
            className="h-7 w-auto transition-transform duration-300 group-hover:-rotate-12"
          />
          <span className="hidden min-[380px]:inline font-display font-semibold text-lg text-ink">
            PathFinder
          </span>
        </Link>

        <nav className="flex items-center gap-1.5 sm:gap-2">
          <NavLink to="/saved" className={navClass} aria-label={t('nav.saved')}>
            <BookmarkIcon filled={savedCount > 0} className="h-4 w-4" />
            <span className="hidden sm:inline">{t('nav.saved')}</span>
            {savedCount > 0 && (
              <span className="font-mono text-xs tabular-nums">{savedCount}</span>
            )}
          </NavLink>

          <NavLink to="/compare" className={navClass}>
            {t('nav.compare')}
          </NavLink>

          <button
            type="button"
            onClick={() => setLang(lang === 'hi' ? 'en' : 'hi')}
            aria-label={t('toggle.lang')}
            title={t('toggle.lang')}
            className={`${iconButtonClass} font-medium`}
          >
            {t('toggle.langShort')}
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? t('toggle.light') : t('toggle.dark')}
            title={theme === 'dark' ? t('toggle.light') : t('toggle.dark')}
            className={iconButtonClass}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
        </nav>
      </header>

      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/saved/:id" element={<Saved />} />
          <Route path="/r" element={<SharedRoadmap />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      <Footer />
    </div>
  )
}

export default App
