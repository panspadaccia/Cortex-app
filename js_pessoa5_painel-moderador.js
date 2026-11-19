/* ================= virtual watch ================= */
const W = { overlay:null };
function watchClock(){ const d = new Date(); let h = d.getHours(); const m = pad2(d.getMinutes()); if (S.watch.h24) return `${pad2(h)}:${m}`; const ap = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12; return `${h}:${m} ${ap}`; }
function watchMsg(a, b, ms = 1800, icon = ''){ W.overlay = { type:'msg', a, b, icon, until: performance.now() + ms }; }
function watchOverlay(type){ W.overlay = { type, until: performance.now() + 1600 }; renderWatch(); }
let lastFace = '';
function renderWatch(){
  const el = $('#wface'); if (!el) return;
  const w = S.watch, s = S.sess, c = connected();
  let html = '';
  if (w.battery <= 0) html = '<div class="wfoff"></div>';
  else {
    const top = `<div class="wtop"><span class="led sm">${['HORA','TIMER','META','BATERIA'][w.screen]}</span><span class="ico">${w.silent ? `<span style="opacity:.9">${ic('vib', 12, '', 2)}</span>` : ''}${c ? `<span style="color:#7fd7ff">${ic('bt', 12, '', 2.2)}</span>` : ''}<span class="led sm" style="font-size:11px;${w.battery < 20 ? 'color:#ff8080' : ''}">${w.battery}%</span></span></div>`;
    let main = '';
    if (w.screen === 0) main = `<div class="led big" style="font-size:${w.h24 ? 54 : 44}px">${watchClock()}</div>${s ? `<div class="wpill ${s.paused ? 'pause' : s.phase === 'descanso' ? 'rest' : ''}">${s.phase === 'foco' ? 'FOCO' : 'DESCANSO'} ${fmtSec(s.remaining)}</div>` : ''}`;
    else if (w.screen === 1) {
      if (s) main = `<div class="led big ${s.paused ? 'blink' : ''}">${fmtSec(s.remaining)}</div><div class="wpill ${s.paused ? 'pause' : s.phase === 'descanso' ? 'rest' : ''}">${s.restrict ? '🔒 ' : ''}${s.paused ? 'PAUSADO' : s.phase === 'foco' ? 'FOCO ATIVO' : 'DESCANSO'}</div><div class="wbar"><i style="width:${(1 - s.remaining / s.total) * 100}%;${s.phase === 'descanso' ? 'background:#4fb3bf;box-shadow:0 0 6px #4fb3bf' : s.paused ? 'background:#f0b250;box-shadow:none' : ''}"></i></div>`;
      else { const t = timerById(S.selTimer) || S.timers[0]; main = `<div class="led big">${pad2(t.focus)}:00</div><div class="wpill off">▶ ${t.name.toUpperCase().slice(0, 14)}</div>`; }
    }
    else if (w.screen === 2) { main = S.auth ? `<div class="led big">${goalPct()}%</div><div class="led sm" style="margin-top:8px">${fmtDur(todayTotal()).toUpperCase()} / ${fmtGoal(S.goal).toUpperCase()}</div><div class="wbar"><i style="width:${goalPct()}%;background:#f0b250;box-shadow:0 0 6px #f0b250"></i></div>` : `<div class="led mid">--%</div><div class="led sm" style="margin-top:8px">META</div>`; }
    else main = `<div class="led big">${w.battery}%</div><div class="led sm" style="margin-top:8px">${w.battery < 20 ? 'CARREGUE O RELÓGIO' : 'BATERIA'}</div>`;
    let ov = '';
    const o = W.overlay;
    if (o && performance.now() < o.until) {
      if (o.type === 'vol') { const n = Math.round(w.volume / 10); ov = `<div class="wover"><div class="led sm">${w.silent || !w.volume ? 'SILENCIOSO' : 'VOLUME'}</div><div class="volbars">${Array.from({ length:10 }, (_, i) => `<i class="${i < n && !w.silent ? 'on' : ''}" style="height:${6 + i * 1.3}px"></i>`).join('')}</div><div class="led mid">${w.silent ? '' : w.volume}</div></div>`; }
      else ov = `<div class="wover">${o.icon ? `<div style="color:#f4fbff">${ic(o.icon, 26, '', 2)}</div>` : ''}<div class="led mid" style="font-size:24px">${o.a}</div>${o.b ? `<div class="led sm">${o.b}</div>` : ''}</div>`;
    } else W.overlay = null;
    html = top + main + ov;
  }
  if (html !== lastFace) { el.innerHTML = html; lastFace = html; }
  el.classList.toggle('offscreen', w.battery <= 0);
  const dot = $('#wdot'); if (dot) dot.classList.toggle('on', c);
  const lab = $('#wlab'); if (lab) lab.textContent = w.battery <= 0 ? 'Relógio sem bateria' : !w.paired ? 'Relógio ligado · ainda não pareado' : c ? `${w.name} · conectado` : `${w.name} · sem conexão`;
}
function watchPress(btn){
  audioUnlock();
  const w = S.watch, s = S.sess, c = connected();
  if (w.battery <= 0) return;
  if (btn === 'telas') { w.screen = (w.screen + 1) % 4; }
  else if (btn === 'vol-' || btn === 'vol+') {
    w.volume = clamp(w.volume + (btn === 'vol+' ? 10 : -10), 0, 100); w.silent = w.volume === 0;
    watchOverlay('vol'); if (!w.silent) tick2(); else vibrate();
    if (cur().id === 'configrelogio') rerender();
  }
  else if (btn === 'music') {
    if (!c) watchMsg('SEM CONEXÃO', 'MÚSICA TOCA NO CELULAR');
    else { S.sound.playing ? pauseAudio() : playAudio(); watchMsg(S.sound.playing ? 'TOCANDO' : 'PAUSADO', trackById(S.sound.track).name.toUpperCase().slice(0, 18), 1500); if (['sons','player','sessao','inicio','antes'].includes(cur().id)) rerender(); }
  }
  else if (btn === 'center') {
    if (!s) {
      const t = timerById(S.selTimer) || S.timers[0];
      startSession(t, 'relogio');
      if (S.sess.known && S.auth) { nav('sessao', {}, { reset:true }); toast('Sessão iniciada pelo botão do Concentra+', 'playpause'); }
      else watchMsg('OFFLINE', 'DADOS FICAM NO RELÓGIO', 1600);
    } else if (s.restrict) { watchMsg('RESTRITO', 'NÃO PODE PAUSAR', 1500, 'lock'); vibrate(); }
    else if (s.phase === 'descanso') { watchMsg('DESCANSO', 'SEGURE PARA ENCERRAR', 1500); }
    else { if (s.paused) resumeSession(); else pauseSession('watch'); if (s.known && cur().id === 'sessao') rerender(); }
  }
  live();
}
function watchLong(){ const s = S.sess; if (!s) return; if (s.restrict) { watchMsg('RESTRITO', 'NÃO PODE ENCERRAR', 1500, 'lock'); vibrate(); return; } finishSession(true); live(); }
function vibrate(){ const w = $('#watch'); if (!w) return; w.classList.remove('vib'); void w.offsetWidth; w.classList.add('vib'); }
function bindWatch(){
  document.querySelectorAll('.wbtn').forEach(b => {
    let t = null, long = false;
    b.addEventListener('pointerdown', e => { e.preventDefault(); b.classList.add('press'); long = false; if (b.dataset.w === 'center') t = setTimeout(() => { long = true; watchLong(); }, 900); });
    const up = () => { b.classList.remove('press'); clearTimeout(t); };
    b.addEventListener('pointerup', () => { up(); if (!long) watchPress(b.dataset.w); });
    b.addEventListener('pointerleave', up);
  });
}

