/* Concentra+ · js/pessoa2/telas.js
   Pessoa 2 · Sessão, bloqueio e conta (histórias 07 a 12 do backlog)
   Integrante: [NOME] · GitHub: [@usuario]
   Seções deste arquivo: 10 Config relógio, 15 Sessão, 18 Meta, 22 Apps bloqueados, 33 Lembretes, 34 Perfil, 39 Excluir conta, 40 Sair da conta */
/* ================= 10 Config relógio ================= */
/* RESPONSÁVEL: Pessoa 2 · Sessão, bloqueio e conta (histórias 07 a 12 do backlog) */
SCREENS.configrelogio = { r: () => { const w = S.watch;
  return `<div class="scr">${hdr('Configurações do relógio')}<div class="body">
    <div class="card pad"><div class="between"><b>Volume dos alertas</b><b style="color:var(--pri)" id="volv">${w.silent ? 'Silencioso' : w.volume + '%'}</b></div>
      <input type="range" min="0" max="100" step="10" value="${w.volume}" data-oi="setVol" style="width:100%;margin-top:14px;accent-color:var(--pri)" ${w.silent ? 'disabled' : ''}>
      <div class="between mt8"><p class="xs muted" style="max-width:220px">O nível também aparece no display do relógio enquanto você ajusta.</p><button class="ebtn" data-a="testeAlerta" style="flex:none">${ic('vol', 15)}</button></div></div>
    <div class="card pad mt12 between"><div><b>Modo silencioso</b><p class="small muted mt8" style="margin-top:3px">Apenas aviso visual no display e vibração, sem som.</p></div>${tg(w.silent, 'toggleSilent')}</div>
    <div class="card pad mt12"><div class="between"><b>Formato da hora</b><span class="mini-clock" style="font-size:15px;padding:6px 10px" id="cfgclock">${watchClock()}</span></div>
      <div class="seg mt12"><button class="${!w.h24 ? 'on' : ''}" data-a="setH24" data-v="0">12 horas</button><button class="${w.h24 ? 'on' : ''}" data-a="setH24" data-v="1">24 horas</button></div></div>
    <div class="card pad mt12"><b>Botões do relógio</b>
      <div style="display:flex;justify-content:space-between;margin:14px 4px 0">${[['music','Música'],['minus','Volume –'],['playpause','Timer'],['plus','Volume +'],['updown','Telas']].map(([i, l], k) => `<div style="display:flex;flex-direction:column;align-items:center;gap:6px;font-size:11px;color:var(--muted)"><span style="width:34px;height:34px;border-radius:50%;background:${k === 2 ? 'var(--pri)' : '#25292d'};color:#fff;display:flex;align-items:center;justify-content:center">${ic(i, 16, '', 2)}</span>${l}</div>`).join('')}</div>
      <p class="small muted mt12">O botão do centro inicia, pausa e retoma o timer sem tocar no celular. O botão Telas alterna entre hora, timer, meta e bateria.</p></div>
    <p class="center xs muted mt16">As alterações são aplicadas no relógio automaticamente.</p>
  </div></div>`; } };
A.setVol = v => { S.watch.volume = +v; S.watch.silent = false; const el = $('#volv'); if (el) el.textContent = v + '%'; watchOverlay('vol'); };
A.testeAlerta = () => beep();
A.toggleSilent = () => { S.watch.silent = !S.watch.silent; watchOverlay('vol'); rerender(); };
A.setH24 = v => { S.watch.h24 = v === '1'; rerender(); toast(`Relógio no formato ${S.watch.h24 ? '24' : '12'} horas`, 'clock'); };

