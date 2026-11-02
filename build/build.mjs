// Сборка всех сайтов: node build/build.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as C from './content.mjs';
import { I } from './icons.mjs';
import T1 from './texts/v1.mjs';
import T2 from './texts/v2.mjs';
import * as V3 from './sites/v3.mjs';
import * as V4 from './sites/v4.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SPY = C.SPY;

const SITES = [
  {
    id: 'v1', out: 'site-11', online: 2293, color: '#0E0E14', T: { ...T1, blog: T1.blog || C.BLOG },
    vars: { bg: '#0E0E14', 'bg-rgb': '14,14,20', bg2: '#14131C', card: '#1A1924', 'card-h': '#22202E', line: 'rgba(255,255,255,.07)', line2: 'rgba(255,255,255,.12)', acc: '#8B6CFF', 'acc-h': '#B09CFF', 'acc-d': '#6247D9', 'acc-m': 'rgba(139,108,255,.14)', 'acc-b': 'rgba(139,108,255,.38)', 'acc-rgb': '139,108,255', text: '#F3F1FA', muted: '#BDB8CC', dim: '#86819A', ease: 'cubic-bezier(.22,1,.36,1)' },
    heroCase: ['case20', 'Premium · ~$3'], heroDrop: ['asiimov', 'AWP · ~$28'], chance: 52,
    noFeed: true, skins: 'skins', // ленты дропа на копиях 11–12 нет
  },
  {
    id: 'v2', out: 'site-12', online: 2417, color: '#110D13', T: T2,
    vars: { bg: '#110D13', 'bg-rgb': '17,13,19', bg2: '#17111A', card: '#1E1822', 'card-h': '#271F2C', line: 'rgba(255,255,255,.07)', line2: 'rgba(255,255,255,.12)', acc: '#B35CF2', 'acc-h': '#CF92F8', 'acc-d': '#8A3BC8', 'acc-m': 'rgba(179,92,242,.14)', 'acc-b': 'rgba(179,92,242,.38)', 'acc-rgb': '179,92,242', text: '#F8F1FA', muted: '#C6B8CC', dim: '#8C8195', ease: 'cubic-bezier(.22,1,.36,1)' },
    heroCase: ['metal03', 'Premium · ~$3'], heroCaseDir: 'cases2', heroDrop: ['awp-manowar', 'AWP · ~$28'], chance: 52,
    noFeed: true, // ленты дропа на копиях 11–12 нет
    // свой набор скинов (футер, hero) — не пересекается с сайтом 1
    skins: 'skins2', drops: JSON.parse(fs.readFileSync(path.join(ROOT, '_shared/skins2/drops.json'), 'utf8')).map(([k, n, r]) => [k, n, r]),
    footSkins: ['bowie-fade', 'gut-doppler', 'hydra-emerald', 'daggers-fade', 'm4a4-asiimov'],
  },
  V3.site,
  V4.site,
];
// остальные сайты — build/sites/vN.mjs (v5, v6, v8 убраны в build/archive/).
// Номера папок: v1→site-11, v2→site-12, v11–v13→site-13–15 (копии), v3→site-16, v4→site-17, v7→site-18, v9→site-19, v10→site-20
for (let n = 5; n <= 13; n++) {
  const f = path.join(path.dirname(fileURLToPath(import.meta.url)), `sites/v${n}.mjs`);
  if (fs.existsSync(f)) SITES.push((await import(`./sites/v${n}.mjs`)).site);
}

