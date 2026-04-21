// Google Sheets client usando fetch + Web Crypto (compatível com CF Workers/OpenNext).
// Reusa as credenciais Google Service Account configuradas em GOOGLE_SERVICE_ACCOUNT_EMAIL +
// GOOGLE_PRIVATE_KEY (mesmas usadas no laquila-forms pro Calendar).

const SHEETS_SCOPE = 'https://www.googleapis.com/auth/spreadsheets'
const TOKEN_URL = 'https://oauth2.googleapis.com/token'
const SHEETS_API = 'https://sheets.googleapis.com/v4'
const SHEET_TAB = 'Partners LP'

function getCredentials(): { clientEmail: string; privateKey: string } {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim()
  let privateKey = process.env.GOOGLE_PRIVATE_KEY?.trim()
  if (!clientEmail || !privateKey) {
    throw new Error('Google SA credentials missing (GOOGLE_SERVICE_ACCOUNT_EMAIL/GOOGLE_PRIVATE_KEY)')
  }
  if (privateKey.startsWith('"') && privateKey.endsWith('"')) privateKey = privateKey.slice(1, -1)
  privateKey = privateKey.replace(/\\n/g, '\n')
  return { clientEmail, privateKey }
}

function b64url(input: string | ArrayBuffer): string {
  let s: string
  if (typeof input === 'string') s = btoa(input)
  else {
    const arr = new Uint8Array(input)
    let bin = ''
    for (let i = 0; i < arr.byteLength; i++) bin += String.fromCharCode(arr[i])
    s = btoa(bin)
  }
  return s.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const b64 = pem.replace(/-----BEGIN [^-]+-----/g, '').replace(/-----END [^-]+-----/g, '').replace(/\s+/g, '')
  const bin = atob(b64)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return bytes.buffer
}

async function signJwt(payload: Record<string, unknown>, privateKeyPem: string): Promise<string> {
  const header = { alg: 'RS256', typ: 'JWT' }
  const data = `${b64url(JSON.stringify(header))}.${b64url(JSON.stringify(payload))}`
  const key = await crypto.subtle.importKey(
    'pkcs8',
    pemToArrayBuffer(privateKeyPem),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sig = await crypto.subtle.sign({ name: 'RSASSA-PKCS1-v1_5' }, key, new TextEncoder().encode(data))
  return `${data}.${b64url(sig)}`
}

async function getAccessToken(): Promise<string> {
  const { clientEmail, privateKey } = getCredentials()
  const now = Math.floor(Date.now() / 1000)
  const jwt = await signJwt({ iss: clientEmail, scope: SHEETS_SCOPE, aud: TOKEN_URL, iat: now, exp: now + 3600 }, privateKey)
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: jwt }),
  })
  if (!res.ok) throw new Error(`token exchange failed: ${res.status} ${await res.text()}`)
  const data = (await res.json()) as { access_token: string }
  return data.access_token
}

export const PARTNERS_HEADER = [
  'submitted_at', 'submission_id', 'name', 'email', 'phone', 'cidade_uf', 'escritorio', 'instagram',
  'area', 'funcionarios_escritorio', 'tempo_investimento', 'contratos_mes', 'investimento_trafego',
  'quem_roda_marketing', 'motivo', 'ambicao_12m', 'aceita_comissao',
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
] as const

function colLetter(n: number): string {
  let s = ''
  while (n > 0) { const r = (n - 1) % 26; s = String.fromCharCode(65 + r) + s; n = Math.floor((n - 1) / 26) }
  return s
}

async function sheetsFetch(url: string, token: string, init?: RequestInit): Promise<Response> {
  return fetch(url, { ...init, headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', ...(init?.headers || {}) } })
}

async function ensureTab(spreadsheetId: string, token: string): Promise<void> {
  const meta = await sheetsFetch(`${SHEETS_API}/spreadsheets/${spreadsheetId}?fields=sheets.properties`, token)
  if (!meta.ok) throw new Error(`sheets.get ${meta.status} ${await meta.text()}`)
  const j = (await meta.json()) as { sheets?: Array<{ properties: { title: string } }> }
  const exists = j.sheets?.some((s) => s.properties.title === SHEET_TAB)
  if (!exists) {
    const r = await sheetsFetch(`${SHEETS_API}/spreadsheets/${spreadsheetId}:batchUpdate`, token, {
      method: 'POST',
      body: JSON.stringify({
        requests: [{ addSheet: { properties: { title: SHEET_TAB, gridProperties: { rowCount: 1000, columnCount: PARTNERS_HEADER.length } } } }],
      }),
    })
    if (!r.ok) throw new Error(`addSheet ${r.status} ${await r.text()}`)
  }
  const headerRange = `${SHEET_TAB}!A1:${colLetter(PARTNERS_HEADER.length)}1`
  const chk = await sheetsFetch(`${SHEETS_API}/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(headerRange)}`, token)
  if (chk.ok) {
    const data = (await chk.json()) as { values?: string[][] }
    if (!data.values?.[0]?.length) {
      const put = await sheetsFetch(
        `${SHEETS_API}/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(headerRange)}?valueInputOption=RAW`,
        token,
        { method: 'PUT', body: JSON.stringify({ range: headerRange, values: [[...PARTNERS_HEADER]] }) }
      )
      if (!put.ok) throw new Error(`header write ${put.status} ${await put.text()}`)
    }
  }
}

export interface PartnersSheetRow {
  submitted_at: string; submission_id: string;
  name: string; email: string; phone: string; cidade_uf: string; escritorio: string; instagram?: string | null;
  area: string; funcionarios_escritorio: string; tempo_investimento: string; contratos_mes: string;
  investimento_trafego: string; quem_roda_marketing: string; motivo: string; ambicao_12m: string; aceita_comissao: string;
  utm_source?: string | null; utm_medium?: string | null; utm_campaign?: string | null;
  utm_content?: string | null; utm_term?: string | null;
}

export async function appendToPartnersSheet(spreadsheetId: string, row: PartnersSheetRow): Promise<void> {
  const token = await getAccessToken()
  await ensureTab(spreadsheetId, token)
  const values = PARTNERS_HEADER.map((k) => String(row[k] ?? ''))
  const range = `${SHEET_TAB}!A:${colLetter(PARTNERS_HEADER.length)}`
  const url = `${SHEETS_API}/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`
  const res = await sheetsFetch(url, token, { method: 'POST', body: JSON.stringify({ range, values: [values] }) })
  if (!res.ok) throw new Error(`append ${res.status} ${await res.text()}`)
}
