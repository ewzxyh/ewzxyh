import { capturedMedia, tx } from "./helpers"
import type { CaseStudy } from "./types"

export const lotohub: CaseStudy = {
  slug: "lotohub",
  summary: tx(
    "SaaS que cria o site de uma lotérica em minutos: bolões, resultados, endereço e WhatsApp, com prévia antes de pagar.",
    "A SaaS that builds a lottery retailer's website in minutes: pools, results, address and WhatsApp, with a preview before paying.",
  ),
  seoDescription: tx(
    "Estudo de caso do LotoHub: SaaS multi-tenant em Next.js que cria sites de lotéricas com bolões, resultados e WhatsApp, alimentado por uma API em Go.",
    "LotoHub case study: a multi-tenant Next.js SaaS that builds lottery retailer websites with pools, results and WhatsApp, fed by a Go API.",
  ),
  role: tx("Fundador · produto e engenharia", "Founder · product and engineering"),
  client: tx("Produto da Case, desenvolvido pela Ewzxyh Labs", "A Case product, built by Ewzxyh Labs"),
  period: tx("dez 2024 – atual", "Dec 2024 – present"),
  status: tx("No ar", "Live"),
  platform: tx("SaaS multi-tenant + sites públicos", "Multi-tenant SaaS + public sites"),
  links: [{ label: "lotohub.com.br", url: "https://lotohub.com.br" }],
  stack: ["Next.js", "Tailwind CSS", "Supabase", "Stripe", "Go", "Vercel"],
  challenge: [
    tx(
      "O WhatsApp de uma lotérica vira uma fila de perguntas repetidas: quais bolões há hoje, quanto custa a cota, se o resultado já saiu, onde fica a loja. Responder isso o dia inteiro toma o tempo de quem deveria estar vendendo.",
      "A lottery retailer's WhatsApp turns into a queue of repeated questions: which pools are on today, how much a share costs, whether the results are out, where the store is. Answering all day takes time away from selling.",
    ),
    tx(
      "Um site resolveria, mas a maioria das lotéricas não tem tempo, verba nem conhecimento técnico para criar e manter um.",
      "A website would solve it, but most retailers have no time, budget or technical background to build and run one.",
    ),
  ],
  solution: [
    tx(
      "O LotoHub monta o site a partir do nome e da cidade da lotérica, e a prévia aparece antes de qualquer pagamento. O cliente vê bolões, resultados e endereço no celular e chama a lotérica no WhatsApp com a mensagem pronta; a venda continua com a lotérica.",
      "LotoHub builds the site from the retailer's name and city, and the preview appears before any payment. Customers see pools, results and the address on their phone and message the retailer on WhatsApp with a ready-made text; the sale stays with the retailer.",
    ),
    tx(
      "Os bolões entram por uma foto ou, para quem usa o Marketplace CAIXA, direto pelo código da lotérica, por uma API própria em Go. O Radar lê os bolões do Brasil inteiro a cada 10 minutos e mostra o que abrir agora e o melhor horário para divulgar.",
      "Pools come in from a photo or, for retailers on the CAIXA Marketplace, straight from the retailer code through an in-house Go API. The Radar reads pools from all over Brazil every 10 minutes and shows what to open now and the best time to promote.",
    ),
    tx(
      "No dia a dia, o chat separa as conversas por assunto e responde as perguntas repetidas, as artes saem de uma descrição, um blog automático traz visitas do Google e, com a CasePay integrada, a cota paga por PIX vira venda anotada.",
      "Day to day, the chat sorts conversations by topic and answers the repeated questions, promo artwork comes from a description, an automatic blog brings visits from Google and, with CasePay built in, a share paid by PIX becomes a recorded sale.",
    ),
  ],
  contributions: [
    tx("Produto, fluxo de cadastro e preço", "Product, onboarding flow and pricing"),
    tx("Gerador de sites multi-tenant, com subdomínio por lotérica", "Multi-tenant site builder with a subdomain per retailer"),
    tx("Cadastro de bolões por foto e importação do Marketplace CAIXA", "Pools from a photo and imports from the CAIXA Marketplace"),
    tx("Painel da lotérica, pagamento e cancelamento pelo próprio cliente", "Retailer dashboard, payments and self-serve cancellation"),
    tx("Landing page e presença no Google para cada lotérica", "Landing page and Google presence for every retailer"),
  ],
  features: [
    {
      title: tx("Prévia na hora", "Instant preview"),
      description: tx("Nome e cidade bastam para ver o site pronto, antes de pagar.", "A name and a city are enough to see the finished site before paying."),
    },
    {
      title: tx("Bolões e cotas", "Pools and shares"),
      description: tx("O cliente escolhe o bolão e abre o WhatsApp com a mensagem pronta.", "Customers pick a pool and open WhatsApp with the message already written."),
    },
    {
      title: tx("Radar dos bolões", "Pool Radar"),
      description: tx(
        "Lê os bolões do Brasil a cada 10 minutos: quantas cotas têm boa chance de esgotar, a hora de ouro para divulgar e os preços que vendem na cidade.",
        "Reads pools across Brazil every 10 minutes: how many shares are likely to sell out, the golden hour to promote and the prices that sell in town.",
      ),
    },
    {
      title: tx("Foto ou código", "Photo or code"),
      description: tx(
        "A lotérica fotografa o bolão e confere os dados, ou informa o código e os bolões do Marketplace CAIXA entram sozinhos.",
        "The retailer photographs a pool and checks the details, or enters its code and the CAIXA Marketplace pools come in by themselves.",
      ),
    },
    {
      title: tx("Chat com triagem", "Chat with triage"),
      description: tx(
        "Conversas separadas por assunto (bolão, resultado, pagamento) e respostas automáticas para as perguntas de sempre.",
        "Conversations sorted by topic (pool, result, payment) and automatic replies to the usual questions.",
      ),
    },
    {
      title: tx("Divulgação", "Promotion"),
      description: tx(
        "Artes a partir de uma descrição, blog automático, página de links para o Instagram, domínio próprio e visitas dia a dia.",
        "Artwork from a description, an automatic blog, an Instagram link page, a custom domain and daily visits.",
      ),
    },
  ],
  engineering: [
    {
      title: tx("Multi-tenant por subdomínio", "Multi-tenant by subdomain"),
      description: tx(
        "Cada lotérica ganha um endereço como minhaloterica.lotohub.com.br, servido pela mesma aplicação Next.js, com domínio próprio opcional.",
        "Each retailer gets an address like minhaloterica.lotohub.com.br, served by the same Next.js app, with an optional custom domain.",
      ),
    },
    {
      title: tx("Dados oficiais por uma API em Go", "Official data through a Go API"),
      description: tx(
        "Catálogo de bolões, resultados e premiações chegam de uma API própria que sincroniza o Marketplace CAIXA.",
        "The pool catalog, results and prizes come from an in-house API that syncs the CAIXA Marketplace.",
      ),
    },
    {
      title: tx("Conformidade desde o desenho", "Compliance by design"),
      description: tx(
        "O LotoHub não vende apostas nem representa a CAIXA: o site informa e leva o cliente à lotérica, que conclui a venda.",
        "LotoHub does not sell bets or represent CAIXA: the site informs and sends customers to the retailer, who completes the sale.",
      ),
    },
    {
      title: tx("Um plano, sem atrito", "One plan, no friction"),
      description: tx(
        "Plano completo anual em 12x de R$ 97 ou mensal de R$ 147 sem compromisso, cancelado pelo painel.",
        "One complete plan, yearly at 12 × R$ 97 or monthly at R$ 147 with no commitment, cancelled from the dashboard.",
      ),
    },
  ],
  highlights: [
    { value: tx("Prévia grátis", "Free preview"), label: tx("do site pronto, antes de assinar", "of the finished site, before subscribing") },
    { value: "10 min", label: tx("entre cada leitura do Radar nos bolões do Brasil", "between Radar reads of pools across Brazil") },
    { value: "R$ 97", label: tx("por mês no plano anual (R$ 147 no mensal)", "per month, yearly plan (R$ 147 monthly)") },
  ],
  media: capturedMedia("lotohub", "LotoHub", 7616),
}
