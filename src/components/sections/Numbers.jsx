import { useRef } from 'react';
import { gsap, useGSAP, MOTION } from '../../lib/gsap';
import Container from '../ui/Container';

/**
 * O combinado, em quatro números grandes. São compromissos do serviço, não
 * estatística: prazo, foco, feitio e garantia de ajustes.
 */
const NUMEROS = [
  { valor: 7, unidade: 'dias', texto: 'até a página estar no ar' },
  { valor: 1, unidade: 'objetivo', texto: 'por página: o seu contato' },
  { valor: 100, unidade: '%', texto: 'sob medida, nada de modelo pronto' },
  { valor: 30, unidade: 'dias', texto: 'de ajustes depois de publicar' },
];

export default function Numbers() {
  const root = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION, () => {
        const q = gsap.utils.selector(root);

        q('[data-numero]').forEach((bloco, index) => {
          const alvo = Number(bloco.dataset.numero);
          const visor = bloco.querySelector('[data-visor]');
          const conta = { valor: 0 };
          const gatilho = { trigger: bloco, start: 'top 88%', once: true };

          gsap.from(bloco.querySelector('[data-sobe]'), {
            yPercent: 105,
            duration: 1.1,
            delay: index * 0.08,
            ease: 'expo.out',
            scrollTrigger: gatilho,
          });
          gsap.to(conta, {
            valor: alvo,
            duration: 1.4,
            delay: index * 0.08,
            ease: 'power3.out',
            scrollTrigger: gatilho,
            onUpdate: () => {
              visor.textContent = Math.round(conta.valor);
            },
          });
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} data-tone="osso" aria-label="O combinado em números" className="pt-[clamp(5rem,12vw,10rem)]">
      <Container>
        <ul className="grid grid-cols-2 gap-x-[clamp(1rem,3vw,3rem)] gap-y-12 lg:grid-cols-4">
          {NUMEROS.map((numero) => (
            <li key={numero.texto} data-numero={numero.valor} className="border-t border-current/20 pt-5">
              <p className="titulo overflow-clip whitespace-nowrap pb-[0.06em] text-[clamp(3.6rem,9vw,9rem)] leading-[0.8]">
                <span data-sobe className="block will-change-transform">
                  {/* O contador troca o texto muitas vezes por segundo: leitores de tela ouvem só o valor final. */}
                  <span aria-hidden="true" data-visor>
                    {numero.valor}
                  </span>
                  <span className="sr-only">{numero.valor}</span>
                  <em className="ml-[0.08em] text-[0.3em] leading-none">{numero.unidade}</em>
                </span>
              </p>
              <p className="mt-4 max-w-[15rem] leading-[1.4] text-fg-muted">{numero.texto}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
