import { useRef } from 'react';
import { gsap, useGSAP, MOTION } from '../../lib/gsap';
import { WhatsAppIcon } from '../ui/BrandIcons';
import Rabisco from '../ui/Rabisco';

/**
 * A frase que resume a venda, em duas faixas de texto gigante que correm em
 * sentidos opostos conforme a página rola. No meio, o resultado que o
 * cliente quer: mensagens chegando, empilhadas uma a uma.
 */
const MENSAGENS = [
  { de: 'Mariana', hora: '14:02', texto: 'Oi! Vi o anúncio de vocês. Ainda tem horário nesta semana?' },
  { de: 'Carlos', hora: '14:07', texto: 'Boa tarde! Pode me passar um orçamento?' },
  { de: 'Patrícia', hora: '14:11', texto: 'Vim pelo site. Vocês atendem aos sábados?' },
  { de: 'Rafael', hora: '14:16', texto: 'Quero fechar. Como faço o pagamento?' },
];

/** Onde cada mensagem pousa na pilha: deslocamento em % do cartão e giro em graus. */
const POUSO = [
  { x: -8, y: -122, giro: -4 },
  { x: 7, y: -42, giro: 3 },
  { x: -5, y: 38, giro: -2 },
  { x: 6, y: 118, giro: 3 },
];

const FRASE_A = 'seu anúncio traz as pessoas';
const FRASE_B = 'a página decide se elas viram clientes';

/** A mesma frase repetida, para a faixa nunca acabar na tela. */
function Faixa({ texto, className }) {
  return (
    <div aria-hidden="true" className="overflow-clip py-[0.08em] motion-reduce:hidden">
      <p data-faixa className={`w-max whitespace-nowrap will-change-transform ${className}`}>
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

export default function Manifesto() {
  const root = useRef(null);
  const pin = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION, () => {
        const q = gsap.utils.selector(root);
        const [faixaA, faixaB] = q('[data-faixa]');
        const cartoes = q('[data-mensagem]');

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

        // As mensagens caem na pilha, uma depois da outra.
        cartoes.forEach((cartao, index) => {
          const pouso = POUSO[index];
          tl.fromTo(
            cartao,
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
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} data-tone="noite" aria-labelledby="manifesto-titulo">
      <h2 id="manifesto-titulo" className="sr-only">
        Seu anúncio traz as pessoas. A página decide se elas viram clientes.
      </h2>

      <div
        ref={pin}
        className="relative flex flex-col justify-center gap-[clamp(1.5rem,7vh,5rem)] py-[clamp(4rem,10vw,7rem)] motion-safe:h-svh motion-safe:py-0"
      >
        <Faixa
          texto={FRASE_A}
          className="serif text-[clamp(4.5rem,15.5vw,16rem)] italic leading-[0.95] tracking-[-0.035em] text-accent [--opsz:30]"
        />

        {/* Sem movimento, a frase aparece parada, inteira. */}
        <p
          aria-hidden="true"
          className="titulo px-[var(--gutter)] text-[clamp(2.6rem,7vw,6rem)] motion-safe:hidden"
        >
          Seu anúncio traz as pessoas. A página decide se elas viram <em>clientes.</em>
        </p>

        <div
          aria-hidden="true"
          className="z-10 mx-auto flex w-[min(24rem,82vw)] flex-col gap-3 motion-safe:absolute motion-safe:left-1/2 motion-safe:top-1/2 motion-safe:block motion-safe:-translate-x-1/2 motion-safe:-translate-y-1/2"
        >
          {MENSAGENS.map((mensagem) => (
            <div
              key={mensagem.de}
              data-mensagem
              className="rounded-[1.4rem] bg-papel p-4 text-noite shadow-[0_30px_60px_-24px_rgb(0_0_0/75%)] will-change-transform motion-safe:absolute motion-safe:inset-x-0 motion-safe:top-1/2 motion-safe:-mt-12"
            >
              <div className="flex items-center gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-[0.7rem] bg-noite text-osso">
                  <WhatsAppIcon size={19} />
                </span>
                <span className="min-w-0 flex-1 font-semibold leading-tight">{mensagem.de}</span>
                <span className="text-[0.85rem] tabular-nums text-cinza">{mensagem.hora}</span>
              </div>
              <p className="mt-2 text-[1rem] leading-[1.35]">{mensagem.texto}</p>
            </div>
          ))}

          <Rabisco
            forma="visto"
            className="absolute -right-8 -top-[17.5rem] w-20 motion-reduce:hidden sm:-right-20 sm:-top-[19rem] sm:w-28"
          />
        </div>

        <Faixa texto={FRASE_B} className="titulo text-[clamp(4.5rem,15.5vw,16rem)] leading-[0.9]" />

        <p className="sr-only">Ilustração: mensagens de novos clientes chegando no WhatsApp, uma depois da outra.</p>
      </div>
    </section>
  );
}
