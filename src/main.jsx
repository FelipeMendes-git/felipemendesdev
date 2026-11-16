import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Bricolage Grotesque (títulos), Schibsted Grotesk (texto) e Caveat (as
// anotações à mão). As três são servidas pelo próprio site; o vite.config.js
// pré-carrega as do topo.
import '@fontsource-variable/bricolage-grotesque/wght.css';
import '@fontsource-variable/schibsted-grotesk/wght.css';
import '@fontsource-variable/caveat/wght.css';
import 'lenis/dist/lenis.css';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Só no `npm run dev`: a cada alteração de JavaScript a página recarrega
// inteira. O GSAP reorganiza o DOM (envolve as cenas fixadas e quebra os
// títulos em linhas), e o Fast Refresh do React tentaria remendar nós que já
// não estão onde ele deixou: a página quebrava ou mostrava texto antigo.
// Mudanças só de CSS continuam entrando sem recarregar.
if (import.meta.hot) {
  import.meta.hot.on('vite:beforeUpdate', (payload) => {
    if (payload.updates.some((update) => update.type === 'js-update')) {
      window.location.reload();
    }
  });
}
