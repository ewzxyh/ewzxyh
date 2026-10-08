# Imagens do metadata: instruções e prompts (tema claro)

Arquivo único para gerar as imagens que aparecem quando alguém cola o link do site no LinkedIn, WhatsApp, Slack,
Discord, iMessage, Telegram, Facebook ou X. Tem tudo o que o gerador precisa: o que anexar, os prompts prontos em
português e em inglês, o que conferir e onde salvar. Os prompts estão em inglês porque os geradores obedecem melhor; as
instruções estão em português.

Para consultar as medidas e as regras de marca por trás dos prompts: [00-brand-spec.md](00-brand-spec.md),
[01-og-image-light.md](01-og-image-light.md) e [02-x-card-light.md](02-x-card-light.md).

## 1. As três imagens

| # | Imagem | Tamanho | Salvar como (em `public/og/`) | Onde aparece |
| --- | --- | --- | --- | --- |
| 1 | Open Graph em **português** | 1200 × 630 (40:21) | `ewzxyh-og-light.png` | Página `/`: LinkedIn, Facebook, WhatsApp, Slack, Discord, iMessage, Telegram (e X, se você não fizer a imagem 3) |
| 2 | Open Graph em **inglês** | 1200 × 630 (40:21) | `ewzxyh-og-light-en.png` | Página `/en` |
| 3 | Cartão do **X** (opcional) | 1600 × 800 (2:1), uma versão em português e outra em inglês | `ewzxyh-x-light.png` e `ewzxyh-x-light-en.png` | Cartão grande do X |

O site percebe os arquivos sozinho: lê o tamanho real, escolhe a imagem de cada idioma e coloca um hash na URL para as
redes atualizarem o cache. Sem arquivo novo, continua valendo a imagem antiga (escura). Os ícones (favicon, iOS, app) já
estão prontos e não entram aqui.

## 2. O que aparece na imagem, e o que não aparece

- Só **quatro textos**: o badge `PRODUCT ENGINEER · EWZXYH LABS`, a frase de valor, a linha de apoio `Next.js · SaaS` e o
  nome `ENZO YOSHIDA`.
- **Nenhum endereço de site** (nem `ewzxyh.com`, nem "www"): os geradores erram URLs e as redes já mostram o domínio do
  link.
- **Só Next.js como tecnologia.** "Desenvolvedor full-stack", React, Laravel e o resto da stack ficam no site e nos
  metadados (descrição, `llms.txt`, JSON-LD); não entram na imagem.
- Disposição: o **badge** no canto superior esquerdo, o **logo EHY** (as iniciais de Enzo Hideki Yoshida) no canto
  superior direito, a frase e a linha de apoio no miolo e o **nome** enorme embaixo, na fonte de display do site.
- Tema claro: fundo `#f5f5f4`, tinta `#1c1917`, cinza `#79716b`, linhas `#d7d3d1`. O laranja `#f97316` só aparece em
  quatro quadradinhos nos cantos. Fontes: o lettering anexado (nome) e JetBrains Mono (todo o resto).

| Texto | Português | Inglês |
| --- | --- | --- |
| Badge | PRODUCT ENGINEER · EWZXYH LABS | PRODUCT ENGINEER · EWZXYH LABS |
| Frase de valor | Produtos digitais prontos para operar. | Digital products, ready to run. |
| Linha de apoio | Next.js · SaaS | Next.js · SaaS |
| Nome | ENZO YOSHIDA | ENZO YOSHIDA |

## 3. O que anexar

Os arquivos estão em `docs/metadata-images/assets/`. Anexe sempre o logo e o lettering; as referências já mostram o
resultado esperado, com as fontes e o logo reais.

| Imagem | Anexos |
| --- | --- |
| 1 (OG português) | `ewzxyh-logo-black.png`, `og-reference-pt-1200x630.png`, `lettering-enzo-yoshida-ink.png` e, se aceitar, `og-background-1200x630.png` |
| 2 (OG inglês) | `ewzxyh-logo-black.png`, `og-reference-en-1200x630.png`, `lettering-enzo-yoshida-ink.png` e, se aceitar, `og-background-1200x630.png` |
| 3 (cartão do X) | `ewzxyh-logo-black.png`, `x-reference-pt-1600x800.png` (ou `x-reference-en-1600x800.png`), `lettering-enzo-yoshida-ink.png` e, se aceitar, `x-background-1600x800.png` |

