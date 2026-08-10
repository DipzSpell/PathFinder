/**
 * Two-layer cache so repeat questions never hit the API.
 *
 *   1. seed.json  — common roadmaps/comparisons generated ahead of time and committed.
 *                   Covers most first-time visitors with zero API calls.
 *   2. localStorage — anything a visitor generates themselves, reused on their next visit.
 *
 * Both layers are age-limited. Entrance exams, cutoffs and eligibility shift every admissions
 * cycle, so serving a two-year-old roadmap forever would quietly turn this site into the exact
 * problem it exists to solve. Expired entries fall through to a fresh API call.
 */

const STORE_KEY = 'pathfinder:cache'
const SCHEMA_VERSION = 1
const MAX_ENTRIES = 80
const LOCAL_TTL_MS = 30 * 24 * 60 * 60 * 1000 // 30 days
const SEED_TTL_MS = 180 * 24 * 60 * 60 * 1000 // 6 months

function slug(value) {
  return String(value).toLowerCase().replace(/\s+/g, ' ').replace(/[^a-z0-9 &+./-]/g, '').trim()
}

export function forwardKey({ stage, interests }) {
  const list = [...(interests ?? [])].map(slug).filter(Boolean).sort().join('|')
  return `fwd:${slug(stage)}:${list || 'any'}`
}

export function reverseKey({ career }) {
  return `rev:${slug(career)}`
}

export function compareKey({ items }) {
  return `cmp:${[...items].map(slug).filter(Boolean).sort().join('|')}`
}

/* ---------- localStorage layer ---------- */

function readStore() {
  try {
    const raw = localStorage.getItem(STORE_KEY)
    if (!raw) return { version: SCHEMA_VERSION, entries: {} }
    const parsed = JSON.parse(raw)
    if (parsed?.version !== SCHEMA_VERSION) return { version: SCHEMA_VERSION, entries: {} }
    return { version: SCHEMA_VERSION, entries: parsed.entries ?? {} }
  } catch {
    return { version: SCHEMA_VERSION, entries: {} }
  }
}

function writeStore(store) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(store))
    return true
  } catch {
    return false
  }
}

function evictOldest(entries, count) {
  const byAge = Object.entries(entries).sort((a, b) => (a[1].ts ?? 0) - (b[1].ts ?? 0))
  for (const [key] of byAge.slice(0, count)) delete entries[key]
}

export function readLocal(key) {
  const { entries } = readStore()
  const hit = entries[key]
  if (!hit) return null
  if (Date.now() - (hit.ts ?? 0) > LOCAL_TTL_MS) return null
  return hit.data ?? null
}

export function writeLocal(key, data) {
  const store = readStore()
  store.entries[key] = { data, ts: Date.now() }

  const overflow = Object.keys(store.entries).length - MAX_ENTRIES
  if (overflow > 0) evictOldest(store.entries, overflow)

  // A full quota is common on shared/locked-down browsers — halve and retry once, then give up
  // quietly. Caching is an optimisation; failing to cache must never break a lookup.
  if (!writeStore(store)) {
    evictOldest(store.entries, Math.ceil(Object.keys(store.entries).length / 2))
    writeStore(store)
  }
}

export function clearLocal() {
  try {
    localStorage.removeItem(STORE_KEY)
  } catch {
    /* nothing to do */
  }
}

export function localStats() {
  const { entries } = readStore()
  return { count: Object.keys(entries).length, max: MAX_ENTRIES }
}

/* ---------- shipped seed layer ---------- */

let seedPromise = null

function loadSeed() {
  // Kept out of the initial bundle — only fetched the first time a lookup happens.
  seedPromise ??= import('./data/seed.json')
    .then((mod) => mod.default ?? mod)
    .catch(() => null)
  return seedPromise
}

export async function readSeed(key) {
  const seed = await loadSeed()
  if (!seed?.entries) return null

  const hit = seed.entries[key]
  if (!hit) return null

  const generatedAt = Date.parse(seed.generatedAt ?? '')
  if (Number.isFinite(generatedAt) && Date.now() - generatedAt > SEED_TTL_MS) return null

  return hit
}

/** localStorage first (freshest, user-specific), then the shipped seed. */
export async function readCache(key) {
  return readLocal(key) ?? (await readSeed(key))
}
