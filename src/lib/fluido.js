/**
 * Mancha líquida do topo.
 *
 * Um <canvas> WebGL cobre a seção inteira. Dentro da tela do aparelho ele
 * desenha duas imagens: a de cima (a página pronta) e, por onde a mancha
 * passa, a de baixo (a planta da mesma página). Fora do aparelho a mesma mancha aparece como um véu claro sobre o
 * fundo. A mancha segue o cursor; sem cursor (ou no celular) passeia sozinha.
 *
 * Como funciona: os últimos pontos por onde o cursor passou são pintados
 * como círculos esfumados num canvas 2D pequeno (o "rastro"). O shader lê
 * esse rastro, distorce com ruído e corta num limiar, o que funde os
 * círculos numa forma orgânica, de gota.
 *
 * WebGL puro, sem biblioteca: é um único retângulo com três texturas.
 */

const VERTICE = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAGMENTO = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uRastro;
uniform sampler2D uA;
uniform sampler2D uB;
uniform vec2 uRes;
uniform vec4 uTela;  // x, y, largura e altura da tela do aparelho, em px a partir do canto superior esquerdo
uniform float uRaio;
uniform float uTempo;
uniform float uAspA;
uniform float uAspB;
uniform vec3 uVeu;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

float ruido(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}

// Distância até um retângulo de cantos arredondados (negativa por dentro).
float caixa(vec2 p, vec2 metade, float raio) {
  vec2 q = abs(p) - metade + raio;
  return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - raio;
}

// Encaixa a imagem na tela como "object-fit: cover", alinhada ao topo.
vec2 cobrir(vec2 uv, float aspImagem, float aspTela) {
  if (aspTela > aspImagem) uv.y *= aspImagem / aspTela;
  else uv.x = (uv.x - 0.5) * (aspTela / aspImagem) + 0.5;
  return uv;
}

