import { useRef } from 'react';
import { X } from 'lucide-react';
import { gsap, ScrollTrigger, useGSAP, MOTION, revealLines } from '../../lib/gsap';
import { WhatsAppIcon } from '../ui/BrandIcons';
import Rabisco from '../ui/Rabisco';
import Container from '../ui/Container';

/**
 * Por que uma landing page, em uma comparação que se entende sem rolar nada:
 * o mesmo visitante num site comum e numa landing page. O estado final já
 * conta a história sozinho; a animação, que roda uma vez quando a seção
 * aparece, só mostra os cursores chegando até lá.
 */

/** Ponteiro do mouse: o símbolo mais direto de "uma pessoa navegando". */
function Cursor({ className }) {
  return (
    <span data-cursor className={`pointer-events-none absolute z-20 block w-[4.4cqw] ${className}`}>
      <span
        data-ripple
        className="absolute -left-[2.2cqw] -top-[2.2cqw] block size-[4.4cqw] rounded-full bg-noite/25 opacity-0"
      />
      <svg viewBox="0 0 14 21" className="relative block w-full drop-shadow-[0_0.4cqw_0.6cqw_rgb(0_0_0/25%)]">
        <path
          d="M1 1v16l4-3.8 3 6.8 2.6-1.1-2.9-6.6H13z"
          fill="#0c1612"
          stroke="#faf6ee"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

/** Janela de navegador com endereço e o botão de fechar aba. */
function Browser({ address, closing = false, children }) {
  return (
    <div className="absolute inset-0 flex flex-col text-noite">
      <div className="flex items-center gap-[2cqw] border-b border-noite/10 bg-areia px-[3.2cqw] py-[2.2cqw]">
        <span className="flex gap-[1.1cqw]">
          {[0, 1, 2].map((dot) => (
            <span key={dot} className="size-[1.7cqw] rounded-full bg-noite/15" />
          ))}
        </span>
        <span className="min-w-0 flex-1 truncate rounded-full bg-papel px-[2.6cqw] py-[0.9cqw] text-[2.6cqw] text-cinza">
          {address}
        </span>
        <span data-close className="relative grid size-[4.6cqw] place-items-center rounded-full text-noite/55">
          <X className="size-[62%]" strokeWidth={2.2} />
          {closing && <Cursor className="left-[48%] top-[46%]" />}
        </span>
      </div>
      <div className="relative min-h-0 flex-1 bg-papel">{children}</div>
    </div>
  );
}

/** Site institucional típico: menu, banner, cards, rede social. Muitas saídas. */
function RegularSite() {
  return (
    <Browser address="seusite.com.br" closing>
      <div className="flex h-full flex-col gap-[3cqw] p-[4cqw]">
        <nav className="flex items-center gap-[2.8cqw] text-[2.7cqw] font-medium">
          <span className="size-[5cqw] shrink-0 rounded-[1.3cqw] bg-noite" />
          <span className="ml-auto">Início</span>
          <span>Sobre</span>
          <span>Serviços</span>
          <span className="relative">
            Blog
            <Cursor className="left-[40%] top-[55%]" />
          </span>
          <span>Contato</span>
          <span className="relative grid size-[4.8cqw] shrink-0 place-items-center rounded-[1.4cqw] border-[0.4cqw] border-current">
            <span className="size-[1.9cqw] rounded-full border-[0.4cqw] border-current" />
            <Cursor className="left-[52%] top-[50%]" />
          </span>
        </nav>

        <div className="flex flex-1 flex-col justify-end rounded-[2.6cqw] bg-areia/80 p-[4cqw]">
          <p className="text-[4.6cqw] font-semibold leading-tight">Bem-vindo ao nosso site</p>
          <p className="mt-[1cqw] text-[2.8cqw] text-cinza">Conheça nossa história, equipe e valores.</p>
        </div>

        <div className="grid grid-cols-3 gap-[2.2cqw]">
          {['Notícias', 'Galeria', 'Parceiros'].map((card) => (
            <span
              key={card}
              className="flex h-[12cqw] items-end rounded-[2cqw] bg-areia/55 p-[2.2cqw] text-[2.6cqw] font-medium"
            >
              {card}
            </span>
          ))}
        </div>
      </div>
    </Browser>
  );
}

/** Landing page: uma promessa e um botão. Uma saída só, e ela leva ao contato. */
function LandingPage() {
  return (
    <Browser address="suaempresa.com.br">
      <div className="flex h-full flex-col items-center justify-center gap-[2.6cqw] p-[5cqw] text-center md:pb-[13cqw]">
        <span className="text-[2.7cqw] font-medium text-cinza">sua marca</span>
        <p className="titulo max-w-[17ch] text-[6.6cqw]">O que você resolve, em uma frase.</p>
        <p className="text-[3cqw] text-cinza">Para quem é e por que agora.</p>
        <span
          data-button
          className="relative mt-[2.4cqw] inline-flex items-center gap-[1.8cqw] rounded-full bg-brasa px-[5.6cqw] py-[2.8cqw] text-[3.2cqw] font-semibold text-noite"
        >
          <WhatsAppIcon className="size-[3.6cqw]" />
          Falar no WhatsApp
          {/* Pontas dos cursores na borda de baixo: o texto do botão fica livre. */}
          <Cursor className="left-[14%] top-[72%]" />
          <Cursor className="left-[46%] top-[80%]" />
          <Cursor className="left-[78%] top-[68%]" />
        </span>
      </div>
    </Browser>
  );
}

const PANELS = [
  {
    title: 'Site comum',
    rabisco: 'risco',
    caption: 'Menu, abas, links e redes sociais. Cada clique é uma porta de saída.',
    Mock: RegularSite,
    description:
      'Ilustração: num site comum, três visitantes clicam em Blog, no Instagram e no botão de fechar a aba.',
  },
  {
    title: 'Landing page',
    rabisco: 'circulo',
    caption: 'Uma mensagem e um botão só. Quem decide falar com você acha o caminho na hora.',
    Mock: LandingPage,
    description:
      'Ilustração: numa landing page, os três visitantes clicam no botão de WhatsApp e chega uma nova mensagem.',
  },
];

export default function Comparison() {
  const root = useRef(null);
  const panels = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(root);

      mm.add(MOTION, () => {
        revealLines(q('[data-reveal]'));

        // Cada cursor entra pela borda esquerda da própria janela e vai até o
        // lugar onde o CSS já o deixou. As medidas saem da tela no momento da
        // criação, então o ponto de partida acompanha o tamanho real.
        const entry = (cursor) => {
          const stage = cursor.closest('[data-stage]').getBoundingClientRect();
          const spot = cursor.getBoundingClientRect();
          return { x: stage.left - 36 - spot.left, y: stage.top + stage.height * 0.62 - spot.top };
        };

        const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.inOut' } });

        q('[data-stage]').forEach((stage) => {
          stage.querySelectorAll('[data-cursor]').forEach((cursor, index) => {
            const at = index * 0.32;
            const arrival = at + 1.25;
            tl.from(
              cursor,
              { x: () => entry(cursor).x, y: () => entry(cursor).y, duration: 1.25 },
              at,
            ).fromTo(
              cursor.querySelector('[data-ripple]'),
              { scale: 0.2, opacity: 0.7 },
              { scale: 2.4, opacity: 0, duration: 0.55, ease: 'power2.out' },
              arrival,
            );

            const button = cursor.closest('[data-button]');
            if (button) {
              tl.to(button, { scale: 0.96, duration: 0.12, yoyo: true, repeat: 1, ease: 'power2.out' }, arrival);
            }
          });
        });

        tl.from(q('[data-notice]'), { autoAlpha: 0, y: 16, duration: 0.9, ease: 'power3.out' }, '>-0.2')
          // Por último, o veredito de marcador: risca um, circula o outro.
          .from(q('[data-rabisco] path'), { drawSVG: 0, duration: 0.6, stagger: 0.18, ease: 'power2.inOut' }, 1.6);

        ScrollTrigger.create({
          trigger: panels.current,
          start: 'top 78%',
          once: true,
          onEnter: () => tl.play(),
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="porque"
      data-tone="osso"
      aria-labelledby="porque-titulo"
      className="py-[clamp(5rem,12vw,10rem)]"
    >
      <Container>
        <h2 id="porque-titulo" data-reveal className="titulo max-w-[16ch] text-[clamp(2.9rem,7.6vw,7.5rem)]">
          Visitante perdido <em className="block">custa dinheiro.</em>
        </h2>

        <div ref={panels} className="mt-[clamp(3rem,6vw,5rem)] grid gap-x-8 gap-y-14 md:grid-cols-2">
          {PANELS.map(({ title, rabisco, caption, Mock, description }) => (
            <figure key={title} className="m-0">
              <figcaption className="mb-6">
                <span className="titulo relative inline-block text-[clamp(1.7rem,3.2vw,2.9rem)]">
                  {title}
                  <Rabisco
                    forma={rabisco}
                    className={
                      rabisco === 'circulo'
                        ? 'absolute -left-[9%] top-1/2 w-[118%] -translate-y-1/2'
                        : 'absolute -left-[4%] top-1/2 w-[108%] -translate-y-1/2'
                    }
                  />
                </span>
              </figcaption>

              <div className="relative">
                <div
                  data-stage
                  aria-hidden="true"
                  className="@container relative aspect-[4/3] overflow-hidden rounded-[1.25rem] border border-current/15 shadow-[0_30px_60px_-40px_rgb(12_22_18/55%)]"
                >
                  <Mock />
                </div>

                {Mock === LandingPage && (
                  <div
                    data-notice
                    aria-hidden="true"
                    className="z-30 ml-auto mt-4 flex w-[min(17.5rem,88%)] items-start gap-3 rounded-2xl bg-noite px-4 py-3.5 text-osso shadow-[0_18px_40px_-16px_rgb(12_22_18/60%)] md:absolute md:-bottom-6 md:right-5 md:mt-0 md:w-[min(17.5rem,72%)]"
                  >
                    <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-brasa text-noite">
                      <WhatsAppIcon size={17} />
                    </span>
                    <span className="min-w-0 text-[0.92rem] leading-snug">
                      <span className="block font-semibold">Nova mensagem</span>
                      Oi! Vi sua página e quero um orçamento.
                    </span>
                  </div>
                )}
                <p className="sr-only">{description}</p>
              </div>

              <p className="mt-6 max-w-[30rem] text-fg-muted md:mt-10">{caption}</p>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
