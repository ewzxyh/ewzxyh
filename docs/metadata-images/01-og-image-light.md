# 01 · Imagem Open Graph principal (1200×630, tema claro)

É a imagem que aparece no LinkedIn, Facebook, WhatsApp, Slack, Discord, iMessage, Telegram e, se você não gerar o cartão
do brief 02, também no X. Leia antes o [00-brand-spec.md](00-brand-spec.md): este brief só detalha esta imagem.

## 1. Ficha técnica

| Item | Valor |
| --- | --- |
| Tamanho final | **1200 × 630 px** (40:21, 1,905:1) |
| Para editar | 2400 × 1260 px (2x), depois reduza |
| Formato | PNG, sRGB, **opaco** (sem transparência). JPEG qualidade 88, 4:4:4, só se o PNG passar de 300 KB |
| Peso | ≤ 300 KB (alvo 100 KB; o PNG de referência recomprimido tem 73 KB) |
| Arquivos | `public/og/ewzxyh-og-light.png` (página `/`, pt-BR) e `public/og/ewzxyh-og-light-en.png` (página `/en`) |
| Texto alternativo | Definido no código (`lib/share-images.ts`): "Enzo Yoshida (Enzo Hideki Yoshida) - Product Engineer, Ewzxyh Labs" |
| Tags geradas | `og:image`, `og:image:width`, `og:image:height`, `og:image:type`, `og:image:alt`, `twitter:image`, `twitter:image:alt`, JSON-LD `ImageObject`, sitemap `image:image` |

### Limites das redes (pesquisa de 2026-10-05)

| Rede | O que exige ou recomenda | Observação |
| --- | --- | --- |
| Meta (Facebook, Messenger) | Mínimo 200×200; recomendado ≥ 1200×630; ≥ 600×315 para cartão grande; manter 1,91:1; ≤ 8 MB | Guarda a imagem por URL; use "Scrape Again" no debugger |
| LinkedIn | 1,91:1, ≥ 1200×627, ≤ 5 MB, JPG/PNG/GIF; abaixo de 401 px de largura vira miniatura | O Post Inspector só atualiza posts novos |
| X (`summary_large_image`) | 2:1, mínimo 300×157, máximo 4096×4096, < 5 MB, JPG/PNG/WEBP/GIF (sem SVG); alt ≤ 420 caracteres | Documentação oficial removida; dados de cópias arquivadas. Cartão em cache por cerca de 7 dias |
| WhatsApp | og:image absoluta, < 600 KB, ≥ 300 px de largura, proporção ≤ 4:1; `<head>` dentro dos primeiros 300 KB do HTML | Sem debugger. Testes da comunidade: imagens acima de ~300 KB somem |
| Slack, Discord | Usam Open Graph/Twitter Card; Slack guarda ~30 min | Discord aumenta a imagem com `twitter:card=summary_large_image` (teste da comunidade) |
| iMessage, Telegram | Sem especificação publicada | Seguem Open Graph |

Formatos: PNG e JPEG funcionam em tudo. WebP funcionou em quase tudo, mas não consta na documentação da Meta. AVIF só no
Facebook. SVG nunca.

## 2. Composição (canvas 1200 × 630, origem no canto superior esquerdo)

Referência pronta: `assets/og-reference-pt-1200x630.png` e `assets/og-reference-en-1200x630.png`. Versão com guias
(só para você): `assets/og-layout-guide-1200x630.png`.

| # | Elemento | Posição e tamanho | Estilo |
| --- | --- | --- | --- |
| 1 | Fundo | Tela inteira | `#f5f5f4` chapado + curvas de nível topográficas (seção 5 do brief 00) |
| 2 | Moldura | Retângulo recuado 24 px (x 24..1176, y 24..606) | 1 px `#d7d3d1`, cantos retos |
| 3 | Quadradinhos | 10×10 px em (40, 40), (1150, 40), (40, 580), (1150, 580) | Sólidos `#f97316` |
| 4 | **Logo** | x 72, y 60, altura 48 (largura ≈ 138) | `ewzxyh-logo-black.png`, intacto |
| 5 | Domínio | Alinhado à direita em x 1128, topo y 68 | JetBrains Mono 500, 26 px, +0,04 em, `#79716b`, "ewzxyh.com" |
| 6 | Chip do cargo | x 72, y 156, altura 54 (largura ≈ 588), padding horizontal 20 | Borda 1 px `#d7d3d1`, fundo `#f5f5f4` a 90%; texto JetBrains Mono 500, 24 px, MAIÚSCULAS, +0,16 em, `#79716b` |
| 7 | Frase de valor | x 72, y 236 (ocupa até y 289) | JetBrains Mono 500, 44 px, entrelinha 1,2, −0,02 em, `#1c1917`, uma linha |
| 8 | Stack | x 72, y 306 | JetBrains Mono 400, 24 px, +0,02 em, `#79716b` |
| 9 | **Nome** | Texto de x 72 a 1128 (1056 px; as letras vão de x ≈ 81 a 1122), letras de ≈ 87 px de altura, base em y ≈ 558 | AT Amiga 400, ≈ 124 px, MAIÚSCULAS, `#1c1917` |

