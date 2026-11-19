/* ================= helpers ================= */
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ICONS = {
  home:'<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  timer:'<circle cx="12" cy="13.5" r="7.5"/><path d="M12 9.5v4l2.5 2M9.5 2.5h5"/>',
  cal:'<rect x="3" y="4.5" width="18" height="16.5" rx="2.5"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4"/>',
  calcheck:'<rect x="3" y="4.5" width="18" height="16.5" rx="2.5"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4M9 15l2 2 4-4"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/>',
  play:'<path d="M7 4.5v15l12-7.5z" fill="currentColor" stroke="none"/>',
  pause:'<rect x="6" y="4.5" width="4" height="15" rx="1" fill="currentColor" stroke="none"/><rect x="14" y="4.5" width="4" height="15" rx="1" fill="currentColor" stroke="none"/>',
  playpause:'<path d="M3 6v12l8-6z" fill="currentColor" stroke="none"/><path d="M15 6v12M20 6v12" stroke-width="2.6"/>',
  left:'<path d="m15 18-6-6 6-6"/>', right:'<path d="m9 18 6-6-6-6"/>', down:'<path d="m6 9 6 6 6-6"/>', up:'<path d="m18 15-6-6-6 6"/>',
  plus:'<path d="M12 5v14M5 12h14"/>', minus:'<path d="M5 12h14"/>', check:'<path d="M20 6 9 17l-5-5"/>', x:'<path d="M18 6 6 18M6 6l12 12"/>',
  music:'<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
  book:'<path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z"/>',
  brief:'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  read:'<path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2zM22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z"/>',
  tagi:'<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z"/><circle cx="7.5" cy="7.5" r="1.2"/>',
  bell:'<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  moon:'<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9"/>',
  card:'<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>',
  trash:'<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6"/>',
  logout:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
  help:'<circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01"/>',
  bulb:'<path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2"/>',
  heart:'<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7z"/>',
  mail:'<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
  lock:'<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  info:'<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
  tri:'<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0zM12 9v4M12 17h.01"/>',
  alertc:'<circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>',
  bt:'<path d="m7 7 10 10-5 5V2l5 5L7 17"/>',
  cloud:'<path d="M4 14.9A7 7 0 1 1 15.7 8h1.8a4.5 4.5 0 0 1 2.5 8.2M12 12v9M8 17l4 4 4-4"/>',
  wifioff:'<path d="M12 20h.01M8.5 16.4a5 5 0 0 1 7 0M5 12.9a10 10 0 0 1 5.2-2.8M19 12.9a10 10 0 0 0-2.2-1.6M2 8.8a15 15 0 0 1 4.2-2.6M22 8.8A15 15 0 0 0 11 5M2 2l20 20"/>',
  wifi:'<path d="M12 20h.01M8.5 16.4a5 5 0 0 1 7 0M5 12.9a10 10 0 0 1 14 0M2 8.8a15 15 0 0 1 20 0"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  eye:'<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  eyeoff:'<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/><path d="M3 3l18 18"/>',
  camera:'<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z"/><circle cx="12" cy="13" r="3"/>',
  download:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
  device:'<rect x="2" y="7" width="20" height="11" rx="3"/>',
  flame:'<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.4-.5-2-1-3-1.1-2.1-.2-4 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.2.4-2.3 1-3.3.3 1.4 1.2 2.5 2.5 2.8z" fill="currentColor" stroke="none"/>',
  prev:'<path d="M18 19 8 12l10-7z" fill="currentColor" stroke="none"/><path d="M5 5v14" stroke-width="2.4"/>',
  next:'<path d="m6 5 10 7-10 7z" fill="currentColor" stroke="none"/><path d="M19 5v14" stroke-width="2.4"/>',
  gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  edit:'<path d="M12 20h9M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4z"/>',
  arrowr:'<path d="M5 12h14M12 5l7 7-7 7"/>',
  xcircle:'<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  vol:'<path d="M11 5 6 9H2v6h4l5 4zM15.5 8.5a5 5 0 0 1 0 7"/>',
  chart:'<path d="M3 21h18M7 17v-5M12 17V7M17 17v-8"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  layers:'<path d="m12 2 10 5-10 5L2 7zM2 17l10 5 10-5M2 12l10 5 10-5"/>',
  updown:'<path d="m7 9 5-5 5 5M7 15l5 5 5-5"/>',
  repeat:'<path d="m17 2 4 4-4 4M3 11v-1a4 4 0 0 1 4-4h14M7 22l-4-4 4-4M21 13v1a4 4 0 0 1-4 4H3"/>',
  shuffle:'<path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/>',
  list:'<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  phone:'<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M11 18h2"/>',
  usb:'<path d="M12 2v14M8 6l4-4 4 4M7 12h10v3a5 5 0 0 1-10 0z"/>',
  sparkle:'<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/>',
  send:'<path d="m22 2-7 20-4-9-9-4zM22 2 11 13"/>',
  vib:'<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M3 8v8M21 8v8"/>',
  bubble:'<path d="M21 12a8 8 0 0 1-11.6 7.1L3 21l1.9-6.4A8 8 0 1 1 21 12z"/>',
};
const ic = (n, sz = 20, cls = '', sw = 1.8) => `<svg class="ic ${cls}" width="${sz}" height="${sz}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${ICONS[n] || ''}</svg>`;
const pad2 = n => String(n).padStart(2, '0');
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}

