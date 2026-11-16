import { useEffect, useRef, useState } from 'react';
import { gsap, SplitText, useGSAP, MOTION, EASE_OUT } from '../../lib/gsap';
import { ligarFluido } from '../../lib/fluido';
import { INTRO, TEM_INTRO } from '../../lib/intro';
import { TOPO } from '../../lib/topo';
import { cn } from '../../lib/cn';
import WhatsAppButton from '../ui/WhatsAppButton';
import Rabisco from '../ui/Rabisco';
import Container from '../ui/Container';

/** Linha do título: quem se move na rolagem é o invólucro; a máscara corta as letras que sobem. */
function Linha({ children, marca, className }) {
  return (
    <span {...{ [marca]: '' }} className="block will-change-transform">
      <span className="split-line-mask block overflow-clip">
        <span data-hero-letras className={cn('block whitespace-nowrap', className)}>
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
                stagger: 0.03,
                delay: espera,
                ease: EASE_OUT,
              }),
          });

          gsap
            .timeline({ delay: espera, defaults: { ease: EASE_OUT } })
            // Sem esmaecer: a imagem do aparelho é pintada desde o primeiro quadro (conta para o LCP).
            .from(q('[data-hero-aparelho]'), { y: 140, duration: 1.6 }, 0.15)
            .from(q('[data-hero-some]'), { autoAlpha: 0, y: 22, duration: 1.1, stagger: 0.1 }, 0.6)
            .from(q('[data-rabisco] path'), { drawSVG: 0, duration: 0.7, stagger: 0.2, ease: 'power2.inOut' }, 1.5);

          // Na rolagem, as linhas do título se afastam para lados opostos e o
          // aparelho sobe um pouco mais rápido. Só translação: nada de
          // perspectiva nem escala, que distorcem e engasgam.
          const saida = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true };
          gsap.to(q('[data-linha-1]'), { xPercent: -9, ease: 'none', scrollTrigger: saida });
          gsap.to(q('[data-linha-2]'), { xPercent: 12, ease: 'none', scrollTrigger: saida });
          gsap.to(q('[data-linha-3]'), { xPercent: -5, ease: 'none', scrollTrigger: saida });
          gsap.to(q('[data-hero-paralaxe]'), { yPercent: -12, ease: 'none', scrollTrigger: saida });
        },
        root,
      );

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} data-tone="noite" aria-labelledby="hero-titulo" className="relative overflow-clip">
      <canvas ref={canvas} aria-hidden="true" className="pointer-events-none absolute inset-0 size-full" />

      <Container className="relative z-10 grid min-h-svh items-center gap-x-8 gap-y-14 pb-[clamp(3rem,8vh,6rem)] pt-[calc(var(--header-h)+clamp(1.5rem,5vh,4rem))] lg:grid-cols-12">
        <div className="lg:col-span-8">
          <h1
            id="hero-titulo"
            aria-label="Landing pages que vendem."
            className="titulo text-[clamp(4.2rem,min(14.2vw,22.5vh),15rem)]"
          >
            <Linha marca="data-linha-1">Landing</Linha>
            <Linha marca="data-linha-2">pages</Linha>
            <span data-linha-3 className="block will-change-transform">
              <span className="split-line-mask block overflow-clip">
                <em data-hero-letras className="block whitespace-nowrap text-[0.6em] leading-[1.05]">
                  que vendem.
                </em>
              </span>
            </span>
          </h1>

          <p
            data-hero-some
            className="mt-[clamp(1.5rem,3vh,2.25rem)] max-w-[31rem] text-[clamp(1.1rem,1.5vw,1.3rem)] leading-[1.5] text-fg-muted"
          >
            Páginas sob medida para quem investe em anúncio e não pode perder visitante.
          </p>

          <div data-hero-some className="mt-[clamp(1.5rem,3.5vh,2.5rem)] flex flex-wrap items-center gap-x-9 gap-y-5">
            <WhatsAppButton size="lg" />
            <a
              href="#vitrine"
              className="font-medium underline decoration-current/35 decoration-1 underline-offset-[7px] transition-[text-decoration-color] duration-300 hover:decoration-current"
            >
              Ver exemplos
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
                  width="624"
                  height="1350"
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
              <p className="serif text-[clamp(1.2rem,1.7vw,1.6rem)] italic leading-tight text-accent">passe o mouse</p>
              <Rabisco forma="seta" className="ml-[22%] mt-2 w-[70%]" />
            </div>

            <p className="sr-only">
              Ilustração: um celular mostra uma landing page com o título “Seu negócio, em uma página”. A
              mancha que acompanha o cursor revela, por baixo, a planta dela: a promessa, a chamada, a
              prova e as respostas.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
