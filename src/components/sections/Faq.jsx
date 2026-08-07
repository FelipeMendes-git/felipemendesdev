import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Plus } from 'lucide-react';
import Reveal from '../motion/Reveal';
import { Container, Section, SectionHeading } from '../ui/Section';

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

function Item({ question, answer, isOpen, onToggle, panelId, buttonId }) {
  const reduced = useReducedMotion();

  return (
    <div className="border-b border-hairline">
      <h3 className="m-0">
        <button
          type="button"
          id={buttonId}
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex w-full items-center justify-between gap-5 bg-transparent px-1 py-[1.5625rem] text-left text-[1.02rem] font-medium text-ink transition-colors duration-300 ease-smooth hover:text-accent-hi"
        >
          {question}
          <motion.span
            aria-hidden="true"
            animate={{ rotate: isOpen ? 135 : 0 }}
            transition={reduced ? { duration: 0 } : { duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="flex shrink-0 text-accent"
          >
            <Plus size={17} strokeWidth={2} />
          </motion.span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduced ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="m-0 pb-[1.6875rem] pl-1 pr-[3.75rem] text-[1rem] text-muted">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <Section id="duvidas" labelledBy="duvidas-titulo">
      <Container>
        <Reveal>
          <SectionHeading
            id="duvidas-titulo"
            eyebrow="Dúvidas"
            title={
              <>
                O que costumam <span className="italic-accent">me perguntar.</span>
              </>
            }
          />
        </Reveal>

        <div className="mx-auto max-w-[48.75rem] border-t border-hairline">
          {QUESTIONS.map((item, index) => (
            <Reveal key={item.q} delay={(index % 3) * 0.06}>
              <Item
                question={item.q}
                answer={item.a}
                isOpen={openIndex === index}
                onToggle={() => setOpenIndex(openIndex === index ? null : index)}
                buttonId={`faq-botao-${index}`}
                panelId={`faq-painel-${index}`}
              />
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
