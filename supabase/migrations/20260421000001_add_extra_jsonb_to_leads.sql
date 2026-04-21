-- Migration aditiva: coluna extra jsonb em public.leads
-- Motivo: o form do Partners coleta ~14 campos qualificatórios que não
-- têm coluna dedicada (cidade/uf, nome do escritório, instagram, tempo de
-- investimento, contratos/mês, quem roda marketing, motivo da aplicação,
-- ambição 12m, aceite do modelo de comissão etc).
-- Em vez de criar uma coluna por item (quebraria schema compartilhado
-- com email-whatsapp-mkt e laquila-growth), usa-se um jsonb flexível.
-- Safe: nullable/default {}, nenhum consumer existente lê `extra`.

alter table public.leads
  add column if not exists extra jsonb not null default '{}'::jsonb;

create index if not exists idx_leads_extra_gin on public.leads using gin (extra);

-- Regenera view daily_leads expondo extra — email-whatsapp-mkt e laquila-growth
-- não leem esse campo hoje, então não afeta. Expor agora facilita consumo futuro.
create or replace view public.daily_leads as
select
  id, name, email, phone, area, funcionarios_escritorio,
  utm_source, utm_medium, utm_campaign, utm_content, utm_term,
  created_date, lead_datetime, synced_to_crm, faturamento_medio,
  sent_to_activecampaign, fbp, fbc, source, email_opt_out, extra
from public.leads;

grant select on public.daily_leads to authenticated, service_role;

notify pgrst, 'reload schema';
