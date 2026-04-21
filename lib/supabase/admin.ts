import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let leadsCached: SupabaseClient | null = null;
let formsCached: SupabaseClient | null = null;

/**
 * Admin client → Supabase da RECEITA (ljhgwesvajyfftehlnay).
 * Destino de `public.leads` — consumido por email-whatsapp-mkt / laquila-growth.
 */
export function createAdminClient(): SupabaseClient {
  if (leadsCached) return leadsCached;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('Supabase (receita) env vars missing');
  }
  leadsCached = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  return leadsCached;
}

/**
 * Admin client → Supabase do LAQUILA-FORMS (acinbhrkmovrqepojdan).
 * Destino de `form_responses` → aparece em forms.laquilacompany.app/dashboard.
 */
export function createFormsAdminClient(): SupabaseClient {
  if (formsCached) return formsCached;
  const url = process.env.FORMS_SUPABASE_URL;
  const key = process.env.FORMS_SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('FORMS_SUPABASE_URL / FORMS_SUPABASE_SERVICE_ROLE_KEY missing');
  }
  formsCached = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  return formsCached;
}
