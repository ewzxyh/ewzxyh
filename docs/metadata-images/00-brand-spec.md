# 00 · Especificação de marca (tema claro)

Base comum de todos os briefs. Os números vêm de `assets/og-reference.html`, que usa o logo, as fontes e a paleta
reais do site; qualquer valor aqui pode ser conferido ali.

## 1. Identidade em poucas linhas

- **Quem:** Enzo Hideki Yoshida (Enzo Yoshida), Product Engineer, fundador da Ewzxyh Labs.
- **Como se apresenta:** "Product Engineer" é a identidade e **Next.js** é a única tecnologia que aparece nas imagens.
  "Desenvolvedor full-stack" (em português), React, TypeScript, Laravel e o resto da stack ficam no site e nos metadados
  (descrição, `llms.txt`, JSON-LD), **não** nas imagens.
- **O que a imagem deve transmitir:** profissionalismo, clareza, precisão técnica, calma. Editorial e minimalista; não
  "tech neon", não "startup colorida".
- **Estilo em palavras-chave (para o gerador):** flat 2D, editorial, technical, calm, precise, light theme, generous
  whitespace, hairlines, monospace type, topographic contour lines.
- **Referência viva:** o site no tema claro (`assets/reference-site-light-hero.png`, `assets/reference-site-light-contact.png`).

## 2. Logo EHY

| Arquivo (`assets/`) | Proporção | Uso |
| --- | --- | --- |
| `ewzxyh-logo-black.png` / `.svg` | 525:182 (2,885:1), PNG 2400×832 transparente | **Logo EHY principal em fundo claro.** É o que entra em todas as imagens deste kit |
| `ewzxyh-icon-black.png` / `.svg` | 172:182 (0,945:1), PNG 1032×1092 transparente | Só o símbolo; avatares e ícones |
| `ewzxyh-logo-white.*`, `ewzxyh-icon-white.*` | idem | Fundo escuro (não usado no tema claro) |

**Como descrever o logo para um gerador:** o wordmark **EHY** (as iniciais de Enzo Hideki Yoshida), feito de três formas
geométricas grossas e de traço uniforme, com pontas totalmente arredondadas: um anel aberto como um "C" com um ponto
sólido no centro (E); um arco com um ponto flutuando acima do ombro esquerdo (H); um "U" aberto com um ponto abaixo, à
direita (Y). Grafite quase preto (`#0c0a09`) com um degradê quentíssimo e quase imperceptível para marrom (`#433636` a
`#675050`) nos reflexos.

**Regras de uso**

- **Posição nos cartões: canto superior direito**, com a borda direita no x = 1128 (a margem de 72 px) e o topo no
  y = 60. Altura 48 px em canvas de 1200 px de largura (largura ≈ 138 px). Em outros tamanhos, mantenha 4% da largura do
  canvas de altura (1600 px → 64 px).
- Área livre mínima: 50% da altura do logo em todos os lados (24 px quando o logo tem 48 px).
- Tamanho mínimo: wordmark 96 px de largura em tela; símbolo 16 px.
- **Sempre o arquivo original, sem redesenhar.** Geradores de imagem deformam logos e trocam formas; se o resultado
  mudar qualquer curva, componha o PNG/SVG real por cima.
- Proibido: recolorir (inclusive preto puro ou laranja), contorno, sombra, brilho, chanfro, esticar, girar, reordenar as
  letras, trocar por texto ("EY", "EHY", "EWZXYH"), colocar sobre foto ou sobre fundo escuro, criar lockup com slogan.

## 3. Cores

| Token | Hex | Uso nas imagens | Proporção aproximada da área |
| --- | --- | --- | --- |
| `background` | `#f5f5f4` | Fundo chapado, sem degradê | ≈ 90% |
| `ink` | `#1c1917` | Nome, frase de valor | texto grande |
| `muted` | `#79716b` | Badge do cargo, linha de apoio | texto secundário |
| `line` | `#d7d3d1` | Moldura de 1 px, contorno do badge, curvas de nível | só linhas finas |
| `accent` | `#f97316` (laranja) | **Quatro quadrados de 10×10 nos cantos. Nada além disso** | < 0,1% |

Contrastes sobre `#f5f5f4`: tinta 16,0:1 (AAA); muted 4,39:1 (vale para texto grande, ≥ 24 px); linha 1,36:1 e laranja
2,57:1 são decorativos (nenhuma informação depende deles).

O tema escuro do site (`#0c0a09`) **não** entra nestas imagens, exceto como tile do favicon (brief 03).

