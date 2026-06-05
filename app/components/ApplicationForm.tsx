'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type State = { status: 'idle' } | { status: 'submitting' } | { status: 'error'; message: string };

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

const FIELD_LABELS: Record<string, string> = {
  name: 'Nome completo',
  email: 'E-mail',
  phone: 'WhatsApp',
  cidade_uf: 'Cidade / UF',
  escritorio: 'Nome do escritório',
  instagram: 'Instagram',
  area: 'Especialidade principal',
  funcionarios_escritorio: 'Tamanho do escritório',
  tempo_investimento: 'Tempo em marketing digital',
  contratos_mes: 'Contratos por mês',
  investimento_trafego: 'Investimento em tráfego',
  quem_roda_marketing: 'Quem roda o marketing',
  motivo: 'Motivo da candidatura',
  ambicao_12m: 'Ambição em 12 meses',
  aceita_comissao: 'Modelo de comissão',
};

const SELECT_FIELDS = new Set([
  'area',
  'funcionarios_escritorio',
  'tempo_investimento',
  'contratos_mes',
  'investimento_trafego',
  'quem_roda_marketing',
  'aceita_comissao',
]);

function translateZodMsg(msg: string, field: string): string {
  const lower = msg.toLowerCase();
  const isMissing =
    lower.includes('required') ||
    lower.includes('received undefined') ||
    lower.includes('expected string') ||
    lower.includes('expected object') ||
    lower.includes('expected number');

  if (isMissing) {
    return SELECT_FIELDS.has(field) ? 'Selecione uma opção.' : 'Preencha este campo.';
  }
  if (lower.includes('email')) return 'Informe um e-mail válido.';
  const n = (msg.match(/(\d+)/) ?? [])[1] ?? '';
  if (lower.includes('small') || lower.includes('>=') || lower.includes('minimum') || lower.includes('at least')) {
    if (field === 'phone') return `Informe um WhatsApp com pelo menos ${n} dígitos.`;
    return `Use pelo menos ${n} caracteres.`;
  }
  if (lower.includes('large') || lower.includes('<=') || lower.includes('maximum') || lower.includes('at most')) {
    return `Use no máximo ${n} caracteres.`;
  }
  if (lower.includes('invalid') || lower.includes('enum') || lower.includes('expected')) {
    return SELECT_FIELDS.has(field) ? 'Selecione uma opção válida.' : 'Valor inválido.';
  }
  return 'Valor inválido.';
}

function zodIssuesToMessage(issues: { fieldErrors?: Record<string, string[]> }): string {
  const errs = issues?.fieldErrors ?? {};
  const msgs = Object.entries(errs)
    .filter(([, v]) => v && v.length > 0)
    .map(([k]) => FIELD_LABELS[k] ?? k);
  if (msgs.length === 0) return 'Verifique os campos e tente novamente.';
  if (msgs.length === 1) return `Corrija o campo: ${msgs[0]}.`;
  return `Corrija os campos: ${msgs.join(', ')}.`;
}

