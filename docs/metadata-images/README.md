# Imagens de metadata (tema claro)

Briefs para gerar as imagens que aparecem quando o site é compartilhado (LinkedIn, X, WhatsApp, Slack, Discord,
iMessage, Facebook) e nos resultados de busca. Tudo aqui foi escrito para dar **o mesmo resultado em qualquer gerador
de imagem** (ChatGPT, Gemini, Midjourney, Ideogram, Flux, Recraft, Figma, Canva).

**Comece por [IMAGENS-METADATA.md](IMAGENS-METADATA.md):** um único arquivo com as instruções e os prompts prontos
(português e inglês) das imagens de compartilhamento. Os outros arquivos são a referência das medidas e da marca.

> **Domínio de produção: `ewzxyh.com`.** O código antigo apontava para `ewzxyh.dev`, que não está registrado (RDAP
> 404 em 2026-10-05) e não resolve no DNS. Tudo (canonical, sitemap, og:image, JSON-LD, llms.txt) agora usa
> `https://ewzxyh.com`. As imagens **não trazem o endereço do site** (geradores erram URLs e as redes já mostram o
> domínio do link): o canto superior direito é do logo EHY e o superior esquerdo, do badge do cargo.
>
> **Apresentação:** "Product Engineer" é a identidade e Next.js a única tecnologia que aparece nas imagens.
> "Desenvolvedor full-stack" (em português), React, Laravel e o resto da stack ficam no site e nos metadados (descrição,
> `llms.txt`, JSON-LD), não nas imagens.

## Os arquivos

| Arquivo | Para que serve | Arquivo final (em `public/og/`) |
| --- | --- | --- |
| [IMAGENS-METADATA.md](IMAGENS-METADATA.md) | **Arquivo único: instruções, anexos e prompts prontos** das três imagens de compartilhamento (Open Graph em português e em inglês, cartão do X), caminho híbrido, conferência e exportação. | `ewzxyh-og-light.png`, `ewzxyh-og-light-en.png`, `ewzxyh-x-light.png`, `ewzxyh-x-light-en.png` |
| [00-brand-spec.md](00-brand-spec.md) | Marca: logo EHY, cores, hierarquia de fontes, fundo, grade, textos, proibições. | n/a |
| [01-og-image-light.md](01-og-image-light.md) | Medidas e limites da imagem principal 1200×630 (Open Graph). É a que quase todas as redes usam. | n/a |
| [02-x-card-light.md](02-x-card-light.md) | Medidas do cartão nativo 2:1 para o X (opcional; a imagem principal já é segura para o recorte 2:1). | n/a |
| [03-favicon-app-icons.md](03-favicon-app-icons.md) | Favicon, ícone do iOS e ícones do app. **Já gerados** por script a partir do seu logo. | `public/favicon/*` |
| [04-social-profile-kit.md](04-social-profile-kit.md) | Foto e banners dos perfis (X, LinkedIn, Instagram, GitHub) com a mesma identidade. | enviados direto para cada rede |

## Como o site usa as imagens (sem mexer em código)

`lib/share-images.ts` procura os arquivos em `public/og/` na hora do build e troca sozinho `og:image`, `twitter:image`,
o JSON-LD e o sitemap. Ele lê a largura e a altura reais do PNG e coloca um hash do arquivo na URL
(`...png?v=ab12cd34`), então **trocar a imagem já invalida o cache das redes** (elas guardam o cartão por URL por
dias).

| Página | Open Graph | Cartão do X |
| --- | --- | --- |
| `/` (pt-BR) | `ewzxyh-og-light.png` | `ewzxyh-x-light.png`, senão a própria imagem Open Graph |
| `/en` (inglês) | `ewzxyh-og-light-en.png`, senão `ewzxyh-og-light.png` | `ewzxyh-x-light-en.png`, senão a imagem Open Graph do inglês |

Os quatro arquivos já estão em `public/og/` (conferidos em 2026-10-06: PNG sRGB opaco, 1200×630 e 1600×800, abaixo de
200 KB). O `enzo-yoshida-product-engineer.webp` (escuro, com o monograma EY) ficou só como reserva: volta a valer se
algum arquivo for apagado. Os formatos aceitos são PNG e JPG (PNG é o recomendado para texto nítido).

## Fluxo recomendado

Tudo isto está detalhado em [IMAGENS-METADATA.md](IMAGENS-METADATA.md). Em resumo:

1. **Escolha o caminho.**
   - **A. Sem IA (mais exato):** as imagens de referência desta pasta já são o resultado final, renderizadas com a
     fonte e o logo reais. Copie e pronto (veja "Atalho").
   - **B. Com IA e anexos:** anexe os arquivos indicados e use o prompt. Bom para explorar variações.
   - **C. Híbrido:** gere só o fundo com IA (ou use `og-background-1200x630.png`) e componha logo e textos reais no
     Figma/Canva. É o caminho mais seguro se o gerador errar letras ou deformar o logo.
2. **Anexe sempre o logo real** (`assets/ewzxyh-logo-black.png`, fundo transparente). Geradores redesenham logos:
   se o resultado alterar qualquer forma, componha o arquivo original por cima.
3. **Confira** (nome escrito certo, logo intacto, nenhum endereço de site na imagem, contraste, recorte 2:1, leitura em
   300 px).
4. **Exporte** com o nome exato e o tamanho exato (1200×630 para a principal), sRGB, e deixe o arquivo em até 300 KB
   (o WhatsApp descarta imagens grandes demais; a documentação fala em 600 KB, mas testes da comunidade mostram queda
   perto de 300 KB).
