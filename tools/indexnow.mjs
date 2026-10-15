/*
 * Avisa a los buscadores compatibles con IndexNow (Bing/Edge, Yandex,
 * Seznam, Naver) de todas las URL del sitemap. Gratis y sin cuenta.
 *   node tools/indexnow.mjs        (después de compilar y publicar)
 * En Netlify se ejecuta solo tras cada publicación (netlify/plugins/indexnow).
 * Google no usa IndexNow: para Google se envía el sitemap en Search Console.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export async function submitIndexNow({ log = console.log } = {}) {
  const dist = path.join(root, 'dist');
  const seo = fs.readFileSync(path.join(root, 'data/seo.js'), 'utf8');
  const key = (seo.match(/indexNowKey:\s*'([A-Za-z0-9-]{8,128})'/) || [])[1];
  if (!key) return log('Sin indexNowKey en data/seo.js: no se avisa a IndexNow.');

  // URL de todas las páginas indexables (sitemap simple o índice de sitemaps)
  const locs = xml => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].replace(/&amp;/g, '&'));
  const main = fs.readFileSync(path.join(dist, 'sitemap.xml'), 'utf8');
  let urls = locs(main);
  if (main.includes('<sitemapindex')) {
    urls = urls.flatMap(u => locs(fs.readFileSync(path.join(dist, path.basename(new URL(u).pathname)), 'utf8')));
  }
  if (!urls.length) return log('El sitemap está vacío.');

  const first = new URL(urls[0]);
  const basePath = urls.reduce((acc, u) => {
    const p = new URL(u).pathname;
    while (!p.startsWith(acc)) acc = acc.slice(0, acc.slice(0, -1).lastIndexOf('/') + 1);
    return acc;
  }, first.pathname.replace(/[^/]*$/, ''));
  // Bing solo valida la clave en la raíz del dominio (no en subcarpetas como usuario.github.io/repo/)
  if (basePath !== '/') return log(`IndexNow necesita la web en la raíz de su dominio (ahora: ${first.origin}${basePath}).`);
  const keyLocation = `${first.origin}/${key}.txt`;

  // Justo después de publicar, la clave puede tardar en estar visible: esperamos a que lo esté
  for (let tries = 0; ; tries++) {
    const ok = await fetch(keyLocation, { cache: 'no-store' }).then(r => r.ok && r.text()).then(t => t && t.trim() === key).catch(() => false);
    if (ok) break;
    if (tries >= 20) return log(`La clave no está accesible en ${keyLocation}; se intentará en la próxima publicación.`);
    await new Promise(r => setTimeout(r, 15000));
  }

  for (let i = 0; i < urls.length; i += 10000) {
    const urlList = urls.slice(i, i + 10000);
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ host: first.host, key, keyLocation, urlList })
    });
    // 200 = recibido; 202 = recibido, pendiente de validar la clave
    log(`IndexNow: ${urlList.length} URL enviadas → HTTP ${res.status} ${res.statusText}`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await submitIndexNow();
