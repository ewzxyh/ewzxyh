import { capturedMedia, tx } from "./helpers"
import type { CaseStudy } from "./types"

export const casepay: CaseStudy = {
  slug: "casepay",
  summary: tx(
    "PIX, CRM e aviso ao cliente em um só fluxo para lotéricas.",
    "PIX payments, a CRM and customer notices in one flow for lottery retailers.",
  ),
  seoDescription: tx(
    "Estudo de caso da CasePay: plataforma para lotéricas com PIX Copia e Cola, confirmação automática, CRM e notificações, em Next.js.",
    "CasePay case study: a platform for lottery retailers with PIX charges, automatic confirmation, a CRM and notifications, built with Next.js.",
  ),
  role: tx("Cofundador · Lead Engineer", "Co-founder · Lead Engineer"),
  client: tx("Produto próprio, com sócios", "Own product, with partners"),
  period: tx("nov 2025 – atual", "Nov 2025 – present"),
  status: tx("No ar · plano Pro gratuito por enquanto", "Live · Pro plan free for now"),
  platform: tx("Web app + landing page", "Web app + landing page"),
  links: [{ label: "casepay.com.br", url: "https://casepay.com.br" }],
  stack: ["Next.js", "PIX", "React", "Vite", "GSAP", "Laravel (v1)", "Vercel"],
  challenge: [
    tx(
      "Na lotérica, cobrar por PIX ainda significa conferir extrato, procurar quem pagou e avisar o cliente à mão. O histórico de cada cliente fica espalhado entre o WhatsApp, o caderno e a memória da equipe.",
      "At a lottery retailer, taking PIX payments still means checking statements, finding who paid and notifying customers by hand. Each customer's history is scattered across WhatsApp, notebooks and the team's memory.",
    ),
  ],
  solution: [
    tx(
      "A CasePay transforma isso em um fluxo: o atendente gera a cobrança PIX Copia e Cola em segundos, o pagamento é confirmado sozinho, o cliente recebe o aviso e o CRM guarda o histórico. O painel ainda mostra as métricas da operação e as metas de cada atendente.",
      "CasePay turns that into one flow: the agent creates a PIX charge in seconds, payment is confirmed automatically, the customer is notified and the CRM keeps the history. The dashboard also shows operational metrics and each agent's goals.",
    ),
    tx(
      "A primeira versão foi feita em Laravel; a atual foi reescrita em Next.js. Os próximos passos são WhatsApp, SMS, automações multicanal e integrações com LotoHub, ChatCase e DouraSoft.",
      "The first version was built in Laravel; the current one was rewritten in Next.js. Next up: WhatsApp, SMS, multichannel automations and integrations with LotoHub, ChatCase and DouraSoft.",
    ),
  ],
  contributions: [
    tx("Cofundação e decisões de produto", "Co-founding and product decisions"),
    tx("Arquitetura e desenvolvimento das duas versões (Laravel e Next.js)", "Architecture and development of both versions (Laravel and Next.js)"),
    tx("Cobranças PIX com confirmação automática", "PIX charges with automatic confirmation"),
    tx("CRM com histórico por cliente", "CRM with per-customer history"),
    tx("Notificações, métricas e metas da equipe", "Notifications, metrics and team goals"),
    tx("Landing page animada com GSAP", "Landing page animated with GSAP"),
  ],
  features: [
    {
      title: tx("PIX Copia e Cola", "PIX charges"),
      description: tx("Cobrança criada em segundos, com o nome da lotérica no link.", "A PIX Copia e Cola charge in seconds, with the retailer's name on the link."),
    },
    {
      title: tx("Confirmação automática", "Automatic confirmation"),
      description: tx("O pagamento entra no sistema sem conferência manual.", "Payments are confirmed without checking statements."),
    },
    {
      title: tx("Aviso ao cliente", "Customer notices"),
      description: tx("Confirmação por e-mail hoje; WhatsApp e SMS a caminho.", "Email confirmation today; WhatsApp and SMS on the way."),
    },
    {
      title: "CRM",
      description: tx("Contatos, pagamentos e interações em um histórico por cliente.", "Contacts, payments and interactions in one history per customer."),
    },
    {
      title: tx("Equipe", "Team"),
      description: tx("Metas, pontos e desempenho por atendente.", "Goals, points and performance per agent."),
    },
    {
      title: tx("Métricas", "Metrics"),
      description: tx("Indicadores da operação para conduzir o dia.", "Operational indicators to run the day."),
    },
  ],
  engineering: [
    {
      title: tx("De Laravel para Next.js", "From Laravel to Next.js"),
      description: tx(
        "A primeira versão foi construída em Laravel; a atual foi reescrita em Next.js, com o painel em meu.casepay.com.br.",
        "The first version was built in Laravel; the current one was rewritten in Next.js, with the dashboard at meu.casepay.com.br.",
      ),
    },
    {
      title: tx("Um fluxo sem etapas manuais", "A flow with no manual steps"),
      description: tx(
        "Depois que o atendente gera a cobrança, confirmação, aviso e registro no CRM acontecem em sequência, sem nova ação.",
        "Once the agent creates the charge, confirmation, notice and CRM record follow in sequence with no further action.",
      ),
    },
    {
      title: tx("Landing separada do app", "A landing page apart from the app"),
      description: tx(
        "A página de vendas é uma SPA em React feita com Vite e animada com GSAP, independente do painel.",
        "The sales page is a React single-page app built with Vite and animated with GSAP, independent from the dashboard.",
      ),
    },
  ],
  highlights: [
    { value: "R$ 0", label: tx("de taxa por PIX", "fee per PIX") },
    { value: "3", label: tx("etapas automáticas depois de gerar o PIX", "automatic steps after the PIX is created") },
    { value: "2", label: tx("versões do produto: Laravel e Next.js", "product versions: Laravel and Next.js") },
  ],
  media: capturedMedia("casepay", "CasePay", 9000),
}
