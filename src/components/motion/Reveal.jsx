import { motion, useReducedMotion } from 'framer-motion';

/**
 * Revela o conteúdo quando ele entra na viewport.
 * `delay` escalona itens irmãos sem precisar de variantes em cada um.
 */
export default function Reveal({ children, delay = 0, y = 24, className, as = 'div', ...rest }) {
  const reduced = useReducedMotion();
  const Component = motion[as] ?? motion.div;

  if (reduced) {
    const Static = as;
    return (
      <Static className={className} {...rest}>
        {children}
      </Static>
    );
  }

  return (
    <Component
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15, margin: '0px 0px -6% 0px' }}
      transition={{ duration: 0.95, delay, ease: [0.16, 1, 0.3, 1] }}
      {...rest}
    >
      {children}
    </Component>
  );
}
