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
})();
