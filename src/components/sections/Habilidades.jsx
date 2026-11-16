import { useRef } from 'react';
import { Bot, FlaskConical, Layers, MonitorSmartphone, Server, Smartphone } from 'lucide-react';
import { gsap, useGSAP, DESKTOP, MOTION, drawScribbles, revealLines } from '../../lib/gsap';
import { cn } from '../../lib/cn';
import Rabisco from '../ui/Rabisco';
import Container from '../ui/Container';

const CLARO = 'bg-folha text-tinta ring-1 ring-tinta/10';
const ESCURO = 'bg-tinta text-papel';

const ITENS = [
  {
    titulo: 'Front-end',
    lista: ['React', 'TypeScript', 'Tailwind CSS', 'GSAP e WebGL'],
    Icone: MonitorSmartphone,
    cor: CLARO,
  },
  {
    titulo: 'Back-end',
    lista: ['PHP', 'APIs RESTful', 'PostgreSQL', 'Autenticação e tokens'],
    Icone: Server,
    cor: ESCURO,
  },
  {
    titulo: 'IA aplicada',
    lista: ['Skills para o Claude', 'Relatórios automáticos', 'Tutores com LLM', 'IA no desenvolvimento'],
    Icone: Bot,
    cor: 'bg-marca text-tinta',
  },
  {
    titulo: 'Mobile',
    lista: ['App com webview', 'Notificações push', 'Firebase'],
    Icone: Smartphone,
    cor: CLARO,
  },
  {
    titulo: 'Qualidade',
    lista: ['Spec-driven development', 'PHPUnit', 'Vitest', 'Testing Library'],
    Icone: FlaskConical,
    cor: ESCURO,
  },
  {
    titulo: 'Infra e legado',
    lista: ['Docker', 'nginx', 'Migração de legado', 'reCAPTCHA e limites de uso'],
    Icone: Layers,
    cor: CLARO,
  },
];

/**
 * As habilidades em seis cartões. No desktop eles chegam empilhados e se
 * abrem em leque conforme a página rola; no celular viram uma grade simples.
 */
export default function Habilidades() {
  const root = useRef(null);
  const leque = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(root);

      mm.add(MOTION, () => {
        revealLines(q('[data-reveal]'));
        drawScribbles(q('[data-rabisco]'));
      });

      mm.add(`${MOTION} and ${DESKTOP}`, () => {
        const cartoes = q('[data-cartao]');
        const meio = (cartoes.length - 1) / 2;
        // Distância entre cartões: o leque ocupa a largura disponível, sem passar dela.
        const passo = () => Math.min(leque.current.clientWidth / (cartoes.length + 1.3), 232);

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
          )
          // Com o leque aberto, os itens de cada cartão entram em cascata.
          .from(
            q('[data-item]'),
            { autoAlpha: 0, x: -12, duration: 0.25, stagger: { each: 0.012, from: 'center' } },
            0.35,
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
      id="habilidades"
      data-tone="papel"
      aria-labelledby="habilidades-titulo"
      className="overflow-clip pb-[clamp(5rem,12vw,10rem)] pt-[clamp(1rem,3vw,3rem)]"
    >
      <Container>
        <h2 id="habilidades-titulo" data-reveal className="titulo text-[clamp(3.2rem,9vw,9rem)]">
          Com o que trabalho
        </h2>
        <p className="mt-6 max-w-[30rem] text-[clamp(1.05rem,1.3vw,1.2rem)] text-fg-muted">
          Do banco de dados à animação da interface, com{' '}
          <span className="relative inline-block whitespace-nowrap text-fg">
            IA no meio do caminho
            <Rabisco forma="onda" className="absolute -bottom-[0.45em] left-0 w-full" />
          </span>
          .
        </p>

        <ul
          ref={leque}
          className="mt-[clamp(3rem,7vw,6rem)] grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 motion-safe:lg:relative motion-safe:lg:block motion-safe:lg:h-[25rem]"
        >
          {ITENS.map(({ titulo, lista, Icone, cor }) => (
            <li
              key={titulo}
              data-cartao
              className="will-change-transform motion-safe:lg:absolute motion-safe:lg:left-1/2 motion-safe:lg:top-0 motion-safe:lg:w-[15rem]"
            >
              <div
                className={cn(
                  'flex h-full min-h-[15.5rem] flex-col justify-between gap-6 rounded-[1.4rem] p-4 shadow-[0_30px_60px_-30px_rgb(19_26_74/60%)] transition-[translate] duration-500 ease-out-expo hover:-translate-y-4 sm:p-5 lg:h-[21rem]',
                  cor,
                )}
              >
                <div>
                  <Icone aria-hidden="true" size={30} strokeWidth={1.7} />
                  <h3 className="titulo mt-4 text-[clamp(1.35rem,1.9vw,1.7rem)] leading-[1]">{titulo}</h3>
                </div>
                <ul className="flex flex-col gap-1.5 text-[0.98rem] leading-[1.3]">
                  {lista.map((item) => (
                    <li key={item} data-item className="border-t border-current/20 pt-1.5">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
