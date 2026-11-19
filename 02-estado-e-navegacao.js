/* Concentra+ · js/pessoa3/02-estado-e-navegacao.js
   Pessoa 3 · Início, metas e tema (histórias 13 a 18 do backlog)
   Integrante: THAIS · GitHub: @thaisrpc
   Seções deste arquivo: state, router, ui primitives, feedback layers */
/* ================= state ================= */
/* RESPONSÁVEL: Pessoa 3 · Início, metas e tema (histórias 13 a 18 do backlog) */
let S, U = {}, stack = [];
function freshState(){
  return {
    auth:null, newUser:false,
    user:{ name:'Ana Souza', username:'ana.souza', email:'ana@email.com', photo:null },
    theme:(()=>{ try { return localStorage.getItem('cplus-theme') || 'auto'; } catch(e){ return 'auto'; } })(),
    goal:120, history:[], met:new Set(), recovered:false, tutorialSeen:false,
    cats: DEFAULT_CATS.map(c => ({...c})),
    timers: [...DEFAULT_TIMERS.map(t => ({...t})), { id:'tcc', name:'Escrita do TCC', focus:40, rest:10, cat:'trabalho' }],
    selTimer:'pomodoro',
    blocked:{ instagram:true, tiktok:true, youtube:true, whatsapp:false, jogos:false, noticias:false, x:false, netflix:false },
    perms:{ acess:true, sobre:false, notif:false, bt:true },
    opts:{ block:true, music:true, restrict:false },
    sound:{ tab:'ambiente', track:'chuva', playing:false, pos:0, mode:'playlist' },
    reminders:[ { id:1, h:19, m:0, freq:'semanal', days:[1,2,3,4,5], on:true }, { id:2, h:7, m:30, freq:'semanal', days:[6,0], on:false } ],
    agenda:{ provider:null, busy:true },
    sub:{ status:'ativa', plan:'mensal', card:'4242' },
    watch:{ paired:false, name:'Concentra+ A1B2', battery:78, volume:60, silent:false, h24:true, screen:0, pending:[], lowWarned:false },
    env:{ bt:true, net:true, speed:1 },
    sess:null, lastDone:null, goalNotifiedDay:null, unlocked:new Set(),
  };
}
function loadAna(){
  const { out, met } = genHistory();
  S.auth = 'ana'; S.newUser = false; S.tutorialSeen = true;
  S.allHistory = out; S.allMet = met;
  S.history = []; S.met = new Set(); S.recovered = false;
  S.watch.paired = true;
}
function restoreHistory(){ S.history = S.allHistory.slice(); S.met = new Set(S.allMet); S.recovered = true; }
const connected = () => S.watch.paired && S.env.bt && S.watch.battery > 0;
const catById = id => S.cats.find(c => c.id === id) || { id, name:id, color:'teal' };
const catName = id => catById(id).name;
const timerById = id => S.timers.find(t => t.id === id);
const dayTotal = k => S.history.filter(s => s.d === k).reduce((a, s) => a + s.min, 0);
const todaySessions = () => S.history.filter(s => s.d === TODAYK);
const todayTotal = () => dayTotal(TODAYK);
const goalPct = () => S.goal ? Math.min(100, Math.round(todayTotal() / S.goal * 100)) : 0;
const metToday = () => S.goal > 0 && todayTotal() >= S.goal;
function streak(){
  let n = 0, d = addDays(TODAY, -1);
  while (S.met.has(dkey(d))) { n++; d = addDays(d, -1); }
  return n + (metToday() ? 1 : 0);
}
const blockedCount = () => APPS.filter(a => S.blocked[a.id]).length;
const permsOk = () => Object.values(S.perms).every(Boolean);
const permsCount = () => Object.values(S.perms).filter(Boolean).length;
const initials = n => n.split(/\s+/).filter(Boolean).slice(0,2).map(w => w[0].toUpperCase()).join('') || '?';

