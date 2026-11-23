"use strict";
// тонкі іконки замість емодзі (як у нижній панелі)
const ICONS = {
  siren: '<path d="M7 18v-6a5 5 0 0 1 10 0v6"/><path d="M5 21h14v-2a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2z"/><path d="M12 2v2M3.5 6l1.5 1.2M20.5 6 19 7.2M2 12h2M20 12h2"/>',
  warn: '<path d="M10.3 3.9 2.4 17.6A2 2 0 0 0 4.1 20.6h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
  okc: '<circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
  wifioff: '<path d="M2 2l20 20M8.5 16.5a5 5 0 0 1 7 0M5 13a10 10 0 0 1 5.2-2.8M19 13a10 10 0 0 0-2-1.5M2 8.8a15 15 0 0 1 4.2-2.6M22 8.8A15 15 0 0 0 11 5M12 20h.01"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  chevL: '<path d="m15 18-6-6 6-6"/>',
  chevR: '<path d="m9 18 6-6-6-6"/>',
  ext: '<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  up: '<path d="M12 19V5M5 12l7-7 7 7"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  dots: '<circle cx="5.5" cy="12" r="1.2" fill="currentColor"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/><circle cx="18.5" cy="12" r="1.2" fill="currentColor"/>',
  dotsV: '<circle cx="12" cy="5.5" r="1.2" fill="currentColor"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/><circle cx="12" cy="18.5" r="1.2" fill="currentColor"/>',
  clip2: '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/>',
  rocket: '<path d="M4.5 16.5c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2.1-.1-2.9a2.2 2.2 0 0 0-2.9-.1z"/><path d="m12 15-3-3a22 22 0 0 1 2-4A13 13 0 0 1 22 2c0 2.7-.8 7.5-6 11a22 22 0 0 1-4 2z"/><path d="M9 12H4s.6-3 2-4c1.6-1.1 5 0 5 0M12 15v5s3-.6 4-2c1.1-1.6 0-5 0-5"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
  code: '<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>',
  note: '<path d="M15.5 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5z"/><path d="M15 3v6h6"/><path d="M7 13h6M7 17h9"/>',
  medal: '<path d="M7.2 2h9.6l-3 6h-3.6z"/><circle cx="12" cy="15" r="6"/><path d="m12 12 .9 1.9 2 .3-1.5 1.4.4 2-1.8-1-1.8 1 .4-2-1.5-1.4 2-.3z"/>',
  chart: '<path d="M3 3v18h18"/><rect x="7" y="12" width="3" height="6" rx="1"/><rect x="12" y="8" width="3" height="10" rx="1"/><rect x="17" y="5" width="3" height="13" rx="1"/>',
  poll: '<path d="M4 20h16"/><rect x="5" y="10" width="3" height="7" rx="1"/><rect x="10.5" y="5" width="3" height="12" rx="1"/><rect x="16" y="13" width="3" height="4" rx="1"/>',
  palm: '<path d="M12 22v-9"/><path d="M12 13c-3-4-7-4-9-2 2-3 6-4 9 2zM12 13c3-4 7-4 9-2-2-3-6-4-9 2zM12 13c0-5-2-8-5-9 4 0 6 4 5 9zM12 13c0-5 2-8 5-9-4 0-6 4-5 9z"/>',
  tg: '<path fill="currentColor" stroke="none" d="M21.9 4.3 18.7 19.4c-.2 1-.9 1.3-1.8.8l-4.8-3.6-2.3 2.2c-.3.3-.5.5-1 .5l.3-4.9 8.9-8c.4-.3-.1-.5-.6-.2L6.4 13.1 1.7 11.6c-1-.3-1-1 .2-1.5L20.5 3c.9-.3 1.6.2 1.4 1.3z"/>',
  chat: '<path d="M21 12a8 8 0 0 1-11.8 7L4 20.5l1.5-4.8A8 8 0 1 1 21 12z"/><path d="M8.5 11h7M8.5 14h4"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  sync: '<path d="M21 12a9 9 0 0 1-15.7 6M3 12a9 9 0 0 1 15.7-6"/><path d="M21 4v5h-5M3 20v-5h5"/>',
  send: '<path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0"/>',
  bellon: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" fill="currentColor"/><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  undo: '<path d="M9 14 4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-3"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',

  check: '<path d="M20 6 9 17l-5-5"/>',
  trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6"/>',
  lunch: '<path d="M4 3v7a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V3M7 3v18"/><path d="M20 15V3a5 5 0 0 0-4 5v6a1 1 0 0 0 1 1h3zm0 0v6"/>',
  timer: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2M10 2h4"/>',
  book: '<path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2z"/><path d="M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z"/>',
  books: '<path d="M4 4h4v16H4zM10 4h4v16h-4z"/><path d="m16 5 3.8-1 3 15.3-3.8 1z" transform="translate(-2 0)"/>',
  cake: '<path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8M2 21h20"/><path d="M4 16c1 0 1.5-1 3-1s2 2 3 2 2-2 3-2 2 2 3 2 2-1 4-1M7 8v3M12 8v3M17 8v3M7 4h.01M12 4h.01M17 4h.01"/>',
  pen: '<path d="M17 3a2.8 2.8 0 0 1 4 4L7.5 20.5 2 22l1.5-5.5z"/><path d="m15 5 4 4"/>',
  gear: '<path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="18" r="2"/>',
  bot: '<path d="M12 8V4H8"/><rect x="4" y="8" width="16" height="12" rx="2"/><path d="M2 14h2M20 14h2M15 13v2M9 13v2"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
  spark: '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 15l.7 1.8 1.8.7-1.8.7L19 20l-.7-1.8-1.8-.7 1.8-.7z"/>',
  mega: '<path d="m3 11 16-6v14L3 13z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
  refresh: '<path d="M3 12a9 9 0 0 1 15.7-6L21 8M21 3v5h-5M21 12a9 9 0 0 1-15.7 6L3 16M8 16H3v5"/>',
  unlock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>',
  bug: '<rect x="7" y="7" width="10" height="14" rx="5"/><path d="M12 11v10M9 4l1.5 2.5M15 4l-1.5 2.5M3 13h4M17 13h4M4 8l3 2M20 8l-3 2M4 19l3-2M20 19l-3-2"/>',
  clip: '<path d="m21.4 11-9.2 9.2a6 6 0 0 1-8.5-8.5l8.6-8.6a4 4 0 0 1 5.7 5.7l-8.6 8.6a2 2 0 0 1-2.8-2.8l8.5-8.5"/>',
  seat: '<path d="M7 10V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v5M5 10h14v4H5zM7 14v7M17 14v7"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 16v-4M12 8h.01"/>',
  bulb: '<path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/>',
};
const ic = (n) => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n]}</svg>`;
// дружній порожній екран: велика іконка, заголовок, підказка
const emptyBox = (icon, title, sub = "") =>
  `<div class="empty fun"><span class="e-ic">${ic(icon)}</span><b>${title}</b>${sub ? `<span>${sub}</span>` : ""}</div>`;
// звʼязок із сервером: ok — остання відповідь свіжа; at — коли востаннє були свіжі дані
const NET = { ok: true, at: 0 };

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
let ANNS = [], LUNCH = {}, VISITS = {}, AIA = {};
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

// ---------- налаштування (у браузері) ----------
const SET_KEY = "dz-set";
const SET_DEFAULT = { theme: "auto", showDebts: false, hideSwitches: false, subjDoneOnly: false, showNow: true, showBdays: true, showClass: true };
let SET = (() => { try { return { ...SET_DEFAULT, ...(JSON.parse(localStorage.getItem(SET_KEY)) || {}) }; } catch { return { ...SET_DEFAULT }; } })();
function saveSet(patch) {
  SET = { ...SET, ...patch };
  try { localStorage.setItem(SET_KEY, JSON.stringify(SET)); } catch { /* приватний режим */ }
  applyTheme();
  queueSync();
}
function applyTheme() {
  const r = document.documentElement;
  // «За часом»: темна з 20:00 до 07:00
  const h = new Date().getHours();
  const t = SET.theme === "time" ? (h >= 20 || h < 7 ? "dark" : "light") : SET.theme;
  if (t === "auto") r.removeAttribute("data-theme"); else r.setAttribute("data-theme", t);
}
setInterval(applyTheme, 60000);
applyTheme();

// ---------- виконане (галочки, зберігаються в браузері) ----------
const DONE_KEY = "dz-done";
let DONE = (() => { try { return new Set(JSON.parse(localStorage.getItem(DONE_KEY)) || []); } catch { return new Set(); } })();
function setDone(id, on) {
  if (on) DONE.add(id); else DONE.delete(id);
  try { localStorage.setItem(DONE_KEY, JSON.stringify([...DONE])); } catch { /* приватний режим */ }
  queueSync();
}
const isDone = (e) => DONE.has(String(e.id));
function savePref(p) {
  p = withGroup(p);
  PREF = p;
  try { localStorage.setItem(PREF_KEY, JSON.stringify(p)); } catch { /* приватний режим — тільки до перезавантаження */ }
  applyPref();
  queueSync();
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
// «на завтра», «на пт», «на 03.12» (повна дата — у підказці й календарі)
function dueShort(d) {
  const r = relDay(d);
  if (r === "сьогодні" || r === "завтра" || r === "післязавтра") return r;
  const diff = Math.round((parse(d) - parse(today())) / 86400000);
  return diff > 0 && diff < 7 ? WD_TINY[parse(d).getDay()] : short(d);
}
function card(e, { showSubj = true } = {}) {
  const s = subj(e.tag);
  if (e.alert) {
    return `<article class="card alert-card" style="--c:${s.color}">
    <div class="head">${showSubj ? `<a class="subj" href="#/s/${encodeURIComponent(e.tag)}">${esc(s.name)}<i class="gdot" style="--g:${groupColor(e.tag)}"></i></a>` : "<span></span>"}
      <span class="dates">${e.n} урок ${short(e.given)}${e.due ? ` <span class="arr">${ic("arrow")}</span> здати ${short(e.due)}` : ""}</span></div>
    <p class="hw"><b>${ic("siren")} Була тривога!</b> ДЗ не задавали · ${e.pct}% уроку під тривогою</p>
  </article>`;
  }
  const dates = e.due ? `на ${dueShort(e.due)}` : `задано ${short(e.given)}`;
  const datesFull = `задано ${short(e.given)}` + (e.due ? ` → здати ${short(e.due)}` : "");
  const photos = (e.photos || []).map((p) =>
    `<button data-img="${esc(p)}" aria-label="Відкрити фото"><img src="${esc(p)}" loading="lazy" alt="Фото дошки"></button>`).join("");
  const tasks = e.tasks || [];
  let taskHtml = "";
  if (tasks.length) {
    const body = tasks.map((t) => {
      const imgs = (t.images || []).map((p) =>
        `<button class="crop" data-img="${esc(p)}" aria-label="Збільшити"><img src="${esc(p)}" loading="lazy" alt="${esc(t.label)}"></button>`).join("");
      const link = t.book ? `<a class="pdf-link" href="${bookUrl(t.book, t.page)}" target="_blank" rel="noopener">відкрити в підручнику ${ic("ext")}</a>` : "";
      return `<div class="task"><div class="task-h"><b>${esc(cap(t.label))}</b>${link}</div>${imgs}</div>`;
    }).join("");
    taskHtml = `<details class="tasks"><summary>Завдання <span>${tasks.length}</span></summary>${body}</details>`;
  }
  const done = isDone(e), g = grpLabel(e);
  const del = ADMIN_TOKEN ? `<span class="adm-btns"><button type="button" class="del" data-edit="${esc(e.id)}" aria-label="Редагувати ДЗ">${ic("pen")}</button><button type="button" class="del" data-del="${esc(e.id)}" aria-label="Видалити ДЗ">${ic("trash")}</button></span>` : "";
  const noteBtn = !NOTES[String(e.id)] && NOTE_EDIT !== String(e.id)
    ? `<button type="button" class="rem" data-note="${esc(e.id)}" aria-label="Додати нотатку" title="Нотатка">${ic("note")}</button>` : "";
  const rem = !e.alert && !done && e.due && e.due >= today()
    ? `<button type="button" class="rem${REM[e.id] ? " on" : ""}" data-rem="${esc(e.id)}" aria-label="${REM[e.id] ? `Нагадування о ${hm(REM[e.id])} — скасувати` : "Нагадати"}" title="${REM[e.id] ? `Нагадаю ${hm(REM[e.id])}` : "Нагадати о 18:00"}">${ic(REM[e.id] ? "bellon" : "bell")}</button>` : "";
  const check = `<button type="button" class="check" data-done="${esc(e.id)}" role="checkbox" aria-checked="${done}" aria-label="${done ? "Повернути в невиконане" : "Позначити виконаним"}"></button>`;
  return `<article class="card${done ? " is-done" : ""}${isMine(e) ? "" : " not-mine"}" style="--c:${s.color}">
    <div class="head">${check}${showSubj ? `<a class="subj" href="#/s/${encodeURIComponent(e.tag)}">${esc(s.name)}<i class="gdot" style="--g:${groupColor(e.tag)}"></i></a>` : "<span></span>"}
      ${g ? `<span class="grp">${esc(g)}</span>` : ""}<span class="dates" title="${datesFull}">${dates}</span>${noteBtn}${rem}${del}</div>
    ${ADMIN_TOKEN && EDIT_ID === String(e.id) ? `<form id="edit-form" class="edit-form" data-id="${esc(e.id)}">
      <label>Текст ДЗ<textarea name="hw" rows="4" required>${esc(e.homework)}</textarea></label>
      <label>Здати<input type="date" name="due" value="${esc(e.due || "")}"></label>
      <div class="edit-btns"><button type="submit">Зберегти</button><button type="button" data-edit-cancel>Скасувати</button></div>
      <p class="muted small-note">Зміниться на сайті${e.post ? " і в пості в каналі" : " (пост у каналі старий — його не змінимо)"}.</p></form>`
    : `<p class="hw">${linkify(e.homework)}</p>`}${noteHtml(e)}${commentsHtml(e)}
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
    ${list.length ? list.map((e) => card(e)).join("") : emptyBox("check", "Поки нічого не позначено", "Натисни кружечок на картці ДЗ або змахни її вправо")}`;
}
function aiSection() {
  if (!AIA || !AIA.checked) return "";
  const tr = AIA.track || {};
  const acc = tr.warned ? `попереджень ${tr.warned}, справдилось ${tr.hits}${tr.accuracy !== null && tr.accuracy !== undefined ? ` (${tr.accuracy}%)` : ""}, хибних ${tr.false}, пропущених тривог ${tr.missed}` : "статистика ще збирається";
  return `<section class="risk" style="margin-top:12px"><b>${ic("bot")} ШІ-прогноз (неофіційно)</b>
    ${aiFresh() && !AIA.stale ? `Ризик тривоги: ${AIA.risk}/10${AIA.threat ? ` · загроза: ${esc(AIA.threat)}` : ""}${AIA.end_min && ALERTS.now ? ` · ще ~${AIA.end_min} хв` : ""}<br>${esc(AIA.summary || "")}` : aiFresh() ? "Нічого нового про Київ." : "Прогноз зараз недоступний — сервер давно не перевіряв канали."}
    ${aiTimes()}
    <small>Неофіційно. Канали моніторингу перевіряються щохвилини. За 14 днів: ${acc}.</small></section>`;
}
function alertsPage() {
  const open = ALERTS.list.find((a) => !a.end);
  let status;
  if (ALERTS.now === null) status = `<section class="alert-now">Сервер ще не отримав дані про тривоги. Зачекай хвилинку.</section>`;
  else if (ALERTS.now) status = `<section class="alert-now on" role="status"><b>${ic("siren")} Зараз повітряна тривога в Києві</b>${open ? `<span>з ${hhmm(open.start)} · триває ${durStr(Date.now() - ts(open.start))}</span>` : ""}</section>`;
  else status = `<section class="alert-now off" role="status"><b>Тривоги немає</b><span>перевірено о ${ALERTS.checked ? hhmm(ALERTS.checked) : "—"}</span></section>`;
  status += aiSection();
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
    ${list || emptyBox("shield", "Тривог не було", "Тут зʼявляться тривоги й уроки, які вони зачепили")}`;
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
// Одна картка статусу: зверху смужка (тривога / можлива тривога / обід), нижче — «Зараз»
function nowCard() {
  const strips = alertBanner() + (SET.showClass ? lunchBanner() : "");
  const main = SET.showNow ? nowMain() : "";
  if (!strips && !main) return `<section class="now now-empty" id="now"></section>`;
  return `<section class="now${main ? "" : " now-min"}" id="now">${strips}${main ? `<div class="now-body">${main}</div>` : ""}</section>`;
}
function nowMain() {
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
  return html;
}

