/* Concentra+ · js/pessoa4/telas.js
   Pessoa 4 · Tutorial, histórico e suporte (histórias 19 a 24 do backlog)
   Integrante: [NOME] · GitHub: [@usuario]
   Seções deste arquivo: 05 Tutorial, 23 Permissões, 24 Como habilitar a permissão, 25 Limitação do sistema, 26 Ajuda, 27 Falar com o suporte, 29 Histórico (calendário), 31 Recuperação, 37 Assinatura, 38 Gerenciar assinatura */
/* ================= 05 Tutorial ================= */
/* RESPONSÁVEL: Pessoa 4 · Tutorial, histórico e suporte (histórias 19 a 24 do backlog) */
const TUT = [
  { t:'Defina seu foco', d:'Escolha um timer de foco e descanso e organize cada sessão por categoria: Estudo, Trabalho ou Leitura.', il: () => `<div class="illo">${ring(.78, 'var(--pri)', 150, 11)}<div style="position:absolute;font-size:34px;font-weight:700">25:00</div></div><div class="chips" style="justify-content:center;margin-top:16px"><span class="chip on" style="height:30px;font-size:12.5px">Estudo</span><span class="chip" style="height:30px;font-size:12.5px">Trabalho</span><span class="chip" style="height:30px;font-size:12.5px">Leitura</span></div>` },
  { t:'Bloqueie distrações', d:'Durante a sessão, os aplicativos que você escolher ficam bloqueados e sem notificações.', il: () => `<div class="illo" style="width:130px;height:230px;border-radius:24px;padding:22px 18px;display:grid;grid-template-columns:1fr 1fr;gap:12px;align-content:start">${'<i style="display:block;height:36px;border-radius:10px;background:var(--track)"></i>'.repeat(6)}<div style="position:absolute;bottom:26px;left:50%;transform:translateX(-50%);width:54px;height:54px;border-radius:50%;background:var(--pri);color:var(--pri-ink);display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 6px var(--card)">${ic('lock', 26, '', 2.2)}</div></div>` },
  { t:'Acompanhe seu progresso', d:'Defina uma meta diária e veja suas sessões no calendário e nos relatórios.', il: () => `<div class="illo" style="width:250px;height:150px;align-items:flex-end;gap:9px;padding:0 22px 20px">${[50,78,62,100,55,88].map((h, i) => `<i style="display:block;width:22px;height:${h}px;border-radius:6px;background:${i === 3 ? 'var(--pri)' : 'var(--pri-soft2)'}"></i>`).join('')}<i style="display:block;width:22px;height:42px;border-radius:6px;background:var(--orange)"></i></div><div class="card" style="width:250px;margin:14px auto 0;padding:12px 16px"><div class="between xs"><b>Meta de hoje</b><span class="muted">1h 20min de 2h</span></div><div class="bar mt8" style="height:7px"><i style="width:67%"></i></div></div>` },
];
SCREENS.tutorial = { r: () => { U.i ??= 0; const s = TUT[U.i];
  return `<div class="scr"><div class="hdr"><div class="sp"></div><button class="skip" data-a="tutPular">Pular</button></div>
  <div class="body" style="display:flex;flex-direction:column">${s.il()}<h2 class="tut-title">${s.t}</h2><p class="tut-text">${s.d}</p><div style="flex:1"></div><div class="dots">${TUT.map((_, i) => `<i class="${i === U.i ? 'on' : ''}"></i>`).join('')}</div></div>
  <div class="foot"><button class="btn pri" data-a="tutNext">${U.i === 2 ? 'Conectar meu relógio' : 'Próximo'}</button></div></div>`; } };
A.tutNext = () => { if (U.i < 2) { U.i++; render({ anim:'fwd' }); } else nav('conexao'); };
A.tutPular = () => { S.tutorialSeen = true; nav('inicio', { coach:true }, { reset:true }); };

