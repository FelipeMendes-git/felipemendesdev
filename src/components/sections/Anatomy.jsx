import Reveal from '../motion/Reveal';
import { Container, Section, SectionHeading } from '../ui/Section';

/**
 * Aqui a numeração carrega informação real: a ordem dos blocos é o
 * argumento da seção, não enfeite.
 */
const STEPS = [
  {
    title: 'A promessa',
    text: 'Nos primeiros três segundos, o visitante entende o que você resolve e para quem. Sem rodeio e sem frase genérica.',
  },
  {
    title: 'A prova',
    text: 'O que sustenta a promessa: trabalhos, números, garantias, depoimentos. Quem afirma sem provar é ignorado.',
  },
  {
    title: 'Os benefícios',
    text: 'Não o que o produto é, mas o que muda na vida de quem contrata. Escrito na linguagem do cliente.',
  },
  {
    title: 'As objeções',
    text: '"É caro?", "demora?", "e se não der certo?". Respondidas na página, antes de virarem motivo para fechar a aba.',
  },
  {
    title: 'A chamada',
    text: 'Um pedido único, claro e repetido nos momentos certos. A pessoa nunca precisa procurar como falar com você.',
  },
];

export default function Anatomy() {
  return (
    <Section id="anatomia" labelledBy="anatomia-titulo">
      <Container>
        <Reveal>
          <SectionHeading
            id="anatomia-titulo"
            eyebrow="A anatomia"
            title={
              <>
                A ordem que faz a pessoa <span className="italic-accent">dizer sim.</span>
              </>
            }
          >
            Uma landing page que converte não é um amontoado de seções bonitas. É uma sequência. Cada
            bloco responde à pergunta que o visitante acabou de fazer na cabeça.
          </SectionHeading>
        </Reveal>

        <ol className="m-0 flex list-none flex-col overflow-hidden rounded-[20px] border border-hairline p-0">
          {STEPS.map((step, index) => (
            <Reveal
              as="li"
              key={step.title}
              className="group/row grid grid-cols-[3.375rem_1fr] items-center gap-x-[clamp(1rem,3vw,2.5rem)] gap-y-2 border-t border-hairline px-[clamp(1.375rem,3.4vw,2.5rem)] py-[clamp(1.5rem,3.4vw,2.375rem)] transition-colors duration-500 ease-smooth first:border-t-0 hover:bg-surface md:grid-cols-[5.75rem_1fr_1.15fr]"
            >
              <span
                aria-hidden="true"
                className="font-serif text-[clamp(1.6rem,3vw,2.2rem)] italic leading-none text-faint transition-colors duration-500 ease-smooth group-hover/row:text-accent"
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="text-[clamp(1.1rem,2.2vw,1.38rem)]">{step.title}</h3>
              <p className="col-start-2 m-0 text-[0.99rem] text-muted md:col-start-3">{step.text}</p>
            </Reveal>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
