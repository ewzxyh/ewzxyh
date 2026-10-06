# 02 · Cartão nativo do X (2:1, 1600×800, tema claro)

**Opcional.** Sem este arquivo o X usa a imagem principal do brief 01, que já cabe no recorte 2:1 (perde só 15 px em
cima e embaixo). Vale gerar este cartão se você quiser (a) a geometria 2:1 exata e (b) o nome fora da área onde o X
desenha o selo com o domínio. Leia antes o [00-brand-spec.md](00-brand-spec.md).

## 1. Ficha técnica

| Item | Valor |
| --- | --- |
| Tamanho final | **1600 × 800 px** (2:1). Aceito pelo X de 300×157 a 4096×4096, < 5 MB |
| Formato | PNG, sRGB, opaco (JPG/PNG/WEBP/GIF funcionam; SVG não). Alvo ≤ 400 KB |
| Arquivos | `public/og/ewzxyh-x-light.png` (pt-BR) e `public/og/ewzxyh-x-light-en.png` (en) |
| Tags geradas | `twitter:card=summary_large_image`, `twitter:site=@ewzxyh`, `twitter:creator=@ewzxyh`, `twitter:title`, `twitter:description`, `twitter:image`, `twitter:image:alt` (alt ≤ 420 caracteres) |
| Limites de texto | título ≤ 70 caracteres (o do site tem 53), descrição ≤ 200 (a do site tem 140 em pt-BR e 155 em inglês) |
| Cache | O X guarda o cartão cerca de 7 dias, por URL. O hash do arquivo na URL (`?v=...`) renova sozinho |
| `twitter:card` | Sempre explícito: ele **não** herda do Open Graph |

A documentação oficial de cartões do X foi removida do site da empresa; estes números vêm das últimas cópias arquivadas.
O validador de cartões também não existe mais: teste montando um rascunho de post com o link.

## 2. O que muda em relação ao brief 01

- Proporção 2:1 exata (1600 × 800) em vez de 40:21; não há recorte.
- O nome sobe: o X desenha o domínio num selo escuro no canto inferior esquerdo do cartão grande (comportamento
  observado, não documentado). A faixa inferior esquerda (x 24..400, y 660..776, estimativa conservadora) fica livre.
- Mesma hierarquia, mesmas cores, mesmas fontes; as medidas crescem 33% e o nome cabe em 1408 px de largura.

Referências prontas: `assets/x-reference-pt-1600x800.png` e `assets/x-reference-en-1600x800.png`. Guia (só para você):
`assets/x-layout-guide-1600x800.png`.

## 3. Composição (canvas 1600 × 800, origem no canto superior esquerdo)

| # | Elemento | Posição e tamanho | Estilo |
| --- | --- | --- | --- |
| 1 | Fundo | Tela inteira | `#f5f5f4` chapado + curvas de nível (brief 00, seção 5) |
| 2 | Moldura | Recuo de 32 px (x 32..1568, y 32..768) | 1 px `#d7d3d1` |
| 3 | Quadradinhos | 12×12 px em (54, 54), (1534, 54), (54, 734), (1534, 734) | Sólidos `#f97316` |
| 4 | **Logo** | x 96, y 80, altura 64 (largura ≈ 184) | `ewzxyh-logo-black.png`, intacto |
| 5 | Domínio | Alinhado à direita em x 1504, topo y 90 | JetBrains Mono 500, 34 px, +0,04 em, `#79716b` |
| 6 | Chip do cargo | x 96, y 208, altura 72 (largura ≈ 786), padding horizontal 27 | Borda 1 px `#d7d3d1`, fundo `#f5f5f4` a 90%; JetBrains Mono 500, 32 px, MAIÚSCULAS, +0,16 em, `#79716b` |
| 7 | Frase de valor | x 96, y 314 (letras entre y 324 e 379) | JetBrains Mono 500, 58 px, entrelinha 1,2, −0,02 em, `#1c1917`, uma linha |
| 8 | Stack | x 96, y 408 | JetBrains Mono 400, 32 px, +0,02 em, `#79716b` |
| 9 | **Nome** | Texto de x 96 a 1504 (1408 px; as letras vão de x ≈ 108 a 1495), letras de ≈ 111 px de altura, entre y ≈ 540 e 651 | AT Amiga 400, ≈ 165 px, MAIÚSCULAS, `#1c1917` |

Zona livre do selo do X: x 24..400, y 660..776. O quadradinho de (54, 734) fica nela; se o selo cobri-lo, tudo bem.

## 4. Prompt: IA com anexos

Anexe: `ewzxyh-logo-black.png`, a referência do idioma, `lettering-enzo-yoshida-ink.png` e, se quiser,
`x-background-1600x800.png` (só o fundo, como base). Troque as variáveis:

| Variável | pt-BR (página `/`) | en (página `/en`) |
| --- | --- | --- |
| `{{REFERENCE}}` | `x-reference-pt-1600x800.png` | `x-reference-en-1600x800.png` |
| `{{VALUE_LINE}}` | `Produtos digitais prontos para operar.` | `Digital products, ready to run.` |
| `{{LANGUAGE}}` | `Portuguese` | `English` |

