import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient, createFormsAdminClient } from '@/lib/supabase/admin';
import { getPartnersFormMapping, type PartnersFieldKey } from '@/lib/partners-form';
import { appendToPartnersSheet } from '@/lib/sheets';

export const runtime = 'nodejs';

const PARTNERS_SHEET_ID = '1M4aiZMBJHJetnQhgL7JLDMgE47XrGfiQFIRpbnv9qU0';

// Triple-write: toda submissão grava em TRÊS destinos —
//   1) form_responses (form_id = Partners LP) — aparece no dashboard forms.laquilacompany.app
//   2) public.leads (source='partners') — consumido por email-whatsapp-mkt / laquila-growth
//   3) Google Sheet 'Partners LP' — planilha interna
// Ordem: form_responses obrigatório (retorna 500 se falhar), leads + sheets best-effort (try/catch).
const LeadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().min(8).max(30),
  cidade_uf: z.string().trim().min(2).max(120),
  escritorio: z.string().trim().min(2).max(200),
  instagram: z.string().trim().max(120).optional().nullable(),

  area: z.enum(['trabalhista', 'previdenciario', 'ambas', 'outra']),
  funcionarios_escritorio: z.enum(['solo', '2-3', '4+']),
  tempo_investimento: z.enum(['ate6m', '6a12m', '1a2a', '+2a']),
  contratos_mes: z.enum(['<5', '5a15', '15a30', '30a60', '+60']),
  investimento_trafego: z.enum(['<5k', '5a15k', '15a30k', '30a60k', '+60k']),
  quem_roda_marketing: z.enum(['agencia', 'freela', 'inhouse', 'eu', 'nenhum']),

  motivo: z.string().trim().min(5).max(1500),
  ambicao_12m: z.string().trim().min(5).max(1500),
  aceita_comissao: z.enum(['sim', 'entender', 'hibrido', 'nao']),

  utm_source: z.string().trim().max(120).optional().nullable(),
  utm_medium: z.string().trim().max(120).optional().nullable(),
  utm_campaign: z.string().trim().max(120).optional().nullable(),
  utm_content: z.string().trim().max(200).optional().nullable(),
  utm_term: z.string().trim().max(120).optional().nullable(),
  fbp: z.string().trim().max(200).optional().nullable(),
  fbc: z.string().trim().max(200).optional().nullable(),
});

const recentByIp = new Map<string, number[]>();
const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT = 3;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const hits = (recentByIp.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (hits.length >= RATE_LIMIT) {
    recentByIp.set(ip, hits);
    return true;
  }
  hits.push(now);
  recentByIp.set(ip, hits);
  return false;
}

function clientIp(req: NextRequest): string {
  return (
    req.headers.get('cf-connecting-ip') ||
    req.headers.get('x-real-ip') ||
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'
  );
}

type LeadData = z.infer<typeof LeadSchema>;

