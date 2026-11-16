# devfelipemendes.com.br

Portfólio do Felipe Mendes, desenvolvedor full-stack. Uma página só, com
animações presas à rolagem, feita para mostrar projetos, habilidades e o
próprio domínio de GSAP.

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
  (títulos por linha, palavra e letra), **DrawSVG** (rabiscos) e
  **ScrambleText** (o código que embaralha). Todos os plugins do GSAP são
  gratuitos.
- **@gsap/react** (`useGSAP`), que desfaz animações e gatilhos ao desmontar.
- **Lenis** para a rolagem suave no desktop. No toque fica a rolagem nativa.
- **WebGL puro** (sem biblioteca) para a mancha líquida do topo: `src/lib/fluido.js`.
- Fontes servidas pelo próprio site via Fontsource. As do topo e a imagem do
  aparelho são pré-carregadas (`vite.config.js`).

## Identidade

"Tinta e papel": azul de tinta de caneta no escuro, papel frio no claro. O
destaque muda de instrumento conforme o fundo.

| Nome        | Cor       | Uso                                             |
| ----------- | --------- | ----------------------------------------------- |
| tinta       | `#131a4a` | fundo escuro                                    |
| tinta-clara | `#1e2870` | superfícies sobre o escuro                      |
| papel       | `#f1f2f7` | fundo claro e texto sobre o escuro              |
| folha       | `#ffffff` | cartões e janelas claras                        |
| pauta       | `#dde1ee` | blocos de apoio no claro                        |
| marca       | `#ffd43b` | marca-texto: destaque no escuro e botões        |
| caneta      | `#2a3fd0` | destaque como texto e rabisco sobre o claro     |

As cores vivem em `src/index.css` (`:root`). Trocar ali muda o site inteiro.

- **Títulos (`.titulo`):** Bricolage Grotesque pesada e apertada.
- **Texto:** Schibsted Grotesk.
- **Anotações (`.mao`):** Caveat, a letra de quem revisa com a caneta.
- **Marca-texto (`.marca`):** faixa amarela atrás de um trecho.
- **Rabiscos (`Rabisco.jsx`):** traços (onda, seta, visto...) desenhados pelo GSAP.
- **Botões (`Botao.jsx`):** pílulas, levemente magnéticas no desktop.

## Cenas

Cada seção em `src/components/sections/` cuida da própria animação.

| Seção         | O que acontece                                                                                   |
| ------------- | ------------------------------------------------------------------------------------------------ |
| `Intro`       | contador até 100 e duas cortinas que sobem (só para quem chega no começo da página)               |
| `Header`      | fio de progresso que acompanha a rolagem da página                                                |
| `Hero`        | título letra a letra, passada de marca-texto e a mancha líquida que revela o código sob a tela    |
| `Sobre`       | duas faixas gigantes em sentidos opostos, fichas caindo numa pilha e texto que acende por palavra |
| `Trabalhos`   | rolagem horizontal; cada painel toca a própria cena (QR code, código embaralhado, avisos, vídeo)  |
| `Educai`      | prévia do projeto: etiquetas que pulam e duas janelas que se abrem como persiana                  |
| `Habilidades` | seis cartões chegam empilhados e se abrem em leque                                                |
| `FinalCta`    | um painel escuro se abre até ocupar a tela e o título chega letra por letra                       |

A cor de fundo da página inteira acompanha a seção do meio da tela: cada seção
declara `data-tone` (`tinta` ou `papel`) e o `App.jsx` troca o tom do `<html>`.
A transição é feita pelo CSS com `@property`.

O movimento usa só translação, rotação no plano, opacidade e máscaras. Nada de
perspectiva nem distorção, que já deram engasgo neste projeto.

### Movimento reduzido

Quem ativa "reduzir movimento" no sistema vê tudo estático: sem abertura, sem
mancha, nada preso à rolagem. Cada seção pinta o próprio fundo e as cenas
mostram o estado final. O JavaScript usa `gsap.matchMedia()` e o CSS usa as
mesmas media queries.

## Editar conteúdo

- **Contato e domínio:** `src/lib/site.js`. O domínio também aparece no
  `index.html` (canonical, Open Graph e JSON-LD).
- **Projetos:** lista `PROJETOS` em `sections/Trabalhos.jsx`. Cada um tem um
  desenho no lugar das telas. Para um projeto novo, crie o desenho (`Arte...`)
  e a cena dele em `CENAS`.
- **EducAI (prévia, ainda não lançado):** `sections/Educai.jsx`, com as
  capturas em `src/assets/educai/`.
- **Habilidades:** lista no topo de `Habilidades.jsx`.
- **Aparelho do topo:** as duas telas (a interface e o código por trás dela)
  são um exemplo inventado, desenhado em `design/topo.html`. Para mudar,
  edite o HTML e gere de novo:

  ```bash
  npm i -D puppeteer-core && node design/gerar-topo.mjs && npm un puppeteer-core
  ```

- **Imagem de compartilhamento:** edite `design/og-image.html` e gere de novo:

  ```bash
  npm i -D puppeteer-core && node design/gerar-og-image.mjs && npm un puppeteer-core
  ```

- **Favicon:** `public/favicon.svg` é o monograma "FM" convertido em caminhos
  (favicons não carregam fontes).

## Skills do Claude Code

`.claude/skills/` traz as skills usadas para desenhar e animar o site. O Claude
Code as carrega sozinho quando o assunto aparece:

- `frontend-design` (Anthropic, Apache 2.0): direção visual sem a cara de
  página gerada por IA.
- `gsap-*` (GreenSock, MIT): ScrollTrigger, React, plugins, timeline,
  utilitários e performance.

No navegador, em desenvolvimento, `window.gsap` e `window.ScrollTrigger` ficam
expostos para inspecionar as cenas pelo console.
