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
// Група = вчителька української: Ганна (u2) — 1 група, Ольга (u1) — 2 група
function withGroup(p) { return { ...p, group: p.ukr === 2 ? 1 : 2 }; }
let PREF = (() => {
  try {
    const p = JSON.parse(localStorage.getItem(PREF_KEY));
    return p && ["de", "es"].includes(p.lang) && [1, 2].includes(p.ukr) && [1, 2].includes(p.tech) ? withGroup(p) : null;
  } catch { return null; }
})();
const pref = () => PREF || { group: 1, lang: "de", ukr: 2, tech: 1 };
const otherLang = () => (pref().lang === "de" ? "Ісп" : "Нім");
const applyPref = () => { ALL = RAW.concat(alertEntries()); };
// Чи це ДЗ для мене (моя група / мова / вчителька). Чуже видно лише в календарі й «Предметах».
function isMine(e) {
  if (e.tag === otherLang()) return false;
  const kind = (SCHOOL.split || {})[e.tag];
  if (!kind || !e.grp) return true;
  return e.grp === (kind === "u" ? pref().ukr : kind === "t" ? pref().tech : pref().group);
}
function grpLabel(e) {
  const kind = (SCHOOL.split || {})[e.tag];
  if (!kind || !e.grp) return "";
  if (kind === "u") return e.grp === 2 ? "Ганна" : "Ольга";
  if (kind === "t") return e.grp === 2 ? "хлопці" : "дівчата";
  return `${e.grp} група`;
}

// ---------- виконане (галочки, зберігаються в браузері) ----------
const DONE_KEY = "dz-done";
let DONE = (() => { try { return new Set(JSON.parse(localStorage.getItem(DONE_KEY)) || []); } catch { return new Set(); } })();
function setDone(id, on) {
  if (on) DONE.add(id); else DONE.delete(id);
  try { localStorage.setItem(DONE_KEY, JSON.stringify([...DONE])); } catch { /* приватний режим */ }
}
const isDone = (e) => DONE.has(String(e.id));
function savePref(p) {
  p = withGroup(p);
  PREF = p;
  try { localStorage.setItem(PREF_KEY, JSON.stringify(p)); } catch { /* приватний режим — тільки до перезавантаження */ }
  applyPref();
}
// Перемикачі: data-pg — група, data-pl — мова, data-pu — з ким українська, data-pt — технології
function prefSwitches(p) {
  const seg = (attr, cur, opts, label) => `<div class="seg" role="group" aria-label="${label}">${opts.map(([v, t]) =>
    `<button type="button" data-${attr}="${v}" aria-pressed="${cur === v}">${t}</button>`).join("")}</div>`;
  return seg("pu", p.ukr, [[2, "Укр.: Ганна (1 гр.)"], [1, "Укр.: Ольга (2 гр.)"]], "Українська мова і група") +
    seg("pl", p.lang, [["de", "Німецька"], ["es", "Іспанська"]], "Мова") +
    seg("pt", p.tech, [[1, "Техн.: Дівч."], [2, "Техн.: Хлопч."]], "Технології");
}
const byDue = (list = ALL) => {
  const m = {};
  for (const e of list) if (e.due) (m[e.due] ||= []).push(e);
  return m;
};
// Уроки дня [[номер, тег, кабінет]] для обраної групи й мови
function plan(s) {
  const d = parse(s), wd = (d.getDay() + 6) % 7;
  const slots = SCHOOL.template[wd];
  if (!slots || SCHOOL.holidays.includes(s)) return [];
  const conds = new Set([SCHOOL.weeks[iso(addDays(d, -wd))], "g" + pref().group, pref().lang, "u" + pref().ukr, "t" + pref().tech]);
  const out = [];
  slots.forEach((opts, i) => {
    const x = opts.find((o) => !o[2] || o[2].split(" ").every((c) => conds.has(c)));
    if (x) out.push([i + 1, x[0], x[1]]);
  });
  return out;
}
// Дзвінки дня: у скорочені дні (short_days) — скорочені
const isShort = (day) => (SCHOOL.short_days || []).includes(day) && (SCHOOL.bells_short || []).length > 0;
const bellsOf = (day = today()) => (isShort(day) ? SCHOOL.bells_short : SCHOOL.bells);
const bell = (n, day = today()) => bellsOf(day)[n - 1];
// Учитель з урахуванням групи / вчительки української / «дівчинка-хлопчик» для технологій
function teacher(t) {
  const v = SCHOOL.teachers[t];
  if (!v) return "поки не знаю";
  if (typeof v === "string") return v;
  const p = pref();
  return v[`g${p.group}`] || v[`u${p.ukr}`] || v[`t${p.tech}`] || Object.values(v).join(", ");
}
const shortName = (full) => { const [f, n, m] = String(full).split(" "); return n ? `${f} ${n[0]}.${m ? ` ${m[0]}.` : ""}` : full; };
const room = (r, tag) => (tag === "ФізРа" ? "зал" : !r ? "—" : /^\d/.test(r) ? `каб. ${esc(r)}` : esc(r));
// Підручники предмета: [{slug, offset, title}] (старий сервер віддавав один обʼєкт)
const bookList = (t) => { const b = SCHOOL.books[t]; return !b ? [] : Array.isArray(b) ? b : [b]; };
const bookUrl = (slug, page) => `books/${encodeURIComponent(slug)}.pdf${page ? `#page=${page}` : ""}`;
// Порядок: спершу група важкості (червоні → зелені), усередині — як у списку
const rank = (t) => { const i = ORDER.indexOf(t); return i < 0 ? 999 : i; };
const sortSubj = (list) => [...list].sort((a, b) => rank(a.tag) - rank(b.tag));

