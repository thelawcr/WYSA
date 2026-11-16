(() => {
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

/* ================= Categorías e íconos ================= */
const CATS = [
  {id:'food', n:'Comida', e:'M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M17 21V3c-2.5 1.5-3.5 4-3.5 7 0 2 1 3 3.5 3', c:'#ff9f43', k:'out'},
  {id:'trans', n:'Transporte', e:'M5 4h14a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zM4 11h16M8 20v-3M16 20v-3M8 14h.01M16 14h.01', c:'#54a0ff', k:'out'},
  {id:'home', n:'Casa', e:'M3 11l9-8 9 8M5 10v10h14V10M10 20v-6h4v6', c:'#a29bfe', k:'out'},
  {id:'fun', n:'Ocio', e:'M4 5h16v14H4zM10 9l5 3-5 3z', c:'#ff6b8b', k:'out'},
  {id:'health', n:'Salud', e:'M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z', c:'#1dd1a1', k:'out'},
  {id:'shop', n:'Compras', e:'M5 8h14l-1 12H6zM9 8V6a3 3 0 0 1 6 0v2', c:'#feca57', k:'out'},
  {id:'bills', n:'Servicios', e:'M13 2L5 14h6l-1 8 8-12h-6z', c:'#48dbfb', k:'out'},
  {id:'other', n:'Otros', e:'M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M18 6l-2.5 2.5M8.5 15.5L6 18', c:'#c8d6e5', k:'out'},
  {id:'salary', n:'Salario', e:'M4 8h16v11H4zM9 8V5h6v3M4 13h16', c:'#5ef2c0', k:'in'},
  {id:'extra', n:'Extra', e:'M4 11h16v9H4zM3 8h18v3H3zM12 8v12M12 8c-3 0-4-4-1.5-4S12 8 12 8zM12 8c3 0 4-4 1.5-4S12 8 12 8z', c:'#7bed9f', k:'in'},
  {id:'sale', n:'Ventas', e:'M3 12V4h8l10 10-8 8zM7.5 8h.01', c:'#55efc4', k:'in'},
  {id:'oin', n:'Otros', e:'M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M18 6l-2.5 2.5M8.5 15.5L6 18', c:'#c8d6e5', k:'in'},
];
const TR_ICON = 'M4 8h14M14 4l4 4-4 4M20 16H6M10 12l-4 4 4 4';
const GOAL_ICON = 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 12h.01';
const ACC_ICON = {
  cash: 'M3 7h18v10H3zM12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z',
  bank: 'M3 6h18v12H3zM3 10h18M7 15h4',
  save: 'M12 3l8 3v6c0 4-3.5 7.5-8 9-4.5-1.5-8-5-8-9V6z',
};
const ACC_COLORS = ['#19d3b0', '#8b7bff', '#ff9f43', '#54a0ff', '#ff6b8b', '#feca57'];
const svg = (d, col) => `<svg viewBox="0 0 24 24" style="stroke:${col}"><path d="${d}"/></svg>`;
const ic = c => svg(c.e, c.c);
const aic = a => svg(ACC_ICON[a.type] || ACC_ICON.cash, a.color);
const PLUS = '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>';
const CHEV = '<svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>';
const CHECK = '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
const SYM = {CRC:'₡', USD:'$', EUR:'€', MXN:'$', COP:'$', GTQ:'Q'};

/* ================= Almacenamiento ================= */
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

const defAccs = () => [
  {id:'cash', name:'Efectivo', type:'cash', color:ACC_COLORS[0], init:0},
  {id:'card', name:'Tarjeta', type:'bank', color:ACC_COLORS[1], init:0},
  {id:'savings', name:'Ahorros', type:'save', color:ACC_COLORS[2], init:0},
];
let accounts = load('wysa_acc', null);
if (!Array.isArray(accounts) || !accounts.length) { accounts = defAccs(); save('wysa_seed3', true); }
else if (!load('wysa_seed3', false)) {
  if (accounts.length === 1 && accounts[0].id === 'cash') accounts = accounts.concat(defAccs().slice(1));
  save('wysa_seed3', true);
}
let tx = load('wysa_tx', []);
let cur = load('wysa_cur', 'CRC');
let budget = +load('wysa_budget', 0) || 0;
let recs = load('wysa_rec', []);
let goals = load('wysa_goals', []);
let cb = load('wysa_cb', {});
let theme = load('wysa_theme', 'dark');
tx.forEach(t => { if (t.type !== 'tr' && !t.acc) t.acc = accounts[0].id; });
save('wysa_acc', accounts); save('wysa_tx', tx);

/* ================= Estado de interfaz ================= */
let tab = 'home', range = 'day', sel = 'all';
let type = 'out', catId = null, editId = null, accId = null, fromId = null, toId = null, payRec = null;
let accEditId = null, accKind = 'cash', accColor = ACC_COLORS[0];
let recEditId = null, recCat = 'bills', recAcc = null;
let goalEditId = null, goalColor = ACC_COLORS[1], contribId = null, contribMode = 'add';
let cbCat = null;
const flt = {q:'', type:'all', period:'all', acc:'all', cat:'all'};
let seen = new Set(), donutSel = null, donutRows = [], donutTot = 0, donutKey = '', trendKey = '';

/* ================= Utilidades ================= */
const fmt = n => {
  try { return new Intl.NumberFormat('es-CR', {style:'currency', currency:cur, maximumFractionDigits: cur==='CRC'||cur==='COP'?0:2}).format(n); }
  catch { return SYM[cur] + n.toFixed(2); }
};
const today = () => { const d = new Date(); d.setMinutes(d.getMinutes()-d.getTimezoneOffset()); return d.toISOString().slice(0,10); };
const ymd = off => { const d = new Date(); d.setDate(d.getDate() - off); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0,10); };
const cat = id => CATS.find(c => c.id === id) || CATS[7];
const acc = id => accounts.find(a => a.id === id);
const esc = s => String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const num = v => parseFloat(String(v).replace(',', '.'));
const norm = s => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const open = el => el.classList.add('open');
const close = el => el.classList.remove('open');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

function inRange(date, r) {
  const d = new Date(date + 'T00:00:00'), n = new Date(); n.setHours(0,0,0,0);
  const diff = Math.round((n - d) / 864e5);
  if (r === 'day') return diff === 0;
  if (r === 'week') return diff >= 0 && diff < 7;
  return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear();
}
function dayLabel(date) {
  const diff = Math.round((new Date(today()+'T00:00:00') - new Date(date+'T00:00:00')) / 864e5);
  if (diff === 0) return 'Hoy';
  if (diff === 1) return 'Ayer';
  return new Date(date+'T00:00:00').toLocaleDateString('es', {weekday:'long', day:'numeric', month:'short'});
}
function accBal(id) {
  const a = acc(id); let b = a ? +a.init || 0 : 0;
  tx.forEach(t => {
    if (t.type === 'in' && t.acc === id) b += t.amount;
    else if (t.type === 'out' && t.acc === id) b -= t.amount;
    else if (t.type === 'tr') { if (t.to === id) b += t.amount; if (t.from === id) b -= t.amount; }
  });
  return b;
}
const inView = t => sel === 'all' || (t.type === 'tr' ? (t.from === sel || t.to === sel) : t.acc === sel);
const monthSpent = (filter) => { const now = new Date(); return tx.filter(t => { const d = new Date(t.date + 'T00:00:00'); return t.type === 'out' && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && (!filter || filter(t)); }).reduce((a, t) => a + t.amount, 0); };

function tween(el, to) {
  const from = el._v ?? 0; el._v = to;
  if (reduce || from === to) { el.textContent = fmt(to); return; }
  const t0 = performance.now(), dur = 700;
  cancelAnimationFrame(el._raf);
  const step = now => {
    const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 4);
    el.textContent = fmt(from + (to - from) * e);
    if (p < 1) el._raf = requestAnimationFrame(step);
  };
  el._raf = requestAnimationFrame(step);
}

