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
    return p && [1, 2].includes(p.group) && ["de", "es"].includes(p.lang) && [1, 2].includes(p.ukr) && [1, 2].includes(p.tech) ? p : null;
  } catch { return null; }
})();
const pref = () => PREF || { group: 1, lang: "de", ukr: 1, tech: 1 };
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
  PREF = p;
  try { localStorage.setItem(PREF_KEY, JSON.stringify(p)); } catch { /* приватний режим — тільки до перезавантаження */ }
  applyPref();
}
// Перемикачі: data-pg — група, data-pl — мова, data-pu — з ким українська, data-pt — технології
function prefSwitches(p) {
  const seg = (attr, cur, opts, label) => `<div class="seg" role="group" aria-label="${label}">${opts.map(([v, t]) =>
    `<button type="button" data-${attr}="${v}" aria-pressed="${cur === v}">${t}</button>`).join("")}</div>`;
  return seg("pg", p.group, [[1, "1 група"], [2, "2 група"]], "Група") +
    seg("pl", p.lang, [["de", "Німецька"], ["es", "Іспанська"]], "Мова") +
    seg("pu", p.ukr, [[2, "Укр.: Ганна"], [1, "Укр.: Ольга"]], "Українська мова") +
    seg("pt", p.tech, [[1, "Техн.: дівчинка"], [2, "Техн.: хлопчик"]], "Технології");
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
      <span class="nm"><a href="#/s/${encodeURIComponent(tag)}">${esc(subj(tag).name)}<i class="gdot"></i></a><small class="tch">${esc(shortName(teacher(tag)))}</small></span>
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
      <span class="nm"><a href="#/s/${encodeURIComponent(tag)}">${esc(subj(tag).name)}<i class="gdot"></i></a><small class="tch">${esc(shortName(teacher(tag)))}</small></span>
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
    <p>Обери групу, мову, учительку української й технології — сайт покаже твій розклад. Змінити можна у вкладці «Розклад».</p>
    <div class="q">Група</div><div class="slot-g"></div>
    <div class="q">Друга іноземна</div><div class="slot-l"></div>
    <div class="q">Українська мова з…</div><div class="slot-u"></div>
    <div class="q">Технології</div><div class="slot-t"></div>
    <button type="button" class="go" disabled>Готово</button></div>`;
  const draw = () => {
    const sw = document.createElement("div");
    sw.innerHTML = prefSwitches(draft);
    box.querySelector(".slot-g").replaceChildren(sw.children[0]);
    box.querySelector(".slot-l").replaceChildren(sw.children[0]);
    box.querySelector(".slot-u").replaceChildren(sw.children[0]);
    box.querySelector(".slot-t").replaceChildren(sw.children[0]);
    box.querySelector(".go").disabled = !(draft.group && draft.lang && draft.ukr && draft.tech);
  };
  box.addEventListener("click", (ev) => {
    const g = ev.target.closest("[data-pg]"), l = ev.target.closest("[data-pl]");
    if (g) { draft.group = Number(g.dataset.pg); draw(); }
    if (l) { draft.lang = l.dataset.pl; draw(); }
    const u = ev.target.closest("[data-pu]");
    if (u) { draft.ukr = Number(u.dataset.pu); draw(); }
    const tt = ev.target.closest("[data-pt]");
    if (tt) { draft.tech = Number(tt.dataset.pt); draw(); }
    if (ev.target.closest(".go") && draft.group && draft.lang && draft.ukr && draft.tech) {
      savePref({ group: draft.group, lang: draft.lang, ukr: draft.ukr, tech: draft.tech });
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
  const book = SCHOOL.books[tag];
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
    <h2>Хто з ким сидить</h2><table class="pairs"><thead><tr><th>Учень</th><th>Сидить з</th></tr></thead><tbody>${table}</tbody></table>`;
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
  if (!soon.length) return "";
  return `<a class="bday-w" href="#/bdays">${soon.map((b) => `🎂 <b>${cap(bdayWhen(b.days))}</b> ДН у ${esc(b.who)}`).join("<br>")}</a>`;
}

// ---------- «Секрет» (окремий пароль) ----------
let secretHtml = null;
function secretPage() {
  if (secretHtml !== null) return `<h1>Секрет</h1>${secretHtml || `<div class="empty">Тут поки порожньо.</div>`}`;
  return lockForm("lock2", "Секрет", "Введи пароль, щоб побачити вміст.");
}

