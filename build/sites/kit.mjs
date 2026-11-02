// Общие мелочи для сайтов 5–10: форматирование, JSON-LD, запись страниц.
import fs from 'fs';
export const MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
export const fmtDate = d => { const [y, mo, da] = d.split('-').map(Number); return `${da} ${MONTHS[mo - 1]} ${y}`; };
export const slugify = t => t.toLowerCase().replace(/<[^>]+>/g, '').replace(/[^a-zа-яё0-9]+/gi, '-').replace(/^-|-$/g, '').slice(0, 40);
export const plural = (n, a, b, c) => { const m = n % 100, k = n % 10; return m > 10 && m < 20 ? c : k === 1 ? a : k > 1 && k < 5 ? b : c; };
export const cases = n => `${n} ${plural(n, 'кейс', 'кейса', 'кейсов')}`;
// неразрывные пробелы в ценах: «2 000 ₽» не разрывается переносом
export const nb = h => h.replace(/(\d) (?=\d{3}\b)/g, '$1 ').replace(/(\d) ₽/g, '$1 ₽');
export const strip = t => t.replace(/<[^>]+>/g, '');
export const clean = n => n.replace('★ ', '');

export const PROMOS = ['FIRST', 'MUSOR', 'INVFMFEP7'];

export const faqLd = items => ({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: items.map(([q, a]) => ({ '@type': 'Question', name: strip(q), acceptedAnswer: { '@type': 'Answer', text: strip(a) } })) });
export const listLd = (name, items, rub) => ({ '@context': 'https://schema.org', '@type': 'ItemList', name, numberOfItems: items.length, itemListElement: items.map((i, n) => ({ '@type': 'ListItem', position: n + 1, name: `Кейс ${clean(i.name)} — ${rub(i.rub)}` })) });
export const siteLd = name => ({ '@context': 'https://schema.org', '@type': 'WebSite', name, inLanguage: 'ru' });

// page(path, [title, description], body, ld) — пишет /path/index.html через общий layout
export const pager = (ctx, s) => (p, meta, body, ld) => ctx.write(ctx.out, p.replace(/^\/|\/$/g, ''), ctx.layout(s, { path: p, meta, body: nb(body), ld }));
export const crumbsFor = root => (...items) => `<nav class="crumbs" aria-label="Навигация"><a href="/">${root}</a>${items.map(([h, t]) => h ? `<span><a href="${h}">${t}</a></span>` : `<span>${t}</span>`).join('')}</nav>`;

// лента дропа сайта: _shared/skins<N>/drops.json → [[key, имя, редкость], ...]
export const dropsOf = n => JSON.parse(fs.readFileSync(new URL(`../../_shared/skins${n}/drops.json`, import.meta.url), 'utf8')).map(([k, name, r]) => [k, name, r]);