// ---------- картка ДЗ ----------
function card(e, { showSubj = true } = {}) {
  const s = subj(e.tag);
  if (e.alert) {
    return `<article class="card alert-card" style="--c:${s.color}">
    <div class="head">${showSubj ? `<a class="subj" href="#/s/${encodeURIComponent(e.tag)}">${esc(s.name)}<i class="gdot" style="--g:${groupColor(e.tag)}"></i></a>` : "<span></span>"}
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
  const done = isDone(e), g = grpLabel(e);
  const del = ADMIN_TOKEN ? `<span class="adm-btns"><button type="button" class="del" data-edit="${esc(e.id)}" aria-label="Редагувати ДЗ">✏️</button><button type="button" class="del" data-del="${esc(e.id)}" aria-label="Видалити ДЗ">🗑</button></span>` : "";
  const check = `<button type="button" class="check" data-done="${esc(e.id)}" role="checkbox" aria-checked="${done}" aria-label="${done ? "Повернути в невиконане" : "Позначити виконаним"}"></button>`;
  return `<article class="card${done ? " is-done" : ""}${isMine(e) ? "" : " not-mine"}" style="--c:${s.color}">
    <div class="head">${check}${showSubj ? `<a class="subj" href="#/s/${encodeURIComponent(e.tag)}">${esc(s.name)}<i class="gdot" style="--g:${groupColor(e.tag)}"></i></a>` : "<span></span>"}
      ${g ? `<span class="grp">${esc(g)}</span>` : ""}<span class="dates">${dates}</span>${del}</div>
    ${ADMIN_TOKEN && EDIT_ID === String(e.id) ? `<form id="edit-form" class="edit-form" data-id="${esc(e.id)}">
      <label>Текст ДЗ<textarea name="hw" rows="4" required>${esc(e.homework)}</textarea></label>
      <label>Здати<input type="date" name="due" value="${esc(e.due || "")}"></label>
      <div class="edit-btns"><button type="submit">Зберегти</button><button type="button" data-edit-cancel>Скасувати</button></div>
      <p class="muted small-note">Зміниться на сайті${e.post ? " і в пості в каналі" : " (пост у каналі старий — його не змінимо)"}.</p></form>`
    : `<p class="hw">${linkify(e.homework)}</p>`}
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
  const b = bell(n, day);
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
      // справжнє ДЗ (моєї групи), задане від дня тривоги до наступного уроку, замінює плашку
      const until = nextLessonOf(tag, d) || "9999-12-31";
      if (RAW.some((e) => e.tag === tag && e.given >= d && e.given < until && isMine(e))) continue;
      seen.add(tag);
      out.push({ id: `alert-${d}-${n}`, alert: true, tag, n, given: d, due: nextLessonOf(tag, d), pct: alertPct(d, n), homework: "" });
    }
  }
  return out;
}
function donePage() {
  const list = ALL.filter((e) => isDone(e)).sort((a, b) => (b.due || b.given).localeCompare(a.due || a.given));
  return `<h1>Виконане</h1><p class="sub">ДЗ, які ти позначив галочкою. Зніми галочку — і воно повернеться на головну.</p>
    ${list.length ? list.map((e) => card(e)).join("") : `<div class="empty">Поки нічого не позначено.</div>`}`;
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
function lessonLine(l, withTime = true, day = today()) {
  const [n, tag, r] = l;
  const b = bell(n, day);
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
  const first = nd && plan(nd).find((l) => bell(l[0], nd));
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
      ? `<div class="next">Наступний урок: <b>${relDay(st.day)}, ${longDay(st.day)}</b> о ${bell(st.l[0], st.day)[0]} — <b>${esc(subj(st.l[1]).name)}</b></div>${lessonLine(st.l, false, st.day)}`
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
  const mine = ALL.filter((e) => isMine(e) && !isDone(e));
  const due = byDue(mine);
  const t = today();
  const days = Object.keys(due).filter((d) => d > t).sort();
  let html = (ALERTS.now ? `<a class="alert-line" href="#/alerts">🚨 Повітряна тривога в Києві</a>` : "") + nowCard() + bdayWidget();
  const debtN = debts().length;
  if (debtN) html += `<a class="debt-line" href="#/debts">⚠️ Боргів: ${debtN} — переглянути ›</a>`;
  const tmr = nextSchoolDay(t), tmrAll = tmr ? RAW.filter((e) => e.due === tmr && isMine(e)) : [];
  if (tmrAll.length && tmrAll.every(isDone)) html += `<div class="all-done">✅ ДЗ ${tmr === iso(addDays(parse(t), 1)) ? "на завтра" : `на ${WD[parse(tmr).getDay()]}`} виконано</div>`;
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
  const nodue = mine.filter((e) => !e.due && e.given >= iso(addDays(new Date(), -14)));
  if (nodue.length) html += `<h2>Без дати здачі</h2>` + nodue.map((e) => card(e)).join("");
  if (!ALL.length) html += `<div class="empty">Тут зʼявиться ДЗ, щойно бот його опублікує.</div>`;
  const doneN = ALL.filter((e) => isMine(e) && isDone(e) && e.due && e.due > today()).length;
  if (doneN) html += `<a class="done-btn" href="#/done">✔ Виконано: ${doneN} — переглянути</a>`;
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
    const b = bell(n, s);
    const p = b ? alertPct(s, n) : 0;
    return `<li class="${p ? "al" : ""}" style="--c:${subj(tag).color};--g:${groupColor(tag)};--ap:${p}%"><span class="ln">${n}</span>
      <span class="nm"><a href="#/s/${encodeURIComponent(tag)}">${esc(subj(tag).name)}<i class="gdot"></i></a></span>
      <span class="lr">${p ? `<span class="apct" title="${p}% уроку під тривогою">🚨 ${p}%</span> · ` : ""}${b ? `${b[0]}–${b[1]} · ` : ""}${room(r, tag)}</span></li>`;
  }).join("")}</ol>${isShort(s) ? `<p class="short-note">⏱ Скорочені уроки</p>` : ""}${legend ? groupLegend() : ""}`;
}

const groupLegend = () =>
  `<p class="legend groups">${GROUPS.map(([name, c]) => `<span><i class="dot" style="--c:${c}"></i>${esc(name)}</span>`).join("")}</p>`;

// ---------- Розклад на тиждень ----------
const nowSec = () => { const d = new Date(); return d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds(); };
// Чи закінчились сьогоднішні уроки (без дзвінків — після 15:00)
function dayOver(s) {
  const ls = plan(s), last = ls[ls.length - 1], b = last && bell(last[0], s);
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
    const b = bell(n, s);
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
      <span class="nm"><a href="#/s/${encodeURIComponent(tag)}">${esc(subj(tag).name)}<i class="gdot"></i></a>${cls === "cur" ? `<small class="tch">${esc(shortName(teacher(tag)))}</small>` : ""}</span>
      <span class="lr">${right}</span></li>`;
  });
  const head = s === today() ? "Сьогодні" : cap(relDay(s));
  return `<section class="focus" id="focus"><div class="day-h"><b>${head}</b><span>${WD.includes(relDay(s)) ? short(s) : `${WD[parse(s).getDay()]}, ${short(s)}`}</span></div>
    <ol class="lessons">${rows}</ol>${isShort(s) ? `<p class="short-note">⏱ Скорочені уроки</p>` : ""}</section>`;
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
  const draft = { group: null, lang: null, ukr: null, tech: null };
  const box = document.createElement("div");
  box.className = "setup";
  box.innerHTML = `<div class="setup-box" role="dialog" aria-modal="true" aria-labelledby="setup-h">
    <h2 id="setup-h">Привіт! 👋</h2>
    <p>Обери вчительку української (від неї залежить група), мову й технології — сайт покаже твій розклад. Змінити можна у вкладці «Розклад».</p>
    <div class="q">Українська мова з… (= твоя група)</div><div class="slot-u"></div>
    <div class="q">Друга іноземна</div><div class="slot-l"></div>
    <div class="q">Технології</div><div class="slot-t"></div>
    <button type="button" class="go" disabled>Готово</button></div>`;
  const draw = () => {
    const sw = document.createElement("div");
    sw.innerHTML = prefSwitches(draft);
    box.querySelector(".slot-u").replaceChildren(sw.children[0]);
    box.querySelector(".slot-l").replaceChildren(sw.children[0]);
    box.querySelector(".slot-t").replaceChildren(sw.children[0]);
    box.querySelector(".go").disabled = !(draft.lang && draft.ukr && draft.tech);
  };
  box.addEventListener("click", (ev) => {
    const l = ev.target.closest("[data-pl]");
    if (l) { draft.lang = l.dataset.pl; draw(); }
    const u = ev.target.closest("[data-pu]");
    if (u) { draft.ukr = Number(u.dataset.pu); draw(); }
    const tt = ev.target.closest("[data-pt]");
    if (tt) { draft.tech = Number(tt.dataset.pt); draw(); }
    if (ev.target.closest(".go") && draft.lang && draft.ukr && draft.tech) {
      savePref({ lang: draft.lang, ukr: draft.ukr, tech: draft.tech });
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

// Середня важкість ДЗ дня: червоний 4, помаранчевий 3, жовтий 2, зелений 1 (алгебра й англійська — як помаранчеві)
function avgColor(items) {
  const w = (t) => (t === "Алгебра" || t === "Англ" ? 3 : 4 - Math.max(0, GROUPS.findIndex(([, , tags]) => tags.includes(t))));
  const list = items.filter((e) => !e.alert);
  if (!list.length) return "var(--danger)";
  const avg = list.reduce((s, e) => s + w(e.tag), 0) / list.length;
  return GROUPS[4 - Math.min(4, Math.max(1, Math.round(avg)))][1];
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
    const dots = items.length ? `<i class="dot" style="--c:${avgColor(items)}"></i>` : "";
    const label = `${n} ${MON[m]}${items.length ? `, ${items.length} ${plural(items.length)}` : ""}`;
    cells += `<button class="${cls}" data-day="${s}" aria-label="${label}">${n}<span class="dots">${dots}</span></button>`;
  }
  const sel = due[calSel] || [];
  return `<div class="cal-nav"><button data-mon="-1" aria-label="Попередній місяць">‹</button>
      <h1>${MON_N[m]} ${y}</h1><button data-mon="1" aria-label="Наступний місяць">›</button></div>
    <div class="grid">${cells}</div>
    <p class="legend">Крапки — дні, коли треба здати ДЗ. Натисни на будь-який день.</p>
    <div class="day-h"><b>${cap(relDay(calSel))}</b><span>${longDay(calSel)}</span></div>
    <a class="visits-btn" href="#/visits/${calSel}">👥 Відвідування ›</a>
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
    const book = bookList(t).length ? `<i class="tile-book" title="Є підручник">📖</i>` : "";
    return `<a class="tile${k ? "" : " none"}" style="--c:${s.color}" href="#/s/${encodeURIComponent(t)}">
      <b>${esc(s.name)}</b><span>${k ? `${k} ${plural(k)}` : "ДЗ поки немає"}${book}</span></a>`;
  };
  const groups = GROUPS.map(([name, , tags]) =>
    `<h2 class="group">${esc(name)}</h2><div class="tiles">${tags.map(tile).join("")}</div>`).join("");
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
  const bks = bookList(tag);
  const files = FILES.filter((f) => f.tag === tag);
  const up = upcomingLessons(tag);
  const upHtml = up.length ? `<ul class="up">${up.map(([d, [n, , r]]) => {
    const b = bell(n, d);
    return `<li><b>${WD_TINY[parse(d).getDay()]} ${short(d)}</b> · ${n} урок${b ? ` (${b[0]})` : ""} · ${room(r, tag)}</li>`;
  }).join("")}</ul>` : `<p class="muted">У розкладі цього предмета немає.</p>`;
  return `<a class="back" href="#/s">‹ Предмети</a>
    <h1 style="color:${s.color}">${esc(s.name)}</h1>
    <p class="sub">Вчитель: ${esc(teacher(tag))}${extra.length ? ` · + ${extra.map((x) => esc(subj(x).name)).join(", ")}` : ""}</p>
    <div class="subj-info">
      <section><h3>Найближчі уроки</h3>${upHtml}</section>
      <section><h3>Підручник</h3>${bks.length
        ? bks.map((b) => `<a class="btn-book" href="${bookUrl(b.slug)}" target="_blank" rel="noopener"><i class="ic">📖</i>${esc(b.title || "Відкрити підручник")}</a>`).join("")
        : `<p class="muted">Підручника поки немає.</p>`}
        ${files.length ? `<h3>Файли</h3>${fileList(files)}` : ""}
        ${ADMIN_TOKEN ? `<form class="upform" id="upform" data-tag="${esc(tag)}">
          <h3>＋ Додати фото або файл</h3>
          <input type="file" name="f" required aria-label="Файл">
          <input type="text" name="title" placeholder="Назва (необовʼязково)" maxlength="150" aria-label="Назва">
          <button type="submit">Додати</button>
          <p class="muted small-note">До 25 МБ. Зʼявиться тут і у «Файлах» з датою додавання.</p></form>` : ""}</section>
    </div>
    ${(() => {
      if (!list.length) return `<h2>ДЗ</h2><div class="empty">З цього предмета ще нічого не задавали.</div>`;
      const open = list.filter((e) => e.alert || !isDone(e)), done = list.filter((e) => !e.alert && isDone(e));
      const cards = (l) => l.map((e) => card(e, { showSubj: e.tag !== tag })).join("");
      return `<h2>Невиконані <span class="muted">· ${open.length}</span></h2>${open.length ? cards(open) : `<div class="empty small">Усе виконано 🎉</div>`}
        <h2>Виконані <span class="muted">· ${done.length}</span></h2>${done.length ? cards(done) : `<div class="empty small">Ще нічого не позначено.</div>`}`;
    })()}`;
}

const isImg = (name) => /\.(jpe?g|png|webp|gif|heic)$/i.test(name || "");
function fileList(files) {
  return `<ul class="files">${files.map((f) => {
    const img = isImg(f.path) && !/\.heic$/i.test(f.path);
    const added = `додано ${short(f.added.slice(0, 10))}${f.added.length > 15 ? ` о ${f.added.slice(11, 16)}` : ""}`;
    const del = ADMIN_TOKEN ? `<button type="button" class="file-del" data-fdel="${esc(f.id)}" aria-label="Видалити файл">🗑</button>` : "";
    return `<li class="${img ? "has-thumb" : ""}">${img ? `<button type="button" class="thumb" data-img="${esc(f.path)}" aria-label="Відкрити фото"><img src="${esc(f.path)}" loading="lazy" alt=""></button>` : ""}
      <a href="${esc(f.path)}" target="_blank" rel="noopener" download="${esc(f.name)}">
      <b>${esc(f.title || f.name)}</b><span>${esc(subj(f.tag).name)} · ${added} · ${sizeStr(f.size)}</span></a>${del}</li>`;
  }).join("")}</ul>`;
}

function filesPage() {
  const books = sortSubj(SUBJECTS.map(([t, n, c]) => ({ tag: t, n, c }))).map(({ tag, n, c }) => [tag, n, c])
    .flatMap(([t, n, c]) => bookList(t).map((b) =>
    `<li><a href="${bookUrl(b.slug)}" target="_blank" rel="noopener" style="--c:${c}"><b><i class="ic">📖</i>${esc(n)}</b><span>${b.title ? `${esc(b.title)} · ` : ""}PDF · відкрити</span></a></li>`)).join("");
  const teach = [...FILES].sort((a, b) => b.added.localeCompare(a.added));
  return `<h1>Файли</h1><p class="sub">Підручники й файли від учителів.</p>
    <h2>Від учителів</h2>${teach.length ? fileList(teach) : `<div class="empty small">Поки нічого немає.</div>`}
    <h2>Підручники</h2><ul class="files books">${books || ""}</ul>`;
}

// ---------- адмінпанель ----------
// Ключ видає сервер після пароля адмінпанелі; живе до закриття вкладки (на сервері — 12 год)
let ADMIN_TOKEN = (() => { try { return sessionStorage.getItem("dz-admin"); } catch { return null; } })();
function setToken(t) {
  ADMIN_TOKEN = t;
  try { t ? sessionStorage.setItem("dz-admin", t) : sessionStorage.removeItem("dz-admin"); } catch { /* приватний режим */ }
  ADM = { tab: ADM.tab, data: null };
}
let ADM = { tab: "visitors", data: null };
let EDIT_ID = null;
async function adminApi(action, body = {}) {
  const r = await fetch(`api/admin/${action}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...body, token: ADMIN_TOKEN }) });
  const j = await r.json().catch(() => ({}));
  if (r.status === 401) { setToken(null); render(); throw new Error("Сесія адміна закінчилась — увійди ще раз."); }
  if (!j.ok) throw new Error(j.error || "Помилка");
  return j;
}
async function loadAdmin() {
  try {
    const [v, d] = await Promise.all([adminApi("visitors"), adminApi("deleted")]);
    ADM.data = { visitors: v.visitors, blocked: v.blocked, you: v.you, deleted: d.list };
  } catch (e) { ADM.data = { error: e.message }; }
  if ((location.hash.slice(1) || "/") === "/admin") render();
}
const fmtTime = (s) => (s ? `${short(s.slice(0, 10))} ${s.slice(11, 16)}` : "—");
const shortUa = (ua) => (/iPhone|iPad/.test(ua) ? "iPhone/iPad" : /Android/.test(ua) ? "Android" : /Windows/.test(ua) ? "Windows" : /Mac OS/.test(ua) ? "Mac" : /curl|bot|python/i.test(ua) ? "бот/скрипт" : "інше");
function lockForm(id, title, hint) {
  return `<h1>${title}</h1><form class="lock" id="${id}" autocomplete="off">
      <p class="sub">${hint}</p>
      <input id="${id}-pw" type="password" inputmode="numeric" placeholder="Пароль" aria-label="Пароль" required>
      <button type="submit">Увійти</button>
      <p class="err" id="${id}-err" role="alert"></p></form>`;
}
function adminPage() {
  if (!ADMIN_TOKEN) return lockForm("lock", "Адмінпанель", "Тільки для адмінів. Введи пароль.");
  if (!ADM.data) { loadAdmin(); return `<h1>Адмінпанель</h1><p class="muted pad">Завантаження…</p>`; }
  if (ADM.data.error) return `<h1>Адмінпанель</h1><div class="empty">${esc(ADM.data.error)}</div>`;
  const tabs = [["add", "＋ Додати ДЗ"], ["visitors", "Відвідувачі й блок"], ["deleted", `Видалені ДЗ${ADM.data.deleted.length ? ` · ${ADM.data.deleted.length}` : ""}`], ["site", "Сайт"]];
  const sub = `<div class="subtabs" role="tablist">${tabs.map(([k, t]) => `<button type="button" role="tab" data-atab="${k}" aria-selected="${ADM.tab === k}">${t}</button>`).join("")}</div>`;
  let body = "";
  const D = ADM.data;
  if (ADM.tab === "add") {
    body = addForm();
  } else if (ADM.tab === "visitors") {
    const bl = new Set(D.blocked.map((b) => b.ip));
    body = `<h2>Заблоковані</h2>${D.blocked.length ? `<ul class="iplist">${D.blocked.map((b) => `<li><div><b>${esc(b.ip)}</b><span>${esc(b.note || "")} · з ${fmtTime(b.when)}</span></div>
        <button type="button" data-unblock="${esc(b.ip)}">Розблокувати</button></li>`).join("")}</ul>` : `<p class="muted">Нікого не заблоковано.</p>`}
      <form id="blockform" class="blockform"><input id="bf-ip" placeholder="IP-адреса" aria-label="IP-адреса" required><input id="bf-note" placeholder="Примітка (необовʼязково)" aria-label="Примітка"><button type="submit">Заблокувати</button></form>
      <h2>Останні відвідувачі</h2><p class="muted small-note">Твоя IP: <b>${esc(D.you)}</b> — її заблокувати не можна.</p>
      <ul class="iplist">${D.visitors.map((v) => `<li class="${bl.has(v.ip) ? "is-blocked" : ""}"><div><b>${esc(v.ip)}${v.ip === D.you ? " (ти)" : ""}</b>
        <span>${fmtTime(v.last)} · ${v.hits} запит. · ${esc(shortUa(v.ua || ""))}</span></div>
        ${bl.has(v.ip) ? `<em>заблоковано</em>` : v.ip === D.you ? "" : `<button type="button" data-block="${esc(v.ip)}">Заблокувати</button>`}</li>`).join("") || `<li class="muted">Поки нікого.</li>`}</ul>`;
  } else if (ADM.tab === "deleted") {
    const list = [...D.deleted].reverse();
    body = list.length ? list.map((e) => `<article class="card trash" style="--c:${subj(e.tag).color}">
        <div class="head"><b class="subj">${esc(subj(e.tag).name)}</b><span class="dates">видалено ${fmtTime(e.deleted_at)}</span></div>
        <p class="hw">${linkify(e.homework)}</p><p class="muted small-note">задано ${short(e.given)}${e.due ? ` → здати ${short(e.due)}` : ""}</p>
        <button type="button" class="restore" data-restore="${esc(e.id)}">↩ Повернути на сайт</button></article>`).join("")
      : `<div class="empty">Кошик порожній.</div>`;
  } else {
    const soon = (SCHOOL.short_days || []).filter((d) => d >= today());
    body = `<h2>Скорочені уроки</h2>
      <form id="shortform" class="blockform"><input type="date" id="sf-day" value="${today()}" aria-label="День" required>
        <button type="submit" data-on="1">⏱ Увімкнути</button><button type="submit" data-on="0">Вимкнути</button></form>
      <p class="muted small-note">${soon.length ? "Скорочені дні: " + soon.map((d) => `${WD_TINY[parse(d).getDay()]} ${short(d)}`).join(", ") : "Скорочених днів не заплановано."}
        З Telegram: /short, /short 12.11, /short off 12.11.</p>
      <h2>Перезапуск</h2>
      <p>Перезапуск займає ~5–10 секунд: сайт сам перезавантажить сторінку, коли знову запрацює.</p>
      <button type="button" class="btn-danger" data-restart>🔄 Перезапустити сайт</button>
      <p class="muted small-note">Те саме з Telegram: /restartsite. Ще є /stopsite, /startsite, /restartbot, /fullrestart.</p>`;
  }
  return `<h1>Адмінпанель</h1><div class="unlock">🔓 Адмін-режим увімкнено: на картках ДЗ є ✏️ і 🗑. Інструкції — у вкладці «Інфо».
      <button type="button" data-lockout>Вийти</button></div>${sub}<div class="admin-body">${body}</div>`;
}

