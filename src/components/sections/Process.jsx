import Reveal from '../motion/Reveal';
import { Container, Section, SectionHeading } from '../ui/Section';

const STEPS = [
  {
    title: 'Diagnóstico',
    text: 'Conversamos sobre o que você vende, para quem e qual ação a página precisa gerar.',
  },
  {
    title: 'Proposta visual',
    text: 'Apresento o desenho completo da página antes de escrever uma linha de código.',
  },
  {
    title: 'Refinamento',
    text: 'Ajustamos texto, imagem e ordem das seções até estar exatamente como você quer.',
  },
  {
    title: 'Publicação',
    text: 'Coloco no ar, configuro o endereço e entrego o acompanhamento de resultados.',
  },
];

export default function Process() {
  return (
    <Section id="processo" labelledBy="processo-titulo">
      <Container>
        <Reveal>
          <SectionHeading
            id="processo-titulo"
            eyebrow="O processo"
            title={
              <>
                Do primeiro contato <span className="italic-accent">ao ar.</span>
              </>
            }
          >
            Você não precisa entender de tecnologia. Precisa apenas conhecer o próprio negócio. O
            resto conduzo eu.
          </SectionHeading>
        </Reveal>

        <ol className="m-0 grid list-none grid-cols-1 gap-7 p-0 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {STEPS.map((step, index) => (
            <Reveal
              as="li"
              key={step.title}
              delay={index * 0.08}
              className="group/step border-t border-line pt-[1.625rem] transition-colors duration-500 ease-smooth hover:border-t-accent"
            >
              <p className="eyebrow m-0 mb-4 text-faint transition-colors duration-500 ease-smooth group-hover/step:text-accent-hi">
                Etapa {String(index + 1).padStart(2, '0')}
              </p>
              <h3 className="mb-2.5 text-[1.12rem]">{step.title}</h3>
              <p className="m-0 text-[0.95rem] text-muted">{step.text}</p>
            </Reveal>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
