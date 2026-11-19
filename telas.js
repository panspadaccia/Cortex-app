/* Concentra+ · js/pessoa1/telas.js
   Pessoa 1 · Cadastro, relógio e timers (histórias 01 a 06 do backlog)
   Integrante: [Lucas Araújo Augusto] · GitHub: [@lucas-araujo01]
   Seções deste arquivo: 01 Boas-vindas, 02 Cadastro, 03 Confirmação, 04 Login, 41 Termos, 06 Conexão (3 passos), 08 Pareamento, 12 Timers, 13 Novo / editar timer, 30 Relatórios (parte do Histórico), 42 Sem conexão, 35 Editar perfil */
/* ================= 01 Boas-vindas ================= */
/* RESPONSÁVEL: Pessoa 1 · Cadastro, relógio e timers (histórias 01 a 06 do backlog) */
SCREENS.main = { r: () => `<div class="scr">
  <div class="body" style="display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center">
    <div style="position:relative;width:120px;height:120px">
      <svg width="120" height="120" viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" fill="none" stroke="var(--pri-soft2)" stroke-width="7"/><circle cx="60" cy="60" r="52" fill="none" stroke="var(--pri)" stroke-width="7" stroke-linecap="round" stroke-dasharray="327" stroke-dashoffset="90" transform="rotate(-210 60 60)" class="logo-arc"/><circle cx="60" cy="60" r="33" fill="var(--pri-soft)"/><path d="M60 45v30M45 60h30" stroke="var(--pri)" stroke-width="7" stroke-linecap="round"/></svg>
    </div>
    <h1 style="font-size:36px;font-weight:700;letter-spacing:-.02em;margin-top:22px">Concentra+</h1>
    <p class="sub" style="font-size:17px;margin-top:4px">Foco que acompanha você</p>
  </div>
  <div class="foot"><button class="btn pri" data-a="go" data-v="cadastro">Criar conta</button><button class="btn link" data-a="go" data-v="login">Já tenho conta</button></div>
</div>` };

/* ================= 02 Cadastro ================= */
/* RESPONSÁVEL: Pessoa 1 · Cadastro, relógio e timers (histórias 01 a 06 do backlog) */
SCREENS.cadastro = { r: () => {
  U.user ??= ''; U.email ??= ''; U.pass ??= '';
  return `<div class="scr">${hdr()}
  <div class="body">
    <h1 class="h1">Crie sua conta</h1><p class="sub">Leva menos de um minuto.</p>
    <div class="fwrap"><label class="lbl">Nome de usuário</label><input class="inp ${U.eUser ? 'err' : ''}" data-in="user" data-err="eUser" value="${esc(U.user)}" placeholder="ex.: ana.souza" autocomplete="off">${U.eUser ? `<div class="errt">${ic('alertc', 15)}${U.eUser}</div>` : ''}</div>
    <div class="fwrap"><label class="lbl">E-mail</label><input class="inp ${U.eEmail ? 'err' : ''}" data-in="email" data-err="eEmail" type="email" value="${esc(U.email)}" placeholder="voce@email.com" autocomplete="off">${U.eEmail ? `<div class="errt">${ic('alertc', 15)}${U.eEmail}</div>` : ''}</div>
    <div class="fwrap"><label class="lbl">Senha</label><div class="field"><input class="inp ${U.ePass ? 'err' : ''}" data-in="pass" data-err="ePass" type="${U.show ? 'text' : 'password'}" value="${esc(U.pass)}" style="padding-right:50px"><button class="eyeb" data-a="togglePass">${ic(U.show ? 'eyeoff' : 'eye', 20)}</button></div>${U.ePass ? `<div class="errt">${ic('alertc', 15)}${U.ePass}</div>` : `<div class="help">Mínimo de 8 caracteres</div>`}</div>
  </div>
  <div class="foot"><p class="center xs muted" style="margin-bottom:8px;line-height:1.5">Ao continuar, você aceita os <a class="tlink xs" style="text-decoration:underline" data-a="go" data-v="termos">Termos de uso e a Política de privacidade</a>.</p><button class="btn pri" data-a="cadastroContinuar">Continuar</button></div>
</div>`; } };
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

