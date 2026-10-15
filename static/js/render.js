/*
 * Renderizado compartido de COMPARANDIA.
 * Lo usan el generador estático (tools/generator.js, para que Google lea
 * HTML completo) y el navegador (comparaciones dinámicas de 3–4 productos).
 * Solo construye texto HTML: no toca el DOM.
 */
window.CT = window.CT || {};

(function () {
  var esc = CT.esc;
  var SLOT = ['a', 'b', 'c', 'd'];
  var lc = function (s) { return s.charAt(0).toLowerCase() + s.slice(1); };
  var cap = function (s) { return s.charAt(0).toUpperCase() + s.slice(1); };
  var site = function () { return CT.site; };
  CT.lc = lc;

  /* ---------- URLs canónicas ---------- */
  CT.catSlug = function (c) { return c.slug || ('comparador-de-' + c.id); };
  CT.pairSlug = function (a, b) { return [a, b].sort().join('-vs-'); };
  CT.url = {
    home: function () { return site().base; },
    categories: function () { return site().base + 'categorias/'; },
    method: function () { return site().base + 'metodologia/'; },
    cat: function (c) { return site().base + CT.catSlug(c) + '/'; },
    product: function (p) { return site().base + 'producto/' + p.id + '/'; },
    pair: function (a, b) { return site().base + 'comparar/' + CT.pairSlug(a, b) + '/'; },
    dynamic: function (catId, ids) { return site().base + 'comparar/?c=' + catId + '&p=' + ids.join(','); },
    abs: function (path) { return site().url + path; }
  };
  CT.isIndexed = function (a, b) {
    if (!CT._idx) CT._idx = new Set(CT.indexed || []);
    return CT._idx.has(CT.pairSlug(a, b));
  };
  CT.compareUrl = function (catId, ids) {
    return ids.length === 2 && CT.isIndexed(ids[0], ids[1]) ? CT.url.pair(ids[0], ids[1]) : CT.url.dynamic(catId, ids);
  };
  CT.primaryCat = function (key) { return CT.allCats().filter(function (c) { return c.data === key; })[0]; };
  CT.catKw = function (c) { var s = CT.catSeo[c.id]; return s && s.kw ? s.kw : lc(c.name); };

  /* ---------- Reglas de calidad (qué merece página indexable) ---------- */
  function measurable(data) {
    var out = [];
    data.schema.forEach(function (s) { s.fields.forEach(function (f) { if (f.k.charAt(0) !== '_') out.push(f); }); });
    return out;
  }
  CT.quality = {
    completeness: function (data, p) {
      var fs = measurable(data);
      var known = fs.filter(function (f) { return p.s[f.k] != null; }).length;
      return fs.length ? known / fs.length : 0;
    },
    product: function (data, p) {
      var c = CT.quality.completeness(data, p);
      return { ok: c >= CT.seoRules.minProductCompleteness, completeness: c };
    },
    pair: function (data, a, b) {
      var r = CT.seoRules;
      var R = CT.compare(data, [a, b]);
      var differing = 0;
      R.sections.forEach(function (s) { s.rows.forEach(function (row) { if (row.differs && row.f.k.charAt(0) !== '_') differing++; }); });
      var ca = CT.quality.completeness(data, a), cb = CT.quality.completeness(data, b);
      var relevant;
      if (a.price && b.price && a.price[1] === b.price[1]) {
        relevant = Math.max(a.price[0], b.price[0]) / Math.min(a.price[0], b.price[0]) <= r.maxPriceRatio;
      } else {
        relevant = Math.abs(a.year - b.year) <= r.maxYearGap;
      }
      var ok = R.comparable >= r.minDecided && differing >= r.minDiffering &&
        ca >= r.minCompleteness && cb >= r.minCompleteness && relevant;
      return { ok: ok, decided: R.comparable, differing: differing, ca: ca, cb: cb, relevant: relevant, R: R };
    }
  };

  /* ---------- Utilidades de texto ---------- */
  function list(arr) {
    if (arr.length <= 1) return arr.join('');
    return arr.slice(0, -1).join(', ') + ' y ' + arr[arr.length - 1];
  }
  CT.list = list;
  CT.dateLong = function (iso) {
    var d = new Date(iso + 'T12:00:00Z');
    return new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(d);
  };
  function pct(a, b) { return b ? Math.round(Math.abs(a - b) / Math.abs(b) * 100) : null; }
  function numOf(f, v) { return v == null ? null : (f.type === 'price' ? v[0] : (f.type === 'num' ? v : null)); }

  /* Frase objetiva que describe una fila de la comparación. */
  CT.rowSentence = function (row, prods) {
    var f = row.f;
    if (f.k.charAt(0) === '_' && f.type !== 'price') return '';
    var names = prods.map(function (p) { return p.name; });
    var vals = row.vals.map(function (v) { return CT.fmt(f, v); });
    var known = [], missing = [];
    vals.forEach(function (v, i) { (v == null ? missing : known).push(i); });
    if (!known.length) return '';
    var L = cap(f.label), s;
    var nm = function (ix) { return ix.map(function (i) { return names[i]; }); };

    if (f.type === 'price') {
      if (row.mixedCurrency) {
        s = 'Precio de lanzamiento: ' + known.map(function (i) { return names[i] + ' salió por ' + vals[i]; }).join('; ') + '. Al estar en monedas distintas, no los comparamos.';
      } else if (row.win.length === 1 && known.length > 1) {
        var w = row.win[0], o = known.filter(function (i) { return i !== w; });
        s = names[w] + ' tuvo el precio de lanzamiento más bajo, ' + vals[w] + ', frente a ' +
          list(o.map(function (i) { return vals[i] + ' de ' + names[i]; })) + '.';
      } else if (known.length > 1 && !row.differs) {
        s = 'Los dos salieron a la venta por el mismo precio: ' + vals[known[0]] + '.';
      } else {
        s = 'Precio de lanzamiento: ' + known.map(function (i) { return names[i] + ', ' + vals[i]; }).join('; ') + '.';
      }
    } else if (f.type === 'bool') {
      var yes = known.filter(function (i) { return row.vals[i]; }), no = known.filter(function (i) { return !row.vals[i]; });
      var what = lc(f.label);
      if (!no.length) s = (yes.length > 1 ? (yes.length === 2 ? 'Los dos incluyen ' : 'Todos incluyen ') : names[yes[0]] + ' incluye ') + what + '.';
      else if (!yes.length) s = (no.length > 1 ? 'Ninguno incluye ' : names[no[0]] + ' no incluye ') + what + '.';
      else s = list(nm(yes)) + (yes.length > 1 ? ' incluyen ' : ' incluye ') + what + '; ' + list(nm(no)) + ', no.';
    } else if (!row.differs) {
      s = known.length > 1 ? L + ': ' + (known.length === 2 ? 'los dos' : 'todos') + ' coinciden (' + vals[known[0]] + ').'
        : L + ' de ' + names[known[0]] + ': ' + vals[known[0]] + '.';
    } else if (row.win.length === 1) {
      var w2 = row.win[0], others = known.filter(function (i) { return i !== w2; });
      s = L + ': ' + names[w2] + ' se impone con ' + vals[w2] + ', frente a ' +
        list(others.map(function (i) {
          return row.vals[i] === 0 && f.zero ? names[i] + ' (' + lc(f.zero) + ')' : vals[i] + ' de ' + names[i];
        }));
      if (f.type === 'num' && others.length === 1) {
        var p = pct(row.vals[w2], row.vals[others[0]]);
        if (p) s += ' (un ' + p + ' % ' + (f.better === 'low' ? 'menos' : 'más') + ')';
      }
      s += '.';
    } else if (row.win.length > 1) {
      var rest = known.filter(function (i) { return row.win.indexOf(i) < 0; });
      s = L + ': ' + list(nm(row.win)) + ' empatan con ' + vals[row.win[0]] +
        (rest.length ? ', por delante de ' + list(rest.map(function (i) { return names[i] + ' (' + vals[i] + ')'; })) : '') + '.';
    } else {
      s = L + ': ' + known.map(function (i) { return names[i] + ', ' + vals[i]; }).join('; ') + '.';
    }
    if (missing.length && f.type !== 'price') {
      s += ' ' + list(nm(missing)) + (missing.length > 1 ? ' no tienen' : ' no tiene') + ' dato verificado.';
    }
    return s;
  };

  function relOf(row) {
    var f = row.f, w = row.win[0];
    var nums = row.vals.map(function (v) { return numOf(f, v); });
    if (nums[w] == null) return 0.4;
    var others = nums.filter(function (v, i) { return i !== w && v != null; });
    if (!others.length) return 0;
    var next = f.better === 'low' ? Math.min.apply(null, others) : Math.max.apply(null, others);
    return next ? Math.abs(nums[w] - next) / Math.abs(next) : 1;
  }

  CT.verdictText = function (R, prods) {
    if (!R.comparable) return 'No hay suficientes datos comparables para señalar un ganador.';
    if (R.leaders.length === 1) {
      var L = R.leaders[0];
      var others = prods.map(function (p, i) { return i; }).filter(function (i) { return i !== L; });
      return prods[L].name + ' se impone en ' + R.wins[L] + ' de ' + R.comparable + ' apartados comparables; ' +
        list(others.map(function (i) { return prods[i].name + ' gana en ' + R.wins[i]; })) + '.';
    }
    return 'Empate técnico: ' + list(R.leaders.map(function (i) { return prods[i].name; })) +
      ' ganan en ' + R.wins[R.leaders[0]] + ' apartados cada uno, de ' + R.comparable + ' comparables.';
  };

  /* ---------- Piezas de interfaz ---------- */
  CT.R = {};
  CT.R.img = function (p, cat, cls) {
    if (p && p.img) return '<img class="pimg ' + (cls || '') + '" src="' + esc(p.img) + '" alt="' + esc(p.brand + ' ' + p.name) + '" width="64" height="64" loading="lazy" decoding="async">';
    return '<span class="pimg ' + (cls || '') + '" aria-hidden="true">' + CT.icon(cat.icon) + '</span>';
  };
  CT.R.crumbs = function (items) {
    return '<nav class="crumbs" aria-label="Ruta de navegación"><ol>' + items.map(function (it) {
      return '<li>' + (it[1] ? '<a href="' + it[1] + '">' + esc(it[0]) + '</a>' : '<span aria-current="page">' + esc(it[0]) + '</span>') + '</li>';
    }).join('') + '</ol></nav>';
  };
  CT.R.crumbsLd = function (items) {
    return {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: items.map(function (it, i) {
        var o = { '@type': 'ListItem', position: i + 1, name: it[0] };
        if (it[1]) o.item = CT.url.abs(it[1]);
        return o;
      })
    };
  };
  CT.R.pairLink = function (a, b, cat) {
    return '<a class="pair" href="' + CT.url.pair(a.id, b.id) + '"><span class="pair-names">' + esc(a.name) +
      ' <em>vs</em> ' + esc(b.name) + '</span>' + (cat ? '<span class="pair-cat">' + esc(cat.name) + '</span>' : '') + '</a>';
  };

  /* Tabla de especificaciones (1 a 4 productos) con notas a pie. */
  CT.R.table = function (data, prods, R, notes) {
    var n = prods.length;
    var noteNo = function (p, f) {
      var t = p.n[f.k] || (f.k === '_price' ? p.n.price : null);
      if (!t) return '';
      var id = p.id + ':' + f.k, idx = -1;
      notes.forEach(function (x, i) { if (x.id === id) idx = i; });
      if (idx < 0) { notes.push({ id: id, p: p, f: f, text: t }); idx = notes.length - 1; }
      return '<sup class="fnref"><a href="#nota-' + (idx + 1) + '" aria-label="Nota ' + (idx + 1) + '">' + (idx + 1) + '</a></sup>';
    };
    var head = n > 1 ? '<thead><tr><th scope="col"><span class="sr-only">Característica</span></th>' + prods.map(function (p, i) {
      return '<th scope="col" class="s-' + SLOT[i] + '"><span class="dot"></span>' + esc(p.name) + '</th>';
    }).join('') + '</tr></thead>' : '';
    var body = R.sections.map(function (sec) {
      var anyDiff = sec.rows.some(function (r) { return r.differs; });
      var rows = sec.rows.map(function (row) {
        var f = row.f;
        var nums = (f.type === 'num' || f.type === 'price') ? row.vals.map(function (v) { return numOf(f, v); }) : null;
        var max = nums ? Math.max.apply(null, nums.filter(function (v) { return v != null; }).concat([0])) : 0;
        var bars = n > 1 && f.better && nums && max > 0 && !row.mixedCurrency;
        var cells = prods.map(function (p, i) {
          var t = CT.fmt(f, row.vals[i]);
          var win = row.win.indexOf(i) > -1;
          return '<td class="s-' + SLOT[i] + (win ? ' win' : '') + '">' +
            '<span class="v">' + (t != null ? esc(t) : '<span class="na">Sin dato</span>') + noteNo(p, f) +
            (win ? '<span class="won" title="Mejor valor">' + CT.icon('check') + '<span class="sr-only"> (mejor)</span></span>' : '') + '</span>' +
            (bars && nums[i] != null ? '<span class="bar" aria-hidden="true"><i style="width:' + Math.max(3, Math.round(nums[i] / max * 100)) + '%"></i></span>' : '') +
            '</td>';
        }).join('');
        return '<tr class="' + (row.differs ? 'diff' : 'same') + '"><th scope="row">' + esc(f.label) +
          (f.hint ? '<small>' + esc(f.hint) + '</small>' : '') +
          (row.mixedCurrency ? '<small>Monedas distintas: no se comparan.</small>' : '') + '</th>' + cells + '</tr>';
      }).join('');
      return '<tbody class="' + (anyDiff ? 'has-diff' : 'no-diff') + '"><tr class="sec"><th colspan="' + (n + 1) + '" scope="colgroup">' + esc(sec.title) + '</th></tr>' + rows + '</tbody>';
    }).join('');
    return '<div class="tbl-wrap' + (n > 2 ? ' scroll' : '') + '"><table class="specs n' + n + '">' + head + body + '</table></div>';
  };

  CT.R.notesList = function (notes) {
    if (!notes.length) return '';
    return '<ol class="fn">' + notes.map(function (x, i) {
      return '<li id="nota-' + (i + 1) + '"><b>' + esc(x.p.name) + ' · ' + esc(x.f.label) + ':</b> ' + esc(x.text) + '</li>';
    }).join('') + '</ol>';
  };

  /* Selector de producto (se activa con JavaScript). */
  CT.R.picker = function (i, placeholder) {
    return '<div class="picker" data-slot="' + i + '">' +
      '<div class="pk-field">' + CT.icon('search', 'pk-ic') +
      '<input class="pk-input" id="pk-' + i + '" type="text" role="combobox" aria-expanded="false" aria-controls="pk-list-' + i + '" aria-autocomplete="list" autocomplete="off" spellcheck="false" placeholder="' + esc(placeholder) + '" aria-label="Buscar producto ' + (i + 1) + '">' +
      '<button type="button" class="pk-toggle" tabindex="-1" aria-label="Ver todos los productos">' + CT.icon('chevron') + '</button></div>' +
      '<div class="pk-pop" id="pk-list-' + i + '" role="listbox" aria-label="Productos" hidden></div></div>';
  };

  /* ---------- Comparación completa ---------- */
  CT.R.compare = function (cat, data, prods, opts) {
    opts = opts || {};
    var R = CT.compare(data, prods);
    var n = prods.length, names = prods.map(function (p) { return p.name; });
    var notes = [];
    var kw = CT.catKw(cat);
    var allRows = [];
    R.sections.forEach(function (s) { s.rows.forEach(function (r) { allRows.push(r); }); });
    var total = allRows.filter(function (r) { return r.f.k.charAt(0) !== '_'; }).length;
    var verdict = CT.verdictText(R, prods);

    // Introducción
    var years = prods.map(function (p) { return p.year; });
    var intro = 'Comparamos ' + list(prods.map(function (p) { return p.name + ' (' + p.brand + ', ' + p.year + ')'; })) +
      ' en ' + total + ' características oficiales; ' + R.comparable + ' de ellas permiten señalar un ganador objetivo.';
    if (n === 2) {
      if (years[0] === years[1]) intro += ' Los dos se lanzaron en ' + years[0] + '.';
      else {
        var nw = years[0] > years[1] ? 0 : 1, gap = Math.abs(years[0] - years[1]);
        intro += ' ' + names[nw] + ' es ' + gap + (gap === 1 ? ' año' : ' años') + ' más reciente.';
      }
    }

    // Diferencias clave
    var keyRows = allRows.filter(function (r) { return r.win.length === 1 && r.f.type !== 'price'; })
      .map(function (r) { return { r: r, rel: relOf(r) }; })
      .sort(function (a, b) { return b.rel - a.rel; }).slice(0, 5);
    var priceRow = R.sections[R.sections.length - 1].rows[0];

    // Tarjetas
    var cards = prods.map(function (p, i) {
      var lead = R.leaders.length === 1 && R.leaders[0] === i;
      return '<article class="pc s-' + SLOT[i] + (lead ? ' lead' : '') + '" data-slot="' + i + '">' +
        CT.R.img(p, cat, 'lg') +
        '<p class="pc-brand">' + esc(p.brand) + ' · ' + p.year + '</p>' +
        '<h2 class="pc-name"><a href="' + CT.url.product(p) + '">' + esc(p.name) + '</a></h2>' +
        '<p class="pc-price">' + (p.price ? esc(CT.money(p.price)) + ' <small>de lanzamiento</small>' : '<span class="na">Sin precio de referencia</span>') + '</p>' +
        '<p class="pc-wins"><b>' + R.wins[i] + '</b> ' + (R.wins[i] === 1 ? 'victoria' : 'victorias') + (lead ? ' · <span class="lead-tag">más victorias</span>' : '') + '</p>' +
        '<div class="pc-actions"><button type="button" class="btn sm" data-change="' + i + '">Cambiar</button>' +
        (n > 2 ? '<button type="button" class="btn sm ghost" data-drop="' + i + '" aria-label="Quitar ' + esc(p.name) + '">Quitar</button>' : '') + '</div>' +
        '<div class="pc-picker" hidden>' + CT.R.picker(i, 'Cambiar por…') + '</div>' +
        '</article>';
    }).join('') + (n < 4 ? '<article class="pc add" data-slot="' + n + '"><button type="button" class="add-btn" data-change="' + n + '">' + CT.icon('plus') + '<span>Añadir otro producto</span></button>' +
      '<div class="pc-picker" hidden>' + CT.R.picker(n, 'Busca un modelo…') + '</div></article>' : '');

    // Resumen con barras de victorias
    var sum = prods.map(function (p, i) {
      var w = R.comparable ? Math.round(R.wins[i] / R.comparable * 100) : 0;
      return '<div class="sum-row s-' + SLOT[i] + '"><span class="sum-name"><span class="dot"></span>' + esc(p.name) + '</span>' +
        '<span class="bar big" aria-hidden="true"><i style="width:' + w + '%"></i></span><span class="sum-n">' + R.wins[i] + ' / ' + R.comparable + '</span></div>';
    }).join('');

    // Ventajas y desventajas
    var proT = function (f) { return f.pro || (f.type === 'bool' ? 'Incluye ' + lc(f.label) : 'Mejor en ' + lc(f.label)); };
    var conT = function (f) { return f.con || (f.type === 'bool' ? 'Sin ' + lc(f.label) : 'Peor en ' + lc(f.label)); };
    var pc = prods.map(function (p, i) {
      var pros = R.pros[i].slice(0, 5), cons = R.cons[i].slice(0, 4);
      return '<div class="pros s-' + SLOT[i] + '"><h3><span class="dot"></span>' + esc(p.name) + '</h3>' +
        '<h4 class="ok">Ventajas</h4><ul>' + (pros.map(function (x) { return '<li>' + esc(proT(x.f)) + ' <span>' + esc(CT.fmt(x.f, x.v)) + '</span></li>'; }).join('') || '<li class="none">No destaca en ningún apartado medible.</li>') + '</ul>' +
        '<h4 class="ko">Desventajas</h4><ul>' + (cons.map(function (x) { return '<li>' + esc(conT(x.f)) + ' <span>' + esc(CT.fmt(x.f, x.v)) + '</span></li>'; }).join('') || '<li class="none">No queda último en ningún apartado medible.</li>') + '</ul></div>';
    }).join('');

    var table = CT.R.table(data, prods, R, notes);

    // Análisis por apartados
    var analysis = R.sections.map(function (sec) {
      var sentences = sec.rows.map(function (r) { return CT.rowSentence(r, prods); }).filter(Boolean);
      if (!sentences.length) return '';
      var hints = sec.rows.filter(function (r) { return r.f.hint && r.differs; }).map(function (r) { return r.f.hint; });
      return '<h3>' + esc(sec.title) + '</h3><p>' + esc(sentences.join(' ')) + (hints.length ? ' <span class="hint">' + esc(hints.join(' ')) + '</span>' : '') + '</p>';
    }).join('');

    // ¿Cuál elegir?
    var choose = [];
    R.sections.forEach(function (sec) {
      if (sec.title === 'Precio' || sec.title === 'General') return;
      var counts = prods.map(function () { return 0; }), m = 0;
      sec.rows.forEach(function (r) { if (r.win.length && r.f.better) { m++; r.win.forEach(function (i) { counts[i]++; }); } });
      if (!m) return;
      var best = Math.max.apply(null, counts);
      var top = counts.map(function (c, i) { return c === best ? i : -1; }).filter(function (i) { return i > -1; });
      if (top.length === 1) choose.push('Si priorizas ' + lc(sec.title) + ': <b>' + esc(names[top[0]]) + '</b>, mejor en ' + best + ' de ' + m + (m === 1 ? ' apartado.' : ' apartados.'));
      else choose.push('En ' + lc(sec.title) + ' quedan igualados (' + esc(list(top.map(function (i) { return names[i]; }))) + ').');
    });
    if (priceRow.win.length === 1) choose.push('Si el presupuesto manda: <b>' + esc(names[priceRow.win[0]]) + '</b>, que salió a la venta por ' + esc(CT.money(prods[priceRow.win[0]].price)) + '.');

    // Preguntas frecuentes (texto visible y datos estructurados)
    var faq = [];
    if (n === 2) {
      faq.push({ q: '¿Qué es mejor, ' + names[0] + ' o ' + names[1] + '?', a: verdict + ' La mejor elección depende de qué apartados te importen más.' });
      keyRows.slice(0, 3).forEach(function (k) {
        faq.push({ q: '¿' + names[0] + ' o ' + names[1] + ': cuál es mejor en ' + lc(k.r.f.label) + '?', a: CT.rowSentence(k.r, prods) });
      });
      if (priceRow.win.length === 1) faq.push({ q: '¿Cuál es más barato, ' + names[0] + ' o ' + names[1] + '?', a: CT.rowSentence(priceRow, prods) + ' El precio actual en tiendas puede ser distinto.' });
      if (years[0] !== years[1]) {
        var nn = years[0] > years[1] ? 0 : 1;
        faq.push({ q: '¿Cuál es más nuevo?', a: names[nn] + ' se lanzó en ' + years[nn] + ' y ' + names[1 - nn] + ' en ' + years[1 - nn] + '.' });
      }
    }

    // Enlaces relacionados (solo a páginas indexables)
    var related = '';
    if (opts.related !== false) {
      var groups = prods.map(function (p) {
        var links = data.products.filter(function (o) { return prods.indexOf(o) < 0 && CT.isIndexed(p.id, o.id); }).slice(0, 6);
        return links.length ? '<div><h3>Más comparativas de ' + esc(p.name) + '</h3><ul class="links">' +
          links.map(function (o) { return '<li><a href="' + CT.url.pair(p.id, o.id) + '">' + esc(p.name) + ' vs ' + esc(o.name) + '</a></li>'; }).join('') + '</ul></div>' : '';
      }).join('');
      related = '<section class="block"><h2>Sigue comparando</h2><div class="related">' + groups +
        '<div><h3>Fichas técnicas</h3><ul class="links">' + prods.map(function (p) { return '<li><a href="' + CT.url.product(p) + '">' + esc(p.name) + ': ficha técnica</a></li>'; }).join('') +
        '<li><a href="' + CT.url.cat(cat) + '">Comparador de ' + esc(kw) + '</a></li></ul></div></div></section>';
    }

    var updated = data.updated ? CT.dateLong(data.updated) : null;
    var title = names.join(' vs ');
    var html =
      '<div class="container">' +
      CT.R.crumbs(opts.crumbs || [['Inicio', CT.url.home()], ['Comparador de ' + kw, CT.url.cat(cat)], [title]]) +
      '<header class="page-head"><p class="eyebrow">Comparativa · ' + esc(cat.name) + '</p>' +
      '<h1>' + prods.map(function (p, i) { return '<span class="t-' + SLOT[i] + '">' + esc(p.name) + '</span>'; }).join(' <span class="vs-word">vs</span> ') + '</h1>' +
      '<p class="lead">' + esc(intro) + '</p>' +
      '<p class="meta-line">' + (updated ? 'Datos revisados el ' + updated + ' · ' : '') + '<a href="' + CT.url.method() + '">Cómo comparamos</a></p></header>' +
      '<section class="cards n' + Math.min(4, n + (n < 4 ? 1 : 0)) + '" aria-label="Productos comparados" data-cat="' + cat.id + '" data-ids="' + prods.map(function (p) { return p.id; }).join(',') + '">' + cards + '</section>' +
      '<section class="block" id="resumen"><h2>Resumen</h2><p class="verdict">' + esc(verdict) + '</p><div class="sum">' + sum + '</div>' +
      '<p class="fine">El recuento compara solo especificaciones medibles, una a una, sin pesos ocultos. No sustituye a una prueba de uso real.</p></section>' +
      (keyRows.length ? '<section class="block"><h2>Diferencias clave</h2><ul class="keys">' + keyRows.map(function (k) { return '<li>' + esc(CT.rowSentence(k.r, prods)) + '</li>'; }).join('') + '</ul></section>' : '') +
      '<section class="block"><h2>Ventajas y desventajas</h2><div class="pros-grid n' + n + '">' + pc + '</div></section>' +
      '<section class="block" id="especificaciones"><div class="block-head"><h2>Especificaciones</h2>' +
      '<label class="switch"><input type="checkbox" id="only-diff"><span class="sw" aria-hidden="true"></span>Solo diferencias</label></div>' + table + '</section>' +
      '<section class="block prose"><h2>Análisis por apartados</h2>' + analysis + '</section>' +
      (choose.length ? '<section class="block"><h2>¿Cuál elegir?</h2><ul class="choose">' + choose.map(function (c) { return '<li>' + c + '</li>'; }).join('') + '</ul></section>' : '') +
      (faq.length ? '<section class="block faq"><h2>Preguntas frecuentes</h2>' + faq.map(function (x) { return '<h3>' + esc(x.q) + '</h3><p>' + esc(x.a) + '</p>'; }).join('') + '</section>' : '') +
      '<section class="block notes" id="notas"><h2>Notas y fuentes</h2><p>Especificaciones de las fichas técnicas oficiales de cada fabricante. Precio: PVP oficial de lanzamiento del modelo base, en su moneda original; el precio actual puede ser distinto.</p>' + CT.R.notesList(notes) + '</section>' +
      related +
      '</div>';

    var winnerBit = R.leaders.length === 1 ? names[R.leaders[0]] + ' gana en ' + R.wins[R.leaders[0]] + ' de ' + R.comparable + ' apartados. ' : '';
    var topLabels = keyRows.slice(0, 3).map(function (k) { return lc(k.r.f.label); });
    var desc = title + ': ' + winnerBit + 'Compara ' + list(topLabels.concat(['precio'])) + ' con especificaciones oficiales.';
    return { html: html, R: R, title: title, desc: CT.clip(desc, 158), faq: faq, verdict: verdict };
  };

  CT.clip = function (s, max) {
    if (s.length <= max) return s;
    var cut = s.slice(0, max - 1);
    return cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:]$/, '') + '…';
  };
})();
