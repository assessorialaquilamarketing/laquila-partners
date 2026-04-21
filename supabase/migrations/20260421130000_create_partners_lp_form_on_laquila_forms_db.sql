-- Migration: cria form "Partners LP" no banco CORRETO (laquila-operacao / acinbhrkmovrqepojdan)
-- Antes: por engano, criei no projeto da Receita (ljhgwesvajyfftehlnay). Agora aqui, onde o
-- dashboard forms.laquilacompany.app realmente lê.
-- Não conflita com "Partners — Pré-Qualificação" (slug=partners) que já existe — esse é outro
-- formulário legado, mantido intacto.

do $$
declare
  v_workspace uuid := 'b537507e-743b-48e4-bd05-14f707fc978f';  -- Laquila Marketing (onde os 4 forms vivem)
  v_user uuid;
  v_form uuid;

  v_name uuid := gen_random_uuid();
  v_email uuid := gen_random_uuid();
  v_phone uuid := gen_random_uuid();
  v_cidade uuid := gen_random_uuid();
  v_escritorio uuid := gen_random_uuid();
  v_instagram uuid := gen_random_uuid();
  v_area uuid := gen_random_uuid();
  v_funcionarios uuid := gen_random_uuid();
  v_tempo uuid := gen_random_uuid();
  v_contratos uuid := gen_random_uuid();
  v_investimento uuid := gen_random_uuid();
  v_quem_roda uuid := gen_random_uuid();
  v_motivo uuid := gen_random_uuid();
  v_ambicao uuid := gen_random_uuid();
  v_aceita uuid := gen_random_uuid();