// ---------- адмін: додати ДЗ з сайту ----------
let ADD = { tag: "", grp: 0 };
function addForm() {
  const kind = (SCHOOL.split || {})[ADD.tag];
  const opts = ORDER.filter((t) => t !== "Укр").map((t) => `<option value="${t}"${t === ADD.tag ? " selected" : ""}>${esc(subj(t).name)}</option>`).join("");
  const grpOpts = !kind ? "" : (kind === "u" ? [[2, "Ганна"], [1, "Ольга"]] : kind === "t" ? [[1, "дівчата"], [2, "хлопці"]] : [[1, "1 група"], [2, "2 група"]])
    .map(([v, t]) => `<button type="button" data-addgrp="${v}" aria-pressed="${ADD.grp === v}">${t}</button>`).join("");
  const due = ADD.tag && (!kind || ADD.grp) ? suggestDue(ADD.tag, today(), ADD.grp) : "";
  return `<form id="addform" class="edit-form add-form">
    <label>Предмет<select name="tag" required><option value="">— вибери —</option>${opts}</select></label>
    ${kind ? `<div><div class="q">${kind === "u" ? "Українська з ким" : kind === "t" ? "Технології" : "Група"}</div><div class="seg">${grpOpts}</div></div>` : ""}
    <div class="row2"><label>Задано<input type="date" name="given" value="${today()}" required></label>
      <label>Здати<input type="date" name="due" value="${due}"></label></div>
    <label>Текст ДЗ<textarea name="hw" rows="4" required placeholder="№ 390, 391; § 12 читати"></textarea></label>
    <label class="chk"><input type="checkbox" name="channel" checked> Також опублікувати в Telegram-канал</label>
    <div class="edit-btns"><button type="submit">Додати</button></div>
    <p class="muted small-note">Дата «здати» підставляється сама — наступний урок за розкладом (для обраної групи). Можна змінити.</p></form>`;
}
// Наступний урок предмета для заданої групи/варіанта (як у боті)
function suggestDue(tag, from, grp) {
  const kind = (SCHOOL.split || {})[tag];
  const saved = PREF;
  PREF = { ...pref(), ...(kind === "g" ? { group: grp } : kind === "u" ? { ukr: grp } : kind === "t" ? { tech: grp } : {}), lang: tag === "Ісп" ? "es" : tag === "Нім" ? "de" : pref().lang };
  const d = nextLessonOf(tag, from);
  PREF = saved;
  return d || "";
}

