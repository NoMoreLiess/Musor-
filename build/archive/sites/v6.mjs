// Сайт 6 — «подборки»: тематические рейтинги кейсов Musor Drop под задачу игрока.
// Свой набор: Кейсы из CS2, Mystery Box и Стандартные ножи. Пурпурный, Unbounded + Inter.
import { pick, rub, coin, PRICE_DATE } from './catalog.mjs';
import { cases, faqLd, listLd, siteLd, pager, crumbsFor, clean, PROMOS, dropsOf } from './kit.mjs';

const PROMO = 'FIRST';
// свой набор коллекций сайта (см. pick() в catalog.mjs)
const { ALL, collBySlug } = pick(['kejsy-iz-cs2', 'mystery-box', 'nozhi']);
const by = (...slugs) => ALL.filter(i => slugs.includes(i.coll));
const asc = l => [...l].sort((a, b) => a.rub - b.rub);
const desc = l => [...l].sort((a, b) => b.rub - a.rub);
const avgOf = l => Math.round(l.reduce((a, i) => a + i.rub, 0) / l.length);

// ---------- Подборки ----------
const SEL = [
  {
    slug: 'pervyj-kejs', emoji: '01', title: 'Первый кейс без переплаты', short: 'Старт',
    h1: 'С чего начать на Мусор Дроп: 6 недорогих кейсов из CS2',
    items: asc(by('kejsy-iz-cs2')).slice(0, 6),
    lead: 'Шесть самых доступных копий официальных контейнеров — от Spectrum за 280 ₽ до кейсов за 389 ₽. Хороший первый шаг: пул знаком по игре, а цена не пугает.',
    why: ['Знакомые по игре коллекции — понятно, что может выпасть', 'Цены почти одинаковые: выбор идёт по содержимому', 'Можно сравнить несколько операций без серьёзных расходов'],
    tip: 'Откройте два-три разных кейса из списка и сравните, что выпадало. Так быстрее станет ясно, какая коллекция вам ближе, чем если крутить один и тот же кейс.',
    faq: [['Нужно ли сразу пополнять баланс?', 'Не обязательно: на площадке есть демо-баланс для кейсов и апгрейда. Подборка пригодится, когда решите играть на реальные деньги.'], ['Какой кейс подборки самый дешёвый?', 'Spectrum — 280 ₽, или 3.6 монеты.']],
  },
  {
    slug: 'kak-v-igre', emoji: '02', title: 'Как контейнеры в игре', short: 'Из CS2',
    h1: 'Кейсы как в CS2: все копии официальных контейнеров на Мусор Дроп',
    items: asc(by('kejsy-iz-cs2')),
    lead: 'Двенадцать кейсов, собранных по коллекциям Valve: Kilowatt, Revolution, Gallery, Fever, Dreams & Nightmares, Operation Riptide и другие. Для тех, кто знает, в какой операции вышел нужный скин.',
    why: ['Знакомый состав: пул повторяет игровую коллекцию', 'Ключ не нужен — его стоимость уже учтена в цене', 'Почти все кейсы стоят 370–389 ₽'],
    tip: 'Если не помните, в какой коллекции лежит нужный скин, найдите его на торговой площадке Steam: там указано название коллекции. Потом ищите одноимённый кейс в списке.',
    faq: [['Чем отличается «Гидра»?', 'Это самый дорогой кейс серии — 860 ₽. Остальные стоят 280–460 ₽.'], ['Шансы такие же, как в игре?', 'Шансы задаёт площадка, и они показаны на странице каждого кейса. Сверяйтесь с ними, а не с игровыми.']],
  },
  {
    slug: 'vokrug-odnogo-skina', emoji: '03', title: 'Вокруг одного скина', short: 'Mystery Box',
    h1: 'Mystery Box на Мусор Дроп: кейсы вокруг одного узнаваемого скина',
    items: asc(by('mystery-box')),
    lead: 'Пять кейсов, где пул строится вокруг одного скина в разных версиях и качествах: «Код красный», «Поток информации», «Удар молнии», «Волны» — и отдельный «Худший или Лучший».',
    why: ['Понятная цель: известно, вокруг какого скина собран кейс', 'Разные версии одного предмета — от простой до самой дорогой', '«Худший или Лучший» — для любителей крайних исходов'],
    tip: 'Разброс внутри Mystery Box большой: версия предмета решает почти всё. Посмотрите на странице кейса, сколько стоит самая частая версия, — именно её вы получите чаще всего.',
    faq: [['Какой Mystery Box самый доступный?', '«Случайный Код красный» — 6 767 ₽.'], ['Что такое «Худший или Лучший»?', 'Кейс с крайними исходами: в пуле либо недорогие, либо очень дорогие предметы, середины почти нет.']],
  },
  {
    slug: 'nozh-v-lyubom-iskhode', emoji: '04', title: 'Нож в любом исходе', short: 'Ножи',
    h1: 'Кейсы с ножами на Мусор Дроп: шесть моделей на выбор',
    items: asc(by('nozhi')),
    lead: 'Кейсы на конкретную модель ножа: Стилет, Коготь, Байонет, М9 Байонет, Бабочка и Керамбит. Нож гарантирован — от удачи зависит только отделка, а с ней и стоимость.',
    why: ['Нож в каждом исходе — вопрос только в отделке', 'Модель выбираете вы, а не случай', 'Стилет за 29 999 ₽ — самый доступный вход'],
    tip: 'Модель сильнее всего влияет на цену кейса: Керамбит почти вчетверо дороже Стилета. Если вам важен сам нож, а не конкретная модель, начните с нижней строчки рейтинга.',
    faq: [['Нож из кейса гарантирован?', 'Да, в пуле только ножи выбранной модели. От удачи зависит отделка и её стоимость.'], ['Какой ножевой кейс самый дорогой?', '«★ Керамбит» — 108 999 ₽ (1 211 монет).']],
  },
  {
    slug: 'po-krupnomu', emoji: '05', title: 'По-крупному', short: 'Премиум',
    h1: 'Самые дорогие кейсы подборок: ножи и Mystery Box от 60 000 ₽',
    items: asc(ALL.filter(i => i.rub >= 60000)),
    lead: 'Верх нашего набора: дорогие модели ножей и самые дорогие Mystery Box. Подборка для опытных игроков с крупным балансом — вход начинается с 63 267 ₽.',
    why: ['Самая высокая планка дропа среди наших подборок', 'Модели ножей и Mystery Box в одном рейтинге', 'Удобно сравнить, сколько стоит «гарантия ножа» против разброса Mystery Box'],
    tip: 'Не поднимайтесь по рейтингу подряд, «чтобы отбить» прошлый кейс. Каждое открытие независимо, а цена ошибки на этой ступени исчисляется десятками тысяч.',
    faq: [['Что дороже всего в подборке?', '«★ Керамбит» — 108 999 ₽.'], ['С чего начать, если хочется попробовать?', 'С нижней строчки — «Случайного Удара Молнии» за 63 267 ₽ — или вообще с подборки «Нож в любом исходе», где вход от 29 999 ₽.']],
  },
];

