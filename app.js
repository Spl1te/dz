"use strict";
// Сайт ДЗ 8-Д. Дані віддає homework-bot/server.py:
//   data/homework.json — ДЗ (пише бот), data/school.json — розклад, дзвінки, учителі, підручники,
//   data/files.json — файли від учителів.

const SUBJECTS = [
  // [тег із бота, повна назва, колір]
  ["Алгебра", "Алгебра", "#3b5bdb"],
  ["Геометрія", "Геометрія", "#1c7ed6"],
  ["УкрМова", "Українська мова", "#f08c00"],
  ["УкрЛіт", "Українська література", "#e8590c"],
  ["Укр", "Українська", "#f59f00"],
  ["Англ", "Англійська мова", "#d6336c"],
  ["Нім", "Німецька мова", "#ae3ec9"],
  ["Ісп", "Іспанська мова", "#c2255c"],
  ["ЗарЛіт", "Зарубіжна література", "#9c36b5"],
  ["ІсторіяУкр", "Історія України", "#a0522d"],
  ["ВсесвІст", "Всесвітня історія", "#8d6e63"],
  ["Фізика", "Фізика", "#0b7285"],
  ["Хімія", "Хімія", "#2f9e44"],
  ["Біологія", "Біологія", "#5c940d"],
  ["Геогр", "Географія", "#0ca678"],
  ["Інформатика", "Інформатика", "#4263eb"],
  ["ГО", "Громадянська освіта", "#7048e8"],
  ["ФГ", "Фінансова грамотність", "#e67700"],
  ["ЗБД", "Здоровʼя, безпека та добробут", "#12b886"],
  ["Технології", "Технології", "#868e96"],
  ["Мистецтво", "Мистецтво", "#f06595"],
  ["ФізРа", "Фізкультура", "#495057"],
];
// Розділи вкладки «Предмети» (і порядок предметів скрізь на сайті)
const GROUPS = [
  ["Найголовніші", "#e03131", ["Алгебра", "УкрМова", "Укр", "Англ", "ІсторіяУкр", "Геометрія"]],
  ["Основні", "#f76707", ["УкрЛіт", "ВсесвІст", "Фізика", "Хімія", "Біологія"]],
  ["Просто уроки", "#f2b705", ["Нім", "Ісп", "ЗарЛіт", "ГО", "ФГ", "Геогр"]],
  ["Уроки-відпочинки", "#2f9e44", ["ФізРа", "Мистецтво", "Технології", "ЗБД", "Інформатика"]],
];
const ORDER = GROUPS.flatMap(([, , tags]) => tags);
const groupColor = (t) => (GROUPS.find(([, , tags]) => tags.includes(t)) || [])[1] || "transparent";
// На сторінці предмета показуються ще й ДЗ цих предметів
const ALSO = { "ІсторіяУкр": ["ГО"] };
const tagsOf = (t) => [t, ...(ALSO[t] || [])];
const S = Object.fromEntries(SUBJECTS.map(([t, n, c]) => [t, { name: n, color: c }]));
const subj = (t) => S[t] || { name: t || "Загальне", color: "#868e96" };

const WD = ["неділя", "понеділок", "вівторок", "середа", "четвер", "пʼятниця", "субота"];
const WD_SHORT = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];
const WD_TINY = ["нд", "пн", "вт", "ср", "чт", "пт", "сб"];
const MON = ["січня", "лютого", "березня", "квітня", "травня", "червня", "липня",
             "серпня", "вересня", "жовтня", "листопада", "грудня"];
const MON_N = ["січень", "лютий", "березень", "квітень", "травень", "червень", "липень",
               "серпень", "вересень", "жовтень", "листопад", "грудень"];

// ---------- дати (локальні) ----------
const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const parse = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const today = () => iso(new Date());
const short = (s) => { const d = parse(s); return `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}`; };
const longDay = (s) => { const d = parse(s); return `${d.getDate()} ${MON[d.getMonth()]}`; };
function relDay(s) {
  const t = new Date();
  if (s === iso(t)) return "сьогодні";
  if (s === iso(addDays(t, 1))) return "завтра";
  if (s === iso(addDays(t, 2))) return "післязавтра";
  return WD[parse(s).getDay()];
}
const WD_ACC = ["у неділю", "у понеділок", "у вівторок", "у середу", "у четвер", "у пʼятницю", "у суботу"];
// «Здати завтра» / «Здати в понеділок»
function whenDay(s) {
  const r = relDay(s);
  return WD.includes(r) ? WD_ACC[parse(s).getDay()] : r;
}
const cap = (s) => s[0].toUpperCase() + s.slice(1);
const pad = (n) => String(n).padStart(2, "0");
const toMin = (hhmm) => { const [h, m] = hhmm.split(":").map(Number); return h * 60 + m; };
function plural(n) {
  // 1, 2–4 → «завдання»; 0, 5–20 → «завдань»
  const a = n % 10, b = n % 100;
  return a >= 1 && a <= 4 && (b < 11 || b > 14) ? "завдання" : "завдань";
}
function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
const linkify = (s) => esc(s).replace(/https?:\/\/[^\s<]+[^\s<.,;:!?)\]]/g, (u) => `<a href="${u}" target="_blank" rel="noopener">${u}</a>`);
const sizeStr = (b) => (b > 1048576 ? `${(b / 1048576).toFixed(1)} МБ` : `${Math.max(1, Math.round(b / 1024))} КБ`);

