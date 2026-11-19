/* ================= telas do aplicativo ================= */

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

SCREENS.termos = { r: () => { U.t ??= 'termos';
  const T = [['1. Uso do aplicativo','O Concentra+ ajuda você a organizar sessões de foco junto com o relógio de mesa. Use o app de forma pessoal e não compartilhe sua conta.'],['2. Sua conta','Você é responsável pelas informações do cadastro e por manter sua senha em segurança.'],['3. Assinatura','Alguns recursos exigem assinatura. Você pode cancelar quando quiser, em Perfil > Minha assinatura.'],['4. Encerramento','Você pode excluir sua conta e seus dados a qualquer momento, em Perfil > Excluir conta e dados.']];
  const P = [['1. Dados que coletamos','Nome, e-mail, sessões de foco, metas e o estado do relógio conectado, como bateria e versão.'],['2. Para que usamos','Mostrar seu histórico e relatórios, enviar lembretes e melhorar o Concentra+.'],['3. Compartilhamento','Não vendemos seus dados. A agenda só é lida se você ativar a integração.'],['4. Seus direitos','Você pode corrigir, baixar ou apagar seus dados quando quiser, conforme a LGPD.']];
  return `<div class="scr">${hdr('Termos e privacidade')}
  <div class="body doc"><div class="chips mt8"><button class="chip ${U.t === 'termos' ? 'on' : ''}" data-a="setU" data-v="t:termos">Termos de uso</button><button class="chip ${U.t === 'priv' ? 'on' : ''}" data-a="setU" data-v="t:priv">Política de privacidade</button></div>
  <p class="xs muted mt16">Atualizado em 1 de novembro de 2026</p>
  ${(U.t === 'termos' ? T : P).map(([h, p]) => `<h3>${h}</h3><p>${p}</p>`).join('')}</div>
  <div class="foot"><button class="btn pri" data-a="back">Entendi</button></div></div>`; } };

SCREENS.tutorial = { r: () => { U.i ??= 0; const s = TUT[U.i];
  return `<div class="scr"><div class="hdr"><div class="sp"></div><button class="skip" data-a="tutPular">Pular</button></div>
  <div class="body" style="display:flex;flex-direction:column">${s.il()}<h2 class="tut-title">${s.t}</h2><p class="tut-text">${s.d}</p><div style="flex:1"></div><div class="dots">${TUT.map((_, i) => `<i class="${i === U.i ? 'on' : ''}"></i>`).join('')}</div></div>
  <div class="foot"><button class="btn pri" data-a="tutNext">${U.i === 2 ? 'Conectar meu relógio' : 'Próximo'}</button></div></div>`; } };

SCREENS.conexao = { r: () => { U.i ??= 0; const s = CONN[U.i];
  return `<div class="scr"><div class="hdr" style="padding-left:20px"><span class="small muted b">Passo ${U.i + 1} de 3</span><div class="sp"></div><button class="skip" data-a="tutPular">Pular</button></div>
  <div class="body" style="display:flex;flex-direction:column">${s.il()}<h2 class="tut-title">${s.t}</h2><p class="tut-text">${s.d}</p><div style="flex:1"></div><div class="dots">${CONN.map((_, i) => `<i class="${i === U.i ? 'on' : ''}"></i>`).join('')}</div></div>
  <div class="foot"><button class="btn pri" data-a="connNext">${U.i === 2 ? 'Buscar relógio' : 'Próximo'}</button></div></div>`; } };

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

SCREENS.relogio = { r: () => {
  const w = S.watch, c = connected(), low = w.battery < 20;
  const face = `<div style="width:160px;margin:6px auto 0;border-radius:20px;padding:12px;background:${c ? 'linear-gradient(160deg,#3a3f44,#16191c)' : '#9aa0a6'};box-shadow:0 10px 24px rgba(0,0,0,.18)"><div style="display:flex;justify-content:center;gap:7px;margin:-4px 0 8px">${'<i style="display:block;width:16px;height:4px;border-radius:2px;background:rgba(255,255,255,.25)"></i>'.repeat(5)}</div><div class="${c ? 'led' : ''}" style="background:${c ? '#050607' : '#b5bac0'};border-radius:10px;height:62px;display:flex;align-items:center;justify-content:center;font-size:32px;${c ? '' : 'color:#eceff1;font-weight:600'}" id="relface">${watchClock()}</div></div>`;
  const status = !w.paired ? `<span class="tag gray" style="height:30px;padding:0 13px;font-size:13px;gap:7px"><span class="dot"></span>Nenhum relógio pareado</span>` : c ? `<span class="tag green" style="height:30px;padding:0 13px;font-size:13px;gap:7px"><span class="dot g"></span>Conectado</span>` : `<span class="tag gray" style="height:30px;padding:0 13px;font-size:13px;gap:7px"><span class="dot"></span>Relógio desconectado</span>`;
  const bat = c ? `<div class="card pad mt12" style="${low ? 'border:1.5px solid var(--red);' : ''}"><div class="between"><span class="muted" style="font-size:14.5px">Bateria</span><b style="${low ? 'color:var(--red)' : ''}">${w.battery}%${low ? ' · baixa' : ''}</b></div><div class="bar ${low ? 'r' : 'g'} mt12"><i style="width:${w.battery}%"></i></div>${low ? `<p class="small mt12" style="color:var(--red)">Bateria baixa. Ligue o cabo USB-C para carregar.</p>` : ''}</div>` : '';
  return `<div class="scr">${hdr('Meu relógio')}<div class="body">
    <div class="card pad center" style="padding:22px 16px 18px">${face}<div class="mt16">${status}</div>${w.paired ? `<p class="xs muted mt8">${esc(w.name)}</p>` : ''}</div>
    ${bat}
    <div class="list mt12"><div class="kv"><span>Modelo</span><span>Concentra+ de mesa</span></div><div class="kv"><span>Versão do software</span><span>v1.2.3</span></div><div class="kv"><span>Alimentação</span><span>USB-C (5 V) e bateria</span></div><div class="kv"><span>Conexão</span><span>Bluetooth 5.0</span></div><div class="kv"><span>Dimensões</span><span>15 × 10 × 8,5 cm · 170 g</span></div></div>
    ${w.pending.length ? `<div class="alert o mt12">${ic('cloud', 20)}<div><b>${w.pending.length} ${w.pending.length > 1 ? 'sessões aguardando' : 'sessão aguardando'} sincronização</b>Elas aparecem no histórico assim que o relógio reconectar.</div></div>` : ''}
  </div><div class="foot">${c ? `<button class="btn pri" data-a="go" data-v="configrelogio">Configurações do relógio</button><button class="btn link red" data-a="desconectar">Desconectar</button>` : w.paired ? `<button class="btn pri" data-a="reconectar">Conectar relógio</button><button class="btn link red" data-a="esquecer">Esquecer este relógio</button>` : `<button class="btn pri" data-a="parear">Conectar relógio</button>`}</div></div>`;
} };

SCREENS.configrelogio = { r: () => { const w = S.watch;
  return `<div class="scr">${hdr('Configurações do relógio')}<div class="body">
    <div class="card pad"><div class="between"><b>Volume dos alertas</b><b style="color:var(--pri)" id="volv">${w.silent ? 'Silencioso' : w.volume + '%'}</b></div>
      <input type="range" min="0" max="100" step="10" value="${w.volume}" data-oi="setVol" style="width:100%;margin-top:14px;accent-color:var(--pri)" ${w.silent ? 'disabled' : ''}>
      <div class="between mt8"><p class="xs muted" style="max-width:220px">O nível também aparece no display do relógio enquanto você ajusta.</p><button class="ebtn" data-a="testeAlerta" style="flex:none">${ic('vol', 15)}</button></div></div>
    <div class="card pad mt12 between"><div><b>Modo silencioso</b><p class="small muted mt8" style="margin-top:3px">Apenas aviso visual no display e vibração, sem som.</p></div>${tg(w.silent, 'toggleSilent')}</div>
    <div class="card pad mt12"><div class="between"><b>Formato da hora</b><span class="mini-clock" style="font-size:15px;padding:6px 10px" id="cfgclock">${watchClock()}</span></div>
      <div class="seg mt12"><button class="${!w.h24 ? 'on' : ''}" data-a="setH24" data-v="0">12 horas</button><button class="${w.h24 ? 'on' : ''}" data-a="setH24" data-v="1">24 horas</button></div></div>
    <div class="card pad mt12"><b>Botões do relógio</b>
      <div style="display:flex;justify-content:space-between;margin:14px 4px 0">${[['music','Música'],['minus','Volume –'],['playpause','Timer'],['plus','Volume +'],['updown','Telas']].map(([i, l], k) => `<div style="display:flex;flex-direction:column;align-items:center;gap:6px;font-size:11px;color:var(--muted)"><span style="width:34px;height:34px;border-radius:50%;background:${k === 2 ? 'var(--pri)' : '#25292d'};color:#fff;display:flex;align-items:center;justify-content:center">${ic(i, 16, '', 2)}</span>${l}</div>`).join('')}</div>
      <p class="small muted mt12">O botão do centro inicia, pausa e retoma o timer sem tocar no celular. O botão Telas alterna entre hora, timer, meta e bateria.</p></div>
    <p class="center xs muted mt16">As alterações são aplicadas no relógio automaticamente.</p>
  </div></div>`; } };

