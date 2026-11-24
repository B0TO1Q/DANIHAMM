(function () {
  'use strict';
  var SITE = window.SITE;
  var CART_KEY = 'dh-cart';

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // ---------- cart (saved in this browser) ----------
  function readCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch (e) { return []; }
  }
  function writeCart(items) {
    try { localStorage.setItem(CART_KEY, JSON.stringify(items)); } catch (e) { /* storage unavailable */ }
    paintCartCount();
  }
  function paintCartCount() {
    var n = readCart().reduce(function (sum, it) { return sum + it.qty; }, 0);
    document.querySelectorAll('[data-cart-count]').forEach(function (el) { el.textContent = n; });
    document.querySelectorAll('[data-cart-link]').forEach(function (el) {
      el.setAttribute('aria-label', 'Cart, ' + n + (n === 1 ? ' item' : ' items'));
    });
  }

  // ---------- mobile menu ----------
  function initMenu() {
    var btn = document.querySelector('.nav-toggle');
    var menu = document.getElementById('mobile-menu');
    if (!btn || !menu) return;
    btn.addEventListener('click', function () {
      var open = menu.hasAttribute('hidden');
      if (open) menu.removeAttribute('hidden'); else menu.setAttribute('hidden', '');
      btn.setAttribute('aria-expanded', String(open));
    });
  }

  function photoInner(src, alt) {
    return src ? '<img src="' + esc(src) + '" alt="' + esc(alt) + '" loading="lazy">' : '';
  }

  // ---------- home: portfolio grid ----------
  function initPortfolio() {
    var grid = document.getElementById('port-grid');
    var filters = document.getElementById('port-filters');
    if (!grid || !filters) return;
    var current = 'All';

    function paint() {
      filters.innerHTML = SITE.categories.map(function (c) {
        var on = c === current;
        return '<button type="button" class="filter' + (on ? ' is-on' : '') + '" aria-pressed="' + on + '" data-cat="' + esc(c) + '">' + esc(c) + '</button>';
      }).join('');
      grid.innerHTML = SITE.photos.filter(function (p) {
        return current === 'All' || p.category === current;
      }).map(function (p) {
        return '<figure class="tile ph lit" style="margin:0;aspect-ratio:4/5;background:' + esc(p.tint) + '">' +
          photoInner(p.src, p.title) +
          '<figcaption class="label ph-label">' + esc(p.title) + '</figcaption></figure>';
      }).join('');
    }
    filters.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-cat]');
      if (!b) return;
      current = b.getAttribute('data-cat');
      paint();
    });
    paint();
  }

  // ---------- shop grid ----------
  function initShop() {
    var grid = document.getElementById('shop-grid');
    if (!grid) return;
    grid.innerHTML = SITE.products.map(function (p) {
      return '<a class="card" href="product.html?item=' + encodeURIComponent(p.id) + '">' +
        '<div class="ph focus-in lit" style="aspect-ratio:1/1;background:' + esc(p.tint) + '">' + photoInner(p.image, p.name) +
        (p.image ? '' : '<span class="label ph-label">Product photo</span>') + '</div>' +
        '<h2 class="card-name">' + esc(p.name) + '</h2>' +
        '<p class="card-price">' + esc(p.price) + '</p>' +
        '<p class="card-blurb">' + esc(p.blurb) + '</p>' +
        '<span class="card-cta">Choose options</span></a>';
    }).join('');
  }

  // ---------- product page ----------
  function initProduct() {
    var root = document.getElementById('pdp');
    if (!root) return;
    var id = new URLSearchParams(location.search).get('item');
    var p = SITE.products.filter(function (x) { return x.id === id; })[0] || SITE.products[0];
    var st = { print: 0, size: 0, color: 0, qty: 1, added: false };
    document.title = p.name + ' — Dani Hamm';
    document.getElementById('crumb-name').textContent = p.name;
    document.getElementById('pdp-name').textContent = p.name;
    document.getElementById('pdp-price').textContent = p.price;
    document.getElementById('pdp-detail').textContent = p.detail;

    var stage = document.getElementById('pdp-stage');
    var art = document.getElementById('pdp-art');
    var stageLabel = document.getElementById('pdp-stage-label');

    function opt(name, list, sel, render) {
      return list.map(function (item, i) { return render(item, i, i === sel); }).join('');
    }

    function paint() {
      var pr = SITE.photos[st.print];
      var col = p.colors.length ? p.colors[st.color] : null;
      var light = col && (col.name === 'White' || col.name === 'Bone');

      stage.style.background = p.mockup && col ? col.hex : '#16262A';
      art.style.width = p.mockup ? '38%' : '78%';
      art.style.boxShadow = p.mockup ? 'none' : '';
      art.style.background = pr.tint;
      art.innerHTML = photoInner(pr.src, pr.title);
      stageLabel.style.color = light ? 'rgba(11,20,22,0.7)' : 'rgba(230,238,239,0.75)';
      stageLabel.textContent = p.name + ' · ' + pr.title + (col ? ' · ' + col.name : '');

      document.getElementById('print-name').textContent = pr.title;
      document.getElementById('size-name').textContent = p.sizes[st.size];

      document.getElementById('print-opts').innerHTML = opt('print', SITE.photos, st.print, function (t, i, on) {
        return '<button type="button" class="thumb ph lit-sm' + (on ? ' is-on' : '') + '" aria-pressed="' + on + '" aria-label="' + esc(t.title) + '" data-print="' + i + '" style="background:' + esc(t.tint) + '">' + photoInner(t.src, '') + '</button>';
      });
      document.getElementById('size-opts').innerHTML = opt('size', p.sizes, st.size, function (z, i, on) {
        return '<button type="button" class="chip' + (on ? ' is-on' : '') + '" aria-pressed="' + on + '" data-size="' + i + '">' + esc(z) + '</button>';
      });
      var colorBox = document.getElementById('color-field');
      if (col) {
        colorBox.hidden = false;
        document.getElementById('color-name').textContent = col.name;
        document.getElementById('color-opts').innerHTML = opt('color', p.colors, st.color, function (c, i, on) {
          return '<button type="button" class="swatch' + (on ? ' is-on' : '') + '" aria-pressed="' + on + '" aria-label="' + esc(c.name) + '" data-color="' + i + '"><span style="background:' + esc(c.hex) + '"></span></button>';
        });
      } else {
        colorBox.hidden = true;
      }
      document.getElementById('qty').textContent = st.qty;
      document.getElementById('add-btn').textContent = st.added ? 'Added to cart' : 'Add to cart';
    }

    root.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      if (b.hasAttribute('data-print')) { st.print = +b.getAttribute('data-print'); st.added = false; }
      else if (b.hasAttribute('data-size')) { st.size = +b.getAttribute('data-size'); st.added = false; }
      else if (b.hasAttribute('data-color')) { st.color = +b.getAttribute('data-color'); st.added = false; }
      else if (b.id === 'qty-inc') { st.qty = Math.min(st.qty + 1, 20); }
      else if (b.id === 'qty-dec') { st.qty = Math.max(st.qty - 1, 1); }
      else if (b.id === 'add-btn') {
        var cart = readCart();
        cart.push({
          id: p.id, print: SITE.photos[st.print].title, size: p.sizes[st.size],
          color: p.colors.length ? p.colors[st.color].name : null, qty: st.qty
        });
        writeCart(cart);
        st.added = true;
      } else { return; }
      paint();
    });
    paint();
    // fade between choices only after the first paint
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { stage.classList.add('is-ready'); art.classList.add('is-ready'); });
    });
  }

  // ---------- smooth wheel scrolling (mouse & trackpad only) ----------
  // Glides to each stop and travels a little less per notch, so the page
  // feels slower and more fluid. Touch scrolling stays native.
  function initSmoothScroll() {
    var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || calm) return;
    var SPEED = 0.8;   // distance per wheel notch (1 = normal)
    var EASE = 0.1;    // glide amount per frame (lower = smoother, slower)
    var target = window.scrollY, current = window.scrollY, running = false;
    function maxY() { return document.documentElement.scrollHeight - window.innerHeight; }
    function scrollsItself(el, dy) {
      for (; el && el !== document.body; el = el.parentElement) {
        var st = getComputedStyle(el), oy = st.overflowY;
        if ((oy === 'auto' || oy === 'scroll') && el.scrollHeight > el.clientHeight) {
          if ((dy < 0 && el.scrollTop > 0) || (dy > 0 && el.scrollTop + el.clientHeight < el.scrollHeight)) return true;
        }
      }
      return false;
    }
    function step() {
      current += (target - current) * EASE;
      if (Math.abs(target - current) < 0.5) { current = target; running = false; }
      window.scrollTo({ top: current, behavior: 'instant' });
      if (running) requestAnimationFrame(step);
    }
    window.addEventListener('wheel', function (e) {
      if (e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY) || scrollsItself(e.target, e.deltaY)) return;
      e.preventDefault();
      if (!running) { current = window.scrollY; target = current; }
      var dy = e.deltaMode === 1 ? e.deltaY * 40 : e.deltaMode === 2 ? e.deltaY * window.innerHeight : e.deltaY;
      target = Math.max(0, Math.min(maxY(), target + dy * SPEED));
      if (!running) { running = true; requestAnimationFrame(step); }
    }, { passive: false });
    // keyboard, scrollbar, anchor jumps: follow wherever the page actually is
    window.addEventListener('scroll', function () {
      // if something else moved the page (keys, scrollbar, links), stop gliding and follow it
      if (!running || Math.abs(window.scrollY - current) > 3) { running = false; current = target = window.scrollY; }
    }, { passive: true });
    window.addEventListener('resize', function () { target = Math.min(target, maxY()); });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initSmoothScroll();
    initMenu();
    initPortfolio();
    initShop();
    initProduct();
    paintCartCount();
  });
})();
