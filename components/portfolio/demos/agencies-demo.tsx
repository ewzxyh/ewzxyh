"use client"

import type { Act } from "@/components/stageshow/kit/act"
import { Code } from "@/components/stageshow/kit/code"
import { Count } from "@/components/stageshow/kit/motion/Count"
import { Check } from "@/components/stageshow/kit/parts/Check"
import { Stage } from "@/components/stageshow/kit/stage"
import { Window } from "@/components/stageshow/kit/window"
import { useI18n } from "@/lib/i18n"
import { DEMO_COMPACT, DEMO_WIDE } from "./stage-size"
import "./demos.css"

// LotoHub Agencies: the life of one pool, as the agency page tells it with Loteria Amazonas (UL 003173). The unit is
// checked, the pool detected, its shares followed down to zero and the final capture kept; the same pool streams in
// as JSON from the API. Played once in view.

type S = { step: number; shares: number; lines: number }
const initial: S = { step: 0, shares: 22, lines: 0 }
const poster: S = { step: 4, shares: 0, lines: 8 }

async function script(a: Act<S>) {
  await a.wait(600)
  await a.set({ step: 1, lines: 2 })
  await a.wait(900)
  await a.set({ step: 2, shares: 15, lines: 4 })
  await a.wait(1000)
  await a.set({ step: 3, shares: 12 })
  await a.wait(800)
  await a.set({ shares: 0 })
  await a.wait(900)
  await a.set({ step: 4 })
  for (let lines = 5; lines <= 8; lines++) {
    await a.wait(160)
    await a.set({ lines })
  }
}

const JSON_LINES = [
  "{",
  '  "ul": "003173",',
  '  "modalidade": "Lotofácil",',
  '  "concurso": 3780,',
  '  "cotas_total": 22,',
  '  "cotas_disponiveis": 0,',
  '  "captura_final": true',
  "}",
]

const copy = {
  "pt-BR": {
    title: "UL 003173 · Loteria Amazonas",
    steps: [
      { title: "UL cadastrada", detail: "Conferida no catálogo da CAIXA" },
      { title: "Bolão detectado", detail: "Lotofácil · concurso 3780 · 18 dezenas" },
      { title: "Cotas acompanhadas", detail: "disponíveis" },
      { title: "Captura final", detail: "Guardada com o resultado oficial" },
    ],
  },
  "en-US": {
    title: "UL 003173 · Loteria Amazonas",
    steps: [
      { title: "Unit registered", detail: "Checked against CAIXA's catalog" },
      { title: "Pool detected", detail: "Lotofácil · draw 3780 · 18 numbers" },
      { title: "Shares followed", detail: "available" },
      { title: "Final capture", detail: "Kept with the official result" },
    ],
  },
}

export default function AgenciesDemo() {
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
      className="demo demo-agencies"
    >
      {(s) => (
        <>
          <Window title={t.title} className="dag-window">
            <ol className="dag-steps">
              {t.steps.map((step, index) => {
                const done = s.step > index
                const active = s.step === index + 1
                return (
                  <li key={step.title} className="dag-step" data-done={done || undefined} data-active={active || undefined}>
                    <Check on={done && !(index === 2 && s.shares > 0)} pending={active && index === 2 && s.shares > 0} size={18} />
                    <span className="dag-step__text">
                      <span className="dag-step__title">{step.title}</span>
                      <span className="dag-step__detail">
                        {index === 2 ? (
                          <>
                            <Count value={s.shares} duration={600} /> {step.detail}
                          </>
                        ) : (
                          step.detail
                        )}
                      </span>
                    </span>
                  </li>
                )
              })}
            </ol>
          </Window>

          <div className="dag-code" data-show={s.lines > 0 || undefined}>
            <Code lines={JSON_LINES} count={s.lines} numbers={false} />
          </div>
        </>
      )}
    </Stage>
  )
}
