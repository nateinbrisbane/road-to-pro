/* Road to Pro — small progressive enhancements. The site works without JS. */
(function () {
  // Base path the site is served under (data/site.json base_url, written into <html data-base>). Any URL built here must start with it.
  var BASE = document.documentElement.dataset.base || '/';
  window.RTP = { base: BASE };
  // Theme preview: ?theme=light|dark and ?accent=<name> (classes come from theme.css, generated from theme.json).
  var q = new URLSearchParams(location.search);
  var t = q.get('theme'), a = q.get('accent');
  if (t && /^[a-z-]+$/.test(t)) document.body.classList.add('theme-' + t);
  if (a && /^[a-z-]+$/.test(a)) { if (!t) document.body.classList.add('theme-' + (document.documentElement.dataset.theme || 'dark')); document.body.classList.add('accent-' + a); }

  // Countdowns stay correct between weekly builds.
  document.querySelectorAll('[data-countdown]').forEach(function (el) {
    var p = el.dataset.countdown.split('-').map(Number);
    var target = new Date(p[0], p[1] - 1, p[2]), now = new Date();
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var days = Math.round((target - today) / 864e5);
    if (days >= 0) el.textContent = days;
  });

  // Journal filters.
  var chips = document.querySelectorAll('.fchip');
  chips.forEach(function (b) {
    b.addEventListener('click', function () {
      chips.forEach(function (x) { x.classList.toggle('on', x === b); });
      document.querySelectorAll('[data-week]').forEach(function (el) {
        el.style.display = (b.dataset.f === 'all' || el.dataset.pb === '1') ? '' : 'none';
      });
    });
  });
})();

/* Home 'The road': keep the 'You are here' label on the dot, inside the bar, and clear of race labels. */
(function () {
  function place() {
    document.querySelectorAll('.prog-bar').forEach(function (bar) {
      var lb = bar.querySelector('.lb.now'), mk = bar.querySelector('.mk.now');
      if (!lb || !mk) return;
      var W = bar.clientWidth, x = parseFloat(mk.style.left) / 100 * W;
      lb.classList.remove('l', 'c', 'r', 'below'); bar.classList.remove('now-below');
      lb.style.transform = 'none';
      var w = lb.offsetWidth, left = Math.min(Math.max(x - w / 2, 0), Math.max(W - w, 0));
      lb.style.left = left + 'px';
      var r = lb.getBoundingClientRect(), hit = false;
      bar.querySelectorAll('.lb:not(.now)').forEach(function (o) {
        if (getComputedStyle(o).display === 'none') return;
        var q = o.getBoundingClientRect();
        if (r.right + 10 > q.left && r.left - 10 < q.right) hit = true;
      });
      if (hit) { lb.classList.add('below'); bar.classList.add('now-below'); }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', place); else place();
  window.addEventListener('resize', place);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(place);
})();
