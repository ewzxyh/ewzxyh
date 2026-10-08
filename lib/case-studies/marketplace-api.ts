import { tx } from "./helpers"
import type { CaseStudy } from "./types"

export const marketplaceApi: CaseStudy = {
  slug: "marketplace-api",
  summary: tx(
    "API e worker em Go que mantêm sincronizado o catálogo de bolões do Marketplace CAIXA, com resultados, premiações e histórico, para o LotoHub e o Loteria Marketplace.",
    "A Go API and worker that keep the CAIXA Marketplace pool catalog in sync, with results, prizes and history, for LotoHub and Loteria Marketplace.",
  ),
  seoDescription: tx(
    "Estudo de caso: API em Go que sincroniza o catálogo de bolões do Marketplace CAIXA, com agendamento, chaves de API, limite de taxa, auditoria e OpenAPI.",
    "Case study: a Go API that syncs the CAIXA Marketplace pool catalog, with scheduling, API keys, rate limiting, an audit trail and OpenAPI docs.",
  ),
  role: tx("Back-end · arquitetura, API e worker", "Back end · architecture, API and worker"),
  client: "LotoHub · Loteria Marketplace",
  status: tx("Em produção · versão 0.5.0", "In production · version 0.5.0"),
  platform: tx("API REST, worker de coleta e painel de agências", "REST API, collection worker and agency panel"),
  links: [
    { label: tx("Documentação (Swagger)", "Docs (Swagger)"), url: "https://api.loteriamarketplace.com.br/docs" },
    { label: "loteriamarketplace.com.br", url: "https://loteriamarketplace.com.br" },
  ],
  stack: ["Go", "OpenAPI 3.0", "Swagger UI", "Nginx", "Next.js"],
  challenge: [
    tx(
      "Os bolões oficiais vendidos pelas lotéricas ficam no Marketplace da CAIXA, atrás de uma sessão autenticada. Para mostrar esses bolões em sites de lotéricas, alguém precisa coletá-los, mantê-los atualizados e servi-los de forma confiável.",
      "The official pools that lottery retailers sell live in CAIXA's Marketplace, behind an authenticated session. To show them on retailer websites, someone has to collect them, keep them current and serve them reliably.",
    ),
    tx(
      "Resultados e premiações também não saem no horário exato do sorteio: é preciso consultar de novo, no ritmo certo, até a publicação, sem sobrecarregar a fonte.",
      "Results and prizes are not published at the exact draw time either: they have to be checked again, at the right pace, until they appear, without overloading the source.",
    ),
  ],
  solution: [
    tx(
      "Construí uma API em Go com um worker de coleta. A coleta nacional é opcional, percorre todas as páginas do catálogo em um intervalo configurável (de 10 minutos a 24 horas, 30 minutos por padrão) e guarda o histórico de cada bolão. As lotéricas cadastradas (ULs) também recebem o detalhamento dos seus bolões.",
      "I built a Go API with a collection worker. The national collection is opt-in, walks every page of the catalog on a configurable interval (10 minutes to 24 hours, 30 minutes by default) and keeps each pool's history. Registered retailers (ULs) also get the details of their own pools.",
    ),
    tx(
      "Os resultados seguem uma agenda por modalidade e concurso: a primeira consulta sai cinco minutos depois do sorteio previsto e, enquanto não há publicação, as esperas crescem (10, 20, 30 e 60 minutos, depois seis horas). Tudo é exposto em uma API REST documentada em OpenAPI, com chaves de acesso por escopo.",
      "Results follow a schedule per game and draw: the first check runs five minutes after the expected draw and, until publication, the waits grow (10, 20, 30 and 60 minutes, then six hours). Everything is exposed through a REST API documented with OpenAPI, with scoped access keys.",
    ),
  ],
  contributions: [
    tx("Modelagem dos dados de bolões, resultados e premiações", "Data model for pools, results and prizes"),
    tx("Worker de coleta com agendamento e esperas progressivas", "Collection worker with scheduling and progressive back-off"),
    tx("API REST versionada (/v1) e documentação OpenAPI", "Versioned REST API (/v1) and OpenAPI docs"),
    tx("Chaves de API com escopo, validade e revogação", "API keys with scopes, expiry and revocation"),
    tx("Limite de taxa e auditoria das consultas à CAIXA", "Rate limiting and an audit trail of requests to CAIXA"),
    tx("Planos e cobrança por UL para agências", "Plans and per-UL billing for agencies"),
  ],
  features: [
    {
      title: tx("Catálogo nacional", "National catalog"),
      description: tx(
        "Coleta opcional de todas as páginas do Marketplace, com histórico permanente por bolão.",
        "Opt-in collection of every Marketplace page, with a permanent history per pool.",
      ),
    },
    {
      title: tx("Feed de alterações", "Change feed"),
      description: tx(
        "Novos bolões e mudanças desde um cursor, para os sites atualizarem só o que mudou.",
        "New pools and changes since a cursor, so sites update only what changed.",
      ),
    },
    {
      title: tx("Resultados e premiações", "Results and prizes"),
      description: tx(
        "Agenda por concurso, reconciliação em 24 horas e descoberta diária às 12h de Brasília.",
        "A schedule per draw, reconciliation within 24 hours and daily discovery at noon, Brasília time.",
      ),
    },
    {
      title: tx("Chaves de acesso", "Access keys"),
      description: tx(
        "Escopo de leitura ou admin, validade de 1 a 365 dias e revogação individual; o segredo aparece uma única vez.",
        "Read or admin scope, 1 to 365 days of validity and individual revocation; the secret is shown only once.",
      ),
    },
    {
      title: tx("Limite de taxa", "Rate limiting"),
      description: tx("600 leituras por minuto, com Retry-After nas respostas 429.", "600 reads per minute, with Retry-After on 429 responses."),
    },
    {
      title: tx("Auditoria", "Audit trail"),
      description: tx(
        "Cada tentativa contra a CAIXA fica registrada, com metadados e o corpo bruto da resposta.",
        "Every request to CAIXA is logged, with metadata and the raw response body.",
      ),
    },
  ],
  engineering: [
    {
      title: tx("Go no worker", "Go for the worker"),
      description: tx(
        "Coleta concorrente, com limite opcional de concorrência nas consultas de detalhe.",
        "Concurrent collection, with an optional concurrency limit on detail requests.",
      ),
    },
    {
      title: tx("Sessão gerenciada", "Managed session"),
      description: tx(
        "A sessão no Marketplace é renovada por refresh HTTP, seguindo os prazos que a própria CAIXA devolve, sem OTP a cada renovação.",
        "The Marketplace session is renewed through HTTP refresh, following the deadlines CAIXA returns, with no OTP on every renewal.",
      ),
    },
    {
      title: tx("Respeito à fonte", "Respecting the source"),
      description: tx(
        "Cooldown e Retry-After são respeitados, e as leituras locais nunca disparam coleta.",
        "Cooldown and Retry-After are honored, and local reads never trigger a collection.",
      ),
    },
    {
      title: tx("Payloads preservados", "Preserved payloads"),
      description: tx(
        "As respostas oficiais são guardadas como objetos flexíveis, sem perder campos quando a fonte muda.",
        "Official responses are stored as flexible objects, so no field is lost when the source changes.",
      ),
    },
    {
      title: tx("Observabilidade", "Observability"),
      description: tx(
        "/health verifica processo e banco; /v1/worker acompanha o worker em tempo real.",
        "/health checks the process and the database; /v1/worker follows the worker in real time.",
      ),
    },
  ],
  highlights: [
    { value: "19", label: tx("operações documentadas em OpenAPI", "operations documented with OpenAPI") },
    { value: "600/min", label: tx("leituras, com Retry-After no 429", "reads, with Retry-After on 429") },
    { value: "30 min", label: tx("intervalo padrão da coleta nacional", "default national collection interval") },
  ],
  media: {
    desktop: {
      src: "/projects/marketplace-api/desktop.webp",
      width: 2880,
      height: 1800,
      alt: tx("Documentação da API no Swagger UI", "The API documentation in Swagger UI"),
    },
    mobile: {
      src: "/projects/loteria-marketplace/mobile.webp",
      width: 780,
      height: 1688,
      alt: tx("Loteria Marketplace no celular", "Loteria Marketplace on a phone"),
    },
    full: {
      src: "/projects/marketplace-api/full.webp",
      width: 1440,
      height: 6213,
      alt: tx("Todas as rotas da API no Swagger UI", "Every API route in Swagger UI"),
    },
    og: "/projects/marketplace-api/og.jpg",
    extra: [
      {
        src: "/projects/loteria-marketplace/desktop.webp",
        width: 2880,
        height: 1800,
        alt: tx("Página inicial do Loteria Marketplace", "Loteria Marketplace home page"),
        caption: tx(
          "O Loteria Marketplace, marketplace independente de bolões de lotéricas licenciadas.",
          "Loteria Marketplace, an independent marketplace for licensed retailers' pools.",
        ),
      },
    ],
  },
}
