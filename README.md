# devfelipemendes.com.br

Site de venda de landing pages do Felipe Mendes. Uma página só, escura e
visual, com animações presas à rolagem e uma vitrine de páginas-conceito.

```bash
npm install
npm run dev      # servidor local em http://localhost:5173
npm run build    # gera dist/ (publicado na Vercel)
npm run lint
```

Se a porta 5173 já estiver em uso, o Vite sobe na próxima livre (5174, 5175...)
e mostra o endereço no terminal. Rode um servidor por vez: dois ao mesmo tempo
disputam o cache em `node_modules/.vite` e a página pode abrir em branco.

Em desenvolvimento, toda alteração de JavaScript recarrega a página inteira
(`src/main.jsx`). As animações reorganizam o DOM, e o recarregamento parcial do
React deixava a página quebrada ou com texto antigo. CSS continua instantâneo.

## Stack

- **React 19 + Vite 8**, estilos com **Tailwind CSS 4**.
- **GSAP 3.15** com **ScrollTrigger** (cenas presas à rolagem), **SplitText**
  (títulos por linha e por letra) e **DrawSVG** (rabiscos). Todos os plugins
  do GSAP são gratuitos, inclusive para uso comercial.
- **@gsap/react** (`useGSAP`), que desfaz animações e gatilhos ao desmontar.
- **Lenis** para a rolagem suave no desktop. No toque fica a rolagem nativa.
- **WebGL puro** (sem biblioteca) para a mancha líquida do topo: `src/lib/fluido.js`.
- Fontes servidas pelo próprio site via Fontsource. As do topo e a imagem do
  aparelho são pré-carregadas (`vite.config.js`).

## Identidade

Página escura na maior parte, com seções claras como respiro.

| Nome        | Cor       | Uso                                                  |
| ----------- | --------- | ---------------------------------------------------- |
| noite       | `#0c1612` | fundo escuro                                         |
| mata        | `#15281f` | superfícies sobre o escuro                           |
| osso        | `#f1ebe0` | fundo claro e texto sobre o escuro                   |
| papel       | `#faf6ee` | cartões e janelas claras                             |
| brasa       | `#ff5c1a` | destaque: palavras em itálico, rabiscos e botões     |
| brasa-funda | `#b83d0a` | o mesmo destaque como texto sobre o claro (contraste) |

As cores vivem em `src/index.css` (`:root`).

- **Títulos (`.titulo`):** Jost pesada em caixa alta. As palavras dentro de
  `<em>` saem em Bodoni Moda itálica na cor de destaque. É o par que dá a voz
  da página.
- **Rabiscos (`Rabisco.jsx`):** traços de marcador (círculo, onda, risco,
  seta, visto) desenhados pelo GSAP.
- **Botões:** pílulas na cor de destaque, levemente magnéticas no desktop.

Não há menu de navegação, de propósito: a página defende que landing page não
tem atalhos.

## Cenas

Cada seção em `src/components/sections/` cuida da própria animação.

| Seção        | O que acontece                                                                            |
| ------------ | ----------------------------------------------------------------------------------------- |
| `Intro`      | contador até 100 e duas cortinas que sobem (só para quem chega no começo da página)        |
| `Hero`       | título letra a letra; no aparelho, uma mancha líquida segue o cursor e revela a planta da página |
| `Manifesto`  | duas faixas de texto gigante correm em sentidos opostos e mensagens caem numa pilha        |
| `Comparison` | site comum e landing page lado a lado: cursores se perdem no menu ou clicam no WhatsApp    |
| `Vitrine`    | seis páginas-conceito; cada janela rola a própria página e as colunas andam em ritmos diferentes |
| `Anatomy`    | uma landing é montada bloco a bloco no celular                                             |
| `Numbers`    | o combinado em quatro números que contam e sobem                                           |
| `Process`    | rolagem horizontal: do primeiro contato até a página no ar                                 |
| `Included`   | seis cartões chegam empilhados e se abrem em leque                                         |
| `Faq`        | acordeão acessível (sem biblioteca de animação)                                            |
| `FinalCta`   | um painel escuro se abre até ocupar a tela                                                 |

A cor de fundo da página inteira acompanha a seção do meio da tela: cada seção
declara `data-tone` (`noite` ou `osso`) e o `App.jsx` troca o tom do `<html>`.
A transição é feita pelo CSS com `@property`.

O movimento usa só translação, rotação no plano, opacidade e máscaras. Nada de
perspectiva nem distorção, que já deram engasgo neste projeto.

### Movimento reduzido

Quem ativa "reduzir movimento" no sistema vê tudo estático: sem abertura, sem
mancha, nada preso à rolagem. Cada seção pinta o próprio fundo e as cenas
mostram o estado final. O JavaScript usa `gsap.matchMedia()` e o CSS usa as
mesmas media queries.

## Aparelho do topo e páginas-conceito

Duas regras, pedidas pelo Felipe:

1. **O topo é a cara do site e não mostra conceito nenhum.** O aparelho exibe
   uma página genérica na identidade do próprio site ("sua marca", "Seu
   negócio, em uma página"), e a mancha revela a planta dela.
2. **Nenhum conceito tem nome de empresa.** No lugar da marca vai "Sua
   hamburgueria", "Seu estúdio" etc. Um nome inventado quase sempre já existe
   em algum lugar, e a página pareceria trabalho feito para aquele negócio.

Tudo isso existe como HTML em `design/conceitos/` e vira imagem com um comando:

```bash
npm i -D puppeteer-core && node design/gerar-conceitos.mjs && npm un puppeteer-core
```

- `topo.html` gera as duas telas do aparelho do topo (`src/assets/topo/`).
- `pagina.html` gera as seis páginas da vitrine (`src/assets/conceitos/`).

- Para mudar um conceito, edite os textos, as cores ou a foto em `pagina.html`
  (objeto `CONCEITOS`) e gere de novo.
- Para trocar um conceito por um trabalho real (com autorização do cliente),
  coloque a captura de tela em `src/assets/conceitos/` e ajuste
  `src/lib/conceitos.js`.
- As fotos são do Unsplash (uso livre). Créditos em `design/conceitos/CREDITOS.md`.
- As fontes extras usadas só nesses conceitos (Anton, Cormorant, Hanken
  Grotesk) estão em `devDependencies` e não entram no site.

## Editar conteúdo

- **Contato e domínio:** `src/lib/site.js`. O domínio também aparece no
  `index.html` (canonical, Open Graph e JSON-LD).
- **Perguntas frequentes:** `src/components/sections/Faq.jsx` e o JSON-LD
  `FAQPage` no `index.html`. Mantenha os dois iguais.
- **Imagem de compartilhamento:** edite `design/og-image.html` e gere de novo:

  ```bash
  npm i -D puppeteer-core && node design/gerar-og-image.mjs && npm un puppeteer-core
  ```

- **Favicon:** `public/favicon.svg` é o monograma "FM" com os contornos da
  Jost convertidos em caminhos (favicons não carregam fontes).

## Skills do Claude Code

`.claude/skills/` traz as skills usadas para desenhar e animar o site. O Claude
Code as carrega sozinho quando o assunto aparece:

- `frontend-design` (Anthropic, Apache 2.0): direção visual sem a cara de
  página gerada por IA.
- `gsap-*` (GreenSock, MIT): ScrollTrigger, React, plugins, timeline,
  utilitários e performance.

No navegador, em desenvolvimento, `window.gsap` e `window.ScrollTrigger` ficam
expostos para inspecionar as cenas pelo console.