// ---------- сторінки ----------
// «· 2 завдання · 1 тривога» — плашки тривог рахуються окремо
function hwCount(list) {
  const hw = list.filter((e) => !e.alert).length, al = list.length - hw;
  return (hw ? ` · ${hw} ${plural(hw)}` : "") + (al ? ` · ${ic("siren")} ${al} ${al === 1 ? "урок під тривогою" : "уроки під тривогою"}` : "");
}
// ---------- тривога (офіційна + ШІ-прогноз), обід, оголошення ----------
// перевірка щохвилини; якщо понад 6 хв тиші — дані вважаємо застарілими
const aiFresh = () => AIA && AIA.checked && (Date.now() - new Date(AIA.checked).getTime()) < 6 * 60 * 1000;
// «Змінено о 00:43 · перевірено о 00:50»
const aiTimes = () => {
  if (!AIA || !AIA.checked) return "";
  const ch = AIA.changed || AIA.at;
  return `<span class="ai-time">${ch ? `Змінено о ${hm(new Date(ch).getTime())} · ` : ""}перевірено о ${hm(new Date(AIA.checked).getTime())}</span>`;
};
// Смужка тривоги на головній: лише головний рядок; подробиці — за стрілочкою (стан тримається між оновленнями щосекунди)
let STRIP_OPEN = false;
function stripHtml(cls, title, extra) {
  return `<div class="strip ${cls}"><div class="strip-row"><a href="#/alerts">${title}</a>${extra
    ? `<button type="button" class="strip-tog" data-strip aria-expanded="${STRIP_OPEN}" aria-label="${STRIP_OPEN ? "Сховати подробиці" : "Показати подробиці"}">${ic("chevR")}</button>` : ""}</div>
    ${extra && STRIP_OPEN ? `<div class="strip-more">${extra}</div>` : ""}</div>`;
}
function alertBanner() {
  if (ALERTS.now) {
    const t = aiFresh() && AIA.threat ? ` · ${esc(AIA.threat)}` : "";
    const extra = [aiFresh() && AIA.end_min ? `За оцінкою ШІ ще ~${AIA.end_min} хв.` : "", aiFresh() && AIA.summary ? esc(AIA.summary) : ""].filter(Boolean).join(" ")
      + (aiFresh() ? aiTimes() : "");
    return stripHtml("strip-alert", `${ic("siren")} Повітряна тривога в Києві${t}`, extra);
  }
  if (aiFresh() && !AIA.stale && AIA.risk >= 5) {
    const extra = `${esc(AIA.summary || "")}${AIA.eta_min ? ` Орієнтовно через ${AIA.eta_min} хв.` : ""}<br><small>Неофіційно</small>${aiTimes()}`;
    return stripHtml("strip-risk", `${ic("warn")} Можлива тривога · ${AIA.risk}/10${AIA.threat ? ` · ${esc(AIA.threat)}` : ""}`, extra);
  }
  return "";
}
function lunchBanner() {
  const l = LUNCH[today()];
  if (!l || !SCHOOL.bells.length) return "";
  const after = bell(l.after), next = bell(l.after + 1);
  if (!after) return "";
  const sec = nowSec(), endL = toMin(after[1]) * 60, startL = toMin(after[0]) * 60;
  const beforeStart = bell(l.after - 1) ? toMin(bell(l.after - 1)[1]) * 60 : startL - 600;
  const unoff = l.official ? "" : ` <small>(не офіційно)</small>`;
  if (sec >= endL && sec < (next ? toMin(next[0]) * 60 : endL + 1200)) return `<div class="strip strip-lunch big">${ic("lunch")} ОБІД${unoff}</div>`;
  if (sec >= startL && sec < endL) return `<div class="strip strip-lunch">${ic("lunch")} ОБІД після цього уроку (${l.after}-го)${unoff}</div>`;
  if (sec >= beforeStart && sec < startL) return `<div class="strip strip-lunch">${ic("lunch")} ОБІД через урок — після ${l.after}-го${unoff}</div>`;
  return "";
}
function annBlock() {
  const since = Date.now() - 3 * 86400000;
  const list = ANNS.filter((a) => new Date(a.at).getTime() >= since).slice(-3).reverse();
  return list.map((a) => `<details class="mini ann"><summary><span class="mi">${ic("mega")}</span><span class="mt">${esc(a.text)}</span></summary>
    <div class="mini-body">${a.photo ? `<button type="button" class="crop" data-img="${esc(a.photo)}"><img src="${esc(a.photo)}" alt="Фото до оголошення" loading="lazy"></button>` : ""}
    <div class="meta"><span>Від класної керівниці · ${short(a.at.slice(0, 10))} ${a.at.slice(11, 16)}</span>${ADMIN_TOKEN ? `<button type="button" class="badge-x" data-anndel="${esc(a.id)}" aria-label="Видалити оголошення">${ic("trash")}</button>` : ""}</div></div></details>`).join("");
}

// Кільце «зроблено N з M» за найближчі 7 днів
function weekRing() {
  const t = today(), lim = iso(addDays(parse(t), 7));
  const list = ALL.filter((e) => !e.alert && isMine(e) && e.due && e.due > t && e.due <= lim);
  if (!list.length) return "";
  const n = list.filter(isDone).length, p = n / list.length, C = 2 * Math.PI * 15;
  return `<a class="ring" href="#/done" title="Виконано ${n} з ${list.length} ДЗ на найближчі 7 днів" aria-label="Виконано ${n} з ${list.length} ДЗ на тиждень">
    <svg viewBox="0 0 36 36" aria-hidden="true"><circle cx="18" cy="18" r="15" class="rb"/><circle cx="18" cy="18" r="15" class="rf"
      style="--len:${C.toFixed(1)};--off:${(C * (1 - p)).toFixed(1)}" stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${(C * (1 - p)).toFixed(1)}" transform="rotate(-90 18 18)"/></svg>
    <span><b>${n}</b> з ${list.length}<small>за тиждень</small></span></a>`;
}

function home() {
  const mine = ALL.filter((e) => isMine(e) && !isDone(e));
  const due = byDue(mine);
  const t = today();
  const days = Object.keys(due).filter((d) => d > t).sort();
  let html = "";
  let side = nowCard() + loginNudge() + `<div class="minis">${breakLine(7)}${testsMini()}${SET.showClass ? annBlock() : ""}${SET.showBdays ? bdayWidget() : ""}</div>`;
  const debtN = debts().length;
  side += homePolls();
  if (debtN && SET.showDebts) side += `<a class="debt-line" href="#/debts">${ic("warn")} Боргів: ${debtN} — переглянути ${ic("chevR")}</a>`;
  const tmr = nextSchoolDay(t), tmrAll = tmr ? RAW.filter((e) => e.due === tmr && isMine(e)) : [];
  if (tmrAll.length && tmrAll.every(isDone)) side += `<div class="all-done">${ic("okc")} ДЗ ${tmr === iso(addDays(parse(t), 1)) ? "на завтра" : `на ${WD[parse(tmr).getDay()]}`} виконано</div>`;
  if (!days.length) {
    html += ALL.length ? emptyBox("sun", "На найближчі дні нічого не задано", "Можна відпочити") : "";
  } else {
    const first = days[0];
    html += `<div class="h1row"><h1>Здати ${whenDay(first)}</h1>${weekRing()}</div><p class="sub">${longDay(first)}${hwCount(due[first])}</p>`;
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
  if (!ALL.length) html += emptyBox("book", "Тут зʼявиться ДЗ", "щойно бот його опублікує");
  const doneN = ALL.filter((e) => isMine(e) && isDone(e) && e.due && e.due > today()).length;
  if (doneN) html += `<a class="done-btn" href="#/done">${ic("check")} Виконано: ${doneN} — переглянути</a>`;
  const fd = focusDay();
  const day = fd ? `<section class="h-day"><h2>Розклад · ${relDay(fd)}</h2>${dayTable(fd, false)}<a class="h-more" href="#/week">Увесь тиждень ${ic("chevR")}</a></section>` : "";
  return `<div class="home"><div class="h-side">${side}${day}</div><div class="h-main">${html}${updLine()}</div></div>`;
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
      <span class="lr">${p ? `<span class="apct" title="${p}% уроку під тривогою">${ic("siren")} ${p}%</span> · ` : ""}${b ? `${b[0]}–${b[1]} · ` : ""}${room(r, tag)}</span></li>`;
  }).join("")}</ol>${isShort(s) ? `<p class="short-note">${ic("timer")} Скорочені уроки</p>` : ""}${legend ? groupLegend() : ""}`;
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
    <ol class="lessons">${rows}</ol>${isShort(s) ? `<p class="short-note">${ic("timer")} Скорочені уроки</p>` : ""}</section>`;
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
      ? `<div class="week-day">${h}<button type="button" class="moved" data-top>${ic("up")} Показано зверху</button></div>`
      : `<div class="week-day">${h}${dayTable(s, false)}</div>`;
  }).join("");
  return `${SET.hideSwitches ? "" : `<div class="prefs">${prefSwitches(pref())}</div>`}
    ${focusCard(focus)}
    <div class="cal-nav"><button data-week="-1" aria-label="Попередній тиждень">${ic("chevL")}</button>
      <div class="week-t"><h1>${title}</h1><span>${short(iso(mon))} – ${short(iso(fri))}${type ? ` · тиждень ${type === "A" ? "А" : "Б"}` : ""}</span></div>
      <button data-week="1" aria-label="Наступний тиждень">${ic("chevR")}</button></div>
    ${groupLegend()}<div class="week">${days}</div>`;
}

// Перше відкриття сайту: питаємо групу й мову
function showSetup() {
  const draft = { group: null, lang: null, ukr: null, tech: null };
  const box = document.createElement("div");
  box.className = "setup";
  box.innerHTML = `<div class="setup-box" role="dialog" aria-modal="true" aria-labelledby="setup-h">
    <h2 id="setup-h">Привіт!</h2>
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
// Яка частка навчального часу дня (у %) пройшла під тривогою
function dayAlertShare(s) {
  let all = 0, hit = 0;
  for (const [n] of plan(s)) {
    const b = bell(n, s);
    if (!b) continue;
    const len = toMin(b[1]) - toMin(b[0]);
    all += len; hit += len * alertPct(s, n) / 100;
  }
  return all ? 100 * hit / all : 0;
}
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
    const alertDay = s <= t && dayAlertShare(s) > 15;
    const real = items.filter((e) => !e.alert).length;
    const lv = real ? ` lv${Math.min(4, real)}` : "";
    const label = `${n} ${MON[m]}${items.length ? `, ${items.length} ${plural(items.length)}` : ""}`;
    cells += `<button class="${cls}${lv}${alertDay ? " al-day" : ""}" data-day="${s}" aria-label="${label}${alertDay ? ", понад 15% уроків під тривогою" : ""}">${n}<span class="dots">${dots}</span></button>`;
  }
  const sel = due[calSel] || [];
  return `<div class="cal-nav"><button data-mon="-1" aria-label="Попередній місяць">${ic("chevL")}</button>
      <h1>${MON_N[m]} ${y}</h1><button data-mon="1" aria-label="Наступний місяць">${ic("chevR")}</button></div>
    ${breakLine(400)}<div class="grid">${cells}</div>
    <p class="legend">Що темніший день, то більше ДЗ треба здати. Крапка — середня важкість. Гортай місяці змахом.</p>
    ${weekLoad(calSel)}
    <div class="day-h"><b>${cap(relDay(calSel))}</b><span>${longDay(calSel)}</span></div>
    <a class="visits-btn" href="#/visits/${calSel}">${ic("users")} Відвідування ${ic("chevR")}</a>
    <h3>Розклад</h3>${dayTable(calSel)}
    ${(() => { const ev = EVENTS.filter((e) => e.date === calSel && e.kind !== "own"); return ev.length ? `<h3>Тести й проєкти</h3>${ev.map(evCard).join("")}` : ""; })()}
    <h3>ДЗ на цей день</h3>
    ${sel.length ? sortSubj(sel).map((e) => card(e)).join("") : `<div class="empty small">Нічого не задано.</div>`}`;
}

// ---------- Тести й Проєкти ----------
let EVENTS = [];
const EV_KINDS = { control: "Контрольна", self: "Самостійна", test: "Тест", online: "Онлайн-тест", project: "Проєкт", own: "Мій проєкт" };
const EV_TESTS = ["control", "self", "test", "online"];
// тест із ДЗ (id «hw-…») ділить галочку з самим ДЗ
const evKey = (e) => (String(e.id).startsWith("hw-") ? String(e.id).slice(3) : `ev:${e.id}`);
const evDone = (e) => DONE.has(evKey(e));
function daysTo(s) { return Math.round((parse(s) - parse(today())) / 86400000); }
function untilText(s) {
  const n = daysTo(s);
  if (n === 0) return "сьогодні";
  if (n === 1) return "завтра";
  if (n === 2) return "післязавтра";
  if (n < 0) return n === -1 ? "вчора" : `${-n} дн. тому`;
  return `через ${n} ${n % 10 === 1 && n % 100 !== 11 ? "день" : [2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100) ? "дні" : "днів"}`;
}
function evCard(e) {
  const s = e.tag ? subj(e.tag) : { name: "", color: "var(--accent)" };
  const done = evDone(e), soon = e.date && daysTo(e.date) >= 0 && daysTo(e.date) <= 2;
  const check = `<button type="button" class="check" data-done="${esc(evKey(e))}" role="checkbox" aria-checked="${done}" aria-label="${done ? "Повернути" : "Позначити як готово"}"></button>`;
  const when = e.date ? `<span class="dates${soon && !done ? " soon" : ""}">${WD[parse(e.date).getDay()]} ${short(e.date)} · ${untilText(e.date)}</span>` : "";
  const del = ADMIN_TOKEN ? `<button type="button" class="del" data-evdel="${esc(e.id)}" aria-label="Видалити">${ic("trash")}</button>` : "";
  const text = e.text && e.text.trim() !== e.title.trim() ? `<p class="hw">${linkify(e.text)}</p>` : "";
  return `<article class="card ev-card${done ? " is-done" : ""}" style="--c:${s.color}">
    <div class="head">${check}${e.tag ? `<a class="subj" href="#/s/${encodeURIComponent(e.tag)}">${esc(s.name)}</a>` : ""}
      <span class="ev-kind k-${e.kind}">${EV_KINDS[e.kind] || ""}</span>${when}${del}</div>
    <p class="ev-title">${esc(e.title)}</p>${text}
    ${e.members ? `<p class="ev-members">${ic("users")} ${esc(e.members)}</p>` : ""}
    ${e.link ? `<a class="ev-link" href="${esc(e.link)}" target="_blank" rel="noopener">${ic(e.kind === "online" ? "clip2" : "link")} ${e.kind === "online" ? "Відкрити тест" : "Відкрити посилання"} ${ic("ext")}</a>` : ""}
  </article>`;
}
function evSplit(list) {
  const t = today();
  const up = list.filter((e) => e.date >= t).sort((x, y) => x.date.localeCompare(y.date));
  const past = list.filter((e) => e.date < t).sort((x, y) => y.date.localeCompare(x.date));
  return [up, past];
}
function testsPage() {
  const [up, past] = evSplit(EVENTS.filter((e) => EV_TESTS.includes(e.kind) && e.date));
  const week = up.filter((e) => daysTo(e.date) <= 7), later = up.filter((e) => daysTo(e.date) > 7);
  return `<h1>Тести</h1><p class="sub">Контрольні, самостійні, тести в класі й онлайн-тести.</p>
    ${up.length ? "" : emptyBox("clip2", "Найближчим часом тестів немає", "Щойно вчитель оголосить — зʼявиться тут")}
    ${week.length ? `<h2>Цього тижня</h2>${week.map(evCard).join("")}` : ""}
    ${later.length ? `<h2>Пізніше</h2>${later.map(evCard).join("")}` : ""}
    ${past.length ? `<details class="ev-past"><summary>Минулі · ${past.length}</summary>${past.slice(0, 30).map(evCard).join("")}</details>` : ""}`;
}
// «Мої проєкти» — проєкти власника сайту; цей завжди є
const OWN_DEFAULT = [{ id: "own-dz", kind: "own", title: "Сайт і бот «ДЗ 8-Д»",
  text: "Telegram-бот @HWeightDai збирає ДЗ від учителів, а цей сайт показує його з розкладом, календарем, тривогами, тестами й нагадуваннями. Зроблено для 8-Д.",
  link: "https://t.me/HWeightDai" }];
function projectsPage() {
  const [up, past] = evSplit(EVENTS.filter((e) => e.kind === "project" && e.date));
  const own = EVENTS.filter((e) => e.kind === "own");
  const ownList = (own.length ? own : []).concat(own.some((e) => e.id === "own-dz") ? [] : OWN_DEFAULT);
  return `<h1>Проєкти</h1><p class="sub">Проєкти, презентації й реферати з дедлайнами.</p>
    ${up.length ? up.map(evCard).join("") : emptyBox("rocket", "Проєктів поки немає", "Тут зʼявляться проєкти з дедлайнами")}
    ${past.length ? `<details class="ev-past"><summary>Завершені · ${past.length}</summary>${past.map(evCard).join("")}</details>` : ""}
    <h2 class="own-h">${ic("code")} Мої проєкти</h2>
    <div class="own-list">${ownList.map((e) => `<article class="own">
      <b>${esc(e.title)}</b>${e.text ? `<p>${linkify(e.text)}</p>` : ""}
      ${e.link ? `<a href="${esc(e.link)}" target="_blank" rel="noopener">${ic("link")} ${esc(e.link.replace(/^https?:\/\//, ""))}</a>` : ""}
      ${ADMIN_TOKEN && e.id !== "own-dz" ? `<button type="button" class="del" data-evdel="${esc(e.id)}" aria-label="Видалити">${ic("trash")}</button>` : ""}</article>`).join("")}</div>`;
}
// Найближчий тест (до 3 днів) — рядком на головній
function testsMini() {
  const t = today();
  const near = EVENTS.filter((e) => EV_TESTS.includes(e.kind) && e.date >= t && daysTo(e.date) <= 3 && !evDone(e))
    .sort((x, y) => x.date.localeCompare(y.date));
  if (!near.length) return "";
  const first = near[0];
  return `<a class="mini ev-mini" href="#/tests"><span class="mi">${ic("clip2")}</span><span class="mt"><b>${EV_KINDS[first.kind]} ${untilText(first.date)}</b> · ${esc(subj(first.tag).name)}${near.length > 1 ? ` і ще ${near.length - 1}` : ""}</span></a>`;
}
// адмін: форма
let EVF = { kind: "control" };
function eventForm() {
  const opts = ORDER.filter((t) => t !== "Укр").map((t) => `<option value="${t}">${esc(subj(t).name)}</option>`).join("");
  const kinds = Object.entries(EV_KINDS).map(([k, n]) => `<button type="button" data-evkind="${k}" aria-pressed="${EVF.kind === k}">${n}</button>`).join("");
  const own = EVF.kind === "own";
  const list = EVENTS.slice().sort((x, y) => (y.date || "").localeCompare(x.date || ""));
  return `<form id="evform" class="edit-form add-form">
    <div><div class="q">Що це</div><div class="seg seg-wrap">${kinds}</div></div>
    ${own ? "" : `<div class="row2"><label>Предмет<select name="tag" required><option value="">— вибери —</option>${opts}</select></label>
      <label>${EVF.kind === "project" ? "Дедлайн" : "Дата"}<input type="date" name="date" required></label></div>`}
    <label>${own ? "Назва" : "Тема / назва"}<input name="title" required maxlength="200" placeholder="${own ? "Мій бот для…" : "Квадратні рівняння"}"></label>
    <label>Опис<textarea name="text" rows="3" placeholder="${own ? "Що робить проєкт" : "Що повторити, вимоги…"}"></textarea></label>
    <label>Посилання${EVF.kind === "online" ? " на тест" : ""}<input name="link" type="url" placeholder="https://…"></label>
    ${EVF.kind === "project" ? `<label>Хто в групі<input name="members" maxlength="300" placeholder="Іваненко, Петренко…"></label>` : ""}
    <div class="edit-btns"><button type="submit">Додати</button></div>
    <p class="muted small-note">Бот і сам додає сюди ДЗ, де є «контрольна», «самостійна», «тест», «проєкт», «презентація», «реферат» або посилання на онлайн-тест. Класна керівниця може написати боту «контрольна з алгебри в пт».</p></form>
    <h2>Усі записи · ${list.length}</h2>${list.length ? list.map(evCard).join("") : `<div class="empty small">Поки порожньо.</div>`}`;
}

