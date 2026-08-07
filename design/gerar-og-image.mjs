/**
 * Rasteriza design/og-image.svg para public/og-image.png (1200x630).
 *
 * A ferramenta não fica instalada: rode
 *   npm i -D @resvg/resvg-js && node design/gerar-og-image.mjs && npm un @resvg/resvg-js
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { Resvg } from '@resvg/resvg-js';

const svg = readFileSync(new URL('./og-image.svg', import.meta.url), 'utf8');

const resvg = new Resvg(svg, {
  fitTo: { mode: 'width', value: 1200 },
  // O texto depende de fontes do sistema (Segoe UI e Georgia no Windows).
  font: { loadSystemFonts: true, defaultFontFamily: 'Segoe UI' },
});

const png = resvg.render().asPng();
const destino = new URL('../public/og-image.png', import.meta.url);
writeFileSync(destino, png);

console.log(`og-image.png gerada: ${(png.length / 1024).toFixed(1)} kB`);
