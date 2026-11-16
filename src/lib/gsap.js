/**
 * Ponto único de registro do GSAP. Todo componente importa daqui, assim os
 * plugins são registrados uma vez só, antes do primeiro useGSAP().
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin, ScrambleTextPlugin, useGSAP);

// A barra de endereço do celular encolhe e cresce durante a rolagem. Sem isto,
// cada mudança recalcularia todas as cenas fixadas e a tela daria saltos.
ScrollTrigger.config({ ignoreMobileResize: true });

// Só em desenvolvimento: permite inspecionar as cenas pelo console do navegador.
if (import.meta.env.DEV) Object.assign(window, { gsap, ScrollTrigger });

/** Consultas usadas com gsap.matchMedia(). Batem com as media queries do CSS. */
export const MOTION = '(prefers-reduced-motion: no-preference)';
export const REDUCED = '(prefers-reduced-motion: reduce)';
export const DESKTOP = '(min-width: 64rem)';
export const MOBILE = '(max-width: 63.999rem)';
/** Movimento permitido e um mouse de verdade: efeitos que seguem o cursor. */
export const POINTER = `${MOTION} and (pointer: fine)`;

/** Curva de saída longa: começa rápido e pousa devagar. */
export const EASE_OUT = 'expo.out';

/**
 * Como cada linha de título entra: sobe por trás de uma máscara. Só
 * transform, então nada empurra o layout (CLS zero).
 */
export function lineIn(lines, { stagger = 0.1, delay = 0, scrollTrigger } = {}) {
  return gsap.from(lines, { yPercent: 110, duration: 1.2, stagger, delay, ease: EASE_OUT, scrollTrigger });
}

/**
 * Revela as linhas de um título (ver lineIn) quando ele entra na tela. O
 * SplitText refaz a divisão sozinho quando a fonte termina de carregar ou a
 * largura muda (autoSplit), e a animação devolvida pelo onSplit é recriada no
 * mesmo ponto em que estava.
 *
 * Deve ser chamado dentro de um contexto do GSAP (useGSAP ou matchMedia),
 * que desfaz tudo ao desmontar.
 */
export function revealLines(targets, { start = 'top 86%', stagger = 0.1 } = {}) {
  gsap.utils.toArray(targets).forEach((element) => {
    SplitText.create(element, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'split-line',
      autoSplit: true,
      onSplit(self) {
        return lineIn(self.lines, { stagger, scrollTrigger: { trigger: element, start, once: true } });
      },
    });
  });
}

/**
 * Desenha os rabiscos (ver Rabisco.jsx) como um marcador passando pelo papel,
 * quando eles entram na tela. Sem JavaScript ou sem movimento, já nascem prontos.
 */
export function drawScribbles(targets, { start = 'top 82%', delay = 0.25 } = {}) {
  gsap.utils.toArray(targets).forEach((svg) => {
    gsap.from(svg.querySelectorAll('path'), {
      drawSVG: 0,
      duration: 0.8,
      stagger: 0.22,
      delay,
      ease: 'power2.inOut',
      scrollTrigger: { trigger: svg, start, once: true },
    });
  });
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
