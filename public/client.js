const socket = io();
let state = null, previousEra = '', previousRewards = new Set(), particles = [], soundOn = false, audio;
const $ = id => document.getElementById(id);
const canvas = $('world');
const ctx = canvas.getContext('2d');
function resize(){ canvas.width = canvas.clientWidth * devicePixelRatio; canvas.height = canvas.clientHeight * devicePixelRatio; }
addEventListener('resize', resize); resize();
function initAudio(){ if(!audio) audio = new (window.AudioContext || window.webkitAudioContext)(); }
function beep(freq = 440, dur = 0.08, type = 'sine'){ if(!soundOn) return; initAudio(); const osc = audio.createOscillator(); const gain = audio.createGain(); osc.type = type; osc.frequency.value = freq; gain.gain.value = 0.035; osc.connect(gain); gain.connect(audio.destination); osc.start(); gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + dur); osc.stop(audio.currentTime + dur); }
function showReward(reward){ const el = document.createElement('div'); el.className = 'reward'; el.innerHTML = reward.badge ? `🏅 <b>${reward.badge.title}</b><small>${reward.badge.description}</small>` : `✦ <b>${reward.label}</b>`; $('rewards').appendChild(el); beep(reward.badge ? 880 : 660, .16, 'triangle'); setTimeout(() => el.remove(), 3800); }
function showTransition(from, to){ $('transitionText').textContent = `${from} → ${to}`; $('transition').classList.remove('hidden'); beep(220, .4, 'sawtooth'); setTimeout(() => $('transition').classList.add('hidden'), 2400); }
socket.on('state', next => { state = next; render(next); });
socket.on('toast', msg => { console.log(msg); beep(520, .05); });
function render(s){
  document.body.className = `theme-${s.era.theme || 'origin'} entropy-${Math.min(5, Math.floor(s.resources.entropy / 25))}`;
  if(previousEra && previousEra !== s.era.name) showTransition(previousEra, s.era.name); previousEra = s.era.name;
  (s.rewards || []).forEach(r => { if(!previousRewards.has(r.id)){ previousRewards.add(r.id); showReward(r); } });
  $('status').textContent = s.status.toUpperCase(); $('eraName').textContent = s.era.name; $('eraText').textContent = `${s.chapter} • ${s.era.description}`; $('eraDesc').textContent = s.era.educationalFacts.join(' • '); $('progress').style.width = `${Math.max(0, Math.min(100, s.progress))}%`;
  $('resources').innerHTML = Object.entries(s.resources).map(([k,v]) => `<div class="bar"><label><span>${k}</span><b>${Math.round(v)}</b></label><div class="track"><i class="fill ${k==='entropy'||v<25?'warn':''}" style="width:${Math.min(100,k==='entropy'?v/1.5:v)}%"></i></div></div>`).join('');
  $('ora').innerHTML = oraLine(s);
  $('objectives').innerHTML = s.objectives.map(o => `<div class="objective ${o.complete?'done':''}"><b>${o.complete?'✓':'◇'} ${o.title}</b><small>${o.hint}</small></div>`).join('');
  $('badges').innerHTML = Object.values(s.achievements || {}).map(a => `<span class="badge">🏅 ${a.title}</span>`).join('') || '<small>No badges yet.</small>';
  $('event').innerHTML = s.currentEvent ? `<h2>${s.currentEvent.title}</h2><p>${s.currentEvent.educationalContext}</p><p>${s.currentEvent.description}</p>${s.currentEvent.choices.map((ch,i)=>`<div class="choice"><b>${ch.label}</b><p>${ch.description}</p><small>${ch.ethicsNote}</small><br><button onclick="choose('${s.currentEvent.id}',${i})">SELECT</button></div>`).join('')}` : '<p>No active event. Use SIMULATE 3 or wait for the worldline.</p>';
  $('missions').innerHTML = s.missions.map(m => `<div class="mission">${m.complete?'✅':'⬡'} <b>${m.title}</b><br><small>${Object.entries(m.requirements).map(([k,v])=>`${k}>${v}`).join(', ')}</small></div>`).join('');
  $('tech').innerHTML = s.era.technologyUnlocks.map(t => `<span class="tech">${t}</span>`).join('');
  $('upgrades').innerHTML = s.availableUpgrades.map(u => `<div class="upgrade"><b>${u.module}</b> <small>${u.id}</small><p>${u.description}</p><small>Requires ${u.requiredEra} • Cost ${Object.entries(u.cost).map(([k,v])=>`${k}:${v}`).join(' ')}</small><br><button onclick="cmd('UPGRADE ${u.id}')">UPGRADE</button></div>`).join('');
  $('log').innerHTML = s.log.map(l => `<div>› ${l}</div>`).join('');
}
function oraLine(s){ const time = Math.ceil((s.onboarding?.secondsRemaining || 0)/60); if(s.chapter === 'Operator Initiation') return `<div class="ora"><b>ORA:</b> Initiation window: ${time}m. Run STATUS, compile a safe patch, and keep coherence high. I am scripted today; autonomy remains disabled.</div>`; if(s.resources.entropy > 90) return '<div class="ora danger"><b>ORA:</b> Entropy is spiking. COOL or ethical event choices are recommended.</div>'; if(s.era.name === 'Quantum Threshold') return '<div class="ora"><b>ORA:</b> Final MVP mission active: stabilize Quantum Threshold without collapse.</div>'; return '<div class="ora"><b>ORA:</b> Balance progress with ethics. Fast growth without trust creates hidden instability.</div>'; }
function choose(eventId, choiceIndex){ socket.emit('choice', { eventId, choiceIndex }); }
function cmd(x){ socket.emit('command', x); }
$('cmdForm').onsubmit = e => { e.preventDefault(); cmd($('cmd').value); $('cmd').value = ''; };
$('compile').onclick = () => socket.emit('patch', $('patch').value);
$('sound').onclick = () => { soundOn = !soundOn; $('sound').textContent = soundOn ? '🔊 Sound' : '🔇 Sound'; beep(440); };
$('save').onclick = () => { localStorage.setItem('devs-gaia-save', JSON.stringify(state)); $('importBox').value = JSON.stringify(state); showReward({ id: `save-${Date.now()}`, label: 'Run exported to localStorage' }); };
$('load').onclick = () => { const raw = $('importBox').value || localStorage.getItem('devs-gaia-save'); try { socket.emit('importState', JSON.parse(raw)); } catch { alert('Invalid save JSON'); } };
document.querySelectorAll('.mobile-nav button').forEach(btn => btn.onclick = () => $(btn.dataset.jump).scrollIntoView({ behavior:'smooth', block:'start' }));
function draw(){
  requestAnimationFrame(draw); if(!state) return; const w = canvas.width, h = canvas.height, entropy = state.resources.entropy; ctx.clearRect(0,0,w,h); const line = getComputedStyle(document.body).getPropertyValue('--line') || '#22d3ee';
  if(entropy > 70){ ctx.fillStyle = `rgba(251, 113, 133, ${(entropy-70)/230})`; ctx.fillRect(0,0,w,h); }
  ctx.save(); ctx.translate(w/2,h/2); const rad = Math.min(w,h)*.23*(1+Math.sin(performance.now()/180)*(entropy/900)); const g = ctx.createRadialGradient(-rad/3,-rad/3,10,0,0,rad); g.addColorStop(0,'#e0f2fe'); g.addColorStop(.35,line); g.addColorStop(1, entropy>95?'#7f1d1d':'#020617'); ctx.fillStyle=g; ctx.shadowColor=line; ctx.shadowBlur=35+entropy/2; ctx.beginPath(); ctx.arc(0,0,rad,0,Math.PI*2); ctx.fill(); ctx.strokeStyle=entropy>80?'rgba(251,113,133,.55)':'rgba(255,255,255,.22)'; for(let i=0;i<6;i++){ctx.beginPath(); ctx.ellipse(0,0,rad*(1.15+i*.13),rad*(.25+i*.04),performance.now()/3000+i,0,7); ctx.stroke()} ctx.restore();
  if(particles.length < 160) particles.push({x:Math.random()*w,y:Math.random()*h,v:1+Math.random()*2}); ctx.fillStyle = entropy>85 ? '#fb7185' : line; particles.forEach(p => { p.y += p.v*(1+entropy/80); if(p.y>h) p.y=0; ctx.globalAlpha=.18+Math.random()*.55; ctx.fillRect(p.x,p.y,2*devicePixelRatio,(12+entropy/4)*devicePixelRatio); }); ctx.globalAlpha=1;
}
draw();
