// Сайт 10 — «справочный центр»: каждый вопрос о Musor Drop — отдельная страница с коротким ответом,
// подробностями и похожими вопросами. Поиск по вопросам на главной. Сиреневый, Nunito.
import { COLLS, ALL, rub, PRICE_DATE } from './catalog.mjs';
import { faqLd, siteLd, pager, crumbsFor, PROMOS, cases, dropsOf } from './kit.mjs';

const PROMO = 'FIRST';
const low = ALL.reduce((a, i) => i.rub < a.rub ? i : a), top = ALL.reduce((a, i) => i.rub > a.rub ? i : a);
const CATS = [
  ['akkaunt', 'Аккаунт и вход', 'user', 'usp-printstream'],
  ['balans', 'Баланс и бонусы', 'wallet', 'deagle-mecha'],
  ['igra', 'Кейсы и режимы', 'box', 'ak-headshot'],
  ['vyvod', 'Вывод скинов', 'download', 'awp-chromatic'],
  ['bezopasnost', 'Честность и безопасность', 'shield', 'm9-lore'],
];

// [slug, cat, вопрос, короткий ответ, подробности(html)]
const Q = [
  ['kak-zaregistrirovatsya', 'akkaunt', 'Как зарегистрироваться на Musor Drop?', 'Отдельной регистрации нет: аккаунт появляется при первом входе через Steam, Telegram, VK или Google.', '<p>Нажмите «Войти» на площадке и выберите удобный сервис. Пароль от Musor Drop придумывать не нужно — авторизацию подтверждает выбранный сервис.</p><p>Если планируете выводить скины, удобнее входить через Steam: трейд-ссылка и инвентарь связаны с этим аккаунтом. Сразу после первого входа площадка попросит выбрать валюту баланса.</p>'],
  ['mozhno-li-smenit-valyutu', 'akkaunt', 'Можно ли сменить валюту аккаунта?', 'Нет. Рубли или доллары (монеты) выбираются один раз — при первом входе.', '<p>Все цены, пополнения и бонусы дальше считаются в выбранной валюте. Поэтому выбирайте ту, которой будете пополнять: так не придётся платить за конвертацию.</p><p>Цены в двух валютах площадка задаёт отдельно и округляет рублёвые до удобных чисел — пересчёт «по курсу» может немного не совпадать.</p>'],
  ['s-kakogo-vozrasta', 'akkaunt', 'С какого возраста можно играть?', 'С 18 лет. Открытие кейсов — игра с риском потери денег.', '<p>Возрастное ограничение связано с тем, что результат кейса случаен, а деньги реальные. Если вам меньше 18, площадка не для вас.</p><p>Взрослым игрокам советуем заранее решать, какую сумму вы готовы потратить, и не превышать её.</p>'],
  ['kak-popolnit-balans', 'balans', 'Как пополнить баланс?', 'Картой и другими фиатными способами, криптовалютой или скинами CS2 из инвентаря Steam.', `<p>Окно пополнения открывается по кнопке с балансом в шапке площадки. Выберите способ, укажите сумму и — если это первое пополнение — введите промокод ${PROMO} до оплаты.</p><p>При пополнении скинами предметы передаются боту площадки и зачисляются на баланс по её оценке.</p>`],
  ['kakoj-promokod-rabotaet', 'balans', 'Какой промокод сейчас работает?', `${PROMO} — +7% к первому пополнению. Также встречаются MUSOR и INVFMFEP7.`, `<p>${PROMO} и MUSOR вводятся в окне пополнения, INVFMFEP7 — в разделе бонусов личного кабинета. Стартовый бонус обычно начисляется один раз на аккаунт.</p><p>Если код не принимается, проверьте, что вводите его латиницей и до оплаты.</p>{{CODES}}`],
  ['kakie-est-bonusy', 'balans', 'Какие ещё есть бонусы, кроме промокода?', 'Rakeback с каждой ставки, кэшбэк 10% раз в неделю, кейс за подписку на Telegram-канал и реферальная программа.', '<p><b>Rakeback</b> возвращает часть каждой ставки на баланс. <b>Кэшбэк</b> — 10% от потраченного за неделю. <b>Бесплатный кейс</b> выдаётся за подписку на Telegram-канал площадки и привязку аккаунта. По <b>реферальной ссылке</b> вы получаете процент с игры приглашённых друзей.</p><p>Бонусы увеличивают баланс, но не меняют шансы в кейсах.</p>'],
  ['est-li-demo', 'balans', 'Можно ли попробовать бесплатно?', 'Да, на площадке есть демо-баланс для кейсов и апгрейда.', '<p>Демо-баланс показывает ту же механику, что и реальный: таблицы шансов, рулетку, апгрейд. Выводить предметы, полученные на демо, нельзя.</p><p>Это лучший способ понять, как всё устроено, до первого пополнения.</p>'],
  ['skolko-stoyat-kejsy', 'igra', 'Сколько стоят кейсы?', `От ${rub(low.rub)} до ${rub(top.rub)}. В каталоге ${cases(ALL.length)} в ${COLLS.length} коллекциях.`, `<p>Самый доступный — «${low.name}» из «Мусорного минимума», самый дорогой — «${top.name}» из Металлической коллекции. Почти половина кейсов стоит от 100 до 500 ₽.</p><p>Цены приведены на ${PRICE_DATE}; актуальная стоимость всегда видна на странице кейса.</p>`],
  ['kak-uznat-shansy', 'igra', 'Как узнать шансы в кейсе?', 'Откройте страницу кейса: под кнопкой открытия — список всех предметов с вероятностью каждого.', '<p>Смотрите на две вещи: какой предмет выпадает чаще всего и сколько позиций дороже цены кейса. Первое — ваш самый вероятный результат, второе — как часто открытие окупается.</p><p>Шансы видны до оплаты и не меняются после нажатия «Открыть».</p>'],
  ['chto-takoe-apgrejd', 'igra', 'Что такое апгрейд?', 'Режим, где вы ставите свой скин ради более дорогого. Шанс зависит от разницы цен и виден заранее.', '<p>Выбираете ставку — один или несколько предметов — и цель. Чем дороже цель относительно ставки, тем ниже шанс. При успехе получаете цель, при неудаче ставка сгорает целиком.</p><p>Не ставьте последний ценный предмет ради цели с шансом в несколько процентов.</p>'],
  ['chto-takoe-kontrakt', 'igra', 'Как работает контракт?', 'Отдаёте от 3 до 10 скинов и получаете один. Сложность задаёт диапазон множителя — до x10.', '<p>Контракт удобен, чтобы превратить мелкий дроп в один предмет. До подтверждения видно, какой стоимости может быть результат в худшем и лучшем случае.</p><p>Начинайте с низкой сложности — разброс будет меньше.</p>'],
  ['chto-takoe-kejs-batl', 'igra', 'Что такое кейс-батл?', 'Соревнование: несколько игроков открывают одинаковые кейсы, победитель определяется по правилам режима.', '<p>Есть режимы «Классика» и «Общак», командные бои и модификаторы, которые меняют правила раунда. Можно создать свой батл или присоединиться к открытому.</p><p>Перед игрой с модификатором прочитайте его описание: победитель может определяться не так, как в Классике.</p>'],
  ['kak-vyvesti-skin', 'vyvod', 'Как вывести скин в Steam?', 'Укажите трейд-ссылку в профиле, нажмите «Вывести» у предмета и подтвердите обмен в мобильном Steam.', '<p>Предмет придёт предложением обмена от бота площадки. Проверьте, что вам отдают именно ваш скин, а вы ничего не отдаёте, и подтвердите обмен в Steam Guard.</p><p>Обычно это занимает несколько минут.</p>'],
  ['pochemu-ne-prihodit-vyvod', 'vyvod', 'Почему не приходит вывод?', 'Чаще всего — закрытый инвентарь, устаревшая трейд-ссылка, отсутствие Steam Guard или трейд-бан.', '<ul><li>проверьте, что инвентарь открыт в настройках приватности Steam;</li><li>сравните трейд-ссылку в профиле площадки с актуальной в Steam;</li><li>убедитесь, что подключён мобильный аутентификатор и нет удержания обменов;</li><li>посмотрите статус вывода в профиле: если предмета нет у бота, ожидание может быть дольше.</li></ul><p>Если всё в порядке, а вывода нет долго — пишите в поддержку площадки.</p>'],
  ['gde-vzyat-trejd-ssylku', 'vyvod', 'Где взять трейд-ссылку?', 'Steam → Инвентарь → Предложения обмена → «Кто может отправлять мне предложения обмена». Ссылка — внизу страницы.', '<p>Скопируйте её целиком и вставьте в профиле площадки, в поле «Trade URL». Если вы когда-нибудь создадите новую ссылку в Steam, старая перестанет работать — обновите её и на площадке.</p><p>Не публикуйте трейд-ссылку в открытых чатах.</p>'],
  ['kak-proverit-chestnost', 'bezopasnost', 'Как проверить, что результат честный?', 'Площадка использует Provably Fair: хеш серверного сида виден до игры, а после смены сидов результат можно пересчитать.', '<p>Сохраните хеш серверного сида перед игрой, сыграйте, смените пару сидов — серверный сид раскроется. SHA-256 от него должен совпасть с сохранённым хешем, а HMAC-SHA256 от сидов и номера игры — дать ваш результат.</p><p>Проверка гарантирует, что результат не изменили после ставки, но не обещает выигрыш.</p>'],
  ['chto-znachit-rtp', 'bezopasnost', 'Что значит RTP 98%?', 'Около 98% поставленного всеми игроками в среднем возвращается предметами. Это показатель площадки, а не вашей сессии.', '<p>На коротком отрезке результат конкретного игрока может быть сильно выше или ниже 98%. Чем меньше игр и чем дороже кейс, тем больше разброс.</p>'],
  ['kak-ne-popast-na-poddelku', 'bezopasnost', 'Как не попасть на поддельный сайт?', 'Заходите с закладки, проверяйте адрес и то, что вход Steam открывается на steamcommunity.com.', '<p>Признаки подделки: опечатка в адресе, необычная доменная зона, «гарантированный нож» и ссылки из личных сообщений. Если ввели пароль на подозрительной странице — сразу смените его, деавторизуйте другие устройства и проверьте ключ Steam Web API.</p>'],
];

