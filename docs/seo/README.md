# SEO, GEO e SEO para IA

O que foi implementado em 2026-10-05, por que, e o que falta fazer fora do código. A pesquisa foi feita contra a
documentação das plataformas e estudos públicos na mesma data; onde algo não pôde ser verificado, está escrito.

## 1. Resumo

1. **Domínio corrigido.** O código apontava para `https://ewzxyh.dev`, que **não está registrado** (RDAP 404 no registro
   do `.dev` e NXDOMAIN no DNS). O site roda em `https://ewzxyh.com` (Vercel; `www` responde 301 para o apex). Resultado:
   canonical, `og:url`, `og:image`, sitemap e JSON-LD da versão publicada apontam para um domínio inexistente, então as
   imagens de compartilhamento quebram em toda rede e o sitemap lista URLs de outro host. Tudo passa a usar
   `https://ewzxyh.com` (uma constante em `lib/site.ts`). Há ainda um risco de segurança: quem registrar `ewzxyh.dev` poderia
   espelhar o site com o canonical antigo; registrar o `.dev` e redirecioná-lo para o `.com` (301) fecha essa porta.
2. **Um idioma por URL.** `/` em português e `/en` em inglês, ambos servidos prontos (HTML estático), com `hreflang`,
   canonical próprio e sitemap com alternativas. Antes o inglês só existia depois do JavaScript, então nenhum buscador
   ou IA conseguia indexá-lo.
3. **Endpoints para máquinas:** `llms.txt`, `llms-full.txt`, gêmeos em Markdown de cada seção nos dois idiomas
   (`/index.md`, `/en/about.md`...), `robots.txt` por finalidade de crawler, `sitemap.xml`, `manifest.webmanifest`,
   `humans.txt`, `.well-known/security.txt`.
4. **Metadados completos** (Open Graph, X, ícones, canonical) e **JSON-LD** (WebSite, ProfilePage, Person, Organization)
   com as redes `@ewzxyh`.
5. **Imagens:** as quatro imagens de compartilhamento (Open Graph 1200×630 e cartão do X 1600×800, em português e em
   inglês) já estão em `public/og/` e o site as usa sozinho, com o hash do arquivo na URL (briefs em
   `docs/metadata-images`). O WebP escuro antigo só volta se um desses arquivos for apagado.

## 2. URLs

| URL | Origem | O que é |
| --- | --- | --- |
| `/` | `app/(pt)/page.tsx` | Portfólio em português (estático) |
| `/en` | `app/en/page.tsx` | Portfólio em inglês (estático) |
| qualquer outra URL | `app/global-not-found.tsx` | 404 de verdade (status 404, `noindex`) |
| `/index.md`, `/about.md`, `/services.md`, `/skills.md`, `/experience.md`, `/projects.md`, `/contact.md` | `app/md/[locale]/[doc]/route.ts` (reescrita em `next.config.ts`) | Uma seção por arquivo, em Markdown, pt-BR |
| `/en/index.md`, `/en/about.md`, ... | idem | O mesmo em inglês |
| `/llms.txt` | `app/llms.txt/route.ts` | Índice para modelos e agentes (formato de llmstxt.org) |
| `/llms-full.txt` | `app/llms-full.txt/route.ts` | Todo o conteúdo nos dois idiomas em um arquivo |
| `/robots.txt`, `/sitemap.xml`, `/manifest.webmanifest` | `app/robots.ts`, `app/sitemap.ts`, `app/manifest.ts` | Convenções do Next |
| `/humans.txt`, `/.well-known/security.txt` | `public/` | Créditos (inclui a atribuição CC BY 4.0 dos ícones Solar) e contato de segurança (RFC 9116, expira em 2027-09-30) |
| `/favicon.ico` e `/favicon/*` | `app/favicon.ico`, `public/favicon/` | Ícones (brief 03) |

Todo o texto vem de uma única fonte: `lib/translations.ts` (copy), `lib/profile.ts` (experiência, projetos, habilidades) e
`lib/site.ts` (identidade). A página, os `.md`, o `llms.txt` e o JSON-LD leem dali, então não divergem.

## 3. Como funciona

### 3.1 Idiomas

