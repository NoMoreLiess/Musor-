// Сайт 9 — «вики»: энциклопедия Musor Drop. Статьи с боковым меню, инфобоксом и «См. также».
// Барвинковый, IBM Plex Sans + Plex Mono.
import { COLLS, ALL, rub, coin, PRICE_DATE } from './catalog.mjs';
import { cases, faqLd, siteLd, pager, PROMOS, dropsOf } from './kit.mjs';

const PROMO = 'FIRST';
const REV = '30.10.2026';
const low = ALL.reduce((a, i) => i.rub < a.rub ? i : a), top = ALL.reduce((a, i) => i.rub > a.rub ? i : a);

// Разделы и статьи. box — инфобокс [ключ, значение]; parts — [заголовок, html]; see — slug'и
const CATS = [['osnovy', 'Основы'], ['rezhimy', 'Режимы'], ['dengi', 'Деньги'], ['zashchita', 'Защита']];
const WIKI = [
  {
    slug: 'kejsy', cat: 'rezhimy', title: 'Кейсы', skin: 'ak-asiimov',
    def: '<b>Кейс</b> — основной режим Musor Drop: игрок платит фиксированную цену и получает один случайный скин CS2 из заранее известного пула.',
    box: [['Тип', 'одиночная игра'], ['Цена', `${rub(low.rub)} — ${rub(top.rub)}`], ['Всего', cases(ALL.length)], ['Коллекций', COLLS.length], ['Результат', 'один скин']],
    parts: [
      ['Механика', '<p>У каждого кейса есть пул — список предметов с ценой и вероятностью выпадения. Вероятности опубликованы на странице кейса до оплаты. После нажатия «Открыть» генератор результата выбирает число, которое попадает в диапазон одного из предметов; рулетка лишь визуализирует этот выбор.</p>'],
      ['Устройство пула', '<p>Типичный пул состоит из множества частых недорогих позиций и нескольких редких дорогих. Именно редкие позиции делают возможным результат дороже цены кейса, но их суммарная вероятность невелика. Некоторые серии устроены иначе: в кейсах 50/50 два предмета, в ножевых — только ножи одной модели.</p>'],
      ['Что делать с дропом', '<ul><li>вывести в Steam — см. <a href="/wiki/vyvod/">Вывод</a>;</li><li>продать на баланс по цене площадки;</li><li>поставить в <a href="/wiki/apgrejd/">апгрейд</a>;</li><li>вложить в <a href="/wiki/kontrakty/">контракт</a>.</li></ul>'],
    ],
    see: ['kollekcii', 'provably-fair', 'rtp'],
  },
  {
    slug: 'kollekcii', cat: 'osnovy', title: 'Коллекции кейсов', skin: 'awp-containment',
    def: `<b>Коллекция</b> — тематическая серия кейсов. На ${PRICE_DATE} в каталоге Musor Drop ${COLLS.length} коллекций и ${cases(ALL.length)}.`,
    box: [['Коллекций', COLLS.length], ['Кейсов', ALL.length], ['Самая длинная', 'Мусорный минимум (20)'], ['Самая короткая', 'StatTrak™ (3)'], ['Данные на', PRICE_DATE]],
    parts: [
      ['Список коллекций', '{{COLLS}}'],
      ['Типы серий', '<p>Коллекции можно условно разделить на четыре группы. <b>Бытовые «мусорные»</b> — Мусорный минимум и Мусорная коллекция — самые дешёвые. <b>Игровые</b> — Стандартное оружие и Кейсы из CS2 — повторяют логику игры. <b>Тематические</b> — Культ Моды, VIP Color, StatTrak™, 50/50 и Mystery Box — объединены идеей, цветом или форматом исхода. <b>Премиальные</b> — Металлическая коллекция и Стандартные ножи — с самым дорогим дропом.</p>'],
    ],
    see: ['kejsy', 'balans'],
  },
  {
    slug: 'apgrejd', cat: 'rezhimy', title: 'Апгрейд', skin: 'm4a4-neonoir',
    def: '<b>Апгрейд</b> — режим, в котором игрок ставит свой скин (или несколько) ради более дорогого предмета. Шанс успеха зависит от отношения цен и показывается до подтверждения.',
    box: [['Тип', 'одиночная игра'], ['Ставка', 'скины и/или баланс'], ['Исход', 'цель или потеря ставки'], ['Шанс', 'виден до игры']],
    parts: [
      ['Расчёт шанса', '<p>Шанс приблизительно равен отношению стоимости ставки к стоимости цели с поправкой на отдачу площадки. Поставив предмет за 100 ₽ ради предмета за 200 ₽, игрок получит шанс чуть меньше 50%. Множитель x10 соответствует шансу около 10%.</p>'],
      ['Особенности', '<p>Исход бинарный: промежуточного результата нет. Процент фиксируется до нажатия и проверяется так же, как открытие кейса, — через <a href="/wiki/provably-fair/">Provably Fair</a>.</p>'],
      ['Риски', '<p>Главная ошибка — серия апгрейдов «чтобы вернуть» сгоревшую ставку. Каждая попытка независима, а цепочка рискованных апгрейдов почти всегда заканчивается потерей исходного предмета.</p>'],
    ],
    see: ['kontrakty', 'otvetstvennaya-igra'],
  },
  {
    slug: 'kontrakty', cat: 'rezhimy', title: 'Контракты', skin: 'aug-akihabara',
    def: '<b>Контракт</b> — режим обмена нескольких скинов на один. По мотивам контрактов обмена из CS2, но с выбором сложности.',
    box: [['На входе', 'от 3 до 10 скинов'], ['На выходе', 'один скин'], ['Сложность', 'три уровня'], ['Множитель', 'до x10']],
    parts: [
      ['Как устроен', '<p>Игрок выбирает от трёх до десяти предметов из инвентаря на площадке. Их суммарная стоимость — база. Уровень сложности задаёт диапазон множителя: чем выше сложность, тем шире разброс между худшим и лучшим исходом.</p>'],
      ['Когда полезен', '<p>Контракт удобен, когда после нескольких дешёвых кейсов накопилась мелочь: выводить каждый предмет отдельно неудобно, а продавать по одному — долго.</p>'],
    ],
    see: ['apgrejd', 'kejsy'],
  },
  {
    slug: 'kejs-batly', cat: 'rezhimy', title: 'Кейс-батлы', skin: 'mac10-neonrider',
    def: '<b>Кейс-батл</b> — соревновательный режим: несколько игроков открывают одинаковый набор кейсов, победитель определяется по правилам выбранного режима.',
    box: [['Тип', 'мультиплеер'], ['Режимы', 'Классика, Общак, команды'], ['Модификаторы', 'Джекпот, Обратная победа и др.'], ['Создание', 'свой батл или чужой']],
    parts: [
      ['Режимы', '<p>Основной формат — <b>Классика</b>: обычно побеждает участник с самым дорогим суммарным дропом. Кроме неё есть <b>Общак</b> со своими правилами распределения и командные бои, где сравниваются суммы команд. Точные условия каждого режима показываются при создании батла.</p>'],
      ['Модификаторы', '<p>Модификаторы — Джекпот, Обратная победа, Мусорный захват и другие — меняют правила подсчёта раунда. Их описание видно в окне создания батла; перед игрой его стоит прочитать, потому что с модификатором победитель может определяться совсем не так, как в Классике.</p>'],
      ['Честность', '<p>Каждое открытие внутри батла проверяется так же, как обычное, — через пару сидов и номер игры.</p>'],
    ],
    see: ['kejsy', 'provably-fair'],
  },
  {
    slug: 'balans', cat: 'dengi', title: 'Баланс и валюта', skin: 'gloves-omega',
    def: '<b>Баланс</b> — внутренний счёт игрока на площадке. Валюта баланса — рубли или доллары (монеты) — выбирается один раз при первом входе.',
    box: [['Валюты', 'рубли, монеты'], ['1 монета', '1 доллар'], ['Смена валюты', 'невозможна'], ['Демо-баланс', 'есть']],
    parts: [
      ['Две шкалы цен', `<p>Цены для двух валют задаются отдельно: рублёвые округляются до удобных чисел. Поэтому отношение рублёвой цены к цене в монетах у разных кейсов отличается. Например, «${low.name}» стоит ${rub(low.rub)} или ${coin(low.coin)} монеты, «${top.name}» — ${rub(top.rub)} или ${coin(top.coin)} монет.</p>`],
      ['Демо-баланс', '<p>Для знакомства с кейсами и апгрейдом есть демо-баланс: предметы на нём не выводятся, но механика та же.</p>'],
      ['Как выбрать валюту', '<p>Обычно выбирают ту, которой будут пополнять: так не возникает лишней конвертации.</p>'],
    ],
    see: ['popolnenie', 'bonusy'],
  },
  {
    slug: 'popolnenie', cat: 'dengi', title: 'Пополнение', skin: 'usp-neonoir',
    def: '<b>Пополнение</b> (депозит) — зачисление денег на баланс. Поддерживаются фиатные способы, криптовалюта и скины CS2.',
    box: [['Способы', 'карта, крипто, скины'], ['Промокод', `${PROMO} +7%`], ['Где ввести код', 'окно пополнения']],
    parts: [
      ['Способы', '<p><b>Банковская карта и другие фиатные методы</b> — самый привычный путь. <b>Криптовалюта</b> — для тех, кто держит средства в криптокошельке. <b>Скины</b> — предметы из инвентаря Steam передаются боту и зачисляются по оценке площадки.</p>'],
      ['Промокод', `<p>Стартовый код ${PROMO} добавляет 7% к первому пополнению. Вводится в окне депозита до оплаты. Подробнее — в статье <a href="/wiki/bonusy/">Бонусы</a>.</p>`],
    ],
    see: ['balans', 'bonusy'],
  },
  {
    slug: 'vyvod', cat: 'dengi', title: 'Вывод скинов', skin: 'deagle-ocean',
    def: '<b>Вывод</b> — передача предмета из инвентаря площадки в инвентарь Steam игрока через предложение обмена от бота.',
    box: [['Канал', 'обмен Steam'], ['Обычно', 'несколько минут'], ['Нужно', 'трейд-ссылка, Steam Guard, открытый инвентарь']],
    parts: [
      ['Требования', '<ul><li>активный Steam Guard Mobile Authenticator;</li><li>открытый инвентарь в настройках приватности;</li><li>актуальная трейд-ссылка в профиле площадки;</li><li>отсутствие трейд-бана.</li></ul>'],
      ['Задержки', '<p>Если нужного предмета нет у ботов площадки, вывод может занять больше времени. Статус виден в профиле. Steam может удерживать обмены после недавнего подключения аутентификатора.</p>'],
      ['Безопасность', '<p>Принимайте только тот обмен, который запросили сами, и проверяйте, что отдаёте ничего. Подробнее — в статье <a href="/wiki/bezopasnost/">Безопасность</a>.</p>'],
    ],
    see: ['bezopasnost', 'kejsy'],
  },
  {
    slug: 'bonusy', cat: 'dengi', title: 'Бонусы и промокоды', skin: 'm4a1-goldencoil',
    def: '<b>Бонусы</b> — способы получить на баланс больше внесённого: стартовый промокод, rakeback, кэшбэк, бесплатный кейс и рефералы.',
    box: [['Стартовый код', `${PROMO} +7%`], ['Кэшбэк', '10% в неделю'], ['Rakeback', 'с каждой ставки'], ['Кейс', 'за подписку на Telegram']],
    parts: [
      ['Промокоды', '{{CODES}}'],
      ['Постоянные бонусы', '<p><b>Rakeback</b> — часть каждой ставки возвращается на баланс. <b>Кэшбэк</b> — 10% от потраченного раз в неделю. <b>Кейс за подписку</b> выдаётся после подписки на Telegram-канал и привязки аккаунта. <b>Реферальная программа</b> начисляет процент с игры приглашённых.</p>'],
      ['Ограничения', '<p>Бонусы не меняют вероятности в кейсах. Для вывода предметов, полученных на бонусный баланс, площадка может требовать минимальный оборот — условия указаны в разделе бонусов.</p>'],
    ],
    see: ['popolnenie', 'otvetstvennaya-igra'],
  },
  {
    slug: 'provably-fair', cat: 'zashchita', title: 'Provably Fair', skin: 'talon-slaughter',
    def: '<b>Provably Fair</b> («доказуемая честность») — схема, при которой результат игры фиксируется до её начала и может быть проверен игроком после.',
    box: [['Хеш', 'SHA-256'], ['Расчёт', 'HMAC-SHA256'], ['Входные данные', 'server seed, client seed, nonce']],
    parts: [
      ['Компоненты', '<p><b>Серверный сид</b> генерируется заранее; до игры виден только его хеш. <b>Клиентский сид</b> задаёт игрок. <b>Nonce</b> — номер игры на текущей паре сидов.</p>'],
      ['Формула', '<pre class="code9">roll = HMAC_SHA256(server_seed, client_seed + ":" + nonce)\ncheck = SHA256(server_seed) == опубликованный_хеш</pre>'],
      ['Что гарантирует', '<p>Схема гарантирует, что результат не изменён после ставки. Она не гарантирует выигрыш и не влияет на вероятности в таблице шансов.</p>'],
    ],
    see: ['rtp', 'kejsy'],
  },
  {
    slug: 'rtp', cat: 'osnovy', title: 'RTP', skin: 'ssg-dragonfire',
    def: '<b>RTP</b> (Return to Player) — доля поставленных средств, которая в среднем возвращается игрокам. Musor Drop заявляет RTP 98%.',
    box: [['Значение', '98%'], ['Считается', 'по всем игрокам'], ['Горизонт', 'длинная дистанция']],
    parts: [
      ['Смысл показателя', '<p>RTP описывает площадку целиком на большом числе игр. Если все игроки вместе потратили 1 000 000 ₽, около 980 000 ₽ вернулось предметами. Для отдельной сессии RTP ничего не обещает.</p>'],
      ['Дисперсия', '<p>Чем меньше игр и чем дороже кейс, тем сильнее результат конкретного игрока отклоняется от среднего — в обе стороны. Десять дешёвых кейсов дают более ровный результат, чем один дорогой той же суммы.</p>'],
    ],
    see: ['provably-fair', 'otvetstvennaya-igra'],
  },
  {
    slug: 'bezopasnost', cat: 'zashchita', title: 'Безопасность аккаунта', skin: 'glock-vogue',
    def: '<b>Безопасность аккаунта</b> — набор мер, защищающих аккаунт Steam и инвентарь игрока от угона и фишинга.',
    box: [['Ключевая мера', 'Steam Guard Mobile'], ['Главная угроза', 'фишинговые копии'], ['Вход Steam', 'только steamcommunity.com']],
    parts: [
      ['Фишинг', '<p>Самая распространённая угроза — поддельные сайты, имитирующие окно входа Steam. Настоящая авторизация всегда открывается на steamcommunity.com. Ссылки из личных сообщений («проголосуй», «забери нож») — почти всегда фишинг.</p>'],
      ['Ложные обмены', '<p>Мошенники присылают предложения обмена, похожие на трейды бота. Принимайте только обмены, которые запросили сами, и проверяйте содержимое.</p>'],
      ['Если пароль введён на подделке', '<ol><li>смените пароль Steam;</li><li>деавторизуйте все другие устройства;</li><li>проверьте и отзовите ключ Steam Web API;</li><li>обратитесь в поддержку Steam.</li></ol>'],
    ],
    see: ['vyvod', 'otvetstvennaya-igra'],
  },
  {
    slug: 'otvetstvennaya-igra', cat: 'zashchita', title: 'Ответственная игра', skin: 'p90-asiimov',
    def: '<b>Ответственная игра</b> — правила, которые помогают сохранить контроль над расходами и временем при игре с риском.',
    box: [['Возраст', '18+'], ['Главное правило', 'лимит до игры'], ['Красный флаг', 'желание «отыграться»']],
    parts: [
      ['Основные правила', '<ul><li>сумма на сессию определяется заранее и не пересматривается во время игры;</li><li>играть можно только на свободные деньги;</li><li>проигрыш не повышает шанс следующей игры;</li><li>хороший выигрыш — повод вывести предмет, а не поставить его снова.</li></ul>'],
      ['Признаки проблемы', '<p>Повторные пополнения за вечер, игра на деньги, нужные для жизни, раздражение при попытке остановиться. В таком случае стоит сделать паузу, обратиться в поддержку площадки за самоограничением и поговорить с близкими или специалистом.</p>'],
    ],
    see: ['rtp', 'bonusy'],
  },
];

