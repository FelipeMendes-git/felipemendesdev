import { useRef } from 'react';
import { gsap, useGSAP, DESKTOP, MOTION, drawScribbles, revealLines } from '../../lib/gsap';
import { CONCEITOS } from '../../lib/conceitos';
import Rabisco from '../ui/Rabisco';
import Container from '../ui/Container';

/**
 * Vitrine: seis páginas-conceito, uma para cada tipo de negócio e nenhuma com
 * nome de empresa, para mostrar o que uma landing page pode ser. Cada janela rola a própria página conforme o
 * visitante passa por ela, e as três colunas andam em velocidades diferentes.
 */

/** Quanto cada coluna anda durante a passagem pela seção, em px: [início, fim]. */
const PASSO = [
  [0, -70],
  [150, -40],
  [60, -150],
];

export default function Vitrine() {
  const root = useRef(null);
  const grade = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(root);

      mm.add(MOTION, () => {
        revealLines(q('[data-reveal]'));
        drawScribbles(q('[data-rabisco]'));

        // A página dentro de cada janela rola enquanto a janela cruza a tela.
        q('[data-janela]').forEach((janela) => {
          const pagina = janela.querySelector('img');
          gsap.to(pagina, {
            y: () => -(pagina.offsetHeight - janela.offsetHeight) * 0.62,
            ease: 'none',
            scrollTrigger: {
              trigger: janela,
              start: 'top 88%',
              end: 'bottom 12%',
              scrub: 0.5,
              invalidateOnRefresh: true,
            },
          });
        });
      });

      // Só com três colunas: cada uma no seu ritmo.
      mm.add(`${MOTION} and ${DESKTOP}`, () => {
        q('[data-cartao]').forEach((cartao, index) => {
          const [inicio, fim] = PASSO[index % 3];
          gsap.fromTo(
            cartao,
            { y: inicio },
            {
              y: fim,
              ease: 'none',
              scrollTrigger: { trigger: grade.current, start: 'top bottom', end: 'bottom top', scrub: true },
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
      id="vitrine"
      data-tone="noite"
      aria-labelledby="vitrine-titulo"
      className="py-[clamp(5rem,12vw,10rem)]"
    >
      <Container>
        <div className="grid gap-x-12 gap-y-6 lg:grid-cols-12 lg:items-end">
          <h2
            id="vitrine-titulo"
            data-reveal
            className="titulo text-[clamp(3.4rem,10vw,10rem)] lg:col-span-8"
          >
            Vitrine <em className="block">de conceitos</em>
          </h2>
          <p className="max-w-[26rem] text-[clamp(1.05rem,1.3vw,1.2rem)] text-fg-muted lg:col-span-4">
            Modelos criados para demonstração, sem marca nem cliente real. A sua é desenhada do zero,{' '}
            <span className="relative inline-block whitespace-nowrap text-fg">
              do seu jeito
              <Rabisco forma="onda" className="absolute -bottom-[0.45em] left-0 w-full" />
            </span>
            .
          </p>
        </div>

        <ul
          ref={grade}
          className="mt-[clamp(3rem,7vw,6rem)] grid grid-cols-2 gap-x-[clamp(0.75rem,2.4vw,2.25rem)] gap-y-[clamp(1.75rem,4vw,3.5rem)] lg:grid-cols-3 lg:pb-16"
        >
          {CONCEITOS.map((conceito) => (
            <li key={conceito.slug} data-cartao className="will-change-transform">
              <figure className="group m-0">
                <div
                  data-janela
                  className="relative aspect-[390/660] overflow-hidden rounded-[clamp(0.9rem,1.6vw,1.6rem)] bg-mata ring-1 ring-osso/15 transition-[box-shadow] duration-500 group-hover:ring-2 group-hover:ring-brasa"
                >
                  <img
                    src={conceito.imagem}
                    alt={`Página-conceito para ${conceito.ramo.toLowerCase()}`}
                    width={Math.round(conceito.largura * 1.6)}
                    height={Math.round(conceito.altura * 1.6)}
                    loading="lazy"
                    decoding="async"
                    className="block h-auto w-full will-change-transform"
                  />
                </div>
                <figcaption className="mt-3 flex flex-wrap items-baseline justify-between gap-x-3 sm:mt-4">
                  <span className="titulo text-[clamp(0.95rem,1.4vw,1.3rem)]">{conceito.ramo}</span>
                  <span className="serif text-[clamp(0.95rem,1.3vw,1.2rem)] italic text-accent">conceito</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
