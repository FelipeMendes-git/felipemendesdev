import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Button from '../ui/Button';
import Magnetic from '../motion/Magnetic';
import Maquette from './Maquette';
import { Container } from '../ui/Section';
import { CONTACT } from '../../lib/site';

const EASE = [0.16, 1, 0.3, 1];

/** Linha do título revelada por máscara, como uma cortina subindo. */
function MaskedLine({ children, delay = 0, reduced }) {
  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <motion.span
        className="block"
        initial={reduced ? false : { y: '110%' }}
        animate={{ y: 0 }}
        transition={{ duration: 1.15, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

function Fade({ children, delay, reduced, className }) {
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

export default function Hero() {
  const reduced = useReducedMotion();

  return (
    <section
      aria-labelledby="hero-titulo"
      className="pb-[clamp(3.5rem,7vw,5.25rem)] pt-[clamp(7.875rem,17vh,11.125rem)] text-center"
    >
      <Container className="flex flex-col items-center gap-[1.625rem]">
        <Fade delay={0.36} reduced={reduced}>
          <span className="eyebrow inline-flex items-center gap-2.5 text-accent-hi">
            <span className="relative flex size-[5px]">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-70" />
              <span className="relative inline-flex size-[5px] rounded-full bg-accent" />
            </span>
            Agenda aberta para novos projetos
          </span>
        </Fade>

        <h1
          id="hero-titulo"
          className="max-w-[15ch] text-[clamp(2.5rem,6.6vw,4.9rem)] font-medium"
        >
          <MaskedLine reduced={reduced}>Uma página. Um objetivo:</MaskedLine>
          <MaskedLine delay={0.11} reduced={reduced}>
            <span className="italic-accent">converter.</span>
          </MaskedLine>
        </h1>

        <Fade delay={0.48} reduced={reduced}>
          <p className="m-0 max-w-[54ch] text-[clamp(1.04rem,2.1vw,1.22rem)] text-muted">
            Desenvolvo landing pages sob medida para empresas que investem em divulgação e não podem
            se dar ao luxo de perder um visitante. Apresentação impecável, carregamento imediato e um
            caminho claro até o contato.
          </p>
        </Fade>

        <Fade delay={0.6} reduced={reduced} className="flex w-full flex-wrap justify-center gap-3 sm:w-auto">
          <Magnetic className="w-full sm:w-auto">
            <Button href={CONTACT.whatsapp} className="w-full sm:w-auto">
              Solicitar proposta
              <ArrowRight size={16} strokeWidth={2} />
            </Button>
          </Magnetic>
          <Magnetic className="w-full sm:w-auto">
            <Button href="#anatomia" variant="line" className="w-full sm:w-auto">
              Ver como é feita
            </Button>
          </Magnetic>
        </Fade>

        <Fade delay={0.72} reduced={reduced}>
          <ul className="m-0 flex list-none flex-wrap justify-center gap-x-[1.625rem] gap-y-2 p-0 text-[0.86rem] text-faint">
            {['Entrega em até 7 dias', 'Aprovação antes de publicar', 'Sem mensalidade'].map(
              (item) => (
                <li key={item} className="inline-flex items-center gap-2">
                  <span aria-hidden="true" className="block size-[3px] shrink-0 rounded-full bg-accent" />
                  {item}
                </li>
              ),
            )}
          </ul>
        </Fade>

        <motion.div
          className="w-full"
          initial={reduced ? false : { opacity: 0, y: 46, scale: 0.975 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.3, delay: 0.7, ease: EASE }}
        >
          <Maquette />
        </motion.div>
      </Container>
    </section>
  );
}