/* ================= Navegación ================= */
function go(name) {
  tab = name;
  $$('.page').forEach(p => p.classList.toggle('on', p.id === 'p-' + name));
  $$('.tab').forEach(b => b.classList.toggle('on', b.dataset.tab === name));
  window.scrollTo({top: 0});
  if (name === 'stats') { donutKey = ''; trendKey = ''; renderStats(); }
  if (name === 'moves') renderMoves();
  if (name === 'settings') renderSettings();
}
$('.tabbar').onclick = e => { const b = e.target.closest('[data-tab]'); if (b) go(b.dataset.tab); };
$('#seeAll').onclick = () => go('moves');

/* ================= Render general ================= */
function render() {
  if (sel !== 'all' && !acc(sel)) sel = 'all';
  if (flt.acc !== 'all' && !acc(flt.acc)) flt.acc = 'all';
  renderHome();
  if (tab === 'moves') renderMoves();
  if (tab === 'stats') renderStats();
  if (tab === 'settings') renderSettings();
}

/* ---------- Ítems de movimiento ---------- */
function itemHTML(t, ctx, fresh, i) {
  const cls = 'item glass' + (fresh ? ' enter' : ''), st = `data-id="${t.id}" style="--i:${i}"`;
  const del = `<button class="del" data-id="${t.id}" aria-label="Eliminar"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button>`;
  if (t.type === 'tr') {
    const f = acc(t.from), to = acc(t.to);
    const sign = ctx === 'all' ? '' : (t.to === ctx ? '+' : '−'), kls = ctx === 'all' ? 'tr' : (t.to === ctx ? 'in' : 'out');
    return `<div class="${cls}" ${st}><div class="ico" style="background:linear-gradient(135deg,#8b7bff40,#8b7bff12);box-shadow:inset 0 1px 0 var(--shine)">${svg(TR_ICON, '#a99dff')}</div>
      <div class="m"><b>Transferencia</b><span>${esc(f ? f.name : '?')} → ${esc(to ? to.name : '?')}${t.note ? ' · ' + esc(t.note) : ''}</span></div>
      <div class="a ${kls}">${sign}${fmt(t.amount)}</div>${del}</div>`;
  }
  const c = cat(t.cat), a = acc(t.acc);
  const sub = [ctx === 'all' && accounts.length > 1 && a ? a.name : '', t.note || ''].filter(Boolean).map(esc).join(' · ');
  return `<div class="${cls}" ${st}><div class="ico" style="background:linear-gradient(135deg,${c.c}40,${c.c}12);box-shadow:inset 0 1px 0 var(--shine)">${ic(c)}</div>
    <div class="m"><b>${c.n}</b><span>${sub}</span></div>
    <div class="a ${t.type}">${t.type==='in'?'+':'−'}${fmt(t.amount)}</div>${del}</div>`;
}
function listHTML(list, ctx, track) {
  const sorted = [...list].sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);
  let html = '', last = '', n = 0;
  sorted.forEach(t => {
    if (t.date !== last) { html += `<div class="day">${dayLabel(t.date)}</div>`; last = t.date; }
    const fresh = track && !seen.has(t.id);
    html += itemHTML(t, ctx, fresh, fresh ? n++ : 0);
  });
  return html;
}
function onListClick(e) {
  const b = e.target.closest('.del');
  if (!b) { const it = e.target.closest('.item'); const t = it && tx.find(x => x.id === +it.dataset.id); if (t) openSheet(t); return; }
  const row = b.closest('.item'), id = +b.dataset.id;
  const done = () => { tx = tx.filter(t => t.id !== id); save('wysa_tx', tx); render(); };
  if (reduce) return done();
  row.classList.add('leave'); setTimeout(done, 320);
}
$('#recent').onclick = onListClick;
$('#mList').onclick = onListClick;

/* ================= INICIO ================= */
function renderHome() {
  const view = tx.filter(inView);
  const inc = view.filter(t => t.type==='in').reduce((a,t)=>a+t.amount,0);
  const out = view.filter(t => t.type==='out').reduce((a,t)=>a+t.amount,0);
  const total = sel === 'all' ? accounts.reduce((a, x) => a + accBal(x.id), 0) : accBal(sel);
  $('#balLabel').textContent = sel === 'all' ? 'Saldo total' : 'Saldo · ' + acc(sel).name;
  tween($('#balance'), total); tween($('#totIn'), inc); tween($('#totOut'), out);
  $('#curSym').textContent = SYM[cur];
  const h = new Date().getHours();
  $('#greeting').textContent = h < 12 ? 'Buenos días' : h < 19 ? 'Buenas tardes' : 'Buenas noches';
  renderAccs(); renderBudget(); renderFixed(); renderGoals();
  const recent = [...view].sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id).slice(0, 6);
  $('#recent').innerHTML = recent.length ? listHTML(recent, sel, true) : '<div class="empty">Aún no hay movimientos.<br>Toca + para agregar el primero.</div>';
  seen = new Set(recent.map(t => t.id));
  $('#seeAll').hidden = tx.length <= 6;
}

function renderAccs() {
  const box = $('#accs'), keep = box.scrollLeft;
  const card = (id, name, bal, icon, color) =>
    `<button class="acard glass${sel === id ? ' on' : ''}" data-id="${id}" style="--ac:${color}">
      <span class="ai">${icon}</span><span class="an">${esc(name)}</span><b class="ab">${fmt(bal)}</b>
      ${sel === id && id !== 'all' ? '<span class="ae"><svg viewBox="0 0 24 24"><path d="M4 20h4L19 9l-4-4L4 16zM14 6l4 4"/></svg></span>' : ''}</button>`;
  const allTotal = accounts.reduce((a, x) => a + accBal(x.id), 0);
  box.innerHTML = (accounts.length > 1 ? card('all', 'Todas', allTotal, svg('M4 7h16M4 12h16M4 17h16', '#c8d6e5'), '#c8d6e5') : '')
    + accounts.map(a => card(a.id, a.name, accBal(a.id), aic(a), a.color)).join('')
    + '<button class="acard aadd glass" id="accAdd" aria-label="Nueva cuenta"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg><span class="an">Cuenta</span></button>';
  box.scrollLeft = keep;
}
$('#accs').onclick = e => {
  if (e.target.closest('#accAdd')) return openAccSheet(null);
  const c = e.target.closest('.acard'); if (!c) return;
  const id = c.dataset.id;
  if (id !== 'all' && sel === id) return openAccSheet(acc(id));
  sel = id; render();
};

function renderBudget() {
  const el = $('#budgetCard');
  if (!(budget > 0)) { el.innerHTML = '<button class="bset" id="bSet"><span>Definir presupuesto mensual</span>' + CHEV + '</button>'; return; }
  const spent = monthSpent(), pct = spent / budget, left = budget - spent;
  const st = pct > 1 ? 'over' : pct >= .8 ? 'warn' : 'ok';
  el.innerHTML = '<button class="bset head" id="bSet"><span class="muted">Presupuesto del mes</span><span class="pc ' + st + '">' + Math.round(pct * 100) + '%</span></button>'
    + '<div class="bamt"><b>' + fmt(Math.abs(left)) + '</b><span class="muted">' + (left >= 0 ? 'disponible' : 'por encima del límite') + '</span></div>'
    + '<div class="bt"><div class="bf ' + st + '" style="width:' + Math.min(100, pct * 100) + '%"></div></div>'
    + '<p class="muted bnote">' + fmt(spent) + ' de ' + fmt(budget) + '</p>';
}
$('#budgetCard').onclick = e => { if (e.target.closest('#bSet')) { go('settings'); if (!budget) setTimeout(() => $('#budgetIn').focus(), 300); } };

