import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/admin';

export const runtime = 'nodejs';

const LeadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().min(8).max(30),
  area: z.enum(['trabalhista', 'previdenciario', 'ambas', 'outra']),
  funcionarios_escritorio: z.enum(['solo', '2-3', '4+']),
  utm_source: z.string().trim().max(120).optional().nullable(),
  utm_medium: z.string().trim().max(120).optional().nullable(),
  utm_campaign: z.string().trim().max(120).optional().nullable(),
  utm_content: z.string().trim().max(200).optional().nullable(),
  utm_term: z.string().trim().max(120).optional().nullable(),
  fbp: z.string().trim().max(200).optional().nullable(),
  fbc: z.string().trim().max(200).optional().nullable(),
});

// Rate limit em memória (por IP, janela deslizante de 60s, limite 3).
// Em Cloudflare Workers os isolates são efêmeros, então isso é "best-effort":
// protege contra loops acidentais e força bruta simples.
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

  const data = parsed.data;

  try {
    const admin = createAdminClient();
    const { data: inserted, error } = await admin
      .from('leads')
      .insert({
        name: data.name,
        email: data.email,
        phone: data.phone,
        area: data.area,
        funcionarios_escritorio: data.funcionarios_escritorio,
        source: 'partners',
        utm_source: data.utm_source || null,
        utm_medium: data.utm_medium || null,
        utm_campaign: data.utm_campaign || null,
        utm_content: data.utm_content || null,
        utm_term: data.utm_term || null,
        fbp: data.fbp || null,
        fbc: data.fbc || null,
      })
      .select('id')
      .single();

    if (error || !inserted) {
      console.error('[partners/leads] insert falhou:', error?.message);
      return NextResponse.json(
        { ok: false, error: 'insert_failed', detail: error?.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, lead_id: inserted.id });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'unknown_error';
    console.error('[partners/leads] exception:', msg);
    return NextResponse.json({ ok: false, error: 'server_error', detail: msg }, { status: 500 });
  }
}
