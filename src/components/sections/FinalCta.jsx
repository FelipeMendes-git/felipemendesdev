import { useRef } from 'react';
import { gsap, SplitText, useGSAP, MOTION, EASE_OUT } from '../../lib/gsap';
import { CONTACT } from '../../lib/site';
import Botao from '../ui/Botao';
import { LinkedInIcon, WhatsAppIcon } from '../ui/BrandIcons';
import Container from '../ui/Container';

/**
 * O fechamento: um painel escuro que se abre a partir de uma janela
 * arredondada até tomar a tela inteira. O conteúdo é recortado junto com o
 * fundo, então o texto claro nunca aparece sobre o claro da página. Quando o
 * painel termina de abrir, o título chega letra por letra.
 */
export default function FinalCta() {
  const root = useRef(null);
  const panel = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        const q = gsap.utils.selector(root);
        // aria: 'none' porque o <h2> já tem o texto inteiro no aria-label.
        SplitText.create(q('[data-letras]'), {
          type: 'chars',
          mask: 'chars',
          aria: 'none',
          onSplit: (self) =>
            gsap.from(self.chars, {
              yPercent: 115,
              rotation: 10,
              duration: 1.1,
              stagger: { each: 0.035, from: 'start' },
              ease: EASE_OUT,
              scrollTrigger: { trigger: root.current, start: 'top 45%', toggleActions: 'play none none reverse' },
            }),
        });

        gsap.from(q('[data-some]'), {
          autoAlpha: 0,
          y: 30,
          duration: 1,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: root.current, start: 'top 30%', toggleActions: 'play none none reverse' },
        });

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
      data-tone="tinta"
      data-tone-start="top 12%"
      aria-labelledby="contato-titulo"
    >
      {/* As cores são fixadas aqui: o painel já é escuro enquanto a página ainda está clara. */}
      <div
        ref={panel}
        className="bg-tinta text-papel will-change-[clip-path] [--accent:var(--marca)] [--fg-muted:var(--bruma)]"
      >
        <Container className="flex min-h-svh flex-col justify-center py-[clamp(6rem,14vw,11rem)]">
          <h2
            id="contato-titulo"
            aria-label="Vamos conversar."
            className="titulo text-[clamp(3.4rem,12vw,12.5rem)]"
          >
            <span data-letras className="block">
              Vamos
            </span>
            <span data-letras className="block text-accent">
              conversar.
            </span>
          </h2>

          <div className="mt-[clamp(2.5rem,5vw,4rem)] grid items-end gap-x-12 gap-y-10 lg:grid-cols-12">
            <p
              data-some
              className="max-w-[32rem] text-[clamp(1.15rem,1.7vw,1.45rem)] leading-[1.45] text-fg-muted lg:col-span-6"
            >
              Gostou de algum projeto ou quer trocar uma ideia sobre desenvolvimento e IA? Me chame no
              LinkedIn ou no WhatsApp.
            </p>

            <div data-some className="relative flex flex-wrap items-center gap-4 lg:col-span-5 lg:col-start-8">
              <Botao href={CONTACT.linkedin} icon={LinkedInIcon} size="lg">
                Chamar no LinkedIn
              </Botao>
              <Botao href={CONTACT.whatsapp} icon={WhatsAppIcon} size="lg" variante="contorno">
                WhatsApp
              </Botao>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
