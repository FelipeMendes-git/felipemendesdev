import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';

/** Barra fina no topo indicando o progresso da leitura. */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-px origin-left bg-[linear-gradient(90deg,var(--accent-deep),var(--accent),var(--accent-hi))]"
    />
  );
}

/** Halo que acompanha o cursor, com atraso suave. */
function Spotlight() {
  const ref = useRef(null);
  // Só faz sentido com ponteiro fino; em toque não existe cursor a seguir.
  const [enabled] = useState(() => window.matchMedia('(pointer: fine)').matches);

  useEffect(() => {
    if (!enabled) return undefined;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let x = targetX;
    let y = targetY;
    let frame;

    const onMove = (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
    };

    const loop = () => {
      x += (targetX - x) * 0.07;
      y += (targetY - y) * 0.07;
      if (ref.current) {
        ref.current.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%)`;
      }
      frame = requestAnimationFrame(loop);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    frame = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(frame);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed z-0 size-[40rem] rounded-full bg-[radial-gradient(circle,var(--accent-soft),transparent_60%)] will-change-transform"
    />
  );
}

/**
 * Fundo da página: manchas de luz em deriva lenta e uma malha discreta
 * que se dissolve conforme desce. Puramente decorativo.
 */
export default function Ambient() {
  const reduced = useReducedMotion();

  const blobs = [
    {
      className:
        'size-[52vw] -top-[20vw] left-1/2 -ml-[26vw] bg-[var(--glow)] opacity-50',
      animate: { x: ['0vw', '3vw', '0vw'], y: ['0vh', '4vh', '0vh'], scale: [1, 1.1, 1] },
      duration: 26,
    },
    {
      className: 'size-[42vw] top-[42vh] -right-[14vw] bg-[var(--glow-2)] opacity-70',
      animate: { x: ['0vw', '-5vw', '0vw'], y: ['0vh', '-5vh', '0vh'], scale: [1.05, 0.92, 1.05] },
      duration: 33,
    },
    {
      className: 'size-[38vw] -bottom-[14vw] -left-[10vw] bg-[var(--glow)] opacity-30',
      animate: { x: ['0vw', '4vw', '0vw'], y: ['0vh', '-4vh', '0vh'], scale: [1, 1.12, 1] },
      duration: 29,
    },
  ];

  return (
    <>
      <ScrollProgress />
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {blobs.map((blob, index) => (
          <motion.span
            key={index}
            className={`absolute block rounded-full blur-[110px] ${blob.className}`}
            animate={reduced ? undefined : blob.animate}
            transition={{ duration: blob.duration, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 opacity-80 [background-image:linear-gradient(var(--hairline)_1px,transparent_1px),linear-gradient(90deg,var(--hairline)_1px,transparent_1px)] [background-size:84px_84px] [mask-image:radial-gradient(ellipse_90%_60%_at_50%_0%,#000,transparent_78%)]"
      />
      <Spotlight />
    </>
  );
}
