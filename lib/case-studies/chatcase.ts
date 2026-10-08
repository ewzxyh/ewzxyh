import { capturedMedia, tx } from "./helpers"
import type { CaseStudy } from "./types"

export const chatcase: CaseStudy = {
  slug: "chatcase",
  summary: tx(
    "Site e ferramentas da ChatCase, plataforma de chatbots e automação com IA, parceira da Meta na API oficial do WhatsApp.",
    "Website and tools for ChatCase, an AI chatbot and automation platform and Meta Business Partner on the official WhatsApp API.",
  ),
  seoDescription: tx(
    "Estudo de caso da ChatCase: site em Next.js, geradores de link para WhatsApp e lotéricas, e o CaseZap integrado como canal de WhatsApp.",
    "ChatCase case study: a Next.js website, WhatsApp and lottery link generators, and CaseZap integrated as a WhatsApp channel.",
  ),
  role: tx("Site, ferramentas e integração na Case", "Website, tools and integration at Case"),
  client: "Case Agência Digital",
  status: tx("No ar", "Live"),
  platform: tx("Site + ferramentas web", "Website + web tools"),
  links: [{ label: "chatcase.com.br", url: "https://chatcase.com.br" }],
  stack: ["Next.js", "Tailwind CSS", "Radix UI", "WhatsApp Business API", "Vercel"],
  challenge: [
    tx(
      "A ChatCase vende automação sem código para empresas de todos os tamanhos. O site precisava explicar uma plataforma ampla (canais, bots, IA, e-commerce) e levar ao teste grátis, além de oferecer ferramentas úteis que trouxessem visitantes.",
      "ChatCase sells no-code automation to businesses of every size. The website had to explain a broad platform (channels, bots, AI, e-commerce), lead to the free trial and offer useful tools that bring visitors in.",
    ),
  ],
  solution: [
    tx(
      "Desenvolvi o site em Next.js com uma prévia do painel da plataforma, os selos de parceira da Meta e o caminho para o teste grátis de 14 dias. Junto vieram dois geradores de link: um para o WhatsApp (wa.me) e outro para lotéricas. Também integrei o CaseZap como canal de WhatsApp dentro da plataforma.",
      "I built the website in Next.js with a preview of the platform's dashboard, the Meta partner badges and the path to the 14-day free trial. Alongside it came two link generators, one for WhatsApp (wa.me) and one for lottery retailers. I also integrated CaseZap as a WhatsApp channel inside the platform.",
    ),
  ],
  contributions: [
    tx("Site institucional em Next.js", "Marketing website in Next.js"),
    tx("Prévia do painel na página inicial", "Dashboard preview on the home page"),
    tx("Gerador de links wa.me", "wa.me link generator"),
    tx("Gerador de links para lotéricas", "Link generator for lottery retailers"),
    tx("Integração do CaseZap como canal de WhatsApp", "CaseZap integration as a WhatsApp channel"),
  ],
  features: [
    {
      title: tx("Canais em um painel", "Channels in one dashboard"),
      description: tx(
        "WhatsApp pela API oficial e pelo CaseZap, Instagram, Facebook e SMS.",
        "WhatsApp through the official API and CaseZap, Instagram, Facebook and SMS.",
      ),
    },
    {
      title: tx("Bots e IA", "Bots and AI"),
      description: tx("Automação sem código, com chatbots e IA.", "No-code automation with chatbots and AI."),
    },
    {
      title: tx("Teste grátis", "Free trial"),
      description: tx("14 dias, sem cartão.", "14 days, no card."),
    },
    {
      title: tx("Geradores de link", "Link generators"),
      description: tx(
        "Links de WhatsApp com mensagem pronta e links para lotéricas.",
        "WhatsApp links with a ready message and links for lottery retailers.",
      ),
    },
  ],
  engineering: [
    {
      title: tx("Next.js no Vercel", "Next.js on Vercel"),
      description: tx(
        "Site rápido, com Tailwind CSS e componentes Radix acessíveis.",
        "A fast site with Tailwind CSS and accessible Radix components.",
      ),
    },
    {
      title: tx("Canais integrados", "Integrated channels"),
      description: tx(
        "O CaseZap entra como canal \"CaseZap WA API\" ao lado da API oficial do WhatsApp.",
        "CaseZap joins as the \"CaseZap WA API\" channel next to the official WhatsApp API.",
      ),
    },
  ],
  highlights: [
    { value: tx("14 dias", "14 days"), label: tx("de teste grátis, sem cartão", "free trial, no card") },
    { value: "Meta", label: tx("parceira verificada na API oficial do WhatsApp", "verified partner on the official WhatsApp API") },
  ],
  media: capturedMedia("chatcase", "ChatCase", 6954),
}