/* ================= 15 Sessão ================= */
/* RESPONSÁVEL: Pessoa 2 · Sessão, bloqueio e conta (histórias 07 a 12 do backlog) */
SCREENS.sessao = { r: () => {
  const s = S.sess;
  if (!s) return `<div class="scr"><div class="body center"><div class="hero"><h2>Nenhuma sessão em andamento</h2><button class="btn pri mt16" data-a="tab" data-v="timers">Escolher timer</button></div></div></div>`;
  const ph = s.phase === 'foco', paused = s.paused, c = connected();
  const col = paused ? 'var(--orange)' : ph ? 'var(--pri)' : 'var(--green)';
  const banner = !c && S.watch.paired ? `<div class="alert o" style="margin-top:14px">Sessão feita no Concentra+. Os dados serão sincronizados ao reconectar.</div>` : paused && s.pausedBy === 'watch' ? `<div class="alert o" style="margin-top:14px">Pausada pelo botão do Concentra+</div>` : '';
  const btns = s.restrict ? `<div class="center"><span class="tag orange" style="height:36px;padding:0 16px;font-size:14px;gap:8px">${ic('lock', 16)}Modo Restrito ativo</span></div>`
    : `<div class="row" style="gap:12px"><button class="btn out" style="flex:.8" data-a="encerrar">Encerrar</button><button class="btn pri" style="flex:1.2" data-a="${ph ? (paused ? 'retomar' : 'pausar') : 'pularDescanso'}" id="sessMain">${ph ? (paused ? 'Retomar' : 'Pausar') : 'Pular descanso'}</button></div>`;
  return `<div class="scr"><div class="hdr" style="padding:10px 20px 0"><span class="tag ${ph ? '' : 'green'}" style="height:30px;font-size:13px;padding:0 12px">${ph ? 'Foco' : 'Descanso'} · ${esc(catName(s.cat))}</span><div class="sp"></div><span class="sync"><span class="dot ${c ? 'g' : ''}"></span>${c ? 'Sincronizado' : S.watch.paired ? 'Sem conexão' : 'Só no celular'}</span></div>
    <div class="body" style="display:flex;flex-direction:column">${banner}
      <div style="flex:1;display:flex;flex-direction:column;justify-content:center;padding:20px 0">
        <div class="ring-wrap" id="sessRing">${ring(s.remaining / s.total, col, 250, 13)}<div class="ring-c"><div class="t" id="sessTime">${fmtSec(s.remaining)}</div><div class="s" id="sessState">${paused ? 'Pausada' : ph ? 'Em foco' : 'Descanso'}</div></div></div>
        <p class="center small muted mt24" id="sessSub">${esc(s.name)} · ${ph ? `descanso de ${s.rest} min a seguir` : 'depois, a sessão termina'}</p>
        ${s.block ? `<p class="center xs muted mt8 row" style="justify-content:center">${ic('lock', 13)}${blockedCount()} apps bloqueados · notificações silenciadas</p>` : ''}
      </div>
      ${btns}
      <div class="mt12">${S.opts.music || S.sound.playing ? miniPlayer() : ''}</div>
    </div></div>`;
} };
function miniPlayer(){ const t = trackById(S.sound.track); return `<div class="card mini" data-a="go" data-v="${S.sound.playing || S.sess ? 'player' : 'sons'}" role="button"><span class="sicon" style="background:${t.c};color:#fff">${ic('music', 18)}</span><div class="grow"><b style="font-size:15px">${esc(t.name)}<span class="eq ${S.sound.playing ? '' : 'stop'}"><i></i><i></i><i></i></span></b><div class="xs muted">${t.sub}</div></div><button class="pp" data-a="togglePlay">${ic(S.sound.playing ? 'pause' : 'play', 20)}</button></div>`; }
A.pausar = () => { pauseSession('app'); rerender(); };
A.retomar = () => { resumeSession(); rerender(); };
A.encerrar = () => finishSession(true);
A.pularDescanso = () => finishSession(false);

