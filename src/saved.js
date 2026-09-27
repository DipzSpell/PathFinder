/**
 * Roadmaps the visitor chose to keep, with their milestone progress. Separate from the cache in
 * cache.js on purpose: the cache expires and evicts on its own, whereas a saved roadmap stays
 * until the visitor removes it.
 */

const STORE_KEY = 'pathfinder:saved'
const MAX_SAVED = 50
export const SAVED_EVENT = 'pathfinder:saved-change'

function readAll() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORE_KEY) ?? '[]')
    return Array.isArray(parsed) ? parsed.filter((entry) => entry?.id && entry?.roadmap) : []
  } catch {
    return []
  }
}

function writeAll(entries) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(entries))
    window.dispatchEvent(new Event(SAVED_EVENT))
    return true
  } catch {
    return false
  }
}

function newId() {
  try {
    return crypto.randomUUID().slice(0, 8)
  } catch {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
  }
}

/** Identifies "the same roadmap" so saving twice doesn't create duplicates. */
export function roadmapSignature({ roadmap, flow, lang }) {
  const steps = roadmap.steps.map((step) => step.title).join('|')
  return `${flow}:${lang}:${roadmap.title}:${steps}`
}

function stripTransient(roadmap) {
  const { fromCache: _fromCache, ...rest } = roadmap
  return rest
}

export function listSaved() {
  return readAll().sort((a, b) => (b.savedAt ?? 0) - (a.savedAt ?? 0))
}

export function savedCount() {
  return readAll().length
}

export function getSaved(id) {
  return readAll().find((entry) => entry.id === id) ?? null
}

export function findSaved(signature) {
  return readAll().find((entry) => entry.sig === signature) ?? null
}

export function saveRoadmap({ roadmap, flow, lang, input = null, progress = [] }) {
  const sig = roadmapSignature({ roadmap, flow, lang })
  const entries = readAll()
  const existing = entries.find((entry) => entry.sig === sig)
  if (existing) return existing

  const entry = {
    id: newId(),
    sig,
    flow,
    lang,
    input,
    roadmap: stripTransient(roadmap),
    progress,
    savedAt: Date.now(),
  }

  const next = [entry, ...entries].slice(0, MAX_SAVED)
  return writeAll(next) ? entry : null
}

export function removeSaved(id) {
  writeAll(readAll().filter((entry) => entry.id !== id))
}

export function updateProgress(id, progress) {
  const entries = readAll()
  const entry = entries.find((item) => item.id === id)
  if (!entry) return
  entry.progress = progress
  writeAll(entries)
}
