# Comparandia — Compara todo. Elige mejor.

Comparador de productos gratuito y sin registro. Es una web **estática prerenderizada**: cada categoría, ficha de producto y comparación es un archivo HTML completo que Google puede leer sin ejecutar JavaScript. El JavaScript solo añade el selector de productos, la búsqueda y el modo oscuro.

No usa frameworks, ni APIs, ni herramientas de pago.

---

## 1. Compilar la web

El generador crea la web en `dist/`. Hay dos formas:

**Con Node.js 18 o superior (recomendado; es lo que hacen Netlify y Cloudflare al publicar):**
```
node tools/build.mjs
```

**Sin instalar nada (Windows):**
```
powershell -ExecutionPolicy Bypass -File tools\serve.ps1 -Dev
```
Abre http://localhost:8770/__src/tools/build.html y pulsa «Compilar ahora». La web queda en http://localhost:8770/.

Cada compilación muestra un resumen: páginas indexables, comparaciones generadas, fichas, etc.

## 2. Publicar gratis

La web está publicada en **https://comparandia.netlify.app** (Netlify, plan gratuito). Cada cambio que se sube a la rama `main` de GitHub se compila y se publica solo, y después se avisa a Bing con IndexNow. Cada publicación gasta créditos del plan gratuito de Netlify: para subir cambios sin publicarlos, pon `[skip netlify]` en el mensaje del commit.

Para montarla en otra cuenta:

1. Sube el proyecto a un repositorio de GitHub (la carpeta `dist/` no hace falta: se genera sola).
2. Conéctalo a **Netlify** o **Cloudflare Pages** (plan gratuito):
   - Comando de compilación: `node tools/build.mjs`
   - Carpeta publicada: `dist`
   - En Netlify ya viene configurado en `netlify.toml`.
3. Pon tu dominio en `data/seo.js` → `CT.site.url` y vuelve a publicar. Las canónicas, el sitemap y robots.txt usan ese valor.

Si publicas en una subcarpeta (por ejemplo, GitHub Pages de proyecto), cambia también `CT.site.base` (p. ej. `'/comparandia/'`).

---

## 3. Qué incluye el sistema SEO

| Requisito | Cómo está resuelto |
|---|---|
| Arquitectura optimizada | Inicio → comparador de cada categoría → fichas y comparativas, enlazadas entre sí. URLs limpias, en español y sin parámetros. |
| Página indexable por categoría | `/comparador-de-moviles/`, `/comparador-de-portatiles/`… con texto propio, guía de compra, tabla de modelos y comparaciones populares. |
| URL única por comparación | `/comparar/galaxy-s25-vs-iphone-16/`. Los productos van en orden alfabético; el orden inverso redirige con 301 (`_redirects`). |
| Títulos y descripciones | Generados para cada página a partir de sus datos reales (ganador, apartados clave, nº de modelos…). |
| sitemap.xml | Automático, solo con páginas indexables y fecha `lastmod` real (el campo `updated` de cada archivo de datos). Se divide solo si pasa de 45 000 URL. |
| robots.txt | Permite rastrear todo e indica el sitemap. No bloquea CSS ni JS (Google los necesita para renderizar). |
| Canonical | Absoluta en cada página indexable. Las páginas `noindex` no la llevan. |
| Schema.org | `WebSite` y `Organization` en el inicio, `BreadcrumbList` en todas, `ItemList` en categorías y `FAQPage` en comparativas. **No** se usa `Product`: Google lo exige con precio actual, opiniones o valoraciones, y no tenemos esos datos verificados (inventarlos generaría errores en Search Console). |
| Prerenderizado | Todo el contenido está en el HTML generado. No depende de JavaScript ni de React. |
| Enlaces internos | Menú con todas las categorías, migas de pan, «Más comparativas de…», fichas técnicas, otros modelos de la marca y comparaciones populares en el pie. |
| Velocidad y Core Web Vitals | HTML estático, sin fuentes externas, un único CSS, JS diferido, caché larga para los recursos versionados (`_headers`) y sin saltos de diseño. |
| Contenido original | Cada comparativa redacta con sus datos: introducción, diferencias clave con porcentajes, análisis por apartados, «¿Cuál elegir?», preguntas frecuentes y notas sobre datos no publicados. Cada ficha indica en qué lidera o se queda atrás frente al resto del catálogo. |
| Populares y nuevas | Secciones en el inicio y en cada categoría. Populares: lista editorial en `data/seo.js`. Nuevas: las de los modelos más recientes, más las que añadas a mano con fecha. |
| Search Console | Verificación por meta etiqueta o archivo HTML desde `data/seo.js` (ver abajo). |
| Bing, Edge y otros | IndexNow: al publicar en GitHub, `tools/indexnow.mjs` avisa automáticamente a Bing (Edge), Yandex, Seznam y Naver de todas las páginas del sitemap. La clave pública está en `CT.site.indexNowKey`. |

