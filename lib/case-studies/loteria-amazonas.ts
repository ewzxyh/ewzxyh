import { capturedMedia, tx } from "./helpers"
import type { CaseStudy } from "./types"

export const loteriaAmazonas: CaseStudy = {
  slug: "loteria-amazonas",
  summary: tx(
    "E-commerce da lotérica Rainha do Jogo, em Goiânia desde 1989: bolões oficiais da CAIXA com fechamento pelo WhatsApp.",
    "E-commerce for the Rainha do Jogo lottery retailer, in Goiânia since 1989: official CAIXA pools that close on WhatsApp.",
  ),
  seoDescription: tx(
    "Estudo de caso do site da Loteria Amazonas: e-commerce em Next.js com bolões oficiais, fechamento pelo WhatsApp, CMS próprio e Google Ads.",
    "Loteria Amazonas case study: a Next.js e-commerce site with official pools, WhatsApp checkout, a custom CMS and Google Ads.",
  ),
  role: tx("Responsável técnico · site, CMS, automação e Google Ads", "Technical lead · site, CMS, automation and Google Ads"),
  client: "Loteria Amazonas (Rainha do Jogo)",
  period: tx("dez 2024 – atual", "Dec 2024 – present"),
  status: tx("No ar", "Live"),
  platform: tx("E-commerce + conteúdo", "E-commerce + content"),
  links: [{ label: "loteriaamazonas.com.br", url: "https://loteriaamazonas.com.br" }],
  stack: ["Next.js", "Tailwind CSS", "Radix UI", "WhatsApp", "Google Ads", "Vercel"],
  challenge: [
    tx(
      "Uma lotérica tradicional de Goiânia, com clientes de muitos anos, queria vender bolões para quem não pode ir até a loja, sem obrigar ninguém a criar conta e sem cobrar mais caro por isso. Anunciar loterias no Google também exige uma certificação específica.",
      "A traditional lottery retailer in Goiânia, with long-time customers, wanted to sell pools to people who cannot come to the store, without forcing anyone to create an account or charging more for it. Advertising lotteries on Google also requires a specific certification.",
    ),
  ],
  solution: [
    tx(
      "O site mostra os bolões oficiais disponíveis e leva o cliente a fechar a compra pelo WhatsApp com a equipe, pagando por Pix ou cartão. O comprovante sai com nome e CPF, por foto no WhatsApp ou o original pelos Correios.",
      "The site lists the official pools available and takes customers to close the purchase on WhatsApp with the team, paying by Pix or card. The receipt carries the customer's name and tax ID, sent as a photo on WhatsApp or as the original by mail.",
    ),
    tx(
      "Um CMS próprio mantém bolões e conteúdo atualizados, o atendimento no WhatsApp tem automação, e as campanhas rodam no Google Ads com a certificação de jogos de azar.",
      "A custom CMS keeps pools and content current, WhatsApp support is automated, and campaigns run on Google Ads under the gambling certification.",
    ),
  ],
  contributions: [
    tx("Site em Next.js e CMS próprio", "Next.js site and custom CMS"),
    tx("Vitrine de bolões com fechamento pelo WhatsApp", "Pool storefront with WhatsApp checkout"),
    tx("Automação do atendimento", "Customer service automation"),
    tx("Páginas de conteúdo, licenças e transparência", "Content, license and transparency pages"),
    tx("Google Ads com a certificação de jogos de azar", "Google Ads under the gambling certification"),
  ],
  features: [
    {
      title: tx("Bolões oficiais", "Official pools"),
      description: tx("Cotas limitadas por concurso, escolhidas no site.", "Limited shares per draw, picked on the site."),
    },
    {
      title: tx("Compra pelo WhatsApp", "WhatsApp checkout"),
      description: tx("Sem cadastro: o cliente fecha com a equipe e paga por Pix ou cartão.", "No account: customers close with the team and pay by Pix or card."),
    },
    {
      title: tx("Comprovante com CPF", "Receipt with tax ID"),
      description: tx("Foto pelo WhatsApp ou o original pelos Correios.", "A photo on WhatsApp or the original by mail."),
    },
    {
      title: tx("Prêmios do dia", "Today's jackpots"),
      description: tx("Faixa com as estimativas de todas as loterias da CAIXA.", "A ticker with the estimates for every CAIXA lottery."),
    },
    {
      title: tx("Confiança", "Trust"),
      description: tx(
        "Palpites, avaliações do Google, licenças, transparência e jogo responsável.",
        "Tips, Google reviews, licenses, transparency and responsible gaming pages.",
      ),
    },
  ],
  engineering: [
    {
      title: tx("Next.js no Vercel", "Next.js on Vercel"),
      description: tx("Páginas rápidas, com Tailwind CSS e componentes Radix.", "Fast pages with Tailwind CSS and Radix components."),
    },
    {
      title: tx("CMS próprio", "Custom CMS"),
      description: tx(
        "A equipe da lotérica atualiza bolões e conteúdo sem depender de desenvolvedor.",
        "The retailer's team updates pools and content without a developer.",
      ),
    },
    {
      title: tx("Dados estruturados", "Structured data"),
      description: tx(
        "Empresa, CNPJ e unidade lotérica descritos em JSON-LD para os buscadores.",
        "Company, tax ID and lottery unit described in JSON-LD for search engines.",
      ),
    },
  ],
  highlights: [
    { value: tx("Desde 1989", "Since 1989"), label: tx("como lotérica CAIXA", "as a CAIXA lottery retailer") },
    { value: tx("Sem cadastro", "No account"), label: tx("e pelo mesmo preço da lotérica", "and the same price as in store") },
  ],
  media: capturedMedia("loteria-amazonas", "Loteria Amazonas", 6621),
}