const FAQ = [
  ['Что такое Musor Drop?', `Площадка для открытия кейсов CS2: ${cases(ALL.length)} в ${COLLS.length} коллекциях, апгрейд, контракты и кейс-батлы. Вход через Steam, Telegram, VK или Google.`],
  ['Это официальная вики?', 'Нет, это независимый справочник. Мы описываем механику и правила так, как они устроены на площадке, и обновляем статьи при изменениях.'],
  ['Как играть?', 'Кнопка «Играть» в шапке ведёт на площадку. Начать советуем со статей «Баланс и валюта» и «Кейсы».'],
];

let CTX;
function build(ctx) {
  const { I, SPY, C, ext } = ctx;
  const s = SITE;
  const page = pager(ctx, s);
  const art = sl => WIKI.find(w => w.slug === sl);
  const side = cur => `<aside class="sb9"><a class="sb9__home${cur === '/' ? ' is-on' : ''}" href="/">Заглавная</a>${CATS.map(([c, t]) => `<div class="sb9__g"><span>${t}</span>${WIKI.filter(w => w.cat === c).map(w => `<a href="/wiki/${w.slug}/"${cur === w.slug ? ' class="is-on"' : ''}>${w.title}</a>`).join('')}</div>`).join('')}<div class="sb9__g"><span>Служебное</span><a href="/wiki/vse-stati/"${cur === 'all' ? ' class="is-on"' : ''}>Все статьи</a><a href="/wiki/o-proekte/"${cur === 'about' ? ' class="is-on"' : ''}>О проекте</a></div></aside>`;
  const shell = (cur, inner) => `<div class="container wk9">${side(cur)}<div class="wk9__main">${inner}</div></div>`;
  const codes = `<table class="tb9"><thead><tr><th>Код</th><th>Что даёт</th><th>Где вводить</th><th></th></tr></thead><tbody>${PROMOS.map((c, n) => `<tr><td><code>${c}</code></td><td>${['+7% к первому пополнению', 'бонус к пополнению', 'бонус в личном кабинете'][n]}</td><td>${['окно пополнения', 'окно пополнения', 'раздел бонусов'][n]}</td><td><button class="cp9" type="button" data-copy="${c}">${I.copy}<span>копировать</span></button></td></tr>`).join('')}</tbody></table>`;
  const colls = `<table class="tb9"><thead><tr><th>Коллекция</th><th>Кейсов</th><th>Цены</th></tr></thead><tbody>${COLLS.map(c => `<tr><td>${c.title}</td><td>${c.items.length}</td><td>${rub(c.min)} — ${rub(c.max)}</td></tr>`).join('')}</tbody></table>`;
  const playbox = `<div class="pb9"><div><b>Попробовать на практике</b><span>Промокод ${PROMO} — +7% к первому пополнению.</span></div><button class="btn btn--ghost btn--sm" type="button" data-copy="${PROMO}">${I.copy}<span>${PROMO}</span></button>${ext('btn btn--primary btn--sm', `<span>Играть</span>${I.arrow}`)}</div>`;

  // ---------- Заглавная ----------
  {
    const feat = art('provably-fair');
    const body = shell('/', `<div class="wh9"><h1>Musor Drop Wiki</h1><p>Справочник по площадке кейсов CS2: ${WIKI.length} статей о режимах, балансе, выводе и безопасности. Ревизия от ${REV}.</p></div>
<div class="hg9"><section class="bx9"><h2>Избранная статья</h2><div class="fa9"><img src="/assets/skins/${feat.skin}.webp" alt="" width="140" height="80"><div><p>${feat.def}</p><a href="/wiki/${feat.slug}/">Читать статью ${I.arrow}</a></div></div></section>
<section class="bx9"><h2>Знаете ли вы, что…</h2><ul class="dk9"><li>…самый дешёвый кейс площадки, «${low.name}», стоит ${rub(low.rub)}, а самый дорогой — ${rub(top.rub)}? (<a href="/wiki/kollekcii/">Коллекции</a>)</li><li>…валюту баланса нельзя сменить после первого входа? (<a href="/wiki/balans/">Баланс</a>)</li><li>…в контракт можно вложить до десяти скинов? (<a href="/wiki/kontrakty/">Контракты</a>)</li><li>…в кейс-батлах есть модификаторы, которые меняют правила победы? (<a href="/wiki/kejs-batly/">Кейс-батлы</a>)</li></ul></section></div>
<section class="bx9"><h2>Разделы</h2><div class="cg9">${CATS.map(([c, t]) => `<div><h3>${t}</h3>${WIKI.filter(w => w.cat === c).map(w => `<a href="/wiki/${w.slug}/">${w.title}</a>`).join('')}</div>`).join('')}</div></section>
<section class="bx9"><h2>Частые вопросы</h2><dl class="dl9">${FAQ.map(([q, a]) => `<dt>${q}</dt><dd>${a}</dd>`).join('')}</dl></section>${playbox}`);
    page('/', ['Musor Drop Wiki — справочник по Мусор Дроп', `Энциклопедия Musor Drop (Мусор Дроп): кейсы, ${COLLS.length} коллекций, апгрейд, контракты, кейс-батлы, баланс, вывод, бонусы, Provably Fair и безопасность.`], body, [siteLd('Musor Drop Wiki'), faqLd(FAQ)]);
  }

  // ---------- Статьи ----------
  WIKI.forEach(w => {
    const cat = CATS.find(c => c[0] === w.cat)[1];
    const parts = w.parts.map(([t, h]) => [t, h.replace('{{COLLS}}', colls).replace('{{CODES}}', codes)]);
    const ids = parts.map((_, n) => `p${n + 1}`);
    const body = shell(w.slug, `<article class="ar9"><div class="ar9__top"><span>${cat}</span><span>ревизия ${REV}</span></div><h1>${w.title}</h1>
<aside class="ib9"><div class="ib9__img"><img src="/assets/skins/${w.skin}.webp" alt="" width="200" height="110"></div><div class="ib9__t">${w.title}</div><table>${w.box.map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join('')}</table></aside>
<p class="ar9__def">${w.def}</p>
<nav class="tc9"><b>Содержание</b><ol>${parts.map(([t], n) => `<li><a href="#${ids[n]}">${t}</a></li>`).join('')}<li><a href="#see">См. также</a></li></ol></nav>
<div class="prose pr9">${parts.map(([t, h], n) => `<h2 id="${ids[n]}">${t}</h2>${h}`).join('')}</div>
<h2 id="see" class="see9h">См. также</h2><ul class="see9">${w.see.map(sl => { const a = art(sl); return `<li><a href="/wiki/${a.slug}/"><b>${a.title}</b><span>${a.def.replace(/<[^>]+>/g, '').split(' — ')[1]?.split('.')[0] || ''}</span></a></li>`; }).join('')}</ul>
${playbox}</article>`);
    page(`/wiki/${w.slug}/`, [`${w.title} — Musor Drop Wiki`, w.def.replace(/<[^>]+>/g, '')], body, { '@context': 'https://schema.org', '@type': 'Article', headline: `${w.title} — Musor Drop Wiki`, description: w.def.replace(/<[^>]+>/g, ''), dateModified: '2026-10-30', inLanguage: 'ru' });
  });

  // ---------- Все статьи ----------
  {
    const sorted = [...WIKI].sort((a, b) => a.title.localeCompare(b.title, 'ru'));
    const letters = [...new Set(sorted.map(w => w.title[0].toUpperCase()))];
    const body = shell('all', `<div class="wh9"><h1>Все статьи</h1><p>${WIKI.length} статей в алфавитном порядке.</p></div><div class="az9">${letters.map(l => `<section><h2>${l}</h2>${sorted.filter(w => w.title[0].toUpperCase() === l).map(w => `<a href="/wiki/${w.slug}/"><b>${w.title}</b><span>${CATS.find(c => c[0] === w.cat)[1]}</span></a>`).join('')}</section>`).join('')}</div>`);
    page('/wiki/vse-stati/', ['Все статьи — Musor Drop Wiki', `Алфавитный указатель ${WIKI.length} статей справочника Musor Drop: от апгрейда до RTP.`], body);
  }

  // ---------- О проекте ----------
  {
    const body = shell('about', `<article class="ar9"><h1>О проекте</h1><div class="prose pr9"><p>Musor Drop Wiki — независимый справочник о площадке кейсов CS2. Мы описываем, как устроены режимы, деньги и защита аккаунта, нейтральным языком и без обещаний выигрыша.</p><h2>Правила редакции</h2><ul><li>Каждая статья начинается с определения и инфобокса с ключевыми фактами.</li><li>Цифры — только с площадки, с датой фиксации. Данные каталога — на ${PRICE_DATE}.</li><li>Про риски пишем прямо, в отдельных разделах.</li></ul><h2>Связь</h2><p>Ошибки и предложения — на <a href="mailto:${C.EMAIL}">${C.EMAIL}</a>. Вопросы по балансу и выводу решает поддержка площадки: у справочника нет доступа к аккаунтам.</p></div>${playbox}</article>`);
    page('/wiki/o-proekte/', ['О проекте — Musor Drop Wiki', 'Кто ведёт справочник Musor Drop Wiki, правила редакции и контакты.'], body);
  }
}

