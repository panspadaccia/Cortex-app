/* ================= audio ================= */
let AC = null, OUT = null, voice = null;
function audioUnlock(){
  if (!AC) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); OUT = AC.createGain(); OUT.gain.value = .55; OUT.connect(AC.destination); } catch (e) { AC = null; } }
  if (AC && AC.state === 'suspended') AC.resume().catch(() => {});
}
const NB = {};
function noiseBuf(type){
  if (NB[type]) return NB[type];
  const len = AC.sampleRate * 3, b = AC.createBuffer(1, len, AC.sampleRate), d = b.getChannelData(0); let last = 0;
  for (let i = 0; i < len; i++) { const w = Math.random() * 2 - 1; if (type === 'brown') { last = (last + .02 * w) / 1.02; d[i] = last * 3.5; } else d[i] = w; }
  return NB[type] = b;
}
function chain(nodes){ for (let i = 0; i < nodes.length - 1; i++) nodes[i].connect(nodes[i + 1]); return nodes; }
function filt(type, f, q = .7){ const x = AC.createBiquadFilter(); x.type = type; x.frequency.value = f; x.Q.value = q; return x; }
function gainN(v){ const g = AC.createGain(); g.gain.value = v; return g; }
function noiseLayer(type, fl, g, bus){ const s = AC.createBufferSource(); s.buffer = noiseBuf(type); s.loop = true; const gg = gainN(g); chain([s, ...fl, gg, bus]); s.start(); return { s, g:gg }; }
function note(bus, f, t, dur, o = {}){
  const osc = AC.createOscillator(), g = AC.createGain(); osc.type = o.type || 'triangle'; osc.frequency.value = f;
  const a = o.a ?? .01, peak = o.v ?? .12;
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(.0008, t + dur);
  osc.connect(g); g.connect(o.dest || bus); osc.start(t); osc.stop(t + dur + .05);
}
const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
function makeVoice(id){
  const bus = gainN(0); bus.connect(OUT);
  bus.gain.linearRampToValueAtTime(1, AC.currentTime + 1.2);
  const timers = [], layers = [];
  const every = (fn, min, max) => { const loop = () => { fn(); timers.push(setTimeout(loop, min + Math.random() * (max - min))); }; timers.push(setTimeout(loop, min)); };
  const seq = (stepSec, fn) => { let next = AC.currentTime + .1, step = 0; const iv = setInterval(() => { while (next < AC.currentTime + .4) { fn(next, step++); next += stepSec; } }, 90); timers.push({ iv }); };
  if (id === 'chuva') { layers.push(noiseLayer('white', [filt('highpass', 900), filt('lowpass', 7000)], .16, bus), noiseLayer('brown', [filt('lowpass', 400)], .35, bus)); every(() => { const t = AC.currentTime; note(bus, 1800 + Math.random() * 2400, t, .05, { type:'sine', v:.02, a:.002 }); }, 60, 260); }
  if (id === 'ruido') layers.push(noiseLayer('white', [filt('lowpass', 8000)], .07, bus));
  if (id === 'ondas') { const l = noiseLayer('brown', [filt('lowpass', 800)], .25, bus); const lfo = AC.createOscillator(), lg = gainN(.22); lfo.frequency.value = .09; chain([lfo, lg, l.g.gain]); lfo.start(); layers.push(l, { s:lfo }); layers.push(noiseLayer('white', [filt('bandpass', 2500, .3)], .015, bus)); }
  if (id === 'lareira') { layers.push(noiseLayer('brown', [filt('lowpass', 500)], .32, bus)); every(() => { const t = AC.currentTime, s = AC.createBufferSource(), g = AC.createGain(), h = filt('highpass', 1500 + Math.random() * 3000); s.buffer = noiseBuf('white'); g.gain.setValueAtTime(.22 * Math.random() + .05, t); g.gain.exponentialRampToValueAtTime(.0005, t + .03 + Math.random() * .05); chain([s, h, g, bus]); s.start(t, Math.random() * 2, .1); }, 40, 420); }
  if (id === 'cafe') { layers.push(noiseLayer('brown', [filt('lowpass', 900)], .4, bus), noiseLayer('white', [filt('bandpass', 600, .8)], .03, bus)); every(() => { const t = AC.currentTime, f = 2200 + Math.random() * 1500; note(bus, f, t, .6, { type:'sine', v:.025, a:.003 }); note(bus, f * 1.48, t, .4, { type:'sine', v:.012, a:.003 }); }, 1800, 6000); }
  if (id === 'floresta') { layers.push(noiseLayer('white', [filt('bandpass', 3000, .4)], .025, bus), noiseLayer('brown', [filt('lowpass', 350)], .18, bus)); every(() => { const t = AC.currentTime, o = AC.createOscillator(), g = AC.createGain(), f = 2600 + Math.random() * 1600, n = 2 + Math.floor(Math.random() * 4); o.type = 'sine'; for (let i = 0; i < n; i++) { const tt = t + i * .14; o.frequency.setValueAtTime(f, tt); o.frequency.exponentialRampToValueAtTime(f * 1.35, tt + .08); g.gain.setValueAtTime(0, tt); g.gain.linearRampToValueAtTime(.035, tt + .02); g.gain.linearRampToValueAtTime(0, tt + .11); } chain([o, g, bus]); o.start(t); o.stop(t + n * .14 + .1); }, 1500, 5000); }
  if (id === 'piano') { const lp = filt('lowpass', 2600); lp.connect(bus); const prog = [[60,64,67,72],[57,60,64,69],[53,57,60,65],[55,59,62,67]]; const pat = [0,1,2,3,2,1,2,1];
    seq(60 / 72 / 2, (t, k) => { const ch = prog[Math.floor(k / 8) % 4]; note(bus, mtof(ch[pat[k % 8]] + (k % 16 > 7 ? 0 : 0)), t, 1.6, { v:.09, dest:lp }); if (k % 8 === 0) note(bus, mtof(ch[0] - 12), t, 2.6, { v:.08, dest:lp }); }); }
  if (id === 'lofi') { const lp = filt('lowpass', 1300); lp.connect(bus); layers.push(noiseLayer('white', [filt('highpass', 3000)], .012, bus)); const prog = [[62,65,69,72],[55,59,62,65],[60,64,67,71],[57,61,64,67]];
    seq(60 / 78 / 2, (t, k) => { const ch = prog[Math.floor(k / 8) % 4];
      if (k % 8 === 0 || k % 8 === 3) ch.forEach((m, i) => note(bus, mtof(m), t + i * .015, 1.4, { type:'sine', v:.05, a:.02, dest:lp }));
      if (k % 4 === 0) { const o = AC.createOscillator(), g = AC.createGain(); o.frequency.setValueAtTime(110, t); o.frequency.exponentialRampToValueAtTime(40, t + .18); g.gain.setValueAtTime(.35, t); g.gain.exponentialRampToValueAtTime(.001, t + .25); chain([o, g, bus]); o.start(t); o.stop(t + .3); }
      if (k % 2 === 1) { const s = AC.createBufferSource(), g = AC.createGain(); s.buffer = noiseBuf('white'); g.gain.setValueAtTime(.03, t); g.gain.exponentialRampToValueAtTime(.0005, t + .05); chain([s, filt('highpass', 6000), g, bus]); s.start(t, Math.random(), .08); }
      if (k % 8 === 0) note(bus, mtof(ch[0] - 24), t, 1.5, { type:'sine', v:.16, dest:lp }); }); }
  if (id === 'cordas') { const lp = filt('lowpass', 1400); lp.connect(bus); const prog = [[48,55,64,67],[45,52,60,64],[41,48,57,65],[43,50,59,62]];
    seq(4, (t, k) => { prog[k % 4].forEach(m => { [0, 4].forEach(det => { const o = AC.createOscillator(), g = AC.createGain(); o.type = 'sawtooth'; o.frequency.value = mtof(m); o.detune.value = det; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.022, t + 1.6); g.gain.linearRampToValueAtTime(0, t + 4.4); chain([o, g, lp]); o.start(t); o.stop(t + 4.5); }); }); }); }
  if (id === 'jazz') { const lp = filt('lowpass', 2200); lp.connect(bus); layers.push(noiseLayer('white', [filt('bandpass', 5000, .6)], .008, bus)); const prog = [[62,65,69,72],[67,71,74,77],[60,64,67,71],[60,64,67,71]]; const walk = [[50,52,53,55],[55,57,59,60],[48,50,52,53],[48,47,45,43]];
    seq(60 / 120, (t, k) => { const bar = Math.floor(k / 4) % 4; note(bus, mtof(walk[bar][k % 4] - 12), t, .5, { v:.18, dest:lp }); if (k % 4 === 1 || k % 4 === 3) prog[bar].forEach(m => note(bus, mtof(m), t + .02, .35, { v:.035, dest:lp })); }); }
  return { stop(){ const t = AC.currentTime; bus.gain.cancelScheduledValues(t); bus.gain.setValueAtTime(bus.gain.value, t); bus.gain.linearRampToValueAtTime(0, t + .4); timers.forEach(x => x.iv ? clearInterval(x.iv) : clearTimeout(x)); setTimeout(() => { layers.forEach(l => { try { l.s.stop(); } catch (e) {} }); bus.disconnect(); }, 500); } };
}
function playAudio(){ audioUnlock(); S.sound.playing = true; if (AC) { if (voice) voice.stop(); voice = makeVoice(S.sound.track); } }
function pauseAudio(){ S.sound.playing = false; if (voice) { voice.stop(); voice = null; } }
function stopAudio(){ pauseAudio(); }
function restartAudio(){ if (S.sound.playing) playAudio(); }
function nextTrack(dir, auto){
  const list = TRACKS.musicas.some(t => t.id === S.sound.track) ? TRACKS.musicas : TRACKS.ambiente;
  let i = list.findIndex(t => t.id === S.sound.track);
  if (auto && S.sound.mode === 'repeat') { S.sound.pos = 0; return; }
  if (S.sound.mode === 'shuffle' && list.length > 1) { let j; do { j = Math.floor(Math.random() * list.length); } while (j === i); i = j; } else i = (i + dir + list.length) % list.length;
  S.sound.track = list[i].id; S.sound.pos = 0; if (S.sound.playing) playAudio();
}
function beep(){
  if (S.watch.silent || !S.watch.volume || !connected() && !S.watch.paired && S.watch.battery <= 0) { vibrate(); return; }
  vibrate();
  if (!AC) return; const v = S.watch.volume / 100 * .35, t = AC.currentTime;
  [0, .28, .56].forEach(d => note(OUT, 1320, t + d, .2, { type:'square', v:v * .5, a:.005 }));
}
function tick2(){ if (!AC) return; note(OUT, 1000, AC.currentTime, .08, { type:'sine', v:S.watch.volume / 100 * .25, a:.003 }); }
