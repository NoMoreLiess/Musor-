// Сайт 7 — «бюджет»: калькулятор «что открыть на мою сумму», страницы под конкретные бюджеты,
// лимиты и математика RTP. Свой набор: Мусорный минимум + VIP Color. Глубокий фиолетовый, Rubik.
import { pick, rub, coin, PRICE_DATE } from './catalog.mjs';
import { cases, plural, faqLd, listLd, siteLd, pager, crumbsFor, clean, PROMOS, dropsOf } from './kit.mjs';

const PROMO = 'FIRST';
// свой набор коллекций сайта (см. pick() в catalog.mjs)
const { COLLS, ALL, collBySlug } = pick(['musornyj-minimum', 'vip-color']);
const asc = [...ALL].sort((a, b) => a.rub - b.rub);
const low = asc[0];
const times = n => `${n} ${plural(n, 'раз', 'раза', 'раз')}`;

// ---------- Бюджеты ----------
const BUDGETS = [
  {
    sum: 300, slug: 'na-300-rublej',
    lead: 'Триста рублей — сумма для знакомства с «Мусорным минимумом». Хватит на пять-шесть самых дешёвых кейсов или на пару кейсов из середины линейки. Главное здесь — понять механику, а не гнаться за дорогим дропом.',
    plans: [['Разведка', 'Пять самых дешёвых кейсов — от «Чека из магазина» до «Ржавой банки», всего 195 ₽: посмотрите, как отличаются пулы.'], ['Середина линейки', '«Свалочный рейд» за 199 ₽ и на сдачу — «Карман бомжа» за 89 ₽.'], ['Один кейс', '«Мусорный капитал» за 299 ₽ — одна попытка почти на весь бюджет.']],
    note: 'На трёхстах рублях одна прокрутка ничего не расскажет о механике. Лучше несколько дешёвых кейсов, чем один подороже.',
  },
  {
    sum: 1000, slug: 'na-1000-rublej',
    lead: 'На тысячу открывается весь «Мусорный минимум»: двадцать кейсов от 19 до 499 ₽. Можно пройти линейку снизу вверх или взять пару самых дорогих её ступеней.',
    plans: [['Лестница', 'От «Контейнера 1» за 119 ₽ через «Бак с лутом» к «Мусорному капиталу» — подниматься, только если устроил предыдущий дроп.'], ['Верх линейки', '«Свалка богов» за 499 ₽ дважды — самая дорогая ступень минимума.'], ['Широкий охват', 'Десяток кейсов по 19–139 ₽: ровнее результат и больше мелочи для контракта.']],
    note: 'На тысяче легко увлечься и пополнить ещё. Решите заранее, что делаете, если бюджет закончился раньше вечера.',
  },
  {
    sum: 5000, slug: 'na-5000-rublej',
    lead: 'Пять тысяч — ровно порог VIP Color: Белое, Красное, Синее, Жёлтое и Зелёное стоят по 4 999 ₽. Или та же сумма, растянутая на десяток кейсов «Мусорного минимума».',
    plans: [['Один цветной', 'Кейс VIP Color за 4 999 ₽ — одна попытка с подбором скинов по цвету.'], ['Одиннадцать ступеней', 'Все кейсы минимума от «Контейнера 1» до «Свалки богов» по одному разу — около 2 800 ₽.'], ['Только верх минимума', '«Свалка богов» десять раз — одна и та же таблица шансов на длинной серии.']],
    note: 'Чем меньше попыток на бюджет, тем сильнее результат зависит от одной прокрутки. Это нормально — просто будьте к этому готовы.',
  },
  {
    sum: 20000, slug: 'na-20000-rublej',
    lead: 'Двадцать тысяч — бюджет, на который доступен весь набор, включая RGB за 11 666 ₽ — кейс, где смешаны скины всех цветов серии VIP Color.',
    plans: [['RGB и цвет', 'RGB за 11 666 ₽ и один цветной кейс за 4 999 ₽ — остаток на минимум.'], ['Четыре цвета', 'Четыре разных кейса VIP Color — 19 996 ₽, почти ровно бюджет.'], ['Длинная серия', 'Сорок «Свалок богов» — максимум попыток на верхней ступени минимума.']],
    note: 'На таком бюджете особенно важно не превращать одну сессию в серию «отыгрышей». Поставьте лимит или просто выйдите, когда сумма закончилась.',
  },
];