/* ================= 18 Meta ================= */
/* RESPONSÁVEL: Pessoa 2 · Sessão, bloqueio e conta (histórias 07 a 12 do backlog) */
SCREENS.meta = { r: () => { U.g ??= S.goal;
  return `<div class="scr">${hdr()}<div class="body"><h1 class="h1">Sua meta diária</h1><p class="sub">Quanto tempo de foco você quer ter por dia? Você recebe uma notificação ao atingir a meta.</p>
    <div class="card center" style="padding:26px 16px;margin-top:22px"><span class="small muted">Meta por dia</span><div class="bigval mt8">${U.g ? fmtGoal(U.g) : '0 min'}</div><div class="step" style="justify-content:center;margin-top:16px"><button class="sbtn" style="width:50px;height:50px" data-a="stepG" data-v="-">${ic('minus', 20, '', 2.2)}</button><button class="sbtn p" style="width:50px;height:50px" data-a="stepG" data-v="+">${ic('plus', 20, '', 2.2)}</button></div></div>
    <div class="row mt16" style="gap:8px">${[30,60,120,240].map(m => `<button class="chip ${U.g === m ? 'on' : ''}" style="flex:1;justify-content:center;height:44px;border-radius:12px" data-a="setG" data-v="${m}">${fmtGoal(m)}</button>`).join('')}</div>
    ${U.eG ? `<div class="errt mt12">${ic('alertc', 15)}Escolha uma meta maior que zero</div>` : ''}
    <p class="small muted mt16">Hoje você já focou ${fmtDur(todayTotal())}${U.g ? ` · ${Math.min(100, Math.round(todayTotal() / U.g * 100))}% desta meta` : ''}.</p>
  </div><div class="foot"><button class="btn pri" data-a="salvarMeta">Salvar meta</button></div></div>`; } };
A.stepG = v => { U.g = clamp(U.g + (v === '+' ? 30 : -30), 0, 720); U.eG = false; rerender(); };
A.setG = v => { U.g = +v; U.eG = false; rerender(); };
A.salvarMeta = () => { if (!U.g) { U.eG = true; return rerender(); } S.goal = U.g; back(); toast(`Meta diária salva: ${fmtGoal(S.goal)}`); checkGoal(); };

/* ================= 22 Apps bloqueados ================= */
/* RESPONSÁVEL: Pessoa 2 · Sessão, bloqueio e conta (histórias 07 a 12 do backlog) */
SCREENS.bloqueio = { r: () => { U.q ??= ''; U.sel ??= { ...S.blocked };
  const q = U.q.trim().toLowerCase(), list = APPS.filter(a => a.name.toLowerCase().includes(q)), n = Object.values(U.sel).filter(Boolean).length;
  return `<div class="scr">${hdr()}<div class="body"><h1 class="h1" style="font-size:25px">Apps bloqueados no foco</h1><p class="sub" style="font-size:14px">Os apps selecionados ficam bloqueados e sem notificações durante a sessão, e são liberados ao encerrar.</p>
    <div class="searchbox mt16">${ic('search', 19)}<input class="inp" data-in="q" data-oi="rr" value="${esc(U.q)}" placeholder="Buscar aplicativo"></div>
    <div class="mt12">${list.map(a => `<div class="card between" style="padding:11px 14px;margin-bottom:9px"><div class="row"><span class="applogo" style="background:${a.c}">${a.l}</span><b style="font-weight:500;font-size:15.5px">${a.name}</b></div>${tg(U.sel[a.id], 'toggleApp', a.id)}</div>`).join('') || `<p class="center muted small mt24">Nenhum aplicativo encontrado.</p>`}</div>
  </div><div class="foot" style="flex-direction:row;align-items:center;justify-content:space-between;border-top:1px solid var(--line)"><b style="font-weight:500">${n} ${n === 1 ? 'selecionado' : 'selecionados'}</b><button class="pill-btn" style="height:46px;padding:0 30px;font-size:15px" data-a="salvarApps">Salvar</button></div></div>`; } };
A.rr = () => rerender();
A.toggleApp = v => { U.sel[v] = !U.sel[v]; rerender(); };
A.salvarApps = () => { S.blocked = { ...U.sel }; back(); toast(`${blockedCount()} apps serão bloqueados no foco`, 'lock'); };

