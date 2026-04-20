import ApplicationForm from './components/ApplicationForm';

export default function Page() {
  return (
    <>
      <header className="topbar">
        <div className="container">
          <div className="brand">
            Laquila <span>Partners</span>
          </div>
          <a href="#aplicacao" className="btn btn-outline">
            Candidatar-se
          </a>
        </div>
      </header>

      <section className="hero">
        <div className="container">
          <div className="eyebrow">Exclusivo · Trabalhista e Previdenciário</div>
          <h1>
            Você já venceu a fase de <em>começar</em>. A sua próxima fronteira não é mais anúncio.
          </h1>
          <p className="lede">
            Laquila Partners é uma operação de marketing jurídico criada para advogados
            trabalhistas e previdenciários que já fecham contratos pelo digital e querem virar
            referência do segmento. Você paga comissão sobre os contratos fechados — alinhado ao
            seu resultado, não ao nosso serviço.
          </p>
          <div className="cta-row">
            <a href="#aplicacao" className="btn btn-primary">
              Quero me candidatar
            </a>
            <a href="#como-funciona" className="btn btn-outline">
              Ver como funciona
            </a>
          </div>
          <div className="proof">
            <div className="stat">
              <div className="num">1.000+</div>
              <div className="lbl">escritórios atendidos em 2 anos</div>
            </div>
            <div className="stat">
              <div className="num">300</div>
              <div className="lbl">escritórios ativos hoje</div>
            </div>
            <div className="stat">
              <div className="num">R$ 1M+</div>
              <div className="lbl">por mês em tráfego gerenciado</div>
            </div>
            <div className="stat">
              <div className="num">1.000+</div>
              <div className="lbl">contratos/mês no escritório do Eduardo Laquila</div>
            </div>
          </div>
        </div>
      </section>

      <section className="alt">
        <div className="container">
          <div className="section-head">
            <div className="eyebrow">Filtro honesto</div>
            <h2>Partners não é pra todo escritório. E está tudo bem.</h2>
            <p className="lede">
              A gente prefere dizer pra quem é e pra quem não é agora, do que descobrir no meio do
              caminho. Entrega densa exige fit real.
            </p>
          </div>

          <div className="filter-grid">
            <div className="filter-card ok">
              <h3>Partners é pra você se:</h3>
              <ul>
                <li>Sua especialidade principal é trabalhista e/ou previdenciário</li>
                <li>Você já fecha contratos pelo digital todo mês, de forma consistente</li>
                <li>Você tem equipe mínima rodando (SDR/atendente + advogados)</li>
                <li>Seu objetivo passou de &quot;faturar mais&quot; pra &quot;virar referência do segmento&quot;</li>
                <li>Você aceita medição real — contrato fechado como KPI, não lead</li>
                <li>Você enxerga comissão como alinhamento, não como custo</li>
              </ul>
            </div>
            <div className="filter-card not">
              <h3>Partners não é pra você se:</h3>
              <ul>
                <li>Você está começando e ainda não valida digital como canal</li>
                <li>Você não tem operação estruturada — só atende sozinho</li>
                <li>Você prefere terceirizar e não quer acompanhar os números da operação</li>
                <li>Você não aceita compartilhar dados de contrato fechado com parceiro</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="modelo">
        <div className="container">
          <div className="section-head">
            <div className="eyebrow">O modelo</div>
            <h2>A gente ganha quando você ganha. Comissão sobre contratos fechados.</h2>
            <p className="lede">
              A lógica é simples. Quando você fecha contrato, a gente ganha uma parte. Quando você
              não fecha, a gente também não recebe. Não existe forma mais clara de alinhar o nosso
              trabalho ao seu resultado.
            </p>
          </div>

          <div className="model">
            <div className="badge">Duas modalidades</div>
            <h2>Você escolhe como quer pagar.</h2>
            <p>
              Conforme o seu apetite de risco de custo fixo, a gente calibra a equação entre
              mensalidade e comissão. As duas modalidades entregam exatamente as mesmas vantagens —
              o que muda é só a forma de pagar.
            </p>

            <div className="modal-options">
              <div className="option">
                <div className="option-tag">Modalidade A</div>
                <h3>Comissão pura</h3>
                <p style={{ color: 'var(--ink-2)', fontSize: 15 }}>
                  Sem mensalidade. 100% do que você paga vem de uma comissão sobre os contratos que
                  a gente fechar junto com você.
                </p>
                <div className="who">
                  <strong>Pra quem:</strong> advogado que quer risco-zero de custo fixo e aceita %
                  maior quando o resultado chegar.
                </div>
              </div>
              <div className="option">
                <div className="option-tag">Modalidade B</div>
                <h3>Híbrido — mensalidade abaixo de mercado + comissão reduzida</h3>
                <p style={{ color: 'var(--ink-2)', fontSize: 15 }}>
                  Uma mensalidade menor do que qualquer agência premium cobra, combinada com uma
                  comissão menor sobre os contratos fechados.
                </p>
                <div className="who">
                  <strong>Pra quem:</strong> advogado que prefere custo mensal previsível e topo de
                  comissão mais suave.
                </div>
              </div>
            </div>

            <p style={{ marginTop: 24, fontSize: 15, color: 'var(--ink-2)' }}>
              Os percentuais exatos e faixas de mensalidade dependem do seu volume e ticket médio
              atual. A gente calibra tudo na conversa depois da aplicação — sem pegadinha, sem
              letra miúda.
            </p>
          </div>
        </div>
      </section>

      <section className="alt">
        <div className="container">
          <div className="section-head">
            <div className="eyebrow">O que você recebe</div>
            <h2>
              Tudo que a operação Laquila já entrega, mais uma camada que o mercado não tem como
              copiar.
            </h2>
            <p className="lede">
              Partners é a operação da Laquila Marketing acrescida de acesso direto à liderança do
              escritório do Eduardo Laquila. Não é serviço terceirizado. É parceria operacional.
            </p>
          </div>

          <div className="benefits">
            <div className="benefit">
              <div className="tag">Equipe</div>
              <h3>Time elite dedicado</h3>
              <p>
                Gestor sênior nomeado no seu projeto. Sem conta compartilhada com 30 outros
                escritórios.
              </p>
            </div>
            <div className="benefit">
              <div className="tag">Liderança</div>
              <h3>Acesso direto à liderança</h3>
              <p>
                Mentoria com quem opera o escritório que fecha mais de mil contratos por mês. Você
                aprende com quem está fazendo agora, não com quem teoriza.
              </p>
            </div>
            <div className="benefit">
              <div className="tag">Dados</div>
              <h3>Rastreamento até o contrato fechado</h3>
              <p>
                Relatórios que respondem o que importa: qual canal trouxe contrato assinado, quanto
                custou, onde dobrar. Não é métrica de lead — é métrica de receita.
              </p>
            </div>
            <div className="benefit">
              <div className="tag">Mercado</div>
              <h3>Mudanças jurídicas em tempo real</h3>
              <p>
                Trabalhista e previdenciário mudam com reforma, jurisprudência, moda de tese. A
                gente te recalibra antes de o movimento virar ruído.
              </p>
            </div>
            <div className="benefit">
              <div className="tag">Método</div>
              <h3>Teses pré-testadas em escala</h3>
              <p>
                Tese nova não vira campanha sua antes de ser validada em volume real no escritório
                do Eduardo. Você não serve de cobaia — recebe o que já funcionou.
              </p>
            </div>
            <div className="benefit">
              <div className="tag">Fundação</div>
              <h3>Tudo da Laquila Marketing por padrão</h3>
              <p>
                Campanhas pagas, criativos, funis, automações, integrações com CRM. O que a
                operação normal já entrega, entra incluído.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="founder">
        <div className="container">
          <div className="founder-grid">
            <div className="founder-img">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/img/eduardo-laquila.webp"
                alt="Eduardo Laquila — fundador da Laquila Marketing"
                width={1200}
                height={1800}
                loading="lazy"
              />
            </div>
            <div>
              <div className="eyebrow">O fundador</div>
              <h2>
                Eduardo Laquila — o <em>operador</em> por trás do método.
              </h2>
              <p>
                Antes de criar a Laquila, Eduardo vivia a realidade de um escritório de advocacia.
                Conhece cada gargalo, cada objeção, cada dificuldade que advogados enfrentam para
                fechar contratos.
              </p>
              <p>
                Foi dentro dessa operação que construiu a{' '}
                <strong>
                  metodologia que hoje permite escritórios fecharem mais de mil contratos todos os
                  meses
                </strong>{' '}
                — com processo, previsibilidade e escala.
              </p>
              <p>
                No Partners, você tem <strong>acesso direto a essa liderança</strong> — não por
                consultoria distante, mas com o próprio Eduardo e o time interno participando da
                cadência do seu escritório. É o que diferencia Partners de agência: não é serviço
                terceirizado, é operação compartilhada.
              </p>
              <div className="sig">
                <div>
                  <div className="sig-name">Eduardo Laquila</div>
                  <div className="sig-role">
                    Fundador · Laquila Marketing · Laquila Partners
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="section-head">
            <div className="eyebrow">Partners vs. agência tradicional</div>
            <h2>A diferença não é de preço. É de categoria.</h2>
          </div>

          <div className="compare-wrap">
            <table className="compare">
              <thead>
                <tr>
                  <th style={{ width: '40%' }}>Dimensão</th>
                  <th>Agência tradicional</th>
                  <th className="partners-col">Laquila Partners</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Público-alvo</td>
                  <td className="cross">Advogado em qualquer estágio</td>
                  <td className="partners-col tick">Só advogados que já fecham digital</td>
                </tr>
                <tr>
                  <td>Modelo comercial</td>
                  <td className="cross">Fee fixo mensal</td>
                  <td className="partners-col tick">
                    Comissão sobre contrato fechado (ou híbrido)
                  </td>
                </tr>
                <tr>
                  <td>Equipe</td>
                  <td className="cross">Gestor dividido entre 20-30 clientes</td>
                  <td className="partners-col tick">Time sênior dedicado exclusivamente</td>
                </tr>
                <tr>
                  <td>Rastreamento</td>
                  <td className="cross">Métricas até o lead</td>
                  <td className="partners-col tick">Métricas até o contrato assinado</td>
                </tr>
                <tr>
                  <td>Acesso à liderança operacional</td>
                  <td className="cross">Não faz parte do serviço</td>
                  <td className="partners-col tick">Parte central da entrega</td>
                </tr>
                <tr>
                  <td>Mentoria e método</td>
                  <td className="cross">Não incluído</td>
                  <td className="partners-col tick">
                    Cadência estruturada com o time do Eduardo
                  </td>
                </tr>
                <tr>
                  <td>Mudanças de mercado jurídico</td>
                  <td className="cross">Sob demanda, reativo</td>
                  <td className="partners-col tick">Proativo, em tempo real</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="alt" id="como-funciona">
        <div className="container">
          <div className="section-head">
            <div className="eyebrow">Como entrar</div>
            <h2>O processo é curto, direto e por aplicação.</h2>
            <p className="lede">
              Você não agenda horário — o nosso time analisa a aplicação e entra em contato. A
              gente escolhe os escritórios a dedo, porque entrega densa não escala.
            </p>
          </div>

          <div className="steps">
            <div className="step">
              <h3>Você preenche a aplicação</h3>
              <p>3 minutos. Dados básicos, perfil do escritório, ambição, disponibilidade.</p>
            </div>
            <div className="step">
              <h3>Nosso time analisa</h3>
              <p>Cada aplicação é lida. Avaliamos fit de ICP, maturidade e encaixe estratégico.</p>
            </div>
            <div className="step">
              <h3>A gente entra em contato</h3>
              <p>
                Se houver fit, nosso time liga ou manda mensagem pra marcar a primeira conversa.
              </p>
            </div>
            <div className="step">
              <h3>Conversa de alinhamento</h3>
              <p>
                Entendemos seu operacional, apresentamos o Partners, calibramos a modalidade
                comercial.
              </p>
            </div>
            <div className="step">
              <h3>Entrada no Partners</h3>
              <p>
                Proposta clara, sem letra miúda. Se fizer sentido pros dois lados, a parceria
                começa.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="container" style={{ maxWidth: 820 }}>
          <div className="section-head">
            <div className="eyebrow">Perguntas diretas</div>
            <h2>Dúvidas mais comuns.</h2>
          </div>

          <details className="faq-item">
            <summary>Qual é o percentual de comissão?</summary>
            <p>
              Depende do seu ticket médio, do seu volume mensal e da modalidade que fizer mais
              sentido pra você. Os números são calibrados na conversa que acontece depois da
              aplicação aprovada — sem pegadinha, sem letra miúda. A gente apresenta cenários reais
              baseados no seu caso antes de qualquer assinatura.
            </p>
          </details>
          <details className="faq-item">
            <summary>Eu já tenho agência. Consigo fazer os dois?</summary>
            <p>
              Pode até funcionar no curto prazo, mas o modelo Partners exige dedicação operacional
              do seu lado também — se a agência atual estiver competindo pelo mesmo terreno, a
              conta não fecha. Normalmente, os parceiros migram a operação toda pra cá após os
              primeiros 30 dias.
            </p>
          </details>
          <details className="faq-item">
            <summary>Como vocês medem &quot;contrato fechado&quot;?</summary>
            <p>
              Atribuição é parte central da entrega Partners. A gente define em contrato exatamente
              o que conta como contrato atribuído à operação (captação via canais digitais
              rastreados), e o rastreamento é auditável — os números são compartilhados com você em
              ciclo acordado, com as fontes de cada contrato. Zero zona cinzenta.
            </p>
          </details>
          <details className="faq-item">
            <summary>Qual o tempo pra começar a ter resultado?</summary>
            <p>
              Depende do estado atual da sua operação. Escritórios que já têm tráfego rodando
              costumam ver recalibração de performance em 30-45 dias. Estruturações mais densas
              (reposicionamento, tese nova) levam 60-90 dias pra bater ritmo de cruzeiro.
            </p>
          </details>
          <details className="faq-item">
            <summary>E se eu não fechar contrato nenhum? Vocês ficam sem receber?</summary>
            <p>
              Na modalidade de comissão pura, sim — e por isso a gente escolhe a dedo quem entra.
              Se você fecha contrato consistentemente hoje e nossa operação só precisa amplificar o
              que já existe, o risco é baixo pra nós. Se o seu caso tem risco de não fechar, a
              gente costuma sugerir a modalidade híbrida pra alinhar melhor.
            </p>
          </details>
          <details className="faq-item">
            <summary>Tenho que trocar toda minha estrutura atual?</summary>
            <p>
              Não. A gente assume o que já funciona e melhora o que trava. Não é reforma forçada —
              é integração.
            </p>
          </details>
          <details className="faq-item">
            <summary>Posso me candidatar e depois desistir?</summary>
            <p>
              Claro. Preencher a aplicação não compromete você com nada. Só nos dá informação
              suficiente pra saber se vale a conversa. Se não fizer sentido pra você depois da
              call, a gente se despede com um aperto de mão.
            </p>
          </details>
        </div>
      </section>

      <section className="alt" id="aplicacao">
        <div className="container">
          <ApplicationForm />
        </div>
      </section>

      <section className="closing">
        <div className="container">
          <div className="eyebrow" style={{ color: 'var(--accent)', marginBottom: 12 }}>
            Uma linha só.
          </div>
          <h2>Nosso próximo parceiro pode ser você.</h2>
          <p className="lede">
            Se você é advogado trabalhista ou previdenciário que já opera no digital e está pronto
            pra subir de patamar, a aplicação está aberta. Vagas pequenas por turma — primeira
            turma em montagem agora.
          </p>
          <a href="#aplicacao" className="btn btn-primary">
            Preencher aplicação
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
