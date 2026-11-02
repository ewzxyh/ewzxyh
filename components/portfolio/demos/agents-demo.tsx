"use client"

import type { Act } from "@/components/stageshow/kit/act"
import { Bubble, Thread } from "@/components/stageshow/kit/messages"
import { Collapse } from "@/components/stageshow/kit/motion/Collapse"
import { Avatar } from "@/components/stageshow/kit/parts/Avatar"
import { Phone } from "@/components/stageshow/kit/phone"
import { Stage } from "@/components/stageshow/kit/stage"
import { Window } from "@/components/stageshow/kit/window"
import { useI18n } from "@/lib/i18n"
import { DEMO_COMPACT, DEMO_WIDE } from "./stage-size"
import "./demos.css"

// Grapnel for agents: a customer writes to the shop's WhatsApp, the message reaches the agent as a signed webhook,
// the agent answers through the API and the reply lands in the chat. Played once in view; the answer holds.

type S = { step: number }
const initial: S = { step: 0 }
const poster: S = { step: 4 }

async function script(a: Act<S>) {
  await a.wait(600)
  await a.set({ step: 1 }) // the customer's question is sent
  await a.wait(1100)
  await a.set({ step: 2 }) // the event reaches the agent, signature checked
  await a.wait(1100)
  await a.set({ step: 3 }) // the agent calls the API; the shop is typing
  await a.wait(1300)
  await a.set({ step: 4 }) // the reply arrives
}

const copy = {
  "pt-BR": {
    shop: "Loja Aurora",
    online: "online",
    // ai-design-check-ignore-next-line no-exclamation-copy -- a customer's message, not interface copy
    earlier: "Oi! Vocês têm o tênis 42?",
    earlierReply: "Temos sim, nas cores preta e branca.",
    question: "Vocês entregam hoje?",
    reply: "Sim. Pedidos até 16h saem hoje.",
    signed: "assinatura ok",
    term: "agente — node",
  },
  "en-US": {
    shop: "Aurora Store",
    online: "online",
    // ai-design-check-ignore-next-line no-exclamation-copy -- a customer's message, not interface copy
    earlier: "Hi! Do you have the sneakers in 42?",
    earlierReply: "We do, in black and in white.",
    question: "Do you deliver today?",
    reply: "Yes. Orders placed by 4 pm ship today.",
    signed: "signature ok",
    term: "agent — node",
  },
}

export default function AgentsDemo() {
  const { locale } = useI18n()
  const t = copy[locale]

  return (
    <Stage<S>
      width={DEMO_WIDE.width}
      height={DEMO_WIDE.height}
      compact={DEMO_COMPACT}
      initial={initial}
      poster={poster}
      script={script}
      play="once"
      className="demo demo-agents"
    >
      {(s) => (
        <>
          <Phone width={300} className="da-phone">
            <div className="da-head">
              <Avatar name={t.shop} size={30} />
              <span className="da-head__name">{t.shop}</span>
              <span className="da-head__status">{t.online}</span>
            </div>
            <Thread className="da-thread">
              <Bubble from="me">{t.earlier}</Bubble>
              <Bubble from="them">{t.earlierReply}</Bubble>
              {s.step >= 1 && <Bubble from="me">{t.question}</Bubble>}
              {s.step >= 3 && (
                <Bubble from="them" typing={s.step < 4}>
                  {t.reply}
                </Bubble>
              )}
            </Thread>
          </Phone>

          <Window chrome="terminal" title={t.term} className="da-term">
            <div className="ss-term__line dim da-term__host">grapnel.com.br/api/mcp</div>
            <Collapse open={s.step >= 2}>
              <div className="ss-term__line">
                <span className="da-arrow">←</span> webhook message.received
              </div>
              <div className="ss-term__line ok">{t.signed} · HMAC SHA-256</div>
            </Collapse>
            <Collapse open={s.step >= 3}>
              <div className="ss-term__line">
                <span className="da-arrow">→</span> POST /messages/text
              </div>
              <div className="ss-term__line ok">200 · Idempotency-Key</div>
            </Collapse>
          </Window>
        </>
      )}
    </Stage>
  )
}
