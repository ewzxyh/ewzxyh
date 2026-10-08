# 01 · Imagem Open Graph principal (1200×630, tema claro): medidas e limites

Referência das medidas da imagem que aparece no LinkedIn, Facebook, WhatsApp, Slack, Discord, iMessage, Telegram e, se
você não gerar o cartão do brief 02, também no X. **Os prompts, os anexos, o passo a passo, o caminho híbrido, a
conferência e a exportação estão em [IMAGENS-METADATA.md](IMAGENS-METADATA.md).** Marca, cores e fontes:
[00-brand-spec.md](00-brand-spec.md).

## 1. Ficha técnica

| Item | Valor |
| --- | --- |
| Tamanho final | **1200 × 630 px** (40:21, 1,905:1) |
| Para editar | 2400 × 1260 px (2x), depois reduza |
| Formato | PNG, sRGB, **opaco** (sem transparência). JPEG qualidade 88, 4:4:4, só se o PNG passar de 300 KB |
| Peso | ≤ 300 KB (alvo 100 KB; o PNG de referência recomprimido tem cerca de 70 KB) |
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
| 4 | **Badge do cargo** (canto superior esquerdo) | x 72, y 57, altura 54 (largura ≈ 589), padding horizontal 20 | Borda 1 px `#d7d3d1`, fundo `#f5f5f4` a 90%; texto JetBrains Mono 500, 24 px, MAIÚSCULAS, +0,16 em, `#79716b`: `PRODUCT ENGINEER · EWZXYH LABS` |
| 5 | **Logo EHY** (canto superior direito) | Borda direita em x 1128, y 60, altura 48 (largura ≈ 138, ocupa x 990..1128) | `ewzxyh-logo-black.png`, intacto. Centro na mesma linha do badge (y ≈ 84) |
| 6 | Frase de valor | x 72, y 236 (ocupa até y 289) | JetBrains Mono 500, 44 px, entrelinha 1,2, −0,02 em, `#1c1917`, uma linha |
| 7 | Linha de apoio | x 72, y 306 | JetBrains Mono 400, 24 px, +0,02 em, `#79716b`: `Next.js · SaaS` |
| 8 | **Nome** | Texto de x 72 a 1128 (1056 px; as letras vão de x ≈ 81 a 1122), letras de ≈ 87 px de altura, base em y ≈ 558 | AT Amiga 400, ≈ 124 px, MAIÚSCULAS, `#1c1917` |

Textos (e só eles; **nenhum endereço de site na imagem**):

| | pt-BR | en |
| --- | --- | --- |
| Badge | PRODUCT ENGINEER · EWZXYH LABS | PRODUCT ENGINEER · EWZXYH LABS |
| Frase de valor | Produtos digitais prontos para operar. | Digital products, ready to run. |
| Linha de apoio | Next.js · SaaS | Next.js · SaaS |
| Nome | ENZO YOSHIDA | ENZO YOSHIDA |

Ordem de leitura: nome → frase → badge → logo → linha de apoio. "Desenvolvedor full-stack" e o resto da stack ficam nos
metadados do site (descrição, `llms.txt`, JSON-LD), não na imagem.
