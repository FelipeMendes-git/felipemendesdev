import { useEffect, useRef, useState } from 'react';
import { gsap, useGSAP, MOTION } from '../../lib/gsap';
import Botao from '../ui/Botao';
import { cn } from '../../lib/cn';

const LINKS = [
  { href: '#sobre', label: 'Sobre' },
  { href: '#projetos', label: 'Projetos' },
  { href: '#habilidades', label: 'Habilidades' },
];

/** Nome, atalhos para as seções e o caminho até o contato. O fio na base mostra o quanto da página já passou. */
export default function Header() {
  const [scrolled, setScrolled] = useState(() => window.scrollY > 8);
  const progresso = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION, () => {
      gsap.fromTo(
        progresso.current,
        { scaleX: 0 },
        { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } },
      );
    });
    return () => mm.revert();
  });

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 border-b border-transparent transition-[background-color,border-color,backdrop-filter] duration-500',
        scrolled && 'border-fg/10 bg-[color-mix(in_srgb,var(--bg)_86%,transparent)] backdrop-blur-md',
      )}
    >
      <div className="mx-auto flex h-[var(--header-h)] w-full max-w-[96rem] items-center justify-between gap-4 px-[var(--gutter)]">
        <a href="#topo" aria-label="Felipe Mendes, voltar ao topo" className="titulo text-[1.3rem] leading-none sm:text-[1.45rem]">
          Felipe Mendes
        </a>

        <nav aria-label="Seções" className="max-md:hidden">
          <ul className="flex items-center gap-[clamp(1.25rem,2.4vw,2.25rem)] text-[0.98rem] font-medium">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="underline decoration-current/0 decoration-2 underline-offset-[7px] transition-[text-decoration-color] duration-300 hover:decoration-accent"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <Botao href="#contato" size="sm">
          Contato
        </Botao>
      </div>

      <span
        ref={progresso}
        aria-hidden="true"
        className="absolute inset-x-0 bottom-[-1px] block h-[2px] origin-left bg-accent motion-reduce:hidden"
      />
    </header>
  );
}