const FAQ = [
  ['Как работает калькулятор?', `Вы вводите сумму — калькулятор показывает кейсы «Мусорного минимума» и VIP Color, которые в неё укладываются, и сколько раз каждый можно открыть. Цены — с площадки на ${PRICE_DATE}.`],
  ['Учитывается ли промокод?', `Если отметить галочку «с промокодом ${PROMO}», к сумме добавится 7% — так работает бонус к первому пополнению.`],
  ['Какой минимальный бюджет?', `${rub(low.rub)} — цена «${low.name}», самого дешёвого кейса. Попробовать механику можно и бесплатно, на демо-балансе.`],
  ['Сколько я получу обратно?', 'Этого не знает никто. Площадка заявляет RTP 98% на длинной дистанции для всех игроков вместе; в одной сессии результат может быть и сильно выше, и сильно ниже.'],
  ['Что делать, если бюджет закончился?', 'Остановиться. Пополнение «чтобы отыграться» — самая частая причина больших потерь. Подробнее — на странице <a href="/limit/">«Лимит и банк»</a>.'],
  ['Как вывести выигрыш?', 'Выпавший скин выводится в Steam через трейд-ссылку или продаётся на баланс. Для вывода нужны Steam Guard и открытый инвентарь.'],
];

let CTX;
function build(ctx) {
  const { I, SPY, C, ext, sec, copyDir, ROOT, A } = ctx;
  const s = SITE;
  const page = pager(ctx, s);
  const crumbs = crumbsFor('Бюджет');
  // только картинки своих кейсов: у каждого каталога свой набор файлов
  const own = new Set(ALL.map(i => i.key + '.webp'));
  copyDir(`${ROOT}/_shared/cases3`, `${A}/cases`, f => own.has(f));

  const go = (label = 'Перейти к кейсам', cls = 'btn btn--primary') => ext(cls, `${I.box}<span>${label}</span>`);
  const t7 = (h, lead = '', k = '') => `<div class="t7">${k ? `<span class="t7__k">${k}</span>` : ''}<h2>${h}</h2>${lead ? `<p>${lead}</p>` : ''}</div>`;
  const tile = (i, extra = '') => `<a class="c7" href="${SPY}" rel="nofollow" data-coll="${i.coll}"><img src="/assets/cases/${i.key}.webp" alt="Кейс ${clean(i.name)}" width="110" height="110" loading="lazy"><b>${i.name}</b><span>${rub(i.rub)}</span>${extra}</a>`;
  const qa = items => `<dl class="qa7">${items.map(([q, a]) => `<div><dt>${q}</dt><dd>${a}</dd></div>`).join('')}</dl>`;
  const foot = () => `<section class="end7"><div class="container"><div class="end7__in"><div class="end7__sum"><small>с промокодом ${PROMO}</small><b>+7%</b><span>к первому пополнению</span></div><div><h2>Бюджет посчитан — можно играть</h2><p>Держитесь суммы, которую выбрали, и смотрите таблицу шансов перед каждым кейсом.</p></div><div class="end7__btns"><button class="btn btn--ghost" type="button" data-copy="${PROMO}">${I.copy}<span>${PROMO}</span></button>${go()}</div></div></div></section>`;
  const ph = ({ cr, k, h1, lead, side = '' }) => `<section class="ph7"><div class="container"><div class="ph7__in"><div>${cr}<span class="t7__k">${k}</span><h1>${h1}</h1><p class="lead">${lead}</p></div>${side}</div></div></section>`;
  const data = JSON.stringify(asc.map(i => [i.name, i.rub, i.key])).replace(/</g, '\\u003c');
  const calc = (val = 1000) => `<div class="calc7" data-calc><div class="calc7__in"><label for="calc7-sum">Ваш бюджет</label><div class="calc7__field"><input id="calc7-sum" type="number" min="19" step="50" value="${val}" inputmode="numeric"><span>₽</span></div><div class="calc7__quick">${[300, 1000, 5000, 20000].map(v => `<button type="button" data-sum="${v}">${rub(v)}</button>`).join('')}</div><label class="calc7__bonus"><input type="checkbox" data-bonus> С промокодом ${PROMO} (+7%)</label></div><div class="calc7__out"><div class="calc7__sum"><span>Доступно кейсов</span><b data-count>—</b><small data-total></small></div><ol class="calc7__list" data-list></ol><p class="calc7__note">Показаны самые дорогие кейсы, которые укладываются в сумму. Цены на ${PRICE_DATE}.</p></div><script type="application/json" data-cases>${data}</script></div>`;

  // ---------- Главная ----------
  {
    const body = `<section class="hero7"><div class="container"><div class="hero7__head"><span class="t7__k">Калькулятор · ${ALL.length} кейсов · цены на ${PRICE_DATE}</span><h1>Что открыть на Мусор Дроп на ваш бюджет</h1><p class="lead">Введите сумму — увидите, какие кейсы «Мусорного минимума» и VIP Color в неё укладываются и сколько раз каждый можно открыть. Без регистрации и лишних кликов.</p></div>${calc()}</div></section>`
      + sec(`${t7('Готовые расчёты', 'Четыре популярных бюджета с планами на вечер: что взять, как распределить и чего избегать.', 'Бюджеты')}<div class="bud7">${BUDGETS.map(b => { const n = ALL.filter(i => i.rub <= b.sum).length; return `<a href="/${b.slug}/"><span>на</span><b>${rub(b.sum)}</b><small>${cases(n)} доступно</small><em>${b.plans.length} плана ${I.arrow}</em></a>`; }).join('')}</div>`)
      + sec(`<div class="duo7"><div>${t7('Сначала лимит, потом кейс', '', 'Правило №1')}<p class="muted">Калькулятор отвечает на вопрос «что можно открыть», но не на вопрос «сколько стоит тратить». Второе решаете вы — и лучше до того, как увидели первую рулетку. Сумма на вечер — это деньги, которые вы готовы потерять полностью.</p><a class="lnk7" href="/limit/">Как поставить лимит ${I.arrow}</a></div><div class="math7"><div class="math7__row"><span>Ставите</span><b>100 × 100 ₽</b></div><div class="math7__row"><span>RTP площадки</span><b>98%</b></div><div class="math7__row is-acc"><span>В среднем по всем игрокам</span><b>≈ 9 800 ₽</b></div><div class="math7__row"><span>У конкретного игрока</span><b>от нуля до многих тысяч</b></div><a class="lnk7" href="/rtp/">Почему так ${I.arrow}</a></div></div>`, true)
      + sec(`${t7('Самые доступные', 'Если хочется просто попробовать — вот восемь кейсов дешевле 100 ₽.', 'От ' + rub(low.rub))}<div class="grid7">${asc.slice(0, 8).map(i => tile(i)).join('')}</div><a class="lnk7" href="/katalog/">Весь каталог с фильтром ${I.arrow}</a>`)
      + sec(`<div class="narrow">${t7('Вопросы о калькуляторе', '', 'FAQ')}${qa(FAQ.slice(0, 4))}</div>`, true)
      + foot();
    page('/', ['Калькулятор бюджета Мусор Дроп — что открыть на вашу сумму | Musor Drop', `Калькулятор кейсов Musor Drop (Мусор Дроп): введите бюджет и узнайте, какие кейсы «Мусорного минимума» и VIP Color можно открыть и сколько раз. Планы на 300, 1 000, 5 000 и 20 000 ₽.`], body, [siteLd('Musor Drop — калькулятор бюджета'), faqLd(FAQ.slice(0, 4))]);
  }

  // ---------- Каталог ----------
  {
    const body = ph({ cr: crumbs([null, 'Каталог']), k: `${ALL.length} кейсов`, h1: 'Кейсы калькулятора: Мусорный минимум и VIP Color', lead: `Все ${ALL.length} кейсов, с которыми работает калькулятор, — от самых дорогих к дешёвым. Отфильтруйте по коллекции, чтобы сравнить серию целиком. Цены на ${PRICE_DATE}.` })
      + sec(`<div class="flt7" data-filter-for="#cat7" data-filter-attr="data-coll"><button class="is-on" type="button" data-coll="all">Все<small>${ALL.length}</small></button>${COLLS.map(c => `<button type="button" data-coll="${c.slug}">${c.title}<small>${c.items.length}</small></button>`).join('')}</div><div class="grid7 grid7--all" id="cat7">${[...asc].reverse().map(i => tile(i, `<small>${coin(i.coin)} мон. · ${collBySlug[i.coll].title}</small>`)).join('')}</div>`)
      + foot();
    page('/katalog/', [`Мусорный минимум и VIP Color — ${ALL.length} кейсов Мусор Дроп с ценами`, `${ALL.length} кейсов Musor Drop из «Мусорного минимума» и VIP Color с ценами в рублях и монетах и фильтром по коллекциям. От ${rub(low.rub)}.`], body, listLd('Мусорный минимум и VIP Color — Musor Drop', [...asc].reverse(), rub));
  }

  // ---------- Бюджеты ----------
  BUDGETS.forEach((b, idx) => {
    const fit = asc.filter(i => i.rub <= b.sum);
    const topFit = [...fit].reverse().slice(0, 8);
    const multi = fit.filter(i => Math.floor(b.sum / i.rub) >= 2).slice(-8).reverse();
    const fq = [[`Сколько кейсов можно открыть на ${rub(b.sum)}?`, `${cases(fit.length)} из ${ALL.length} в калькуляторе стоят не дороже ${rub(b.sum)}. Самый дешёвый — «${low.name}»: его можно открыть ${times(Math.floor(b.sum / low.rub))}.`], [`Какой самый дорогой кейс за ${rub(b.sum)}?`, `«${topFit[0].name}» — ${rub(topFit[0].rub)}.`], ['Сколько добавит промокод?', `С ${PROMO} к первому пополнению на ${rub(b.sum)} добавится ${rub(Math.round(b.sum * 0.07))}.`]];
    const other = BUDGETS.filter(x => x !== b);
    const side = `<aside class="side7"><small>На ${rub(b.sum)} доступно</small><b>${cases(fit.length)}</b><span>из ${ALL.length} в каталоге</span><div class="side7__bar"><i style="width:${Math.round(fit.length / ALL.length * 100)}%"></i></div><span>С ${PROMO}: ${rub(Math.round(b.sum * 1.07))}</span></aside>`;
    const body = ph({ cr: crumbs([null, `На ${rub(b.sum)}`]), k: `Бюджет ${idx + 1} из ${BUDGETS.length}`, h1: `Что открыть на Мусор Дроп на ${rub(b.sum)}`, lead: b.lead, side })
      + sec(`${t7('Три плана на этот бюджет', '', 'Планы')}<div class="plans7">${b.plans.map(([t, d], n) => `<div><span>План ${'АБВ'[n]}</span><h3>${t}</h3><p>${d}</p></div>`).join('')}</div><p class="warn7">${I.info}<span>${b.note}</span></p>`)
      + sec(`${t7(`Самые дорогие кейсы до ${rub(b.sum)}`, 'Одна попытка на почти весь бюджет. Максимальный разброс результата.', 'Один выстрел')}<div class="grid7">${topFit.map(i => tile(i, `<small>${times(Math.floor(b.sum / i.rub))} на бюджет</small>`)).join('')}</div>`, true)
      + sec(`${t7('Несколько попыток', `Кейсы, которые можно открыть хотя бы дважды на ${rub(b.sum)}.`, 'Серия')}<div class="tbl7w"><table class="tbl7"><thead><tr><th>Кейс</th><th>Цена</th><th>Сколько раз</th><th>Остаток</th></tr></thead><tbody>${multi.map(i => { const n = Math.floor(b.sum / i.rub); return `<tr><td>${i.name}</td><td>${rub(i.rub)}</td><td><b>${times(n)}</b></td><td>${rub(Math.round((b.sum - n * i.rub) * 100) / 100)}</td></tr>`; }).join('')}</tbody></table></div>`)
      + sec(`<div class="narrow">${t7('Вопросы', '', 'FAQ')}${qa(fq)}<div class="oth7">${other.map(o => `<a href="/${o.slug}/">на ${rub(o.sum)} ${I.arrow}</a>`).join('')}</div></div>`, true)
      + foot();
    page(`/${b.slug}/`, [`Что открыть на Мусор Дроп на ${rub(b.sum)} — кейсы и планы`, `${cases(fit.length)} Musor Drop укладываются в ${rub(b.sum)}. Три плана на бюджет, самые дорогие кейсы до этой суммы и сколько раз можно открыть каждый.`], body, [listLd(`Кейсы Musor Drop до ${rub(b.sum)}`, topFit, rub), faqLd(fq)]);
  });

  // ---------- Лимит ----------
  {
    const rules = [['Сумма — до игры', 'Решите, сколько тратите сегодня, пока вы спокойны. Во время игры эта цифра всегда кажется «чуть маловатой».'], ['Только свободные деньги', 'Не трогайте деньги на еду, жильё, учёбу и долги. Кейсы — развлечение, а не способ заработка.'], ['Один депозит на вечер', 'Пополнили — играете. Закончилось — выходите. Второе пополнение за вечер — сигнал остановиться.'], ['Выигрыш — тоже стоп', 'Если выпал хороший скин, выведите его. Ставить его обратно «ради большего» — тот же риск заново.'], ['Время, а не только деньги', 'Поставьте таймер на 30–60 минут. Долгие сессии почти всегда заканчиваются минусом.'], ['Пауза после серии неудач', 'Неудачи не повышают шанс следующей игры. Каждое открытие независимо.']];
    const fq = [['Можно ли ограничить себя на самой площадке?', 'Проще всего — не держать на балансе больше, чем лимит на вечер. Если чувствуете, что теряете контроль, обратитесь в поддержку площадки с просьбой о самоограничении.'], ['Где получить помощь, если игра выходит из-под контроля?', 'Поговорите с близкими и обратитесь к специалисту. Признак проблемы — желание «отыграться» и игра на деньги, которые нужны для жизни.']];
    const body = ph({ cr: crumbs([null, 'Лимит и банк']), k: 'Ответственная игра', h1: 'Лимит и банк: как не потратить на кейсы больше, чем планировали', lead: 'Калькулятор считает, что можно открыть. Эта страница — о том, сколько стоит тратить. Шесть правил, которые работают лучше любых «стратегий».' })
      + sec(`<div class="rules7">${rules.map(([t, d], n) => `<div><span>${String(n + 1).padStart(2, '0')}</span><h3>${t}</h3><p>${d}</p></div>`).join('')}</div>`)
      + sec(`<div class="duo7"><div>${t7('Простая формула банка', '', 'Расчёт')}<p class="muted">Многие считают так: месячная сумма на развлечения, делённая на число игровых вечеров. Если на развлечения у вас 4 000 ₽ в месяц, а играть вы хотите раз в неделю — лимит вечера 1 000 ₽. Внутри вечера можно открыть хоть один кейс, хоть десять, но не больше этой суммы.</p></div><div class="math7"><div class="math7__row"><span>На развлечения в месяц</span><b>4 000 ₽</b></div><div class="math7__row"><span>Вечеров с кейсами</span><b>4</b></div><div class="math7__row is-acc"><span>Лимит на вечер</span><b>1 000 ₽</b></div><a class="lnk7" href="/na-1000-rublej/">Что открыть на 1 000 ₽ ${I.arrow}</a></div></div>`, true)
      + sec(`<div class="narrow">${t7('Вопросы', '', 'FAQ')}${qa(fq)}</div>`)
      + foot();
    page('/limit/', ['Лимит и банк на Мусор Дроп — как не потратить лишнего', 'Шесть правил ответственной игры на Musor Drop: лимит до игры, свободные деньги, один депозит на вечер, таймер и пауза после неудач. Формула банка.'], body, faqLd(fq));
  }

  // ---------- RTP ----------
  {
    const fq = [['RTP 98% — это значит, что я потеряю 2%?', 'Нет. Это среднее по всем игрокам на огромном числе игр. Отдельный игрок за вечер может потерять весь бюджет или получить предмет в разы дороже.'], ['Зависит ли RTP от цены кейса?', 'Площадка заявляет один показатель. Цена кейса влияет на разброс в одной попытке, а не на среднюю отдачу.'], ['Как убедиться, что результат честный?', 'Площадка использует Provably Fair: хеш серверного сида виден до игры, а после смены сидов любую игру можно пересчитать.']];
    const body = ph({ cr: crumbs([null, 'RTP и шансы']), k: 'Математика', h1: 'RTP 98% и шансы: что они значат для вашего бюджета', lead: 'Цифра RTP есть на каждом сайте с кейсами, но мало кто объясняет, как она работает на реальной сумме. Разбираем на примерах.' })
      + sec(`<div class="narrow prose"><h2 style="margin-top:0">Что такое RTP</h2><p>Return to Player — доля поставленных денег, которая возвращается игрокам предметами. Если RTP 98%, то из каждого миллиона рублей, потраченного всеми игроками на кейсы, около 980 тысяч возвращается в виде скинов. Это свойство площадки целиком, а не вашей сессии.</p><h2>Почему у вас может быть иначе</h2><p>В пуле каждого кейса есть частые недорогие предметы и редкие дорогие. Большинство открытий приносит что-то дешевле цены кейса, а редкие удачные компенсируют это в среднем. Если вы открыли десять кейсов, редкая позиция могла не выпасть ни разу — и тогда ваш результат будет ниже 98%. Или выпасть в первой же прокрутке.</p><h2>Пример на 1 000 ₽</h2><ul><li><strong>Один кейс за 1 000 ₽.</strong> Результат — один предмет. Разброс максимальный: от малой части цены до многократной.</li><li><strong>Десять кейсов по 100 ₽.</strong> Результаты сглаживаются: скорее всего, часть открытий в минус, часть около нуля, иногда — удачный предмет.</li><li><strong>Пятьдесят кейсов по 20 ₽.</strong> Самый ровный результат, но и самый мелкий дроп.</li></ul><p>Средняя отдача во всех трёх случаях одна и та же. Отличается только то, насколько сильно ваш вечер может отклониться от среднего.</p><h2>Как это использовать</h2><p>Если вам важен процесс — берите много дешёвых кейсов. Если нужен шанс на конкретный дорогой предмет — меньше дорогих, но с пониманием, что вечер может закончиться быстро. Калькулятор на <a href="/">главной</a> показывает оба варианта для вашей суммы.</p></div>`)
      + sec(`<div class="narrow">${t7('Вопросы', '', 'FAQ')}${qa(fq)}</div>`, true)
      + foot();
    page('/rtp/', ['RTP 98% на Мусор Дроп — что значит для вашего бюджета', 'Как работает RTP 98% на Musor Drop: среднее по всем игрокам, разброс в одной сессии, пример на 1 000 ₽ — один дорогой кейс против десяти дешёвых.'], body, faqLd(fq));
  }

  // ---------- Промокод ----------
  {
    const deps = [300, 1000, 2000, 5000, 10000, 20000];
    const fq = [['Когда вводить промокод?', 'В окне пополнения, до нажатия кнопки оплаты.'], ['Сработает ли код на втором пополнении?', `${PROMO} рассчитан на первое пополнение аккаунта.`]];
    const body = ph({ cr: crumbs([null, 'Промокод']), k: 'Бонус', h1: `Промокод Мусор Дроп ${PROMO}: сколько добавит к вашему бюджету`, lead: 'Семь процентов к первому пополнению — это бесплатные кейсы на старте. Таблица ниже показывает, сколько именно.' })
      + sec(`<div class="duo7"><div class="tbl7w"><table class="tbl7"><thead><tr><th>Пополнение</th><th>Бонус</th><th>Итого</th><th>Это ещё…</th></tr></thead><tbody>${deps.map(d => { const bonus = Math.round(d * 0.07); const extra = [...asc].reverse().find(i => i.rub <= bonus); return `<tr><td>${rub(d)}</td><td>+${rub(bonus)}</td><td><b>${rub(Math.round(d * 1.07))}</b></td><td>${extra ? `«${extra.name}»` : '—'}</td></tr>`; }).join('')}</tbody></table></div><div><div class="codes7">${PROMOS.map((c, n) => `<div${n ? '' : ' class="is-main"'}><b>${c}</b><span>${['+7% к первому пополнению', 'код на пополнение', 'в разделе бонусов'][n]}</span><button type="button" data-copy="${c}" aria-label="Скопировать ${c}">${I.copy}</button></div>`).join('')}</div>${qa(fq)}</div></div>`)
      + foot();
    page('/promokod/', [`Промокод Мусор Дроп ${PROMO} — +7% к пополнению, таблица бонуса`, `Сколько даёт промокод ${PROMO} на Musor Drop: бонус 7% для пополнений от 300 до 20 000 ₽ и какой кейс можно открыть на бонус. Коды MUSOR и INVFMFEP7.`], body, faqLd(fq));
  }

  // ---------- Вопросы ----------
  {
    const body = ph({ cr: crumbs([null, 'Вопросы']), k: 'FAQ', h1: 'Вопросы о бюджете и кейсах Мусор Дроп', lead: 'Калькулятор, промокод, RTP, лимиты и вывод — коротко.' })
      + sec(`<div class="narrow">${qa(FAQ)}</div>`)
      + foot();
    page('/voprosy/', ['Вопросы о бюджете на Мусор Дроп — калькулятор, RTP, лимит', 'Ответы о калькуляторе бюджета Musor Drop: как он работает, учёт промокода, минимальная сумма, RTP 98% и что делать, если бюджет закончился.'], body, faqLd(FAQ));
  }

  // ---------- О проекте ----------
  {
    const body = ph({ cr: crumbs([null, 'О проекте']), k: 'О нас', h1: 'О калькуляторе', lead: 'Небольшой инструмент для тех, кто сначала считает, а потом играет.' })
      + sec(`<div class="narrow prose"><p>Мы сделали калькулятор, потому что сами устали прикидывать в голове, что можно открыть на оставшиеся на балансе деньги. Он работает с двумя сериями Musor Drop — «Мусорным минимумом» и VIP Color, — цены взяты с площадки на ${PRICE_DATE} и обновляются целиком.</p><p>Сайт не продаёт кейсы, не принимает платежи и не видит ваших аккаунтов. Кнопки ведут на игровую площадку; вопросы по балансу и выводу решает её поддержка.</p><h2>Связаться</h2><p>Нашли расхождение в цене или хотите предложить новый расчёт — пишите на <a href="mailto:${C.EMAIL}">${C.EMAIL}</a>.</p></div>`)
      + foot();
    page('/o-proekte/', ['О калькуляторе бюджета Мусор Дроп', 'Кто сделал калькулятор бюджета для кейсов Musor Drop, откуда цены и как связаться.'], body);
  }
}