/* ---------- Gastos fijos ---------- */
const PRESETS = [
  {n:'Luz', c:'bills'}, {n:'Agua', c:'bills'}, {n:'Cable', c:'bills'}, {n:'Internet', c:'bills'},
  {n:'Teléfono', c:'bills'}, {n:'Spotify', c:'fun'}, {n:'Netflix', c:'fun'}, {n:'Alquiler', c:'home'},
];
const daysIn = (y, m) => new Date(y, m + 1, 0).getDate();
function recInfo(r) {
  const now = new Date(), ym = today().slice(0, 7);
  const paidTx = tx.find(t => t.rec === r.id && t.date.slice(0, 7) === ym);
  const dueDay = Math.min(r.day, daysIn(now.getFullYear(), now.getMonth()));
  const diff = dueDay - now.getDate();
  return {paidTx, dueDay, diff, state: paidTx ? 'paid' : diff < 0 ? 'over' : diff <= 3 ? 'soon' : 'ok'};
}
function renderFixed() {
  const el = $('#fixedCard');
  if (!recs.length) { el.innerHTML = '<button class="bset" id="recAdd"><span>Agregar gastos fijos (luz, agua, Netflix…)</span>' + CHEV + '</button>'; return; }
  const info = recs.map(r => [r, recInfo(r)]).sort((a, b) => a[1].dueDay - b[1].dueDay || a[0].name.localeCompare(b[0].name));
  const pend = info.filter(([, i]) => !i.paidTx), pendSum = pend.reduce((a, [r]) => a + r.amount, 0);
  const rows = info.map(([r, i]) => {
    const c = cat(r.cat);
    const sub = i.state === 'paid' ? 'Pagado el ' + new Date(i.paidTx.date + 'T00:00:00').getDate()
      : i.state === 'over' ? 'Vencido · día ' + i.dueDay
      : i.diff === 0 ? 'Vence hoy'
      : i.state === 'soon' ? 'Vence en ' + i.diff + (i.diff === 1 ? ' día' : ' días')
      : 'Día ' + i.dueDay;
    return '<div class="rrow" data-id="' + r.id + '"><div class="ico" style="background:linear-gradient(135deg,' + c.c + '40,' + c.c + '12);box-shadow:inset 0 1px 0 var(--shine)">' + ic(c) + '</div>'
      + '<div class="m"><b>' + esc(r.name) + '</b><span class="rs ' + i.state + '">' + sub + ' · ' + fmt(r.amount) + '</span></div>'
      + (i.paidTx ? '<span class="paidtag" aria-label="Pagado">' + CHECK + '</span>' : '<button class="paybtn" data-pay="' + r.id + '">Pagar</button>') + '</div>';
  }).join('');
  el.innerHTML = '<div class="fhead"><div><span class="muted">Gastos fijos del mes</span><b class="fsum">' + (pend.length ? fmt(pendSum) + ' pendiente' : 'Todo pagado') + '</b></div>'
    + '<button class="mini" id="recAdd" aria-label="Agregar gasto fijo">' + PLUS + '</button></div>' + rows;
}
$('#fixedCard').onclick = e => {
  if (e.target.closest('#recAdd')) return openRecSheet(null);
  const p = e.target.closest('[data-pay]'); if (p) return openPay(recs.find(r => r.id === p.dataset.pay));
  const row = e.target.closest('.rrow'); if (row) openRecSheet(recs.find(r => r.id === row.dataset.id));
};
function openPay(r) {
  if (!r) return;
  openSheet(null);
  type = 'out'; catId = r.cat; accId = acc(r.acc) ? r.acc : accounts[0].id; payRec = r.id;
  $$('#type button').forEach(x => x.classList.toggle('on', x.dataset.t === 'out'));
  $('#amount').value = String(r.amount); $('#note').value = r.name; $('#btnSave').textContent = 'Registrar pago';
  renderCats(); renderAccRow();
}
function openRecSheet(r) {
  recEditId = r ? r.id : null; recCat = r ? r.cat : 'bills'; recAcc = r && acc(r.acc) ? r.acc : accounts[0].id;
  $('#recTitle').textContent = r ? 'Editar gasto fijo' : 'Nuevo gasto fijo';
  $('#recName').value = r ? r.name : ''; $('#recAmount').value = r ? String(r.amount) : ''; $('#recDay').value = r ? String(r.day) : '';
  $('#recDel').style.display = r ? '' : 'none';
  $('#recPresets').style.display = r ? 'none' : '';
  paintRec(); open($('#recSheet'));
  if (!r) setTimeout(() => $('#recName').focus(), 350);
}
function paintRec() {
  $('#recPresets').innerHTML = PRESETS.map(p => '<button type="button" class="chip" data-p="' + p.n + '">' + p.n + '</button>').join('');
  $('#recCats').innerHTML = CATS.filter(c => c.k === 'out').map(c => '<button type="button" class="cat' + (c.id === recCat ? ' on' : '') + '" data-c="' + c.id + '"><i>' + ic(c) + '</i>' + c.n + '</button>').join('');
  $('#recAcc').innerHTML = accounts.map(a => '<button type="button" class="chip' + (a.id === recAcc ? ' on' : '') + '" data-id="' + a.id + '"><span class="dot" style="background:' + a.color + '"></span>' + esc(a.name) + '</button>').join('');
}
$('#recPresets').onclick = e => { const b = e.target.closest('[data-p]'); if (!b) return; const p = PRESETS.find(x => x.n === b.dataset.p); $('#recName').value = p.n; recCat = p.c; paintRec(); $('#recAmount').focus(); };
$('#recCats').onclick = e => { const b = e.target.closest('.cat'); if (b) { recCat = b.dataset.c; paintRec(); } };
$('#recAcc').onclick = e => { const b = e.target.closest('[data-id]'); if (b) { recAcc = b.dataset.id; paintRec(); } };
$('#recForm').onsubmit = e => {
  e.preventDefault();
  const name = $('#recName').value.trim().slice(0, 24), amount = num($('#recAmount').value), day = Math.round(num($('#recDay').value));
  if (!name) return $('#recName').focus();
  if (!(amount > 0)) return $('#recAmount').focus();
  if (!(day >= 1 && day <= 31)) return $('#recDay').focus();
  const data = {name, amount, day, cat: recCat, acc: recAcc};
  if (recEditId) recs = recs.map(r => r.id === recEditId ? {...r, ...data} : r);
  else recs.push({id: 'r' + Date.now().toString(36), ...data});
  save('wysa_rec', recs); render(); close($('#recSheet'));
};
$('#recDel').onclick = () => {
  const r = recs.find(x => x.id === recEditId); if (!r) return;
  if (!confirm('¿Eliminar el gasto fijo "' + r.name + '"? Los pagos ya registrados se conservan.')) return;
  recs = recs.filter(x => x.id !== recEditId); save('wysa_rec', recs); render(); close($('#recSheet'));
};