/* ================= 03 Confirmação ================= */
/* RESPONSÁVEL: Pessoa 1 · Cadastro, relógio e timers (histórias 01 a 06 do backlog) */
const CODE = '427193';
SCREENS.confirmacao = {
  r: () => { U.code ??= ['','','','','','']; U.left ??= 30;
    return `<div class="scr">${hdr()}
    <div class="body">
      <div class="iconsq" style="margin-top:8px">${ic('mail', 26)}</div>
      <h1 class="h1" style="margin-top:20px">Confirme seu e-mail</h1>
      <p class="sub">Enviamos um código de 6 dígitos para<br><b style="color:var(--text)">${esc(S.pending?.email || 'ana@email.com')}</b></p>
      <div class="otp ${U.err ? 'err' : ''}">${U.code.map((c, i) => `<input inputmode="numeric" maxlength="1" data-otp="${i}" value="${c}">`).join('')}</div>
      ${U.err ? `<div class="errt">${ic('alertc', 15)}Código incorreto. Confira e tente de novo.</div>` : ''}
      <p class="center small muted" style="margin-top:22px">Não recebeu o código?</p>
      <p class="center" style="margin-top:8px">${U.left > 0 ? `<span class="small b muted" id="resend">Reenviar código em 0:${pad2(U.left)}</span>` : `<a class="tlink" data-a="resend">Reenviar código</a>`}</p>
    </div>
    <div class="foot"><button class="btn pri" data-a="confirmarCodigo">Confirmar</button></div></div>`; },
  after: () => {
    const ins = [...document.querySelectorAll('[data-otp]')];
    ins.forEach((el, i) => {
      el.oninput = () => { el.value = el.value.replace(/\D/g, '').slice(-1); U.code[i] = el.value; if (U.err) { U.err = false; document.querySelector('.otp').classList.remove('err'); document.querySelector('.errt')?.remove(); } if (el.value && ins[i+1]) ins[i+1].focus(); if (U.code.join('').length === 6) A.confirmarCodigo(); };
      el.onkeydown = e => { if (e.key === 'Backspace' && !el.value && ins[i-1]) ins[i-1].focus(); };
      el.onpaste = e => { const t = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, 6); if (t) { e.preventDefault(); U.code = t.padEnd(6, ' ').split('').map(c => c.trim()); rerender(); } };
    });
    const first = ins.find(x => !x.value) || ins[5]; setTimeout(() => first && first.focus(), 50);
    if (!U.sent) { U.sent = true; setTimeout(() => push('E-mail · Concentra+', `Seu código de verificação é ${CODE}`, { icon:'mail', ms:9000 }), 1300); }
    clearInterval(U.tm); U.tm = setInterval(() => { if (cur().id !== 'confirmacao') return clearInterval(U.tm); U.left--; const el = $('#resend'); if (U.left <= 0) { clearInterval(U.tm); rerender(); } else if (el) el.textContent = `Reenviar código em 0:${pad2(U.left)}`; }, 1000);
  }
};
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

/* ================= 04 Login ================= */
/* RESPONSÁVEL: Pessoa 1 · Cadastro, relógio e timers (histórias 01 a 06 do backlog) */
SCREENS.login = { r: () => { U.email ??= 'ana@email.com'; U.pass ??= '';
  return `<div class="scr">${hdr()}
  <div class="body">
    <h1 class="h1">Que bom ter você de volta</h1><p class="sub">Entre para continuar de onde parou.</p>
    <div class="fwrap"><label class="lbl">E-mail</label><input class="inp ${U.eEmail ? 'err' : ''}" data-in="email" data-err="eEmail" type="email" value="${esc(U.email)}">${U.eEmail ? `<div class="errt">${ic('alertc', 15)}${U.eEmail}</div>` : ''}</div>
    <div class="fwrap"><label class="lbl">Senha</label><div class="field"><input class="inp ${U.ePass ? 'err' : ''}" data-in="pass" data-err="ePass" type="${U.show ? 'text' : 'password'}" value="${esc(U.pass)}" placeholder="Sua senha" style="padding-right:50px"><button class="eyeb" data-a="togglePass">${ic(U.show ? 'eyeoff' : 'eye', 20)}</button></div>${U.ePass ? `<div class="errt">${ic('alertc', 15)}${U.ePass}</div>` : ''}</div>
    <div style="text-align:right;margin-top:16px"><a class="tlink" data-a="esqueci">Esqueci minha senha</a></div>
  </div>
  <div class="foot"><button class="btn pri" data-a="entrar">Entrar</button><p class="center small muted" style="margin-top:8px">Novo por aqui? <a class="tlink" data-a="go" data-v="cadastro">Criar conta</a></p></div>
</div>`; } };
A.esqueci = () => { if (!validEmail(U.email)) { U.eEmail = 'Digite seu e-mail para receber o link'; return rerender(); } toast(`Enviamos um link de redefinição para ${U.email.trim()}`, 'mail'); };
A.entrar = () => {
  U.eEmail = !validEmail(U.email) ? 'Digite um e-mail válido' : null;
  U.ePass = U.pass.length < 8 ? 'Senha incorreta. Ela tem no mínimo 8 caracteres.' : null;
  if (U.eEmail || U.ePass) return rerender();
  loadAna(); S.user.email = U.email.trim();
  nav('recuperacao', {}, { reset:true });
};

