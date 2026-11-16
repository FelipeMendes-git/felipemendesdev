/**
 * Fotografa design/topo.html nas duas telas do aparelho do topo:
 * src/assets/topo/topo-interface.webp e topo-codigo.webp (752x1572).
 *
 * A ferramenta não fica instalada: rode
 *   npm i -D puppeteer-core && node design/gerar-topo.mjs && npm un puppeteer-core
 *
 * Usa o Chrome ou o Edge instalados. Para outro navegador, defina CHROME_PATH.
 */
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const CANDIDATES = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean);

const executablePath = CANDIDATES.find((path) => existsSync(path));
if (!executablePath) {
  throw new Error('Nenhum Chrome ou Edge encontrado. Defina CHROME_PATH com o caminho do navegador.');
}

const browser = await puppeteer.launch({
  executablePath,
  headless: true,
  // O HTML carrega as fontes de node_modules por caminho relativo (file://).
  args: ['--allow-file-access-from-files'],
});

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 376, height: 786, deviceScaleFactor: 2 });

  for (const tela of ['interface', 'codigo']) {
    await page.goto(`${new URL('./topo.html', import.meta.url).href}?v=${tela}`, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    const destino = fileURLToPath(new URL(`../src/assets/topo/topo-${tela}.webp`, import.meta.url));
    await page.screenshot({ path: destino, type: 'webp', quality: 88 });
    console.log(`gerada: ${destino}`);
  }
} finally {
  await browser.close();
}
