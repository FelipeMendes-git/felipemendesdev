import { useRef } from 'react';
import { BellRing, Play } from 'lucide-react';
import { gsap, useGSAP, MOTION, revealLines } from '../../lib/gsap';
import Rabisco from '../ui/Rabisco';
import Container from '../ui/Container';

/* ---------------------------------------------------------------------
   Um desenho pequeno para cada projeto, no lugar de capturas de tela: a
   cena de cada um conta o que ele faz. São ilustração (aria-hidden): o
   texto diz tudo o que importa.
   --------------------------------------------------------------------- */

const QR = 15;

/** Um dos três olhos do QR code ocupa 7x7 a partir do canto (ox, oy). */
function olho(x, y, ox, oy) {
  const dx = x - ox;
  const dy = y - oy;
  if (dx < -1 || dx > 7 || dy < -1 || dy > 7) return null; // fora do olho
  if (dx < 0 || dx > 6 || dy < 0 || dy > 6) return false; // margem em volta
  return dx === 0 || dx === 6 || dy === 0 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4);
}

/** Desenho fixo com cara de QR code. Não é um código de verdade: não aponta para lugar nenhum. */
const CELULAS = Array.from({ length: QR * QR }, (_, i) => ({ x: i % QR, y: Math.floor(i / QR) })).filter(
  ({ x, y }) => {
    const fixo = olho(x, y, 0, 0) ?? olho(x, y, QR - 7, 0) ?? olho(x, y, 0, QR - 7);
    return fixo ?? (x * 7 + y * 13 + x * y * 3) % 5 < 2;
  },
);

function ArtePesquisa() {
  return (
    <div data-cena="pesquisa" className="flex h-full items-center gap-5">
      <div className="h-full shrink-0 rounded-xl bg-folha p-2.5">
        <svg viewBox={`0 0 ${QR} ${QR}`} className="h-full w-auto fill-tinta" shapeRendering="crispEdges">
          {CELULAS.map(({ x, y }) => (
            <rect key={`${x}-${y}`} data-celula x={x} y={y} width="1" height="1" />
          ))}
        </svg>
      </div>
      <div className="flex h-full flex-1 items-end gap-[6%] border-b border-papel/30 pb-px">
        {[42, 68, 55, 88, 74].map((altura, index) => (
          <span
            key={index}
            data-coluna
            className={`flex-1 origin-bottom rounded-t-md ${index === 3 ? 'bg-marca' : 'bg-papel/35'}`}
            style={{ height: `${altura}%` }}
          />
        ))}
      </div>
    </div>
  );
}

function ArteToken() {
  return (
    <div data-cena="token" className="flex h-full flex-col justify-center gap-4">
      <p className="w-max rounded-xl bg-folha px-5 py-3 font-mono text-[clamp(1.9rem,3.4vw,2.6rem)] font-bold tracking-[0.14em] text-tinta">
        <span data-codigo>483 921</span>
      </p>
      <div className="flex items-center gap-4 text-[0.98rem]">
        <span className="inline-flex items-center gap-2 rounded-full bg-tinta-clara px-3.5 py-1.5 tabular-nums">
          expira em <strong data-relogio>10:00</strong>
        </span>
        <span className="inline-flex items-center gap-1.5">
          {[0, 1, 2].map((ponto) => (
            <span key={ponto} data-tentativa className="size-3 rounded-full bg-marca" />
          ))}
          <span className="ml-1.5">tentativas</span>
        </span>
      </div>
    </div>
  );
}

function ArteEvento() {
  const avisos = ['A palestra começa em 10 minutos', 'Mudança de sala: auditório B'];
  return (
    <div data-cena="evento" className="flex h-full flex-col justify-center gap-3">
      {avisos.map((aviso) => (
        <p
          key={aviso}
          data-aviso
          className="flex w-full max-w-[21rem] items-center gap-3 rounded-2xl bg-folha px-4 py-3 text-[0.98rem] font-medium leading-snug text-tinta"
        >
          <span className="grid size-9 shrink-0 place-items-center rounded-[0.7rem] bg-tinta text-marca">
            <BellRing size={18} strokeWidth={2.2} />
          </span>
          {aviso}
        </p>
      ))}
    </div>
  );
}

