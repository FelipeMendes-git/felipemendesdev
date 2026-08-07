import { useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';

/**
 * Faz o elemento "puxar" na direção do cursor. Só em dispositivos com
 * ponteiro fino: em toque não existe hover e o efeito atrapalharia o toque.
 */
export default function Magnetic({ children, strength = 0.18, className }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 22, mass: 0.4 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 22, mass: 0.4 });

  if (reduced) return <div className={className}>{children}</div>;

  const handleMove = (event) => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((event.clientX - rect.left - rect.width / 2) * strength);
    y.set((event.clientY - rect.top - rect.height / 2) * strength * 1.5);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x, y }}
      onPointerMove={handleMove}
      onPointerLeave={reset}
    >
      {children}
    </motion.div>
  );
}