/* ---------- Metas de ahorro ---------- */
function renderGoals() {
  const el = $('#goalsCard');
  if (!goals.length) { el.innerHTML = '<button class="bset" id="goalAdd"><span>Crear una meta de ahorro</span>' + CHEV + '</button>'; return; }
  const saved = goals.reduce((a, g) => a + g.saved, 0), target = goals.reduce((a, g) => a + g.target, 0);
  const rows = goals.map(g => {
    const pct = Math.min(100, g.saved / g.target * 100), done = g.saved >= g.target;
    return '<div class="rrow" data-id="' + g.id + '"><div class="ico" style="background:linear-gradient(135deg,' + g.color + '40,' + g.color + '12);box-shadow:inset 0 1px 0 var(--shine)">' + svg(GOAL_ICON, g.color) + '</div>'
      + '<div class="m"><b>' + esc(g.name) + '</b><div class="gbar"><div class="gf" style="width:' + pct + '%;background:' + g.color + '"></div></div>'
      + '<span class="rs ' + (done ? 'paid' : '') + '">' + (done ? 'Meta lograda · ' : '') + fmt(g.saved) + ' de ' + fmt(g.target) + ' · ' + Math.round(g.saved / g.target * 100) + '%</span></div>'
      + (done ? '<span class="paidtag" aria-label="Meta lograda">' + CHECK + '</span>' : '<button class="paybtn" data-contrib="' + g.id + '">Aportar</button>') + '</div>';
  }).join('');
  el.innerHTML = '<div class="fhead"><div><span class="muted">Metas de ahorro</span><b class="fsum">' + fmt(saved) + ' de ' + fmt(target) + '</b></div>'
    + '<button class="mini" id="goalAdd" aria-label="Nueva meta">' + PLUS + '</button></div>' + rows;
}
$('#goalsCard').onclick = e => {
  if (e.target.closest('#goalAdd')) return openGoalSheet(null);
  const c = e.target.closest('[data-contrib]'); if (c) return openContrib(c.dataset.contrib);
  const row = e.target.closest('.rrow'); if (row) openGoalSheet(goals.find(g => g.id === row.dataset.id));
};
function paintSwatches(box, colorVar) {
  $(box).innerHTML = ACC_COLORS.map(c => `<button type="button" class="sw${c === colorVar ? ' on' : ''}" data-c="${c}" style="background:${c}" aria-label="Color"></button>`).join('');
}
function openGoalSheet(g) {
  goalEditId = g ? g.id : null; goalColor = g ? g.color : ACC_COLORS[(goals.length + 1) % ACC_COLORS.length];
  $('#goalTitle').textContent = g ? 'Editar meta' : 'Nueva meta';
  $('#goalName').value = g ? g.name : ''; $('#goalTarget').value = g ? String(g.target) : ''; $('#goalSaved').value = g && g.saved ? String(g.saved) : '';
  $('#goalDel').style.display = g ? '' : 'none';
  paintSwatches('#goalColors', goalColor); open($('#goalSheet'));
  if (!g) setTimeout(() => $('#goalName').focus(), 350);
}
$('#goalColors').onclick = e => { const b = e.target.closest('.sw'); if (b) { goalColor = b.dataset.c; paintSwatches('#goalColors', goalColor); } };
$('#goalForm').onsubmit = e => {
  e.preventDefault();
  const name = $('#goalName').value.trim().slice(0, 24), target = num($('#goalTarget').value), sv = num($('#goalSaved').value), saved = sv > 0 ? sv : 0;
  if (!name) return $('#goalName').focus();
  if (!(target > 0)) return $('#goalTarget').focus();
  if (goalEditId) goals = goals.map(g => g.id === goalEditId ? {...g, name, target, saved, color: goalColor} : g);
  else goals.push({id: 'g' + Date.now().toString(36), name, target, saved, color: goalColor});
  save('wysa_goals', goals); render(); close($('#goalSheet'));
};
$('#goalDel').onclick = () => {
  const g = goals.find(x => x.id === goalEditId); if (!g) return;
  if (!confirm('¿Eliminar la meta "' + g.name + '"?')) return;
  goals = goals.filter(x => x.id !== goalEditId); save('wysa_goals', goals); render(); close($('#goalSheet'));
};
function openContrib(id) {
  const g = goals.find(x => x.id === id); if (!g) return;
  contribId = id; contribMode = 'add';
  $('#contribTitle').textContent = g.name;
  $$('.csym').forEach(s => s.textContent = SYM[cur]);
  $$('#contribMode button').forEach(b => b.classList.toggle('on', b.dataset.m === 'add'));
  $('#contribAmount').value = ''; paintContrib(); open($('#contribSheet'));
  setTimeout(() => $('#contribAmount').focus(), 350);
}
function paintContrib() {
  const g = goals.find(x => x.id === contribId); if (!g) return;
  $('#contribInfo').textContent = contribMode === 'add' ? (g.saved >= g.target ? 'Meta lograda' : 'Faltan ' + fmt(g.target - g.saved)) : 'Ahorrado: ' + fmt(g.saved);
}
$('#contribMode').onclick = e => { const b = e.target.closest('button'); if (!b) return; contribMode = b.dataset.m; $$('#contribMode button').forEach(x => x.classList.toggle('on', x === b)); paintContrib(); };
$('#contribForm').onsubmit = e => {
  e.preventDefault();
  const v = num($('#contribAmount').value); if (!(v > 0)) return $('#contribAmount').focus();
  goals = goals.map(g => g.id === contribId ? {...g, saved: Math.max(0, g.saved + (contribMode === 'add' ? v : -v))} : g);
  save('wysa_goals', goals); render(); close($('#contribSheet'));
};

/* ================= MOVIMIENTOS (buscador y filtros) ================= */
const hayOf = t => norm([t.note || '', t.type === 'tr' ? 'transferencia' : cat(t.cat).n, t.type === 'tr' ? [(acc(t.from) || {}).name, (acc(t.to) || {}).name].join(' ') : (acc(t.acc) || {}).name || '', String(t.amount)].join(' '));
function filtered() {
  const q = norm(flt.q.trim());
  return tx.filter(t => {
    if (flt.type !== 'all' && t.type !== flt.type) return false;
    if (flt.period !== 'all' && !inRange(t.date, flt.period)) return false;
    if (flt.acc !== 'all' && !(t.type === 'tr' ? (t.from === flt.acc || t.to === flt.acc) : t.acc === flt.acc)) return false;
    if (flt.cat !== 'all' && t.cat !== flt.cat) return false;
    return !q || hayOf(t).includes(q);
  });
}
const catLabel = c => c.id === 'oin' ? 'Otros ingresos' : c.id === 'other' ? 'Otros gastos' : c.n;
function renderMoves() {
  $$('#fType button').forEach(b => b.classList.toggle('on', b.dataset.t === flt.type));
  $$('#fPeriod .chip').forEach(b => b.classList.toggle('on', b.dataset.p === flt.period));
  $('#fAcc').innerHTML = [['all', 'Todas', null], ...accounts.map(a => [a.id, a.name, a.color])].map(([id, n, col]) =>
    `<button class="chip${flt.acc === id ? ' on' : ''}" data-id="${id}">${col ? `<span class="dot" style="background:${col}"></span>` : ''}${esc(n)}</button>`).join('');
  $('#fCat').innerHTML = '<option value="all">Todas las categorías</option>' + CATS.map(c => `<option value="${c.id}"${flt.cat === c.id ? ' selected' : ''}>${catLabel(c)}</option>`).join('');
  const active = (flt.period !== 'all') + (flt.acc !== 'all') + (flt.cat !== 'all');
  $('#fBadge').hidden = !active; $('#fBadge').textContent = active;
  $('#fToggle').classList.toggle('active', active > 0 || !$('#fPanel').hidden);
  $('#qClear').hidden = !flt.q;
  const list = filtered();
  const out = list.filter(t => t.type === 'out').reduce((a, t) => a + t.amount, 0), inc = list.filter(t => t.type === 'in').reduce((a, t) => a + t.amount, 0);
  const filtering = flt.q || flt.type !== 'all' || active;
  $('#fSum').textContent = list.length + (list.length === 1 ? ' movimiento' : ' movimientos') + (filtering && list.length ? ' · Gastos ' + fmt(out) + ' · Ingresos ' + fmt(inc) : '');
  $('#mList').innerHTML = list.length ? listHTML(list, flt.acc, false)
    : '<div class="empty">' + (filtering ? 'No hay movimientos con esos filtros.' : 'Aún no hay movimientos.<br>Toca + para agregar el primero.') + '</div>';
}
$('#q').oninput = e => { flt.q = e.target.value; renderMoves(); };
$('#qClear').onclick = () => { flt.q = ''; $('#q').value = ''; renderMoves(); $('#q').focus(); };
$('#fType').onclick = e => { const b = e.target.closest('button'); if (b) { flt.type = b.dataset.t; renderMoves(); } };
$('#fToggle').onclick = () => { $('#fPanel').hidden = !$('#fPanel').hidden; renderMoves(); };
$('#fPeriod').onclick = e => { const b = e.target.closest('[data-p]'); if (b) { flt.period = b.dataset.p; renderMoves(); } };
$('#fAcc').onclick = e => { const b = e.target.closest('[data-id]'); if (b) { flt.acc = b.dataset.id; renderMoves(); } };
$('#fCat').onchange = e => { flt.cat = e.target.value; renderMoves(); };
$('#fReset').onclick = () => { flt.period = 'all'; flt.acc = 'all'; flt.cat = 'all'; renderMoves(); };

