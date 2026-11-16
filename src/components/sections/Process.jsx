import { useRef } from 'react';
import { Check, Lock } from 'lucide-react';
import { gsap, useGSAP, MOTION, revealLines } from '../../lib/gsap';
import Container from '../ui/Container';

/* ---------------------------------------------------------------------
   Pequenas cenas de cada etapa. São ilustração (aria-hidden): o texto da
   etapa diz tudo o que importa.
   --------------------------------------------------------------------- */

function ChatArt() {
  return (
    <div className="flex h-full flex-col justify-center gap-3 text-[0.95rem] leading-snug">
      <p className="bubble max-w-[86%] self-start bg-areia px-4 py-3">
        Vendo planos de pilates, mas quase ninguém chama no WhatsApp.
      </p>
      <p className="max-w-[86%] self-end rounded-[1.4em_1.4em_0.3em_1.4em] bg-noite px-4 py-3 text-osso">
        Me conta: quem é o cliente que você quer atrair?
      </p>
    </div>
  );
}

function Wireframe({ className }) {
  return (
    <div className={`rounded-2xl border border-noite/15 bg-papel p-4 ${className}`}>
      <div className="mb-4 flex gap-1.5">
        {[0, 1, 2].map((dot) => (
          <span key={dot} className="size-2 rounded-full bg-noite/20" />
        ))}
      </div>
      <span className="block h-3 w-[72%] rounded-full bg-noite" />
      <span className="mt-2 block h-3 w-[52%] rounded-full bg-noite" />
      <span className="mt-3 block h-2 w-[80%] rounded-full bg-noite/15" />
      <span className="mt-4 block h-7 w-28 rounded-full bg-brasa" />
      <span className="mt-4 grid grid-cols-3 gap-2">
        {[0, 1, 2].map((tile) => (
          <span key={tile} className="h-9 rounded-lg bg-areia" />
        ))}
      </span>
    </div>
  );
}

function DraftArt() {
  return (
    <div className="flex h-full items-center">
      <Wireframe className="w-full max-w-[19rem]" />
    </div>
  );
}

function ReviewArt() {
  return (
    <div className="relative flex h-full items-center">
      <Wireframe className="w-[78%] max-w-[16rem] opacity-80" />
      <p className="bubble absolute right-0 top-[8%] max-w-[62%] bg-noite px-4 py-3 text-[0.9rem] leading-snug text-osso">
        Pode trocar a foto do topo?
      </p>
      <p className="absolute bottom-[10%] right-[6%] inline-flex items-center gap-2 rounded-full bg-areia px-3.5 py-2 text-[0.9rem] font-medium">
        <Check size={15} strokeWidth={2.4} aria-hidden="true" />
        Ajustado
      </p>
    </div>
  );
}

function LiveArt() {
  return (
    <div className="flex h-full flex-col justify-center gap-4">
      <div className="flex items-center gap-2.5 rounded-full border border-noite/15 bg-papel px-4 py-2.5 text-[0.92rem]">
        <Lock size={14} strokeWidth={2} aria-hidden="true" />
        <span className="flex-1 truncate">suaempresa.com.br</span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-noite px-2.5 py-1 text-[0.78rem] font-medium text-osso">
          <span className="size-1.5 rounded-full bg-brasa" />
          No ar
        </span>
      </div>
      <div className="grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-2 text-[0.9rem]">
        <span className="font-medium">Visitas</span>
        <span className="h-2 w-[86%] rounded-full bg-noite" />
        <span className="font-medium">Contatos</span>
        <span className="h-2 w-[22%] rounded-full bg-brasa" />
      </div>
    </div>
  );
}

const STEPS = [
  { title: 'Diagnóstico', text: 'Você me conta o que vende e para quem.', Art: ChatArt },
  { title: 'Proposta visual', text: 'Você vê o desenho pronto antes de qualquer código.', Art: DraftArt },
  { title: 'Refinamento', text: 'Ajustamos texto, imagem e ordem até ficar do seu jeito.', Art: ReviewArt },
  { title: 'Publicação', text: 'No ar, com endereço e medição configurados.', Art: LiveArt },
];

export default function Process() {
  const root = useRef(null);
  const pin = useRef(null);
  const track = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(root);

      mm.add(MOTION, () => {
        revealLines(q('[data-reveal]'));

        // Rolagem vertical vira deslocamento horizontal: o eixo é o tempo do projeto.
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

        // Cada cena entra quando a etapa chega na tela. O ease "none" da linha do
        // tempo é obrigatório para o containerAnimation mapear a posição certa.
        q('[data-art]').forEach((art) => {
          gsap.from(art, {
            autoAlpha: 0,
            y: 28,
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: art,
              containerAnimation: tl,
              start: 'left 82%',
              toggleActions: 'play none none reverse',
            },
          });
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="processo"
      data-tone="osso"
      aria-labelledby="processo-titulo"
      className="pt-[clamp(5rem,12vw,10rem)]"
    >
      <Container>
        <h2 id="processo-titulo" data-reveal className="titulo max-w-[15ch] text-[clamp(2.9rem,7.6vw,7.5rem)]">
          Do primeiro oi <em className="block">até o ar.</em>
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
          <ol
            ref={track}
            className="flex flex-col gap-14 px-[max(var(--gutter),calc((100vw-96rem)/2+var(--gutter)))] motion-safe:w-max motion-safe:flex-row motion-safe:gap-0 motion-safe:will-change-transform"
          >
            {STEPS.map(({ title, text, Art }, index) => (
              <li
                key={title}
                className="flex flex-col motion-safe:w-[min(80vw,30rem)] motion-safe:border-l motion-safe:border-current/15 motion-safe:px-[clamp(1.25rem,2.8vw,2.75rem)] motion-safe:first:border-l-0 motion-safe:first:pl-0"
              >
                <span className="serif text-[clamp(3.75rem,7.6vw,7rem)] italic leading-none text-accent [--opsz:30]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div data-art aria-hidden="true" className="mt-6 h-[clamp(9.5rem,24vh,13rem)] max-w-[24rem]">
                  <Art />
                </div>
                <h3 className="titulo mt-6 text-[clamp(1.7rem,2.8vw,2.5rem)]">{title}</h3>
                <p className="mt-3 max-w-[22rem] text-fg-muted">{text}</p>
              </li>
            ))}
          </ol>
        </div>

        <Container aria-hidden="true" className="motion-reduce:hidden">
          <div className="flex justify-between text-[0.98rem] text-fg-muted">
            <span>Primeiro contato</span>
            <span>Página no ar</span>
          </div>
          <div className="mt-3 h-px bg-current/20">
            <div data-progress className="h-[3px] origin-left -translate-y-px bg-accent" />
          </div>
        </Container>
      </div>
    </section>
  );
}
