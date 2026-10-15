/*
 * COMPARANDIA — interactividad en el navegador.
 * Las páginas llegan ya renderizadas desde el generador estático; este
 * archivo solo añade el selector de productos, la búsqueda, el menú,
 * el modo oscuro y las comparativas personalizadas de 3–4 productos.
 */
(() => {
  'use strict';
  const { esc } = CT;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const SLOT = ['a', 'b', 'c', 'd'];
  const MAX = 4;
  const body = document.body;

  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toast.t);
    toast.t = setTimeout(() => t.classList.remove('show'), 2400);
  }

  /* ---------- Tema claro / oscuro ---------- */
  const isDark = () => {
    const t = document.documentElement.getAttribute('data-theme');
    return t ? t === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  };
  function paintThemeBtn() {
    const b = $('#theme-btn');
    b.innerHTML = CT.icon(isDark() ? 'sun' : 'moon');
    b.setAttribute('aria-label', isDark() ? 'Activar modo claro' : 'Activar modo oscuro');
  }
  $('#theme-btn').addEventListener('click', () => {
    const next = isDark() ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('ct-theme', next); } catch (e) { /* sin almacenamiento */ }
    paintThemeBtn();
  });
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', paintThemeBtn);
  paintThemeBtn();

  /* ---------- Menú de categorías ---------- */
  const menu = $('#menu'), menuBtn = $('#menu-btn');
  const setMenu = open => { menu.hidden = !open; menuBtn.setAttribute('aria-expanded', String(open)); };
  menuBtn.addEventListener('click', () => setMenu(menu.hidden));
  document.addEventListener('click', e => { if (!menu.hidden && !menu.contains(e.target) && !menuBtn.contains(e.target)) setMenu(false); });

  /* ---------- Selector de producto (combobox accesible) ---------- */
  function mountPicker(root, { data, cat, exclude, onPick }) {
    const input = $('.pk-input', root), pop = $('.pk-pop', root), tog = $('.pk-toggle', root);
    let items = [], active = -1;

    const optHTML = (p, idx) => {
      const taken = exclude().includes(p.id);
      return `<div class="pk-opt" role="option" id="${pop.id}-o${idx}" data-idx="${idx}" aria-disabled="${taken}" aria-selected="false">
        ${CT.R.img(p, cat, 'sm')}
        <span class="pk-txt"><b>${esc(p.name)}</b><small>${esc(p.brand)} · ${p.year}${taken ? ' · ya elegido' : ''}</small></span>
        <span class="pk-price">${p.price ? esc(CT.money(p.price)) : ''}</span></div>`;
    };

    function draw() {
      const q = input.value.trim();
      let html = '';
      items = [];
      if (!q) {
        data.brands.forEach(b => {
          html += `<div class="pk-group" role="presentation">${esc(b)}</div>`;
          data.products.filter(p => p.brand === b).forEach(p => { html += optHTML(p, items.length); items.push(p); });
        });
      } else {
        items = CT.searchProducts(data.products, q).map(r => r.p);
        if (items.length) html = items.map(optHTML).join('');
        else {
          const nq = CT.norm(q);
          const brand = data.brands.find(b => nq.split(' ')[0] === CT.norm(b));
          let alt = brand ? data.products.filter(p => p.brand === brand)
            : CT.suggest(data.products, q, 3).filter(r => r.sim > 0.3).map(r => r.p);
          if (!alt.length) alt = data.products.slice().sort((a, b) => b.year - a.year).slice(0, 3);
          items = alt;
          html = `<div class="pk-empty" role="presentation">${CT.icon('alert')}<div><b>No encontramos «${esc(q)}»</b>
            <p>No está entre los ${data.products.length} modelos verificados de ${esc(CT.catKw(cat))}. No mostramos datos que no podamos verificar.${brand ? ` Modelos de ${esc(brand)} disponibles:` : ' Quizá te interese:'}</p></div></div>` + items.map(optHTML).join('');
        }
      }
      pop.innerHTML = html;
      setActive(-1);
    }
    function setActive(i) {
      $$('.pk-opt', pop).forEach(o => { o.classList.remove('active'); o.setAttribute('aria-selected', 'false'); });
      active = i;
      const o = i > -1 && $(`[data-idx="${i}"]`, pop);
      if (o) { o.classList.add('active'); o.setAttribute('aria-selected', 'true'); input.setAttribute('aria-activedescendant', o.id); o.scrollIntoView({ block: 'nearest' }); }
      else input.removeAttribute('aria-activedescendant');
    }
    const open = () => { draw(); pop.hidden = false; input.setAttribute('aria-expanded', 'true'); root.classList.add('open'); };
    const close = () => { pop.hidden = true; input.setAttribute('aria-expanded', 'false'); root.classList.remove('open'); };
    root._close = close;
    function pick(i) {
      const p = items[i];
      if (!p) return;
      if (exclude().includes(p.id)) { toast('Ese producto ya está en la comparación'); return; }
      close();
      input.value = '';
      onPick(p);
    }
    input.addEventListener('focus', open);
    input.addEventListener('input', open);
    input.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown') { e.preventDefault(); if (pop.hidden) open(); setActive(Math.min(items.length - 1, active + 1)); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(Math.max(0, active - 1)); }
      else if (e.key === 'Enter') { e.preventDefault(); pick(active > -1 ? active : 0); }
      else if (e.key === 'Escape') { close(); input.blur(); }
      else if (e.key === 'Tab') close();
    });
    pop.addEventListener('mousedown', e => e.preventDefault());
    pop.addEventListener('click', e => { const o = e.target.closest('.pk-opt'); if (o) pick(+o.dataset.idx); });
    tog.addEventListener('click', () => { if (pop.hidden) input.focus(); else close(); });
    return { input, close };
  }
  document.addEventListener('pointerdown', e => {
    $$('.picker.open').forEach(pk => { if (!pk.contains(e.target)) pk._close(); });
  });

  /* ---------- Búsqueda global ---------- */
  function mountGlobalSearch(input, list, onDone) {
    let items = [], active = -1, loading = false, loaded = false;
    const ensure = () => {
      if (loaded || loading) return;
      loading = true;
      CT.loadAll().then(() => { loaded = true; if (input.value.trim()) draw(); });
    };
    const dataKeys = () => CT.allCats().map(c => c.data).filter((k, i, a) => k && a.indexOf(k) === i);
    const optProd = (p, cat) => `<div class="gs-opt" role="option" id="${list.id}-${items.length}" data-idx="${items.length}">${CT.R.img(p, cat, 'sm')}
      <span class="gs-txt"><b>${esc(p.name)}</b><small>${esc(p.brand)} · ${esc(cat.name)}</small></span><span class="gs-add">Comparar</span></div>`;

    function draw() {
      const q = input.value.trim();
      input.setAttribute('aria-expanded', String(!!q));
      if (!q) { list.hidden = true; list.innerHTML = ''; items = []; return; }
      const nq = CT.norm(q);
      const cats = CT.allCats().map(c => ({ c, s: Math.max(CT.scoreText(nq, CT.norm(c.name)), CT.scoreText(nq, CT.norm(CT.catKw(c)))) }))
        .filter(x => x.s >= 60).sort((a, b) => b.s - a.s).slice(0, 4);
      let prods = [];
      dataKeys().forEach(k => {
        const d = CT.getData(k);
        if (d) prods = prods.concat(CT.searchProducts(d.products, q).map(r => ({ p: r.p, s: r.score, cat: CT.primaryCat(k) })));
      });
      prods.sort((a, b) => b.s - a.s);
      items = [];
      let html = '';
      if (cats.length) {
        html += '<div class="gs-group">Categorías</div>';
        cats.forEach(({ c }) => {
          const d = c.data && CT.getData(c.data);
          html += `<div class="gs-opt" role="option" id="${list.id}-${items.length}" data-idx="${items.length}"><span class="gs-ic">${CT.icon(c.icon)}</span>
            <span class="gs-txt"><b>${esc(c.name)}</b><small>${esc(c.group.name)} · ${d ? d.products.length + ' modelos' : (c.data ? 'Disponible' : 'Próximamente')}</small></span>${CT.icon('arrow', 'gs-go')}</div>`;
          items.push({ type: 'cat', c });
        });
      }
      if (prods.length) {
        html += '<div class="gs-group">Productos</div>';
        prods.slice(0, 8).forEach(({ p, cat }) => { html += optProd(p, cat); items.push({ type: 'prod', p, cat }); });
      }
      if (!items.length) {
        let sug = [];
        dataKeys().forEach(k => {
          const d = CT.getData(k);
          if (d) sug = sug.concat(CT.suggest(d.products, q, 2).map(r => ({ p: r.p, sim: r.sim, cat: CT.primaryCat(k) })));
        });
        sug = sug.filter(x => x.sim > 0.3).sort((a, b) => b.sim - a.sim).slice(0, 3);
        html = `<div class="pk-empty">${CT.icon('alert')}<div><b>No encontramos «${esc(q)}»</b><p>${loaded ? 'Solo mostramos productos con datos verificados.' : 'Buscando…'}${sug.length ? ' ¿Buscabas alguno de estos?' : ''}</p></div></div>`;
        sug.forEach(({ p, cat }) => { html += optProd(p, cat); items.push({ type: 'prod', p, cat }); });
      }
      list.innerHTML = html;
      list.hidden = false;
      active = -1;
    }
    function setActive(i) {
      $$('.gs-opt', list).forEach(o => o.classList.remove('active'));
      active = i;
      const o = $(`[data-idx="${i}"]`, list);
      if (o) { o.classList.add('active'); o.scrollIntoView({ block: 'nearest' }); input.setAttribute('aria-activedescendant', o.id); }
    }
    function choose(i) {
      const it = items[i];
      if (!it) return;
      if (onDone) onDone();
      location.href = it.type === 'cat' ? CT.url.cat(it.c) : CT.url.cat(it.cat) + '?con=' + encodeURIComponent(it.p.id);
    }
    input.addEventListener('focus', () => { ensure(); draw(); });
    input.addEventListener('input', () => { ensure(); draw(); });
    input.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive(Math.min(items.length - 1, active + 1)); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(Math.max(0, active - 1)); }
      else if (e.key === 'Enter') { e.preventDefault(); choose(active > -1 ? active : 0); }
      else if (e.key === 'Escape') list.hidden = true;
    });
    input.addEventListener('blur', () => setTimeout(() => { list.hidden = true; }, 150));
    list.addEventListener('mousedown', e => e.preventDefault());
    list.addEventListener('click', e => { const o = e.target.closest('.gs-opt'); if (o) choose(+o.dataset.idx); });
  }

  const dlg = $('#search-dlg');
  mountGlobalSearch($('#dlg-input'), $('#dlg-results'), () => dlg.close());
  const openSearch = () => {
    if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
    $('#dlg-input').focus();
  };
  $('#search-btn').addEventListener('click', openSearch);
  $('#dlg-close').addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
  document.addEventListener('keydown', e => {
    const typing = /input|textarea|select/i.test(document.activeElement.tagName);
    if ((e.key === 'k' && (e.ctrlKey || e.metaKey)) || (e.key === '/' && !typing)) { e.preventDefault(); openSearch(); }
    if (e.key === 'Escape') setMenu(false);
  });

  const withData = async cat => CT.getData(cat.data) || CT.loadData(cat.data);

  /* ---------- Página de categoría: el comparador ---------- */
  async function mountTool() {
    const tool = $('#tool');
    const cat = CT.cats[tool.dataset.cat];
    const data = await withData(cat);
    const pre = (new URLSearchParams(location.search).get('con') || '').split(',').filter(id => data.byId[id]).slice(0, MAX);
    const sel = pre.length ? pre.concat(pre.length < 2 ? [null] : []) : [null, null];
    const slots = $('.slots', tool), go = $('#go'), add = $('#add-slot'), hint = $('.cta-hint', tool);

    function slotHTML(i) {
      const p = sel[i] && data.byId[sel[i]];
      return `<div class="slot s-${SLOT[i]}" data-slot="${i}">
        <div class="slot-top"><p class="slot-tag"><span class="dot"></span>Producto ${i + 1}</p>${sel.length > 2 ? `<button type="button" class="btn sm ghost" data-remove="${i}">Quitar</button>` : ''}</div>
        ${CT.R.picker(i, p ? 'Cambiar por otro modelo' : 'Busca o elige un modelo')}
        <div class="slot-body">${p ? `<div class="slot-info">${CT.R.img(p, cat, 'lg')}<div><p class="sub">${esc(p.brand)} · ${p.year}</p><h3>${esc(p.name)}</h3>
          <p class="price">${p.price ? esc(CT.money(p.price)) + ' <small>de lanzamiento</small>' : '<span class="na">Sin precio de referencia</span>'}</p></div></div>`
          : `<div class="slot-empty">${CT.R.img(null, cat, 'lg ghost')}<span>Elige un producto</span></div>`}</div></div>`;
    }
    function draw(focusSlot) {
      slots.className = 'slots n' + sel.length;
      slots.innerHTML = sel.map((_, i) => (i ? '<div class="vs" aria-hidden="true">vs</div>' : '') + slotHTML(i)).join('');
      $$('.picker', slots).forEach(root => {
        const i = +root.dataset.slot;
        mountPicker(root, {
          data, cat,
          exclude: () => sel.filter((id, j) => id && j !== i),
          onPick: p => { sel[i] = p.id; draw(); }
        });
      });
      $$('[data-remove]', slots).forEach(b => b.addEventListener('click', () => { sel.splice(+b.dataset.remove, 1); draw(); }));
      const ids = [...new Set(sel.filter(Boolean))];
      go.disabled = ids.length < 2;
      add.hidden = sel.length >= MAX;
      hint.textContent = ids.length < 2 ? 'Elige al menos dos productos distintos.' : `Listo para comparar ${ids.length} productos.`;
      if (focusSlot != null) $(`#pk-${focusSlot}`).focus();
    }
    go.addEventListener('click', () => {
      const ids = [...new Set(sel.filter(Boolean))];
      if (ids.length >= 2) location.href = CT.compareUrl(cat.id, ids);
    });
    add.addEventListener('click', () => { if (sel.length < MAX) { sel.push(null); draw(sel.length - 1); } });
    draw();
  }

  /* ---------- Página de comparación: cambiar, añadir o quitar productos ---------- */
  function mountCompare(cat, data) {
    const cards = $('.cards');
    if (!cards) return;
    const ids = cards.dataset.ids.split(',');
    const go = next => { location.href = CT.compareUrl(cat.id, next); };
    $$('.pc', cards).forEach(card => {
      const pk = $('.picker', card);
      if (!pk) return;
      const i = +card.dataset.slot;
      const box = $('.pc-picker', card);
      const ctl = mountPicker(pk, {
        data, cat,
        exclude: () => ids.filter((id, j) => j !== i),
        onPick: p => { const next = ids.slice(); next[i] = p.id; go(next); }
      });
      const btn = $('[data-change]', card);
      btn.addEventListener('click', () => {
        box.hidden = !box.hidden;
        if (!box.hidden) ctl.input.focus();
      });
    });
    $$('[data-drop]', cards).forEach(b => b.addEventListener('click', () => {
      const next = ids.slice(); next.splice(+b.dataset.drop, 1); go(next);
    }));
    const od = $('#only-diff');
    if (od) od.addEventListener('change', () => $('#especificaciones').classList.toggle('only-diff', od.checked));
  }

  /* ---------- Comparativa personalizada (noindex) ---------- */
  async function mountDynamic() {
    const box = $('#dyn');
    const q = new URLSearchParams(location.search);
    const cat = CT.cats[q.get('c')];
    const fail = msg => { box.innerHTML = `<header class="page-head"><h1>No podemos mostrar esta comparativa</h1><p class="lead">${msg}</p></header><p><a class="btn primary" href="${cat && cat.data ? CT.url.cat(cat) : CT.url.categories()}">Elegir productos</a></p>`; };
    if (!cat || !cat.data) return fail('La categoría no existe o todavía no tiene productos verificados.');
    let data;
    try { data = await withData(cat); } catch (e) { return fail('No se pudieron cargar los datos. Revisa tu conexión.'); }
    const asked = (q.get('p') || '').split(',').filter(Boolean);
    const unknown = asked.filter(id => !data.byId[id]);
    const ids = [...new Set(asked.filter(id => data.byId[id]))].slice(0, MAX);
    if (ids.length === 2 && CT.isIndexed(ids[0], ids[1])) { location.replace(CT.url.pair(ids[0], ids[1])); return; }
    if (ids.length < 2) return fail((unknown.length ? `No tenemos datos verificados de: ${esc(unknown.join(', '))}. ` : '') + 'Hacen falta al menos dos productos válidos.');
    const out = CT.R.compare(cat, data, ids.map(id => data.byId[id]), {});
    box.outerHTML = out.html;
    if (unknown.length) $('.page-head').insertAdjacentHTML('beforebegin', `<p class="callout" role="note">No tenemos datos verificados de <b>${esc(unknown.join(', '))}</b>, así que no aparece en la comparación.</p>`);
    document.title = out.title + ' | Comparandia';
    $('meta[name="description"]').setAttribute('content', out.desc);
    mountCompare(cat, data);
  }

  /* ---------- Ficha de producto: comparar con otro ---------- */
  async function mountProduct() {
    const head = $('.product-head');
    const cat = CT.cats[body.dataset.cat];
    const data = await withData(cat);
    const p = data.byId[head.dataset.id];
    const box = $('#compare-picker');
    const ctl = mountPicker($('.picker', box), {
      data, cat, exclude: () => [p.id],
      onPick: o => { location.href = CT.compareUrl(cat.id, [p.id, o.id]); }
    });
    $('#compare-with').addEventListener('click', () => { box.hidden = !box.hidden; if (!box.hidden) ctl.input.focus(); });
  }

  /* ---------- Arranque según el tipo de página ---------- */
  const type = body.dataset.page;
  if (type === 'home') mountGlobalSearch($('#home-search'), $('#home-results'));
  if (type === 'category') mountTool();
  if (type === 'compare') { const cat = CT.cats[body.dataset.cat]; withData(cat).then(d => mountCompare(cat, d)); }
  if (type === 'dynamic') mountDynamic();
  if (type === 'product') mountProduct();
})();
