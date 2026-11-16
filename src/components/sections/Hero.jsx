import { useEffect, useRef, useState } from 'react';
import { gsap, SplitText, useGSAP, MOTION, EASE_OUT } from '../../lib/gsap';
import { ligarFluido } from '../../lib/fluido';
import { INTRO, TEM_INTRO } from '../../lib/intro';
import { TOPO } from '../../lib/topo';
import { CONTACT } from '../../lib/site';
import { cn } from '../../lib/cn';
import Botao from '../ui/Botao';
import { LinkedInIcon } from '../ui/BrandIcons';
import Rabisco from '../ui/Rabisco';
import Container from '../ui/Container';

/** Linha do título: quem se move na rolagem é o invólucro; a máscara corta as letras que sobem. */
function Linha({ children, marca }) {
  return (
    <span {...{ [marca]: '' }} className="block will-change-transform">
      <span className="split-line-mask block overflow-clip">
        <span data-hero-letras className="block whitespace-nowrap">
          {children}
        </span>
      </span>
    </span>
  );
}

export default function Hero() {
  const root = useRef(null);
  const canvas = useRef(null);
  const tela = useRef(null);
  // Enquanto o WebGL não pinta o primeiro quadro, a imagem comum ocupa a tela do aparelho.
  const [fluido, setFluido] = useState(false);

  useEffect(() => {
    if (!window.matchMedia(MOTION).matches) return undefined;

    const desligar = ligarFluido({
      canvas: canvas.current,
      palco: root.current,
      tela: tela.current,
      imagens: [TOPO.frente, TOPO.fundo],
      aoPintar: () => setFluido(true),
      aoFalhar: () => setFluido(false),
    });
    return () => desligar?.();
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        MOTION,
        () => {
          const q = gsap.utils.selector(root);
          const espera = TEM_INTRO ? INTRO : 0.15;

          // As letras sobem uma a uma, cada linha por trás da própria máscara.
          // aria: 'none' porque o <h1> já tem o texto inteiro no aria-label.
          SplitText.create(q('[data-hero-letras]'), {
            type: 'chars',
            aria: 'none',
            onSplit: (self) =>
              gsap.from(self.chars, {
                yPercent: 118,
                rotation: 8,
                duration: 1.15,
                stagger: 0.025,
                delay: espera,
                ease: EASE_OUT,
              }),
          });

          gsap
            .timeline({ delay: espera, defaults: { ease: EASE_OUT } })
            // Sem esmaecer: a imagem do aparelho é pintada desde o primeiro quadro (conta para o LCP).
            .from(q('[data-hero-aparelho]'), { y: 140, duration: 1.6 }, 0.15)
            // A passada de marca-texto risca a terceira linha antes de as letras chegarem nela.
            .from(q('[data-hero-marca]'), { scaleX: 0, duration: 0.85, ease: 'power3.inOut' }, 0.3)
            .from(q('[data-hero-some]'), { autoAlpha: 0, y: 22, duration: 1.1, stagger: 0.1 }, 0.6)
            .from(q('[data-rabisco] path'), { drawSVG: 0, duration: 0.7, stagger: 0.2, ease: 'power2.inOut' }, 1.5);

          // Na rolagem, as linhas do título se afastam para lados opostos e o
          // aparelho sobe um pouco mais rápido. Só translação: nada de
          // perspectiva nem escala, que distorcem e engasgam.
          const saida = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true };
          gsap.to(q('[data-linha-1]'), { xPercent: -7, ease: 'none', scrollTrigger: saida });
          gsap.to(q('[data-linha-2]'), { xPercent: 10, ease: 'none', scrollTrigger: saida });
          gsap.to(q('[data-linha-3]'), { xPercent: -4, ease: 'none', scrollTrigger: saida });
          gsap.to(q('[data-hero-paralaxe]'), { yPercent: -12, ease: 'none', scrollTrigger: saida });
        },
        root,
      );

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} data-tone="tinta" aria-labelledby="hero-titulo" className="relative overflow-clip">
      <canvas ref={canvas} aria-hidden="true" className="pointer-events-none absolute inset-0 size-full" />

      <Container className="relative z-10 grid min-h-svh items-center gap-x-8 gap-y-14 pb-[clamp(3rem,8vh,6rem)] pt-[calc(var(--header-h)+clamp(1.5rem,5vh,4rem))] lg:grid-cols-12">
        <div className="lg:col-span-8">
          <h1
            id="hero-titulo"
            aria-label="Desenvolvedor full-stack e IA aplicada."
            className="titulo text-[clamp(2.7rem,11.6vw,6.5rem)] lg:text-[clamp(4rem,min(8vw,17.5vh),9.75rem)]"
          >
            <Linha marca="data-linha-1">Desenvolvedor</Linha>
            <Linha marca="data-linha-2">full-stack</Linha>
            <span data-linha-3 className="mt-[0.16em] block will-change-transform">
              <span className="relative inline-block px-[0.16em] pb-[0.06em] text-[0.56em] leading-[1.15] text-tinta">
                <span
                  data-hero-marca
                  className="absolute inset-0 origin-left rounded-[0.08em_0.16em_0.1em_0.14em] bg-marca"
                />
                <span className="split-line-mask relative block overflow-clip">
                  <span data-hero-letras className="block whitespace-nowrap">
                    e IA aplicada.
                  </span>
                </span>
              </span>
            </span>
          </h1>

          <p
            data-hero-some
            className="mt-[clamp(1.5rem,3vh,2.25rem)] max-w-[34rem] text-[clamp(1.1rem,1.5vw,1.3rem)] leading-[1.5] text-fg-muted"
          >
            Sou Felipe Mendes. Construo sistemas web de ponta a ponta, do banco de dados à interface, e
            uso IA tanto para desenvolver quanto dentro dos produtos.
          </p>

          <div data-hero-some className="mt-[clamp(1.5rem,3.5vh,2.5rem)] flex flex-wrap items-center gap-x-9 gap-y-5">
            <Botao href="#projetos" size="lg">
              Ver projetos
            </Botao>
            <a
              href={CONTACT.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 font-medium underline decoration-current/35 decoration-1 underline-offset-[7px] transition-[text-decoration-color] duration-300 hover:decoration-current"
            >
              <LinkedInIcon size={17} />
              LinkedIn
              <span className="sr-only"> (abre em nova aba)</span>
            </a>
          </div>
        </div>

        <div className="flex justify-center lg:col-span-4 lg:justify-end">
          <div data-hero-paralaxe className="relative will-change-transform">
            <div data-hero-aparelho className="aparelho">
              <div ref={tela} className="aparelho-tela">
                <img
                  src={TOPO.frente}
                  alt=""
                  width="752"
                  height="1572"
                  fetchPriority="high"
                  className={cn(
                    'size-full object-cover object-top transition-opacity duration-500',
                    fluido && 'opacity-0',
                  )}
                />
              </div>
            </div>

            {/* Só para quem tem mouse: o convite para brincar com a mancha. */}
            <div
              aria-hidden="true"
              data-hero-some
              className="absolute -left-[64%] top-[47%] hidden w-[50%] -rotate-6 motion-safe:lg:pointer-fine:block"
            >
              <p className="mao text-[clamp(1.5rem,2.1vw,2rem)] text-accent">passe o mouse</p>
              <Rabisco forma="seta" className="ml-[22%] mt-2 w-[70%]" />
            </div>

            <p className="sr-only">
              Ilustração: um celular mostra um painel com as avaliações da semana e um relatório gerado
              por IA. A mancha que acompanha o cursor revela, por baixo, o código que faz a tela funcionar.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
