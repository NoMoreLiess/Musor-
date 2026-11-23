(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

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
    window.addEventListener('resize', function () { if (window.innerWidth > 1100 && !mnav.hidden) setOpen(false); });
    $$('a', mnav).forEach(function (a) { a.addEventListener('click', function () { setOpen(false); }); });
  }

  // Меняющееся слово в заголовке
  $$('.rot').forEach(function (box) {
    var words = box.querySelectorAll('.rot__w');
    if (words.length < 2 || reduce) return;
    var i = 0;
    setInterval(function () {
      var cur = words[i]; i = (i + 1) % words.length; var next = words[i];
      cur.classList.remove('is-on'); cur.classList.add('is-out');
      next.classList.remove('is-out'); next.classList.add('is-on');
      setTimeout(function () { cur.classList.remove('is-out'); }, 750);
    }, 2400);
  });

  // Появление при прокрутке
  $$('.advc, .feat, .case, .item, .stat, .pros__c, .gd').forEach(function (el) { el.classList.add('rv'); });
  var targets = $$('.mode, [data-fill], .rv');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { threshold: 0.2 });
    targets.forEach(function (el) { io.observe(el); });
  } else targets.forEach(function (el) { el.classList.add('is-in'); });

  // Таймлайн и нижняя кнопка
  var tls = $$('[data-tl]'), dock = document.querySelector('.dock'), fin = document.querySelector('.fin'), ticking = false;
  function onScroll() {
    ticking = false;
    var vh = window.innerHeight, mark = vh * 0.62;
    tls.forEach(function (tl) {
      var line = tl.querySelector('.tl__bar').getBoundingClientRect();
      var prog = Math.max(0, Math.min(1, (mark - line.top) / line.height));
      tl.querySelector('.tl__bar i').style.setProperty('--prog', (prog * 100).toFixed(1) + '%');
      $$('.tl__i', tl).forEach(function (it) {
        var d = it.querySelector('.tl__dot').getBoundingClientRect();
        it.classList.toggle('is-on', d.top + d.height / 2 < mark);
      });
    });
    if (dock && fin) { var r = fin.getBoundingClientRect(); dock.classList.toggle('is-hidden', r.top < vh * 0.75 && r.bottom > vh * 0.25); }
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  // Фильтр скинов по типу
  $$('.flt').forEach(function (bar) {
    var grid = bar.parentNode.querySelector('[data-items]');
    if (!grid) return;
    $$('[data-f]', bar).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var f = btn.getAttribute('data-f');
        $$('[data-f]', bar).forEach(function (b) { var on = b === btn; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', on); });
        $$('.item', grid).forEach(function (it) { it.hidden = !(f === 'all' || it.getAttribute('data-t') === f); if (!it.hidden) it.classList.add('is-in'); });
      });
    });
  });

  // FAQ: вкладки и одно открытое окно в группе
  $$('[data-faq]').forEach(function (box) {
    var tabs = $$('[data-tab]', box), bar = box.querySelector('.tabs'), panes = $$('[data-pane]', box);
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var k = tab.getAttribute('data-tab');
        tabs.forEach(function (t) { var on = t === tab; t.classList.toggle('is-on', on); t.setAttribute('aria-selected', on); });
        if (bar) bar.classList.toggle('is-all', k === 'all');
        panes.forEach(function (p) { p.hidden = !(k === 'all' || p.getAttribute('data-pane') === k); });
      });
    });
    $$('details', box).forEach(function (d) {
      d.addEventListener('toggle', function () {
        if (d.open) $$('details', d.parentNode).forEach(function (o) { if (o !== d) o.open = false; });
      });
    });
  });

  // Копирование промокода
  $$('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var code = btn.getAttribute('data-copy'), lbl = btn.querySelector('span');
      var done = function () {
        btn.classList.add('is-copied'); if (lbl) lbl.textContent = 'Скопировано';
        setTimeout(function () { btn.classList.remove('is-copied'); if (lbl) lbl.textContent = 'Скопировать'; }, 1800);
      };
      var fallback = function () {
        var ta = document.createElement('textarea');
        ta.value = code; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); } catch (e) {}
        ta.remove(); done();
      };
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(code).then(done, fallback); else fallback();
    });
  });

  // Форма обратной связи: проверка полей, ловушка для ботов, отправка без перезагрузки
  $$('[data-form]').forEach(function (form) {
    var started = Date.now();
    var ts = form.querySelector('[name=ts]'); if (ts) ts.value = String(started);
    var st = form.querySelector('.frm__st'), btn = form.querySelector('[type=submit]');
    var say = function (t, cls) { st.textContent = t; st.className = 'frm__st ' + (cls || ''); };
    var check = function (el) {
      var box = el.closest('.fld, .chk'); if (!box) return true;
      var ok = el.type === 'checkbox' ? el.checked : el.checkValidity() && el.value.trim().length >= (el.minLength > 0 ? el.minLength : 1);
      box.classList.toggle('is-err', !ok); return ok;
    };
    $$('input, select, textarea', form).forEach(function (el) {
      if (el.name === 'website' || el.type === 'hidden') return;
      el.addEventListener('blur', function () { if (el.value || el.type === 'checkbox') check(el); });
      el.addEventListener('input', function () { if (el.closest('.is-err')) check(el); });
      el.addEventListener('change', function () { check(el); });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var fields = $$('[required]', form), ok = true, first = null;
      fields.forEach(function (el) { if (!check(el)) { ok = false; first = first || el; } });
      if (!ok) { say('Проверьте отмеченные поля.', 'err'); first.focus(); return; }
      if (form.website.value) { say('Сообщение отправлено.', 'ok'); form.reset(); return; } // бот — молча отбрасываем
      if (Date.now() - started < 3000) { say('Слишком быстро — проверьте сообщение и отправьте ещё раз.', 'err'); return; }
      btn.disabled = true; say('Отправляем…');
      fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (r) { return r.json().catch(function () { return { ok: false }; }).then(function (j) { return { status: r.status, j: j }; }); })
        .then(function (res) {
          if (res.status === 200 && res.j.ok) { say('Спасибо! Сообщение отправлено — ответим на указанный email.', 'ok'); form.reset(); started = Date.now(); if (ts) ts.value = String(started); }
          else if (res.status === 429) say('Слишком много сообщений подряд. Попробуйте через несколько минут.', 'err');
          else say(res.j.error || 'Не удалось отправить. Попробуйте позже или напишите в поддержку сервиса.', 'err');
        })
        .catch(function () { say('Нет связи с сервером. Проверьте интернет и попробуйте ещё раз.', 'err'); })
        .then(function () { btn.disabled = false; });
    });
  });
})();
