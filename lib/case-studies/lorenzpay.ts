import { capturedMedia, tx } from "./helpers"
import type { CaseStudy } from "./types"

export const lorenzpay: CaseStudy = {
  slug: "lorenzpay",
  summary: tx(
    "Landing page da LorenzPay, serviço de recebimento por PIX que assume a defesa contra contestações MED 2.0.",
    "Landing page for LorenzPay, a PIX collection service that takes over the defense against MED 2.0 disputes.",
  ),
  seoDescription: tx(
    "Estudo de caso da LorenzPay: landing page em Next.js para um serviço de PIX com defesa contra o MED 2.0, com fluxo em etapas, FAQ e dados estruturados.",
    "LorenzPay case study: a Next.js landing page for a PIX service with MED 2.0 dispute defense, with a step-by-step flow, FAQ and structured data.",
  ),
  role: tx("Landing page para cliente", "Landing page for a client"),
  client: "LorenzPay",
  status: tx("No ar", "Live"),
  platform: "Landing page",
  links: [{ label: "lorenzpay.vercel.app", url: "https://lorenzpay.vercel.app" }],
  stack: ["Next.js", "Tailwind CSS", "Radix UI", "JSON-LD", "Vercel"],
  challenge: [
    tx(
      "O MED 2.0 permite contestar um PIX e reter o saldo de quem recebeu. Para quem vende, isso é dinheiro parado, alerta de fraude e risco de bloqueio da conta. A LorenzPay precisava explicar um serviço financeiro técnico em poucos segundos e gerar confiança para o primeiro contato.",
      "MED 2.0 lets a PIX payment be disputed and the receiver's balance held. For sellers, that means frozen money, fraud alerts and the risk of a blocked account. LorenzPay needed to explain a technical financial service in seconds and earn trust for the first contact.",
    ),
  ],
  solution: [
    tx(
      "A página parte da dor (contestação aberta, saldo retido, operação travada), mostra o fluxo em três etapas, deixa o preço explícito (6% sobre os valores processados) e responde as dúvidas em um FAQ. Todas as chamadas levam a uma conversa direta pelo WhatsApp.",
      "The page starts from the pain (an open dispute, a held balance, a stalled operation), shows the flow in three steps, makes the price explicit (6% of processed amounts) and answers questions in an FAQ. Every call to action leads to a direct WhatsApp conversation.",
    ),
  ],
  contributions: [
    tx("Estrutura e desenvolvimento da página", "Page structure and development"),
    tx("Fluxo em etapas e carrossel de problemas", "Step-by-step flow and problems carousel"),
    tx("FAQ com dados estruturados (FAQPage)", "FAQ with structured data (FAQPage)"),
    tx("SEO e metadados", "SEO and metadata"),
  ],
  features: [
    {
      title: tx("Fluxo em 3 etapas", "A 3-step flow"),
      description: tx(
        "Receber pela chave PIX da LorenzPay, transação protegida, comprovante pelo WhatsApp.",
        "Receive through LorenzPay's PIX key, a protected transaction, the receipt on WhatsApp.",
      ),
    },
    {
      title: tx("Problemas em carrossel", "Problems carousel"),
      description: tx("Cada consequência do MED em um cartão.", "Each consequence of MED on its own card."),
    },
    {
      title: tx("Preço explícito", "Explicit pricing"),
      description: tx("6% sobre os valores processados, sem letras miúdas.", "6% of processed amounts, no fine print."),
    },
    {
      title: "FAQ",
      description: tx("As dúvidas mais comuns respondidas antes do contato.", "The usual questions answered before contact."),
    },
  ],
  engineering: [
    {
      title: "Next.js + Radix",
      description: tx("Página em Next.js no Vercel, com Tailwind CSS e componentes Radix.", "A Next.js page on Vercel, with Tailwind CSS and Radix components."),
    },
    {
      title: tx("Dados estruturados", "Structured data"),
      description: tx(
        "Oferta e perguntas frequentes descritas em JSON-LD (Offer e FAQPage).",
        "The offer and the FAQ described in JSON-LD (Offer and FAQPage).",
      ),
    },
  ],
  highlights: [
    { value: "3", label: tx("etapas para receber", "steps to get paid") },
    { value: "6%", label: tx("sobre os valores processados", "of processed amounts") },
  ],
  media: capturedMedia("lorenzpay", "LorenzPay", 5378),
}
