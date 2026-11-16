/**
 * Fotografa design/og-image.html em public/og-image.png (1200x630).
 *
 * O HTML usa as mesmas fontes do site (Jost e Bodoni Moda), então quem desenha a imagem é
 * um Chrome de verdade. A ferramenta não fica instalada: rode
 *   npm i -D puppeteer-core && node design/gerar-og-image.mjs && npm un puppeteer-core
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
  // O HTML carrega a fonte de node_modules por caminho relativo (file://).
  args: ['--allow-file-access-from-files'],
});

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
  await page.goto(new URL('./og-image.html', import.meta.url).href, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);

  const destino = fileURLToPath(new URL('../public/og-image.png', import.meta.url));
  await page.screenshot({ path: destino, type: 'png' });
  console.log(`og-image.png gerada em ${destino}`);
} finally {
  await browser.close();
}