/* ================= 41 Termos ================= */
/* RESPONSÁVEL: Pessoa 1 · Cadastro, relógio e timers (histórias 01 a 06 do backlog) */
SCREENS.termos = { r: () => { U.t ??= 'termos';
  const T = [['1. Uso do aplicativo','O Concentra+ ajuda você a organizar sessões de foco junto com o relógio de mesa. Use o app de forma pessoal e não compartilhe sua conta.'],['2. Sua conta','Você é responsável pelas informações do cadastro e por manter sua senha em segurança.'],['3. Assinatura','Alguns recursos exigem assinatura. Você pode cancelar quando quiser, em Perfil > Minha assinatura.'],['4. Encerramento','Você pode excluir sua conta e seus dados a qualquer momento, em Perfil > Excluir conta e dados.']];
  const P = [['1. Dados que coletamos','Nome, e-mail, sessões de foco, metas e o estado do relógio conectado, como bateria e versão.'],['2. Para que usamos','Mostrar seu histórico e relatórios, enviar lembretes e melhorar o Concentra+.'],['3. Compartilhamento','Não vendemos seus dados. A agenda só é lida se você ativar a integração.'],['4. Seus direitos','Você pode corrigir, baixar ou apagar seus dados quando quiser, conforme a LGPD.']];
  return `<div class="scr">${hdr('Termos e privacidade')}
  <div class="body doc"><div class="chips mt8"><button class="chip ${U.t === 'termos' ? 'on' : ''}" data-a="setU" data-v="t:termos">Termos de uso</button><button class="chip ${U.t === 'priv' ? 'on' : ''}" data-a="setU" data-v="t:priv">Política de privacidade</button></div>
  <p class="xs muted mt16">Atualizado em 1 de novembro de 2026</p>
  ${(U.t === 'termos' ? T : P).map(([h, p]) => `<h3>${h}</h3><p>${p}</p>`).join('')}</div>
  <div class="foot"><button class="btn pri" data-a="back">Entendi</button></div></div>`; } };
A.setU = v => { const [k, val] = v.split(':'); U[k] = val; rerender(); };

/* ================= 06 Conexão (3 passos) ================= */
/* RESPONSÁVEL: Pessoa 1 · Cadastro, relógio e timers (histórias 01 a 06 do backlog) */
const CONN = [
  { t:'Conecte o relógio à energia', d:'Ligue o cabo USB-C na entrada traseira. O display acende mostrando a hora.', il: () => `<div style="margin:56px auto 0;width:190px"><div style="background:#1d2124;border-radius:22px;padding:14px 14px 10px;box-shadow:0 14px 30px rgba(0,0,0,.25)"><div style="background:#050607;border-radius:12px;height:70px;display:flex;align-items:center;justify-content:center" class="led mid">12:30</div><div style="display:flex;justify-content:center;gap:10px;margin-top:10px">${'<i style="width:9px;height:9px;border-radius:50%;background:#555;display:block"></i>'.repeat(5)}</div></div><div style="width:46px;height:38px;border-left:4px solid var(--orange);border-bottom:4px solid var(--orange);border-bottom-left-radius:12px;margin:0 0 0 70px"></div><div style="width:26px;height:12px;border-radius:3px;background:var(--orange);margin-left:56px"></div></div>` },
  { t:'Ative o Bluetooth no celular', d:'Abra os ajustes rápidos do celular e ligue o Bluetooth.', il: () => `<div class="illo" style="width:130px;height:230px;border-radius:24px;padding:16px 14px;display:flex;flex-direction:column;gap:12px;justify-content:flex-start"><div style="background:var(--pri-soft);border-radius:14px;padding:9px;display:flex;gap:9px;align-items:center"><span style="width:32px;height:32px;border-radius:50%;background:var(--pri);color:var(--pri-ink);display:flex;align-items:center;justify-content:center">${ic('bt', 18, '', 2.2)}</span><span style="flex:1"><i style="display:block;height:5px;border-radius:3px;background:var(--pri);width:80%"></i><i style="display:block;height:5px;border-radius:3px;background:var(--pri-soft2);width:55%;margin-top:5px"></i></span></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">${'<i style="display:block;height:38px;border-radius:10px;background:var(--track)"></i>'.repeat(4)}</div></div>` },
  { t:'Toque em Buscar relógio', d:'Deixe o relógio de mesa perto do celular. A busca leva poucos segundos.', il: () => `<div class="radar"><i style="inset:0"></i><i style="inset:30px"></i><i class="p" style="inset:0"></i><span style="width:110px;height:110px;border-radius:50%;border:2px solid var(--pri);display:flex;align-items:center;justify-content:center;background:var(--bg)"><span class="mini-clock" style="font-size:14px;padding:8px 10px">12:30</span></span></div>` },
];
SCREENS.conexao = { r: () => { U.i ??= 0; const s = CONN[U.i];
  return `<div class="scr"><div class="hdr" style="padding-left:20px"><span class="small muted b">Passo ${U.i + 1} de 3</span><div class="sp"></div><button class="skip" data-a="tutPular">Pular</button></div>
  <div class="body" style="display:flex;flex-direction:column">${s.il()}<h2 class="tut-title">${s.t}</h2><p class="tut-text">${s.d}</p><div style="flex:1"></div><div class="dots">${CONN.map((_, i) => `<i class="${i === U.i ? 'on' : ''}"></i>`).join('')}</div></div>
  <div class="foot"><button class="btn pri" data-a="connNext">${U.i === 2 ? 'Buscar relógio' : 'Próximo'}</button></div></div>`; } };
