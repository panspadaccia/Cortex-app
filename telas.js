/* Concentra+ · js/pessoa3/telas.js
   Pessoa 3 · Início, metas e tema (histórias 13 a 18 do backlog)
   Integrante: THAIS · GitHub: @thaisrpc
   Seções deste arquivo: 11 Início, 14 Antes de começar, 16 Concluída, 19 Ofensiva, 32 Agenda */
/* ================= 11 Início ================= */
/* RESPONSÁVEL: Pessoa 3 · Início, metas e tema (histórias 13 a 18 do backlog) */
function statusChip(){
  const w = S.watch;
  if (S.sess && !S.sess.known) return '';
  if (!w.paired || !connected()) return `<button class="stchip" data-a="go" data-v="relogio"><span class="dot"></span>Relógio desconectado</button>`;
  const low = w.battery < 20;
  return `<button class="stchip" data-a="go" data-v="relogio"><span class="dot g"></span>${low ? 'Relógio conectado, bateria baixa' : 'Relógio conectado'}<span class="bat ${low ? 'low' : ''}">${batIcon(w.battery, low)} ${w.battery} %</span></button>`;
}
SCREENS.inicio = {
  r: p => {
    const ts = todaySessions(), pct = goalPct(), st = streak(), w = S.watch;
    const first = (S.user.name || '').split(/[\s.]/)[0];
    const name = first ? first[0].toUpperCase() + first.slice(1) : '';
    let banner = '';
    if (S.sess && S.sess.known) banner = `<button class="alert t mt16" style="width:100%;text-align:left" data-a="go" data-v="sessao">${ic('timer', 22)}<div class="grow"><b>Sessão em andamento</b><span id="homeSess">${fmtSec(S.sess.remaining)} · ${S.sess.phase === 'foco' ? 'Foco' : 'Descanso'} · ${esc(catName(S.sess.cat))}</span></div>${ic('right', 18)}</button>`;
    else if (!w.paired || !connected()) banner = `<div class="alert o mt16"><div class="grow"><b>Conecte seu relógio</b>Sem ele, você não sincroniza as sessões.</div><button class="pill-btn" data-a="${w.paired ? 'reconectar' : 'parear'}">Conectar</button></div>`;
    else if (w.battery < 20) banner = `<div class="alert r mt16"><span style="color:var(--red)">${batIcon(w.battery, true)}</span><div><b>Bateria do relógio baixa (${w.battery}%)</b>Ligue o cabo USB-C para carregar.</div></div>`;
    // 07 Tutorial: iniciar sessão (balão sobre o botão). Responsável: Pessoa 4 · Tutorial (história 19). A tela em si é a 11 Início (Pessoa 3).
    const coach = p.coach && !U.coachDone;
    return `<div class="scr"><div class="body" style="padding-top:12px">
      <div class="between" style="align-items:flex-start"><div class="greet"><small>${greeting()}</small><h1>Olá, ${esc(name)}</h1></div>${statusChip()}</div>
      ${banner}
      <div class="grid2 mt16">
        <button class="card pad" style="text-align:left" data-a="go" data-v="meta"><span class="small muted">Meta de hoje</span><div style="font-size:30px;font-weight:700;margin:6px 0 10px;letter-spacing:-.02em" id="homePct">${pct}%</div><div class="bar"><i style="width:${pct}%"></i></div><p class="small muted mt12" id="homeGoal">${fmtDur(todayTotal())} de ${fmtGoal(S.goal)}</p></button>
        <button class="card pad center" style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px" data-a="go" data-v="ofensiva"><span style="color:${st ? 'var(--orange)' : 'var(--track)'}">${ic('flame', 30)}</span><b style="font-size:28px;margin-top:4px">${st}</b><span class="small muted">${st === 1 ? 'dia seguido' : 'dias seguidos'}</span></button>
      </div>
      <div class="${coach ? 'spot' : ''}"><button class="btn pri big mt16" data-a="${coach ? 'noop' : 'tab'}" data-v="timers">${ic('play', 18)}Iniciar sessão</button></div>
      ${coach ? `<div class="coach" style="top:${banner ? 330 : 238}px"><b style="font-size:18px">Pronto para começar?</b><p class="small muted mt8" style="line-height:1.5">Escolha um timer e toque em iniciar. O relógio e o aplicativo ficam sincronizados.</p><button class="btn pri mt16" style="height:46px;font-size:15px" data-a="coachOk">Começar a usar</button></div><div class="scrim" style="z-index:40"></div>` : ''}
      <h3 class="sec strong">Sessões de hoje</h3>
      ${ts.length ? ts.slice().reverse().map(s => `<div class="card sess"><span class="sicon" style="${catStyle(s.cat)}">${ic(CAT_ICON[s.cat] || 'tagi', 20)}</span><div class="grow"><b style="font-size:15.5px">${esc(catName(s.cat))}</b><div class="small muted">${s.t}${s.src === 'relogio' ? ' · pelo relógio' : ''}</div></div><b>${fmtDur(s.min)}</b></div>`).join('')
        : `<div class="empty">${ic('clock', 30)}<b>Você ainda não tem sessões hoje</b><span class="small">Toque em Iniciar sessão para começar.</span></div>`}
      ${S.sound.playing && !S.sess ? `<div class="mt8">${miniPlayer()}</div>` : ''}
    </div>${tabbar('inicio')}</div>`;
  }
};
const catStyle = id => { const c = catById(id); return c.color === 'teal' ? '' : `background:${hexA(COLORS[c.color], .14)};color:${COLORS[c.color]}`; };
const hexA = (h, a) => { const n = parseInt(h.slice(1), 16); return `rgba(${n>>16},${(n>>8)&255},${n&255},${a})`; };
A.coachOk = () => { U.coachDone = true; cur().p = {}; rerender(); };

