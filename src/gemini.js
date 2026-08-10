import {
  COMPARE_SYSTEM,
  ROADMAP_SYSTEM,
  comparePrompt,
  forwardPrompt,
  reversePrompt,
} from './prompts'
import { normalizeComparison, normalizeRoadmap } from './normalize'
import { compareKey, forwardKey, readCache, reverseKey, writeLocal } from './cache'

const MODEL = 'gemini-flash-lite-latest'
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`
const TIMEOUT_MS = 30000

function buildRequestBody(systemInstruction, userPrompt) {
  return {
    systemInstruction: {
      role: 'system',
      parts: [{ text: systemInstruction }],
    },
    contents: [
      {
        role: 'user',
        parts: [{ text: userPrompt }],
      },
    ],
    generationConfig: {
      responseMimeType: 'application/json',
    },
  }
}

function stripMarkdownFences(text) {
  return text.trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '')
}

async function callGemini(systemInstruction, userPrompt, signal) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('Missing VITE_GEMINI_API_KEY — set it in your .env file.')
  }

  const timeout = new AbortController()
  const timer = setTimeout(() => timeout.abort(), TIMEOUT_MS)
  signal?.addEventListener('abort', () => timeout.abort(), { once: true })

  let response
  try {
    response = await fetch(`${ENDPOINT}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildRequestBody(systemInstruction, userPrompt)),
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
    const detail = await response.text().catch(() => '')
    if (response.status === 429) {
      throw new Error('Too many requests right now. Wait a moment and try again.')
    }
    if (response.status === 400 || response.status === 403) {
      throw new Error('The API key was rejected. Check VITE_GEMINI_API_KEY in your .env file.')
    }
    throw new Error(`Roadmap service failed (${response.status}). ${detail.slice(0, 160)}`)
  }

  const data = await response.json()
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!rawText) {
    throw new Error('The roadmap service returned an empty response. Try again.')
  }

  try {
    return JSON.parse(stripMarkdownFences(rawText))
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

export function getForwardRoadmap({ stage, interests }, signal) {
  return cached(forwardKey({ stage, interests }), async () =>
    normalizeRoadmap(await callGemini(ROADMAP_SYSTEM, forwardPrompt({ stage, interests }), signal)),
  )
}

export function getReverseRoadmap({ career }, signal) {
  return cached(reverseKey({ career }), async () =>
    normalizeRoadmap(await callGemini(ROADMAP_SYSTEM, reversePrompt({ career }), signal)),
  )
}

export function getComparison({ items }, signal) {
  return cached(compareKey({ items }), async () =>
    normalizeComparison(await callGemini(COMPARE_SYSTEM, comparePrompt({ items }), signal), items),
  )
}