**Não anexe** `og-layout-guide-1200x630.png` nem `x-layout-guide-1600x800.png`: as linhas coloridas apareceriam no
resultado. Use as referências **novas** da pasta (a versão antiga tinha o endereço do site e o logo à esquerda).

## 4. Passo a passo

1. Abra o gerador (ChatGPT, Gemini, Ideogram, Recraft, Flux, Midjourney, ou o Figma/Canva se for compor à mão).
2. Anexe os arquivos da tabela da seção 3.
3. Cole o prompt da imagem (seções 5 a 7). Midjourney, Ideogram e Flux aceitam melhor as versões curtas da seção 8.
4. Gere 2 a 4 variações e fique com a que tem o texto exato e o logo intacto.
5. Se o gerador errar letras ou deformar o logo, não insista: use o caminho híbrido da seção 9.
6. Confira com a seção 10, exporte e salve como na seção 11.

Notas por ferramenta:

- **ChatGPT e Gemini:** a maioria não entrega 1200 × 630 exatos. Gere em paisagem larga, recorte e redimensione sem
  esticar. O conteúdo fica dentro de x 72..1128 e y 24..606, então cortar 15 px em cima e embaixo não machuca.
- **Midjourney:** `--ar 40:21` (ou `--ar 2:1` no cartão do X), referências como image prompts e os itens proibidos em
  `--no`. Texto é o ponto fraco: prefira o caminho híbrido.
- **Ideogram e Recraft:** bons com texto; cole o prompt inteiro e anexe as referências.
- **Flux ou difusão local:** image-to-image com a referência; ajuste a força até a composição ficar igual.
- **Sem IA:** as referências `og-reference-*` e `x-reference-*` já são imagens finais (seção 11).

## 5. Imagem 1: Open Graph em português (1200 × 630)