function ArteLegado() {
  return (
    <div data-cena="legado" className="flex h-full items-center gap-4">
      <div className="flex h-[78%] flex-1 flex-col justify-center gap-2 rounded-xl border border-dashed border-papel/40 p-4">
        {[80, 55, 68].map((largura) => (
          <span key={largura} className="h-2 rounded-full bg-papel/30" style={{ width: `${largura}%` }} />
        ))}
      </div>
      <Rabisco forma="seta" className="w-[18%] shrink-0 -rotate-[28deg]" />
      <div data-novo className="flex h-[78%] flex-1 flex-col justify-center gap-2 rounded-xl bg-folha p-4">
        {[80, 55, 68].map((largura, index) => (
          <span
            key={largura}
            className={`h-2 rounded-full ${index === 0 ? 'bg-caneta' : 'bg-tinta/25'}`}
            style={{ width: `${largura}%` }}
          />
        ))}
      </div>
    </div>
  );
}

function ArteVideo() {
  return (
    <div data-cena="video" className="flex h-full items-center gap-5">
      <div className="relative grid aspect-[9/16] h-full place-items-center overflow-hidden rounded-xl bg-tinta-clara ring-1 ring-papel/20">
        <span data-play className="grid size-11 place-items-center rounded-full bg-marca text-tinta">
          <Play size={20} strokeWidth={2.4} fill="currentColor" />
        </span>
        <span className="absolute inset-x-2 bottom-2 h-1 rounded-full bg-papel/25">
          <span data-progresso className="block h-full origin-left rounded-full bg-marca" />
        </span>
      </div>
      <ul className="flex flex-col gap-2 text-[0.98rem]">
        {['roteiro', 'narração', 'edição', 'vídeo pronto'].map((etapa) => (
          <li key={etapa} data-etapa className="w-max rounded-full bg-tinta-clara px-3.5 py-1.5">
            {etapa}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ArtePagina() {
  return (
    <div data-cena="pagina" className="flex h-full items-center">
      <div data-folha className="h-full w-full max-w-[19rem] rounded-xl bg-folha p-4">
        <div className="mb-3 flex gap-1.5">
          {[0, 1, 2].map((ponto) => (
            <span key={ponto} className="size-2 rounded-full bg-tinta/20" />
          ))}
        </div>
        <span data-bloco className="block h-3 w-[72%] origin-left rounded-full bg-tinta" />
        <span data-bloco className="mt-2 block h-3 w-[52%] origin-left rounded-full bg-tinta" />
        <span data-bloco className="mt-3 block h-2 w-[80%] origin-left rounded-full bg-tinta/20" />
        <span data-bloco className="mt-4 block h-7 w-28 origin-left rounded-full bg-marca" />
        <span className="mt-4 grid grid-cols-3 gap-2">
          {[0, 1, 2].map((peca) => (
            <span key={peca} data-peca className="h-8 rounded-lg bg-pauta" />
          ))}
        </span>
      </div>
    </div>
  );
}

const PROJETOS = [
  {
    titulo: 'Pesquisa de satisfação hospitalar',
    papel: 'fiz o projeto inteiro',
    texto:
      'Gera um banner com QR code para cada área do hospital. O código leva a um formulário público protegido por reCAPTCHA, as respostas alimentam um painel exclusivo dos gestores e uma IA escreve o relatório de cada semana.',
    Arte: ArtePesquisa,
  },
  {
    titulo: 'Autenticação por e-mail para emitir diplomas',
    papel: 'fiz o projeto inteiro',
    texto:
      'Cada pessoa recebe por e-mail um token individual, que expira em 10 minutos ou depois de 3 tentativas erradas. O envio tem limite por hora e por dia.',
    Arte: ArteToken,
  },
  {
    titulo: 'Aplicativo de um evento da universidade',
    papel: 'em equipe',
    texto:
      'Fiz o app mobile, que espelha o webview criado pela equipe, a integração com o Firebase para disparar notificações e a página administrativa onde elas são cadastradas. Tudo conversa por API RESTful.',
    Arte: ArteEvento,
  },
  {
    titulo: 'Migração de sistemas legados',
    papel: 'no dia a dia',
    texto: 'Experiência em levar sistemas legados para tecnologias atuais.',
    Arte: ArteLegado,
  },
  {
    titulo: 'Botchquim',
    papel: 'projeto particular',
    texto:
      'Página no Instagram com vídeos gerados automaticamente. Quem produz é uma skill para o Claude que eu mesmo desenvolvi.',
    Arte: ArteVideo,
  },
  {
    titulo: 'Landing pages sob medida',
    papel: 'projetos particulares',
    texto: 'Páginas de venda para negócios locais, do desenho à publicação no domínio do cliente.',
    Arte: ArtePagina,
  },
];

/** A animação própria de cada desenho, tocada quando o painel chega na tela. */
const CENAS = {
  pesquisa: (tl, q) =>
    tl
      .from(q('[data-celula]'), {
        scale: 0,
        transformOrigin: '50% 50%',
        duration: 0.5,
        ease: 'back.out(2)',
        stagger: { amount: 0.9, from: 'random' },
      })
      .from(q('[data-coluna]'), { scaleY: 0, duration: 0.8, stagger: 0.09, ease: 'expo.out' }, 0.5),
  token: (tl, q) => {
    const relogio = q('[data-relogio]')[0];
    const tempo = { segundos: 600 };
    return tl
      .to(q('[data-codigo]'), { duration: 1.4, scrambleText: { text: '483 921', chars: '0123456789', speed: 0.6 } })
      .to(
        tempo,
        {
          segundos: 577,
          duration: 2.4,
          ease: 'none',
          onUpdate: () => {
            const s = Math.round(tempo.segundos);
            relogio.textContent = `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
          },
        },
        0.3,
      )
      .from(q('[data-tentativa]'), { scale: 0, duration: 0.5, stagger: 0.12, ease: 'back.out(3)' }, 0.5)
      // Uma tentativa errada: o primeiro ponto se apaga.
      .to(q('[data-tentativa]')[0], { opacity: 0.25, scale: 0.7, duration: 0.35 }, 1.7);
  },
  evento: (tl, q) =>
    tl.from(q('[data-aviso]'), { y: -46, autoAlpha: 0, rotation: -4, duration: 0.8, stagger: 0.35, ease: 'back.out(1.8)' }),
  legado: (tl, q) =>
    tl
      .from(q('[data-rabisco] path'), { drawSVG: 0, duration: 0.6, stagger: 0.2, ease: 'power2.inOut' })
      .from(q('[data-novo]'), { xPercent: -35, autoAlpha: 0, duration: 0.9, ease: 'expo.out' }, 0.45)
      .from(q('[data-novo] span'), { scaleX: 0, transformOrigin: '0 50%', duration: 0.7, stagger: 0.1, ease: 'expo.out' }, 0.7),
  video: (tl, q) =>
    tl
      .from(q('[data-etapa]'), { x: -24, autoAlpha: 0, duration: 0.5, stagger: 0.22, ease: 'power3.out' })
      .from(q('[data-play]'), { scale: 0, duration: 0.6, ease: 'back.out(2.5)' }, 0.75)
      .from(q('[data-progresso]'), { scaleX: 0, duration: 2.2, ease: 'none' }, 0.9),
  pagina: (tl, q) =>
    tl
      .from(q('[data-folha]'), { yPercent: 30, autoAlpha: 0, duration: 0.8, ease: 'expo.out' })
      .from(q('[data-bloco]'), { scaleX: 0, duration: 0.7, stagger: 0.12, ease: 'expo.out' }, 0.25)
      .from(q('[data-peca]'), { scale: 0, duration: 0.5, stagger: 0.1, ease: 'back.out(2.5)' }, 0.8),
};

export default function Trabalhos() {
  const root = useRef(null);
  const pin = useRef(null);
  const track = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(root);

      mm.add(MOTION, () => {
        revealLines(q('[data-reveal]'));

        // Rolagem vertical vira deslocamento horizontal.
        const distance = () => Math.max(0, track.current.scrollWidth - pin.current.clientWidth);

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: pin.current,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.7,
            invalidateOnRefresh: true,
          },
        });

        tl.to(track.current, { x: () => -distance() }, 0).fromTo(
          q('[data-progress]'),
          { scaleX: 0 },
          { scaleX: 1 },
          0,
        );

        // Cada desenho toca a própria cena quando o painel chega na tela. O ease
        // "none" da linha do tempo é obrigatório para o containerAnimation
        // mapear a posição certa.
        q('[data-cena]').forEach((cena) => {
          const interna = gsap.timeline({
            scrollTrigger: {
              trigger: cena,
              containerAnimation: tl,
              start: 'left 80%',
              toggleActions: 'play none none reverse',
            },
          });
          CENAS[cena.dataset.cena](interna, gsap.utils.selector(cena));
        });

        // Os títulos chegam atrasados em relação ao trilho e assentam no lugar
        // quando o painel está bem dentro da tela: dá profundidade à passagem.
        q('[data-painel]').forEach((painel) => {
          gsap.fromTo(
            painel.querySelector('h3'),
            { x: 90 },
            {
              x: 0,
              ease: 'none',
              scrollTrigger: { trigger: painel, containerAnimation: tl, start: 'left right', end: 'left 45%', scrub: true },
            },
          );
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="projetos"
      data-tone="tinta"
      aria-labelledby="projetos-titulo"
      className="pt-[clamp(5rem,12vw,10rem)]"
    >
      <Container>
        <h2 id="projetos-titulo" data-reveal className="titulo text-[clamp(3.6rem,12vw,12rem)]">
          Projetos
        </h2>
      </Container>

      <div
        ref={pin}
        className="flex flex-col gap-y-[clamp(2rem,6vh,4rem)] py-[clamp(3.5rem,9vw,7rem)] motion-safe:h-svh motion-safe:justify-center motion-safe:pb-[clamp(1.25rem,4vh,3rem)] motion-safe:pt-[calc(var(--header-h)+clamp(0.75rem,3vh,2rem))]"
      >
        {/* O corte do trilho fica neste invólucro, nunca no elemento fixado: o
            Chrome conta como deslocamento de layout (CLS) um elemento fixado
            que recorta o próprio conteúdo, mesmo sem nada se mexer na tela. */}
        <div className="motion-safe:overflow-clip motion-safe:py-2">
          <ul
            ref={track}
            className="flex flex-col gap-14 px-[max(var(--gutter),calc((100vw-96rem)/2+var(--gutter)))] motion-safe:w-max motion-safe:flex-row motion-safe:gap-0 motion-safe:will-change-transform"
          >
            {PROJETOS.map(({ titulo, papel, texto, Arte }) => (
              <li
                key={titulo}
                data-painel
                className="flex flex-col motion-safe:w-[min(84vw,34rem)] motion-safe:border-l motion-safe:border-current/15 motion-safe:px-[clamp(1.25rem,2.8vw,2.75rem)] motion-safe:first:border-l-0 motion-safe:first:pl-0"
              >
                <p className="mao text-[clamp(1.5rem,2vw,1.85rem)] text-accent">{papel}</p>
                <div aria-hidden="true" className="mt-5 h-[clamp(9rem,23vh,12.5rem)] max-w-[26rem]">
                  <Arte />
                </div>
                <h3 className="titulo mt-7 max-w-[15ch] text-[clamp(1.7rem,2.7vw,2.5rem)] leading-[1] will-change-transform">
                  {titulo}
                </h3>
                <p className="mt-3 max-w-[27rem] text-fg-muted">{texto}</p>
              </li>
            ))}
          </ul>
        </div>

        <Container aria-hidden="true" className="motion-reduce:hidden">
          <div className="h-px bg-current/20">
            <div data-progress className="h-[3px] origin-left -translate-y-px bg-accent" />
          </div>
        </Container>
      </div>
    </section>
  );
}
