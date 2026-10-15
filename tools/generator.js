/*
 * GENERADOR ESTÁTICO DE COMPARANDIA
 * ------------------------------------------------------------
 * Función pura: a partir del catálogo y los datos ya cargados en `CT`,
 * devuelve todas las páginas HTML prerenderizadas, sitemap.xml,
 * robots.txt, _redirects, _headers y data/pages.js.
 * La ejecutan tools/build.mjs (Node) y tools/build.html (navegador).
 */
(function (root) {
  'use strict';

  function build(input) {
    var CT = root.CT;
    var site = CT.site, esc = CT.esc, lc = CT.lc, list = CT.list;
    var V = input.version;
    var files = {};
    var sitemap = [];
    var report = { pages: 0, indexable: 0, pairsChecked: 0, pairsIndexed: 0, productsIndexed: 0, products: 0, categoriesIndexed: 0, noindex: [] };
    var A = function (p) { return site.base + p + '?v=' + V; };
    var max = function (a, b) { return a > b ? a : b; };

    /* ---------- Datos y reglas de calidad ---------- */
    var keys = [];
    CT.allCats().forEach(function (c) { if (c.data && keys.indexOf(c.data) < 0 && CT.getData(c.data)) keys.push(c.data); });
    var popularSet = {};
    CT.popular.forEach(function (p) { popularSet[CT.pairSlug(p[0], p[1])] = true; });

    var pairs = [];
    keys.forEach(function (key) {
      var data = CT.getData(key), ps = data.products;
      for (var i = 0; i < ps.length; i++) for (var j = i + 1; j < ps.length; j++) {
        var q = CT.quality.pair(data, ps[i], ps[j]);
        var slug = CT.pairSlug(ps[i].id, ps[j].id);
        // Las populares solo saltan el filtro de gama, nunca el de contenido
        var ok = q.ok || (popularSet[slug] && q.decided >= CT.seoRules.minDecided && q.differing >= CT.seoRules.minDiffering &&
          q.ca >= CT.seoRules.minCompleteness && q.cb >= CT.seoRules.minCompleteness);
        report.pairsChecked++;
        var ab = [ps[i], ps[j]].sort(function (x, y) { return x.id < y.id ? -1 : 1; });
        pairs.push({ key: key, data: data, a: ab[0], b: ab[1], slug: slug, q: q, ok: ok });
      }
    });
    var indexedPairs = pairs.filter(function (p) { return p.ok; });
    CT.indexed = indexedPairs.map(function (p) { return p.slug; });
    CT._idx = null;
    report.pairsIndexed = indexedPairs.length;
    var pairBySlug = {};
    pairs.forEach(function (p) { pairBySlug[p.slug] = p; });

    var productOk = {};
    keys.forEach(function (key) {
      var data = CT.getData(key);
      data.products.forEach(function (p) { report.products++; if (CT.quality.product(data, p).ok) { productOk[p.id] = true; report.productsIndexed++; } });
    });

    var popularPairs = CT.popular.map(function (x) { return pairBySlug[CT.pairSlug(x[0], x[1])]; })
      .filter(function (p) { return p && p.ok; });
    function newestPairs(filterKey, n) {
      var forced = (CT.newComparisons || []).slice().sort(function (a, b) { return a.added < b.added ? 1 : -1; })
        .map(function (x) { return pairBySlug[CT.pairSlug(x.ids[0], x.ids[1])]; })
        .filter(function (p) { return p && p.ok && (!filterKey || p.key === filterKey); });
      var auto = indexedPairs.filter(function (p) { return (!filterKey || p.key === filterKey) && forced.indexOf(p) < 0 && !popularSet[p.slug]; })
        .sort(function (x, y) {
          return (max(y.a.year, y.b.year) - max(x.a.year, x.b.year)) || (Math.min(y.a.year, y.b.year) - Math.min(x.a.year, x.b.year)) || (y.q.decided - x.q.decided);
        });
      return forced.concat(auto).slice(0, n);
    }

    /* ---------- Plantilla común ---------- */
    var icon = CT.icon;
    function logo() {
      return '<a class="logo" href="' + CT.url.home() + '" aria-label="Comparandia, inicio"><span class="logo-mark" aria-hidden="true">' +
        '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M13 2L4 14h7l-1 8 9-12h-7z" fill="currentColor"/></svg></span>Comparandia</a>';
    }
    function catMenu() {
      return CT.groups.map(function (g) {
        return '<div class="menu-group"><p class="menu-title">' + esc(g.name) + '</p><ul>' + g.categories.map(function (c) {
          var d = c.data && CT.getData(c.data);
          return '<li><a href="' + CT.url.cat(c) + '"' + (d ? '' : ' class="soon"') + '>' + esc(c.name) + (d ? ' <span class="count">' + d.products.length + '</span>' : '') + '</a></li>';
        }).join('') + '</ul></div>';
      }).join('');
    }
    var header = '<header class="header"><div class="container header-in">' + logo() +
      '<nav class="nav" aria-label="Principal">' +
      '<button type="button" class="nav-link" id="menu-btn" aria-expanded="false" aria-controls="menu">Categorías ' + icon('chevron') + '</button>' +
      '<a class="nav-link hide-sm" href="' + CT.url.method() + '">Cómo comparamos</a></nav>' +
      '<button type="button" class="icon-btn search-btn" id="search-btn" aria-label="Buscar productos">' + icon('search') + '<span>Buscar</span></button>' +
      '<button type="button" class="icon-btn" id="theme-btn" aria-label="Cambiar entre modo claro y oscuro">' + icon('moon') + '</button>' +
      '</div><div class="menu" id="menu" hidden><div class="container"><div class="menu-grid">' + catMenu() +
      '</div><p class="menu-foot"><a href="' + CT.url.categories() + '">Ver todas las categorías</a></p></div></div></header>';

    var liveCats = CT.allCats().filter(function (c) { return c.data && CT.getData(c.data); });
    var footer = '<footer class="footer"><div class="container"><div class="foot-grid">' +
      '<div class="foot-brand">' + logo() + '<p>' + esc(site.slogan) + ' Comparador gratuito, sin registro y con especificaciones oficiales.</p></div>' +
      '<div><p class="foot-title">Comparadores</p><ul>' + liveCats.map(function (c) { return '<li><a href="' + CT.url.cat(c) + '">' + esc(cap(CT.catKw(c))) + '</a></li>'; }).join('') + '</ul></div>' +
      '<div><p class="foot-title">Populares</p><ul>' + popularPairs.slice(0, 6).map(function (p) { return '<li><a href="' + CT.url.pair(p.a.id, p.b.id) + '">' + esc(p.a.name + ' vs ' + p.b.name) + '</a></li>'; }).join('') + '</ul></div>' +
      '<div><p class="foot-title">Comparandia</p><ul><li><a href="' + CT.url.categories() + '">Todas las categorías</a></li><li><a href="' + CT.url.method() + '">Cómo comparamos</a></li></ul></div>' +
      '</div><p class="foot-legal">© ' + site.updated.slice(0, 4) + ' Comparandia. Las marcas pertenecen a sus propietarios. Precios orientativos de lanzamiento.</p></div></footer>';

    var searchDlg = '<dialog class="search-dlg" id="search-dlg" aria-label="Buscar"><div class="dlg-field">' + icon('search') +
      '<input id="dlg-input" type="text" placeholder="Busca un producto o una categoría" aria-label="Buscar productos y categorías" autocomplete="off" role="combobox" aria-controls="dlg-results" aria-expanded="false">' +
      '<button type="button" class="icon-btn sm" id="dlg-close" aria-label="Cerrar búsqueda">' + icon('x') + '</button></div>' +
      '<div class="gs-pop dlg-results" id="dlg-results" role="listbox" hidden></div><p class="dlg-hint">Prueba con «iPhone 16», «RTX 4070» o «portátiles».</p></dialog>';

    function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

    function page(o) {
      var path = o.path; // URL relativa a la base, p. ej. 'comparar/a-vs-b/'
      var url = site.base + path;
      var indexable = o.index !== false;
      var title = o.title.indexOf('Comparandia') > -1 ? o.title : o.title + ' | Comparandia';
      var ld = (o.ld || []).map(function (x) { return '<script type="application/ld+json">' + JSON.stringify(x).replace(/</g, '\\u003c') + '</script>'; }).join('');
      var scripts = ['data/catalog.js', 'data/seo.js', 'data/pages.js', 'assets/js/icons.js', 'assets/js/core.js', 'assets/js/render.js']
        .concat(o.dataKey ? ['data/products/' + o.dataKey + '.js'] : []).concat(['assets/js/app.js'])
        .map(function (s) { return '<script defer src="' + A(s) + '"></script>'; }).join('');
      var html = '<!doctype html>\n<html lang="' + site.lang + '">\n<head>\n<meta charset="utf-8">\n' +
        '<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
        '<title>' + esc(title) + '</title>\n' +
        '<meta name="description" content="' + esc(o.desc) + '">\n' +
        '<meta name="robots" content="' + (indexable ? 'index, follow, max-image-preview:large' : 'noindex, follow') + '">\n' +
        (indexable ? '<link rel="canonical" href="' + esc(CT.url.abs(url)) + '">\n' : '') +
        '<meta property="og:type" content="' + (o.ogType || 'website') + '">\n<meta property="og:site_name" content="Comparandia">\n' +
        '<meta property="og:title" content="' + esc(o.ogTitle || o.title) + '">\n<meta property="og:description" content="' + esc(o.desc) + '">\n' +
        '<meta property="og:url" content="' + esc(CT.url.abs(url)) + '">\n<meta property="og:locale" content="' + site.locale + '">\n' +
        '<meta name="twitter:card" content="summary">\n' +
        (o.verify && site.googleVerification ? '<meta name="google-site-verification" content="' + esc(site.googleVerification) + '">\n' : '') +
        (o.verify && site.bingVerification ? '<meta name="msvalidate.01" content="' + esc(site.bingVerification) + '">\n' : '') +
        '<meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">\n<meta name="theme-color" content="#121214" media="(prefers-color-scheme: dark)">\n' +
        '<link rel="icon" href="' + site.base + 'favicon.svg" type="image/svg+xml">\n<link rel="manifest" href="' + site.base + 'manifest.webmanifest">\n' +
        '<link rel="stylesheet" href="' + A('assets/css/styles.css') + '">\n' +
        '<script>try{var t=localStorage.getItem("ct-theme");if(t==="dark"||t==="light")document.documentElement.setAttribute("data-theme",t)}catch(e){}</script>\n' +
        ld + '\n</head>\n<body data-page="' + o.type + '"' + (o.cat ? ' data-cat="' + o.cat + '"' : '') + '>\n' +
        '<a class="skip" href="#main">Saltar al contenido</a>\n' + header + '\n<main id="main">' + o.body + '</main>\n' + footer + '\n' + searchDlg +
        '\n<div class="toast" id="toast" role="status" aria-live="polite"></div>\n' + scripts + '\n</body>\n</html>\n';
      files[o.file || path + 'index.html'] = html;
      report.pages++;
      if (indexable) { report.indexable++; sitemap.push({ loc: CT.url.abs(url), lastmod: o.lastmod || site.updated }); }
      else report.noindex.push(o.file || path);
    }

    function pairsHTML(arr) {
      if (!arr.length) return '<p class="muted">Aún no hay comparaciones con datos suficientes.</p>';
      return '<ul class="pairs">' + arr.map(function (p) { return '<li>' + CT.R.pairLink(p.a, p.b, CT.primaryCat(p.key)) + '</li>'; }).join('') + '</ul>';
    }
    function directory() {
      return '<div class="dir">' + CT.groups.map(function (g) {
        return '<div class="dir-group"><h3>' + icon(g.icon) + esc(g.name) + '</h3><ul>' + g.categories.map(function (c) {
          var d = c.data && CT.getData(c.data);
          return '<li>' + (d ? '<a href="' + CT.url.cat(c) + '">' + esc(c.name) + '</a> <span class="count">' + d.products.length + '</span>'
            : '<a class="soon" href="' + CT.url.cat(c) + '">' + esc(c.name) + '</a>') + '</li>';
        }).join('') + '</ul></div>';
      }).join('') + '</div>';
    }
    var orgLd = { '@context': 'https://schema.org', '@type': 'Organization', name: 'Comparandia', url: CT.url.abs(site.base), logo: CT.url.abs(site.base + 'favicon.svg') };
    var webLd = { '@context': 'https://schema.org', '@type': 'WebSite', name: 'Comparandia', alternateName: site.slogan, url: CT.url.abs(site.base), inLanguage: site.lang };

    /* ---------- Portada ---------- */
    page({
      path: '', type: 'home', verify: true,
      title: 'Comparandia: comparador de productos gratis y sin registro',
      desc: 'Comparador de productos gratuito: enfrenta móviles, portátiles, consolas, tarjetas gráficas y más con especificaciones oficiales. Sin registro y sin datos inventados.',
      ld: [webLd, orgLd],
      body: '<div class="container">' +
        '<section class="hero"><h1>Comparador de productos</h1>' +
        '<p class="lead">' + esc(site.slogan) + ' Enfrenta hasta cuatro productos con sus especificaciones oficiales y descubre en qué gana cada uno.</p>' +
        '<div class="gsearch" role="search">' + icon('search', 'gs-lead') +
        '<input id="home-search" type="search" placeholder="Busca un producto o una categoría: iPhone 16, PS5, RTX 4070…" aria-label="Buscar productos y categorías" autocomplete="off" role="combobox" aria-controls="home-results" aria-expanded="false">' +
        '<div id="home-results" class="gs-pop" role="listbox" hidden></div></div>' +
        '<p class="quick"><span>Comparadores:</span> ' + liveCats.map(function (c) { return '<a href="' + CT.url.cat(c) + '">' + esc(cap(CT.catKw(c))) + '</a>'; }).join('') + '</p></section>' +
        '<section class="block"><h2>Comparaciones populares</h2>' + pairsHTML(popularPairs) + '</section>' +
        '<section class="block"><h2>Nuevas comparaciones</h2>' + pairsHTML(newestPairs(null, 8)) + '</section>' +
        '<section class="block"><div class="block-head"><h2>Todas las categorías</h2><a class="more" href="' + CT.url.categories() + '">Ver listado</a></div>' + directory() + '</section>' +
        '<section class="block"><h2>Cómo funciona</h2><ol class="steps">' +
        '<li><b>Elige una categoría.</b> ' + CT.allCats().length + ' categorías organizadas en ' + CT.groups.length + ' grupos.</li>' +
        '<li><b>Selecciona los productos.</b> Hasta cuatro a la vez; el buscador entiende errores de escritura.</li>' +
        '<li><b>Pulsa «Comparar ahora».</b> Verás quién gana cada apartado, ventajas, desventajas y la tabla completa.</li></ol></section>' +
        '<section class="block callout"><h2>No inventamos datos</h2><p>Cada cifra procede de la ficha técnica oficial del fabricante. Si un dato no se publica o no se puede verificar, aparece como «Sin dato». Los ganadores se calculan solo con valores comparables, sin puntuaciones ocultas ni patrocinios. <a href="' + CT.url.method() + '">Cómo comparamos</a>.</p></section>' +
        '</div>'
    });

    /* ---------- Todas las categorías ---------- */
    page({
      path: 'categorias/', type: 'static',
      title: 'Todas las categorías del comparador',
      desc: 'Listado completo de categorías de Comparandia: tecnología, moda, videojuegos, motor, hogar, deporte, belleza y más.',
      ld: [CT.R.crumbsLd([['Inicio', CT.url.home()], ['Categorías']])],
      body: '<div class="container">' + CT.R.crumbs([['Inicio', CT.url.home()], ['Categorías']]) +
        '<header class="page-head"><h1>Todas las categorías</h1><p class="lead">' + CT.allCats().length + ' categorías en ' + CT.groups.length +
        ' grupos. Las que aparecen en gris todavía no tienen fichas verificadas.</p></header>' + directory() + '</div>'
    });

    /* ---------- Metodología ---------- */
    page({
      path: 'metodologia/', type: 'static',
      title: 'Cómo comparamos: fuentes y metodología',
      desc: 'De dónde salen los datos de Comparandia, cómo se decide el ganador de cada apartado y qué limitaciones tiene una comparación de especificaciones.',
      ld: [CT.R.crumbsLd([['Inicio', CT.url.home()], ['Cómo comparamos']])],
      body: '<div class="container narrow">' + CT.R.crumbs([['Inicio', CT.url.home()], ['Cómo comparamos']]) +
        '<header class="page-head"><h1>Cómo comparamos</h1><p class="lead">Una comparación solo es útil si puedes fiarte de ella. Estas son nuestras reglas.</p></header>' +
        '<div class="prose">' +
        '<h2>Solo datos oficiales</h2><p>Usamos las fichas técnicas publicadas por cada fabricante. Cuando un dato procede de registros regulatorios o de análisis de desmontaje, lo indicamos con una nota a pie.</p>' +
        '<h2>Nada de estimaciones</h2><p>Si un fabricante no publica un dato, o no podemos verificarlo, aparece como «Sin dato». Preferimos un hueco a una cifra aproximada.</p>' +
        '<h2>Ganadores transparentes</h2><p>Cada apartado medible lo gana el producto con el mejor valor objetivo: más batería, menos peso, mayor resolución de salida… Sumamos victorias sin ponderaciones ocultas. Las características que no tienen un «mejor» claro, como el tamaño de pantalla, se muestran pero no puntúan.</p>' +
        '<h2>Precios</h2><p>Mostramos el PVP oficial de lanzamiento del modelo base, en su moneda original. Solo comparamos precios en la misma moneda. El precio actual en tiendas puede ser muy distinto.</p>' +
        '<h2>Limitaciones</h2><p>Las especificaciones no lo cuentan todo: la calidad de la cámara, el sonido o la autonomía real dependen de muchos factores. Algunas cifras, como los núcleos de una GPU o los TFLOPS, no son comparables entre fabricantes; lo señalamos en cada caso.</p>' +
        '<h2>¿Falta un producto?</h2><p>Si un modelo no aparece es porque aún no hemos verificado su ficha. Solo lo añadimos cuando podemos confirmar sus datos.</p>' +
        '</div></div>'
    });

    /* ---------- Categorías ---------- */
    CT.allCats().forEach(function (cat) {
      var data = cat.data && CT.getData(cat.data);
      var kw = CT.catKw(cat), seo = CT.catSeo[cat.id] || {};
      var crumbs = [['Inicio', CT.url.home()], ['Comparador de ' + kw]];
      var path = CT.catSlug(cat) + '/';
      if (!data) {
        page({
          path: path, type: 'static', index: false,
          title: 'Comparador de ' + kw + ' (próximamente)',
          desc: 'Estamos verificando las fichas técnicas de ' + kw + '. Mientras tanto, compara otras categorías con datos oficiales.',
          body: '<div class="container">' + CT.R.crumbs(crumbs) + '<header class="page-head"><p class="eyebrow">' + esc(cat.group.name) + '</p><h1>Comparador de ' + esc(kw) + '</h1>' +
            '<p class="lead">Todavía no tenemos fichas verificadas en esta categoría. Preferimos no publicar nada antes que mostrarte datos dudosos.</p></header>' +
            '<section class="block"><h2>Categorías disponibles</h2><ul class="links cols">' + liveCats.map(function (c) { return '<li><a href="' + CT.url.cat(c) + '">Comparador de ' + esc(CT.catKw(c)) + '</a></li>'; }).join('') + '</ul></section></div>'
        });
        return;
      }
      report.categoriesIndexed++;
      var ps = data.products;
      var catPairs = indexedPairs.filter(function (p) { return p.key === cat.data; });
      var pop = catPairs.filter(function (p) { return popularSet[p.slug]; })
        .concat(catPairs.filter(function (p) { return !popularSet[p.slug]; }).sort(function (x, y) { return y.q.decided - x.q.decided || (x.slug < y.slug ? -1 : 1); }))
        .slice(0, 12);
      var keyFields = [];
      data.schema.forEach(function (s) { s.fields.forEach(function (f) { if (f.k.charAt(0) !== '_' && f.type === 'num' && f.better && keyFields.length < 2) keyFields.push(f); }); });
      var years = ps.map(function (p) { return p.year; });
      var minY = Math.min.apply(null, years), maxY = Math.max.apply(null, years);
      var lead = 'Compara ' + ps.length + ' ' + kw + ' de ' + list(data.brands) + ' lanzados entre ' + minY + ' y ' + maxY +
        ', con especificaciones oficiales. Elige dos, tres o cuatro modelos y descubre en qué gana cada uno.';
      if (minY === maxY) lead = 'Compara ' + ps.length + ' ' + kw + ' de ' + list(data.brands) + ' con especificaciones oficiales. Elige dos o más modelos y descubre en qué gana cada uno.';
      var slot = function (i) {
        return '<div class="slot s-' + ['a', 'b'][i] + '" data-slot="' + i + '"><div class="slot-top"><p class="slot-tag"><span class="dot"></span>Producto ' + (i + 1) + '</p></div>' +
          CT.R.picker(i, 'Busca o elige un modelo') + '<div class="slot-body"><div class="slot-empty">' + CT.R.img(null, cat, 'lg ghost') + '<span>Elige un producto</span></div></div></div>';
      };
      var modelRows = ps.slice().sort(function (a, b) { return b.year - a.year || (a.brand < b.brand ? -1 : 1); }).map(function (p) {
        return '<tr><th scope="row"><a href="' + CT.url.product(p) + '">' + esc(p.name) + '</a></th><td>' + esc(p.brand) + '</td><td>' + p.year + '</td>' +
          keyFields.map(function (f) { var t = CT.fmt(f, p.s[f.k]); return '<td>' + (t != null ? esc(t) : '<span class="na">Sin dato</span>') + '</td>'; }).join('') +
          '<td>' + (p.price ? esc(CT.money(p.price)) : '<span class="na">Sin dato</span>') + '</td></tr>';
      }).join('');
      var guide = (seo.guide || []).map(function (g) { return '<h3>' + esc(g[0]) + '</h3><p>' + esc(g[1]) + '</p>'; }).join('');
      var newest = newestPairs(cat.data, 6).filter(function (p) { return pop.indexOf(p) < 0; });

      page({
        path: path, type: 'category', cat: cat.id, dataKey: cat.data, lastmod: max(data.updated || site.updated, site.updated),
        title: 'Comparador de ' + kw + ': compara modelos lado a lado',
        desc: CT.clip('Comparador de ' + kw + ' gratis: ' + ps.length + ' modelos de ' + list(data.brands) + ' con especificaciones oficiales. Elige dos o más y mira sus diferencias.', 158),
        ld: [CT.R.crumbsLd(crumbs), {
          '@context': 'https://schema.org', '@type': 'ItemList', name: 'Modelos de ' + kw + ' en Comparandia', numberOfItems: ps.length,
          itemListElement: ps.map(function (p, i) { return { '@type': 'ListItem', position: i + 1, name: p.brand + ' ' + p.name, url: CT.url.abs(CT.url.product(p)) }; })
        }],
        body: '<div class="container">' + CT.R.crumbs(crumbs) +
          '<header class="page-head"><p class="eyebrow">' + esc(cat.group.name) + '</p><h1>Comparador de ' + esc(kw) + '</h1><p class="lead">' + esc(lead) + '</p></header>' +
          '<section class="tool" id="tool" data-cat="' + cat.id + '" aria-label="Comparador">' +
          '<div class="slots n2">' + slot(0) + '<div class="vs" aria-hidden="true">vs</div>' + slot(1) + '</div>' +
          '<div class="tool-cta"><button type="button" class="btn primary lg" id="go" disabled>' + icon('bolt') + 'Comparar ahora</button>' +
          '<button type="button" class="btn" id="add-slot">' + icon('plus') + 'Añadir otro producto</button>' +
          '<p class="cta-hint" aria-live="polite">Elige al menos dos productos distintos.</p></div>' +
          '<noscript><p class="muted">El selector necesita JavaScript. También puedes abrir cualquiera de las comparativas de abajo.</p></noscript></section>' +
          '<section class="block"><h2>Comparaciones populares de ' + esc(kw) + '</h2>' + pairsHTML(pop) + '</section>' +
          '<section class="block"><h2>Todos los modelos (' + ps.length + ')</h2><div class="tbl-wrap scroll"><table class="models"><thead><tr><th scope="col">Modelo</th><th scope="col">Marca</th><th scope="col">Año</th>' +
          keyFields.map(function (f) { return '<th scope="col">' + esc(f.label) + '</th>'; }).join('') + '<th scope="col">Precio de lanzamiento</th></tr></thead><tbody>' + modelRows + '</tbody></table></div></section>' +
          (guide ? '<section class="block prose"><h2>Qué mirar al comparar ' + esc(kw) + '</h2>' + guide + '</section>' : '') +
          (newest.length ? '<section class="block"><h2>Nuevas comparaciones de ' + esc(kw) + '</h2>' + pairsHTML(newest) + '</section>' : '') +
          '</div>'
      });
    });

    /* ---------- Fichas de producto ---------- */
    keys.forEach(function (key) {
      var data = CT.getData(key), cat = CT.primaryCat(key), kw = CT.catKw(cat);
      var C = CT.compare(data, data.products);
      data.products.forEach(function (p) {
        var crumbs = [['Inicio', CT.url.home()], ['Comparador de ' + kw, CT.url.cat(cat)], [p.name]];
        var R = CT.compare(data, [p]);
        var notes = [];
        // Posición frente al resto del catálogo (dato objetivo y propio de cada ficha)
        var strong = [], weak = [];
        data.schema.forEach(function (s) {
          s.fields.forEach(function (f) {
            if (!f.better || f.k.charAt(0) === '_' || p.s[f.k] == null || f.type === 'price') return;
            var row = null;
            C.sections.forEach(function (cs) { cs.rows.forEach(function (r) { if (r.f.k === f.k) row = r; }); });
            var i = data.products.indexOf(p);
            // Solo cuenta si es un rasgo distintivo: compartido por un tercio del catálogo como mucho
            var limit = Math.max(1, Math.floor(data.products.length / 3));
            var tie = function (k) { return k > 1 ? ' (empatado con ' + (k - 1) + (k === 2 ? ' modelo más)' : ' modelos más)') : ''; };
            if (row && row.win.indexOf(i) > -1 && row.win.length <= limit) strong.push(f.label + ': ' + CT.fmt(f, p.s[f.k]) + tie(row.win.length));
            else if (row && row.lose.indexOf(i) > -1 && row.lose.length <= limit) weak.push(f.label + ': ' + CT.fmt(f, p.s[f.k]) + tie(row.lose.length));
          });
        });
        var mates = data.products.filter(function (o) { return o !== p; });
        var withPairs = mates.filter(function (o) { return CT.isIndexed(p.id, o.id); });
        var sameBrand = mates.filter(function (o) { return o.brand === p.brand; });
        var q = CT.quality.product(data, p);
        var keyFacts = [];
        data.schema.forEach(function (s) { s.fields.forEach(function (f) { if (f.k.charAt(0) !== '_' && f.better && f.type === 'num' && p.s[f.k] != null && keyFacts.length < 3) keyFacts.push(lc(f.label) + ' ' + CT.fmt(f, p.s[f.k])); }); });

        page({
          path: 'producto/' + p.id + '/', type: 'product', cat: cat.id, dataKey: key, index: q.ok, lastmod: data.updated || site.updated,
          title: p.name + ' (' + p.brand + '): ficha técnica y comparativas',
          desc: CT.clip('Especificaciones oficiales de ' + p.brand + ' ' + p.name + ' (' + p.year + '): ' + list(keyFacts) + '. Compáralo con otros ' + kw + '.', 158),
          ld: [CT.R.crumbsLd(crumbs)],
          body: '<div class="container">' + CT.R.crumbs(crumbs) +
            '<header class="page-head product-head" data-id="' + p.id + '">' + CT.R.img(p, cat, 'xl') + '<div><p class="eyebrow">' + esc(p.brand) + ' · ' + esc(cat.name) + '</p>' +
            '<h1>' + esc(p.name) + '</h1><p class="lead">Ficha técnica de ' + esc(p.name) + ' (' + esc(p.brand) + ', ' + p.year + ') con especificaciones oficiales' +
            (p.price ? ' y un precio de lanzamiento de ' + esc(CT.money(p.price)) : '') + '.</p>' +
            '<div class="product-actions"><button type="button" class="btn primary" id="compare-with">' + icon('swap') + 'Comparar con otro modelo</button></div>' +
            '<div class="pc-picker" id="compare-picker" hidden>' + CT.R.picker(1, 'Busca con qué compararlo') + '</div></div></header>' +
            ((strong.length || weak.length) ? '<section class="block"><h2>Frente a los otros ' + mates.length + ' ' + esc(kw) + ' del catálogo</h2><div class="pros-grid n2">' +
              '<div class="pros"><h4 class="ok">Mejor valor del catálogo</h4><ul>' + (strong.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') || '<li class="none">No lidera ningún apartado medible.</li>') + '</ul></div>' +
              '<div class="pros"><h4 class="ko">Peor valor del catálogo</h4><ul>' + (weak.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') || '<li class="none">No es el último en ningún apartado medible.</li>') + '</ul></div></div></section>' : '') +
            '<section class="block"><h2>Especificaciones</h2>' + CT.R.table(data, [p], R, notes) + '</section>' +
            (withPairs.length ? '<section class="block"><h2>Compara ' + esc(p.name) + ' con</h2><ul class="pairs">' + withPairs.map(function (o) { return '<li>' + CT.R.pairLink(p, o) + '</li>'; }).join('') + '</ul></section>' : '') +
            (sameBrand.length ? '<section class="block"><h2>Otros ' + esc(kw) + ' de ' + esc(p.brand) + '</h2><ul class="links cols">' + sameBrand.map(function (o) { return '<li><a href="' + CT.url.product(o) + '">' + esc(o.name) + '</a></li>'; }).join('') + '</ul></section>' : '') +
            '<section class="block notes" id="notas"><h2>Notas y fuentes</h2><p>Datos de la ficha técnica oficial de ' + esc(p.brand) + '. Precio: PVP oficial de lanzamiento del modelo base.</p>' + CT.R.notesList(notes) + '</section>' +
            '</div>'
        });
      });
    });

    /* ---------- Comparaciones indexables ---------- */
    indexedPairs.forEach(function (pr) {
      var cat = CT.primaryCat(pr.key);
      var out = CT.R.compare(cat, pr.data, [pr.a, pr.b], {});
      var crumbs = [['Inicio', CT.url.home()], ['Comparador de ' + CT.catKw(cat), CT.url.cat(cat)], [out.title]];
      var ld = [CT.R.crumbsLd(crumbs)];
      if (out.faq.length) ld.push({
        '@context': 'https://schema.org', '@type': 'FAQPage',
        mainEntity: out.faq.map(function (x) { return { '@type': 'Question', name: x.q, acceptedAnswer: { '@type': 'Answer', text: x.a } }; })
      });
      page({
        path: 'comparar/' + pr.slug + '/', type: 'compare', cat: cat.id, dataKey: pr.key, lastmod: pr.data.updated || site.updated, ogType: 'article',
        title: out.title + ': comparativa y diferencias', desc: out.desc, ld: ld, body: out.html
      });
    });

    /* ---------- Comparador dinámico (3–4 productos o parejas sin página propia) ---------- */
    page({
      path: 'comparar/', type: 'dynamic', index: false,
      title: 'Comparativa personalizada', desc: 'Comparativa personalizada de productos con especificaciones oficiales.',
      body: '<div class="container" id="dyn"><p class="muted loading">Cargando comparativa…</p><noscript><p>Esta comparativa personalizada necesita JavaScript. <a href="' + CT.url.categories() + '">Ver categorías</a>.</p></noscript></div>'
    });

    /* ---------- 404 ---------- */
    page({
      path: '', file: '404.html', type: 'static', index: false,
      title: 'Página no encontrada', desc: 'La página que buscas no existe.',
      body: '<div class="container narrow"><header class="page-head"><h1>Página no encontrada</h1><p class="lead">El enlace no existe o la comparación ya no está disponible.</p></header>' +
        '<p><a class="btn primary" href="' + CT.url.home() + '">Ir al inicio</a> <a class="btn" href="' + CT.url.categories() + '">Ver categorías</a></p></div>'
    });

    /* ---------- Archivos técnicos ---------- */
    var xmlEsc = function (s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;'); };
    var CHUNK = 45000;
    if (sitemap.length <= CHUNK) {
      files['sitemap.xml'] = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
        sitemap.map(function (u) { return '  <url><loc>' + xmlEsc(u.loc) + '</loc><lastmod>' + u.lastmod + '</lastmod></url>'; }).join('\n') + '\n</urlset>\n';
    } else {
      var idx = [];
      for (var c = 0; c * CHUNK < sitemap.length; c++) {
        var part = sitemap.slice(c * CHUNK, (c + 1) * CHUNK), name = 'sitemap-' + (c + 1) + '.xml';
        files[name] = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
          part.map(function (u) { return '  <url><loc>' + xmlEsc(u.loc) + '</loc><lastmod>' + u.lastmod + '</lastmod></url>'; }).join('\n') + '\n</urlset>\n';
        idx.push(CT.url.abs(site.base + name));
      }
      files['sitemap.xml'] = '<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
        idx.map(function (l) { return '  <sitemap><loc>' + xmlEsc(l) + '</loc><lastmod>' + site.updated + '</lastmod></sitemap>'; }).join('\n') + '\n</sitemapindex>\n';
    }
    files['robots.txt'] = '# Comparandia — todas las páginas públicas se pueden rastrear.\n' +
      '# Las páginas sin contenido suficiente (comparativas personalizadas, categorías sin\n' +
      '# productos) llevan <meta name="robots" content="noindex">; no se bloquean aquí porque\n' +
      '# Google necesita rastrearlas para ver esa etiqueta.\n' +
      'User-agent: *\nAllow: /\n\nSitemap: ' + CT.url.abs(site.base + 'sitemap.xml') + '\n';
    // Netlify y Cloudflare Pages: el orden inverso de una comparación redirige a la URL canónica
    files['_redirects'] = '# Generado automáticamente: B-vs-A → A-vs-B (301)\n' + indexedPairs.map(function (p) {
      return site.base + 'comparar/' + p.b.id + '-vs-' + p.a.id + '/ ' + site.base + 'comparar/' + p.slug + '/ 301';
    }).join('\n') + '\n';
    files['_headers'] = '/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n' +
      '/assets/*\n  Cache-Control: public, max-age=31536000, immutable\n/data/*\n  Cache-Control: public, max-age=31536000, immutable\n';
    files['data/pages.js'] = '/* Generado automáticamente: comparaciones con página indexable. */\nCT.version = ' + JSON.stringify(V) + ';\nCT.indexed = ' + JSON.stringify(CT.indexed) + ';\n';
    files['manifest.webmanifest'] = JSON.stringify({
      name: 'Comparandia — ' + site.slogan, short_name: 'Comparandia', start_url: site.base, display: 'standalone',
      background_color: '#ffffff', theme_color: '#1a56db', lang: site.lang,
      icons: [{ src: site.base + 'favicon.svg', sizes: 'any', type: 'image/svg+xml' }]
    }, null, 2);
    if (site.googleFile) files[site.googleFile] = 'google-site-verification: ' + site.googleFile;
    if (site.indexNowKey) files[site.indexNowKey + '.txt'] = site.indexNowKey;

    report.sitemapUrls = sitemap.length;
    return { files: files, report: report };
  }

  root.CTGen = { build: build };
})(typeof window !== 'undefined' ? window : this);