/* ================= 14 Antes de começar ================= */
/* RESPONSÁVEL: Pessoa 3 · Início, metas e tema (histórias 13 a 18 do backlog) */
SCREENS.antes = { r: () => {
  const t = timerById(S.selTimer) || S.timers[0], o = S.opts, tr = trackById(S.sound.track);
  const permWarn = o.block && !permsOk();
  let sh = '';
  if (U.modal === 'restrito') sh = modal(`<div class="iconhero o" style="width:48px;height:48px;margin:0">${ic('lock', 22)}</div><h3>Tem certeza?</h3><p>Não será possível cancelar nem pausar a sessão, nem pelo aplicativo nem pelos botões do Concentra+.</p><button class="btn pri" data-a="iniciarSessao" data-v="ok">Iniciar modo restrito</button><button class="btn link muted" data-a="closeOverlay">Voltar</button>`);
  return `<div class="scr">${hdr()}<div class="body"><h1 class="h1">Antes de começar</h1>
    <div class="card" style="background:var(--pri-soft);border-color:transparent;padding:16px;display:flex;gap:14px;align-items:center;margin-top:12px">${ring(.75, 'var(--pri)', 50, 5)}<div class="grow"><b style="font-size:17px">${esc(t.name)}</b><div class="small muted" style="margin-top:2px">${esc(catName(t.cat))} · ${t.focus} min de foco + ${t.rest} min de descanso</div></div><button class="tlink small" data-a="back">Trocar</button></div>
    <div class="card mt12"><div class="between pad" style="padding-bottom:${o.block ? 8 : 16}px"><div><b>Bloquear aplicativos</b><div class="small muted" style="margin-top:2px">Durante a sessão, sem notificações</div></div>${tg(o.block, 'opt', 'block')}</div>
      ${o.block ? `<button class="between" style="width:100%;padding:6px 16px 15px;color:var(--pri);font-weight:600;font-size:14.5px" data-a="go" data-v="bloqueio"><span>${blockedCount()} apps selecionados</span>${ic('right', 18)}</button>` : ''}
      ${permWarn ? `<button class="alert o" style="margin:0 12px 12px;width:calc(100% - 24px);text-align:left;padding:11px 12px" data-a="go" data-v="permissoes">${ic('tri', 18)}<div class="grow small"><b style="font-size:14px">${permsCount()} de 4 permissões ativas</b>Sem elas, o bloqueio pode não funcionar.</div>${ic('right', 16)}</button>` : ''}</div>
    <div class="card mt12"><div class="between pad" style="padding-bottom:${o.music ? 8 : 16}px"><div><b>Música ou som ambiente</b><div class="small muted" style="margin-top:2px">Toca no aplicativo durante o foco</div></div>${tg(o.music, 'opt', 'music')}</div>
      ${o.music ? `<button class="mini" style="padding:4px 16px 14px" data-a="go" data-v="sons"><span class="sicon" style="background:${tr.c};color:#fff">${ic('music', 18)}</span><div class="grow"><b style="font-size:14.5px">${esc(tr.name)}</b><div class="xs muted">${tr.sub}</div></div><span class="tlink small">Trocar</span></button>` : ''}</div>
    <div class="card mt12 between pad"><div style="max-width:250px"><b>Modo Restrito</b><div class="small muted" style="margin-top:2px">A sessão não poderá ser pausada nem cancelada</div></div>${tg(o.restrict, 'opt', 'restrict')}</div>
    ${S.agenda.provider && S.agenda.busy ? `<p class="xs muted mt12 row">${ic('calcheck', 15)}Um evento “Ocupado” será criado no ${S.agenda.provider} Agenda.</p>` : ''}
    ${!connected() ? `<p class="xs muted mt12 row">${ic('bt', 15)}Relógio desconectado: a sessão roda só no celular.</p>` : ''}
  </div><div class="foot"><button class="btn pri big" data-a="iniciarSessao">${ic('play', 18)}Iniciar</button></div>${sh}</div>`;
} };
A.opt = v => { S.opts[v] = !S.opts[v]; rerender(); };
A.iniciarSessao = v => {
  if (S.opts.restrict && v !== 'ok') { U.modal = 'restrito'; return rerender(); }
  const t = timerById(S.selTimer) || S.timers[0];
  startSession(t, 'app');
  nav('sessao', {}, { reset:true });
};

