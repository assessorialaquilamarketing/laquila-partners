'use client'

import Script from 'next/script'

interface Props {
  gaIds?: string[]
  gadsIds?: string[]
}

export function GoogleTags({ gaIds = [], gadsIds = [] }: Props) {
  const all = [...gaIds.filter(Boolean), ...gadsIds.filter(Boolean)]
  if (all.length === 0) return null

  const primary = all[0]
  const configs = all.map((id) => `gtag('config', '${id}');`).join('\n')

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${primary}`} strategy="afterInteractive" />
      <Script id="google-tags" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          ${configs}
        `}
      </Script>
    </>
  )
}

function ensureGtag() {
  if (typeof window === 'undefined') return null
  const w = window as unknown as { dataLayer?: unknown[]; gtag?: (...a: unknown[]) => void }
  if (!Array.isArray(w.dataLayer)) w.dataLayer = []
  if (typeof w.gtag !== 'function') {
    w.gtag = function () {
      ;(w.dataLayer as unknown[]).push(arguments)
    }
  }
  return w.gtag
}

/** Dispara conversão de Lead no Google Ads (send_to = AW-XXX/LABEL). */
export function trackGoogleAdsLead(sendTo: string, transactionId?: string) {
  const gtag = ensureGtag()
  if (!gtag) return
  const payload: Record<string, unknown> = { send_to: sendTo }
  if (transactionId) payload.transaction_id = transactionId
  gtag('event', 'conversion', payload)
}

/** Dispara evento Lead no GA4 (todas as propriedades configuradas). */
export function trackGa4Lead(params?: Record<string, unknown>) {
  const gtag = ensureGtag()
  if (!gtag) return
  gtag('event', 'generate_lead', params ?? {})
}