/* ================= environment (moderator) panel ================= */
function renderEnv(){
  const e = S.env;
  const set = (id, on) => { const el = document.getElementById(id); if (el) el.classList.toggle('on', on); };
  set('env-bt', e.bt); set('env-net', e.net);
  document.querySelectorAll('[data-speed]').forEach(b => b.classList.toggle('on', +b.dataset.speed === e.speed));
  const bv = $('#env-batv'); if (bv) bv.textContent = S.watch.battery + '%';
  const br = $('#env-bat'); if (br && +br.value !== S.watch.battery && document.activeElement !== br) br.value = S.watch.battery;
  const cable = $('#wcable'); if (cable) cable.classList.toggle('on', !!S.charging);
  const sbw = $('#sbwifi'); if (sbw) sbw.innerHTML = ic(e.net ? 'wifi' : 'wifioff', 15, '', 2.2);
  const sbb = $('#sbbt'); if (sbb) sbb.style.opacity = e.bt ? 1 : .25;
}
function bindEnv(){
  const side = $('.side');
  side.addEventListener('click', e => {
    const b = e.target.closest('[data-env]'); if (!b) return; audioUnlock();
    const k = b.dataset.env;
    if (k === 'bt') { S.env.bt = !S.env.bt; toast(S.env.bt ? 'Bluetooth do celular ligado' : 'Bluetooth do celular desligado', 'bt'); }
    if (k === 'net') { S.env.net = !S.env.net; toast(S.env.net ? 'Internet conectada' : 'Sem internet', S.env.net ? 'wifi' : 'wifioff'); if (S.env.net && cur().id === 'semnet') {} }
    if (k === 'speed') S.env.speed = +b.dataset.speed;
    if (k === 'charge') { S.charging = !S.charging; b.textContent = S.charging ? 'Desligar cabo' : 'Ligar cabo'; }
    if (k === 'openapp') openBlockedApp($('#env-app').value);
    if (k === 'payfail') { if (!S.auth) return toast('Entre na conta primeiro', 'info'); S.sub.status = 'pendente'; push('Concentra+', 'Não conseguimos cobrar seu cartão. Atualize a forma de pagamento.', { icon:'card', onClick: () => nav('assinatura') }); }
    if (k === 'reset') { stopAudio(); const th = S.theme; S = freshState(); S.theme = th; W.overlay = null; nav('main', {}, { reset:true }); toast('Protótipo reiniciado', 'repeat'); }
    if (k === 'close') side.classList.remove('open');
    if (['inicio','sessao','relogio','antes','perfil','assinatura','permissoes'].includes(cur().id)) rerender();
    live();
  });
  $('#env-bat').addEventListener('input', e => { S.watch.battery = +e.target.value; if (S.watch.battery > 0 && !wasConn) {} live(); if (['inicio','relogio','perfil'].includes(cur().id)) rerender(); });
  $('#fab').addEventListener('click', () => side.classList.toggle('open'));
  setInterval(() => { if (S.charging && S.watch.battery < 100) { S.watch.battery = Math.min(100, S.watch.battery + 1); if (['inicio','relogio'].includes(cur().id) && S.watch.battery % 5 === 0) rerender(); } }, 1500);
}
function openBlockedApp(id){
  const app = APPS.find(a => a.id === id), s = S.sess, el = $('#block');
  const active = s && s.known && s.block && S.blocked[id] && s.phase === 'foco';
  if (active && !permsOk()) { toast(`${app.name} abriu: faltam permissões, o bloqueio falhou`, 'tri'); return; }
  if (!active) { toast(s ? `${app.name} não está na lista de bloqueio` : `${app.name} aberto (nenhuma sessão de foco ativa)`, 'info'); return; }
  el.innerHTML = `<span class="lk">${ic('lock', 40, '', 2)}</span><h2>${app.name} está bloqueado</h2><p>Você está em uma sessão de foco. Ele volta a funcionar quando a sessão terminar.</p><div class="tm" id="blockTime">${fmtSec(s.remaining)}</div><p class="small">restantes de foco</p><button class="btn pri" style="max-width:260px;background:#4fb3bf;color:#0f1417;margin-top:14px" id="blockBack">Voltar ao Concentra+</button>`;
  el.classList.add('on'); $('#blockBack').onclick = () => el.classList.remove('on');
}
