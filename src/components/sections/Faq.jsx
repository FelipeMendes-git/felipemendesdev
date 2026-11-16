import { useRef, useState } from 'react';
import { Plus } from 'lucide-react';
import { gsap, useGSAP, MOTION, revealLines } from '../../lib/gsap';
import { CONTACT } from '../../lib/site';
import { cn } from '../../lib/cn';
import Container from '../ui/Container';

/** As mesmas perguntas estão no JSON-LD do index.html (FAQPage). Manter em sincronia. */
const QUESTIONS = [
  {
    q: 'Qual o investimento?',
    a: 'Depende da extensão da página e de quanto conteúdo precisa ser criado do zero. No diagnóstico eu entendo o escopo e apresento um valor fechado, sem custo adicional depois.',
  },
  {
    q: 'Preciso entender de tecnologia?',
    a: 'Não. Você me conta sobre o seu negócio em linguagem comum. Domínio, hospedagem, segurança e publicação são responsabilidade minha, do início ao fim.',
  },
  {
    q: 'Em quanto tempo fica pronta?',
    a: 'Em geral até 7 dias a partir da aprovação do desenho. O prazo exato é combinado antes de começar e eu o cumpro.',
  },
  {
    q: 'Consigo alterar o conteúdo depois?',
    a: 'Sim. Textos, imagens e valores ficam sob seu controle, e eu deixo uma orientação gravada de como alterar. Nos primeiros 30 dias, qualquer ajuste é por minha conta.',
  },
  {
    q: 'Existe mensalidade?',
    a: 'Da minha parte, não. Seguem apenas os custos que qualquer página no ar tem: o domínio (o endereço do site) e a hospedagem. O domínio é adquirido por você e fica registrado no seu nome, e eu acompanho a compra do começo ao fim. Mostro os valores exatos antes de fechar.',
  },
  {
    q: 'E se eu não aprovar o resultado?',
    a: 'Você vê a proposta visual completa antes de eu programar. Refinamos nessa etapa quantas vezes for necessário. Nada é publicado sem a sua aprovação.',
  },
];

function Item({ question, answer, open, onToggle, index }) {
  const buttonId = `duvida-botao-${index}`;
  const panelId = `duvida-painel-${index}`;

  return (
    <div className="border-b border-current/20">
      <h3 className="m-0 text-[clamp(1.25rem,1.9vw,1.6rem)] font-semibold leading-[1.2] tracking-[-0.015em]">
        <button
          type="button"
          id={buttonId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="group flex w-full items-center justify-between gap-6 py-6 text-left"
        >
          {question}
          <span
            aria-hidden="true"
            className={cn(
              'grid size-10 shrink-0 place-items-center rounded-full border border-current/25 transition-[rotate,background-color,border-color,color] duration-500 ease-out-expo motion-reduce:transition-none',
              'group-hover:border-current/60',
              open && 'rotate-45 border-brasa bg-brasa text-noite',
            )}
          >
            <Plus size={18} strokeWidth={1.8} />
          </span>
        </button>
      </h3>

      {/* Altura animada com grid 0fr → 1fr: funciona em todo navegador, sem medir nada. */}
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        inert={!open}
        className={cn(
          'grid transition-[grid-template-rows] duration-500 ease-out-expo motion-reduce:transition-none',
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
      >
        <div className="overflow-hidden">
          <p className="max-w-[40rem] pb-7 pr-14 leading-[1.6] text-fg-muted">{answer}</p>
        </div>
      </div>
    </div>
  );
}

export default function Faq() {
  const root = useRef(null);
  const [openIndex, setOpenIndex] = useState(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => revealLines(gsap.utils.selector(root)('[data-reveal]')));
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="duvidas"
      data-tone="osso"
      aria-labelledby="duvidas-titulo"
      className="py-[clamp(5rem,12vw,10rem)]"
    >
      <Container className="grid gap-x-12 gap-y-12 lg:grid-cols-12">
        <div className="self-start lg:sticky lg:top-[calc(var(--header-h)+3rem)] lg:col-span-5">
          <h2 id="duvidas-titulo" data-reveal className="titulo text-[clamp(2.9rem,6.4vw,6.25rem)]">
            Dúvidas <em className="block">de sempre.</em>
          </h2>
          <p className="mt-7 max-w-[24rem] text-[clamp(1.05rem,1.3vw,1.2rem)] text-fg-muted">
            Não achou a sua?{' '}
            <a
              href={CONTACT.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-fg underline decoration-current/35 decoration-1 underline-offset-[6px] transition-[text-decoration-color] duration-300 hover:decoration-current"
            >
              Pergunte no WhatsApp
              <span className="sr-only"> (abre em nova aba)</span>
            </a>
            .
          </p>
        </div>

        <div className="border-t border-current/20 lg:col-span-7">
          {QUESTIONS.map((item, index) => (
            <Item
              key={item.q}
              index={index}
              question={item.q}
              answer={item.a}
              open={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