// ---------- дані ----------
let RAW = [], ALL = [], FILES = [], SCHOOL = { template: {}, weeks: {}, holidays: [], bells: [], teachers: {}, books: {} };

// ---------- група й мова (обирає кожен сам, зберігається в браузері) ----------
const PREF_KEY = "dz-pref";
let PREF = (() => {
  try {
    const p = JSON.parse(localStorage.getItem(PREF_KEY));
    return p && [1, 2].includes(p.group) && ["de", "es"].includes(p.lang) ? p : null;
  } catch { return null; }
})();
const pref = () => PREF || { group: 1, lang: "de" };
const otherLang = () => (pref().lang === "de" ? "Ісп" : "Нім");
const applyPref = () => { ALL = RAW.filter((e) => e.tag !== otherLang()).concat(alertEntries()); };
function savePref(p) {
  PREF = p;
  try { localStorage.setItem(PREF_KEY, JSON.stringify(p)); } catch { /* приватний режим — тільки до перезавантаження */ }
  applyPref();
}
// Перемикачі: data-pg — група, data-pl — мова
function prefSwitches(p) {
  const seg = (attr, cur, opts, label) => `<div class="seg" role="group" aria-label="${label}">${opts.map(([v, t]) =>
    `<button type="button" data-${attr}="${v}" aria-pressed="${cur === v}">${t}</button>`).join("")}</div>`;
  return seg("pg", p.group, [[1, "1 група"], [2, "2 група"]], "Група") +
    seg("pl", p.lang, [["de", "Німецька"], ["es", "Іспанська"]], "Мова");
}
const byDue = () => {
  const m = {};
  for (const e of ALL) if (e.due) (m[e.due] ||= []).push(e);
  return m;
};
// Уроки дня [[номер, тег, кабінет]] для обраної групи й мови
function plan(s) {
  const d = parse(s), wd = (d.getDay() + 6) % 7;
  const slots = SCHOOL.template[wd];
  if (!slots || SCHOOL.holidays.includes(s)) return [];
  const conds = new Set([SCHOOL.weeks[iso(addDays(d, -wd))], "g" + pref().group, pref().lang]);
  const out = [];
  slots.forEach((opts, i) => {
    const x = opts.find((o) => !o[2] || o[2].split(" ").every((c) => conds.has(c)));
    if (x) out.push([i + 1, x[0], x[1]]);
  });
  return out;
}
const bell = (n) => SCHOOL.bells[n - 1];
const teacher = (t) => SCHOOL.teachers[t] || "поки не знаю";
const room = (r, tag) => (tag === "ФізРа" ? "зал" : !r ? "—" : /^\d/.test(r) ? `каб. ${esc(r)}` : esc(r));
const bookUrl = (slug, page) => `books/${encodeURIComponent(slug)}.pdf${page ? `#page=${page}` : ""}`;
const rank = (t) => { const i = ORDER.indexOf(t); return i < 0 ? 999 : i; };
const sortSubj = (list) => [...list].sort((a, b) => rank(a.tag) - rank(b.tag));

// ---------- картка ДЗ ----------
function card(e, { showSubj = true } = {}) {
  const s = subj(e.tag);
  if (e.alert) {
    return `<article class="card alert-card" style="--c:${s.color}">
    <div class="head">${showSubj ? `<a class="subj" href="#/s/${encodeURIComponent(e.tag)}">${esc(s.name)}</a>` : "<span></span>"}
      <span class="dates">${e.n} урок ${short(e.given)}${e.due ? ` → здати ${short(e.due)}` : ""}</span></div>
    <p class="hw"><b>🚨 Була тривога!</b> ДЗ не задавали · ${e.pct}% уроку під тривогою</p>
  </article>`;
  }
  const dates = `задано ${short(e.given)}` + (e.due ? ` → здати ${short(e.due)}` : "");
  const photos = (e.photos || []).map((p) =>
    `<button data-img="${esc(p)}" aria-label="Відкрити фото"><img src="${esc(p)}" loading="lazy" alt="Фото дошки"></button>`).join("");
  const tasks = e.tasks || [];
  let taskHtml = "";
  if (tasks.length) {
    const body = tasks.map((t) => {
      const imgs = (t.images || []).map((p) =>
        `<button class="crop" data-img="${esc(p)}" aria-label="Збільшити"><img src="${esc(p)}" loading="lazy" alt="${esc(t.label)}"></button>`).join("");
      const link = t.book ? `<a class="pdf-link" href="${bookUrl(t.book, t.page)}" target="_blank" rel="noopener">відкрити в підручнику ↗</a>` : "";
      return `<div class="task"><div class="task-h"><b>${esc(cap(t.label))}</b>${link}</div>${imgs}</div>`;
    }).join("");
    taskHtml = `<details class="tasks"><summary>Завдання <span>${tasks.length}</span></summary>${body}</details>`;
  }
  return `<article class="card" style="--c:${s.color}">
    <div class="head">${showSubj ? `<a class="subj" href="#/s/${encodeURIComponent(e.tag)}">${esc(s.name)}</a>` : "<span></span>"}
      <span class="dates">${dates}</span></div>
    <p class="hw">${linkify(e.homework)}</p>
    ${photos ? `<div class="thumbs">${photos}</div>` : ""}
    ${taskHtml}
  </article>`;
}

