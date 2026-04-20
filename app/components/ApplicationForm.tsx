'use client';

import { useEffect, useState } from 'react';

type State = { status: 'idle' } | { status: 'submitting' } | { status: 'success' } | { status: 'error'; message: string };

const TRACKING_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;

function readCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.split('; ').find((c) => c.startsWith(name + '='));
  return match ? decodeURIComponent(match.split('=').slice(1).join('=')) : undefined;
}

function maskPhoneBR(v: string): string {
  const digits = v.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export default function ApplicationForm() {
  const [state, setState] = useState<State>({ status: 'idle' });
  const [phone, setPhone] = useState('');

  useEffect(() => {
    // preenche hidden inputs com UTMs e fbp/fbc ao montar
    const url = new URL(window.location.href);
    TRACKING_KEYS.forEach((k) => {
      const el = document.getElementById(`f-${k}`) as HTMLInputElement | null;
      if (el) el.value = url.searchParams.get(k) || '';
    });
    const fbp = readCookie('_fbp');
    const fbc = readCookie('_fbc') || url.searchParams.get('fbclid') || '';
    const fbpEl = document.getElementById('f-fbp') as HTMLInputElement | null;
    const fbcEl = document.getElementById('f-fbc') as HTMLInputElement | null;
    if (fbpEl) fbpEl.value = fbp || '';
    if (fbcEl) fbcEl.value = fbc || '';
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload: Record<string, string> = {};
    fd.forEach((v, k) => {
      if (typeof v === 'string' && v.trim() !== '') payload[k] = v.trim();
    });
    // phone: guardar só dígitos no backend
    if (payload.phone) payload.phone = payload.phone.replace(/\D/g, '');

    setState({ status: 'submitting' });
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setState({
          status: 'error',
          message: json?.detail || 'Não conseguimos registrar. Tente novamente em instantes.',
        });
        return;
      }
      setState({ status: 'success' });
      form.reset();
      setPhone('');
    } catch {
      setState({
        status: 'error',
        message: 'Falha de rede. Verifique sua conexão e tente novamente.',
      });
    }
  }

  if (state.status === 'success') {
    return (
      <div className="form-wrap">
        <div className="form-success">
          <h3>Aplicação recebida.</h3>
          <p>
            Nosso time analisa cada aplicação manualmente. Se houver fit, entramos em contato pelo
            WhatsApp nos próximos dias úteis.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form className="form-wrap" onSubmit={onSubmit} noValidate>
      <div className="eyebrow" style={{ marginBottom: 10 }}>
        Aplicação
      </div>
      <h2>Conte como o seu escritório opera hoje.</h2>
      <p className="lede">
        3 minutos. Só pedimos o que é essencial pra gente avaliar o fit. O time lê cada aplicação.
      </p>

      {state.status === 'error' && <div className="form-error">{state.message}</div>}

      <div className="field">
        <label htmlFor="f-name">
          Nome completo<span className="req">*</span>
        </label>
        <input id="f-name" name="name" type="text" required autoComplete="name" maxLength={120} />
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="f-email">
            E-mail<span className="req">*</span>
          </label>
          <input
            id="f-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            maxLength={200}
          />
        </div>
        <div className="field">
          <label htmlFor="f-phone">
            WhatsApp<span className="req">*</span>
          </label>
          <input
            id="f-phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            inputMode="numeric"
            placeholder="(44) 99999-9999"
            value={phone}
            onChange={(e) => setPhone(maskPhoneBR(e.target.value))}
          />
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="f-area">
            Especialidade principal<span className="req">*</span>
          </label>
          <select id="f-area" name="area" required defaultValue="">
            <option value="" disabled>
              Selecione
            </option>
            <option value="trabalhista">Trabalhista</option>
            <option value="previdenciario">Previdenciário</option>
            <option value="ambas">Trabalhista + Previdenciário</option>
            <option value="outra">Outra área</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="f-funcionarios">
            Tamanho do escritório<span className="req">*</span>
          </label>
          <select id="f-funcionarios" name="funcionarios_escritorio" required defaultValue="">
            <option value="" disabled>
              Selecione
            </option>
            <option value="solo">Atuo sozinho(a)</option>
            <option value="2-3">2 a 3 advogados</option>
            <option value="4+">4 ou mais advogados</option>
          </select>
        </div>
      </div>

      <input id="f-utm_source" type="hidden" name="utm_source" />
      <input id="f-utm_medium" type="hidden" name="utm_medium" />
      <input id="f-utm_campaign" type="hidden" name="utm_campaign" />
      <input id="f-utm_content" type="hidden" name="utm_content" />
      <input id="f-utm_term" type="hidden" name="utm_term" />
      <input id="f-fbp" type="hidden" name="fbp" />
      <input id="f-fbc" type="hidden" name="fbc" />

      <button
        type="submit"
        className="btn btn-primary"
        disabled={state.status === 'submitting'}
      >
        {state.status === 'submitting' ? 'Enviando…' : 'Enviar aplicação'}
      </button>

      <p className="form-note">
        A aplicação não te compromete com nada. Se houver fit, a gente chama para uma conversa.
      </p>
    </form>
  );
}