let ADD_TEXT = "";
const keepAddText = () => { const t = document.querySelector("#addform textarea"); if (t) ADD_TEXT = t.value; };
const restoreAddText = () => { const t = document.querySelector("#addform textarea"); if (t) t.value = ADD_TEXT; };

// ---------- клас: розсадка й дні народження ----------
let CLASS = { seats: [], birthdays: [], columns: 3 };
function seatsPage() {
  const cols = CLASS.columns || 3, pairs = CLASS.seats || [];
  if (!pairs.length) return `<h1>Розсадка</h1><div class="empty">Розсадку ще не додано.</div>`;
  const rows = Math.ceil(pairs.length / cols);
  let grid = "";
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const p = pairs[r * cols + c];
      grid += p ? `<div class="desk"><span>${esc(p[0])}</span><span>${esc(p[1])}</span></div>` : `<div class="desk empty-desk"></div>`;
    }
  }
  const table = pairs.map(([a, b]) => `<tr><td>${esc(a)}</td><td>${esc(b)}</td></tr>`).join("");
  return `<h1>Розсадка</h1><p class="sub">${cols} стовпчики × ${rows} рядів, парти по двоє.</p>
    <div class="board">Дошка</div>
    <div class="seats" style="--cols:${cols}">${grid}</div>
    <h2>Хто з ким сидить</h2><table class="pairs"><thead><tr><th>Учень</th><th>Сидить з</th></tr></thead><tbody>${table}</tbody></table>
    <p class="muted small-note seats-note">Місця не точні.</p>`;
}
const MON_GEN = ["січня", "лютого", "березня", "квітня", "травня", "червня", "липня", "серпня", "вересня", "жовтня", "листопада", "грудня"];
// Найближча дата ДН (цього або наступного року) і скільки днів до неї
function bdayNext(md) {
  const [m, d] = md.split("-").map(Number), t = parse(today());
  let x = new Date(t.getFullYear(), m - 1, d);
  if (x < t) x = new Date(t.getFullYear() + 1, m - 1, d);
  return { date: x, days: Math.round((x - t) / 86400000) };
}
const bdayWhen = (n) => (n === 0 ? "сьогодні" : n === 1 ? "завтра" : n === 2 ? "післязавтра" : `через ${n} дн.`);
function bdaysPage() {
  const list = (CLASS.birthdays || []).map(([md, who]) => ({ md, who, ...bdayNext(md) })).sort((a, b) => a.days - b.days);
  if (!list.length) return `<h1>Дні народження</h1><div class="empty">Ще не додано.</div>`;
  let html = "", month = -1;
  for (const b of list) {
    if (b.date.getMonth() !== month) { month = b.date.getMonth(); html += `<h2>${cap(MON_N[month])}</h2>`; }
    html += `<div class="bday${b.days <= 2 ? " soon" : ""}"><b>${b.date.getDate()} ${MON_GEN[b.date.getMonth()]}</b><span>${esc(b.who)}</span>
      <em>${b.days <= 30 ? bdayWhen(b.days) : ""}</em></div>`;
  }
  return `<h1>Дні народження</h1><p class="sub">Від найближчого.</p>${html}`;
}
// Віджет на головній: ДН сьогодні / завтра / післязавтра
function bdayWidget() {
  const soon = (CLASS.birthdays || []).map(([md, who]) => ({ who, ...bdayNext(md) })).filter((b) => b.days <= 2).sort((a, b) => a.days - b.days);
  const lines = weekendBdays().concat(soon.map((b) => `🎂 <b>${cap(bdayWhen(b.days))}</b> ДН у ${esc(b.who)}`));
  return lines.length ? `<a class="bday-w" href="#/bdays">${lines.join("<br>")}</a>` : "";
}
// ДН, що припали на вихідні (чи канікули) перед сьогоднішнім навчальним днем — показуємо до кінця 3-го уроку
function weekendBdays() {
  const t = today();
  if (!plan(t).length) return [];
  const b3 = bell(3, t);
  if (nowSec() >= (b3 ? toMin(b3[1]) : 11 * 60 + 10) * 60) return [];
  const out = [];
  for (let i = 1; i <= 9; i++) {
    const d = addDays(parse(t), -i), s = iso(d);
    if (plan(s).length) break; // дійшли до попереднього навчального дня
    const md = s.slice(5);
    for (const [m, who] of CLASS.birthdays || []) {
      if (m === md) out.push(`🎂 На ${d.getDay() === 0 || d.getDay() === 6 ? "вихідних" : "канікулах"} (${WD_TINY[d.getDay()]}, ${short(s)}) було ДН у ${esc(who)}`);
    }
  }
  return out.reverse();
}

// ---------- Борги ----------
// ДЗ, у якого минув термін і яке не позначене виконаним. Рахуються лише ДЗ з терміном від DEBT_FROM.
const DEBT_FROM = "2026-11-09";
function debts() {
  const t = today();
  return RAW.filter((e) => isMine(e) && e.due && e.due >= DEBT_FROM && e.due < t && !isDone(e));
}
let DEBT_TAG = "";
function debtsPage() {
  const all = debts();
  const tags = sortSubj([...new Set(all.map((e) => e.tag))].map((tag) => ({ tag }))).map((x) => x.tag);
  if (DEBT_TAG && !tags.includes(DEBT_TAG)) DEBT_TAG = "";
  const chips = all.length ? `<div class="chips" role="group" aria-label="Предмет">
    <button type="button" data-dtag="" aria-pressed="${!DEBT_TAG}">Усі · ${all.length}</button>
    ${tags.map((t) => `<button type="button" data-dtag="${esc(t)}" aria-pressed="${DEBT_TAG === t}" style="--c:${subj(t).color}">${esc(subj(t).name)} · ${all.filter((e) => e.tag === t).length}</button>`).join("")}</div>` : "";
  const list = all.filter((e) => !DEBT_TAG || e.tag === DEBT_TAG);
  const days = [...new Set(list.map((e) => e.due))].sort();
  const body = days.map((d) => `<div class="day-h"><b>Треба було здати ${WD_ACC[parse(d).getDay()]}</b><span>${longDay(d)}</span></div>
    ${sortSubj(list.filter((e) => e.due === d)).map((e) => card(e)).join("")}`).join("");
  return `<h1>Борги</h1><p class="sub">Невиконані ДЗ, термін яких уже минув. Постав галочку — і борг зникне.</p>
    ${chips}${body || `<div class="empty">Боргів немає 🎉</div>`}`;
}

// ---------- Відвідування (у розробці) ----------
let visitsMon = null;
const mondayOf = (s) => { const d = parse(s); return iso(addDays(d, -((d.getDay() + 6) % 7))); };
function visitsPage(day) {
  const sel = day || today();
  if (!visitsMon || (day && mondayOf(day) !== visitsMon && !visitsPage.keep)) visitsMon = mondayOf(sel);
  visitsPage.keep = false;
  const days = [0, 1, 2, 3, 4].map((i) => iso(addDays(parse(visitsMon), i)));
  const students = [...(CLASS.students || [])].sort((a, b) => a.localeCompare(b, "uk"));
  const head = days.map((d) => `<th class="${d === sel ? "sel" : ""}${plan(d).length ? "" : " off"}">${WD_SHORT[(parse(d).getDay() + 6) % 7]}<br><span>${short(d)}</span></th>`).join("");
  const rows = students.map((n) => `<tr><th scope="row">${esc(n)}</th>${days.map((d) => `<td class="${d === sel ? "sel" : ""}${plan(d).length ? "" : " off"}">·</td>`).join("")}</tr>`).join("");
  return `<h1>Відвідування</h1>
    <div class="dev-banner">🚧 У розробці — відмітки, хто був у школі, поки не ведуться.</div>
    <div class="cal-nav"><button data-vweek="-1" aria-label="Попередній тиждень">‹</button>
      <h2>${short(days[0])} – ${short(days[4])}</h2><button data-vweek="1" aria-label="Наступний тиждень">›</button></div>
    <div class="visits-wrap"><table class="visits"><thead><tr><th>Учень</th>${head}</tr></thead><tbody>${rows ||
      `<tr><td colspan="6">Список учнів ще не додано.</td></tr>`}</tbody></table></div>`;
}

// ---------- «Секрет» → АвтоГДЗ ----------
// Ключ АвтоГДЗ живе до закриття вкладки, ключ «Від ШІ» — на пристрої (пароль питається один раз)
const store = (kind) => (kind === "ai" ? localStorage : sessionStorage);
const keyGet = (kind, name) => { try { return store(kind).getItem(name); } catch { return null; } };
const keySet = (kind, name, v) => { try { v ? store(kind).setItem(name, v) : store(kind).removeItem(name); } catch { /* приватний режим */ } };
let GDZ_TOKEN = keyGet("gdz", "dz-gdz");
let AI_TOKEN = keyGet("ai", "dz-ai");
const GDZ_TAGS = ["Алгебра", "Геометрія", "УкрМова", "ІсторіяУкр"]; // для них сайт шукає готові відповіді
let GDZ = { open: null, find: null, ai: null, aiLogin: false, poll: null };

