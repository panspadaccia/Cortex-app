/* Concentra+ · js/pessoa4/iniciar.js
   Pessoa 4 · Tutorial, histórico e suporte (histórias 19 a 24 do backlog)
   Integrante: [NOME] · GitHub: [@usuario]
   Seções deste arquivo: boot */
/* ================= boot ================= */
/* RESPONSÁVEL: Pessoa 4 · Tutorial, histórico e suporte (histórias 19 a 24 do backlog) */
function boot(){
  S = freshState(); stack = [{ id:'main', p:{} }];
  bindEvents(); bindWatch(); bindEnv();
  render({ anim:'fade' });
  setInterval(tick, 200);
  try { matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => applyTheme()); } catch (e) {}
}
document.addEventListener('DOMContentLoaded', boot);