function header(s, cur) {
  const { I, SPY } = CTX;
  return `<header class="header header9"><div class="container header__in"><a href="/" class="logo9" aria-label="Musor Drop Wiki — главная"><img src="/assets/logo.svg" alt="Musor Drop" width="30" height="30"><span>Musor Drop <b>Wiki</b></span></a><nav class="nav" aria-label="Основное меню">${CATS.map(([c, t]) => `<a href="/wiki/${WIKI.find(w => w.cat === c).slug}/">${t}</a>`).join('')}<a href="/wiki/vse-stati/"${cur.startsWith('/wiki/vse-stati') ? ' class="is-active"' : ''}>Все статьи</a></nav><div class="header__cta"><a class="btn btn--primary btn--sm" href="${SPY}" rel="nofollow">${I.steam}<span>Играть</span></a></div><button class="burger" type="button" aria-label="Меню" aria-expanded="false">${I.menu}</button></div></header>
<nav class="mnav" aria-label="Мобильное меню"><a href="/">Заглавная</a>${WIKI.map(w => `<a href="/wiki/${w.slug}/">${w.title}</a>`).join('')}<a href="/wiki/vse-stati/">Все статьи</a><a class="btn btn--primary" href="${SPY}" rel="nofollow">${I.steam}<span>Войти через Steam</span></a></nav>`;
}

