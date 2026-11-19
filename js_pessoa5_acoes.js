/* ================= ações globais e das telas ================= */

A.back = () => back();
A.tab = v => nav(v, {}, { reset:true });
A.go = v => nav(v);
A.closeOverlay = () => { U.sheet = null; U.modal = null; rerender(); };
A.noop = () => {};

A.togglePass = () => { U.show = !U.show; rerender(); };

const validEmail = e => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e.trim());

A.cadastroContinuar = () => {
  U.eUser = U.user.trim().length < 3 ? 'Escolha um nome com pelo menos 3 caracteres' : null;
  U.eEmail = !validEmail(U.email) ? 'Digite um e-mail válido' : null;
  U.ePass = U.pass.length < 8 ? 'A senha precisa ter no mínimo 8 caracteres' : null;
  if (U.eUser || U.eEmail || U.ePass) return rerender();
  S.pending = { username:U.user.trim(), email:U.email.trim() };
  nav('confirmacao');
};

const CODE = '427193';

A.resend = () => { U.left = 30; rerender(); setTimeout(() => push('E-mail · Concentra+', `Seu código de verificação é ${CODE}`, { icon:'mail', ms:9000 }), 900); };

A.confirmarCodigo = () => {
  const c = U.code.join('');
  if (c.length < 6) { U.err = true; return rerender(); }
  if (c !== CODE) { U.err = true; U.code = ['','','','','','']; return rerender(); }
  clearInterval(U.tm);
  S.auth = 'novo'; S.newUser = true; S.recovered = true;
  S.user = { name:S.pending.username, username:S.pending.username, email:S.pending.email, photo:null };
  S.history = []; S.met = new Set(); S.watch.paired = false;
  nav('tutorial', {}, { reset:true });
};

A.esqueci = () => { if (!validEmail(U.email)) { U.eEmail = 'Digite seu e-mail para receber o link'; return rerender(); } toast(`Enviamos um link de redefinição para ${U.email.trim()}`, 'mail'); };

A.entrar = () => {
  U.eEmail = !validEmail(U.email) ? 'Digite um e-mail válido' : null;
  U.ePass = U.pass.length < 8 ? 'Senha incorreta. Ela tem no mínimo 8 caracteres.' : null;
  if (U.eEmail || U.ePass) return rerender();
  loadAna(); S.user.email = U.email.trim();
  nav('recuperacao', {}, { reset:true });
};

A.setU = v => { const [k, val] = v.split(':'); U[k] = val; rerender(); };

