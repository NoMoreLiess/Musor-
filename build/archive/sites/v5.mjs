// Сайт 5 — «прайс-лист старших серий»: 50/50, StatTrak™ и Металлическая коллекция Musor Drop
// по ценовым диапазонам, рубли против монет, самые дорогие кейсы. Свой header/footer/блоки (лавандовый, Onest), тексты только здесь.
import { pick, rub, coin, PRICE_DATE } from './catalog.mjs';
import { cases, faqLd, listLd, siteLd, pager, crumbsFor, clean, PROMOS } from './kit.mjs';

const PROMO = 'FIRST';
// свой набор коллекций сайта (см. pick() в catalog.mjs)
const { COLLS, ALL, collBySlug } = pick(['50-50', 'stattrak', 'metallicheskaya-kollekciya']);
const BANDS = [
  ['do-5000-rublej', 'До 5 000 ₽', 0, 5000],
  ['5000-20000-rublej', '5 000–20 000 ₽', 5000, 20000],
  ['20000-100000-rublej', '20 000–100 000 ₽', 20000, 100000],
  ['dorozhe-100000-rublej', 'Дороже 100 000 ₽', 100000, Infinity],
].map(([slug, title, a, b]) => ({ slug, title, a, b, items: ALL.filter(i => i.rub >= a && i.rub < b).sort((x, y) => y.rub - x.rub) }));
const NAV = [
  ['/prajs/', 'Прайс'],
  ['/samye-dorogie/', 'Самые дорогие'],
  ['/rubli-ili-monety/', 'Рубли или монеты'],
  ['/promokod/', 'Промокод'],
  ['/ot-pokupki-do-vyvoda/', 'Как получить скин'],
  ['/otvety/', 'Ответы'],
];
const byPrice = [...ALL].sort((a, b) => a.rub - b.rub);
const low = byPrice[0], top = byPrice.at(-1);
const mid = byPrice.length >> 1;
const median = byPrice.length % 2 ? byPrice[mid].rub : (byPrice[mid - 1].rub + byPrice[mid].rub) / 2;
const ratio = i => i.rub / i.coin;
const rMin = Math.floor(Math.min(...ALL.map(ratio))), rMax = Math.ceil(Math.max(...ALL.map(ratio)));

// ---------- Тексты диапазонов ----------
const BAND_TEXT = {
  'do-5000-rublej': {
    h1: 'Кейсы Мусор Дроп до 5 000 рублей: 50/50 и StatTrak',
    lead: 'Вход в старшие серии. Здесь собраны кейсы 50/50 с понятной парой исходов — Неонуар, Redline, Кровавый спорт, Asiimov, «Легенды» — и самый доступный StatTrak™.',
    use: ['Попробовать формат 50/50, где до открытия известно, какие два предмета возможны.', 'Получить скин со счётчиком убийств через «Бедный StatTrak».', 'Подняться над дешёвыми сериями без скачка к пятизначным суммам.'],
    note: 'В 50/50 один из двух предметов почти всегда дешевле цены кейса. Прежде чем платить, спросите себя, устроит ли вас именно он: такой исход выпадает примерно в половине случаев.',
    faq: [['Какой кейс диапазона самый доступный?', 'Неонуар и Redline — по 1 333 ₽ (16.99 монеты).'], ['Сколько стоит самый дешёвый StatTrak?', '«Бедный StatTrak» — 1 434 ₽, или 15 монет.']],
  },
  '5000-20000-rublej': {
    h1: 'Кейсы Мусор Дроп от 5 000 до 20 000 рублей',
    lead: 'Середина прайса: дорогие 50/50 — «Поток информации», «Взрыв», «Скоростной зверь», — средний и дорогой StatTrak™ и вход в металлические «мусорки» — Бронзовая за 12 000 ₽.',
    use: ['Сыграть 50/50 вокруг дорогого скина.', 'Взять StatTrak™ из пула подороже — 9 011 или 19 222 ₽.', 'Посмотреть, как устроена Металлическая коллекция, с самой доступной ступени.'],
    note: 'Цена одной попытки здесь уже сопоставима с ценой хорошего скина на рынке. Сравните: возможно, нужный предмет проще купить напрямую, а кейс открывать ради азарта, а не ради конкретной цели.',
    faq: [['Какая металлическая «мусорка» самая доступная?', 'Бронзовая — 12 000 ₽ (199.99 монеты).'], ['Чем «Дорогой StatTrak» отличается от «Среднего»?', 'Стоимостью пула: 19 222 ₽ против 9 011 ₽. В «Дорогом» собраны самые дорогие StatTrak-скины серии.']],
  },
  '20000-100000-rublej': {
    h1: 'Кейсы Мусор Дроп от 20 000 до 100 000 рублей',
    lead: 'Пояс крупных ставок: «Пламя» — самый дорогой кейс 50/50 — и металлические «мусорки» от Взрывной до Золотой.',
    use: ['Подниматься по лестнице металлов, понимая стоимость каждой ступени.', 'Сыграть 50/50 на максимальной ставке серии — «Пламя» за 26 999 ₽.', 'Охотиться за дорогим дропом при большом балансе.'],
    note: 'Не стоит идти по металлам подряд, чтобы «вернуть» прошлый кейс. Каждое открытие независимо, и ошибка на этой ступени стоит как десятки открытий внизу прайса.',
    faq: [['Сколько стоит Золотая Мусорка?', '77 777 ₽ или 999.99 монеты.'], ['Что дешевле — «Пламя» или Взрывная Мусорка?', 'Почти одинаково: 26 999 ₽ и 27 100 ₽. Но в «Пламени» два исхода, а в «мусорке» — полный пул.']],
  },
  'dorozhe-100000-rublej': {
    h1: 'Самые дорогие кейсы Мусор Дроп — дороже 100 000 рублей',
    lead: `Верхушка прайса — всего два кейса: Платиновая Мусорка за 113 311 ₽ и «${top.name}» за ${rub(top.rub)}, самый дорогой кейс площадки.`,
    use: ['Сыграть на максимальной ставке, которая есть на площадке.', 'Получить шанс на самый дорогой дроп Металлической коллекции.'],
    note: 'Это кейсы-витрины: их открывают редко. Если вы только знакомитесь с площадкой, начните с нижних ступеней и разберитесь, как работает таблица шансов.',
    faq: [['Сколько стоит «Великая Мусорка»?', `${rub(top.rub)}, или ${coin(top.coin)} монет.`], ['Насколько она дороже Платиновой?', 'Больше чем в четыре раза: 500 000 ₽ против 113 311 ₽.']],
  },
};


