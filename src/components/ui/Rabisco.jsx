import { cn } from '../../lib/cn';

/**
 * Rabiscos de marcador, como as anotações de quem revisa um layout no papel.
 * Cada forma é um traço só (ou dois), para o GSAP poder "desenhar" com
 * drawScribbles(). São decorativos: quem lê com leitor de tela não perde nada.
 *
 * O SVG escala sempre na proporção original; defina só a largura.
 */
const FORMAS = {
  /** Volta em torno de uma palavra, com a ponta passando do começo. */
  circulo: {
    viewBox: '0 0 300 120',
    traco: 4.5,
    paths: [
      'M27,66 C15,33 75,10 152,11 C232,12 291,34 283,66 C275,100 205,113 133,109 C71,105 17,93 27,57 C35,30 99,15 173,18',
    ],
  },
  /** Sublinhado ondulado. */
  onda: {
    viewBox: '0 0 300 30',
    traco: 5,
    paths: ['M5,18 C42,6 64,26 98,14 C132,2 152,24 188,13 C224,3 246,22 295,9'],
  },
  /** Dois riscos cruzados, de quem descarta uma ideia. */
  risco: {
    viewBox: '0 0 300 60',
    traco: 5,
    paths: ['M6,44 C80,30 190,24 294,12', 'M10,14 C100,24 200,36 290,50'],
  },
  /** Seta curva apontando para a direita e para baixo. */
  seta: {
    viewBox: '0 0 160 120',
    traco: 4.5,
    paths: ['M10,12 C26,78 82,104 144,86', 'M114,62 L146,86 L110,104'],
  },
  /** Visto de aprovação. */
  visto: {
    viewBox: '0 0 120 100',
    traco: 7,
    paths: ['M10,56 C24,66 34,78 42,92 C58,54 82,26 112,8'],
  },
};

export default function Rabisco({ forma, className, style }) {
  const { viewBox, traco, paths } = FORMAS[forma];

  return (
    <svg
      data-rabisco
      aria-hidden="true"
      focusable="false"
      viewBox={viewBox}
      className={cn('rabisco', className)}
      style={{ strokeWidth: traco, ...style }}
    >
      {paths.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