// ---------- акаунт через Telegram: синхронізація між пристроями ----------
const ACC = { token: (() => { try { return localStorage.getItem("dz-acc"); } catch { return null; } })(), name: null, updated: null,
  remind: null, timer: 0, login: null, loaded: false };
try { ACC.name = localStorage.getItem("dz-acc-name"); } catch { /* */ }
const accPost = (path, body = {}) => fetch(`api/${path}`, { method: "POST", headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ ...body, token: ACC.token }) }).then((r) => r.json());
const localData = () => ({ done: [...DONE], notes: NOTES, grades: GRADES, rem: REM, set: SET, pref: PREF });
function applyData(d) {
  const ls = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* */ } };
  if (Array.isArray(d.done)) { DONE = new Set(d.done.map(String)); ls(DONE_KEY, [...DONE]); }
  if (d.notes && typeof d.notes === "object") { NOTES = d.notes; ls("dz-notes", NOTES); }
  if (d.grades && typeof d.grades === "object") { GRADES = d.grades; ls("dz-grades", GRADES); }
  if (d.rem && typeof d.rem === "object") { REM = d.rem; ls("dz-rem", REM); }
  if (d.set && typeof d.set === "object") { SET = { ...SET_DEFAULT, ...d.set }; ls(SET_KEY, SET); applyTheme(); }
  if (d.pref && [1, 2].includes(d.pref.ukr)) { PREF = withGroup(d.pref); ls(PREF_KEY, PREF); }
  applyPref();
}
function queueSync() {
  if (!ACC.token) return;
  clearTimeout(ACC.timer);
  ACC.timer = setTimeout(pushSync, 1000);
}
// вийшов з адмін-режиму чи ГДЗ — акаунт більше не вмикає його сам
function dropRole(role) { if (ACC.token) accPost("me/drop-role", { role }).catch(() => {}); }
async function pushSync() {
  ACC.timer = 0;
  try {
    const j = await accPost("me/save", { data: localData() });
    if (j.ok) ACC.updated = j.updated; else if (j.relogin) accLogout(true);
  } catch { /* немає звʼязку — збережеться наступного разу */ }
}
// first — щойно увійшов: обʼєднати те, що вже є в браузері, з акаунтом
async function pullSync(first = false) {
  if (!ACC.token || ACC.timer) return;
  try {
    const j = await accPost("me", { want: { adm: !ADMIN_TOKEN, gdz: !GDZ_TOKEN } });
    if (!j.ok) { if (j.relogin) accLogout(true); return; }
    let modes = false;
    if (j.adm && !ADMIN_TOKEN) { setToken(j.adm); modes = true; }  // адмін-доступ, запамʼятаний в акаунті
    if (j.gtoken && !GDZ_TOKEN) { setGdz(j.gtoken, j.atoken || null); modes = true; }
    if (modes) safeRender();
    ACC.name = j.name; ACC.remind = j.remind; ACC.loaded = true;
    try { localStorage.setItem("dz-acc-name", j.name || ""); } catch { /* */ }
    const s = j.data || {};
    if (first) {
      const l = localData();
      applyData({ done: [...new Set([...(s.done || []), ...l.done])], notes: { ...(s.notes || {}), ...l.notes },
        grades: { ...l.grades, ...(s.grades || {}) }, rem: { ...(s.rem || {}), ...l.rem },
        set: s.set || l.set, pref: s.pref || l.pref });
      await pushSync();
      safeRender();
    } else if (j.updated && j.updated !== ACC.updated) {
      ACC.updated = j.updated;
      applyData(s);
      safeRender();
    }
  } catch { /* немає звʼязку */ }
}
async function accLogin() {
  const w = window.open("", "_blank"); // відкриваємо одразу, інакше браузер заблокує вікно
  try {
    const j = await fetch("api/auth/start", { method: "POST" }).then((r) => r.json());
    if (!j.ok) throw new Error(j.error || "Не вдалося");
    if (w) w.location = j.link; else location.href = j.link;
    ACC.login = { code: j.code, link: j.link, state: "new", until: Date.now() + 10 * 60000 };
    render();
    const poll = async () => {
      if (!ACC.login) return;
      if (Date.now() > ACC.login.until) { ACC.login = null; render(); return; }
      const c = await fetch(`api/auth/check?code=${encodeURIComponent(ACC.login.code)}`).then((r) => r.json()).catch(() => ({}));
      if (c.state === "ok" && c.token) {
        ACC.token = c.token; ACC.name = c.name; ACC.login = null;
        try { localStorage.setItem("dz-acc", c.token); localStorage.setItem("dz-acc-name", c.name || ""); } catch { /* */ }
        await pullSync(true);
        showToast(`${ic("check")} Привіт, ${esc(c.name || "")}! Синхронізацію увімкнено`);
        await loadClassLive(); render();
        return;
      }
      if (c.state === "expired") { ACC.login = null; render(); showToast("Час входу минув — спробуй ще раз"); return; }
      if (ACC.login && ACC.login.state !== c.state) { ACC.login.state = c.state; render(); }
      setTimeout(poll, 2000);
    };
    setTimeout(poll, 2000);
  } catch (e) { if (w) w.close(); showToast(esc(e.message)); }
}
function accLogout(expired = false) {
  if (ACC.token && !expired) accPost("me/logout").catch(() => {});
  ACC.token = null; ACC.name = null; ACC.updated = null; ACC.remind = null;
  try { localStorage.removeItem("dz-acc"); localStorage.removeItem("dz-acc-name"); } catch { /* */ }
  if (expired) showToast("Вхід застарів — увійди ще раз");
  safeRender();
}
async function accRemind(on, at) {
  const j = await accPost("me/remind", { on, at }).catch(() => ({}));
  if (j.ok) { ACC.remind = j.remind; render(); showToast(on ? `${ic("bell")} Нагадування о ${esc(j.remind.at)}` : "Нагадування вимкнено"); }
  else showToast(esc(j.error || "Не вдалося"));
}
// на головній: нагадування увійти (можна сховати на 14 днів)
function loginNudge() {
  if (ACC.token || ACC.login) return "";
  try { if (Date.now() < Number(localStorage.getItem("dz-nudge-hide") || 0)) return ""; } catch { /* */ }
  return `<section class="nudge"><span class="acc-ava">${ic("user")}</span><div class="acc-t"><b>Увійди через Telegram</b>
    <small>Галочки й нотатки на всіх пристроях, нагадування про своє ДЗ, імʼя в опитуваннях</small></div>
    <button type="button" class="nudge-x" data-nudge-hide aria-label="Сховати">${ic("x")}</button>
    <button type="button" class="acc-btn" data-acc-login>${ic("tg")} Увійти</button></section>`;
}
function accountCard() {
  if (ACC.login) {
    return `<section class="acc acc-wait"><span class="acc-ava">${ic("tg")}</span><div class="acc-t"><b>Підтверди вхід у Telegram</b>
      <small>${ACC.login.state === "need_name" ? "Бот чекає твоє імʼя та прізвище — напиши їх у чат." : "Відкрий бота й натисни «Start». Чекаю…"}</small></div>
      <a class="acc-btn" href="${esc(ACC.login.link)}" target="_blank" rel="noopener">${ic("tg")} Відкрити</a></section>`;
  }
  if (!ACC.token) {
    return `<section class="acc"><span class="acc-ava">${ic("user")}</span><div class="acc-t"><b>Акаунт</b>
      <small>Увійди через Telegram — галочки, нотатки, оцінки й налаштування будуть на всіх твоїх пристроях</small></div>
      <button type="button" class="acc-btn" data-acc-login>${ic("tg")} Увійти через Telegram</button></section>`;
  }
  const r = ACC.remind;
  return `<section class="acc on"><span class="acc-ava">${esc((ACC.name || "?").trim()[0] || "?")}</span><div class="acc-t"><b>${esc(ACC.name || "…")}</b>
      <small>${ic("sync")} Синхронізується між пристроями</small></div>
      <button type="button" class="acc-btn ghost" data-acc-logout>Вийти</button>
    <div class="acc-rem"><span><b>${ic("bell")} Нагадування в Telegram</b><small>${r ? `Щовечора о ${esc(r.at)} — лише твоє невиконане ДЗ` : "Вимкнено"}</small></span>
      <input type="time" id="acc-rem-at" value="${esc((r && r.at) || "19:00")}" aria-label="Час нагадування">
      <button type="button" class="switch" role="switch" aria-checked="${!!r}" aria-label="Нагадування" data-acc-rem></button></div></section>`;
}

// ---------- нотатки для всього класу (з акаунтом; ШІ перевіряє, що це про ДЗ) ----------
let COMMENTS = {}, CM_OPEN = null, CM_BUSY = false;
function commentsHtml(e) {
  const id = String(e.id), list = COMMENTS[id] || [];
  if (e.alert) return "";
  const items = list.map((c) => `<li><b>${esc(c.name)}</b> ${linkify(c.text)}<span class="cm-at">${short(c.at.slice(0, 10))} ${c.at.slice(11, 16)}</span>
    ${c.mine || ADMIN_TOKEN ? `<button type="button" class="cm-del" data-cdel="${esc(c.id)}" aria-label="Видалити нотатку">${ic("x")}</button>` : ""}</li>`).join("");
  const form = CM_OPEN === id ? `<form class="cm-form" data-chw="${esc(id)}"><input name="t" maxlength="400" required placeholder="Напр.: у №247 помилка у відповіді підручника" ${CM_BUSY ? "disabled" : ""}>
      <button type="submit" ${CM_BUSY ? "disabled" : ""}>${CM_BUSY ? "ШІ перевіряє…" : "Додати"}</button></form>
      <p class="cm-hint">Бачать усі. ШІ пропускає лише те, що стосується ДЗ. Не частіше ніж раз на 30 хв.</p>` : "";
  const add = CM_OPEN === id ? "" : ACC.token
    ? `<button type="button" class="link-btn cm-add" data-cadd="${esc(id)}">${ic("chat")} Нотатка для класу</button>` : "";
  return items || form || add ? `<div class="cmts">${items ? `<ul>${items}</ul>` : ""}${form}${add}</div>` : "";
}
async function loadComments() {
  const j = await fetch(`data/comments.json?t=${Date.now()}`, { cache: "no-store", headers: ACC.token ? { "X-Session": ACC.token } : {} })
    .then((r) => (r.ok ? r.json() : null)).catch(() => null);
  if (j && typeof j === "object") COMMENTS = j;
}

// ---------- нотатки до ДЗ (лише в цьому браузері) ----------
let NOTES = (() => { try { return JSON.parse(localStorage.getItem("dz-notes")) || {}; } catch { return {}; } })();
let NOTE_EDIT = null;
const saveNotes = () => { try { localStorage.setItem("dz-notes", JSON.stringify(NOTES)); } catch { /* */ } queueSync(); };
function noteHtml(e) {
  const id = String(e.id), n = NOTES[id];
  if (NOTE_EDIT === id) return `<form class="note-form" data-noteid="${esc(id)}"><textarea name="note" rows="2" maxlength="500" placeholder="Твоя нотатка: «спитати в Петра», «зроблено наполовину»…">${esc(n || "")}</textarea>
    <div class="note-btns"><button type="submit">Зберегти</button><button type="button" data-note-cancel>Скасувати</button>${n ? `<button type="button" data-note-del="${esc(id)}">Видалити</button>` : ""}</div></form>`;
  return n ? `<button type="button" class="note" data-note="${esc(id)}">${ic("note")}<span>${esc(n)}</span></button>` : "";
}

// ---------- оцінки й середній бал (лише в цьому браузері) ----------
let GRADES = (() => { try { return JSON.parse(localStorage.getItem("dz-grades")) || {}; } catch { return {}; } })();
let GRADE_TAG = "";
const saveGrades = () => { try { localStorage.setItem("dz-grades", JSON.stringify(GRADES)); } catch { /* */ } queueSync(); };
const avgOf = (l) => l.reduce((s, x) => s + x, 0) / l.length;
// Що треба, щоб середнє (округлене) стало на 1 вище
function gradeHint(list) {
  const n = list.length, sum = list.reduce((s, x) => s + x, 0), now = Math.round(sum / n);
  if (now >= 12) return "Максимум — так тримати!";
  const goal = now + 1, need = (goal - 0.5) * (n + 1) - sum;
  if (need <= 12) return `Щоб вийшло ${goal}: отримай ${Math.max(1, Math.ceil(need))} або більше`;
  const k = Math.ceil(((goal - 0.5) * n - sum) / (12 - (goal - 0.5)));
  return `Щоб вийшло ${goal}: потрібно ще ${k} × 12`;
}
function gradesPage() {
  const tags = ORDER.filter((t) => t !== "Укр");
  const opts = tags.map((t) => `<option value="${t}"${t === GRADE_TAG ? " selected" : ""}>${esc(subj(t).name)}</option>`).join("");
  const withG = tags.filter((t) => (GRADES[t] || []).length);
  const all = withG.map((t) => avgOf(GRADES[t]));
  const total = all.length ? avgOf(all) : null;
  return `<h1>Оцінки</h1><p class="sub">Записуй свої оцінки — сайт порахує середній бал. Бачиш їх лише ти, у цьому браузері.</p>
    <form id="gradeform" class="grade-form">
      <select name="tag" required aria-label="Предмет"><option value="">Предмет…</option>${opts}</select>
      <input name="g" type="number" min="1" max="12" step="1" inputmode="numeric" placeholder="1–12" required aria-label="Оцінка">
      <button type="submit">${ic("plus")} Додати</button></form>
    ${total !== null ? `<div class="g-total"><span>Середній бал</span><b>${total.toFixed(2)}</b><small>за ${withG.length} ${withG.length === 1 ? "предметом" : "предметами"}</small></div>` : emptyBox("medal", "Оцінок ще немає", "Вибери предмет і додай першу оцінку")}
    ${withG.map((t) => { const l = GRADES[t], av = avgOf(l);
      return `<section class="g-card" style="--c:${subj(t).color}"><div class="g-h"><b>${esc(subj(t).name)}</b><span class="g-avg">${av.toFixed(1)}<small>≈ ${Math.round(av)}</small></span></div>
        <div class="g-chips">${l.map((g, i) => `<button type="button" class="g-chip g${g >= 10 ? "hi" : g >= 7 ? "mid" : g >= 4 ? "lo" : "bad"}" data-gdel="${t}:${i}" aria-label="Оцінка ${g}, натисни щоб видалити">${g}</button>`).join("")}</div>
        <p class="g-hint">${gradeHint(l)}</p></section>`; }).join("")}
    ${withG.length ? `<p class="muted small-note">Натисни на оцінку, щоб її видалити. Округлення — до найближчого цілого.</p>` : ""}`;
}

// ---------- до канікул ----------
function nextBreak() {
  const t = today(), blocks = [];
  const onlyWeekend = (x, y) => { for (let d = addDays(parse(x), 1); iso(d) < y; d = addDays(d, 1)) if (![0, 6].includes(d.getDay())) return false; return true; };
  for (const s of [...SCHOOL.holidays].sort()) {
    const b = blocks[blocks.length - 1];
    if (b && onlyWeekend(b.end, s)) { b.end = s; b.n++; } else blocks.push({ start: s, end: s, n: 1 });
  }
  // канікули — щонайменше 3 навчальні дні поспіль; окремі свята не рахуємо
  const b = blocks.find((x) => x.n >= 3 && x.end >= t);
  return b ? { ...b, days: daysTo(b.start) } : null;
}
function breakLine(maxDays) {
  const b = nextBreak();
  if (!b || b.days > maxDays) return "";
  const text = b.days <= 0 ? `Канікули до ${short(b.end)}!` : `До канікул ${b.days} ${b.days % 10 === 1 && b.days % 100 !== 11 ? "день" : [2, 3, 4].includes(b.days % 10) && ![12, 13, 14].includes(b.days % 100) ? "дні" : "днів"}`;
  return `<div class="break-line">${ic("palm")}<span><b>${text}</b>${b.days > 0 ? ` · з ${short(b.start)}` : ""}</span></div>`;
}

// ---------- навантаження тижня (календар) ----------
function weekLoad(sel) {
  const mon = addDays(parse(sel), -((parse(sel).getDay() + 6) % 7));
  const due = byDue();
  const days = [0, 1, 2, 3, 4].map((i) => {
    const s = iso(addDays(mon, i));
    const hw = (due[s] || []).filter((e) => !e.alert && isMine(e));
    const ts = EVENTS.filter((e) => e.date === s && EV_TESTS.includes(e.kind));
    return { s, hw, ts, n: hw.length + ts.length };
  });
  const max = Math.max(3, ...days.map((d) => d.n));
  return `<section class="load"><h3>${ic("chart")} Навантаження тижня</h3><div class="load-bars">${days.map((d) => `
    <button type="button" class="load-col${d.s === sel ? " sel" : ""}${d.s === today() ? " today" : ""}" data-day="${d.s}" aria-label="${longDay(d.s)}: ДЗ ${d.hw.length}, тестів ${d.ts.length}">
      <span class="load-n">${d.n || ""}</span>
      <span class="load-bar" style="height:${Math.round((d.n / max) * 100)}%">${d.ts.map(() => `<i class="lt"></i>`).join("")}${sortSubj(d.hw).map((e) => `<i style="--c:${subj(e.tag).color}"></i>`).join("")}</span>
      <span class="load-d">${WD_SHORT[(parse(d.s).getDay() + 6) % 7]}</span></button>`).join("")}</div>
    <p class="legend">Кольорові частинки — ДЗ за предметами, червоні — тести й контрольні.</p></section>`;
}