```markdown
# Open Graph share card for a personal portfolio, LIGHT theme (page language: Portuguese)

## Output
- ONE image, exactly 1200 × 630 px (aspect ratio 40:21 = 1.905:1), sRGB, opaque, flat 2D.
- No mockup, no device frame, no shadow around the card, nothing outside the canvas.
- Mood: clean, professional, calm, precise, editorial. Generous whitespace.

## Attachments (use each exactly as described)
1. `ewzxyh-logo-black.png`: the official EHY logo (transparent PNG). Place it unchanged. Never redraw, recolor, outline, stretch or add effects to it.
2. `og-reference-pt-1200x630.png`: the layout of record. Reproduce its composition, spacing, type styles, colors and hierarchy. If this text and the image disagree on a number, the image wins.
3. `lettering-enzo-yoshida-ink.png`: the exact letterforms of the name. Copy them faithfully (wide, squared, all-caps, chamfered corners). Do not substitute another font.
4. (optional) `og-background-1200x630.png`: the background-only layer, to build on top of.

## The only text allowed (four elements, written exactly like this)
- Badge: PRODUCT ENGINEER · EWZXYH LABS
- Value line: Produtos digitais prontos para operar.
- Support line: Next.js · SaaS
- Name: ENZO YOSHIDA
No other text of any kind: no website address, no URL, no domain, no "www". The logo is an image, not text.

## Brand rules
- Light theme only. Flat background #f5f5f4: no gradient, no texture, no vignette, no noise.
- Colors: ink #1c1917 · secondary gray #79716b · hairlines #d7d3d1 · ONE accent, orange #f97316, used only for four small solid squares.
- Exactly two type families: the supplied display lettering (name only) and JetBrains Mono (everything else). No italics, no shadows, no outlines on text.
- Everything left-aligned at x = 72, except the EHY logo (right edge at x = 1128).

## Font and hierarchy (reading order)
| # | Element | Text | Font | Size | Weight / tracking | Color |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Name | ENZO YOSHIDA | supplied display lettering (AT Amiga), UPPERCASE | about 124 px, spans x 72 to 1128 (letters about 87 px tall) | regular / 0 | #1c1917 |
| 2 | Value line | Produtos digitais prontos para operar. | JetBrains Mono | 44 px, line-height 1.2 | Medium 500 / -0.02 em | #1c1917 |
| 3 | Badge | PRODUCT ENGINEER · EWZXYH LABS | JetBrains Mono, UPPERCASE | 24 px | Medium 500 / +0.16 em | #79716b |
| 4 | Logo | EHY (attachment 1) | n/a | 48 px tall (about 138 px wide) | n/a | n/a |
| 5 | Support line | Next.js · SaaS | JetBrains Mono | 24 px | Regular 400 / +0.02 em | #79716b |

## Layout (px; origin = top-left corner of the 1200 × 630 canvas)
1. Frame: a 1 px hairline rectangle, #d7d3d1, inset 24 px from all four edges, square corners.
2. Four solid orange (#f97316) squares, 10 × 10 px, top-left corners at (40, 40), (1150, 40), (40, 580), (1150, 580).
3. Badge, TOP-LEFT: a rectangle at (72, 57), height 54 px, width about 589 px, 1 px border #d7d3d1, fill #f5f5f4 at 90% opacity, 20 px horizontal padding; the badge text is vertically centered inside it.
4. EHY logo (Image 1), TOP-RIGHT: right edge at x = 1128, top at y = 60, height 48 px (about 138 px wide, so it spans x 990 to 1128). Its vertical center (y = 84) is the badge's. Unchanged.
5. Value line at (72, 236): one single line, left-aligned. Keep the Portuguese text exactly as written, with its accents and punctuation.
6. Support line at (72, 306).
7. Name: left edge x = 72, right edge x = 1128 (about 1056 px wide, letters about 87 px tall), baseline at about y = 558. It is the largest element on the card.

## Background (behind everything)
- Faint topographic contour lines: color #d7d3d1, 1 px stroke, rounded line ends, no fills, no labels or numbers.
- About 9 contour levels of a soft, irregular imaginary terrain, with two or three off-centre peaks drawn as concentric rings; the lines run off the canvas edges.
- Opacity grows from left to right: almost invisible on the left (about 18%), about 70% in the middle, about 95% on the right. The text column on the left stays calm.
- Nothing else: no grid, dots, circuit patterns, particles, gradients or photos.

## Safe areas
Everything that matters stays inside x 72–1128 and y 24–606, so a 2:1 crop (1200 × 600, losing 15 px at the top and bottom) loses nothing.

## Quality bar
Crisp, vector-like edges. Text rendered exactly as written: no extra, missing, mirrored or merged letters, correct Portuguese accents, even letter-spacing. Logo identical to the attachment. No blur, no artifacts.

## Do not include
website address, URL, domain name, www, dark background, dark mode, neon, glow, gradients, mesh gradient, blobs, 3D, glassmorphism, drop shadow, bevel, stock photo, person, face, illustration, mascot, icons, emoji, circuit board, grid, dots, particles, bokeh, noise, grain, vignette, watermark, extra text, lorem ipsum, misspelled words, distorted letters, redrawn or recolored logo, additional logos, QR code, price, serif font, handwriting, italic, more than one accent color, React, Laravel, TypeScript.
```

## 6. Imagem 2: Open Graph em inglês (1200 × 630)