const FAQ = [
  ['Сколько стоят кейсы в прайсе?', `От ${rub(low.rub)} до ${rub(top.rub)}. Медианная цена — около ${rub(Math.round(median))}: половина позиций дешевле этой суммы, половина дороже.`],
  ['Откуда цены в прайсе?', `Это цены самой площадки на ${PRICE_DATE} для рублёвого и долларового баланса. Перед открытием сверяйтесь со страницей кейса — она показывает актуальную стоимость.`],
  ['Почему в рублях и монетах цена «по разному курсу»?', `Рублёвые цены площадка задаёт отдельно и округляет до удобных чисел. Отношение рублей к монетам у кейсов прайса — от ${rMin} до ${rMax}. Подробный разбор — на странице <a href="/rubli-ili-monety/">«Рубли или монеты»</a>.`],
  ['Есть ли скидка на пополнение?', `Промокод ${PROMO} добавляет 7% к первому пополнению. Его вводят в окне депозита до оплаты.`],
  ['Где посмотреть, что лежит в кейсе?', 'Нажмите «Открыть» у нужной позиции — откроется площадка, где у каждого кейса есть полный список предметов и их шансы.'],
  ['Можно ли получить деньги обратно, если кейс не понравился?', 'Нет. Открытый кейс не возвращается, а выпавший предмет можно вывести в Steam, продать на баланс или использовать в апгрейде.'],
  ['Сколько лет нужно, чтобы играть?', 'Восемнадцать. Покупка кейсов — игра с риском, и прайс не обещает, что дроп окупит цену.'],
];