A.connNext = () => { if (U.i < 2) { U.i++; render({ anim:'fwd' }); } else nav('pareamento', { from:'onboarding' }); };

/* ================= 08 Pareamento ================= */
/* RESPONSÁVEL: Pessoa 1 · Cadastro, relógio e timers (histórias 01 a 06 do backlog) */
SCREENS.pareamento = {
  r: p => { U.st ??= 'busca';
    const titles = { busca:'Vamos procurar o aparelho por Bluetooth.', lista:'Escolha o aparelho que está na sua mesa.', conectando:'Isso leva só alguns segundos.', ok:'Tudo certo com a conexão.', erro:'Algo impediu a conexão.' };
    let mid = '', foot = '';
    if (U.st === 'busca') {
      mid = `<div class="radar"><i style="inset:0"></i><i style="inset:28px"></i><i class="p" style="inset:0"></i><i class="p" style="inset:0;animation-delay:1.1s"></i><span style="width:104px;height:104px;border-radius:50%;border:2px solid var(--pri);display:flex;align-items:center;justify-content:center;background:var(--pri-soft)"><span class="mini-clock">12:30</span></span></div><p class="center b mt24" style="font-size:16px">Procurando seu Concentra+…</p><p class="center small muted mt16">Deixe o aparelho ligado e perto do celular.</p>`;
      foot = `<button class="btn out" data-a="pararBusca">Parar busca</button>`;
    } else if (U.st === 'lista') {
      const devs = [['Concentra+ A1B2','Sinal forte','a1b2'],['Concentra+ C3D4','Sinal fraco','c3d4']];
      mid = `<p class="small muted b mt16" style="margin-bottom:10px">2 dispositivos encontrados</p>${devs.map(([n, s, id]) => `<div class="card dev"><span class="mini-clock">12:30</span><div class="grow"><b style="font-size:15.5px">${n}</b><div class="xs muted mt8" style="margin-top:2px;display:flex;align-items:center;gap:5px">${sig(id === 'a1b2' ? 4 : 1)}${s}</div></div><button class="pill-btn" data-a="conectarDev" data-v="${id}">Conectar</button></div>`).join('')}<p class="center mt16"><a class="tlink" data-a="buscarDeNovo">Buscar de novo</a></p>`;
    } else if (U.st === 'conectando') {
      mid = `<div style="height:150px"></div><div class="iconhero t" style="width:80px;height:80px">${ic('bt', 34, '', 2)}</div><p class="center b mt24" style="font-size:16px">Conectando ao ${esc(U.devName)}…</p><div class="bar t" style="width:184px;margin:16px auto 0;height:6px"><i id="pbar" style="width:10%;transition:width 1.6s ease"></i></div>`;
    } else if (U.st === 'ok') {
      mid = `<div class="hero" style="padding-top:150px"><div class="iconhero g" style="width:80px;height:80px">${ic('check', 38, '', 3)}</div><h2>Conectado!</h2><p>O ${esc(U.devName)} está pronto para usar.</p></div>`;
      foot = `<button class="btn pri" data-a="pareouContinuar">Continuar</button>`;
    } else {
      mid = `<div class="hero" style="padding-top:130px"><div class="iconhero r" style="width:80px;height:80px"><b style="font-size:40px">!</b></div><h2>Não encontramos seu Concentra+</h2><p>${S.env.bt ? 'Confira se o cabo USB-C está ligado e se o aparelho está perto do celular.' : 'O Bluetooth do celular está desligado. Ligue o Bluetooth e tente de novo.'}</p></div>`;
      foot = `<button class="btn pri" data-a="buscarDeNovo">Tentar novamente</button>`;
    }
    return `<div class="scr">${hdr()}<div class="body"><h1 class="h1" style="font-size:25px">Conectar o Concentra+</h1><p class="sub">${titles[U.st]}</p>${mid}</div>${foot ? `<div class="foot">${foot}</div>` : ''}</div>`;
  },
  after: () => {
    if (U.st === 'busca') { clearTimeout(U.t); U.t = setTimeout(() => { if (cur().id !== 'pareamento' || U.st !== 'busca') return; U.st = S.env.bt ? 'lista' : 'erro'; rerender(); }, 2600); }
    if (U.st === 'conectando') { requestAnimationFrame(() => { const b = $('#pbar'); if (b) b.style.width = '100%'; }); clearTimeout(U.t); U.t = setTimeout(() => {
      if (cur().id !== 'pareamento') return;
      if (U.dev === 'c3d4' || !S.env.bt) { U.st = 'erro'; } else { U.st = 'ok'; S.watch.paired = true; S.watch.name = 'Concentra+ A1B2'; syncPending(); }
      rerender(); }, 1800); }
  }
};
const sig = n => `<span style="display:inline-flex;gap:1.5px;align-items:flex-end;height:10px">${[3,5,7,10].map((h, i) => `<i style="width:2.5px;height:${h}px;border-radius:1px;background:${i < n ? 'var(--green)' : 'var(--track)'}"></i>`).join('')}</span>`;
A.pararBusca = () => { clearTimeout(U.t); back(); };
A.buscarDeNovo = () => { U.st = 'busca'; rerender(); };
A.conectarDev = v => { U.dev = v; U.devName = v === 'a1b2' ? 'Concentra+ A1B2' : 'Concentra+ C3D4'; U.st = 'conectando'; rerender(); };
A.pareouContinuar = () => {
  const p = cur().p;
  if (p.from === 'onboarding') { S.tutorialSeen = true; nav('inicio', { coach:true }, { reset:true }); }
  else back();
};

