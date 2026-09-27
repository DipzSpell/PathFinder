import { normalizeRoadmap } from './normalize'

/**
 * Share links carry the whole roadmap inside the URL fragment (`/r#…`), so nothing is stored on
 * a server and the fragment never reaches one — opening a shared link costs no API call and
 * shows exactly what the sender saw. The JSON is deflated when the browser supports it, which
 * keeps a typical roadmap link around 1.5–3 KB.
 *
 * Payload prefixes: "z" = deflate-raw + base64url, "j" = plain base64url (fallback).
 */

function toBase64Url(bytes) {
  let binary = ''
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromBase64Url(text) {
  const padded = text.replace(/-/g, '+').replace(/_/g, '/')
  const binary = atob(padded + '='.repeat((4 - (padded.length % 4)) % 4))
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

async function pipe(bytes, stream) {
  const piped = new Blob([bytes]).stream().pipeThrough(stream)
  return new Uint8Array(await new Response(piped).arrayBuffer())
}

const canCompress = () =>
  typeof CompressionStream === 'function' && typeof DecompressionStream === 'function'

export async function encodeShare({ roadmap, flow, lang }) {
  const { fromCache: _fromCache, ...clean } = roadmap
  const json = JSON.stringify({ v: 1, f: flow, l: lang, r: clean })
  const bytes = new TextEncoder().encode(json)

  if (canCompress()) {
    try {
      return `z${toBase64Url(await pipe(bytes, new CompressionStream('deflate-raw')))}`
    } catch {
      /* fall back to the uncompressed form */
    }
  }
  return `j${toBase64Url(bytes)}`
}

export async function decodeShare(payload) {
  const kind = payload?.[0]
  const body = payload?.slice(1)
  if (!body || (kind !== 'z' && kind !== 'j')) throw new Error('bad share payload')

  let bytes = fromBase64Url(body)
  if (kind === 'z') {
    if (!canCompress()) throw new Error('compression unsupported')
    bytes = await pipe(bytes, new DecompressionStream('deflate-raw'))
  }

  const data = JSON.parse(new TextDecoder().decode(bytes))
  return {
    flow: data?.f === 'reverse' ? 'reverse' : 'forward',
    lang: data?.l === 'hi' ? 'hi' : 'en',
    // Re-run the same cleaning a fresh API answer gets — a link can be hand-edited.
    roadmap: normalizeRoadmap(data?.r),
  }
}

export async function shareUrl(entry) {
  return `${window.location.origin}/r#${await encodeShare(entry)}`
}