function gdzDue() {
  const d = nextSchoolDay(today());
  return { d, list: d ? sortSubj(RAW.filter((e) => e.due === d && isMine(e))) : [] };
}
let GDZ_TAB = "tmr";
function gdzRow(e) {
  const s = subj(e.tag), g = grpLabel(e), done = isDone(e);
  return `<div class="gdz-row${done ? " is-done" : ""}" style="--c:${s.color}">
    <button type="button" class="check" data-done="${esc(e.id)}" role="checkbox" aria-checked="${done}" aria-label="${done ? "Повернути в невиконане" : "Позначити виконаним"}"></button>
    <button type="button" class="gdz-item" data-gdz="${esc(e.id)}">
      <b>${esc(s.name)}<i class="gdot" style="--g:${groupColor(e.tag)}"></i>${g ? ` <span class="grp">${esc(g)}</span>` : ""}</b>
      <span>${esc(e.homework)}</span>
      <em>${GDZ_TAGS.includes(e.tag) ? "Шукати ГДЗ ›" : "Відкрити ›"}</em></button></div>`;
}
// невиконане вгорі, всередині — за важкістю
const gdzSort = (l) => [...sortSubj(l.filter((e) => !isDone(e))), ...sortSubj(l.filter(isDone))];
function secretPage() {
  if (!GDZ_TOKEN) return lockForm("lock2", "Секрет", "Введи пароль, щоб побачити вміст.");
  const tabs = `<div class="subtabs gdz-tabs" role="tablist">
    <button type="button" role="tab" data-gtab="tmr" aria-selected="${GDZ_TAB === "tmr"}">На завтра</button>
    <button type="button" role="tab" data-gtab="all" aria-selected="${GDZ_TAB === "all"}">Усі ДЗ</button></div>`;
  let body;
  if (GDZ_TAB === "all") {
    const t = today(), mine = RAW.filter((e) => isMine(e) && e.due);
    const days = [...new Set(mine.map((e) => e.due))];
    const order = [...days.filter((d) => d >= t).sort(), ...days.filter((d) => d < t).sort().reverse()];
    body = order.map((d) => `<div class="day-h"><b>${d < t ? "Було · " : ""}${cap(relDay(d))}</b><span>${longDay(d)}</span></div>
      ${gdzSort(mine.filter((e) => e.due === d)).map(gdzRow).join("")}`).join("") || `<div class="empty">ДЗ ще немає.</div>`;
  } else {
    const { d, list } = gdzDue();
    body = `<p class="sub">ДЗ на ${d ? `${whenDay(d)}, ${short(d)}` : "найближчий день"}. Натисни на завдання, галочка — виконано.</p>
      ${gdzSort(list).map(gdzRow).join("") || `<div class="empty">На ${d ? whenDay(d) : "завтра"} ДЗ ще не задали.</div>`}`;
  }
  return `<h1 class="gdz-h">АвтоГДЗ</h1>${tabs}${body}`;
}

function gdzModalHtml() {
  const e = RAW.find((x) => String(x.id) === GDZ.open);
  if (!e) return "";
  const s = subj(e.tag), has = GDZ_TAGS.includes(e.tag);
  const crops = (e.tasks || []).flatMap((t) => (t.images || []).map((p) =>
    `<button class="crop" data-img="${esc(p)}" aria-label="Збільшити"><img src="${esc(p)}" loading="lazy" alt="${esc(t.label)}"></button>`)).join("");
  let found = "";
  const f = GDZ.find;
  if (f === "loading") found = `<p class="gdz-wait"><i class="spin"></i>Шукаю на сайтах ГДЗ…</p>`;
  else if (f && f.error) found = `<p class="err">${esc(f.error)}</p>`;
  else if (f) {
    const res = f.results || [];
    found = res.length ? res.map((r) => `<div class="gdz-res"><div class="gdz-res-h"><b>${esc(r.ref)}</b>
        <a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.source)} · ${esc(r.label)} ↗</a></div>
        ${r.images.map((p) => `<button class="crop" data-img="${esc(p)}" aria-label="Збільшити"><img src="${esc(p)}" loading="lazy" alt="ГДЗ ${esc(r.ref)}"></button>`).join("")}</div>`).join("")
      : `<p class="muted">${f.refs && f.refs.length ? `Не знайшов ${esc(f.refs.join(", "))} на сайтах ГДЗ.` : "У ДЗ немає номерів вправ — нема що шукати."}
          ${(f.links || []).map((l) => `<br><a href="${esc(l.url)}" target="_blank" rel="noopener">Відкрити ГДЗ на ${esc(l.source)} ↗</a>`).join("")}</p>`;
    if (res.length && f.links) found += `<p class="muted small-note">Ще: ${f.links.map((l) => `<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.source)}</a>`).join(" · ")}</p>`;
  }
  let ai = "";
  const a = GDZ.ai;
  if (GDZ.aiLogin) {
    ai = `<form class="lock ai-lock" id="lock3" autocomplete="off"><p class="sub">Пароль «Від ШІ» — потрібен лише раз на цьому пристрої.</p>
      <input id="lock3-pw" type="password" inputmode="numeric" placeholder="Пароль" aria-label="Пароль «Від ШІ»" required>
      <button type="submit">Увійти</button><p class="err" id="lock3-err" role="alert"></p></form>`;
  } else if (a && (a.status === "queue" || a.status === "run" || a.status === "starting")) {
    ai = `<p class="gdz-wait"><i class="spin"></i>${a.status === "queue" ? "ШІ в черзі…" : "ШІ розвʼязує… це до хвилини-двох."}</p>`;
  } else if (a && a.status === "done") {
    const r = a.result;
    ai = `<div class="ai-res"><h3>Від ШІ</h3>${r.answers.map((t, i) =>
      `<div class="ai-ans">${r.creative ? `<b>Варіант ${i + 1}</b>` : ""}<p>${esc(t)}</p></div>`).join("")}
      ${r.note ? `<p class="muted small-note">${esc(r.note)}</p>` : ""}
      <p class="muted small-note">ШІ може помилятись — перевір.</p></div>`;
  } else if (a && a.status === "error") ai = `<p class="err">${esc(a.error)}</p>`;
  const aiBtn = !GDZ.aiLogin && !(a && ["queue", "run", "starting", "done"].includes(a.status))
    ? `<button type="button" class="btn-ai" data-ai>✨ Від ШІ${AI_TOKEN ? "" : " (доступ)"}</button>` : "";
  const done = isDone(e);
  return `<div class="modal-card" role="dialog" aria-modal="true" aria-label="АвтоГДЗ: ${esc(s.name)}">
    <div class="modal-h" style="--c:${s.color}"><b>${esc(s.name)}</b><button type="button" class="close" data-gdz-close aria-label="Закрити">×</button></div>
    <p class="hw">${linkify(e.homework)}</p>
    <button type="button" class="done-toggle${done ? " on" : ""}" data-mdone="${esc(e.id)}">${done ? "✔ Виконано — повернути" : "✔ Позначити виконаним"}</button>
    ${crops ? `<div class="gdz-crops">${crops}</div>` : ""}
    ${has ? (f ? "" : `<div class="gdz-solve"><button type="button" class="btn-solve" data-solve>Розвʼязати</button></div>`)
      : `<p class="muted gdz-dev">Повне АвтоГДЗ до цього предмету у розробці.</p>`}
    ${found}
    <div class="gdz-ai">${aiBtn}${ai}</div>
  </div>`;
}
const modal = document.createElement("div");
modal.className = "modal"; modal.hidden = true;
document.body.appendChild(modal);
function renderModal() {
  modal.hidden = !GDZ.open;
  modal.innerHTML = GDZ.open ? gdzModalHtml() : "";
  document.body.classList.toggle("no-scroll", !!GDZ.open);
}
function closeModal() {
  clearInterval(GDZ.poll);
  GDZ = { open: null, find: null, ai: null, aiLogin: false, poll: null };
  renderModal();
}
async function gdzApi(action, body) {
  const r = await fetch(`api/gdz/${action}`, { method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...body, gtoken: GDZ_TOKEN, atoken: AI_TOKEN }) });
  const j = await r.json().catch(() => ({}));
  if (r.status === 401 && j.relogin) { setGdz(null); closeModal(); render(); throw new Error("Доступ до АвтоГДЗ закінчився — введи пароль ще раз."); }
  if (r.status === 401 && j.ai_login) { AI_TOKEN = null; keySet("ai", "dz-ai", null); GDZ.aiLogin = true; renderModal(); throw new Error(""); }
  if (!j.ok) throw new Error(j.error || "Помилка");
  return j;
}
function setGdz(t) { GDZ_TOKEN = t; keySet("gdz", "dz-gdz", t); }
function aiPoll(start) {
  const id = GDZ.open;
  clearInterval(GDZ.poll);
  const step = async (first) => {
    try {
      const j = await gdzApi("ai", { id, start: first && start });
      if (GDZ.open !== id) return;
      GDZ.ai = j; renderModal();
      if (!["queue", "run"].includes(j.status)) clearInterval(GDZ.poll);
    } catch (e) {
      clearInterval(GDZ.poll);
      if (e.message && GDZ.open === id) { GDZ.ai = { status: "error", error: e.message }; renderModal(); }
    }
  };
  step(true);
  GDZ.poll = setInterval(() => step(false), 3000);
}
modal.addEventListener("click", async (ev) => {
  if (ev.target === modal || ev.target.closest("[data-gdz-close]")) { closeModal(); return; }
  const img = ev.target.closest("[data-img]");
  if (img) { openViewer(img.dataset.img); return; }
  const md = ev.target.closest("[data-mdone]");
  if (md) { setDone(md.dataset.mdone, !DONE.has(md.dataset.mdone)); renderModal(); render(); return; }
  if (ev.target.closest("[data-solve]")) {
    const id = GDZ.open;
    GDZ.find = "loading"; renderModal();
    try { const j = await gdzApi("find", { id }); if (GDZ.open === id) GDZ.find = j; }
    catch (e) { if (GDZ.open === id) GDZ.find = { error: e.message }; }
    renderModal(); return;
  }
  if (ev.target.closest("[data-ai]")) {
    if (!AI_TOKEN) { GDZ.aiLogin = true; renderModal(); document.getElementById("lock3-pw")?.focus(); return; }
    GDZ.ai = { status: "starting" }; renderModal(); aiPoll(true);
  }
});
modal.addEventListener("submit", async (ev) => {
  if (ev.target.id !== "lock3") return;
  ev.preventDefault();
  const err = document.getElementById("lock3-err");
  err.textContent = "";
  try {
    const j = await gdzApi("ai-login", { password: document.getElementById("lock3-pw").value });
    AI_TOKEN = j.token; keySet("ai", "dz-ai", j.token);
    GDZ.aiLogin = false; GDZ.ai = { status: "starting" }; renderModal(); aiPoll(true);
  } catch (e) { if (e.message) err.textContent = e.message; }
});