/* ================= 16 Concluída ================= */
/* RESPONSÁVEL: Pessoa 3 · Início, metas e tema (histórias 13 a 18 do backlog) */
SCREENS.concluida = { r: () => {
  const d = S.lastDone || { min:0, cat:'estudo' }, hit = d.hitGoal, pct = goalPct();
  const conf = Array.from({ length:18 }, (_, i) => `<i style="left:${(i * 53) % 100}%;top:${(i * 37) % 40}px;background:${['var(--orange)','var(--pri)','var(--green)'][i % 3]};animation-delay:${(i % 6) * .12}s;border-radius:${i % 2 ? '50%' : '2px'}"></i>`).join('');
  return `<div class="scr"><div class="confetti">${conf}</div><div class="body"><div class="hero" style="padding-top:44px">
    ${hit ? `<div class="iconhero o" style="width:88px;height:88px">${ic('flame', 40)}</div><h2 style="font-size:26px">Meta diária atingida!</h2><p>Parabéns! Você bateu sua meta de hoje. Sua ofensiva chegou a ${streak()} ${streak() === 1 ? 'dia' : 'dias'}.</p>`
      : `<div class="iconhero g">${ic('check', 42, '', 3)}</div><h2 style="font-size:26px">${d.early ? 'Sessão encerrada' : 'Sessão concluída!'}</h2><p>${d.early ? 'Tudo bem parar antes. O tempo que você focou foi registrado no histórico.' : 'Bom trabalho. Seu foco foi registrado no histórico.'}</p>`}</div>
    <div class="card pad mt24"><div style="display:flex"><div class="grow center"><small class="muted small">Duração</small><div style="font-size:22px;font-weight:700;margin-top:2px">${fmtDur(d.min)}</div></div><div style="width:1px;background:var(--line)"></div><div class="grow center"><small class="muted small">Categoria</small><div style="font-size:22px;font-weight:700;margin-top:2px">${esc(catName(d.cat))}</div></div></div>
      <div class="between mt16 small"><b>Meta de hoje</b><span class="muted">${fmtDur(todayTotal())} de ${fmtGoal(S.goal)}</span></div><div class="bar mt8"><i style="width:${pct}%"></i></div></div>
    ${d.unlock ? `<div class="alert t mt12" style="align-items:center"><span class="avatar" style="width:40px;height:40px;background:var(--orange);color:#fff;font-size:16px">${d.unlock}</span><div><b>Conquista desbloqueada!</b>${d.unlock} dias seguidos batendo a meta</div></div>` : ''}
    ${S.agenda.provider && S.agenda.busy ? `<p class="xs muted mt16 row">${ic('calcheck', 15)}O evento “Ocupado” na sua agenda foi encerrado.</p>` : ''}
  </div><div class="foot"><button class="btn pri" data-a="tab" data-v="timers">Nova sessão</button><button class="btn link" data-a="tab" data-v="inicio">Voltar ao início</button></div></div>`;
} };

