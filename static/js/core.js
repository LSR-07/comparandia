/*
 * Núcleo de COMPARANDIA: registro de datos, carga diferida,
 * búsqueda tolerante a errores y motor de comparación.
 * Sin dependencias; funciona también abriendo index.html desde disco.
 */
window.CT = window.CT || {};

(function () {
  /* ---------- Índices del catálogo ---------- */
  CT.cats = {};
  CT.groups.forEach(function (g) {
    g.categories.forEach(function (c) { c.group = g; CT.cats[c.id] = c; });
  });
  CT.allCats = function () { return Object.keys(CT.cats).map(function (k) { return CT.cats[k]; }); };

  /* ---------- Utilidades ---------- */
  CT.esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  };
  CT.norm = function (s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[″"'’().,/+_-]/g, ' ').replace(/\s+/g, ' ').trim();
  };
  CT.hash = function (s) {
    var h = 0; s = String(s);
    for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
    return Math.abs(h);
  };

  var nfCache = {};
  CT.num = function (v, dec) {
    var d = dec == null ? 2 : dec;
    if (!nfCache[d]) nfCache[d] = new Intl.NumberFormat('es-ES', { maximumFractionDigits: d });
    return nfCache[d].format(v);
  };
  CT.money = function (price) {
    if (!price) return null;
    var v = price[0], cur = price[1];
    return new Intl.NumberFormat('es-ES', {
      style: 'currency', currency: cur,
      minimumFractionDigits: v % 1 ? 2 : 0, maximumFractionDigits: 2
    }).format(v);
  };

  /* ---------- Registro y carga diferida de datos ---------- */
  var store = {}, pending = {};
  CT.registerData = function (key, data) {
    // Campos automáticos comunes a todas las categorías
    var autoGeneral = [
      { k: '_brand', label: 'Marca', type: 'text' },
      { k: '_year', label: 'Año de lanzamiento', type: 'num', dec: 0 }
    ];
    var general = data.schema.filter(function (s) { return s.title === 'General'; })[0];
    if (general) general.fields = autoGeneral.concat(general.fields);
    else data.schema.unshift({ title: 'General', fields: autoGeneral });
    data.schema.push({ title: 'Precio', auto: true, fields: [
      { k: '_price', label: 'Precio de lanzamiento', type: 'price', better: 'low', pro: 'Más barato de salida', con: 'Más caro de salida', hint: 'PVP oficial del modelo base en su lanzamiento. El precio actual puede ser distinto.' }
    ]});
    data.key = key;
    data.byId = {};
    data.products.forEach(function (p) {
      p.dataKey = key;
      p.s._brand = p.brand;
      p.s._year = p.year;
      p.s._price = p.price;
      p.n = p.n || {};
      p.search = [p.brand + ' ' + p.name, p.name].concat(p.alias || []).map(CT.norm);
      data.byId[p.id] = p;
    });
    data.brands = Array.from(new Set(data.products.map(function (p) { return p.brand; })));
    store[key] = data;
    if (pending[key]) { pending[key].resolve(data); delete pending[key]; }
  };

  CT.getData = function (key) { return store[key] || null; };

  CT.loadData = function (key) {
    if (!key) return Promise.resolve(null);
    if (store[key]) return Promise.resolve(store[key]);
    if (pending[key]) return pending[key].promise;
    var d = {};
    d.promise = new Promise(function (res, rej) { d.resolve = res; d.reject = rej; });
    pending[key] = d;
    var s = document.createElement('script');
    s.src = (CT.site ? CT.site.base : '/') + 'data/products/' + key + '.js' + (CT.version ? '?v=' + CT.version : '');
    s.async = true;
    s.onerror = function () { delete pending[key]; d.reject(new Error('No se pudo cargar ' + key)); };
    document.head.appendChild(s);
    return d.promise;
  };

  CT.loadAll = function () {
    var keys = Array.from(new Set(CT.allCats().map(function (c) { return c.data; }).filter(Boolean)));
    return Promise.all(keys.map(function (k) { return CT.loadData(k).catch(function () { return null; }); }));
  };

  /* ---------- Búsqueda tolerante ---------- */
  function bigrams(s) {
    s = ' ' + s.replace(/\s/g, '') + ' ';
    var out = [];
    for (var i = 0; i < s.length - 1; i++) out.push(s.substr(i, 2));
    return out;
  }
  CT.similarity = function (a, b) {
    var A = bigrams(a), B = bigrams(b);
    if (!A.length || !B.length) return 0;
    var map = {}, hit = 0;
    B.forEach(function (x) { map[x] = (map[x] || 0) + 1; });
    A.forEach(function (x) { if (map[x]) { map[x]--; hit++; } });
    return (2 * hit) / (A.length + B.length);
  };

  /* Puntúa un texto normalizado frente a la consulta (0–100). */
  CT.scoreText = function (q, target) {
    if (!q) return 0;
    var qc = q.replace(/\s/g, ''), tc = target.replace(/\s/g, '');
    if (target === q) return 100;
    if (target.indexOf(q) === 0) return 95;
    if (target.indexOf(q) > -1) return 90;
    if (tc.indexOf(qc) > -1) return 85;
    var tTokens = target.split(' ');
    var qTokens = q.split(' ');
    var all = qTokens.every(function (t) {
      return tTokens.some(function (w) { return w.indexOf(t) === 0; }) || tc.indexOf(t) > -1;
    });
    if (all) return 75;
    var sim = CT.similarity(q, target);
    return sim >= 0.5 ? Math.round(sim * 70) : 0;
  };

  CT.searchProducts = function (products, query) {
    var q = CT.norm(query);
    if (!q) return products.map(function (p) { return { p: p, score: 0 }; });
    return products.map(function (p) {
      var best = 0;
      p.search.forEach(function (t) { best = Math.max(best, CT.scoreText(q, t)); });
      return { p: p, score: best };
    }).filter(function (r) { return r.score > 0; })
      .sort(function (a, b) { return b.score - a.score; });
  };

  /* Sugerencias aunque no haya coincidencia: los más parecidos. */
  CT.suggest = function (products, query, n) {
    var q = CT.norm(query);
    return products.map(function (p) {
      var best = 0;
      p.search.forEach(function (t) { best = Math.max(best, CT.similarity(q, t)); });
      return { p: p, sim: best };
    }).sort(function (a, b) { return b.sim - a.sim; }).slice(0, n || 3);
  };

  /* ---------- Motor de comparación ---------- */
  function rankValue(f, v) {
    if (v == null) return null;
    if (f.type === 'num') return typeof v === 'number' ? v : null;
    if (f.type === 'bool') return v ? 1 : 0;
    if (f.type === 'rank') { var i = f.order.indexOf(v); return i < 0 ? null : i; }
    if (f.type === 'price') return v[0];
    return null;
  }

  /*
   * Devuelve filas con ganadores por campo, victorias por producto
   * y ventajas/desventajas derivadas únicamente de los datos.
   */
  CT.compare = function (data, products) {
    var n = products.length;
    var wins = products.map(function () { return 0; });
    var pros = products.map(function () { return []; });
    var cons = products.map(function () { return []; });
    var comparable = 0;

    var sections = data.schema.map(function (sec) {
      var rows = sec.fields.map(function (f) {
        var vals = products.map(function (p) { return p.s[f.k]; });
        var row = { f: f, vals: vals, win: [], lose: [], ranks: null, differs: false };

        var shown = vals.map(function (v) { return v == null ? '∅' : JSON.stringify(v); });
        row.differs = shown.some(function (s) { return s !== shown[0]; });

        if (!f.better) return row;
        // El precio solo se compara si todos usan la misma moneda
        if (f.type === 'price') {
          var curs = vals.filter(Boolean).map(function (v) { return v[1]; });
          if (new Set(curs).size > 1) { row.mixedCurrency = true; return row; }
        }
        var ranks = vals.map(function (v) { return rankValue(f, v); });
        row.ranks = ranks;
        var known = ranks.filter(function (r) { return r != null; });
        if (known.length < 2) return row;
        var best = f.better === 'low' ? Math.min.apply(null, known) : Math.max.apply(null, known);
        var worst = f.better === 'low' ? Math.max.apply(null, known) : Math.min.apply(null, known);
        if (best === worst) return row;
        comparable++;

        ranks.forEach(function (r, i) {
          if (r == null) return;
          if (r === best) {
            row.win.push(i); wins[i]++;
            var rivals = ranks.filter(function (x, j) { return j !== i && x != null && x !== best; });
            var nextBest = f.better === 'low' ? Math.min.apply(null, rivals) : Math.max.apply(null, rivals);
            pros[i].push({ f: f, v: vals[i], diff: Math.abs(r - nextBest), rel: nextBest ? Math.abs(r - nextBest) / Math.abs(nextBest) : 1 });
          } else if (r === worst) {
            row.lose.push(i);
            cons[i].push({ f: f, v: vals[i], diff: Math.abs(r - best), rel: best ? Math.abs(r - best) / Math.abs(best) : 1 });
          }
        });
        return row;
      });
      return { title: sec.title, auto: sec.auto, rows: rows };
    });

    // Ordena ventajas por diferencia relativa (las más claras primero)
    pros.forEach(function (l) { l.sort(function (a, b) { return b.rel - a.rel; }); });
    cons.forEach(function (l) { l.sort(function (a, b) { return b.rel - a.rel; }); });

    var maxWins = Math.max.apply(null, wins);
    var leaders = wins.map(function (w, i) { return w === maxWins && maxWins > 0 ? i : -1; }).filter(function (i) { return i > -1; });

    return { sections: sections, wins: wins, pros: pros, cons: cons, comparable: comparable, leaders: leaders, n: n };
  };

  /* Formatea un valor para mostrarlo según el tipo de campo. */
  CT.fmt = function (f, v) {
    if (v == null) return null;
    switch (f.type) {
      case 'num':
        if (v === 0 && f.zero) return f.zero;
        return CT.num(v, f.dec) + (f.unit ? (f.unit === '″' || f.unit === '×' ? f.unit : ' ' + f.unit) : '');
      case 'bool': return v ? 'Sí' : 'No';
      case 'price': return CT.money(v);
      default: return String(v);
    }
  };
})();