/* ================= 23 Permissões ================= */
/* RESPONSÁVEL: Pessoa 4 · Tutorial, histórico e suporte (histórias 19 a 24 do backlog) */
const PERMS = [['acess','Acessibilidade'],['sobre','Exibir sobre outros apps'],['notif','Acesso às notificações'],['bt','Bluetooth']];
SCREENS.permissoes = { r: () => { const ok = permsOk();
  return `<div class="scr">${hdr()}<div class="body"><h1 class="h1" style="font-size:25px">Permissões do modo foco</h1>
    ${ok ? `<div class="alert g mt12" style="padding:16px;align-items:center"><span class="pico ok" style="width:44px;height:44px">${ic('check', 22, '', 3)}</span><div><b style="font-size:17px">Tudo certo!</b><span class="muted">O bloqueio está pronto para uso.</span></div></div>`
      : `<div class="alert o mt12" style="padding:16px;align-items:center"><span class="pico no" style="width:44px;height:44px;font-size:20px;background:#b8650f">!</span><div><b style="font-size:17px">${permsCount()} de 4 permissões ativas</b><span class="muted">Ative as que faltam para bloquear apps.</span></div></div>`}
    <div class="mt12">${PERMS.map(([k, l]) => `<div class="card perm"><span class="pico ${S.perms[k] ? 'ok' : 'no'}">${S.perms[k] ? ic('check', 17, '', 3) : '!'}</span><div class="grow"><b style="font-size:15.5px;font-weight:600">${l}</b><div class="xs muted">${S.perms[k] ? 'Ativa' : 'Desativada'}</div></div>${S.perms[k] ? '' : `<button class="pill-btn" data-a="permAtivar" data-v="${k}">Ativar</button>`}</div>`).join('')}</div>
    <a class="tlink small row mt16" data-a="go" data-v="limitacao">${ic('info', 16)}Meu aparelho limita o bloqueio?</a>
  </div><div class="foot">${ok ? `<button class="btn pri" data-a="back">Voltar</button>` : `<button class="btn pri" data-a="permAtivar" data-v="${PERMS.find(([k]) => !S.perms[k])[0]}">Resolver agora</button>`}</div></div>`; } };
A.permAtivar = v => nav('permguia', { k:v });

/* 24 guia */
/* ----- 24 Como habilitar a permissão ----- */
/* RESPONSÁVEL: Pessoa 4 · Tutorial, histórico e suporte (histórias 19 a 24 do backlog) */
SCREENS.permguia = { r: p => { U.i ??= 0; const name = PERMS.find(x => x[0] === p.k)[1];
  const steps = [
    { t:'Abra as Configurações', d:`No celular, abra Configurações e procure por ${p.k === 'notif' ? 'Notificações' : p.k === 'sobre' ? 'Apps' : p.k === 'bt' ? 'Bluetooth' : 'Acessibilidade'}.`, hl:'Configurações', ico:'gear' },
    { t:'Encontre o Concentra+', d:'Na lista de aplicativos instalados, toque em Concentra+.', hl:'Concentra+', ico:'plus' },
    { t:`Ative “${name}”`, d:'Ligue a chave e volte para o Concentra+. O status atualiza sozinho.', hl:name, ico:'check', tg:true },
  ];
  const s = steps[U.i];
  return `<div class="scr">${hdr()}<div class="body"><p class="small muted b">Permissão de ${name.toLowerCase()} · passo ${U.i + 1} de 3</p><h1 class="h1">${s.t}</h1><p class="sub">${s.d}</p>
    <div class="card" style="width:250px;margin:44px auto 0;padding:14px;border-radius:24px;display:flex;flex-direction:column;gap:10px">
      <div style="border:2px solid var(--pri);background:var(--pri-soft);border-radius:12px;padding:12px;display:flex;gap:10px;align-items:center;font-weight:600;font-size:14.5px">${ic(s.ico, 18)}<span class="grow">${esc(s.hl)}</span>${s.tg ? `<span class="tg ${U.on ? 'on' : ''}" style="transform:scale(.8)"></span>` : ''}</div>
      <i style="display:block;height:42px;border-radius:12px;background:var(--line2)"></i><i style="display:block;height:42px;border-radius:12px;background:var(--line2)"></i></div>
    <div class="dots" style="margin-top:30px">${[0,1,2].map(i => `<i class="${i === U.i ? 'on' : ''}"></i>`).join('')}</div>
  </div><div class="foot"><button class="btn pri" data-a="guiaNext">${U.i === 0 ? 'Abrir configurações' : U.i === 1 ? 'Próximo' : U.on ? 'Ver permissões' : 'Ativar permissão'}</button></div></div>`; } };