/* ================= router ================= */
/* RESPONSÁVEL: Pessoa 3 · Início, metas e tema (histórias 13 a 18 do backlog) */
const SCREENS = {};
const TABS = ['inicio','timers','historico','perfil'];
function nav(id, p = {}, o = {}){
  if (o.reset) stack = [{ id, p }];
  else if (o.replace) stack[stack.length - 1] = { id, p };
  else stack.push({ id, p });
  U = o.keepU ? U : {};
  render({ anim: o.anim || (o.reset ? 'fade' : 'fwd') });
}
function back(){
  if (stack.length > 1) { stack.pop(); U = {}; render({ anim:'back' }); }
  else nav(S.auth ? 'inicio' : 'main', {}, { reset:true });
}
const cur = () => stack[stack.length - 1];
function render(o = {}){
  const c = cur(), scr = SCREENS[c.id];
  const root = $('#screen');
  const prev = root.querySelector('.body');
  const st = prev ? prev.scrollTop : 0;
  const ae = document.activeElement, aeKey = ae && ae.dataset && ae.dataset.in, selS = ae && ae.selectionStart;
  root.innerHTML = scr.r(c.p || {});
  const first = root.firstElementChild;
  if (o.anim && first) first.classList.add('in-' + o.anim);
  else { const b = root.querySelector('.body'); if (b) b.scrollTop = st; }
  if (!o.anim && aeKey) { const el = root.querySelector(`[data-in="${aeKey}"]`); if (el) { el.focus(); try { el.setSelectionRange(selS, selS); } catch(e){} } }
  scr.after && scr.after(c.p || {});
  applyTheme();
  live();
}
const rerender = () => render();

/* ================= ui primitives ================= */
/* RESPONSÁVEL: Pessoa 3 · Início, metas e tema (histórias 13 a 18 do backlog) */
const hdr = (title = '', right = '', o = {}) => `<div class="hdr">${o.noBack ? '' : `<button class="iconbtn" data-a="back" aria-label="Voltar">${ic('left', 24)}</button>`}${title ? `<h2 class="htitle">${title}</h2>` : ''}<div class="sp"></div>${right}</div>`;
const tg = (on, a, v = '') => `<button class="tg ${on ? 'on' : ''}" data-a="${a}" data-v="${v}" role="switch" aria-checked="${!!on}"></button>`;
const tagFor = catId => { const c = catById(catId); return `<span class="tag ${TAGCLS[c.color] || ''}">${esc(c.name)}</span>`; };
function tabbar(on){
  const it = [['inicio','home','Início'],['timers','timer','Timers'],['historico','cal','Histórico'],['perfil','user','Perfil']];
  return `<nav class="tabbar">${it.map(([id, i, l]) => `<button class="tab ${on === id ? 'on' : ''}" data-a="tab" data-v="${id}">${ic(i, 24, '', on === id ? 2.1 : 1.8)}${l}</button>`).join('')}</nav>`;
}
function batIcon(p, low){
  const w = Math.max(1.5, 13 * p / 100);
  return `<svg width="22" height="12" viewBox="0 0 24 12" fill="none"><rect x=".75" y=".75" width="19" height="10.5" rx="2.5" stroke="currentColor" stroke-width="1.5"/><rect x="2.6" y="2.6" width="${w}" height="6.8" rx="1" fill="${low ? 'var(--red)' : 'currentColor'}"/><path d="M22 4v4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`;
}
function ring(pct, color, size = 250, sw = 13){
  const r = (size - sw) / 2, C = 2 * Math.PI * r;
  return `<svg width="${size}" height="${size}"><circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="var(--track)" stroke-width="${sw}"/><circle id="ringfg" cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - pct)}" style="transition:stroke-dashoffset .35s linear,stroke .3s"/></svg>`;
}
function sheet(inner){ return `<div class="scrim" data-a="closeOverlay"></div><div class="sheet">${inner}</div>`; }
function modal(inner){ return `<div class="scrim" data-a="closeOverlay"></div><div class="modal">${inner}</div>`; }

/* ================= feedback layers ================= */
/* RESPONSÁVEL: Pessoa 3 · Início, metas e tema (histórias 13 a 18 do backlog) */
function toast(msg, icon = 'check'){
  const t = $('#toast');
  t.innerHTML = `<div class="toast">${ic(icon, 17)}<span>${esc(msg)}</span></div>`;
  clearTimeout(toast._t); toast._t = setTimeout(() => t.innerHTML = '', 2800);
}
function push(title, msg, o = {}){
  const box = $('#push');
  const el = document.createElement('div');
  el.className = 'push';
  el.innerHTML = `<div class="lg">${ic(o.icon || 'plus', 20, '', 2.4)}</div><div class="grow"><div class="tt"><b>${esc(title)}</b><span>agora</span></div><div class="msg">${esc(msg)}</div></div>`;
  el.onclick = () => { el.classList.add('out'); setTimeout(() => el.remove(), 300); o.onClick && o.onClick(); };
  box.prepend(el);
  setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 300); }, o.ms || 5200);
}
