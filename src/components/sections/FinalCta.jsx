import Button from '../ui/Button';
import { WhatsAppIcon } from '../ui/BrandIcons';
import Magnetic from '../motion/Magnetic';
import Reveal from '../motion/Reveal';
import { Container, Section } from '../ui/Section';
import { CONTACT, SITE } from '../../lib/site';

export default function FinalCta() {
  return (
    <Section id="proposta" labelledBy="proposta-titulo" className="pt-0">
      <Container>
        <Reveal className="relative flex flex-col items-center gap-6 overflow-hidden rounded-panel border border-line bg-[linear-gradient(180deg,var(--surface),var(--bg))] px-[clamp(1.5rem,5vw,3.875rem)] py-[clamp(3.125rem,8vw,6rem)] text-center shadow-lift">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-[62%] left-1/2 size-[42.5rem] -translate-x-1/2 bg-[radial-gradient(circle,var(--accent-soft),transparent_62%)]"
          />

          <span className="eyebrow relative text-accent-hi">Diagnóstico sem compromisso</span>

          <h2 id="proposta-titulo" className="relative max-w-[17ch] text-[clamp(2rem,5.2vw,3.4rem)] font-medium">
            Sua próxima página pode ser a que <span className="italic-accent">fecha negócio.</span>
          </h2>

          <p className="relative m-0 max-w-[50ch] text-[clamp(1rem,2vw,1.14rem)] text-muted">
            Me conte o que você vende e eu apresento, sem custo, o que uma landing page bem
            construída pode fazer pelo seu negócio.
          </p>

          <div className="relative w-full sm:w-auto">
            <Magnetic>
              <Button href={CONTACT.whatsapp} className="w-full sm:w-auto">
                <WhatsAppIcon size={16} />
                Falar no WhatsApp
              </Button>
            </Magnetic>
          </div>

          <p className="relative m-0 mt-1 max-w-[58ch] border-t border-hairline pt-[1.375rem] text-[0.85rem] leading-relaxed text-muted">
            O domínio (o endereço do site) é adquirido por você e fica registrado no seu nome. Eu
            acompanho a compra passo a passo e cuido de toda a configuração.
          </p>

          <p className="relative m-0 text-[0.85rem] text-faint">
            Resposta no mesmo dia · {SITE.city}, {SITE.state} · atendimento em todo o Brasil
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}
