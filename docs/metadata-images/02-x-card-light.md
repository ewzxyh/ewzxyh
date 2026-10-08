# 02 · Cartão nativo do X (2:1, 1600×800, tema claro): medidas

**Opcional.** Sem este arquivo o X usa a imagem principal do brief 01, que já cabe no recorte 2:1 (perde só 15 px em
cima e embaixo). Vale gerar este cartão se você quiser (a) a geometria 2:1 exata e (b) o nome fora da área onde o X
desenha o selo com o domínio do link. **Os prompts e o passo a passo estão em
[IMAGENS-METADATA.md](IMAGENS-METADATA.md).** Marca, cores e fontes: [00-brand-spec.md](00-brand-spec.md).

## 1. Ficha técnica

| Item | Valor |
| --- | --- |
| Tamanho final | **1600 × 800 px** (2:1). Aceito pelo X de 300×157 a 4096×4096, < 5 MB |
| Formato | PNG, sRGB, opaco (JPG/PNG/WEBP/GIF funcionam; SVG não). Alvo ≤ 400 KB |
| Arquivos | `public/og/ewzxyh-x-light.png` (pt-BR) e `public/og/ewzxyh-x-light-en.png` (en) |
| Tags geradas | `twitter:card=summary_large_image`, `twitter:site=@ewzxyh`, `twitter:creator=@ewzxyh`, `twitter:title`, `twitter:description`, `twitter:image`, `twitter:image:alt` (alt ≤ 420 caracteres) |
| Limites de texto | título ≤ 70 caracteres (o do site tem 46), descrição ≤ 200 (a do site tem 157 em pt-BR e 150 em inglês) |
| Cache | O X guarda o cartão cerca de 7 dias, por URL. O hash do arquivo na URL (`?v=...`) renova sozinho |
| `twitter:card` | Sempre explícito: ele **não** herda do Open Graph |

A documentação oficial de cartões do X foi removida do site da empresa; estes números vêm das últimas cópias arquivadas.
O validador de cartões também não existe mais: teste montando um rascunho de post com o link.

## 2. O que muda em relação ao brief 01

- Proporção 2:1 exata (1600 × 800) em vez de 40:21; não há recorte.
- O nome sobe: o X desenha o domínio do link num selo escuro no canto inferior esquerdo do cartão grande (comportamento
  observado, não documentado). A faixa inferior esquerda (x 24..400, y 660..776, estimativa conservadora) fica livre.
- Mesma hierarquia, mesmas cores, mesmas fontes, mesmo arranjo (badge à esquerda, logo EHY à direita, nenhum endereço de
  site); as medidas crescem 33% e o nome cabe em 1408 px de largura.

Referências prontas: `assets/x-reference-pt-1600x800.png` e `assets/x-reference-en-1600x800.png`. Guia (só para você):
`assets/x-layout-guide-1600x800.png`.

## 3. Composição (canvas 1600 × 800, origem no canto superior esquerdo)

| # | Elemento | Posição e tamanho | Estilo |
| --- | --- | --- | --- |
| 1 | Fundo | Tela inteira | `#f5f5f4` chapado + curvas de nível (brief 00, seção 5) |
| 2 | Moldura | Recuo de 32 px (x 32..1568, y 32..768) | 1 px `#d7d3d1` |
| 3 | Quadradinhos | 12×12 px em (54, 54), (1534, 54), (54, 734), (1534, 734) | Sólidos `#f97316` |
| 4 | **Badge do cargo** (canto superior esquerdo) | x 96, y 76, altura 72 (largura ≈ 786), padding horizontal 27 | Borda 1 px `#d7d3d1`, fundo `#f5f5f4` a 90%; JetBrains Mono 500, 32 px, MAIÚSCULAS, +0,16 em, `#79716b`: `PRODUCT ENGINEER · EWZXYH LABS` |
| 5 | **Logo EHY** (canto superior direito) | Borda direita em x 1504, y 80, altura 64 (largura ≈ 184, ocupa x 1320..1504) | `ewzxyh-logo-black.png`, intacto. Centro na mesma linha do badge (y ≈ 112) |
| 6 | Frase de valor | x 96, y 278 (letras entre y 288 e 343) | JetBrains Mono 500, 58 px, entrelinha 1,2, −0,02 em, `#1c1917`, uma linha |
| 7 | Linha de apoio | x 96, y 372 (letras entre y 377 e 408) | JetBrains Mono 400, 32 px, +0,02 em, `#79716b`: `Next.js · SaaS` |
| 8 | **Nome** | Texto de x 96 a 1504 (1408 px; as letras vão de x ≈ 108 a 1495), letras de ≈ 116 px de altura, entre y ≈ 535 e 651 | AT Amiga 400, ≈ 165 px, MAIÚSCULAS, `#1c1917` |

Textos (e só eles; **nenhum endereço de site na imagem**): os mesmos da tabela do brief 01, seção 2.

Zona livre do selo do X: x 24..400, y 660..776. O quadradinho de (54, 734) fica nela; se o selo cobri-lo, tudo bem.