// ---------- опитування ----------
const DEVICE = (() => {
  try {
    let d = localStorage.getItem("dz-dev");
    if (!d) { d = Array.from(crypto.getRandomValues(new Uint8Array(12)), (b) => b.toString(16).padStart(2, "0")).join(""); localStorage.setItem("dz-dev", d); }
    return d;
  } catch { return "anon-" + Math.random().toString(16).slice(2, 14); }
})();
let POLLS = [];
const VOTERS = {};
function votersHtml(v) {
  return `<div class="voters">${v.options.map((o) => `<div class="vo"><b>${esc(o.option)}</b>
    ${o.names.length ? `<div class="vo-names">${o.names.map((n) => `<span>${esc(n)}</span>`).join("")}</div>` : ""}
    <small>${[o.names.length ? "" : (o.anon || o.tg ? "" : "ніхто"), o.anon ? `без акаунта: ${o.anon}` : "", o.tg ? `у Telegram: ${o.tg} (анонімно)` : ""].filter(Boolean).join(" · ")}</small></div>`).join("")}</div>`;
}
function pollCard(p, admin = false) {
  const voted = p.mine !== null && p.mine !== undefined, show = voted || p.closed || admin;
  return `<section class="poll${p.closed ? " closed" : ""}"><div class="poll-h">${ic("poll")}<b>${esc(p.question)}</b></div>
    <div class="poll-opts">${p.options.map((o, i) => { const c = p.counts[i] || 0, pct = p.total ? Math.round((100 * c) / p.total) : 0;
      return `<button type="button" class="poll-o${p.mine === i ? " mine" : ""}" data-vote="${esc(p.id)}:${i}"${p.closed || admin ? " disabled" : ""} style="--p:${show ? pct : 0}%">
        <span class="po-t">${p.mine === i ? ic("check") : ""}${esc(o)}</span>${show ? `<span class="po-n">${pct}% · ${c}</span>` : ""}</button>`; }).join("")}</div>
    ${VOTERS[p.id] ? votersHtml(VOTERS[p.id]) : ""}
    <p class="poll-f">${p.closed ? "Опитування закрите · " : ""}${p.total} ${p.total % 10 === 1 && p.total % 100 !== 11 ? "голос" : [2, 3, 4].includes(p.total % 10) && ![12, 13, 14].includes(p.total % 100) ? "голоси" : "голосів"}${p.in_tg ? " · разом із Telegram" : ""}${voted && !p.closed && !admin ? " · натисни ще раз, щоб скасувати" : ""}
      ${p.total ? ` · <button type="button" class="link-btn" data-voters="${esc(p.id)}">${VOTERS[p.id] ? "Сховати" : "Хто голосував"}</button>` : ""}
      ${!ACC.token && !admin && !p.closed ? `<br>Голос з акаунтом видно з іменем — <button type="button" class="link-btn" data-acc-login>увійти</button>` : ""}</p>
    ${admin ? `<div class="poll-adm">${p.closed ? "" : `<button type="button" data-pclose="${esc(p.id)}">Закрити</button>`}<button type="button" data-pdel="${esc(p.id)}">${ic("trash")} Видалити</button></div>` : ""}</section>`;
}
// на головній: відкриті опитування й закриті за останні 3 дні
const homePolls = () => POLLS.filter((p) => !p.closed || (p.created && daysTo(p.created.slice(0, 10)) >= -3)).slice(0, 3).map((p) => pollCard(p)).join("");
async function sendVote(id, idx) {
  const p = POLLS.find((x) => x.id === id);
  const option = p && p.mine === idx ? null : idx;
  try {
    const r = await fetch("api/poll/vote", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, option, device: DEVICE, token: ACC.token }) });
    const j = await r.json();
    if (!j.ok) throw new Error(j.error || "Не вдалося");
    POLLS = POLLS.map((x) => (x.id === id ? j.poll : x));
    render();
  } catch (e) { showToast(esc(e.message)); }
}
function pollAdmin() {
  return `<section class="adm-sec"><h2>Нове опитування</h2><form id="pollform" class="edit-form add-form">
      <label>Питання<input name="question" required maxlength="300" placeholder="Хто йде на екскурсію в пʼятницю?"></label>
      <label>Варіанти (кожен з нового рядка)<textarea name="options" rows="4" required placeholder="Так\nНі\nЩе не знаю"></textarea></label>
      <label class="chk"><input type="checkbox" name="channel" checked> Також у Telegram-канал (голоси додаються)</label>
      <div class="edit-btns"><button type="submit">Створити</button></div>
      <p class="muted small-note">Класна керівниця теж може: написати боту «опитування: хто йде на екскурсію? так / ні».</p></form></section>
    <h2>Усі опитування · ${POLLS.length}</h2>${POLLS.length ? POLLS.map((p) => pollCard(p, true)).join("") : `<div class="empty small">Поки немає.</div>`}`;
}