function statusChip(){
  const w = S.watch;
  if (S.sess && !S.sess.known) return '';
  if (!w.paired || !connected()) return `<button class="stchip" data-a="go" data-v="relogio"><span class="dot"></span>Relógio desconectado</button>`;
  const low = w.battery < 20;
  return `<button class="stchip" data-a="go" data-v="relogio"><span class="dot g"></span>${low ? 'Relógio conectado, bateria baixa' : 'Relógio conectado'}<span class="bat ${low ? 'low' : ''}">${batIcon(w.battery, low)} ${w.battery} %</span></button>`;
}

SCREENS.inicio = {
  r: p => {
    const ts = todaySessions(), pct = goalPct(), st = streak(), w = S.watch;
    const first = (S.user.name || '').split(/[\s.]/)[0];
    const name = first ? first[0].toUpperCase() + first.slice(1) : '';
    let banner = '';
    if (S.sess && S.sess.known) banner = `<button class="alert t mt16" style="width:100%;text-align:left" data-a="go" data-v="sessao">${ic('timer', 22)}<div class="grow"><b>Sessão em andamento</b><span id="homeSess">${fmtSec(S.sess.remaining)} · ${S.sess.phase === 'foco' ? 'Foco' : 'Descanso'} · ${esc(catName(S.sess.cat))}</span></div>${ic('right', 18)}</button>`;
    else if (!w.paired || !connected()) banner = `<div class="alert o mt16"><div class="grow"><b>Conecte seu relógio</b>Sem ele, você não sincroniza as sessões.</div><button class="pill-btn" data-a="${w.paired ? 'reconectar' : 'parear'}">Conectar</button></div>`;
    else if (w.battery < 20) banner = `<div class="alert r mt16"><span style="color:var(--red)">${batIcon(w.battery, true)}</span><div><b>Bateria do relógio baixa (${w.battery}%)</b>Ligue o cabo USB-C para carregar.</div></div>`;
    const coach = p.coach && !U.coachDone;
    return `<div class="scr"><div class="body" style="padding-top:12px">
      <div class="between" style="align-items:flex-start"><div class="greet"><small>${greeting()}</small><h1>Olá, ${esc(name)}</h1></div>${statusChip()}</div>
      ${banner}
      <div class="grid2 mt16">
        <button class="card pad" style="text-align:left" data-a="go" data-v="meta"><span class="small muted">Meta de hoje</span><div style="font-size:30px;font-weight:700;margin:6px 0 10px;letter-spacing:-.02em" id="homePct">${pct}%</div><div class="bar"><i style="width:${pct}%"></i></div><p class="small muted mt12" id="homeGoal">${fmtDur(todayTotal())} de ${fmtGoal(S.goal)}</p></button>
        <button class="card pad center" style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px" data-a="go" data-v="ofensiva"><span style="color:${st ? 'var(--orange)' : 'var(--track)'}">${ic('flame', 30)}</span><b style="font-size:28px;margin-top:4px">${st}</b><span class="small muted">${st === 1 ? 'dia seguido' : 'dias seguidos'}</span></button>
      </div>
      <div class="${coach ? 'spot' : ''}"><button class="btn pri big mt16" data-a="${coach ? 'noop' : 'tab'}" data-v="timers">${ic('play', 18)}Iniciar sessão</button></div>
      ${coach ? `<div class="coach" style="top:${banner ? 330 : 238}px"><b style="font-size:18px">Pronto para começar?</b><p class="small muted mt8" style="line-height:1.5">Escolha um timer e toque em iniciar. O relógio e o aplicativo ficam sincronizados.</p><button class="btn pri mt16" style="height:46px;font-size:15px" data-a="coachOk">Começar a usar</button></div><div class="scrim" style="z-index:40"></div>` : ''}
      <h3 class="sec strong">Sessões de hoje</h3>
      ${ts.length ? ts.slice().reverse().map(s => `<div class="card sess"><span class="sicon" style="${catStyle(s.cat)}">${ic(CAT_ICON[s.cat] || 'tagi', 20)}</span><div class="grow"><b style="font-size:15.5px">${esc(catName(s.cat))}</b><div class="small muted">${s.t}${s.src === 'relogio' ? ' · pelo relógio' : ''}</div></div><b>${fmtDur(s.min)}</b></div>`).join('')
        : `<div class="empty">${ic('clock', 30)}<b>Você ainda não tem sessões hoje</b><span class="small">Toque em Iniciar sessão para começar.</span></div>`}
      ${S.sound.playing && !S.sess ? `<div class="mt8">${miniPlayer()}</div>` : ''}
    </div>${tabbar('inicio')}</div>`;
  }
};

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

SCREENS.antes = { r: () => {
  const t = timerById(S.selTimer) || S.timers[0], o = S.opts, tr = trackById(S.sound.track);
  const permWarn = o.block && !permsOk();
  let sh = '';
  if (U.modal === 'restrito') sh = modal(`<div class="iconhero o" style="width:48px;height:48px;margin:0">${ic('lock', 22)}</div><h3>Tem certeza?</h3><p>Não será possível cancelar nem pausar a sessão, nem pelo aplicativo nem pelos botões do Concentra+.</p><button class="btn pri" data-a="iniciarSessao" data-v="ok">Iniciar modo restrito</button><button class="btn link muted" data-a="closeOverlay">Voltar</button>`);
  return `<div class="scr">${hdr()}<div class="body"><h1 class="h1">Antes de começar</h1>
    <div class="card" style="background:var(--pri-soft);border-color:transparent;padding:16px;display:flex;gap:14px;align-items:center;margin-top:12px">${ring(.75, 'var(--pri)', 50, 5)}<div class="grow"><b style="font-size:17px">${esc(t.name)}</b><div class="small muted" style="margin-top:2px">${esc(catName(t.cat))} · ${t.focus} min de foco + ${t.rest} min de descanso</div></div><button class="tlink small" data-a="back">Trocar</button></div>
    <div class="card mt12"><div class="between pad" style="padding-bottom:${o.block ? 8 : 16}px"><div><b>Bloquear aplicativos</b><div class="small muted" style="margin-top:2px">Durante a sessão, sem notificações</div></div>${tg(o.block, 'opt', 'block')}</div>
      ${o.block ? `<button class="between" style="width:100%;padding:6px 16px 15px;color:var(--pri);font-weight:600;font-size:14.5px" data-a="go" data-v="bloqueio"><span>${blockedCount()} apps selecionados</span>${ic('right', 18)}</button>` : ''}
      ${permWarn ? `<button class="alert o" style="margin:0 12px 12px;width:calc(100% - 24px);text-align:left;padding:11px 12px" data-a="go" data-v="permissoes">${ic('tri', 18)}<div class="grow small"><b style="font-size:14px">${permsCount()} de 4 permissões ativas</b>Sem elas, o bloqueio pode não funcionar.</div>${ic('right', 16)}</button>` : ''}</div>
    <div class="card mt12"><div class="between pad" style="padding-bottom:${o.music ? 8 : 16}px"><div><b>Música ou som ambiente</b><div class="small muted" style="margin-top:2px">Toca no aplicativo durante o foco</div></div>${tg(o.music, 'opt', 'music')}</div>
      ${o.music ? `<button class="mini" style="padding:4px 16px 14px" data-a="go" data-v="sons"><span class="sicon" style="background:${tr.c};color:#fff">${ic('music', 18)}</span><div class="grow"><b style="font-size:14.5px">${esc(tr.name)}</b><div class="xs muted">${tr.sub}</div></div><span class="tlink small">Trocar</span></button>` : ''}</div>
    <div class="card mt12 between pad"><div style="max-width:250px"><b>Modo Restrito</b><div class="small muted" style="margin-top:2px">A sessão não poderá ser pausada nem cancelada</div></div>${tg(o.restrict, 'opt', 'restrict')}</div>
    ${S.agenda.provider && S.agenda.busy ? `<p class="xs muted mt12 row">${ic('calcheck', 15)}Um evento “Ocupado” será criado no ${S.agenda.provider} Agenda.</p>` : ''}
    ${!connected() ? `<p class="xs muted mt12 row">${ic('bt', 15)}Relógio desconectado: a sessão roda só no celular.</p>` : ''}
  </div><div class="foot"><button class="btn pri big" data-a="iniciarSessao">${ic('play', 18)}Iniciar</button></div>${sh}</div>`;
} };

