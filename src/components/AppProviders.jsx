import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  LANG_KEY,
  LangContext,
  THEME_KEY,
  ThemeContext,
  initialLang,
  initialTheme,
  translate,
  writePref,
} from '../prefs'

export default function AppProviders({ children }) {
  const [lang, setLangState] = useState(initialLang)
  const [theme, setTheme] = useState(initialTheme)

  useEffect(() => {
    document.documentElement.lang = lang === 'hi' ? 'hi' : 'en'
  }, [lang])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  const setLang = useCallback((next) => {
    setLangState(next)
    writePref(LANG_KEY, next)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark'
      writePref(THEME_KEY, next)
      return next
    })
  }, [])

  const langValue = useMemo(
    () => ({ lang, setLang, t: (key, vars) => translate(lang, key, vars) }),
    [lang, setLang],
  )
  const themeValue = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme])

  return (
    <ThemeContext.Provider value={themeValue}>
      <LangContext.Provider value={langValue}>{children}</LangContext.Provider>
    </ThemeContext.Provider>
  )
}
