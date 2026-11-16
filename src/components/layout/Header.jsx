import { useEffect, useState } from 'react';
import WhatsAppButton from '../ui/WhatsAppButton';
import { cn } from '../../lib/cn';

/**
 * Sem menu, de propósito: a página defende que landing page não tem atalhos,
 * então ela mesma não tem. Só o nome e o caminho até a conversa.
 */
export default function Header() {
  const [scrolled, setScrolled] = useState(() => window.scrollY > 8);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 border-b border-transparent transition-[background-color,border-color,backdrop-filter] duration-500',
        scrolled && 'border-fg/10 bg-[color-mix(in_srgb,var(--bg)_86%,transparent)] backdrop-blur-md',
      )}
    >
      <div className="mx-auto flex h-[var(--header-h)] w-full max-w-[96rem] items-center justify-between gap-4 px-[var(--gutter)]">
        {/* O nome usa as duas vozes da página: a que grita e a que assina. */}
        <a href="#topo" aria-label="Felipe Mendes, voltar ao topo" className="titulo text-[1.2rem] leading-none [--opsz:12] sm:text-[1.3rem] [&_em]:font-semibold">
          Felipe <em>Mendes</em>
        </a>

        <WhatsAppButton size="sm">
          <span className="sm:hidden">WhatsApp</span>
          <span className="max-sm:hidden">Falar no WhatsApp</span>
        </WhatsAppButton>
      </div>
    </header>
  );
}