// ---------- тривоги в Києві ----------
let ALERTS = { now: null, checked: null, list: [] };
const ts = (s) => new Date(s).getTime(); // "YYYY-MM-DDTHH:MM:SS" — місцевий час
const hhmm = (s) => s.slice(11, 16);
const MIN = 60000;
const alertSpans = () => ALERTS.list.map((a) => [ts(a.start), a.end ? ts(a.end) : Date.now()]);
function overlapMs(a, b) {
  let t = 0;
  for (const [s0, e0] of alertSpans()) t += Math.max(0, Math.min(e0, b) - Math.max(s0, a));
  return t;
}
function lessonSpan(day, n) {
  const b = bell(n);
  if (!b) return null;
  const d0 = parse(day).getTime();
  return [d0 + toMin(b[0]) * MIN, d0 + toMin(b[1]) * MIN];
}
// Скільки % уроку пройшло під тривогою
function alertPct(day, n) {
  const sp = lessonSpan(day, n);
  return sp ? Math.round((overlapMs(sp[0], sp[1]) / (sp[1] - sp[0])) * 100) : 0;
}
// Тривога йшла щонайменше останні 10 хв до дзвінка
function endCovered(day, n) {
  const sp = lessonSpan(day, n);
  return !!sp && overlapMs(sp[1] - 10 * MIN, sp[1]) >= 10 * MIN - 1000;
}
const durStr = (ms) => {
  const m = Math.max(1, Math.round(ms / MIN));
  return m >= 60 ? `${Math.floor(m / 60)} год${m % 60 ? ` ${m % 60} хв` : ""}` : `${m} хв`;
};
function nextLessonOf(tag, from) {
  for (let i = 1; i < 60; i++) {
    const s = iso(addDays(parse(from), i));
    if (plan(s).some((l) => l[1] === tag)) return s;
  }
  return null;
}
// Дні, яких торкалась хоч одна тривога
function alertDays() {
  const out = new Set();
  for (const [a, b] of alertSpans()) {
    for (let d = parse(iso(new Date(a))); d.getTime() <= b; d = addDays(d, 1)) out.add(iso(d));
  }
  return [...out].sort();
}
// Плашки «Була тривога!» для уроків без ДЗ, що закінчились під тривогу
function alertEntries() {
  if (!SCHOOL.bells.length || !ALERTS.list.length) return [];
  const t = today(), out = [];
  for (const d of alertDays()) {
    if (d > t || (d === t && !dayOver(d))) continue;
    const seen = new Set();
    for (const [n, tag] of plan(d)) {
      if (seen.has(tag) || !endCovered(d, n)) continue;
      if (RAW.some((e) => e.tag === tag && e.given === d)) continue;
      seen.add(tag);
      out.push({ id: `alert-${d}-${n}`, alert: true, tag, n, given: d, due: nextLessonOf(tag, d), pct: alertPct(d, n), homework: "" });
    }
  }
  return out;
}
function alertsPage() {
  const open = ALERTS.list.find((a) => !a.end);
  let status;
  if (ALERTS.now === null) status = `<section class="alert-now">Сервер ще не отримав дані про тривоги. Зачекай хвилинку.</section>`;
  else if (ALERTS.now) status = `<section class="alert-now on" role="status"><b>🚨 Зараз повітряна тривога в Києві</b>${open ? `<span>з ${hhmm(open.start)} · триває ${durStr(Date.now() - ts(open.start))}</span>` : ""}</section>`;
  else status = `<section class="alert-now off" role="status"><b>Тривоги немає</b><span>перевірено о ${ALERTS.checked ? hhmm(ALERTS.checked) : "—"}</span></section>`;
  const byDay = {};
  for (const a of ALERTS.list) (byDay[a.start.slice(0, 10)] ||= []).push(a);
  const days = Object.keys(byDay).sort().reverse();
  const noBells = SCHOOL.bells.length ? "" : `<p class="muted small-note">Уроки й перерви рахуватимуться, коли на сайті будуть дзвінки.</p>`;
  const list = days.map((d) => {
    const items = byDay[d].slice().reverse().map((a) => {
      const a0 = ts(a.start), a1 = a.end ? ts(a.end) : Date.now();
      const hit = [];
      if (SCHOOL.bells.length) {
        const ls = plan(d);
        ls.forEach(([n, tag], i) => {
          const sp = lessonSpan(d, n);
          const ov = sp ? Math.max(0, Math.min(a1, sp[1]) - Math.max(a0, sp[0])) : 0;
          if (ov > 0) hit.push(`<li style="--c:${subj(tag).color}"><b>${n} урок · ${esc(subj(tag).name)}</b><span>${Math.round((ov / (sp[1] - sp[0])) * 100)}%</span></li>`);
          const nx = ls[i + 1] && lessonSpan(d, ls[i + 1][0]);
          if (sp && nx && Math.min(a1, nx[0]) > Math.max(a0, sp[1])) hit.push(`<li class="brk-hit"><b>Перерва після ${n} уроку</b></li>`);
        });
      }
      return `<li class="alert-item${a.end ? "" : " live"}"><div class="ai-h"><b>${hhmm(a.start)}–${a.end ? hhmm(a.end) : "триває"}</b>
        <span>${durStr(a1 - a0)}${a.approx ? " · кінець приблизно" : ""}</span></div>
        ${hit.length ? `<ul class="hit">${hit.join("")}</ul>` : ""}</li>`;
    }).join("");
    return `<h2>${cap(relDay(d))} <span class="muted">· ${longDay(d)}</span></h2><ul class="alerts">${items}</ul>`;
  }).join("");
  return `<h1>Тривоги</h1><p class="sub">Повітряні тривоги в м. Київ і уроки, які вони зачепили.</p>${status}${noBells}
    ${list || `<div class="empty">Поки що жодної тривоги не записано.</div>`}`;
}

