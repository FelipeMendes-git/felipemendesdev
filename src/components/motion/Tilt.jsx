import { useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { cn } from '../../lib/cn';

/**
 * Inclinação 3D sutil seguindo o cursor. Também expõe --mx/--my para que o
 * CSS possa posicionar um brilho no ponto onde o mouse está.
 */
export default function Tilt({ children, className, max = 5, glow = false }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const config = { stiffness: 180, damping: 20, mass: 0.5 };
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), config);
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), config);

  if (reduced) return <div className={className}>{children}</div>;

  const handleMove = (event) => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const rect = ref.current.getBoundingClientRect();
    const nx = (event.clientX - rect.left) / rect.width;
    const ny = (event.clientY - rect.top) / rect.height;
    px.set(nx);
    py.set(ny);
    if (glow) {
      ref.current.style.setProperty('--mx', `${nx * 100}%`);
      ref.current.style.setProperty('--my', `${ny * 100}%`);
    }
  };

  const reset = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      className={cn('[transform-style:preserve-3d]', className)}
      style={{ rotateX, rotateY, perspective: 1600 }}
      onPointerMove={handleMove}
      onPointerLeave={reset}
    >
      {children}
    </motion.div>
  );
}
