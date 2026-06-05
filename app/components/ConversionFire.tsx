'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { trackMetaLead } from './MetaPixel';
import { trackGoogleAdsLead, trackGa4Lead } from './GoogleTags';

const GADS_SEND_TO = process.env.NEXT_PUBLIC_GADS_LEAD_SEND_TO || '';

export function ConversionFire() {
  const params = useSearchParams();

  useEffect(() => {
    const rid = params.get('rid') || String(Date.now());
    try {
      trackMetaLead(rid, { content_name: 'Partners LP', currency: 'BRL' });
      if (GADS_SEND_TO) trackGoogleAdsLead(GADS_SEND_TO, rid);
      trackGa4Lead({ method: 'partners-lp', transaction_id: rid });
    } catch (e) {
      console.warn('[ConversionFire] tracking failed', e);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
