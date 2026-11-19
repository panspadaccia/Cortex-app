/* Concentra+ · js/pessoa2/motor-da-sessao.js
   Pessoa 2 · Sessão, bloqueio e conta (histórias 07 a 12 do backlog)
   Integrante: [NOME] · GitHub: [@usuario]
   Seções deste arquivo: session engine */
/* ================= session engine ================= */
/* RESPONSÁVEL: Pessoa 2 · Sessão, bloqueio e conta (histórias 07 a 12 do backlog) */
function startSession(t, origin){
  const known = origin === 'app' || connected();
  S.sess = { timerId:t.id, name:t.name, cat:t.cat, focus:t.focus, rest:t.rest, phase:'foco', total:t.focus * 60, remaining:t.focus * 60,
    paused:false, pausedBy:null, restrict: origin === 'app' && S.opts.restrict, block: origin === 'app' && S.opts.block,
    origin, known, startT:nowHM(), focusDone:0 };
  S.watch.screen = 1;
  if (origin === 'app' && S.opts.music && !S.sound.playing) playAudio();
  if (known && S.agenda.provider && S.agenda.busy) setTimeout(() => toast(`Evento “Ocupado” criado no ${S.agenda.provider === 'Google' ? 'Google Agenda' : 'Outlook'} (${t.focus} min)`, 'calcheck'), 600);
}
function pauseSession(by){ const s = S.sess; if (!s || s.restrict || s.phase !== 'foco') return false; s.paused = true; s.pausedBy = by; return true; }
function resumeSession(){ const s = S.sess; if (!s) return; s.paused = false; s.pausedBy = null; }
function stopSessionIfWatchOnly(){ /* session keeps running on the watch; the app shows it as not synced */ }
function finishSession(early){
  const s = S.sess; if (!s) return;
  if (s.phase === 'descanso') early = false;
  const min = Math.round(s.focusDone / 60);
  S.sess = null; S.watch.screen = 0;
  if (S.sound.playing) pauseAudio();
  if (min < 1) { if (s.known) { nav('inicio', {}, { reset:true }); toast('Sessão com menos de 1 minuto não foi registrada', 'info'); } return; }
  const rec = { d:TODAYK, t:s.startT, cat:s.cat, min, src: s.origin === 'relogio' ? 'relogio' : 'app' };
  if (!s.known) { S.watch.pending.push(rec); watchMsg('SALVO', 'SINCRONIZA DEPOIS'); return; }
  const before = metToday(), stBefore = streak();
  S.history.push(rec);
  const hit = !before && metToday();
  let unlock = null;
  [7, 30, 100].forEach(n => { if (stBefore < n && streak() >= n && !S.unlocked.has(n)) { S.unlocked.add(n); unlock = n; } });
  S.lastDone = { min, cat:s.cat, early: early && s.focusDone < s.focus * 60 - 1, hitGoal:hit, unlock };
  nav('concluida', {}, { reset:true });
  if (hit) { S.goalNotifiedDay = TODAYK; setTimeout(() => push('Concentra+', 'Parabéns! Você bateu sua meta de hoje.', { icon:'flame' }), 900); }
}
function checkGoal(){ if (metToday() && S.goalNotifiedDay !== TODAYK) { S.goalNotifiedDay = TODAYK; setTimeout(() => push('Concentra+', 'Parabéns! Você bateu sua meta de hoje.', { icon:'flame' }), 500); } }
function syncPending(){
  if (!connected() || !S.watch.pending.length || !S.auth) return;
  const n = S.watch.pending.length;
  S.history.push(...S.watch.pending); S.watch.pending = [];
  push('Concentra+', `${n} ${n > 1 ? 'sessões feitas' : 'sessão feita'} no relógio ${n > 1 ? 'foram sincronizadas' : 'foi sincronizada'} com o app.`, { icon:'bt' });
  checkGoal(); rerender();
}
let lastT = performance.now(), wasConn = null;
function tick(){
  const now = performance.now(), dt = (now - lastT) / 1000; lastT = now;
  const s = S.sess;
  if (s && !s.paused && S.watch.battery > 0) {
    const d = dt * S.env.speed;
    s.remaining -= d; if (s.phase === 'foco') s.focusDone = Math.min(s.focus * 60, s.focusDone + d);
    if (s.remaining <= 0) {
      beep();
      if (s.phase === 'foco' && s.rest > 0) {
        s.phase = 'descanso'; s.total = s.remaining = s.rest * 60;
        if (s.known) { push('Concentra+', `Foco concluído! Descanse ${s.rest} minutos.`, { icon:'check' }); if (cur().id === 'sessao') rerender(); }
      } else finishSession(false);
    }
  }
  if (S.sound.playing) { S.sound.pos += dt; const t = trackById(S.sound.track); if (S.sound.pos >= t.dur) { nextTrack(1, true); if (['sons','player','sessao','inicio'].includes(cur().id)) rerender(); } }
  // connectivity
  const c = connected();
  if (wasConn !== null && c !== wasConn && S.auth) {
    if (c) { syncPending(); if (S.sess && !S.sess.known) { S.sess.known = true; push('Concentra+', 'Sessão em andamento no relógio sincronizada.', { icon:'bt' }); } else if (S.sess) toast('Relógio reconectado. Sessão sincronizada.', 'bt'); }
    if (['inicio','sessao','relogio','configrelogio','perfil','antes'].includes(cur().id)) rerender();
  }
  wasConn = c;
  // low battery
  const w = S.watch;
  if (w.paired && w.battery < 20 && w.battery > 0 && !w.lowWarned && S.auth && c) { w.lowWarned = true; push('Concentra+', `Bateria do relógio em ${w.battery}%. Ligue o cabo USB-C para carregar.`, { icon:'tri' }); }
  if (w.battery >= 20) w.lowWarned = false;
  live();
}
function live(){
  const s = S.sess;
  const sb = $('#sbtime'); if (sb) { const d = new Date(); sb.textContent = `${d.getHours()}:${pad2(d.getMinutes())}`; }
  if (s) {
    const t = $('#sessTime'); if (t) t.textContent = fmtSec(s.remaining);
    const r = $('#ringfg'); if (r) { const C = 2 * Math.PI * r.r.baseVal.value; r.style.strokeDashoffset = C * (1 - Math.max(0, s.remaining) / s.total); }
    const h = $('#homeSess'); if (h) h.textContent = `${fmtSec(s.remaining)} · ${s.phase === 'foco' ? 'Foco' : 'Descanso'} · ${catName(s.cat)}`;
    const bt = $('#blockTime'); if (bt) bt.textContent = fmtSec(s.remaining);
  }
  if (S.sound.playing) { const t = trackById(S.sound.track); const p = $('#ppos'); if (p) p.style.width = (S.sound.pos / t.dur * 100) + '%'; const pt = $('#ptime'); if (pt) pt.textContent = fmtSec(S.sound.pos).replace(/^0/, ''); }
  const rf = $('#relface'); if (rf) rf.textContent = watchClock();
  const cc = $('#cfgclock'); if (cc) cc.textContent = watchClock();
  renderWatch(); renderEnv();
}
