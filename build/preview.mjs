// Сборка превью для показа по ссылке (GitHub Pages и т.п.): все 4 сайта в одной папке,
// корневые ссылки "/..." переписаны в "<base>/site-N/...", добавлен noindex.
// Запуск: node build/preview.mjs [base] [out]   (по умолчанию base=/Musor-, out=preview)
import fs from 'node:fs';
import path from 'node:path';

const BASE = (process.argv[2] ?? '/Musor-').replace(/\/$/, '');
const OUT = process.argv[3] ?? 'preview';
const SITES = [
  ['site-1', 'Сайт 1 — копия (индиго)'],
  ['site-2', 'Сайт 2 — копия (пурпурный)'],
  ['site-3', 'Сайт 3 — каталог кейсов'],
  ['site-4', 'Сайт 4 — журнал'],
];

fs.rmSync(OUT, { recursive: true, force: true });

for (const [dir] of SITES) {
  const prefix = `${BASE}/${dir}`;
  fs.cpSync(dir, path.join(OUT, dir), { recursive: true });
  for (const f of fs.readdirSync(path.join(OUT, dir), { recursive: true })) {
    if (!f.endsWith('.html')) continue;
    const file = path.join(OUT, dir, f);
    const html = fs.readFileSync(file, 'utf8')
      .replace(/\b(href|src|action)="\/(?!\/)/g, `$1="${prefix}/`)
      .replace('<head>', '<head>\n<meta name="robots" content="noindex, nofollow">');
    fs.writeFileSync(file, html);
  }
}

const links = SITES.map(([d, t]) => `<li><a href="${BASE}/${d}/">${t}</a></li>`).join('\n');
fs.writeFileSync(path.join(OUT, 'index.html'), `<!DOCTYPE html>
<html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex, nofollow"><title>Musor Drop — превью сайтов</title>
<style>body{font:18px/1.6 system-ui,sans-serif;background:#14121c;color:#eee;max-width:640px;margin:60px auto;padding:0 20px}a{color:#a98bff}li{margin:10px 0}</style>
</head><body><h1>Musor Drop — 4 сайта</h1><ul>
${links}
</ul></body></html>
`);
fs.writeFileSync(path.join(OUT, '.nojekyll'), '');
console.log(`preview → ${OUT}/ (base ${BASE})`);