begin
  select id into v_form from forms where slug = 'partners-lp' limit 1;
  if v_form is not null then
    raise notice 'Partners LP já existe nesse projeto: id=%', v_form;
    return;
  end if;

  select created_by into v_user from forms where workspace_id = v_workspace order by created_at asc limit 1;

  insert into forms (workspace_id, created_by, title, slug, status, settings, published_at)
  values (
    v_workspace, v_user, 'Partners LP', 'partners-lp', 'published',
    jsonb_build_object(
      'branding', jsonb_build_object('name', 'Laquila Partners'),
      'coverPage', jsonb_build_object(
        'title', 'Laquila Partners — Aplicação',
        'subtitle', 'Parceria de performance para advogados trabalhistas e previdenciários.'
      ),
      'thankYouScreen', jsonb_build_object(
        'title', 'Aplicação recebida.',
        'message', 'Nosso time analisa e entra em contato em até 48 horas úteis.'
      ),
      'tracking', jsonb_build_object('metaPixelIds','[]'::jsonb,'gaIds','[]'::jsonb,'gadsIds','[]'::jsonb),
      'source', 'partners-lp-landing'
    ),
    now()
  ) returning id into v_form;

  insert into form_blocks (id, form_id, type, title, description, required, order_index, config) values
    (v_name, v_form, 'short_text', 'Nome completo', null, true, 0,
     jsonb_build_object('placeholder','Seu nome')),
    (v_email, v_form, 'email', 'E-mail', null, true, 1,
     jsonb_build_object('placeholder','voce@escritorio.com.br')),
    (v_phone, v_form, 'whatsapp', 'WhatsApp', null, true, 2,
     jsonb_build_object('placeholder','(11) 99999-0000')),
    (v_cidade, v_form, 'short_text', 'Cidade / UF', null, true, 3,
     jsonb_build_object('placeholder','São Paulo / SP')),
    (v_escritorio, v_form, 'short_text', 'Nome do escritório', null, true, 4, jsonb_build_object()),
    (v_instagram, v_form, 'short_text', 'Instagram do escritório', null, false, 5,
     jsonb_build_object('placeholder','@seuescritorio')),
    (v_area, v_form, 'multiple_choice', 'Especialidade principal', null, true, 6,
     jsonb_build_object('allowMultiple', false, 'choices', jsonb_build_array(
       jsonb_build_object('id','area-trab','label','Trabalhista','value','trabalhista'),
       jsonb_build_object('id','area-prev','label','Previdenciário','value','previdenciario'),
       jsonb_build_object('id','area-ambas','label','Trabalhista + Previdenciário','value','ambas'),
       jsonb_build_object('id','area-outra','label','Outra área','value','outra')))),
    (v_funcionarios, v_form, 'multiple_choice', 'Tamanho do escritório', null, true, 7,
     jsonb_build_object('allowMultiple', false, 'choices', jsonb_build_array(
       jsonb_build_object('id','f-solo','label','Atuo sozinho(a)','value','solo'),
       jsonb_build_object('id','f-2-3','label','2 a 3 advogados','value','2-3'),
       jsonb_build_object('id','f-4p','label','4 ou mais advogados','value','4+')))),
    (v_tempo, v_form, 'multiple_choice', 'Há quanto tempo você investe em marketing digital?', null, true, 8,
     jsonb_build_object('allowMultiple', false, 'choices', jsonb_build_array(
       jsonb_build_object('id','t-0','label','Menos de 6 meses','value','ate6m'),
       jsonb_build_object('id','t-1','label','6 a 12 meses','value','6a12m'),
       jsonb_build_object('id','t-2','label','1 a 2 anos','value','1a2a'),
       jsonb_build_object('id','t-3','label','Mais de 2 anos','value','+2a')))),
    (v_contratos, v_form, 'multiple_choice', 'Contratos fechados por mês (digital, média)', null, true, 9,
     jsonb_build_object('allowMultiple', false, 'choices', jsonb_build_array(
       jsonb_build_object('id','c-0','label','Menos de 5','value','<5'),
       jsonb_build_object('id','c-1','label','5 a 15','value','5a15'),
       jsonb_build_object('id','c-2','label','15 a 30','value','15a30'),
       jsonb_build_object('id','c-3','label','30 a 60','value','30a60'),
       jsonb_build_object('id','c-4','label','Mais de 60','value','+60')))),
    (v_investimento, v_form, 'multiple_choice', 'Investimento mensal em tráfego pago', null, true, 10,
     jsonb_build_object('allowMultiple', false, 'choices', jsonb_build_array(
       jsonb_build_object('id','i-0','label','Até R$ 5 mil','value','<5k'),
       jsonb_build_object('id','i-1','label','R$ 5 mil a R$ 15 mil','value','5a15k'),
       jsonb_build_object('id','i-2','label','R$ 15 mil a R$ 30 mil','value','15a30k'),
       jsonb_build_object('id','i-3','label','R$ 30 mil a R$ 60 mil','value','30a60k'),
       jsonb_build_object('id','i-4','label','Mais de R$ 60 mil','value','+60k')))),
    (v_quem_roda, v_form, 'multiple_choice', 'Quem roda seu marketing hoje?', null, true, 11,
     jsonb_build_object('allowMultiple', false, 'choices', jsonb_build_array(
       jsonb_build_object('id','q-0','label','Agência','value','agencia'),
       jsonb_build_object('id','q-1','label','Freelancer / consultor','value','freela'),
       jsonb_build_object('id','q-2','label','Equipe interna (in-house)','value','inhouse'),
       jsonb_build_object('id','q-3','label','Eu mesmo','value','eu'),
       jsonb_build_object('id','q-4','label','Ninguém / sem estrutura','value','nenhum')))),
    (v_motivo, v_form, 'long_text', 'Por que você está se candidatando ao Partners?', 'Em 2-3 linhas.', true, 12,
     jsonb_build_object('minRows', 3)),
    (v_ambicao, v_form, 'long_text', 'Em 12 meses, onde você quer que seu escritório esteja?', 'Em 1-2 linhas.', true, 13,
     jsonb_build_object('minRows', 2)),
    (v_aceita, v_form, 'multiple_choice', 'Você entende e aceita o modelo de comissão sobre contratos fechados?', null, true, 14,
     jsonb_build_object('allowMultiple', false, 'choices', jsonb_build_array(
       jsonb_build_object('id','co-0','label','Sim, é exatamente isso que estou buscando','value','sim'),
       jsonb_build_object('id','co-1','label','Quero entender melhor na conversa','value','entender'),
       jsonb_build_object('id','co-2','label','Prefiro explorar a modalidade híbrida','value','hibrido'),
       jsonb_build_object('id','co-3','label','Não tenho interesse nesse formato','value','nao'))));

  update forms
    set settings = settings || jsonb_build_object(
      'lead_mapping', jsonb_build_object(
        'name', v_name::text, 'email', v_email::text, 'phone', v_phone::text,
        'whatsapp', v_phone::text, 'area', v_area::text,
        'funcionarios_escritorio', v_funcionarios::text,
        'faturamento_medio', v_investimento::text),
      'partners_block_map', jsonb_build_object(
        'name', v_name::text, 'email', v_email::text, 'phone', v_phone::text,
        'cidade_uf', v_cidade::text, 'escritorio', v_escritorio::text,
        'instagram', v_instagram::text, 'area', v_area::text,
        'funcionarios_escritorio', v_funcionarios::text,
        'tempo_investimento', v_tempo::text, 'contratos_mes', v_contratos::text,
        'investimento_trafego', v_investimento::text,
        'quem_roda_marketing', v_quem_roda::text,
        'motivo', v_motivo::text, 'ambicao_12m', v_ambicao::text,
        'aceita_comissao', v_aceita::text))
    where id = v_form;

  raise notice 'Partners LP criado no acinbhrkmovrqepojdan: id=%', v_form;
end $$;
