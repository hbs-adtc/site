#!/usr/bin/env node
// Builds the site icons from the club mark (src/components/Mark.tsx, 'simple'
// variant, every node lit). Run: node scripts/make-icons.mjs
// Writes public/favicon.svg and the PNG/ICO sizes, rendered with headless Chrome.
import { writeFileSync, readFileSync, mkdtempSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const INK = '#2B2B2B', CRIMSON = '#A51C30', PAPER = '#F4F2EF';
const NODES = [[60, 8], [105, 34], [105, 86], [60, 112], [15, 86], [15, 34]];
const SPOKES = [0, 60, 120, 180, 240, 300];

// The mark's shapes on its 120-unit grid. `body` is the ink parts' fill.
const shapes = body => [
  ...SPOKES.map(a => `<rect x="58" y="14" width="4" height="16" fill="${body}" transform="rotate(${a} 60 60)"/>`),
  `<circle cx="60" cy="60" r="21" fill="none" stroke="${body}" stroke-width="12"/>`,
  `<circle cx="60" cy="60" r="6" fill="${body}"/>`,
  ...NODES.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6.5" fill="${CRIMSON}"/>`),
].join('');

// Browser-tab icon: transparent, and the ink body turns paper in dark tab bars.
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
<style>.f{fill:${INK}}.s{stroke:${INK}}@media (prefers-color-scheme:dark){.f{fill:${PAPER}}.s{stroke:${PAPER}}}</style>
${shapes('INK')
  .replace(/fill="INK"/g, 'class="f"')
  .replace('fill="none" stroke="INK"', 'class="s" fill="none"')}
</svg>
`;
writeFileSync('public/favicon.svg', favicon);

// Raster icons. pad = share of the canvas left around the mark; bg = ground.
const icons = [
  { file: 'favicon-96x96.png', size: 96, pad: 0.04 },
  { file: 'apple-touch-icon.png', size: 180, pad: 0.16, bg: PAPER },
  { file: 'web-app-manifest-192x192.png', size: 192, pad: 0.2, bg: PAPER },
  { file: 'web-app-manifest-512x512.png', size: 512, pad: 0.2, bg: PAPER },
  { file: '_ico32.png', size: 32, pad: 0.02 },
  { file: '_ico16.png', size: 16, pad: 0 },
];
const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const dir = mkdtempSync(join(tmpdir(), 'icons-'));
for (const { file, size, pad, bg } of icons) {
  const inner = size * (1 - 2 * pad);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${bg ? `<rect width="${size}" height="${size}" fill="${bg}"/>` : ''}<g transform="translate(${size * pad} ${size * pad}) scale(${inner / 120})">${shapes(INK)}</g></svg>`;
  const html = join(dir, 'i.html');
  writeFileSync(html, `<html><body style="margin:0;background:transparent">${svg}</body></html>`);
  const out = join(dir, file);
  execFileSync(chrome, ['--headless', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
    '--default-background-color=00000000', `--window-size=${size},${size}`, `--screenshot=${out}`, `file://${html}`], { stdio: 'ignore' });
  if (!file.startsWith('_')) writeFileSync(join('public', file), readFileSync(out));
}

// favicon.ico holding the 16 and 32px PNGs.
const pngs = [16, 32].map(s => readFileSync(join(dir, `_ico${s}.png`)));
const head = Buffer.alloc(6 + 16 * pngs.length);
head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(pngs.length, 4);
let offset = head.length;
pngs.forEach((p, i) => {
  const s = [16, 32][i], o = 6 + 16 * i;
  head.writeUInt8(s, o); head.writeUInt8(s, o + 1); head.writeUInt16LE(1, o + 4); head.writeUInt16LE(32, o + 6);
  head.writeUInt32LE(p.length, o + 8); head.writeUInt32LE(offset, o + 12); offset += p.length;
});
writeFileSync('public/favicon.ico', Buffer.concat([head, ...pngs]));
rmSync(dir, { recursive: true });
console.log('icons written to public/');