// ---------- «Інфо» ----------
function infoPage() {
  const user = `
  <section class="doc">
    <h2>Що це</h2>
    <p>Сайт 8-Д з усім для навчання: домашні завдання, розклад, підручники, файли від учителів і повітряні тривоги в Києві.
      Працює з телефона й комп'ютера, нічого встановлювати не треба.</p>

    <h2>Звідки береться ДЗ</h2>
    <p>ДЗ надсилають у Telegram-бота (власник і адміни). Бот сам визначає предмет і дату здачі за розкладом,
      а після підтвердження публікує ДЗ у канал і на сайт. Якщо в завданні є номер вправи, під ДЗ з'являється вкладка
      <b>«Завдання»</b> з вирізкою з підручника.</p>

    <h2>Перше відкриття</h2>
    <p>Сайт питає <b>групу</b> (1 або 2), <b>другу іноземну</b> (німецька чи іспанська), <b>з ким українська</b> (Ганна чи Ольга)
      і <b>технології</b> (дівчата — Кисельова, хлопці — Резніченко).
      Після цього весь сайт показує саме твій розклад і твоє ДЗ. Змінити вибір — перемикачами вгорі вкладки «Розклад».</p>

    <h2>Вкладки</h2>
    <ul>
      <li><b>Головна</b> — що здавати найближчим часом. Згори — картка «Зараз»: який урок іде і скільки до кінця, або перерва і що далі.</li>
      <li><b>Календар</b> — натисни на будь-який день: розклад цього дня й усе ДЗ, яке треба здати. Крапки на днях — є ДЗ.</li>
      <li><b>Розклад</b> — тиждень з кабінетами й учителями, А/Б тижні, перемикачі. У скорочені дні — позначка «⏱ Скорочені уроки». Зверху — сьогоднішній день із живою підсвіткою уроку й перерви
        (після уроків — завтрашній).</li>
      <li><b>⋯ → Предмети</b> — кожен предмет окремо: найближчі уроки, підручник, файли, усе ДЗ.</li>
      <li><b>⋯ → Файли</b> — підручники (PDF) і файли від учителів.</li>
      <li><b>⋯ → Виконане</b> — ДЗ, які ти позначив галочкою.</li>
      <li><b>⋯ → Тривоги</b> — тривоги в м. Київ: коли були, скільки тривали, які уроки зачепили.</li>
      <li><b>⋯ → Додаткове</b>: <b>Розсадка</b> (хто з ким сидить), <b>Дні народження</b> (на головній — нагадування за 2 дні).</li>
    </ul>

    <h2>Галочки</h2>
    <p>Зробив ДЗ — натисни квадратик біля нього. На головній воно викреслиться й зникне, в інших місцях лишиться викресленим.
      Усе виконане — у «⋯ → Виконане», там галочку можна зняти. Галочки зберігаються лише у твоєму браузері.</p>

    <h2>Групи й чуже ДЗ</h2>
    <p>Для англійської, інформатики й технологій ДЗ може бути окремо для 1 і 2 групи, для української — окремо для різних учительок,
      а німецька й іспанська — різні предмети. На головній видно тільки твоє. Чуже — лише в календарі й «Предметах», притінене, з міткою групи.</p>

    <h2>Тривоги</h2>
    <p>Сайт сам стежить за тривогою в Києві. Під час тривоги на головній — червоний рядок. Якщо урок закінчився під тривогу
      (тривога йшла хоча б останні 10 хв) і ДЗ з нього не задали — замість ДЗ з'явиться червона плашка <b>«Була тривога!»</b>.
      У календарі за уроком — червона смуга: скільки відсотків уроку пройшло під тривогою.</p>

    <h2>Корисно знати</h2>
    <ul>
      <li>Сайт оновлює дані сам; якщо щось не з'явилось — просто онови сторінку.</li>
      <li>Щоб сайт був як застосунок: у браузері телефона «Поділитися» → «На екран „Додому“» (iPhone) або ⋮ → «Додати на головний екран» (Android).</li>
      <li>Вибір групи, галочки — тільки у твоєму браузері, нікуди не відправляються.</li>
      <li>Пости з ДЗ також є в Telegram-каналі класу.</li>
    </ul>

    <div class="bug">🐞 <b>Знайшов баг або є ідея?</b> Пиши мені в Telegram: <a href="https://t.me/Spl1ted" target="_blank" rel="noopener">@Spl1ted</a></div>
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
      <li>Розсадка й дні народження — <code>data\class.json</code>.</li>
    </ul>
  </section>`;
  return `<h1>Інфо</h1><p class="sub">Як усе влаштовано.</p>${user}${adm}`;
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
  else html = home();
  app.innerHTML = html;
  document.querySelectorAll(".tabs a, .drawer a").forEach((a) => a.classList.toggle("on", a.dataset.tab === tab));
  document.getElementById("more").classList.toggle("on", ["subj", "files", "secret", "alerts", "done", "admin", "info", "seats", "bdays"].includes(tab));
  setDrawer(false);
  document.getElementById("admin-badge").hidden = !ADMIN_TOKEN;
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
  const pg = ev.target.closest("[data-pg]"), pl = ev.target.closest("[data-pl]"), pu = ev.target.closest("[data-pu]"), pt = ev.target.closest("[data-pt]");
  if (pg || pl || pu || pt) {
    savePref({ ...pref(), ...(pg ? { group: Number(pg.dataset.pg) } : pl ? { lang: pl.dataset.pl } : pu ? { ukr: Number(pu.dataset.pu) } : { tech: Number(pt.dataset.pt) }) });
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
      if (id === "lock") setToken(j.token); else secretHtml = j.html || "";
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
document.addEventListener("keydown", (e) => { if (e.key === "Escape") { viewer.hidden = true; setDrawer(false); } });

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
