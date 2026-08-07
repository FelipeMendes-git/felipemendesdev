import { BarChart3, MessageCircle, Shield, Smartphone, Target, Zap } from 'lucide-react';
import Reveal from '../motion/Reveal';
import { Container, Section, SectionHeading } from '../ui/Section';

const REASONS = [
  {
    icon: Target,
    title: 'Um único caminho',
    text: 'Sem menu, sem atalhos, sem distração. Cada elemento existe para aproximar o visitante do contato.',
  },
  {
    icon: Zap,
    title: 'Velocidade absoluta',
    text: 'Cada segundo de espera derruba a conversão. A página abre praticamente antes do dedo sair da tela.',
  },
  {
    icon: Smartphone,
    title: 'Pensada no celular',
    text: 'É de lá que vem quase todo mundo. O desenho começa pela tela pequena, nunca como adaptação.',
  },
  {
    icon: Shield,
    title: 'Autoridade imediata',
    text: 'Apresentação de alto padrão comunica solidez antes da primeira palavra ser lida. Confiança se transmite pelo visual.',
  },
  {
    icon: MessageCircle,
    title: 'Contato sem atrito',
    text: 'WhatsApp sempre ao alcance. Quando a pessoa decide, ela fala com você em dois toques.',
  },
  {
    icon: BarChart3,
    title: 'Resultado mensurável',
    text: 'Você acompanha quantas pessoas chegaram e quantas entraram em contato. Investimento com número, não com achismo.',
  },
];

export default function Why() {
  return (
    <Section id="porque" labelledBy="porque-titulo">
      <Container>
        <Reveal>
          <SectionHeading
            id="porque-titulo"
            eyebrow="Por que uma landing page"
            title={
              <>
                Todo visitante que se perde <span className="italic-accent">custa dinheiro.</span>
              </>
            }
          >
            Um site comum convida a passear. Uma landing page conduz. Ela existe para levar uma
            pessoa específica a tomar uma decisão específica, e nada mais.
          </SectionHeading>
        </Reveal>

        <ul className="grid list-none grid-cols-1 gap-px overflow-hidden rounded-[20px] border border-hairline bg-hairline p-0 sm:grid-cols-2 lg:grid-cols-3">
          {REASONS.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <Reveal
                as="li"
                key={reason.title}
                delay={(index % 3) * 0.08}
                className="group/cell relative overflow-hidden bg-bg px-8 py-[2.375rem] transition-colors duration-500 ease-smooth hover:bg-surface"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-smooth group-hover/cell:opacity-100 bg-[radial-gradient(28.75rem_circle_at_var(--mx,50%)_var(--my,50%),var(--accent-soft),transparent_62%)]"
                />
                <span className="mb-6 grid size-[42px] place-items-center rounded-xl border border-line bg-surface-2 text-accent transition-[border-color,transform] duration-500 ease-out-soft group-hover/cell:-translate-y-[3px] group-hover/cell:border-accent-line">
                  <Icon size={19} strokeWidth={1.8} />
                </span>
                <h3 className="relative mb-[0.6875rem] text-[1.16rem]">{reason.title}</h3>
                <p className="relative m-0 text-[0.97rem] text-muted">{reason.text}</p>
              </Reveal>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