// ---------- «Зараз» ----------
function nextSchoolDay(from) {
  for (let i = 1; i < 30; i++) {
    const s = iso(addDays(parse(from), i));
    if (plan(s).length) return s;
  }
  return null;
}
function lessonLine(l, withTime = true) {
  const [n, tag, r] = l;
  const b = bell(n);
  return `<span class="who">${room(r, tag)} · вчитель: ${esc(teacher(tag))}${withTime && b ? ` · ${b[0]}–${b[1]}` : ""}</span>`;
}
function nowState() {
  if (!SCHOOL.bells.length) return null;
  const d = new Date(), t = iso(d), sec = d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds();
  const ls = plan(t).filter((l) => bell(l[0]));
  for (let i = 0; i < ls.length; i++) {
    const [s0, e0] = bell(ls[i][0]).map((x) => toMin(x) * 60);
    if (sec >= s0 && sec < e0) return { kind: "lesson", l: ls[i], left: e0 - sec };
    if (sec < s0) return { kind: i === 0 ? "before" : "break", l: ls[i], left: s0 - sec };
  }
  const nd = nextSchoolDay(t);
  const first = nd && plan(nd).find((l) => bell(l[0]));
  return { kind: ls.length ? "after" : "free", day: nd, l: first };
}
const mmss = (s) => (s >= 3600 ? `${Math.floor(s / 3600)}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}` : `${pad(Math.floor(s / 60))}:${pad(s % 60)}`);
function nowCard() {
  const st = nowState();
  if (!st) return "";
  let html = "";
  if (st.kind === "lesson") {
    const [n, tag] = st.l;
    html = `<div class="now-k">Зараз ${n} урок</div>
      <div class="now-main"><b>${esc(subj(tag).name)}</b><span class="timer">до кінця <strong>${mmss(st.left)}</strong></span></div>
      ${lessonLine(st.l)}`;
  } else if (st.kind === "break" || st.kind === "before") {
    const [n, tag] = st.l;
    html = `<div class="now-k">Зараз</div>
      <div class="now-main"><b>${st.kind === "break" ? "Перерва" : "До початку уроків"}</b><span class="timer">ще <strong>${mmss(st.left)}</strong></span></div>
      <div class="next">Далі: <b>${n} урок · ${esc(subj(tag).name)}</b> о ${bell(n)[0]}</div>
      ${lessonLine(st.l, false)}`;
  } else {
    const head = st.kind === "after" ? "Уроки на сьогодні закінчились" : "Сьогодні уроків немає";
    html = `<div class="now-k">${head}</div>` + (st.l
      ? `<div class="next">Наступний урок: <b>${relDay(st.day)}, ${longDay(st.day)}</b> о ${bell(st.l[0])[0]} — <b>${esc(subj(st.l[1]).name)}</b></div>${lessonLine(st.l, false)}`
      : "");
  }
  return `<section class="now" id="now">${html}</section>`;
}

// ---------- сторінки ----------
// «· 2 завдання · 1 тривога» — плашки тривог рахуються окремо
function hwCount(list) {
  const hw = list.filter((e) => !e.alert).length, al = list.length - hw;
  return (hw ? ` · ${hw} ${plural(hw)}` : "") + (al ? ` · 🚨 ${al} ${al === 1 ? "урок під тривогою" : "уроки під тривогою"}` : "");
}
function home() {
  const due = byDue();
  const t = today();
  const days = Object.keys(due).filter((d) => d > t).sort();
  let html = (ALERTS.now ? `<a class="alert-line" href="#/alerts">🚨 Повітряна тривога в Києві</a>` : "") + nowCard();
  if (!days.length) {
    html += `<h1>Нічого не задано</h1><p class="sub">Найближчими днями здавати нічого.</p>`;
  } else {
    const first = days[0];
    html += `<h1>Здати ${whenDay(first)}</h1><p class="sub">${longDay(first)}${hwCount(due[first])}</p>`;
    html += sortSubj(due[first]).map((e) => card(e)).join("");
    const limit = iso(addDays(parse(first), 7));
    const next = days.slice(1).filter((d) => d <= limit);
    if (next.length) {
      html += `<h2>Далі</h2>`;
      for (const d of next) {
        html += `<div class="day-h"><b>${cap(relDay(d))}</b><span>${longDay(d)}</span></div>`;
        html += sortSubj(due[d]).map((e) => card(e)).join("");
      }
    }
  }
  const nodue = ALL.filter((e) => !e.due && e.given >= iso(addDays(new Date(), -14)));
  if (nodue.length) html += `<h2>Без дати здачі</h2>` + nodue.map((e) => card(e)).join("");
  if (!ALL.length) html += `<div class="empty">Тут зʼявиться ДЗ, щойно бот його опублікує.</div>`;
  return html;
}

