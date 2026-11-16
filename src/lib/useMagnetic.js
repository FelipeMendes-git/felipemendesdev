import { gsap, useGSAP, POINTER } from './gsap';

/**
 * O elemento é "puxado" na direção do cursor enquanto o mouse está sobre ele
 * e volta ao lugar quando o mouse sai. Só com mouse e movimento permitido: no
 * toque não existe hover, e o efeito só atrapalharia o dedo.
 */
export default function useMagnetic(ref, strength = 0.2) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(POINTER, () => {
        const element = ref.current;
        // quickTo reaproveita um único tween por eixo em vez de criar um a cada movimento.
        const xTo = gsap.quickTo(element, 'x', { duration: 0.55, ease: 'power3' });
        const yTo = gsap.quickTo(element, 'y', { duration: 0.55, ease: 'power3' });

        const move = (event) => {
          const box = element.getBoundingClientRect();
          xTo((event.clientX - (box.left + box.width / 2)) * strength);
          yTo((event.clientY - (box.top + box.height / 2)) * strength);
        };
        const leave = () => {
          xTo(0);
          yTo(0);
        };

        element.addEventListener('pointermove', move);
        element.addEventListener('pointerleave', leave);
        return () => {
          element.removeEventListener('pointermove', move);
          element.removeEventListener('pointerleave', leave);
        };
      });

      return () => mm.revert();
    },
    { scope: ref },
  );
}
