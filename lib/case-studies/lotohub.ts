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
      "Os bolões entram por uma foto ou, para quem usa o Marketplace CAIXA, direto pelo código da lotérica, por uma API própria em Go. O plano inclui artes para divulgar, página de links para o Instagram, domínio próprio e contagem de visitas.",
      "Pools come in from a photo or, for retailers on the CAIXA Marketplace, straight from the retailer code through an in-house Go API. The plan includes promo artwork, an Instagram link page, a custom domain and visit counts.",
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
      title: tx("Resultados automáticos", "Automatic results"),
      description: tx("Os resultados das loterias aparecem sozinhos no site.", "Lottery results show up on the site by themselves."),
    },
    {
      title: tx("Bolão por foto", "Pools from a photo"),
      description: tx("A lotérica fotografa o bolão e confere os dados antes de publicar.", "The retailer photographs a pool and checks the details before publishing."),
    },
    {
      title: tx("Marketplace CAIXA", "CAIXA Marketplace"),
      description: tx("Com o código da lotérica, os bolões oficiais entram sozinhos.", "With the retailer code, the official pools come in automatically."),
    },
    {
      title: tx("Divulgação", "Promotion"),
      description: tx(
        "Artes dos bolões sem designer, página de links para o Instagram, domínio próprio e contagem de visitas.",
        "Pool artwork without a designer, an Instagram link page, a custom domain and visit counts.",
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
        "Plano completo mensal ou anual, cancelado pelo painel, com acesso até o fim do período pago.",
        "One complete plan, monthly or yearly, cancelled from the dashboard with access until the end of the paid period.",
      ),
    },
  ],
  highlights: [
    { value: tx("Prévia grátis", "Free preview"), label: tx("do site pronto, antes de assinar", "of the finished site, before subscribing") },
    { value: "R$ 97", label: tx("por mês no plano anual", "per month, yearly plan") },
    { value: tx("Foto ou código", "Photo or code"), label: tx("os dois jeitos de publicar bolões", "the two ways to publish pools") },
  ],
  media: capturedMedia("lotohub", "LotoHub", 6608),
}
