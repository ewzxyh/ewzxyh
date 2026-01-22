# Roadmap: FluidBackground

## Overview

Este roadmap transforma os 31 requisitos v1 em 4 fases que entregam um background fluido organico no estilo landonorris.com. A progressao estabelece fundacao solida de componente (lifecycle, SSR, cleanup), depois implementa shader core com domain warping e layers, adiciona isolinhas e interatividade, e finaliza com otimizacao de performance e acessibilidade. Cada fase entrega capacidade verificavel e desbloqueia a proxima.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3, 4): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

- [x] **Phase 1: Component Foundation** - Componente SSR-safe com lifecycle correto, shader passthrough, e integracao na pagina
- [x] **Phase 2: Core Shader** - Domain warping com isolinhas topograficas no estilo landonorris.com
- [x] **Phase 3: Isolines & Interactivity** - Isolinhas topograficas com antialiasing e mouse tracking sutil
- [ ] **Phase 4: Performance & Accessibility** - 60fps em devices mid-range, reduced-motion, mobile fallback

## Phase Details

### Phase 1: Component Foundation
**Goal**: Componente FluidBackground funcional com lifecycle correto, SSR-safe, cleanup adequado, e integrado na pagina substituindo Lava Lamp Demo
**Depends on**: Nothing (first phase)
**Requirements**: SHDR-01, SHDR-03, SHDR-04, VISL-01, VISL-03, PERF-02, PERF-03, LIFE-01, LIFE-02, LIFE-04, INTG-01, INTG-02, INTG-03
**Success Criteria** (what must be TRUE):
  1. Componente renderiza canvas WebGL sem erros de hidratacao SSR
  2. Background exibe shader animado (noise basico) com paleta low-contrast (#F5F5F0, #E5E5DC, #D8D8D0)
  3. Resize da janela atualiza canvas sem flicker ou distorcao de aspect ratio
  4. Navegacao para outra pagina e volta nao causa memory leak (dispose chamado)
  5. Componente esta posicionado na secao demo substituindo LavaLamp
**Plans**: 2 plans

Plans:
- [x] 01-01-PLAN.md - Create FluidBackground component with 3D simplex noise shader
- [x] 01-02-PLAN.md - Integrate FluidBackground into page replacing LavaLamp

### Phase 2: Core Shader
**Goal**: Shader com domain warping criando 3 layers de blobs organicos com escalas, velocidades e opacidades distintas
**Depends on**: Phase 1
**Requirements**: SHDR-02, LAYR-01, LAYR-02, LAYR-03, LAYR-05, VISL-02
**Success Criteria** (what must be TRUE):
  1. Blobs grandes se movem lentamente no fundo (layer 1 visivel com opacidade 0.4)
  2. Blobs medios se movem em velocidade media na camada intermediaria (layer 2)
  3. Blobs pequenos se movem mais rapido na frente (layer 3)
  4. Cada layer exibe padrao unico (nao sao copias deslocadas)
  5. Blobs sao sutis com contraste <30% contra background
**Plans**: 1 plan

Plans:
- [x] 02-01-PLAN.md - Domain warping with topographic isolines

### Phase 3: Isolines & Interactivity
**Goal**: Isolinhas topograficas com anti-aliasing sobrepostas aos blobs, e mouse tracking sutil que distorce levemente o campo
**Depends on**: Phase 2
**Requirements**: LAYR-04, ISOL-01, ISOL-02, ISOL-03, INTR-01, INTR-02, INTR-03
**Success Criteria** (what must be TRUE):
  1. Linhas de contorno topografico visiveis sobre os blobs (8 linhas)
  2. Linhas tem bordas suaves sem aliasing visivel (smoothstep + fwidth)
  3. Movimento do mouse distorce sutilmente os blobs (2-5% de influencia)
  4. Mouse tracking e suave sem jitter (lerp/easing aplicado)
  5. Performance de mouse events nao degrada animacao (throttle 16ms)
**Plans**: 2 plans

Plans:
- [x] 03-01-PLAN.md - Add mouse tracking infrastructure with lerped uniforms
- [x] 03-02-PLAN.md - Expand isolines to 8 and add mouse distortion

### Phase 4: Performance & Accessibility
**Goal**: 60fps consistente em devices mid-range, reduced-motion respeitado, e fallback mobile funcional
**Depends on**: Phase 3
**Requirements**: PERF-01, PERF-04, A11Y-01, A11Y-02, LIFE-03
**Success Criteria** (what must be TRUE):
  1. Animacao roda a 60fps em laptop com GPU integrada Intel/AMD
  2. Animacao roda a 60fps em smartphone Android mid-range
  3. Usuario com prefers-reduced-motion ativo ve versao estatica ou simplificada
  4. WebGL context loss e recuperado automaticamente (canvas nao fica preto)
  5. Displays high-DPI nao degradam performance (resolution scaling aplicado)
**Plans**: 2 plans

Plans:
- [ ] 04-01-PLAN.md - Reduced-motion detection with static fallback
- [ ] 04-02-PLAN.md - Context loss handling and adaptive resolution

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Component Foundation | 2/2 | Complete | 2026-01-22 |
| 2. Core Shader | 1/1 | Complete | 2026-01-22 |
| 3. Isolines & Interactivity | 2/2 | Complete | 2026-01-22 |
| 4. Performance & Accessibility | 0/2 | Planning complete | - |

---
*Roadmap created: 2026-01-22*
*Total v1 requirements: 31*
*Coverage: 31/31 (100%)*