/* ================= 12 Timers ================= */
/* RESPONSÁVEL: Pessoa 1 · Cadastro, relógio e timers (histórias 01 a 06 do backlog) */
SCREENS.timers = { r: () => {
  const card = t => `<div class="card tcard ${S.selTimer === t.id ? 'sel' : ''}" data-a="selTimer" data-v="${t.id}" role="button"><div class="grow"><div class="nm">${esc(t.name)}</div><div class="ds">${t.focus} min de foco + ${t.rest} min de descanso</div></div><button data-a="catTimer" data-v="${t.id}" style="flex:none">${tagFor(t.cat)}</button>${t.def ? '' : `<button class="editbtn" data-a="editTimer" data-v="${t.id}" aria-label="Editar">${ic('edit', 17)}</button>`}</div>`;
  const mine = S.timers.filter(t => !t.def);
  let sh = '';
  if (U.sheet === 'cat') { const t = timerById(U.catT); sh = sheet(`<h3>Categoria do timer</h3><p class="small muted">${esc(t.name)}</p><div class="chips mt16">${S.cats.map(c => `<button class="chip ${t.cat === c.id ? 'on' : ''}" data-a="setTimerCat" data-v="${c.id}">${esc(c.name)}</button>`).join('')}</div><button class="btn link mt16" data-a="closeOverlay">Fechar</button>`); }
  return `<div class="scr"><div class="body" style="padding-top:14px"><h1 class="h1">Escolha seu timer</h1>
    <h3 class="sec">Padrão</h3>${S.timers.filter(t => t.def).map(card).join('')}
    <h3 class="sec">Meus timers</h3>${mine.map(card).join('') || '<p class="small muted" style="margin-bottom:12px">Você ainda não criou timers.</p>'}
    <button class="newt" data-a="novoTimer">${ic('plus', 18, '', 2.2)}Novo timer</button>
  </div><div class="foot"><button class="btn pri big" data-a="go" data-v="antes">${ic('play', 18)}Iniciar sessão</button></div>${tabbar('timers')}${sh}</div>`;
} };
A.selTimer = (v, el, e) => { if (e.target.closest('[data-a="catTimer"],[data-a="editTimer"]') && e.target.closest('[data-a]') !== el) return; S.selTimer = v; rerender(); };
A.catTimer = v => { U.catT = v; U.sheet = 'cat'; rerender(); };
A.setTimerCat = v => { timerById(U.catT).cat = v; U.sheet = null; rerender(); toast(`Categoria alterada para ${catName(v)}`); };
A.editTimer = v => nav('timernovo', { id:v });
A.novoTimer = () => nav('timernovo', {});

