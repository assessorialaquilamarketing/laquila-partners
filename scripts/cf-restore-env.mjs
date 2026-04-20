#!/usr/bin/env node
// Aplica env vars em produção no Cloudflare Pages.
// IMPORTANTE: todas as vars lidas em runtime (process.env.*) precisam ser
// secret_text — plain_text só fica disponível em build-time no OpenNext/CF.

import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';

function getSecret(name) {
  const res = spawnSync('powershell.exe',
    ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', 'C:/Users/bryan/.secrets/get-secret.ps1', '-Name', name],
    { encoding: 'utf8' });
  if (res.status !== 0) throw new Error(`get-secret ${name}: ${res.stderr}`);
  return res.stdout.trim();
}

function parseEnv(text) {
  const out = {};
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('='); if (eq < 0) continue;
    const k = line.slice(0, eq).trim();
    let v = line.slice(eq + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    out[k] = v;
  }
  return out;
}

const envLocal = parseEnv(await readFile('.env.local', 'utf8'));

const envVars = {
  NEXT_PUBLIC_SUPABASE_URL:   { type: 'secret_text', value: envLocal.NEXT_PUBLIC_SUPABASE_URL },
  SUPABASE_SERVICE_ROLE_KEY:  { type: 'secret_text', value: envLocal.SUPABASE_SERVICE_ROLE_KEY },
  NEXT_PUBLIC_APP_URL:        { type: 'secret_text', value: 'https://partners.laquilamarketing.com.br' },
};

for (const [k, v] of Object.entries(envVars)) {
  if (!v.value) { console.error(`MISSING: ${k}`); process.exit(1); }
}

const cfToken = getSecret('cloudflare-api-token-laquila');
const ACCOUNT = '5eb312807ba0019b24f690f3f22879ab';
const PROJECT = 'laquila-partners';

const body = { deployment_configs: { production: { env_vars: envVars } } };
const res = await fetch(
  `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT}/pages/projects/${PROJECT}`,
  {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${cfToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }
);
const json = await res.json();
console.log(`HTTP ${res.status} success=${json.success}`);
if (!json.success) { console.log(JSON.stringify(json.errors, null, 2)); process.exit(1); }
console.log('Env vars aplicadas em produção.');