```markdown
# Open Graph share card for a personal portfolio, LIGHT theme (page language: English)

## Output
- ONE image, exactly 1200 × 630 px (aspect ratio 40:21 = 1.905:1), sRGB, opaque, flat 2D.
- No mockup, no device frame, no shadow around the card, nothing outside the canvas.
- Mood: clean, professional, calm, precise, editorial. Generous whitespace.

## Attachments (use each exactly as described)
1. `ewzxyh-logo-black.png`: the official EHY logo (transparent PNG). Place it unchanged. Never redraw, recolor, outline, stretch or add effects to it.
2. `og-reference-en-1200x630.png`: the layout of record. Reproduce its composition, spacing, type styles, colors and hierarchy. If this text and the image disagree on a number, the image wins.
3. `lettering-enzo-yoshida-ink.png`: the exact letterforms of the name. Copy them faithfully (wide, squared, all-caps, chamfered corners). Do not substitute another font.
4. (optional) `og-background-1200x630.png`: the background-only layer, to build on top of.

## The only text allowed (four elements, written exactly like this)
- Badge: PRODUCT ENGINEER · EWZXYH LABS
- Value line: Digital products, ready to run.
- Support line: Next.js · SaaS
- Name: ENZO YOSHIDA
No other text of any kind: no website address, no URL, no domain, no "www". The logo is an image, not text.

## Brand rules
- Light theme only. Flat background #f5f5f4: no gradient, no texture, no vignette, no noise.
- Colors: ink #1c1917 · secondary gray #79716b · hairlines #d7d3d1 · ONE accent, orange #f97316, used only for four small solid squares.
- Exactly two type families: the supplied display lettering (name only) and JetBrains Mono (everything else). No italics, no shadows, no outlines on text.
- Everything left-aligned at x = 72, except the EHY logo (right edge at x = 1128).

## Font and hierarchy (reading order)
| # | Element | Text | Font | Size | Weight / tracking | Color |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Name | ENZO YOSHIDA | supplied display lettering (AT Amiga), UPPERCASE | about 124 px, spans x 72 to 1128 (letters about 87 px tall) | regular / 0 | #1c1917 |
| 2 | Value line | Digital products, ready to run. | JetBrains Mono | 44 px, line-height 1.2 | Medium 500 / -0.02 em | #1c1917 |
| 3 | Badge | PRODUCT ENGINEER · EWZXYH LABS | JetBrains Mono, UPPERCASE | 24 px | Medium 500 / +0.16 em | #79716b |
| 4 | Logo | EHY (attachment 1) | n/a | 48 px tall (about 138 px wide) | n/a | n/a |
| 5 | Support line | Next.js · SaaS | JetBrains Mono | 24 px | Regular 400 / +0.02 em | #79716b |

## Layout (px; origin = top-left corner of the 1200 × 630 canvas)
1. Frame: a 1 px hairline rectangle, #d7d3d1, inset 24 px from all four edges, square corners.
2. Four solid orange (#f97316) squares, 10 × 10 px, top-left corners at (40, 40), (1150, 40), (40, 580), (1150, 580).
3. Badge, TOP-LEFT: a rectangle at (72, 57), height 54 px, width about 589 px, 1 px border #d7d3d1, fill #f5f5f4 at 90% opacity, 20 px horizontal padding; the badge text is vertically centered inside it.
4. EHY logo (Image 1), TOP-RIGHT: right edge at x = 1128, top at y = 60, height 48 px (about 138 px wide, so it spans x 990 to 1128). Its vertical center (y = 84) is the badge's. Unchanged.
5. Value line at (72, 236): one single line, left-aligned. Keep the English text exactly as written, with its punctuation.
6. Support line at (72, 306).
7. Name: left edge x = 72, right edge x = 1128 (about 1056 px wide, letters about 87 px tall), baseline at about y = 558. It is the largest element on the card.

## Background (behind everything)
- Faint topographic contour lines: color #d7d3d1, 1 px stroke, rounded line ends, no fills, no labels or numbers.
- About 9 contour levels of a soft, irregular imaginary terrain, with two or three off-centre peaks drawn as concentric rings; the lines run off the canvas edges.
- Opacity grows from left to right: almost invisible on the left (about 18%), about 70% in the middle, about 95% on the right. The text column on the left stays calm.
- Nothing else: no grid, dots, circuit patterns, particles, gradients or photos.

## Safe areas
Everything that matters stays inside x 72–1128 and y 24–606, so a 2:1 crop (1200 × 600, losing 15 px at the top and bottom) loses nothing.

## Quality bar
Crisp, vector-like edges. Text rendered exactly as written: no extra, missing, mirrored or merged letters, even letter-spacing. Logo identical to the attachment. No blur, no artifacts.

## Do not include
website address, URL, domain name, www, dark background, dark mode, neon, glow, gradients, mesh gradient, blobs, 3D, glassmorphism, drop shadow, bevel, stock photo, person, face, illustration, mascot, icons, emoji, circuit board, grid, dots, particles, bokeh, noise, grain, vignette, watermark, extra text, lorem ipsum, misspelled words, distorted letters, redrawn or recolored logo, additional logos, QR code, price, serif font, handwriting, italic, more than one accent color, React, Laravel, TypeScript.
```

## 7. Imagem 3: cartão do X (1600 × 800)

Opcional: sem ela o X usa a imagem 1 (ou 2), que já cabe no recorte 2:1. Vale fazer se você quiser a geometria 2:1 exata e
o nome fora da área onde o X desenha o selo com o domínio do link (canto inferior esquerdo).

### 7.1 Em português

