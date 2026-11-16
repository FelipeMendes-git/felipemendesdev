import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * Pré-carrega o que aparece no primeiro quadro: as duas fontes do topo e a
 * imagem do aparelho. Sem isso o navegador só descobre esses arquivos depois
 * de baixar e executar o JavaScript, e o topo demora a ficar completo.
 */
function preloadTopo(itens) {
  return {
    name: 'preload-topo',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(_html, ctx) {
        const arquivos = Object.keys(ctx.bundle ?? {})
        return itens.flatMap(({ padrao, attrs }) =>
          arquivos
            .filter((arquivo) => padrao.test(arquivo))
            .map((arquivo) => ({
              tag: 'link',
              attrs: { rel: 'preload', href: `/${arquivo}`, ...attrs },
              injectTo: 'head',
            })),
        )
      },
    },
  }
}

const FONTE = { as: 'font', type: 'font/woff2', crossorigin: true }

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    preloadTopo([
      // Só o recorte latino das fontes: é o que o português usa.
      { padrao: /bricolage-grotesque-latin-wght-normal-.+\.woff2$/, attrs: FONTE },
      { padrao: /schibsted-grotesk-latin-wght-normal-.+\.woff2$/, attrs: FONTE },
      // A tela que o aparelho do topo mostra antes de a mancha entrar.
      { padrao: /topo-interface-.+\.webp$/, attrs: { as: 'image', type: 'image/webp', fetchpriority: 'high' } },
    ]),
  ],
  server: {
    // Respeita a porta atribuída pelo ambiente (PORT); cai no padrão do Vite se ausente.
    port: process.env.PORT ? Number(process.env.PORT) : undefined,
  },
})
