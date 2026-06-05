import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Aplicação recebida · Laquila Partners',
  description:
    'Sua aplicação foi recebida. O Partners prioriza escritórios com operação digital ativa.',
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
          <div className="eyebrow">Aplicação recebida</div>
          <h1>
            Recebemos seus dados. O Partners ainda pode não ser o <em>próximo passo</em>.
          </h1>
          <p className="lede">
            O Laquila Partners foi desenhado para escritórios que já têm operação digital ativa,
            investimento recorrente e contratos fechando com consistência. Se esse ainda não é o seu
            momento, o caminho certo é estruturar a base antes de entrar numa parceria avançada.
          </p>
          <div className="cta-row">
            <a
              href="https://forms.laquilamarketing.com.br/aplicacao"
              className="btn btn-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Aplicar para assessoria sem comissão
            </a>
            <Link href="/" className="btn btn-outline">
              Rever critérios do Partners
            </Link>
          </div>
        </div>
      </section>

      <section className="alt">
        <div className="container">
          <div className="section-head">
            <div className="eyebrow">O que faz sentido agora</div>
            <h2>Primeiro, construir uma operação que consiga sustentar escala.</h2>
            <p className="lede">
              Antes do Partners, o escritório precisa validar o digital como canal. Isso significa
              captar, atender, qualificar e fechar com previsibilidade mínima.
            </p>
          </div>

          <div className="steps">
            <div className="step">
              <h3>Captação consistente</h3>
              <p>
                Criar uma entrada previsível de oportunidades, com campanhas e criativos ajustados
                para trabalhista ou previdenciário.
              </p>
            </div>
            <div className="step">
              <h3>Atendimento organizado</h3>
              <p>
                Ter cadência, script e rotina comercial para separar curiosos de casos com chance
                real de contrato.
              </p>
            </div>
            <div className="step">
              <h3>Primeiros contratos pelo digital</h3>
              <p>
                Fechar com recorrência suficiente para saber quais teses, canais e abordagens valem
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
            <h2>Quando a base estiver pronta, você pode voltar para o Partners.</h2>
            <p className="lede">
              Quando seu escritório tiver operação digital ativa, investimento recorrente e
              contratos fechando com consistência, a candidatura passa a fazer mais sentido. Até lá,
              a Laquila Marketing pode ser o caminho anterior.
            </p>
          </div>
          <div className="filter-grid">
            <div className="filter-card ok">
              <h3>Bom momento para assessoria</h3>
              <ul>
                <li>Você ainda está validando o digital como canal</li>
                <li>Você fecha poucos contratos por mês vindos do digital</li>
                <li>Você precisa organizar tráfego, atendimento e rotina comercial</li>
              </ul>
            </div>
            <div className="filter-card not">
              <h3>Ainda não é Partners se</h3>
              <ul>
                <li>Não existe investimento recorrente em tráfego</li>
                <li>Não há volume mínimo de contratos digitais</li>
                <li>O modelo por comissão ainda não faz sentido para você</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="closing">
        <div className="container">
          <div className="eyebrow" style={{ color: 'var(--accent)', marginBottom: 12 }}>
            Próximo passo
          </div>
          <h2>Comece pela estrutura. Depois, escala.</h2>
          <p className="lede">
            Se o seu escritório ainda está amadurecendo no digital, fale com a Laquila Marketing
            sobre a assessoria de marketing sem comissão.
          </p>
          <a
            href="https://forms.laquilamarketing.com.br/aplicacao"
            className="btn btn-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            Aplicar para assessoria sem comissão
          </a>
        </div>
      </section>

      <footer>
        <div className="container">
          <div>© Laquila Partners · uma operação da Laquila Marketing</div>
          <div>
            <a href="https://laquilamarketing.com.br">laquilamarketing.com.br</a>
          </div>
        </div>
      </footer>
    </>
  );
}
