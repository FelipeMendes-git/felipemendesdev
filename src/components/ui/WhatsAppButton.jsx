import { useRef } from 'react';
import { WhatsAppIcon } from './BrandIcons';
import { CONTACT } from '../../lib/site';
import { cn } from '../../lib/cn';
import useMagnetic from '../../lib/useMagnetic';

const SIZES = {
  sm: 'gap-2 px-5 py-[0.7rem] text-[0.95rem]',
  md: 'gap-2.5 px-7 py-4 text-[1.05rem]',
  lg: 'gap-3 px-8 py-[1.15rem] text-[1.1rem] sm:px-10 sm:py-5 sm:text-[1.2rem]',
};

const ICON = { sm: 16, md: 18, lg: 20 };

/**
 * O único botão do site: todo pedido de ação leva ao WhatsApp. É sempre na
 * cor de destaque, que funciona tanto sobre o escuro quanto sobre o claro.
 * No desktop ele é magnético, levemente puxado na direção do cursor.
 */
export default function WhatsAppButton({ size = 'md', className, children = 'Falar no WhatsApp' }) {
  const ref = useRef(null);
  useMagnetic(ref);

  return (
    <a
      ref={ref}
      href={CONTACT.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-full bg-brasa font-semibold text-noite',
        'transition-[background-color,scale] duration-300 ease-out-expo hover:bg-[#ff7d45] active:scale-[0.97]',
        SIZES[size],
        className,
      )}
    >
      <WhatsAppIcon size={ICON[size]} className="shrink-0" />
      {children}
      <span className="sr-only"> (abre em nova aba)</span>
    </a>
  );
}