```markdown
# Link-card image for X (Twitter "summary_large_image"), LIGHT theme (page language: Portuguese)

## Output
- ONE image, exactly 1600 × 800 px (aspect ratio 2:1), sRGB, opaque, flat 2D.
- No mockup, no device frame, nothing outside the canvas.
- Mood: clean, professional, calm, precise, editorial. Generous whitespace.

## Attachments (use each exactly as described)
1. `ewzxyh-logo-black.png`: the official EHY logo (transparent PNG). Place it unchanged. Never redraw, recolor, outline, stretch or add effects to it.
2. `x-reference-pt-1600x800.png`: the layout of record. Reproduce its composition, spacing, type styles, colors and hierarchy. If this text and the image disagree on a number, the image wins.
3. `lettering-enzo-yoshida-ink.png`: the exact letterforms of the name. Copy them faithfully (wide, squared, all-caps, chamfered corners). Do not substitute another font.
4. (optional) `x-background-1600x800.png`: the background-only layer, to build on top of.

## The only text allowed (four elements, written exactly like this)
- Badge: PRODUCT ENGINEER · EWZXYH LABS
- Value line: Produtos digitais prontos para operar.
- Support line: Next.js · SaaS
- Name: ENZO YOSHIDA
No other text of any kind: no website address, no URL, no domain, no "www". The logo is an image, not text.

## Brand rules
- Light theme only. Flat background #f5f5f4: no gradient, no texture, no vignette, no noise.
- Colors: ink #1c1917 · secondary gray #79716b · hairlines #d7d3d1 · ONE accent, orange #f97316, used only for four small solid squares.
- Exactly two type families: the supplied display lettering (name only) and JetBrains Mono (everything else). No italics, no shadows, no outlines on text.
- Everything left-aligned at x = 96, except the EHY logo (right edge at x = 1504).

## Font and hierarchy (reading order)
| # | Element | Text | Font | Size | Weight / tracking | Color |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Name | ENZO YOSHIDA | supplied display lettering (AT Amiga), UPPERCASE | about 165 px, spans x 96 to 1504 (letters about 116 px tall) | regular / 0 | #1c1917 |
| 2 | Value line | Produtos digitais prontos para operar. | JetBrains Mono | 58 px, line-height 1.2 | Medium 500 / -0.02 em | #1c1917 |
| 3 | Badge | PRODUCT ENGINEER · EWZXYH LABS | JetBrains Mono, UPPERCASE | 32 px | Medium 500 / +0.16 em | #79716b |
| 4 | Logo | EHY (attachment 1) | n/a | 64 px tall (about 184 px wide) | n/a | n/a |
| 5 | Support line | Next.js · SaaS | JetBrains Mono | 32 px | Regular 400 / +0.02 em | #79716b |

## Layout (px; origin = top-left corner of the 1600 × 800 canvas)
1. Frame: a 1 px hairline rectangle, #d7d3d1, inset 32 px from all four edges, square corners.
2. Four solid orange (#f97316) squares, 12 × 12 px, top-left corners at (54, 54), (1534, 54), (54, 734), (1534, 734).
3. Badge, TOP-LEFT: a rectangle at (96, 76), height 72 px, width about 786 px, 1 px border #d7d3d1, fill #f5f5f4 at 90% opacity, 27 px horizontal padding; the badge text is vertically centered inside it.
4. EHY logo (Image 1), TOP-RIGHT: right edge at x = 1504, top at y = 80, height 64 px (about 184 px wide, so it spans x 1320 to 1504). Its vertical center (y = 112) is the badge's. Unchanged.
5. Value line at (96, 278): one single line. Keep the Portuguese text exactly as written, with its accents and punctuation.
6. Support line at (96, 372).
7. Name: left edge x = 96, right edge x = 1504 (about 1408 px wide, letters about 116 px tall), occupying y 535 to 651. It is the largest element on the card.

## Background (behind everything)
- Faint topographic contour lines: color #d7d3d1, 1 px stroke, rounded line ends, no fills, no labels or numbers.
- About 9 contour levels of a soft, irregular imaginary terrain, with two or three off-centre peaks drawn as concentric rings; the lines run off the canvas edges.
- Opacity grows from left to right: almost invisible on the left (about 18%), about 70% in the middle, about 95% on the right.
- Nothing else: no grid, dots, circuit patterns, particles, gradients or photos.

## Keep clear
The bottom-left band x 24–400, y 660–776 holds nothing (the platform draws a label there). Everything else stays inside x 96–1504 and y 32–768.

## Quality bar
Crisp, vector-like edges. Text rendered exactly as written: no extra, missing, mirrored or merged letters, correct Portuguese accents, even letter-spacing. Logo identical to the attachment. No blur, no artifacts.

## Do not include
website address, URL, domain name, www, dark background, dark mode, neon, glow, gradients, mesh gradient, blobs, 3D, glassmorphism, drop shadow, bevel, stock photo, person, face, illustration, mascot, icons, emoji, circuit board, grid, dots, particles, bokeh, noise, grain, vignette, watermark, extra text, lorem ipsum, misspelled words, distorted letters, redrawn or recolored logo, additional logos, QR code, price, serif font, handwriting, italic, more than one accent color, React, Laravel, TypeScript.
```