function dayTable(s, legend = true) {
  const ls = plan(s);
  const d = parse(s);
  if (!ls.length) {
    const why = d.getDay() === 0 || d.getDay() === 6 ? "Вихідний" : SCHOOL.holidays.includes(s) ? "Канікули" : "Уроків немає";
    return `<div class="empty small">${why}</div>`;
  }
  return `<ol class="lessons">${ls.map(([n, tag, r]) => {
    const b = bell(n);
    const p = b ? alertPct(s, n) : 0;
    return `<li class="${p ? "al" : ""}" style="--c:${subj(tag).color};--g:${groupColor(tag)};--ap:${p}%"><span class="ln">${n}</span>
      <a href="#/s/${encodeURIComponent(tag)}">${esc(subj(tag).name)}<i class="gdot"></i></a>
      <span class="lr">${p ? `<span class="apct" title="${p}% уроку під тривогою">🚨 ${p}%</span> · ` : ""}${b ? `${b[0]}–${b[1]} · ` : ""}${room(r, tag)}</span></li>`;
  }).join("")}</ol>${legend ? groupLegend() : ""}`;
}

const groupLegend = () =>
  `<p class="legend groups">${GROUPS.map(([name, c]) => `<span><i class="dot" style="--c:${c}"></i>${esc(name)}</span>`).join("")}</p>`;

// ---------- Розклад на тиждень ----------
const nowSec = () => { const d = new Date(); return d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds(); };
// Чи закінчились сьогоднішні уроки (без дзвінків — після 15:00)
function dayOver(s) {
  const ls = plan(s), last = ls[ls.length - 1], b = last && bell(last[0]);
  return nowSec() >= (b ? toMin(b[1]) : 15 * 60) * 60;
}
// День, що показується зверху: сьогодні, а якщо уроки скінчились — наступний навчальний
function focusDay() {
  const t = today();
  return plan(t).length && !dayOver(t) ? t : nextSchoolDay(t);
}
function focusCard(s) {
  if (!s) return `<section class="focus" id="focus"><div class="empty small">Найближчим часом уроків немає.</div></section>`;
  const live = s === today() && SCHOOL.bells.length > 0;
  const sec = nowSec(), ls = plan(s);
  let rows = "", nextFound = false;
  ls.forEach(([n, tag, r], i) => {
    const b = bell(n);
    let cls = "", right = `${b ? `${b[0]}–${b[1]} · ` : ""}${room(r, tag)}`;
    if (live && b) {
      const st = toMin(b[0]) * 60, en = toMin(b[1]) * 60;
      if (sec >= en) cls = "past";
      else if (sec >= st) {
        cls = "cur"; nextFound = true;
        right = `<span class="left">${i === ls.length - 1 ? "до кінця уроків" : "до перерви"} <b>${mmss(en - sec)}</b></span>`;
      } else if (!nextFound) {
        cls = "next"; nextFound = true;
        rows += `<li class="brk" style="--c:transparent"><span>${i ? "Перерва" : "До початку уроків"}</span><span>ще <b>${mmss(st - sec)}</b></span></li>`;
      }
    }
    rows += `<li class="${cls}" style="--c:${subj(tag).color};--g:${groupColor(tag)}"><span class="ln">${n}</span>
      <a href="#/s/${encodeURIComponent(tag)}">${esc(subj(tag).name)}<i class="gdot"></i></a>
      <span class="lr">${right}</span></li>`;
  });
  const head = s === today() ? "Сьогодні" : cap(relDay(s));
  return `<section class="focus" id="focus"><div class="day-h"><b>${head}</b><span>${WD.includes(relDay(s)) ? short(s) : `${WD[parse(s).getDay()]}, ${short(s)}`}</span></div>
    <ol class="lessons">${rows}</ol></section>`;
}

let weekOff = null;
function weekPage() {
  const t = parse(today());
  if (weekOff === null) weekOff = t.getDay() === 0 || t.getDay() === 6 ? 1 : 0;
  const mon = addDays(t, -((t.getDay() + 6) % 7) + 7 * weekOff);
  const fri = addDays(mon, 4);
  const type = SCHOOL.weeks[iso(mon)];
  const title = weekOff === 0 ? "Цей тиждень" : weekOff === 1 ? "Наступний тиждень" : weekOff === -1 ? "Минулий тиждень" : "Тиждень";
  const focus = focusDay();
  const days = [0, 1, 2, 3, 4].map((i) => {
    const s = iso(addDays(mon, i));
    const h = `<div class="day-h"><b>${cap(WD[parse(s).getDay()])}</b><span>${short(s)}${s === today() ? " · сьогодні" : ""}</span></div>`;
    return s === focus
      ? `<div class="week-day">${h}<button type="button" class="moved" data-top>↑ Показано зверху</button></div>`
      : `<div class="week-day">${h}${dayTable(s, false)}</div>`;
  }).join("");
  return `<div class="prefs">${prefSwitches(pref())}</div>
    ${focusCard(focus)}
    <div class="cal-nav"><button data-week="-1" aria-label="Попередній тиждень">‹</button>
      <div class="week-t"><h1>${title}</h1><span>${short(iso(mon))} – ${short(iso(fri))}${type ? ` · тиждень ${type === "A" ? "А" : "Б"}` : ""}</span></div>
      <button data-week="1" aria-label="Наступний тиждень">›</button></div>
    ${groupLegend()}<div class="week">${days}</div>`;
}

