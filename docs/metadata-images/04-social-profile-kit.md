# 04 · Kit dos perfis (X, LinkedIn, Instagram, GitHub)

Foto e capas com a mesma identidade do site, no tema claro. Os perfis são os mesmos que o site declara no JSON-LD
(`sameAs`), no `llms.txt` e nos ícones do hero e do rodapé, então manter tudo igual ajuda buscadores e assistentes de IA
a reconhecer que é a mesma pessoa. Leia antes o [00-brand-spec.md](00-brand-spec.md).

> Os tamanhos de foto e capa desta página são os valores usuais de cada rede e **não foram verificados contra a
> documentação oficial de hoje** (diferente das imagens de compartilhamento, que foram). Confira no momento do
> upload; as áreas cobertas pelo app são estimativas.

## 1. Perfis oficiais e textos

| Rede | Endereço | Handle |
| --- | --- | --- |
| X | https://x.com/ewzxyh | `@ewzxyh` (também `twitter:site` e `twitter:creator`) |
| LinkedIn | https://www.linkedin.com/in/ewzxyh | `ewzxyh` |
| Instagram | https://www.instagram.com/ewzxyh | `@ewzxyh` |
| GitHub | https://github.com/ewzxyh | `ewzxyh` |

Regras de consistência: nome de exibição "Enzo Yoshida"; cargo "Product Engineer"; estúdio sempre "Ewzxyh Labs"; link
sempre `https://ewzxyh.com`. Se o cargo atual de qualquer perfil estiver diferente de "Product Engineer", alinhe:
buscadores e IAs cruzam os perfis e divergências enfraquecem a entidade.

Textos sugeridos (todos dentro dos limites; contagem de caracteres entre parênteses; só afirmam o que o site afirma):

| Rede | pt-BR | en |
| --- | --- | --- |
| X (160) | `Product Engineer e desenvolvedor full-stack. Fundador da Ewzxyh Labs. Transformo ideias e operações manuais em produtos digitais prontos para operar. ewzxyh.com` (160) | `Product Engineer. Founder of Ewzxyh Labs. I turn ideas and manual operations into digital products ready to run. ewzxyh.com` (123) |
| LinkedIn, título (220) | `Product Engineer e desenvolvedor full-stack \| Fundador da Ewzxyh Labs \| MVPs, SaaS, dashboards e automações com Next.js` (119) | `Product Engineer \| Founder, Ewzxyh Labs \| MVPs, SaaS, dashboards and automations with Next.js` (93) |
| Instagram (150) | `Product Engineer · Ewzxyh Labs` + quebra + `MVPs, SaaS e automações sob medida` + quebra + `ewzxyh.com` (76) | `Product Engineer · Ewzxyh Labs` + line break + `Custom MVPs, SaaS and automations` + line break + `ewzxyh.com` (75) |
| GitHub (160) | `Product Engineer · Founder of Ewzxyh Labs · Next.js and SaaS` (60) | idem |

## 2. Tamanhos

| Rede | Imagem | Tamanho | Proporção | Como o app mostra |
| --- | --- | --- | --- | --- |
| X | Foto | 400 × 400 | 1:1 | Recorte em círculo |
| X | Capa | 1500 × 500 | 3:1 | A foto cobre o canto inferior esquerdo |
| LinkedIn | Foto | 400 × 400 (mínimo) | 1:1 | Recorte em círculo |
| LinkedIn | Capa do perfil pessoal | 1584 × 396 | 4:1 | No desktop aparece recortada numa faixa mais baixa (cerca de 5,9:1): perde aproximadamente 64 px em cima e embaixo; a foto cobre o canto inferior esquerdo |
| Instagram | Foto | 320 × 320 (mínimo) | 1:1 | Círculo exibido a ~110 px |
| GitHub | Avatar | 500 × 500 | 1:1 | Círculo na interface |

## 3. Foto de perfil

