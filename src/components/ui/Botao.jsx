import { useRef } from 'react';
import { cn } from '../../lib/cn';
import useMagnetic from '../../lib/useMagnetic';

const SIZES = {
  sm: 'gap-2 px-5 py-[0.7rem] text-[0.95rem]',
  md: 'gap-2.5 px-7 py-4 text-[1.05rem]',
  lg: 'gap-3 px-8 py-[1.15rem] text-[1.1rem] sm:px-10 sm:py-5 sm:text-[1.2rem]',
};

const ICON = { sm: 16, md: 18, lg: 20 };

const VARIANTES = {
  // Marca-texto: funciona tanto sobre a tinta quanto sobre o papel.
  cheio: 'bg-marca text-tinta hover:bg-[#ffe27a]',
  contorno: 'text-current ring-1 ring-inset ring-current/35 hover:ring-current',
};

/**
 * Botão em pílula. No desktop ele é magnético, levemente puxado na direção
 * do cursor. Links para fora do site abrem em nova aba e avisam disso a quem
 * usa leitor de tela.
 */
export default function Botao({ href, icon: Icon, size = 'md', variante = 'cheio', className, children }) {
  const ref = useRef(null);
  useMagnetic(ref);
  const externo = /^https?:/.test(href);

  return (
    <a
      ref={ref}
      href={href}
      {...(externo && { target: '_blank', rel: 'noopener noreferrer' })}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-full font-semibold',
        'transition-[background-color,box-shadow,scale] duration-300 ease-out-expo active:scale-[0.97]',
        VARIANTES[variante],
        SIZES[size],
        className,
      )}
    >
      {Icon && <Icon size={ICON[size]} className="shrink-0" />}
      {children}
      {externo && <span className="sr-only"> (abre em nova aba)</span>}
    </a>
  );
}
