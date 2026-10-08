import { tx } from "./helpers"
import type { CaseStudy } from "./types"

export const casezap: CaseStudy = {
  slug: "casezap",
  summary: tx(
    "Gerenciador de instâncias de WhatsApp para a Case e seus clientes, com painel, métricas, financeiro e automações.",
    "A WhatsApp instance manager for Case and its customers, with a dashboard, analytics, billing and automations.",
  ),
  seoDescription: tx(
    "Estudo de caso do CaseZap: SaaS em Next.js para gerenciar instâncias de WhatsApp, com login por OTP ou PIN, workspaces e integração com a ChatCase.",
    "CaseZap case study: a Next.js SaaS to manage WhatsApp instances, with OTP or PIN sign-in, workspaces and a ChatCase integration.",
  ),
  role: tx("Criação e desenvolvimento na Case", "Created and built at Case"),
  client: "Case Agência Digital",
  status: tx("Em produção · acesso para clientes", "In production · customer access only"),
  platform: tx("SaaS web instalável (PWA)", "Installable web SaaS (PWA)"),
  links: [],
  stack: ["Next.js", "WhatsApp", "PWA", "Vercel"],
  challenge: [
    tx(
      "Operar muitas instâncias de WhatsApp, de clientes diferentes, exige ver em um só lugar quais estão conectadas, quanto cada uma é usada e quanto cada cliente paga.",
      "Running many WhatsApp instances for different customers means seeing in one place which ones are connected, how much each is used and what each customer pays.",
    ),
  ],
  solution: [
    tx(
      "O CaseZap reúne as instâncias em um painel por workspace, com métricas, financeiro e automações, e funciona também como canal de WhatsApp dentro da ChatCase. O acesso é sem senha, por código enviado por e-mail (OTP) ou PIN, e o painel pode ser instalado como aplicativo.",
      "CaseZap gathers the instances in a dashboard per workspace, with analytics, billing and automations, and also works as a WhatsApp channel inside ChatCase. Sign-in is passwordless, with an emailed one-time code (OTP) or a PIN, and the dashboard can be installed as an app.",
    ),
  ],
  contributions: [
    tx("Produto e interface do painel", "Product and dashboard interface"),
    tx("Workspaces e acesso por OTP ou PIN", "Workspaces and OTP or PIN sign-in"),
    tx("Métricas, financeiro e automações", "Analytics, billing and automations"),
    tx("Canal de WhatsApp dentro da ChatCase", "WhatsApp channel inside ChatCase"),
    tx("Aplicativo instalável (PWA)", "Installable app (PWA)"),
  ],
  features: [
    {
      title: tx("Instâncias", "Instances"),
      description: tx("Conexão e status de cada número em um só lugar.", "Connection and status of every number in one place."),
    },
    {
      title: tx("Métricas", "Analytics"),
      description: tx("Uso por instância e por cliente.", "Usage per instance and per customer."),
    },
    {
      title: tx("Financeiro", "Billing"),
      description: tx("Cobrança e controle por cliente.", "Charges and controls per customer."),
    },
    {
      title: tx("Automações", "Automations"),
      description: tx("Fluxos ligados às instâncias.", "Flows attached to the instances."),
    },
    {
      title: tx("Login sem senha", "Passwordless sign-in"),
      description: tx("Código por e-mail ou PIN, dentro do workspace.", "An emailed code or a PIN, inside the workspace."),
    },
  ],
  engineering: [
    {
      title: tx("Next.js instalável", "An installable Next.js app"),
      description: tx(
        "Painel em Next.js no Vercel, que o cliente instala como aplicativo pelo navegador.",
        "A Next.js dashboard on Vercel that customers install as an app from the browser.",
      ),
    },
    {
      title: tx("Multi-tenant por workspace", "Multi-tenant by workspace"),
      description: tx(
        "Cada cliente entra no próprio workspace com o ID e o e-mail de acesso.",
        "Each customer signs in to their own workspace with its ID and their access email.",
      ),
    },
    {
      title: tx("Canal dentro da ChatCase", "A channel inside ChatCase"),
      description: tx(
        "O CaseZap aparece como canal \"CaseZap WA API\" ao lado da API oficial do WhatsApp na plataforma de chatbots.",
        "CaseZap shows up as the \"CaseZap WA API\" channel next to the official WhatsApp API in the chatbot platform.",
      ),
    },
  ],
  media: {
    desktop: {
      src: "/projects/casezap/desktop.webp",
      width: 2880,
      height: 1800,
      alt: tx("Tela de acesso do CaseZap", "CaseZap sign-in screen"),
    },
    mobile: {
      src: "/projects/casezap/mobile.webp",
      width: 780,
      height: 1688,
      alt: tx("Acesso do CaseZap no celular", "CaseZap sign-in on a phone"),
    },
    og: "/projects/casezap/og.jpg",
  },
}