A.guiaNext = () => { if (U.i < 2) { U.i++; return render({ anim:'fwd' }); } if (!U.on) { U.on = true; rerender(); return; } S.perms[cur().p.k] = true; back(); toast('Permissão ativada'); };

/* 25 limitação */
/* ----- 25 Limitação do sistema ----- */
/* RESPONSÁVEL: Pessoa 4 · Tutorial, histórico e suporte (histórias 19 a 24 do backlog) */
SCREENS.limitacao = { r: () => `<div class="scr">${hdr()}<div class="body">
  <div style="background:var(--orange-soft);border:1.5px solid var(--orange-line);border-radius:22px;padding:20px 18px"><span class="iconhero" style="width:40px;height:40px;margin:0;background:var(--orange);color:#fff">${ic('info', 22, '', 2.2)}</span><h2 style="font-size:23px;margin:14px 0 8px;line-height:1.25">Seu sistema limita o bloqueio de apps</h2><p class="small muted" style="line-height:1.5">Em alguns aparelhos, a versão do sistema não permite que o Concentra+ bloqueie outros aplicativos durante a sessão. Nesse caso, ainda dá para usar o resto do app normalmente.</p></div>
  <h3 class="sec">O que continua funcionando</h3>
  <div class="list">${[['check','Timers de foco e descanso'],['check','Conexão e sincronização com o Concentra+'],['check','Lembretes, metas e relatórios'],['x','Bloqueio de aplicativos e notificações']].map(([i, l]) => `<div class="li"><span style="color:${i === 'x' ? 'var(--red)' : 'var(--green)'}">${ic(i, 18, '', 2.6)}</span>${l}</div>`).join('')}</div>
</div><div class="foot"><button class="btn pri" data-a="limEntendi">Entendi</button><button class="btn link" data-a="go" data-v="ajuda">Saiba mais</button></div></div>` };
A.limEntendi = () => { const i = stack.findIndex(x => x.id === 'antes'); if (i >= 0) { stack = stack.slice(0, i + 1); U = {}; render({ anim:'back' }); } else back(); };

/* ================= 26 Ajuda ================= */
/* RESPONSÁVEL: Pessoa 4 · Tutorial, histórico e suporte (histórias 19 a 24 do backlog) */
SCREENS.ajuda = { r: () => { U.q ??= ''; U.f ??= 'Todos'; U.open ??= 0;
  const q = U.q.trim().toLowerCase();
  const list = FAQ.map((f, i) => ({ ...f, i })).filter(f => (U.f === 'Todos' || f.cat === U.f) && (!q || (f.q + ' ' + f.a).toLowerCase().includes(q)));
  return `<div class="scr">${hdr('Central de ajuda')}<div class="body">
    <div class="searchbox">${ic('search', 19)}<input class="inp" data-in="q" data-oi="rr" value="${esc(U.q)}" placeholder="Buscar por palavra-chave"></div>
    <div class="chips mt12">${['Todos','Relógio','Bloqueio','Conta','Assinatura'].map(c => `<button class="chip ${U.f === c ? 'on' : ''}" data-a="setU" data-v="f:${c}">${c}</button>`).join('')}</div>
    <h3 class="sec">${q ? `${list.length} ${list.length === 1 ? 'resultado' : 'resultados'}` : 'Perguntas frequentes'}</h3>
    <div class="accordion">${list.map(f => `<div class="card acc"><button class="q" data-a="faq" data-v="${f.i}">${hl(f.q, q)}${ic(U.open === f.i ? 'up' : 'down', 18, 'muted')}</button>${U.open === f.i ? `<div class="a">${hl(f.a, q)}</div>` : ''}</div>`).join('') || `<div class="empty">${ic('search', 26)}<b>Nada encontrado</b><span class="small">Tente outra palavra ou fale com o suporte.</span></div>`}</div>
    <div class="alert t mt12" style="align-items:center"><div class="grow"><b>Não encontrou? Fale com o suporte</b><span class="xs muted">Respondemos em até 2 dias úteis.</span></div><button class="pill-btn" data-a="go" data-v="contato">Contato</button></div>
  </div></div>`; } };
