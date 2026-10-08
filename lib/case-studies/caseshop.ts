import { capturedMedia, tx } from "./helpers"
import type { CaseStudy } from "./types"

export const caseshop: CaseStudy = {
  slug: "caseshop",
  summary: tx(
    "Página de vendas da CaseShop, plataforma que transforma o WhatsApp em loja com atendimento por IA.",
    "Sales page for CaseShop, a platform that turns WhatsApp into a store with AI-assisted service.",
  ),
  seoDescription: tx(
    "Estudo de caso da landing page da CaseShop: página em Next.js para uma plataforma de chat commerce no WhatsApp, parceira da Meta.",
    "CaseShop landing page case study: a Next.js page for a WhatsApp chat-commerce platform and Meta Business Partner.",
  ),
  role: tx("Landing page na Case", "Landing page at Case"),
  client: "Case Publicidade e Propaganda",
  period: "2025",
  status: tx("No ar", "Live"),
  platform: "Landing page",
  links: [{ label: "caseshop.vercel.app", url: "https://caseshop.vercel.app" }],
  stack: ["Next.js", "Tailwind CSS", "Radix UI", "Vercel"],
  challenge: [
    tx(
      "Explicar chat commerce para quem nunca vendeu pelo WhatsApp: como uma conversa vira loja, o que a IA faz e por onde começar.",
      "Explaining chat commerce to people who have never sold through WhatsApp: how a conversation becomes a store, what the AI does and where to start.",
    ),
  ],
  solution: [
    tx(
      "A página conta a jornada em quatro passos (conectar o WhatsApp por QR Code, criar a loja, vender 24 horas com IA e acompanhar as métricas), apresenta cada recurso em abas (loja, venda assistida, recuperação de carrinho, campanhas, métricas, fluxos, IA generativa e integrações) e termina nos planos e na área do cliente.",
      "The page tells the journey in four steps (connect WhatsApp by QR code, create the store, sell 24/7 with AI, follow the metrics), presents each feature in tabs (store, assisted sales, cart recovery, campaigns, metrics, flows, generative AI and integrations) and ends with the plans and the customer area.",
    ),
  ],
  contributions: [
    tx("Desenvolvimento da página em Next.js", "Building the page in Next.js"),
    tx("Seções de jornada, recursos, clientes e planos", "Journey, features, customers and plans sections"),
    tx("Navegação por abas entre os recursos", "Tabbed navigation across the features"),
    tx("Versões para celular e computador", "Phone and desktop layouts"),
  ],
  features: [
    {
      title: tx("Jornada em 4 passos", "A 4-step journey"),
      description: tx("Do QR Code ao painel de métricas.", "From the QR code to the metrics dashboard."),
    },
    {
      title: tx("Recursos em abas", "Features in tabs"),
      description: tx("Oito recursos explicados sem uma página longa demais.", "Eight features explained without an endless page."),
    },
    {
      title: tx("Selo da Meta", "Meta badge"),
      description: tx("Parceria com a Meta em destaque logo no topo.", "The Meta partnership right at the top."),
    },
    {
      title: tx("Planos e área do cliente", "Plans and customer area"),
      description: tx("O caminho para assinar e para quem já é cliente.", "The way to subscribe, and in for existing customers."),
    },
  ],
  engineering: [
    {
      title: "Next.js + Radix",
      description: tx(
        "Página em Next.js no Vercel, com abas e menus acessíveis do Radix e estilo em Tailwind CSS.",
        "A Next.js page on Vercel, with accessible Radix tabs and menus, styled with Tailwind CSS.",
      ),
    },
  ],
  media: capturedMedia("caseshop", "CaseShop", 9000),
}
