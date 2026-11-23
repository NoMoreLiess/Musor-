(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Мобильное меню
  var burger = document.querySelector('.burger');
  var mnav = document.getElementById('mnav');
  if (burger && mnav) {
    var setOpen = function (open) {
      mnav.hidden = !open;
      burger.setAttribute('aria-expanded', open);
      burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
      document.body.style.overflow = open ? 'hidden' : '';
    };
    burger.addEventListener('click', function () { setOpen(mnav.hidden); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !mnav.hidden) setOpen(false); });
    window.addEventListener('resize', function () { if (window.innerWidth >= 1000 && !mnav.hidden) setOpen(false); });
  }

  // Меняющееся слово в главном заголовке
  document.querySelectorAll('.rot').forEach(function (box) {
    var words = box.querySelectorAll('.rot__w');
    if (words.length < 2 || reduce) return;
    var i = 0;
    setInterval(function () {
      var cur = words[i];
      i = (i + 1) % words.length;
      var next = words[i];
      cur.classList.remove('is-on'); cur.classList.add('is-out');
      next.classList.remove('is-out'); next.classList.add('is-on');
      setTimeout(function () { cur.classList.remove('is-out'); }, 750);
    }, 2400);
  });

  // Появление: заливка карточек режимов, заполнение финального заголовка, плавное появление блоков
  var targets = document.querySelectorAll('.mode, [data-fill], .feat, .rung, .qa, .stat, .pros__c, .slot, .bv__p');
  document.querySelectorAll('.feat, .rung, .stat, .pros__c').forEach(function (el) { el.classList.add('rv'); });
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.35 });
    targets.forEach(function (el) { io.observe(el); });
  } else {
    targets.forEach(function (el) { el.classList.add('is-in'); });
  }

  // Таймлайн шагов: линия прогресса и активные номера
  var tls = document.querySelectorAll('[data-tl]');
  var dock = document.querySelector('.dock');
  var fin = document.querySelector('.fin');
  var ticking = false;
  function onScroll() {
    ticking = false;
    var vh = window.innerHeight;
    tls.forEach(function (tl) {
      var items = tl.querySelectorAll('.tl__i');
      var bar = tl.querySelector('.tl__bar i');
      var line = tl.querySelector('.tl__bar').getBoundingClientRect();
      var mark = vh * 0.62;
      var prog = Math.max(0, Math.min(1, (mark - line.top) / line.height));
      bar.style.setProperty('--prog', (prog * 100).toFixed(1) + '%');
      items.forEach(function (it) {
        var dot = it.querySelector('.tl__dot').getBoundingClientRect();
        it.classList.toggle('is-on', dot.top + dot.height / 2 < mark);
      });
    });
    // Прячем нижнюю кнопку, когда на экране финальный блок с такой же кнопкой
    if (dock && fin) {
      var r = fin.getBoundingClientRect();
      dock.classList.toggle('is-hidden', r.top < vh * 0.7 && r.bottom > vh * 0.3);
    }
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  // FAQ: вкладки по категориям
  document.querySelectorAll('[data-faq]').forEach(function (box) {
    var tabs = box.querySelectorAll('[data-tab]');
    var bar = box.querySelector('.tabs');
    var panes = box.querySelectorAll('[data-pane]');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var k = tab.getAttribute('data-tab');
        tabs.forEach(function (t) { var on = t === tab; t.classList.toggle('is-on', on); t.setAttribute('aria-selected', on); });
        if (bar) bar.classList.toggle('is-all', k === 'all');
        panes.forEach(function (p) { p.hidden = !(k === 'all' || p.getAttribute('data-pane') === k); });
      });
    });
    // По ссылке вида #вопрос открываем нужную вкладку не нужно — держим одно открытое окно в группе
    box.querySelectorAll('details').forEach(function (d) {
      d.addEventListener('toggle', function () {
        if (!d.open) return;
        d.parentNode.querySelectorAll('details').forEach(function (o) { if (o !== d) o.open = false; });
      });
    });
  });

  // Копирование промокода
  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var code = btn.getAttribute('data-copy');
      var lbl = btn.querySelector('span');
      var done = function () {
        btn.classList.add('is-copied');
        if (lbl) lbl.textContent = 'Скопировано';
        setTimeout(function () { btn.classList.remove('is-copied'); if (lbl) lbl.textContent = 'Скопировать'; }, 1800);
      };
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(code).then(done, fallback);
      else fallback();
      function fallback() {
        var ta = document.createElement('textarea');
        ta.value = code; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); } catch (e) {}
        ta.remove(); done();
      }
    });
  });
})();