const hl = (t, q) => { const e = esc(t); if (!q) return e; const i = t.toLowerCase().indexOf(q); if (i < 0) return e; return esc(t.slice(0, i)) + `<mark style="background:var(--orange-soft);color:inherit;border-radius:3px">${esc(t.slice(i, i + q.length))}</mark>` + esc(t.slice(i + q.length)); };
A.faq = v => { U.open = U.open === +v ? -1 : +v; rerender(); };

/* 27 contato */
/* ----- 27 Falar com o suporte ----- */
/* RESPONSÁVEL: Pessoa 4 · Tutorial, histórico e suporte (histórias 19 a 24 do backlog) */
SCREENS.contato = { r: () => { U.as ??= 'Conexão com o relógio'; U.msg ??= '';
  if (U.sent) return `<div class="scr"><div class="body"><div class="hero" style="padding-top:150px"><div class="iconhero g">${ic('check', 42, '', 3)}</div><h2>Mensagem enviada</h2><p>Responderemos em até 2 dias úteis, no e-mail ${esc(S.user.email)}.</p><p class="xs muted">Protocolo #CP-${U.proto}</p></div></div><div class="foot"><button class="btn pri" data-a="back">Voltar à central de ajuda</button></div></div>`;
  return `<div class="scr">${hdr('Falar com o suporte')}<div class="body"><p class="sub" style="font-size:14px">Conte o que aconteceu e responderemos por e-mail em até 2 dias úteis.</p>
    <label class="lbl">Assunto</label><div class="field selwrap"><select class="inp" data-in="as">${['Conexão com o relógio','Bloqueio de aplicativos','Histórico e relatórios','Assinatura e pagamento','Outro assunto'].map(o => `<option ${U.as === o ? 'selected' : ''}>${o}</option>`).join('')}</select><span class="chev">${ic('down', 18)}</span></div>
    <div class="fwrap"><label class="lbl">Mensagem</label><textarea class="inp ${U.eM ? 'err' : ''}" data-in="msg" data-err="eM" data-oi="cnt" maxlength="500" placeholder="Descreva o problema com o máximo de detalhes">${esc(U.msg)}</textarea><div class="counter" id="cnt">${U.msg.length}/500</div>${U.eM ? `<div class="errt">${ic('alertc', 15)}${U.eM}</div>` : ''}</div>
    <p class="small muted row mt8">${ic('mail', 16)}Resposta para ${esc(S.user.email)}</p>
  </div><div class="foot"><button class="btn pri" data-a="enviarContato">Enviar</button></div></div>`; } };
A.cnt = v => { const c = $('#cnt'); if (c) c.textContent = `${v.length}/500`; const b = $('#sugBtn'); if (b) b.classList.toggle('dis', !v.trim()); };
A.enviarContato = () => { if (U.msg.trim().length < 10) { U.eM = 'Escreva pelo menos 10 caracteres'; return rerender(); } if (!S.env.net) { toast('Sem internet. Tente de novo quando estiver conectado.', 'wifioff'); return; } U.sent = true; U.proto = 48000 + Math.floor(Math.random() * 999); rerender(); };