// ---------- «Інфо» ----------
function infoPage() {
  const user = `
  <section class="doc">
    <nav class="doc-toc" aria-label="Зміст">
      <a href="#i-what">Що це</a><a href="#i-start">Перше відкриття</a><a href="#i-home">Головна</a><a href="#i-cal">Календар</a>
      <a href="#i-week">Розклад</a><a href="#i-menu">Меню ⋯</a><a href="#i-check">Галочки й борги</a><a href="#i-colors">Кольори</a>
      <a href="#i-groups">Групи</a><a href="#i-alerts">Тривоги</a><a href="#i-tips">Дрібниці</a>
    </nav>

    <h2 id="i-what">Що це</h2>
    <ul>
      <li>Сайт класу 8-Д: домашні завдання, розклад з дзвінками й учителями, підручники, файли від учителів, тривоги в Києві,
        розсадка й дні народження.</li>
      <li>Працює в будь-якому браузері — з телефона й комп'ютера. Встановлювати нічого не треба, реєструватись теж.</li>
      <li>ДЗ на сайт додає Telegram-бот (його ведуть власник і адміни) — ті самі пости йдуть у Telegram-канал класу.</li>
      <li>Сайт працює з ноутбука-сервера. Якщо раптом не відкривається — найімовірніше, ноутбук вимкнений; спробуй пізніше.</li>
    </ul>

    <h2 id="i-start">Перше відкриття</h2>
    <ul>
      <li>Сайт питає три речі, і далі все підлаштовується під тебе:
        <ul>
          <li><b>Укр.: Ганна (1 гр.)</b> чи <b>Укр.: Ольга (2 гр.)</b> — з ким у тебе українська мова. Від цього ж залежить твоя група
            для англійської та інформатики: Ганна — 1 група, Ольга — 2 група.</li>
          <li><b>Друга іноземна</b> — німецька чи іспанська.</li>
          <li><b>Технології</b> — «Дівч.» (Кисельова, каб. 326) чи «Хлопч.» (Резніченко).</li>
        </ul></li>
      <li>Змінити вибір будь-коли — перемикачами вгорі вкладки <b>«Розклад»</b>. Діє одразу на весь сайт.</li>
      <li>Вибір зберігається лише в цьому браузері. На іншому телефоні чи комп'ютері сайт спитає ще раз.</li>
    </ul>

    <h2 id="i-home">Головна</h2>
    <ul>
      <li><b>«Зараз»</b> вгорі — який урок іде, кабінет, учитель і скільки до перерви; на перерві — що далі й скільки до дзвінка.
        Цифри оновлюються щосекунди.</li>
      <li><b>🎂 Дні народження</b> — якщо ДН сьогодні, завтра чи післязавтра. У понеділок до кінця 3-го уроку — ще й ДН, що були на вихідних.</li>
      <li><b>⚠️ Боргів: N</b> — є прострочені невиконані ДЗ (див. «Борги»).</li>
      <li><b>✅ ДЗ на завтра виконано</b> — коли ти поставив галочки на все ДЗ найближчого дня.</li>
      <li><b>«Здати …»</b> — ДЗ на найближчий день, де ще щось не зроблено, нижче — «Далі» на тиждень уперед.
        Порядок у кожному дні — від найважчих предметів до найлегших.</li>
      <li>На картці ДЗ: предмет з крапкою важкості, мітка групи (якщо ДЗ лише для групи), коли задали → коли здати, текст,
        фото дошки (натисни — відкриється на весь екран) і <b>«Завдання»</b> — вирізки з підручника з посиланням «відкрити в підручнику».</li>
      <li>Червона плашка <b>«🚨 Повітряна тривога в Києві»</b> — тривога саме зараз.</li>
      <li>Внизу — <b>«✔ Виконано: N»</b>: скільки майбутніх ДЗ ти вже зробив.</li>
    </ul>

    <h2 id="i-cal">Календар</h2>
    <ul>
      <li>Гортай місяці стрілками ‹ ›, натисни на день — під календарем його розклад і все ДЗ, яке треба здати цього дня
        (зокрема й чуже — інших груп, притінене).</li>
      <li>Крапка під числом — у цей день є ДЗ. Її колір — середня важкість ДЗ цього дня (див. «Кольори»).</li>
      <li>Сьогодні обведено, вихідні й канікули — блідіші.</li>
      <li>У розкладі дня червона смуга й «🚨 N%» — скільки уроку пройшло під тривогою.</li>
      <li><b>👥 Відвідування</b> — відкриває цей день у розділі «Відвідування».</li>
    </ul>

    <h2 id="i-week">Розклад</h2>
    <ul>
      <li>Вгорі — перемикачі (українська/група, мова, технології).</li>
      <li>Далі — <b>сьогодні</b> (після уроків — наступний навчальний день) з живою підсвіткою: поточний урок виділено й показано,
        скільки до перерви та хто веде урок; пройдені уроки сірішають, між ними — плашка «Перерва» з часом до дзвінка,
        наступний урок трохи більший.</li>
      <li>Нижче — увесь тиждень: час уроків, кабінет (у фізкультури — «зал»), крапки важкості. Гортай тижні стрілками.</li>
      <li>Тижні чергуються <b>А/Б</b> (від цього залежать деякі уроки, наприклад у понеділок), сайт рахує це сам.</li>
      <li><b>⏱ Скорочені уроки</b> — у такі дні сайт рахує все (таймер, тривоги) за скороченими дзвінками.</li>
    </ul>

    <h2 id="i-menu">Меню ⋯</h2>
    <ul>
      <li><b>Предмети</b> — плитки за важкістю (кількість ДЗ, 📖 — є підручник). Сторінка предмета: учитель, 5 найближчих уроків,
        підручник(и), файли, і ДЗ двома блоками — <b>Невиконані</b> та <b>Виконані</b>. У Історії України видно ще й ДЗ з громадянської освіти.</li>
      <li><b>Файли</b> — файли й фото від учителів (з датою, коли додано; фото — з мініатюрою) і всі підручники PDF.
        В англійської два: Wider World 4 Teacher's Book (зі сторінками підручника) і Workbook.</li>
      <li><b>Виконане</b> — усе, що ти позначив; там галочку можна зняти.</li>
      <li><b>Борги</b> — прострочене невиконане ДЗ, з фільтром за предметом.</li>
      <li><b>Тривоги</b> — тривоги в Києві: коли почались і скінчились, скільки тривали, які уроки й перерви зачепили.</li>
      <li><b>Інфо</b> — ця сторінка.</li>
      <li><b>Додаткове</b>:
        <ul>
          <li><b>Розсадка</b> — схема класу (дошка вгорі, 3 стовпчики парт) і таблиця «хто з ким». Місця не точні.</li>
          <li><b>Дні народження</b> — усі ДН від найближчого, по місяцях.</li>
          <li><b>Відвідування</b> — таблиця учнів по днях. Поки у розробці: відмітки ще не ведуться.</li>
          <li><b>Секрет</b> — закритий розділ з паролем.</li>
          <li><b>Адмінпанель</b> — тільки для адмінів.</li>
        </ul></li>
    </ul>

    <h2 id="i-check">Галочки, виконане й борги</h2>
    <ul>
      <li>Зробив ДЗ — натисни квадратик біля предмета. На головній картка викреслиться й зникне, в інших місцях лишиться викресленою.</li>
      <li>Зняти галочку — ще раз натиснути (у «Виконаному», календарі чи на сторінці предмета).</li>
      <li><b>Борг</b> — твоє ДЗ, термін якого вже минув, а галочки немає. Рахуються ДЗ з терміном від 9 листопада 2026.
        Поставиш галочку — борг зникне.</li>
      <li>Галочки зберігаються лише в цьому браузері — на іншому пристрої їх не буде, і ніхто інший їх не бачить.</li>
    </ul>

    <h2 id="i-colors">Кольори важкості</h2>
    <ul>
      <li><span class="dot-i" style="--c:#e03131"></span><b>Найголовніші</b> — алгебра, геометрія, українська мова, англійська, історія України.</li>
      <li><span class="dot-i" style="--c:#f76707"></span><b>Основні</b> — українська література, всесвітня історія, фізика, хімія, біологія.</li>
      <li><span class="dot-i" style="--c:#f2b705"></span><b>Просто уроки</b> — німецька, іспанська, зарубіжна література, громадянська освіта,
        фінансова грамотність, географія.</li>
      <li><span class="dot-i" style="--c:#2f9e44"></span><b>Уроки-відпочинки</b> — фізкультура, мистецтво, технології, ЗБД, інформатика.</li>
      <li>У календарі крапка дня — середнє за ДЗ цього дня (алгебра й англійська там рахуються як помаранчеві).</li>
    </ul>

    <h2 id="i-groups">Групи й чуже ДЗ</h2>
    <ul>
      <li>Англійська й інформатика — окремо для 1 і 2 групи; українська — окремо для Ганни й Ольги; технології — для дівчат і хлопців;
        німецька й іспанська — різні предмети.</li>
      <li>На головній, у боргах і АвтоГДЗ — тільки твоє. Чуже видно в календарі й «Предметах» — притінене, з міткою групи.</li>
    </ul>

    <h2 id="i-alerts">Тривоги</h2>
    <ul>
      <li>Сайт сам щопівхвилини перевіряє тривогу в м. Київ і записує її.</li>
      <li>Якщо тривога йшла хоча б останні 10 хв уроку і ДЗ з нього не задали — на місці ДЗ з'являється плашка <b>«Була тривога!»</b>
        (до наступного уроку цього предмета). Якщо ДЗ потім таки надішлють — плашка зміниться на справжнє ДЗ.</li>
      <li>Поки ноутбук-сервер вимкнений, тривоги не записуються.</li>
    </ul>

    <h2 id="i-tips">Дрібниці</h2>
    <ul>
      <li>Дані підтягуються під час відкриття, тривоги — кожні 30 с. Не бачиш нового ДЗ — онови сторінку.</li>
      <li>Як застосунок: iPhone — «Поділитися» → «На екран „Додому“»; Android — ⋮ → «Додати на головний екран».</li>
      <li>Темна тема вмикається сама, якщо вона увімкнена на телефоні.</li>
      <li>Фото й вирізки відкриваються на весь екран; закрити — натиснути ще раз або Esc.</li>
      <li>Учителі в «Розкладі» показані лише біля уроку, що йде зараз; повний список — на сторінках предметів.</li>
      <li>Сайт нічого про тебе не збирає, окрім звичайних даних відвідування (IP) для захисту від спаму.</li>
    </ul>

    <div class="bug">🐞 <b>Знайшов баг або є ідея?</b> Пиши мені в Telegram: <a href="https://t.me/Spl1ted" target="_blank" rel="noopener">@Spl1ted</a></div>
  </section>`;
  const gdzDoc = !GDZ_TOKEN ? "" : `
  <section class="doc gdz-doc">
    <h2><span class="gdz-dot" aria-hidden="true"></span> АвтоГДЗ</h2>
    <ul>
      <li>Режим вмикається паролем «Секрету». Поки він діє, у шапці синє «ГДЗ», а пункт меню зветься «АвтоГДЗ».
        Діє до закриття вкладки (оновлення сторінки не скидає).</li>
      <li>Дві вкладки: <b>«На завтра»</b> — ДЗ на найближчий навчальний день, і <b>«Усі ДЗ»</b> — усе твоє ДЗ за днями (майбутнє вгорі, потім минуле).</li>
      <li>Галочка зліва — позначити виконаним (те саме, що на головній). Виконане опускається вниз і викреслюється.</li>
      <li>Натисни на ДЗ — відкриється вікно з текстом, вирізками з підручника й кнопкою <b>«Розв'язати»</b>.
        Сайт шукає готову відповідь на gdzonline.net і shkola.in.ua — для <b>алгебри, геометрії, української мови й історії України</b>.
        Для інших предметів — «Повне АвтоГДЗ до цього предмету у розробці».</li>
      <li>Що шукається — номери з ДЗ: «№ 245, 247», «№245–247», «с. 92 впр. 1», «ст. 45 № 3», «§ 5».
        Якщо є і сторінка, і завдання — шукається саме це завдання на цій сторінці. Без номерів шукати нема чого.</li>
      <li>Під кожною відповіддю — посилання на джерело. Не знайшлось — є посилання на весь збірник.</li>
      <li><b>✨ Від ШІ</b> — розвʼязок від штучного інтелекту (Claude). Перший раз потрібен окремий пароль — далі на цьому пристрої не питає.
        ШІ бачить фото завдання з підручника (для англійської — усю сторінку) і, якщо є, ГДЗ, щоб звіритись.
        Творчі завдання (твір, речення, лист) — два різні варіанти на вибір. Займає до 1–2 хв.</li>
      <li>Кожне ДЗ ШІ розвʼязує один раз — далі всі бачать готову відповідь одразу. Нових розвʼязків — не більше 30 на день на всіх.</li>
      <li>ГДЗ і ШІ можуть помилятись — перевіряй і розбирайся, а не просто списуй 🙂</li>
    </ul>
  </section>`;
  const adm = !ADMIN_TOKEN ? "" : `
  <section class="doc admin-doc">
    <h2><span class="adm-dot" aria-hidden="true"></span> Для адмінів</h2>
    <h3>Адмінпанель</h3>
    <ul>
      <li>Вхід: «⋯ → Адмінпанель» → пароль. Поки режим увімкнено, біля назви сайту червоним «Адмін-доступ!».
        Діє до закриття вкладки (максимум 12 год). Вийти — кнопка «Вийти» в адмінпанелі.</li>
      <li><b>✏️ на картці ДЗ</b> — змінити текст і дату здачі. Зміна йде на сайт і в пост у каналі
        (для ДЗ, опублікованих після цього оновлення; для старших — лише сайт).</li>
      <li><b>🗑</b> — прибрати ДЗ із сайту (у каналі пост лишається). Усе видалене — в адмінпанелі, «Видалені ДЗ», звідки його можна повернути.</li>
      <li><b>Відвідувачі й блок</b> — останні IP, хто й коли заходив. «Заблокувати» — ця IP бачить тільки «Доступ заблоковано».
        Свою IP заблокувати не можна. Увага: у мобільного інтернету IP часто спільна на багатьох людей і змінюється — блокуй обережно.</li>
      <li><b>＋ Додати ДЗ</b> — ДЗ прямо з сайту: предмет, група, дати (здати — підставляється сама), текст; галочка «також у канал».</li>
      <li><b>Сайт → Скорочені уроки</b> — вибери день і «Увімкнути»: таймер, розклад і тривоги рахуються за скороченими дзвінками.
        З Telegram: <code>/short</code>, <code>/short 12.11</code>, <code>/short off 12.11</code>.</li>
      <li><b>Сайт → Перезапустити</b> — якщо сайт поводиться дивно. Займає ~10 с.</li>
      <li><b>Файли до предмета</b>: на сторінці предмета (в адмін-режимі) — «＋ Додати фото або файл», до 25 МБ.
        Файл зʼявиться на сторінці предмета й у «Файлах» з датою додавання. 🗑 біля файлу — видалити.</li>
      <li><b>Борги</b> рахуються від <code>DEBT_FROM</code> у <code>site/app.js</code> (зараз 9.11.2026). <b>Відвідування</b> — поки лише заготовка.</li>
    </ul>
    <h3>Бот (Telegram)</h3>
    <ul>
      <li>Бот відповідає тільки власнику й адмінам. Надіслати ДЗ: текст, фото дошки, альбом, голосове з уроку, посилання чи файл + назва уроку.
        Бот покаже чернетку → «✅ Опублікувати». Виправити — відповісти (reply) на чернетку текстом.</li>
      <li>Для предметів із групами бот спитає «1 група / 2 група» (для української — «Ганна / —»).</li>
      <li>Якщо з предмета за цей день ДЗ вже є, бот попередить. Адміну повтор опублікувати не можна (власнику — можна).
        Якщо бот переплутав предмет — відповідай на чернетку, який це урок.</li>
      <li>Для технологій бот питає «дівчата / хлопці», для української — «Ганна / Ольга».</li>
      <li>Команди власника: <code>/short</code>, <code>/adminadd username</code>, <code>/adminremove username</code>, <code>/admins</code>,
        <code>/restartsite</code>, <code>/stopsite</code>, <code>/startsite</code>, <code>/restartbot</code>, <code>/fullrestart</code>, <code>/digest</code>.</li>
      <li><b>Зведення</b>: о 17:00 бот надсилає власнику чернетку «ДЗ на завтра». Після «✅» вона йде в канал о 18:00
        (або одразу, якщо вже пізніше). Без підтвердження — не йде.</li>
    </ul>
    <h3>Ноутбук-сервер</h3>
    <ul>
      <li>Папка: <code>Робочий стіл\\homework-bot</code>. Логи: <code>data\\bot.log</code>, <code>data\\site.log</code>.</li>
      <li>Дзвінки й учителі — <code>data\\school.json</code>, розклад — <code>schedule.py</code>.</li>
      <li>Сайт назовні — через Tailscale Funnel; якщо адреса не відкривається, на ноутбуці: <code>tailscale funnel status</code>.</li>
      <li><b>Оновлення коду — дистанційно</b>: з Mac (Claude, скіл «hw-deploy» або <code>python3 tools/deploy.py</code>) після підтвердження власника.
        Ноутбук перевіряє ключ і код, робить резервну копію, оновлюється й сам перезапускає бота й сайт. Відкат — <code>tools/deploy.py --rollback</code>.</li>
      <li>Розсадка, дні народження й список учнів (для «Відвідування») — <code>data\class.json</code>.</li>
      <li>АвтоГДЗ («Секрет»): пошук на gdzonline.net і shkola.in.ua (алгебра, геометрія, укрмова, історія), «Від ШІ» — Claude Sonnet
        на ноутбуці, до 30 нових розвʼязків на день (готові відповіді — з кешу). Підручники й індекси книжок оновлюються
        <code>tools/deploy.py --files</code>.</li>
    </ul>
  </section>`;
  return `<h1>Інфо</h1><p class="sub">Усе, що треба знати про сайт.</p>${gdzDoc}${user}${adm}`;
}

