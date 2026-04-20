-- Recria public.leads (tabela canônica de captação de canais externos:
-- Facebook Lead Ads, forms.laquilamarketing.com.br, laquila-partners,
-- zapier → laquila-growth). Diferente de core.leads (CRM interno).
--
-- Consumidores desta tabela/view:
--   - email-whatsapp-mkt: SELECT em public.daily_leads para enrollments
--   - laquila-growth: SELECT em public.daily_leads para dashboards
--   - partners.laquilamarketing.com.br: INSERT via /api/leads (source='partners')
--
-- Contexto: a versão anterior sumiu do schema. Esta migration restaura o
-- contrato que os projetos acima esperam, com defaults seguros.

CREATE TABLE IF NOT EXISTS public.leads (
  id                     TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name                   TEXT,
  email                  TEXT,
  phone                  TEXT,
  area                   TEXT,
  funcionarios_escritorio TEXT,
  faturamento_medio      TEXT,
  utm_source             TEXT,
  utm_medium             TEXT,
  utm_campaign           TEXT,
  utm_content            TEXT,
  utm_term               TEXT,
  fbp                    TEXT,
  fbc                    TEXT,
  source                 TEXT,
  created_date           DATE DEFAULT CURRENT_DATE,
  lead_datetime          TIMESTAMPTZ DEFAULT now(),
  synced_to_crm          BOOLEAN NOT NULL DEFAULT false,
  sent_to_activecampaign BOOLEAN DEFAULT false,
  email_opt_out          BOOLEAN DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads (lower(email));
CREATE INDEX IF NOT EXISTS idx_leads_phone ON public.leads (phone);
CREATE INDEX IF NOT EXISTS idx_leads_source ON public.leads (source);
CREATE INDEX IF NOT EXISTS idx_leads_created_date ON public.leads (created_date DESC);

-- RLS ligado. Escrita vai via service_role (bypassa). Leitura para authenticated
-- (app internos) — o anon key NÃO lê nada desta tabela.
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "authenticated_can_read_leads" ON public.leads;
CREATE POLICY "authenticated_can_read_leads" ON public.leads
  FOR SELECT TO authenticated USING (true);

-- Grants explícitos pro PostgREST ver a tabela (papéis canônicos Supabase)
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE ON public.leads TO service_role;
GRANT SELECT ON public.leads TO authenticated;

-- View canônica que os outros projetos consomem
CREATE OR REPLACE VIEW public.daily_leads AS
SELECT
  id, name, email, phone, area, funcionarios_escritorio,
  utm_source, utm_medium, utm_campaign, utm_content, utm_term,
  created_date, lead_datetime, synced_to_crm, faturamento_medio,
  sent_to_activecampaign, fbp, fbc, source, email_opt_out
FROM public.leads;

GRANT SELECT ON public.daily_leads TO authenticated, service_role;

-- Força PostgREST a recarregar o schema cache imediatamente
NOTIFY pgrst, 'reload schema';