/* ================= 13 Novo / editar timer ================= */
/* RESPONSÁVEL: Pessoa 1 · Cadastro, relógio e timers (histórias 01 a 06 do backlog) */
SCREENS.timernovo = { r: p => {
  const ed = p.id && timerById(p.id);
  if (!U.init) { U.init = 1; U.name = ed ? ed.name : (p.preset?.name || ''); U.focus = ed ? ed.focus : (p.preset?.focus || 30); U.rest = ed ? ed.rest : (p.preset?.rest ?? 5); U.cat = ed ? ed.cat : (p.preset?.cat || 'leitura'); }
  let sh = '';
  if (U.sheet === 'novacat') { U.ncColor ??= 'teal'; U.ncName ??= '';
    sh = sheet(`<h3>Nova categoria</h3><label class="lbl">Nome</label><input class="inp ${U.eNc ? 'err' : ''}" data-in="ncName" data-err="eNc" value="${esc(U.ncName)}" placeholder="Ex.: Idiomas" maxlength="20">${U.eNc ? `<div class="errt">${ic('alertc', 15)}${U.eNc}</div>` : ''}<label class="lbl">Cor</label><div class="colors">${['teal','orange','green','red','purple'].map(c => `<button class="${U.ncColor === c ? 'on' : ''}" style="background:${COLORS[c]}" data-a="setU" data-v="ncColor:${c}" aria-label="${c}"></button>`).join('')}</div><button class="btn pri mt24" data-a="addCat">Adicionar</button><button class="btn link muted" data-a="closeOverlay">Cancelar</button>`); }
  if (U.modal === 'del') sh = modal(`<div class="iconhero o" style="width:52px;height:52px;margin:0">${ic('trash', 24)}</div><h3>Excluir timer?</h3><p>O timer “${esc(ed.name)}” será removido. As sessões já feitas continuam no histórico.</p><button class="btn redb" data-a="delTimer">Excluir timer</button><button class="btn link muted" data-a="closeOverlay">Voltar</button>`);
  const stepc = (label, key, val, min, max) => `<div class="card stepcard"><div><small>${label}</small><div class="v">${val} min</div></div><div class="step"><button class="sbtn" data-a="stepT" data-v="${key}:-">${ic('minus', 18, '', 2.2)}</button><button class="sbtn p" data-a="stepT" data-v="${key}:+">${ic('plus', 18, '', 2.2)}</button></div></div>`;
  return `<div class="scr">${hdr('', ed ? `<button class="iconbtn" style="margin-right:-8px;color:var(--red)" data-a="askDelTimer">${ic('trash', 21)}</button>` : '')}<div class="body">
    <h1 class="h1">${ed ? 'Editar timer' : 'Novo timer'}</h1>
    <div class="fwrap"><label class="lbl">Nome do timer</label><input class="inp ${U.eName ? 'err' : ''}" data-in="name" data-err="eName" value="${esc(U.name)}" placeholder="Ex.: Leitura noturna" maxlength="30">${U.eName ? `<div class="errt">${ic('alertc', 15)}${U.eName}</div>` : ''}</div>
    ${stepc('Tempo de foco', 'focus', U.focus)}${stepc('Tempo de descanso', 'rest', U.rest)}
    <label class="lbl" style="margin-top:22px">Categoria</label>
    <div class="chips">${S.cats.map(c => `<button class="chip ${U.cat === c.id ? 'on' : ''}" data-a="setU" data-v="cat:${c.id}">${esc(c.name)}</button>`).join('')}<button class="chip dash" data-a="openNovaCat">${ic('plus', 15, '', 2.2)} Adicionar categoria</button></div>
  </div><div class="foot"><button class="btn pri" data-a="salvarTimer">Salvar timer</button><button class="btn link muted" data-a="back">Cancelar</button></div>${sh}</div>`;
} };
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

