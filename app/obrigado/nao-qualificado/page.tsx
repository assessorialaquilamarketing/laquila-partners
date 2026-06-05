import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Aplicacao recebida · Laquila Partners',
  description:
    'Sua aplicacao foi recebida. O Partners prioriza escritorios com operacao digital ativa.',
  robots: { index: false, follow: false },
};

export default function ObrigadoNaoQualificadoPage() {
  return (
    <>
      <header className="topbar">
        <div className="container">
          <div className="brand">
            Laquila <span>Partners</span>
          </div>
          <Link href="/" className="btn btn-outline">
            Voltar ao site
          </Link>
        </div>
      </header>

      <section className="hero">
        <div className="container">
          <div className="eyebrow">Aplicacao recebida</div>
          <h1>
            Recebemos seus dados. O Partners ainda pode nao ser o <em>proximo passo</em>.
          </h1>
          <p className="lede">
            O Laquila Partners foi desenhado para escritorios que ja tem operacao digital ativa,
            investimento recorrente e contratos fechando com consistencia. Se esse ainda nao e o seu
            momento, o caminho certo e estruturar a base antes de entrar numa parceria avancada.
          </p>
          <div className="cta-row">
            <a
              href="https://forms.laquilamarketing.com.br/aplicacao"
              className="btn btn-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Aplicar para assessoria sem comissao
            </a>
            <Link href="/" className="btn btn-outline">
              Rever criterios do Partners
            </Link>
          </div>
        </div>
      </section>

      <section className="alt">
        <div className="container">
          <div className="section-head">
            <div className="eyebrow">O que faz sentido agora</div>
            <h2>Primeiro, construir uma operacao que consiga sustentar escala.</h2>
            <p className="lede">
              Antes do Partners, o escritorio precisa validar o digital como canal. Isso significa
              captar, atender, qualificar e fechar com previsibilidade minima.
            </p>
          </div>

          <div className="steps">
            <div className="step">
              <h3>Captacao consistente</h3>
              <p>
                Criar uma entrada previsivel de oportunidades, com campanhas e criativos ajustados
                para trabalhista ou previdenciario.
              </p>
            </div>
            <div className="step">
              <h3>Atendimento organizado</h3>
              <p>
                Ter cadencia, script e rotina comercial para separar curiosos de casos com chance
                real de contrato.
              </p>
            </div>
            <div className="step">
              <h3>Primeiros contratos pelo digital</h3>
              <p>
                Fechar com recorrencia suficiente para saber quais teses, canais e abordagens valem
                investimento.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="container" style={{ maxWidth: 820 }}>
          <div className="section-head">
            <div className="eyebrow">Sem porta fechada</div>
            <h2>Quando a base estiver pronta, voce pode voltar para o Partners.</h2>
            <p className="lede">
              Quando seu escritorio tiver operacao digital ativa, investimento recorrente e
              contratos fechando com consistencia, a candidatura passa a fazer mais sentido. Ate la,
              a Laquila Marketing pode ser o caminho anterior.
            </p>
          </div>
          <div className="filter-grid">
            <div className="filter-card ok">
              <h3>Bom momento para assessoria</h3>
              <ul>
                <li>Voce ainda esta validando o digital como canal</li>
                <li>Voce fecha poucos contratos por mes vindos do digital</li>
                <li>Voce precisa organizar trafego, atendimento e rotina comercial</li>
              </ul>
            </div>
            <div className="filter-card not">
              <h3>Ainda nao e Partners se</h3>
              <ul>
                <li>Nao existe investimento recorrente em trafego</li>
                <li>Nao ha volume minimo de contratos digitais</li>
                <li>O modelo por comissao ainda nao faz sentido para voce</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="closing">
        <div className="container">
          <div className="eyebrow" style={{ color: 'var(--accent)', marginBottom: 12 }}>
            Proximo passo
          </div>
          <h2>Comece pela estrutura. Depois, escala.</h2>
          <p className="lede">
            Se o seu escritorio ainda esta amadurecendo no digital, fale com a Laquila Marketing
            sobre a assessoria de marketing sem comissao.
          </p>
          <a
            href="https://forms.laquilamarketing.com.br/aplicacao"
            className="btn btn-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            Aplicar para assessoria sem comissao
          </a>
        </div>
      </section>

      <footer>
        <div className="container">
          <div>© Laquila Partners · uma operacao da Laquila Marketing</div>
          <div>
            <a href="https://laquilamarketing.com.br">laquilamarketing.com.br</a>
          </div>
        </div>
      </footer>
    </>
  );
}