### 7.2 Em inglês

```markdown
# Link-card image for X (Twitter "summary_large_image"), LIGHT theme (page language: English)

## Output
- ONE image, exactly 1600 × 800 px (aspect ratio 2:1), sRGB, opaque, flat 2D.
- No mockup, no device frame, nothing outside the canvas.
- Mood: clean, professional, calm, precise, editorial. Generous whitespace.

## Attachments (use each exactly as described)
1. `ewzxyh-logo-black.png`: the official EHY logo (transparent PNG). Place it unchanged. Never redraw, recolor, outline, stretch or add effects to it.
2. `x-reference-en-1600x800.png`: the layout of record. Reproduce its composition, spacing, type styles, colors and hierarchy. If this text and the image disagree on a number, the image wins.
3. `lettering-enzo-yoshida-ink.png`: the exact letterforms of the name. Copy them faithfully (wide, squared, all-caps, chamfered corners). Do not substitute another font.
4. (optional) `x-background-1600x800.png`: the background-only layer, to build on top of.

## The only text allowed (four elements, written exactly like this)
- Badge: PRODUCT ENGINEER · EWZXYH LABS
- Value line: Digital products, ready to run.
- Support line: Next.js · SaaS
- Name: ENZO YOSHIDA
No other text of any kind: no website address, no URL, no domain, no "www". The logo is an image, not text.

## Brand rules
- Light theme only. Flat background #f5f5f4: no gradient, no texture, no vignette, no noise.
- Colors: ink #1c1917 · secondary gray #79716b · hairlines #d7d3d1 · ONE accent, orange #f97316, used only for four small solid squares.
- Exactly two type families: the supplied display lettering (name only) and JetBrains Mono (everything else). No italics, no shadows, no outlines on text.
- Everything left-aligned at x = 96, except the EHY logo (right edge at x = 1504).

## Font and hierarchy (reading order)
| # | Element | Text | Font | Size | Weight / tracking | Color |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Name | ENZO YOSHIDA | supplied display lettering (AT Amiga), UPPERCASE | about 165 px, spans x 96 to 1504 (letters about 116 px tall) | regular / 0 | #1c1917 |
| 2 | Value line | Digital products, ready to run. | JetBrains Mono | 58 px, line-height 1.2 | Medium 500 / -0.02 em | #1c1917 |
| 3 | Badge | PRODUCT ENGINEER · EWZXYH LABS | JetBrains Mono, UPPERCASE | 32 px | Medium 500 / +0.16 em | #79716b |
| 4 | Logo | EHY (attachment 1) | n/a | 64 px tall (about 184 px wide) | n/a | n/a |
| 5 | Support line | Next.js · SaaS | JetBrains Mono | 32 px | Regular 400 / +0.02 em | #79716b |

## Layout (px; origin = top-left corner of the 1600 × 800 canvas)
1. Frame: a 1 px hairline rectangle, #d7d3d1, inset 32 px from all four edges, square corners.
2. Four solid orange (#f97316) squares, 12 × 12 px, top-left corners at (54, 54), (1534, 54), (54, 734), (1534, 734).
3. Badge, TOP-LEFT: a rectangle at (96, 76), height 72 px, width about 786 px, 1 px border #d7d3d1, fill #f5f5f4 at 90% opacity, 27 px horizontal padding; the badge text is vertically centered inside it.
4. EHY logo (Image 1), TOP-RIGHT: right edge at x = 1504, top at y = 80, height 64 px (about 184 px wide, so it spans x 1320 to 1504). Its vertical center (y = 112) is the badge's. Unchanged.
5. Value line at (96, 278): one single line. Keep the English text exactly as written, with its punctuation.
6. Support line at (96, 372).
7. Name: left edge x = 96, right edge x = 1504 (about 1408 px wide, letters about 116 px tall), occupying y 535 to 651. It is the largest element on the card.

## Background (behind everything)
- Faint topographic contour lines: color #d7d3d1, 1 px stroke, rounded line ends, no fills, no labels or numbers.
- About 9 contour levels of a soft, irregular imaginary terrain, with two or three off-centre peaks drawn as concentric rings; the lines run off the canvas edges.
- Opacity grows from left to right: almost invisible on the left (about 18%), about 70% in the middle, about 95% on the right.
- Nothing else: no grid, dots, circuit patterns, particles, gradients or photos.

## Keep clear
The bottom-left band x 24–400, y 660–776 holds nothing (the platform draws a label there). Everything else stays inside x 96–1504 and y 32–768.

## Quality bar
Crisp, vector-like edges. Text rendered exactly as written: no extra, missing, mirrored or merged letters, even letter-spacing. Logo identical to the attachment. No blur, no artifacts.

## Do not include
website address, URL, domain name, www, dark background, dark mode, neon, glow, gradients, mesh gradient, blobs, 3D, glassmorphism, drop shadow, bevel, stock photo, person, face, illustration, mascot, icons, emoji, circuit board, grid, dots, particles, bokeh, noise, grain, vignette, watermark, extra text, lorem ipsum, misspelled words, distorted letters, redrawn or recolored logo, additional logos, QR code, price, serif font, handwriting, italic, more than one accent color, React, Laravel, TypeScript.
```