SCREENS.sessao = { r: () => {
  const s = S.sess;
  if (!s) return `<div class="scr"><div class="body center"><div class="hero"><h2>Nenhuma sessão em andamento</h2><button class="btn pri mt16" data-a="tab" data-v="timers">Escolher timer</button></div></div></div>`;
  const ph = s.phase === 'foco', paused = s.paused, c = connected();
  const col = paused ? 'var(--orange)' : ph ? 'var(--pri)' : 'var(--green)';
  const banner = !c && S.watch.paired ? `<div class="alert o" style="margin-top:14px">Sessão feita no Concentra+. Os dados serão sincronizados ao reconectar.</div>` : paused && s.pausedBy === 'watch' ? `<div class="alert o" style="margin-top:14px">Pausada pelo botão do Concentra+</div>` : '';
  const btns = s.restrict ? `<div class="center"><span class="tag orange" style="height:36px;padding:0 16px;font-size:14px;gap:8px">${ic('lock', 16)}Modo Restrito ativo</span></div>`
    : `<div class="row" style="gap:12px"><button class="btn out" style="flex:.8" data-a="encerrar">Encerrar</button><button class="btn pri" style="flex:1.2" data-a="${ph ? (paused ? 'retomar' : 'pausar') : 'pularDescanso'}" id="sessMain">${ph ? (paused ? 'Retomar' : 'Pausar') : 'Pular descanso'}</button></div>`;
  return `<div class="scr"><div class="hdr" style="padding:10px 20px 0"><span class="tag ${ph ? '' : 'green'}" style="height:30px;font-size:13px;padding:0 12px">${ph ? 'Foco' : 'Descanso'} · ${esc(catName(s.cat))}</span><div class="sp"></div><span class="sync"><span class="dot ${c ? 'g' : ''}"></span>${c ? 'Sincronizado' : S.watch.paired ? 'Sem conexão' : 'Só no celular'}</span></div>
    <div class="body" style="display:flex;flex-direction:column">${banner}
      <div style="flex:1;display:flex;flex-direction:column;justify-content:center;padding:20px 0">
        <div class="ring-wrap" id="sessRing">${ring(s.remaining / s.total, col, 250, 13)}<div class="ring-c"><div class="t" id="sessTime">${fmtSec(s.remaining)}</div><div class="s" id="sessState">${paused ? 'Pausada' : ph ? 'Em foco' : 'Descanso'}</div></div></div>
        <p class="center small muted mt24" id="sessSub">${esc(s.name)} · ${ph ? `descanso de ${s.rest} min a seguir` : 'depois, a sessão termina'}</p>
        ${s.block ? `<p class="center xs muted mt8 row" style="justify-content:center">${ic('lock', 13)}${blockedCount()} apps bloqueados · notificações silenciadas</p>` : ''}
      </div>
      ${btns}
      <div class="mt12">${S.opts.music || S.sound.playing ? miniPlayer() : ''}</div>
    </div></div>`;
} };

function miniPlayer(){ const t = trackById(S.sound.track); return `<div class="card mini" data-a="go" data-v="${S.sound.playing || S.sess ? 'player' : 'sons'}" role="button"><span class="sicon" style="background:${t.c};color:#fff">${ic('music', 18)}</span><div class="grow"><b style="font-size:15px">${esc(t.name)}<span class="eq ${S.sound.playing ? '' : 'stop'}"><i></i><i></i><i></i></span></b><div class="xs muted">${t.sub}</div></div><button class="pp" data-a="togglePlay">${ic(S.sound.playing ? 'pause' : 'play', 20)}</button></div>`; }

SCREENS.concluida = { r: () => {
  const d = S.lastDone || { min:0, cat:'estudo' }, hit = d.hitGoal, pct = goalPct();
  const conf = Array.from({ length:18 }, (_, i) => `<i style="left:${(i * 53) % 100}%;top:${(i * 37) % 40}px;background:${['var(--orange)','var(--pri)','var(--green)'][i % 3]};animation-delay:${(i % 6) * .12}s;border-radius:${i % 2 ? '50%' : '2px'}"></i>`).join('');
  return `<div class="scr"><div class="confetti">${conf}</div><div class="body"><div class="hero" style="padding-top:44px">
    ${hit ? `<div class="iconhero o" style="width:88px;height:88px">${ic('flame', 40)}</div><h2 style="font-size:26px">Meta diária atingida!</h2><p>Parabéns! Você bateu sua meta de hoje. Sua ofensiva chegou a ${streak()} ${streak() === 1 ? 'dia' : 'dias'}.</p>`
      : `<div class="iconhero g">${ic('check', 42, '', 3)}</div><h2 style="font-size:26px">${d.early ? 'Sessão encerrada' : 'Sessão concluída!'}</h2><p>${d.early ? 'Tudo bem parar antes. O tempo que você focou foi registrado no histórico.' : 'Bom trabalho. Seu foco foi registrado no histórico.'}</p>`}</div>
    <div class="card pad mt24"><div style="display:flex"><div class="grow center"><small class="muted small">Duração</small><div style="font-size:22px;font-weight:700;margin-top:2px">${fmtDur(d.min)}</div></div><div style="width:1px;background:var(--line)"></div><div class="grow center"><small class="muted small">Categoria</small><div style="font-size:22px;font-weight:700;margin-top:2px">${esc(catName(d.cat))}</div></div></div>
      <div class="between mt16 small"><b>Meta de hoje</b><span class="muted">${fmtDur(todayTotal())} de ${fmtGoal(S.goal)}</span></div><div class="bar mt8"><i style="width:${pct}%"></i></div></div>
    ${d.unlock ? `<div class="alert t mt12" style="align-items:center"><span class="avatar" style="width:40px;height:40px;background:var(--orange);color:#fff;font-size:16px">${d.unlock}</span><div><b>Conquista desbloqueada!</b>${d.unlock} dias seguidos batendo a meta</div></div>` : ''}
    ${S.agenda.provider && S.agenda.busy ? `<p class="xs muted mt16 row">${ic('calcheck', 15)}O evento “Ocupado” na sua agenda foi encerrado.</p>` : ''}
  </div><div class="foot"><button class="btn pri" data-a="tab" data-v="timers">Nova sessão</button><button class="btn link" data-a="tab" data-v="inicio">Voltar ao início</button></div></div>`;
} };

SCREENS.sons = { r: () => { const tab = S.sound.tab;
  return `<div class="scr">${hdr()}<div class="body"><h1 class="h1">Sons para foco</h1>
    <div class="seg soft mt12"><button class="${tab === 'musicas' ? 'on' : ''}" data-a="soundTab" data-v="musicas">Músicas</button><button class="${tab === 'ambiente' ? 'on' : ''}" data-a="soundTab" data-v="ambiente">Sons ambiente</button></div>
    <div class="mt16">${TRACKS[tab].map(t => `<button class="card track ${S.sound.track === t.id ? 'sel' : ''}" data-a="pickTrack" data-v="${t.id}"><span class="art" style="background:${t.c}">${ic('music', 22)}</span><div class="grow"><b style="font-size:15.5px">${t.name}${S.sound.track === t.id && S.sound.playing ? '<span class="eq"><i></i><i></i><i></i></span>' : ''}</b><div class="small muted">${t.sub}</div></div><span class="small muted">${tab === 'musicas' ? fmtSec(t.dur).replace(/^0/, '') : 'Loop'}</span></button>`).join('')}</div>
  </div>${S.sound.playing || S.sound.pos > 0 ? `<div class="card dock" data-a="go" data-v="player" role="button"><span class="sicon" style="background:${trackById(S.sound.track).c};color:#fff">${ic('music', 18)}</span><div class="grow"><b style="font-size:14.5px">${trackById(S.sound.track).name}</b><div class="xs muted">${trackById(S.sound.track).sub}</div></div><button class="pp" style="width:34px;height:34px;display:flex;align-items:center;justify-content:center" data-a="trackPrev">${ic('prev', 18)}</button><button class="pp" style="width:42px;height:42px;border-radius:50%;background:var(--pri);color:var(--pri-ink);display:flex;align-items:center;justify-content:center" data-a="togglePlay">${ic(S.sound.playing ? 'pause' : 'play', 18)}</button><button class="pp" style="width:34px;height:34px;display:flex;align-items:center;justify-content:center" data-a="trackNext">${ic('next', 18)}</button></div>` : '<div style="height:24px"></div>'}</div>`; } };

SCREENS.player = { r: () => { const t = trackById(S.sound.track), sd = S.sound;
  return `<div class="scr"><div class="hdr"><button class="iconbtn" data-a="back">${ic('down', 26)}</button><div class="sp"></div><span class="small muted b">Tocando agora</span><div class="sp"></div><span style="width:32px"></span></div>
  <div class="body"><div class="player-art ${sd.playing ? 'play' : ''}" style="background:${t.c}">${ic('music', 110, '', 1.6)}</div>
    <h2 class="center mt24" style="font-size:23px">${t.name}</h2><p class="center muted mt8" style="margin-top:2px">${t.sub}</p>
    <div class="prog mt24" data-a="seek"><i id="ppos" style="width:${sd.pos / t.dur * 100}%"></i></div>
    <div class="between xs muted mt8"><span id="ptime">${fmtSec(sd.pos).replace(/^0/, '')}</span><span>${fmtSec(t.dur).replace(/^0/, '')}</span></div>
    <div class="ctrl"><button data-a="trackPrev">${ic('prev', 28)}</button><button class="main" data-a="togglePlay">${ic(sd.playing ? 'pause' : 'play', 28)}</button><button data-a="trackNext">${ic('next', 28)}</button></div>
    <div class="row mt24" style="gap:8px">${[['repeat','Repetir faixa'],['playlist','Playlist'],['shuffle','Aleatório']].map(([k, l]) => `<button class="chip ${sd.mode === k ? 'on' : ''}" style="flex:1;justify-content:center;padding:0 6px;font-size:13px" data-a="setMode" data-v="${k}">${l}</button>`).join('')}</div>
    <p class="center xs muted mt16">${sd.mode === 'repeat' ? 'A faixa atual repete em loop.' : sd.mode === 'shuffle' ? 'Ao terminar, toca uma faixa aleatória da lista.' : 'Ao terminar, toca a próxima faixa da lista.'} Botão ${ic('music', 12)} do relógio também pausa e retoma.</p>
  </div></div>`; } };

