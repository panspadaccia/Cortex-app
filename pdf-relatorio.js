/* Concentra+ · js/pessoa1/pdf-relatorio.js
   Pessoa 1 · Cadastro, relógio e timers (histórias 01 a 06 do backlog)
   Integrante: [Lucas Araújo Augusto] · GitHub: [@lucas-araujo01]
   Seções deste arquivo: PDF */
/* ================= PDF ================= */
/* RESPONSÁVEL: Pessoa 1 · Cadastro, relógio e timers (histórias 01 a 06 do backlog) */
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