## 8. Versões curtas (Midjourney, Ideogram, Flux)

Esses geradores aceitam prompts curtos; use junto com as imagens de referência anexadas. No Midjourney, acrescente
`--ar 40:21` (imagens 1 e 2) ou `--ar 2:1` (imagem 3).

```text
PT: Clean professional light-theme social card, flat 2D editorial design, wide landscape 40:21. Warm off-white background #f5f5f4 with very faint thin topographic contour lines (#d7d3d1) fading out toward the left, a thin hairline frame inset near the edges, four tiny solid orange (#f97316) squares in the corners. Top-left: an outlined badge reading "PRODUCT ENGINEER · EWZXYH LABS" in gray spaced uppercase monospace. Top-right: the supplied EHY logo exactly as given. Left-aligned below: the headline "Produtos digitais prontos para operar." in dark medium monospace (JetBrains Mono), then a gray line "Next.js · SaaS". Bottom: huge uppercase "ENZO YOSHIDA" spanning the full width in the supplied wide chamfered display lettering, near-black #1c1917. Calm, precise, generous whitespace. No other text, no website address. --no dark background, gradient, photo, person, 3D, shadow, glow, icons, circuit board, URL, domain, extra text, redrawn logo

EN: Clean professional light-theme social card, flat 2D editorial design, wide landscape 40:21. Warm off-white background #f5f5f4 with very faint thin topographic contour lines (#d7d3d1) fading out toward the left, a thin hairline frame inset near the edges, four tiny solid orange (#f97316) squares in the corners. Top-left: an outlined badge reading "PRODUCT ENGINEER · EWZXYH LABS" in gray spaced uppercase monospace. Top-right: the supplied EHY logo exactly as given. Left-aligned below: the headline "Digital products, ready to run." in dark medium monospace (JetBrains Mono), then a gray line "Next.js · SaaS". Bottom: huge uppercase "ENZO YOSHIDA" spanning the full width in the supplied wide chamfered display lettering, near-black #1c1917. Calm, precise, generous whitespace. No other text, no website address. --no dark background, gradient, photo, person, 3D, shadow, glow, icons, circuit board, URL, domain, extra text, redrawn logo
```

## 9. Se o gerador errar texto ou logo: caminho híbrido

O gerador cria só o fundo e você coloca o badge, o logo, os textos e o nome com os arquivos reais (Figma, Canva ou
Photopea). Se preferir não usar IA para o fundo, `assets/og-background-1200x630.png` e `assets/x-background-1600x800.png`
já são essa base.

Prompt do fundo (para a imagem 1 ou 2; para o cartão do X, troque o tamanho para 1600 × 800, a moldura para 32 px e os
quadradinhos para 12 × 12 px em (54, 54), (1534, 54), (54, 734), (1534, 734)):

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

Camadas, de baixo para cima. No Figma, "letter spacing" em % equivale a "em × 100"; o Canva usa outra escala, então
acerte olhando para a referência.