/* ================= RESUMEN ================= */
function renderStats() {
  $('#statAccs').innerHTML = [['all', 'Todas', null], ...accounts.map(a => [a.id, a.name, a.color])].map(([id, n, col]) =>
    `<button class="chip${sel === id ? ' on' : ''}" data-id="${id}">${col ? `<span class="dot" style="background:${col}"></span>` : ''}${esc(n)}</button>`).join('');
  $$('#range button').forEach(x => x.classList.toggle('on', x.dataset.r === range));
  const view = tx.filter(inView);
  const spent = view.filter(t => t.type === 'out' && inRange(t.date, range));
  renderDonut(spent, spent.reduce((a, t) => a + t.amount, 0));
  renderTrend(view);
  renderCB();
}
$('#statAccs').onclick = e => { const b = e.target.closest('[data-id]'); if (b) { sel = b.dataset.id; render(); } };
$('#range').onclick = e => { const b = e.target.closest('button'); if (b) { range = b.dataset.r; renderStats(); } };

/* ---------- Dona ---------- */
const D_R = 46, D_C = 2 * Math.PI * D_R, D_GAP = 2.4;
function renderDonut(spent, tot) {
  const by = {};
  spent.forEach(t => by[t.cat] = (by[t.cat] || 0) + t.amount);
  donutRows = Object.entries(by).sort((a, b) => b[1] - a[1]);
  donutTot = tot;
  if (!by[donutSel]) donutSel = null;
  const key = range + '|' + sel + '|' + donutRows.map(([id, v]) => id + v).join(',');
  if (key !== donutKey) {
    donutKey = key;
    let off = 0, html = '<circle class="dtrack" cx="60" cy="60" r="' + D_R + '"/>';
    donutRows.forEach(([id, v], i) => {
      const c = cat(id), len = v / tot * D_C, seg = donutRows.length > 1 ? Math.max(len - D_GAP, 0.5) : len;
      html += '<circle class="dseg" data-c="' + id + '" cx="60" cy="60" r="' + D_R + '" stroke="' + c.c + '" style="color:' + c.c + ';stroke-dasharray:' + seg.toFixed(2) + ' ' + D_C.toFixed(2) + ';stroke-dashoffset:' + (-off).toFixed(2) + ';animation-delay:' + (reduce ? 0 : i * 90) + 'ms"/>';
      off += len;
    });
    $('#dsvg').innerHTML = html;
    $('#legend').innerHTML = donutRows.length ? donutRows.map(([id, v]) => {
      const c = cat(id);
      return '<button class="lg" data-c="' + id + '"><span class="dot" style="background:' + c.c + '"></span><span class="ln">' + c.n + '</span><span class="lp">' + Math.round(v / tot * 100) + '%</span><b class="la">' + fmt(v) + '</b></button>';
    }).join('') : '<div class="empty">Sin gastos en este periodo</div>';
  }
  paintDonutSel();
}
function paintDonutSel() {
  const hit = donutSel ? donutRows.find(r => r[0] === donutSel) : null;
  $$('#dsvg .dseg').forEach(s => { s.classList.toggle('on', s.dataset.c === donutSel); s.classList.toggle('dim', !!donutSel && s.dataset.c !== donutSel); });
  $$('#legend .lg').forEach(b => { b.classList.toggle('on', b.dataset.c === donutSel); b.classList.toggle('dim', !!donutSel && b.dataset.c !== donutSel); });
  const el = $('#spent');
  if (hit) { cancelAnimationFrame(el._raf); el._v = hit[1]; $('#dLbl').textContent = cat(hit[0]).n; el.textContent = fmt(hit[1]); }
  else { $('#dLbl').textContent = 'Gastado'; tween(el, donutTot); }
}
const pickCat = e => { const t = e.target.closest('[data-c]'); if (!t) return; donutSel = donutSel === t.dataset.c ? null : t.dataset.c; paintDonutSel(); };
$('#legend').onclick = pickCat;
$('#dsvg').onclick = pickCat;

/* ---------- Tendencia 7 días ---------- */
let trendVals = [], trendDays = [];
function renderTrend(view) {
  trendDays = [...Array(7)].map((_, i) => ymd(6 - i));
  trendVals = trendDays.map(d => view.filter(t => t.type === 'out' && t.date === d).reduce((a, t) => a + t.amount, 0));
  const key = sel + '|' + trendVals.join(',');
  if (key === trendKey) return; trendKey = key;
  const max = Math.max(...trendVals, 1), avg = trendVals.reduce((a, b) => a + b, 0) / 7;
  $('#trend').innerHTML = trendDays.map((d, i) => {
    const l = new Date(d + 'T00:00:00').toLocaleDateString('es', {weekday: 'narrow'}).toUpperCase();
    return '<button class="tb' + (i === 6 ? ' today' : '') + '" data-i="' + i + '"><div class="bw"><i style="height:' + Math.max(trendVals[i] / max * 100, 3) + '%;--i:' + i + '"></i></div><em>' + l + '</em></button>';
  }).join('');
  $('#trCap').textContent = 'Promedio ' + fmt(avg) + ' al día';
  $('#trCap')._avg = 'Promedio ' + fmt(avg) + ' al día';
}
$('#trend').onclick = e => {
  const b = e.target.closest('.tb'); if (!b) return;
  const i = +b.dataset.i, was = b.classList.contains('on');
  $$('#trend .tb').forEach(x => x.classList.remove('on'));
  if (was) { $('#trCap').textContent = $('#trCap')._avg; return; }
  b.classList.add('on');
  $('#trCap').textContent = new Date(trendDays[i] + 'T00:00:00').toLocaleDateString('es', {weekday: 'long', day: 'numeric', month: 'short'}) + ': ' + fmt(trendVals[i]);
};

