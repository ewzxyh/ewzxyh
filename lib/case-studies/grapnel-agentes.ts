import { capturedMedia, tx } from "./helpers"
import type { CaseStudy } from "./types"

// Grapnel for AI agents, at bot.grapnel.com.br. Everything below is printed on that page, its FAQ or Grapnel's
// llms.txt and API docs (checked on 2026-11-01).
export const grapnelAgentes: CaseStudy = {
  slug: "grapnel-agentes",
  summary: tx(
    "Produto que conecta um número de WhatsApp a um agente de IA por QR Code: o agente lê conversas e grupos e responde por MCP ou API, com chaves de permissões limitadas e cobrança por número.",
    "A product that connects a WhatsApp number to an AI agent by QR code: the agent reads chats and groups and replies over MCP or an API, with scoped keys and billing per number.",
  ),
  seoDescription: tx(
    "Estudo de caso da Grapnel para agentes: WhatsApp para agentes de IA por MCP e API, com webhooks assinados, idempotência e chaves com permissões.",
    "Grapnel for agents case study: WhatsApp for AI agents over MCP and an API, with signed webhooks, idempotency and scoped keys.",
  ),
  role: tx("Fundador · produto e engenharia", "Founder · product and engineering"),
  client: tx("Produto próprio", "Own product"),
  status: tx("No ar, com cadastro aberto", "Live, open sign-up"),
  platform: tx("API, servidor MCP e webhooks", "API, MCP server and webhooks"),
  links: [
    { label: "bot.grapnel.com.br", url: "https://bot.grapnel.com.br" },
    { label: tx("Documentação da API", "API docs"), url: "https://grapnel.com.br/docs" },
  ],
  stack: ["Next.js", "MCP", "API REST", "OpenAPI", "Webhooks", "Stripe", "WhatsApp"],
  challenge: [
    tx(
      "Agentes de IA já escrevem, resumem e decidem, mas ficam de fora do WhatsApp, onde estão os clientes e os grupos de trabalho. Ligar um agente ao número que a empresa já usa costuma exigir infraestrutura própria e cuidado com o que ele pode fazer.",
      "AI agents can already write, summarize and decide, but they are left out of WhatsApp, where customers and work groups are. Connecting an agent to the number a business already uses usually means running your own infrastructure and worrying about what the agent is allowed to do.",
    ),
    tx(
      "E o agente precisa saber quando chega mensagem nova sem perder eventos quando o servidor dele cai, e sem mandar a mesma mensagem duas vezes quando repete uma chamada.",
      "And the agent needs to hear about new messages without losing events when its server is down, and without sending the same message twice when it retries a call.",
    ),
  ],
  solution: [
    tx(
      "A Grapnel para agentes conecta o número pelo QR Code de Aparelhos conectados e entrega ao agente uma chave de API com permissões e validade de 1 a 365 dias, revogável a qualquer momento. Com ela, o agente usa o servidor MCP ou a API HTTP para ler conversas e grupos, responder e enviar PDF, áudio e localização.",
      "Grapnel for agents connects the number through WhatsApp's linked-devices QR code and gives the agent an API key with permissions and a validity of 1 to 365 days, revocable at any time. With it, the agent uses the MCP server or the HTTP API to read chats and groups, reply and send PDFs, audio and locations.",
    ),
    tx(
      "Cada mensagem nova vira um evento assinado com HMAC SHA-256 no servidor do agente; se ele cair, a Grapnel tenta de novo até 8 vezes em 24 horas, e o histórico fica na API por 7 dias. O preço é por número conectado, não por mensagem: R$ 9,90 por mês, R$ 7,00 a partir de dois números, ou R$ 49,00 por ano.",
      "Every new message becomes an event signed with HMAC SHA-256 on the agent's server; if it is down, Grapnel retries up to 8 times in 24 hours, and the history stays in the API for 7 days. Pricing is per connected number, not per message: R$ 9.90 a month, R$ 7.00 from two numbers, or R$ 49.00 a year.",
    ),
  ],
  contributions: [
    tx("Produto, posicionamento e preço para agentes de IA", "Product, positioning and pricing for AI agents"),
    tx("Servidor MCP e API HTTP sobre a mesma API da Grapnel", "MCP server and HTTP API on the same Grapnel API"),
    tx("Chaves com permissões, validade e revogação", "Keys with permissions, expiry and revocation"),
    tx("Webhooks assinados, com reenvio e histórico para recuperar eventos", "Signed webhooks, with retries and history to recover events"),
    tx("Landing page com o fluxo do WhatsApp ao agente demonstrado", "Landing page demonstrating the flow from WhatsApp to the agent"),
  ],
  features: [
    {
      title: tx("Conversas e grupos", "Chats and groups"),
      description: tx(
        "O agente lê conversas individuais e grupos e resume o dia. Ler conversas individuais pede a permissão chats:read.",
        "The agent reads one-to-one chats and groups and sums up the day. Reading one-to-one chats needs the chats:read permission.",
      ),
    },
    {
      title: tx("Texto, PDF, áudio e localização", "Text, PDFs, audio and locations"),
      description: tx(
        "Respostas, arquivos, áudios e endereços enviados pelo número que a empresa já usa.",
        "Replies, files, voice notes and addresses sent from the number the business already uses.",
      ),
    },
    {
      title: tx("Chaves com permissões", "Scoped keys"),
      description: tx(
        "Cada chave só faz o que as permissões deixam, vale de 1 a 365 dias e para de funcionar ao ser revogada.",
        "Each key only does what its permissions allow, lasts 1 to 365 days and stops working once revoked.",
      ),
    },
    {
      title: tx("Webhooks assinados", "Signed webhooks"),
      description: tx(
        "Mensagem nova vira evento no servidor do agente, assinado com HMAC SHA-256 e reenviado se ele cair.",
        "A new message becomes an event on the agent's server, signed with HMAC SHA-256 and retried if it is down.",
      ),
    },
    {
      title: tx("Sem mensagem duplicada", "No duplicate messages"),
      description: tx(
        "Com a mesma Idempotency-Key, uma chamada repetida não envia a mensagem de novo.",
        "With the same Idempotency-Key, a retried call does not send the message again.",
      ),
    },
    {
      title: tx("Aviso de desconexão", "Disconnection alert"),
      description: tx(
        "Se o número cair, o dono da conta recebe um e-mail com o caminho para reconectar.",
        "If the number drops, the account owner gets an email with the way to reconnect it.",
      ),
    },
  ],
  engineering: [
    {
      title: tx("MCP e API com a mesma chave", "MCP and API with one key"),
      description: tx(
        "O servidor MCP (Streamable HTTP) e a API REST aceitam a mesma chave Bearer: qualquer cliente MCP, ou qualquer agente que chame HTTP, fala pelo mesmo número.",
        "The MCP server (Streamable HTTP) and the REST API take the same Bearer key: any MCP client, or any agent that calls HTTP, talks through the same number.",
      ),
    },
    {
      title: tx("Eventos que não se perdem", "Events that are not lost"),
      description: tx(
        "Webhooks assinados com o segredo do cliente e reenviados com espera crescente em erros 5xx, 408 e 429: até 8 tentativas em 24 horas, com 7 dias de histórico na API.",
        "Webhooks signed with the customer's secret and retried with growing backoff on 5xx, 408 and 429 errors: up to 8 attempts in 24 hours, with 7 days of history in the API.",
      ),
    },
    {
      title: tx("Idempotência nos envios", "Idempotent sends"),
      description: tx(
        "Envios aceitam Idempotency-Key, então um agente que repete a chamada depois de uma falha não duplica a mensagem.",
        "Sends accept an Idempotency-Key, so an agent that retries after a failure does not duplicate the message.",
      ),
    },
    {
      title: tx("Limites claros", "Clear limits"),
      description: tx(
        "60 requisições por minuto por conta e chaves com permissões mínimas, para o agente falar só com quem espera a mensagem.",
        "60 requests per minute per account and least-privilege keys, so the agent only talks to people who expect it.",
      ),
    },
  ],
  highlights: [
    { value: "R$ 9,90", label: tx("por número/mês, sem cobrança por mensagem", "per number per month, no per-message fees") },
    { value: tx("8 reenvios", "8 retries"), label: tx("de cada evento em 24 horas se o servidor do agente cair", "of each event within 24 hours if the agent's server is down") },
    { value: tx("7 dias", "7 days"), label: tx("de histórico na API para recuperar o que ficou para trás", "of history in the API to catch up on missed messages") },
  ],
  media: capturedMedia("grapnel-agentes", "Grapnel para agentes", 7167),
}