const FAQ = [
  ['По какому принципу собраны подборки?', 'По задаче игрока, а не по коллекции: «разобраться в механике», «скин на своё оружие», «гарантированный нож». Один кейс может попасть в несколько подборок.'],
  ['Это реклама конкретных кейсов?', 'Нет. Мы не знаем, что выпадет именно вам, и не обещаем окупаемость. Подборки помогают сузить выбор, а шансы каждого кейса видны на площадке.'],
  ['Как часто обновляются подборки?', `Вместе с ценами каталога. Текущие данные — на ${PRICE_DATE}.`],
  ['Есть ли бонус на первое пополнение?', `Да, промокод ${PROMO} добавляет 7%. Вводится в окне пополнения до оплаты.`],
  ['Как войти на площадку?', 'Через Steam, Telegram, VK или Google. Регистрация с паролем не нужна.'],
  ['Можно ли вывести выпавший скин?', 'Да, в Steam через трейд-ссылку. Нужны Steam Guard Mobile Authenticator и открытый инвентарь.'],
];

let CTX;
function build(ctx) {
  const { I, SPY, C, ext, sec, copyDir, ROOT, A } = ctx;
  const s = SITE;
  const page = pager(ctx, s);
  const crumbs = crumbsFor('Главная');
  // только картинки своих кейсов: у каждого каталога свой набор файлов
  const own = new Set(ALL.map(i => i.key + '.webp'));
  copyDir(`${ROOT}/_shared/cases3`, `${A}/cases`, f => own.has(f));

  const go = (label = 'Открыть на площадке', cls = 'btn btn--primary') => ext(cls, `<span>${label}</span>${I.arrow}`);
  const sh = (h, lead = '', k = '') => `<div class="sh6">${k ? `<span class="sh6__k">${k}</span>` : ''}<h2>${h}</h2>${lead ? `<p>${lead}</p>` : ''}</div>`;
  const covers = l => desc(l).slice(0, 3).map(i => `<img src="/assets/cases/${i.key}.webp" alt="" width="90" height="90" loading="lazy">`).join('');
  const selCard = x => `<a class="sc6" href="/podborki/${x.slug}/"><span class="sc6__n">${x.emoji}</span><span class="sc6__imgs">${covers(x.items)}</span><b>${x.title}</b><span class="sc6__m">${cases(x.items.length)} · ${rub(x.items[0].rub)} — ${rub(x.items.at(-1).rub)}</span></a>`;
  const rank = (items, avg) => `<ol class="rk6">${items.map((i, n) => {
    const d = Math.round((i.rub / avg - 1) * 100);
    return `<li><a href="${SPY}" rel="nofollow"><span class="rk6__n">${n + 1}</span><img src="/assets/cases/${i.key}.webp" alt="Кейс ${clean(i.name)}" width="72" height="72" loading="lazy"><span class="rk6__t"><b>${i.name}</b><small>${collBySlug[i.coll].title}</small></span><span class="rk6__d ${d < 0 ? 'is-lo' : 'is-hi'}">${d === 0 ? 'средняя цена' : `${d > 0 ? '+' : '−'}${Math.abs(d)}% к средней`}</span><span class="rk6__p"><b>${rub(i.rub)}</b><small>${coin(i.coin)} мон.</small></span></a></li>`;
  }).join('')}</ol>`;
  const qa = items => `<div class="qa6">${items.map(([q, a]) => `<details><summary class="faq-q"><span>${q}</span><span class="faq-ico">${I.plus}</span></summary><div class="faq-a">${a}</div></details>`).join('')}</div>`;
  const banner = () => `<section class="bn6"><div class="container"><div class="bn6__in"><div class="bn6__code"><small>промокод</small><b>${PROMO}</b><button type="button" data-copy="${PROMO}">${I.copy}<span>копировать</span></button></div><div class="bn6__txt"><h2>Выбрали подборку — дальше дело за площадкой</h2><p>Код ${PROMO} добавит 7% к первому пополнению. Шансы каждого кейса видны до открытия.</p></div>${go()}</div></div></section>`;
  const ph = ({ cr, k, h1, lead, extra = '' }) => `<section class="ph6"><div class="container">${cr}<span class="sh6__k">${k}</span><h1>${h1}</h1><p class="lead">${lead}</p>${extra}</div></section>`;

  // ---------- Главная ----------
  {
    const ops = by('kejsy-iz-cs2');
    const body = `<section class="hero6"><div class="container hero6__in"><div>
<span class="sh6__k">${SEL.length} подборок · ${ALL.length} кейса · ${PRICE_DATE}</span>
<h1>Подборки кейсов Мусор Дроп <span>под вашу задачу</span></h1>
<p class="lead">Мы взяли три серии Musor Drop — копии контейнеров CS2, Mystery Box и ножевые кейсы — и разложили их по целям: начать без переплаты, найти скин из своей операции, получить нож или сыграть по-крупному.</p>
<div class="hero6__btns"><a class="btn btn--primary" href="/podborki/">Смотреть подборки ${I.arrow}</a><a class="btn btn--ghost" href="/kak-vybrat/">Как выбрать кейс</a></div></div>
<div class="hero6__q"><div class="hero6__qt">Что вы хотите?</div>${SEL.map(x => `<a href="/podborki/${x.slug}/"><span>${x.emoji}</span>${x.title}${I.arrow}</a>`).join('')}</div></div></section>`
      + sec(`${sh('Все подборки', 'Каждая собрана вокруг одной цели. Внутри — рейтинг по цене, сравнение со средним и совет, как играть.', 'Каталог целей')}<div class="sc6grid">${SEL.map(selCard).join('')}</div>`)
      + sec(`<div class="wp6">${sh('Выберите коллекцию', 'Двенадцать копий официальных контейнеров CS2. Нажмите на кейс, чтобы открыть его на площадке.', 'Как в игре')}<div class="wp6__grid wp6__grid--6">${desc(ops).map(i => `<a href="${SPY}" rel="nofollow"><img src="/assets/cases/${i.key}.webp" alt="Кейс ${i.name}" width="80" height="80" loading="lazy"><b>${i.name}</b><span>${rub(i.rub)}</span></a>`).join('')}</div><a class="lnk6" href="/podborki/kak-v-igre/">Подробнее о кейсах из CS2 ${I.arrow}</a></div>`, true)
      + sec(`<div class="meth6"><div>${sh('Как мы собираем подборки', '', 'Методика')}<p class="muted">Мы не ставим оценки «выгодно/невыгодно» — у площадки один заявленный RTP 98% для всех кейсов на длинной дистанции. Вместо этого смотрим на три вещи: какую задачу решает кейс, сколько он стоит относительно соседей по подборке и что в нём гарантировано.</p><a class="lnk6" href="/kak-vybrat/">Как выбрать кейс самостоятельно ${I.arrow}</a></div><div class="meth6__list">${[['Задача', 'Каждая подборка отвечает на один вопрос игрока — «что открыть, если…».'], ['Цена к средней', 'В рейтинге видно, насколько кейс дороже или дешевле среднего по подборке.'], ['Гарантия', 'Отмечаем, что выпадет в любом случае: например, нож выбранной модели.']].map(([t, d], n) => `<div><span>${n + 1}</span><b>${t}</b><p>${d}</p></div>`).join('')}</div></div>`)
      + sec(`<div class="faq6">${sh('Вопросы о подборках', '', 'FAQ')}${qa(FAQ.slice(0, 4))}</div>`, true)
      + banner();
    page('/', ['Подборки кейсов Мусор Дроп — что открыть под вашу задачу | Musor Drop', `Подборки кейсов Musor Drop (Мусор Дроп): недорогой старт, копии контейнеров CS2, Mystery Box, ножи выбранной модели и премиум. Рейтинги по цене на ${PRICE_DATE}.`], body, [siteLd('Musor Drop — подборки кейсов'), faqLd(FAQ.slice(0, 4))]);
  }

  // ---------- Список подборок ----------
  {
    const body = ph({ cr: crumbs([null, 'Все подборки']), k: `${SEL.length} подборок`, h1: 'Все подборки кейсов Мусор Дроп', lead: 'Выберите цель — внутри рейтинг кейсов по цене, сравнение со средним и советы. Цены в рублях и монетах на ' + PRICE_DATE + '.' })
      + sec(`<div class="sl6">${SEL.map(x => `<a class="sl6__it" href="/podborki/${x.slug}/"><span class="sc6__n">${x.emoji}</span><span class="sl6__body"><b>${x.title}</b><p>${x.lead.split('. ')[0]}.</p><small>${cases(x.items.length)} · от ${rub(x.items[0].rub)} · в среднем ${rub(avgOf(x.items))}</small></span><span class="sc6__imgs">${covers(x.items)}</span></a>`).join('')}</div>`)
      + banner();
    page('/podborki/', ['Все подборки кейсов Мусор Дроп — рейтинги по цене', `${SEL.length} тематических подборок кейсов Musor Drop: первый кейс, кейсы как в CS2, Mystery Box, ножи и премиум.`], body);
  }

  // ---------- Страницы подборок ----------
  SEL.forEach((x, idx) => {
    const avg = avgOf(x.items);
    const others = SEL.filter(y => y !== x).slice(0, 3);
    const next = SEL[(idx + 1) % SEL.length];
    const facts = `<div class="fx6"><div><small>Кейсов</small><b>${x.items.length}</b></div><div><small>Вход</small><b>${rub(x.items[0].rub)}</b></div><div><small>В среднем</small><b>${rub(avg)}</b></div><div><small>Верх</small><b>${rub(x.items.at(-1).rub)}</b></div></div>`;
    const body = ph({ cr: crumbs(['/podborki/', 'Подборки'], [null, x.short]), k: `Подборка ${x.emoji}`, h1: x.h1, lead: x.lead, extra: facts })
      + sec(`<div class="sel6"><div>${sh('Рейтинг по цене', `От самого доступного к самому дорогому. Процент — отличие от средней цены подборки (${rub(avg)}).`)}${rank(x.items, avg)}</div><aside class="sel6__side"><div class="card"><h3>Почему эти кейсы</h3><ul class="pl6">${x.why.map(w => `<li>${I.check}<span>${w}</span></li>`).join('')}</ul></div><div class="card tip6"><h3>Совет</h3><p>${x.tip}</p></div>${go('Перейти к кейсам')}</aside></div>`)
      + sec(`<div class="faq6">${sh('Вопросы о подборке', '', 'FAQ')}${qa(x.faq)}</div>`, true)
      + sec(`<div class="nx6"><span>Следующая подборка</span><a href="/podborki/${next.slug}/">${next.title} ${I.arrow}</a></div>${sh('Другие подборки')}<div class="sc6grid sc6grid--3">${others.map(selCard).join('')}</div>`)
      + banner();
    page(`/podborki/${x.slug}/`, [`${x.h1} | Подборки Musor Drop`, `${x.lead.split('. ')[0]}. ${cases(x.items.length)} от ${rub(x.items[0].rub)} — рейтинг по цене на ${PRICE_DATE}.`], body, [listLd(x.h1, x.items, rub), faqLd(x.faq)]);
  });

  // ---------- Как выбрать ----------
  {
    const q = [['Какая у вас цель?', 'Посмотреть механику, конкретный скин, нож — от ответа зависит подборка. Без цели проще всего потратить больше запланированного.'], ['Сколько вы готовы потерять?', 'Не «потратить», а именно потерять целиком. Это и есть потолок цены кейса на сегодня.'], ['Что гарантировано?', 'В ножевых кейсах — нож выбранной модели, в Mystery Box — версия одного скина. В копиях контейнеров CS2 — предмет из игровой коллекции.'], ['Какой самый частый дроп?', 'На странице кейса найдите позицию с наибольшим шансом. Устроит ли она вас, если выпадет она?'], ['Что сделаете с дропом?', 'Вывести в Steam, продать на баланс, поставить в апгрейд или собрать контракт — от этого зависит, нужен ли вам дорогой одиночный предмет или несколько мелких.']];
    const fq = [['Есть ли «выгодные» кейсы?', 'Площадка заявляет RTP 98% на длинной дистанции для всех игроков. Ни один кейс не обещает плюс в отдельной сессии — разница в разбросе результата.'], ['Что лучше — один дорогой или много дешёвых?', 'Много дешёвых дают более ровный результат, один дорогой — больший разброс. Выбор зависит от того, что вам нужно: опыт или шанс на крупный предмет.']];
    const body = ph({ cr: crumbs([null, 'Как выбрать']), k: 'Гид', h1: 'Как выбрать кейс на Мусор Дроп: пять вопросов перед открытием', lead: 'Короткий чек-лист, после которого выбор из ста кейсов сужается до двух-трёх. Ответьте на вопросы по порядку — и откройте подходящую подборку.' })
      + sec(`<div class="qs6">${q.map(([t, d], n) => `<div class="qs6__it"><span>${n + 1}</span><div><h2>${t}</h2><p>${d}</p></div></div>`).join('')}</div>`)
      + sec(`<div class="map6">${sh('Куда идти после ответов', '', 'Шпаргалка')}<div class="map6__grid">${[['Хочу разобраться без переплаты', 'pervyj-kejs'], ['Ищу скин из операции', 'kak-v-igre'], ['Охочусь за конкретным скином', 'vokrug-odnogo-skina'], ['Хочу нож', 'nozh-v-lyubom-iskhode'], ['Большой баланс и опыт', 'po-krupnomu']].map(([t, sl]) => `<a href="/podborki/${sl}/"><span>${t}</span><b>${SEL.find(y => y.slug === sl).title} ${I.arrow}</b></a>`).join('')}</div></div>`, true)
      + sec(`<div class="faq6">${sh('Частые сомнения', '', 'FAQ')}${qa(fq)}</div>`)
      + banner();
    page('/kak-vybrat/', ['Как выбрать кейс на Мусор Дроп — 5 вопросов перед открытием', 'Чек-лист выбора кейса на Musor Drop: цель, бюджет, гарантия, самый частый дроп и что делать с предметом. Шпаргалка — какая подборка подходит.'], body, faqLd(fq));
  }

  // ---------- Бонус ----------
  {
    const fq = [['Можно ли применить код к уже пополненному аккаунту?', `${PROMO} рассчитан на первое пополнение. Если вы уже пополняли баланс, ищите коды в Telegram-канале площадки.`], ['Код не принимается — что делать?', 'Проверьте раскладку: код пишется латиницей. Введите его до оплаты, а не после.']];
    const body = ph({ cr: crumbs([null, 'Бонус']), k: 'Промокоды', h1: `Промокод Мусор Дроп: ${PROMO} и другие коды`, lead: 'Перед тем как открыть первый кейс из подборки, заберите бонус к пополнению. Ниже — коды и где их вводить.' })
      + sec(`<div class="codes6">${PROMOS.map((c, n) => `<div class="cd6${n ? '' : ' is-main'}"><small>${['основной', 'запасной', 'раздел бонусов'][n]}</small><b>${c}</b><p>${['+7% к первому пополнению. Вводится в окне депозита.', 'Код на пополнение; размер бонуса показывается после ввода.', 'Активируется в разделе бонусов личного кабинета.'][n]}</p><button class="btn btn--ghost btn--sm" type="button" data-copy="${c}">${I.copy}<span>Копировать</span></button></div>`).join('')}</div>`)
      + sec(`<div class="meth6"><div>${sh('Ещё бонусы', '', 'Кроме кодов')}<p class="muted">На площадке также работают rakeback с каждой ставки, кэшбэк 10% раз в неделю, кейс за подписку на Telegram-канал и реферальная программа. Бонусы увеличивают баланс, но не меняют шансы в кейсах.</p></div><div class="faq6 faq6--in">${qa(fq)}</div></div>`, true)
      + banner();
    page('/bonus/', [`Промокод Мусор Дроп ${PROMO} — +7% и другие бонусы`, `Промокоды Musor Drop: ${PROMO} (+7% к первому пополнению), MUSOR и INVFMFEP7. Где вводить, почему код может не сработать, rakeback и кэшбэк.`], body, faqLd(fq));
  }

  // ---------- Вопросы ----------
  {
    const body = ph({ cr: crumbs([null, 'Вопросы']), k: 'FAQ', h1: 'Вопросы о подборках и кейсах Мусор Дроп', lead: 'Как устроены подборки, откуда цены, как войти и вывести скин.' })
      + sec(`<div class="faq6">${qa(FAQ)}</div>`)
      + banner();
    page('/voprosy/', ['Вопросы о подборках кейсов Мусор Дроп', 'Ответы о подборках кейсов Musor Drop: принцип отбора, обновление цен, промокод, вход и вывод скинов в Steam.'], body, faqLd(FAQ));
  }

  // ---------- Контакты ----------
  {
    const body = ph({ cr: crumbs([null, 'Контакты']), k: 'Связь', h1: 'Контакты подборок', lead: 'Предложите идею новой подборки или сообщите о неточной цене.' })
      + sec(`<div class="narrow prose"><p>Пишите на <a href="mailto:${C.EMAIL}">${C.EMAIL}</a>. Если речь о цене — укажите название кейса и сумму, которую видите на площадке.</p><p>У нас нет доступа к аккаунтам игроков. Вопросы о пополнении, выводе и конкретных играх решает поддержка самой площадки — там видна история операций.</p><h2>Какие подборки мы готовим</h2><p>Если вам не хватает подборки под свою задачу — например, «кейсы для батлов» — напишите, какую цель вы решаете. Самые частые запросы превращаются в новые страницы.</p></div>`)
      + banner();
    page('/kontakty/', ['Контакты — подборки кейсов Мусор Дроп', 'Как связаться с авторами подборок кейсов Musor Drop: идеи новых подборок и сообщения о неточных ценах.'], body);
  }
}