// ---------- пошук ДЗ ----------
let SEARCH_Q = "";
const normQ = (s) => s.toLowerCase().replace(/ё/g, "е").replace(/параграф\w*|пар\.\s*/g, "§").replace(/номер\w*|впр\w*\.?/g, "№")
  .replace(/([§№])\s*/g, "$1").replace(/[ʼ'’]/g, "");
function searchResults(q) {
  const words = normQ(q).split(/\s+/).filter(Boolean);
  if (!words.length) return "";
  const hits = ALL.filter((e) => !e.alert).filter((e) => {
    const hay = normQ(`${subj(e.tag).name} ${e.tag} ${e.homework || ""} ${short(e.given || "")} ${e.due ? short(e.due) : ""}`);
    return words.every((w) => hay.includes(w));
  }).sort((x, y) => (y.given || "").localeCompare(x.given || ""));
  if (!hits.length) return emptyBox("search", "Нічого не знайдено", "Спробуй інше слово або номер вправи");
  return `<p class="sub">Знайдено: ${hits.length}${hits.length > 40 ? " (показано 40)" : ""}</p>${hits.slice(0, 40).map((e) => card(e)).join("")}`;
}

function subjects() {
  const count = {};
  for (const e of ALL) if (!e.alert) count[e.tag] = (count[e.tag] || 0) + 1;
  const tile = (t) => {
    const s = subj(t);
    const k = tagsOf(t).reduce((n, x) => n + (count[x] || 0), 0);
    if (t === "Укр" && !k) return "";
    const book = bookList(t).length ? `<i class="tile-book" title="Є підручник">${ic("book")}</i>` : "";
    return `<a class="tile${k ? "" : " none"}" style="--c:${s.color}" href="#/s/${encodeURIComponent(t)}">
      <b>${esc(s.name)}</b><span>${k ? `${k} ${plural(k)}` : "ДЗ поки немає"}${book}</span></a>`;
  };
  const groups = GROUPS.map(([name, , tags]) =>
    `<h2 class="group">${esc(name)}</h2><div class="tiles">${tags.map(tile).join("")}</div>`).join("");
  return `<h1>Предмети</h1><p class="sub">Розклад, підручник і всі ДЗ предмета.</p>
    <label class="search">${ic("search")}<input type="search" id="hw-q" placeholder="Пошук ДЗ: «245», «§ 5», «реферат»…" value="${esc(SEARCH_Q)}" autocomplete="off"></label>
    <div id="hw-res">${searchResults(SEARCH_Q)}</div>${SEARCH_Q.trim() ? "" : groups}`;
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
  return `<a class="back" href="#/s">${ic("chevL")} Предмети</a>
    <h1 style="color:${s.color}">${esc(s.name)}</h1>
    <p class="sub">Вчитель: ${esc(teacher(tag))}${extra.length ? ` · + ${extra.map((x) => esc(subj(x).name)).join(", ")}` : ""}</p>
    <div class="subj-info">
      <section><h3>Найближчі уроки</h3>${upHtml}</section>
      <section><h3>Підручник</h3>${bks.length
        ? bks.map((b) => `<a class="btn-book" href="${bookUrl(b.slug)}" target="_blank" rel="noopener"><i class="ic">${ic("book")}</i>${esc(b.title || "Відкрити підручник")}</a>`).join("")
        : `<p class="muted">Підручника поки немає.</p>`}
        ${files.length ? `<h3>Файли</h3>${fileList(files)}` : ""}
        <a class="konsp-hint" href="https://t.me/HWeightDai" target="_blank" rel="noopener">${ic("note")}<span>Маєш гарний конспект? Надішли фото боту <b>@HWeightDai</b> — після перевірки він зʼявиться тут.</span></a>
        ${ADMIN_TOKEN ? `<form class="upform" id="upform" data-tag="${esc(tag)}">
          <h3>${ic("plus")} Додати фото або файл</h3>
          <input type="file" name="f" required aria-label="Файл">
          <input type="text" name="title" placeholder="Назва (необовʼязково)" maxlength="150" aria-label="Назва">
          <button type="submit">Додати</button>
          <p class="muted small-note">До 25 МБ. Зʼявиться тут і у «Файлах» з датою додавання.</p></form>` : ""}</section>
    </div>
    ${(() => {
      if (!list.length) return `<h2>ДЗ</h2><div class="empty">З цього предмета ще нічого не задавали.</div>`;
      const open = list.filter((e) => e.alert || !isDone(e)), done = list.filter((e) => !e.alert && isDone(e));
      const cards = (l) => l.map((e) => card(e, { showSubj: e.tag !== tag })).join("");
      if (SET.subjDoneOnly) return `<h2>Виконані <span class="muted">· ${done.length}</span></h2>${done.length ? cards(done) : `<div class="empty small">Ще нічого не позначено.</div>`}
        <p class="muted small-note">Показано лише виконане — це змінюється в ${ic("gear")} Налаштуваннях.</p>`;
      return `<h2>Невиконані <span class="muted">· ${open.length}</span></h2>${open.length ? cards(open) : `<div class="empty small">${ic("okc")} Усе виконано</div>`}
        <h2>Виконані <span class="muted">· ${done.length}</span></h2>${done.length ? cards(done) : `<div class="empty small">Ще нічого не позначено.</div>`}`;
    })()}`;
}

const isImg = (name) => /\.(jpe?g|png|webp|gif|heic)$/i.test(name || "");
function fileList(files) {
  return `<ul class="files">${files.map((f) => {
    const img = isImg(f.path) && !/\.heic$/i.test(f.path);
    const added = `додано ${short(f.added.slice(0, 10))}${f.added.length > 15 ? ` о ${f.added.slice(11, 16)}` : ""}`;
    const del = ADMIN_TOKEN ? `<button type="button" class="file-del" data-fdel="${esc(f.id)}" aria-label="Видалити файл">${ic("trash")}</button>` : "";
    return `<li class="${img ? "has-thumb" : ""}">${img ? `<button type="button" class="thumb" data-img="${esc(f.path)}" aria-label="Відкрити фото"><img src="${esc(f.path)}" loading="lazy" alt=""></button>` : ""}
      <a href="${esc(f.path)}" target="_blank" rel="noopener" download="${esc(f.name)}">
      <b>${esc(f.title || f.name)}</b><span>${esc(subj(f.tag).name)} · ${added} · ${sizeStr(f.size)}</span></a>${del}</li>`;
  }).join("")}</ul>`;
}

let BOOK_Q = "", BOOK_RES = null, BOOK_T = 0;
function bookResults() {
  if (BOOK_RES === null) return "";
  if (BOOK_RES === "loading") return `<p class="muted">Шукаю…</p>`;
  if (!BOOK_RES.length) return emptyBox("search", "Нічого не знайдено", "Спробуй інші слова");
  return `<ul class="book-hits">${BOOK_RES.map((r) => `<li><a href="${bookUrl(r.slug, r.pdf_page)}" target="_blank" rel="noopener" style="--c:${subj(r.tag).color}">
    <b>${esc(subj(r.tag).name)}${r.title ? ` · ${esc(r.title)}` : ""}<span>${r.page ? `с. ${r.page}` : `стор. PDF ${r.pdf_page}`} ${ic("ext")}</span></b>
    <small>…${esc(r.snippet)}…</small></a></li>`).join("")}</ul>`;
}
function bookSearch(q) {
  BOOK_Q = q;
  clearTimeout(BOOK_T);
  const box = () => document.getElementById("book-res");
  if (q.trim().length < 3) { BOOK_RES = null; if (box()) box().innerHTML = ""; return; }
  BOOK_T = setTimeout(async () => {
    BOOK_RES = "loading"; if (box()) box().innerHTML = bookResults();
    const j = await fetch(`api/books/search?q=${encodeURIComponent(q)}`).then((r) => r.json()).catch(() => ({ results: [] }));
    if (BOOK_Q !== q) return;
    BOOK_RES = j.results || [];
    if (box()) box().innerHTML = bookResults();
  }, 350);
}
function filesPage() {
  const books = sortSubj(SUBJECTS.map(([t, n, c]) => ({ tag: t, n, c }))).map(({ tag, n, c }) => [tag, n, c])
    .flatMap(([t, n, c]) => bookList(t).map((b) =>
    `<li><a href="${bookUrl(b.slug)}" target="_blank" rel="noopener" style="--c:${c}"><b><i class="ic">${ic("book")}</i>${esc(n)}</b><span>${b.title ? `${esc(b.title)} · ` : ""}PDF · відкрити</span></a></li>`)).join("");
  const teach = [...FILES].sort((a, b) => b.added.localeCompare(a.added));
  return `<h1>Файли</h1><p class="sub">Підручники й файли від учителів.</p>
    <h2>Від учителів</h2>${teach.length ? fileList(teach) : `<div class="empty small">Поки нічого немає.</div>`}
    <h2>Пошук у підручниках</h2>
    <label class="search">${ic("search")}<input type="search" id="book-q" placeholder="«теорема Піфагора», «квадратне рівняння»…" value="${esc(BOOK_Q)}" autocomplete="off"></label>
    <div id="book-res">${bookResults()}</div>
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
  if (!ADMIN_TOKEN) return lockForm("lock", "Адмінпанель", GDZ_TOKEN
    ? `Зараз увімкнено АвтоГДЗ${AI_TOKEN ? " + ШІ" : ""}. Тут можна ввести інший пароль.`
    : "Введи пароль.");
  if (!ADM.data) { loadAdmin(); return `<h1>Адмінпанель</h1><p class="muted pad">Завантаження…</p>`; }
  if (ADM.data.error) return `<h1>Адмінпанель</h1><div class="empty">${esc(ADM.data.error)}</div>`;
  const tabs = [["add", "plus", "Додати ДЗ", ""], ["events", "clip2", "Тести й проєкти", EVENTS.length || ""],
    ["visitors", "users", "Відвідувачі", ADM.data.visitors.length || ""],
    ["stats", "chart", "Статистика", ""], ["accounts", "user", "Акаунти", ADM.accounts ? ADM.accounts.length : ""], ["polls", "poll", "Опитування", POLLS.filter((p) => !p.closed).length || ""], ["deleted", "trash", "Кошик", ADM.data.deleted.length || ""], ["site", "gear", "Сайт", ""]];
  const sub = `<nav class="adm-nav" role="tablist" aria-label="Розділи адмінпанелі">${tabs.map(([k, i, t, n]) =>
    `<button type="button" role="tab" data-atab="${k}" aria-selected="${ADM.tab === k}">${ic(i)}<span>${t}</span>${n !== "" ? `<em>${n}</em>` : ""}</button>`).join("")}</nav>`;
  const sec = (title, inner, cls = "") => `<section class="adm-sec ${cls}">${title ? `<h2>${title}</h2>` : ""}${inner}</section>`;
  let body = "";
  const D = ADM.data;
  if (ADM.tab === "add") {
    body = sec("Нове ДЗ", addForm());
  } else if (ADM.tab === "stats") {
    if (!ADM.stats) {
      adminApi("stats").then((j) => { ADM.stats = j; render(); }).catch((e) => alert(e.message));
      body = `<p class="muted pad">Завантаження…</p>`;
    } else {
      const S = ADM.stats, mx = Math.max(1, ...S.daily.map((d) => d.visitors)), tm = Math.max(1, ...S.tabs.map((t) => t[1]));
      const TABN = { home: "Головна", cal: "Календар", week: "Розклад", subj: "Предмети", done: "Виконане", debts: "Борги", tests: "Тести",
        projects: "Проєкти", grades: "Оцінки", visits: "Відвідування", alerts: "Тривоги", files: "Файли", seats: "Розсадка", bdays: "Дні народження",
        info: "Інфо", settings: "Налаштування", admin: "Адмінпанель", secret: "АвтоГДЗ" };
      body = `<div class="st-kpi"><div><b>${S.today.visitors}</b><span>сьогодні</span></div><div><b>${S.week_visitors}</b><span>за 7 днів</span></div>
          <div><b>${S.accounts_total}</b><span>акаунтів</span></div><div><b>${S.week_accounts}</b><span>з акаунтом за 7 днів</span></div></div>`
        + sec("Відвідувачі за 14 днів", `<div class="st-bars">${S.daily.map((d) => `<div class="st-col" title="${short(d.day)}: ${d.visitors} (з акаунтом ${d.accounts})">
            <span class="st-n">${d.visitors || ""}</span><span class="st-bar" style="height:${Math.round((d.visitors / mx) * 100)}%"><i style="height:${d.visitors ? Math.round((d.accounts / d.visitors) * 100) : 0}%"></i></span>
            <span class="st-d">${parse(d.day).getDate()}</span></div>`).join("")}</div>
            <p class="legend">Темніша частина — люди з акаунтом. Унікальні відвідувачі (за пристроєм).</p>`)
        + sec("Популярні розділи · 7 днів", S.tabs.length ? `<ul class="st-tabs">${S.tabs.map(([t, n]) => `<li><span>${esc(TABN[t] || t)}</span>
            <i style="width:${Math.round((n / tm) * 100)}%"></i><b>${n}</b></li>`).join("")}</ul>` : `<p class="muted">Ще немає даних.</p>`)
        + `<p class="muted small-note"><button type="button" class="link-btn" data-stats-reload>Оновити</button></p>`;
    }
  } else if (ADM.tab === "accounts") {
    if (!ADM.accounts) {
      adminApi("accounts").then((j) => { ADM.accounts = j.list; render(); }).catch((e) => alert(e.message));
      body = `<p class="muted pad">Завантаження…</p>`;
    } else {
      body = sec(`Акаунти учнів · ${ADM.accounts.length}`, ADM.accounts.length ? `<ul class="iplist">${ADM.accounts.map((x) => `<li><div><b>${esc(x.name || "без імені")}</b>
        <span>${x.username ? "@" + esc(x.username) + " · " : ""}з ${fmtTime(x.created)} · був ${fmtTime(x.seen)} · виконано ${x.done}</span></div>
        <button type="button" data-accdel="${esc(x.tg)}">Видалити</button></li>`).join("")}</ul>` : `<p class="muted">Ще ніхто не увійшов.</p>`)
        + `<p class="muted small-note">Учні входять у ${ic("gear")} Налаштуваннях: «Увійти через Telegram» — бот питає імʼя та прізвище.</p>`;
    }
  } else if (ADM.tab === "polls") {
    body = pollAdmin();
  } else if (ADM.tab === "events") {
    const f = eventForm(), cut = f.indexOf("<h2>Усі записи");
    body = sec("Новий тест або проєкт", f.slice(0, cut)) + f.slice(cut);
  } else if (ADM.tab === "visitors") {
    const bl = new Set(D.blocked.map((b) => b.ip));
    body = sec("Заблоковані", `${D.blocked.length ? `<ul class="iplist">${D.blocked.map((b) => `<li><div><b>${esc(b.ip)}</b><span>${esc(b.note || "")} · з ${fmtTime(b.when)}</span></div>
        <button type="button" data-unblock="${esc(b.ip)}">Розблокувати</button></li>`).join("")}</ul>` : `<p class="muted">Нікого не заблоковано.</p>`}
      <form id="blockform" class="blockform"><input id="bf-ip" placeholder="IP-адреса" aria-label="IP-адреса" required><input id="bf-note" placeholder="Примітка (необовʼязково)" aria-label="Примітка"><button type="submit">Заблокувати</button></form>`)
      + sec("Останні відвідувачі", `<p class="muted small-note">Твоя IP: <b>${esc(D.you)}</b> — її заблокувати не можна.</p>
      <ul class="iplist">${D.visitors.map((v) => `<li class="${bl.has(v.ip) ? "is-blocked" : ""}"><div><b>${esc(v.ip)}${v.ip === D.you ? " (ти)" : ""}</b>
        <span>${fmtTime(v.last)} · ${v.hits} запит. · ${esc(shortUa(v.ua || ""))}</span></div>
        ${bl.has(v.ip) ? `<em>заблоковано</em>` : v.ip === D.you ? "" : `<button type="button" data-block="${esc(v.ip)}">Заблокувати</button>`}</li>`).join("") || `<li class="muted">Поки нікого.</li>`}</ul>`);
  } else if (ADM.tab === "deleted") {
    const list = [...D.deleted].reverse();
    body = list.length ? list.map((e) => `<article class="card trash" style="--c:${subj(e.tag).color}">
        <div class="head"><b class="subj">${esc(subj(e.tag).name)}</b><span class="dates">видалено ${fmtTime(e.deleted_at)}</span></div>
        <p class="hw">${linkify(e.homework)}</p><p class="muted small-note">задано ${short(e.given)}${e.due ? ` <span class="arr">${ic("arrow")}</span> здати ${short(e.due)}` : ""}</p>
        <button type="button" class="restore" data-restore="${esc(e.id)}">${ic("undo")} Повернути на сайт</button></article>`).join("")
      : emptyBox("trash", "Кошик порожній", "Видалені ДЗ зʼявляться тут — їх можна повернути");
  } else {
    const soon = (SCHOOL.short_days || []).filter((d) => d >= today());
    body = sec(`${ic("timer")} Скорочені уроки`, `
      <form id="shortform" class="blockform"><input type="date" id="sf-day" value="${today()}" aria-label="День" required>
        <button type="submit" data-on="1">${ic("timer")} Увімкнути</button><button type="submit" data-on="0">Вимкнути</button></form>
      <p class="muted small-note">${soon.length ? "Скорочені дні: " + soon.map((d) => `${WD_TINY[parse(d).getDay()]} ${short(d)}`).join(", ") : "Скорочених днів не заплановано."}
        З Telegram: /short, /short 12.11, /short off 12.11.</p>`)
      + sec(`${ic("bot")} ШІ-прогноз тривог: канали`, `
      <form id="chanform" class="chan-form"><textarea id="chan-list" aria-label="Канали" placeholder="kpszsu\nwar_monitor">${esc((AIA.channels || []).join("\n"))}</textarea>
        <button type="submit" class="set-btn">Зберегти канали</button></form>
      <p class="muted small-note">По одному на рядок: @назва або посилання t.me/назва. Лише відкриті канали (з веб-версією t.me/s/назва).</p>`)
      + sec(`${ic("refresh")} Перезапуск`, `
      <p class="muted">Перезапуск займає ~5–10 секунд: сайт сам перезавантажить сторінку, коли знову запрацює.</p>
      <button type="button" class="btn-danger" data-restart>${ic("refresh")} Перезапустити сайт</button>
      <p class="muted small-note">Те саме з Telegram: /restartsite. Ще є /stopsite, /startsite, /restartbot, /fullrestart.</p>`, "danger");
  }
  return `<header class="adm-head">
      <span class="adm-badge">${ic("shield")}</span>
      <div class="adm-title"><h1>Адмінпанель</h1><p>На картках ДЗ є ${ic("pen")} і ${ic("trash")} · довідка в «Інфо»</p></div>
      <div class="adm-acts"><button type="button" class="adm-gdz${GDZ_TOKEN ? " on" : ""}" data-admgdz aria-pressed="${!!GDZ_TOKEN}">${GDZ_TOKEN ? ic("check") : ic("bulb")} ГДЗ</button>
        <button type="button" class="adm-out" data-lockout aria-label="Вийти з адмін-режиму">${ic("x")}<span>Вийти</span></button></div>
    </header>${sub}<div class="admin-body">${body}</div>`;
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
  return `<h1>Розсадка</h1><div class="seats-warn">${ic("warn")} Місця не збігаються з реальністю — це тільки схема, хто з ким сидить.</div><p class="sub">${cols} стовпчики × ${rows} рядів, парти по двоє.</p>
    <div class="board">Дошка</div>
    <div class="seats" style="--cols:${cols}">${grid}</div>
    <h2>Хто з ким сидить</h2><table class="pairs"><thead><tr><th>Учень</th><th>Сидить з</th></tr></thead><tbody>${table}</tbody></table>
`;
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
  const lines = weekendBdays().concat(soon.map((b) => `<b>${cap(bdayWhen(b.days))}</b> ДН у ${esc(b.who)}`));
  return lines.length ? `<a class="mini bday-w" href="#/bdays"><span class="mi">${ic("cake")}</span><span class="mt">${lines.join(" · ")}</span></a>` : "";
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
      if (m === md) out.push(`На ${d.getDay() === 0 || d.getDay() === 6 ? "вихідних" : "канікулах"} (${WD_TINY[d.getDay()]}, ${short(s)}) було ДН у ${esc(who)}`);
    }
  }
  return out.reverse();
}

// ---------- відповідь ШІ: Markdown + формули (KaTeX, завантажується лише коли треба) ----------
let KATEX = null;
function loadKatex() {
  if (window.katex) return Promise.resolve();
  if (!KATEX) {
    KATEX = new Promise((ok, fail) => {
      const css = document.createElement("link"); css.rel = "stylesheet"; css.href = "vendor/katex/katex.min.css"; document.head.appendChild(css);
      const js = document.createElement("script"); js.src = "vendor/katex/katex.min.js"; js.onload = ok; js.onerror = fail; document.head.appendChild(js);
    });
  }
  return KATEX;
}
function texToHtml(tex, display) {
  if (!window.katex) { loadKatex().then(() => GDZ.open && renderModal()).catch(() => {}); return `<code>${esc(tex)}</code>`; }
  try { return window.katex.renderToString(tex, { displayMode: display, throwOnError: false, strict: "ignore" }); }
  catch { return `<code>${esc(tex)}</code>`; }
}
function mdMath(src) {
  const parts = [];
  // формули вирізаємо до екранування, щоб не зіпсувати \frac, < і т. д.
  let t = String(src || "").replace(/\$\$([\s\S]+?)\$\$/g, (_, x) => { parts.push(texToHtml(x.trim(), true)); return `\u0000${parts.length - 1}\u0000`; })
    .replace(/\\\[([\s\S]+?)\\\]/g, (_, x) => { parts.push(texToHtml(x.trim(), true)); return `\u0000${parts.length - 1}\u0000`; })
    .replace(/\$([^$\n]+?)\$/g, (_, x) => { parts.push(texToHtml(x.trim(), false)); return `\u0000${parts.length - 1}\u0000`; })
    .replace(/\\\(([\s\S]+?)\\\)/g, (_, x) => { parts.push(texToHtml(x.trim(), false)); return `\u0000${parts.length - 1}\u0000`; });
  t = esc(t).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
  const html = t.split(/\n{2,}/).map((block) => {
    const lines = block.split("\n");
    if (lines.every((l) => /^\s*[-•]\s+/.test(l))) return `<ul>${lines.map((l) => `<li>${l.replace(/^\s*[-•]\s+/, "")}</li>`).join("")}</ul>`;
    return `<p>${lines.join("<br>")}</p>`;
  }).join("");
  return html.replace(/\u0000(\d+)\u0000/g, (_, i) => parts[Number(i)]);
}

// ---------- Налаштування ----------
function settingsPage() {
  const sw = (key, title, hint) => `<div class="set-row"><span>${title}${hint ? `<small>${hint}</small>` : ""}</span>
    <button type="button" class="switch" role="switch" aria-checked="${!!SET[key]}" aria-label="${title}" data-set="${key}"></button></div>`;
  const themeSeg = `<div class="seg" role="group" aria-label="Тема">${[["auto", "Авто"], ["time", "За часом"], ["light", "Світла"], ["dark", "Темна"]]
    .map(([v, t]) => `<button type="button" data-theme-set="${v}" aria-pressed="${SET.theme === v}">${t}</button>`).join("")}</div>`;
  const modes = [ADMIN_TOKEN && "адмін", GDZ_TOKEN && `АвтоГДЗ${AI_TOKEN ? " + ШІ" : ""}`].filter(Boolean);
  return `<h1>Налаштування</h1><p class="sub">${ACC.token ? "Синхронізуються з акаунтом і діють одразу." : "Зберігаються в цьому браузері й діють одразу."}</p>
    ${accountCard()}
    <a class="set-admin${ADMIN_TOKEN ? " on" : ""}" href="#/admin"><span class="sa-ic">${ic("shield")}</span>
      <span class="sa-t"><b>Адмінпанель</b><small>${ADMIN_TOKEN ? "Адмін-режим увімкнено" : GDZ_TOKEN ? `Увімкнено АвтоГДЗ${AI_TOKEN ? " + ШІ" : ""}` : "Вхід за паролем"}</small></span>${ic("chevR")}</a>
    ${ACC.token ? "" : `<a class="set-tg" href="https://t.me/HWeightDai?start=remind" target="_blank" rel="noopener">${ic("bell")}
      <span><b>Нагадування в Telegram</b><small>Щовечора бот надішле ДЗ на завтра. Натисни й потім «Start»</small></span>${ic("ext")}</a>`}
    <h2>Мій розклад</h2><div class="prefs">${prefSwitches(pref())}</div>
    <h2>Вигляд</h2><div class="set-list"><div class="set-row set-theme"><span>Тема<small>«За часом» — темна з 20:00 до 07:00</small></span>${themeSeg}</div></div>
    <h2>Головна</h2><div class="set-list">
      ${sw("showDebts", "Показувати борги на головній", `Усі борги завжди є в ${ic("dots")} ${ic("arrow")} Борги`)}
      ${sw("showNow", "Картка «Зараз»", "Який урок іде, скільки до перерви")}
      ${sw("showBdays", "Дні народження")}
      ${sw("showClass", "Обід і оголошення класної керівниці")}</div>
    <h2>Розділи</h2><div class="set-list">
      ${sw("hideSwitches", "Сховати перемикачі в «Розкладі»", "Вони все одно є тут, у Налаштуваннях")}
      ${sw("subjDoneOnly", "У «Предметах» лише виконане")}</div>
    <h2>Інше</h2><div class="set-list">
      <div class="set-row"><span>Галочки «виконано»<small>Позначено: ${DONE.size}</small></span><button type="button" class="set-btn danger" data-resetdone>Скинути</button></div>
      <div class="set-row"><span>Режим<small>${modes.length ? "Увімкнено: " + modes.join(", ") : "Звичайний"}</small></span>
        ${modes.length ? `<button type="button" class="set-btn" data-allout>Вийти</button>` : `<a class="set-btn" href="#/admin" style="text-decoration:none">Увійти</a>`}</div></div>`;
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
    ${chips}${body || emptyBox("okc", "Боргів немає", "Усе здано вчасно — так тримати")}`;
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
  const mark = (d, n) => (VISITS[d] || {})[n];
  const cell = (d, n) => { const v = mark(d, n); return `<td class="${d === sel ? "sel " : ""}${plan(d).length ? "" : "off "}${v === "+" ? "v-p" : v === "Н" ? "v-n" : ""}">${v === "+" ? "+" : v === "Н" ? "Н" : "·"}</td>`; };
  const rows = students.map((n) => `<tr><th scope="row">${esc(n)}</th>${days.map((d) => cell(d, n)).join("")}</tr>`).join("");
  const foot = days.some((d) => VISITS[d]) ? `<tfoot><tr><th>Присутні / відсутні</th>${days.map((d) => {
    const v = Object.values(VISITS[d] || {});
    return `<td>${v.length ? `${v.filter((x) => x === "+").length}/${v.filter((x) => x === "Н").length}` : ""}</td>`;
  }).join("")}</tr></tfoot>` : "";
  const any = Object.keys(VISITS).length;
  return `<h1>Відвідування</h1>
    ${any ? `<p class="sub">+ — був, Н — не було, · — невідомо. Дані — з журналу, який надсилає класна керівниця.</p>`
      : `<div class="dev-banner">Відміток ще немає — зʼявляться, коли класна керівниця надішле фото журналу.</div>`}
    <div class="cal-nav"><button data-vweek="-1" aria-label="Попередній тиждень">${ic("chevL")}</button>
      <h2>${short(days[0])} – ${short(days[4])}</h2><button data-vweek="1" aria-label="Наступний тиждень">${ic("chevR")}</button></div>
    <div class="visits-wrap"><table class="visits"><thead><tr><th>Учень</th>${head}</tr></thead><tbody>${rows ||
      `<tr><td colspan="6">Список учнів ще не додано.</td></tr>`}</tbody>${foot}</table></div>`;
}

// ---------- «Секрет» → АвтоГДЗ ----------
// Ключ АвтоГДЗ живе до закриття вкладки, ключ «Від ШІ» — на пристрої (пароль питається один раз)
const store = () => sessionStorage; // режими (ГДЗ, ШІ) живуть до закриття вкладки
try { localStorage.removeItem("dz-ai"); } catch { /* старий ключ «Від ШІ» більше не потрібен */ }
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
      <em>${GDZ_TAGS.includes(e.tag) ? `Шукати ГДЗ ${ic("chevR")}` : `Відкрити ${ic("chevR")}`}</em></button></div>`;
}
// невиконане вгорі, всередині — за важкістю
const gdzSort = (l) => [...sortSubj(l.filter((e) => !isDone(e))), ...sortSubj(l.filter(isDone))];
function secretPage() {
  if (!GDZ_TOKEN) return lockForm("lock", "Вхід", "Введи пароль.");
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
  return `<h1 class="gdz-h">АвтоГДЗ${AI_TOKEN ? ` <small class="muted">+ ШІ</small>` : ""}</h1>${tabs}${body}
    <p><button type="button" class="set-btn" data-gdzout>Вийти з АвтоГДЗ</button></p>`;
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
        <a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.source)} · ${esc(r.label)} ${ic("ext")}</a></div>
        ${r.images.map((p) => `<button class="crop" data-img="${esc(p)}" aria-label="Збільшити"><img src="${esc(p)}" loading="lazy" alt="ГДЗ ${esc(r.ref)}"></button>`).join("")}</div>`).join("")
      : `<p class="muted">${f.refs && f.refs.length ? `Не знайшов ${esc(f.refs.join(", "))} на сайтах ГДЗ.` : "У ДЗ немає номерів вправ — нема що шукати."}
          ${(f.links || []).map((l) => `<br><a href="${esc(l.url)}" target="_blank" rel="noopener">Відкрити ГДЗ на ${esc(l.source)} ${ic("ext")}</a>`).join("")}</p>`;
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
      `<div class="ai-ans">${r.creative ? `<b>Варіант ${i + 1}</b>` : ""}<div class="md">${mdMath(t)}</div></div>`).join("")}
      ${r.note ? `<p class="muted small-note">${esc(r.note)}</p>` : ""}
      <p class="muted small-note">ШІ може помилятись — перевір.</p></div>`;
  } else if (a && a.status === "error") ai = `<p class="err">${esc(a.error)}</p>`;
  const aiBtn = AI_TOKEN && !(a && ["queue", "run", "starting", "done"].includes(a.status))
    ? `<button type="button" class="btn-ai" data-ai>${ic("spark")} Від ШІ</button>` : "";
  const done = isDone(e);
  return `<div class="modal-card" role="dialog" aria-modal="true" aria-label="АвтоГДЗ: ${esc(s.name)}">
    <div class="modal-h" style="--c:${s.color}"><b>${esc(s.name)}</b><button type="button" class="close" data-gdz-close aria-label="Закрити">${ic("x")}</button></div>
    <p class="hw">${linkify(e.homework)}</p>
    <button type="button" class="done-toggle${done ? " on" : ""}" data-mdone="${esc(e.id)}">${ic("check")} ${done ? "Виконано — повернути" : "Позначити виконаним"}</button>
    ${crops ? `<div class="gdz-crops">${crops}</div>` : ""}
    ${has ? (f ? "" : `<div class="gdz-solve"><button type="button" class="btn-solve" data-solve>Розвʼязати</button></div>`)
      : `<p class="muted gdz-dev">Повне АвтоГДЗ до цього предмету у розробці.</p>`}
    ${found}
    ${aiBtn || ai ? `<div class="gdz-ai">${aiBtn}${ai}</div>` : ""}
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
  if (r.status === 401 && j.ai_login) { AI_TOKEN = null; keySet("ai", "dz-ai", null); renderModal(); throw new Error("Режим ШІ закінчився — увійди ще раз паролем ГДЗ+ШІ."); }
  if (!j.ok) throw new Error(j.error || "Помилка");
  return j;
}
function setGdz(t, ai = null) {
  GDZ_TOKEN = t; keySet("gdz", "dz-gdz", t);
  AI_TOKEN = t ? ai : null; keySet("ai", "dz-ai", AI_TOKEN);
}
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
  if (img) { openViewer(img.dataset.img, img); return; }
  const md = ev.target.closest("[data-mdone]");
  if (md) { const on = !DONE.has(md.dataset.mdone); setDone(md.dataset.mdone, on); doneToast(md.dataset.mdone, on); renderModal(); render(); return; }
  if (ev.target.closest("[data-solve]")) {
    const id = GDZ.open;
    GDZ.find = "loading"; renderModal();
    try { const j = await gdzApi("find", { id }); if (GDZ.open === id) GDZ.find = j; }
    catch (e) { if (GDZ.open === id) GDZ.find = { error: e.message }; }
    renderModal(); return;
  }
  if (ev.target.closest("[data-ai]")) {
    if (!AI_TOKEN) return;
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
      <a href="#i-week">Розклад</a><a href="#i-menu">Меню ⋯</a><a href="#i-set">Налаштування</a><a href="#i-class">Обід</a><a href="#i-check">Галочки й борги</a><a href="#i-colors">Кольори</a>
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
      <li>Змінити вибір будь-коли — у <b>${ic("gear")} Налаштуваннях</b> (${ic("dots")} ${ic("arrow")} ${ic("gear")} біля «Ще») або перемикачами вгорі «Розкладу». Діє одразу на весь сайт.</li>
      <li>Вибір зберігається лише в цьому браузері. На іншому телефоні чи комп'ютері сайт спитає ще раз.</li>
    </ul>

    <h2 id="i-home">Головна</h2>
    <ul>
      <li><b>«Зараз»</b> вгорі — який урок іде, кабінет, учитель і скільки до перерви; на перерві — що далі й скільки до дзвінка.
        Цифри оновлюються щосекунди.</li>
      <li><b>Акаунт</b> — ${ic("gear")} Налаштування ${ic("arrow")} «Увійти» ${ic("arrow")} бот у Telegram ${ic("arrow")} імʼя та прізвище. Галочки, нотатки, оцінки й налаштування — на всіх твоїх пристроях;
        нагадування — лише про твоє невиконане ДЗ; в опитуваннях видно твоє імʼя. Змінити імʼя — боту <code>/name Нове Імʼя</code>.</li>
      <li><b>Нотатка для класу</b> — під ДЗ (з акаунтом): «у №247 помилка в підручнику». Бачать усі; ШІ пропускає лише те, що про ДЗ; раз на 30 хв.</li>
      <li><b>Пошук у підручниках</b> — у «Файлах»: «теорема Піфагора» — і сайт покаже сторінку.</li>
      <li><b>Тема «За часом»</b> — у Налаштуваннях: темна з 20:00 до 07:00.</li>
      <li><b>Оцінки</b> (меню ${ic("dots")}) — записуй свої оцінки: середній бал і скільки треба, щоб вийшло на 1 вище. Бачиш лише ти.</li>
      <li><b>Нотатки</b> — іконка ${ic("note")} на картці ДЗ: своя примітка, видно лише тобі.</li>
      <li><b>Опитування</b> — від класної керівниці: голосуй на головній (голоси з Telegram-каналу додаються). «Хто голосував» — імена тих, хто з акаунтом.</li>
      <li><b>Нагадування</b> — у Налаштуваннях «Нагадування в Telegram» або напиши боту @HWeightDai /remind: щовечора ДЗ на завтра.</li>
      <li><b>Конспекти</b> — надішли фото конспекту боту @HWeightDai, після перевірки він зʼявиться на сторінці предмета.</li>
      <li><b>Календар</b>: «До канікул N днів» і графік навантаження тижня (на головній відлік — лише за 7 днів до канікул).</li>
      <li><b>Тести</b> (меню ${ic("dots")}) — контрольні, самостійні, тести й онлайн-тести з датою й відліком «через 3 дні». За 3 дні до тесту — рядок на головній.</li>
      <li><b>Проєкти</b> — проєкти, презентації й реферати з дедлайнами, а внизу — «Мої проєкти».</li>
      <li><b>${ic("cake")} Дні народження</b> — якщо ДН сьогодні, завтра чи післязавтра. У понеділок до кінця 3-го уроку — ще й ДН, що були на вихідних.</li>
      <li><b>${ic("warn")} Боргів: N</b> — є прострочені невиконані ДЗ (див. «Борги»). На головній — лише якщо увімкнено в Налаштуваннях.</li>
      <li><b>${ic("okc")} ДЗ на завтра виконано</b> — коли ти поставив галочки на все ДЗ найближчого дня.</li>
      <li><b>«Здати …»</b> — ДЗ на найближчий день, де ще щось не зроблено, нижче — «Далі» на тиждень уперед.
        Порядок у кожному дні — від найважчих предметів до найлегших.</li>
      <li>На картці ДЗ: предмет з крапкою важкості, мітка групи (якщо ДЗ лише для групи), коли задали ${ic("arrow")} коли здати, текст,
        фото дошки (натисни — відкриється на весь екран) і <b>«Завдання»</b> — вирізки з підручника з посиланням «відкрити в підручнику».</li>
      <li>Червона плашка <b>«${ic("siren")} Повітряна тривога в Києві»</b> — тривога саме зараз.</li>
      <li>Внизу — <b>«${ic("check")} Виконано: N»</b>: скільки майбутніх ДЗ ти вже зробив.</li>
    </ul>

    <h2 id="i-cal">Календар</h2>
    <ul>
      <li>Гортай місяці стрілками ${ic("chevL")} ${ic("chevR")} або змахом, натисни на день — під календарем його розклад і все ДЗ, яке треба здати цього дня
        (зокрема й чуже — інших груп, притінене).</li>
      <li>Крапка під числом — у цей день є ДЗ. Її колір — середня важкість ДЗ цього дня (див. «Кольори»).</li>
      <li>Сьогодні обведено, вихідні й канікули — блідіші.</li>
      <li>У розкладі дня червона смуга й «${ic("siren")} N%» — скільки уроку пройшло під тривогою.</li>
      <li><b>${ic("users")} Відвідування</b> — відкриває цей день у розділі «Відвідування».</li>
    </ul>

    <h2 id="i-week">Розклад</h2>
    <ul>
      <li>Вгорі — перемикачі (українська/група, мова, технології).</li>
      <li>Далі — <b>сьогодні</b> (після уроків — наступний навчальний день) з живою підсвіткою: поточний урок виділено й показано,
        скільки до перерви та хто веде урок; пройдені уроки сірішають, між ними — плашка «Перерва» з часом до дзвінка,
        наступний урок трохи більший.</li>
      <li>Нижче — увесь тиждень: час уроків, кабінет (у фізкультури — «зал»), крапки важкості. Гортай тижні стрілками.</li>
      <li>Тижні чергуються <b>А/Б</b> (від цього залежать деякі уроки, наприклад у понеділок), сайт рахує це сам.</li>
      <li><b>${ic("timer")} Скорочені уроки</b> — у такі дні сайт рахує все (таймер, тривоги) за скороченими дзвінками.</li>
    </ul>

    <h2 id="i-menu">Меню ⋯</h2>
    <ul>
      <li><b>Предмети</b> — плитки за важкістю (кількість ДЗ, ${ic("book")} — є підручник). Сторінка предмета: учитель, 5 найближчих уроків,
        підручник(и), файли, і ДЗ двома блоками — <b>Невиконані</b> та <b>Виконані</b>.</li>
      <li><b>Виконане</b> — усе, що ти позначив; там галочку можна зняти.</li>
      <li><b>Борги</b> (поруч — кількість) — прострочене невиконане ДЗ, з фільтром за предметом.</li>
      <li><b>Відвідування</b> — хто був у школі по днях (+ був, Н не було, · невідомо), з журналу класної керівниці.</li>
      <li><b>Додаткове</b>: Тривоги (з ШІ-прогнозом), Файли (від учителів і підручники), Розсадка (лише схема!), Дні народження.</li>
      <li><b>${ic("gear")} Налаштування</b> і <b>${ic("info")} Інфо</b> — іконки біля заголовка «Ще» в меню ${ic("dots")}.</li>
      <li><b>Адмінпанель</b> — зелена кнопка нагорі Налаштувань, вхід за паролем.</li>
    </ul>

    <h2 id="i-set">Налаштування</h2>
    <ul>
      <li>Українська/група, мова, технології; тема — авто, світла або темна.</li>
      <li>Головна: показувати борги (за замовчуванням ні), картка «Зараз», дні народження, обід і оголошення.</li>
      <li>Сховати перемикачі в «Розкладі»; у «Предметах» показувати лише виконане.</li>
      <li>Скинути всі галочки; вийти з адмін-режиму.</li>
    </ul>

    <h2 id="i-class">Обід і оголошення</h2>
    <ul>
      <li>Класна керівниця пише боту, після якого уроку обід. Якщо не написала — вважається, що після 3-го, з позначкою «не офіційно».</li>
      <li>На головній: «${ic("lunch")} ОБІД через урок», «ОБІД після цього уроку», а на самій перерві — велике «${ic("lunch")} ОБІД». У канал бот теж пише «ОБІД».</li>
      <li>Оголошення класної керівниці — на головній (останні 3 дні) і жирним у каналі.</li>
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
      <li>На головній і в боргах — тільки твоє. Чуже видно в календарі й «Предметах» — притінене, з міткою групи.</li>
    </ul>

    <h2 id="i-alerts">Тривоги</h2>
    <ul>
      <li>Сайт сам щопівхвилини перевіряє тривогу в м. Київ і записує її.</li>
      <li>Якщо тривога йшла хоча б останні 10 хв уроку і ДЗ з нього не задали — на місці ДЗ з'являється плашка <b>«Була тривога!»</b>
        (до наступного уроку цього предмета). Якщо ДЗ потім таки надішлють — плашка зміниться на справжнє ДЗ.</li>
      <li>Поки ноутбук-сервер вимкнений, тривоги не записуються.</li>
      <li><b>${ic("bot")} ШІ-прогноз</b> (неофіційно): щохвилини сайт читає відкриті канали моніторингу. Якщо щось летить у бік Києва —
        на головній «${ic("warn")} Можлива тривога» з упевненістю від 1 до 10. Під час тривоги — тип загрози (балістика, ракети, шахеди…),
        якщо канали про це пишуть, і орієнтовно скільки ще. ШІ запамʼятовує свої помилки й враховує їх; його точність — у «Тривогах».</li>
      <li>Прогноз може помилятись. Головне — сирена й офіційні застосунки (Повітряна тривога).</li>
    </ul>

    <h2 id="i-tips">Дрібниці</h2>
    <ul>
      <li>Дані підтягуються під час відкриття, тривоги — кожні 30 с. Не бачиш нового ДЗ — онови сторінку.</li>
      <li>Як застосунок: iPhone — «Поділитися» ${ic("arrow")} «На екран „Додому“»; Android — ${ic("dotsV")} ${ic("arrow")} «Додати на головний екран».</li>
      <li>Темна тема вмикається сама, якщо вона увімкнена на телефоні.</li>
      <li>Фото й вирізки відкриваються на весь екран; закрити — натиснути ще раз або Esc.</li>
      <li>Учителі в «Розкладі» показані лише біля уроку, що йде зараз; повний список — на сторінках предметів.</li>
      <li>Сайт нічого про тебе не збирає, окрім звичайних даних відвідування (IP) для захисту від спаму.</li>
    </ul>

    <div class="bug">${ic("bug")} <b>Знайшов баг або є ідея?</b> Пиши мені в Telegram: <a href="https://t.me/Spl1ted" target="_blank" rel="noopener">@Spl1ted</a></div>
  </section>`;
  const gdzDoc = !GDZ_TOKEN ? "" : `
  <section class="doc gdz-doc">
    <h2><span class="gdz-dot" aria-hidden="true"></span> АвтоГДЗ</h2>
    <ul>
      <li>Режим вмикається паролем у зеленій кнопці «A» (Адмінпанель): один пароль — АвтоГДЗ, інший — АвтоГДЗ + ШІ.
        Поки діє — під шапкою синя смужка «Режим ГДЗ», сайт трохи синіший, у меню є «АвтоГДЗ». До закриття вкладки; ${ic("x")} на смужці — вийти.</li>
      <li>Дві вкладки: <b>«На завтра»</b> — ДЗ на найближчий навчальний день, і <b>«Усі ДЗ»</b> — усе твоє ДЗ за днями (майбутнє вгорі, потім минуле).</li>
      <li>Галочка зліва — позначити виконаним (те саме, що на головній). Виконане опускається вниз і викреслюється.</li>
      <li>Натисни на ДЗ — відкриється вікно з текстом, вирізками з підручника й кнопкою <b>«Розв'язати»</b>.
        Сайт шукає готову відповідь на gdzonline.net і shkola.in.ua — для <b>алгебри, геометрії, української мови й історії України</b>.
        Для інших предметів — «Повне АвтоГДЗ до цього предмету у розробці». Вікно виїжджає знизу.</li>
      <li>Що шукається — номери з ДЗ: «№ 245, 247», «№245–247», «с. 92 впр. 1», «ст. 45 № 3», «§ 5».
        Якщо є і сторінка, і завдання — шукається саме це завдання на цій сторінці. Без номерів шукати нема чого.</li>
      <li>Під кожною відповіддю — посилання на джерело. Не знайшлось — є посилання на весь збірник.</li>
      <li><b>${ic("spark")} Від ШІ</b> (лише в режимі «+ ШІ») — розвʼязок від штучного інтелекту (Claude) з нормальними дробами, степенями й поясненнями.
        ШІ бачить фото завдання з підручника (для англійської — усю сторінку) і, якщо є, ГДЗ, щоб звіритись.
        Творчі завдання (твір, речення, лист) — два різні варіанти на вибір. Займає до 1–2 хв.</li>
      <li>Кожне ДЗ ШІ розвʼязує один раз — далі всі бачать готову відповідь одразу. Нових розвʼязків — не більше 30 на день на всіх.</li>
      <li>ГДЗ і ШІ можуть помилятись — перевіряй і розбирайся, а не просто списуй</li>
    </ul>
  </section>`;
  const adm = !ADMIN_TOKEN ? "" : `
  <section class="doc admin-doc">
    <h2><span class="adm-dot" aria-hidden="true"></span> Для адмінів</h2>
    <h3>Усі команди Telegram-бота @HWeightDai</h3>
    <p class="muted small-note">Власник — лише ти (OWNER_ID). Адміни — ті, кого додав /adminadd. КК — класна керівниця (/adminhannaadd). Учні — усі інші.</p>
    <table class="cmds"><tbody>
      <tr class="cg"><th colspan="2">Власник</th></tr>
      <tr><td><code>/adminadd username</code></td><td>дати людині право надсилати ДЗ</td></tr>
      <tr><td><code>/adminremove username</code></td><td>забрати це право</td></tr>
      <tr><td><code>/admins</code></td><td>список адмінів і КК</td></tr>
      <tr><td><code>/adminhannaadd username</code></td><td>увімкнути режим класної керівниці</td></tr>
      <tr><td><code>/adminhannaremove username</code></td><td>вимкнути режим КК</td></tr>
      <tr><td><code>/digest</code></td><td>чернетка зведення «ДЗ на завтра» зараз (автоматично — о 17:00, у канал о 18:00)</td></tr>
      <tr><td><code>/short</code></td><td>скорочені уроки сьогодні</td></tr>
      <tr><td><code>/short 12.11</code></td><td>скорочені уроки в цей день</td></tr>
      <tr><td><code>/short off 12.11</code></td><td>скасувати скорочені</td></tr>
      <tr><td><code>/restartsite</code></td><td>перезапустити сайт</td></tr>
      <tr><td><code>/stopsite</code> · <code>/startsite</code></td><td>зупинити / запустити сайт</td></tr>
      <tr><td><code>/restartbot</code></td><td>перезапустити бота</td></tr>
      <tr><td><code>/fullrestart</code></td><td>перезапустити бота й сайт</td></tr>
      <tr class="cg"><th colspan="2">Власник і адміни</th></tr>
      <tr><td>текст / фото / посилання</td><td>ДЗ: чернетка → «Опублікувати». Виправити — відповісти (reply) на чернетку</td></tr>
      <tr><td>голосове з підписом</td><td>ДЗ з голосового (розшифровка)</td></tr>
      <tr><td>файл (pdf, docx…)</td><td>у «Файли» на сайті або як ДЗ</td></tr>
      <tr><td><code>/start</code> · <code>/help</code></td><td>довідка</td></tr>
      <tr class="cg"><th colspan="2">Класна керівниця (без команд — просто пише)</th></tr>
      <tr><td>«дз …»</td><td>ДЗ, як в адміна</td></tr>
      <tr><td>«обід після 4 уроку»</td><td>обід на сайті й «ОБІД» у каналі на цій перерві</td></tr>
      <tr><td>фото журналу</td><td>відвідування за сьогодні</td></tr>
      <tr><td>«контрольна з алгебри в пт»</td><td>у «Тести» / «Проєкти» й у канал</td></tr>
      <tr><td>«опитування: … так / ні»</td><td>опитування в каналі й на сайті</td></tr>
      <tr><td>будь-що інше</td><td>оголошення жирним у канал і на головну</td></tr>
      <tr class="cg"><th colspan="2">Учні (усі)</th></tr>
      <tr><td><code>/start</code> · <code>/help</code></td><td>що вміє бот</td></tr>
      <tr><td><code>/remind</code> · <code>/remind 20:30</code></td><td>щовечора ДЗ на завтра (з акаунтом — лише своє невиконане)</td></tr>
      <tr><td><code>/stopremind</code></td><td>вимкнути нагадування</td></tr>
      <tr><td><code>/name Петренко Олег</code></td><td>змінити імʼя акаунта</td></tr>
      <tr><td>фото конспекту</td><td>на перевірку власнику → на сторінку предмета</td></tr>
      <tr><td><code>/start login_…</code></td><td>вхід на сайт (посилання з кнопки «Увійти»)</td></tr>
    </tbody></table>
    <h3>Адмінпанель</h3>
    <ul>
      <li>Вхід: ${ic("dots")} ${ic("arrow")} ${ic("gear")} Налаштування ${ic("arrow")} «Адмінпанель» ${ic("arrow")} пароль. Поки режим увімкнено, під шапкою зелена смужка «Адмін-режим».
        Діє до закриття вкладки (максимум 12 год). Вийти — кнопка «Вийти» в адмінпанелі.</li>
      <li><b>${ic("pen")} на картці ДЗ</b> — змінити текст і дату здачі. Зміна йде на сайт і в пост у каналі
        (для ДЗ, опублікованих після цього оновлення; для старших — лише сайт).</li>
      <li><b>${ic("trash")}</b> — прибрати ДЗ із сайту (у каналі пост лишається). Усе видалене — в адмінпанелі, «Видалені ДЗ», звідки його можна повернути.</li>
      <li><b>Відвідувачі й блок</b> — останні IP, хто й коли заходив. «Заблокувати» — ця IP бачить тільки «Доступ заблоковано».
        Свою IP заблокувати не можна. Увага: у мобільного інтернету IP часто спільна на багатьох людей і змінюється — блокуй обережно.</li>
      <li><b>${ic("plus")} Додати ДЗ</b> — ДЗ прямо з сайту: предмет, група, дати (здати — підставляється сама), текст; галочка «також у канал».</li>
      <li><b>Сайт ${ic("arrow")} Скорочені уроки</b> — вибери день і «Увімкнути»: таймер, розклад і тривоги рахуються за скороченими дзвінками.
        З Telegram: <code>/short</code>, <code>/short 12.11</code>, <code>/short off 12.11</code>.</li>
      <li><b>Сайт ${ic("arrow")} Перезапустити</b> — якщо сайт поводиться дивно. Займає ~10 с.</li>
      <li><b>Вхід і режими</b>: ${ic("dots")} ${ic("arrow")} ${ic("gear")} Налаштування ${ic("arrow")} «Адмінпанель» ${ic("arrow")} пароль. Адмін — зелений відтінок сайту й зелена смужка під шапкою; кнопка «ГДЗ» в адмінпанелі
        вмикає повний АвтоГДЗ (з ШІ). ${ic("x")} на смужці — вийти.</li>
      <li><b>ШІ-прогноз тривог</b>: канали — в адмінпанелі, «Сайт». Щоб попередження йшли в Telegram-канал, додай туди бота адміном —
        бот сам запамʼятає канал і напише тобі.</li>
      <li><b>Режим КК</b> (класна керівниця): <code>/adminhannaadd username</code>, <code>/adminhannaremove username</code>.
        Вона пише боту: «дз …» — ДЗ; «обід після N уроку»; фото журналу — відвідування (бот сам знаходить сьогоднішній стовпчик);
        будь-що інше — оголошення (жирним у канал і на головну). Усе — після «${ic("okc")}» у чернетці. ${ic("trash")} біля оголошення на сайті — прибрати.</li>
      <li>Якщо бот не впевнений у предметі — бере урок, що йде (чи щойно був) у момент надсилання.</li>
      <li>Нове ДЗ на завтра після 18:00 — пост зведення в каналі доповнюється сам.</li>
      <li><b>Файли до предмета</b>: на сторінці предмета (в адмін-режимі) — «${ic("plus")} Додати фото або файл», до 25 МБ.
        Файл зʼявиться на сторінці предмета й у «Файлах» з датою додавання. ${ic("trash")} біля файлу — видалити.</li>
      <li><b>Борги</b> рахуються від <code>DEBT_FROM</code> у <code>site/app.js</code> (зараз 9.11.2026). <b>Відвідування</b> — поки лише заготовка.</li>
    </ul>
    <h3>Бот (Telegram)</h3>
    <ul>
      <li>Бот відповідає тільки власнику й адмінам. Надіслати ДЗ: текст, фото дошки, альбом, голосове з уроку, посилання чи файл + назва уроку.
        Бот покаже чернетку ${ic("arrow")} «${ic("okc")} Опублікувати». Виправити — відповісти (reply) на чернетку текстом.</li>
      <li>Для предметів із групами бот спитає «1 група / 2 група» (для української — «Ганна / —»).</li>
      <li>Якщо з предмета за цей день ДЗ вже є, бот попередить. Адміну повтор опублікувати не можна (власнику — можна).
        Якщо бот переплутав предмет — відповідай на чернетку, який це урок.</li>
      <li>Для технологій бот питає «дівчата / хлопці», для української — «Ганна / Ольга».</li>
      <li>Команди власника: <code>/short</code>, <code>/adminadd username</code>, <code>/adminremove username</code>, <code>/admins</code>,
        <code>/restartsite</code>, <code>/stopsite</code>, <code>/startsite</code>, <code>/restartbot</code>, <code>/fullrestart</code>, <code>/digest</code>.</li>
      <li><b>Зведення</b>: о 17:00 бот надсилає власнику чернетку «ДЗ на завтра». Після «${ic("okc")}» вона йде в канал о 18:00
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

// Шапка й меню під поточний режим: бейджі, кольори, АвтоГДЗ у меню, кількість боргів
function syncChrome(tab) {
  document.getElementById("admin-badge").hidden = !ADMIN_TOKEN;
  document.getElementById("gdz-badge").hidden = !GDZ_TOKEN;
  document.getElementById("gdz-ai-mark").textContent = AI_TOKEN ? " + ШІ" : "";
  document.getElementById("modebar").hidden = !ADMIN_TOKEN && !GDZ_TOKEN;
  document.getElementById("secret-link").hidden = !GDZ_TOKEN;
  document.body.classList.toggle("mode-admin", !!ADMIN_TOKEN);
  document.body.classList.toggle("mode-gdz", !!GDZ_TOKEN);
  const n = debts().length;
  document.getElementById("debt-cnt").textContent = n ? String(n) : "";
  document.getElementById("more-dot").hidden = !n;
}
// Кнопки виходу в шапці (вони поза #app)
document.querySelector(".top").addEventListener("click", (ev) => {
  if (ev.target.closest("[data-lockout]")) { adminApi("logout").catch(() => {}); dropRole("admin"); setToken(null); render(); }
  if (ev.target.closest("[data-gdzout]")) { dropRole("gdz"); setGdz(null); closeModal(); render(); }
});

// ---------- роутинг ----------
const app = document.getElementById("app");
app.addEventListener("change", (ev) => {
  if (ev.target.id === "acc-rem-at" && ACC.remind) { accRemind(true, ev.target.value); return; }
  if (ev.target.name === "tag" && ev.target.closest("#addform")) {
    keepAddText(); ADD = { tag: ev.target.value, grp: 0 }; render(); restoreAddText();
  }
});
let timer = null, LAST_TAB = null;
function hm(ts) {
  const d = new Date(ts), t = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  return iso(d) === today() ? t : `${short(iso(d))} ${t}`;
}
const offBar = () => NET.ok ? "" :
  `<div class="offbar" role="status">${ic("wifioff")} Немає звʼязку${NET.at ? ` — показано дані від ${hm(NET.at)}` : ""}</div>`;
const updLine = () => NET.ok && NET.at ? `<p class="upd">Оновлено о ${hm(NET.at)}</p>` : "";

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
  else if (h === "/settings") { tab = "settings"; html = settingsPage(); }
  else if (h === "/tests") { tab = "tests"; html = testsPage(); }
  else if (h === "/grades") { tab = "grades"; html = gradesPage(); }
  else if (h === "/projects") { tab = "projects"; html = projectsPage(); }
  else if (h === "/visits" || h.startsWith("/visits/")) { tab = "visits"; html = visitsPage(h.slice(8) || null); }
  else html = home();
  app.innerHTML = offBar() + html;
  document.body.classList.toggle("tab-home", tab === "home");
  if (tab !== LAST_TAB) {
    app.classList.remove("fade"); void app.offsetWidth; app.classList.add("fade"); LAST_TAB = tab;
    try { fetch("api/hit", { method: "POST", keepalive: true, headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tab, device: DEVICE, token: ACC.token }) }).catch(() => {}); } catch { /* */ }
  }
  document.querySelectorAll(".tabs a, .bnav a, .drawer a").forEach((a) => a.classList.toggle("on", a.dataset.tab === tab));
  const inMore = ["subj", "files", "secret", "alerts", "done", "debts", "visits", "info", "seats", "bdays", "settings", "admin", "tests", "projects", "grades"].includes(tab);
  document.getElementById("more").classList.toggle("on", inMore);

  setDrawer(false);
  syncChrome(tab);
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
  if (ev.target.closest("[data-lockout]")) { adminApi("logout").catch(() => {}); dropRole("admin"); setToken(null); render(); return; }
  if (ev.target.closest("[data-gdzout]")) { dropRole("gdz"); setGdz(null); closeModal(); if ((location.hash.slice(1) || "/") === "/secret") location.hash = "#/"; render(); return; }
  if (ev.target.closest("[data-admgdz]")) {
    adminApi("gdz").then((j) => { setGdz(j.gtoken, j.atoken); location.hash = "#/secret"; render(); }).catch((e) => alert(e.message));
    return;
  }
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
  if (ev.target.closest("[data-acc-login]")) { accLogin(); return; }
  if (ev.target.closest("[data-nudge-hide]")) { try { localStorage.setItem("dz-nudge-hide", String(Date.now() + 14 * 86400000)); } catch { /* */ } render(); return; }
  const cadd = ev.target.closest("[data-cadd]");
  if (cadd) { CM_OPEN = cadd.dataset.cadd; render(); const i = document.querySelector(".cm-form input"); if (i) i.focus(); return; }
  const cdel = ev.target.closest("[data-cdel]");
  if (cdel) {
    if (!confirm("Видалити нотатку?")) return;
    fetch("api/comment/delete", { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: cdel.dataset.cdel, token: ACC.token, admin: ADMIN_TOKEN }) })
      .then(() => loadComments()).then(render);
    return;
  }
  if (ev.target.closest("[data-acc-logout]")) { if (confirm("Вийти з акаунта на цьому пристрої? Дані лишаться в акаунті.")) accLogout(); return; }
  if (ev.target.closest("[data-acc-rem]")) { accRemind(!ACC.remind, (document.getElementById("acc-rem-at") || {}).value || "19:00"); return; }
  const vb = ev.target.closest("[data-voters]");
  if (vb) {
    const id = vb.dataset.voters;
    if (VOTERS[id]) { delete VOTERS[id]; render(); return; }
    fetch(`api/poll/voters?id=${encodeURIComponent(id)}`).then((r) => r.json()).then((j) => { if (j.ok) { VOTERS[id] = j; render(); } });
    return;
  }
  if (ev.target.closest("[data-stats-reload]")) { ADM.stats = null; render(); return; }
  const accd = ev.target.closest("[data-accdel]");
  if (accd) {
    if (!confirm("Видалити цей акаунт? Його галочки й нотатки зникнуть з сервера.")) return;
    adminApi("account-delete", { tg: accd.dataset.accdel }).then(() => { ADM.accounts = null; render(); }).catch((e) => alert(e.message));
    return;
  }
  const nb = ev.target.closest("[data-note]");
  if (nb) { NOTE_EDIT = nb.dataset.note; render(); const ta = document.querySelector(".note-form textarea"); if (ta) ta.focus(); return; }
  if (ev.target.closest("[data-note-cancel]")) { NOTE_EDIT = null; render(); return; }
  const nd = ev.target.closest("[data-note-del]");
  if (nd) { delete NOTES[nd.dataset.noteDel]; saveNotes(); NOTE_EDIT = null; render(); return; }
  const gd = ev.target.closest("[data-gdel]");
  if (gd) { const [t, i] = gd.dataset.gdel.split(":"); GRADES[t].splice(Number(i), 1); if (!GRADES[t].length) delete GRADES[t]; saveGrades(); render(); return; }
  const vt = ev.target.closest("[data-vote]");
  if (vt) { const [id, i] = vt.dataset.vote.split(":"); sendVote(id, Number(i)); return; }
  const pc = ev.target.closest("[data-pclose]"), pdl = ev.target.closest("[data-pdel]");
  if (pc || pdl) {
    if (pdl && !confirm("Видалити опитування з сайту?")) return;
    adminApi(pc ? "poll-close" : "poll-delete", { id: (pc || pdl).dataset[pc ? "pclose" : "pdel"] })
      .then(() => loadClassLive()).then(render).catch((e) => alert(e.message));
    return;
  }
  const evk = ev.target.closest("[data-evkind]");
  if (evk) { EVF.kind = evk.dataset.evkind; render(); return; }
  const evd = ev.target.closest("[data-evdel]");
  if (evd) {
    if (!confirm("Видалити цей запис?")) return;
    adminApi("event-delete", { id: evd.dataset.evdel })
      .then(() => { EVENTS = EVENTS.filter((x) => x.id !== evd.dataset.evdel); render(); })
      .catch((e) => alert(e.message));
    return;
  }
  const rb = ev.target.closest("[data-rem]");
  if (rb) { toggleRem(rb.dataset.rem); return; }
  const chk = ev.target.closest("[data-done]");
  if (chk) {
    const id = chk.dataset.done, on = !DONE.has(id);
    setDone(id, on);
    doneToast(id, on);
    const onHome = (location.hash.slice(1) || "/") === "/";
    if (on && onHome) {
      const c = chk.closest(".card");
      c.classList.add("is-done", "leaving");
      chk.setAttribute("aria-checked", "true");
      chk.classList.add("pop");
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
  if (ev.target.closest("[data-strip]")) {
    STRIP_OPEN = !STRIP_OPEN;
    const el = document.getElementById("now");
    if (el) el.outerHTML = nowCard();
    const more = document.querySelector("#now .strip-more");
    if (more) more.classList.add("anim"); // анімація лише при натиску, не при щосекундному оновленні
    return;
  }
  const st = ev.target.closest("[data-set]");
  if (st) { saveSet({ [st.dataset.set]: !SET[st.dataset.set] }); render(); return; }
  const th = ev.target.closest("[data-theme-set]");
  if (th) { saveSet({ theme: th.dataset.themeSet }); render(); return; }
  if (ev.target.closest("[data-resetdone]")) {
    if (!confirm("Скинути всі галочки «виконано» на цьому пристрої?")) return;
    DONE = new Set(); try { localStorage.removeItem(DONE_KEY); } catch { /* */ } render(); return;
  }
  if (ev.target.closest("[data-allout]")) {
    if (ADMIN_TOKEN) adminApi("logout").catch(() => {});
    setToken(null); setGdz(null); render(); return;
  }
  const ad = ev.target.closest("[data-anndel]");
  if (ad) {
    if (!confirm("Прибрати це оголошення з сайту? (У каналі воно лишиться.)")) return;
    adminApi("ann-delete", { id: ad.dataset.anndel }).then(() => { ANNS = ANNS.filter((a) => a.id !== ad.dataset.anndel); render(); }).catch((e) => alert(e.message));
    return;
  }
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
  if (img) openViewer(img.dataset.img, img);
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
  if (ev.target.classList.contains("cm-form")) {
    ev.preventDefault();
    const hw = ev.target.dataset.chw, text = ev.target.t.value.trim();
    if (!text || CM_BUSY) return;
    CM_BUSY = true; render();
    try {
      const r = await fetch("api/comment/add", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hw, text, token: ACC.token, admin: ADMIN_TOKEN }) });
      const j = await r.json();
      if (!j.ok) throw new Error(j.error || "Не вдалося");
      (COMMENTS[hw] = COMMENTS[hw] || []).push(j.comment);
      CM_OPEN = null;
      showToast(`${ic("check")} Нотатку додано для всього класу`);
    } catch (e) { showToast(esc(e.message)); }
    CM_BUSY = false; render();
    return;
  }
  if (ev.target.classList.contains("note-form")) {
    ev.preventDefault();
    const v = ev.target.note.value.trim(), nid = ev.target.dataset.noteid;
    if (v) NOTES[nid] = v.slice(0, 500); else delete NOTES[nid];
    saveNotes(); NOTE_EDIT = null; render(); return;
  }
  if (id === "gradeform") {
    ev.preventDefault();
    const t = ev.target.tag.value, g = Number(ev.target.g.value);
    if (!t || !(g >= 1 && g <= 12)) return;
    GRADE_TAG = t;
    (GRADES[t] = GRADES[t] || []).push(Math.round(g)); saveGrades(); render();
    const inp = document.querySelector("#gradeform input[name=g]"); if (inp) inp.focus();
    return;
  }
  if (id === "pollform") {
    ev.preventDefault();
    const f = ev.target, btn = f.querySelector("[type=submit]");
    btn.disabled = true;
    try {
      const j = await adminApi("poll-add", { question: f.question.value, options: f.options.value, channel: f.channel.checked });
      await loadClassLive();
      showToast(`${ic("check")} Опитування створено${j.channel_error ? " (у канал не вдалося)" : ""}`);
      render();
    } catch (e) { btn.disabled = false; alert(e.message); }
    return;
  }
  if (id === "evform") {
    ev.preventDefault();
    const f = new FormData(ev.target), btn = ev.target.querySelector("[type=submit]");
    btn.disabled = true;
    try {
      const j = await adminApi("event-add", { kind: EVF.kind, ...Object.fromEntries(f.entries()) });
      EVENTS = EVENTS.filter((x) => x.id !== j.event.id).concat(j.event);
      showToast(`${ic("check")} Додано у «${EVF.kind === "project" || EVF.kind === "own" ? "Проєкти" : "Тести"}»`);
      render();
    } catch (e) { btn.disabled = false; alert(e.message); }
    return;
  }
  if (id === "lock") {
    ev.preventDefault();
    const err = document.getElementById("lock-err");
    err.textContent = "";
    try {
      const r = await fetch("api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: document.getElementById("lock-pw").value, acc: ACC.token }) });
      const j = await r.json();
      if (!j.ok) { err.textContent = j.error || "Неправильний пароль"; return; }
      if (j.role === "admin") { setToken(j.token); render(); return; }
      setGdz(j.gtoken, j.atoken || null);
      location.hash = "#/secret";
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
      alert(j.channel ? "ДЗ додано на сайт і в канал" : `ДЗ додано на сайт${body.channel ? `\nКанал: ${j.channel_error}` : ""}`);
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
  if (id === "chanform") {
    ev.preventDefault();
    try {
      const j = await adminApi("channels", { list: document.getElementById("chan-list").value.split(/\n+/).map((x) => x.trim()).filter(Boolean) });
      AIA.channels = j.channels; render(); alert(`Збережено каналів: ${j.channels.length}`);
    } catch (e) { alert(e.message); }
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
      alert(j.channel ? "Збережено на сайті й у каналі" : `Збережено на сайті\nКанал не змінено: ${j.channel_error}`);
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

// ---------- спливне «Позначено · Скасувати» ----------
const TOAST = { el: null, t: 0, undo: null };
function showToast(html, undo) {
  if (!TOAST.el) {
    TOAST.el = document.createElement("div");
    TOAST.el.className = "toast"; TOAST.el.setAttribute("role", "status");
    TOAST.el.addEventListener("click", (e) => {
      if (!e.target.closest("[data-undo]")) return;
      const u = TOAST.undo; hideToast(); if (u) u();
    });
    document.body.append(TOAST.el);
  }
  TOAST.undo = undo;
  TOAST.el.innerHTML = `<span>${html}</span>${undo ? `<button type="button" data-undo>${ic("undo")} Скасувати</button>` : ""}`;
  TOAST.el.classList.remove("show"); void TOAST.el.offsetWidth; TOAST.el.classList.add("show");
  clearTimeout(TOAST.t);
  TOAST.t = setTimeout(hideToast, 4500);
}
function hideToast() { if (TOAST.el) TOAST.el.classList.remove("show"); TOAST.undo = null; }
function doneToast(id, on) {
  showToast(on ? `${ic("check")} Позначено виконаним` : "Повернуто в невиконане", () => {
    setDone(id, !on);
    if (GDZ.open) renderModal();
    render();
  });
}

// ---------- свайп картки вправо = виконано (телефон) ----------
let SWIPE = null;
document.addEventListener("touchstart", (e) => {
  SWIPE = null;
  const c = e.target.closest(".card");
  if (!c || e.touches.length > 1 || e.target.closest("a, button, input, textarea, select, summary, .crop, form")) return;
  const chk = c.querySelector("[data-done]");
  if (!chk) return;
  SWIPE = { c, chk, x: e.touches[0].clientX, y: e.touches[0].clientY, dx: 0, dir: null };
}, { passive: true });
document.addEventListener("touchmove", (e) => {
  if (!SWIPE) return;
  const t = e.touches[0], dx = t.clientX - SWIPE.x, dy = t.clientY - SWIPE.y;
  if (!SWIPE.dir) {
    if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
    SWIPE.dir = dx > 0 && Math.abs(dx) > Math.abs(dy) * 1.5 ? "x" : "y";
    if (SWIPE.dir === "x") SWIPE.c.classList.add("swiping");
  }
  if (SWIPE.dir !== "x") return;
  e.preventDefault();
  SWIPE.dx = Math.max(0, dx);
  SWIPE.c.style.transform = `translateX(${Math.min(SWIPE.dx, 140)}px)`;
  SWIPE.c.classList.toggle("swipe-ready", SWIPE.dx > 90);
}, { passive: false });
const swipeEnd = () => {
  const s = SWIPE; SWIPE = null;
  if (!s || s.dir !== "x") return;
  s.c.classList.remove("swiping", "swipe-ready");
  s.c.style.transform = "";
  if (s.dx > 90) s.chk.click();
};
document.addEventListener("touchend", swipeEnd);
document.addEventListener("touchcancel", () => { if (SWIPE) { SWIPE.dx = 0; swipeEnd(); } });

// ---------- нагадування ----------
// dz-rem: {id ДЗ: час у мс}. Спрацьовує, поки сайт відкритий (вкладка чи застосунок у фоні).
let REM = (() => { try { return JSON.parse(localStorage.getItem("dz-rem")) || {}; } catch { return {}; } })();
const saveRem = () => { try { localStorage.setItem("dz-rem", JSON.stringify(REM)); } catch { /* */ } queueSync(); };
function remTime(e) {
  const now = new Date(), at = new Date(now); at.setHours(18, 0, 0, 0);
  if (at <= now) at.setDate(at.getDate() + 1);
  const dueMorning = parse(e.due); dueMorning.setHours(8, 0, 0, 0);
  return at < dueMorning ? at.getTime() : now.getTime() + 30 * 60000; // не пізніше ранку здачі
}
async function toggleRem(id) {
  if (REM[id]) { delete REM[id]; saveRem(); render(); showToast("Нагадування скасовано"); return; }
  const e = RAW.find((x) => String(x.id) === id);
  if (!e) return;
  if ("Notification" in window && Notification.permission === "default") {
    try { await Notification.requestPermission(); } catch { /* */ }
  }
  REM[id] = remTime(e); saveRem(); render();
  const denied = !("Notification" in window) || Notification.permission === "denied";
  showToast(`${ic("bell")} Нагадаю ${hm(REM[id])}${denied ? " — увімкни сповіщення для сайту" : ""}`, () => { delete REM[id]; saveRem(); render(); });
}
async function remTick() {
  const now = Date.now();
  let changed = false;
  for (const [id, at] of Object.entries(REM)) {
    const e = RAW.find((x) => String(x.id) === id);
    if (!e || DONE.has(id)) { delete REM[id]; changed = true; continue; }
    if (at > now) continue;
    delete REM[id]; changed = true;
    const title = `ДЗ: ${subj(e.tag).name}`, body = `${(e.homework || "").slice(0, 120)}\nЗдати ${relDay(e.due)}`;
    try {
      const reg = navigator.serviceWorker && await navigator.serviceWorker.getRegistration();
      if (Notification.permission !== "granted") throw new Error("no permission");
      if (reg) await reg.showNotification(title, { body, tag: `dz-${id}`, icon: "icons/apple-touch-icon.png", data: { url: "./#/s/" + encodeURIComponent(e.tag) } });
      else new Notification(title, { body });
    } catch { showToast(`${ic("bell")} ${esc(title)} — не забудь!`); }
  }
  if (changed) { saveRem(); if (document.querySelector("[data-rem]")) safeRender(); }
}
setInterval(remTick, 20000);
document.addEventListener("visibilitychange", () => { if (!document.hidden) remTick(); });

// ---------- змах на «Розкладі» (тижні) і в «Календарі» (місяці) ----------
let PSW = null;
document.addEventListener("touchstart", (e) => {
  PSW = null;
  const tab = location.hash.slice(1) || "/";
  if ((tab !== "/week" && tab !== "/cal") || e.touches.length > 1) return;
  if (e.target.closest(".card, .prefs, input, textarea, .drawer, .modal, .viewer, .bnav, .top")) return;
  PSW = { x: e.touches[0].clientX, y: e.touches[0].clientY, tab };
}, { passive: true });
document.addEventListener("touchend", (e) => {
  if (!PSW) return;
  const t = e.changedTouches[0], dx = t.clientX - PSW.x, dy = t.clientY - PSW.y, tab = PSW.tab;
  PSW = null;
  if (Math.abs(dx) < 70 || Math.abs(dy) > Math.abs(dx) * 0.6) return;
  const d = dx < 0 ? 1 : -1;
  if (tab === "/week") weekOff += d;
  else calMonth = new Date(calMonth.getFullYear(), calMonth.getMonth() + d, 1);
  render();
  app.classList.remove("slide-l", "slide-r"); void app.offsetWidth; app.classList.add(d > 0 ? "slide-l" : "slide-r");
});

// ---------- «Сайт оновлено · Перезавантажити» ----------
let SITE_VER = null;
async function checkVersion() {
  try {
    const v = (await fetch(`api/version?t=${Date.now()}`, { cache: "no-store" }).then((r) => r.json())).version;
    if (!v) return;
    if (SITE_VER === null) {
      SITE_VER = v;
      // код береться з памʼяті телефона: якщо на сервері вже новіша версія — запропонувати перезавантажити
      let prev = null;
      try { prev = localStorage.getItem("dz-ver"); localStorage.setItem("dz-ver", v); } catch { /* */ }
      if (prev && prev !== v) showUpdateBar();
      return;
    }
    if (v !== SITE_VER) { try { localStorage.setItem("dz-ver", v); } catch { /* */ } showUpdateBar(); }
  } catch { /* немає звʼязку */ }
}
function showUpdateBar() {
  if (document.querySelector(".upbar")) return;
  const bar = document.createElement("div");
  bar.className = "upbar"; bar.setAttribute("role", "status");
  bar.innerHTML = `<span>${ic("refresh")} Сайт оновлено</span><button type="button">Перезавантажити</button>`;
  bar.querySelector("button").addEventListener("click", () => location.reload());
  document.body.append(bar);
}
checkVersion();
setInterval(checkVersion, 60000);

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

// ---------- перегляд фото: на весь екран, гортання змахом і стрілками ----------
const viewer = document.getElementById("viewer");
const VIEW = { list: [], i: 0 };
function showView() {
  const im = viewer.querySelector("img");
  im.src = VIEW.list[VIEW.i];
  im.style.animation = "none"; void im.offsetWidth; im.style.animation = "";
  const many = VIEW.list.length > 1;
  viewer.querySelector(".vcount").textContent = many ? `${VIEW.i + 1} / ${VIEW.list.length}` : "";
  viewer.querySelector(".vprev").hidden = !many; viewer.querySelector(".vnext").hidden = !many;
}
function openViewer(src, from) {
  const box = from && from.closest(".thumbs, .task, .tasks, .gdz-res, .mini-body, .files, ul, .card");
  const list = box ? [...new Set([...box.querySelectorAll("[data-img]")].map((b) => b.dataset.img))] : [];
  VIEW.list = list.length ? list : [src];
  VIEW.i = Math.max(0, VIEW.list.indexOf(src));
  showView();
  viewer.hidden = false;
}
const viewStep = (d) => { if (VIEW.list.length < 2) return; VIEW.i = (VIEW.i + d + VIEW.list.length) % VIEW.list.length; showView(); };
viewer.addEventListener("click", (e) => {
  if (e.target.closest(".vprev")) return viewStep(-1);
  if (e.target.closest(".vnext")) return viewStep(1);
  if (VIEW.swiped) { VIEW.swiped = false; return; }
  viewer.hidden = true;
});
viewer.addEventListener("touchstart", (e) => { VIEW.x = e.touches[0].clientX; VIEW.y = e.touches[0].clientY; }, { passive: true });
viewer.addEventListener("touchend", (e) => {
  const t = e.changedTouches[0], dx = t.clientX - VIEW.x, dy = t.clientY - VIEW.y;
  if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) { VIEW.swiped = true; viewStep(dx < 0 ? 1 : -1); setTimeout(() => { VIEW.swiped = false; }, 400); }
});
document.addEventListener("keydown", (e) => {
  if (!viewer.hidden && (e.key === "ArrowLeft" || e.key === "ArrowRight")) { viewStep(e.key === "ArrowLeft" ? -1 : 1); return; }
  if (e.key !== "Escape") return;
  if (!viewer.hidden) { viewer.hidden = true; return; }
  if (GDZ.open) { closeModal(); return; }
  setDrawer(false);
});

const get = (u, fallback) => fetch(`${u}${u.includes("?") ? "&" : "?"}t=${Date.now()}`, { cache: "no-store" })
  .then((r) => {
    if (r.headers.get("X-Offline")) { // відповів service worker зі збереженої копії
      NET.ok = false;
      if (!NET.at) NET.at = Date.parse(r.headers.get("Date") || "") || 0;
    } else if (r.ok) { NET.ok = true; NET.at = Date.now(); }
    return r.ok ? r.json() : fallback;
  })
  .catch(() => { NET.ok = false; return fallback; });
const okAlerts = (a) => a && Array.isArray(a.list);
function loadClassLive() {
  return Promise.all([get("data/announcements.json", []), get("data/lunch.json", {}), get("data/visits.json", {}), get("data/alert_ai.json", {}), get("data/events.json", null), fetch(`data/polls.json?d=${DEVICE}&t=${Date.now()}`, { cache: "no-store", headers: ACC.token ? { "X-Session": ACC.token } : {} })
    .then((r) => (r.ok ? r.json() : null)).catch(() => null)])
    .then(async ([a, l, v, ai, ev, pl]) => {
      await loadComments();
      if (Array.isArray(ev)) EVENTS = ev;
      if (Array.isArray(pl)) POLLS = pl;
      ANNS = Array.isArray(a) ? a : []; LUNCH = l && typeof l === "object" ? l : {};
      VISITS = v && typeof v === "object" && !Array.isArray(v) ? v : {}; AIA = ai && typeof ai === "object" ? ai : {};
    });
}
// ---------- запуск: спершу збережена копія (миттєво), потім свіжі дані одним запитом ----------
function applyBoot(b) {
  if (!b || typeof b !== "object") return false;
  if (b.class && Array.isArray(b.class.seats)) CLASS = b.class;
  RAW = Array.isArray(b.homework) ? b.homework : RAW;
  FILES = Array.isArray(b.files) ? b.files : FILES;
  if (b.school) SCHOOL = Object.assign(SCHOOL, b.school);
  if (okAlerts(b.alerts)) ALERTS = b.alerts;
  if (Array.isArray(b.announcements)) ANNS = b.announcements;
  if (b.lunch && typeof b.lunch === "object") LUNCH = b.lunch;
  if (b.visits && typeof b.visits === "object" && !Array.isArray(b.visits)) VISITS = b.visits;
  if (b.alert_ai && typeof b.alert_ai === "object") AIA = b.alert_ai;
  if (Array.isArray(b.events)) EVENTS = b.events;
  applyPref();
  return true;
}
let BOOTED = false;
function firstShow() {
  if (BOOTED) return;
  BOOTED = true;
  if (!PREF) showSetup();
  if (ADMIN_TOKEN) adminApi("check").catch(() => {}); // прострочений ключ — тихо вийти з адмін-режиму
  if (GDZ_TOKEN) gdzApi("check", {}).catch(() => {});
}
(() => {
  try {
    const saved = JSON.parse(localStorage.getItem("dz-boot") || "null");
    if (saved && applyBoot(saved.b)) {
      NET.at = saved.at || 0;
      render();
      firstShow();
    }
  } catch { /* немає збереженої копії */ }
})();
async function boot() {
  const b = await get("data/boot.json", null);
  if (b && applyBoot(b)) {
    try { localStorage.setItem("dz-boot", JSON.stringify({ at: Date.now(), b })); } catch { /* замало місця — не страшно */ }
    safeRender();
    firstShow();
  } else if (!BOOTED) {
    // старий сервер або немає звʼязку — як раніше, окремими запитами
    const [hw, school, files, al, cls] = await Promise.all([get("data/homework.json", []), get("data/school.json", null),
      get("data/files.json", []), get("data/alerts.json", null), get("data/class.json", null)]);
    applyBoot({ homework: hw, school, files, alerts: al, class: cls });
    render();
    firstShow();
  }
  // опитування й нотатки класу залежать від акаунта — довантажуються після показу
  loadClassLive().then(() => safeRender());
}
boot();
app.addEventListener("input", (ev) => {
  if (ev.target.id === "book-q") { bookSearch(ev.target.value); return; }
  if (ev.target.id !== "hw-q") return;
  SEARCH_Q = ev.target.value;
  const res = document.getElementById("hw-res");
  if (res) res.innerHTML = searchResults(SEARCH_Q);
  document.querySelectorAll("#app .group, #app .tiles").forEach((x) => { x.hidden = !!SEARCH_Q.trim(); });
});

// Перемалювати, якщо людина зараз нічого не вводить і не відкрито вікон
function safeRender() {
  const f = document.activeElement;
  if (f && (f.matches("input, textarea, select") || f.isContentEditable)) return;
  if (!document.querySelector(".setup") && !drawer.classList.contains("open") && !GDZ.open) render();
}
addEventListener("online", () => { get("data/homework.json", null).then(() => safeRender()); });
addEventListener("offline", () => { NET.ok = false; safeRender(); });
if ("serviceWorker" in navigator && location.protocol !== "file:") {
  addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
}
// iOS: після клавіатури Safari інколи лишає нижню панель посеред екрана — перераховуємо її,
// а поки клавіатура відкрита — ховаємо
(() => {
  const vv = window.visualViewport, bar = document.querySelector(".bnav");
  if (!vv || !bar) return;
  const sync = () => {
    document.body.classList.toggle("kb-open", vv.height < window.innerHeight * 0.75);
    bar.style.transform = "translateZ(0)";
    requestAnimationFrame(() => { bar.style.transform = ""; });
  };
  vv.addEventListener("resize", sync);
  document.addEventListener("focusout", () => setTimeout(() => { window.scrollTo(window.scrollX, window.scrollY); sync(); }, 120));
  window.addEventListener("orientationchange", () => setTimeout(sync, 300));
})();
if (ACC.token) pullSync();
setInterval(() => pullSync(), 30000);
document.addEventListener("visibilitychange", () => { if (!document.hidden) pullSync(); });
// Тривоги й ДЗ оновлюються кожні 30 с; сторінку перемальовуємо, лише коли щось змінилось
setInterval(async () => {
  const wasNet = NET.ok;
  const [al, hw] = await Promise.all([get("data/alerts.json", null), get("data/homework.json", null), loadClassLive()]);
  let hwChanged = false;
  if (Array.isArray(hw) && JSON.stringify(hw) !== JSON.stringify(RAW)) { RAW = hw; hwChanged = true; }
  if (!okAlerts(al)) { if (wasNet !== NET.ok) safeRender(); return; }
  const was = JSON.stringify([ALERTS.now, ALERTS.list]) + JSON.stringify([AIA.risk, AIA.threat]);
  ALERTS = al;
  const tab = decodeURIComponent(location.hash.slice(1) || "/");
  if (hwChanged || wasNet !== NET.ok || was !== JSON.stringify([al.now, al.list]) + JSON.stringify([AIA.risk, AIA.threat]) || tab === "/alerts" || tab === "/") {
    applyPref();
    safeRender();
  }
}, 30000);
