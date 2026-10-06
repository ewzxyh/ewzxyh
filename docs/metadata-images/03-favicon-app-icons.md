# 03 · Favicon e ícones do app

**Já gerados e aplicados.** Os ícones antigos eram o símbolo em cinza claro com fundo transparente: em abas claras e nos
resultados do Google (fundo branco) quase sumiam. Agora o símbolo oficial fica sobre um tile escuro (`#0c0a09`, o fundo do
tema escuro do site), legível em abas claras e escuras, na tela inicial e como logo do JSON-LD.

Para regenerar depois de mudar o logo:

```bash
bun scripts/make-icons.ts
```

O script lê `public/ewzxyh-icon-white.svg` e escreve tudo em `public/favicon/` e em `app/favicon.ico`. Não há IA nem
aleatoriedade: o resultado é sempre o mesmo, com o logo exato.

## 1. Arquivos

| Arquivo | Tamanho | Tipo | Altura do símbolo | Onde é usado |
| --- | --- | --- | --- | --- |
| `app/favicon.ico` e `public/favicon/favicon.ico` | 16, 32 e 48 px no mesmo ICO | Tile arredondado, cantos transparentes | 76%, 72%, 70% | `<link rel="icon">` automático do Next e quem pede `/favicon.ico` direto |
| `favicon-16x16.png`, `favicon-32x32.png` | 16, 32 | Tile arredondado | 76%, 72% | `<link rel="icon" sizes>` (layout) |
| `favicon-48x48.png` | 48 | Tile arredondado | 70% | Fonte do ICO (não é referenciado) |
| `android-chrome-192x192.png` | 192 | Tile arredondado | 64% | `<link rel="icon" sizes="192x192">` (Google pede múltiplos de 48 acima de 48 px) e manifest (`any`) |
| `android-chrome-512x512.png` | 512 | Tile arredondado | 64% | Manifest (`any`) e `logo` da Organization no JSON-LD |
| `apple-touch-icon.png` | 180 | Quadrado opaco, de ponta a ponta (o iOS arredonda sozinho) | 60% | `<link rel="apple-touch-icon">` |
| `maskable-512x512.png` | 512 | Quadrado opaco, símbolo dentro do círculo seguro | 56% | Manifest (`maskable`) |

Raio dos cantos do tile: 22,37% do lado. Quanto menor o ícone, maior o símbolo, para não virar uma mancha.

## 2. Requisitos que cada plataforma pede

| Plataforma | Regra | Situação |
| --- | --- | --- |
| Google (resultados) | `rel="icon"` na home; quadrado; mínimo 8×8, recomendado maior que 48×48; formatos BMP, GIF, ICO, PNG, JPEG, PPM, TIFF (SVG não consta); uma URL estável por host; Googlebot e Googlebot-Image não podem estar bloqueados | Cumprido: PNG 192 + ICO; `robots.txt` libera tudo |
| Apple | `apple-touch-icon` de 180×180 (167 no iPad Pro, 152 no iPad), opaco | Cumprido |
| PWA (Chrome) | `name`/`short_name`, `start_url`, `display`, ícones de 192 e 512 | Cumprido em `app/manifest.ts` |
| Ícone maskable | Símbolo dentro de um círculo de raio 40% (≈ 205 px em 512); manter `any` e `maskable` em arquivos separados | Cumprido (a meia-diagonal do símbolo é 197 px) |
| `theme-color` | Cor da barra do navegador | `#0c0a09` (o site abre escuro) em `lib/seo.ts` (`siteViewport`) e no manifest |

O Google demora de dias a semanas para trocar o favicon nos resultados, e os navegadores guardam favicons por muito
tempo: se a aba ainda mostrar o antigo, force a atualização com `Ctrl+Shift+R` ou abra `/favicon.ico` direto.

## 3. Se um dia quiser gerar com IA (não recomendado)

O símbolo é geométrico e o script o reproduz sem erro; um gerador costuma deformar as curvas. Se mesmo assim quiser
uma variação, anexe `assets/ewzxyh-icon-white.png` e use:

```text
App icon, exactly square, flat 2D. A solid warm near-black (#0c0a09) rounded-square tile, corner radius 22% of the side.
Centered on it, the attached white logo symbol exactly as supplied, never redrawn, recolored or outlined, occupying 64%
of the tile height. Nothing else: no text, no gradient background, no shadow, no glow, no border, no extra shapes.
```

Depois confira lado a lado com `public/ewzxyh-icon-white.svg` e, se qualquer curva mudou, use o script.

## 4. Controle de qualidade

- [ ] O símbolo parece idêntico ao SVG oficial (compare em 512 px).
- [ ] Em 16 px ainda se reconhece o "U" com o círculo (zoom de 800% no `favicon-16x16.png`).
- [ ] `apple-touch-icon.png` e `maskable-512x512.png` são opacos (sem transparência).
- [ ] `https://ewzxyh.com/manifest.webmanifest` lista os três ícones e abre sem erro.
- [ ] A aba do navegador mostra o ícone nos temas claro e escuro.