/* ================= 30 Relatórios (parte do Histórico) ================= */
/* RESPONSÁVEL: Pessoa 1 · Cadastro, relógio e timers (histórias 01 a 06 do backlog) */
function reportData(){
  U.per ??= 'semana'; U.rc ??= 'todas';
  let a, b;
  if (U.per === 'semana') { b = TODAY; a = addDays(TODAY, -6); }
  else if (U.per === 'mes') { a = new Date(2026, TODAY.getMonth(), 1); b = TODAY; }
  else { a = U.da ? parseK(U.da) : new Date(2026, 9, 1); b = U.db ? parseK(U.db) : TODAY; if (a > b) [a, b] = [b, a]; }
  const ak = dkey(a), bk = dkey(b);
  const ss = S.history.filter(s => s.d >= ak && s.d <= bk && (U.rc === 'todas' || s.cat === U.rc));
  const total = ss.reduce((x, s) => x + s.min, 0);
  const ndays = Math.round((b - a) / 864e5) + 1;
  const bars = [];
  if (ndays <= 14) for (let d = new Date(a); d <= b; d = addDays(d, 1)) { const k = dkey(d); bars.push({ l: ndays <= 7 ? DOW3[d.getDay()] : String(d.getDate()), full:`${DOW3[d.getDay()]}, ${d.getDate()}/${d.getMonth()+1}`, v: ss.filter(s => s.d === k).reduce((x, s) => x + s.min, 0) }); }
  else { let d = new Date(a), i = 1; while (d <= b) { const e = addDays(d, 6) > b ? b : addDays(d, 6), dk = dkey(d), ek = dkey(e); bars.push({ l:`S${i}`, full:`${d.getDate()}/${d.getMonth()+1} a ${e.getDate()}/${e.getMonth()+1}`, v: ss.filter(s => s.d >= dk && s.d <= ek).reduce((x, s) => x + s.min, 0) }); d = addDays(e, 1); i++; } }
  const byCat = S.cats.map(c => ({ c, v: ss.filter(s => s.cat === c.id).reduce((x, s) => x + s.min, 0) })).filter(x => x.v > 0);
  return { a, b, ss, total, ndays, bars, byCat };
}
function donut(byCat, total){
  const r = 34, C = 2 * Math.PI * r; let off = 0;
  return `<svg width="104" height="104" viewBox="0 0 100 100" style="transform:rotate(-90deg);flex:none"><circle cx="50" cy="50" r="${r}" fill="none" stroke="var(--track)" stroke-width="16"/>${byCat.map(x => { const len = C * x.v / total; const s = `<circle cx="50" cy="50" r="${r}" fill="none" stroke="${COLORS[x.c.color]}" stroke-width="16" stroke-dasharray="${len} ${C - len}" stroke-dashoffset="${-off}"/>`; off += len; return s; }).join('')}</svg>`;
}
function repView(){
  const R = reportData(), max = Math.max(...R.bars.map(x => x.v), 1), hiV = Math.max(...R.bars.map(x => x.v));
  const cats = [['todas','Todas'], ...S.cats.map(c => [c.id, c.name])];
  return `<div class="chips mt16">${[['semana','Semana'],['mes','Mês'],['custom','Personalizado']].map(([k, l]) => `<button class="chip ${U.per === k ? 'on' : ''}" data-a="setU" data-v="per:${k}">${l}</button>`).join('')}</div>
  <div class="chips mt8">${cats.map(([k, l]) => `<button class="chip ${U.rc === k ? 'on' : ''}" data-a="setU" data-v="rc:${k}">${esc(l)}</button>`).join('')}</div>
  ${U.per === 'custom' ? `<div class="row mt12"><input class="inp" type="date" style="height:44px;font-size:14px" data-in="da" data-oc="rr" min="2026-09-01" max="${TODAYK}" value="${U.da || '2026-10-01'}"><span class="muted">a</span><input class="inp" type="date" style="height:44px;font-size:14px" data-in="db" data-oc="rr" min="2026-09-01" max="${TODAYK}" value="${U.db || TODAYK}"></div>` : ''}
  <p class="small muted mt12">${rangeLabel(R.a, R.b)}</p>
  ${R.ss.length ? `<div class="stats mt12"><div class="card stat"><small>Total de foco</small><b>${fmtDur(R.total)}</b></div><div class="card stat"><small>Sessões</small><b>${R.ss.length}</b></div><div class="card stat"><small>Média diária</small><b>${fmtDur(R.total / R.ndays)}</b></div></div>
    <div class="card pad mt12"><b style="font-size:14.5px">${R.ndays <= 7 ? 'Foco por dia da semana' : R.ndays <= 14 ? 'Foco por dia' : 'Foco por semana'}</b><div class="bars">${R.bars.map((x, i) => `<div class="bc" data-a="barTap" data-v="${i}"><div class="bv ${x.v === hiV && x.v > 0 ? 'hi' : ''}" style="height:${Math.max(3, x.v / max * 100)}%"><span class="tt">${x.full}: ${fmtDur(x.v)}</span></div><span class="bl">${x.l}</span></div>`).join('')}</div></div>
    <div class="card pad mt12 donut-row">${donut(R.byCat, R.total)}<div class="dleg">${R.byCat.map(x => `<div><i style="background:${COLORS[x.c.color]}"></i>${esc(x.c.name)}<b>${Math.round(x.v / R.total * 100)}%</b></div>`).join('')}</div></div>
    <button class="btn pri mt12" data-a="baixarPdf">${ic('download', 19, '', 2)}Baixar relatório em PDF</button>`
    : `<div class="empty mt12" style="padding:34px 18px">${ic('chart', 30)}<b>Sem sessões neste período</b><span class="small">Tente outro período ou outra categoria.</span></div>`}`;
}
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