// Перше відкриття сайту: питаємо групу й мову
function showSetup() {
  const draft = { group: null, lang: null };
  const box = document.createElement("div");
  box.className = "setup";
  box.innerHTML = `<div class="setup-box" role="dialog" aria-modal="true" aria-labelledby="setup-h">
    <h2 id="setup-h">Привіт! 👋</h2>
    <p>Обери свою групу й мову — сайт покаже твій розклад. Змінити можна у вкладці «Розклад».</p>
    <div class="q">Група</div><div class="slot-g"></div>
    <div class="q">Друга іноземна</div><div class="slot-l"></div>
    <button type="button" class="go" disabled>Готово</button></div>`;
  const draw = () => {
    const sw = document.createElement("div");
    sw.innerHTML = prefSwitches(draft);
    box.querySelector(".slot-g").replaceChildren(sw.children[0]);
    box.querySelector(".slot-l").replaceChildren(sw.children[0]);
    box.querySelector(".go").disabled = !(draft.group && draft.lang);
  };
  box.addEventListener("click", (ev) => {
    const g = ev.target.closest("[data-pg]"), l = ev.target.closest("[data-pl]");
    if (g) { draft.group = Number(g.dataset.pg); draw(); }
    if (l) { draft.lang = l.dataset.pl; draw(); }
    if (ev.target.closest(".go") && draft.group && draft.lang) {
      savePref({ group: draft.group, lang: draft.lang });
      box.remove();
      document.body.classList.remove("no-scroll");
      render();
    }
  });
  draw();
  document.body.append(box);
  document.body.classList.add("no-scroll");
  box.querySelector("button").focus();
}

let calMonth = null, calSel = null;
function cal() {
  const due = byDue();
  const t = today();
  if (!calMonth) {
    calSel = t;
    calMonth = new Date(parse(t).getFullYear(), parse(t).getMonth(), 1);
  }
  const y = calMonth.getFullYear(), m = calMonth.getMonth();
  const startPad = (new Date(y, m, 1).getDay() + 6) % 7;
  const daysIn = new Date(y, m + 1, 0).getDate();
  let cells = WD_SHORT.map((w) => `<div class="wd">${w}</div>`).join("");
  for (let i = 0; i < startPad; i++) cells += `<div class="d out"></div>`;
  for (let n = 1; n <= daysIn; n++) {
    const d = new Date(y, m, n), s = iso(d), wk = d.getDay() === 0 || d.getDay() === 6;
    const items = due[s] || [];
    const cls = ["d", wk && "wk", !wk && SCHOOL.holidays.includes(s) && "hol", s === t && "today", s === calSel && "sel"].filter(Boolean).join(" ");
    const dots = sortSubj(items).map((e) => `<i class="dot" style="--c:${subj(e.tag).color}"></i>`).join("");
    const label = `${n} ${MON[m]}${items.length ? `, ${items.length} ${plural(items.length)}` : ""}`;
    cells += `<button class="${cls}" data-day="${s}" aria-label="${label}">${n}<span class="dots">${dots}</span></button>`;
  }
  const sel = due[calSel] || [];
  return `<div class="cal-nav"><button data-mon="-1" aria-label="Попередній місяць">‹</button>
      <h1>${MON_N[m]} ${y}</h1><button data-mon="1" aria-label="Наступний місяць">›</button></div>
    <div class="grid">${cells}</div>
    <p class="legend">Крапки — дні, коли треба здати ДЗ. Натисни на будь-який день.</p>
    <div class="day-h"><b>${cap(relDay(calSel))}</b><span>${longDay(calSel)}</span></div>
    <h3>Розклад</h3>${dayTable(calSel)}
    <h3>ДЗ на цей день</h3>
    ${sel.length ? sortSubj(sel).map((e) => card(e)).join("") : `<div class="empty small">Нічого не задано.</div>`}`;
}

function subjects() {
  const count = {};
  for (const e of ALL) if (!e.alert) count[e.tag] = (count[e.tag] || 0) + 1;
  const tile = (t) => {
    const s = subj(t);
    const k = tagsOf(t).reduce((n, x) => n + (count[x] || 0), 0);
    if (t === "Укр" && !k) return "";
    const book = SCHOOL.books[t] ? `<i class="tile-book" title="Є підручник">📖</i>` : "";
    return `<a class="tile${k ? "" : " none"}" style="--c:${s.color}" href="#/s/${encodeURIComponent(t)}">
      <b>${esc(s.name)}</b><span>${k ? `${k} ${plural(k)}` : "ДЗ поки немає"}${book}</span></a>`;
  };
  const groups = GROUPS.map(([name, , tags]) =>
    `<h2 class="group">${esc(name)}</h2><div class="tiles">${tags.filter((t) => t !== otherLang()).map(tile).join("")}</div>`).join("");
  return `<h1>Предмети</h1><p class="sub">Розклад, підручник і всі ДЗ предмета.</p>${groups}`;
}

