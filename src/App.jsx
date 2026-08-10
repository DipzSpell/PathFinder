import { useEffect } from 'react'
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import logoSaffron from './assets/logo-saffron.png'
import Footer from './components/Footer'
import Home from './pages/Home'
import Compare from './pages/Compare'
import About from './pages/About'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

function App() {
  return (
    <div className="app-shell min-h-screen flex flex-col">
      <ScrollToTop />

      <header className="app-header sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-line/60 bg-paper/80 px-6 py-4 backdrop-blur-md">
        <Link
          to="/"
          state={{ reset: Date.now() }}
          className="group flex items-center gap-2"
          aria-label="PathFinder home"
        >
          <img
            src={logoSaffron}
            alt=""
            className="h-7 w-auto transition-transform duration-300 group-hover:-rotate-12"
          />
          <span className="font-display font-semibold text-lg text-ink">PathFinder</span>
        </Link>

        <NavLink
          to="/compare"
          className={({ isActive }) =>
            `rounded-full border px-4 py-1.5 text-sm transition-colors ${
              isActive
                ? 'border-teal bg-teal-soft text-teal font-medium'
                : 'border-line text-ink-soft hover:border-teal/50 hover:text-ink'
            }`
          }
        >
          Compare
        </NavLink>
      </header>

      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/compare" element={<Compare />} />
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