// ---------- роутинг ----------
const app = document.getElementById("app");
app.addEventListener("change", (ev) => {
  if (ev.target.name === "tag" && ev.target.closest("#addform")) {
    keepAddText(); ADD = { tag: ev.target.value, grp: 0 }; render(); restoreAddText();
  }
});
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
  else if (h === "/admin") { tab = "admin"; html = adminPage(); }
  else if (h === "/info") { tab = "info"; html = infoPage(); }
  else if (h === "/seats") { tab = "seats"; html = seatsPage(); }
  else if (h === "/bdays") { tab = "bdays"; html = bdaysPage(); }
  else if (h === "/alerts") { tab = "alerts"; html = alertsPage(); }
  else if (h === "/done") { tab = "done"; html = donePage(); }
  else if (h === "/debts") { tab = "debts"; html = debtsPage(); }
  else if (h === "/visits" || h.startsWith("/visits/")) { tab = "visits"; html = visitsPage(h.slice(8) || null); }
  else html = home();
  app.innerHTML = html;
  document.querySelectorAll(".tabs a, .drawer a").forEach((a) => a.classList.toggle("on", a.dataset.tab === tab));
  document.getElementById("more").classList.toggle("on", ["subj", "files", "secret", "alerts", "done", "debts", "visits", "admin", "info", "seats", "bdays"].includes(tab));
  setDrawer(false);
  document.getElementById("admin-badge").hidden = !ADMIN_TOKEN;
  document.getElementById("gdz-badge").hidden = !GDZ_TOKEN;
  document.getElementById("secret-link").textContent = GDZ_TOKEN ? "АвтоГДЗ" : "Секрет";
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
  if (ev.target.closest("[data-lockout]")) { adminApi("logout").catch(() => {}); setToken(null); render(); return; }
  const ag = ev.target.closest("[data-addgrp]");
  if (ag) { keepAddText(); ADD.grp = Number(ag.dataset.addgrp); render(); restoreAddText(); return; }
  const at = ev.target.closest("[data-atab]");
  if (at) { ADM.tab = at.dataset.atab; render(); return; }
  const bl = ev.target.closest("[data-block]"), ub = ev.target.closest("[data-unblock]"), rs = ev.target.closest("[data-restore]");
  if (bl || ub || rs) {
    const msg = bl ? `Заблокувати ${bl.dataset.block}? Ця IP більше не відкриє сайт.` : ub ? `Розблокувати ${ub.dataset.unblock}?` : "Повернути це ДЗ на сайт?";
    if (!confirm(msg)) return;
    (bl ? adminApi("block", { ip: bl.dataset.block }) : ub ? adminApi("unblock", { ip: ub.dataset.unblock }) : adminApi("restore", { id: rs.dataset.restore }))
      .then(async () => {
        if (rs) RAW = await get("data/homework.json", RAW);
        applyPref(); ADM.data = null; render();
      }).catch((e) => alert(e.message));
    return;
  }
  if (ev.target.closest("[data-restart]")) {
    if (!confirm("Перезапустити сайт? Це займе ~10 секунд.")) return;
    adminApi("restart").then(() => {
      app.innerHTML = `<h1>Перезапуск…</h1><p class="muted">Сайт перезапускається, сторінка оновиться сама.</p>`;
      const t0 = Date.now();
      const poll = setInterval(async () => {
        const ok = await fetch(`data/files.json?t=${Date.now()}`, { cache: "no-store" }).then((r) => r.ok).catch(() => false);
        if ((ok && Date.now() - t0 > 2500) || Date.now() - t0 > 60000) { clearInterval(poll); location.reload(); }
      }, 1500);
    }).catch((e) => alert(e.message));
    return;
  }
  const ed = ev.target.closest("[data-edit]");
  if (ed) { EDIT_ID = ed.dataset.edit; render(); return; }
  if (ev.target.closest("[data-edit-cancel]")) { EDIT_ID = null; render(); return; }
  const delBtn = ev.target.closest("[data-del]");
  if (delBtn) { deleteHw(delBtn.dataset.del); return; }
  const chk = ev.target.closest("[data-done]");
  if (chk) {
    const id = chk.dataset.done, on = !DONE.has(id);
    setDone(id, on);
    const onHome = (location.hash.slice(1) || "/") === "/";
    if (on && onHome) {
      const c = chk.closest(".card");
      c.classList.add("is-done", "leaving");
      chk.setAttribute("aria-checked", "true");
      setTimeout(render, 650); // викреслюється, потім зникає
    } else render();
    return;
  }
  const pl = ev.target.closest("[data-pl]"), pu = ev.target.closest("[data-pu]"), pt = ev.target.closest("[data-pt]");
  if (pl || pu || pt) {
    savePref({ ...pref(), ...(pl ? { lang: pl.dataset.pl } : pu ? { ukr: Number(pu.dataset.pu) } : { tech: Number(pt.dataset.pt) }) });
    render(); return;
  }
  if (ev.target.closest("[data-top]")) { scrollTo({ top: 0, behavior: "smooth" }); return; }
  const wk = ev.target.closest("[data-week]");
  if (wk) { weekOff += Number(wk.dataset.week); render(); return; }
  const mon = ev.target.closest("[data-mon]");
  if (mon) { calMonth = new Date(calMonth.getFullYear(), calMonth.getMonth() + Number(mon.dataset.mon), 1); render(); return; }
  const gt = ev.target.closest("[data-gtab]");
  if (gt) { GDZ_TAB = gt.dataset.gtab; render(); return; }
  const dt = ev.target.closest("[data-dtag]");
  if (dt) { DEBT_TAG = dt.dataset.dtag; render(); return; }
  const vw = ev.target.closest("[data-vweek]");
  if (vw) { visitsMon = iso(addDays(parse(visitsMon), 7 * Number(vw.dataset.vweek))); visitsPage.keep = true; render(); return; }
  const fd = ev.target.closest("[data-fdel]");
  if (fd) {
    if (!confirm("Видалити цей файл із сайту?")) return;
    adminApi("file-delete", { id: fd.dataset.fdel }).then(() => { FILES = FILES.filter((f) => String(f.id) !== fd.dataset.fdel); render(); })
      .catch((e) => alert(e.message));
    return;
  }
  const gi = ev.target.closest("[data-gdz]");
  if (gi) { GDZ = { open: gi.dataset.gdz, find: null, ai: null, aiLogin: false, poll: null }; renderModal(); aiPeek(); return; }
  const img = ev.target.closest("[data-img]");
  if (img) openViewer(img.dataset.img);
});
// Якщо ШІ вже розвʼязував це ДЗ (хтось інший) — одразу показати відповідь
async function aiPeek() {
  if (!AI_TOKEN) return;
  const id = GDZ.open;
  try {
    const j = await gdzApi("ai", { id });
    if (GDZ.open === id && j.status !== "none") { GDZ.ai = j; renderModal(); if (["queue", "run"].includes(j.status)) aiPoll(false); }
  } catch { /* тихо */ }
}

