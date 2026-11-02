// Полный каталог Musor Drop (100 кейсов, 11 коллекций) — для сайтов 3 и 4.
// Источник: _shared/cases3/index.json (цены на 23.09.2026: монеты = USD-баланс, рубли = RUB-баланс).
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const PRICE_DATE = '23 сентября 2026';

// slug на исходнике → наш slug и короткое имя
const MAP = {
  'musorny-minimum': ['musornyj-minimum', 'Мусорный минимум'],
  'musornaya-kollekciya': ['musornaya-kollekciya', 'Мусорная коллекция'],
  'standartnoe-oruzhie': ['oruzhie', 'Стандартное оружие'],
  'keysy-iz-cs2': ['kejsy-iz-cs2', 'Кейсы из CS2'],
  'kult-mody': ['kult-mody', 'Культ Моды'],
  '50-50': ['50-50', '50/50'],
  'stattrak': ['stattrak', 'StatTrak™'],
  'vip-color': ['vip-color', 'VIP Color'],
  'mystery-box': ['mystery-box', 'Mystery Box'],
  'metallicheskaya-kollekciya': ['metallicheskaya-kollekciya', 'Металлическая коллекция'],
  'standartnye-nozhi': ['nozhi', 'Стандартные ножи'],
};

const num = v => Number(String(v).replace(/[\s ]/g, ''));
const raw = JSON.parse(fs.readFileSync(path.join(ROOT, '_shared/cases3/index.json'), 'utf8'));

export const COLLS = raw.map(c => {
  const [slug, title] = MAP[c.slug];
  const items = c.items.map(i => ({ key: i.key, name: i.name.replace('Серебрянная', 'Серебряная'), coin: num(i.coin), rub: num(i.rub), coll: slug }));
  const rubs = items.map(i => i.rub);
  return { slug, title, items, min: Math.min(...rubs), max: Math.max(...rubs) };
}).sort((a, b) => a.min - b.min);

export const ALL = COLLS.flatMap(c => c.items);
export const collBySlug = Object.fromEntries(COLLS.map(c => [c.slug, c]));

export const rub = v => v.toLocaleString('ru-RU', { maximumFractionDigits: 2 }).replace(/[\s ]/g, ' ') + ' ₽';
export const coin = v => v.toLocaleString('en-US', { maximumFractionDigits: 2 });
