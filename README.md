# Laquila Partners — Site

Landing page em produção: `partners.laquilamarketing.com.br` (URL temporária: `laquila-partners.pages.dev`).

## Stack

- **Framework:** Next.js 15 App Router + React 19 + TypeScript
- **Styling:** Tailwind v4 + CSS customizado (Fraunces + Inter, paleta preta/dourada)
- **DB:** Supabase (projeto compartilhado `ljhgwesvajyfftehlnay`, tabela `public.leads`)
- **Validation:** Zod
- **Host:** Cloudflare Pages via OpenNext (`@opennextjs/cloudflare`)

## Rodar local

```bash
npm install
npm run dev          # http://localhost:3000
```

`.env.local` precisa de `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_APP_URL` — ver `.env.example`.

## Build de produção

```bash
npm run build:cf     # gera .open-next/ (pronto pra CF Pages)
```

## Deploy

```bash
npm run deploy:cf    # build + wrangler pages deploy
```

Requer env vars do shell: `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`.

## Estrutura

```
site/
├── app/
│   ├── layout.tsx              fontes + metadata
│   ├── page.tsx                landing completa
│   ├── globals.css             tokens visuais (gold #c79a3f, Fraunces, dark closing)
│   ├── components/
│   │   └── ApplicationForm.tsx formulário client-side (máscara BR + auto UTMs + fbp/fbc)
│   └── api/
│       └── leads/route.ts      POST /api/leads — insert em public.leads com source='partners'
├── lib/supabase/admin.ts       service_role server-side
├── scripts/cf-restore-env.mjs  aplica env vars em produção
├── wrangler.toml               config CF Pages
├── open-next.config.ts         config OpenNext
└── public/img/eduardo-laquila.webp
```

## Endpoint de captura

**POST /api/leads** — payload validado com zod:

```ts
{
  name: string,            // 2–120
  email: string,           // email válido
  phone: string,           // só dígitos no backend
  area: 'trabalhista' | 'previdenciario' | 'ambas' | 'outra',
  funcionarios_escritorio: 'solo' | '2-3' | '4+',
  utm_source?, utm_medium?, utm_campaign?, utm_content?, utm_term?,
  fbp?, fbc?
}
```

Response: `{ ok: true, lead_id: "<uuid>" }` (200) ou `{ ok: false, error: ... }` (400/429/500).

Rate limit: **3 submissões/IP/minuto** (best-effort, em memória do isolate).

Destino: `public.leads` com `source='partners'`. Aparece em `daily_leads` (view compartilhada).

## Env vars (produção)

| Nome | Tipo | Descrição |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | secret_text | URL Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | secret_text | Server-side (bypassa RLS) |
| `NEXT_PUBLIC_APP_URL` | secret_text | `https://partners.laquilamarketing.com.br` |

**Gotcha CF Pages:** OpenNext só injeta `secret_text` em runtime. `plain_text` fica só em build.
