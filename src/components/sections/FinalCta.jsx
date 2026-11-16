import { useRef } from 'react';
import { gsap, useGSAP, MOTION, drawScribbles, revealLines } from '../../lib/gsap';
import WhatsAppButton from '../ui/WhatsAppButton';
import Rabisco from '../ui/Rabisco';
import Container from '../ui/Container';

/**
 * O fechamento: um painel escuro que se abre a partir de uma janela
 * arredondada até tomar a tela inteira. O conteúdo é recortado junto com o
 * fundo, então o texto claro nunca aparece sobre o claro da página.
 */
export default function FinalCta() {
  const root = useRef(null);
  const panel = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        const q = gsap.utils.selector(root);
        revealLines(q('[data-reveal]'), { start: 'top 70%' });
        drawScribbles(q('[data-rabisco]'), { start: 'top 75%', delay: 0.5 });

        gsap.fromTo(
          panel.current,
          // Recuos menores que as margens do conteúdo: o painel cresce sem cortar o texto.
          { clipPath: 'inset(11% 2.5% 11% 2.5% round 1.75rem)' },
          {
            clipPath: 'inset(0% 0% 0% 0% round 0rem)',
            ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top 92%', end: 'top 12%', scrub: 0.6 },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="contato"
      data-tone="noite"
      data-tone-start="top 12%"
      aria-labelledby="contato-titulo"
    >
      {/* As cores são fixadas aqui: o painel já é escuro enquanto a página ainda está clara. */}
      <div
        ref={panel}
        className="bg-noite text-osso will-change-[clip-path] [--accent:var(--brasa)] [--fg-muted:var(--nevoa)]"
      >
        <Container className="flex min-h-svh flex-col justify-center py-[clamp(6rem,14vw,11rem)]">
          <h2 id="contato-titulo" data-reveal className="titulo text-[clamp(3.6rem,12.5vw,13rem)]">
            Vamos <em className="block">conversar?</em>
          </h2>

          <div className="mt-[clamp(2.5rem,5vw,4rem)] grid items-end gap-x-12 gap-y-10 lg:grid-cols-12">
            <p className="max-w-[32rem] text-[clamp(1.15rem,1.7vw,1.45rem)] leading-[1.45] text-fg-muted lg:col-span-6">
              Me conte o que você vende. Eu mostro, sem custo, o que uma landing page pode fazer pelo seu
              negócio.
            </p>

            <div className="relative flex flex-col items-start gap-4 lg:col-span-5 lg:col-start-8">
              <div aria-hidden="true" className="absolute -top-[5.5rem] left-[58%] hidden w-28 lg:block">
                <p className="serif -rotate-6 text-[1.35rem] italic leading-none text-accent">é só clicar</p>
                <Rabisco forma="seta" className="mt-1 w-20 -scale-x-100 rotate-[70deg]" />
              </div>
              <WhatsAppButton size="lg" />
              <p className="text-fg-muted">Respondo no mesmo dia.</p>
            </div>
          </div>

          <p className="mt-[clamp(3.5rem,7vw,6rem)] max-w-[44rem] border-t border-osso/15 pt-6 text-[1rem] leading-[1.55] text-fg-muted">
            O domínio (o endereço do site) é comprado por você e fica no seu nome. Eu acompanho a compra e
            cuido da configuração. Atendo de Uberaba (MG) para todo o Brasil.
          </p>
        </Container>
      </div>
    </section>
  );
}
