import { MOTION } from './gsap';

/** Duração da abertura, em segundos. O topo espera esse tempo para entrar. */
export const INTRO = 1.2;

/**
 * A abertura só toca para quem chega no começo da página e aceita movimento.
 * Quem recarrega no meio da página não deve ficar olhando para uma cortina.
 * O valor é decidido uma vez, no carregamento, para a abertura e o topo
 * concordarem.
 */
export const TEM_INTRO =
  typeof window !== 'undefined' && window.matchMedia(MOTION).matches && window.scrollY < 10;