Ordem de leitura: nome → frase → cargo → logo → domínio → stack. Detalhes de cor, fonte e fundo estão no brief 00.

## 3. Como o gerador deve receber os anexos

Anexe nesta ordem e cite os nomes no prompt.

1. `assets/ewzxyh-logo-black.png`: o logo oficial (transparente).
2. `assets/og-reference-pt-1200x630.png` (ou `og-reference-en-1200x630.png` para a versão em inglês): layout de
   referência com as fontes reais.
3. `assets/lettering-enzo-yoshida-ink.png`: as letras exatas de "ENZO YOSHIDA".
4. Opcional: `assets/og-background-1200x630.png`, se o gerador permitir construir sobre uma base.

Não anexe `og-layout-guide-1200x630.png`: as linhas coloridas apareceriam no resultado.

## 4. Prompt 1: IA com anexos

Uma versão por idioma. Troque as três variáveis `{{...}}` pelos valores da tabela e cole o resto como está.

| Variável | pt-BR (página `/`) | en (página `/en`) |
| --- | --- | --- |
| `{{REFERENCE}}` | `og-reference-pt-1200x630.png` | `og-reference-en-1200x630.png` |
| `{{VALUE_LINE}}` | `Produtos digitais prontos para operar.` | `Digital products, ready to run.` |
| `{{LANGUAGE}}` | `Portuguese` | `English` |

```text
BRAND CONTRACT
Light theme only. Flat 2D, editorial, technical, calm, precise. The canvas is a flat warm off-white (#f5f5f4) with no
gradient, no texture and no vignette. Text color is warm near-black ink (#1c1917); secondary text is warm gray
(#79716b); hairlines are #d7d3d1. The only accent is orange (#f97316), used for exactly four solid 10 px squares near
the corners of a thin frame and for nothing else. Typography is limited to two families: a wide, squared, chamfered
all-caps display face (the supplied "ENZO YOSHIDA" lettering) and JetBrains Mono for everything else. Generous
whitespace, everything left-aligned to one margin. The supplied logo is used exactly as given, never redrawn.

TASK
Design a social-share card (Open Graph image) for a personal portfolio. Canvas: exactly 1200 x 630 px (aspect ratio
40:21, 1.905:1), sRGB, opaque, flat 2D, LIGHT theme. Output one single image: no mockup, no device frame, no shadow
around the card, nothing outside the canvas.

ATTACHMENTS (use each exactly as described)
- Image 1, "ewzxyh-logo-black.png": the official logo (transparent PNG). Place it unchanged. Do not redraw, recolor,
  outline, stretch or add effects to it.
- Image 2, "{{REFERENCE}}": the layout of record. Reproduce its composition, spacing, type styles, colors and
  hierarchy as closely as you can. If this prompt and the image disagree on a number, the image wins.
- Image 3, "lettering-enzo-yoshida-ink.png": the exact letterforms of the name. Copy them faithfully (wide, squared,
  all-caps, chamfered corners). Do not substitute another font.
- Image 4 (optional), "og-background-1200x630.png": the background-only layer, if you prefer to build on top of it.

LAYOUT (pixel coordinates on the 1200 x 630 canvas, origin at the top-left corner)
1. Background: flat #f5f5f4 with faint topographic contour lines in #d7d3d1, 1 px stroke, about 9 contour levels,
   drawn as a soft irregular terrain with two or three off-centre peaks (concentric rings). The lines are almost
   invisible on the left (about 18% opacity) and grow stronger toward the right (about 95%), so the text column stays
   calm. No fills, no labels, no numbers.
2. Frame: a 1 px hairline rectangle in #d7d3d1, inset 24 px from every edge, square corners.
3. Four solid orange (#f97316) squares, 10 x 10 px, with their top-left corners at (40, 40), (1150, 40), (40, 580)
   and (1150, 580).
4. Logo (Image 1): top-left corner at (72, 60), height 48 px (width about 138 px). Unchanged.
5. Domain "ewzxyh.com": right-aligned to x = 1128, top at y = 68. JetBrains Mono Medium, 26 px, letter-spacing +0.04 em,
   color #79716b.
6. Role chip: a rectangle at (72, 156), height 54 px, width about 588 px, 1 px border #d7d3d1, fill #f5f5f4 at 90%
   opacity, 20 px horizontal padding. Inside, vertically centered: "PRODUCT ENGINEER · EWZXYH LABS" in JetBrains Mono
   Medium, 24 px, uppercase, letter-spacing +0.16 em, color #79716b.
7. Value line at (72, 236): "{{VALUE_LINE}}" in JetBrains Mono Medium, 44 px, line-height 1.2, letter-spacing
   -0.02 em, color #1c1917, one single line, left-aligned. Keep the {{LANGUAGE}} text exactly as written, with its
   accents and punctuation.
8. Stack line at (72, 306): "Next.js · React · TypeScript · Laravel · SaaS" in JetBrains Mono Regular, 24 px,
   letter-spacing +0.02 em, color #79716b.
9. Name: "ENZO YOSHIDA" in the supplied lettering (Image 3), color #1c1917, left edge at x = 72, spanning the full content
   width to x = 1128 (about 1056 px wide, letters about 87 px tall), baseline at about y = 558. It is the largest
   element on the card.

HIERARCHY (reading order): 1 name, 2 value line, 3 role chip, 4 logo, 5 domain, 6 stack. Everything is left-aligned at
x = 72 except the domain.

SAFE AREAS
Everything that matters stays inside x 72-1128 and y 24-606, so a 2:1 crop (1200 x 600, losing 15 px at the top and at
the bottom) loses nothing.

QUALITY BAR
Crisp vector-like edges. Text exactly as written: no extra, missing, mirrored or merged letters; even letter-spacing.
No noise, no blur, no compression artifacts. It must read as a calm, precise, professional editorial card.

DO NOT INCLUDE
dark background, dark mode, neon, glow, gradients, mesh gradient, blobs, 3D, glassmorphism, drop shadow, bevel,
stock photo, person, face, illustration, mascot, icons, emoji, circuit board, grid, dots, particles, bokeh, noise,
grain, vignette, watermark, extra text, lorem ipsum, misspelled words, distorted letters, redrawn or recolored logo,
additional logos, QR code, price, badge, serif font, handwriting, italic, more than one accent color.
```