export default function ApplicationForm() {
  const router = useRouter();
  const [state, setState] = useState<State>({ status: 'idle' });
  const [phone, setPhone] = useState('');
  const [aceitaComissao, setAceitaComissao] = useState('');
  const [investimentoTrafego, setInvestimentoTrafego] = useState('');
  const [contratosMes, setContratosMes] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const mostraBotaoAlt =
    investimentoTrafego === 'nao_invisto' ||
    contratosMes === '<5' ||
    aceitaComissao === 'nao';

  function clearFieldError(name: string) {
    setFieldErrors((current) => {
      if (!current[name]) return current;
      const next = { ...current };
      delete next[name];
      return next;
    });
  }

  function onFormChange(e: React.FormEvent<HTMLFormElement>) {
    const target = e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    if (target.name) clearFieldError(target.name);
  }

  function focusFirstError(errs: Record<string, string>) {
    const first = Object.keys(errs)[0];
    if (!first) return;
    window.setTimeout(() => {
      const el = document.querySelector<HTMLElement>(`[name="${first}"]`);
      el?.focus();
      el?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }, 0);
  }

  useEffect(() => {
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
    if (payload.phone) payload.phone = payload.phone.replace(/\D/g, '');

    if (
      payload.investimento_trafego === 'nao_invisto' ||
      payload.contratos_mes === '<5' ||
      payload.aceita_comissao === 'nao'
    ) {
      router.push('/obrigado/nao-qualificado');
      return;
    }

    setFieldErrors({});
    setState({ status: 'submitting' });
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json?.skipped && typeof json.redirect === 'string') {
        router.push(json.redirect);
        return;
      }
      if (!res.ok || !json.ok) {
        if (json?.error === 'invalid_payload') {
          const errs: Record<string, string> = {};
          const fieldIssues = (json.issues?.fieldErrors ?? {}) as Record<string, string[]>;
          for (const [k, msgs] of Object.entries(fieldIssues)) {
            if (Array.isArray(msgs) && msgs.length > 0) {
              errs[k] = translateZodMsg(String(msgs[0]), k);
            }
          }
          setFieldErrors(errs);
          focusFirstError(errs);
          setState({ status: 'error', message: zodIssuesToMessage(json.issues) });
        } else {
          setState({
            status: 'error',
            message: json?.detail || json?.error || 'Não conseguimos registrar. Tente novamente em instantes.',
          });
        }
        return;
      }

      const eventID = String(json.response_id ?? json.lead_id ?? Date.now());
      router.push('/obrigado?rid=' + encodeURIComponent(eventID));
    } catch {
      setState({
        status: 'error',
        message: 'Falha de rede. Verifique sua conexão e tente novamente.',
      });
    }
  }

  return (
    <form className="form-wrap" onSubmit={onSubmit} onChange={onFormChange} noValidate id="aplicacao">
      <div className="eyebrow" style={{ marginBottom: 10 }}>Aplicação</div>
      <h2>Conte como o seu escritório opera hoje.</h2>
      <p className="lede">
        O time lê cada aplicação. Só pedimos o que é essencial pra avaliar fit e chamar
        você pra uma conversa se fizer sentido.
      </p>

      {state.status === 'error' && <div className="form-error">{state.message}</div>}

      <div className="form-section-tag">Quem é você</div>

      <div className="field">
        <label htmlFor="f-name">Nome completo<span className="req">*</span></label>
        <input id="f-name" name="name" type="text" required autoComplete="name" maxLength={120}
          className={fieldErrors.name ? 'has-error' : undefined} />
        {fieldErrors.name && <p className="field-hint-error">{fieldErrors.name}</p>}
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="f-email">E-mail<span className="req">*</span></label>
          <input id="f-email" name="email" type="email" required autoComplete="email" maxLength={200}
            className={fieldErrors.email ? 'has-error' : undefined} />
          {fieldErrors.email && <p className="field-hint-error">{fieldErrors.email}</p>}
        </div>
        <div className="field">
          <label htmlFor="f-phone">WhatsApp<span className="req">*</span></label>
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
            className={fieldErrors.phone ? 'has-error' : undefined}
          />
          {fieldErrors.phone && <p className="field-hint-error">{fieldErrors.phone}</p>}
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="f-cidade_uf">Cidade / UF<span className="req">*</span></label>
          <input id="f-cidade_uf" name="cidade_uf" type="text" required maxLength={120} placeholder="São Paulo / SP"
            className={fieldErrors.cidade_uf ? 'has-error' : undefined} />
          {fieldErrors.cidade_uf && <p className="field-hint-error">{fieldErrors.cidade_uf}</p>}
        </div>
        <div className="field">
          <label htmlFor="f-escritorio">Nome do escritório<span className="req">*</span></label>
          <input id="f-escritorio" name="escritorio" type="text" required maxLength={200}
            className={fieldErrors.escritorio ? 'has-error' : undefined} />
          {fieldErrors.escritorio && <p className="field-hint-error">{fieldErrors.escritorio}</p>}
        </div>
      </div>

      <div className="field">
        <label htmlFor="f-instagram">Instagram do escritório</label>
        <input id="f-instagram" name="instagram" type="text" maxLength={120} placeholder="@seuescritorio"
          className={fieldErrors.instagram ? 'has-error' : undefined} />
        {fieldErrors.instagram && <p className="field-hint-error">{fieldErrors.instagram}</p>}
      </div>

      <div className="form-section-tag">Sua operação hoje</div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="f-area">Especialidade principal<span className="req">*</span></label>
          <select id="f-area" name="area" required defaultValue=""
            className={fieldErrors.area ? 'has-error' : undefined}>
            <option value="" disabled>Selecione</option>
            <option value="trabalhista">Trabalhista</option>
            <option value="previdenciario">Previdenciário</option>
            <option value="ambas">Trabalhista + Previdenciário</option>
            <option value="outra">Outra área</option>
          </select>
          {fieldErrors.area && <p className="field-hint-error">{fieldErrors.area}</p>}
        </div>
        <div className="field">
          <label htmlFor="f-funcionarios">Tamanho do escritório<span className="req">*</span></label>
          <select id="f-funcionarios" name="funcionarios_escritorio" required defaultValue=""
            className={fieldErrors.funcionarios_escritorio ? 'has-error' : undefined}>
            <option value="" disabled>Selecione</option>
            <option value="solo">Atuo sozinho(a)</option>
            <option value="2-3">2 a 3 advogados</option>
            <option value="4+">4 ou mais advogados</option>
          </select>
          {fieldErrors.funcionarios_escritorio && <p className="field-hint-error">{fieldErrors.funcionarios_escritorio}</p>}
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="f-tempo_investimento">Há quanto tempo você investe em marketing digital?<span className="req">*</span></label>
          <select id="f-tempo_investimento" name="tempo_investimento" required defaultValue=""
            className={fieldErrors.tempo_investimento ? 'has-error' : undefined}>
            <option value="" disabled>Selecione</option>
            <option value="ate6m">Menos de 6 meses</option>
            <option value="6a12m">6 a 12 meses</option>
            <option value="1a2a">1 a 2 anos</option>
            <option value="+2a">Mais de 2 anos</option>
          </select>
          {fieldErrors.tempo_investimento && <p className="field-hint-error">{fieldErrors.tempo_investimento}</p>}
        </div>
        <div className="field">
          <label htmlFor="f-contratos_mes">Contratos fechados por mês (digital, média)<span className="req">*</span></label>
          <select id="f-contratos_mes" name="contratos_mes" required value={contratosMes} onChange={(e) => setContratosMes(e.target.value)}
            className={fieldErrors.contratos_mes ? 'has-error' : undefined}>
            <option value="" disabled>Selecione</option>
            <option value="<5">Menos de 5</option>
            <option value="5a15">5 a 15</option>
            <option value="15a30">15 a 30</option>
            <option value="30a60">30 a 60</option>
            <option value="+60">Mais de 60</option>
          </select>
          {fieldErrors.contratos_mes && <p className="field-hint-error">{fieldErrors.contratos_mes}</p>}
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="f-investimento_trafego">Investimento mensal em tráfego pago<span className="req">*</span></label>
          <select
            id="f-investimento_trafego"
            name="investimento_trafego"
            required
            value={investimentoTrafego}
            onChange={(e) => setInvestimentoTrafego(e.target.value)}
            className={fieldErrors.investimento_trafego ? 'has-error' : undefined}
          >
            <option value="" disabled>Selecione</option>
            <option value="nao_invisto">Ainda não invisto em tráfego</option>
            <option value="<5k">Até R$ 5 mil</option>
            <option value="5a15k">R$ 5 mil a R$ 15 mil</option>
            <option value="15a30k">R$ 15 mil a R$ 30 mil</option>
            <option value="30a60k">R$ 30 mil a R$ 60 mil</option>
            <option value="+60k">Mais de R$ 60 mil</option>
          </select>
          {fieldErrors.investimento_trafego && <p className="field-hint-error">{fieldErrors.investimento_trafego}</p>}
        </div>
        <div className="field">
          <label htmlFor="f-quem_roda_marketing">Quem roda seu marketing hoje?<span className="req">*</span></label>
          <select id="f-quem_roda_marketing" name="quem_roda_marketing" required defaultValue=""
            className={fieldErrors.quem_roda_marketing ? 'has-error' : undefined}>
            <option value="" disabled>Selecione</option>
            <option value="agencia">Agência</option>
            <option value="freela">Freelancer / consultor</option>
            <option value="inhouse">Equipe interna (in-house)</option>
            <option value="eu">Eu mesmo</option>
            <option value="nenhum">Ninguém / sem estrutura</option>
          </select>
          {fieldErrors.quem_roda_marketing && <p className="field-hint-error">{fieldErrors.quem_roda_marketing}</p>}
        </div>
      </div>

      <div className="form-section-tag">Aonde você quer chegar</div>

      <div className="field">
        <label htmlFor="f-motivo">Por que você está se candidatando ao Partners?<span className="req">*</span></label>
        <textarea id="f-motivo" name="motivo" required maxLength={1000} rows={3} placeholder="Em 2-3 linhas."
          className={fieldErrors.motivo ? 'has-error' : undefined} />
        {fieldErrors.motivo && <p className="field-hint-error">{fieldErrors.motivo}</p>}
      </div>

      <div className="field">
        <label htmlFor="f-ambicao_12m">Em 12 meses, onde você quer que seu escritório esteja?<span className="req">*</span></label>
        <textarea id="f-ambicao_12m" name="ambicao_12m" required maxLength={1000} rows={2} placeholder="Em 1-2 linhas."
          className={fieldErrors.ambicao_12m ? 'has-error' : undefined} />
        {fieldErrors.ambicao_12m && <p className="field-hint-error">{fieldErrors.ambicao_12m}</p>}
      </div>

      <div className="field">
        <label htmlFor="f-aceita_comissao">Você entende e aceita o modelo de comissão sobre contratos fechados?<span className="req">*</span></label>
        <select
          id="f-aceita_comissao"
          name="aceita_comissao"
          required
          value={aceitaComissao}
          onChange={(e) => setAceitaComissao(e.target.value)}
          className={fieldErrors.aceita_comissao ? 'has-error' : undefined}
        >
          <option value="" disabled>Selecione</option>
          <option value="sim">Sim, é exatamente isso que estou buscando</option>
          <option value="entender">Quero entender melhor na conversa</option>
          <option value="hibrido">Prefiro explorar a modalidade híbrida</option>
          <option value="nao">Não tenho interesse nesse formato</option>
        </select>
        {fieldErrors.aceita_comissao && <p className="field-hint-error">{fieldErrors.aceita_comissao}</p>}
      </div>

      <input id="f-utm_source" type="hidden" name="utm_source" />
      <input id="f-utm_medium" type="hidden" name="utm_medium" />
      <input id="f-utm_campaign" type="hidden" name="utm_campaign" />
      <input id="f-utm_content" type="hidden" name="utm_content" />
      <input id="f-utm_term" type="hidden" name="utm_term" />
      <input id="f-fbp" type="hidden" name="fbp" />
      <input id="f-fbc" type="hidden" name="fbc" />

      {mostraBotaoAlt ? (
        <button
          type="button"
          className="btn btn-primary btn-alt-cta"
          onClick={() => { router.push('/obrigado/nao-qualificado'); }}
        >
          APLICAR PARA ASSESSORIA SEM COMISSÃO
        </button>
      ) : (
        <button
          type="submit"
          className="btn btn-primary"
          disabled={state.status === 'submitting'}
        >
          {state.status === 'submitting' ? 'Enviando…' : 'Enviar aplicação'}
        </button>
      )}

      <p className="form-note">
        A aplicação não te compromete com nada. Se houver fit, a gente chama para uma conversa sem horário marcado.
      </p>
    </form>
  );
}