/* ================= dates ================= */
const TODAY = new Date(2026, 10, 17);
const dkey = d => `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`;
const TODAYK = dkey(TODAY);
const parseK = k => { const [y,m,d] = k.split('-').map(Number); return new Date(y, m-1, d); };
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate()+n); return x; };
const MESES = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
const DOW1 = ['D','S','T','Q','Q','S','S'];
const DOW3 = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
const DOWL = ['domingo','segunda','terça','quarta','quinta','sexta','sábado'];
function fmtDur(m){ m = Math.round(m); if (m < 60) return `${m} min`; return `${Math.floor(m/60)}h ${pad2(m%60)}min`; }
function fmtGoal(m){ if (m < 60) return `${m} min`; const h = Math.floor(m/60), r = m%60; return r ? `${h}h ${r}min` : `${h}h`; }
function fmtSec(s){ s = Math.max(0, Math.ceil(s)); return `${pad2(Math.floor(s/60))}:${pad2(s%60)}`; }
function nowHM(){ const d = new Date(); return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`; }
function greeting(){ const h = new Date().getHours(); return h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite'; }
function rangeLabel(a, b){
  if (a.getMonth() === b.getMonth()) return `${a.getDate()} a ${b.getDate()} de ${MESES[b.getMonth()]} de ${b.getFullYear()}`;
  return `${a.getDate()} de ${MESES[a.getMonth()]} a ${b.getDate()} de ${MESES[b.getMonth()]} de ${b.getFullYear()}`;
}

/* ================= static data ================= */
const COLORS = { teal:'#1f6f78', orange:'#f2a93b', green:'#2e9e5b', red:'#d64545', purple:'#7b5ea7' };
const TAGCLS = { teal:'', orange:'orange', green:'green', red:'red', purple:'purple' };
const CAT_ICON = { estudo:'book', trabalho:'brief', leitura:'read' };
const DEFAULT_CATS = [
  { id:'estudo', name:'Estudo', color:'teal' },
  { id:'trabalho', name:'Trabalho', color:'orange' },
  { id:'leitura', name:'Leitura', color:'green' },
];
const DEFAULT_TIMERS = [
  { id:'pomodoro', name:'Pomodoro', focus:25, rest:5, cat:'estudo', def:true },
  { id:'profundo', name:'Foco profundo', focus:50, rest:10, cat:'trabalho', def:true },
  { id:'longo', name:'Estudo longo', focus:45, rest:15, cat:'estudo', def:true },
];
const APPS = [
  { id:'instagram', name:'Instagram', l:'I', c:'#c13584' },
  { id:'tiktok', name:'TikTok', l:'T', c:'#25282c' },
  { id:'youtube', name:'YouTube', l:'Y', c:'#d93025' },
  { id:'whatsapp', name:'WhatsApp', l:'W', c:'#1f9d55' },
  { id:'jogos', name:'Jogos', l:'J', c:'#5b5bd6' },
  { id:'noticias', name:'Notícias', l:'N', c:'#8a5a2b' },
  { id:'x', name:'X (Twitter)', l:'X', c:'#111' },
  { id:'netflix', name:'Netflix', l:'N', c:'#b20710' },
];
const TRACKS = {
  musicas: [
    { id:'piano', name:'Piano de estudo', sub:'Instrumental', dur:200, c:'#1f6f78' },
    { id:'lofi', name:'Lo-fi para foco', sub:'Instrumental', dur:185, c:'#6366c9' },
    { id:'cordas', name:'Cordas suaves', sub:'Instrumental', dur:250, c:'#8b5cb8' },
    { id:'jazz', name:'Jazz de biblioteca', sub:'Instrumental', dur:228, c:'#b06a3b' },
  ],
  ambiente: [
    { id:'chuva', name:'Chuva suave', sub:'Som ambiente', dur:600, c:'#3d7f8a' },
    { id:'cafe', name:'Cafeteria', sub:'Som ambiente', dur:600, c:'#9a6a3c' },
    { id:'floresta', name:'Floresta', sub:'Som ambiente', dur:600, c:'#2e8a55' },
    { id:'ondas', name:'Ondas do mar', sub:'Som ambiente', dur:600, c:'#2f6fa8' },
    { id:'lareira', name:'Lareira', sub:'Som ambiente', dur:600, c:'#c05a2c' },
    { id:'ruido', name:'Ruído branco', sub:'Som ambiente', dur:600, c:'#6b7280' },
  ],
};
const ALL_TRACKS = [...TRACKS.musicas, ...TRACKS.ambiente];
const trackById = id => ALL_TRACKS.find(t => t.id === id);

const TIPS = [
  { id:'blocos', cat:'Estudo', title:'Como estudar em blocos de 25 minutos', time:'3 min', cta:'timer25', body:[
    ['p','Estudar por horas seguidas cansa a mente. Blocos curtos, com pausas, ajudam você a manter a atenção do começo ao fim.'],
    ['h','1. Escolha uma tarefa só'],['p','Antes de começar, decida o que vai fazer neste bloco. Por exemplo: ler um capítulo ou resolver cinco exercícios.'],
    ['h','2. Inicie o timer no relógio'],['p','Aperte o botão de iniciar do Concentra+ e deixe o celular de lado. Os aplicativos bloqueados ajudam a não se distrair.'],
    ['h','3. Faça uma pausa de 5 minutos'],['p','Levante, beba água e alongue o corpo. Depois de quatro blocos, descanse por 15 a 20 minutos.'],
    ['h','4. Registre o que avançou'],['p','No fim de cada bloco, anote em uma linha o que concluiu. Ver o progresso acumulado motiva o próximo bloco.']]},
  { id:'revisar', cat:'Estudo', title:'Revisar antes de dormir ajuda a lembrar', time:'2 min', body:[
    ['p','O sono ajuda o cérebro a guardar o que você aprendeu durante o dia. Uma revisão curta à noite aproveita esse efeito.'],
    ['h','Revise, não estude conteúdo novo'],['p','Use 10 a 15 minutos para reler resumos ou refazer duas ou três questões. Conteúdo novo à noite tende a render menos.'],
    ['h','Teste a si mesmo'],['p','Feche o caderno e tente explicar o assunto em voz alta. Lembrar ativamente fixa mais do que só reler.'],
    ['h','Desligue as telas depois'],['p','Termine a revisão e deixe o celular longe da cama. O Concentra+ mostra a hora sem acender a tela do celular.']]},
  { id:'dificil', cat:'Trabalho', title:'Comece pela tarefa mais difícil', time:'2 min', body:[
    ['p','A energia e a atenção costumam ser maiores no início do dia. Use esse momento para o que exige mais de você.'],
    ['h','Defina a tarefa na véspera'],['p','Antes de encerrar o dia, escolha qual será a primeira tarefa de amanhã. Assim você começa sem precisar decidir.'],
    ['h','Proteja o primeiro bloco'],['p','Use um timer de Foco profundo (50 min) com os aplicativos bloqueados e a agenda marcada como Ocupado.']]},
  { id:'interrupcoes', cat:'Trabalho', title:'Como lidar com interrupções', time:'4 min', body:[
    ['p','Cada interrupção custa minutos para voltar ao mesmo nível de concentração. Dá para reduzir boa parte delas.'],
    ['h','Avise que está em foco'],['p','Com a integração de agenda, o Concentra+ cria um evento Ocupado durante a sessão. Seus contatos veem que você não está disponível.'],
    ['h','Anote e siga em frente'],['p','Lembrou de algo urgente no meio do bloco? Escreva num papel e volte para a tarefa. Resolva na pausa.'],
    ['h','Use o Modo Restrito'],['p','Quando a tentação de parar for grande, ative o Modo Restrito: a sessão não pode ser pausada nem cancelada.']]},
  { id:'telas', cat:'Sono', title:'Telas à noite e a qualidade do sono', time:'3 min', body:[
    ['p','A luz e os estímulos das telas atrasam o sono e deixam o descanso mais leve. Isso afeta a concentração do dia seguinte.'],
    ['h','Crie um horário de corte'],['p','Defina um lembrete para parar de usar o celular cerca de uma hora antes de dormir.'],
    ['h','Use o modo escuro'],['p','Se precisar usar o app à noite, o tema escuro reduz o cansaço visual.']]},
  { id:'rotina', cat:'Rotina', title:'Monte uma rotina de foco que dure', time:'3 min', body:[
    ['p','Hábitos se formam pela repetição em horários parecidos. Uma meta diária realista é melhor que uma meta alta abandonada.'],
    ['h','Comece pequeno'],['p','Uma meta de 1 hora por dia, cumprida todo dia, constrói mais do que 4 horas em um dia só.'],
    ['h','Use lembretes'],['p','Programe lembretes nos horários em que você costuma estudar ou trabalhar.'],
    ['h','Acompanhe a ofensiva'],['p','Ver os dias seguidos batendo a meta é um incentivo para não quebrar a sequência.']]},
  { id:'ambiente', cat:'Rotina', title:'Prepare o ambiente antes de começar', time:'2 min', body:[
    ['p','Um ambiente organizado tira obstáculos do caminho e sinaliza ao cérebro que é hora de focar.'],
    ['h','Tenha tudo à mão'],['p','Água, material e carregador perto de você evitam levantar no meio do bloco.'],
    ['h','Som que ajuda'],['p','Sons ambientes como chuva ou ruído branco mascaram barulhos que distraem.']]},
];

const FAQ = [
  { cat:'Relógio', q:'Como conecto o relógio?', a:'Ligue o relógio na energia pelo cabo USB-C, ative o Bluetooth no celular e toque em Buscar relógio na tela de conexão. Escolha o Concentra+ da lista.' },
  { cat:'Relógio', q:'O relógio não aparece na busca. O que faço?', a:'Confira se o cabo USB-C está ligado e se o display está aceso. Deixe o relógio a menos de 2 metros do celular e toque em Buscar de novo. Se o Bluetooth do celular estiver desligado, a busca não encontra nada.' },
  { cat:'Relógio', q:'Posso usar o relógio sem o celular?', a:'Sim. Aperte o botão do centro para iniciar um timer direto no relógio. Os dados ficam guardados nele e são sincronizados com o app quando o Bluetooth reconectar.' },
  { cat:'Relógio', q:'Como ajusto o volume dos alertas?', a:'Use os botões Volume – e Volume + no topo do relógio ou vá em Perfil > Meu relógio > Configurações do relógio. O nível aparece no display enquanto você ajusta.' },
  { cat:'Bloqueio', q:'Por que o bloqueio de aplicativos não funciona?', a:'O bloqueio precisa de quatro permissões: Acessibilidade, Exibir sobre outros apps, Acesso às notificações e Bluetooth. Veja o status em Antes de começar > Permissões.' },
  { cat:'Bloqueio', q:'Os aplicativos bloqueados voltam sozinhos?', a:'Sim. Ao encerrar ou interromper a sessão, os aplicativos e as notificações são liberados automaticamente.' },
  { cat:'Bloqueio', q:'O que é o Modo Restrito?', a:'É um modo em que a sessão não pode ser pausada nem cancelada, nem pelo app nem pelos botões do relógio. Use quando quiser evitar sabotar seu próprio foco.' },
  { cat:'Conta', q:'Troquei de celular. Perco meu histórico?', a:'Não. O histórico fica associado à sua conta. Ao entrar no novo celular, o app oferece recuperar suas sessões.' },
  { cat:'Conta', q:'Como excluo minha conta e meus dados?', a:'Vá em Perfil > Excluir conta e dados. Pedimos sua senha para confirmar e apagamos dados pessoais e histórico dos servidores, conforme a LGPD.' },
  { cat:'Assinatura', q:'Como cancelo minha assinatura?', a:'Vá em Perfil > Minha assinatura > Cancelar assinatura. Você mantém o acesso até o fim do período já pago.' },
  { cat:'Assinatura', q:'Quais planos existem?', a:'Mensal (R$ 19,90), anual (R$ 179,90, equivale a R$ 14,99 por mês) e estudante (R$ 9,90 por mês com comprovante de matrícula).' },
];

/* ================= history generator ================= */
function genHistory(){
  const rnd = mulberry32(42), out = [], met = new Set();
  const pickCat = () => { const r = rnd(); return r < .46 ? 'estudo' : r < .77 ? 'trabalho' : 'leitura'; };
  for (let d = new Date(2026, 9, 1); d < TODAY; d = addDays(d, 1)) {
    const k = dkey(d), dow = d.getDay(), mon = d.getMonth(), day = d.getDate();
    let plan;
    if (mon === 10 && day >= 12) plan = 'met';
    else if (mon === 10 && day === 11) plan = 'low';
    else { const r = rnd(); plan = r < .2 ? 'none' : r < .58 ? 'met' : 'low'; if (dow === 0 && rnd() < .55) plan = 'none'; }
    if (plan === 'none') continue;
    if (k === '2026-11-10') {
      out.push({ d:k, t:'09:00', cat:'estudo', min:45 }, { d:k, t:'10:30', cat:'trabalho', min:60 }, { d:k, t:'15:00', cat:'estudo', min:30 });
      met.add(k); continue;
    }
    const target = plan === 'met' ? 120 + Math.floor(rnd()*5)*15 : 30 + Math.floor(rnd()*5)*15;
    let rem = target, mins = (8 + Math.floor(rnd()*3))*60 + (rnd() < .5 ? 0 : 30);
    while (rem > 0) {
      const opts = [25,30,35,40,45,50,60];
      let len = Math.min(rem, opts[Math.floor(rnd()*opts.length)]);
      if (rem - len < 20) len = rem;
      out.push({ d:k, t:`${pad2(Math.floor(mins/60))}:${pad2(mins%60)}`, cat:pickCat(), min:len });
      rem -= len; mins += len + 15 + Math.floor(rnd()*4)*15;
    }
    if (target >= 120) met.add(k);
  }
  out.push({ d:TODAYK, t:'09:00', cat:'estudo', min:45 }, { d:TODAYK, t:'10:30', cat:'trabalho', min:35 });
  return { out, met };
}

/* ================= state ================= */
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

/* ================= theme ================= */
function isDark(){ return S.theme === 'escuro' || (S.theme === 'auto' && window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches); }
function applyTheme(){ document.querySelector('.screen-wrap').classList.toggle('dark', isDark()); document.body.classList.toggle('dark-mobile', isDark()); }


/* ================= event binding ================= */
const A = {};
function bindEvents(){
  const ph = $('#phone');
  ph.addEventListener('click', e => {
    const el = e.target.closest('[data-a]');
    if (!el || !ph.contains(el)) return;
    audioUnlock();
    const fn = A[el.dataset.a];
    if (fn) { e.preventDefault(); fn(el.dataset.v, el, e); }
  });
  ph.addEventListener('input', e => {
    const el = e.target; const k = el.dataset.in;
    if (!k) return;
    U[k] = el.type === 'checkbox' ? el.checked : el.value;
    if (el.dataset.err) { U[el.dataset.err] = null; el.classList.remove('err'); const n = el.closest('.fwrap')?.querySelector('.errt'); if (n) n.remove(); }
    const fn = el.dataset.oi && A[el.dataset.oi];
    if (fn) fn(el.value, el, e);
  });
  ph.addEventListener('change', e => { const el = e.target; const fn = el.dataset.oc && A[el.dataset.oc]; if (fn) fn(el.value, el, e); });
  ph.addEventListener('submit', e => e.preventDefault());
  ph.addEventListener('keydown', e => {
    if (e.key === 'Enter' && e.target.matches('input.inp')) { const b = ph.querySelector('.foot .btn.pri'); if (b) b.click(); }
  });
}

/* ================= session engine ================= */
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

/* ================= PDF ================= */
function buildPdf(R){
  const esc8 = s => { s = String(s).replace(/[–—]/g, '-').replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/…/g, '...'); let o = ''; for (const ch of s) { let c = ch.charCodeAt(0); if (c > 255) c = 63; if (ch === '(' || ch === ')' || ch === '\\') o += '\\' + ch; else if (c < 32 || c > 126) o += '\\' + c.toString(8).padStart(3, '0'); else o += ch; } return o; };
  const ops = [];
  const rgb = h => { const n = parseInt(h.slice(1), 16); return `${((n >> 16) / 255).toFixed(3)} ${(((n >> 8) & 255) / 255).toFixed(3)} ${((n & 255) / 255).toFixed(3)}`; };
  const T = (x, y, s, txt, o = {}) => ops.push(`BT /${o.b ? 'F2' : 'F1'} ${s} Tf ${rgb(o.c || '#1b1f23')} rg 1 0 0 1 ${x} ${y} Tm (${esc8(txt)}) Tj ET`);
  const Rr = (x, y, w, h, c) => ops.push(`${rgb(c)} rg ${x} ${y} ${w} ${h} re f`);
  const catLbl = U.rc === 'todas' ? 'Todas' : catName(U.rc);
  Rr(0, 762, 595, 80, '#1f6f78');
  T(40, 806, 22, 'Concentra+', { b:1, c:'#ffffff' }); T(40, 784, 12, 'Relatório de produtividade', { c:'#d8eef0' });
  T(380, 806, 10, `Gerado em ${pad2(TODAY.getDate())}/${pad2(TODAY.getMonth() + 1)}/${TODAY.getFullYear()} às ${nowHM()}`, { c:'#d8eef0' });
  T(380, 790, 10, `${S.user.name} · ${S.user.email}`, { c:'#d8eef0' });
  T(40, 735, 11, `Período: ${rangeLabel(R.a, R.b)}`, { b:1 }); T(40, 718, 11, `Categoria: ${catLbl}`, { c:'#6b7280' });
  const kp = [['Total de foco', fmtDur(R.total)], ['Sessões', String(R.ss.length)], ['Média diária', fmtDur(R.total / R.ndays)]];
  kp.forEach(([l, v], i) => { const x = 40 + i * 175; Rr(x, 640, 163, 58, '#e3f0f1'); T(x + 12, 678, 9.5, l, { c:'#4b5560' }); T(x + 12, 653, 17, v, { b:1, c:'#1f6f78' }); });
  T(40, 610, 12, R.ndays <= 7 ? 'Foco por dia da semana' : R.ndays <= 14 ? 'Foco por dia' : 'Foco por semana', { b:1 });
  const max = Math.max(...R.bars.map(b => b.v), 1), n = R.bars.length, bw = Math.min(46, (515 - (n - 1) * 8) / n);
  Rr(40, 452, 515, .8, '#d6dade');
  R.bars.forEach((b, i) => { const x = 40 + i * (bw + 8), h = Math.max(2, b.v / max * 128); Rr(x, 453, bw, h, b.v === max ? '#1f6f78' : '#a9d0d4'); T(x, 440, 8, b.l, { c:'#6b7280' }); if (b.v) T(x, 457 + h, 7.5, fmtDur(b.v), { c:'#4b5560' }); });
  T(40, 405, 12, 'Por categoria', { b:1 });
  R.byCat.forEach((x, i) => { const y = 383 - i * 20; Rr(40, y, 10, 10, COLORS[x.c.color]); T(58, y + 1, 10.5, x.c.name); T(200, y + 1, 10.5, `${Math.round(x.v / R.total * 100)}%`, { b:1 }); T(250, y + 1, 10.5, fmtDur(x.v), { c:'#6b7280' }); Rr(330, y + 2, 225 * x.v / R.total, 6, COLORS[x.c.color]); });
  let y = 383 - R.byCat.length * 20 - 22;
  T(40, y, 12, 'Sessões do período', { b:1 }); y -= 20;
  Rr(40, y - 4, 515, 18, '#f3f5f7'); [['Data', 48], ['Início', 150], ['Categoria', 230], ['Duração', 470]].forEach(([l, x]) => T(x, y + 1, 9.5, l, { b:1, c:'#4b5560' })); y -= 18;
  const rows = R.ss.slice().sort((a, b) => (b.d + b.t).localeCompare(a.d + a.t)), maxRows = Math.max(0, Math.floor((y - 60) / 16));
  rows.slice(0, maxRows).forEach(s => { const d = parseK(s.d); T(48, y, 9.5, `${DOW3[d.getDay()]}, ${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}`); T(150, y, 9.5, s.t); T(230, y, 9.5, catName(s.cat)); T(470, y, 9.5, fmtDur(s.min)); Rr(40, y - 5, 515, .5, '#e6e9ed'); y -= 16; });
  if (rows.length > maxRows) T(48, y - 2, 9.5, `+ ${rows.length - maxRows} sessões no período`, { c:'#6b7280' });
  T(40, 30, 8.5, 'Concentra+ · Grupo Cortex · protótipo navegável com dados fictícios', { c:'#9aa1ab' });
  const content = ops.join('\n');
  const objs = ['<< /Type /Catalog /Pages 2 0 R >>', '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> /Contents 4 0 R >>',
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>', '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>'];
  let pdf = '%PDF-1.4\n'; const offs = [];
  objs.forEach((o, i) => { offs.push(pdf.length); pdf += `${i + 1} 0 obj\n${o}\nendobj\n`; });
  const xref = pdf.length;
  pdf += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n${offs.map(o => String(o).padStart(10, '0') + ' 00000 n \n').join('')}trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  const out = new Uint8Array(pdf.length); for (let i = 0; i < pdf.length; i++) out[i] = pdf.charCodeAt(i) & 255; return out;
}

/* ================= boot ================= */
function boot(){
  S = freshState(); stack = [{ id:'main', p:{} }];
  bindEvents(); bindWatch(); bindEnv();
  render({ anim:'fade' });
  setInterval(tick, 200);
  try { matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => applyTheme()); } catch (e) {}
}
document.addEventListener('DOMContentLoaded', boot);
