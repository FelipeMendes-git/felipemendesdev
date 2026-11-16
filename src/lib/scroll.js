/**
 * Rolagem suave com Lenis, sincronizada com o ScrollTrigger.
 *
 * O Lenis só liga quando a pessoa não pediu movimento reduzido. No toque ele
 * deixa a rolagem nativa do aparelho (syncTouch: false, o padrão), que já é
 * suave e é a que a pessoa espera sentir no dedo.
 */
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './gsap';

let lenis = null;

export function startSmoothScroll() {
  if (lenis) return stopSmoothScroll;

  lenis = new Lenis({ lerp: 0.11 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(tick);
  // O Lenis já suaviza; a compensação de atraso do GSAP faria a rolagem pular.
  gsap.ticker.lagSmoothing(0);

  return stopSmoothScroll;
}

export function stopSmoothScroll() {
  if (!lenis) return;
  gsap.ticker.remove(tick);
  gsap.ticker.lagSmoothing(500, 33);
  lenis.destroy();
  lenis = null;
}

function tick(time) {
  lenis?.raf(time * 1000);
}

/**
 * Leva até um elemento da página e entrega o foco a ele, para que teclado e
 * leitor de tela continuem a partir dali.
 */
export function scrollToElement(target) {
  const header = parseFloat(getComputedStyle(document.documentElement).fontSize) * 4.5;

  if (lenis) {
    lenis.scrollTo(target, { offset: -header, duration: 1.4 });
  } else {
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - header });
  }

  if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
}