/* ================= 33 Lembretes ================= */
/* RESPONSÁVEL: Pessoa 2 · Sessão, bloqueio e conta (histórias 07 a 12 do backlog) */
const daysLabel = r => { if (r.freq === 'diario' || r.days.length === 7) return 'Todos os dias'; const s = [...r.days].sort((a, b) => ((a + 6) % 7) - ((b + 6) % 7)); const k = s.join(); if (k === '1,2,3,4,5') return 'Seg a Sex'; if (k === '6,0') return 'Sáb e Dom'; return s.map(d => DOW3[d]).join(', '); };
SCREENS.lembretes = { r: () => {
  let sh = '';
  if (U.sheet) { const r = U.ed;
    sh = sheet(`<h3>${r.id ? 'Editar lembrete' : 'Novo lembrete'}</h3><div class="timebig mt16"><input type="number" min="0" max="23" value="${pad2(r.h)}" data-oc="remH">:<input type="number" min="0" max="59" step="5" value="${pad2(r.m)}" data-oc="remM"></div>
    <div class="seg soft mt16"><button class="${r.freq === 'diario' ? 'on' : ''}" data-a="remFreq" data-v="diario">Diário</button><button class="${r.freq === 'semanal' ? 'on' : ''}" data-a="remFreq" data-v="semanal">Semanal</button></div>
    ${r.freq === 'semanal' ? `<div class="daychips">${[0,1,2,3,4,5,6].map(d => `<button class="${r.days.includes(d) ? 'on' : ''}" data-a="remDay" data-v="${d}">${DOW1[d]}</button>`).join('')}</div>` : ''}
    ${U.eR ? `<div class="errt">${ic('alertc', 15)}Escolha pelo menos um dia</div>` : ''}
    <button class="btn pri mt24" data-a="salvarLembrete">Salvar</button>${r.id ? `<button class="btn link red" data-a="delLembrete">Excluir lembrete</button>` : `<button class="btn link muted" data-a="closeOverlay">Cancelar</button>`}`); }
  return `<div class="scr">${hdr()}<div class="body"><h1 class="h1">Lembretes de foco</h1><p class="sub" style="font-size:14.5px">Receba uma notificação no celular para iniciar sua sessão no horário combinado.</p>
    <div class="mt16">${S.reminders.map(r => `<div class="card between" style="padding:14px 16px;margin-bottom:12px"><button style="text-align:left;flex:1" data-a="editLembrete" data-v="${r.id}"><div style="font-size:23px;font-weight:700;${r.on ? '' : 'opacity:.55'}">${pad2(r.h)}:${pad2(r.m)}</div><div class="small muted">${daysLabel(r)}</div></button>${tg(r.on, 'toggleRem', r.id)}</div>`).join('') || `<div class="empty">${ic('bell', 28)}<b>Nenhum lembrete ainda</b><span class="small">Crie um para manter sua rotina.</span></div>`}</div>
    ${S.reminders.length ? `<button class="tlink small row mt8" data-a="testeLembrete">${ic('bell', 15)}Ver como a notificação aparece</button>` : ''}
  </div><div class="foot"><button class="btn pri" data-a="novoLembrete">${ic('plus', 18, '', 2.2)}Novo lembrete</button></div>${sh}</div>`; } };
A.novoLembrete = () => { U.ed = { h:19, m:0, freq:'semanal', days:[1,2,3,4,5], on:true }; U.sheet = 1; U.eR = false; rerender(); };
A.editLembrete = v => { U.ed = { ...S.reminders.find(r => r.id === +v) }; U.ed.days = [...U.ed.days]; U.sheet = 1; rerender(); };
A.remH = v => { U.ed.h = clamp(parseInt(v) || 0, 0, 23); rerender(); };
A.remM = v => { U.ed.m = clamp(parseInt(v) || 0, 0, 59); rerender(); };
A.remFreq = v => { U.ed.freq = v; rerender(); };
A.remDay = v => { const d = +v, a = U.ed.days; U.ed.days = a.includes(d) ? a.filter(x => x !== d) : [...a, d]; U.eR = false; rerender(); };
A.salvarLembrete = () => { const r = U.ed; if (r.freq === 'semanal' && !r.days.length) { U.eR = true; return rerender(); } if (r.freq === 'diario') r.days = [0,1,2,3,4,5,6];
  if (r.id) S.reminders = S.reminders.map(x => x.id === r.id ? r : x); else { r.id = Date.now(); S.reminders.push(r); }
  U.sheet = null; rerender(); toast(`Lembrete às ${pad2(r.h)}:${pad2(r.m)} · ${daysLabel(r)}`, 'bell'); };
