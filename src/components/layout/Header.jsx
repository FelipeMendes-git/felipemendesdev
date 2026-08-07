import { useEffect, useState } from 'react';
import Button from '../ui/Button';
import ThemeToggle from '../ui/ThemeToggle';
import Magnetic from '../motion/Magnetic';
import { Container } from '../ui/Section';
import { CONTACT, NAV_LINKS, SITE } from '../../lib/site';
import { cn } from '../../lib/cn';

export function Wordmark() {
  return (
    <a href="#topo" className="inline-flex items-baseline gap-2.5 text-[1.04rem] font-semibold">
      {/* Usa a classe do index.css: o recorte do gradiente no texto precisa
          de -webkit-background-clip, que não sobrevive como classe arbitrária. */}
      <span className="italic-accent text-[1.24rem]">{SITE.name}</span>
      {/* Abaixo de sm o descritor sai: não cabe ao lado do botão de ação. */}
      <span aria-hidden="true" className="hidden h-[15px] w-px self-center bg-line sm:block" />
      <span className="eyebrow hidden text-faint sm:inline">{SITE.role}</span>
    </a>
  );
}

export default function Header() {
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 14);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 border-b border-transparent',
        'transition-[background-color,border-color] duration-400 ease-smooth',
        stuck && 'border-b-hairline bg-[color-mix(in_srgb,var(--bg)_82%,transparent)] backdrop-blur-lg',
      )}
    >
      <Container className="flex h-[4.875rem] items-center justify-between gap-4">
        <Wordmark />

        <nav aria-label="Navegação principal" className="hidden gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-[0.9375rem] py-2.5 text-[0.875rem] text-muted transition-colors duration-300 ease-smooth hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <Magnetic>
            <Button href={CONTACT.whatsapp} size="sm">
              <span className="sm:hidden">Proposta</span>
              <span className="hidden sm:inline">Solicitar proposta</span>
            </Button>
          </Magnetic>
        </div>
      </Container>
    </header>
  );
}