## 5. Prompt 2: só o fundo (caminho híbrido)

Use quando o gerador errar letras ou deformar o logo. Ele cria apenas a base; o logo, o nome e os textos entram depois,
com os arquivos reais (seção 6). Se preferir não usar IA, `assets/og-background-1200x630.png` já é essa base.

```text
Create ONLY a background plate, exactly 1200 x 630 px (aspect ratio 40:21), flat 2D, light theme, for a professional
portfolio share card. No text, no logo, no people, no objects, no icons.

Content:
- Flat warm off-white fill, #f5f5f4. No gradient, no texture, no noise, no vignette.
- Faint topographic contour lines, color #d7d3d1, 1 px stroke, rounded line ends, no fills, no elevation labels. About 9
  contour levels of a soft, irregular imaginary terrain with two or three off-centre peaks drawn as concentric rings.
  The lines run off the canvas edges. They are almost invisible on the left side (about 18% opacity) and gradually
  stronger toward the right (about 95%): the left 55% of the canvas stays calm because text will sit there.
- A 1 px hairline rectangle frame, color #d7d3d1, inset 24 px from all four edges, square corners.
- Four solid orange (#f97316) squares, 10 x 10 px, with top-left corners at (40, 40), (1150, 40), (40, 580), (1150, 580).
- Nothing else. Do not add any other color, shape or decoration.

Do not include: dark colors, gradients, glow, shadows, 3D, photos, circuit patterns, grids, dots, particles, bokeh,
watermarks, text of any kind.
```

## 6. Montagem manual (Figma, Canva ou Photopea)

Crie um quadro de 1200 × 630 e empilhe as camadas, de baixo para cima. No Figma, "letter spacing" em % equivale a
"em × 100". O Canva usa outra escala de espaçamento entre letras: acerte olhando para a referência.