/* ---------- Presupuestos por categoría ---------- */
function renderCB() {
  const el = $('#cbCard');
  const keys = Object.keys(cb).filter(k => cb[k] > 0 && CATS.some(c => c.id === k && c.k === 'out'));
  if (!keys.length) { el.innerHTML = '<button class="bset" id="cbAdd"><span>Definir presupuestos por categoría</span>' + CHEV + '</button>'; return; }
  const rows = keys.map(k => { const s = monthSpent(t => t.cat === k); return {k, s, p: s / cb[k]}; }).sort((a, b) => b.p - a.p);
  const over = rows.filter(r => r.p > 1).length;
  el.innerHTML = '<div class="fhead"><div><span class="muted">Presupuestos por categoría · este mes</span><b class="fsum">' + (over ? over + (over === 1 ? ' categoría excedida' : ' categorías excedidas') : 'Todo en orden') + '</b></div>'
    + '<button class="mini" id="cbAdd" aria-label="Agregar límite">' + PLUS + '</button></div>'
    + rows.map(r => {
      const c = cat(r.k), st = r.p > 1 ? 'over' : r.p >= .8 ? 'warn' : 'ok', col = st === 'over' ? 'var(--out)' : st === 'warn' ? 'var(--warn)' : c.c;
      return '<div class="cbrow" data-c="' + r.k + '"><div class="l"><span>' + ic(c) + c.n + '</span><span class="pc ' + st + '">' + Math.round(r.p * 100) + '%</span></div>'
        + '<div class="gbar"><div class="gf" style="width:' + Math.min(100, r.p * 100) + '%;background:' + col + '"></div></div>'
        + '<p class="muted">' + fmt(r.s) + ' de ' + fmt(cb[r.k]) + '</p></div>';
    }).join('');
}
$('#cbCard').onclick = e => {
  if (e.target.closest('#cbAdd')) return openCbSheet(null);
  const r = e.target.closest('.cbrow'); if (r) openCbSheet(r.dataset.c);
};
function paintCb() {
  $('#cbCats').innerHTML = CATS.filter(c => c.k === 'out').map(c => `<button type="button" class="cat${c.id === cbCat ? ' on' : ''}" data-c="${c.id}"><i>${ic(c)}</i>${c.n}</button>`).join('');
  $('#cbDel').style.display = cb[cbCat] ? '' : 'none';
}
function openCbSheet(k) {
  cbCat = k || CATS.find(c => c.k === 'out' && !cb[c.id]).id;
  $('#cbAmount').value = cb[cbCat] ? String(cb[cbCat]) : '';
  paintCb(); open($('#cbSheet'));
  if (!k) setTimeout(() => $('#cbAmount').focus(), 350);
}
$('#cbCats').onclick = e => { const b = e.target.closest('.cat'); if (!b) return; cbCat = b.dataset.c; $('#cbAmount').value = cb[cbCat] ? String(cb[cbCat]) : ''; paintCb(); };
$('#cbForm').onsubmit = e => {
  e.preventDefault();
  const v = num($('#cbAmount').value); if (!(v > 0)) return $('#cbAmount').focus();
  cb[cbCat] = v; save('wysa_cb', cb); render(); close($('#cbSheet'));
};
$('#cbDel').onclick = () => { delete cb[cbCat]; save('wysa_cb', cb); render(); close($('#cbSheet')); };

/* ================= Hoja de movimiento ================= */
function renderCats() {
  const list = CATS.filter(c => c.k === type);
  $('#cats').style.display = type === 'tr' ? 'none' : '';
  if (type === 'tr') { $('#cats').innerHTML = ''; return; }
  if (!list.find(c => c.id === catId)) catId = list[0].id;
  $('#cats').innerHTML = list.map(c => `<button type="button" class="cat ${c.id===catId?'on':''}" data-c="${c.id}"><i>${ic(c)}</i>${c.n}</button>`).join('');
}
function renderAccRow() {
  const chips = (k, curId) => accounts.map(a =>
    `<button type="button" class="chip${a.id === curId ? ' on' : ''}" data-k="${k}" data-id="${a.id}"><span class="dot" style="background:${a.color}"></span>${esc(a.name)}</button>`).join('');
  $('#accRow').innerHTML = type === 'tr'
    ? `<div class="arow"><span class="alb">De</span><div class="achips">${chips('from', fromId)}</div></div>
       <div class="arow"><span class="alb">A</span><div class="achips">${chips('to', toId)}</div></div>`
    : accounts.length > 1 ? `<div class="arow"><span class="alb">Cuenta</span><div class="achips">${chips('acc', accId)}</div></div>` : '';
}
$('#accRow').onclick = e => {
  const b = e.target.closest('[data-k]'); if (!b) return;
  const id = b.dataset.id;
  if (b.dataset.k === 'acc') accId = id;
  else if (b.dataset.k === 'from') { fromId = id; if (toId === id) toId = (accounts.find(a => a.id !== id) || {}).id; }
  else { toId = id; if (fromId === id) fromId = (accounts.find(a => a.id !== id) || {}).id; }
  renderAccRow();
};
function syncDate() {
  const v = $('#date').value, t = ymd(0), y = ymd(1);
  $$('#dates .chip[data-d]').forEach(c => c.classList.toggle('on', v === ymd(+c.dataset.d)));
  const other = v && v !== t && v !== y;
  $('#pick').classList.toggle('on', other);
  $('#pickLbl').textContent = other ? new Date(v + 'T00:00:00').toLocaleDateString('es', {day:'numeric', month:'short'}) : 'Otra fecha';
}
$('#date').max = ymd(0);
$('#dates').onclick = e => { const b = e.target.closest('[data-d]'); if (b) { $('#date').value = ymd(+b.dataset.d); syncDate(); } };
$('#date').onchange = syncDate;
function openSheet(t) {
  payRec = null; editId = t ? t.id : null;
  type = t ? t.type : 'out'; catId = t && t.type !== 'tr' ? t.cat : null;
  const last = load('wysa_last', '');
  const first = acc(sel) ? sel : (acc(last) ? last : accounts[0].id);
  accId = t && t.type !== 'tr' ? t.acc : first;
  fromId = t && t.type === 'tr' ? t.from : first;
  toId = t && t.type === 'tr' ? t.to : (accounts.find(a => a.id !== fromId) || {}).id;
  $('#trBtn').style.display = accounts.length > 1 ? '' : 'none';
  $$('#type button').forEach(x => x.classList.toggle('on', x.dataset.t === type));
  $('#date').value = t ? t.date : today(); syncDate();
  $('#amount').value = t ? String(t.amount) : ''; $('#note').value = t ? (t.note || '') : '';
  $('#btnSave').textContent = t ? 'Guardar cambios' : 'Guardar';
  renderCats(); renderAccRow(); open($('#sheet'));
  if (!t) setTimeout(() => $('#amount').focus(), 350);
}
$('#fab').onclick = () => openSheet(null);
$('#cats').onclick = e => { const b = e.target.closest('.cat'); if (b) { catId = b.dataset.c; renderCats(); } };
$('#type').onclick = e => {
  const b = e.target.closest('button'); if (!b) return;
  type = b.dataset.t; catId = null;
  if (type === 'tr' && (!toId || toId === fromId)) toId = (accounts.find(a => a.id !== fromId) || {}).id;
  $$('#type button').forEach(x => x.classList.toggle('on', x === b));
  renderCats(); renderAccRow();
};
$('#form').onsubmit = e => {
  e.preventDefault();
  const amount = num($('#amount').value);
  if (!(amount > 0)) return $('#amount').focus();
  const base = {amount, note: $('#note').value.trim(), date: $('#date').value || today()};
  let rec;
  if (type === 'tr') {
    if (!fromId || !toId || fromId === toId) return;
    rec = {type: 'tr', from: fromId, to: toId, ...base};
  } else { rec = {type, cat: catId, acc: accId, ...base}; save('wysa_last', accId); }
  const pr = payRec;
  if (pr && type === 'out') rec.rec = pr;
  if (editId) tx = tx.map(t => t.id === editId ? {id: t.id, ...(type === 'out' && t.rec ? {rec: t.rec} : {}), ...rec} : t);
  else tx.push({id: Date.now(), ...rec});
  if (pr && type === 'out') { recs = recs.map(r => r.id === pr ? {...r, amount} : r); save('wysa_rec', recs); }
  payRec = null; editId = null;
  save('wysa_tx', tx); render(); close($('#sheet'));
};
$$('[data-close]').forEach(s => s.onclick = () => close(s.parentElement));

