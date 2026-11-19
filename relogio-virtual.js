/* Concentra+ · js/pessoa2/relogio-virtual.js
   Pessoa 2 · Sessão, bloqueio e conta (histórias 07 a 12 do backlog)
   Integrante: [NOME] · GitHub: [@usuario]
   Seções deste arquivo: virtual watch */
/* ================= virtual watch ================= */
/* RESPONSÁVEL: Pessoa 2 · Sessão, bloqueio e conta (histórias 07 a 12 do backlog) */
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