| Camada | Arquivo ou texto | Posição (x, y) | Tamanho | Estilo |
| --- | --- | --- | --- | --- |
| 1 Fundo | `og-background-1200x630.png` (ou a base gerada pelo Prompt 2) | 0, 0 | 1200 × 630 | n/a |
| 2 Logo | `ewzxyh-logo-black.svg` (prefira SVG) | 72, 60 | altura 48 | Sem efeitos |
| 3 Domínio | `ewzxyh.com` | direita em 1128, y 68 | 26 px | JetBrains Mono Medium, +4%, `#79716b` |
| 4 Chip (retângulo) | n/a | 72, 156 | 588 × 54 | Preenchimento `#f5f5f4` 90%, borda interna 1 px `#d7d3d1`, raio 0 |
| 5 Chip (texto) | `PRODUCT ENGINEER · EWZXYH LABS` | 93, centralizado verticalmente no chip | 24 px | JetBrains Mono Medium, MAIÚSCULAS, +16%, `#79716b` |
| 6 Frase | `{{VALUE_LINE}}` da tabela da seção 4 | 72, 236 | 44 px, altura de linha 120% | JetBrains Mono Medium, −2%, `#1c1917` |
| 7 Stack | `Next.js · React · TypeScript · Laravel · SaaS` | 72, 306 | 24 px | JetBrains Mono Regular, +2%, `#79716b` |
| 8 Nome | `lettering-enzo-yoshida-ink.png` (ou o texto "ENZO YOSHIDA" em AT Amiga) | 72, ≈ 470 (letras entre y 470 e 558) | largura 1056 | `#1c1917` |

Conferência: sobreponha `og-layout-guide-1200x630.png` com 40% de opacidade e veja se tudo cai nas mesmas posições;
depois apague a sobreposição.

## 7. Notas por ferramenta

- **Geradores com proporção fixa** (ChatGPT/gpt-image, Gemini): a maioria não entrega 1200×630 exatos. Gere na
  proporção mais próxima (paisagem larga), depois recorte e redimensione para 1200×630 sem esticar. Como o conteúdo
  fica dentro de x 72..1128 e y 24..606, um recorte de 15 px em cima e embaixo não machuca.
- **Midjourney:** `--ar 40:21`, as referências como image prompts e os itens proibidos em `--no`. Texto é o ponto
  fraco: prefira o caminho híbrido.
- **Ideogram / Recraft:** bons com texto; cole o prompt inteiro e anexe as referências.
- **Flux / difusão local:** image-to-image com a referência e o negativo na caixa própria; ajuste a força até a
  composição ficar igual à referência.
- Qualquer ferramenta: gere algumas variações, escolha a de texto exato e logo intacto, e **componha o logo real por
  cima** mesmo que o gerado pareça certo (compare lado a lado com o SVG).

## 8. Controle de qualidade

- [ ] Mede exatamente 1200 × 630 (ou 2400 × 1260 para editar), sRGB, sem transparência.
- [ ] Nome escrito `ENZO YOSHIDA`, letras iguais ao lettering; sem letra faltando ou espelhada.
- [ ] Frase com acentos corretos ("Produtos digitais prontos para operar." / "Digital products, ready to run.").
- [ ] Logo igual ao arquivo original (compare lado a lado), preto/grafite, sem efeito.
- [ ] Só `#f97316` nos quatro quadradinhos; fundo sem degradê; curvas de nível discretas.
- [ ] **Teste de miniatura:** reduza para 300 px de largura: o nome e o logo continuam legíveis.
- [ ] **Teste 2:1:** corte 15 px em cima e embaixo: nada importante é cortado.
- [ ] **Teste quadrado:** corte o miolo 630 × 630: ainda parece uma peça de marca (o resto é decoração).
- [ ] **Teste em escala de cinza:** a hierarquia se mantém (nome, frase, cargo).
- [ ] Arquivo ≤ 300 KB.

## 9. Exportar, otimizar e publicar

Otimização sem perda (também remove o canal alfa; se a proporção de entrada for outra, recorta pelo centro):

```bash
bun -e "import sharp from 'sharp'; await sharp('entrada.png').resize(1200, 630).flatten({ background: '#f5f5f4' }).png({ compressionLevel: 9, effort: 10 }).toFile('public/og/ewzxyh-og-light.png')"
```

Troque o nome de saída para `ewzxyh-og-light-en.png` na versão em inglês. Depois:

1. `bun run dev` e confira `curl -s localhost:3000 | grep og:image`: a URL deve terminar em `?v=<hash>`.
2. Deploy. Valide com os links do [README](README.md) (Sharing Debugger, Post Inspector, rascunho no X).
3. Se uma rede ainda mostrar a imagem antiga, é cache dela: o hash na URL já força a troca em compartilhamentos novos.
