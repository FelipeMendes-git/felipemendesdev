/**
 * Fotografa os HTMLs de design/conceitos/ e grava as imagens que o site usa:
 *
 *   src/assets/conceitos/<conceito>.webp    as seis páginas da vitrine
 *   src/assets/conceitos/medidas.json       largura e altura de cada uma
 *   src/assets/topo/topo-pagina.webp        a página do aparelho do topo
 *   src/assets/topo/topo-planta.webp        a planta que a mancha revela
 *
 * A ferramenta não fica instalada: rode
 *   npm i -D puppeteer-core && node design/gerar-conceitos.mjs && npm un puppeteer-core
 *
 * Usa o Chrome ou o Edge instalados. Para outro navegador, defina CHROME_PATH.
 */
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const CONCEITOS = ['hamburgueria', 'pilates', 'odontologia', 'solar', 'barbearia', 'interiores'];
const TOPO = ['pagina', 'planta'];

// Tela de celular comum. A escala 1.6 dá imagens de 624px de largura: nítidas
// nos tamanhos em que aparecem no site, sem pesar.
const TELA = { width: 390, height: 844, deviceScaleFactor: 1.6 };

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

const destino = fileURLToPath(new URL('../src/assets/conceitos/', import.meta.url));
const destinoTopo = fileURLToPath(new URL('../src/assets/topo/', import.meta.url));
mkdirSync(destino, { recursive: true });
mkdirSync(destinoTopo, { recursive: true });

const browser = await puppeteer.launch({
  executablePath,
  headless: true,
  // O HTML carrega fontes e fotos por caminho relativo (file://).
  args: ['--allow-file-access-from-files'],
});

/** Espera fontes e fotos: sem isso a captura pode sair com a fonte reserva. */
const carregar = async (page, url) => {
  await page.goto(url, { waitUntil: 'load' });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map((image) => image.decode().catch(() => {})));
  });
};

try {
  const page = await browser.newPage();
  await page.setViewport(TELA);
  const erros = [];
  page.on('pageerror', (erro) => erros.push(String(erro)));

  const medidas = {};
  for (const conceito of CONCEITOS) {
    await carregar(page, new URL(`./conceitos/pagina.html?c=${conceito}`, import.meta.url).href);
    const altura = await page.evaluate(() => document.documentElement.scrollHeight);
    await page.screenshot({ path: `${destino}${conceito}.webp`, type: 'webp', quality: 78, fullPage: true });
    medidas[conceito] = { largura: TELA.width, altura };
    console.log(`${conceito}: ${altura}px de altura`);
  }
  writeFileSync(`${destino}medidas.json`, `${JSON.stringify(medidas, null, 2)}\n`);

  // As duas telas do aparelho do topo: exatamente uma tela de celular cada.
  for (const versao of TOPO) {
    await carregar(page, new URL(`./conceitos/topo.html?v=${versao}`, import.meta.url).href);
    await page.screenshot({ path: `${destinoTopo}topo-${versao}.webp`, type: 'webp', quality: 88 });
    console.log(`topo: ${versao}`);
  }

  // Um conceito que não existe no HTML gera uma página em branco sem avisar:
  // melhor falhar aqui do que publicar a imagem errada.
  if (erros.length) throw new Error(`Erro ao montar as páginas:\n${erros.join('\n')}`);

  console.log(`Imagens gravadas em ${destino} e ${destinoTopo}`);
} finally {
  await browser.close();
}