## 4. Hierarquia tipográfica

Duas famílias, nada além delas.

| Nível | Elemento | Fonte | Tamanho (canvas 1200) | Peso | Espaçamento | Caixa | Cor | Papel |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | **ENZO YOSHIDA** | **AT Amiga** Regular | ≈ 124 px, ajustado para ocupar 1056 px de largura | 400 | 0 | MAIÚSCULAS | `ink` | Identidade. É o que precisa sobreviver a um thumbnail |
| 2 | Frase de valor | **JetBrains Mono** | 44 px, entrelinha 1,2 | 500 | −0,02 em | Normal | `ink` | Proposta de valor (uma linha) |
| 3 | PRODUCT ENGINEER · EWZXYH LABS | JetBrains Mono | 24 px | 500 | +0,16 em | MAIÚSCULAS | `muted` | **Badge** do cargo, no canto superior esquerdo, com 54 px de altura e borda de 1 px `line` |
| 4 | Logo EHY | arquivo anexo | 48 px de altura | n/a | n/a | n/a | n/a | Marca, no canto superior direito |
| 5 | Linha de apoio (`Next.js · SaaS`) | JetBrains Mono | 24 px | 400 | +0,02 em | Normal | `muted` | Tecnologia e tipo de produto, sob a frase |

- **AT Amiga** é a fonte de display do site (arquivo em `app/fonts/AtAmiga-Regular.woff2`; use só no nome, como no hero
  e no rodapé "LABS"). É larga, quadrada, de cantos chanfrados, só maiúsculas. Nenhum gerador a conhece pelo nome:
  anexe `assets/lettering-enzo-yoshida-ink.png` ou componha o texto com a fonte real. Confira a licença antes de
  embuti-la em arquivos de design fora do site.
- **JetBrains Mono** é a fonte de texto (Google Fonts, licença OFL, pesos 400 e 500). Se faltar, o substituto mais
  próximo é IBM Plex Mono ou Geist Mono.
- Sem itálico, sem negrito além do peso 500, sem sombra, contorno ou degradê no texto.
- Tudo alinhado à esquerda no x = 72, exceto o logo EHY (alinhado à direita no x = 1128).
- **Nenhum endereço de site na imagem** (nem "ewzxyh.com", nem "www"): geradores erram URLs e as redes já mostram o
  domínio do link.
- Acentos corretos em português (produtos, operações, integração).
- Só os níveis 1 e 2 precisam ser legíveis em um cartão pequeno (largura de 300 a 500 px = escala de 0,25 a 0,42): o
  nome fica com 31 a 52 px e a frase com 11 a 18 px. Os níveis 3 a 5 são apoio (a mesma informação está no título e na
  descrição do link).

## 5. Fundo e detalhes

O fundo é o campo de **curvas de nível topográficas** que o site já usa.

| Elemento | Especificação |
| --- | --- |
| Base | Chapado `#f5f5f4`; nenhum degradê, textura, ruído ou vinheta |
| Curvas de nível | 9 níveis de um terreno imaginário suave, cerca de 2 a 3 "picos" (anéis concêntricos) fora do centro; traço de 1 px (1,15 px em 1200), cor `#d7d3d1`, pontas arredondadas, sem preenchimento, sem rótulos nem números |
| Opacidade das curvas | Cresce da esquerda para a direita: ≈ 18% na borda esquerda, 70% no meio, 95% na direita. A coluna do texto fica calma |
| Moldura | Retângulo de 1 px `#d7d3d1`, recuo de 24 px nos quatro lados, cantos retos |
| Quadradinhos | 4 quadrados sólidos de 10×10 px `#f97316` em (40, 40), (1150, 40), (40, 580), (1150, 580) |
| Alternativa ultralimpa | Sem curvas: só moldura e quadradinhos sobre o fundo chapado |

Fica de fora: manchas ou malhas de degradê, grade de pontos, **placa de circuito (era o fundo da imagem antiga)**, vidro
fosco, 3D, fotos de banco de imagens, partículas, estrelas, neon, bokeh, sombras.

`assets/og-background-1200x630.png` (e a versão 2x) é exatamente esse fundo, pronto para usar como base.

## 6. Grade e proporções

- Canvas **1200×630** (40:21 = 1,905:1). Exporte também em 2x (2400×1260) se for editar.
- Margem de conteúdo 72 px; largura útil 1056 px. Moldura a 24 px. Quadradinhos a 40 px das bordas.
- Faixas verticais (y): **linha do topo (badge 57–111 à esquerda, logo EHY 60–108 à direita)** · frase 236–289 · apoio
  306–335 · respiro 335–470 · **nome 470–558** · margem inferior até 606 (moldura).