/* 28 sugestão */
/* ================= 29/30 Histórico ================= */
/* RESPONSÁVEL: Pessoa 4 · Tutorial, histórico e suporte (histórias 19 a 24 do backlog) */
SCREENS.historico = { r: p => { U.v ??= p.v || 'cal';
  const body = U.v === 'cal' ? calView() : repView();
  return `<div class="scr"><div class="body" style="padding-top:14px"><h1 class="h1">Histórico</h1>
    <div class="seg mt12"><button class="${U.v === 'cal' ? 'on' : ''}" data-a="histV" data-v="cal">Calendário</button><button class="${U.v === 'rel' ? 'on' : ''}" data-a="histV" data-v="rel">Relatórios</button></div>
    ${!S.recovered ? `<button class="alert t mt12" style="width:100%;text-align:left;align-items:center" data-a="go" data-v="recuperacao">${ic('cloud', 22)}<div class="grow"><b>Recupere seu histórico</b><span class="small">Há sessões salvas na sua conta.</span></div>${ic('right', 18)}</button>` : ''}
    ${body}</div>${tabbar('historico')}</div>`; } };
A.histV = v => { if (v === 'rel' && !S.env.net) { nav('semnet'); return; } U.v = v; rerender(); };
function calView(){
  U.m ??= TODAY.getMonth(); U.y ??= 2026; U.sel ??= TODAYK;
  const first = new Date(U.y, U.m, 1), dim = new Date(U.y, U.m + 1, 0).getDate();
  const cells = []; for (let i = 0; i < first.getDay(); i++) cells.push('<span></span>');
  for (let d = 1; d <= dim; d++) { const dt = new Date(U.y, U.m, d), k = dkey(dt), has = dayTotal(k) > 0, fut = dt > TODAY, met = k === TODAYK ? metToday() : S.met.has(k);
    cells.push(`<button class="cd ${has ? 'has' : ''} ${U.sel === k ? 'sel' : ''} ${k === TODAYK ? 'today' : ''} ${fut ? 'fut' : ''}" data-a="selDay" data-v="${k}" ${fut ? 'disabled' : ''}>${d}${met ? '<i class="m"></i>' : ''}</button>`); }
  const sd = parseK(U.sel), list = S.history.filter(s => s.d === U.sel), tot = dayTotal(U.sel);
  const canPrev = !(U.y === 2026 && U.m <= 8), canNext = !(U.y === 2026 && U.m >= TODAY.getMonth());
  return `<div class="calhd"><button class="iconbtn" style="margin:0;${canPrev ? '' : 'opacity:.3'}" data-a="mes" data-v="-1">${ic('left', 22)}</button><b>${MESES[U.m][0].toUpperCase() + MESES[U.m].slice(1)} de ${U.y}</b><button class="iconbtn" style="margin:0;${canNext ? '' : 'opacity:.3'}" data-a="mes" data-v="1">${ic('right', 22)}</button></div>
  <div class="cal">${DOW1.map(d => `<span class="wh">${d}</span>`).join('')}${cells.join('')}</div>
  <div class="legend"><span><i class="lg1"></i>Com sessões</span><span><i class="lg2"></i>Meta batida</span></div>
  <h3 class="sec strong" style="margin-top:18px">${U.sel === TODAYK ? 'Hoje, ' : ''}${sd.getDate()} de ${MESES[sd.getMonth()]}</h3>
  ${list.length ? `<div class="tot">Tempo total de foco<b>${fmtDur(tot)}</b></div>${list.map(s => `<div class="card hrow"><b style="width:46px">${s.t}</b>${tagFor(s.cat)}<span class="grow"></span><b>${fmtDur(s.min)}</b></div>`).join('')}`
    : S.history.length ? `<div class="empty">${ic('timer', 26)}<b>Sem sessões neste dia</b><span class="small">Escolha um dia destacado no calendário.</span></div>`
    : `<div class="empty">${ic('timer', 26)}<b>Seu histórico começa aqui</b><span class="small">Suas sessões concluídas aparecem aqui, com tempo e categoria.</span><button class="pill-btn mt8" style="height:44px;padding:0 20px" data-a="tab" data-v="timers">Iniciar primeira sessão</button></div>`}`;
}
A.selDay = v => { U.sel = v; rerender(); };
A.mes = v => { const m = U.m + +v; if ((U.y === 2026 && m < 8) || (U.y === 2026 && m > TODAY.getMonth())) return; U.m = m; const k = dkey(new Date(U.y, U.m, 1)); U.sel = U.m === TODAY.getMonth() ? TODAYK : (S.history.find(s => s.d.startsWith(k.slice(0, 7)))?.d || k); rerender(); };
/* ================= 31 Recuperação ================= */
/* RESPONSÁVEL: Pessoa 4 · Tutorial, histórico e suporte (histórias 19 a 24 do backlog) */
SCREENS.recuperacao = {
  r: () => { U.st ??= 'ask'; const n = (S.allHistory || []).length;
    if (U.st === 'ask') return `<div class="scr"><div class="body"><div class="hero" style="padding-top:120px"><div class="iconhero t">${ic('cloud', 40)}</div><h2>Recuperar seu histórico</h2><p>Encontramos <b style="color:var(--text)">${n} sessões</b> associadas à sua conta.</p></div></div><div class="foot"><button class="btn pri" data-a="recuperar">Recuperar histórico</button><button class="btn link" data-a="agoraNao">Agora não</button></div></div>`;
    if (U.st === 'load') return `<div class="scr"><div class="body"><div class="hero" style="padding-top:150px"><div class="iconhero t">${ic('cloud', 40)}</div><h2>Recuperando seu histórico…</h2><div class="bar t" style="width:220px;height:8px;margin-top:10px"><i id="rbar" style="width:0%;transition:width .2s linear"></i></div><p class="small" id="rpct">Recuperando 0%</p></div></div></div>`;
    if (U.st === 'ok') return `<div class="scr"><div class="body"><div class="hero" style="padding-top:150px"><div class="iconhero g">${ic('check', 42, '', 3)}</div><h2>Histórico recuperado com sucesso</h2><p>${n} sessões foram restauradas neste aparelho.</p></div></div><div class="foot"><button class="btn pri" data-a="verHist">Ver meu histórico</button><button class="btn link" data-a="agoraNao">Ir para o início</button></div></div>`;
    return `<div class="scr"><div class="body"><div class="hero" style="padding-top:140px"><div class="iconhero r"><b style="font-size:42px">!</b></div><h2>Não foi possível recuperar seu histórico</h2><p>Confira sua conexão com a internet e tente de novo.</p></div></div><div class="foot"><button class="btn pri" data-a="recuperar">Tentar novamente</button><button class="btn link" data-a="go" data-v="contato">Falar com o suporte</button></div></div>`;
  },
  after: () => { if (U.st !== 'load') return; let p = 0; clearInterval(U.t);
    U.t = setInterval(() => { if (cur().id !== 'recuperacao') return clearInterval(U.t); p += 4 + Math.random() * 6;
      if (!S.env.net && p > 40) { clearInterval(U.t); U.st = 'err'; return rerender(); }
      if (p >= 100) { clearInterval(U.t); restoreHistory(); U.st = 'ok'; return rerender(); }
      const b = $('#rbar'), t = $('#rpct'); if (b) b.style.width = p + '%'; if (t) t.textContent = `Recuperando ${Math.floor(p)}%`; }, 120); }
};
A.recuperar = () => { U.st = 'load'; rerender(); };
A.agoraNao = () => nav('inicio', {}, { reset:true });
A.verHist = () => nav('historico', { v:'cal' }, { reset:true });