let CTX;
function build(ctx) {
  const { I, SPY, C, ext, sec } = ctx;
  const s = SITE;
  const page = pager(ctx, s);
  const crumbs = crumbsFor('Справка');
  const cat = k => CATS.find(c => c[0] === k);
  const codes = `<div class="cd10">${PROMOS.map((c, n) => `<button type="button" data-copy="${c}"${n ? '' : ' class="is-main"'}><b>${c}</b><span>${['+7% к пополнению', 'на пополнение', 'раздел бонусов'][n]}</span>${I.copy}</button>`).join('')}</div>`;
  const qlink = q => `<a class="ql10" href="/vopros/${q[0]}/"><span>${q[2]}</span>${I.arrow}</a>`;
  const help = (t = 'Не нашли ответ?', d = 'Вопросы по балансу и выводу решает поддержка площадки — там видна история ваших операций.') => `<section class="hp10"><div class="container"><div class="hp10__in"><div class="hp10__ico">${I.info}</div><div><h2>${t}</h2><p>${d}</p></div><div class="hp10__btns"><a class="btn btn--ghost" href="/napisat/">Написать нам</a>${ext('btn btn--primary', `<span>Открыть площадку</span>${I.arrow}`)}</div></div></div></section>`;

  // ---------- Главная ----------
  {
    const popular = ['kakoj-promokod-rabotaet', 'kak-vyvesti-skin', 'mozhno-li-smenit-valyutu', 'kak-uznat-shansy', 'pochemu-ne-prihodit-vyvod', 'est-li-demo'].map(sl => Q.find(q => q[0] === sl));
    const body = `<section class="hero10"><div class="hero10__skins" aria-hidden="true">${['m4a4-temukau', 'glock-gamma', 'famas-commemoration'].map((k, n) => `<img class="s${n}" src="/assets/skins/${k}.webp" alt="">`).join('')}</div><div class="container"><h1>Справочный центр Musor Drop</h1><p class="lead">${Q.length} ответов о входе, балансе, кейсах, выводе и безопасности. Начните вводить вопрос — подходящие ответы появятся сразу.</p>
<div class="srch10" data-search><span>${I.info}</span><input type="search" placeholder="Например: промокод, вывод, валюта…" aria-label="Поиск по вопросам"><ul hidden>${Q.map(q => `<li><a href="/vopros/${q[0]}/" data-text="${(q[2] + ' ' + q[3]).toLowerCase().replace(/"/g, '')}">${q[2]}<small>${cat(q[1])[1]}</small></a></li>`).join('')}<li class="srch10__none" hidden>Ничего не нашлось — загляните в разделы ниже.</li></ul></div>
<div class="tags10">${popular.slice(0, 4).map(q => `<a href="/vopros/${q[0]}/">${q[2].replace('?', '')}</a>`).join('')}</div></div></section>`
      + sec(`<div class="cats10">${CATS.map(([k, t, ic, sk]) => { const l = Q.filter(q => q[1] === k); return `<a class="cat10" href="/razdel/${k}/"><img class="cat10__skin" src="/assets/skins/${sk}.webp" alt="" loading="lazy"><span class="ico">${I[ic]}</span><b>${t}</b><small>${l.length} ${l.length < 5 ? 'вопроса' : 'вопросов'}</small><ul>${l.slice(0, 3).map(q => `<li>${q[2]}</li>`).join('')}</ul></a>`; }).join('')}</div>`)
      + sec(`<div class="two10"><div><h2 class="h10">Популярные вопросы</h2><div class="qls10">${popular.map(qlink).join('')}</div></div><div class="pc10"><h2 class="h10">Промокоды</h2><p class="muted">Код ${PROMO} добавляет 7% к первому пополнению. Нажмите на код, чтобы скопировать.</p>${codes}<a class="lnk10" href="/vopros/kakoj-promokod-rabotaet/">Подробнее о кодах ${I.arrow}</a></div></div>`, true)
      + help();
    page('/', ['Справочный центр Musor Drop — ответы на вопросы о Мусор Дроп', `Справка по Musor Drop (Мусор Дроп): ${Q.length} ответов о регистрации, валюте, промокоде ${PROMO}, шансах в кейсах, апгрейде, выводе скинов в Steam и безопасности.`], body, [siteLd('Musor Drop — справочный центр'), faqLd(popular.map(q => [q[2], q[3]]))]);
  }

  // ---------- Разделы ----------
  CATS.forEach(([k, t, ic]) => {
    const l = Q.filter(q => q[1] === k);
    const body = `<section class="ph10"><div class="container">${crumbs([null, t])}<div class="ph10__h"><span class="ico">${I[ic]}</span><div><h1>${t}</h1><p class="lead">${l.length} ${l.length < 5 ? 'вопроса' : 'вопросов'} с короткими ответами. Нажмите на вопрос, чтобы прочитать подробности.</p></div></div></div></section>`
      + sec(`<div class="two10 two10--side"><div class="acc10">${l.map(q => `<details><summary class="faq-q"><span>${q[2]}</span><span class="faq-ico">${I.chevron}</span></summary><div class="faq-a"><p>${q[3]}</p><a class="lnk10" href="/vopros/${q[0]}/">Подробный ответ ${I.arrow}</a></div></details>`).join('')}</div><nav class="nav10">${CATS.map(([kk, tt, ii]) => `<a href="/razdel/${kk}/"${kk === k ? ' class="is-on"' : ''}>${I[ii]}<span>${tt}</span></a>`).join('')}</nav></div>`)
      + help();
    page(`/razdel/${k}/`, [`${t} — справочный центр Musor Drop`, `Ответы о Musor Drop в разделе «${t}»: ${l.map(q => q[2].replace('?', '')).join(', ').slice(0, 120)}.`], body, faqLd(l.map(q => [q[2], q[3]])));
  });

  // ---------- Вопросы ----------
  Q.forEach(q => {
    const [k, t] = cat(q[1]);
    const same = Q.filter(x => x[1] === q[1] && x !== q);
    const more = Q.filter(x => x[1] !== q[1]).filter((_, n) => n % 4 === Q.indexOf(q) % 4).slice(0, 3);
    const detail = q[4].replace('{{CODES}}', codes);
    const body = `<article class="qa10"><div class="container"><div class="qa10__grid"><div>${crumbs([`/razdel/${k}/`, t], [null, 'Вопрос'])}<h1>${q[2]}</h1>
