// Движок сайтов 11–13 — «копии» в духе сайтов 1–2 (главная, кейсы, апгрейд, вывод, процесс, FAQ,
// блог, о проекте, контакты; без ленты дропа). Тексты и пути — в vNN.mjs, здесь только вёрстка.
// У каждого сайта свой вариант блоков: s.v = 11 | 12 | 13 (свой класс CSS: .x11, .x12, .x13).
import { faqLd, siteLd, pager, fmtDate } from './kit.mjs';

export function makeCopySite(cfg) {
  const { v, T } = cfg;
  const P = T.paths;
  let CTX;

  // ---------- мелкие куски ----------
  const ext = (cls, inner) => `<a class="${cls}" href="${CTX.SPY}" rel="nofollow">${inner}</a>`;
  const steam = (cls = 'btn btn--primary', label = 'Войти через Steam') => ext(cls, `${CTX.I.steam}<span>${label}</span>`);
  const k = t => t ? `<span class="k${v}">${t}</span>` : '';
  const hh = (tag, h, lead = '', center = false) => `<div class="hh${v}${center ? ' hh--c' : ''}">${k(tag)}<h2>${h}</h2>${lead ? `<p>${lead}</p>` : ''}</div>`;
  const sec = (inner, alt = false, cls = '') => `<section class="s${v}${alt ? ` s${v}--alt` : ''} ${cls}"><div class="container">${inner}</div></section>`;
  const sk = key => `<img src="/assets/skins/${key}.webp" alt="" loading="lazy">`;
  const paras = l => l.map(p => `<p>${p}</p>`).join('');
  const nav = cur => T.nav.map(([key, t]) => `<a href="${P[key]}"${cur.startsWith(P[key]) ? ' class="is-active"' : ''}>${t}</a>`).join('');

  // ---------- блоки (у каждого варианта своя разметка) ----------
  const B = {
    prose: b => sec(`<div class="pr${v}">${b.h ? `<h2>${b.h}</h2>` : ''}${b.html}</div>`, b.alt),
    cards: b => sec(hh(b.tag, b.h, b.lead, v === 12) + `<div class="cd${v}">${b.items.map(([ic, t, d], n) => `<div class="cd${v}__it">${v === 13 ? `<span class="cd13__n">${String(n + 1).padStart(2, '0')}</span>` : `<span class="ico">${CTX.I[ic] || ''}</span>`}<h3>${t}</h3><p>${d}</p></div>`).join('')}</div>`, b.alt),
    steps: b => {
      const items = b.items;
      let inner;
      if (v === 11) inner = `<ol class="st11">${items.map(([ic, t, d], n) => `<li><div class="st11__top"><span class="st11__n">${n + 1}</span><span class="st11__line"></span></div><span class="ico">${CTX.I[ic]}</span><h3>${t}</h3><p>${d}</p></li>`).join('')}</ol>`;
      else if (v === 12) inner = `<ol class="st12">${items.map(([ic, t, d], n) => `<li><span class="st12__n">0${n + 1}</span><div><h3>${t}</h3><p>${d}</p></div><span class="st12__ic">${CTX.I[ic]}</span></li>`).join('')}</ol>`;
      else inner = `<div class="st13">${items.map(([ic, t, d], n) => `<div class="st13__it${n % 2 ? ' is-r' : ''}"><div class="st13__card"><span class="st13__n">Шаг ${n + 1}</span><h3>${t}</h3><p>${d}</p></div><span class="st13__dot">${CTX.I[ic]}</span></div>`).join('')}</div>`;
      return sec(hh(b.tag, b.h, b.lead, v === 12) + inner, b.alt);
    },
    faq: b => {
      const items = b.items;
      let inner;
      if (v === 11) inner = `<div class="fq11">${items.map(([q, a], n) => `<details${n === 0 ? ' open' : ''}><summary class="faq-q"><span>${q}</span><span class="faq-ico">${CTX.I.plus}</span></summary><div class="faq-a">${a}</div></details>`).join('')}</div>`;
      else if (v === 12) inner = `<div class="fq12" data-faq data-single>${items.map(([q, a], n) => `<details${n === 0 ? ' open' : ''}><summary class="faq-q"><i>${String(n + 1).padStart(2, '0')}</i><span>${q}</span><span class="faq-ico">${CTX.I.chevron}</span></summary><div class="faq-a">${a}</div></details>`).join('')}</div>`;
      else inner = `<div class="fq13">${items.map(([q, a]) => `<div class="fq13__it"><h3><span>?</span>${q}</h3><p>${a}</p></div>`).join('')}</div>`;
      return sec(hh(b.tag || 'FAQ', b.h, b.lead, v === 12) + inner, b.alt);
    },
    checklist: b => sec(`<div class="cl${v}">${hh(b.tag, b.h, b.lead)}<ul>${b.items.map(x => `<li>${CTX.I.check}<span>${x}</span></li>`).join('')}</ul></div>`, b.alt),
    cats: b => sec(hh(b.tag, b.h, b.lead, v === 12) + `<div class="ct${v}">${T.cats.map(([t, d, keys]) => `<a class="ct${v}__it" href="${CTX.SPY}" rel="nofollow"><span class="ct${v}__imgs">${keys.map(sk).join('')}</span><span class="ct${v}__body"><b>${t}</b><small>${d}</small></span><span class="ct${v}__go">${v === 13 ? 'Открыть' : CTX.I.arrow}</span></a>`).join('')}</div>${b.after ? `<div class="pr${v} pr--after">${b.after}</div>` : ''}`, b.alt),
    stats: b => v === 12
      ? `<section class="sn12"><div class="container"><div class="sn12__in">${b.items.map(([x, t]) => `<div><b>${x}</b><span>${t}</span></div>`).join('')}</div></div></section>`
      : sec(`${b.h ? hh(b.tag, b.h) : ''}<div class="sn${v}">${b.items.map(([x, t]) => `<div><b>${x}</b><span>${t}</span></div>`).join('')}</div>`, b.alt),
    compare: b => {
      const [h0, h1, h2] = b.head;
      const inner = v === 13
        ? `<div class="cmp13"><div class="cmp13__col is-acc"><h3>${h1}</h3>${b.rows.map(r => `<div><small>${r[0]}</small><b>${r[1]}</b></div>`).join('')}</div><div class="cmp13__col"><h3>${h2}</h3>${b.rows.map(r => `<div><small>${r[0]}</small><b>${r[2]}</b></div>`).join('')}</div></div>`
        : `<div class="tw${v}"><table class="tb${v}"><thead><tr><th>${h0}</th><th class="is-acc">${h1}</th><th>${h2}</th></tr></thead><tbody>${b.rows.map(r => `<tr><td>${r[0]}</td><td class="is-acc">${r[1]}</td><td>${r[2]}</td></tr>`).join('')}</tbody></table></div>`;
      return sec(`<div class="cmpw${v}"><div>${hh(b.tag, b.h)}${b.paras ? `<div class="pr${v}">${paras(b.paras)}</div>` : ''}</div>${inner}</div>`, b.alt);
    },
    fair: b => {
      const vis = v === 11
        ? `<div class="fv11">${b.flow.map(([x, t], n) => `<div><span>${n + 1}</span><b>${x}</b><small>${t}</small></div>`).join('')}</div>`
        : v === 12
          ? `<div class="fv12"><div class="fv12__bar"><i></i><i></i><i></i><span>fairness.log</span></div><pre><span>server_hash</span> 3e91a0c7…f42b
<span>client_seed</span> ${b.seed || 'my-seed'}
<span>nonce</span>       27
<span>result</span>      0.7316
<span class="ok">✓ хеш совпал</span></pre></div>`
          : `<div class="fv13">${b.flow.map(([x, t]) => `<div class="fv13__it"><b>${x}</b><span>${t}</span></div>`).join('<i class="fv13__arr"></i>')}</div>`;
      return sec(`<div class="fw${v}"><div>${hh(b.tag, b.h)}<div class="pr${v}">${paras(b.paras)}</div></div>${vis}</div>`, b.alt);
    },
    upgrade: b => sec(`<div class="ug${v}"><div>${hh(b.tag, b.h)}<div class="pr${v}">${paras(b.paras)}</div>${b.link ? `<a class="ln${v}" href="${P.upgrade}">${b.link} ${CTX.I.arrow}</a>` : ''}</div><div class="ugv${v}"><div class="ugv${v}__s">${sk(b.from[0])}<small>Ставка</small><b>${b.from[1]}</b></div><div class="ring" style="--p:${b.pct}"><div class="ring__in"><b>${b.pct}%</b><small>ШАНС</small></div></div><div class="ugv${v}__s">${sk(b.to[0])}<small>Цель</small><b>${b.to[1]}</b></div></div></div>`, b.alt),
    tips: b => sec(hh(b.tag, b.h, b.lead, v === 12) + `<div class="tp${v}">${b.items.map(([t, d], n) => `<div class="tp${v}__it"><span>${v === 12 ? ['I', 'II', 'III', 'IV', 'V'][n] : n + 1}</span><div><h3>${t}</h3><p>${d}</p></div></div>`).join('')}</div>`, b.alt),
    posts: b => sec(hh(b.tag, b.h, b.lead, v === 12) + `<div class="bl${v}">${T.blog.slice(0, b.limit || 3).map(postCard).join('')}</div>`, b.alt),
    cta: b => `<section class="ct${v}x"><div class="container"><div class="ct${v}x__in">${v === 13 ? `<div class="ct13x__skins">${(b.skins || []).map(sk).join('')}</div>` : ''}<div><h2>${b.h}</h2><p>${b.text}</p></div><div class="ct${v}x__btns">${steam()}${b.second ? `<a class="btn btn--ghost" href="${P[b.second[0]]}">${b.second[1]}</a>` : ''}</div></div></div></section>`,
  };
  const postCard = p => `<a class="pc${v}" href="${P.blog}${p.slug}/"><span class="pc${v}__img">${sk(p.skin)}</span><span class="pc${v}__meta"><b>${p.cat}</b>${fmtDate(p.date)} · ${p.read}</span><h3>${p.title}</h3><p>${p.excerpt}</p></a>`;
  const blocks = list => list.map(b => B[b.type](b)).join('');

  // ---------- hero ----------
  function hero() {
    const H = T.hero, I = CTX.I;
    const vpn = `<div class="vpn${v}"><span>${I.shield}</span><b>РФ</b><p>${T.vpn}</p></div>`;
    const checks = `<ul class="hc${v}">${H.checks.map(c => `<li>${I.check}${c}</li>`).join('')}</ul>`;
    const btns = `<div class="hb${v}">${ext('btn btn--primary', `<span>${H.cta}</span>${I.arrow}`)}<a class="btn btn--ghost" href="${P.cases}">${H.second}</a></div>`;
    const [a, b2, c] = H.skins;
    if (v === 11) return `<section class="hero11"><div class="container"><div class="hero11__grid"><div>${vpn}<span class="hero11__eb">${H.eyebrow}</span><h1>${H.h1}</h1><p class="lead">${H.lead}</p>${btns}${checks}</div>
<div class="hero11__vis"><div class="hero11__card c1">${sk(a)}<small>Дроп</small></div><div class="hero11__card c2">${sk(b2)}<small>Апгрейд</small></div><div class="hero11__card c3">${sk(c)}<small>Вывод</small></div><span class="hero11__badge">${I.lock}Steam OpenID</span></div></div></div></section>`;
    if (v === 12) return `<section class="hero12"><div class="container">${vpn}<span class="hero12__eb"><i></i>${H.eyebrow}</span><h1>${H.h1}</h1><p class="lead">${H.lead}</p>${btns}${checks}
<div class="hero12__row">${H.row.map(([key, n, p]) => `<a href="${CTX.SPY}" rel="nofollow" class="hero12__sk">${sk(key)}<b>${n}</b><small>${p}</small></a>`).join('')}</div></div></section>`;
    return `<section class="hero13"><div class="container hero13__grid"><div class="hero13__vis"><div class="hero13__sk s1">${sk(a)}</div><div class="ring" style="--p:${H.pct}"><div class="ring__in"><b>${H.pct}%</b><small>ШАНС</small></div></div><div class="hero13__sk s2">${sk(b2)}</div><span class="hero13__tag">${H.upTag}</span></div><div>${vpn}<span class="hero13__eb">${H.eyebrow}</span><h1>${H.h1}</h1><p class="lead">${H.lead}</p>${btns}${checks}</div></div></section>`;
  }

  // ---------- шапка и подвал страницы ----------
  const crumbs = label => `<nav class="crumbs" aria-label="Навигация"><a href="/">Главная</a><span>${label}</span></nav>`;
  function phero(pg, label) {
    const I = CTX.I;
    if (v === 11) return `<section class="ph11"><div class="container ph11__grid"><div>${crumbs(label)}${k(pg.tag)}<h1>${pg.h1}</h1><p class="lead">${pg.lead}</p></div><aside class="ph11__aside">${sk(pg.skin)}<p>${T.asideText}</p>${steam('btn btn--primary btn--sm')}</aside></div></section>`;
    if (v === 12) return `<section class="ph12"><div class="container">${crumbs(label)}${k(pg.tag)}<h1>${pg.h1}</h1><p class="lead">${pg.lead}</p><div class="hb12">${steam()}<a class="btn btn--ghost" href="${P.faq}">${T.navShort.faq}</a></div></div></section>`;
    return `<section class="ph13"><div class="container"><div class="ph13__in"><div>${crumbs(label)}${k(pg.tag)}<h1>${pg.h1}</h1><p class="lead">${pg.lead}</p></div><div class="ph13__sk">${sk(pg.skin)}</div></div></div></section>`;
  }

  function build(ctx) {
    CTX = ctx;
    const s = SITE;
    const page = pager(ctx, s);
    const L = T.labels;

    page('/', T.meta.home, hero() + blocks(T.home), [siteLd(T.siteName), faqLd(T.home.find(b => b.type === 'faq').items)]);
    for (const key of ['cases', 'upgrade', 'withdraw', 'process', 'about', 'contact']) {
      const pg = T.pages[key];
      const faqB = pg.blocks.find(b => b.type === 'faq');
      page(P[key], T.meta[key], phero(pg, L[key]) + blocks(pg.blocks), faqB ? faqLd(faqB.items) : undefined);
    }
    // FAQ-страница
    const all = T.faqPage.flatMap(([, l]) => l);
    page(P.faq, T.meta.faq, phero(T.pages.faq, L.faq) + T.faqPage.map(([h, items], n) => B.faq({ h, items, tag: `${n + 1} / ${T.faqPage.length}`, alt: n % 2 === 1 })).join('') + blocks(T.pages.faq.blocks || []), faqLd(all));
    // блог
    page(P.blog, T.meta.blog, phero(T.pages.blog, L.blog) + sec(`<div class="bl${v} bl${v}--all">${T.blog.map(postCard).join('')}</div>`), undefined);
    T.blog.forEach((p, idx) => {
      const more = [...T.blog.slice(idx + 1), ...T.blog.slice(0, idx)].slice(0, 3);
      const body = `<article class="ar${v}"><div class="container"><div class="ar${v}__head"><nav class="crumbs" aria-label="Навигация"><a href="/">Главная</a><span><a href="${P.blog}">${L.blog}</a></span></nav><span class="pc${v}__meta"><b>${p.cat}</b>${fmtDate(p.date)} · ${p.read}</span><h1>${p.title}</h1><p class="lead">${p.excerpt}</p></div><div class="ar${v}__cover">${sk(p.skin)}</div><div class="pr${v} ar${v}__body">${p.body}<div class="ar${v}__cta">${steam('btn btn--primary', T.tryBtn)}</div></div></div></article>`
        + sec(hh('', T.alsoTitle) + `<div class="bl${v}">${more.map(postCard).join('')}</div>`, true);
      page(`${P.blog}${p.slug}/`, [`${p.title} — ${T.blogSuffix}`, p.excerpt], body, { '@context': 'https://schema.org', '@type': 'Article', headline: p.title, description: p.excerpt, datePublished: p.date, inLanguage: 'ru' });
    });
  }

  // ---------- header / footer ----------
  const logo = (tag = T.logoTag) => `<a href="/" class="logo logo${v}" aria-label="${T.siteName} — главная"><img src="/assets/logo.svg" alt="Musor Drop" width="36" height="36"><span><span class="logo__name">Musor Drop</span><span class="logo__tag">${tag}</span></span></a>`;
  function header(s, cur) {
    const I = CTX.I;
    const mnav = `<nav class="mnav" aria-label="Мобильное меню">${T.nav.map(([key, t]) => `<a href="${P[key]}">${t}</a>`).join('')}${steam()}</nav>`;
    const burger = `<button class="burger" type="button" aria-label="Меню" aria-expanded="false">${I.menu}</button>`;
    if (v === 11) return `<header class="header header11"><div class="container header__in">${logo()}<nav class="nav" aria-label="Основное меню">${nav(cur)}</nav><div class="header__cta"><span class="on11"><i></i><b data-online>${s.online}</b></span>${steam('btn btn--primary btn--sm', 'Войти')}</div>${burger}</div></header>\n${mnav}`;
    if (v === 12) return `<div class="top12"><div class="container"><span>${T.topNote}</span><span class="top12__on"><i></i><b data-online>${s.online}</b> в сети</span></div></div><header class="header header12"><div class="container header__in">${logo()}<nav class="nav" aria-label="Основное меню">${nav(cur)}</nav><div class="header__cta">${steam('btn btn--primary btn--sm')}</div>${burger}</div></header>\n${mnav}`;
    const half = Math.ceil(T.nav.length / 2);
    const part = l => l.map(([key, t]) => `<a href="${P[key]}"${cur.startsWith(P[key]) ? ' class="is-active"' : ''}>${t}</a>`).join('');
    return `<header class="header header13"><div class="container header__in"><nav class="nav nav13" aria-label="Основное меню">${part(T.nav.slice(0, half))}</nav>${logo()}<nav class="nav nav13 nav13--r" aria-label="Разделы">${part(T.nav.slice(half))}</nav><div class="header__cta">${steam('btn btn--primary btn--sm', 'Войти')}</div>${burger}</div></header>\n${mnav}`;
  }

  function footer(s) {
    const { I, C } = CTX;
    const F = T.footer;
    const links = T.nav.map(([key, t]) => `<a href="${P[key]}">${t}</a>`).join('');
    if (v === 11) return `<footer class="f11"><div class="container"><div class="f11__grid"><div class="f11__brand">${logo()}<p>${F.about}</p><span class="f11__on"><i></i><b data-online>${s.online}</b> игроков онлайн</span></div>
<div><h4>${F.col1}</h4><div class="f11__links">${T.nav.slice(0, 4).map(([key, t]) => `<a href="${P[key]}">${t}</a>`).join('')}</div></div><div><h4>${F.col2}</h4><div class="f11__links">${T.nav.slice(4).map(([key, t]) => `<a href="${P[key]}">${t}</a>`).join('')}</div></div>
<div class="f11__box"><h4>${F.boxTitle}</h4><p>${F.boxText}</p>${steam('btn btn--primary btn--sm')}</div></div>
<div class="f11__bottom"><span class="f11__age">18+</span><p>${F.legal}</p><a href="mailto:${C.EMAIL}">${C.EMAIL}</a></div></div></footer>`;
    if (v === 12) return `<footer class="f12"><div class="f12__strip"><div class="container"><b>${F.stripTitle}</b>${steam('btn btn--light btn--sm')}</div></div><div class="container"><div class="f12__mid">${logo()}<nav class="f12__nav">${links}</nav></div><div class="f12__bottom"><p>${F.legal} Поддержка: <a href="mailto:${C.EMAIL}">${C.EMAIL}</a></p><div class="f12__badges"><span>18+</span><span>Steam OpenID</span><span>Provably fair</span></div></div></div></footer>`;
    return `<footer class="f13"><div class="container"><div class="f13__grid"><div class="f13__age"><b>18+</b><span>${F.ageText}</span></div><div class="f13__brand">${logo()}<p>${F.about}</p></div><div class="f13__col"><h4>${F.col1}</h4>${links}</div><div class="f13__col"><h4>${F.col2}</h4>${F.facts.map(x => `<span>${I.check}${x}</span>`).join('')}</div></div><div class="f13__bottom"><span>© 2026 Musor Drop · ${T.logoTag}</span><span>${F.legal}</span><a href="#top" aria-label="Наверх">${I.top}</a></div></div></footer>`;
  }

  const SITE = {
    id: `x${v}`, out: cfg.out, online: cfg.online, color: cfg.vars.bg,
    T: {}, fonts: cfg.fonts, vars: cfg.vars,
    heroCase: ['case01', ''],
    skins: `skins${v}`,
    noFeed: true, // ленты дропа на копиях 11–15 нет
    header: (s, cur) => header(s, cur),
    footer: s => footer(s),
    render: ctx => build(ctx),
  };
  return SITE;
}