const NAV = [['/katalog/', 'Каталог'], ['/na-1000-rublej/', 'Бюджеты'], ['/limit/', 'Лимит'], ['/rtp/', 'RTP'], ['/promokod/', 'Промокод'], ['/voprosy/', 'Вопросы']];

function header(s, cur) {
  const { I, SPY } = CTX;
  const active = h => cur.startsWith(h) || (h === '/na-1000-rublej/' && cur.startsWith('/na-'));
  return `<header class="header header7"><div class="container header__in"><a href="/" class="logo logo7" aria-label="Калькулятор Musor Drop — главная"><img src="/assets/logo.svg" alt="Musor Drop" width="36" height="36"><span><span class="logo__name">Musor Drop</span><span class="logo__tag">калькулятор</span></span></a><nav class="nav" aria-label="Основное меню">${NAV.map(([h, t]) => `<a href="${h}"${active(h) ? ' class="is-active"' : ''}>${t}</a>`).join('')}</nav><div class="header__cta"><a class="btn btn--primary btn--sm" href="${SPY}" rel="nofollow">${I.steam}<span>Войти</span></a></div><button class="burger" type="button" aria-label="Меню" aria-expanded="false">${I.menu}</button></div></header>
<nav class="mnav" aria-label="Мобильное меню"><a href="/">Калькулятор</a>${NAV.map(([h, t]) => `<a href="${h}">${t}</a>`).join('')}<a class="btn btn--primary" href="${SPY}" rel="nofollow">${I.steam}<span>Войти через Steam</span></a></nav>`;
}

