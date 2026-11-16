import { useRef } from 'react';
import { Check, Plus } from 'lucide-react';
import { gsap, useGSAP, DESKTOP, MOTION, revealLines } from '../../lib/gsap';
import { WhatsAppIcon } from '../ui/BrandIcons';
import Phone, { StatusBar } from '../ui/Phone';
import Container from '../ui/Container';

/** A ordem é o argumento da seção; por isso aqui a numeração tem sentido. */
const STEPS = [
  { title: 'A promessa', text: 'O que você resolve e para quem, em três segundos.' },
  { title: 'A prova', text: 'Trabalhos, números, depoimentos. Quem afirma sem provar é ignorado.' },
  { title: 'Os benefícios', text: 'O que muda na vida de quem contrata, na língua do cliente.' },
  { title: 'As objeções', text: '“É caro?” “Demora?” Respondidas antes de virarem desculpa.' },
  { title: 'A chamada', text: 'Um botão só, sempre à vista. Ninguém procura como falar com você.' },
];

/** Opacidade dos passos inativos: 3:1 ou mais em qualquer tom da página, o mínimo para texto grande. */
const DIM = 0.5;

/** Bloco da página em miniatura, com o contorno que marca o passo atual. */
function Block({ children, className }) {
  return (
    <div data-block className={`relative ${className}`}>
      <span
        data-ring
        className="pointer-events-none absolute -inset-[1.8cqw] rounded-[4.6cqw] border-[0.7cqw] border-brasa opacity-0"
      />
      {children}
    </div>
  );
}

/** Uma landing page genérica, montada na ordem da anatomia. */
function MiniPage() {
  return (
    <div
      data-mini-page
      className="flex flex-col gap-[6.5cqw] bg-papel px-[5.5cqw] pb-[8cqw] pt-[3cqw] text-noite will-change-transform"
    >
      <Block className="flex flex-col gap-[3.2cqw]">
        <span className="flex items-center gap-[1.8cqw] text-[3.5cqw] font-medium">
          <span className="size-[4.2cqw] rounded-full bg-noite" />
          sua marca
        </span>
        <p className="titulo text-[9cqw]">
          O que você resolve, <em className="[--accent:var(--brasa-funda)]">em uma frase.</em>
        </p>
        <p className="text-[3.7cqw] leading-snug text-cinza">Para quem é, e por que agora.</p>
        <span className="inline-flex w-max items-center gap-[1.6cqw] rounded-full bg-brasa px-[4.6cqw] py-[2.5cqw] text-[3.4cqw] font-semibold">
          <WhatsAppIcon className="size-[3.6cqw]" />
          Falar no WhatsApp
        </span>
        <span className="mt-[1cqw] block h-[30cqw] rounded-[3.5cqw] bg-[linear-gradient(135deg,#d2c8b5,#e9e1d2)]" />
      </Block>

      <Block className="flex flex-col gap-[2.6cqw]">
        <span className="text-[4.4cqw] leading-none tracking-[0.12em] text-brasa-funda">★★★★★</span>
        <p className="titulo text-[5.4cqw]">Clientes que já confiam</p>
        <div className="grid grid-cols-3 gap-[2cqw]">
          {['Depoimentos', 'Trabalhos', 'Garantia'].map((label) => (
            <span
              key={label}
              className="flex h-[17cqw] items-end rounded-[2.6cqw] bg-areia/70 p-[2cqw] text-[2.8cqw] font-medium"
            >
              {label}
            </span>
          ))}
        </div>
      </Block>

      <Block className="flex flex-col gap-[2.4cqw]">
        <p className="titulo text-[5.4cqw]">O que muda para você</p>
        {['Atendimento no mesmo dia', 'Sem fila, sem burocracia', 'Resultado que dá para ver'].map((item) => (
          <span key={item} className="flex items-center gap-[2.2cqw] text-[3.6cqw]">
            <Check className="size-[4.4cqw] shrink-0 text-brasa-funda" strokeWidth={2.4} />
            {item}
          </span>
        ))}
      </Block>

      <Block className="flex flex-col">
        <p className="titulo mb-[1.6cqw] text-[5.4cqw]">Dúvidas</p>
        {['É caro?', 'Demora?', 'E se não der certo?'].map((question) => (
          <span
            key={question}
            className="flex items-center justify-between border-b-[0.3cqw] border-noite/15 py-[2.3cqw] text-[3.6cqw]"
          >
            {question}
            <Plus className="size-[4cqw]" strokeWidth={1.8} />
          </span>
        ))}
      </Block>

      <Block className="flex flex-col items-start gap-[3.6cqw] rounded-[3.5cqw] bg-noite p-[5.5cqw] text-osso">
        <p className="titulo text-[7cqw]">Pronto para começar?</p>
        <span className="inline-flex items-center gap-[1.8cqw] rounded-full bg-brasa px-[4.8cqw] py-[2.7cqw] text-[3.6cqw] font-semibold text-noite">
          <WhatsAppIcon className="size-[3.9cqw]" />
          Falar no WhatsApp
        </span>
      </Block>
    </div>
  );
}