app.addEventListener("submit", async (ev) => {
  const id = ev.target.id;
  if (id === "lock" || id === "lock2") {
    ev.preventDefault();
    const err = document.getElementById(`${id}-err`);
    err.textContent = "";
    try {
      const r = await fetch(id === "lock" ? "api/admin/login" : "api/secret2", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: document.getElementById(`${id}-pw`).value }) });
      const j = await r.json();
      if (!j.ok) { err.textContent = j.error || "Неправильний пароль"; return; }
      if (id === "lock") setToken(j.token); else setGdz(j.token);
      render();
    } catch { err.textContent = "Немає звʼязку із сервером"; }
    return;
  }
  if (id === "addform") {
    ev.preventDefault();
    const f = ev.target, kind = (SCHOOL.split || {})[f.elements.tag.value];
    if (kind && !ADD.grp) { alert("Вибери групу"); return; }
    const body = { tag: f.elements.tag.value, grp: ADD.grp || null, given: f.elements.given.value, due: f.elements.due.value,
      homework: f.elements.hw.value, channel: f.elements.channel.checked };
    const send = async (force) => {
      const r = await fetch("api/admin/add", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...body, force, token: ADMIN_TOKEN }) });
      return [r.status, await r.json().catch(() => ({}))];
    };
    try {
      let [code, j] = await send(false);
      if (code === 409 && j.dup && confirm(`${j.error}\n\nВсе одно додати?`)) [code, j] = await send(true);
      if (code === 401) { setToken(null); render(); alert("Сесія адміна закінчилась."); return; }
      if (!j.ok) { if (code !== 409) alert(j.error || "Помилка"); return; }
      RAW.push(j.entry); applyPref(); ADD = { tag: "", grp: 0 }; render();
      alert(j.channel ? "ДЗ додано на сайт і в канал ✅" : `ДЗ додано на сайт ✅${body.channel ? `\nКанал: ${j.channel_error}` : ""}`);
    } catch { alert("Немає звʼязку із сервером"); }
    return;
  }
  if (id === "upform") {
    ev.preventDefault();
    const f = ev.target, file = f.elements.f.files[0], btn = f.querySelector("[type=submit]");
    if (!file) return;
    if (file.size > 25 * 1024 * 1024) { alert("Файл більший за 25 МБ"); return; }
    btn.disabled = true; btn.textContent = "Завантажую…";
    try {
      const r = await fetch("api/admin/file", { method: "POST", body: file, headers: {
        "X-Admin-Token": ADMIN_TOKEN, "X-Tag": encodeURIComponent(f.dataset.tag), "X-File-Name": encodeURIComponent(file.name),
        "X-Title": encodeURIComponent(f.elements.title.value.trim()), "Content-Type": "application/octet-stream" } });
      const j = await r.json().catch(() => ({}));
      if (r.status === 401) { setToken(null); render(); alert("Сесія адміна закінчилась."); return; }
      if (!j.ok) throw new Error(j.error || "Не вдалося завантажити");
      FILES.push(j.file); render();
    } catch (e) { alert(e.message || "Немає звʼязку із сервером"); btn.disabled = false; btn.textContent = "Додати"; }
    return;
  }
  if (id === "shortform") {
    ev.preventDefault();
    const on = ev.submitter && ev.submitter.dataset.on === "1";
    try {
      const j = await adminApi("short", { day: document.getElementById("sf-day").value, on });
      SCHOOL.short_days = j.short_days; render();
    } catch (e) { alert(e.message); }
    return;
  }
  if (id === "blockform") {
    ev.preventDefault();
    try {
      await adminApi("block", { ip: document.getElementById("bf-ip").value.trim(), note: document.getElementById("bf-note").value });
      ADM.data = null; render();
    } catch (e) { alert(e.message); }
    return;
  }
  if (id === "edit-form") {
    ev.preventDefault();
    const f = ev.target, btn = f.querySelector("[type=submit]");
    btn.disabled = true;
    try {
      const j = await adminApi("edit", { id: f.dataset.id, homework: f.elements.hw.value, due: f.elements.due.value });
      const i = RAW.findIndex((x) => String(x.id) === f.dataset.id);
      if (i >= 0) RAW[i] = j.entry;
      EDIT_ID = null; applyPref(); render();
      alert(j.channel ? "Збережено на сайті й у каналі ✅" : `Збережено на сайті ✅\nКанал не змінено: ${j.channel_error}`);
    } catch (e) { btn.disabled = false; alert(e.message); }
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

async function deleteHw(id) {
  const e = RAW.find((x) => String(x.id) === id);
  if (!e || !confirm(`Видалити ДЗ з предмета «${subj(e.tag).name}» (${short(e.given)}) із сайту?`)) return;
  try {
    const r = await fetch("api/delete", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token: ADMIN_TOKEN, id }) });
    const j = await r.json();
    if (r.status === 401) { setToken(null); render(); alert("Ключ застарів — введи код у «Секреті» ще раз."); return; }
    if (j.ok || r.status === 404) { RAW = RAW.filter((x) => String(x.id) !== id); applyPref(); render(); }
    else alert(j.error || "Не вдалося видалити");
  } catch { alert("Немає звʼязку із сервером"); }
}

const viewer = document.getElementById("viewer");
function openViewer(src) { viewer.querySelector("img").src = src; viewer.hidden = false; }
viewer.addEventListener("click", () => { viewer.hidden = true; });
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (!viewer.hidden) { viewer.hidden = true; return; }
  if (GDZ.open) { closeModal(); return; }
  setDrawer(false);
});

const get = (u, fallback) => fetch(`${u}?t=${Date.now()}`, { cache: "no-store" })
  .then((r) => (r.ok ? r.json() : fallback)).catch(() => fallback);
const okAlerts = (a) => a && Array.isArray(a.list);
Promise.all([get("data/homework.json", []), get("data/school.json", null), get("data/files.json", []), get("data/alerts.json", null), get("data/class.json", null)])
  .then(([hw, school, files, al, cls]) => {
    if (cls && Array.isArray(cls.seats)) CLASS = cls;
    RAW = Array.isArray(hw) ? hw : [];
    FILES = Array.isArray(files) ? files : [];
    if (school) SCHOOL = Object.assign(SCHOOL, school);
    if (okAlerts(al)) ALERTS = al;
    applyPref();
    render();
    if (!PREF) showSetup();
    if (ADMIN_TOKEN) adminApi("check").catch(() => {}); // прострочений ключ — тихо вийти з адмін-режиму
    if (GDZ_TOKEN) gdzApi("check", {}).catch(() => {});
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
    if (!document.querySelector(".setup") && !drawer.classList.contains("open") && !GDZ.open) render();
  }
}, 30000);