function footer(s) {
  const { I, SPY, C } = CTX;
  return `<footer class="f7"><div class="container">
<div class="f7__grid">
<div class="f7__a"><a href="/" class="logo logo7"><img src="/assets/logo.svg" alt="" width="36" height="36"><span><span class="logo__name">Musor Drop</span><span class="logo__tag">калькулятор</span></span></a><p>Считаем, что открыть на вашу сумму, — до того, как вы её потратили.</p></div>
<div><h4>Бюджеты</h4><ul>${BUDGETS.map(b => `<li><a href="/${b.slug}/">На ${rub(b.sum)}</a></li>`).join('')}</ul></div>
<div><h4>Разделы</h4><ul>${NAV.filter(([h]) => !h.startsWith('/na-')).map(([h, t]) => `<li><a href="${h}">${t}</a></li>`).join('')}<li><a href="/o-proekte/">О проекте</a></li></ul></div>
<div class="f7__box"><h4>Перед игрой</h4><ol><li>Решите лимит</li><li>Скопируйте ${PROMO}</li><li>Посмотрите шансы</li></ol><a class="btn btn--primary btn--sm" href="${SPY}" rel="nofollow">${I.box}<span>К кейсам</span></a></div>
</div>
<div class="f7__b"><span class="f7__18">18+</span><p>Кейсы — игра с риском потери денег. Калькулятор носит справочный характер и не связан с Valve и Steam. ${C.EMAIL}</p><span>© 2026 Musor Drop</span></div>
</div></footer>`;
}

const SITE = {
  id: 'v7', out: 'site-18', online: 2240, color: '#0F0C17',
  T: {},
  fonts: 'https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;700;800&display=swap',
  vars: { bg: '#0F0C17', 'bg-rgb': '15,12,23', bg2: '#140F1F', card: '#1A1528', 'card-h': '#221C34', line: 'rgba(255,255,255,.07)', line2: 'rgba(255,255,255,.12)', acc: '#8257E5', 'acc-h': '#AE8CF5', 'acc-d': '#6239C2', 'acc-m': 'rgba(130,87,229,.16)', 'acc-b': 'rgba(130,87,229,.45)', 'acc-rgb': '130,87,229', text: '#F3F0FB', muted: '#BBB3CF', dim: '#857D99', ease: 'cubic-bezier(.22,1,.36,1)' },
  heroCase: ['case01', ''],
  skins: 'skins7', drops: dropsOf(7), // лента дропа из своих скинов (_shared/skins7/)
  header: (s, cur) => header(s, cur),
  footer: s => footer(s),
  render: ctx => { CTX = ctx; build(ctx); },
};
export { SITE as site };
