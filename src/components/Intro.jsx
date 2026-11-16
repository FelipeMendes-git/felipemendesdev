import { useRef, useState } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { INTRO, TEM_INTRO } from '../lib/intro';

/**
 * Abertura: um contador rápido até 100 e duas cortinas que sobem, a clara e
 * logo atrás a de destaque, revelando o topo. Dura menos de dois segundos e
 * só toca para quem chega no começo da página (ver lib/intro.js).
 */
export default function Intro() {
  const root = useRef(null);
  const [fim, setFim] = useState(!TEM_INTRO);

  useGSAP(
    () => {
      if (fim) return;

      const conta = { valor: 0 };
      const numero = root.current.querySelector('[data-numero]');
      const contagem = INTRO - 0.55;

      gsap
        .timeline({ onComplete: () => setFim(true) })
        .to(conta, {
          valor: 100,
          duration: contagem,
          ease: 'power2.inOut',
          onUpdate: () => {
            numero.textContent = String(Math.round(conta.valor)).padStart(2, '0');
          },
        })
        .fromTo('[data-barra]', { scaleX: 0 }, { scaleX: 1, duration: contagem, ease: 'power2.inOut' }, 0)
        // A cortina clara sai primeiro; a de destaque vem logo atrás, como um relâmpago.
        .to('[data-cortina]', { yPercent: -100, duration: 0.95, ease: 'expo.inOut', stagger: { each: 0.1, from: 'end' } }, contagem + 0.05);
    },
    { scope: root, dependencies: [fim] },
  );

  if (fim) return null;

  return (
    <div ref={root} aria-hidden="true" className="fixed inset-0 z-[90]">
      <div data-cortina className="absolute inset-0 bg-brasa" />
      <div data-cortina className="absolute inset-0 flex flex-col justify-between bg-osso p-[var(--gutter)] text-noite">
        <p className="titulo text-[1.2rem] leading-none [--accent:var(--brasa-funda)] [--opsz:12] sm:text-[1.3rem] [&_em]:font-semibold">
          Felipe <em>Mendes</em>
        </p>
        <div>
          <p className="serif text-[clamp(7rem,24vw,20rem)] italic leading-[0.78] tracking-[-0.05em] [--opsz:30]">
            <span data-numero>00</span>
          </p>
          <div className="mt-[clamp(1rem,2.5vw,2rem)] h-[3px] bg-noite/15">
            <div data-barra className="h-full origin-left bg-noite" />
          </div>
        </div>
      </div>
    </div>
  );
}