let CTX;
function build(ctx) {
  const { I, SPY, C, ext, sec, copyDir, ROOT, A } = ctx;
  const s = SITE;
  const page = pager(ctx, s);
  const crumbs = crumbsFor('Прайс');
  // только картинки своих кейсов: у каждого каталога свой набор файлов
  const own = new Set(ALL.map(i => i.key + '.webp'));
  copyDir(`${ROOT}/_shared/cases3`, `${A}/cases`, f => own.has(f));

  const open = (label = 'Открыть', cls = 'btn btn--primary') => ext(cls, `<span>${label}</span>${I.arrow}`);
  const copy = (cls = 'btn btn--ghost') => `<button class="${cls}" type="button" data-copy="${PROMO}">${I.copy}<span>${PROMO}</span></button>`;
  const hd = (k, h, lead = '') => `<div class="hd5"><span class="hd5__k">${k}</span><h2>${h}</h2>${lead ? `<p>${lead}</p>` : ''}</div>`;
  const row = (i, n) => `<a class="pr5" href="${SPY}" rel="nofollow"><span class="pr5__n">${String(n + 1).padStart(2, '0')}</span><img src="/assets/cases/${i.key}.webp" alt="Кейс ${clean(i.name)}" width="56" height="56" loading="lazy"><span class="pr5__name"><b>${i.name}</b><small>${collBySlug[i.coll].title}</small></span><span class="pr5__dots"></span><span class="pr5__price"><b>${rub(i.rub)}</b><small>${coin(i.coin)} мон.</small></span></a>`;
  const list = items => `<div class="list5">${items.map(row).join('')}</div>`;
  const bandOf = i => BANDS.find(b => i.rub >= b.a && i.rub < b.b);
  const ph = ({ cr, k, h1, lead, aside = '' }) => `<section class="ph5"><div class="container"><div class="ph5__in"><div>${cr}<span class="ph5__k">${k}</span><h1>${h1}</h1><p class="lead">${lead}</p></div>${aside}</div></div></section>`;
  const stat = (b, t) => `<div><b>${b}</b><span>${t}</span></div>`;
  const qa = items => `<div class="qa5">${items.map(([q, a], n) => `<details${n === 0 ? ' open' : ''}><summary class="faq-q"><span>${q}</span><span class="faq-ico">${I.chevron}</span></summary><div class="faq-a">${a}</div></details>`).join('')}</div>`;
  const tail = (t = 'Нашли кейс по карману?', d = `Открытие — на площадке. Первое пополнение с кодом ${PROMO} даст +7%.`) => `<section class="tail5"><div class="container"><div class="tail5__in"><div><h2>${t}</h2><p>${d}</p></div><div class="tail5__btns">${copy()}${open('Перейти к кейсам')}</div></div></div></section>`;
  // «линейка»: каждый кейс — засечка на логарифмической шкале цены
  const lg = v => Math.log10(v);
  const L0 = lg(low.rub), L1 = lg(top.rub);
  const ruler = `<div class="ruler5" aria-hidden="true"><div class="ruler5__line">${byPrice.map(i => `<i style="left:${((lg(i.rub) - L0) / (L1 - L0) * 100).toFixed(2)}%" title="${i.name} — ${rub(i.rub)}"></i>`).join('')}</div><div class="ruler5__marks">${[low.rub, 5000, 20000, 100000, top.rub].map(v => `<span style="left:${((lg(v) - L0) / (L1 - L0) * 100).toFixed(2)}%">${v >= 1000 ? `${Math.round(v / 100) / 10}K` : v} ₽</span>`).join('')}</div></div>`;

  // ---------- Главная ----------
  {
    const body = `<section class="hero5"><div class="container">
<div class="hero5__top"><span class="ph5__k">Прайс-лист · цены на ${PRICE_DATE}</span><button class="hero5__code" type="button" data-copy="${PROMO}">${PROMO}<small>+7% к пополнению</small></button></div>
<h1>Цены на кейсы Мусор Дроп: прайс-лист старших серий — 50/50, StatTrak и металл</h1>
<p class="lead">${ALL.length} кейсов из трёх серий Musor Drop с крупными ставками — от ${rub(low.rub)} до ${rub(top.rub)}. Выберите диапазон, сравните рубли и монеты и переходите к открытию с готовым решением.</p>
${ruler}
<div class="bands5">${BANDS.map(b => `<a class="band5" href="/prajs/${b.slug}/"><b>${b.title}</b><span>${cases(b.items.length)}</span><i style="--w:${Math.round(b.items.length / Math.max(...BANDS.map(x => x.items.length)) * 100)}%"></i></a>`).join('')}</div>
</div></section>`
      + sec(`<div class="stats5">${stat(ALL.length, 'кейсов в прайсе')}${stat(rub(low.rub), 'минимальная цена')}${stat(rub(Math.round(median)), 'медиана')}${stat(rub(top.rub), 'максимальная цена')}${stat(COLLS.length, 'коллекций')}</div>`, false, 'section--s5')
      + sec(`<div class="two5"><div>${hd('Вход', 'Шесть самых доступных', 'С них проще всего начать знакомство со старшими сериями: 50/50 и первый StatTrak™.')}${list(byPrice.slice(0, 6))}<a class="more5" href="/prajs/do-5000-rublej/">Все кейсы до 5 000 ₽ ${I.arrow}</a></div><div>${hd('Вершина', 'Шесть самых дорогих', 'Металлические «мусорки» — для опытных игроков с крупным балансом.')}${list(byPrice.slice(-6).reverse())}<a class="more5" href="/samye-dorogie/">Топ-10 по цене ${I.arrow}</a></div></div>`, true)
      + sec(`${hd('Коллекции', 'Где какая серия по цене', 'Полоса показывает разброс цен внутри коллекции на той же шкале, что и линейка выше.')}<div class="spans5">${COLLS.map(c => `<div class="span5"><span class="span5__t">${c.title}<small>${cases(c.items.length)}</small></span><span class="span5__bar"><i style="left:${((lg(c.min) - L0) / (L1 - L0) * 100).toFixed(1)}%;width:${Math.max(1.2, (lg(c.max) - lg(c.min)) / (L1 - L0) * 100).toFixed(1)}%"></i></span><span class="span5__p">${rub(c.min)} — ${rub(c.max)}</span></div>`).join('')}</div>`)
      + sec(`<div class="two5 two5--mid"><div>${hd('Валюта', 'Одна позиция — две цены')}<p class="muted">У каждого кейса две цены: в рублях для рублёвого баланса и в монетах для долларового. Рублёвые цены площадка ставит отдельно, поэтому «курс» у разных кейсов разный — от ${rMin} до ${rMax} ₽ за монету. Мы посчитали его для каждой позиции прайса.</p><a class="more5" href="/rubli-ili-monety/">Разбор «Рубли или монеты» ${I.arrow}</a></div><div class="promo5">${PROMOS.map((c, n) => `<div class="promo5__it${n ? '' : ' is-main'}"><b>${c}</b><span>${n ? (n === 1 ? 'резервный код на пополнение' : 'вводится в разделе бонусов') : '+7% к первому пополнению'}</span><button type="button" data-copy="${c}" aria-label="Скопировать ${c}">${I.copy}</button></div>`).join('')}<a class="more5" href="/promokod/">Как активировать ${I.arrow}</a></div></div>`, true)
      + sec(`<div class="narrow">${hd('Зачем прайс', 'Почему мы свели цены в одну таблицу')}<div class="prose"><p>На самой площадке кейсы показаны лентой, а цена видна только у той карточки, на которую вы смотрите. Сравнить, насколько дорожает Металлическая коллекция от ступени к ступени или чем «Бедный» StatTrak отличается от «Дорогого», так неудобно. Поэтому прайс посвящён только старшим сериям — 50/50, StatTrak™ и металлу. В прайсе все позиции стоят на одной шкале: можно отсортировать по цене, отфильтровать диапазон и сразу увидеть соседей.</p><p>Прайс ничего не продаёт и не принимает платежи. Кнопки «Открыть» ведут на игровую площадку — там же видно содержимое и шансы каждого кейса. Цены зафиксированы на ${PRICE_DATE}; если на площадке цифра отличается, верна та, что на площадке.</p></div></div>`)
      + sec(`<div class="narrow">${hd('Ответы', 'Коротко о ценах')}${qa(FAQ.slice(0, 5))}<a class="more5" href="/otvety/">Все ответы ${I.arrow}</a></div>`, true)
      + tail();
    page('/', ['Цены на кейсы Мусор Дроп — прайс-лист всех кейсов CS2 | Musor Drop', `Прайс-лист Musor Drop (Мусор Дроп): ${ALL.length} кейсов 50/50, StatTrak™ и Металлической коллекции с ценами в рублях и монетах, от ${rub(low.rub)} до ${rub(top.rub)}. Диапазоны цен и промокод ${PROMO}.`], body, [siteLd('Musor Drop — прайс-лист кейсов'), faqLd(FAQ.slice(0, 5))]);
  }

  // ---------- Полный прайс ----------
  {
    const rows = [...byPrice].reverse().map(i => `<tr data-band="${bandOf(i).slug}"><td><span class="t5"><img src="/assets/cases/${i.key}.webp" alt="" width="36" height="36" loading="lazy">${i.name}</span></td><td>${collBySlug[i.coll].title}</td><td data-v="${i.rub}">${rub(i.rub)}</td><td data-v="${i.coin}">${coin(i.coin)}</td><td data-v="${ratio(i).toFixed(2)}">${ratio(i).toFixed(1)}</td></tr>`).join('');
    const body = ph({ cr: crumbs([null, 'Полный прайс']), k: `${ALL.length} позиций`, h1: `Прайс-лист Мусор Дроп: ${ALL.length} кейсов старших серий по цене`, lead: `Сводная таблица кейсов 50/50, StatTrak™ и Металлической коллекции — от самого дорогого к самому доступному. Сортируйте по любому столбцу и фильтруйте по диапазону. Цены на ${PRICE_DATE}.` })
      + sec(`<div class="flt5" role="group" aria-label="Диапазон цен" data-filter-for="#price5" data-filter-attr="data-band"><button class="is-on" type="button" data-band="all">Все</button>${BANDS.map(b => `<button type="button" data-band="${b.slug}">${b.title}<small>${b.items.length}</small></button>`).join('')}</div>
<div class="tblw5"><table class="tbl5" id="price5" data-sort><thead><tr><th data-k="0" data-t="s">Кейс</th><th data-k="1" data-t="s">Коллекция</th><th data-k="2" data-t="n" aria-sort="descending">Рубли</th><th data-k="3" data-t="n">Монеты</th><th data-k="4" data-t="n">₽ за монету</th></tr></thead><tbody>${rows}</tbody></table></div>
<p class="note5">Нажмите на заголовок, чтобы сменить сортировку. Столбец «₽ за монету» показывает, сколько рублей стоит кейс на рублёвом балансе в пересчёте на одну монету долларового.</p>`, false, 'section--s5')
      + sec(`${hd('Диапазоны', 'Подробно о каждом ценовом поясе')}<div class="bandc5">${BANDS.map(b => `<a href="/prajs/${b.slug}/"><b>${b.title}</b><span>${cases(b.items.length)} · от ${rub(b.items[0].rub)}</span><p>${BAND_TEXT[b.slug].lead.split('. ')[0]}.</p></a>`).join('')}</div>`, true)
      + tail();
    page('/prajs/', [`Прайс-лист кейсов Мусор Дроп — 50/50, StatTrak и металл`, `Таблица цен ${ALL.length} кейсов Musor Drop (50/50, StatTrak™, Металлическая коллекция) в рублях и монетах с сортировкой и фильтром по диапазону. Цены на ${PRICE_DATE}.`], body, listLd('Прайс-лист кейсов Musor Drop', [...byPrice].reverse(), rub));
  }

  // ---------- Диапазоны ----------
  BANDS.forEach((b, idx) => {
    const t = BAND_TEXT[b.slug];
    const colls = [...new Set(b.items.map(i => i.coll))].map(k => [collBySlug[k].title, b.items.filter(i => i.coll === k).length]);
    const avg = Math.round(b.items.reduce((a, i) => a + i.rub, 0) / b.items.length);
    const prev = BANDS[idx - 1], next = BANDS[idx + 1];
    const aside = `<aside class="side5"><div class="side5__row"><span>Позиций</span><b>${b.items.length}</b></div><div class="side5__row"><span>Дешевле всех</span><b>${rub(b.items[0].rub)}</b></div><div class="side5__row"><span>Дороже всех</span><b>${rub(b.items.at(-1).rub)}</b></div><div class="side5__row"><span>Средняя</span><b>${rub(avg)}</b></div>${open('Открыть кейс')}</aside>`;
    const body = ph({ cr: crumbs(['/prajs/', 'Полный прайс'], [null, b.title]), k: `Диапазон · ${b.title}`, h1: t.h1, lead: t.lead, aside })
      + sec(list(b.items), false, 'section--s5')
      + sec(`<div class="two5"><div>${hd('Зачем', 'Для чего брать кейсы этой цены')}<ul class="ticks5">${t.use.map(x => `<li>${I.check}<span>${x}</span></li>`).join('')}</ul><p class="muted" style="margin-top:20px">${t.note}</p></div><div>${hd('Состав', 'Какие коллекции здесь')}<div class="mix5">${colls.map(([n, k]) => `<div><span>${n}</span><b>${k}</b></div>`).join('')}</div></div></div>`, true)
      + sec(`<div class="narrow">${hd('Ответы', 'Вопросы о диапазоне')}${qa(t.faq)}<div class="nav5">${prev ? `<a href="/prajs/${prev.slug}/"><small>← дешевле</small>${prev.title}</a>` : '<span></span>'}${next ? `<a href="/prajs/${next.slug}/" class="is-r"><small>дороже →</small>${next.title}</a>` : '<span></span>'}</div></div>`)
      + tail();
    page(`/prajs/${b.slug}/`, [`${t.h1} — ${cases(b.items.length)} | Musor Drop`, `${t.lead.split('. ')[0]}. ${cases(b.items.length)} Musor Drop с ценами в рублях и монетах на ${PRICE_DATE}.`], body, [listLd(t.h1, b.items, rub), faqLd(t.faq)]);
  });

  // ---------- Самые дорогие ----------
  {
    const top10 = byPrice.slice(-10).reverse();
    const fq = [['Кто открывает кейсы за сотни тысяч?', 'Игроки с крупным балансом, которые охотятся за самым дорогим дропом. Для большинства такие кейсы — скорее витрина, чем рабочий вариант.'], ['Выгоднее ли дорогой кейс, чем десять дешёвых?', 'Заявленный RTP один для всей площадки — 98% на длинной дистанции. Дорогой кейс не «щедрее», он даёт больший разброс в одной попытке.'], ['Почему в топе нет ножей?', 'Ножевые кейсы относятся к другим сериям и в этот прайс не входят: здесь только 50/50, StatTrak™ и Металлическая коллекция.']];
    const body = ph({ cr: crumbs([null, 'Самые дорогие']), k: 'Верх прайса', h1: 'Самые дорогие кейсы Мусор Дроп: топ-10 прайса', lead: `Десять позиций с самым высоким ценником — от «${top10.at(-1).name}» за ${rub(top10.at(-1).rub)} до «${top.name}» за ${rub(top.rub)}.` })
      + sec(`<div class="podium5">${top10.slice(0, 3).map((i, n) => `<a class="pod5 pod5--${n + 1}" href="${SPY}" rel="nofollow"><span class="pod5__n">${n + 1}</span><img src="/assets/cases/${i.key}.webp" alt="Кейс ${clean(i.name)}" width="140" height="140"><b>${i.name}</b><span>${rub(i.rub)}</span><small>${collBySlug[i.coll].title}</small></a>`).join('')}</div>${list(top10.slice(3)).replace(/pr5__n">(\d+)/g, (m, d) => `pr5__n">${String(+d + 3).padStart(2, '0')}`)}`, false, 'section--s5')
      + sec(`<div class="narrow">${hd('Разбор', 'Из чего складывается цена')}<div class="prose"><p>Топ почти целиком занимает <strong>Металлическая коллекция</strong>: семь «мусорок» от Бронзовой до Великой. Компанию им составляют самый дорогой кейс 50/50 — <strong>«Пламя»</strong> — и <strong>«Дорогой StatTrak»</strong>. Цена кейса определяется стоимостью пула: чем дороже предметы внутри, тем выше вход.</p><p>«Великая Мусорка» стоит особняком — она дороже следующей позиции больше чем в четыре раза. Это кейс-витрина: его открывают редко, но именно он задаёт верхнюю границу прайса.</p><p>Если вам нужен конкретный дорогой скин, сравните цену кейса с ценой самого предмета на рынке. Иногда купить напрямую дешевле, чем пытаться выбить.</p></div></div>`, true)
      + sec(`<div class="narrow">${hd('Ответы', 'Вопросы о дорогих кейсах')}${qa(fq)}</div>`)
      + tail('Играете по-крупному?', 'Поставьте лимит до начала сессии и проверьте таблицу шансов на странице кейса.');
    page('/samye-dorogie/', ['Самые дорогие кейсы Мусор Дроп — топ-10 по цене', `Топ-10 самых дорогих кейсов прайса Musor Drop: от ${rub(top10.at(-1).rub)} до ${rub(top.rub)} за «${top.name}». Металлические мусорки, «Пламя» и StatTrak.`], body, [listLd('Самые дорогие кейсы Musor Drop', top10, rub), faqLd(fq)]);
  }

  // ---------- Рубли или монеты ----------
  {
    const rs = ALL.map(ratio);
    const minR = ALL.reduce((a, i) => ratio(i) < ratio(a) ? i : a), maxR = ALL.reduce((a, i) => ratio(i) > ratio(a) ? i : a);
    const byColl = COLLS.map(c => [c, c.items.reduce((a, i) => a + ratio(i), 0) / c.items.length]).sort((a, b) => a[1] - b[1]);
    const rMin = Math.min(...byColl.map(x => x[1])), rMax = Math.max(...byColl.map(x => x[1]));
    const fq = [['Можно ли поменять валюту после регистрации?', 'Нет. Валюту выбирают один раз при первом входе, и дальше все цены показываются только в ней.'], ['Что такое монета?', 'Внутренняя единица долларового баланса: одна монета соответствует одному доллару.'], ['Какую валюту выбрать?', 'Ту, которой вы будете пополнять. Конвертация при пополнении обычно съедает больше, чем разница в округлении цен.']];
    const body = ph({ cr: crumbs([null, 'Рубли или монеты']), k: 'Разбор', h1: 'Рубли или монеты: сравнение цен кейсов на двух балансах', lead: 'На Musor Drop валюту выбирают один раз — рубли или доллары (монеты). Цены для двух балансов задаются отдельно, и мы посчитали, сколько рублей приходится на одну монету у каждого кейса.' })
      + sec(`<div class="stats5">${stat(`${(Math.min(...rs)).toFixed(1)} ₽`, `минимум — «${minR.name}»`)}${stat(`${(Math.max(...rs)).toFixed(1)} ₽`, `максимум — «${clean(maxR.name)}»`)}${stat(`${(rs.reduce((a, b) => a + b, 0) / rs.length).toFixed(1)} ₽`, 'в среднем по прайсу')}</div>`, false, 'section--s5')
      + sec(`${hd('По коллекциям', 'Сколько рублей стоит одна монета в каждой серии', 'Среднее отношение рублёвой цены к цене в монетах. Чем короче полоса, тем дешевле серия на рублёвом балансе относительно долларового.')}<div class="spans5 spans5--r">${byColl.map(([c, r]) => `<div class="span5"><span class="span5__t">${c.title}<small>${cases(c.items.length)}</small></span><span class="span5__bar"><i style="left:0;width:${(30 + (r - rMin) / (rMax - rMin) * 70).toFixed(1)}%"></i></span><span class="span5__p">${r.toFixed(1)} ₽</span></div>`).join('')}</div>`, true)
      + sec(`<div class="narrow prose"><h2 style="margin-top:0">Почему «курс» у кейсов разный</h2><p>Площадка не пересчитывает рублёвые цены из монет автоматически, а ставит их вручную — часто на «красивые» числа вроде 3 111 или 77 777 ₽. Из-за округления и разных решений по сериям отношение рублей к монетам гуляет: у Бронзовой Мусорки оно около 60, у кейсов 50/50 — около 78, у «Бедного StatTrak» — больше 95.</p><h2>Что это значит на практике</h2><p>Сравнивать два баланса «в лоб» бессмысленно: вы всё равно не сможете переключиться после регистрации. Полезнее другое — при выборе внутри своей валюты понимать, что соседние кейсы могут отличаться по «плотности» цены. Если вы играете на рублях, серии с меньшим отношением при прочих равных обходятся чуть дешевле относительно долларовых цен.</p><h2>Как выбрать валюту при регистрации</h2><ul><li>Пополняете с российской карты — логичнее рубли: не будет двойной конвертации.</li><li>Пополняете криптовалютой или скинами — разница меньше, можно ориентироваться на привычку.</li><li>Смотрите цены в гайдах и на стримах в монетах — выбирайте доллары, чтобы не пересчитывать.</li></ul></div>`)
      + sec(`<div class="narrow">${hd('Ответы', 'Вопросы о валюте')}${qa(fq)}</div>`, true)
      + tail();
    page('/rubli-ili-monety/', ['Рубли или монеты на Мусор Дроп — сравнение цен кейсов', 'Сколько рублей приходится на одну монету у кейсов 50/50, StatTrak™ и Металлической коллекции Musor Drop: разбор по сериям, минимумы и максимумы, совет по выбору валюты.'], body, faqLd(fq));
  }

  // ---------- Промокод ----------
  {
    const deps = [500, 1000, 3000, 5000, 10000];
    const fq = [['Почему бонус не начислился?', 'Код ввели после оплаты, с ошибкой в написании или аккаунт уже получал стартовый бонус. Вводите код латиницей, до нажатия «Оплатить».'], ['Действует ли код на второе пополнение?', `${PROMO} рассчитан на первое пополнение аккаунта.`], ['Где ещё брать промокоды?', 'Площадка публикует коды в своём Telegram-канале и на стримах. Такие коды вводятся в разделе бонусов.']];
    const body = ph({ cr: crumbs([null, 'Промокод']), k: 'Бонус', h1: `Промокод Мусор Дроп ${PROMO}: +7% к первому пополнению`, lead: 'Самый простой способ получить больше на старте — ввести промокод в окне пополнения. Ниже таблица, сколько добавит бонус, и все коды, которые встречаются на сайтах о Musor Drop.' })
      + sec(`<div class="promo5 promo5--wide">${PROMOS.map((c, n) => `<div class="promo5__it${n ? '' : ' is-main'}"><b>${c}</b><span>${['+7% к первому пополнению — основной код', 'резервный код на пополнение, бонус показывается после ввода', 'вводится в разделе бонусов личного кабинета'][n]}</span><button type="button" data-copy="${c}" aria-label="Скопировать ${c}">${I.copy}</button></div>`).join('')}</div>`, false, 'section--s5')
      + sec(`<div class="two5"><div>${hd('Расчёт', `Сколько даёт ${PROMO}`)}<div class="tblw5"><table class="tbl5 tbl5--sm"><thead><tr><th>Пополнение</th><th>Бонус 7%</th><th>На балансе</th></tr></thead><tbody>${deps.map(d => `<tr><td>${rub(d)}</td><td>+${rub(Math.round(d * 0.07))}</td><td><b>${rub(Math.round(d * 1.07))}</b></td></tr>`).join('')}</tbody></table></div></div><div>${hd('Активация', 'Четыре шага')}<ol class="steps5">${[['Перейдите на площадку', 'По кнопке «Открыть» на любой странице прайса.'], ['Войдите', 'Через Steam, Telegram, VK или Google — пароль не нужен.'], ['Откройте пополнение', 'Выберите карту, криптовалюту или скины.'], ['Вставьте код до оплаты', `${PROMO} — в поле «Промокод», затем подтвердите платёж.`]].map(([t, d]) => `<li><b>${t}</b><span>${d}</span></li>`).join('')}</ol></div></div>`, true)
      + sec(`<div class="narrow">${hd('Кроме кода', 'Что ещё возвращает часть денег')}<div class="prose"><p>Помимо стартового промокода на площадке работают <strong>rakeback</strong> — часть каждой ставки возвращается на баланс, <strong>еженедельный кэшбэк 10%</strong> от потраченного, <strong>бесплатный кейс</strong> за подписку на Telegram-канал и <strong>реферальная программа</strong> с процентом от игры приглашённых друзей.</p><p>Бонусы не меняют шансы в кейсах — они просто увеличивают сумму, с которой вы играете. Относитесь к ним как к скидке, а не как к поводу пополнить больше запланированного.</p></div>${qa(fq)}</div>`)
      + tail('Код скопирован?', 'Вставьте его в окне пополнения до оплаты.');
    page('/promokod/', [`Промокод Мусор Дроп ${PROMO} — +7% к пополнению, расчёт бонуса`, `Промокод Musor Drop ${PROMO}: +7% к первому пополнению. Таблица бонуса для 500–10 000 ₽, коды MUSOR и INVFMFEP7, как активировать.`], body, faqLd(fq));
  }

  // ---------- От покупки до вывода ----------
  {
    const st = [['login', 'Вход', 'Steam, Telegram, VK или Google. Аккаунт создаётся автоматически, а валюта баланса выбирается сразу после первого входа.'], ['wallet', 'Пополнение', `Карта, криптовалюта или скины CS2 через бота. Первое пополнение — с кодом ${PROMO}.`], ['box', 'Выбор по прайсу', 'Определите диапазон, сравните соседние кейсы и посмотрите таблицу шансов на странице кейса.'], ['up', 'Открытие', 'Рулетка останавливается на результате, предмет попадает в инвентарь площадки.'], ['download', 'Вывод', 'Укажите трейд-ссылку, включите Steam Guard и откройте инвентарь — скин придёт предложением обмена.']];
    const fq = [['Можно ли не выводить, а продать скин?', 'Да, предмет продаётся на баланс по цене площадки. Деньги можно потратить на другой кейс или апгрейд.'], ['Что делать, если вывод задерживается?', 'Проверьте статус в профиле. Если предмета нет у бота, вывод может занять больше времени; при долгом ожидании пишите в поддержку площадки.']];
    const body = ph({ cr: crumbs([null, 'Как получить скин']), k: 'Маршрут', h1: 'От выбора в прайсе до скина в Steam: пять шагов', lead: 'Прайс помогает выбрать кейс, а всё остальное происходит на площадке. Коротко о том, что будет после клика «Открыть».' })
      + sec(`<div class="route5">${st.map(([ic, t, d], n) => `<div class="route5__it"><span class="route5__n">${n + 1}</span><span class="ico">${I[ic]}</span><h2>${t}</h2><p>${d}</p></div>`).join('')}</div>`, false, 'section--s5')
      + sec(`<div class="two5"><div class="card"><h3>Что подготовить до вывода</h3><ul class="ticks5">${['Steam Guard Mobile Authenticator', 'Открытый инвентарь в настройках приватности', 'Актуальная трейд-ссылка', 'Отсутствие трейд-бана на аккаунте'].map(x => `<li>${I.check}<span>${x}</span></li>`).join('')}</ul></div><div class="card"><h3>Чего не делать</h3><ul class="ticks5 ticks5--x">${['Принимать обмены, которые вы не запрашивали', 'Вводить пароль Steam на незнакомых страницах', 'Пополнять «чтобы отыграться»', 'Открывать дорогие кейсы, не посмотрев шансы'].map(x => `<li>${I.x}<span>${x}</span></li>`).join('')}</ul></div></div>`, true)
      + sec(`<div class="narrow">${hd('Ответы', 'После открытия')}${qa(fq)}</div>`)
      + tail();
    page('/ot-pokupki-do-vyvoda/', ['Как получить скин с Мусор Дроп — от кейса до вывода в Steam', `Пять шагов на Musor Drop: вход, пополнение с промокодом ${PROMO}, выбор кейса по цене, открытие и вывод скина в Steam. Что подготовить и чего избегать.`], body, faqLd(fq));
  }

  // ---------- Ответы ----------
  {
    const body = ph({ cr: crumbs([null, 'Ответы']), k: `${FAQ.length} ответов`, h1: 'Вопросы о ценах на кейсы Мусор Дроп', lead: 'Всё, что спрашивают о стоимости кейсов, валюте, бонусах и возвратах. Не нашли нужное — напишите на почту, указанную внизу страницы.' })
      + sec(`<div class="narrow">${qa(FAQ)}</div>`, false, 'section--s5')
      + tail();
    page('/otvety/', ['Ответы о ценах кейсов Мусор Дроп — валюта, бонусы, возврат', 'Сколько стоят кейсы Musor Drop, почему цены в рублях и монетах отличаются, как получить бонус к пополнению и можно ли вернуть деньги за кейс.'], body, faqLd(FAQ));
  }

  // ---------- О прайсе ----------
  {
    const body = ph({ cr: crumbs([null, 'О прайсе']), k: 'О проекте', h1: 'О прайс-листе', lead: 'Независимая сводка цен на старшие серии Musor Drop — 50/50, StatTrak™ и Металлическую коллекцию. Мы не продаём кейсы и не принимаем платежи — только собираем цифры в удобный вид.' })
      + sec(`<div class="narrow prose"><h2 style="margin-top:0">Откуда данные</h2><p>Цены взяты с самой площадки для обоих типов баланса и зафиксированы на ${PRICE_DATE}. Когда площадка меняет цены или добавляет кейсы, мы обновляем прайс целиком, а не точечно, — чтобы таблица оставалась согласованной.</p><h2>Чего здесь нет</h2><p>Мы не публикуем «секретные схемы», не обещаем окупаемость и не оцениваем, какой кейс «выгоднее»: заявленный RTP — 98% для всей площадки на длинной дистанции, а в отдельной сессии решает случай.</p><h2>Связаться</h2><p>Заметили расхождение с площадкой или хотите предложить новый срез данных — пишите на <a href="mailto:${C.EMAIL}">${C.EMAIL}</a>. Вопросы по балансу и выводу решает поддержка площадки: у нас нет доступа к аккаунтам.</p></div>`, false, 'section--s5')
      + tail();
    page('/o-prajse/', ['О прайс-листе кейсов Мусор Дроп — откуда цены', 'Кто ведёт прайс-лист кейсов Musor Drop, откуда берутся цены, как часто они обновляются и как с нами связаться.'], body);
  }
}

// ---------- Шапка и футер ----------
function header(s, cur) {
  const { I, SPY } = CTX;
  const nav = NAV.map(([h, t]) => `<a href="${h}"${cur.startsWith(h) ? ' class="is-active"' : ''}>${t}</a>`).join('');
  return `<header class="header header5"><div class="container header__in"><a href="/" class="logo logo5" aria-label="Прайс Musor Drop — главная"><img src="/assets/logo.svg" alt="Musor Drop" width="34" height="34"><span><span class="logo__name">Musor Drop</span><span class="logo__tag">прайс кейсов</span></span></a><nav class="nav" aria-label="Основное меню">${nav}</nav><div class="header__cta"><a class="btn btn--primary btn--sm" href="${SPY}" rel="nofollow">${I.steam}<span>Войти</span></a></div><button class="burger" type="button" aria-label="Меню" aria-expanded="false">${I.menu}</button></div></header>
<nav class="mnav" aria-label="Мобильное меню">${NAV.map(([h, t]) => `<a href="${h}">${t}</a>`).join('')}<a href="/o-prajse/">О прайсе</a><a class="btn btn--primary" href="${SPY}" rel="nofollow">${I.steam}<span>Войти через Steam</span></a></nav>`;
}

function footer(s) {
  const { I, SPY, C } = CTX;
  return `<footer class="f5"><div class="container">
<div class="f5__idx"><span class="f5__t">Индекс цен · ${PRICE_DATE}</span>${BANDS.map(b => `<a href="/prajs/${b.slug}/"><b>${b.items.length}</b><span>${b.title}</span></a>`).join('')}</div>
<div class="f5__row"><div class="f5__brand"><a href="/" class="logo logo5"><img src="/assets/logo.svg" alt="" width="34" height="34"><span><span class="logo__name">Musor Drop</span><span class="logo__tag">прайс кейсов</span></span></a><p>Цены на ${ALL.length} кейсов 50/50, StatTrak™ и Металлической коллекции в рублях и монетах. Не продаём кейсы — помогаем выбрать.</p></div>
<nav class="f5__nav" aria-label="Разделы">${NAV.map(([h, t]) => `<a href="${h}">${t}</a>`).join('')}<a href="/o-prajse/">О прайсе</a></nav>
<div class="f5__act"><button class="btn btn--ghost btn--sm" type="button" data-copy="${PROMO}">${I.copy}<span>${PROMO} · +7%</span></button><a class="btn btn--primary btn--sm" href="${SPY}" rel="nofollow"><span>Открыть кейс</span>${I.arrow}</a></div></div>
<div class="f5__legal"><span>18+</span><p>Открытие кейсов — игра с риском потери средств. Прайс не связан с Valve и Steam, цены носят справочный характер. Почта: <a href="mailto:${C.EMAIL}">${C.EMAIL}</a></p><span>© 2026</span></div>
</div></footer>`;
}

const SITE = {
  id: 'v5', out: 'site-5', online: 2204, color: '#100E18',
  T: {},
  fonts: 'https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700;800&display=swap',
  vars: { bg: '#100E18', 'bg-rgb': '16,14,24', bg2: '#15121F', card: '#1B1828', 'card-h': '#231F33', line: 'rgba(255,255,255,.07)', line2: 'rgba(255,255,255,.12)', acc: '#A57CFF', 'acc-h': '#C6AEFF', 'acc-d': '#7F57E0', 'acc-m': 'rgba(165,124,255,.14)', 'acc-b': 'rgba(165,124,255,.38)', 'acc-rgb': '165,124,255', text: '#F4F1FC', muted: '#BFB8D2', dim: '#88819C', ease: 'cubic-bezier(.22,1,.36,1)' },
  heroCase: ['case01', ''],
  noFeed: true, // ленты дропа на сайтах 1–5 нет
  header: (s, cur) => header(s, cur),
  footer: s => footer(s),
  render: ctx => { CTX = ctx; build(ctx); },
};
export { SITE as site };
