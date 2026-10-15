/*
 * Compila la web estática en dist/ con Node.js (18 o superior):
 *   node tools/build.mjs
 * Es lo que ejecutan Netlify, Cloudflare Pages o GitHub Actions al publicar.
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const rel = (...p) => path.join(root, ...p);
const walk = dir => fs.readdirSync(rel(dir), { withFileTypes: true }).flatMap(e =>
  e.isDirectory() ? walk(path.posix.join(dir, e.name)) : [path.posix.join(dir, e.name)]);

// Mismo código que en el navegador, ejecutado en un contexto aislado
const ctx = { console };
ctx.window = ctx;
vm.createContext(ctx);
const run = f => vm.runInContext(fs.readFileSync(rel(f), 'utf8'), ctx, { filename: f });
const products = walk('data/products').filter(f => f.endsWith('.js')).sort();
['data/catalog.js', 'data/seo.js', 'static/js/icons.js', 'static/js/core.js', 'static/js/render.js', ...products, 'tools/generator.js'].forEach(run);

// El servidor de publicación puede indicar el dominio y la subcarpeta reales
// (p. ej. GitHub Pages: SITE_URL=https://usuario.github.io SITE_BASE=/repo/)
if (process.env.SITE_URL) ctx.CT.site.url = process.env.SITE_URL.replace(/\/$/, '');
if (process.env.SITE_BASE) ctx.CT.site.base = ('/' + process.env.SITE_BASE + '/').replace(/\/+/g, '/');

// Versión para invalidar la caché cuando cambia cualquier archivo
const hash = crypto.createHash('sha1');
[...walk('static'), ...walk('data')].sort().forEach(f => hash.update(fs.readFileSync(rel(f))));
const version = hash.digest('hex').slice(0, 10);

const t0 = Date.now();
const { files, report } = ctx.CTGen.build({ version });

fs.rmSync(dist, { recursive: true, force: true });
const put = (p, content) => {
  const out = path.join(dist, p);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, content);
};
Object.entries(files).forEach(([p, c]) => put(p, c));
walk('static/css').forEach(f => put('assets/css/' + path.posix.basename(f), fs.readFileSync(rel(f))));
walk('static/js').forEach(f => put('assets/js/' + path.posix.basename(f), fs.readFileSync(rel(f))));
put('favicon.svg', fs.readFileSync(rel('static/favicon.svg')));
walk('data').forEach(f => put(f, fs.readFileSync(rel(f))));

console.log(`✔ Web generada en dist/ en ${Date.now() - t0} ms`);
console.log(`  Páginas: ${report.pages} (${report.indexable} indexables, en el sitemap)`);
console.log(`  Comparaciones: ${report.pairsIndexed} indexables de ${report.pairsChecked} posibles`);
console.log(`  Fichas de producto indexables: ${report.productsIndexed} de ${report.products}`);
console.log(`  Categorías indexables: ${report.categoriesIndexed}`);
