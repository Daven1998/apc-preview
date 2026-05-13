/* ============================================================
   Algarve Property Compliance — FAQ Chatbot
   Self-contained, zero dependencies, zero API calls.
   Auto-detects language from <html lang>. Portable across domains.
   ============================================================ */
(function () {
  'use strict';

  // -------- Detect language --------
  var lang = (document.documentElement.getAttribute('lang') || 'en').toLowerCase();
  if (lang.indexOf('pt') === 0) lang = 'pt'; else lang = 'en';

  // -------- UI strings (per locale) --------
  var T = {
    en: {
      bubbleAria: 'Open chat assistant',
      title: 'Algarve AL Helper',
      subtitle: 'Ask me anything about AL compliance',
      placeholder: 'Type your question…',
      send: 'Send',
      close: 'Close',
      welcome: "Hi — I'm the Algarve Property Compliance assistant. Ask me anything about AL registration, gas, electrical, EPC, fire safety, pricing, or how we work. Or tap a question below.",
      noMatch: "I didn't quite catch that. Try one of these popular questions, or rephrase:",
      stillStuck: "Still stuck? Email Dave at <a href=\"mailto:dave@firedoorassessment.com\">dave@firedoorassessment.com</a> or call +44 7861 777817.",
      poweredBy: 'Algarve Property Compliance',
      suggestedLabel: 'Popular questions'
    },
    pt: {
      bubbleAria: 'Abrir assistente de chat',
      title: 'Assistente APC',
      subtitle: 'Pergunte tudo sobre conformidade AL',
      placeholder: 'Escreva a sua pergunta…',
      send: 'Enviar',
      close: 'Fechar',
      welcome: 'Olá — sou o assistente do Algarve Property Compliance. Pergunte-me tudo sobre registo AL, gás, eletricidade, EPC, segurança contra incêndios, preços ou como trabalhamos. Ou toque numa pergunta abaixo.',
      noMatch: 'Não percebi bem. Experimente uma destas perguntas frequentes, ou reformule:',
      stillStuck: 'Ainda com dúvidas? Envie email ao Dave para <a href="mailto:dave@firedoorassessment.com">dave@firedoorassessment.com</a> ou ligue +44 7861 777817.',
      poweredBy: 'Algarve Property Compliance',
      suggestedLabel: 'Perguntas frequentes'
    }
  }[lang];

  // -------- FAQ knowledge base --------
  // Each item has keywords (used for matching), q (display question), a (HTML answer)
  var FAQ = {
    en: [
      {
        keywords: ['airbnb', 'booking', 'vrbo', 'platform', 'website', 'apply', 'rent through'],
        q: 'I rent through Airbnb. Does this still apply to me?',
        a: 'Yes. AL is the Portuguese licence the property itself needs — it is independent of the platform. Airbnb, Booking.com, Vrbo, your own website or word of mouth all require an active AL registration plus the underlying compliance stack.'
      },
      {
        keywords: ['eu', 'regulation', '2024/1028', '2024', '1028', 'european', 'directive', 'may 2026', 'deadline'],
        q: 'What is EU Regulation 2024/1028?',
        a: 'It is the EU short-term rental data regulation, in force from 20 May 2026. Platforms must verify every AL registration against the Portuguese register, share monthly data with authorities, and auto-remove unlicensed listings. It removes the old escape route of relying on platforms not to check.'
      },
      {
        keywords: ['property manager', 'manager', 'difference', 'different', 'lovelystay', 'sandyblue', 'hostwise'],
        q: 'Why is this different from a Portuguese property manager?',
        a: 'Property managers handle bookings, cleaning and guest communication — usually charging 18–22% of rental income. Most do not bundle compliance, and the few that do charge it on top in Portuguese. We do compliance only, on a fixed annual fee, in English. Use both: a property manager for your rentals, us for your paperwork.'
      },
      {
        keywords: ['inspections', 'who does', 'inspector', 'subcontractor', 'contractor', 'who actually', 'engineer'],
        q: 'Who actually does the inspections?',
        a: 'Local Portuguese subcontractors who are DGEG-authorised (gas), ADENE-registered (EPC), ANEPC-certified (fire) and CERTIEL-approved (electrical). We project-manage the entire process, schedule visits with your housekeeper or key-holder, and file certificates in your dashboard. You get a single English-speaking point of contact.'
      },
      {
        keywords: ['already paid', 'existing', 'current certificate', 'overlap', 'double bill', 'prorate'],
        q: "What if I'm already paid up for some of these?",
        a: 'Upload existing certificates during onboarding and we will log them. We only schedule what is genuinely due, and prorate your subscription accordingly in year one. No double-billing, no wasted spend.'
      },
      {
        keywords: ['extra cost', 'other cost', 'on top', 'contractor cost', 'hidden', 'addition', 'invoice'],
        q: 'Are there other costs on top of the annual fee?',
        a: 'Yes — contractor work (gas, electrical, fire safety, EPC, insurance, AL registration) is in addition to your annual fee. We negotiate preferential rates with Portugal\'s licensed specialists and pass these through to you, fully itemised in your dashboard. You receive one consolidated invoice from us, not separate invoices from each contractor.'
      },
      {
        keywords: ['why use you', 'instead of direct', 'go direct', 'wholesale', 'cheaper', 'why not'],
        q: 'Why use you instead of going to Portuguese contractors directly?',
        a: 'Three reasons. First, we negotiate wholesale rates with our partners — owners typically pay less through us than going direct. Second, you get one English-speaking point of contact and one invoice, not nine. Third, we own the renewal calendar, the document vault, and the relationship with the licensed specialists — so you never miss a deadline, never get caught out by a Portuguese-language email, and never have to chase a contractor yourself.'
      },
      {
        keywords: ['certificate', 'who issues', 'issued by', 'document', 'paperwork in my name'],
        q: 'Who issues the certificates?',
        a: 'Each certificate is issued by the appropriate Portugal-licensed specialist — DGEG-authorised gas engineers, CERTIEL-registered electricians, ADENE-qualified energy assessors, ANEPC-approved fire safety contractors, and AIMA-registered agents. Certificates are issued in your name as the property owner and stored in your dashboard. We coordinate, project-manage and quality-check the entire process.'
      },
      {
        keywords: ['who are you', 'about', 'who is behind', 'team', 'company', 'founder', 'dave', 'naughton', 'fire door assessment'],
        q: 'Who is behind Algarve Property Compliance?',
        a: 'Founded by Dave Naughton, Director of Fire Door Assessment Ltd — a UK firm specialising in fire-door inspection and compliance. The Portuguese sister service brings UK-survey discipline and English-language reporting to AL compliance, with on-the-ground inspections by Portugal\'s nationally licensed gas, electrical, energy and registration specialists. Reach Dave at <a href="mailto:dave@firedoorassessment.com">dave@firedoorassessment.com</a> or +44 7861 777817.'
      },
      {
        keywords: ['where', 'launch', 'lisbon', 'algarve', 'cascais', 'madeira', 'expansion', 'area'],
        q: 'Where do you launch?',
        a: 'We are onboarding the first 50 founding villas in the Algarve in Q1 2026, ahead of the EU 20 May 2026 deadline. Expansion to Lisbon, Cascais and Madeira follows in H2 2026.'
      },
      // ---- Extra questions beyond the page FAQ ----
      {
        keywords: ['price', 'pricing', 'cost', 'how much', 'fee', 'plan', 'tier', 'essential', 'standard', 'concierge'],
        q: 'How much does it cost?',
        a: 'Three plans, each per villa per year (plus contractor costs, itemised):<br><br>• <b>Essential — £390/year</b> — single villa, sleeps under 10. Fire alarm + extinguisher install, annual fire inspection, AL signage, dashboard.<br>• <b>Standard — £690/year</b> — most popular. Adds gas inspection, EPC management, AIMA guest registration, ALEP/Zurich liability insurance, annual compliance certificate.<br>• <b>Concierge — £1,490/year</b> — for 10+ guest villas. Adds annual fire-rated door inspection, CERTIEL electrical certification, dedicated WhatsApp account manager, priority 5-day fault response.'
      },
      {
        keywords: ['founding', 'first 50', 'discount', 'early bird', 'locked', 'lifetime'],
        q: 'Is there a founding-customer discount?',
        a: 'Yes. The first 50 villas onboarded in Q1 2026 lock in a founding price for life. Join the waiting list to secure your slot — no card needed today.'
      },
      {
        keywords: ['how long', 'how quickly', 'time', 'onboarding time', 'turnaround', 'speed', 'when start'],
        q: 'How long does onboarding take?',
        a: 'Most villas are fully compliant within 4–6 weeks of signing up. Week 1: document audit and gap analysis. Weeks 2–4: scheduled inspection visits with your housekeeper or key-holder. Weeks 5–6: certificates filed in your dashboard, AL registration submitted. Then it runs on a renewal calendar — you do nothing.'
      },
      {
        keywords: ['cancel', 'refund', 'leave', 'stop', 'sell', 'sold villa', 'guarantee'],
        q: 'What happens if I cancel or sell the villa?',
        a: 'Cancel anytime with 30 days notice — pro-rata refund of unused months. If you sell the villa we can transfer the subscription to the new owner free of charge, including the full document vault. No long-term lock-in.'
      },
      {
        keywords: ['languages', 'language', 'english', 'portuguese', 'speak'],
        q: 'What languages do you operate in?',
        a: 'Project management, dashboard, email and WhatsApp support are in English. All Portuguese authority paperwork (AL registration, certificates) is filed in Portuguese by us on your behalf. You never need to read or write Portuguese.'
      },
      {
        keywords: ['fire door', 'fire-rated', 'fire rated', '10 guest', 'big villa', 'large villa', 'mat'],
        q: 'Do I need a fire door inspection?',
        a: 'Only if your villa sleeps 10 or more guests — Portuguese fire safety regulations apply MAT-style requirements at that threshold. The Concierge plan includes annual fire-rated door inspection to BS 8214, delivered using the same methodology as Fire Door Assessment Ltd uses in the UK.'
      },
      {
        keywords: ['data', 'gdpr', 'privacy', 'personal information', 'document', 'storage', 'secure'],
        q: 'How do you handle my data and documents?',
        a: 'All documents are stored in your private owner dashboard, accessible only to you. We process data under UK and EU GDPR. Certificates are encrypted at rest. We never share your details with third parties without your explicit consent.'
      },
      {
        keywords: ['payment', 'pay', 'invoice', 'monthly', 'annual', 'billing', 'card', 'transfer'],
        q: 'How do I pay?',
        a: 'Annual payment by card or UK bank transfer. Contractor work is billed at cost in a single consolidated monthly invoice — fully itemised in your dashboard. No surprise charges.'
      },
      {
        keywords: ['contact', 'email', 'phone', 'whatsapp', 'speak to someone', 'call', 'reach'],
        q: 'How do I get in touch?',
        a: 'Email Dave directly at <a href="mailto:dave@firedoorassessment.com">dave@firedoorassessment.com</a> or call/WhatsApp +44 7861 777817. Or join the waiting list and we will reach out within one working day.'
      },
      {
        keywords: ['gas', 'dgeg', 'gas safety', 'boiler'],
        q: 'How does the gas inspection work?',
        a: 'A DGEG-authorised gas engineer visits the villa, tests every gas appliance and fitting, and issues the 5-year domestic gas safety certificate (per DL 97/2017). Typical contractor cost: €40–€80, billed at cost. We schedule the visit and file the certificate.'
      },
      {
        keywords: ['electric', 'electrical', 'certiel', 'wiring'],
        q: 'How does the electrical inspection work?',
        a: 'A CERTIEL-registered electrician carries out the inspection per Portuguese RTIEBT standards. Cost depends on villa size: T1/T2 ~€150, T3/T4 ~€200, villa ~€250, large villa €300+. We schedule, project-manage and file the CERTIEL certificate in your dashboard.'
      },
      {
        keywords: ['epc', 'energy', 'adene', 'energy performance'],
        q: 'What about the EPC (Energy Performance Certificate)?',
        a: 'EPC is renewed every 10 years by an ADENE-qualified energy assessor (our partner CERTIECO handles ours). The SCE registration fee is €28–€55 + VAT depending on villa class (T0/T1 to T4/T5). Standard and Concierge plans include EPC renewal management.'
      }
    ],
    pt: [
      {
        keywords: ['airbnb', 'booking', 'vrbo', 'plataforma', 'site', 'arrendo'],
        q: 'Arrendo através da Airbnb. Isto ainda se aplica a mim?',
        a: 'Sim. O AL é a licença portuguesa de que o imóvel necessita — é independente da plataforma. Airbnb, Booking.com, Vrbo, o seu próprio sítio web ou a divulgação boca-a-boca exigem todos um registo AL ativo e a respetiva conformidade legal.'
      },
      {
        keywords: ['ue', '2024/1028', 'regulamento', 'europeu', 'maio 2026', 'prazo'],
        q: 'O que é o Regulamento UE 2024/1028?',
        a: 'É o regulamento europeu de dados de arrendamento de curta duração, em vigor a partir de 20 de maio de 2026. As plataformas terão de verificar cada registo AL no registo português, partilhar dados mensais com as autoridades e remover automaticamente os anúncios sem licença. Elimina a antiga via de escape de confiar em que as plataformas não verificavam.'
      },
      {
        keywords: ['gestor', 'imoveis', 'imóveis', 'lovelystay', 'sandyblue', 'hostwise', 'diferenca', 'diferença'],
        q: 'Em que difere de um gestor de imóveis português?',
        a: 'Os gestores de imóveis tratam de reservas, limpeza e comunicação com hóspedes — geralmente cobrando 18–22% da receita. A maioria não inclui conformidade. Nós tratamos apenas da conformidade, a uma taxa anual fixa, em inglês e português. Utilize ambos: um gestor para os arrendamentos, nós para a burocracia.'
      },
      {
        keywords: ['inspecoes', 'inspeções', 'quem faz', 'subcontratado', 'engenheiro', 'tecnico', 'técnico'],
        q: 'Quem realiza efetivamente as inspeções?',
        a: 'Subcontratados portugueses locais, autorizados pela DGEG (gás), registados na ADENE (EPC), certificados pela ANEPC (incêndio) e aprovados pela CERTIEL (eletricidade). Nós gerimos todo o processo, agendamos as visitas com o seu empregado ou detentor de chave, e arquivamos os certificados no seu painel. Tem um único ponto de contacto bilíngue.'
      },
      {
        keywords: ['ja paguei', 'já paguei', 'existente', 'certificado atual', 'duplicar'],
        q: 'E se já paguei por alguns destes serviços?',
        a: 'Carregue os certificados existentes durante a integração e nós registamo-los. Agendamos apenas o que estiver efetivamente em falta e calculamos a sua subscrição proporcionalmente no primeiro ano. Sem dupla faturação, sem desperdício.'
      },
      {
        keywords: ['custo', 'custos', 'extra', 'taxa anual', 'fatura', 'preco escondido', 'preço escondido'],
        q: 'Existem outros custos para além da taxa anual?',
        a: 'Sim — o trabalho dos prestadores (gás, eletricidade, segurança contra incêndios, EPC, seguro, registo AL) acresce à taxa anual. Negociamos tarifas preferenciais e repassamo-las integralmente, totalmente detalhadas no seu painel. Recebe uma única fatura consolidada da nossa parte.'
      },
      {
        keywords: ['porque voces', 'porquê', 'porque não direto', 'em vez', 'contactar diretamente'],
        q: 'Porque recorrer a nós em vez de contactar diretamente os prestadores?',
        a: 'Por três razões. Primeiro, negociamos tarifas de volume — os proprietários pagam tipicamente menos através de nós. Segundo, tem um único ponto de contacto bilíngue e uma única fatura, não nove. Terceiro, somos nós que gerimos o calendário de renovações, o arquivo de documentos e a relação com os especialistas licenciados.'
      },
      {
        keywords: ['certificado', 'quem emite', 'documento', 'em meu nome'],
        q: 'Quem emite os certificados?',
        a: 'Cada certificado é emitido pelo especialista licenciado em Portugal — engenheiros de gás autorizados pela DGEG, eletricistas registados na CERTIEL, avaliadores energéticos qualificados pela ADENE, prestadores de incêndios aprovados pela ANEPC e agentes registados na AIMA. Os certificados são emitidos em seu nome enquanto proprietário e armazenados no seu painel.'
      },
      {
        keywords: ['quem sao', 'quem são', 'sobre', 'fundador', 'equipa', 'empresa', 'dave', 'fire door'],
        q: 'Quem está por trás do Algarve Property Compliance?',
        a: 'Fundado por Dave Naughton, Diretor da Fire Door Assessment Ltd — uma empresa britânica especializada em inspeção de portas corta-fogo e conformidade. O serviço irmão português traz a mesma disciplina de inspeção britânica e relatórios em inglês à gestão de conformidade AL. Contacte Dave em <a href="mailto:dave@firedoorassessment.com">dave@firedoorassessment.com</a> ou +44 7861 777817.'
      },
      {
        keywords: ['onde', 'lancam', 'lançam', 'lisboa', 'algarve', 'cascais', 'madeira'],
        q: 'Onde lançam o serviço?',
        a: 'Estamos a integrar as primeiras 50 moradias fundadoras no Algarve no 1.º trimestre de 2026, antes do prazo UE de 20 de maio de 2026. A expansão para Lisboa, Cascais e Madeira segue-se no 2.º semestre de 2026.'
      },
      {
        keywords: ['preco', 'preço', 'quanto custa', 'plano', 'essential', 'standard', 'concierge'],
        q: 'Quanto custa?',
        a: 'Três planos, por moradia, por ano (mais custos de prestadores, detalhados):<br><br>• <b>Essential — £390/ano</b> — moradia única, capacidade inferior a 10 pessoas. Alarme + extintores, inspeção anual, sinalética AL, painel.<br>• <b>Standard — £690/ano</b> — mais popular. Acrescenta inspeção de gás, gestão EPC, registo AIMA, seguro de responsabilidade ALEP/Zurich, certificado anual.<br>• <b>Concierge — £1.490/ano</b> — para 10+ hóspedes. Acrescenta inspeção anual de portas corta-fogo, certificação CERTIEL, gestor dedicado, resposta prioritária a 5 dias.'
      },
      {
        keywords: ['fundador', 'primeiras 50', 'desconto', 'cedo', 'vitalicio', 'vitalício'],
        q: 'Existe desconto para clientes fundadores?',
        a: 'Sim. As primeiras 50 moradias integradas no 1.º trimestre de 2026 garantem um preço fundador para sempre. Inscreva-se na lista de espera para garantir o seu lugar — sem cartão hoje.'
      },
      {
        keywords: ['quanto tempo', 'demora', 'integracao', 'integração', 'rapidez', 'inicio', 'início'],
        q: 'Quanto tempo demora a integração?',
        a: 'A maioria das moradias fica totalmente em conformidade em 4–6 semanas. Semana 1: auditoria documental e análise de lacunas. Semanas 2–4: agendamento das inspeções com o seu empregado ou detentor de chave. Semanas 5–6: certificados arquivados no painel, registo AL submetido. Depois corre por calendário de renovações — não tem de fazer nada.'
      },
      {
        keywords: ['cancelar', 'reembolso', 'sair', 'parar', 'vender moradia', 'transferir'],
        q: 'O que acontece se cancelar ou vender a moradia?',
        a: 'Cancele a qualquer altura com 30 dias de pré-aviso — reembolso pro-rata dos meses não utilizados. Se vender a moradia transferimos a subscrição para o novo proprietário gratuitamente, incluindo todo o arquivo documental. Sem fidelização longa.'
      },
      {
        keywords: ['linguas', 'línguas', 'idioma', 'ingles', 'inglês', 'portugues', 'português'],
        q: 'Em que idiomas trabalham?',
        a: 'Gestão de projeto, painel, email e WhatsApp em inglês e português. Toda a documentação para autoridades portuguesas (registo AL, certificados) é tratada em português por nós em seu nome. Nunca precisa de ler ou escrever em português.'
      },
      {
        keywords: ['portas corta-fogo', 'corta fogo', '10 hospedes', '10 hóspedes', 'moradia grande', 'mat'],
        q: 'Preciso de inspeção a portas corta-fogo?',
        a: 'Apenas se a moradia tiver capacidade para 10 ou mais hóspedes — a partir desse limite aplicam-se exigências MAT da regulamentação portuguesa de incêndios. O plano Concierge inclui inspeção anual de portas corta-fogo segundo BS 8214.'
      },
      {
        keywords: ['dados', 'gdpr', 'rgpd', 'privacidade', 'documento'],
        q: 'Como tratam os meus dados e documentos?',
        a: 'Todos os documentos ficam armazenados no seu painel privado de proprietário, acessível apenas a si. Tratamos os dados ao abrigo do RGPD do Reino Unido e da UE. Os certificados estão encriptados. Nunca partilhamos os seus dados sem o seu consentimento explícito.'
      },
      {
        keywords: ['pagamento', 'pagar', 'fatura', 'mensal', 'anual', 'cartao', 'cartão', 'transferencia', 'transferência'],
        q: 'Como pago?',
        a: 'Pagamento anual por cartão ou transferência bancária do Reino Unido. O trabalho dos prestadores é faturado ao custo numa única fatura mensal consolidada — totalmente detalhada no painel. Sem surpresas.'
      },
      {
        keywords: ['contacto', 'contactar', 'email', 'telefone', 'whatsapp', 'falar', 'ligar'],
        q: 'Como entro em contacto?',
        a: 'Email direto ao Dave em <a href="mailto:dave@firedoorassessment.com">dave@firedoorassessment.com</a> ou ligue/WhatsApp +44 7861 777817. Ou inscreva-se na lista de espera e entraremos em contacto no prazo de um dia útil.'
      },
      {
        keywords: ['gas', 'gás', 'dgeg', 'caldeira'],
        q: 'Como funciona a inspeção de gás?',
        a: 'Um engenheiro de gás autorizado pela DGEG visita a moradia, testa todos os aparelhos e ligações, e emite o certificado de segurança de gás doméstico de 5 anos (DL 97/2017). Custo típico do prestador: €40–€80, faturado ao custo. Nós agendamos a visita e arquivamos o certificado.'
      },
      {
        keywords: ['eletricidade', 'eléctrica', 'certiel', 'electricidade'],
        q: 'Como funciona a inspeção elétrica?',
        a: 'Um eletricista registado na CERTIEL realiza a inspeção segundo as RTIEBT. Custo conforme o tamanho: T1/T2 ~€150, T3/T4 ~€200, moradia ~€250, moradia grande €300+. Nós agendamos, gerimos e arquivamos o certificado CERTIEL no seu painel.'
      },
      {
        keywords: ['epc', 'adene', 'energetico', 'energético', 'energia'],
        q: 'E o EPC (Certificado Energético)?',
        a: 'O EPC é renovado a cada 10 anos por um avaliador qualificado pela ADENE (o nosso parceiro CERTIECO trata dos nossos). A taxa de registo SCE é €28–€55 + IVA conforme a classe da moradia (T0/T1 a T4/T5). Os planos Standard e Concierge incluem gestão da renovação EPC.'
      }
    ]
  };

  var faqList = FAQ[lang];

  // Suggested chips shown initially and on no-match
  var SUGGESTED = lang === 'pt'
    ? ['Quanto custa?', 'O que é o Regulamento UE 2024/1028?', 'Quem realiza as inspeções?', 'Quanto tempo demora a integração?', 'Como entro em contacto?']
    : ['How much does it cost?', 'What is EU Regulation 2024/1028?', 'Who actually does the inspections?', 'How long does onboarding take?', 'How do I get in touch?'];

  // -------- Matching engine --------
  function normalize(s) {
    return (s || '').toString().toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')   // strip accents
      .replace(/[^a-z0-9\s/]/g, ' ')
      .replace(/\s+/g, ' ').trim();
  }

  function scoreMatch(query, item) {
    var q = normalize(query);
    if (!q) return 0;
    var tokens = q.split(' ').filter(function (t) { return t.length > 1; });
    var hay = normalize(item.q + ' ' + item.keywords.join(' ') + ' ' + item.a);
    var score = 0;
    // keyword exact phrase boost
    for (var k = 0; k < item.keywords.length; k++) {
      var kw = normalize(item.keywords[k]);
      if (kw && q.indexOf(kw) !== -1) score += 10;
      if (kw && hay.indexOf(kw) !== -1) {} // already in hay
    }
    // token overlap
    for (var i = 0; i < tokens.length; i++) {
      var t = tokens[i];
      if (hay.indexOf(t) !== -1) score += 2;
    }
    // exact question match boost
    if (normalize(item.q) === q) score += 50;
    return score;
  }

  function findBestMatches(query) {
    var ranked = faqList.map(function (item) {
      return { item: item, score: scoreMatch(query, item) };
    }).filter(function (x) { return x.score > 0; })
      .sort(function (a, b) { return b.score - a.score; });
    return ranked;
  }

  // -------- Inject CSS --------
  var css = ''
    + '.aal-chat__bubble{position:fixed;bottom:20px;right:20px;width:60px;height:60px;border-radius:50%;background:linear-gradient(135deg,#006633,#D90708);border:none;cursor:pointer;box-shadow:0 8px 24px rgba(14,34,53,.25);z-index:9998;display:flex;align-items:center;justify-content:center;transition:transform .2s ease, box-shadow .2s ease;}'
    + '.aal-chat__bubble:hover{transform:translateY(-2px);box-shadow:0 12px 28px rgba(14,34,53,.32);}'
    + '.aal-chat__bubble svg{width:28px;height:28px;color:#fff;}'
    + '.aal-chat__bubble[hidden]{display:none !important;}'
    + '.aal-chat__panel{position:fixed;bottom:20px;right:20px;width:380px;max-width:calc(100vw - 24px);height:560px;max-height:calc(100vh - 40px);background:#fff;border-radius:16px;box-shadow:0 24px 60px rgba(14,34,53,.32);z-index:9999;display:flex;flex-direction:column;overflow:hidden;font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;animation:aalChatIn .25s ease;}'
    + '@keyframes aalChatIn{from{opacity:0;transform:translateY(20px) scale(.96);}to{opacity:1;transform:translateY(0) scale(1);}}'
    + '.aal-chat__panel[hidden]{display:none !important;}'
    + '.aal-chat__header{background:linear-gradient(135deg,#0E2235,#1a3553);color:#fff;padding:14px 16px;display:flex;align-items:center;gap:12px;flex-shrink:0;}'
    + '.aal-chat__avatar{width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#006633,#D90708);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;color:#fff;flex-shrink:0;}'
    + '.aal-chat__heading{flex:1;min-width:0;}'
    + '.aal-chat__title{font-weight:700;font-size:15px;line-height:1.2;margin:0;}'
    + '.aal-chat__sub{font-size:11.5px;opacity:.78;margin:2px 0 0;line-height:1.3;}'
    + '.aal-chat__close{background:transparent;border:none;color:#fff;cursor:pointer;padding:6px;border-radius:6px;display:flex;align-items:center;justify-content:center;opacity:.85;transition:opacity .15s, background .15s;}'
    + '.aal-chat__close:hover{opacity:1;background:rgba(255,255,255,.1);}'
    + '.aal-chat__close svg{width:18px;height:18px;}'
    + '.aal-chat__body{flex:1;overflow-y:auto;padding:16px;background:#F4F8FB;display:flex;flex-direction:column;gap:10px;-webkit-overflow-scrolling:touch;}'
    + '.aal-chat__msg{max-width:88%;padding:10px 13px;border-radius:14px;font-size:14px;line-height:1.5;word-wrap:break-word;overflow-wrap:anywhere;}'
    + '.aal-chat__msg--bot{background:#fff;color:#1F2937;align-self:flex-start;border-bottom-left-radius:4px;box-shadow:0 1px 2px rgba(14,34,53,.06);}'
    + '.aal-chat__msg--user{background:#006633;color:#fff;align-self:flex-end;border-bottom-right-radius:4px;}'
    + '.aal-chat__msg a{color:#006633;font-weight:600;text-decoration:none;}'
    + '.aal-chat__msg--user a{color:#fff;text-decoration:underline;}'
    + '.aal-chat__msg a:hover{text-decoration:underline;}'
    + '.aal-chat__chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:4px;}'
    + '.aal-chat__chips-label{font-size:11px;text-transform:uppercase;letter-spacing:.06em;font-weight:700;color:#6B7280;width:100%;margin-top:6px;}'
    + '.aal-chat__chip{background:#fff;border:1px solid #E5EAF0;color:#0E2235;padding:7px 12px;border-radius:18px;font-size:12.5px;cursor:pointer;font-family:inherit;transition:all .15s;line-height:1.3;text-align:left;}'
    + '.aal-chat__chip:hover{background:#0E2235;color:#fff;border-color:#0E2235;}'
    + '.aal-chat__form{display:flex;gap:8px;padding:12px;background:#fff;border-top:1px solid #E5EAF0;flex-shrink:0;}'
    + '.aal-chat__input{flex:1;border:1px solid #E5EAF0;border-radius:22px;padding:10px 14px;font-size:14px;font-family:inherit;outline:none;transition:border-color .15s;background:#F4F8FB;color:#1F2937;min-width:0;}'
    + '.aal-chat__input:focus{border-color:#006633;background:#fff;}'
    + '.aal-chat__send{background:linear-gradient(135deg,#006633,#D90708);border:none;color:#fff;width:40px;height:40px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:transform .15s;}'
    + '.aal-chat__send:hover{transform:scale(1.06);}'
    + '.aal-chat__send svg{width:18px;height:18px;}'
    + '.aal-chat__typing{display:inline-flex;gap:4px;padding:12px 14px;}'
    + '.aal-chat__typing span{width:6px;height:6px;background:#9CA3AF;border-radius:50%;animation:aalDot 1.2s infinite;}'
    + '.aal-chat__typing span:nth-child(2){animation-delay:.15s;}'
    + '.aal-chat__typing span:nth-child(3){animation-delay:.3s;}'
    + '@keyframes aalDot{0%,60%,100%{opacity:.3;transform:translateY(0);}30%{opacity:1;transform:translateY(-3px);}}'
    + '@media (max-width:540px){'
    + '.aal-chat__panel{width:calc(100vw - 16px);right:8px;left:8px;bottom:8px;max-width:none;height:calc(100vh - 16px);max-height:none;border-radius:14px;}'
    + '.aal-chat__bubble{width:54px;height:54px;bottom:14px;right:14px;}'
    + '.aal-chat__bubble svg{width:24px;height:24px;}'
    + '}';

  var style = document.createElement('style');
  style.setAttribute('data-aal-chat', '');
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);

  // -------- Build DOM --------
  var bubble = document.createElement('button');
  bubble.className = 'aal-chat__bubble';
  bubble.setAttribute('aria-label', T.bubbleAria);
  bubble.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>';

  var panel = document.createElement('div');
  panel.className = 'aal-chat__panel';
  panel.hidden = true;
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', T.title);
  panel.innerHTML = ''
    + '<div class="aal-chat__header">'
    +   '<div class="aal-chat__avatar">APC</div>'
    +   '<div class="aal-chat__heading">'
    +     '<p class="aal-chat__title">' + T.title + '</p>'
    +     '<p class="aal-chat__sub">' + T.subtitle + '</p>'
    +   '</div>'
    +   '<button class="aal-chat__close" aria-label="' + T.close + '">'
    +     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
    +   '</button>'
    + '</div>'
    + '<div class="aal-chat__body" data-body></div>'
    + '<form class="aal-chat__form" data-form>'
    +   '<input type="text" class="aal-chat__input" data-input placeholder="' + T.placeholder + '" autocomplete="off">'
    +   '<button type="submit" class="aal-chat__send" aria-label="' + T.send + '">'
    +     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>'
    +   '</button>'
    + '</form>';

  document.body.appendChild(bubble);
  document.body.appendChild(panel);

  var bodyEl = panel.querySelector('[data-body]');
  var inputEl = panel.querySelector('[data-input]');
  var formEl = panel.querySelector('[data-form]');
  var closeEl = panel.querySelector('.aal-chat__close');

  // -------- Render helpers --------
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function addMsg(html, who) {
    var m = document.createElement('div');
    m.className = 'aal-chat__msg aal-chat__msg--' + who;
    m.innerHTML = html;
    bodyEl.appendChild(m);
    scrollToBottom();
    return m;
  }

  function addTyping() {
    var t = document.createElement('div');
    t.className = 'aal-chat__msg aal-chat__msg--bot aal-chat__typing';
    t.innerHTML = '<span></span><span></span><span></span>';
    bodyEl.appendChild(t);
    scrollToBottom();
    return t;
  }

  function scrollToBottom() {
    requestAnimationFrame(function () { bodyEl.scrollTop = bodyEl.scrollHeight; });
  }

  function addChips(questions, label) {
    var wrap = document.createElement('div');
    wrap.className = 'aal-chat__chips';
    if (label) {
      var lbl = document.createElement('div');
      lbl.className = 'aal-chat__chips-label';
      lbl.textContent = label;
      wrap.appendChild(lbl);
    }
    questions.forEach(function (q) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'aal-chat__chip';
      b.textContent = q;
      b.addEventListener('click', function () { handleQuery(q, true); });
      wrap.appendChild(b);
    });
    bodyEl.appendChild(wrap);
    scrollToBottom();
  }

  // -------- Conversation flow --------
  function botSay(html) {
    var typing = addTyping();
    setTimeout(function () {
      typing.remove();
      addMsg(html, 'bot');
    }, 400);
  }

  function handleQuery(text, isChip) {
    if (!text || !text.trim()) return;
    addMsg(escapeHtml(text), 'user');
    inputEl.value = '';

    var matches = findBestMatches(text);
    if (matches.length && matches[0].score >= 2) {
      botSay(matches[0].item.a);
      // optional related
      if (matches.length > 1 && matches[1].score >= 4) {
        setTimeout(function () {
          addChips([matches[1].item.q, matches[2] && matches[2].score >= 4 ? matches[2].item.q : null].filter(Boolean), T.suggestedLabel);
        }, 700);
      }
    } else {
      var typing = addTyping();
      setTimeout(function () {
        typing.remove();
        addMsg(T.noMatch + '<br><br>' + T.stillStuck, 'bot');
        addChips(SUGGESTED, T.suggestedLabel);
      }, 400);
    }
  }

  // -------- Init / open/close --------
  var initialised = false;
  function initConversation() {
    if (initialised) return;
    initialised = true;
    addMsg(T.welcome, 'bot');
    addChips(SUGGESTED, T.suggestedLabel);
  }

  function openPanel() {
    panel.hidden = false;
    bubble.hidden = true;
    initConversation();
    setTimeout(function () { inputEl.focus(); }, 150);
  }

  function closePanel() {
    panel.hidden = true;
    bubble.hidden = false;
  }

  bubble.addEventListener('click', openPanel);
  closeEl.addEventListener('click', closePanel);
  formEl.addEventListener('submit', function (e) {
    e.preventDefault();
    handleQuery(inputEl.value, false);
  });
  // Esc to close
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !panel.hidden) closePanel();
  });
})();
