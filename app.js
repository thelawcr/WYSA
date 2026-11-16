(() => {
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

/* ---------- Categorías e íconos ---------- */
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
const ACC_ICON = {
  cash: 'M3 7h18v10H3zM12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z',
  bank: 'M3 6h18v12H3zM3 10h18M7 15h4',
  save: 'M12 3l8 3v6c0 4-3.5 7.5-8 9-4.5-1.5-8-5-8-9V6z',
};
const ACC_COLORS = ['#19d3b0', '#8b7bff', '#ff9f43', '#54a0ff', '#ff6b8b', '#feca57'];
const svg = (d, col) => `<svg viewBox="0 0 24 24" style="stroke:${col}"><path d="${d}"/></svg>`;
const ic = c => svg(c.e, c.c);
const aic = a => svg(ACC_ICON[a.type] || ACC_ICON.cash, a.color);
const SYM = {CRC:'₡', USD:'$', EUR:'€', MXN:'$', COP:'$', GTQ:'Q'};

/* ---------- Almacenamiento ---------- */
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

let accounts = load('wysa_acc', null);
if (!Array.isArray(accounts) || !accounts.length) accounts = [{id:'cash', name:'Efectivo', type:'cash', color:ACC_COLORS[0], init:0}];
let tx = load('wysa_tx', []);
let cur = load('wysa_cur', 'CRC');
let budget = +load('wysa_budget', 0) || 0;
// migración: movimientos antiguos sin cuenta pasan a la primera
tx.forEach(t => { if (t.type !== 'tr' && !t.acc) t.acc = accounts[0].id; });
save('wysa_acc', accounts); save('wysa_tx', tx);

let range = 'day', type = 'out', catId = null, editId = null;
let sel = 'all';                 // cuenta seleccionada en la vista principal
let accId = null, fromId = null, toId = null;
let accEditId = null, accKind = 'cash', accColor = ACC_COLORS[0];

/* ---------- Utilidades ---------- */
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

function inRange(date) {
  const d = new Date(date + 'T00:00:00'), n = new Date(); n.setHours(0,0,0,0);
  const diff = Math.round((n - d) / 864e5);
  if (range === 'day') return diff === 0;
  if (range === 'week') return diff >= 0 && diff < 7;
  return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear();
}
function dayLabel(date) {
  const diff = Math.round((new Date(today()+'T00:00:00') - new Date(date+'T00:00:00')) / 864e5);
  if (diff === 0) return 'Hoy';
  if (diff === 1) return 'Ayer';
  return new Date(date+'T00:00:00').toLocaleDateString('es', {weekday:'long', day:'numeric', month:'short'});
}

/* saldo por cuenta: inicial + ingresos − gastos + transferencias recibidas − enviadas */
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

/* ---------- Animación de números ---------- */
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
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

/* ---------- Render ---------- */
let seen = new Set();
function render() {
  if (sel !== 'all' && !acc(sel)) sel = 'all';
  const view = tx.filter(inView);
  const inc = view.filter(t => t.type==='in').reduce((a,t)=>a+t.amount,0);
  const out = view.filter(t => t.type==='out').reduce((a,t)=>a+t.amount,0);
  const total = sel === 'all' ? accounts.reduce((a, x) => a + accBal(x.id), 0) : accBal(sel);
  $('#balLabel').textContent = sel === 'all' ? 'Saldo total' : 'Saldo · ' + acc(sel).name;
  tween($('#balance'), total);
  tween($('#totIn'), inc);
  tween($('#totOut'), out);
  $('#curSym').textContent = SYM[cur];
  const h = new Date().getHours();
  $('#greeting').textContent = h < 12 ? 'Buenos días' : h < 19 ? 'Buenas tardes' : 'Buenas noches';

  renderAccs();
  renderBudget();

  const spent = view.filter(t => t.type==='out' && inRange(t.date));
  const tot = spent.reduce((a,t)=>a+t.amount,0);
  tween($('#spent'), tot);
  const by = {};
  spent.forEach(t => by[t.cat] = (by[t.cat]||0) + t.amount);
  const rows = Object.entries(by).sort((a,b)=>b[1]-a[1]);
  $('#bars').innerHTML = rows.length ? rows.map(([id,v]) => {
    const c = cat(id);
    return `<div class="bar"><div class="l"><span><span class="dot" style="background:${c.c}"></span>${c.n}</span><span>${fmt(v)}</span></div>
      <div class="t"><div class="f" data-w="${v/tot*100}" style="width:0;background:${c.c}"></div></div></div>`;
  }).join('') : '<div class="empty">Sin gastos en este periodo</div>';
  requestAnimationFrame(() => requestAnimationFrame(() => $$('.bar .f').forEach(f => f.style.width = f.dataset.w + '%')));

  const sorted = [...view].sort((a,b) => b.date.localeCompare(a.date) || b.id - a.id);
  let html = '', last = '', n = 0; const now = new Set();
  sorted.forEach(t => {
    if (t.date !== last) { html += `<div class="day">${dayLabel(t.date)}</div>`; last = t.date; }
    now.add(t.id); const fresh = !seen.has(t.id);
    const cls = `item glass${fresh ? ' enter' : ''}`, st = `data-id="${t.id}" style="--i:${fresh ? n++ : 0}"`;
    const del = `<button class="del" data-id="${t.id}" aria-label="Eliminar"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button>`;
    if (t.type === 'tr') {
      const f = acc(t.from), to = acc(t.to);
      const sign = sel === 'all' ? '' : (t.to === sel ? '+' : '−'), kls = sel === 'all' ? 'tr' : (t.to === sel ? 'in' : 'out');
      html += `<div class="${cls}" ${st}><div class="ico" style="background:linear-gradient(135deg,#8b7bff40,#8b7bff12);box-shadow:inset 0 1px 0 rgba(255,255,255,.25)">${svg(TR_ICON, '#a99dff')}</div>
        <div class="m"><b>Transferencia</b><span>${esc(f ? f.name : '?')} → ${esc(to ? to.name : '?')}${t.note ? ' · ' + esc(t.note) : ''}</span></div>
        <div class="a ${kls}">${sign}${fmt(t.amount)}</div>${del}</div>`;
    } else {
      const c = cat(t.cat), a = acc(t.acc);
      const sub = [sel === 'all' && accounts.length > 1 && a ? a.name : '', t.note || ''].filter(Boolean).map(esc).join(' · ');
      html += `<div class="${cls}" ${st}><div class="ico" style="background:linear-gradient(135deg,${c.c}40,${c.c}12);box-shadow:inset 0 1px 0 rgba(255,255,255,.25)">${ic(c)}</div>
        <div class="m"><b>${c.n}</b><span>${sub}</span></div>
        <div class="a ${t.type}">${t.type==='in'?'+':'−'}${fmt(t.amount)}</div>${del}</div>`;
    }
  });
  seen = now;
  $('#list').innerHTML = html || '<div class="empty">Aún no hay movimientos.<br>Toca + para agregar el primero.</div>';
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

function renderBudget() {
  const el = $('#budgetCard');
  if (!(budget > 0)) {
    el.innerHTML = '<button class="bset" id="bSet"><span>Definir presupuesto mensual</span><svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></button>';
    return;
  }
  const now = new Date();
  const spent = tx.filter(t => { const d = new Date(t.date + 'T00:00:00'); return t.type === 'out' && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); }).reduce((a, t) => a + t.amount, 0);
  const pct = spent / budget, left = budget - spent;
  const st = pct > 1 ? 'over' : pct >= .8 ? 'warn' : 'ok';
  el.innerHTML = '<button class="bset head" id="bSet"><span class="muted">Presupuesto del mes</span><span class="pc ' + st + '">' + Math.round(pct * 100) + '%</span></button>'
    + '<div class="bamt"><b>' + fmt(Math.abs(left)) + '</b><span class="muted">' + (left >= 0 ? 'disponible' : 'por encima del límite') + '</span></div>'
    + '<div class="bt"><div class="bf ' + st + '" data-w="' + Math.min(100, pct * 100) + '" style="width:0"></div></div>'
    + '<p class="muted bnote">' + fmt(spent) + ' de ' + fmt(budget) + '</p>';
  requestAnimationFrame(() => requestAnimationFrame(() => { const f = el.querySelector('.bf'); if (f) f.style.width = f.dataset.w + '%'; }));
}

/* ---------- Hoja de movimiento ---------- */
function renderCats() {
  const list = CATS.filter(c => c.k === type);
  $('#cats').style.display = type === 'tr' ? 'none' : '';
  if (type === 'tr') { $('#cats').innerHTML = ''; return; }
  if (!list.find(c => c.id === catId)) catId = list[0].id;
  $('#cats').innerHTML = list.map(c =>
    `<button type="button" class="cat ${c.id===catId?'on':''}" data-c="${c.id}"><i>${ic(c)}</i>${c.n}</button>`).join('');
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

const open = el => el.classList.add('open');
const close = el => el.classList.remove('open');

function openSheet(t) {
  editId = t ? t.id : null;
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
  } else {
    rec = {type, cat: catId, acc: accId, ...base};
    save('wysa_last', accId);
  }
  if (editId) tx = tx.map(t => t.id === editId ? {id: t.id, ...rec} : t);
  else tx.push({id: Date.now(), ...rec});
  editId = null;
  save('wysa_tx', tx); render(); close($('#sheet'));
};

/* ---------- Lista: editar / eliminar ---------- */
$('#list').onclick = e => {
  const b = e.target.closest('.del');
  if (!b) { const it = e.target.closest('.item'); const t = it && tx.find(x => x.id === +it.dataset.id); if (t) openSheet(t); return; }
  const row = b.closest('.item'), id = +b.dataset.id;
  const done = () => { tx = tx.filter(t => t.id !== id); save('wysa_tx', tx); render(); };
  if (reduce) return done();
  row.classList.add('leave'); setTimeout(done, 320);
};

/* ---------- Cuentas ---------- */
function openAccSheet(a) {
  accEditId = a ? a.id : null;
  accKind = a ? a.type : 'cash';
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
  $('#accColors').innerHTML = ACC_COLORS.map(c => `<button type="button" class="sw${c === accColor ? ' on' : ''}" data-c="${c}" style="background:${c}" aria-label="Color"></button>`).join('');
}
$('#accType').onclick = e => { const b = e.target.closest('button'); if (b) { accKind = b.dataset.k; paintAccForm(); } };
$('#accColors').onclick = e => { const b = e.target.closest('.sw'); if (b) { accColor = b.dataset.c; paintAccForm(); } };
$('#accs').onclick = e => {
  if (e.target.closest('#accAdd')) return openAccSheet(null);
  const c = e.target.closest('.acard'); if (!c) return;
  const id = c.dataset.id;
  if (id !== 'all' && sel === id) return openAccSheet(acc(id));
  sel = id; seen = new Set(tx.filter(inView).map(t => t.id)); render();
};
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

/* ---------- Ajustes ---------- */
const openSettings = () => { $('#currency').value = cur; $('#budgetIn').value = budget || ''; $('#backupMsg').textContent = ''; open($('#settings')); };
$('#btnSettings').onclick = openSettings;
$('#budgetCard').onclick = e => { if (e.target.closest('#bSet')) { openSettings(); if (!budget) setTimeout(() => $('#budgetIn').focus(), 400); } };
$('#budgetIn').onchange = e => { const v = num(e.target.value); budget = v > 0 ? v : 0; save('wysa_budget', budget); render(); };
$('#currency').onchange = e => { cur = e.target.value; save('wysa_cur', cur); render(); };
$$('[data-close]').forEach(s => s.onclick = () => close(s.parentElement));
$('#range').onclick = e => {
  const b = e.target.closest('button'); if (!b) return;
  range = b.dataset.r;
  $$('#range button').forEach(x => x.classList.toggle('on', x === b));
  render();
};
$('#btnClear').onclick = () => {
  if (confirm('¿Borrar todos los movimientos y cuentas? No se puede deshacer. Te recomendamos exportar un respaldo antes.')) {
    tx = []; accounts = [{id:'cash', name:'Efectivo', type:'cash', color:ACC_COLORS[0], init:0}]; sel = 'all';
    save('wysa_tx', tx); save('wysa_acc', accounts); render(); close($('#settings'));
  }
};

/* ---------- Respaldo ---------- */
const msg = (t, bad) => { const m = $('#backupMsg'); m.textContent = t; m.classList.toggle('bad', !!bad); };
$('#btnExport').onclick = () => {
  const blob = new Blob([JSON.stringify({app:'wysa', v:2, exported:new Date().toISOString(), cur, budget, accounts, tx}, null, 2)], {type:'application/json'});
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
    // cuentas (los respaldos v1 no traen cuentas: todo va a la primera)
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
      else if ((t.type === 'in' || t.type === 'out') && typeof t.cat === 'string') okTx.push({...base, type: t.type, cat: t.cat, acc: ids.has(t.acc) ? t.acc : dflt});
    });
    const have = new Set(tx.map(t => t.id)), add = okTx.filter(t => !have.has(t.id));
    tx = tx.concat(add);
    save('wysa_tx', tx); save('wysa_acc', accounts);
    if (!budget && +d.budget > 0) { budget = +d.budget; save('wysa_budget', budget); }
    render();
    msg('Importados ' + add.length + ' movimientos nuevos' + (newA.length ? ' y ' + newA.length + ' cuentas' : '') + (okTx.length - add.length ? ' (' + (okTx.length - add.length) + ' ya existían).' : '.'));
  } catch { msg('El archivo no es un respaldo válido de WYSA.', true); }
};

render();
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
})();
