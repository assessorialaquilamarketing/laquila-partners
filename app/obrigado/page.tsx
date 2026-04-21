import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Aplicação recebida · Laquila Partners',
  description: 'Sua aplicação foi registrada. Nosso time analisa e entra em contato se houver fit.',
  robots: { index: false, follow: false },
};

export default function ObrigadoPage() {
  return (
    <>
      <header className="topbar">
        <div className="container">
          <div className="brand">
            Laquila <span>Partners</span>
          </div>
          <Link href="/" className="btn btn-outline">Voltar ao site</Link>
        </div>
      </header>

      <section className="hero">
        <div className="container">
          <div className="eyebrow">Aplicação recebida</div>
          <h1>Obrigado. A gente leu sua <em>aplicação</em>.</h1>
          <p className="lede">
            Cada candidatura é analisada manualmente pelo time. Se houver fit com o perfil
            Partners, a gente entra em contato pelo WhatsApp dentro de <strong>48 horas úteis</strong>.
            Você não precisa fazer mais nada agora — a gente te procura.
          </p>
          <div className="cta-row">
            <Link href="/" className="btn btn-outline">Voltar à página inicial</Link>
            <a
              href="https://www.instagram.com/laquilamarketing/"
              className="btn btn-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Conhecer a Laquila Marketing
            </a>
          </div>
        </div>
      </section>

      <section className="alt">
        <div className="container">
          <div className="section-head">
            <div className="eyebrow">O que acontece agora</div>
            <h2>Três etapas até a conversa.</h2>
            <p className="lede">Transparência total no processo. Sem espera no escuro, sem letra miúda.</p>
          </div>
          <div className="steps">
            <div className="step">
              <h3>Análise manual</h3>
              <p>O time lê sua aplicação com calma, avalia fit de ICP e a maturidade da sua operação atual.</p>
            </div>
            <div className="step">
              <h3>Retorno em 48h úteis</h3>
              <p>Se houver fit, entramos em contato no WhatsApp pra marcar uma conversa curta. Se não houver, a gente responde também — sem deixar você no escuro.</p>
            </div>
            <div className="step">
              <h3>Conversa de alinhamento</h3>
              <p>Entendemos sua operação, apresentamos o Partners, calibramos a modalidade comercial e, se fizer sentido pros dois lados, começa a parceria.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="closing">
        <div className="container">
          <div className="eyebrow" style={{ color: 'var(--accent)', marginBottom: 12 }}>
            Enquanto a gente revisa
          </div>
          <h2>Nosso próximo parceiro pode ser você.</h2>
          <p className="lede">
            Se quiser, dá uma olhada no que fazemos hoje na operação da Laquila Marketing — é a base sobre a qual
            o Partners foi construído.
          </p>
          <a
            href="https://www.instagram.com/laquilamarketing/"
            className="btn btn-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ver a Laquila Marketing
          </a>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container">
          <div>© Laquila Partners · uma operação da Laquila Marketing</div>
          <div>
            <a href="https://lp.laquilamarketing.com.br">lp.laquilamarketing.com.br</a>
          </div>
        </div>
      </footer>
    </>
  );
}
