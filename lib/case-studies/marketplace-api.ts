import { tx } from "./helpers"
import type { CaseStudy } from "./types"

// LotoHub for lottery agencies, served at api.loteriamarketplace.com.br/agencia. Everything below is printed on that
// page, its FAQ or its sign-in screen (checked on 2026-10-08); the Go back end was confirmed by Enzo.
export const marketplaceApi: CaseStudy = {
  slug: "marketplace-api",
  summary: tx(
    "Painel e API em que agências lotéricas cadastram suas ULs e acompanham cada bolão do marketplace da CAIXA, do primeiro registro ao resultado oficial, com o histórico guardado depois que o bolão sai da lista.",
    "A panel and API where lottery agencies register their retailer units (ULs) and follow every pool on CAIXA's marketplace, from the first record to the official result, with the history kept after the pool leaves the list.",
  ),
  seoDescription: tx(
    "Estudo de caso: LotoHub Agências, painel e API para lotéricas acompanharem bolões da CAIXA, com entrada por código, captura automática e cobrança por UL.",
    "Case study: LotoHub Agencies, a panel and API for lottery retailers to track CAIXA pools, with e-mail code sign-in, automatic capture and per-unit billing.",
  ),
  role: tx("Desenvolvimento · back-end em Go, painel e API", "Development · Go back end, panel and API"),
  client: "LotoHub",
  status: tx("Em produção, com cadastro aberto e grátis", "In production, with free open sign-up"),
  platform: tx("Painel web, API REST e captura automática", "Web panel, REST API and automatic capture"),
  links: [
    { label: "api.loteriamarketplace.com.br/agencia", url: "https://api.loteriamarketplace.com.br/agencia/" },
    { label: tx("Documentação interativa da API", "Interactive API docs"), url: "https://api.loteriamarketplace.com.br/docs" },
  ],
  stack: ["Go", "React", "API REST", "OpenAPI", "Stripe"],
  challenge: [
    tx(
      "Os bolões que as lotéricas vendem no marketplace da CAIXA saem da lista quando encerram. Para guardar os jogos, as cotas e o resultado de cada um, a agência precisava consultar e anotar tudo à mão, UL por UL.",
      "The pools lottery retailers sell on CAIXA's marketplace leave the list once they close. To keep the games, the shares and the result of each one, an agency had to check and write everything down by hand, unit by unit.",
    ),
    tx(
      "Agências com muitas ULs precisavam desses dados em um painel e em uma API, sem senha para administrar, sem cartão para começar e pagando só pelas ULs que querem detalhar.",
      "Agencies with many units needed that data in a panel and an API, with no password to manage, no card to start and paying only for the units they want detailed.",
    ),
  ],
  solution: [
    tx(
      "No LotoHub Agências a agência cadastra a UL e o resto é automático. O número é conferido no catálogo nacional da CAIXA; depois o bolão é detectado com as dezenas, as cotas disponíveis são acompanhadas até zerar e a captura final é guardada junto com o resultado oficial.",
      "In LotoHub Agencies the agency registers the unit and the rest is automatic. The number is checked against CAIXA's national catalog; then each pool is detected with its numbers, the available shares are followed until they run out and the final capture is stored with the official result.",
    ),
    tx(
      "Os mesmos dados aparecem no painel, com o andamento de cada UL e a próxima tentativa, e na API em JSON, com chaves próprias. Catálogo, resultados e chaves de API são grátis; o detalhamento custa R$ 10,00 por UL ao mês, ou R$ 500,00 pelo pacote de 100 ULs, e o valor aparece inteiro na página antes do cadastro.",
      "The same data shows up in the panel, with the progress of each unit and the next attempt, and in the API as JSON, with the agency's own keys. The catalog, results and API keys are free; details cost R$ 10.00 per unit a month, or R$ 500.00 for a pack of 100 units, and the full price is on the page before sign-up.",
    ),
  ],
  contributions: [
    tx("Captura automática de cada bolão, do registro ao resultado oficial", "Automatic capture of every pool, from the first record to the official result"),
    tx("Painel por UL com o progresso da captura e a próxima tentativa", "A per-unit panel with the capture progress and the next attempt"),
    tx("API REST com chaves próprias, validade e documentação interativa", "A REST API with the agency's own keys, expiry and interactive docs"),
    tx("Entrada sem senha, com código de 6 números ou botão por e-mail", "Passwordless sign-in with a 6-digit code or a button by e-mail"),
    tx("Conferência de cada UL no catálogo nacional da CAIXA", "Every unit checked against CAIXA's national catalog"),
    tx("Planos por capacidade de ULs, com cobrança e portal da Stripe", "Plans by unit capacity, with Stripe billing and portal"),
  ],
  features: [
    {
      title: tx("Painel por UL", "Panel per unit"),
      description: tx(
        "O que já foi detalhado em cada UL, o que falta e quando acontece a próxima tentativa.",
        "What has been detailed in each unit, what is missing and when the next attempt runs.",
      ),
    },
    {
      title: tx("API com chave própria", "API with your own key"),
      description: tx(
        "Chaves com validade para ler bolões, detalhes e resultados em JSON, testadas na documentação interativa.",
        "Keys with an expiry date to read pools, details and results as JSON, tried out in the interactive docs.",
      ),
    },
    {
      title: tx("Resultados e premiações", "Results and prizes"),
      description: tx(
        "As 11 modalidades oficiais e os locais premiados, liberados mesmo sem plano.",
        "All 11 official games and the winning locations, open even without a plan.",
      ),
    },
    {
      title: tx("Vida do bolão", "A pool's life"),
      description: tx(
        "Do bolão detectado às cotas que zeram e à captura final com o resultado, com data e hora de cada etapa.",
        "From the detected pool to the shares running out and the final capture with the result, each step with its date and time.",
      ),
    },
    {
      title: tx("Entrada por e-mail", "E-mail sign-in"),
      description: tx(
        "Código de 6 números ou botão Entrar, válidos por 10 minutos e de uso único; a conta é criada no primeiro acesso.",
        "A 6-digit code or a Sign in button, valid for 10 minutes and single use; the account is created on first access.",
      ),
    },
    {
      title: tx("Preço na página", "Price on the page"),
      description: tx(
        "Escolha quantas ULs detalhar e veja o valor mensal, a economia do pacote e o preço por UL antes de entrar.",
        "Pick how many units to detail and see the monthly price, the pack savings and the price per unit before signing in.",
      ),
    },
  ],
  engineering: [
    {
      title: tx("Back-end em Go", "Go back end"),
      description: tx(
        "Um serviço em Go coleta o catálogo, os bolões e os resultados da CAIXA e responde ao painel e à API.",
        "A Go service collects CAIXA's catalog, pools and results and serves both the panel and the API.",
      ),
    },
    {
      title: tx("Dados com procedência", "Data with provenance"),
      description: tx(
        "Cada dado traz a data em que foi observado. Se a fonte sai do ar, a captura fica pendente e é retomada depois, sem inventar dados.",
        "Every value carries the time it was observed. If the source goes down, the capture stays pending and resumes later, never making data up.",
      ),
    },
    {
      title: tx("Capacidade por UL", "Capacity per unit"),
      description: tx(
        "As primeiras ULs cadastradas entram no detalhamento até a capacidade contratada; as demais continuam cadastradas, e reduzir o plano não apaga o histórico.",
        "The first registered units are detailed up to the contracted capacity; the others stay registered, and lowering the plan never deletes history.",
      ),
    },
    {
      title: tx("Acesso sem senha", "Passwordless access"),
      description: tx(
        "Código e botão de entrada valem uma vez, por 10 minutos, e o e-mail pode ficar lembrado por 30 dias.",
        "The code and the sign-in button work once, for 10 minutes, and the e-mail can be remembered for 30 days.",
      ),
    },
    {
      title: tx("Cobrança na Stripe", "Billing on Stripe"),
      description: tx(
        "Planos, mudanças e cancelamento pelo painel, com o pagamento no portal seguro da Stripe; ao reduzir a capacidade, o histórico das ULs é preservado.",
        "Plans, changes and cancellation from the panel, with payment on Stripe's secure portal; lowering the capacity keeps every unit's history.",
      ),
    },
  ],
  highlights: [
    { value: "11", label: tx("modalidades com resultado oficial e locais premiados", "games with official results and winning locations") },
    { value: "R$ 0", label: tx("para cadastrar ULs, ver o catálogo e criar chaves de API", "to register units, browse the catalog and create API keys") },
    { value: "R$ 5", label: tx("por UL no pacote de 100 ULs (R$ 10 avulsa)", "per unit in the 100-unit pack (R$ 10 on its own)") },
  ],
  media: {
    desktop: {
      src: "/projects/marketplace-api/agencia-desktop.webp",
      width: 2880,
      height: 1800,
      alt: tx("Página do LotoHub para agências lotéricas no computador", "LotoHub page for lottery agencies on a desktop screen"),
    },
    mobile: {
      src: "/projects/marketplace-api/agencia-mobile.webp",
      width: 780,
      height: 1688,
      alt: tx("Página do LotoHub para agências no celular", "LotoHub agency page on a phone"),
    },
    full: {
      src: "/projects/marketplace-api/agencia-full.webp",
      width: 1440,
      height: 6940,
      alt: tx("A página do LotoHub Agências inteira, do topo ao rodapé", "The whole LotoHub Agencies page, top to bottom"),
    },
    og: "/projects/marketplace-api/agencia-og.jpg",
    extra: [
      {
        src: "/projects/marketplace-api/agencia-bolao.webp",
        width: 2400,
        height: 2278,
        alt: tx(
          "Linha do tempo de um bolão da Loteria Amazonas, o bolão em JSON na API e o progresso da captura por UL no painel",
          "Timeline of a Loteria Amazonas pool, the pool as JSON in the API and the capture progress per unit in the panel",
        ),
        caption: tx(
          "A vida de um bolão: a UL cadastrada, o bolão detectado, as cotas acompanhadas e a captura final, com o mesmo bolão na API e o andamento de cada UL no painel.",
          "A pool's life: the registered unit, the detected pool, the shares followed and the final capture, with the same pool in the API and each unit's progress in the panel.",
        ),
      },
      {
        src: "/projects/marketplace-api/agencia-login.webp",
        width: 2400,
        height: 1500,
        address: "api.loteriamarketplace.com.br/agencia/login",
        alt: tx("Tela de entrada por e-mail, ao lado de uma prévia do painel de lotéricas", "E-mail sign-in screen next to a preview of the retailers panel"),
        caption: tx(
          "Entrada sem senha: um código de 6 números e um botão chegam por e-mail; a conta nasce no primeiro acesso.",
          "Passwordless sign-in: a 6-digit code and a button arrive by e-mail; the account is created on first access.",
        ),
      },
      {
        src: "/projects/marketplace-api/agencia-preco.webp",
        width: 2400,
        height: 1305,
        alt: tx("Planos: sempre grátis e detalhamento por quantidade de ULs", "Plans: always free, and details priced by number of units"),
        caption: tx(
          "O preço calculado na página: cadastro grátis e ilimitado, e o detalhamento por UL, com o desconto do pacote de 100.",
          "The price worked out on the page: free, unlimited sign-up, and details per unit, with the 100-unit pack discount.",
        ),
      },
    ],
    phones: [
      {
        src: "/projects/marketplace-api/agencia-mobile-bolao.webp",
        width: 780,
        height: 1688,
        alt: tx("A linha do tempo do bolão no celular", "The pool timeline on a phone"),
        caption: tx("A vida do bolão no celular", "A pool's life on a phone"),
      },
    ],
  },
}