A.delLembrete = () => { S.reminders = S.reminders.filter(x => x.id !== U.ed.id); U.sheet = null; rerender(); toast('Lembrete excluído', 'trash'); };
A.toggleRem = v => { const r = S.reminders.find(x => x.id === +v); r.on = !r.on; rerender(); toast(r.on ? 'Lembrete ativado' : 'Lembrete desativado', 'bell'); };
A.testeLembrete = () => { const r = S.reminders.find(x => x.on) || S.reminders[0]; push('Concentra+', `São ${pad2(r.h)}:${pad2(r.m)}. Hora de começar sua sessão de foco!`, { icon:'bell', onClick: () => nav('timers', {}, { reset:true }) }); };

/* ================= 34 Perfil ================= */
/* RESPONSÁVEL: Pessoa 2 · Sessão, bloqueio e conta (histórias 07 a 12 do backlog) */
const avatarHtml = (cls = '') => `<span class="avatar ${cls}" style="${S.user.photo ? `background-image:url(${S.user.photo});` : ''}">${S.user.photo ? '' : initials(S.user.name)}</span>`;
SCREENS.perfil = { r: () => {
  const row = (ico, l, a, v, o = {}) => `<button class="li ${o.red ? 'red' : ''}" data-a="${a}" data-v="${v || ''}">${ic(ico, 21)}<span class="grow">${l}${o.sub ? `<div class="sub2">${o.sub}</div>` : ''}</span>${o.badge || ''}${ic('right', 18, 'muted')}</button>`;
  const sub = S.sub.status === 'ativa' ? 'Premium · ativa' : S.sub.status === 'cancelada' ? 'Premium · cancelada' : 'Pagamento pendente';
  return `<div class="scr"><div class="body" style="padding-top:14px">
    <div class="row">${avatarHtml()}<div class="grow"><div style="font-size:21px;font-weight:700">${esc(S.user.name)}</div><div class="small muted">${esc(S.user.email)}</div></div><button class="chip" style="font-weight:600" data-a="go" data-v="editarperfil">Editar</button></div>
    <h3 class="sec">Meu aparelho</h3><div class="list">${row('device', 'Meu relógio', 'go', 'relogio', { sub: S.watch.paired ? `${connected() ? 'Conectado' : 'Desconectado'} · bateria ${S.watch.battery}%` : 'Nenhum relógio pareado' })}</div>
    <h3 class="sec">Preferências</h3><div class="list">${row('bell', 'Lembretes', 'go', 'lembretes', { sub:`${S.reminders.filter(r => r.on).length} ativos` })}${row('moon', 'Aparência', 'go', 'aparencia', { sub:{ claro:'Claro', escuro:'Escuro', auto:'Automático' }[S.theme] })}${row('cal', 'Integração com agenda', 'go', 'agenda', { sub: S.agenda.provider ? `${S.agenda.provider} conectado` : 'Desconectada' })}${row('timer', 'Meta diária', 'go', 'meta', { sub: fmtGoal(S.goal) })}</div>
    <h3 class="sec">Conta</h3><div class="list">${row('card', 'Minha assinatura', 'go', 'assinatura', { sub, badge: S.sub.status === 'pendente' ? '<span class="dot o" style="margin-right:4px"></span>' : '' })}${row('trash', 'Excluir conta e dados', 'go', 'excluir', { red:true })}${row('logout', 'Sair', 'go', 'sair')}</div>
    <h3 class="sec">Suporte</h3><div class="list">${row('help', 'Central de ajuda', 'go', 'ajuda')}${row('bulb', 'Dicas de concentração', 'go', 'dicas')}${row('send', 'Enviar sugestão', 'go', 'sugestao')}${row('info', 'Termos e privacidade', 'go', 'termos')}</div>
    <p class="center xs muted mt24">Concentra+ v1.0.0 · Grupo Cortex</p>
  </div>${tabbar('perfil')}</div>`;
} };