const NAV = [['/podborki/', 'Подборки'], ['/kak-vybrat/', 'Как выбрать'], ['/bonus/', 'Бонус'], ['/voprosy/', 'Вопросы']];

function header(s, cur) {
  const { I, SPY } = CTX;
  const nav = NAV.map(([h, t]) => `<a href="${h}"${cur.startsWith(h) ? ' class="is-active"' : ''}>${t}</a>`).join('');
  return `<header class="header header6"><div class="container header__in"><a href="/" class="logo6" aria-label="Подборки Musor Drop — главная"><img src="/assets/logo.svg" alt="Musor Drop" width="34" height="34"><span>Musor Drop<small>подборки</small></span></a><nav class="nav" aria-label="Основное меню">${nav}</nav><div class="header__cta"><a class="btn btn--primary btn--sm" href="${SPY}" rel="nofollow">${I.steam}<span>Войти через Steam</span></a></div><button class="burger" type="button" aria-label="Меню" aria-expanded="false">${I.menu}</button></div></header>
<nav class="mnav" aria-label="Мобильное меню">${NAV.map(([h, t]) => `<a href="${h}">${t}</a>`).join('')}<a href="/kontakty/">Контакты</a><a class="btn btn--primary" href="${SPY}" rel="nofollow">${I.steam}<span>Войти через Steam</span></a></nav>`;
}

