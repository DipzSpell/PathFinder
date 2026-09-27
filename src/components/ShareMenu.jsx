import { useEffect, useState } from 'react'
import { shareUrl } from '../share'
import { useLang } from '../prefs'
import { ChatIcon, LinkIcon, ShareIcon } from './Icons'

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Older mobile browsers and non-secure contexts have no async clipboard.
    const area = document.createElement('textarea')
    area.value = text
    area.setAttribute('readonly', '')
    area.style.position = 'fixed'
    area.style.opacity = '0'
    document.body.appendChild(area)
    area.select()
    const ok = document.execCommand('copy')
    area.remove()
    return ok
  }
}

const buttonClass =
  'press inline-flex items-center justify-center gap-2 rounded-full border border-line bg-paper-raised px-4 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:border-ink/40 hover:text-ink disabled:opacity-40 disabled:cursor-not-allowed'

export default function ShareMenu({ roadmap, flow, lang }) {
  const { t } = useLang()
  const [url, setUrl] = useState(null)
  const [status, setStatus] = useState('idle')
  const canNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function'

  // Built ahead of the click: share sheets and the clipboard both need the user gesture, which
  // an await in the click handler would lose.
  useEffect(() => {
    let alive = true
    shareUrl({ roadmap, flow, lang })
      .then((next) => alive && setUrl(next))
      .catch(() => alive && setStatus('failed'))
    return () => {
      alive = false
    }
  }, [roadmap, flow, lang])

  useEffect(() => {
    if (status !== 'copied') return
    const id = setTimeout(() => setStatus('idle'), 2200)
    return () => clearTimeout(id)
  }, [status])

  const text = t('share.text', { title: roadmap.title })

  const handleNative = async () => {
    try {
      await navigator.share({ title: roadmap.title, text, url })
    } catch {
      /* dismissed */
    }
  }

  const handleCopy = async () => {
    setStatus((await copyText(url)) ? 'copied' : 'failed')
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {canNativeShare && (
        <button type="button" onClick={handleNative} disabled={!url} className={buttonClass}>
          <ShareIcon />
          {t('share.button')}
        </button>
      )}
      <button type="button" onClick={handleCopy} disabled={!url} className={buttonClass}>
        <LinkIcon />
        {status === 'copied' ? t('share.copied') : t('share.copy')}
      </button>
      <a
        href={url ? `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}` : undefined}
        target="_blank"
        rel="noopener noreferrer"
        aria-disabled={!url}
        className={`${buttonClass} ${url ? '' : 'pointer-events-none opacity-40'}`}
      >
        <ChatIcon />
        {t('share.whatsapp')}
      </a>
      <span className="sr-only" aria-live="polite">
        {status === 'copied' ? t('share.copied') : status === 'failed' ? t('share.failed') : ''}
      </span>
      {status === 'failed' && (
        <span className="font-mono text-xs text-coral">{t('share.failed')}</span>
      )}
    </div>
  )
}