function buildAnswers(data: LeadData, blockMap: Record<PartnersFieldKey, string>) {
  // Monta { block_id: value } compatível com o FormRenderer do laquila-forms.
  const answers: Record<string, unknown> = {};
  const fields: PartnersFieldKey[] = [
    'name', 'email', 'phone', 'cidade_uf', 'escritorio',
    'area', 'funcionarios_escritorio', 'tempo_investimento', 'contratos_mes',
    'investimento_trafego', 'quem_roda_marketing', 'motivo', 'ambicao_12m',
    'aceita_comissao',
  ];
  for (const k of fields) {
    answers[blockMap[k]] = data[k];
  }
  if (data.instagram && data.instagram.trim() !== '') {
    answers[blockMap.instagram] = data.instagram;
  }
  return answers;
}

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: 'rate_limited', detail: 'Muitas submissões. Tente em 1 minuto.' },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const parsed = LeadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'invalid_payload', issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const d = parsed.data;

  // Guard server-side: quem marca "Não tenho interesse nesse formato" NÃO entra no funil.
  // Client já redireciona antes do fetch, mas aqui protege contra chamadas diretas/bots.
  if (d.aceita_comissao === 'nao') {
    return NextResponse.json(
      { ok: true, skipped: true, reason: 'nao_aceita_comissao', redirect: 'https://lp.laquilamarketing.com.br' },
      { status: 200 }
    );
  }

  // Dois clients: 'admin' → Receita (public.leads); 'formsAdmin' → laquila-forms DB (form_responses)
  const admin = createAdminClient();
  const formsAdmin = createFormsAdminClient();

  // ------- PASSO 1: form_responses no DB do laquila-forms (dashboard) -------
  let responseId: string | null = null;
  try {
    const { formId, blockMap } = await getPartnersFormMapping(formsAdmin);
    const answers = buildAnswers(d, blockMap);
    const metadata = {
      source: 'partners-lp-landing',
      submitted_at: new Date().toISOString(),
      user_agent: req.headers.get('user-agent') ?? '',
      utm: {
        utm_source: d.utm_source ?? '',
        utm_medium: d.utm_medium ?? '',
        utm_campaign: d.utm_campaign ?? '',
        utm_content: d.utm_content ?? '',
        utm_term: d.utm_term ?? '',
      },
      fbp: d.fbp ?? '',
      fbc: d.fbc ?? '',
    };
    const { data: inserted, error } = await formsAdmin
      .from('form_responses')
      .insert({ form_id: formId, answers, metadata })
      .select('id')
      .single();
    if (error || !inserted) {
      console.error('[partners/leads] form_responses insert falhou:', error?.message);
      return NextResponse.json(
        { ok: false, error: 'form_responses_insert_failed', detail: error?.message },
        { status: 500 }
      );
    }
    responseId = inserted.id as string;
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'unknown_error';
    console.error('[partners/leads] form lookup/insert exception:', msg);
    return NextResponse.json(
      { ok: false, error: 'form_lookup_failed', detail: msg },
      { status: 500 }
    );
  }

  // ------- PASSO 2: public.leads (continua como antes) -------
  const extra: Record<string, string> = {
    cidade_uf: d.cidade_uf,
    escritorio: d.escritorio,
    tempo_investimento: d.tempo_investimento,
    contratos_mes: d.contratos_mes,
    quem_roda_marketing: d.quem_roda_marketing,
    motivo: d.motivo,
    ambicao_12m: d.ambicao_12m,
    aceita_comissao: d.aceita_comissao,
    form_response_id: responseId, // link bidirecional
  };
  if (d.instagram) extra.instagram = d.instagram;

  const { data: insertedLead, error: leadsError } = await admin
    .from('leads')
    .insert({
      name: d.name,
      email: d.email,
      phone: d.phone,
      area: d.area,
      funcionarios_escritorio: d.funcionarios_escritorio,
      faturamento_medio: d.investimento_trafego,
      source: 'partners',
      utm_source: d.utm_source || null,
      utm_medium: d.utm_medium || null,
      utm_campaign: d.utm_campaign || null,
      utm_content: d.utm_content || null,
      utm_term: d.utm_term || null,
      fbp: d.fbp || null,
      fbc: d.fbc || null,
      extra,
    })
    .select('id')
    .single();

  if (leadsError || !insertedLead) {
    // form_response já foi criado — inconsistência conhecida, mas dashboard já vê.
    // Retorna 500 pro cliente não ver sucesso falso, mas form_response permanece.
    console.error('[partners/leads] public.leads insert falhou (form_response já criado):', leadsError?.message);
    return NextResponse.json(
      {
        ok: false,
        error: 'leads_insert_failed_after_form_response',
        detail: leadsError?.message,
        orphan_response_id: responseId,
      },
      { status: 500 }
    );
  }

  // ------- PASSO 3: Google Sheet (3º destino, best-effort) -------
  let sheetAppended = false;
  try {
    await appendToPartnersSheet(PARTNERS_SHEET_ID, {
      submitted_at: new Date().toISOString(),
      submission_id: responseId!,
      name: d.name,
      email: d.email,
      phone: d.phone,
      cidade_uf: d.cidade_uf,
      escritorio: d.escritorio,
      instagram: d.instagram ?? '',
      area: d.area,
      funcionarios_escritorio: d.funcionarios_escritorio,
      tempo_investimento: d.tempo_investimento,
      contratos_mes: d.contratos_mes,
      investimento_trafego: d.investimento_trafego,
      quem_roda_marketing: d.quem_roda_marketing,
      motivo: d.motivo,
      ambicao_12m: d.ambicao_12m,
      aceita_comissao: d.aceita_comissao,
      utm_source: d.utm_source ?? '',
      utm_medium: d.utm_medium ?? '',
      utm_campaign: d.utm_campaign ?? '',
      utm_content: d.utm_content ?? '',
      utm_term: d.utm_term ?? '',
    });
    sheetAppended = true;
  } catch (err) {
    console.error('[partners/leads] sheets append failed:', err instanceof Error ? err.message : err);
  }

  return NextResponse.json({
    ok: true,
    lead_id: insertedLead.id,
    response_id: responseId,
    sheet_appended: sheetAppended,
  });
}