/* ================= 37 Assinatura ================= */
/* RESPONSÁVEL: Pessoa 4 · Tutorial, histórico e suporte (histórias 19 a 24 do backlog) */
const PLANS = { mensal:{ l:'Mensal', p:'R$ 19,90 por mês' }, anual:{ l:'Anual', p:'R$ 179,90 por ano' }, estudante:{ l:'Estudante', p:'R$ 9,90 por mês' } };
SCREENS.assinatura = { r: () => { const s = S.sub, pl = PLANS[s.plan];
  const tag = s.status === 'ativa' ? '<span class="tag green">Ativa</span>' : s.status === 'cancelada' ? '<span class="tag gray">Cancelada</span>' : '<span class="tag orange" style="height:auto;padding:4px 10px;line-height:1.2">Pagamento<br>pendente</span>';
  return `<div class="scr">${hdr('Minha assinatura')}<div class="body">
    <div class="card plan"><div class="row" style="align-items:flex-start"><span class="planlogo">${ic('plus', 22, '', 2.6)}</span><div class="grow"><span class="xs muted">Seu plano</span><div style="font-size:19px;font-weight:700;line-height:1.2">Concentra+ Premium</div><div class="small muted">${pl.l}</div></div>${tag}</div>
      <div style="border-top:1px solid var(--line2);margin-top:16px">${s.status === 'cancelada' ? `<div class="kv" style="padding:14px 0 0"><span>Acesso até</span><span class="b">05/12/2026</span></div>` : `<div class="kv" style="padding:14px 0"><span>Valor</span><span class="b">${pl.p}</span></div><div class="kv" style="padding:14px 0 0"><span>Próxima cobrança</span><span class="b">${s.plan === 'anual' ? '05/11/2027' : '05/12/2026'}</span></div>`}</div></div>
    ${s.status === 'pendente' ? `<div class="alert o mt12">${ic('tri', 20)}<span>Não conseguimos cobrar o seu cartão. Atualize a forma de pagamento para manter o acesso.</span></div>` : ''}
    ${s.status === 'cancelada' ? `<p class="small muted mt16" style="line-height:1.5">Depois de 05/12/2026, o modo foco e o bloqueio de aplicativos deixam de funcionar. Seu histórico continua salvo.</p>` : ''}
    <h3 class="sec">Incluso no Premium</h3><div class="list">${['Timers ilimitados e categorias','Bloqueio de aplicativos e Modo Restrito','Relatórios com download em PDF','Sons e músicas para foco'].map(x => `<div class="li" style="font-size:14.5px"><span style="color:var(--green)">${ic('check', 17, '', 2.6)}</span>${x}</div>`).join('')}</div>
  </div><div class="foot">${s.status === 'ativa' ? `<button class="btn pri" data-a="go" data-v="gerenciar">Gerenciar assinatura</button><button class="btn link red" data-a="cancelarAss">Cancelar assinatura</button>` : s.status === 'cancelada' ? `<button class="btn pri" data-a="reativar">Reativar assinatura</button>` : `<button class="btn pri" data-a="atualizarPgto">Atualizar forma de pagamento</button>`}</div></div>`; } };
