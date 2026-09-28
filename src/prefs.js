import { createContext, useContext } from 'react'
import { STRINGS } from './strings'

/**
 * Per-device preferences (language and colour theme). Both are remembered in localStorage and
 * mirrored onto <html> — `lang` for screen readers and fonts, `data-theme` for the CSS tokens.
 * index.html applies the stored theme before first paint so dark mode never flashes white.
 */

export const LANG_KEY = 'pathfinder:lang'
export const THEME_KEY = 'pathfinder:theme'
export const LANGS = ['en', 'hi']

export function readPref(key) {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

export function writePref(key, value) {
  try {
    localStorage.setItem(key, value)
  } catch {
    /* private mode or blocked storage — the choice just won't persist */
  }
}

export function initialLang() {
  const stored = readPref(LANG_KEY)
  return LANGS.includes(stored) ? stored : 'en'
}

export function initialTheme() {
  const stored = readPref(THEME_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

export function translate(lang, key, vars) {
  const template = STRINGS[lang]?.[key] ?? STRINGS.en[key] ?? key
  if (!vars) return template
  return template.replace(/\{(\w+)\}/g, (match, name) => (name in vars ? vars[name] : match))
}

export const LangContext = createContext({
  lang: 'en',
  setLang: () => {},
  t: (key, vars) => translate('en', key, vars),
})

export const ThemeContext = createContext({ theme: 'light', toggleTheme: () => {} })

export function useLang() {
  return useContext(LangContext)
}

export function useTheme() {
  return useContext(ThemeContext)
}