SCREENS.meta = { r: () => { U.g ??= S.goal;
  return `<div class="scr">${hdr()}<div class="body"><h1 class="h1">Sua meta diária</h1><p class="sub">Quanto tempo de foco você quer ter por dia? Você recebe uma notificação ao atingir a meta.</p>
    <div class="card center" style="padding:26px 16px;margin-top:22px"><span class="small muted">Meta por dia</span><div class="bigval mt8">${U.g ? fmtGoal(U.g) : '0 min'}</div><div class="step" style="justify-content:center;margin-top:16px"><button class="sbtn" style="width:50px;height:50px" data-a="stepG" data-v="-">${ic('minus', 20, '', 2.2)}</button><button class="sbtn p" style="width:50px;height:50px" data-a="stepG" data-v="+">${ic('plus', 20, '', 2.2)}</button></div></div>
    <div class="row mt16" style="gap:8px">${[30,60,120,240].map(m => `<button class="chip ${U.g === m ? 'on' : ''}" style="flex:1;justify-content:center;height:44px;border-radius:12px" data-a="setG" data-v="${m}">${fmtGoal(m)}</button>`).join('')}</div>
    ${U.eG ? `<div class="errt mt12">${ic('alertc', 15)}Escolha uma meta maior que zero</div>` : ''}
    <p class="small muted mt16">Hoje você já focou ${fmtDur(todayTotal())}${U.g ? ` · ${Math.min(100, Math.round(todayTotal() / U.g * 100))}% desta meta` : ''}.</p>
  </div><div class="foot"><button class="btn pri" data-a="salvarMeta">Salvar meta</button></div></div>`; } };

SCREENS.ofensiva = { r: () => {
  const st = streak(), days = [];
  for (let i = 6; i >= 0; i--) { const d = addDays(TODAY, -i), k = dkey(d); days.push({ l:DOW1[d.getDay()], on: k === TODAYK ? metToday() : S.met.has(k), today: k === TODAYK }); }
  const best = Math.max(st, ...[7,30,100].filter(n => S.unlocked.has(n)));
  const badge = n => { const on = st >= n || S.unlocked.has(n); return `<div class="card badge ${on ? 'on' : ''}"><span class="n">${n}</span><b>${n} dias</b><small>${on ? 'Conquistada' : n === 7 ? `${Math.min(st, 7)}/7 dias` : 'Bloqueada'}</small></div>`; };
  return `<div class="scr">${hdr()}<div class="body"><h1 class="h1">Ofensiva e conquistas</h1>
    <div class="streak mt12"><span style="color:${st ? 'var(--orange)' : 'var(--pri-soft2)'};display:inline-block">${ic('flame', 46)}</span><div class="bigval" style="margin-top:4px">${st}</div><b style="font-size:16px">${st === 1 ? 'dia seguido' : 'dias seguidos'}</b><p class="small muted mt8" style="line-height:1.45">${st ? (metToday() ? 'Meta de hoje batida. Volte amanhã para continuar a sequência.' : 'Bata sua meta hoje para continuar a sequência.') : 'Sua ofensiva recomeçou. Comece uma nova hoje.'}</p></div>
    <div class="card mt12"><div class="wkdots">${days.map(d => `<div>${d.l}<span class="wd ${d.on ? 'on' : ''} ${d.today && !d.on ? 'today' : ''}">${d.on ? ic('check', 16, '', 3) : ''}</span></div>`).join('')}</div></div>
    ${st >= 7 ? `<div class="alert t mt12" style="align-items:center"><span class="avatar" style="width:40px;height:40px;background:var(--orange);color:#fff;font-size:16px">7</span><div><b>Conquista desbloqueada!</b>7 dias seguidos batendo a meta</div></div>` : ''}
    <h3 class="sec">Conquistas</h3><div class="badges">${[7,30,100].map(badge).join('')}</div>
    <p class="xs muted mt16">A ofensiva conta os dias seguidos em que você bateu a meta diária (${fmtGoal(S.goal)}). Um dia sem sessões zera o contador.</p>
  </div></div>`;
} };

SCREENS.dicas = { r: () => { U.f ??= 'Todas';
  const list = TIPS.filter(t => U.f === 'Todas' || t.cat === U.f);
  return `<div class="scr">${hdr('Dicas de foco')}<div class="body"><p class="sub" style="font-size:14.5px">Leituras rápidas para estudar e trabalhar melhor.</p>
    <div class="chips mt16">${['Todas','Estudo','Trabalho','Sono','Rotina'].map(c => `<button class="chip ${U.f === c ? 'on' : ''}" data-a="setU" data-v="f:${c}">${c}</button>`).join('')}</div>
    <div class="mt16">${list.map(t => `<button class="card" style="width:100%;text-align:left;display:flex;gap:13px;align-items:center;padding:15px;margin-bottom:10px" data-a="dica" data-v="${t.id}"><span class="sicon">${ic('book', 20)}</span><div class="grow"><span class="xs b" style="color:var(--pri)">${t.cat}</span><div class="b" style="font-size:15.5px;margin:2px 0 3px;line-height:1.3">${t.title}</div><span class="xs muted">${t.time} de leitura</span></div>${ic('right', 18, 'muted')}</button>`).join('')}</div>
  </div></div>`; } };

SCREENS.dica = { r: p => { const t = TIPS.find(x => x.id === p.id);
  return `<div class="scr"><div class="hdr"><button class="iconbtn" data-a="back">${ic('left', 24)}</button><span class="small b" style="color:var(--pri)">${t.cat} · ${t.time} de leitura</span></div>
  <div class="body article"><h1 class="h1">${t.title}</h1>${t.body.map(([k, x]) => k === 'h' ? `<h3>${x}</h3>` : `<p>${x}</p>`).join('')}<div style="height:12px"></div></div>
  <div class="foot">${t.cta === 'timer25' ? `<button class="btn pri" data-a="timer25">Criar um timer de 25 minutos</button>` : `<button class="btn pri" data-a="tab" data-v="timers">Iniciar uma sessão</button>`}</div></div>`; } };

SCREENS.bloqueio = { r: () => { U.q ??= ''; U.sel ??= { ...S.blocked };
  const q = U.q.trim().toLowerCase(), list = APPS.filter(a => a.name.toLowerCase().includes(q)), n = Object.values(U.sel).filter(Boolean).length;
  return `<div class="scr">${hdr()}<div class="body"><h1 class="h1" style="font-size:25px">Apps bloqueados no foco</h1><p class="sub" style="font-size:14px">Os apps selecionados ficam bloqueados e sem notificações durante a sessão, e são liberados ao encerrar.</p>
    <div class="searchbox mt16">${ic('search', 19)}<input class="inp" data-in="q" data-oi="rr" value="${esc(U.q)}" placeholder="Buscar aplicativo"></div>
    <div class="mt12">${list.map(a => `<div class="card between" style="padding:11px 14px;margin-bottom:9px"><div class="row"><span class="applogo" style="background:${a.c}">${a.l}</span><b style="font-weight:500;font-size:15.5px">${a.name}</b></div>${tg(U.sel[a.id], 'toggleApp', a.id)}</div>`).join('') || `<p class="center muted small mt24">Nenhum aplicativo encontrado.</p>`}</div>
  </div><div class="foot" style="flex-direction:row;align-items:center;justify-content:space-between;border-top:1px solid var(--line)"><b style="font-weight:500">${n} ${n === 1 ? 'selecionado' : 'selecionados'}</b><button class="pill-btn" style="height:46px;padding:0 30px;font-size:15px" data-a="salvarApps">Salvar</button></div></div>`; } };

SCREENS.permissoes = { r: () => { const ok = permsOk();
  return `<div class="scr">${hdr()}<div class="body"><h1 class="h1" style="font-size:25px">Permissões do modo foco</h1>
    ${ok ? `<div class="alert g mt12" style="padding:16px;align-items:center"><span class="pico ok" style="width:44px;height:44px">${ic('check', 22, '', 3)}</span><div><b style="font-size:17px">Tudo certo!</b><span class="muted">O bloqueio está pronto para uso.</span></div></div>`
      : `<div class="alert o mt12" style="padding:16px;align-items:center"><span class="pico no" style="width:44px;height:44px;font-size:20px;background:#b8650f">!</span><div><b style="font-size:17px">${permsCount()} de 4 permissões ativas</b><span class="muted">Ative as que faltam para bloquear apps.</span></div></div>`}
    <div class="mt12">${PERMS.map(([k, l]) => `<div class="card perm"><span class="pico ${S.perms[k] ? 'ok' : 'no'}">${S.perms[k] ? ic('check', 17, '', 3) : '!'}</span><div class="grow"><b style="font-size:15.5px;font-weight:600">${l}</b><div class="xs muted">${S.perms[k] ? 'Ativa' : 'Desativada'}</div></div>${S.perms[k] ? '' : `<button class="pill-btn" data-a="permAtivar" data-v="${k}">Ativar</button>`}</div>`).join('')}</div>
    <a class="tlink small row mt16" data-a="go" data-v="limitacao">${ic('info', 16)}Meu aparelho limita o bloqueio?</a>
  </div><div class="foot">${ok ? `<button class="btn pri" data-a="back">Voltar</button>` : `<button class="btn pri" data-a="permAtivar" data-v="${PERMS.find(([k]) => !S.perms[k])[0]}">Resolver agora</button>`}</div></div>`; } };

