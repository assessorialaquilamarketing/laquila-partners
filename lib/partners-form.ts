import type { SupabaseClient } from '@supabase/supabase-js';

// Chaves do payload que o /api/leads recebe (14 obrigatórias + instagram opcional)
export type PartnersFieldKey =
  | 'name' | 'email' | 'phone' | 'cidade_uf' | 'escritorio' | 'instagram'
  | 'area' | 'funcionarios_escritorio' | 'tempo_investimento' | 'contratos_mes'
  | 'investimento_trafego' | 'quem_roda_marketing' | 'motivo' | 'ambicao_12m'
  | 'aceita_comissao';

export interface PartnersFormMapping {
  formId: string;
  /** field_key → block_id (uuid) */
  blockMap: Record<PartnersFieldKey, string>;
}

interface CacheEntry { data: PartnersFormMapping; expiresAt: number }
let cache: CacheEntry | null = null;
const TTL_MS = 60_000;

/**
 * Busca id+partners_block_map do form "Partners LP" (slug=partners-lp).
 * Cacheia por 60s pra evitar roundtrip a cada /api/leads.
 * Se o form não existir ou mapping estiver incompleto, joga — o caller deve
 * tratar fallback (gravar só em public.leads).
 */
export async function getPartnersFormMapping(
  admin: SupabaseClient,
  now: number = Date.now()
): Promise<PartnersFormMapping> {
  if (cache && cache.expiresAt > now) return cache.data;

  const { data, error } = await admin
    .from('forms')
    .select('id, settings')
    .eq('slug', 'partners-lp')
    .eq('status', 'published')
    .single();

  if (error || !data) {
    throw new Error(`partners-lp form lookup failed: ${error?.message ?? 'not found'}`);
  }

  const settings = (data.settings ?? {}) as Record<string, unknown>;
  const rawMap = (settings.partners_block_map ?? {}) as Record<string, unknown>;
  const required: PartnersFieldKey[] = [
    'name', 'email', 'phone', 'cidade_uf', 'escritorio', 'instagram',
    'area', 'funcionarios_escritorio', 'tempo_investimento', 'contratos_mes',
    'investimento_trafego', 'quem_roda_marketing', 'motivo', 'ambicao_12m',
    'aceita_comissao',
  ];
  const blockMap: Partial<Record<PartnersFieldKey, string>> = {};
  for (const k of required) {
    const v = rawMap[k];
    if (typeof v !== 'string') {
      throw new Error(`partners_block_map.${k} missing — rerun migration 20260421120000_create_partners_lp_form.sql`);
    }
    blockMap[k] = v;
  }

  const payload: PartnersFormMapping = {
    formId: data.id as string,
    blockMap: blockMap as Record<PartnersFieldKey, string>,
  };
  cache = { data: payload, expiresAt: now + TTL_MS };
  return payload;
}

/** Só pra testes — nunca chamado em prod */
export function __resetPartnersFormCache() {
  cache = null;
}