5. **Coloque em `public/og/`**, faça o deploy e valide (abaixo).

### Atalho sem IA

```bash
cp docs/metadata-images/assets/og-reference-pt-1200x630.png public/og/ewzxyh-og-light.png
cp docs/metadata-images/assets/og-reference-en-1200x630.png public/og/ewzxyh-og-light-en.png
```

Os arquivos têm cerca de 180 KB cada. Para o cartão nativo do X (opcional):

```bash
cp docs/metadata-images/assets/x-reference-pt-1600x800.png public/og/ewzxyh-x-light.png
cp docs/metadata-images/assets/x-reference-en-1600x800.png public/og/ewzxyh-x-light-en.png
```

Para regenerar as referências depois de mudar texto, cor ou logo: abra `assets/og-reference.html` num navegador
(parâmetros no comentário do arquivo: `?lang=en`, `?format=x`, `?layer=background`, `?guides`) e tire um screenshot
em 1200×630 (ou 1600×800). As capas dos perfis saem de `assets/profile-banners.html?kind=x|linkedin`. Os arquivos abrem direto do disco (a
AT Amiga e o logo vêm do projeto; a JetBrains Mono vem do Google Fonts, então é preciso internet). Para o screenshot,
no Chrome/Edge: DevTools → modo dispositivo → dimensões personalizadas (1200 × 630, escala 1) → "Capture screenshot".

## Anexos (`assets/`)

| Arquivo | O que é | Anexar ao gerador? |
| --- | --- | --- |
| `ewzxyh-logo-black.png` / `.svg` | Logo EHY oficial para fundo claro, fundo transparente, 2400×832 | **Sim, sempre** |
| `ewzxyh-logo-white.png` / `.svg` | Logo para fundo escuro | Não (tema claro) |
| `ewzxyh-icon-black.png` / `.svg`, `ewzxyh-icon-white.*` | Só o símbolo (o "U" com três círculos) | Só para avatares e ícones |
| `og-reference-pt-1200x630.png`, `og-reference-en-1200x630.png` | Layout de referência pronto (fontes e logo reais) | **Sim** (composição e tipografia) |
| `og-reference-pt-2400x1260.png`, `og-reference-en-2400x1260.png` | O mesmo em 2x | Sim, se o gerador aceitar imagens grandes |
| `og-background-1200x630.png`, `og-background-2400x1260.png` | Só moldura, quadradinhos laranja e curvas de nível (sem texto) | Sim, no caminho híbrido |
| `lettering-enzo-yoshida-ink.png` | "ENZO YOSHIDA" na fonte de display, fundo transparente, 2400 px | Sim, para a IA copiar as letras ou para compor |
| `x-reference-pt-1600x800.png`, `x-reference-en-1600x800.png` | Referência do cartão 2:1 do X | Sim, no brief 02 |
| `x-background-1600x800.png` | Fundo do cartão do X (moldura, quadradinhos e curvas) | Sim, no caminho híbrido do brief 02 |
| `og-layout-guide-1200x630.png`, `x-layout-guide-1600x800.png` | Mesmas imagens com guias de recorte, margens e a zona do selo do X | **Não** (são só para você; as linhas vazariam para o resultado) |
| `avatar-symbol-light-1000x1000.png` | Foto de perfil "marca" pronta (símbolo sobre `#f5f5f4`) | Não: é o arquivo final do brief 04 |
| `banner-x-light-1500x500.png`, `banner-linkedin-light-1584x396.png` | Capas de perfil prontas (referência e arquivo final) | Sim, no brief 04 |
| `banner-x-guide-1500x500.png`, `banner-linkedin-guide-1584x396.png` | Capas com as zonas que o app cobre | **Não** |
| `reference-site-light-hero.png`, `reference-site-light-contact.png` | Capturas do site real no tema claro | Opcional (clima e textura) |
| `og-reference.html`, `profile-banners.html` | Fonte das referências (HTML, abre em qualquer navegador) | Não |

## Validação depois do deploy

O domínio precisa estar publicado com a build nova para as ferramentas enxergarem as tags.

| O quê | Como |
| --- | --- |
| Tags no HTML | `curl -s https://ewzxyh.com/ \| grep -E 'og:image\|twitter:image\|canonical\|hreflang'` e o mesmo em `/en` |
| Imagem acessível | `curl -I "<URL do og:image>"` deve devolver `200` e `content-type: image/png` |
| Facebook e Messenger (crawler da Meta) | Sharing Debugger: https://developers.facebook.com/tools/debug/ → "Scrape Again" |
| LinkedIn | Post Inspector: https://www.linkedin.com/post-inspector/ (atualiza o cartão só para posts novos) |
| X | A página de validação foi removida; monte um post de rascunho com o link e veja o cartão. O X guarda o cartão por cerca de 7 dias, por isso o hash na URL |
| Slack | Cole o link numa conversa consigo mesmo (cache de cerca de 30 minutos) |
| WhatsApp | Não existe debugger: mande o link para você mesmo |
| JSON-LD | https://search.google.com/test/rich-results e https://validator.schema.org/ |

## Regras de ouro

- Uma imagem só se refere ao que o site já afirma (nome, cargo, stack, URL). Nada de preço, selo, depoimento ou número novo.
- Tema claro: fundo `#f5f5f4`, tinta `#1c1917`. Laranja `#f97316` só nos quatro quadradinhos dos cantos.
- Nunca gere o rosto com IA. Se um dia usar o retrato, anexe a foto real (`public/hero/enzo-yoshida-portrait.webp`).
- Nunca sobrescreva uma imagem já compartilhada sem trocar o conteúdo do arquivo: o hash na URL cuida do cache.