- Zonas de recorte (guia em `assets/og-layout-guide-1200x630.png`, só para humanos):
  - recorte 2:1 (cartão grande do X): perde 15 px em cima e embaixo; tudo importante já está em y 24..606;
  - recorte quadrado central (alguns apps): perde 285 px de cada lado; aceite que ali só sobra o miolo, nada vital
    fica fora de x 72..1128;
  - o X desenha o domínio do link num selo no canto inferior esquerdo do cartão grande (comportamento observado, sem
    documentação oficial; tamanho estimado em ≈ 265 × 85 px nesta escala, x 16..280, y 515..600). Na imagem principal
    o nome passa por essa área; só o cartão dedicado do brief 02 a evita.

## 7. Textos aprovados

| Elemento | pt-BR | en |
| --- | --- | --- |
| Nome | ENZO YOSHIDA | ENZO YOSHIDA |
| Badge do cargo | PRODUCT ENGINEER · EWZXYH LABS | PRODUCT ENGINEER · EWZXYH LABS |
| Frase de valor | Produtos digitais prontos para operar. | Digital products, ready to run. |
| Linha de apoio | Next.js · SaaS | Next.js · SaaS |

A frase vem do hero do site ("Transformo ideias e operações manuais em produtos digitais prontos para operar" / "I turn
ideas and manual operations into digital products ready to run").

Não escreva: o endereço do site, preço, "melhor", "#1", selos, números que não estejam no site, emoji, "www",
"desenvolvedor full-stack", React, Laravel ou outras tecnologias na linha de apoio (a stack completa fica no site). O estúdio é sempre "Ewzxyh Labs" (com
"Labs") e o handle é `@ewzxyh`. O texto alternativo (`og:image:alt`) é definido no código (`lib/share-images.ts`), não na
imagem.

## 8. Contrato visual (cole no topo de qualquer prompt)

```text
BRAND CONTRACT
Light theme only. Flat 2D, editorial, technical, calm, precise. The canvas is a flat warm off-white (#f5f5f4) with no
gradient, no texture and no vignette. Text color is warm near-black ink (#1c1917); secondary text is warm gray
(#79716b); hairlines are #d7d3d1. The only accent is orange (#f97316), used for exactly four solid 10 px squares near
the corners of a thin frame and for nothing else. Typography is limited to two families: a wide, squared, chamfered
all-caps display face (the supplied "ENZO YOSHIDA" lettering) and JetBrains Mono for everything else. Generous
whitespace, everything left-aligned to one margin, except the EHY logo at the top right. The supplied EHY logo is used
exactly as given, never redrawn. No website address or URL appears anywhere in the image.
```

## 9. Lista de proibições (negative prompt)

```text
NEGATIVE
website address, URL, domain name, www, dark background, dark mode, black background, neon, glow, gradients, mesh
gradient, blobs, 3D, glassmorphism, drop shadow, bevel, emboss, stock photo, person, face, hands, portrait,
illustration, mascot, icons, emoji, stickers, circuit board, grid, dots, particles, stars, bokeh, noise, grain,
vignette, texture, watermark, extra text, lorem ipsum, misspelled words, distorted letters, redrawn logo, recolored
logo, outlined logo, additional logos, QR code, price, ribbon, rounded card with shadow, serif font, handwriting,
italic, cursive, more than one accent color, React, Laravel, TypeScript
```

(Midjourney: coloque em `--no`. Ideogram e Flux: campo de prompt negativo. ChatGPT e Gemini: inclua como a frase
final "Do not include: ...".)

## 10. Checklist de marca (vale para todos os briefs)

- [ ] Fundo claro `#f5f5f4`, sem degradê.
- [ ] Logo EHY original, intacto, em preto/grafite, no canto superior direito; badge do cargo no canto superior esquerdo.
- [ ] Nenhum endereço de site, URL ou "www" na imagem.
- [ ] Nome em AT Amiga (ou no lettering anexado), ocupando a largura útil, sem erro de letra.
- [ ] Só duas famílias; textos exatamente os da tabela 7 (só Next.js como tecnologia).
- [ ] Laranja apenas nos quatro quadradinhos.
- [ ] Nada importante fora de x 72..1128 / y 24..606.
- [ ] Contraste do texto principal ≥ 7:1; nenhum texto menor que 24 px (em 1200 de largura).