SCREENS.permguia = { r: p => { U.i ??= 0; const name = PERMS.find(x => x[0] === p.k)[1];
  const steps = [
    { t:'Abra as Configurações', d:`No celular, abra Configurações e procure por ${p.k === 'notif' ? 'Notificações' : p.k === 'sobre' ? 'Apps' : p.k === 'bt' ? 'Bluetooth' : 'Acessibilidade'}.`, hl:'Configurações', ico:'gear' },
    { t:'Encontre o Concentra+', d:'Na lista de aplicativos instalados, toque em Concentra+.', hl:'Concentra+', ico:'plus' },
    { t:`Ative “${name}”`, d:'Ligue a chave e volte para o Concentra+. O status atualiza sozinho.', hl:name, ico:'check', tg:true },
  ];
  const s = steps[U.i];
  return `<div class="scr">${hdr()}<div class="body"><p class="small muted b">Permissão de ${name.toLowerCase()} · passo ${U.i + 1} de 3</p><h1 class="h1">${s.t}</h1><p class="sub">${s.d}</p>
    <div class="card" style="width:250px;margin:44px auto 0;padding:14px;border-radius:24px;display:flex;flex-direction:column;gap:10px">
      <div style="border:2px solid var(--pri);background:var(--pri-soft);border-radius:12px;padding:12px;display:flex;gap:10px;align-items:center;font-weight:600;font-size:14.5px">${ic(s.ico, 18)}<span class="grow">${esc(s.hl)}</span>${s.tg ? `<span class="tg ${U.on ? 'on' : ''}" style="transform:scale(.8)"></span>` : ''}</div>
      <i style="display:block;height:42px;border-radius:12px;background:var(--line2)"></i><i style="display:block;height:42px;border-radius:12px;background:var(--line2)"></i></div>
    <div class="dots" style="margin-top:30px">${[0,1,2].map(i => `<i class="${i === U.i ? 'on' : ''}"></i>`).join('')}</div>
  </div><div class="foot"><button class="btn pri" data-a="guiaNext">${U.i === 0 ? 'Abrir configurações' : U.i === 1 ? 'Próximo' : U.on ? 'Ver permissões' : 'Ativar permissão'}</button></div></div>`; } };

SCREENS.limitacao = { r: () => `<div class="scr">${hdr()}<div class="body">
  <div style="background:var(--orange-soft);border:1.5px solid var(--orange-line);border-radius:22px;padding:20px 18px"><span class="iconhero" style="width:40px;height:40px;margin:0;background:var(--orange);color:#fff">${ic('info', 22, '', 2.2)}</span><h2 style="font-size:23px;margin:14px 0 8px;line-height:1.25">Seu sistema limita o bloqueio de apps</h2><p class="small muted" style="line-height:1.5">Em alguns aparelhos, a versão do sistema não permite que o Concentra+ bloqueie outros aplicativos durante a sessão. Nesse caso, ainda dá para usar o resto do app normalmente.</p></div>
  <h3 class="sec">O que continua funcionando</h3>
  <div class="list">${[['check','Timers de foco e descanso'],['check','Conexão e sincronização com o Concentra+'],['check','Lembretes, metas e relatórios'],['x','Bloqueio de aplicativos e notificações']].map(([i, l]) => `<div class="li"><span style="color:${i === 'x' ? 'var(--red)' : 'var(--green)'}">${ic(i, 18, '', 2.6)}</span>${l}</div>`).join('')}</div>
</div><div class="foot"><button class="btn pri" data-a="limEntendi">Entendi</button><button class="btn link" data-a="go" data-v="ajuda">Saiba mais</button></div></div>` };

SCREENS.ajuda = { r: () => { U.q ??= ''; U.f ??= 'Todos'; U.open ??= 0;
  const q = U.q.trim().toLowerCase();
  const list = FAQ.map((f, i) => ({ ...f, i })).filter(f => (U.f === 'Todos' || f.cat === U.f) && (!q || (f.q + ' ' + f.a).toLowerCase().includes(q)));
  return `<div class="scr">${hdr('Central de ajuda')}<div class="body">
    <div class="searchbox">${ic('search', 19)}<input class="inp" data-in="q" data-oi="rr" value="${esc(U.q)}" placeholder="Buscar por palavra-chave"></div>
    <div class="chips mt12">${['Todos','Relógio','Bloqueio','Conta','Assinatura'].map(c => `<button class="chip ${U.f === c ? 'on' : ''}" data-a="setU" data-v="f:${c}">${c}</button>`).join('')}</div>
    <h3 class="sec">${q ? `${list.length} ${list.length === 1 ? 'resultado' : 'resultados'}` : 'Perguntas frequentes'}</h3>
    <div class="accordion">${list.map(f => `<div class="card acc"><button class="q" data-a="faq" data-v="${f.i}">${hl(f.q, q)}${ic(U.open === f.i ? 'up' : 'down', 18, 'muted')}</button>${U.open === f.i ? `<div class="a">${hl(f.a, q)}</div>` : ''}</div>`).join('') || `<div class="empty">${ic('search', 26)}<b>Nada encontrado</b><span class="small">Tente outra palavra ou fale com o suporte.</span></div>`}</div>
    <div class="alert t mt12" style="align-items:center"><div class="grow"><b>Não encontrou? Fale com o suporte</b><span class="xs muted">Respondemos em até 2 dias úteis.</span></div><button class="pill-btn" data-a="go" data-v="contato">Contato</button></div>
  </div></div>`; } };

const hl = (t, q) => { const e = esc(t); if (!q) return e; const i = t.toLowerCase().indexOf(q); if (i < 0) return e; return esc(t.slice(0, i)) + `<mark style="background:var(--orange-soft);color:inherit;border-radius:3px">${esc(t.slice(i, i + q.length))}</mark>` + esc(t.slice(i + q.length)); };

SCREENS.contato = { r: () => { U.as ??= 'Conexão com o relógio'; U.msg ??= '';
  if (U.sent) return `<div class="scr"><div class="body"><div class="hero" style="padding-top:150px"><div class="iconhero g">${ic('check', 42, '', 3)}</div><h2>Mensagem enviada</h2><p>Responderemos em até 2 dias úteis, no e-mail ${esc(S.user.email)}.</p><p class="xs muted">Protocolo #CP-${U.proto}</p></div></div><div class="foot"><button class="btn pri" data-a="back">Voltar à central de ajuda</button></div></div>`;
  return `<div class="scr">${hdr('Falar com o suporte')}<div class="body"><p class="sub" style="font-size:14px">Conte o que aconteceu e responderemos por e-mail em até 2 dias úteis.</p>
    <label class="lbl">Assunto</label><div class="field selwrap"><select class="inp" data-in="as">${['Conexão com o relógio','Bloqueio de aplicativos','Histórico e relatórios','Assinatura e pagamento','Outro assunto'].map(o => `<option ${U.as === o ? 'selected' : ''}>${o}</option>`).join('')}</select><span class="chev">${ic('down', 18)}</span></div>
    <div class="fwrap"><label class="lbl">Mensagem</label><textarea class="inp ${U.eM ? 'err' : ''}" data-in="msg" data-err="eM" data-oi="cnt" maxlength="500" placeholder="Descreva o problema com o máximo de detalhes">${esc(U.msg)}</textarea><div class="counter" id="cnt">${U.msg.length}/500</div>${U.eM ? `<div class="errt">${ic('alertc', 15)}${U.eM}</div>` : ''}</div>
    <p class="small muted row mt8">${ic('mail', 16)}Resposta para ${esc(S.user.email)}</p>
  </div><div class="foot"><button class="btn pri" data-a="enviarContato">Enviar</button></div></div>`; } };

SCREENS.sugestao = { r: () => { U.msg ??= '';
  if (U.sent) return `<div class="scr"><div class="body"><div class="hero" style="padding-top:150px"><div class="iconhero t">${ic('heart', 38, '', 2)}</div><h2>Obrigado pela sugestão!</h2><p>Nossa equipe vai ler a sua ideia com carinho.</p></div></div><div class="foot"><button class="btn pri" data-a="back">Voltar ao perfil</button></div></div>`;
  return `<div class="scr">${hdr('Enviar sugestão')}<div class="body"><p class="sub" style="font-size:14px">Sua ideia ajuda a melhorar o Concentra+. Pode ser sobre o aplicativo ou sobre o relógio.</p>
    <label class="lbl">Conte sua ideia</label><textarea class="inp" data-in="msg" data-oi="cnt" maxlength="500" style="min-height:200px" placeholder="Ex.: gostaria de escolher o som do alerta do relógio">${esc(U.msg)}</textarea><div class="counter" id="cnt">${U.msg.length}/500</div>
  </div><div class="foot"><button class="btn pri ${U.msg.trim() ? '' : 'dis'}" id="sugBtn" data-a="enviarSug">Enviar sugestão</button></div></div>`; } };

SCREENS.historico = { r: p => { U.v ??= p.v || 'cal';
  const body = U.v === 'cal' ? calView() : repView();
  return `<div class="scr"><div class="body" style="padding-top:14px"><h1 class="h1">Histórico</h1>
    <div class="seg mt12"><button class="${U.v === 'cal' ? 'on' : ''}" data-a="histV" data-v="cal">Calendário</button><button class="${U.v === 'rel' ? 'on' : ''}" data-a="histV" data-v="rel">Relatórios</button></div>
    ${!S.recovered ? `<button class="alert t mt12" style="width:100%;text-align:left;align-items:center" data-a="go" data-v="recuperacao">${ic('cloud', 22)}<div class="grow"><b>Recupere seu histórico</b><span class="small">Há sessões salvas na sua conta.</span></div>${ic('right', 18)}</button>` : ''}
    ${body}</div>${tabbar('historico')}</div>`; } };

