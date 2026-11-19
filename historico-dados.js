/* Concentra+ · js/pessoa4/historico-dados.js
   Pessoa 4 · Tutorial, histórico e suporte (histórias 19 a 24 do backlog)
   Integrante: [NOME] · GitHub: [@usuario]
   Seções deste arquivo: history generator */
/* ================= history generator ================= */
/* RESPONSÁVEL: Pessoa 4 · Tutorial, histórico e suporte (histórias 19 a 24 do backlog) */
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
