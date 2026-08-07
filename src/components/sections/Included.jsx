import { Check } from 'lucide-react';
import Reveal from '../motion/Reveal';
import { Container, Section, SectionHeading } from '../ui/Section';

const ITEMS = [
  {
    title: 'Configuração do domínio',
    text: 'a compra do endereço é feita por você, no seu nome, com o meu acompanhamento em cada passo',
  },
  { title: 'Certificado de segurança', text: 'abre protegido, sem aviso de risco' },
  {
    title: 'Preparada para o Google',
    text: 'estrutura, títulos e descrições corretos, com acompanhamento detalhado de visitas',
  },
  { title: 'Botão de WhatsApp', text: 'sempre visível, em todas as telas' },
  { title: 'Redação dos textos', text: 'escrevo junto com você o que vai na página' },
  { title: '30 dias de ajustes', text: 'após a publicação, sem custo adicional' },
];

export default function Included() {
  return (
    <Section id="incluido" labelledBy="incluido-titulo" className="pt-0">
      <Container>
        <Reveal className="rounded-panel border border-line bg-surface p-[clamp(2rem,5vw,3.875rem)]">
          <SectionHeading
            id="incluido-titulo"
            eyebrow="Sempre incluído"
            title="Nada disso é cobrado à parte"
            className="mb-[2.125rem]"
          />
          <ul className="m-0 grid list-none grid-cols-1 gap-x-[2.875rem] p-0 md:grid-cols-2">
            {ITEMS.map((item) => (
              <li
                key={item.title}
                className="flex items-start gap-3.5 border-b border-hairline py-[1.0625rem] text-[0.99rem]"
              >
                <Check size={17} strokeWidth={2.4} className="mt-[5px] shrink-0 text-accent" />
                <span>
                  <b className="font-semibold">{item.title}</b>
                  <span className="text-muted">: {item.text}</span>
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </Section>
  );
}
