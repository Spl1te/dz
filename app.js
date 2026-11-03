"use strict";
// Сайт ДЗ 8-Д. Дані — homework.json, його пише бот (homework-bot/website.py).

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
const S = Object.fromEntries(SUBJECTS.map(([t, n, c]) => [t, { name: n, color: c }]));
const subj = (t) => S[t] || { name: t, color: "#868e96" };

// Канікули (як у homework-bot/schedule.py)
const HOLIDAYS = [["2026-10-26", "2026-11-01"], ["2026-12-24", "2027-01-10"],
                  ["2027-03-22", "2027-03-28"], ["2027-06-01", "2027-08-31"]];

const WD = ["неділя", "понеділок", "вівторок", "середа", "четвер", "пʼятниця", "субота"];
const WD_SHORT = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];
const MON = ["січня", "лютого", "березня", "квітня", "травня", "червня", "липня",
             "серпня", "вересня", "жовтня", "листопада", "грудня"];
const MON_N = ["січень", "лютий", "березень", "квітень", "травень", "червень", "липень",
               "серпень", "вересень", "жовтень", "листопад", "грудень"];

// ---------- дати (локальні, без часових поясів) ----------
const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const parse = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const TODAY = iso(new Date());
const short = (s) => { const d = parse(s); return `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}`; };
const longDay = (s) => { const d = parse(s); return `${d.getDate()} ${MON[d.getMonth()]}`; };
const isHoliday = (s) => HOLIDAYS.some(([a, b]) => s >= a && s <= b);
function relDay(s) {
  if (s === TODAY) return "сьогодні";
  if (s === iso(addDays(new Date(), 1))) return "завтра";
  if (s === iso(addDays(new Date(), 2))) return "післязавтра";
  return WD[parse(s).getDay()];
}

// ---------- дані ----------
let ALL = [];
const byDue = () => {
  const m = {};
  for (const e of ALL) if (e.due) (m[e.due] ||= []).push(e);
  return m;
};

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
const linkify = (s) => esc(s).replace(/https?:\/\/[^\s<]+[^\s<.,;:!?)\]]/g, (u) => `<a href="${u}" target="_blank" rel="noopener">${u}</a>`);

function card(e, { showSubj = true } = {}) {
  const s = subj(e.tag);
  const dates = `задано ${short(e.given)}` + (e.due ? ` → здати ${short(e.due)}` : "");
  const photos = (e.photos || []).map((p) =>
    `<button data-img="${esc(p)}" aria-label="Відкрити фото"><img src="${esc(p)}" loading="lazy" alt="Фото дошки"></button>`).join("");
  return `<article class="card" style="--c:${s.color}">
    <div class="head">${showSubj ? `<a class="subj" href="#/s/${encodeURIComponent(e.tag)}">${esc(s.name)}</a>` : "<span></span>"}
      <span class="dates">${dates}</span></div>
    <p class="hw">${linkify(e.homework)}</p>
    ${photos ? `<div class="thumbs">${photos}</div>` : ""}
  </article>`;
}
const sortSubj = (list) => [...list].sort((a, b) =>
  SUBJECTS.findIndex((x) => x[0] === a.tag) - SUBJECTS.findIndex((x) => x[0] === b.tag));

