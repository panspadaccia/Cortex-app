/* Concentra+ · js/pessoa3/tema.js
   Pessoa 3 · Início, metas e tema (histórias 13 a 18 do backlog)
   Integrante: THAIS · GitHub: @thaisrpc
   Seções deste arquivo: theme */
/* ================= theme ================= */
/* RESPONSÁVEL: Pessoa 3 · Início, metas e tema (histórias 13 a 18 do backlog) */
function isDark(){ return S.theme === 'escuro' || (S.theme === 'auto' && window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches); }
function applyTheme(){ document.querySelector('.screen-wrap').classList.toggle('dark', isDark()); document.body.classList.toggle('dark-mobile', isDark()); }