function upcomingLessons(tag, n = 5) {
  const out = [];
  const t = today();
  for (let i = 0; i < 60 && out.length < n; i++) {
    const s = iso(addDays(parse(t), i));
    for (const l of plan(s)) if (l[1] === tag) out.push([s, l]);
  }
  return out.slice(0, n);
}

function subject(tag) {
  const s = subj(tag);
  const extra = ALSO[tag] || [];
  const list = ALL.filter((e) => tagsOf(tag).includes(e.tag)).sort((a, b) => (b.given + (b.added || "")).localeCompare(a.given + (a.added || "")));
  const book = SCHOOL.books[tag];
  const files = FILES.filter((f) => f.tag === tag);
  const up = upcomingLessons(tag);
  const upHtml = up.length ? `<ul class="up">${up.map(([d, [n, , r]]) => {
    const b = bell(n);
    return `<li><b>${WD_TINY[parse(d).getDay()]} ${short(d)}</b> · ${n} урок${b ? ` (${b[0]})` : ""} · ${room(r, tag)}</li>`;
  }).join("")}</ul>` : `<p class="muted">У розкладі цього предмета немає.</p>`;
  return `<a class="back" href="#/s">‹ Предмети</a>
    <h1 style="color:${s.color}">${esc(s.name)}</h1>
    <p class="sub">Вчитель: ${esc(teacher(tag))}${extra.length ? ` · + ${extra.map((x) => esc(subj(x).name)).join(", ")}` : ""}</p>
    <div class="subj-info">
      <section><h3>Найближчі уроки</h3>${upHtml}</section>
      <section><h3>Підручник</h3>${book
        ? `<a class="btn-book" href="${bookUrl(book.slug)}" target="_blank" rel="noopener"><i class="ic">📖</i>Відкрити підручник</a>`
        : `<p class="muted">Підручника поки немає.</p>`}
        ${files.length ? `<h3>Файли</h3>${fileList(files)}` : ""}</section>
    </div>
    <h2>ДЗ ${list.length ? `<span class="muted">· ${list.length}</span>` : ""}</h2>
    ${list.length ? list.map((e) => card(e, { showSubj: e.tag !== tag })).join("") : `<div class="empty">З цього предмета ще нічого не задавали.</div>`}`;
}

function fileList(files) {
  return `<ul class="files">${files.map((f) => `<li><a href="${esc(f.path)}" target="_blank" rel="noopener" download="${esc(f.name)}">
      <b>${esc(f.title || f.name)}</b><span>${esc(subj(f.tag).name)} · ${short(f.added.slice(0, 10))} · ${sizeStr(f.size)}</span></a></li>`).join("")}</ul>`;
}

function filesPage() {
  const books = sortSubj(SUBJECTS.map(([t, n, c]) => ({ tag: t, n, c }))).map(({ tag, n, c }) => [tag, n, c])
    .filter(([t]) => SCHOOL.books[t]).map(([t, n, c]) =>
    `<li><a href="${bookUrl(SCHOOL.books[t].slug)}" target="_blank" rel="noopener" style="--c:${c}"><b><i class="ic">📖</i>${esc(n)}</b><span>PDF · відкрити</span></a></li>`).join("");
  const teach = [...FILES].sort((a, b) => b.added.localeCompare(a.added));
  return `<h1>Файли</h1><p class="sub">Підручники й файли від учителів.</p>
    <h2>Від учителів</h2>${teach.length ? fileList(teach) : `<div class="empty small">Поки нічого немає.</div>`}
    <h2>Підручники</h2><ul class="files books">${books || ""}</ul>`;
}

let secretHtml = null;
function secretPage() {
  if (secretHtml !== null) {
    return `<h1>Секрет</h1>${secretHtml || `<div class="empty">Тут поки порожньо.</div>`}`;
  }
  return `<h1>Секрет</h1><form class="lock" id="lock" autocomplete="off">
      <p class="sub">Введи пароль, щоб побачити вміст.</p>
      <input id="pw" type="password" inputmode="numeric" placeholder="Пароль" aria-label="Пароль" required>
      <button type="submit">Відкрити</button>
      <p class="err" id="pwerr" role="alert"></p></form>`;
}