**Pronta:** `assets/avatar-symbol-light-1000x1000.png`: o símbolo oficial em grafite sobre `#f5f5f4`, 1000 × 1000. A
meia-diagonal do símbolo é 358 px, dentro do círculo de 500 px, então o recorte circular não corta nada. É a opção
"marca" e vale para as quatro redes.

**Opção "pessoa":** em perfis pessoais (LinkedIn, X) um rosto costuma gerar mais confiança que um símbolo. Use a foto real
(`public/hero/enzo-yoshida-portrait.webp` ou outra), recortada em quadrado com o rosto centralizado no terço superior,
sem filtros pesados. **Não gere rostos com IA.** Se quiser harmonizar com o site, converta a foto para preto e branco com
contraste suave, como no hero.

Para a versão "marca" em qualquer ferramenta, o prompt é só uma montagem (e é mais seguro fazer no Figma/Canva):

```text
Square canvas 1000 x 1000 px, flat warm off-white #f5f5f4. Centered, the attached logo symbol exactly as supplied
(never redrawn, recolored or outlined), 480 px tall. Nothing else: no text, no border, no gradient, no shadow.
```

## 4. Capa do X (1500 × 500)

Referência pronta: `assets/banner-x-light-1500x500.png`. Guia (só para você): `assets/banner-x-guide-1500x500.png`.

| # | Elemento | Posição e tamanho | Estilo |
| --- | --- | --- | --- |
| 1 | Fundo | Tela inteira | `#f5f5f4` + curvas de nível (brief 00, seção 5) |
| 2 | Moldura | Recuo de 20 px (x 20..1480, y 20..480) | 1 px `#d7d3d1` |
| 3 | Quadradinhos | 8×8 px em (32, 32), (1460, 32), (32, 460), (1460, 460) | Sólidos `#f97316` |
| 4 | **Logo** | x 560, y 92, altura 56 (largura ≈ 161) | `ewzxyh-logo-black.png`, intacto |
| 5 | **Nome** | Texto a partir de x 560, largura 780 px; letras entre x 567 e 1335 e y 200 e 264 (≈ 64 px de altura) | Lettering "ENZO YOSHIDA", `#1c1917` |
| 6 | Chip do cargo | x 560, y 296, altura 46, padding 18 | Borda 1 px `#d7d3d1`, fundo `#f5f5f4` 90%; JetBrains Mono 500, 22 px, MAIÚSCULAS, +0,16 em, `#79716b`; texto `PRODUCT ENGINEER · EWZXYH LABS` |
| 7 | Domínio | Alinhado à direita em x 1436, y 436 | JetBrains Mono 500, 24 px, +0,04 em, `#79716b`, "ewzxyh.com" |

Zona coberta pela foto de perfil (estimativa): x 0..420, y 310..500, fica vazia. Se o app cortar as bordas, a moldura e
os quadradinhos somem sem prejuízo.

## 5. Capa do LinkedIn (1584 × 396)

Referência pronta: `assets/banner-linkedin-light-1584x396.png`. Guia: `assets/banner-linkedin-guide-1584x396.png`.

| # | Elemento | Posição e tamanho | Estilo |
| --- | --- | --- | --- |
| 1 | Fundo | Tela inteira | `#f5f5f4` + curvas de nível |
| 2 | Moldura | Recuo de 16 px (x 16..1568, y 16..380) | 1 px `#d7d3d1` |
| 3 | Quadradinhos | 8×8 px em (26, 26), (1550, 26), (26, 362), (1550, 362) | Sólidos `#f97316` |
| 4 | **Logo** | x 560, y 86, altura 48 (largura ≈ 138) | Intacto |
| 5 | **Nome** | Texto a partir de x 560, largura 760 px; letras entre x 567 e 1315 e y 170 e 232 (≈ 62 px de altura) | Lettering, `#1c1917` |
| 6 | Chip do cargo | x 560, y 262, altura 40, padding 16 | JetBrains Mono 500, 20 px, +0,16 em, `#79716b` |
| 7 | Domínio | Alinhado à direita em x 1520, y 336 | JetBrains Mono 500, 22 px, `#79716b` |