function footer(s) {
  const { I, C } = CTX;
  return `<footer class="f6"><div class="container">
<div class="f6__sel">${SEL.map(x => `<a href="/podborki/${x.slug}/"><span>${x.emoji}</span>${x.title}</a>`).join('')}</div>
<div class="f6__main"><a href="/" class="logo6"><img src="/assets/logo.svg" alt="" width="34" height="34"><span>Musor Drop<small>подборки</small></span></a><p>Тематические подборки кейсов CS2 с Musor Drop: под задачу, с ценами и честным разговором о риске.</p><nav>${NAV.map(([h, t]) => `<a href="${h}">${t}</a>`).join('')}<a href="/kontakty/">Контакты</a></nav></div>
<div class="f6__end"><span class="f6__18">18+</span><span>Открытие кейсов связано с риском. Сайт не связан с Valve и Steam. ${C.EMAIL}</span><button type="button" data-copy="${PROMO}">${I.copy}<span>${PROMO}</span></button></div>
</div></footer>`;
}

const SITE = {
  id: 'v6', out: 'site-6', online: 2289, color: '#120B16',
  T: {},
  fonts: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Unbounded:wght@500;600;700&display=swap',
  vars: { bg: '#120B16', 'bg-rgb': '18,11,22', bg2: '#180F1D', card: '#201626', 'card-h': '#2A1D31', line: 'rgba(255,255,255,.07)', line2: 'rgba(255,255,255,.12)', acc: '#C056F5', 'acc-h': '#DA94FA', 'acc-d': '#9433CC', 'acc-m': 'rgba(192,86,245,.14)', 'acc-b': 'rgba(192,86,245,.4)', 'acc-rgb': '192,86,245', text: '#F7F0FB', muted: '#C4B5CC', dim: '#8D7F95', ease: 'cubic-bezier(.22,1,.36,1)' },
  heroCase: ['case01', ''],
  skins: 'skins6', drops: dropsOf(6), // лента дропа из своих скинов (_shared/skins6/)
  header: (s, cur) => header(s, cur),
  footer: s => footer(s),
  render: ctx => { CTX = ctx; build(ctx); },
};
export { SITE as site };