/* ================= 19 Ofensiva ================= */
/* RESPONSÁVEL: Pessoa 3 · Início, metas e tema (histórias 13 a 18 do backlog) */
SCREENS.ofensiva = { r: () => {
  const st = streak(), days = [];
  for (let i = 6; i >= 0; i--) { const d = addDays(TODAY, -i), k = dkey(d); days.push({ l:DOW1[d.getDay()], on: k === TODAYK ? metToday() : S.met.has(k), today: k === TODAYK }); }
  const best = Math.max(st, ...[7,30,100].filter(n => S.unlocked.has(n)));
  const badge = n => { const on = st >= n || S.unlocked.has(n); return `<div class="card badge ${on ? 'on' : ''}"><span class="n">${n}</span><b>${n} dias</b><small>${on ? 'Conquistada' : n === 7 ? `${Math.min(st, 7)}/7 dias` : 'Bloqueada'}</small></div>`; };
  return `<div class="scr">${hdr()}<div class="body"><h1 class="h1">Ofensiva e conquistas</h1>
    <div class="streak mt12"><span style="color:${st ? 'var(--orange)' : 'var(--pri-soft2)'};display:inline-block">${ic('flame', 46)}</span><div class="bigval" style="margin-top:4px">${st}</div><b style="font-size:16px">${st === 1 ? 'dia seguido' : 'dias seguidos'}</b><p class="small muted mt8" style="line-height:1.45">${st ? (metToday() ? 'Meta de hoje batida. Volte amanhã para continuar a sequência.' : 'Bata sua meta hoje para continuar a sequência.') : 'Sua ofensiva recomeçou. Comece uma nova hoje.'}</p></div>
    <div class="card mt12"><div class="wkdots">${days.map(d => `<div>${d.l}<span class="wd ${d.on ? 'on' : ''} ${d.today && !d.on ? 'today' : ''}">${d.on ? ic('check', 16, '', 3) : ''}</span></div>`).join('')}</div></div>
    ${st >= 7 ? `<div class="alert t mt12" style="align-items:center"><span class="avatar" style="width:40px;height:40px;background:var(--orange);color:#fff;font-size:16px">7</span><div><b>Conquista desbloqueada!</b>7 dias seguidos batendo a meta</div></div>` : ''}
    <h3 class="sec">Conquistas</h3><div class="badges">${[7,30,100].map(badge).join('')}</div>
    <p class="xs muted mt16">A ofensiva conta os dias seguidos em que você bateu a meta diária (${fmtGoal(S.goal)}). Um dia sem sessões zera o contador.</p>
  </div></div>`;
} };

