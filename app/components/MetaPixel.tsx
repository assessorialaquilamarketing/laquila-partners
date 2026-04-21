'use client'

import Script from 'next/script'

interface Props {
  pixelIds: string[]
}

export function MetaPixel({ pixelIds }: Props) {
  const ids = pixelIds.filter(Boolean)
  if (ids.length === 0) return null

  const initCalls = ids.map((id) => `fbq('init', '${id}');`).join('\n')

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          ${initCalls}
          fbq('track', 'PageView');
        `}
      </Script>
      {ids.map((id) => (
        <noscript key={id}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src={`https://www.facebook.com/tr?id=${id}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
      ))}
    </>
  )
}

export function trackMetaLead(eventID: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  const w = window as unknown as { fbq?: (...a: unknown[]) => void }
  if (typeof w.fbq !== 'function') return
  w.fbq('track', 'Lead', params ?? {}, { eventID })
}
