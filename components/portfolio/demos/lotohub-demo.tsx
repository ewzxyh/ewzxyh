"use client"

import type { Act } from "@/components/stageshow/kit/act"
import { Phone } from "@/components/stageshow/kit/phone"
import { Stage } from "@/components/stageshow/kit/stage"
import { ChecksIcon, WhatsappIcon } from "@/components/ui/icons"
import { useI18n } from "@/lib/i18n"
import { DEMO_COMPACT, DEMO_WIDE } from "./stage-size"
import "./demos.css"

// LotoHub: the lottery shop's site on a customer's phone. The customer taps the pool's button and the message
// arrives in the shop's WhatsApp already written; the sale stays with the shop. Played once in view.

type S = { sent: boolean }
const initial: S = { sent: false }
const poster: S = { sent: true }

async function script(a: Act<S>) {
  await a.wait(800)
  await a.click("join")
  await a.wait(200)
  await a.set({ sent: true })
}

const BALLS = ["06", "17", "28", "33", "41", "52"]

const copy = {
  "pt-BR": {
    address: "Av. Paulista, 1000 · São Paulo",
    lastResult: "Último resultado · Mega-Sena",
    left: "Apenas 3 vagas restantes",
    leftOther: "Apenas 8 vagas restantes",
    join: "Quero participar",
    // ai-design-check-ignore-next-line no-exclamation-copy -- the message LotoHub writes for the customer, quoted as the product sends it
    message: "Olá! Quero participar do bolão Mega-Sena, com 1 cota de R$ 25,00.",
  },
  "en-US": {
    address: "Av. Paulista, 1000 · São Paulo",
    lastResult: "Latest result · Mega-Sena",
    left: "Only 3 shares left",
    leftOther: "Only 8 shares left",
    join: "I want in",
    // ai-design-check-ignore-next-line no-exclamation-copy -- the message LotoHub writes for the customer, quoted as the product sends it
    message: "Hi! I'd like to join the Mega-Sena pool, with 1 share at R$ 25.00.",
  },
}

export default function LotohubDemo() {
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
      cursor={{ at: { wide: { x: 520, y: 520 }, compact: { x: 300, y: 430 } }, style: "touch" }}
      className="demo demo-lotohub"
    >
      {(s) => (
        <>
          <Phone width={300} className="dl-phone">
            <div className="dl-site">
              <div className="dl-head">
                <span className="dl-mark">LH</span>
                <span className="dl-head__text">
                  <span className="dl-strong">Loteria Lotohub</span>
                  <span className="dl-muted">{t.address}</span>
                </span>
              </div>

              <div className="dl-card">
                <span className="dl-muted">{t.lastResult}</span>
                <span className="dl-balls">
                  {BALLS.map((ball) => (
                    <span key={ball} className="dl-ball">
                      {ball}
                    </span>
                  ))}
                </span>
              </div>

              <div className="dl-card">
                <span className="dl-pool">
                  <span className="dl-strong">Mega-Sena</span>
                  <span className="dl-strong">R$ 25,00</span>
                </span>
                <span className="dl-left">{t.left}</span>
                <span className="dl-join" data-target="join" data-cursor="pointer">
                  <WhatsappIcon aria-hidden="true" className="dl-icon" />
                  {t.join}
                </span>
              </div>

              <div className="dl-card">
                <span className="dl-pool">
                  <span className="dl-strong">Lotofácil</span>
                  <span className="dl-strong">R$ 15,00</span>
                </span>
                <span className="dl-left dl-left--quiet">{t.leftOther}</span>
                <span className="dl-join dl-join--quiet">
                  <WhatsappIcon aria-hidden="true" className="dl-icon" />
                  {t.join}
                </span>
              </div>
            </div>
          </Phone>

          {/* What the shop receives, as WhatsApp draws it, straddling the phone's edge */}
          <div className="dl-message" data-show={s.sent || undefined}>
            <span className="dl-message__text">{t.message}</span>
            <span className="dl-message__meta">
              09:41
              <ChecksIcon aria-hidden="true" className="dl-message__read" />
            </span>
          </div>
        </>
      )}
    </Stage>
  )
}
