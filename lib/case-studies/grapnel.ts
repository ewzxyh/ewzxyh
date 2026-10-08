import { capturedMedia, tx } from "./helpers"
import type { CaseStudy } from "./types"

export const grapnel: CaseStudy = {
  slug: "grapnel",
  summary: tx(
    "SaaS que distribui os contatos das campanhas entre os vendedores no WhatsApp e mostra quais cliques viraram conversa.",
    "A SaaS that spreads campaign contacts across a sales team on WhatsApp and shows which clicks turned into conversations.",
  ),
  seoDescription: tx(
    "Estudo de caso da Grapnel: SaaS de distribuição de contatos e gestão de números de WhatsApp, em Next.js, com Stripe, API e webhooks.",
    "Grapnel case study: a SaaS that distributes contacts and manages WhatsApp numbers, built with Next.js, Stripe, an API and webhooks.",
  ),
  role: tx("Fundador · produto e engenharia", "Founder · product and engineering"),
  client: tx("Produto próprio", "Own product"),
  status: tx("No ar, com cadastro aberto", "Live, open sign-up"),
  platform: tx("SaaS web + API", "Web SaaS + API"),
  links: [{ label: "grapnel.com.br", url: "https://grapnel.com.br" }],
  stack: ["Next.js", "Tailwind CSS", "Radix UI", "Stripe", "WhatsApp", "Webhooks", "Meta Conversions API", "Vercel"],
  challenge: [
    tx(
      "Quem anuncia para vender pelo WhatsApp costuma concentrar todos os contatos em um único número. A equipe se atropela, o cliente espera e ninguém sabe dizer de qual campanha veio cada conversa.",
      "Businesses that sell through WhatsApp ads usually funnel every contact into a single number. The team trips over itself, customers wait, and nobody can tell which campaign each conversation came from.",
    ),
    tx(
      "Os painéis de anúncio mostram cliques, não conversas. E quando um número desconecta do WhatsApp, os contatos param de chegar sem que ninguém perceba.",
      "Ad dashboards show clicks, not conversations. And when a number disconnects from WhatsApp, contacts stop arriving without anyone noticing.",
    ),
  ],
  solution: [
    tx(
      "A Grapnel junta os números da equipe em um único link. Cada clique cai no WhatsApp do próximo vendedor, segundo o rodízio e os pesos configurados, e quem volta é atendido pela mesma pessoa sempre que possível.",
      "Grapnel puts the team's numbers behind a single link. Each click lands on the next salesperson's WhatsApp according to the rotation and weights you set, and returning visitors stay with the same person whenever possible.",
    ),
    tx(
      "O painel liga campanha, clique e conversa, e um e-mail avisa quando um número cai, já com o link para reconectar. Cada vendedor continua atendendo no próprio WhatsApp.",
      "The dashboard connects campaign, click and conversation, and an email reports when a number drops, with the link to reconnect it. Each salesperson keeps answering in their own WhatsApp.",
    ),
  ],
  contributions: [
    tx("Ideia, posicionamento e preço do produto", "Product idea, positioning and pricing"),
    tx("Interface do painel e da landing page", "Dashboard and landing page interface"),
    tx("Distribuição de contatos com rodízio, pesos e número alternativo", "Contact distribution with rotation, weights and a fallback number"),
    tx("Conexão de números por QR Code e alertas de desconexão", "Number connection by QR code and disconnection alerts"),
    tx("Assinaturas recorrentes por número com Stripe", "Recurring per-number billing with Stripe"),
    tx("API, webhooks e integrações de campanha", "API, webhooks and campaign integrations"),
  ],
  features: [
    {
      title: tx("Link da equipe", "Team link"),
      description: tx(
        "Um endereço para anúncios, bio e site; cada contato vai para o vendedor da vez.",
        "One address for ads, bios and websites; each contact goes to whoever is next.",
      ),
    },
    {
      title: tx("Rodízio com pesos", "Weighted rotation"),
      description: tx(
        "Distribuição configurável, vínculo do visitante com o atendente e número alternativo quando ninguém está conectado.",
        "Configurable distribution, visitors kept with the same agent, and a fallback number when nobody is connected.",
      ),
    },
    {
      title: tx("Campanhas e conversas", "Campaigns and conversations"),
      description: tx(
        "Cliques, contatos e conversões em conversa por campanha, com UTMs.",
        "Clicks, contacts and conversation conversions per campaign, with UTMs.",
      ),
    },
    {
      title: tx("Alerta de desconexão", "Disconnection alert"),
      description: tx(
        "E-mail para o dono da conta quando um número cai, com o link para reconectar.",
        "An email to the account owner when a number drops, with the link to reconnect it.",
      ),
    },
    {
      title: tx("Integrações de campanha", "Campaign integrations"),
      description: tx(
        "Meta Pixel, API de Conversões da Meta, Google Ads e atribuição de vendas do WooCommerce.",
        "Meta Pixel, the Meta Conversions API, Google Ads and WooCommerce sales attribution.",
      ),
    },
    {
      title: tx("API e webhooks", "API and webhooks"),
      description: tx(
        "Pedidos, lembretes, cobranças e pós-venda disparados por outros sistemas, nos mesmos números.",
        "Order updates, reminders, billing notices and follow-ups sent by other systems through the same numbers.",
      ),
    },
  ],
  engineering: [
    {
      title: tx("Uma base em Next.js", "One Next.js codebase"),
      description: tx(
        "Landing page, guias e painel no mesmo projeto Next.js (App Router) no Vercel, com Tailwind CSS e componentes Radix.",
        "Landing page, guides and dashboard in the same Next.js (App Router) project on Vercel, with Tailwind CSS and Radix components.",
      ),
    },
    {
      title: tx("Cobrança por conexão", "Per-connection billing"),
      description: tx(
        "Cada número conectado é uma assinatura no Stripe: mensal, com desconto a partir de dois números, ou anual. O cancelamento da renovação é feito pelo próprio cliente.",
        "Each connected number is a Stripe subscription: monthly, discounted from two numbers, or yearly. Customers cancel the renewal themselves.",
      ),
    },
    {
      title: tx("WhatsApp por aparelhos conectados", "WhatsApp through linked devices"),
      description: tx(
        "Os números entram pelo QR Code de \"Aparelhos conectados\", então a equipe não troca de aplicativo.",
        "Numbers join through WhatsApp's linked-devices QR code, so the team does not switch apps.",
      ),
    },
    {
      title: tx("Integração aberta", "Open integration"),
      description: tx(
        "API e webhooks deixam bots e sistemas externos usarem os mesmos números; os fluxos ficam na ferramenta de automação de cada cliente.",
        "An API and webhooks let bots and external systems use the same numbers; the flows live in each customer's own automation tool.",
      ),
    },
  ],
  highlights: [
    { value: tx("1 link", "1 link"), label: tx("para a equipe inteira", "for the whole team") },
    { value: "R$ 4,08", label: tx("por número/mês no plano anual", "per number per month, yearly plan") },
    { value: "3", label: tx("integrações de campanha: Meta Pixel, API de Conversões e Google Ads", "campaign integrations: Meta Pixel, Conversions API and Google Ads") },
  ],
  media: capturedMedia("grapnel", "Grapnel", 7366),
}