void main() {
  vec2 px = vec2(vUv.x, 1.0 - vUv.y) * uRes;

  vec2 onda = vec2(ruido(vUv * 5.0 + uTempo * 0.22), ruido(vUv * 5.0 - uTempo * 0.18 + 9.0)) - 0.5;
  float rastro = texture2D(uRastro, vUv + onda * 0.035).r;
  float mancha = smoothstep(0.30, 0.36, rastro);
  float borda = smoothstep(0.23, 0.31, rastro) - smoothstep(0.36, 0.45, rastro);

  float d = caixa(px - (uTela.xy + uTela.zw * 0.5), uTela.zw * 0.5, uRaio);
  float dentro = 1.0 - smoothstep(-1.0, 0.75, d);

  vec2 suv = (px - uTela.xy) / uTela.zw;
  float aspTela = uTela.z / uTela.w;
  vec2 uvA = cobrir(suv, uAspA, aspTela);
  vec2 uvB = cobrir(suv, uAspB, aspTela);
  vec3 a = texture2D(uA, vec2(uvA.x, 1.0 - uvA.y)).rgb;
  vec3 b = texture2D(uB, vec2(uvB.x, 1.0 - uvB.y)).rgb;
  vec3 tela = mix(a, b, mancha) + borda * 0.09;

  // Fora do aparelho: só um véu claro, em alfa pré-multiplicado.
  float alfa = mancha * 0.075 + borda * 0.05;
  gl_FragColor = mix(vec4(uVeu * alfa, alfa), vec4(tela, 1.0), dentro);
}`;

const VIDA = 950; // quanto tempo um ponto do rastro dura, em ms
const LARGURA_RASTRO = 192;
const OCIOSO = 1500; // sem ponteiro por este tempo, a mancha passeia sozinha

function compilar(gl, tipo, fonte) {
  const shader = gl.createShader(tipo);
  gl.shaderSource(shader, fonte);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader) || 'shader inválido');
  }
  return shader;
}

function textura(gl, unidade, origem) {
  const tex = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0 + unidade);
  gl.bindTexture(gl.TEXTURE_2D, tex);
  // Imagens fora de potência de dois: sem mipmap e sem repetição.
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  if (origem) gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, origem);
  return tex;
}

function carregar(url) {
  return new Promise((resolve, reject) => {
    const imagem = new Image();
    imagem.decoding = 'async';
    imagem.onload = () => resolve(imagem);
    imagem.onerror = () => reject(new Error(`não carregou: ${url}`));
    imagem.src = url;
  });
}

/**
 * Liga a mancha. Devolve uma função que desliga tudo, ou null se o
 * navegador não tiver WebGL (quem chama mantém a imagem de reserva).
 *
 * @param {object} opcoes
 * @param {HTMLCanvasElement} opcoes.canvas  canvas que cobre o palco inteiro
 * @param {HTMLElement} opcoes.palco         a seção; o cursor é lido dentro dela
 * @param {HTMLElement} opcoes.tela          a área vazada do aparelho
 * @param {[string, string]} opcoes.imagens  imagem de cima e imagem revelada
 * @param {() => void} opcoes.aoPintar       chamado depois do primeiro quadro
 * @param {() => void} opcoes.aoFalhar       chamado se o WebGL parar no meio do caminho
 */
export function ligarFluido({ canvas, palco, tela, imagens, aoPintar, aoFalhar }) {
  const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false });
  if (!gl) return null;

  let programa;
  try {
    programa = gl.createProgram();
    gl.attachShader(programa, compilar(gl, gl.VERTEX_SHADER, VERTICE));
    gl.attachShader(programa, compilar(gl, gl.FRAGMENT_SHADER, FRAGMENTO));
    gl.linkProgram(programa);
    if (!gl.getProgramParameter(programa, gl.LINK_STATUS)) throw new Error('programa inválido');
  } catch {
    return null;
  }
  gl.useProgram(programa);

  // Um retângulo que cobre o canvas inteiro.
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(programa, 'aPos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const u = Object.fromEntries(
    ['uRastro', 'uA', 'uB', 'uRes', 'uTela', 'uRaio', 'uTempo', 'uAspA', 'uAspB', 'uVeu'].map((nome) => [
      nome,
      gl.getUniformLocation(programa, nome),
    ]),
  );

  // Canvas (0,0) é o canto de cima; texturas, o de baixo. Inverter no envio
  // deixa as duas contas iguais no shader.
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  const rastro = document.createElement('canvas');
  const pincel = rastro.getContext('2d');
  rastro.width = LARGURA_RASTRO;
  rastro.height = LARGURA_RASTRO;
  const texRastro = textura(gl, 0, rastro);
  gl.uniform1i(u.uRastro, 0);
  gl.uniform1i(u.uA, 1);
  gl.uniform1i(u.uB, 2);
  gl.uniform3f(u.uVeu, 0.945, 0.922, 0.878);

  let pontos = [];
  let ultimoPonteiro = -Infinity;
  let ultimo = null;
  let quadro = 0;
  let visivel = false;
  let pronto = false;
  let avisou = false;
  let morto = false;
  let escala = 1;

  const redimensionar = () => {
    escala = Math.min(window.devicePixelRatio || 1, 1.75);
    const largura = Math.max(1, Math.round(palco.clientWidth * escala));
    const altura = Math.max(1, Math.round(palco.clientHeight * escala));
    if (canvas.width !== largura || canvas.height !== altura) {
      canvas.width = largura;
      canvas.height = altura;
      gl.viewport(0, 0, largura, altura);
    }
    // O rastro acompanha a proporção do palco para a mancha continuar redonda.
    const alturaRastro = Math.round(limitar(64, 640, (LARGURA_RASTRO * altura) / largura));
    if (rastro.height !== alturaRastro) rastro.height = alturaRastro;
  };

  const somar = (x, y, agora) => {
    // Preenche o caminho entre dois pontos distantes para a mancha não quebrar.
    if (ultimo) {
      const passos = Math.min(8, Math.floor(Math.hypot(x - ultimo.x, (y - ultimo.y) * (rastro.height / rastro.width)) / 0.035));
      for (let i = 1; i <= passos; i += 1) {
        const t = i / (passos + 1);
        pontos.push({ x: ultimo.x + (x - ultimo.x) * t, y: ultimo.y + (y - ultimo.y) * t, t: agora });
      }
    }
    ultimo = { x, y };
    pontos.push({ x, y, t: agora });
    if (pontos.length > 90) pontos = pontos.slice(-90);
  };

  const aoMover = (evento) => {
    const caixa = palco.getBoundingClientRect();
    if (evento.clientY < caixa.top || evento.clientY > caixa.bottom) return;
    ultimoPonteiro = performance.now();
    somar((evento.clientX - caixa.left) / caixa.width, (evento.clientY - caixa.top) / caixa.height, ultimoPonteiro);
  };

  const pintarRastro = (agora, caixaPalco, caixaTela) => {
    const { width: w, height: h } = rastro;

    // Sem ponteiro, a mancha passeia sobre o aparelho num laço lento.
    if (agora - ultimoPonteiro > OCIOSO) {
      const t = agora / 1000;
      const cx = (caixaTela.left - caixaPalco.left + caixaTela.width / 2) / caixaPalco.width;
      const cy = (caixaTela.top - caixaPalco.top + caixaTela.height / 2) / caixaPalco.height;
      const rx = (caixaTela.width / caixaPalco.width) * 0.62;
      const ry = (caixaTela.height / caixaPalco.height) * 0.34;
      somar(cx + Math.sin(t * 0.62) * rx, cy + Math.sin(t * 0.87 + 1.3) * ry, agora);
    }

    pontos = pontos.filter((ponto) => agora - ponto.t < VIDA);

    pincel.globalCompositeOperation = 'source-over';
    pincel.fillStyle = '#000';
    pincel.fillRect(0, 0, w, h);
    pincel.globalCompositeOperation = 'lighter';

    // Raio pela largura do aparelho: a mancha tem sempre o mesmo porte em relação a ele.
    const raio = Math.max(18, (caixaTela.width / caixaPalco.width) * w * 0.62);
    for (const ponto of pontos) {
      const idade = (agora - ponto.t) / VIDA;
      const forca = (1 - idade) ** 1.7;
      const r = raio * (0.7 + 0.5 * idade);
      const x = ponto.x * w;
      const y = ponto.y * h;
      const tinta = pincel.createRadialGradient(x, y, 0, x, y, r);
      tinta.addColorStop(0, `rgba(255,255,255,${(forca * 0.55).toFixed(3)})`);
      tinta.addColorStop(1, 'rgba(255,255,255,0)');
      pincel.fillStyle = tinta;
      pincel.fillRect(x - r, y - r, r * 2, r * 2);
    }

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texRastro);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, rastro);
  };

  const pintar = (agora) => {
    quadro = 0;
    if (morto || !visivel || !pronto || document.hidden) return;

    const caixaPalco = palco.getBoundingClientRect();
    const caixaTela = tela.getBoundingClientRect();
    pintarRastro(agora, caixaPalco, caixaTela);

    gl.uniform2f(u.uRes, canvas.width, canvas.height);
    gl.uniform4f(
      u.uTela,
      (caixaTela.left - caixaPalco.left) * escala,
      (caixaTela.top - caixaPalco.top) * escala,
      caixaTela.width * escala,
      caixaTela.height * escala,
    );
    gl.uniform1f(u.uRaio, parseFloat(getComputedStyle(tela).borderTopLeftRadius) * escala || 0);
    gl.uniform1f(u.uTempo, agora / 1000);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    if (!avisou) {
      avisou = true;
      aoPintar?.();
    }
    quadro = requestAnimationFrame(pintar);
  };

  const acordar = () => {
    if (!quadro && visivel && pronto && !morto) quadro = requestAnimationFrame(pintar);
  };

  // Só pinta enquanto o topo está na tela.
  const olho = new IntersectionObserver(([entrada]) => {
    visivel = entrada.isIntersecting;
    acordar();
  });
  olho.observe(palco);

  const medidor = new ResizeObserver(redimensionar);
  medidor.observe(palco);
  redimensionar();

  const aoPerder = (evento) => {
    evento.preventDefault();
    morto = true;
    aoFalhar?.();
  };

  window.addEventListener('pointermove', aoMover, { passive: true });
  document.addEventListener('visibilitychange', acordar);
  canvas.addEventListener('webglcontextlost', aoPerder);

  Promise.all(imagens.map(carregar))
    .then(([a, b]) => {
      if (morto) return;
      textura(gl, 1, a);
      textura(gl, 2, b);
      gl.uniform1f(u.uAspA, a.naturalWidth / a.naturalHeight);
      gl.uniform1f(u.uAspB, b.naturalWidth / b.naturalHeight);
      pronto = true;
      acordar();
    })
    .catch(() => {
      // Sem as imagens não há o que pintar; a reserva continua visível.
    });

  return () => {
    morto = true;
    cancelAnimationFrame(quadro);
    olho.disconnect();
    medidor.disconnect();
    window.removeEventListener('pointermove', aoMover);
    document.removeEventListener('visibilitychange', acordar);
    canvas.removeEventListener('webglcontextlost', aoPerder);
    // O contexto não é descartado: se o componente montar de novo no mesmo
    // canvas (o modo estrito do React faz isso), getContext devolve o mesmo.
  };
}

function limitar(minimo, maximo, valor) {
  return Math.min(maximo, Math.max(minimo, valor));
}
