import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Jost (texto e títulos em caixa alta) e Bodoni Moda itálica (as palavras de
// destaque). As duas são servidas pelo próprio site; o vite.config.js
// pré-carrega as do topo. A Bodoni romana não é usada, então não é importada.
import '@fontsource-variable/jost/wght.css';
import '@fontsource-variable/bodoni-moda/opsz-italic.css';
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