- `/` é português e `/en` é inglês. Cada um tem `<link rel="canonical">` para si e todos listam
  `hreflang="pt-BR"` (`/`), `hreflang="en"` (`/en`) e `hreflang="x-default"` (`/en`: quem não é de língua portuguesa cai
  na versão em inglês). O sitemap repete as mesmas alternativas. O Google exige URLs separadas por idioma, cada uma
  listando a si mesma e as alternativas.
- O botão de idioma (cabeçalho) e o link do rodapé **não recarregam**: trocam o texto na hora com a animação de sempre,
  reescrevem o endereço (`/` ⇄ `/en`), atualizam `<html lang>`, o título e gravam o cookie `locale-choice`. Recarregar
  ou compartilhar a URL abre o idioma que estava na tela. O link do rodapé é um `<a href>` de verdade, para
  crawlers sem JavaScript acharem a outra versão.
- `proxy.ts` decide para onde `/` abre. **Visitantes estrangeiros recebem `/en`**: sem escolha salva, quem chega de um
  país que não é Brasil nem Portugal (header `x-vercel-ip-country`) é redirecionado (307, sem cache, mantendo `?utm`),
  seja qual for o idioma do navegador. Quem escolheu um idioma no botão (cookie `locale-choice`) sempre recebe o que
  escolheu. Só **pessoas** são redirecionadas: crawlers, previews de link e ferramentas (o regex de user agents está no
  arquivo) recebem sempre a página pedida, para o Google e os cartões sociais verem as duas versões. Sem o header de país
  (dev local), nada redireciona.
