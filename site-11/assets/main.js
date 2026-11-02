(function () {
  // Мобильное меню
  var burger = document.querySelector('.burger');
  var mnav = document.querySelector('.mnav');
  if (burger && mnav) {
    burger.addEventListener('click', function () {
      var open = mnav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
  }

  // Онлайн-счётчик: плавно гуляет вокруг стартового значения
  var online = document.querySelectorAll('[data-online]');
  if (online.length) {
    var base = parseInt(online[0].textContent, 10) || 2293;
    var val = base;
    setInterval(function () {
      val += Math.round((Math.random() - 0.48) * 9);
      if (Math.abs(val - base) > 180) val = base + Math.round((Math.random() - 0.5) * 40);
      online.forEach(function (el) { el.textContent = val; });
    }, 3200);
  }

  // FAQ: вкладки по категориям и одно открытое окно (сайт 2)
  document.querySelectorAll('[data-faq]').forEach(function (box) {
    var items = box.querySelectorAll('details');
    var tabs = box.querySelectorAll('[data-tab]');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.toggle('is-on', t === tab); t.setAttribute('aria-selected', t === tab); });
        var cat = tab.getAttribute('data-tab');
        var first = true;
        items.forEach(function (d) {
          var show = d.getAttribute('data-cat') === cat;
          d.hidden = !show;
          d.open = show && first;
          if (show) first = false;
        });
      });
    });
    if (box.hasAttribute('data-single')) {
      items.forEach(function (d) {
        d.addEventListener('toggle', function () {
          if (d.open) items.forEach(function (o) { if (o !== d) o.open = false; });
        });
      });
    }
  });

  // Фильтр каталога кейсов
  var filters = document.querySelectorAll('[data-filter]');
  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var cat = btn.getAttribute('data-filter');
      filters.forEach(function (b) { b.classList.toggle('is-on', b === btn); });
      document.querySelectorAll('.case[data-cat]').forEach(function (c) {
        c.hidden = !(cat === 'all' || c.getAttribute('data-cat') === cat);
      });
    });
  });
  // Копирование промокода (сайты 3 и 4)
  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var code = btn.getAttribute('data-copy');
      var done = function () {
        btn.classList.add('is-copied');
        var lbl = btn.querySelector('span:not(:only-child)') || btn.querySelector('span');
        var old = lbl && !btn.classList.contains('hpromo3') ? lbl.textContent : null;
        if (old !== null) lbl.textContent = 'Скопировано';
        setTimeout(function () { btn.classList.remove('is-copied'); if (old !== null) lbl.textContent = old; }, 1600);
      };
      if (navigator.clipboard) navigator.clipboard.writeText(code).then(done, done);
      else { var ta = document.createElement('textarea'); ta.value = code; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); } catch (e) {} ta.remove(); done(); }
    });
  });

  // Сортировка таблицы кейсов по клику на заголовок
  document.querySelectorAll('table[data-sort]').forEach(function (table) {
    var body = table.tBodies[0];
    table.querySelectorAll('th[data-k]').forEach(function (th) {
      th.addEventListener('click', function () {
        var k = +th.getAttribute('data-k'), num = th.getAttribute('data-t') === 'n';
        var dir = th.getAttribute('aria-sort') === 'ascending' ? -1 : 1;
        table.querySelectorAll('th').forEach(function (x) { x.removeAttribute('aria-sort'); });
        th.setAttribute('aria-sort', dir === 1 ? 'ascending' : 'descending');
        var rows = Array.prototype.slice.call(body.rows);
        rows.sort(function (a, b) {
          var x = a.cells[k], y = b.cells[k];
          if (num) return (parseFloat(x.getAttribute('data-v')) - parseFloat(y.getAttribute('data-v'))) * dir;
          return x.textContent.localeCompare(y.textContent, 'ru') * dir;
        });
        rows.forEach(function (r) { body.appendChild(r); });
      });
    });
  });
  // Фильтр строк таблицы по кнопкам data-band (сайт 5) и data-pick (сайт 7)
  document.querySelectorAll('[data-filter-for]').forEach(function (bar) {
    var target = document.querySelector(bar.getAttribute('data-filter-for'));
    var attr = bar.getAttribute('data-filter-attr');
    var btns = bar.querySelectorAll('button[' + attr + ']');
    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var v = btn.getAttribute(attr);
        btns.forEach(function (b) { b.classList.toggle('is-on', b === btn); });
        target.querySelectorAll('[' + attr + ']').forEach(function (el) { el.hidden = !(v === 'all' || el.getAttribute(attr) === v); });
      });
    });
  });
  // Калькулятор бюджета (сайт 7): какие кейсы укладываются в сумму и сколько раз
  document.querySelectorAll('[data-calc]').forEach(function (box) {
    var list = JSON.parse(box.querySelector('[data-cases]').textContent);
    var input = box.querySelector('input[type=number]'), bonus = box.querySelector('[data-bonus]');
    var out = box.querySelector('[data-list]'), cnt = box.querySelector('[data-count]'), tot = box.querySelector('[data-total]');
    var fmt = function (v) { return v.toLocaleString('ru-RU', { maximumFractionDigits: 2 }) + ' ₽'; };
    var times = function (n) { var m = n % 100, k = n % 10; return n + (m > 10 && m < 20 ? ' раз' : k > 1 && k < 5 ? ' раза' : ' раз'); };
    var render = function () {
      var sum = Math.max(0, parseFloat(input.value) || 0);
      if (bonus.checked) sum = Math.round(sum * 1.07);
      var fit = list.filter(function (c) { return c[1] <= sum; });
      cnt.textContent = fit.length;
      tot.textContent = 'из ' + list.length + (bonus.checked ? ' · с бонусом на балансе ' + fmt(sum) : '');
      out.innerHTML = fit.length ? fit.slice(-8).reverse().map(function (c) {
        return '<li><img src="/assets/cases/' + c[2] + '.webp" alt="" width="44" height="44"><span>' + c[0] + '</span><b>' + fmt(c[1]) + '</b><small>' + times(Math.floor(sum / c[1])) + '</small></li>';
      }).join('') : '<li class="is-empty">Самый дешёвый кейс стоит 19 ₽ — увеличьте сумму.</li>';
    };
    input.addEventListener('input', render);
    bonus.addEventListener('change', render);
    box.querySelectorAll('[data-sum]').forEach(function (b) { b.addEventListener('click', function () { input.value = b.getAttribute('data-sum'); render(); }); });
    render();
  });
  // Поиск по вопросам справочного центра (сайт 10)
  document.querySelectorAll('[data-search]').forEach(function (box) {
    var input = box.querySelector('input'), list = box.querySelector('ul');
    var items = list.querySelectorAll('a[data-text]'), none = list.querySelector('.srch10__none');
    input.addEventListener('input', function () {
      var words = input.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
      list.hidden = !words.length;
      var shown = 0;
      items.forEach(function (a) {
        var ok = words.every(function (w) { return a.getAttribute('data-text').indexOf(w.slice(0, Math.max(3, w.length - 2))) > -1; });
        a.parentNode.hidden = !ok; if (ok) shown++;
      });
      none.hidden = shown > 0;
    });
  });
})();
