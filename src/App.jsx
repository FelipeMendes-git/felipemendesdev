import Ambient from './components/Ambient';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Hero from './components/sections/Hero';
import Stats from './components/sections/Stats';
import Why from './components/sections/Why';
import Anatomy from './components/sections/Anatomy';
import Process from './components/sections/Process';
import Included from './components/sections/Included';
import Faq from './components/sections/Faq';
import FinalCta from './components/sections/FinalCta';

export default function App() {
  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-accent focus:px-5 focus:py-3 focus:text-accent-ink"
      >
        Pular para o conteúdo
      </a>

      <Ambient />

      <div className="relative z-10">
        <Header />
        <main id="conteudo">
          <div id="topo" />
          <Hero />
          <Stats />
          <Why />
          <Anatomy />
          <Process />
          <Included />
          <Faq />
          <FinalCta />
        </main>
        <Footer />
      </div>
    </>
  );
}
