import { useRef } from 'react';
import { Lock, Search } from 'lucide-react';
import { gsap, useGSAP, DESKTOP, MOTION, revealLines } from '../../lib/gsap';
import { WhatsAppIcon } from '../ui/BrandIcons';
import { cn } from '../../lib/cn';
import Container from '../ui/Container';

/* ---------------------------------------------------------------------
   Um desenho pequeno para cada item. São ilustração (aria-hidden): o
   título e a frase do cartão dizem tudo.
   --------------------------------------------------------------------- */

function ArteDominio() {
  return (
    <span className="flex w-full items-center gap-2 rounded-full bg-current/10 px-3.5 py-2.5 text-[0.9rem] font-medium">
      <Lock size={14} strokeWidth={2.2} />
      <span className="truncate">suaempresa.com.br</span>
    </span>
  );
}

function ArteCadeado() {
  return (
    <span className="grid size-[4.5rem] place-items-center rounded-full border-2 border-current">
      <Lock size={30} strokeWidth={1.8} />
    </span>
  );
}

function ArteBusca() {
  return (
    <span className="flex w-full flex-col gap-2">
      <span className="flex items-center gap-2 rounded-full border border-current/40 px-3 py-2 text-[0.85rem]">
        <Search size={14} strokeWidth={2.2} />
        seu serviço na sua cidade
      </span>
      <span className="ml-3 h-2 w-[70%] rounded-full bg-current" />
      <span className="ml-3 h-2 w-[46%] rounded-full bg-current/35" />
    </span>
  );
}

function ArteBotao() {
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-noite px-3.5 py-2.5 text-[0.8rem] font-semibold text-osso sm:px-4 sm:py-3 sm:text-[0.95rem]">
      <WhatsAppIcon size={17} />
      Falar no WhatsApp
    </span>
  );
}

function ArteTexto() {
  return <span className="serif text-[4.6rem] italic leading-none tracking-[-0.04em] [--opsz:30]">Aa</span>;
}

function ArteTrinta() {
  return <span className="titulo text-[4.8rem] leading-none">30</span>;
}

const ITENS = [
  { titulo: 'Domínio configurado', texto: 'O endereço fica no seu nome. Eu acompanho a compra.', Arte: ArteDominio, cor: 'bg-papel text-noite' },
  { titulo: 'Certificado de segurança', texto: 'Abre protegida, sem aviso de risco.', Arte: ArteCadeado, cor: 'bg-mata text-osso ring-1 ring-osso/15' },
  { titulo: 'Preparada para o Google', texto: 'Títulos, descrições e medição de visitas.', Arte: ArteBusca, cor: 'bg-papel text-noite' },
  { titulo: 'Botão de WhatsApp', texto: 'Sempre à vista, em todas as telas.', Arte: ArteBotao, cor: 'bg-brasa text-noite' },
  { titulo: 'Textos escritos com você', texto: 'A gente escreve junto o que vai na página.', Arte: ArteTexto, cor: 'bg-papel text-noite' },
  { titulo: '30 dias de ajustes', texto: 'Depois de publicar, sem custo adicional.', Arte: ArteTrinta, cor: 'bg-mata text-osso ring-1 ring-osso/15' },
];

/**
 * "Nada cobrado à parte", em seis cartões. No desktop eles chegam
 * empilhados e se abrem em leque conforme a página rola; no celular viram
 * uma grade simples.
 */
export default function Included() {
  const root = useRef(null);
  const leque = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(root);

      mm.add(MOTION, () => revealLines(q('[data-reveal]')));

      mm.add(`${MOTION} and ${DESKTOP}`, () => {
        const cartoes = q('[data-cartao]');
        const meio = (cartoes.length - 1) / 2;
        // Distância entre cartões: o leque ocupa a largura disponível, sem passar dela.
        const passo = () => Math.min(leque.current.clientWidth / (cartoes.length + 0.6), 232);

        gsap.set(cartoes, { xPercent: -50, transformOrigin: '50% 130%' });

        gsap
          .timeline({
            defaults: { ease: 'power2.out' },
            scrollTrigger: { trigger: leque.current, start: 'top 88%', end: 'top 22%', scrub: 0.7, invalidateOnRefresh: true },
          })
          .fromTo(
            cartoes,
            { x: 0, y: (index) => index * -5, rotation: (index) => (index - meio) * 1.5 },
            {
              x: (index) => (index - meio) * passo(),
              y: (index) => (index - meio) ** 2 * 11,
              rotation: (index) => (index - meio) * 5,
            },
          );
      });

      mm.add(`${MOTION} and (max-width: 63.999rem)`, () => {
        gsap.from(q('[data-cartao]'), {
          autoAlpha: 0,
          y: 40,
          duration: 0.9,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: { trigger: leque.current, start: 'top 82%', once: true },
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="incluido"
      data-tone="noite"
      aria-labelledby="incluido-titulo"
      className="overflow-clip py-[clamp(5rem,12vw,10rem)]"
    >
      <Container>
        <h2 id="incluido-titulo" data-reveal className="titulo text-[clamp(3.2rem,9vw,9rem)]">
          Tudo incluso. <em className="block">Nada cobrado à parte.</em>
        </h2>

        <ul
          ref={leque}
          className="mt-[clamp(3rem,7vw,6rem)] grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 motion-safe:lg:relative motion-safe:lg:block motion-safe:lg:h-[25rem]"
        >
          {ITENS.map(({ titulo, texto, Arte, cor }) => (
            <li
              key={titulo}
              data-cartao
              className="will-change-transform motion-safe:lg:absolute motion-safe:lg:left-1/2 motion-safe:lg:top-0 motion-safe:lg:w-[15rem]"
            >
              <div
                className={cn(
                  'flex h-full min-h-[15.5rem] flex-col justify-between gap-6 rounded-[1.4rem] p-4 shadow-[0_30px_60px_-28px_rgb(0_0_0/80%)] transition-[translate] duration-500 ease-out-expo hover:-translate-y-4 sm:p-5 lg:h-[21rem]',
                  cor,
                )}
              >
                <div aria-hidden="true" className="flex min-h-[4.75rem] items-start">
                  <Arte />
                </div>
                <div>
                  <h3 className="titulo text-[clamp(1.05rem,1.5vw,1.3rem)] leading-[0.98]">{titulo}</h3>
                  <p className="mt-2 text-[0.98rem] leading-[1.35]">{texto}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