// ---------- сторінки ----------
function home() {
  const due = byDue();
  const days = Object.keys(due).filter((d) => d > TODAY).sort();
  let html = "";
  if (!days.length) {
    html += `<h1>Нічого не задано</h1><p class="sub">Найближчими днями здавати нічого.</p>`;
  } else {
    const first = days[0];
    html += `<h1>Здати ${relDay(first)}</h1><p class="sub">${longDay(first)} · ${due[first].length} ${plural(due[first].length)}</p>`;
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

let calMonth = null, calSel = null;
function cal() {
  const due = byDue();
  if (!calMonth) {
    const firstFuture = Object.keys(due).filter((d) => d > TODAY).sort()[0];
    calSel = firstFuture || TODAY;
    const d = parse(calSel);
    calMonth = new Date(d.getFullYear(), d.getMonth(), 1);
  }
  const y = calMonth.getFullYear(), m = calMonth.getMonth();
  const startPad = (new Date(y, m, 1).getDay() + 6) % 7;
  const daysIn = new Date(y, m + 1, 0).getDate();
  let cells = WD_SHORT.map((w) => `<div class="wd">${w}</div>`).join("");
  for (let i = 0; i < startPad; i++) cells += `<div class="d out"></div>`;
  for (let n = 1; n <= daysIn; n++) {
    const d = new Date(y, m, n), s = iso(d), wk = d.getDay() === 0 || d.getDay() === 6;
    const items = due[s] || [];
    const cls = ["d", wk && "wk", !wk && isHoliday(s) && "hol", s === TODAY && "today", s === calSel && "sel"].filter(Boolean).join(" ");
    const dots = sortSubj(items).map((e) => `<i class="dot" style="--c:${subj(e.tag).color}"></i>`).join("");
    const label = `${n} ${MON[m]}${items.length ? `, ${items.length} ${plural(items.length)}` : ""}`;
    cells += `<button class="${cls}" data-day="${s}" aria-label="${label}">${n}<span class="dots">${dots}</span></button>`;
  }
  const sel = due[calSel] || [];
  return `<div class="cal-nav"><button data-mon="-1" aria-label="Попередній місяць">‹</button>
      <h1>${MON_N[m]} ${y}</h1><button data-mon="1" aria-label="Наступний місяць">›</button></div>
    <div class="grid">${cells}</div>
    <p class="legend">Кольорові крапки — дні, коли треба здати ДЗ. Натисни на день.</p>
    <div class="day-h"><b>${cap(relDay(calSel))}</b><span>${longDay(calSel)}</span></div>
    ${sel.length ? sortSubj(sel).map((e) => card(e)).join("") : `<div class="empty">На цей день нічого не задано.</div>`}`;
}

function subjects() {
  const count = {};
  for (const e of ALL) count[e.tag] = (count[e.tag] || 0) + 1;
  const tiles = SUBJECTS.map(([t, n, c]) => {
    const k = count[t] || 0;
    if (t === "Укр" && !k) return "";  // загальний тег — тільки якщо щось є
    return `<a class="tile${k ? "" : " none"}" style="--c:${c}" href="#/s/${encodeURIComponent(t)}">
      <b>${esc(n)}</b><span>${k ? `${k} ${plural(k)}` : "поки нічого"}</span></a>`;
  }).join("");
  return `<h1>Предмети</h1><p class="sub">Усі ДЗ за предметом, найновіші зверху.</p><div class="tiles">${tiles}</div>`;
}

function subject(tag) {
  const s = subj(tag);
  const list = ALL.filter((e) => e.tag === tag).sort((a, b) => (b.given + b.added).localeCompare(a.given + a.added));
  return `<a class="back" href="#/s">‹ Предмети</a>
    <h1 style="color:${s.color}">${esc(s.name)}</h1><p class="sub">${list.length ? `${list.length} ${plural(list.length)}` : ""}</p>
    ${list.length ? list.map((e) => card(e, { showSubj: false })).join("") : `<div class="empty">З цього предмета ще нічого не задавали.</div>`}`;
}

const cap = (s) => s[0].toUpperCase() + s.slice(1);
function plural(n) {
  // 1, 2–4 → «завдання»; 0, 5–20 → «завдань»
  const a = n % 10, b = n % 100;
  return a >= 1 && a <= 4 && (b < 11 || b > 14) ? "завдання" : "завдань";
}

// ---------- роутинг ----------
const app = document.getElementById("app");
function render() {
  const h = decodeURIComponent(location.hash.slice(1) || "/");
  let tab = "home", html;
  if (h === "/cal") { tab = "cal"; html = cal(); }
  else if (h === "/s") { tab = "subj"; html = subjects(); }
  else if (h.startsWith("/s/")) { tab = "subj"; html = subject(h.slice(3)); }
  else html = home();
  app.innerHTML = html;
  document.querySelectorAll(".tabs a").forEach((a) => a.classList.toggle("on", a.dataset.tab === tab));
}
window.addEventListener("hashchange", () => { render(); scrollTo(0, 0); });

app.addEventListener("click", (ev) => {
  const day = ev.target.closest("[data-day]");
  if (day) { calSel = day.dataset.day; render(); return; }
  const mon = ev.target.closest("[data-mon]");
  if (mon) { calMonth = new Date(calMonth.getFullYear(), calMonth.getMonth() + Number(mon.dataset.mon), 1); render(); return; }
  const img = ev.target.closest("[data-img]");
  if (img) openViewer(img.dataset.img);
});

const viewer = document.getElementById("viewer");
function openViewer(src) { viewer.querySelector("img").src = src; viewer.hidden = false; }
viewer.addEventListener("click", () => { viewer.hidden = true; });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") viewer.hidden = true; });

fetch(`homework.json?t=${Date.now()}`, { cache: "no-store" })
  .then((r) => (r.ok ? r.json() : []))
  .catch(() => [])
  .then((data) => { ALL = Array.isArray(data) ? data : []; render(); });