// ---------- Общие куски ----------
const ext = (cls, inner, extra = '') => `<a class="${cls}" href="${SPY}" rel="nofollow"${extra}>${inner}</a>`;
const steamBtn = (cls = 'btn btn--primary btn--sm', label = 'Войти через Steam') => ext(cls, `${I.steam}<span>${label}</span>`);
const tag = t => `<span class="tag">${t}</span>`;
const paras = arr => arr.map(p => `<p>${p}</p>`).join('');
const pad = n => String(n).padStart(2, '0');
const esc = t => t.replace(/<[^>]+>/g, '').replace(/"/g, '&quot;');

function logo() {
  return `<a href="/" class="logo" aria-label="мусор дроп — главная"><img src="/assets/logo.svg" alt="Musor Drop — кейсы CS2" width="36" height="36"><span><span class="logo__name">Musor Drop</span><span class="logo__tag">мусор дроп · CS2</span></span></a>`;
}

function header(s, cur) {
  if (s.header) return s.header(s, cur);
  const nav = C.NAV.map(([h, t]) => `<a href="${h}"${cur.startsWith(h) ? ' class="is-active"' : ''}>${t}</a>`).join('');
  const mnav = C.SECTIONS.map(([h, t]) => `<a href="${h}">${t}</a>`).join('');
  return `<header class="header"><div class="container header__in">${logo()}<nav class="nav" aria-label="Основное меню">${nav}</nav><div class="header__cta">${steamBtn()}</div><button class="burger" type="button" aria-label="Меню" aria-expanded="false">${I.menu}</button></div></header>
<nav class="mnav" aria-label="Мобильное меню">${mnav}${steamBtn('btn btn--primary')}</nav>`;
}

function feed(s) {
  let list = [...(s.drops || C.DROPS)]; // у сайтов 11–13 своя лента из своих скинов
  if (s.id === 'v2') list = [...list.slice(7), ...list.slice(0, 7)].reverse();
  if (s.feedOrder) list = s.feedOrder(list);
  const cards = list.map(([k, n, r]) => `<a class="drop" data-r="${r}" href="${SPY}" rel="nofollow" title="${n}"><img src="/assets/skins/${k}.webp" alt="" width="84" height="48"><span>${n}</span></a>`).join('');
  return `<div class="feed" aria-label="Лента дропа">
<div class="feed__side"><a class="feed__online" href="${SPY}" rel="nofollow" title="Сейчас онлайн">${I.wifi}<span data-online>${s.online}</span></a><div class="feed__btns"><a class="feed__btn" href="${SPY}" rel="nofollow" title="Кейсы">${I.dots}</a><a class="feed__btn" href="${SPY}" rel="nofollow" title="Апгрейд">${I.sparkles}</a></div></div>
<div class="feed__view"><div class="feed__track">${cards}${cards.replace(/<a class="drop"/g, '<a class="drop" aria-hidden="true" tabindex="-1"')}</div></div>
</div>`;
}

function footer(s) {
  if (s.footer) return s.footer(s);
  const U = s.T.ui;
  if (s.id === 'v1') {
    const a = C.SECTIONS.slice(0, 4), b = C.SECTIONS.slice(4);
    const ul = l => `<ul>${l.map(([h, t]) => `<li><a href="${h}">${t}</a></li>`).join('')}</ul>`;
    return `<footer class="footer1"><div class="container">
<div class="footer1__grid">
<div>${logo()}<p class="footer1__about">${U.footerAbout}</p>${steamBtn()}</div>
<div><h4>Платформа</h4>${ul(a)}</div>
<div><h4>Помощь</h4>${ul(b)}</div>
<div class="footer1__status"><div class="footer1__online"><i></i><span data-online>${s.online}</span>&nbsp;онлайн</div><p>${U.footerNote}</p><span class="age">18+</span></div>
</div>
<div class="footer1__bottom"><span>© 2026 мусор дроп · Musor Drop. Все права защищены.</span><a href="mailto:${C.EMAIL}">${C.EMAIL}</a></div>
</div></footer>`;
  }
  const imgs = (s.footSkins || ['doppler', 'dragonlore', 'pandora', 'howl', 'fade']).map(k => `<img src="/assets/skins/${k}.webp" alt="">`).join('');
  return `<footer class="footer2"><div class="container">
<div class="footer2__cta"><div class="imgs">${imgs}</div><h2>${U.footerCtaTitle}</h2><p>${U.footerCtaText}</p>${steamBtn('btn btn--primary')}</div>
<div class="footer2__row">${logo()}<nav class="footer2__links" aria-label="Разделы">${C.SECTIONS.map(([h, t]) => `<a href="${h}">${t}</a>`).join('')}</nav><a class="footer2__top" href="#top" aria-label="Наверх">${I.top}</a></div>
<div class="footer2__bottom"><p>${U.footerLegal} Поддержка: <a href="mailto:${C.EMAIL}">${C.EMAIL}</a>. © 2026 Musor Drop.</p><div class="footer2__badges"><span>18+</span><span>Provably fair</span></div></div>
</div></footer>`;
}

function layout(s, { path: p, meta, body, ld }) {
  const [title, desc] = meta;
  return `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<meta name="description" content="${esc(desc)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:type" content="website">
<meta name="theme-color" content="${s.color}">
<link rel="icon" href="/assets/logo.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${s.fonts || 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap'}" rel="stylesheet">
<link rel="stylesheet" href="/assets/site.css">${ld ? `
<script type="application/ld+json">${JSON.stringify(ld)}</script>` : ''}
</head>
<body class="${s.id}" id="top">
<a class="skip" href="#main">Перейти к содержимому</a>
${header(s, p)}
${s.noFeed ? '' : feed(s)}
<main id="main">
${body}
</main>
${footer(s)}
<script src="/assets/main.js" defer></script>
</body>
</html>`;
}

// ---------- Блоки с вариантами ----------
function faqBlock(s, items, { cats = true } = {}) {
  if (s.id === 'v1') {
    return `<div class="faq1">${items.map(([, q, a], i) => `<details${i === 0 ? ' open' : ''}><summary class="faq-q"><i>${pad(i + 1)}</i><span>${q}</span><span class="faq-ico">${I.plus}</span></summary><div class="faq-a">${a}</div></details>`).join('')}</div>`;
  }
  const used = C.FAQ_CATS.filter(([k]) => items.some(it => it[0] === k));
  const useTabs = cats && used.length > 1;
  const first = useTabs ? used[0][0] : null;
  let opened = false;
  const list = items.map(([c, q, a]) => {
    const hide = useTabs && c !== first;
    const open = !hide && !opened; if (open) opened = true;
    return `<details data-cat="${c}"${hide ? ' hidden' : ''}${open ? ' open' : ''}><summary class="faq-q"><span>${q}</span><span class="faq-ico">${I.chevron}</span></summary><div class="faq-a">${a}</div></details>`;
  }).join('');
  const tabs = useTabs ? `<div class="faq2__tabs" role="tablist">${used.map(([k, t], i) => `<button class="faq2__tab${i === 0 ? ' is-on' : ''}" type="button" role="tab" aria-selected="${i === 0}" data-tab="${k}">${t}</button>`).join('')}</div>` : '';
  return `<div class="faq2" data-faq data-single>${tabs}<div class="faq2__list">${list}</div></div>`;
}

function stepsBlock(s, items) {
  if (s.id === 'v1') {
    return `<div class="tl">${items.map(([ic, t, d], i) => `<div class="tl__item"><div class="tl__num">${I[ic]}</div><div class="tl__body"><small>ШАГ ${pad(i + 1)}</small><h3>${t}</h3><p>${d}</p></div></div>`).join('')}</div>`;
  }
  return `<div class="steps2">${items.map(([ic, t, d], i) => `<div class="step2"><div class="step2__n">${i + 1}</div><div class="step2__card"><div class="ico">${I[ic]}</div><h3>${t}</h3><p>${d}</p></div></div>`).join('')}</div>`;
}

function compareBlock(s) {
  const c = s.T.compare;
  if (s.id === 'v1') {
    return `<table class="table"><thead><tr><th>${c.head[0]}</th><th class="is-acc">${c.head[1]}</th><th>${c.head[2]}</th></tr></thead><tbody>${c.rows.map(r => `<tr><td>${r[0]}</td><td class="is-acc">${r[1]}</td><td>${r[2]}</td></tr>`).join('')}</tbody></table>`;
  }
  const col = (i, acc) => `<div class="vs2__col${acc ? ' vs2__col--acc' : ''}"><h3>${c.head[i]}</h3><ul>${c.rows.map(r => `<li><span>${r[0]}</span><b>${r[i]}</b></li>`).join('')}</ul></div>`;
  return `<div class="vs2">${col(1, true)}${col(2, false)}</div>`;
}

function pageHero(s, { crumb, tagText, h1, lead, actions = true }) {
  const cr = `<nav class="crumbs" aria-label="Навигация"><a href="/">Главная</a><span>${crumb}</span></nav>`;
  if (s.id === 'v1') {
    return `<section class="phero phero1"><div class="container phero1__grid"><div>${cr}${tag(tagText)}<h1>${h1}</h1><p class="lead">${lead}</p></div>
<aside class="phero1__aside"><h3>${s.T.ui.asideTitle}</h3><p>${s.T.ui.asideText}</p>${steamBtn('btn btn--primary')}</aside></div></section>`;
  }
  return `<section class="phero phero2"><div class="container">${cr}${tag(tagText)}<h1>${h1}</h1><p class="lead">${lead}</p>${actions ? `<div class="phero__actions">${steamBtn('btn btn--primary')}<a class="btn btn--ghost" href="/faq/">Вопросы и ответы</a></div>` : ''}</div></section>`;
}

const sec = (inner, alt = false, cls = '') => `<section class="section${alt ? ' section--alt' : ''} ${cls}"><div class="container">${inner}</div></section>`;
const head = (t, h, lead = '', center = true) => `<div class="${center ? 'center' : ''}">${t ? tag(t) : ''}<h2 class="h2">${h}</h2>${lead ? `<p class="lead">${lead}</p>` : ''}</div>`;
const cards = (items, cols = 3) => `<div class="grid g${cols}">${items.map(([ic, t, d]) => `<div class="card">${ic ? `<div class="ico">${I[ic]}</div>` : ''}<h3>${t}</h3><p>${d}</p></div>`).join('')}</div>`;
const prose = (inner) => `<div class="narrow prose">${inner}</div>`;
const ul = (arr, tagName = 'ul') => `<${tagName}>${arr.map(x => `<li>${x}</li>`).join('')}</${tagName}>`;
const ctaLine = s => s.id === 'v1'
  ? `<section class="cta1"><div class="container"><div class="cta1__in"><div><h2>${s.T.ui.ctaTitle}</h2><p>${s.T.ui.ctaText}</p></div>${steamBtn('btn')}</div></div></section>`
  : '';

// ---------- Главная ----------
function home(s) {
  const T = s.T, h = T.hero;
  const vpn = `<div class="vpn"><span class="vpn__ico">${I.shield}</span><span class="vpn__badge">ДЛЯ РФ</span><span>${T.vpn}</span></div>`;
  const checks = `<ul class="checks">${h.checks.map(c => `<li>${I.check}${c}</li>`).join('')}</ul>`;
  const slotCase = `<div class="slot"><div class="slot__label">Кейс</div><div class="slot__img"><img src="/assets/${s.heroCaseDir || 'cases'}/${s.heroCase[0]}.webp" alt="Кейс CS2"></div><div class="slot__cap">${s.heroCase[1]}</div></div>`;
  const slotDrop = cls => `<div class="slot ${cls}"><div class="slot__label">Дроп</div><div class="slot__img"><img src="/assets/skins/${s.heroDrop[0]}.webp" alt="Выпавший скин AWP"></div><div class="slot__cap">${s.heroDrop[1]}</div></div>`;
  const chips = `<span class="chip chip--acc">RNG ✓</span><span class="chip">Live исход</span><span class="chip">Steam Trade</span>`;
  const A = T.about;

  const S = {
    about: () => {
      if (s.id === 'v1') return sec(`<div class="about1"><div>${tag(A.tag)}<h2 class="h2">${A.title}</h2><div class="prose">${paras(A.paras)}</div></div><div class="pillars1">${A.pillars.map(([ic, t, d]) => `<div class="pillar1"><div class="ico">${I[ic]}</div><div><h3>${t}</h3><p>${d}</p></div></div>`).join('')}</div></div>`, false, 'about');
      return sec(`<div class="about2"><div class="center">${tag(A.tag)}<h2 class="h2">${A.title}</h2></div><div class="prose">${paras(A.paras)}</div></div><div class="pillars2">${A.pillars.map(([ic, t, d]) => `<div class="pillar2"><div class="ico">${I[ic]}</div><h3>${t}</h3><p>${d}</p></div>`).join('')}</div>`, false, 'about');
    },
    steps: () => sec(head(T.steps.tag, T.steps.title, T.steps.lead) + stepsBlock(s, T.steps.items), true),
    stats: () => s.id === 'v1'
      ? `<section class="stats1"><div class="container"><div class="stats1__in">${T.stats.items.map(([b, t]) => `<div class="stat1"><b>${b}</b><span>${t}</span></div>`).join('')}</div></div></section>`
      : sec(head('', T.stats.title) + `<div class="stats2">${T.stats.items.map(([b, t]) => `<div class="stat2"><b>${b}</b><span>${t}</span></div>`).join('')}</div>`),
    compare: () => sec(`<div class="narrow">${head(T.compare.tag, T.compare.title)}<div class="prose">${paras(T.compare.paras)}</div></div><div style="margin-top:36px">${compareBlock(s)}</div>`, s.id === 'v2'),
    fair: () => {
      const F = T.fair;
      if (s.id === 'v1') return sec(`<div class="narrow">${tag(F.tag)}<h2 class="h2">${F.title}</h2><div class="prose">${paras(F.paras)}</div></div><div class="fair1">${F.flow.map(([b, t]) => `<div class="fair1__step"><b>${b}</b><span>${t}</span></div>`).join('')}</div>`, true);
      return sec(`<div class="fair2"><div>${tag(F.tag)}<h2 class="h2">${F.title}</h2><div class="prose">${paras(F.paras)}</div></div>
<div class="code2"><div class="code2__top"><i></i><i></i><i></i></div><div><span>server_seed_hash</span><b>9f2c4e81a7d0b63e5c1f…</b></div><div><span>client_seed</span><b>musor-drop-2026</b></div><div><span>nonce</span><b>1842</b></div><div><span>roll</span><b>0.5174</b></div><div><span>verify</span><b class="ok">✓ совпадает</b></div></div></div>`);
    },
    rules: () => {
      const R = T.rules;
      if (s.id === 'v1') return sec(head(R.tag, R.title, R.lead) + `<div class="grid g2" style="margin-top:40px">${R.items.map(([t, d], i) => `<div class="card rule1"><span class="rule1__n">${i + 1}</span><h3>${t}</h3><p>${d}</p></div>`).join('')}</div>`);
      return sec(head(R.tag, R.title, R.lead) + `<div class="rules2">${R.items.map(([t, d], i) => `<div class="rule2"><div class="rule2__n">${i + 1}</div><div><h3>${t}</h3><p>${d}</p></div></div>`).join('')}</div>`, true);
    },
    strategy: () => {
      const St = T.strategy;
      if (s.id === 'v1') return sec(head(St.tag, St.title) + `<div class="grid g3" style="margin-top:36px">${St.items.map(([t, d]) => `<div class="card strat1"><h3>${t}</h3><p>${d}</p></div>`).join('')}</div>`);
      return sec(`<div>${tag(St.tag)}<h2 class="h2">${St.title}</h2></div><div class="strat2">${St.items.map(([t, d]) => `<div class="strat2__row"><h3>${t}</h3><p>${d}</p></div>`).join('')}</div>`);
    },
    faq: () => sec(head('FAQ', s.id === 'v1' ? 'Часто задаваемые вопросы' : 'Вопросы о Musor Drop') + faqBlock(s, T.faqHome), s.id === 'v1'),
    before: () => {
      const B = T.before;
      if (s.id === 'v1') return sec(`<div class="narrow">${tag(B.tag)}<h2 class="h2">${B.title}</h2><p class="lead">${B.lead}</p></div><div class="grid g3 before1" style="margin-top:32px">${B.items.map(([t, d]) => `<div class="card"><h3>${t}</h3><p>${d}</p></div>`).join('')}</div>`);
      const ics = ['layers', 'user', 'shield'];
      return sec(`<div class="before2"><div>${tag(B.tag)}<h2 class="h2">${B.title}</h2><p class="lead">${B.lead}</p><div style="margin-top:24px">${steamBtn('btn btn--primary')}</div></div><div class="before2__list">${B.items.map(([t, d], i) => `<div class="card"><div class="ico">${I[ics[i]]}</div><div><h3>${t}</h3><p>${d}</p></div></div>`).join('')}</div></div>`, true);
    },
  };

  let hero, order;
  if (s.id === 'v1') {
    hero = `<section class="hero1"><div class="container">${vpn}<div class="hero1__grid"><div>
<div class="eyebrow">${h.eyebrow}</div>
<h1><em>${h.titleAccent}</em> — ${h.title}<small>${h.subtitle}</small></h1>
<p class="lead">${h.lead}</p>
<div class="hero1__actions">${ext('btn btn--primary', `Перейти ${I.arrow}`)}<a class="btn btn--ghost" href="/cases/">Каталог кейсов</a></div>${checks}</div>
<div class="hv1"><span class="hv1__badge">${I.up}+160%</span><span class="hv1__open">${I.lock}OpenID</span><div class="hv1__row">${slotCase}<div class="ring" style="--p:${s.chance}"><div class="ring__in"><b>${s.chance}%</b><small>ШАНС</small></div></div>${slotDrop('hv1__drop')}</div>
<div class="hv1__dots"><i></i><b></b><i class="on"></i><b></b><i></i></div><div class="hv1__chips">${chips}</div></div>
</div></div></section>`;
    order = ['stats', 'about', 'steps', 'rules', 'compare', 'fair', 'strategy', 'faq', 'before'];
  } else {
    hero = `<section class="hero2"><div class="container">${vpn}
<div class="eyebrow"><i></i>${h.eyebrow}</div>
<h1><em>${h.titleAccent}</em> — ${h.title}</h1>
<div class="hero2__sub">${h.subtitle}</div>
<p class="lead">${h.lead}</p>
<div class="hero2__actions">${ext('btn btn--primary', `Перейти ${I.arrow}`)}<a class="btn btn--ghost" href="/cases/">Каталог кейсов</a></div>${checks}
<div class="hv2">${slotCase}<div class="hv2__mid"><div class="hv2__pct"><b>${s.chance}%</b><span>шанс апгрейда</span></div><div class="hv2__bar"><i></i></div><div class="hv2__x"><span>$3 → $28</span><b>+160% к ставке</b></div><div class="hv2__chips">${chips}<span class="chip">${I.lock.replace('width="20" height="20"', 'width="13" height="13"')}OpenID</span></div></div>${slotDrop('')}</div>
</div></section>`;
    order = ['about', 'steps', 'stats', 'fair', 'compare', 'strategy', 'rules', 'faq', 'before'];
  }
  return layout(s, { path: '/', meta: T.meta.home, body: hero + order.map(k => S[k]()).join('') + ctaLine(s) });
}

// ---------- Внутренние страницы ----------
// Коллекции кейсов для сайта 2 (выборка с 2musordrop.com), порядок свой
const COLL_ORDER = ['min', 'trash', 'fifty', 'metal', 'knives'];
const COLL_TITLES = { min: 'Мусорный минимум', trash: 'Мусорная коллекция', fifty: 'Кейсы 50/50', metal: 'Металлическая коллекция', knives: 'Стандартные ножи' };
const COLLS = (() => {
  const raw = JSON.parse(fs.readFileSync(path.join(ROOT, '_shared/cases2/index.json'), 'utf8'));
  return COLL_ORDER.map(k => { const c = raw.find(x => x[0] === k); return [k, COLL_TITLES[k], c[2].map(([f, n, p]) => [f, n.replace('Серебрянная', 'Серебряная'), p])]; });
})();
const coin = '<svg class="coin" viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><circle cx="10" cy="10" r="9" fill="url(#cg)"/><circle cx="10" cy="10" r="6.6" fill="none" stroke="rgba(255,255,255,.35)"/><path d="M6.6 13.4V6.8l3.4 4 3.4-4v6.6" fill="none" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/><defs><linearGradient id="cg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="var(--acc-h)"/><stop offset="1" stop-color="var(--acc-d)"/></linearGradient></defs></svg>';

function collections() {
  const nav = `<nav class="coll-nav" aria-label="Коллекции">${COLLS.map(([k, t, it]) => `<a href="#c-${k}">${t}<small>${it.length}</small></a>`).join('')}</nav>`;
  const body = COLLS.map(([k, t, items]) => `<section class="coll" id="c-${k}"><div class="coll__head"><i></i><h2>${t}</h2><i></i></div>
<div class="ccards">${items.map(([f, n, p]) => `<a class="ccard" href="${SPY}" rel="nofollow"><span class="ccard__name">${n}</span><img src="/assets/cases2/${f}.webp" alt="Кейс ${n.replace('★ ', '')}" width="160" height="160"><span class="price">${p}${coin}</span></a>`).join('')}</div></section>`).join('');
  return nav + body;
}

function casesPage(s) {
  const P = s.T.pages.cases;
  if (s.id === 'v2') {
    return layout(s, {
      path: '/cases/', meta: s.T.meta.cases,
      body: pageHero(s, { crumb: 'Кейсы CS2', tagText: P.tag, h1: P.h1, lead: P.lead })
        + sec(collections())
        + sec(head(P.typesTag, P.typesTitle) + `<div style="margin-top:36px">${cards(P.types, 3)}</div>`, true)
        + sec(prose(`<h2 style="margin-top:0">${P.howTitle}</h2>${ul(P.how, 'ol')}<p>${P.howOutro}</p>`)),
    });
  }
  const grid =`<div class="filters">${C.CASE_CATS.map(([k, t], i) => `<button class="filter${i === 0 ? ' is-on' : ''}" type="button" data-filter="${k}">${t}</button>`).join('')}</div>
<div class="cases">${C.CASES.map(([f, n, c]) => `<a class="case" data-cat="${c}" href="${SPY}" rel="nofollow"><div class="case__img"><img src="/assets/cases/${f}.webp" alt="Кейс ${n}"></div><div class="case__body"><div><div class="case__name">${n}</div><div class="case__cat">${C.CASE_CATS.find(x => x[0] === c)[1]}</div></div><span class="btn btn--primary btn--sm">Открыть</span></div></a>`).join('')}</div>`;
  return layout(s, {
    path: '/cases/', meta: s.T.meta.cases,
    body: pageHero(s, { crumb: 'Кейсы CS2', tagText: P.tag, h1: P.h1, lead: P.lead })
      + sec(grid)
      + sec(head(P.typesTag, P.typesTitle) + `<div style="margin-top:36px">${cards(P.types, 3)}</div>`, true)
      + sec(prose(`<h2 style="margin-top:0">${P.howTitle}</h2>${ul(P.how, 'ol')}<p>${P.howOutro}</p>`))
      + ctaLine(s),
  });
}

function upgradePage(s) {
  const P = s.T.pages.upgrade;
  const ring = `<div style="display:flex;gap:20px;align-items:center;margin-top:28px"><div class="ring" style="--p:62"><div class="ring__in"><b>62%</b><small>ПРИМЕР</small></div></div><p class="muted" style="margin:0;max-width:260px">${P.ringText}</p></div>`;
  return layout(s, {
    path: '/upgrade/', meta: s.T.meta.upgrade,
    body: pageHero(s, { crumb: 'Апгрейд скинов', tagText: P.tag, h1: P.h1, lead: P.lead })
      + sec(prose(`<p>${P.intro}</p><h2>${P.mechTitle}</h2><p>${P.mechText}</p>${ul(P.outcomes)}<p>${P.mechOutro}</p>${ring}`))
      + sec(head(P.formatsTag, P.formatsTitle) + `<div style="margin-top:36px">${cards(P.formats, 3)}</div>`, true)
      + sec(prose(`<h2 style="margin-top:0">${P.coefTitle}</h2><p>${P.coefText}</p><h2>${P.checkTitle}</h2><p>${P.checkText}</p>`))
      + sec(head(P.riskTag, P.riskTitle, P.riskLead) + `<div style="margin-top:36px">${cards(P.risk, 3)}</div>`, true)
      + sec(head('FAQ', P.faqTitle) + faqBlock(s, P.faq, { cats: false }))
      + ctaLine(s),
  });
}

function withdrawPage(s) {
  const P = s.T.pages.withdraw;
  return layout(s, {
    path: '/withdraw/', meta: s.T.meta.withdraw,
    body: pageHero(s, { crumb: 'Вывод в Steam', tagText: P.tag, h1: P.h1, lead: P.lead })
      + sec(prose(paras(P.intro)))
      + sec(head(P.stepsTag, P.stepsTitle) + stepsBlock(s, P.steps), true)
      + sec(prose(`<h2 style="margin-top:0">${P.vsTitle}</h2><p>${P.vsText}</p>${ul(P.vsList)}<h2>${P.reqTitle}</h2>${ul(P.req)}<p>${P.reqOutro}</p>`))
      + sec(head(P.faqTag, P.faqTitle) + faqBlock(s, P.faq, { cats: false }), true)
      + ctaLine(s),
  });
}

function processPage(s) {
  const P = s.T.pages.process;
  return layout(s, {
    path: '/process/', meta: s.T.meta.process,
    body: pageHero(s, { crumb: 'Процесс', tagText: P.tag, h1: P.h1, lead: P.lead })
      + sec(stepsBlock(s, s.T.steps.items))
      + sec(head(P.timingTag, P.timingTitle) + `<div style="margin-top:36px">${cards(P.timing, 3)}</div>`, true)
      + sec(prose(`<h2 style="margin-top:0">${P.hoodTitle}</h2>${paras(s.T.fair.paras)}<h2>${P.beforeTitle}</h2>${ul(P.beforeList)}`))
      + ctaLine(s),
  });
}

function faqPage(s) {
  const P = s.T.pages.faq;
  return layout(s, {
    path: '/faq/', meta: s.T.meta.faq,
    body: pageHero(s, { crumb: 'Вопросы и ответы', tagText: P.tag, h1: P.h1, lead: P.lead, actions: false })
      + sec(faqBlock(s, s.T.faqPage))
      + sec(`<div class="center"><h2 class="h2">${P.moreTitle}</h2><p class="lead">${P.moreText}</p><div class="phero__actions" style="justify-content:center"><a class="btn btn--ghost" href="/contact/">Контакты</a><a class="btn btn--ghost" href="/process/">Процесс</a>${steamBtn('btn btn--primary')}</div></div>`, true),
  });
}

function fmtDate(d) {
  const m = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  const [y, mo, da] = d.split('-').map(Number);
  return `${da} ${m[mo - 1]} ${y}`;
}
const postCard = p => `<a class="post" href="/blog/${p.slug}/"><div class="post__meta"><span class="post__cat">${p.cat}</span><span>${fmtDate(p.date)} · ${p.read}</span></div><div><h3>${p.title}</h3><p>${p.excerpt}</p></div><span class="post__more"><span>Читать</span>${I.arrow}</span></a>`;

function blogPage(s) {
  const P = s.T.pages.blog;
  return layout(s, {
    path: '/blog/', meta: s.T.meta.blog,
    body: pageHero(s, { crumb: 'Блог', tagText: P.tag, h1: P.h1, lead: P.lead, actions: false })
      + sec(`<div class="${s.id === 'v1' ? 'blog1' : 'blog2'}">${s.T.blog.map(postCard).join('')}</div>`),
  });
}

function articlePage(s, p) {
  const more = s.T.blog.filter(x => x.slug !== p.slug).slice(0, 3);
  return layout(s, {
    path: '/blog/', meta: [`${p.title} — блог ${s.id === 'v1' ? 'мусор дроп' : 'Musor Drop'}`, p.excerpt],
    body: `<article class="article"><div class="container narrow"><nav class="crumbs" aria-label="Навигация"><a href="/">Главная</a><span><a href="/blog/">Блог</a></span></nav><div class="post__meta"><span class="post__cat">${p.cat}</span><span>${fmtDate(p.date)} · ${p.read}</span></div><h1>${p.title}</h1><p class="lead">${p.excerpt}</p><div class="prose">${p.body}</div><div style="margin-top:36px">${steamBtn('btn btn--primary', s.T.ui.tryBtn)}</div></div></article>`
      + sec(head('', s.T.ui.alsoTitle) + `<div class="grid g3" style="margin-top:28px">${more.map(postCard).join('')}</div>`, true),
  });
}

function aboutPage(s) {
  const P = s.T.pages.about;
  return layout(s, {
    path: '/about/', meta: s.T.meta.about,
    body: pageHero(s, { crumb: 'О проекте', tagText: P.tag, h1: P.h1, lead: P.lead })
      + sec(prose(`<h2 style="margin-top:0">${s.id === 'v1' ? 'Кто мы' : 'Почему Musor Drop'}</h2>${paras(P.who)}<h2>${s.id === 'v1' ? 'Миссия' : 'Наша цель'}</h2><p>${P.mission}</p>`))
      + sec(head(P.principlesTag, P.principlesTitle) + `<div style="margin-top:36px">${cards(P.principles, 3)}</div>`, true)
      + sec(prose(`<h2 style="margin-top:0">${s.id === 'v1' ? 'Для кого платформа' : 'Кому подойдёт'}</h2><p>${P.forWhom}</p><h2>Контакты</h2><p>Вопросы — в <a href="/contact/">службу поддержки</a> или на <a href="mailto:${C.EMAIL}">${C.EMAIL}</a>.</p>`))
      + ctaLine(s),
  });
}

function contactPage(s) {
  const P = s.T.pages.contact;
  return layout(s, {
    path: '/contact/', meta: s.T.meta.contact,
    body: pageHero(s, { crumb: 'Контакты', tagText: P.tag, h1: P.h1, lead: P.lead })
      + sec(cards(P.info, 3))
      + sec(prose(`<h2 style="margin-top:0">${P.topicsTitle}</h2>${ul(P.topics)}<h2>${P.timeTitle}</h2>${paras(P.timeText)}`), true),
  });
}

// ---------- Запись файлов ----------
function write(out, rel, html) {
  const f = path.join(out, rel, 'index.html');
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, html);
}
function copyDir(src, dst, filter = () => true) {
  fs.mkdirSync(dst, { recursive: true });
  for (const f of fs.readdirSync(src)) if (filter(f)) fs.copyFileSync(path.join(src, f), path.join(dst, f));
}

