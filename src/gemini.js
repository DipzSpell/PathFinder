import {
  COMPARE_SYSTEM,
  ROADMAP_SYSTEM,
  comparePrompt,
  forwardPrompt,
  reversePrompt,
} from './prompts'
import { normalizeComparison, normalizeRoadmap } from './normalize'
import { compareKey, forwardKey, readCache, reverseKey, writeLocal } from './cache'

const TIMEOUT_MS = 30000

function stripMarkdownFences(text) {
  return text.trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '')
}

async function callGemini(systemInstruction, userPrompt, signal) {
  const timeout = new AbortController()
  const timer = setTimeout(() => timeout.abort(), TIMEOUT_MS)
  signal?.addEventListener('abort', () => timeout.abort(), { once: true })

  let response
  try {
    response = await fetch('/api/gemini/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ systemInstruction, userPrompt }),
      signal: timeout.signal,
    })
  } catch (err) {
    if (signal?.aborted) throw err
    if (err.name === 'AbortError') {
      throw new Error('That took too long to come back. Check your connection and try again.')
    }
    throw new Error('Could not reach the roadmap service. Check your connection and try again.')
  } finally {
    clearTimeout(timer)
  }

  if (!response.ok) {
    const detail = await response.json().catch(() => ({}))
    if (response.status === 429) {
      throw new Error('Too many requests right now. Wait a moment and try again.')
    }
    throw new Error(detail.error || `Roadmap service failed (${response.status}).`)
  }

  const data = await response.json()
  const rawText = data?.text
  if (!rawText) {
    throw new Error('The roadmap service returned an empty response. Try again.')
  }

  try {
    return typeof rawText === 'object' ? rawText : JSON.parse(stripMarkdownFences(rawText))
  } catch {
    throw new Error('The roadmap came back in an unreadable format. Try again.')
  }
}

/**
 * Cache lookup, then API. A cache miss is never fatal — any storage problem just means we
 * fetch as normal.
 */
async function cached(key, produce) {
  try {
    const hit = await readCache(key)
    if (hit) return { ...hit, fromCache: true }
  } catch {
    /* fall through to a live request */
  }

  const data = await produce()
  try {
    writeLocal(key, data)
  } catch {
    /* caching is best-effort */
  }
  return data
}

/** English keys are unprefixed so they keep matching the shipped seed, which is English-only. */
function langKey(key, lang) {
  return lang === 'hi' ? `hi:${key}` : key
}

export function getForwardRoadmap({ stage, interests, lang }, signal) {
  return cached(langKey(forwardKey({ stage, interests }), lang), async () =>
    normalizeRoadmap(
      await callGemini(ROADMAP_SYSTEM, forwardPrompt({ stage, interests, lang }), signal),
    ),
  )
}

export function getReverseRoadmap({ career, lang }, signal) {
  return cached(langKey(reverseKey({ career }), lang), async () =>
    normalizeRoadmap(await callGemini(ROADMAP_SYSTEM, reversePrompt({ career, lang }), signal)),
  )
}

export function getComparison({ items, lang }, signal) {
  return cached(langKey(compareKey({ items }), lang), async () =>
    normalizeComparison(
      await callGemini(COMPARE_SYSTEM, comparePrompt({ items, lang }), signal),
      items,
    ),
  )
}