/* 35 editar perfil */
/* ================= 39 Excluir conta ================= */
/* RESPONSÁVEL: Pessoa 2 · Sessão, bloqueio e conta (histórias 07 a 12 do backlog) */
SCREENS.excluir = { r: () => { U.pw ??= ''; U.ok ??= false;
  if (U.done) return `<div class="scr"><div class="body"><div class="hero" style="padding-top:130px"><div class="iconhero t">${ic('check', 40, '', 2.6)}</div><h2>Seus dados foram excluídos</h2><p>Sua conta e o histórico de sessões foram removidos dos nossos servidores. Obrigado por ter usado o Concentra+.</p></div></div><div class="foot"><button class="btn pri" data-a="voltarInicioZero">Voltar ao início</button></div></div>`;
  const can = U.pw.length >= 8 && U.ok;
  return `<div class="scr">${hdr('Excluir conta e dados')}<div class="body">
    <div class="alert r">${ic('tri', 22, '', 2)}<div><b>Esta ação é definitiva</b>Por direito à privacidade (LGPD), você pode pedir a exclusão completa dos seus dados.</div></div>
    <h3 class="sec" style="color:var(--text)">O que será apagado</h3>
    <div class="list">${['Dados pessoais (nome, e-mail, foto)', `Histórico de sessões de foco (${S.history.length})`, 'Timers, metas e conquistas', 'Pareamento com o Concentra+'].map(x => `<div class="li" style="font-size:14.5px"><span style="color:var(--red)">${ic('x', 17, '', 2.4)}</span>${x}</div>`).join('')}</div>
    <div class="fwrap"><label class="lbl">Digite sua senha para confirmar</label><input class="inp ${U.eP ? 'err' : ''}" type="password" data-in="pw" data-err="eP" data-oi="exclCheck" value="${esc(U.pw)}" placeholder="Sua senha">${U.eP ? `<div class="errt">${ic('alertc', 15)}${U.eP}</div>` : ''}</div>
    <button class="row mt16" style="text-align:left" data-a="exclOk"><span class="check ${U.ok ? 'on' : ''}">${U.ok ? ic('check', 14, '', 3) : ''}</span><span style="font-size:14.5px">Entendo que não poderá ser desfeito</span></button>
  </div><div class="foot"><button class="btn redb ${can ? '' : 'dis'}" id="exclBtn" data-a="excluirConta">Excluir conta e dados</button></div></div>`; } };
A.exclOk = () => { U.ok = !U.ok; rerender(); };
A.exclCheck = () => { const b = $('#exclBtn'); if (b) b.classList.toggle('dis', !(U.pw.length >= 8 && U.ok)); };
A.excluirConta = () => { if (!(U.pw.length >= 8 && U.ok)) return; U.done = true; stopAudio(); S.sess = null; rerender(); };
A.voltarInicioZero = () => { const th = S.theme; S = freshState(); S.theme = th; nav('main', {}, { reset:true }); };

/* 40 sair */
/* ----- 40 Sair da conta ----- */
/* RESPONSÁVEL: Pessoa 2 · Sessão, bloqueio e conta (histórias 07 a 12 do backlog) */
SCREENS.sair = { r: () => `<div class="scr">${hdr()}<div class="body"><div class="hero" style="padding-top:130px"><div class="iconhero t">${ic('logout', 38)}</div><h2>Deseja sair da conta?</h2><p>Você precisará entrar de novo para ver seu histórico. Seus dados e o pareamento com o Concentra+ continuam salvos.</p></div></div>
  <div class="foot"><button class="btn pri" data-a="sairConta">Sair</button><button class="btn link muted" data-a="back">Cancelar</button></div></div>` };
A.sairConta = () => { const th = S.theme; stopAudio(); S = freshState(); S.theme = th; nav('main', {}, { reset:true }); };
