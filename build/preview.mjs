// Сборка превью для показа по ссылке (GitHub Pages и т.п.): все сайты в одной папке,
// корневые ссылки "/..." переписаны в "<base>/site-N/...", добавлен noindex.
// Запуск: node build/preview.mjs [base] [out]   (по умолчанию base=/Musor-, out=preview)
import fs from 'node:fs';
import path from 'node:path';

const BASE = (process.argv[2] ?? '/Musor-').replace(/\/$/, '');
const OUT = process.argv[3] ?? 'preview';
const SITES = [
  ['site-11', 'Сайт 11 — копия (индиго)'],
  ['site-12', 'Сайт 12 — копия (пурпурный)'],
  ['site-13', 'Сайт 13 — копия («мусор дроп», индиго)'],
  ['site-14', 'Сайт 14 — копия («Musor Drop», пурпурный)'],
  ['site-15', 'Сайт 15 — копия («апгрейд», орхидейный)'],
  ['site-16', 'Сайт 16 — каталог кейсов'],
  ['site-17', 'Сайт 17 — журнал'],
  ['site-18', 'Сайт 18 — калькулятор бюджета'],
  ['site-19', 'Сайт 19 — вики (справочник)'],
  ['site-20', 'Сайт 20 — справочный центр (вопросы)'],
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
</head><body><h1>Musor Drop — ${SITES.length} сайтов</h1><ul>
${links}
</ul></body></html>
`);
fs.writeFileSync(path.join(OUT, '.nojekyll'), '');
console.log(`preview → ${OUT}/ (base ${BASE})`);