### Filtro de calidad: solo se indexa lo que aporta

De todas las parejas posibles de una categoría, solo se genera página indexable si cumple **todas** las reglas de `CT.seoRules` en `data/seo.js`:

- al menos 5 apartados con un ganador objetivo y 6 características distintas;
- al menos un 75 % de datos conocidos en cada producto;
- productos de una gama comparable (precio de lanzamiento como mucho 2,5 veces mayor o, si no hay precios comparables, como mucho 4 años de diferencia).

Las demás comparaciones siguen funcionando para el usuario (`/comparar/?c=…&p=…`), pero con `noindex` y fuera del sitemap. Lo mismo ocurre con las comparativas de 3 o 4 productos y con las categorías que aún no tienen productos. Así puedes llegar a miles de productos sin llenar Google de páginas vacías o repetidas.

---

## 4. Google Search Console (gratis)

1. Entra en https://search.google.com/search-console y pulsa **Añadir propiedad**.
2. Elige uno de estos métodos:
   - **Dominio (recomendado):** escribe tu dominio y añade el registro TXT que te da Google en el panel DNS de tu proveedor del dominio. No hace falta tocar el código.
   - **Prefijo de URL → Etiqueta HTML:** copia solo el valor de `content="…"` en `CT.site.googleVerification` de `data/seo.js`, compila y publica.
   - **Prefijo de URL → Archivo HTML:** pon el nombre del archivo (p. ej. `google1a2b3c.html`) en `CT.site.googleFile`, compila y publica. El generador lo crea solo.
3. Pulsa **Verificar**.
4. En **Sitemaps**, escribe `sitemap.xml` y pulsa **Enviar**.
5. Usa **Inspección de URLs** con la portada y alguna comparativa, y pulsa **Solicitar indexación**.
6. Revisa cada pocas semanas los informes **Páginas** (qué se indexa y qué no) y **Rendimiento** (por qué búsquedas apareces). Con esos datos, reordena `CT.popular`.

Bing Webmaster Tools (también gratis) permite importar la propiedad desde Search Console; o rellena `CT.site.bingVerification`.

> No se puede garantizar ninguna posición en Google. Esta base cumple las recomendaciones oficiales de Google para que la web se rastree, se entienda y se indexe bien; el resto depende de la competencia, la antigüedad del dominio y los enlaces que reciba.

---

## 5. Añadir contenido

**Una categoría nueva:** una línea en `data/catalog.js`:
```js
{ id: 'robots-cocina', name: 'Robots de cocina', icon: 'oven', data: 'robots-cocina' }
```
Su URL será `/comparador-de-robots-cocina/`. Sin `data`, aparece como «Próximamente» con `noindex`.

**Sus productos:** crea `data/products/robots-cocina.js`:
```js
CT.registerData('robots-cocina', {
  updated: '2026-10-15',
  schema: [
    { title: 'Potencia', fields: [
      { k: 'watts', label: 'Potencia', unit: 'W', type: 'num', better: 'high', pro: 'Más potente', con: 'Menos potente' }
    ]}
  ],
  products: [
    { id: 'modelo-x', name: 'Modelo X', brand: 'Marca', year: 2025, price: [499, 'EUR'],
      s: { watts: 1500 }, n: { watts: 'Nota opcional sobre el origen del dato' } }
  ]
});
```
Los `id` de producto deben ser únicos en toda la web. Tipos de campo: `num`, `text`, `bool` y `rank` (con `order` de peor a mejor). Con `better: 'high'` o `'low'` el campo decide ganador.

**Textos SEO de la categoría:** añade su palabra clave, singular y guía de compra en `CT.catSeo` (`data/seo.js`).

Tras cualquier cambio, vuelve a compilar. El sitemap, los enlaces y el filtro de calidad se actualizan solos.

## 6. Estructura

```
data/catalog.js            Categorías y grupos
data/seo.js                Dominio, verificación, reglas de calidad, populares, textos SEO
data/products/*.js         Productos y características por categoría
static/css/styles.css      Estilos (claro y oscuro)
static/js/core.js          Datos, búsqueda tolerante a errores, motor de comparación
static/js/render.js        HTML de comparativas y fichas (lo usan el generador y el navegador)
static/js/app.js           Interactividad en el navegador
tools/generator.js         Generador de páginas, sitemap, robots, redirecciones
tools/build.mjs            Compilación con Node
tools/build.html           Compilación desde el navegador (sin Node)
tools/serve.ps1            Servidor local para Windows
dist/                      Web generada (no se edita a mano)
```

## Política de datos

Solo fichas técnicas oficiales. Si un dato no se publica o no se puede verificar, el valor es `null` y la web muestra «Sin dato». Los datos de otras fuentes (registros regulatorios, desmontajes) llevan nota. Precio: PVP oficial de lanzamiento, en su moneda; solo se comparan precios en la misma moneda.