function footer(s) {
  const { C } = CTX;
  return `<footer class="f9"><div class="container"><div class="f9__in"><div class="f9__l"><span class="logo9"><img src="/assets/logo.svg" alt="" width="26" height="26"><span>Musor Drop <b>Wiki</b></span></span><p>Последняя ревизия: ${REV}. Данные каталога: ${PRICE_DATE}.</p></div><ul class="f9__links"><li><a href="/wiki/vse-stati/">Все статьи</a></li><li><a href="/wiki/o-proekte/">О проекте</a></li><li><a href="/wiki/otvetstvennaya-igra/">Ответственная игра</a></li><li><a href="/wiki/bezopasnost/">Безопасность</a></li><li><a href="mailto:${C.EMAIL}">${C.EMAIL}</a></li></ul></div><p class="f9__legal"><b>18+</b> Справочник носит информационный характер. Открытие кейсов связано с риском потери средств. Не связан с Valve Corporation и Steam. Код промо: <button type="button" data-copy="${PROMO}">${PROMO}</button></p></div></footer>`;
}

const SITE = {
  id: 'v9', out: 'site-19', online: 2177, color: '#0E0E17',
  T: {},
  fonts: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap',
  vars: { bg: '#0E0E17', 'bg-rgb': '14,14,23', bg2: '#13131F', card: '#191A28', 'card-h': '#212233', line: 'rgba(255,255,255,.08)', line2: 'rgba(255,255,255,.13)', acc: '#9D8CFF', 'acc-h': '#C2B7FF', 'acc-d': '#7563E0', 'acc-m': 'rgba(157,140,255,.13)', 'acc-b': 'rgba(157,140,255,.38)', 'acc-rgb': '157,140,255', text: '#EEEEF7', muted: '#B6B6CB', dim: '#80809A', ease: 'cubic-bezier(.22,1,.36,1)' },
  heroCase: ['case01', ''],
  skins: 'skins9', drops: dropsOf(9), // свои скины и лента дропа: _shared/skins9/
  header: (s, cur) => header(s, cur),
  footer: s => footer(s),
  render: ctx => { CTX = ctx; build(ctx); },
};
export { SITE as site };
