import { capturedMedia, tx } from "./helpers"
import type { CaseStudy } from "./types"

export const loteriaCaseshop: CaseStudy = {
  slug: "loteria-caseshop",
  summary: tx(
    "Loja de bolões on-line da lotérica CaseShop, com prêmios e resultados de todas as loterias da CAIXA.",
    "Online lottery pool store for the CaseShop retailer, with jackpots and results for every CAIXA lottery.",
  ),
  seoDescription: tx(
    "Estudo de caso da Loteria CaseShop: loja de bolões em Next.js e Supabase, com verificação de idade, resultados e analytics próprio.",
    "Loteria CaseShop case study: a pool store built with Next.js and Supabase, with age verification, results and self-hosted analytics.",
  ),
  role: tx("Desenvolvimento na Case", "Development at Case"),
  client: "Case",
  status: tx("No ar", "Live"),
  platform: "E-commerce",
  links: [{ label: "caseshop.com.br", url: "https://caseshop.com.br" }],
  stack: ["Next.js", "Supabase", "Tailwind CSS", "Radix UI", "Umami", "Vercel"],
  challenge: [
    tx(
      "Vender bolões on-line exige deixar claro o que está à venda hoje, quanto cada loteria paga e quais foram os últimos resultados, e só para maiores de 18 anos.",
      "Selling pools online means making clear what is on sale today, how much each lottery pays and what the latest results were, and only to adults.",
    ),
  ],
  solution: [
    tx(
      "A loja abre com uma faixa de prêmios de todas as loterias, um carrossel dos concursos em destaque e o caminho direto para comprar cotas, com a central de atendimento no WhatsApp. Resultados de cada modalidade, páginas institucionais e a verificação de idade completam o fluxo, e as métricas ficam em um analytics próprio.",
      "The store opens with a jackpot ticker for every lottery, a carousel of featured draws and a direct path to buying shares, with WhatsApp support. Results for each game, institutional pages and an age gate complete the flow, and analytics run on a self-hosted instance.",
    ),
  ],
  contributions: [
    tx("Loja e catálogo de bolões", "Store and pool catalog"),
    tx("Resultados por modalidade", "Results for each game"),
    tx("Verificação de idade (18+)", "Age verification (18+)"),
    tx("Dados no Supabase", "Data on Supabase"),
    tx("Analytics próprio com Umami", "Self-hosted analytics with Umami"),
  ],
  features: [
    {
      title: tx("Prêmios do dia", "Today's jackpots"),
      description: tx("As estimativas de todas as loterias em uma faixa no topo.", "Every lottery's estimate in a ticker at the top."),
    },
    {
      title: tx("Concursos em destaque", "Featured draws"),
      description: tx("Carrossel com o prêmio, o horário do sorteio e o botão de apostar.", "A carousel with the prize, the draw time and the bet button."),
    },
    {
      title: tx("Cotas limitadas", "Limited shares"),
      description: tx("Bolões CAIXA com cotas por concurso.", "CAIXA pools with shares per draw."),
    },
    {
      title: tx("Resultados", "Results"),
      description: tx("Números sorteados e próximos prêmios de cada modalidade.", "Drawn numbers and the next prize for each game."),
    },
    {
      title: tx("Maiores de 18", "Adults only"),
      description: tx("Verificação de idade antes de mostrar a loja.", "Age verification before the store is shown."),
    },
  ],
  engineering: [
    {
      title: "Next.js + Supabase",
      description: tx("Front-end em Next.js no Vercel com dados no Supabase.", "A Next.js front end on Vercel with data on Supabase."),
    },
    {
      title: tx("Analytics sem terceiros", "First-party analytics"),
      description: tx(
        "Métricas em uma instância própria do Umami, em subdomínio da loja.",
        "Metrics on a self-hosted Umami instance, on a subdomain of the store.",
      ),
    },
  ],
  media: capturedMedia("loteria-caseshop", "Loteria CaseShop", 6967),
}
