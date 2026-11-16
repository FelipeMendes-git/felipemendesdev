import { useRef } from 'react';
import { gsap, useGSAP, DESKTOP, MOTION, drawScribbles, revealLines } from '../../lib/gsap';
import Rabisco from '../ui/Rabisco';
import Container from '../ui/Container';
import trilha from '../../assets/educai/trilha.webp';
import conversa from '../../assets/educai/conversa.webp';

/**
 * Uma prévia curta do EducAI, que ainda vai ser lançado: um parágrafo e duas
 * telas. As janelas se abrem de baixo para cima, como persianas, e andam em
 * ritmos diferentes enquanto a seção cruza a tela.
 */
const TELAS = [
  { src: conversa, legenda: 'Conversa com o Tito, o tutor', className: 'w-[88%]', passo: [70, -50] },
  { src: trilha, legenda: 'Trilha de etapas de um tema', className: 'ml-auto -mt-[12%] w-[62%]', passo: [190, -120] },
];

const STACK = ['React', 'TypeScript', 'PHP', 'PostgreSQL', 'Docker'];

export default function Educai() {
  const root = useRef(null);
  const telas = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(root);

      mm.add(MOTION, () => {
        revealLines(q('[data-reveal]'));
        drawScribbles(q('[data-rabisco]'));

        // As etiquetas da stack pulam para o lugar, em ordem aleatória.
        gsap.from(q('[data-etiqueta]'), {
          scale: 0,
          rotation: () => gsap.utils.random(-25, 25),
          duration: 0.7,
          stagger: { each: 0.06, from: 'random' },
          ease: 'back.out(2.2)',
          scrollTrigger: { trigger: q('[data-etiqueta]')[0], start: 'top 90%', once: true },
        });

        q('[data-janela]').forEach((janela, index) => {
          const gatilho = { trigger: janela.parentElement, start: 'top 88%', once: true };
          gsap.fromTo(
            janela,
            { clipPath: 'inset(100% 0% 0% 0% round 1rem)' },
            {
              clipPath: 'inset(0% 0% 0% 0% round 1rem)',
              duration: 1.3,
              delay: index * 0.15,
              ease: 'expo.out',
              scrollTrigger: gatilho,
            },
          );
          gsap.from(janela.querySelector('img'), {
            yPercent: 18,
            duration: 1.5,
            delay: index * 0.15,
            ease: 'expo.out',
            scrollTrigger: gatilho,
          });
        });
      });

      // No desktop, cada janela anda no próprio ritmo.
      mm.add(`${MOTION} and ${DESKTOP}`, () => {
        q('[data-cartao]').forEach((cartao, index) => {
          const [inicio, fim] = TELAS[index].passo;
          gsap.fromTo(
            cartao,
            { y: inicio },
            {
              y: fim,
              ease: 'none',
              scrollTrigger: { trigger: telas.current, start: 'top bottom', end: 'bottom top', scrub: true },
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
      id="educai"
      data-tone="papel"
      aria-labelledby="educai-titulo"
      className="overflow-clip py-[clamp(5rem,12vw,10rem)]"
    >
      <Container className="grid items-center gap-x-12 gap-y-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="mao text-[clamp(1.5rem,2vw,1.9rem)] text-accent">em breve</p>
          <h2 id="educai-titulo" className="titulo mt-1 text-[clamp(3.4rem,8vw,7.5rem)]">
            <span className="relative inline-block">
              EducAI
              <Rabisco forma="onda" className="absolute -bottom-[0.16em] left-0 w-full" />
            </span>
          </h2>
          <p className="mt-8 max-w-[30rem] text-[clamp(1.1rem,1.5vw,1.3rem)] leading-[1.5]">
            Plataforma de estudos para crianças com um tutor de IA que faz perguntas em vez de entregar a
            resposta.
          </p>

          <ul className="mt-7 flex max-w-[30rem] flex-wrap gap-2">
            {STACK.map((item) => (
              <li
                key={item}
                data-etiqueta
                className="rounded-full bg-tinta px-3.5 py-1.5 text-[0.92rem] font-medium text-papel will-change-transform"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        <ul ref={telas} className="lg:col-span-7">
          {TELAS.map((tela) => (
            <li key={tela.src} data-cartao className={`relative will-change-transform ${tela.className}`}>
              <div data-janela className="janela will-change-[clip-path]">
                <div aria-hidden="true" className="janela-barra">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="overflow-hidden">
                  <img
                    src={tela.src}
                    alt={`Tela do EducAI: ${tela.legenda.toLowerCase()}`}
                    width="1600"
                    height="1031"
                    loading="lazy"
                    decoding="async"
                    className="block h-auto w-full"
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