function calView(){
  U.m ??= TODAY.getMonth(); U.y ??= 2026; U.sel ??= TODAYK;
  const first = new Date(U.y, U.m, 1), dim = new Date(U.y, U.m + 1, 0).getDate();
  const cells = []; for (let i = 0; i < first.getDay(); i++) cells.push('<span></span>');
  for (let d = 1; d <= dim; d++) { const dt = new Date(U.y, U.m, d), k = dkey(dt), has = dayTotal(k) > 0, fut = dt > TODAY, met = k === TODAYK ? metToday() : S.met.has(k);
    cells.push(`<button class="cd ${has ? 'has' : ''} ${U.sel === k ? 'sel' : ''} ${k === TODAYK ? 'today' : ''} ${fut ? 'fut' : ''}" data-a="selDay" data-v="${k}" ${fut ? 'disabled' : ''}>${d}${met ? '<i class="m"></i>' : ''}</button>`); }
  const sd = parseK(U.sel), list = S.history.filter(s => s.d === U.sel), tot = dayTotal(U.sel);
  const canPrev = !(U.y === 2026 && U.m <= 8), canNext = !(U.y === 2026 && U.m >= TODAY.getMonth());
  return `<div class="calhd"><button class="iconbtn" style="margin:0;${canPrev ? '' : 'opacity:.3'}" data-a="mes" data-v="-1">${ic('left', 22)}</button><b>${MESES[U.m][0].toUpperCase() + MESES[U.m].slice(1)} de ${U.y}</b><button class="iconbtn" style="margin:0;${canNext ? '' : 'opacity:.3'}" data-a="mes" data-v="1">${ic('right', 22)}</button></div>
  <div class="cal">${DOW1.map(d => `<span class="wh">${d}</span>`).join('')}${cells.join('')}</div>
  <div class="legend"><span><i class="lg1"></i>Com sessões</span><span><i class="lg2"></i>Meta batida</span></div>
  <h3 class="sec strong" style="margin-top:18px">${U.sel === TODAYK ? 'Hoje, ' : ''}${sd.getDate()} de ${MESES[sd.getMonth()]}</h3>
  ${list.length ? `<div class="tot">Tempo total de foco<b>${fmtDur(tot)}</b></div>${list.map(s => `<div class="card hrow"><b style="width:46px">${s.t}</b>${tagFor(s.cat)}<span class="grow"></span><b>${fmtDur(s.min)}</b></div>`).join('')}`
    : S.history.length ? `<div class="empty">${ic('timer', 26)}<b>Sem sessões neste dia</b><span class="small">Escolha um dia destacado no calendário.</span></div>`
    : `<div class="empty">${ic('timer', 26)}<b>Seu histórico começa aqui</b><span class="small">Suas sessões concluídas aparecem aqui, com tempo e categoria.</span><button class="pill-btn mt8" style="height:44px;padding:0 20px" data-a="tab" data-v="timers">Iniciar primeira sessão</button></div>`}`;
}

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

SCREENS.semnet = { r: () => `<div class="scr">${hdr('Histórico')}<div class="body">
  <div class="alert o">${ic('wifioff', 19)}<span>Sem conexão com a internet. Mostrando os dados salvos neste celular.</span></div>
  <div class="hero" style="padding-top:90px"><div class="iconhero t">${ic('wifioff', 40)}</div><h2>Não foi possível atualizar</h2><p>Conecte-se ao Wi-Fi ou aos dados móveis para ver os relatórios mais recentes. Suas sessões no Concentra+ continuam sendo registradas e serão sincronizadas depois.</p></div>
  </div><div class="foot"><button class="btn pri" data-a="tentarNet">Tentar novamente</button><button class="btn link" data-a="verCalendario">Ver calendário salvo</button></div></div>` };

SCREENS.recuperacao = {
  r: () => { U.st ??= 'ask'; const n = (S.allHistory || []).length;
    if (U.st === 'ask') return `<div class="scr"><div class="body"><div class="hero" style="padding-top:120px"><div class="iconhero t">${ic('cloud', 40)}</div><h2>Recuperar seu histórico</h2><p>Encontramos <b style="color:var(--text)">${n} sessões</b> associadas à sua conta.</p></div></div><div class="foot"><button class="btn pri" data-a="recuperar">Recuperar histórico</button><button class="btn link" data-a="agoraNao">Agora não</button></div></div>`;
    if (U.st === 'load') return `<div class="scr"><div class="body"><div class="hero" style="padding-top:150px"><div class="iconhero t">${ic('cloud', 40)}</div><h2>Recuperando seu histórico…</h2><div class="bar t" style="width:220px;height:8px;margin-top:10px"><i id="rbar" style="width:0%;transition:width .2s linear"></i></div><p class="small" id="rpct">Recuperando 0%</p></div></div></div>`;
    if (U.st === 'ok') return `<div class="scr"><div class="body"><div class="hero" style="padding-top:150px"><div class="iconhero g">${ic('check', 42, '', 3)}</div><h2>Histórico recuperado com sucesso</h2><p>${n} sessões foram restauradas neste aparelho.</p></div></div><div class="foot"><button class="btn pri" data-a="verHist">Ver meu histórico</button><button class="btn link" data-a="agoraNao">Ir para o início</button></div></div>`;
    return `<div class="scr"><div class="body"><div class="hero" style="padding-top:140px"><div class="iconhero r"><b style="font-size:42px">!</b></div><h2>Não foi possível recuperar seu histórico</h2><p>Confira sua conexão com a internet e tente de novo.</p></div></div><div class="foot"><button class="btn pri" data-a="recuperar">Tentar novamente</button><button class="btn link" data-a="go" data-v="contato">Falar com o suporte</button></div></div>`;
  },
  after: () => { if (U.st !== 'load') return; let p = 0; clearInterval(U.t);
    U.t = setInterval(() => { if (cur().id !== 'recuperacao') return clearInterval(U.t); p += 4 + Math.random() * 6;
      if (!S.env.net && p > 40) { clearInterval(U.t); U.st = 'err'; return rerender(); }
      if (p >= 100) { clearInterval(U.t); restoreHistory(); U.st = 'ok'; return rerender(); }
      const b = $('#rbar'), t = $('#rpct'); if (b) b.style.width = p + '%'; if (t) t.textContent = `Recuperando ${Math.floor(p)}%`; }, 120); }
};

SCREENS.agenda = { r: () => { const ag = S.agenda;
  if (U.loading) return `<div class="scr">${hdr('Integração com agenda')}<div class="body"><div class="hero" style="padding-top:140px"><div class="radar" style="width:120px;height:120px;margin:0"><i class="p" style="inset:0"></i><span class="iconsq">${ic('cal', 26)}</span></div><h2 style="font-size:20px">Conectando ao ${U.loading}…</h2><p>Autorize o acesso na janela da sua conta.</p></div></div></div>`;
  if (!ag.provider) return `<div class="scr">${hdr('Integração com agenda')}<div class="body"><div class="hero" style="padding-top:30px"><span class="iconsq" style="width:84px;height:84px;border-radius:22px">${ic('calcheck', 40, '', 1.7)}</span><h2>Conectar agenda</h2><p>Marque seu horário como Ocupado durante as sessões de foco, para os seus contatos saberem que você não pode ser interrompido.</p></div></div>
    <div class="foot"><button class="btn out" data-a="conectarAgenda" data-v="Google"><span style="width:18px;height:18px;border-radius:50%;background:conic-gradient(#ea4335 0 25%,#fbbc05 0 50%,#34a853 0 75%,#4285f4 0)"></span>Entrar com Google</button><button class="btn out" data-a="conectarAgenda" data-v="Microsoft"><span style="display:grid;grid-template-columns:8px 8px;gap:2px"><i style="width:8px;height:8px;background:#f25022"></i><i style="width:8px;height:8px;background:#7fba00"></i><i style="width:8px;height:8px;background:#00a4ef"></i><i style="width:8px;height:8px;background:#ffb900"></i></span>Entrar com Microsoft</button></div></div>`;
  return `<div class="scr">${hdr('Integração com agenda')}<div class="body">
    <div class="card between pad"><div class="row"><span class="avatar" style="width:42px;height:42px;font-size:16px">${ag.provider[0]}</span><div><b>${ag.provider === 'Google' ? 'Google Agenda' : 'Outlook'}</b><div class="small muted">${esc(S.user.email)}</div></div></div><span class="tag green">Conectada</span></div>
    <div class="card between pad mt12"><div style="max-width:240px"><b>Criar evento Ocupado nas sessões</b><div class="small muted mt8" style="margin-top:3px">Um evento com a duração do timer aparece na sua agenda.</div></div>${tg(ag.busy, 'toggleBusy')}</div>
    ${ag.busy ? `<div class="card pad mt12" style="border-left:4px solid var(--pri)"><span class="xs muted">Prévia na agenda</span><div class="b mt8" style="margin-top:4px">Ocupado · Foco (Concentra+)</div><div class="small muted">Hoje, ${nowHM()} · ${(timerById(S.selTimer) || S.timers[0]).focus} min</div></div>` : ''}
  </div><div class="foot"><button class="btn out" style="color:var(--red)" data-a="desconAgenda">Desconectar</button></div></div>`; } };