Tudo que importa está entre y 64 e y 332 (a faixa que sobra no desktop). A foto cobre x 0..420, y 196..396.

## 6. Prompt das capas

Anexe `ewzxyh-logo-black.png`, `lettering-enzo-yoshida-ink.png` e a referência da rede. Troque as variáveis:

| Variável | X | LinkedIn |
| --- | --- | --- |
| `{{CANVAS}}` | `1500 x 500 px (aspect ratio 3:1)` | `1584 x 396 px (aspect ratio 4:1)` |
| `{{REFERENCE}}` | `banner-x-light-1500x500.png` | `banner-linkedin-light-1584x396.png` |
| `{{LAYOUT}}` | os itens da tabela da seção 4 | os itens da tabela da seção 5 |

```text
BRAND CONTRACT
Light theme only. Flat 2D, editorial, technical, calm, precise. The canvas is a flat warm off-white (#f5f5f4) with no
gradient, no texture and no vignette. Text color is warm near-black ink (#1c1917); secondary text is warm gray
(#79716b); hairlines are #d7d3d1. The only accent is orange (#f97316), used for exactly four small solid squares near
the corners of a thin frame and for nothing else. Typography is limited to two families: a wide, squared, chamfered
all-caps display face (the supplied "ENZO YOSHIDA" lettering) and JetBrains Mono for everything else. The supplied logo
is used exactly as given, never redrawn.

TASK
Design a social-profile banner. Canvas: exactly {{CANVAS}}, sRGB, opaque, flat 2D, LIGHT theme. One single image, no
mockup, nothing outside the canvas. A round profile photo will cover the bottom-left corner (x 0-420, bottom 200 px), so
that area stays empty; all content sits in a column starting at x = 560.

ATTACHMENTS
- Image 1, "ewzxyh-logo-black.png": the official logo. Place it unchanged.
- Image 2, "{{REFERENCE}}": the layout of record; reproduce composition, spacing, type styles and colors. If this prompt
  and the image disagree on a number, the image wins.
- Image 3, "lettering-enzo-yoshida-ink.png": the exact letterforms of the name; copy them faithfully.

LAYOUT
{{LAYOUT}}

The background is faint topographic contour lines (#d7d3d1, 1 px, about 9 levels, soft irregular terrain with
concentric peaks), almost invisible on the left (about 18% opacity) and stronger toward the right (about 95%).

DO NOT INCLUDE
dark background, neon, glow, gradients, 3D, shadows, stock photo, person, face, illustration, icons, emoji, circuit
board, grid, dots, particles, noise, vignette, watermark, extra text, misspelled words, distorted letters, redrawn or
recolored logo, additional logos, QR code, badge, serif font, handwriting, italic, more than one accent color.
```

Se o gerador errar letras ou o logo, componha a capa no Figma com a mesma tabela (logo SVG, lettering PNG, chip e
domínio em JetBrains Mono) sobre o fundo gerado.

## 7. Controle de qualidade

- [ ] Tamanho exato de cada imagem; PNG ou JPG (a capa do LinkedIn aceita até alguns MB; mantenha ≤ 1 MB).
- [ ] Nada importante sob a foto de perfil nem fora da faixa segura (capa do LinkedIn: y 64..332).
- [ ] Logo e nome idênticos aos arquivos originais; texto do cargo sem erro.
- [ ] No celular (reduza para 400 px de largura), o nome ainda é legível.
- [ ] Os quatro perfis usam a mesma foto/símbolo e o mesmo link `https://ewzxyh.com`.

## 8. Depois de publicar

1. Em cada perfil, ponha o link do site (`https://ewzxyh.com`) no campo de site/bio; vale também para o GitHub e para o
   README do perfil.
2. No LinkedIn, ative o perfil em português e inglês se quiser, mas mantenha o mesmo cargo.
3. Cite o site em posts e READMEs de projetos: menções de terceiros pesam mais para buscadores e assistentes de IA do
   que qualquer marcação do próprio site.