<div class="short10"><span>Коротко</span><p>${q[3]}</p></div>
<div class="prose pr10"><h2>Подробнее</h2>${detail}</div>
<div class="rate10"><span>Ответ помог?</span><a href="/razdel/${k}/">Да, спасибо</a><a href="/napisat/">Нет, написать нам</a></div></div>
<aside class="qa10__side"><div class="sd10"><h3>В этом разделе</h3>${same.map(qlink).join('')}</div><div class="sd10"><h3>Ещё спрашивают</h3>${more.map(qlink).join('')}</div><div class="sd10 sd10--promo"><b>${PROMO}</b><span>+7% к первому пополнению</span><button class="btn btn--primary btn--sm" type="button" data-copy="${PROMO}">${I.copy}<span>Скопировать</span></button></div></aside></div></div></article>`
      + help();
    page(`/vopros/${q[0]}/`, [`${q[2]} — справка Musor Drop`, q[3]], body, { '@context': 'https://schema.org', '@type': 'QAPage', mainEntity: { '@type': 'Question', name: q[2], answerCount: 1, acceptedAnswer: { '@type': 'Answer', text: `${q[3]} ${detail.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()}` } } });
  });

  // ---------- Написать ----------
  {
    const body = `<section class="ph10"><div class="container">${crumbs([null, 'Написать нам'])}<div class="ph10__h"><span class="ico">${I.mail}</span><div><h1>Написать нам</h1><p class="lead">Предложите новый вопрос для справки или сообщите, если ответ устарел.</p></div></div></div></section>`
      + sec(`<div class="two10"><div class="card"><h3>Справочный центр</h3><p>Почта: <a href="mailto:${C.EMAIL}">${C.EMAIL}</a>. Пишем ответы на новые вопросы и обновляем старые, когда площадка что-то меняет.</p></div><div class="card"><h3>Баланс, вывод, игры</h3><p>У справки нет доступа к аккаунтам. Всё, что связано с вашими деньгами и предметами, решает поддержка самой площадки — она видит историю операций.</p></div></div><div class="narrow" style="margin-top:32px"><h2 class="h10">Что указать в письме</h2><ul class="ul10"><li>${I.check}<span>Вопрос одним-двумя предложениями</span></li><li>${I.check}<span>Ссылку на страницу справки, если речь о ней</span></li><li>${I.check}<span>Скриншот, если что-то выглядит иначе, чем описано</span></li></ul></div>`)
      + help('Вопрос по аккаунту?', 'Его быстрее решит поддержка площадки.');
    page('/napisat/', ['Написать в справочный центр Musor Drop', 'Как связаться со справочным центром Musor Drop: предложить вопрос или сообщить об устаревшем ответе.'], body);
  }
}

function header(s, cur) {
  const { I, SPY } = CTX;
  return `<header class="header header10"><div class="container header__in"><a href="/" class="logo10" aria-label="Справочный центр Musor Drop — главная"><img src="/assets/logo.svg" alt="Musor Drop" width="34" height="34"><span><b>Musor Drop</b><small>справочный центр</small></span></a><nav class="nav" aria-label="Разделы">${CATS.map(([k, t]) => `<a href="/razdel/${k}/"${cur.startsWith(`/razdel/${k}/`) ? ' class="is-active"' : ''}>${t.split(' ')[0]}</a>`).join('')}</nav><div class="header__cta"><a class="btn btn--primary btn--sm" href="${SPY}" rel="nofollow">${I.steam}<span>Войти</span></a></div><button class="burger" type="button" aria-label="Меню" aria-expanded="false">${I.menu}</button></div></header>