const TUT = [

A.tutNext = () => { if (U.i < 2) { U.i++; render({ anim:'fwd' }); } else nav('conexao'); };

A.tutPular = () => { S.tutorialSeen = true; nav('inicio', { coach:true }, { reset:true }); };

const CONN = [

A.connNext = () => { if (U.i < 2) { U.i++; render({ anim:'fwd' }); } else nav('pareamento', { from:'onboarding' }); };

A.pararBusca = () => { clearTimeout(U.t); back(); };

A.buscarDeNovo = () => { U.st = 'busca'; rerender(); };

A.conectarDev = v => { U.dev = v; U.devName = v === 'a1b2' ? 'Concentra+ A1B2' : 'Concentra+ C3D4'; U.st = 'conectando'; rerender(); };

A.pareouContinuar = () => {
  const p = cur().p;
  if (p.from === 'onboarding') { S.tutorialSeen = true; nav('inicio', { coach:true }, { reset:true }); }
  else back();
};

A.desconectar = () => { S.watch.paired = false; stopSessionIfWatchOnly(); toast('Relógio desconectado', 'bt'); rerender(); };

A.esquecer = () => { S.watch.paired = false; rerender(); };

A.reconectar = () => { if (!S.env.bt) { toast('Ligue o Bluetooth do celular para conectar', 'bt'); return; } nav('pareamento'); };

A.parear = () => nav('pareamento');

A.setVol = v => { S.watch.volume = +v; S.watch.silent = false; const el = $('#volv'); if (el) el.textContent = v + '%'; watchOverlay('vol'); };

A.testeAlerta = () => beep();

A.toggleSilent = () => { S.watch.silent = !S.watch.silent; watchOverlay('vol'); rerender(); };

A.setH24 = v => { S.watch.h24 = v === '1'; rerender(); toast(`Relógio no formato ${S.watch.h24 ? '24' : '12'} horas`, 'clock'); };

const catStyle = id => { const c = catById(id); return c.color === 'teal' ? '' : `background:${hexA(COLORS[c.color], .14)};color:${COLORS[c.color]}`; };

const hexA = (h, a) => { const n = parseInt(h.slice(1), 16); return `rgba(${n>>16},${(n>>8)&255},${n&255},${a})`; };

A.coachOk = () => { U.coachDone = true; cur().p = {}; rerender(); };

A.selTimer = (v, el, e) => { if (e.target.closest('[data-a="catTimer"],[data-a="editTimer"]') && e.target.closest('[data-a]') !== el) return; S.selTimer = v; rerender(); };

A.catTimer = v => { U.catT = v; U.sheet = 'cat'; rerender(); };

A.setTimerCat = v => { timerById(U.catT).cat = v; U.sheet = null; rerender(); toast(`Categoria alterada para ${catName(v)}`); };

A.editTimer = v => nav('timernovo', { id:v });

A.novoTimer = () => nav('timernovo', {});

A.stepT = v => { const [k, d] = v.split(':'); const step = 5; if (k === 'focus') U.focus = clamp(U.focus + (d === '+' ? step : -step), 5, 180); else U.rest = clamp(U.rest + (d === '+' ? step : -step), 0, 60); rerender(); };

A.openNovaCat = () => { U.sheet = 'novacat'; U.ncName = ''; U.eNc = null; rerender(); setTimeout(() => document.querySelector('[data-in="ncName"]')?.focus(), 300); };

A.addCat = () => { const n = (U.ncName || '').trim(); if (!n) { U.eNc = 'Dê um nome para a categoria'; return rerender(); } if (S.cats.some(c => c.name.toLowerCase() === n.toLowerCase())) { U.eNc = 'Essa categoria já existe'; return rerender(); }
  const id = 'c' + Date.now(); S.cats.push({ id, name:n, color:U.ncColor }); U.cat = id; U.sheet = null; rerender(); toast(`Categoria ${n} criada`); };

A.salvarTimer = () => { const n = (U.name || '').trim(); if (!n) { U.eName = 'Dê um nome para o timer'; return rerender(); }
  const p = cur().p;
  if (p.id) Object.assign(timerById(p.id), { name:n, focus:U.focus, rest:U.rest, cat:U.cat });
  else { const id = 't' + Date.now(); S.timers.push({ id, name:n, focus:U.focus, rest:U.rest, cat:U.cat }); S.selTimer = id; }
  nav('timers', {}, { reset:true, anim:'back' }); toast(p.id ? 'Timer atualizado' : 'Timer salvo e selecionado');
};

A.askDelTimer = () => { U.modal = 'del'; rerender(); };

A.delTimer = () => { const id = cur().p.id; S.timers = S.timers.filter(t => t.id !== id); if (S.selTimer === id) S.selTimer = 'pomodoro'; nav('timers', {}, { reset:true, anim:'back' }); toast('Timer excluído', 'trash'); };

A.opt = v => { S.opts[v] = !S.opts[v]; rerender(); };

A.iniciarSessao = v => {
  if (S.opts.restrict && v !== 'ok') { U.modal = 'restrito'; return rerender(); }
  const t = timerById(S.selTimer) || S.timers[0];
  startSession(t, 'app');
  nav('sessao', {}, { reset:true });
};

A.pausar = () => { pauseSession('app'); rerender(); };

A.retomar = () => { resumeSession(); rerender(); };

A.encerrar = () => finishSession(true);

A.pularDescanso = () => finishSession(false);

A.soundTab = v => { S.sound.tab = v; rerender(); };

A.pickTrack = v => { const same = S.sound.track === v; S.sound.track = v; S.opts.music = true; if (!same) S.sound.pos = 0; if (!S.sound.playing) playAudio(); else if (!same) restartAudio(); nav('player'); };

A.togglePlay = (v, el, e) => { e && e.stopPropagation(); S.sound.playing ? pauseAudio() : playAudio(); rerender(); };

A.trackNext = (v, el, e) => { e && e.stopPropagation(); nextTrack(1); rerender(); };

A.trackPrev = (v, el, e) => { e && e.stopPropagation(); if (S.sound.pos > 3) { S.sound.pos = 0; } else nextTrack(-1); rerender(); };

A.setMode = v => { S.sound.mode = v; rerender(); };

A.seek = (v, el, e) => { const r = el.getBoundingClientRect(); S.sound.pos = clamp((e.clientX - r.left) / r.width, 0, 1) * trackById(S.sound.track).dur; rerender(); };

A.stepG = v => { U.g = clamp(U.g + (v === '+' ? 30 : -30), 0, 720); U.eG = false; rerender(); };

A.setG = v => { U.g = +v; U.eG = false; rerender(); };

A.salvarMeta = () => { if (!U.g) { U.eG = true; return rerender(); } S.goal = U.g; back(); toast(`Meta diária salva: ${fmtGoal(S.goal)}`); checkGoal(); };

A.dica = v => nav('dica', { id:v });

A.timer25 = () => nav('timernovo', { preset:{ name:'Blocos de 25', focus:25, rest:5, cat:'estudo' } });

A.rr = () => rerender();

A.toggleApp = v => { U.sel[v] = !U.sel[v]; rerender(); };

A.salvarApps = () => { S.blocked = { ...U.sel }; back(); toast(`${blockedCount()} apps serão bloqueados no foco`, 'lock'); };

const PERMS = [['acess','Acessibilidade'],['sobre','Exibir sobre outros apps'],['notif','Acesso às notificações'],['bt','Bluetooth']];

A.permAtivar = v => nav('permguia', { k:v });

A.guiaNext = () => { if (U.i < 2) { U.i++; return render({ anim:'fwd' }); } if (!U.on) { U.on = true; rerender(); return; } S.perms[cur().p.k] = true; back(); toast('Permissão ativada'); };

A.limEntendi = () => { const i = stack.findIndex(x => x.id === 'antes'); if (i >= 0) { stack = stack.slice(0, i + 1); U = {}; render({ anim:'back' }); } else back(); };

A.faq = v => { U.open = U.open === +v ? -1 : +v; rerender(); };

A.cnt = v => { const c = $('#cnt'); if (c) c.textContent = `${v.length}/500`; const b = $('#sugBtn'); if (b) b.classList.toggle('dis', !v.trim()); };

A.enviarContato = () => { if (U.msg.trim().length < 10) { U.eM = 'Escreva pelo menos 10 caracteres'; return rerender(); } if (!S.env.net) { toast('Sem internet. Tente de novo quando estiver conectado.', 'wifioff'); return; } U.sent = true; U.proto = 48000 + Math.floor(Math.random() * 999); rerender(); };

A.enviarSug = () => { if (!U.msg.trim()) return; U.sent = true; rerender(); };

A.histV = v => { if (v === 'rel' && !S.env.net) { nav('semnet'); return; } U.v = v; rerender(); };

A.selDay = v => { U.sel = v; rerender(); };

A.mes = v => { const m = U.m + +v; if ((U.y === 2026 && m < 8) || (U.y === 2026 && m > TODAY.getMonth())) return; U.m = m; const k = dkey(new Date(U.y, U.m, 1)); U.sel = U.m === TODAY.getMonth() ? TODAYK : (S.history.find(s => s.d.startsWith(k.slice(0, 7)))?.d || k); rerender(); };

A.barTap = (v, el) => { document.querySelectorAll('.bc.act').forEach(x => x !== el && x.classList.remove('act')); el.classList.toggle('act'); };

A.baixarPdf = async () => {
  const R = reportData();
  const bytes = buildPdf(R);
  const name = `relatorio-concentra-${dkey(R.a)}-a-${dkey(R.b)}.pdf`;
  try {
    const dl = window.claude && await window.claude.use('downloads');
    if (!dl) throw { code:'unavailable' };
    await dl.save({ filename:name, data:new Blob([bytes], { type:'application/pdf' }) });
    toast('Relatório baixado em PDF', 'download');
  } catch (e) {
    if (e && e.code === 'declined') return toast('Download cancelado', 'x');
    try { const url = URL.createObjectURL(new Blob([bytes], { type:'application/pdf' })); const a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 4000); toast('Relatório baixado em PDF', 'download'); }
    catch (_) { toast('Não foi possível baixar aqui', 'x'); }
  }
};

A.tentarNet = () => { if (!S.env.net) { toast('Ainda sem internet', 'wifioff'); return; } nav('historico', { v:'rel' }, { reset:true }); toast('Relatórios atualizados', 'check'); };

A.verCalendario = () => nav('historico', { v:'cal' }, { reset:true });

A.recuperar = () => { U.st = 'load'; rerender(); };

A.agoraNao = () => nav('inicio', {}, { reset:true });

A.verHist = () => nav('historico', { v:'cal' }, { reset:true });

A.conectarAgenda = v => { if (!S.env.net) return toast('Sem internet para conectar a agenda', 'wifioff'); U.loading = v; rerender(); setTimeout(() => { if (cur().id !== 'agenda') return; S.agenda.provider = v; U.loading = null; rerender(); toast(`${v === 'Google' ? 'Google Agenda' : 'Outlook'} conectado`); }, 1600); };

A.toggleBusy = () => { S.agenda.busy = !S.agenda.busy; rerender(); };

A.desconAgenda = () => { S.agenda.provider = null; rerender(); toast('Agenda desconectada'); };

const daysLabel = r => { if (r.freq === 'diario' || r.days.length === 7) return 'Todos os dias'; const s = [...r.days].sort((a, b) => ((a + 6) % 7) - ((b + 6) % 7)); const k = s.join(); if (k === '1,2,3,4,5') return 'Seg a Sex'; if (k === '6,0') return 'Sáb e Dom'; return s.map(d => DOW3[d]).join(', '); };

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

A.pickPhoto = (v, el) => { const f = el.files && el.files[0]; if (!f) return; if (!f.type.startsWith('image/')) return toast('Escolha um arquivo de imagem', 'x');
  const img = new Image(), url = URL.createObjectURL(f);
  img.onload = () => { const c = document.createElement('canvas'), s = 200, m = Math.min(img.width, img.height); c.width = c.height = s; c.getContext('2d').drawImage(img, (img.width - m) / 2, (img.height - m) / 2, m, m, 0, 0, s, s); U.photo = c.toDataURL('image/jpeg', .85); URL.revokeObjectURL(url); rerender(); };
  img.src = url; };

A.rmPhoto = () => { U.photo = null; rerender(); };

A.salvarPerfil = () => { if ((U.name || '').trim().length < 2) { U.eN = 'Digite um nome com pelo menos 2 letras'; return rerender(); } S.user.name = U.name.trim(); S.user.photo = U.photo; back(); toast('Perfil atualizado'); };

A.setTheme = v => { S.theme = v; try { localStorage.setItem('cplus-theme', v); } catch(e){} rerender(); };

const PLANS = { mensal:{ l:'Mensal', p:'R$ 19,90 por mês' }, anual:{ l:'Anual', p:'R$ 179,90 por ano' }, estudante:{ l:'Estudante', p:'R$ 9,90 por mês' } };

A.reativar = () => { S.sub.status = 'ativa'; rerender(); toast('Assinatura reativada'); };

A.cancelarAss = () => nav('gerenciar', { ask:true });

A.atualizarPgto = () => nav('gerenciar', { card:true });

A.openSheet = v => { U.sheet = v; U.eC = null; rerender(); };

A.askCancel = () => { U.modal = 'cancel'; rerender(); };

A.confirmCancel = () => { S.sub.status = 'cancelada'; nav('assinatura', {}, { replace:true, anim:'back' }); stack = stack.filter((x, i, a) => !(x.id === 'assinatura' && i < a.length - 1)); toast('Assinatura cancelada'); };

A.setPlano = v => { S.sub.plan = v; U.sheet = null; rerender(); toast(`Plano alterado para ${PLANS[v].l}`); };

A.fmtCard = (v, el) => { const d = v.replace(/\D/g, '').slice(0, 16); el.value = d.replace(/(.{4})/g, '$1 ').trim(); U.cn = el.value; };

A.salvarCartao = () => { const d = (U.cn || '').replace(/\D/g, ''); if (d.length < 13) { U.eC = 'Número de cartão incompleto'; return rerender(); } if (!/^\d{2}\/\d{2}$/.test(U.cv || '')) { U.eC = 'Validade no formato MM/AA'; return rerender(); } if ((U.cc || '').length < 3) { U.eC = 'CVV inválido'; return rerender(); }
  S.sub.card = d.slice(-4); const wasPend = S.sub.status === 'pendente'; if (wasPend) S.sub.status = 'ativa'; U.sheet = null; U.cn = U.cv = U.cc = ''; rerender(); toast(wasPend ? 'Pagamento aprovado. Assinatura ativa.' : `Cartão final ${S.sub.card} salvo`); };

A.exclOk = () => { U.ok = !U.ok; rerender(); };

A.exclCheck = () => { const b = $('#exclBtn'); if (b) b.classList.toggle('dis', !(U.pw.length >= 8 && U.ok)); };

A.excluirConta = () => { if (!(U.pw.length >= 8 && U.ok)) return; U.done = true; stopAudio(); S.sess = null; rerender(); };

A.voltarInicioZero = () => { const th = S.theme; S = freshState(); S.theme = th; nav('main', {}, { reset:true }); };

A.sairConta = () => { const th = S.theme; stopAudio(); S = freshState(); S.theme = th; nav('main', {}, { reset:true }); };