SCREENS.lembretes = { r: () => {
  let sh = '';
  if (U.sheet) { const r = U.ed;
    sh = sheet(`<h3>${r.id ? 'Editar lembrete' : 'Novo lembrete'}</h3><div class="timebig mt16"><input type="number" min="0" max="23" value="${pad2(r.h)}" data-oc="remH">:<input type="number" min="0" max="59" step="5" value="${pad2(r.m)}" data-oc="remM"></div>
    <div class="seg soft mt16"><button class="${r.freq === 'diario' ? 'on' : ''}" data-a="remFreq" data-v="diario">Diário</button><button class="${r.freq === 'semanal' ? 'on' : ''}" data-a="remFreq" data-v="semanal">Semanal</button></div>
    ${r.freq === 'semanal' ? `<div class="daychips">${[0,1,2,3,4,5,6].map(d => `<button class="${r.days.includes(d) ? 'on' : ''}" data-a="remDay" data-v="${d}">${DOW1[d]}</button>`).join('')}</div>` : ''}
    ${U.eR ? `<div class="errt">${ic('alertc', 15)}Escolha pelo menos um dia</div>` : ''}
    <button class="btn pri mt24" data-a="salvarLembrete">Salvar</button>${r.id ? `<button class="btn link red" data-a="delLembrete">Excluir lembrete</button>` : `<button class="btn link muted" data-a="closeOverlay">Cancelar</button>`}`); }
  return `<div class="scr">${hdr()}<div class="body"><h1 class="h1">Lembretes de foco</h1><p class="sub" style="font-size:14.5px">Receba uma notificação no celular para iniciar sua sessão no horário combinado.</p>
    <div class="mt16">${S.reminders.map(r => `<div class="card between" style="padding:14px 16px;margin-bottom:12px"><button style="text-align:left;flex:1" data-a="editLembrete" data-v="${r.id}"><div style="font-size:23px;font-weight:700;${r.on ? '' : 'opacity:.55'}">${pad2(r.h)}:${pad2(r.m)}</div><div class="small muted">${daysLabel(r)}</div></button>${tg(r.on, 'toggleRem', r.id)}</div>`).join('') || `<div class="empty">${ic('bell', 28)}<b>Nenhum lembrete ainda</b><span class="small">Crie um para manter sua rotina.</span></div>`}</div>
    ${S.reminders.length ? `<button class="tlink small row mt8" data-a="testeLembrete">${ic('bell', 15)}Ver como a notificação aparece</button>` : ''}
  </div><div class="foot"><button class="btn pri" data-a="novoLembrete">${ic('plus', 18, '', 2.2)}Novo lembrete</button></div>${sh}</div>`; } };

const avatarHtml = (cls = '') => `<span class="avatar ${cls}" style="${S.user.photo ? `background-image:url(${S.user.photo});` : ''}">${S.user.photo ? '' : initials(S.user.name)}</span>`;

SCREENS.perfil = { r: () => {
  const row = (ico, l, a, v, o = {}) => `<button class="li ${o.red ? 'red' : ''}" data-a="${a}" data-v="${v || ''}">${ic(ico, 21)}<span class="grow">${l}${o.sub ? `<div class="sub2">${o.sub}</div>` : ''}</span>${o.badge || ''}${ic('right', 18, 'muted')}</button>`;
  const sub = S.sub.status === 'ativa' ? 'Premium · ativa' : S.sub.status === 'cancelada' ? 'Premium · cancelada' : 'Pagamento pendente';
  return `<div class="scr"><div class="body" style="padding-top:14px">
    <div class="row">${avatarHtml()}<div class="grow"><div style="font-size:21px;font-weight:700">${esc(S.user.name)}</div><div class="small muted">${esc(S.user.email)}</div></div><button class="chip" style="font-weight:600" data-a="go" data-v="editarperfil">Editar</button></div>
    <h3 class="sec">Meu aparelho</h3><div class="list">${row('device', 'Meu relógio', 'go', 'relogio', { sub: S.watch.paired ? `${connected() ? 'Conectado' : 'Desconectado'} · bateria ${S.watch.battery}%` : 'Nenhum relógio pareado' })}</div>
    <h3 class="sec">Preferências</h3><div class="list">${row('bell', 'Lembretes', 'go', 'lembretes', { sub:`${S.reminders.filter(r => r.on).length} ativos` })}${row('moon', 'Aparência', 'go', 'aparencia', { sub:{ claro:'Claro', escuro:'Escuro', auto:'Automático' }[S.theme] })}${row('cal', 'Integração com agenda', 'go', 'agenda', { sub: S.agenda.provider ? `${S.agenda.provider} conectado` : 'Desconectada' })}${row('timer', 'Meta diária', 'go', 'meta', { sub: fmtGoal(S.goal) })}</div>
    <h3 class="sec">Conta</h3><div class="list">${row('card', 'Minha assinatura', 'go', 'assinatura', { sub, badge: S.sub.status === 'pendente' ? '<span class="dot o" style="margin-right:4px"></span>' : '' })}${row('trash', 'Excluir conta e dados', 'go', 'excluir', { red:true })}${row('logout', 'Sair', 'go', 'sair')}</div>
    <h3 class="sec">Suporte</h3><div class="list">${row('help', 'Central de ajuda', 'go', 'ajuda')}${row('bulb', 'Dicas de concentração', 'go', 'dicas')}${row('send', 'Enviar sugestão', 'go', 'sugestao')}${row('info', 'Termos e privacidade', 'go', 'termos')}</div>
    <p class="center xs muted mt24">Concentra+ v1.0.0 · Grupo Cortex</p>
  </div>${tabbar('perfil')}</div>`;
} };

SCREENS.editarperfil = { r: () => { U.name ??= S.user.name; U.photo ??= S.user.photo;
  return `<div class="scr">${hdr('Editar perfil')}<div class="body"><div class="center mt16"><label style="display:inline-block;position:relative;cursor:pointer"><span class="avatar xl" style="${U.photo ? `background-image:url(${U.photo})` : ''}">${U.photo ? '' : initials(U.name || '?')}</span><span style="position:absolute;right:-2px;bottom:4px;width:36px;height:36px;border-radius:50%;background:var(--pri);color:var(--pri-ink);display:flex;align-items:center;justify-content:center;border:3px solid var(--bg)">${ic('camera', 17)}</span><input type="file" accept="image/*" hidden data-oc="pickPhoto"></label>
    <div class="mt12"><label class="tlink" style="cursor:pointer">Alterar imagem de perfil<input type="file" accept="image/*" hidden data-oc="pickPhoto"></label>${U.photo ? ` · <a class="tlink" style="color:var(--red)" data-a="rmPhoto">Remover</a>` : ''}</div></div>
    <div class="fwrap"><label class="lbl">Nome de usuário</label><input class="inp ${U.eN ? 'err' : ''}" data-in="name" data-err="eN" value="${esc(U.name)}" maxlength="40">${U.eN ? `<div class="errt">${ic('alertc', 15)}${U.eN}</div>` : ''}</div>
    <label class="lbl">E-mail</label><input class="inp" value="${esc(S.user.email)}" disabled><p class="help">O e-mail não pode ser alterado por aqui.</p>
  </div><div class="foot"><button class="btn pri" data-a="salvarPerfil">Salvar alterações</button></div></div>`; } };

SCREENS.aparencia = { r: () => {
  const thumb = k => k === 'claro' ? `<span class="thumb" style="background:#f7f8fa"><i style="background:#1b1f23;width:60%"></i><i style="background:#fff;height:12px;border:1px solid #e6e9ed"></i><i style="background:#fff;height:12px;border:1px solid #e6e9ed"></i><i style="background:#1f6f78;margin-top:auto"></i></span>`
    : k === 'escuro' ? `<span class="thumb" style="background:#0f1417;border-color:#2a333a"><i style="background:#eef2f4;width:60%"></i><i style="background:#1a2126;height:12px"></i><i style="background:#1a2126;height:12px"></i><i style="background:#4fb3bf;margin-top:auto"></i></span>`
    : `<span class="thumb" style="background:linear-gradient(90deg,#f7f8fa 50%,#0f1417 50%)"><i style="background:#888;width:60%"></i><i style="background:linear-gradient(90deg,#fff 50%,#1a2126 50%);height:12px"></i><i style="background:linear-gradient(90deg,#fff 50%,#1a2126 50%);height:12px"></i><i style="background:linear-gradient(90deg,#1f6f78 50%,#4fb3bf 50%);margin-top:auto"></i></span>`;
  const opts = [['claro','Claro','Fundo claro, ideal para o dia.'],['escuro','Escuro','Menos cansaço visual à noite.'],['auto','Automático','Segue o tema do sistema.']];
  return `<div class="scr">${hdr('Aparência')}<div class="body"><p class="sub" style="font-size:14.5px">Escolha como o Concentra+ aparece no seu celular.</p><div class="mt16">${opts.map(([k, l, d]) => `<button class="card themeopt ${S.theme === k ? 'sel' : ''}" data-a="setTheme" data-v="${k}">${thumb(k)}<div><b style="font-size:16px">${l}</b><div class="small muted mt8" style="margin-top:2px">${d}</div></div><span class="radio ${S.theme === k ? 'on' : ''}">${S.theme === k ? ic('check', 14, '', 3) : ''}</span></button>`).join('')}</div>
  <p class="small muted mt8">O tema é aplicado na hora, em todas as telas, e a sua escolha fica salva.</p></div></div>`; } };