/* 42 sem conexão */
/* ----- 42 Sem conexão ----- */
/* RESPONSÁVEL: Pessoa 1 · Cadastro, relógio e timers (histórias 01 a 06 do backlog) */
SCREENS.semnet = { r: () => `<div class="scr">${hdr('Histórico')}<div class="body">
  <div class="alert o">${ic('wifioff', 19)}<span>Sem conexão com a internet. Mostrando os dados salvos neste celular.</span></div>
  <div class="hero" style="padding-top:90px"><div class="iconhero t">${ic('wifioff', 40)}</div><h2>Não foi possível atualizar</h2><p>Conecte-se ao Wi-Fi ou aos dados móveis para ver os relatórios mais recentes. Suas sessões no Concentra+ continuam sendo registradas e serão sincronizadas depois.</p></div>
  </div><div class="foot"><button class="btn pri" data-a="tentarNet">Tentar novamente</button><button class="btn link" data-a="verCalendario">Ver calendário salvo</button></div></div>` };
A.tentarNet = () => { if (!S.env.net) { toast('Ainda sem internet', 'wifioff'); return; } nav('historico', { v:'rel' }, { reset:true }); toast('Relatórios atualizados', 'check'); };
A.verCalendario = () => nav('historico', { v:'cal' }, { reset:true });

/* ----- 35 Editar perfil ----- */
/* RESPONSÁVEL: Pessoa 1 · Cadastro, relógio e timers (histórias 01 a 06 do backlog) */
SCREENS.editarperfil = { r: () => { U.name ??= S.user.name; U.photo ??= S.user.photo;
  return `<div class="scr">${hdr('Editar perfil')}<div class="body"><div class="center mt16"><label style="display:inline-block;position:relative;cursor:pointer"><span class="avatar xl" style="${U.photo ? `background-image:url(${U.photo})` : ''}">${U.photo ? '' : initials(U.name || '?')}</span><span style="position:absolute;right:-2px;bottom:4px;width:36px;height:36px;border-radius:50%;background:var(--pri);color:var(--pri-ink);display:flex;align-items:center;justify-content:center;border:3px solid var(--bg)">${ic('camera', 17)}</span><input type="file" accept="image/*" hidden data-oc="pickPhoto"></label>
    <div class="mt12"><label class="tlink" style="cursor:pointer">Alterar imagem de perfil<input type="file" accept="image/*" hidden data-oc="pickPhoto"></label>${U.photo ? ` · <a class="tlink" style="color:var(--red)" data-a="rmPhoto">Remover</a>` : ''}</div></div>
    <div class="fwrap"><label class="lbl">Nome de usuário</label><input class="inp ${U.eN ? 'err' : ''}" data-in="name" data-err="eN" value="${esc(U.name)}" maxlength="40">${U.eN ? `<div class="errt">${ic('alertc', 15)}${U.eN}</div>` : ''}</div>
    <label class="lbl">E-mail</label><input class="inp" value="${esc(S.user.email)}" disabled><p class="help">O e-mail não pode ser alterado por aqui.</p>
  </div><div class="foot"><button class="btn pri" data-a="salvarPerfil">Salvar alterações</button></div></div>`; } };
A.pickPhoto = (v, el) => { const f = el.files && el.files[0]; if (!f) return; if (!f.type.startsWith('image/')) return toast('Escolha um arquivo de imagem', 'x');
  const img = new Image(), url = URL.createObjectURL(f);
  img.onload = () => { const c = document.createElement('canvas'), s = 200, m = Math.min(img.width, img.height); c.width = c.height = s; c.getContext('2d').drawImage(img, (img.width - m) / 2, (img.height - m) / 2, m, m, 0, 0, s, s); U.photo = c.toDataURL('image/jpeg', .85); URL.revokeObjectURL(url); rerender(); };
  img.src = url; };
A.rmPhoto = () => { U.photo = null; rerender(); };
A.salvarPerfil = () => { if ((U.name || '').trim().length < 2) { U.eN = 'Digite um nome com pelo menos 2 letras'; return rerender(); } S.user.name = U.name.trim(); S.user.photo = U.photo; back(); toast('Perfil atualizado'); };

/* 36 aparência */
