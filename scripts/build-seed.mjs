/**
 * Pre-generates the roadmaps and comparisons students ask for most, so the common cases
 * cost zero API calls at runtime. Output is committed as src/data/seed.json.
 *
 *   npm run seed
 *
 * Re-run this before each admissions cycle — the app stops trusting the seed once it is
 * older than the SEED_TTL in src/cache.js and falls back to live requests.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  COMPARE_SYSTEM,
  ROADMAP_SYSTEM,
  comparePrompt,
  forwardPrompt,
  reversePrompt,
} from '../src/prompts.js'
import { normalizeComparison, normalizeRoadmap } from '../src/normalize.js'
import { compareKey, forwardKey, reverseKey } from '../src/cache.js'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT = path.join(ROOT, 'src/data/seed.json')
const MODEL = 'gemini-flash-lite-latest'
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`

const CAREERS = [
  'Doctor', 'Software Engineer', 'Chartered Accountant', 'Pilot', 'Lawyer',
  'Fashion Designer', 'IAS Officer', 'Data Scientist', 'Architect', 'Psychologist',
  'Teacher', 'Graphic Designer', 'Civil Engineer', 'Nurse', 'Journalist',
  'Chef', 'Merchant Navy Officer', 'Army Officer', 'Pharmacist', 'Interior Designer',
]

const INTERESTS = [
  'Math & Logic', 'Science & Experiments', 'Business & Money', 'Art & Design',
  'Writing & Communication', 'People & Helping others', 'Computers & Tech', 'Not sure yet',
]

const COMPARISONS = [
  ['B.Tech', 'B.Sc', 'BCA'],
  ['B.Com', 'BBA'],
  ['MBBS', 'BDS'],
  ['B.A', 'B.Com'],
  ['B.Tech', 'MBBS'],
  ['BCA', 'B.Sc'],
  ['Polytechnic Diploma', 'B.Tech'],
  ['Chartered Accountant', 'MBA'],
  ['B.Des', 'B.Arch'],
  ['LLB', 'BBA'],
]

function apiKey() {
  const envPath = path.join(ROOT, '.env')
  const match = fs.readFileSync(envPath, 'utf8').match(/VITE_GEMINI_API_KEY=(.*)/)
  const key = match?.[1]?.trim()
  if (!key) throw new Error('VITE_GEMINI_API_KEY missing from .env')
  return key
}

const KEY = apiKey()
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function ask(system, prompt) {
  const res = await fetch(`${ENDPOINT}?key=${KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { role: 'system', parts: [{ text: system }] },
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json' },
    }),
  })
  if (!res.ok) throw new Error(`${res.status} ${(await res.text()).slice(0, 120)}`)
  const data = await res.json()
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error('empty response')
  return JSON.parse(text.trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, ''))
}

async function withRetry(label, fn) {
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      return await fn()
    } catch (err) {
      if (attempt === 3) {
        console.log(`  skip  ${label} — ${err.message}`)
        return null
      }
      await sleep(1500 * attempt)
    }
  }
  return null
}

const jobs = []

for (const career of CAREERS) {
  jobs.push({
    label: `reverse: ${career}`,
    key: reverseKey({ career }),
    run: async () => normalizeRoadmap(await ask(ROADMAP_SYSTEM, reversePrompt({ career }))),
  })
}

for (const stage of ['10th', '12th']) {
  for (const interests of [[], ...INTERESTS.map((i) => [i])]) {
    jobs.push({
      label: `forward: ${stage} / ${interests[0] ?? 'any'}`,
      key: forwardKey({ stage, interests }),
      run: async () =>
        normalizeRoadmap(await ask(ROADMAP_SYSTEM, forwardPrompt({ stage, interests }))),
    })
  }
}

for (const items of COMPARISONS) {
  jobs.push({
    label: `compare: ${items.join(' vs ')}`,
    key: compareKey({ items }),
    run: async () =>
      normalizeComparison(await ask(COMPARE_SYSTEM, comparePrompt({ items })), items),
  })
}

console.log(`Generating ${jobs.length} seed entries…\n`)

const entries = {}
let done = 0
let failed = 0

for (const job of jobs) {
  const result = await withRetry(job.label, job.run)
  if (result) {
    entries[job.key] = result
    done += 1
    console.log(`  ok    ${job.label}`)
  } else {
    failed += 1
  }
  await sleep(250)
}

fs.mkdirSync(path.dirname(OUT), { recursive: true })
fs.writeFileSync(
  OUT,
  `${JSON.stringify({ generatedAt: new Date().toISOString(), model: MODEL, entries }, null, 2)}\n`,
)

const kb = (fs.statSync(OUT).size / 1024).toFixed(1)
console.log(`\n${done} entries written to src/data/seed.json (${kb} kB), ${failed} skipped.`)
