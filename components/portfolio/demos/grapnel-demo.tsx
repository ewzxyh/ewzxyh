"use client"

import type { Act } from "@/components/stageshow/kit/act"
import { Collapse } from "@/components/stageshow/kit/motion/Collapse"
import { Count } from "@/components/stageshow/kit/motion/Count"
import { Avatar } from "@/components/stageshow/kit/parts/Avatar"
import { Stage } from "@/components/stageshow/kit/stage"
import { Window } from "@/components/stageshow/kit/window"
import { useI18n } from "@/lib/i18n"
import { DEMO_COMPACT, DEMO_WIDE } from "./stage-size"
import "./demos.css"

// Grapnel: one team link, each new contact goes to whoever is next in the rotation. Three contacts arrive; each one
// lands on the next seller, whose conversations roll up by one while "next" moves down the list. Played once in view.

type S = { step: number }
const initial: S = { step: 0 }
const poster: S = { step: 3 }

const SELLERS = [
  { name: "Ana", weight: 40, base: 12 },
  { name: "Bruno", weight: 30, base: 9 },
  { name: "Carla", weight: 30, base: 7 },
]
// Illustrative contacts, masked as the panel shows them.
const CONTACTS = ["(62) 9····-4821", "(11) 9····-0377", "(21) 9····-6150"]

async function script(a: Act<S>) {
  await a.wait(700)
  for (let step = 1; step <= 3; step++) {
    await a.set({ step })
    await a.wait(1500)
  }
}

const copy = {
  "pt-BR": { title: "Link da equipe", clicks: "cliques hoje", campaign: "Campanha Black Friday", team: "Equipe", conversations: "Conversas", next: "Próximo", recent: "Contatos de agora", now: "agora" },
  "en-US": { title: "Team link", clicks: "clicks today", campaign: "Black Friday campaign", team: "Team", conversations: "Conversations", next: "Next", recent: "Latest contacts", now: "now" },
}

export default function GrapnelDemo() {
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
      accent="#2563eb"
      className="demo demo-grapnel"
    >
      {(s) => (
        <Window title={t.title} className="dg-window">
          <div className="dg-body">
            <div className="dg-link">
              <span className="dg-link__url">grapnel.com.br/l/aurora</span>
              <span className="dg-link__clicks">
                <Count value={128 + s.step} duration={500} />
                <span className="dg-muted">{t.clicks}</span>
              </span>
              <span className="dg-muted">{t.campaign}</span>
            </div>

            <div className="dg-table">
              <div className="dg-row dg-row--head">
                <span className="dg-muted dg-span2">{t.team}</span>
                <span className="dg-muted dg-count">{t.conversations}</span>
              </div>
              {SELLERS.map((seller, index) => {
                const got = s.step > index
                const isNext = s.step % SELLERS.length === index
                return (
                  <div key={seller.name} className="dg-row" data-hit={got || undefined}>
                    <Avatar name={seller.name} size={28} />
                    <span className="dg-row__name">{seller.name}</span>
                    <span className="dg-row__weight" aria-hidden>
                      <span style={{ width: `${seller.weight * 2}%` }} />
                    </span>
                    <span className="dg-row__next" data-on={isNext || undefined}>
                      {t.next}
                    </span>
                    <span className="dg-count">
                      <Count value={seller.base + (got ? 1 : 0)} duration={500} />
                    </span>
                  </div>
                )
              })}
            </div>

            <div className="dg-feed">
              <span className="dg-muted">{t.recent}</span>
              {/* Newest on top: each contact opens its line and pushes the earlier ones down */}
              {[2, 1, 0].map((index) => (
                <Collapse key={index} open={s.step > index} reveal="drop">
                  <div className="dg-feed__row">
                    <span className="dg-feed__phone">{CONTACTS[index]}</span>
                    <span className="dg-feed__to">→ {SELLERS[index].name}</span>
                    <span className="dg-muted">{t.now}</span>
                  </div>
                </Collapse>
              ))}
            </div>
          </div>
        </Window>
      )}
    </Stage>
  )
}