A.reativar = () => { S.sub.status = 'ativa'; rerender(); toast('Assinatura reativada'); };
A.cancelarAss = () => nav('gerenciar', { ask:true });
A.atualizarPgto = () => nav('gerenciar', { card:true });

/* 38 gerenciar */
/* ----- 38 Gerenciar assinatura ----- */
/* RESPONSÁVEL: Pessoa 4 · Tutorial, histórico e suporte (histórias 19 a 24 do backlog) */
SCREENS.gerenciar = {
  r: p => { const s = S.sub, pl = PLANS[s.plan];
    let sh = '';
    if (U.modal === 'cancel') sh = modal(`<h3 style="margin-top:0">Cancelar assinatura?</h3><p>Você mantém o acesso até 05/12/2026. Depois dessa data, o modo foco e o bloqueio de aplicativos deixam de funcionar.</p><button class="btn pri" data-a="closeOverlay">Manter plano</button><button class="btn link red" data-a="confirmCancel">Cancelar assinatura</button>`);
    if (U.sheet === 'plano') sh = sheet(`<h3>Alterar plano</h3><p class="small muted">A mudança vale a partir da próxima cobrança.</p><div class="mt16">${Object.entries(PLANS).map(([k, x]) => `<button class="card themeopt ${s.plan === k ? 'sel' : ''}" style="margin-bottom:10px" data-a="setPlano" data-v="${k}"><div class="grow"><b>${x.l}</b><div class="small muted">${x.p}${k === 'anual' ? ' · equivale a R$ 14,99/mês' : k === 'estudante' ? ' · com comprovante de matrícula' : ''}</div></div><span class="radio ${s.plan === k ? 'on' : ''}">${s.plan === k ? ic('check', 14, '', 3) : ''}</span></button>`).join('')}</div><button class="btn link muted" data-a="closeOverlay">Fechar</button>`);
    if (U.sheet === 'card') { U.cn ??= ''; U.cv ??= ''; U.cc ??= '';
      sh = sheet(`<h3>Forma de pagamento</h3><p class="small muted">Cartão atual: final ${s.card}</p><label class="lbl">Número do cartão</label><input class="inp ${U.eC ? 'err' : ''}" data-in="cn" data-oi="fmtCard" inputmode="numeric" placeholder="0000 0000 0000 0000" value="${esc(U.cn)}" maxlength="19"><div class="row" style="gap:10px"><div class="grow"><label class="lbl">Validade</label><input class="inp" data-in="cv" placeholder="MM/AA" maxlength="5" value="${esc(U.cv)}"></div><div class="grow"><label class="lbl">CVV</label><input class="inp" data-in="cc" inputmode="numeric" placeholder="123" maxlength="4" value="${esc(U.cc)}"></div></div>${U.eC ? `<div class="errt">${ic('alertc', 15)}${U.eC}</div>` : ''}<p class="xs muted mt12 row">${ic('lock', 13)}Protótipo: nenhum dado é enviado ou salvo.</p><button class="btn pri mt16" data-a="salvarCartao">Salvar cartão</button><button class="btn link muted" data-a="closeOverlay">Cancelar</button>`); }
    return `<div class="scr">${hdr('Gerenciar assinatura')}<div class="body"><p class="sub" style="font-size:14.5px">Concentra+ Premium · ${pl.p}</p>
      <div class="list mt16"><button class="li" data-a="openSheet" data-v="plano">${ic('arrowr', 20)}<span class="grow"><b style="font-weight:600">Alterar plano</b><div class="sub2">Mensal, anual ou estudante</div></span>${ic('right', 18, 'muted')}</button><button class="li" data-a="openSheet" data-v="card">${ic('card', 20)}<span class="grow"><b style="font-weight:600">Forma de pagamento</b><div class="sub2">Cartão final ${s.card}</div></span>${s.status === 'pendente' ? '<span class="dot o"></span>' : ''}${ic('right', 18, 'muted')}</button>${s.status !== 'cancelada' ? `<button class="li red" data-a="askCancel">${ic('xcircle', 20)}<span class="grow b" style="font-weight:600">Cancelar assinatura</span></button>` : ''}</div>
    </div>${sh}</div>`; },
  after: p => { if (p.ask && !U.done) { U.done = 1; U.modal = 'cancel'; rerender(); } if (p.card && !U.done) { U.done = 1; U.sheet = 'card'; rerender(); } }
};
A.openSheet = v => { U.sheet = v; U.eC = null; rerender(); };
A.askCancel = () => { U.modal = 'cancel'; rerender(); };
A.confirmCancel = () => { S.sub.status = 'cancelada'; nav('assinatura', {}, { replace:true, anim:'back' }); stack = stack.filter((x, i, a) => !(x.id === 'assinatura' && i < a.length - 1)); toast('Assinatura cancelada'); };
A.setPlano = v => { S.sub.plan = v; U.sheet = null; rerender(); toast(`Plano alterado para ${PLANS[v].l}`); };
A.fmtCard = (v, el) => { const d = v.replace(/\D/g, '').slice(0, 16); el.value = d.replace(/(.{4})/g, '$1 ').trim(); U.cn = el.value; };
A.salvarCartao = () => { const d = (U.cn || '').replace(/\D/g, ''); if (d.length < 13) { U.eC = 'Número de cartão incompleto'; return rerender(); } if (!/^\d{2}\/\d{2}$/.test(U.cv || '')) { U.eC = 'Validade no formato MM/AA'; return rerender(); } if ((U.cc || '').length < 3) { U.eC = 'CVV inválido'; return rerender(); }
  S.sub.card = d.slice(-4); const wasPend = S.sub.status === 'pendente'; if (wasPend) S.sub.status = 'ativa'; U.sheet = null; U.cn = U.cv = U.cc = ''; rerender(); toast(wasPend ? 'Pagamento aprovado. Assinatura ativa.' : `Cartão final ${S.sub.card} salvo`); };