/* ================= Cuentas ================= */
function openAccSheet(a) {
  accEditId = a ? a.id : null; accKind = a ? a.type : 'cash';
  accColor = a ? a.color : ACC_COLORS[accounts.length % ACC_COLORS.length];
  $('#accTitle').textContent = a ? 'Editar cuenta' : 'Nueva cuenta';
  $('#accName').value = a ? a.name : '';
  $('#accInit').value = a && a.init ? String(a.init) : '';
  $('#accDel').style.display = a && accounts.length > 1 ? '' : 'none';
  paintAccForm(); open($('#accSheet'));
  if (!a) setTimeout(() => $('#accName').focus(), 350);
}
function paintAccForm() {
  $$('#accType button').forEach(b => b.classList.toggle('on', b.dataset.k === accKind));
  paintSwatches('#accColors', accColor);
}
$('#accType').onclick = e => { const b = e.target.closest('button'); if (b) { accKind = b.dataset.k; paintAccForm(); } };
$('#accColors').onclick = e => { const b = e.target.closest('.sw'); if (b) { accColor = b.dataset.c; paintAccForm(); } };
$('#accForm').onsubmit = e => {
  e.preventDefault();
  const name = $('#accName').value.trim().slice(0, 20); if (!name) return $('#accName').focus();
  const iv = num($('#accInit').value), init = Number.isFinite(iv) ? iv : 0;
  if (accEditId) accounts = accounts.map(a => a.id === accEditId ? {...a, name, type: accKind, color: accColor, init} : a);
  else { const a = {id: 'a' + Date.now().toString(36), name, type: accKind, color: accColor, init}; accounts.push(a); sel = a.id; }
  save('wysa_acc', accounts); render(); close($('#accSheet'));
};
$('#accDel').onclick = () => {
  const id = accEditId, a = acc(id); if (!a || accounts.length < 2) return;
  const mine = tx.filter(t => t.acc === id || t.from === id || t.to === id);
  const q = mine.length ? `¿Eliminar "${a.name}" y sus ${mine.length} movimientos? No se puede deshacer.` : `¿Eliminar la cuenta "${a.name}"?`;
  if (!confirm(q)) return;
  tx = tx.filter(t => !mine.includes(t)); accounts = accounts.filter(x => x.id !== id);
  if (sel === id) sel = 'all';
  save('wysa_tx', tx); save('wysa_acc', accounts); render(); close($('#accSheet'));
};

/* ================= AJUSTES ================= */
function renderSettings() {
  $('#currency').value = cur;
  if (document.activeElement !== $('#budgetIn')) $('#budgetIn').value = budget || '';
  $$('#themeSeg button').forEach(b => b.classList.toggle('on', b.dataset.th === theme));
  const has = !!load('wysa_pin', null);
  $('#pinStatus').textContent = has ? 'PIN activo' : 'Sin PIN';
  $('#pinSet').hidden = has; $('#pinChange').hidden = !has; $('#pinRemove').hidden = !has;
}
$('#budgetIn').onchange = e => { const v = num(e.target.value); budget = v > 0 ? v : 0; save('wysa_budget', budget); render(); };
$('#currency').onchange = e => { cur = e.target.value; save('wysa_cur', cur); render(); };
$('#btnClear').onclick = () => {
  if (!confirm('¿Borrar todos los movimientos, cuentas, gastos fijos, metas y límites? No se puede deshacer. Te recomendamos exportar un respaldo antes.')) return;
  tx = []; accounts = defAccs(); recs = []; goals = []; cb = {}; sel = 'all'; flt.acc = 'all';
  save('wysa_tx', tx); save('wysa_acc', accounts); save('wysa_rec', recs); save('wysa_goals', goals); save('wysa_cb', cb);
  seen = new Set(); render();
};

/* ---------- Tema ---------- */
function applyTheme() {
  const dk = theme === 'dark' || (theme === 'auto' && !matchMedia('(prefers-color-scheme: light)').matches);
  document.documentElement.setAttribute('data-theme', dk ? 'dark' : 'light');
  const m = document.querySelector('meta[name="theme-color"]'); if (m) m.content = dk ? '#0b0b14' : '#eceefa';
}
$('#themeSeg').onclick = e => { const b = e.target.closest('button'); if (!b) return; theme = b.dataset.th; save('wysa_theme', theme); applyTheme(); renderSettings(); };
try { matchMedia('(prefers-color-scheme: light)').addEventListener('change', () => { if (theme === 'auto') applyTheme(); }); } catch {}
applyTheme();

/* ---------- PIN ---------- */
const pinStore = () => load('wysa_pin', null);
async function hashPin(pin, salt) {
  const s = salt + ':' + pin;
  if (window.crypto && crypto.subtle) {
    const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
    return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join('');
  }
  let h = 5381; for (const ch of s) h = ((h << 5) + h + ch.charCodeAt(0)) >>> 0; return 'x' + h;
}
const rndSalt = () => { try { return [...crypto.getRandomValues(new Uint8Array(8))].map(x => x.toString(16).padStart(2, '0')).join(''); } catch { return String(Date.now()); } };
let pin = {mode: null, buf: '', tmp: '', fails: +load('wysa_pinfails', 0) || 0, until: +load('wysa_pinuntil', 0) || 0, onOk: null};
const lockOn = () => $('#lock').classList.contains('show') || document.documentElement.classList.contains('locked');
function lockClose() { $('#lock').classList.remove('show'); document.documentElement.classList.remove('locked'); }
function pinOpen(mode, onOk) {
  pin.mode = mode; pin.buf = ''; pin.tmp = ''; pin.onOk = onOk || null; $('#lock').classList.add('show');
  const left = pin.until - Date.now();
  paintPin(left > 0 && (mode === 'unlock' || mode === 'old') ? 'Demasiados intentos. Espera ' + Math.ceil(left / 1000) + ' segundos.' : '');
  if (left > 0) setTimeout(() => paintPin(), left + 50);
}
function paintPin(msgTxt) {
  const T = {unlock: 'Ingresa tu PIN', old: 'Ingresa tu PIN actual', new1: 'Crea un PIN de 4 dígitos', new2: 'Confirma tu PIN'};
  $('#lockTitle').textContent = T[pin.mode] || '';
  $('#lockSub').innerHTML = msgTxt || '&nbsp;';
  $$('#pinDots i').forEach((d, i) => d.classList.toggle('f', i < pin.buf.length));
  $('#pinCancel').hidden = pin.mode === 'unlock';
  $('#pinForgot').hidden = !(pin.mode === 'unlock' || pin.mode === 'old');
}
function pinFail(text) {
  const d = $('#pinDots'); d.classList.remove('bad'); void d.offsetWidth; d.classList.add('bad');
  try { navigator.vibrate && navigator.vibrate(60); } catch {}
  pin.buf = ''; paintPin(text);
}
async function pinDigit(d) {
  if (Date.now() < pin.until || pin.buf.length >= 4) return;
  pin.buf += d; paintPin();
  if (pin.buf.length < 4) return;
  const code = pin.buf;
  if (pin.mode === 'unlock' || pin.mode === 'old') {
    const st = pinStore();
    if (st && await hashPin(code, st.s) === st.h) { pin.fails = 0; save('wysa_pinfails', 0); const cb2 = pin.onOk; lockClose(); pin.mode = null; if (cb2) cb2(); }
    else if (++pin.fails >= 5) { pin.until = Date.now() + 30000; pin.fails = 0; save('wysa_pinuntil', pin.until); save('wysa_pinfails', 0); pinFail('Demasiados intentos. Espera 30 segundos.'); setTimeout(() => paintPin(), 30000); }
    else { save('wysa_pinfails', pin.fails); pinFail('PIN incorrecto'); }
  } else if (pin.mode === 'new1') { pin.tmp = code; pin.buf = ''; pin.mode = 'new2'; paintPin(); }
  else if (pin.mode === 'new2') {
    if (code === pin.tmp) { const s = rndSalt(); save('wysa_pin', {s, h: await hashPin(code, s)}); lockClose(); pin.mode = null; renderSettings(); }
    else { pin.mode = 'new1'; pinFail('No coinciden. Intenta de nuevo'); paintPin('No coinciden. Intenta de nuevo'); }
  }
}
function pinBack() { pin.buf = pin.buf.slice(0, -1); paintPin(); }
$('#pinPad').onclick = e => { const b = e.target.closest('button'); if (!b) return; if (b.hasAttribute('data-back')) pinBack(); else pinDigit(b.dataset.d); };
document.addEventListener('keydown', e => { if (!lockOn()) return; if (/^\d$/.test(e.key)) pinDigit(e.key); else if (e.key === 'Backspace') pinBack(); });
$('#pinCancel').onclick = () => { lockClose(); pin.mode = null; };
$('#pinForgot').onclick = () => {
  if (!confirm('Si no recuerdas tu PIN, la única forma de entrar es borrar todos los datos de WYSA en este dispositivo (puedes restaurarlos después con un respaldo). ¿Borrar todo?')) return;
  try { Object.keys(localStorage).filter(k => k.startsWith('wysa_')).forEach(k => localStorage.removeItem(k)); } catch {}
  location.reload();
};
$('#pinSet').onclick = () => pinOpen('new1');
$('#pinChange').onclick = () => pinOpen('old', () => pinOpen('new1'));
$('#pinRemove').onclick = () => pinOpen('old', () => { try { localStorage.removeItem('wysa_pin'); } catch {} renderSettings(); });
let hiddenAt = 0;
document.addEventListener('visibilitychange', () => {
  if (document.hidden) hiddenAt = Date.now();
  else if (pinStore() && hiddenAt && Date.now() - hiddenAt > 30000 && !lockOn()) pinOpen('unlock');
});
if (pinStore()) pinOpen('unlock'); else lockClose();

