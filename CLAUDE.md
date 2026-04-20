# laquila-partners (site)

Landing page do braço premium da Laquila Marketing — hospedada em `partners.laquilamarketing.com.br`.

## Arquitetura — fluxo de captura

```
Advogado visita / (Cloudflare Pages, OpenNext worker)
       │
       ▼
Preenche formulário (ApplicationForm.tsx client component)
       │ POST { name, email, phone, area, funcionarios_escritorio, utm_*, fbp, fbc }
       ▼
/api/leads (Next.js Route Handler, Node runtime)
       │ Zod validate → Supabase admin client (service_role)
       ▼
INSERT public.leads { ..., source='partners' }
       │
       ▼
VIEW public.daily_leads (compartilhada com email-whatsapp-mkt, laquila-growth,
  Facebook Lead Ads, forms.laquilamarketing.com.br)
```

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 15 App Router + React 19 |
| Runtime | Cloudflare Pages via OpenNext (`@opennextjs/cloudflare`) |
| DB | Supabase (`ljhgwesvajyfftehlnay`) — tabela `public.leads` |
| Validation | Zod |
| UI | CSS customizado inline (Fraunces + Inter, paleta gold #c79a3f) — Tailwind v4 instalado como base |

## Convenções

- **source sempre `'partners'`** nos inserts (consistência com Facebook Lead Ads `lp-aplicacao` etc).
- **NUNCA criar coluna nova em `leads`** sem coordenar com os outros projetos do front. A tabela é compartilhada.
- **Service role apenas em rotas server-side.** Nunca expor anon key em client component — este site só precisa de service_role no `/api/leads`.
- **Não incluir percentuais/valores de comissão** no material público (regra do `laquila-partners/CLAUDE.md` do projeto pai: existência do modelo = público, números = internos).

## Deploy

```bash
npm run deploy:cf
```

Precisa de `CLOUDFLARE_API_TOKEN` (scope: Account > Cloudflare Pages > Edit) e `CLOUDFLARE_ACCOUNT_ID`.

Projeto CF Pages: `laquila-partners` (account `5eb312807ba0019b24f690f3f22879ab`).

## Env vars

Ver `.env.example`. Em produção, **todas como secret_text** (gotcha OpenNext/CF: plain_text não chega em runtime).

## Gotchas conhecidos

- **CF Pages env vars:** `plain_text` fica só em build; runtime (worker) só enxerga `secret_text`. Aplicar via `scripts/cf-restore-env.mjs`.
- **OpenNext routing:** após `build:cf`, precisa `cp .open-next/worker.js .open-next/_worker.js` e copiar assets pra raiz (`cp -r .open-next/assets/. .open-next/`) antes do `wrangler pages deploy`. O script `deploy:cf` do `package.json` encapsula.
- **Rate limit in-memory:** Workers têm isolates efêmeros. O rate-limit de `/api/leads` é best-effort — não substitui WAF/Turnstile pra ataques sérios.

## Fonte do conteúdo

Briefing: `../docs/proposta-de-valor.md`, `../docs/publico-alvo.md`, `../docs/posicionamento.md`. Landing HTML original (referência): `../assets/landing-page/index.html`.