| Camada | Imagens 1 e 2 (1200 × 630) | Cartão do X (1600 × 800) |
| --- | --- | --- |
| Fundo | `og-background-1200x630.png` | `x-background-1600x800.png` |
| Badge (retângulo) | x 72, y 57, 589 × 54; preenchimento `#f5f5f4` 90%, borda interna 1 px `#d7d3d1`, raio 0 | x 96, y 76, 786 × 72; mesmo estilo |
| Badge (texto) | `PRODUCT ENGINEER · EWZXYH LABS`, x 93, centralizado no badge; JetBrains Mono Medium 24 px, MAIÚSCULAS, +16%, `#79716b` | x 124; JetBrains Mono Medium 32 px, mesmo estilo |
| Logo EHY | `ewzxyh-logo-black.svg` (prefira SVG), borda direita em x 1128, y 60, altura 48 | borda direita em x 1504, y 80, altura 64 |
| Frase | JetBrains Mono Medium 44 px, altura de linha 120%, −2%, `#1c1917`, em x 72, y 236 | 58 px, em x 96, y 278 |
| Linha de apoio | `Next.js · SaaS`, JetBrains Mono Regular 24 px, +2%, `#79716b`, em x 72, y 306 | 32 px, em x 96, y 372 |
| Nome | `lettering-enzo-yoshida-ink.png`, largura 1056, em x 72, y ≈ 470 | largura 1408, em x 96, y ≈ 535 |

Conferência: sobreponha `og-layout-guide-1200x630.png` (ou `x-layout-guide-1600x800.png`) com 40% de opacidade e veja
se tudo cai nas mesmas posições; depois apague a sobreposição.

## 10. Conferir antes de salvar

- [ ] Tamanho exato (1200 × 630 ou 1600 × 800), sRGB, sem transparência.
- [ ] **Nenhum endereço de site, URL ou "www"** em lugar nenhum.
- [ ] Badge no canto superior esquerdo, logo EHY no canto superior direito, centros alinhados.
- [ ] Nome escrito `ENZO YOSHIDA`, com letras iguais ao lettering; sem letra faltando ou espelhada.
- [ ] Frase com acentos corretos; linha de apoio exatamente `Next.js · SaaS` (nada de React, Laravel, "full-stack").
- [ ] Logo igual ao arquivo original (compare lado a lado), preto/grafite, sem efeito.
- [ ] Só `#f97316` nos quatro quadradinhos; fundo sem degradê; curvas de nível discretas.
- [ ] **Miniatura:** reduza para 300 px de largura: o nome e o logo continuam legíveis.
- [ ] **Recorte 2:1** (só imagens 1 e 2): corte 15 px em cima e embaixo; nada importante é cortado.
- [ ] **Cartão do X:** nada na faixa x 24..400, y 660..776, exceto o quadradinho de canto.
- [ ] Arquivo com até 300 KB (imagens 1 e 2) ou 400 KB (imagem 3).

## 11. Exportar, salvar e publicar

Otimização sem perda (também remove o canal alfa; se a proporção de entrada for outra, recorta pelo centro). Troque
`entrada.png` pelo arquivo gerado:

```bash
bun -e "import sharp from 'sharp'; await sharp('entrada.png').resize(1200, 630).flatten({ background: '#f5f5f4' }).png({ compressionLevel: 9, effort: 10 }).toFile('public/og/ewzxyh-og-light.png')"
```

Para a imagem 2 troque o nome de saída por `ewzxyh-og-light-en.png`. Para o cartão do X use `.resize(1600, 800)` e
`ewzxyh-x-light.png` (português) ou `ewzxyh-x-light-en.png` (inglês).

**Atalho sem IA:** as referências já são imagens finais, com as fontes e o logo reais. Copie-as para `public/og/`:

```bash
cp docs/metadata-images/assets/og-reference-pt-1200x630.png public/og/ewzxyh-og-light.png && cp docs/metadata-images/assets/og-reference-en-1200x630.png public/og/ewzxyh-og-light-en.png && cp docs/metadata-images/assets/x-reference-pt-1600x800.png public/og/ewzxyh-x-light.png && cp docs/metadata-images/assets/x-reference-en-1600x800.png public/og/ewzxyh-x-light-en.png
```

Depois:

1. Rode `bun run dev` e confira `curl -s localhost:3000 | grep og:image`: a URL deve terminar em `?v=<hash>`.
2. Faça o deploy e valide com o Sharing Debugger (https://developers.facebook.com/tools/debug/), o Post Inspector
   (https://www.linkedin.com/post-inspector/) e um rascunho de post no X com o link.
3. Se uma rede ainda mostrar a imagem antiga, é o cache dela: o hash na URL já força a troca em compartilhamentos novos
   (o X guarda o cartão por cerca de 7 dias).