// ---------- роутинг ----------
const app = document.getElementById("app");
let timer = null;
function render() {
  const h = decodeURIComponent(location.hash.slice(1) || "/");
  let tab = "home", html;
  if (h === "/cal") { tab = "cal"; html = cal(); }
  else if (h === "/s") { tab = "subj"; html = subjects(); }
  else if (h.startsWith("/s/")) { tab = "subj"; html = subject(h.slice(3)); }
  else if (h === "/week") { tab = "week"; html = weekPage(); }
  else if (h === "/files") { tab = "files"; html = filesPage(); }
  else if (h === "/secret") { tab = "secret"; html = secretPage(); }
  else if (h === "/alerts") { tab = "alerts"; html = alertsPage(); }
  else html = home();
  app.innerHTML = html;
  document.querySelectorAll(".tabs a, .drawer a").forEach((a) => a.classList.toggle("on", a.dataset.tab === tab));
  document.getElementById("more").classList.toggle("on", ["subj", "files", "secret", "alerts"].includes(tab));
  setDrawer(false);
  clearInterval(timer);
  if (tab === "week" && SCHOOL.bells.length) {
    const shown = focusDay();
    timer = setInterval(() => {
      const f = focusDay();
      if (f !== shown) return render();
      const el = document.getElementById("focus");
      if (el) el.outerHTML = focusCard(f);
    }, 1000);
  }
  if (tab === "home" && SCHOOL.bells.length) {
    timer = setInterval(() => {
      const el = document.getElementById("now");
      if (el) el.outerHTML = nowCard();
    }, 1000);
  }
}
window.addEventListener("hashchange", () => { render(); scrollTo(0, 0); });

app.addEventListener("click", (ev) => {
  const day = ev.target.closest("[data-day]");
  if (day) { calSel = day.dataset.day; render(); return; }
  const pg = ev.target.closest("[data-pg]"), pl = ev.target.closest("[data-pl]");
  if (pg || pl) {
    savePref({ ...pref(), ...(pg ? { group: Number(pg.dataset.pg) } : { lang: pl.dataset.pl }) });
    render(); return;
  }
  if (ev.target.closest("[data-top]")) { scrollTo({ top: 0, behavior: "smooth" }); return; }
  const wk = ev.target.closest("[data-week]");
  if (wk) { weekOff += Number(wk.dataset.week); render(); return; }
  const mon = ev.target.closest("[data-mon]");
  if (mon) { calMonth = new Date(calMonth.getFullYear(), calMonth.getMonth() + Number(mon.dataset.mon), 1); render(); return; }
  const img = ev.target.closest("[data-img]");
  if (img) openViewer(img.dataset.img);
});

app.addEventListener("submit", async (ev) => {
  if (ev.target.id !== "lock") return;
  ev.preventDefault();
  const err = document.getElementById("pwerr");
  const pw = document.getElementById("pw").value;
  err.textContent = "";
  try {
    const r = await fetch("api/secret", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pw }) });
    const j = await r.json();
    if (j.ok) { secretHtml = j.html || ""; render(); }
    else err.textContent = j.error || "Неправильний пароль";
  } catch {
    err.textContent = "Немає звʼязку із сервером";
  }
});

// ---------- бокове меню ----------
const drawer = document.getElementById("drawer");
const backdrop = document.getElementById("backdrop");
const moreBtn = document.getElementById("more");
function setDrawer(open) {
  drawer.classList.toggle("open", open);
  if (!open && drawer.contains(document.activeElement)) moreBtn.focus({ preventScroll: true });
  drawer.inert = !open;
  moreBtn.setAttribute("aria-expanded", String(open));
  backdrop.hidden = !open;
  document.body.classList.toggle("no-scroll", open);
  if (open) drawer.focus({ preventScroll: true });
}
moreBtn.addEventListener("click", () => setDrawer(!drawer.classList.contains("open")));
backdrop.addEventListener("click", () => setDrawer(false));
document.getElementById("drawer-close").addEventListener("click", () => setDrawer(false));
drawer.addEventListener("click", (e) => { if (e.target.closest("a")) setDrawer(false); });

const viewer = document.getElementById("viewer");
function openViewer(src) { viewer.querySelector("img").src = src; viewer.hidden = false; }
viewer.addEventListener("click", () => { viewer.hidden = true; });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") { viewer.hidden = true; setDrawer(false); } });

const get = (u, fallback) => fetch(`${u}?t=${Date.now()}`, { cache: "no-store" })
  .then((r) => (r.ok ? r.json() : fallback)).catch(() => fallback);
const okAlerts = (a) => a && Array.isArray(a.list);
Promise.all([get("data/homework.json", []), get("data/school.json", null), get("data/files.json", []), get("data/alerts.json", null)])
  .then(([hw, school, files, al]) => {
    RAW = Array.isArray(hw) ? hw : [];
    FILES = Array.isArray(files) ? files : [];
    if (school) SCHOOL = Object.assign(SCHOOL, school);
    if (okAlerts(al)) ALERTS = al;
    applyPref();
    render();
    if (!PREF) showSetup();
  });
// Тривоги оновлюються кожні 30 с; сторінку перемальовуємо, лише коли щось змінилось
setInterval(async () => {
  const al = await get("data/alerts.json", null);
  if (!okAlerts(al)) return;
  const was = JSON.stringify([ALERTS.now, ALERTS.list]);
  ALERTS = al;
  const tab = decodeURIComponent(location.hash.slice(1) || "/");
  if (was !== JSON.stringify([al.now, al.list]) || tab === "/alerts") {
    applyPref();
    if (!document.querySelector(".setup") && !drawer.classList.contains("open")) render();
  }
}, 30000);