const css = (s) => {
  const vars = ':root{' + Object.entries(s.vars).map(([k, v]) => `--${k}:${v}`).join(';') + '}\n';
  return vars + fs.readFileSync(path.join(ROOT, 'build/css/base.css'), 'utf8') + '\n' + fs.readFileSync(path.join(ROOT, `build/css/${s.id}.css`), 'utf8');
};

const only = process.argv[2];
for (const s of SITES) {
  if (only && s.out !== only) continue;
  const out = path.join(ROOT, s.out);
  fs.rmSync(out, { recursive: true, force: true });
  const A = path.join(out, 'assets');
  fs.mkdirSync(A, { recursive: true });
  // скины: сайты 1–2 — общий набор для ленты; сайты 3–10 — только свой набор (или никакого)
  const skinDir = s.skins ? `_shared/${s.skins}` : s.noFeed ? null : '_shared/skins';
  if (skinDir) copyDir(path.join(ROOT, skinDir), path.join(A, 'skins'), f => f.endsWith('.webp'));
  const used = new Set(C.CASES.map(c => c[0] + '.webp').concat(s.heroCase[0] + '.webp'));
  if (!s.render && s.id === 'v1') copyDir(path.join(ROOT, '_shared/cases_web'), path.join(A, 'cases'), f => used.has(f));
  if (s.id === 'v2') copyDir(path.join(ROOT, '_shared/cases2'), path.join(A, 'cases2'), f => f.endsWith('.webp'));
  fs.copyFileSync(path.join(ROOT, '_shared/logo_t.svg'), path.join(A, 'logo.svg'));
  fs.copyFileSync(path.join(ROOT, 'build/main.js'), path.join(A, 'main.js'));
  fs.writeFileSync(path.join(A, 'site.css'), css(s));
  if (s.render) {
    s.render({ ROOT, out, A, C, I, SPY, layout, ext, steamBtn, tag, paras, pad, sec, head, prose, ul, write, copyDir, fmtDate });
    console.log('built', s.out);
    continue;
  }

  write(out, '', home(s));
  write(out, 'cases', casesPage(s));
  write(out, 'upgrade', upgradePage(s));
  write(out, 'withdraw', withdrawPage(s));
  write(out, 'process', processPage(s));
  write(out, 'faq', faqPage(s));
  write(out, 'blog', blogPage(s));
  for (const p of s.T.blog) write(out, `blog/${p.slug}`, articlePage(s, p));
  write(out, 'about', aboutPage(s));
  write(out, 'contact', contactPage(s));
  console.log('built', s.out);
}