```text
BRAND CONTRACT
Light theme only. Flat 2D, editorial, technical, calm, precise. The canvas is a flat warm off-white (#f5f5f4) with no
gradient, no texture and no vignette. Text color is warm near-black ink (#1c1917); secondary text is warm gray
(#79716b); hairlines are #d7d3d1. The only accent is orange (#f97316), used for exactly four solid squares near the
corners of a thin frame and for nothing else. Typography is limited to two families: a wide, squared, chamfered
all-caps display face (the supplied "ENZO YOSHIDA" lettering) and JetBrains Mono for everything else. Generous
whitespace, everything left-aligned to one margin. The supplied logo is used exactly as given, never redrawn.

TASK
Design the image of a link card for X (Twitter, "summary_large_image"). Canvas: exactly 1600 x 800 px (aspect ratio
2:1), sRGB, opaque, flat 2D, LIGHT theme. Output one single image: no mockup, no device frame, nothing outside the
canvas.

ATTACHMENTS (use each exactly as described)
- Image 1, "ewzxyh-logo-black.png": the official logo (transparent PNG). Place it unchanged; never redraw, recolor,
  outline, stretch or add effects.
- Image 2, "{{REFERENCE}}": the layout of record. Reproduce composition, spacing, type styles, colors and hierarchy as
  closely as you can. If this prompt and the image disagree on a number, the image wins.
- Image 3, "lettering-enzo-yoshida-ink.png": the exact letterforms of the name. Copy them faithfully; do not substitute
  another font.

LAYOUT (pixel coordinates on the 1600 x 800 canvas, origin at the top-left corner)
1. Background: flat #f5f5f4 with faint topographic contour lines in #d7d3d1 (1 px, about 9 levels, soft irregular
   terrain with two or three off-centre peaks drawn as concentric rings). The lines are almost invisible on the left
   (about 18% opacity) and grow stronger toward the right (about 95%). No fills, no labels.
2. Frame: a 1 px hairline rectangle in #d7d3d1, inset 32 px from every edge, square corners.
3. Four solid orange (#f97316) squares, 12 x 12 px, with top-left corners at (54, 54), (1534, 54), (54, 734) and
   (1534, 734).
4. Logo (Image 1): top-left corner at (96, 80), height 64 px (width about 184 px). Unchanged.
5. Domain "ewzxyh.com": right-aligned to x = 1504, top at y = 90. JetBrains Mono Medium, 34 px, letter-spacing
   +0.04 em, color #79716b.
6. Role chip: a rectangle at (96, 208), height 72 px, width about 786 px, 1 px border #d7d3d1, fill #f5f5f4 at 90%
   opacity, 27 px horizontal padding. Inside, vertically centered: "PRODUCT ENGINEER · EWZXYH LABS" in JetBrains Mono
   Medium, 32 px, uppercase, letter-spacing +0.16 em, color #79716b.
7. Value line at (96, 314): "{{VALUE_LINE}}" in JetBrains Mono Medium, 58 px, line-height 1.2, letter-spacing
   -0.02 em, color #1c1917, one single line. Keep the {{LANGUAGE}} text exactly as written, with accents and
   punctuation.
8. Stack line at (96, 408): "Next.js · React · TypeScript · Laravel · SaaS" in JetBrains Mono Regular, 32 px,
   letter-spacing +0.02 em, color #79716b.
9. Name: "ENZO YOSHIDA" in the supplied lettering (Image 3), color #1c1917, left edge at x = 96, spanning the content
   width to x = 1504 (about 1408 px wide, letters about 111 px tall), occupying y 540 to 651. It is the largest
   element on the card.

KEEP CLEAR: the bottom-left band x 24-400, y 660-776 holds nothing (the platform draws a label there). Everything
else stays inside x 96-1504 and y 32-768.

QUALITY BAR
Crisp vector-like edges. Text exactly as written: no extra, missing, mirrored or merged letters; even letter-spacing.
No noise, no blur, no artifacts. It must read as a calm, precise, professional editorial card.

DO NOT INCLUDE
dark background, dark mode, neon, glow, gradients, mesh gradient, blobs, 3D, glassmorphism, drop shadow, bevel,
stock photo, person, face, illustration, mascot, icons, emoji, circuit board, grid, dots, particles, bokeh, noise,
grain, vignette, watermark, extra text, lorem ipsum, misspelled words, distorted letters, redrawn or recolored logo,
additional logos, QR code, price, badge, serif font, handwriting, italic, more than one accent color.
```

Se o gerador só entrega outras proporções, gere em 3:2 ou 16:9 e recorte para 2:1 mantendo o miolo; o conteúdo fica dentro
de x 96..1504 e y 32..768.

## 5. Montagem manual

Mesmas camadas do brief 01 (seção 6), com os números da tabela da seção 3 acima. O fundo é
`assets/x-background-1600x800.png` (moldura, quadradinhos e curvas já na posição certa) ou o Prompt 2 do brief 01
trocando o tamanho para 1600 × 800, a moldura para 32 px e os quadradinhos para os da seção 3.

## 6. Controle de qualidade

- [ ] 1600 × 800, sRGB, sem transparência, ≤ 400 KB.
- [ ] Tudo do checklist do brief 01 (nome, frase, logo, cores, teste de miniatura).
- [ ] Nada na faixa x 24..400, y 660..776, exceto o quadradinho de canto.
- [ ] Teste em miniatura de 500 px de largura (largura típica do cartão na linha do tempo): nome e frase legíveis.

## 7. Publicar

```bash
bun -e "import sharp from 'sharp'; await sharp('entrada.png').resize(1600, 800).flatten({ background: '#f5f5f4' }).png({ compressionLevel: 9, effort: 10 }).toFile('public/og/ewzxyh-x-light.png')"
```

Para a versão em inglês, o arquivo é `ewzxyh-x-light-en.png`. Depois do deploy, monte um rascunho de post no X com
`https://ewzxyh.com` (e `https://ewzxyh.com/en`) para ver o cartão. Se aparecer o antigo, é o cache de ~7 dias: use
uma URL com parâmetro (`https://ewzxyh.com/?x=2`) no rascunho.