/* ================= 32 Agenda ================= */
/* RESPONSÁVEL: Pessoa 3 · Início, metas e tema (histórias 13 a 18 do backlog) */
SCREENS.agenda = { r: () => { const ag = S.agenda;
  if (U.loading) return `<div class="scr">${hdr('Integração com agenda')}<div class="body"><div class="hero" style="padding-top:140px"><div class="radar" style="width:120px;height:120px;margin:0"><i class="p" style="inset:0"></i><span class="iconsq">${ic('cal', 26)}</span></div><h2 style="font-size:20px">Conectando ao ${U.loading}…</h2><p>Autorize o acesso na janela da sua conta.</p></div></div></div>`;
  if (!ag.provider) return `<div class="scr">${hdr('Integração com agenda')}<div class="body"><div class="hero" style="padding-top:30px"><span class="iconsq" style="width:84px;height:84px;border-radius:22px">${ic('calcheck', 40, '', 1.7)}</span><h2>Conectar agenda</h2><p>Marque seu horário como Ocupado durante as sessões de foco, para os seus contatos saberem que você não pode ser interrompido.</p><p class="small muted">Você pode alterar essa configuração ou desconectar sua conta quando quiser.</p></div></div>
    <div class="foot"><button class="btn out" data-a="conectarAgenda" data-v="Google"><span style="width:18px;height:18px;border-radius:50%;background:conic-gradient(#ea4335 0 25%,#fbbc05 0 50%,#34a853 0 75%,#4285f4 0)"></span>Entrar com Google</button><button class="btn out" data-a="conectarAgenda" data-v="Microsoft"><span style="display:grid;grid-template-columns:8px 8px;gap:2px"><i style="width:8px;height:8px;background:#f25022"></i><i style="width:8px;height:8px;background:#7fba00"></i><i style="width:8px;height:8px;background:#00a4ef"></i><i style="width:8px;height:8px;background:#ffb900"></i></span>Entrar com Microsoft</button></div></div>`;
  return `<div class="scr">${hdr('Integração com agenda')}<div class="body">
    <div class="card between pad"><div class="row"><span class="avatar" style="width:42px;height:42px;font-size:16px">${ag.provider[0]}</span><div><b>${ag.provider === 'Google' ? 'Google Agenda' : 'Outlook'}</b><div class="small muted">${esc(S.user.email)}</div></div></div><span class="tag green">Conectada</span></div>
    <div class="card between pad mt12"><div style="max-width:240px"><b>Criar evento Ocupado nas sessões</b><div class="small muted mt8" style="margin-top:3px">Um evento com a duração do timer aparece na sua agenda.</div></div>${tg(ag.busy, 'toggleBusy')}</div>
    ${ag.busy ? `<div class="card pad mt12" style="border-left:4px solid var(--pri)"><span class="xs muted">Prévia na agenda</span><div class="b mt8" style="margin-top:4px">Ocupado · Foco (Concentra+)</div><div class="small muted">Hoje, ${nowHM()} · ${(timerById(S.selTimer) || S.timers[0]).focus} min</div></div>` : ''}
  </div><div class="foot"><button class="btn out" style="color:var(--red)" data-a="desconAgenda">Desconectar</button></div></div>`; } };
A.conectarAgenda = v => { if (!S.env.net) return toast('Sem internet para conectar a agenda', 'wifioff'); U.loading = v; rerender(); setTimeout(() => { if (cur().id !== 'agenda') return; S.agenda.provider = v; U.loading = null; rerender(); toast(`${v === 'Google' ? 'Google Agenda' : 'Outlook'} conectado`); }, 1600); };
A.toggleBusy = () => { S.agenda.busy = !S.agenda.busy; rerender(); };
A.desconAgenda = () => { S.agenda.provider = null; rerender(); toast('Agenda desconectada'); };
