import { motion, useReducedMotion } from 'framer-motion';
import { Lock, Smartphone, Zap } from 'lucide-react';
import Tilt from '../motion/Tilt';
import { SITE } from '../../lib/site';

/**
 * Maquete abstrata de uma landing page, montada em CSS. Ela se constrói
 * bloco a bloco ao entrar na tela: comunica o produto sem expor
 * o trabalho de nenhum cliente.
 */

const container = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const block = {
  hidden: { opacity: 0, y: 14 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

/** Brilho que percorre o bloco, sugerindo conteúdo carregando. */
function Shimmer() {
  return (
    <span
      aria-hidden="true"
      className="absolute inset-0 animate-[shimmer_3.6s_cubic-bezier(0.22,0.61,0.36,1)_infinite] bg-[linear-gradient(100deg,transparent_30%,var(--accent-soft)_50%,transparent_70%)]"
    />
  );
}

function Skeleton({ className, children }) {
  return (
    <motion.span
      variants={block}
      className={`relative block overflow-hidden rounded-full bg-surface-2 ${className}`}
    >
      {children}
    </motion.span>
  );
}

function FloatingTag({ icon: Icon, children, className }) {
  return (
    <span
      className={`absolute hidden items-center gap-2.5 whitespace-nowrap rounded-full border border-line bg-[color-mix(in_srgb,var(--surface)_88%,transparent)] px-[1.125rem] py-2.5 text-[0.78rem] font-semibold shadow-lift backdrop-blur-md lg:inline-flex ${className}`}
    >
      <Icon size={14} className="shrink-0 text-accent" strokeWidth={2} />
      {children}
    </span>
  );
}

export default function Maquette() {
  const reduced = useReducedMotion();

  return (
    <div className="relative mt-[clamp(3.375rem,8vw,5.75rem)] [perspective:1800px]">
      <Tilt className="overflow-hidden rounded-[20px] border border-line bg-surface shadow-deep">
        {/* Barra do navegador */}
        <div className="flex items-center gap-3 border-b border-hairline bg-surface-2 px-[1.125rem] py-[0.8125rem]">
          {[0, 1, 2].map((dot) => (
            <span key={dot} aria-hidden="true" className="block size-[9px] shrink-0 rounded-full bg-line" />
          ))}
          <span className="flex h-[26px] flex-1 items-center justify-center gap-2 rounded-full border border-hairline bg-bg text-[0.74rem] tracking-wide text-faint">
            <Lock size={11} className="text-accent" strokeWidth={2.4} />
            suaempresa.com.br
          </span>
        </div>

        {/* Conteúdo abstrato */}
        <motion.div
          initial="hidden"
          whileInView={reduced ? undefined : 'shown'}
          animate={reduced ? 'shown' : undefined}
          viewport={{ once: true, amount: 0.2 }}
          variants={container}
          className="flex flex-col items-center gap-3.5 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,var(--accent-soft),transparent_70%)] px-[clamp(1.375rem,5vw,3.75rem)] pb-[clamp(2.25rem,6vw,4.125rem)] pt-[clamp(1.75rem,5vw,3.5rem)]"
        >
          <Skeleton className="h-[11px] w-[116px] border border-accent-line bg-accent-soft" />
          <Skeleton className="h-[clamp(22px,3.4vw,34px)] w-[min(80%,28.75rem)] rounded-lg bg-ink-dim opacity-80">
            <Shimmer />
          </Skeleton>
          <Skeleton className="h-[clamp(22px,3.4vw,34px)] w-[min(58%,20.625rem)] rounded-lg bg-ink-dim opacity-50">
            <Shimmer />
          </Skeleton>
          <Skeleton className="h-[9px] w-[min(66%,25rem)]">
            <Shimmer />
          </Skeleton>
          <Skeleton className="mb-2 h-[9px] w-[min(50%,18.75rem)]">
            <Shimmer />
          </Skeleton>
          <Skeleton className="h-10 w-[9.5rem] bg-accent shadow-[0_10px_26px_-12px_var(--glow)]">
            <Shimmer />
          </Skeleton>

          <motion.div variants={block} className="mt-5 grid w-full grid-cols-1 gap-3 sm:grid-cols-3">
            {[0, 1, 2].map((card) => (
              <motion.div
                key={card}
                variants={block}
                className="h-[clamp(3.25rem,7vw,4.75rem)] rounded-lg border border-hairline bg-surface-2"
              />
            ))}
          </motion.div>
        </motion.div>
      </Tilt>

      <FloatingTag icon={Zap} className="left-[-5%] top-[14%]">
        Abre em menos de 1s
      </FloatingTag>
      <FloatingTag icon={Smartphone} className="bottom-[16%] right-[-5%]">
        Impecável no celular
      </FloatingTag>
      <span className="sr-only">
        Ilustração de uma landing page criada por {SITE.name}: título, texto de apoio, botão de
        ação e três blocos de conteúdo.
      </span>
    </div>
  );
}
