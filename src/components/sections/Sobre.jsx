import { useRef } from 'react';
import { gsap, SplitText, useGSAP, MOTION } from '../../lib/gsap';
import Rabisco from '../ui/Rabisco';
import Container from '../ui/Container';

/**
 * Quem é o Felipe, em duas cenas. Na primeira, duas faixas de texto gigante
 * correm em sentidos opostos enquanto quatro fichas caem numa pilha, uma por
 * fato. Na segunda, o parágrafo de apresentação acende palavra por palavra
 * conforme a página rola.
 */
const FICHAS = [
  { rotulo: 'Hoje', texto: 'Desenvolvedor full-stack na Uniube, em Uberaba (MG).' },
  { rotulo: 'Formação', texto: 'Graduado em Análise e Desenvolvimento de Sistemas.' },
  { rotulo: 'No dia a dia', texto: 'IA para escrever código e IA integrada aos sistemas.' },
  { rotulo: 'Como trabalho', texto: 'Spec-driven development: a especificação vem antes do código.' },
];

/** Onde cada ficha pousa na pilha: deslocamento em % do cartão e giro em graus. */
const POUSO = [
  { x: -8, y: -128, giro: -4 },
  { x: 7, y: -44, giro: 3 },
  { x: -5, y: 40, giro: -2 },
  { x: 6, y: 124, giro: 3 },
];

const FRASE_A = 'sistemas de ponta a ponta';
const FRASE_B = 'IA no código e dentro do produto';

/** A mesma frase repetida, para a faixa nunca acabar na tela. */
function Faixa({ texto, className }) {
  return (
    <div aria-hidden="true" className="overflow-clip py-[0.08em] motion-reduce:hidden">
      <p data-faixa className={`titulo w-max whitespace-nowrap will-change-transform ${className}`}>
        {[0, 1, 2, 3].map((copia) => (
          <span key={copia}>
            {texto}
            <span className="mx-[0.35em] inline-block size-[0.16em] rounded-full bg-current align-middle" />
          </span>
        ))}
      </p>
    </div>
  );
}

export default function Sobre() {
  const root = useRef(null);
  const pin = useRef(null);
  const bio = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION, () => {
        const q = gsap.utils.selector(root);
        const [faixaA, faixaB] = q('[data-faixa]');
        const fichas = q('[data-ficha]');

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: pin.current, start: 'top top', end: '+=220%', pin: true, scrub: 0.6 },
        });

        // As faixas andam a cena inteira, uma para cada lado.
        tl.fromTo(faixaA, { xPercent: 2 }, { xPercent: -42, duration: 4 }, 0).fromTo(
          faixaB,
          { xPercent: -44 },
          { xPercent: -4, duration: 4 },
          0,
        );

        // As fichas caem na pilha, uma depois da outra.
        fichas.forEach((ficha, index) => {
          const pouso = POUSO[index];
          tl.fromTo(
            ficha,
            { autoAlpha: 0, xPercent: pouso.x * 3, yPercent: pouso.y + 140, rotation: pouso.giro * 4, scale: 0.7 },
            {
              autoAlpha: 1,
              xPercent: pouso.x,
              yPercent: pouso.y,
              rotation: pouso.giro,
              scale: 1,
              duration: 0.75,
              ease: 'back.out(1.5)',
            },
            0.35 + index * 0.7,
          );
        });

        tl.from(q('[data-rabisco] path'), { drawSVG: 0, duration: 0.5, ease: 'power2.inOut' }, 3.2);

        // O parágrafo começa apagado e acende palavra por palavra com a rolagem.
        // O texto inteiro continua legível para leitores de tela (aria padrão do SplitText).
        SplitText.create(bio.current, {
          type: 'words',
          autoSplit: true,
          onSplit: (self) =>
            gsap.fromTo(
              self.words,
              { opacity: 0.16 },
              {
                opacity: 1,
                ease: 'none',
                stagger: 0.08,
                scrollTrigger: { trigger: bio.current, start: 'top 82%', end: 'bottom 48%', scrub: 0.4 },
              },
            ),
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="sobre" data-tone="tinta" aria-labelledby="sobre-titulo">
      <h2 id="sobre-titulo" className="sr-only">
        Sobre mim
      </h2>

      <div
        ref={pin}
        className="relative flex flex-col justify-center gap-[clamp(1.5rem,7vh,5rem)] py-[clamp(4rem,10vw,7rem)] motion-safe:h-svh motion-safe:py-0"
      >
        <Faixa texto={FRASE_A} className="text-[clamp(4.5rem,15vw,15.5rem)] text-accent" />

        <ul className="z-10 mx-auto flex w-[min(24rem,82vw)] list-none flex-col gap-3 motion-safe:absolute motion-safe:left-1/2 motion-safe:top-1/2 motion-safe:block motion-safe:-translate-x-1/2 motion-safe:-translate-y-1/2">
          {FICHAS.map((ficha) => (
            <li
              key={ficha.rotulo}
              data-ficha
              className="rounded-[1.1rem] bg-folha p-4 text-tinta shadow-[0_30px_60px_-24px_rgb(3_6_30/85%)] will-change-transform motion-safe:absolute motion-safe:inset-x-0 motion-safe:top-1/2 motion-safe:-mt-12"
            >
              <p className="mao text-[1.45rem] text-caneta">{ficha.rotulo}</p>
              <p className="mt-1 text-[1.05rem] font-medium leading-[1.3]">{ficha.texto}</p>
            </li>
          ))}

          <li aria-hidden="true" className="motion-reduce:hidden">
            <Rabisco forma="visto" className="absolute -right-8 -top-[18.5rem] w-20 sm:-right-20 sm:-top-[20rem] sm:w-28" />
          </li>
        </ul>

        <Faixa texto={FRASE_B} className="text-[clamp(4.5rem,15vw,15.5rem)]" />
      </div>

      <Container className="py-[clamp(5rem,12vw,10rem)]">
        <p
          ref={bio}
          className="titulo max-w-[22ch] text-[clamp(1.9rem,4.6vw,4.4rem)] leading-[1.06] tracking-[-0.03em] lg:max-w-[26ch]"
        >
          Na Uniube, já entreguei sozinho sistemas completos: da modelagem do banco à tela que a pessoa
          usa. Uso IA todos os dias, para programar melhor e como parte do que entrego.
        </p>
      </Container>
    </section>
  );
}