SCREENS.assinatura = { r: () => { const s = S.sub, pl = PLANS[s.plan];
  const tag = s.status === 'ativa' ? '<span class="tag green">Ativa</span>' : s.status === 'cancelada' ? '<span class="tag gray">Cancelada</span>' : '<span class="tag orange" style="height:auto;padding:4px 10px;line-height:1.2">Pagamento<br>pendente</span>';
  return `<div class="scr">${hdr('Minha assinatura')}<div class="body">
    <div class="card plan"><div class="row" style="align-items:flex-start"><span class="planlogo">${ic('plus', 22, '', 2.6)}</span><div class="grow"><span class="xs muted">Seu plano</span><div style="font-size:19px;font-weight:700;line-height:1.2">Concentra+ Premium</div><div class="small muted">${pl.l}</div></div>${tag}</div>
      <div style="border-top:1px solid var(--line2);margin-top:16px">${s.status === 'cancelada' ? `<div class="kv" style="padding:14px 0 0"><span>Acesso até</span><span class="b">05/12/2026</span></div>` : `<div class="kv" style="padding:14px 0"><span>Valor</span><span class="b">${pl.p}</span></div><div class="kv" style="padding:14px 0 0"><span>Próxima cobrança</span><span class="b">${s.plan === 'anual' ? '05/11/2027' : '05/12/2026'}</span></div>`}</div></div>
    ${s.status === 'pendente' ? `<div class="alert o mt12">${ic('tri', 20)}<span>Não conseguimos cobrar o seu cartão. Atualize a forma de pagamento para manter o acesso.</span></div>` : ''}
    ${s.status === 'cancelada' ? `<p class="small muted mt16" style="line-height:1.5">Depois de 05/12/2026, o modo foco e o bloqueio de aplicativos deixam de funcionar. Seu histórico continua salvo.</p>` : ''}
    <h3 class="sec">Incluso no Premium</h3><div class="list">${['Timers ilimitados e categorias','Bloqueio de aplicativos e Modo Restrito','Relatórios com download em PDF','Sons e músicas para foco'].map(x => `<div class="li" style="font-size:14.5px"><span style="color:var(--green)">${ic('check', 17, '', 2.6)}</span>${x}</div>`).join('')}</div>
  </div><div class="foot">${s.status === 'ativa' ? `<button class="btn pri" data-a="go" data-v="gerenciar">Gerenciar assinatura</button><button class="btn link red" data-a="cancelarAss">Cancelar assinatura</button>` : s.status === 'cancelada' ? `<button class="btn pri" data-a="reativar">Reativar assinatura</button>` : `<button class="btn pri" data-a="atualizarPgto">Atualizar forma de pagamento</button>`}</div></div>`; } };

SCREENS.gerenciar = {
  r: p => { const s = S.sub, pl = PLANS[s.plan];
    let sh = '';
    if (U.modal === 'cancel') sh = modal(`<h3 style="margin-top:0">Cancelar assinatura?</h3><p>Você mantém o acesso até 05/12/2026. Depois dessa data, o modo foco e o bloqueio de aplicativos deixam de funcionar.</p><button class="btn pri" data-a="closeOverlay">Manter plano</button><button class="btn link red" data-a="confirmCancel">Cancelar assinatura</button>`);
    if (U.sheet === 'plano') sh = sheet(`<h3>Alterar plano</h3><p class="small muted">A mudança vale a partir da próxima cobrança.</p><div class="mt16">${Object.entries(PLANS).map(([k, x]) => `<button class="card themeopt ${s.plan === k ? 'sel' : ''}" style="margin-bottom:10px" data-a="setPlano" data-v="${k}"><div class="grow"><b>${x.l}</b><div class="small muted">${x.p}${k === 'anual' ? ' · equivale a R$ 14,99/mês' : k === 'estudante' ? ' · com comprovante de matrícula' : ''}</div></div><span class="radio ${s.plan === k ? 'on' : ''}">${s.plan === k ? ic('check', 14, '', 3) : ''}</span></button>`).join('')}</div><button class="btn link muted" data-a="closeOverlay">Fechar</button>`);
    if (U.sheet === 'card') { U.cn ??= ''; U.cv ??= ''; U.cc ??= '';
      sh = sheet(`<h3>Forma de pagamento</h3><p class="small muted">Cartão atual: final ${s.card}</p><label class="lbl">Número do cartão</label><input class="inp ${U.eC ? 'err' : ''}" data-in="cn" data-oi="fmtCard" inputmode="numeric" placeholder="0000 0000 0000 0000" value="${esc(U.cn)}" maxlength="19"><div class="row" style="gap:10px"><div class="grow"><label class="lbl">Validade</label><input class="inp" data-in="cv" placeholder="MM/AA" maxlength="5" value="${esc(U.cv)}"></div><div class="grow"><label class="lbl">CVV</label><input class="inp" data-in="cc" inputmode="numeric" placeholder="123" maxlength="4" value="${esc(U.cc)}"></div></div>${U.eC ? `<div class="errt">${ic('alertc', 15)}${U.eC}</div>` : ''}<p class="xs muted mt12 row">${ic('lock', 13)}Protótipo: nenhum dado é enviado ou salvo.</p><button class="btn pri mt16" data-a="salvarCartao">Salvar cartão</button><button class="btn link muted" data-a="closeOverlay">Cancelar</button>`); }
    return `<div class="scr">${hdr('Gerenciar assinatura')}<div class="body"><p class="sub" style="font-size:14.5px">Concentra+ Premium · ${pl.p}</p>
      <div class="list mt16"><button class="li" data-a="openSheet" data-v="plano">${ic('arrowr', 20)}<span class="grow"><b style="font-weight:600">Alterar plano</b><div class="sub2">Mensal, anual ou estudante</div></span>${ic('right', 18, 'muted')}</button><button class="li" data-a="openSheet" data-v="card">${ic('card', 20)}<span class="grow"><b style="font-weight:600">Forma de pagamento</b><div class="sub2">Cartão final ${s.card}</div></span>${s.status === 'pendente' ? '<span class="dot o"></span>' : ''}${ic('right', 18, 'muted')}</button>${s.status !== 'cancelada' ? `<button class="li red" data-a="askCancel">${ic('xcircle', 20)}<span class="grow b" style="font-weight:600">Cancelar assinatura</span></button>` : ''}</div>
    </div>${sh}</div>`; },
  after: p => { if (p.ask && !U.done) { U.done = 1; U.modal = 'cancel'; rerender(); } if (p.card && !U.done) { U.done = 1; U.sheet = 'card'; rerender(); } }
};

SCREENS.excluir = { r: () => { U.pw ??= ''; U.ok ??= false;
  if (U.done) return `<div class="scr"><div class="body"><div class="hero" style="padding-top:130px"><div class="iconhero t">${ic('check', 40, '', 2.6)}</div><h2>Seus dados foram excluídos</h2><p>Sua conta e o histórico de sessões foram removidos dos nossos servidores. Obrigado por ter usado o Concentra+.</p></div></div><div class="foot"><button class="btn pri" data-a="voltarInicioZero">Voltar ao início</button></div></div>`;
  const can = U.pw.length >= 8 && U.ok;
  return `<div class="scr">${hdr('Excluir conta e dados')}<div class="body">
    <div class="alert r">${ic('tri', 22, '', 2)}<div><b>Esta ação é definitiva</b>Por direito à privacidade (LGPD), você pode pedir a exclusão completa dos seus dados.</div></div>
    <h3 class="sec" style="color:var(--text)">O que será apagado</h3>
    <div class="list">${['Dados pessoais (nome, e-mail, foto)', `Histórico de sessões de foco (${S.history.length})`, 'Timers, metas e conquistas', 'Pareamento com o Concentra+'].map(x => `<div class="li" style="font-size:14.5px"><span style="color:var(--red)">${ic('x', 17, '', 2.4)}</span>${x}</div>`).join('')}</div>
    <div class="fwrap"><label class="lbl">Digite sua senha para confirmar</label><input class="inp ${U.eP ? 'err' : ''}" type="password" data-in="pw" data-err="eP" data-oi="exclCheck" value="${esc(U.pw)}" placeholder="Sua senha">${U.eP ? `<div class="errt">${ic('alertc', 15)}${U.eP}</div>` : ''}</div>
    <button class="row mt16" style="text-align:left" data-a="exclOk"><span class="check ${U.ok ? 'on' : ''}">${U.ok ? ic('check', 14, '', 3) : ''}</span><span style="font-size:14.5px">Entendo que não poderá ser desfeito</span></button>
  </div><div class="foot"><button class="btn redb ${can ? '' : 'dis'}" id="exclBtn" data-a="excluirConta">Excluir conta e dados</button></div></div>`; } };

SCREENS.sair = { r: () => `<div class="scr">${hdr()}<div class="body"><div class="hero" style="padding-top:130px"><div class="iconhero t">${ic('logout', 38)}</div><h2>Deseja sair da conta?</h2><p>Você precisará entrar de novo para ver seu histórico. Seus dados e o pareamento com o Concentra+ continuam salvos.</p></div></div>
  <div class="foot"><button class="btn pri" data-a="sairConta">Sair</button><button class="btn link muted" data-a="back">Cancelar</button></div></div>` };