- **Um layout raiz por idioma**, como a documentação do Next prevê
  ([layout raiz](https://nextjs.org/docs/app/api-reference/file-conventions/layout#root-layout) e
  [route groups](https://nextjs.org/docs/app/api-reference/file-conventions/route-groups)): `app/(pt)/layout.tsx` e
  `app/en/layout.tsx` renderizam o mesmo `app/root-document.tsx` com `<html lang>` certo (`pt-BR` e `en`), então o HTML
  estático já sai no idioma da página, sem script. `Content-Language` também é enviado por URL. A navegação entre dois
  layouts raiz recarrega a página (por isso o botão de idioma troca o texto no lugar e só reescreve o endereço).
- Sem um layout raiz único, o 404 vem de `app/global-not-found.tsx` (recurso **experimental** do Next 16,
  `experimental.globalNotFound` em `next.config.ts`; documentado em
  [not-found](https://nextjs.org/docs/app/api-reference/file-conventions/not-found#global-not-foundjs-experimental)).
  A alternativa documentada do guia de i18n, `app/[lang]/layout.tsx`, também exige esse recurso para o 404 e trocaria o
  endereço do português de `/` para `/pt-BR`.

### 3.2 Metadados

- `lib/seo.ts`: `siteMetadata` e `siteViewport` (título-modelo, robots, ícones, `metadataBase`), usados pelos dois
  layouts raiz, e `getPageMetadata` (o que muda por idioma: título, descrição, canonical, alternativas, Open Graph,
  cartão do X, link para o gêmeo `.md`).
- Open Graph: `og:type=website`, `og:locale` `pt_BR`/`en_US` com a outra como alternativa, `og:site_name=Enzo Yoshida`,
  imagem com largura, altura, tipo e alt. X: `summary_large_image`, `twitter:site` e `twitter:creator` = `@ewzxyh`.
- `robots` por página: `index, follow`; `max-image-preview:large`, `max-snippet:-1`, `max-video-preview:-1` para o Google
  (sem limitar trechos nos recursos de IA; `nosnippet` ou `max-snippet` baixo os bloqueariam).
- Removido: `meta keywords` (o Google não as usa).
- **Apresentação em três camadas** (`lib/site.ts`): o título leva a identidade e uma só tecnologia ("Enzo Yoshida |
  Product Engineer Next.js e SaaS", 46 caracteres: o Google pede títulos curtos, sem palavras repetidas e coerentes com a
  página); a descrição leva o que é entregue (MVPs, SaaS, dashboards, integrações, automações sob medida) e, em pt-BR,
  "desenvolvedor full-stack", o termo que o público brasileiro busca; a stack completa (React, TypeScript, Laravel,
  PostgreSQL...) fica nas habilidades do site e em `knowsAbout` do JSON-LD, sem poluir o título. Não há dados de volume
  de busca aqui: depois de 4 a 8 semanas, confira no Search Console por quais consultas a página aparece e ajuste.
- Imagens: `lib/share-images.ts` (ver `docs/metadata-images`).

### 3.3 JSON-LD (`lib/structured-data.ts`)

Um `@graph` por página, com ids estáveis:

| Nó | Tipo | Pontos importantes |
| --- | --- | --- |
| `#website` | WebSite | `name` igual ao `<title>`/`og:site_name`/H1 ("Enzo Yoshida"); `alternateName`: Ewzxyh Labs, ewzxyh.com; `inLanguage`: pt-BR e en |
| `/…#profile-page` | ProfilePage | Um por idioma (`/#profile-page` e `/en#profile-page`); `mainEntity` = a pessoa; `dateCreated` (primeiro commit) e `dateModified` (de `siteLastModified`) |
| `#person` | Person | `sameAs`: X, LinkedIn, Instagram, GitHub; `jobTitle`, `worksFor`, `knowsAbout`, `knowsLanguage`, `alumniOf`, e-mail sem `mailto:` |
| `#organization` | Organization | Ewzxyh Labs; `founder`; `makesOffer` com os três serviços; `contactPoint`; **sem** `sameAs` pessoal (LinkedIn `/in/` é da pessoa) |
| imagens | ImageObject | Retrato e imagem de compartilhamento |

Decisões: `ProfessionalService` foi evitado (tipo marcado como obsoleto pelo schema.org); `inLanguage` só em obras
(WebSite e ProfilePage), não em Person/Organization; `worksFor` só na pessoa, `founder` só na organização. Fora de uso por
estarem aposentados no Google: FAQPage (rich result encerrado em maio de 2026), HowTo e SearchAction. O Google não
exige marcação especial para os recursos de IA; o JSON-LD aqui serve para o grafo de entidades (quem é quem) e para o
perfil. Só se marca o que está visível na página.

### 3.4 `robots.txt` (política de crawlers)

Está tudo liberado, por finalidade (em `app/robots.ts`):

- **Busca** (montam os índices que as respostas citam): Googlebot, Bingbot, OAI-SearchBot, Claude-SearchBot, PerplexityBot,
  DuckAssistBot, Applebot.
- **Assistentes sob demanda** (alguém pediu a um assistente para ler a página): ChatGPT-User, Claude-User, Perplexity-User,
  MistralAI-User, meta-externalfetcher. Atenção: parte desses buscadores iniciados por usuário pode ignorar o
  `robots.txt`; ele não é uma barreira.
- **Treinamento** (coleta conteúdo para treinar ou fundamentar modelos; vários são só "tokens" de controle):
  GPTBot, ClaudeBot, Google-Extended, Applebot-Extended, meta-externalagent, CCBot, Amazonbot.

`/md/` (caminho interno dos gêmeos) fica bloqueado; os caminhos públicos `/index.md`, `/en/about.md`... não. A escolha
de permitir também o treinamento é uma decisão de política: um portfólio quer ser achado e citado. Para vetar só o
treinamento, mova os nomes do grupo `training` para uma regra `disallow: "/"` na mesma função, sem tocar nos outros.

### 3.5 Sitemap

Duas entradas (`/` e `/en`), cada uma com as alternativas de idioma, `lastmod` (`siteLastModified` em `lib/site.ts`:
**só altere quando o conteúdo realmente mudar**, os buscadores desconfiam de datas infladas) e imagens. Os gêmeos
Markdown e o `llms.txt` não entram: sitemap é para páginas que devem aparecer em resultados.

### 3.6 `llms.txt`, `llms-full.txt` e os gêmeos Markdown

- `llms.txt` segue a especificação de llmstxt.org (H1, resumo em citação, seções com listas de links, `## Optional`).
  Está em inglês com um resumo em português. `llms-full.txt` é o conteúdo inteiro nos dois idiomas, em um pedido só.
- Os gêmeos `.md` são servidos como `text/markdown`, com `Content-Language` e `Link: <página>; rel="canonical"` para a
  página do mesmo idioma (buscadores dobram a cópia na página, em vez de listar as duas). O `<head>` de cada página
  anuncia o gêmeo com `<link rel="alternate" type="text/markdown">`.
- **Honestidade sobre o efeito:** o Google afirma que `llms.txt` não ajuda nem atrapalha e que não exige formatação
  especial para IA; John Mueller disse que nenhum sistema de IA o usa; o SE Ranking (300 mil domínios) não achou
  correlação com citações e o Ahrefs (137 mil domínios) viu que 97% desses arquivos não recebiam nenhuma requisição de
  bots de IA. Ele é barato, inofensivo e útil para agentes de programação e ferramentas que o leem, mas **não conte com
  ele para posição em buscas ou em respostas de IA**.
- Não implementado de propósito: negociação `Accept: text/markdown` (exigiria `Vary: Accept` e complicaria o cache), `ai.txt`,
  `Content-Signal` e WebMCP (sem uso comprovado).

### 3.7 Ícones, manifest e `theme-color`

Brief 03. Resumo: favicon e ícones novos gerados do logo oficial (tile escuro `#0c0a09`), `maskable` para launchers,
manifest com `id`, `lang` e três ícones, `theme-color` escuro (o site abre no tema escuro).

## 4. O que a pesquisa disse sobre GEO e IA

Resumo do que tem evidência e do que é folclore (as fontes estão na seção 8).

| Tema | Conclusão | Força da evidência |
| --- | --- | --- |
| Indexado e rastreável | Condição básica; o Google diz que os recursos de IA usam o mesmo índice, sem exigência extra | Oficial |
| HTML pronto no servidor | Em dezembro de 2024 os principais crawlers de IA não executavam JavaScript (Googlebot/Gemini e Applebot sim). Este site entrega todo o texto no HTML estático, nos dois idiomas | Medição datada; reteste com logs |
| Estatísticas, citações e fontes no texto | No estudo GEO (KDD 2024) adicionar citações, números e fontes aumentou a visibilidade dentro da resposta em 30 a 40% no laboratório (stuffing de palavras-chave piorou). Só vale depois de a página já estar no contexto do modelo | Experimento controlado, limitado |
| Menções de terceiros | Motores de IA preferem fontes de terceiros às da própria marca; correlação de 0,65 entre menções e presença em AI Overviews | Correlacional |
| Resposta no começo da página | Cerca de 44% das citações do ChatGPT vieram dos primeiros 30% da página | Observacional |
| Frescor | Assistentes citam páginas cerca de 26% mais recentes | Correlacional |
| Perguntas e respostas visíveis | Recomendado por Microsoft e Google em guias; efeito isolado fraco | Só recomendação |
| JSON-LD para IA | Estudo de 1.885 páginas contra 4.000 de controle: sem diferença significativa (recuperadores leem o HTML visível). Ainda assim vale para entidade e perfil | Estudo único |
| `llms.txt` | Sem efeito demonstrado | Ver 3.6 |
| Texto oculto, prompts escondidos, links "Resumir com IA" que gravam memória | Violam as políticas de spam; a Microsoft chama de "envenenamento de recomendação" | Evitar |

Aplicado aqui: texto principal e fatos concretos no HTML (5+ anos, 50+ projetos, 630+ operadores, projetos nomeados), uma só
grafia por entidade ("Enzo Yoshida", "Ewzxyh Labs"), página rápida e estática, FAQ no Markdown (`/index.md`), datas reais.

## 5. Para você fazer (fora do código)

Prioridade alta

1. **Deploy** desta versão e conferência com os links do [README das imagens](../metadata-images/README.md).
2. **Google Search Console:** crie uma propriedade de domínio para `ewzxyh.com` (verificação por DNS), envie
   `https://ewzxyh.com/sitemap.xml` e rode "Inspeção de URL" com teste ao vivo em `/` e `/en`. Segundo a ajuda do Google,
   desde 2026-08-31 o Search Console informa impressões de recursos de IA (somente impressões).
3. **Bing Webmaster Tools:** importe do Search Console e envie o sitemap. O Bing tem o relatório "AI Performance"
   (citações e consultas) e o protocolo **IndexNow** (Bing, Yandex, Naver, Seznam; o Google não participa) para avisar de
   mudanças na hora.
4. **Firewall do Vercel:** confirme que nenhuma regra de "bots de IA" ou desafio de bot bloqueia OAI-SearchBot,
   Claude-SearchBot, PerplexityBot, Googlebot e Bingbot. Teste feito hoje contra a produção atual, com os user agents de
   Googlebot, Bingbot, OAI-SearchBot, GPTBot, ClaudeBot, Claude-SearchBot, PerplexityBot, CCBot e dos previews do
   Facebook, X e LinkedIn: todos receberam 200.
5. **`ewzxyh.dev`:** registre e redirecione (301) para `https://ewzxyh.com`, ou ao menos não use esse domínio em lugar
   nenhum. As páginas já publicadas ainda anunciam esse canonical até o próximo deploy.
6. **Troque as imagens** de compartilhamento (brief 01) e **os perfis** (brief 04).

Prioridade média

7. **Mesmo nome e cargo em todos os perfis** (LinkedIn, X, Instagram, GitHub): "Enzo Yoshida · Product Engineer ·
   Ewzxyh Labs". Uma pesquisa de hoje viu variantes do nome do estúdio e um cargo diferente num perfil; entidades
   inconsistentes enfraquecem o grafo.
8. **Menções reais:** link para o site no README e no perfil do GitHub, destaque no LinkedIn, projetos citando a
   Ewzxyh Labs. Peso maior do que qualquer ajuste interno.
9. **Prova concreta:** depoimentos de clientes (com autorização) e números datados na página.
10. **Meça:** Search Console, Bing, logs de bots e `utm_source=chatgpt.com` nos acessos. Ferramentas que rodam um único
    prompt e dão "ranking" são ruído (a lista de recomendações de IA muda em quase toda consulta).

Prioridade baixa

11. Páginas próprias por projeto (`/projetos/casepay`...) dariam URLs específicas para buscas de cauda longa; é uma etapa
    maior e pode vir depois.
12. Se quiser uma data visível de atualização, use a mesma de `siteLastModified` (mesma fonte de verdade do sitemap e do
    JSON-LD).

## 6. Como validar

```bash
# idiomas, canonical e hreflang
curl -s https://ewzxyh.com/    | grep -oE '<link rel="(canonical|alternate)"[^>]*>'
curl -s https://ewzxyh.com/en  | grep -oE '<link rel="(canonical|alternate)"[^>]*>'
# Markdown e llms
curl -sI https://ewzxyh.com/en/index.md | grep -iE 'content-type|content-language|link'
curl -s  https://ewzxyh.com/llms.txt | head -20
# sitemap e robots
curl -s https://ewzxyh.com/sitemap.xml
curl -s https://ewzxyh.com/robots.txt
# <html lang> do HTML estático de cada idioma
curl -s https://ewzxyh.com/    | grep -o '<html[^>]*>'
curl -s https://ewzxyh.com/en  | grep -o '<html[^>]*>'
# visitante estrangeiro: deve responder 307 para /en (em produção a Vercel já envia o header de país;
# fora dela o header é simulado, e a localhost ele só vale com o dev server ou o build rodando)
curl -sI -A "Mozilla/5.0 Chrome/130" -H "x-vercel-ip-country: US" http://localhost:3000/
```

Ferramentas: Teste de Resultados Rich do Google (https://search.google.com/test/rich-results), validador do schema.org
(https://validator.schema.org/), Inspeção de URL do Search Console, Sharing Debugger e Post Inspector (ver o README das
imagens). A checagem do grafo JSON-LD usada nesta entrega (ids resolvidos, propriedades por tipo, sem `mailto:`) foi feita
com um script local sobre a build de produção.

## 7. Manutenção

| Quero mudar | Onde |
| --- | --- |
| Domínio, títulos, descrições, redes, e-mail, WhatsApp, `siteLastModified` | `lib/site.ts` |
| Textos do site (aparecem também nos `.md`, `llms.txt` e no JSON-LD) | `lib/translations.ts` |
| Experiência, projetos, habilidades | `lib/profile.ts` |
| Política de crawlers | `app/robots.ts` |
| Regras de idioma e redirecionamento de estrangeiros | `lib/site.ts` (`localePaths`), `lib/i18n.tsx`, `proxy.ts` |
| Documento HTML (`<html lang>`, fonte, provedores) | `app/root-document.tsx` |
| Imagens de compartilhamento | `public/og/` (nomes no README das imagens) |
| Ícones | `bun scripts/make-icons.ts` |

Novo idioma: crie `app/<codigo>/layout.tsx` e `page.tsx` (como `app/en/`, com `RootDocument`), acrescente o locale em
`lib/site.ts` e `lib/translations.ts`, e ele entra no `hreflang` e no sitemap pelas funções existentes.

## 8. Limitações e decisões a rever

- `experimental.globalNotFound` é um recurso experimental do Next 16: se uma versão futura mudar ou remover a opção, o
  404 volta a ser o padrão do Next até `app/global-not-found.tsx` ser ajustado (o resto do site não depende dele).
- O redirecionamento de estrangeiros usa o header de país da Vercel e uma lista de user agents (para não redirecionar
  crawlers); uma ferramenta desconhecida com user agent de navegador, vinda de fora do Brasil e de Portugal, é
  redirecionada. Países lusófonos além de BR e PT recebem `/en` (o botão troca e lembra a escolha). Para desligar tudo,
  apague `proxy.ts`: o idioma continua certo por URL.
- Os cartões do X: a documentação oficial foi removida e o validador não existe; valores vêm de cópias arquivadas.
- O WhatsApp não tem debugger; o limite de 600 KB é o documentado e ~300 KB é o que testes da comunidade indicam.
- Os tamanhos de foto e capa dos perfis (brief 04) não foram verificados contra a documentação de cada rede.
- Nada disso garante posição: SEO e GEO dependem de conteúdo relevante, rastreável e de menções externas.

## 9. Fontes

- Google, recursos de IA e SEO: https://developers.google.com/search/docs/appearance/ai-features ·
  https://developers.google.com/search/docs/fundamentals/ai-optimization-guide ·
  https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag
- Google, idiomas: https://developers.google.com/search/docs/specialty/international/localized-versions ·
  https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites ·
  https://developers.google.com/search/docs/specialty/international/locale-adaptive-pages
- Google, dados estruturados: https://developers.google.com/search/docs/appearance/structured-data/profile-page ·
  https://developers.google.com/search/docs/appearance/structured-data/organization ·
  https://developers.google.com/search/docs/appearance/site-names · https://developers.google.com/search/updates
- Google, favicon: https://developers.google.com/search/docs/appearance/favicon-in-search
- Bing e Microsoft: https://about.ads.microsoft.com/en/blog/post/october-2025/optimizing-your-content-for-inclusion-in-ai-search-answers ·
  https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview ·
  https://www.indexnow.org/documentation
- Crawlers: https://developers.openai.com/api/docs/bots · https://docs.perplexity.ai/guides/bots ·
  https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler
- Estudo GEO: https://arxiv.org/abs/2311.09735 · levantamento de 45 estudos: https://arxiv.org/abs/2607.14035
- `llms.txt`: https://llmstxt.org · https://seranking.com/blog/llms-txt/ · https://ahrefs.com/blog/llmstxt-study/ ·
  https://www.seroundtable.com/google-ai-llms-txt-39607.html
- Crawlers e JavaScript: https://vercel.com/blog/the-rise-of-the-ai-crawler
- Open Graph e imagens: https://ogp.me/ · https://developers.facebook.com/documentation/sharing/webmasters/images ·
  https://www.linkedin.com/help/linkedin/answer/a521928 ·
  https://developers.facebook.com/documentation/business-messaging/whatsapp/link-previews/
- PWA e ícones: https://web.dev/articles/install-criteria · https://web.dev/articles/maskable-icon ·
  https://www.w3.org/TR/appmanifest/
- Next.js 16 (docs locais): `node_modules/next/dist/docs/01-app/02-guides/internationalization.md`, `json-ld.md`,
  `03-api-reference/03-file-conventions/not-found.md`