export default function Anatomy() {
  const root = useRef(null);
  const pin = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(root);

      mm.add(MOTION, () => revealLines(q('[data-reveal]')));

      mm.add({ desktop: DESKTOP, motion: MOTION }, ({ conditions }) => {
        if (!conditions.motion) return;

        const steps = q('[data-step]');
        // Só o título esmaece: o número continua legível (contraste AA).
        const heads = q('[data-step-head] h3');
        const descs = q('[data-step-desc]');
        const blocks = q('[data-block]');
        const rings = q('[data-ring]');
        const [page] = q('[data-mini-page]');
        const [notice] = q('[data-notice]');
        const screen = page.parentElement;
        const last = steps.length - 1;

        // Quanto a página em miniatura precisa rolar para o bloco i caber na tela.
        const scrollFor = (index) => {
          const block = blocks[index];
          const room = screen.clientHeight * 0.94;
          return Math.max(0, block.offsetTop + block.offsetHeight - room);
        };

        // Estado inicial: passo 1 ativo, só o primeiro bloco montado.
        if (conditions.desktop) {
          gsap.set(heads.slice(1), { opacity: DIM });
          gsap.set(descs.slice(1), { autoAlpha: 0 });
        } else {
          gsap.set(steps.slice(1), { autoAlpha: 0 });
        }
        gsap.set(blocks.slice(1), { autoAlpha: 0, y: 28 });
        gsap.set(rings[0], { opacity: 1 });
        gsap.set(notice, { autoAlpha: 0, yPercent: -140 });

        const tl = gsap.timeline({
          defaults: { duration: 0.5, ease: 'power2.inOut' },
          scrollTrigger: {
            trigger: pin.current,
            start: 'top top',
            end: () => `+=${window.innerHeight * 3.4}`,
            pin: true,
            scrub: 0.7,
            invalidateOnRefresh: true,
          },
        });

        for (let index = 1; index <= last; index += 1) {
          const at = index;
          if (conditions.desktop) {
            tl.to(heads[index - 1], { opacity: DIM }, at)
              .to(heads[index], { opacity: 1 }, at)
              .to(descs[index - 1], { autoAlpha: 0, y: -10 }, at)
              .fromTo(descs[index], { y: 10 }, { autoAlpha: 1, y: 0 }, at + 0.2);
          } else {
            tl.to(steps[index - 1], { autoAlpha: 0, y: -12 }, at).fromTo(
              steps[index],
              { y: 12 },
              { autoAlpha: 1, y: 0 },
              at + 0.2,
            );
          }

          tl.to(rings[index - 1], { opacity: 0 }, at)
            .to(blocks[index], { autoAlpha: 1, y: 0, ease: 'power3.out' }, at)
            .to(rings[index], { opacity: 1 }, at + 0.25)
            .to(page, { y: () => -scrollFor(index) }, at);
        }

        // A conversa começa: chega a mensagem.
        tl.to(rings[last], { opacity: 0 }, last + 1)
          .to(notice, { autoAlpha: 1, yPercent: 0, ease: 'back.out(1.4)', duration: 0.6 }, last + 1)
          .to({}, { duration: 0.6 });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="anatomia"
      data-tone="noite"
      aria-labelledby="anatomia-titulo"
      className="pt-[clamp(4rem,9vw,8rem)]"
    >
      <Container>
        <h2 id="anatomia-titulo" data-reveal className="titulo max-w-[14ch] text-[clamp(3rem,8vw,8rem)]">
          A ordem que faz <em className="block">dizer sim.</em>
        </h2>
      </Container>

      <div
        ref={pin}
        className="py-[clamp(3rem,8vw,6rem)] motion-safe:flex motion-safe:h-svh motion-safe:items-center motion-safe:pb-[clamp(1rem,3vh,2rem)] motion-safe:pt-[calc(var(--header-h)+clamp(0.5rem,2vh,1.5rem))]"
      >
        <Container className="grid items-center gap-x-12 gap-y-6 motion-safe:max-lg:h-full motion-safe:max-lg:grid-rows-[minmax(0,1fr)_auto] lg:grid-cols-12">
          <ol className="anatomy-list flex flex-col gap-8 motion-safe:lg:gap-[clamp(0.3rem,1.2vh,0.9rem)] lg:col-span-7">
            {STEPS.map((step, index) => (
              <li key={step.title} data-step>
                <div data-step-head className="flex items-baseline gap-4 lg:gap-6">
                  <span className="serif w-9 shrink-0 text-[clamp(1.1rem,1.5vw,1.45rem)] italic leading-none text-accent lg:w-11">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="titulo text-[clamp(2.1rem,4.6vw,4.4rem)]">{step.title}</h3>
                </div>
                <p
                  data-step-desc
                  className="anatomy-desc mt-3 max-w-[30rem] pl-[3.25rem] text-[clamp(1.05rem,1.4vw,1.25rem)] leading-[1.45] text-fg-muted lg:pl-[4.25rem]"
                >
                  {step.text}
                </p>
              </li>
            ))}
          </ol>

          <div className="relative flex justify-center max-lg:row-start-1 motion-safe:max-lg:h-full lg:col-span-4 lg:col-start-9">
            <Phone className="h-[min(74svh,44rem)] motion-safe:max-lg:h-full motion-reduce:max-lg:w-[min(19rem,78vw)] motion-reduce:max-lg:h-auto">
              <div className="flex h-full flex-col bg-papel">
                <StatusBar className="text-noite" />
                <div className="relative min-h-0 flex-1 overflow-hidden">
                  <MiniPage />
                </div>
              </div>
              <div
                data-notice
                className="absolute inset-x-[3.6cqw] top-[12cqw] z-20 rounded-[5cqw] bg-noite px-[3.8cqw] py-[3.2cqw] text-osso shadow-[0_3cqw_9cqw_-2cqw_rgb(0_0_0/55%)]"
              >
                <div className="flex items-center gap-[2.4cqw]">
                  <span className="grid size-[8.4cqw] shrink-0 place-items-center rounded-[2.4cqw] bg-brasa text-noite">
                    <WhatsAppIcon className="size-[58%]" />
                  </span>
                  <span className="flex-1 text-[3.9cqw] font-semibold">Nova mensagem</span>
                  <span className="text-[3.2cqw] text-nevoa">agora</span>
                </div>
                <p className="mt-[1.6cqw] text-[3.7cqw] leading-[1.35]">Oi! Vi sua página e quero um orçamento.</p>
              </div>
            </Phone>
            <p className="sr-only">
              Ilustração: um celular mostrando uma landing page montada nessa ordem, terminando com
              uma nova mensagem de cliente no WhatsApp.
            </p>
          </div>
        </Container>
      </div>
    </section>
  );
}