<nav class="mnav" aria-label="Мобильное меню">${CATS.map(([k, t]) => `<a href="/razdel/${k}/">${t}</a>`).join('')}<a href="/napisat/">Написать нам</a><a class="btn btn--primary" href="${SPY}" rel="nofollow">${I.steam}<span>Войти через Steam</span></a></nav>`;
}

function footer(s) {
  const { I, C } = CTX;
  return `<footer class="f10"><div class="container"><div class="f10__top"><div class="f10__b"><a href="/" class="logo10"><img src="/assets/logo.svg" alt="" width="34" height="34"><span><b>Musor Drop</b><small>справочный центр</small></span></a><p>Короткие ответы на вопросы игроков. Справка не принимает платежи и не видит аккаунты.</p></div><div class="f10__cats">${CATS.map(([k, t, ic]) => `<a href="/razdel/${k}/">${I[ic]}<span>${t}</span></a>`).join('')}</div></div>
<div class="f10__bot"><span class="f10__age">18+</span><span>Открытие кейсов — игра с риском. Не связано с Valve и Steam.</span><a href="/napisat/">Написать нам</a><a href="mailto:${C.EMAIL}">${C.EMAIL}</a></div></div></footer>`;
}

const SITE = {
  id: 'v10', out: 'site-20', online: 2263, color: '#120D18',
  T: {},
  fonts: 'https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap',
  vars: { bg: '#120D18', 'bg-rgb': '18,13,24', bg2: '#18111F', card: '#201828', 'card-h': '#2A2034', line: 'rgba(255,255,255,.07)', line2: 'rgba(255,255,255,.12)', acc: '#A35FD9', 'acc-h': '#C899EE', 'acc-d': '#7F3FB5', 'acc-m': 'rgba(163,95,217,.15)', 'acc-b': 'rgba(163,95,217,.42)', 'acc-rgb': '163,95,217', text: '#F6F0FA', muted: '#C3B6CD', dim: '#8C7F97', ease: 'cubic-bezier(.22,1,.36,1)' },
  heroCase: ['case01', ''],
  skins: 'skins10', drops: dropsOf(10), // свои скины и лента дропа: _shared/skins10/
  header: (s, cur) => header(s, cur),
  footer: s => footer(s),
  render: ctx => { CTX = ctx; build(ctx); },
};
export { SITE as site };
