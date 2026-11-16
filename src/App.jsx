import { useEffect } from 'react';
import { gsap, ScrollTrigger, useGSAP, MOTION } from './lib/gsap';
import { scrollToElement, startSmoothScroll, stopSmoothScroll } from './lib/scroll';
import Intro from './components/Intro';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Hero from './components/sections/Hero';
import Manifesto from './components/sections/Manifesto';
import Comparison from './components/sections/Comparison';
import Vitrine from './components/sections/Vitrine';
import Anatomy from './components/sections/Anatomy';
import Numbers from './components/sections/Numbers';
import Process from './components/sections/Process';
import Included from './components/sections/Included';
import Faq from './components/sections/Faq';
import FinalCta from './components/sections/FinalCta';

/** Liga a rolagem suave e trata links internos (#ancora) por ela. */
function useSmoothScroll() {
  useEffect(() => {
    const media = window.matchMedia(MOTION);
    const sync = () => (media.matches ? startSmoothScroll() : stopSmoothScroll());
    sync();
    media.addEventListener('change', sync);

    const onClick = (event) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target.closest('a[href^="#"]');
      if (!link) return;
      const id = decodeURIComponent(link.hash.slice(1));
      const target = id && document.getElementById(id);
      if (!target) return;
      event.preventDefault();
      scrollToElement(target);
      history.replaceState(null, '', `#${id}`);
    };
    document.addEventListener('click', onClick);

    return () => {
      media.removeEventListener('change', sync);
      document.removeEventListener('click', onClick);
      stopSmoothScroll();
    };
  }, []);
}

/**
 * Cada seção declara um tom (data-tone). Quando ela ocupa o meio da tela, o
 * <html> recebe o mesmo tom e o CSS faz a transição de cor da página inteira.
 * data-tone-start adia a troca: no fechamento, a página só escurece quando o
 * painel escuro já cobriu a tela. O rodapé tem fundo próprio e fica fora disso.
 */
function usePageTone() {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION, () => {
      const html = document.documentElement;

      // Vale sempre a seção ativa mais abaixo na página; entre duas seções,
      // o tom anterior permanece.
      // `let` antes de criar: um gatilho já ativo dispara onToggle na criação.
      let triggers = [];
      const apply = () => {
        const current = triggers.findLast((trigger) => trigger.isActive);
        if (current) html.dataset.tone = current.trigger.dataset.tone;
      };

      triggers = gsap.utils.toArray('main [data-tone]').map((section) =>
        ScrollTrigger.create({
          trigger: section,
          start: section.dataset.toneStart ?? 'top 50%',
          end: 'bottom 50%',
          // A seção contém cenas fixadas; o fim dela só é conhecido depois que
          // elas somam o próprio espaço. Prioridade negativa = recalcula por último.
          refreshPriority: -1,
          onToggle: apply,
        }),
      );
      apply();

      return () => delete html.dataset.tone;
    });
    return () => mm.revert();
  });
}

/**
 * As cenas são criadas por componentes diferentes e algumas são recriadas ao
 * cruzar um breakpoint. Antes de cada recálculo, os gatilhos são ordenados
 * pela posição na página, que é a ordem que o ScrollTrigger exige para somar
 * o espaço das cenas fixadas.
 */
function useScrollTriggerHousekeeping() {
  useEffect(() => {
    const sort = () => ScrollTrigger.sort();
    ScrollTrigger.addEventListener('refreshInit', sort);

    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
      ScrollTrigger.removeEventListener('refreshInit', sort);
    };
  }, []);
}

export default function App() {
  useSmoothScroll();
  usePageTone();
  useScrollTriggerHousekeeping();

  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-xl focus:bg-brasa focus:px-5 focus:py-3 focus:font-semibold focus:text-noite"
      >
        Pular para o conteúdo
      </a>

      <Intro />
      <Header />

      <main id="conteudo" tabIndex={-1} className="outline-none">
        <div id="topo" />
        <Hero />
        <Manifesto />
        <Comparison />
        <Vitrine />
        <Anatomy />
        <Numbers />
        <Process />
        <Included />
        <Faq />
        <FinalCta />
      </main>

      <Footer />
    </>
  );
}