/* ================= Respaldo ================= */
const msg = (t, bad) => { const m = $('#backupMsg'); m.textContent = t; m.classList.toggle('bad', !!bad); };
$('#btnExport').onclick = () => {
  const blob = new Blob([JSON.stringify({app:'wysa', v:4, exported:new Date().toISOString(), cur, budget, accounts, recs, goals, cb, tx}, null, 2)], {type:'application/json'});
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'wysa-respaldo-' + today() + '.json';
  document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  msg('Respaldo exportado (' + tx.length + ' movimientos, ' + accounts.length + ' cuentas).');
};
$('#btnImport').onclick = () => $('#fileImport').click();
$('#fileImport').onchange = async e => {
  const f = e.target.files[0]; e.target.value = ''; if (!f) return;
  try {
    const d = JSON.parse(await f.text());
    if (d.app !== 'wysa' || !Array.isArray(d.tx)) throw 0;
    const haveA = new Set(accounts.map(a => a.id));
    const newA = (Array.isArray(d.accounts) ? d.accounts : []).filter(a => a && typeof a.id === 'string' && typeof a.name === 'string' && !haveA.has(a.id))
      .map(a => ({id: a.id.slice(0, 20), name: a.name.slice(0, 20), type: ACC_ICON[a.type] ? a.type : 'cash', color: /^#[0-9a-f]{6}$/i.test(a.color) ? a.color : ACC_COLORS[0], init: Number.isFinite(+a.init) ? +a.init : 0}));
    accounts = accounts.concat(newA);
    const ids = new Set(accounts.map(a => a.id)), dflt = accounts[0].id;
    const okTx = [];
    d.tx.forEach(t => {
      if (!t || !Number.isFinite(+t.id) || !(+t.amount > 0) || !/^\d{4}-\d{2}-\d{2}$/.test(t.date)) return;
      const base = {id: +t.id, amount: +t.amount, note: String(t.note || '').slice(0, 60), date: t.date};
      if (t.type === 'tr') { if (ids.has(t.from) && ids.has(t.to) && t.from !== t.to) okTx.push({...base, type: 'tr', from: t.from, to: t.to}); }
      else if ((t.type === 'in' || t.type === 'out') && typeof t.cat === 'string') okTx.push({...base, type: t.type, cat: t.cat, acc: ids.has(t.acc) ? t.acc : dflt, ...(t.type === 'out' && typeof t.rec === 'string' ? {rec: t.rec} : {})});
    });
    const have = new Set(tx.map(t => t.id)), add = okTx.filter(t => !have.has(t.id));
    tx = tx.concat(add);
    const haveR = new Set(recs.map(r => r.id));
    const newR = (Array.isArray(d.recs) ? d.recs : []).filter(r => r && typeof r.id === 'string' && !haveR.has(r.id) && typeof r.name === 'string' && +r.amount > 0 && +r.day >= 1 && +r.day <= 31)
      .map(r => ({id: r.id.slice(0, 20), name: r.name.slice(0, 24), amount: +r.amount, day: Math.round(+r.day), cat: CATS.some(c => c.id === r.cat && c.k === 'out') ? r.cat : 'bills', acc: ids.has(r.acc) ? r.acc : dflt}));
    recs = recs.concat(newR);
    const haveG = new Set(goals.map(g => g.id));
    const newG = (Array.isArray(d.goals) ? d.goals : []).filter(g => g && typeof g.id === 'string' && !haveG.has(g.id) && typeof g.name === 'string' && +g.target > 0)
      .map(g => ({id: g.id.slice(0, 20), name: g.name.slice(0, 24), target: +g.target, saved: Math.max(0, +g.saved || 0), color: /^#[0-9a-f]{6}$/i.test(g.color) ? g.color : ACC_COLORS[1]}));
    goals = goals.concat(newG);
    let newCb = 0;
    if (d.cb && typeof d.cb === 'object') Object.keys(d.cb).forEach(k => { if (CATS.some(c => c.id === k && c.k === 'out') && +d.cb[k] > 0 && !cb[k]) { cb[k] = +d.cb[k]; newCb++; } });
    save('wysa_tx', tx); save('wysa_acc', accounts); save('wysa_rec', recs); save('wysa_goals', goals); save('wysa_cb', cb);
    if (!budget && +d.budget > 0) { budget = +d.budget; save('wysa_budget', budget); }
    render();
    const extra = [newA.length && newA.length + ' cuentas', newR.length && newR.length + ' gastos fijos', newG.length && newG.length + ' metas', newCb && newCb + ' límites'].filter(Boolean);
    msg('Importados ' + add.length + ' movimientos nuevos' + (extra.length ? ', ' + extra.join(', ') : '') + (okTx.length - add.length ? ' (' + (okTx.length - add.length) + ' ya existían).' : '.'));
  } catch { msg('El archivo no es un respaldo válido de WYSA.', true); }
};

/* ================= Arranque ================= */
render();
if ('serviceWorker' in navigator) {
  const had = !!navigator.serviceWorker.controller;
  navigator.serviceWorker.register('sw.js', {updateViaCache: 'none'}).then(r => r.update()).catch(() => {});
  let reloaded = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => { if (had && !reloaded) { reloaded = true; location.reload(); } });
}
})();
