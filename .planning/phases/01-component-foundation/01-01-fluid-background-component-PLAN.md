---
phase: 01-component-foundation
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - components/portfolio/fluid-background.tsx
autonomous: true

must_haves:
  truths:
    - "Canvas WebGL renderiza sem erros de hidratacao SSR"
    - "Shader exibe animacao de noise 3D com paleta low-contrast"
    - "Animacao e frame-rate independent (usa deltaTime/elapsed time)"
    - "Resize da janela atualiza canvas sem flicker"
    - "Navegacao para outra pagina nao causa memory leak"
  artifacts:
    - path: "components/portfolio/fluid-background.tsx"
      provides: "Componente FluidBackground com shader 3D noise"
      min_lines: 150
      contains:
        - "use client"
        - "snoise"
        - "uResolution"
        - "uTime"
        - "requestAnimationFrame"
        - "dispose"
  key_links:
    - from: "components/portfolio/fluid-background.tsx"
      to: "three"
      via: "import * as THREE"
      pattern: "import.*THREE.*from.*three"
    - from: "useEffect cleanup"
      to: "Three.js objects"
      via: "dispose calls"
      pattern: "renderer\\.dispose|geometry\\.dispose|material\\.dispose"
---

<objective>
Criar o componente FluidBackground com shader 3D simplex noise, lifecycle correto, e cleanup adequado.

Purpose: Estabelecer a fundacao do componente WebGL com todos os patterns corretos (SSR-safe, cleanup, resize, animation loop)
Output: Arquivo fluid-background.tsx funcional que pode ser importado e usado na pagina
</objective>

<execution_context>
@~/.claude/get-shit-done/workflows/execute-plan.md
@~/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/phases/01-component-foundation/01-RESEARCH.md

# Reference pattern - follow this structure exactly
@components/portfolio/lava-lamp.tsx
</context>

<tasks>

<task type="auto">
  <name>Task 1: Create FluidBackground component with 3D simplex noise shader</name>
  <files>components/portfolio/fluid-background.tsx</files>
  <action>
Criar componente FluidBackground seguindo EXATAMENTE o pattern de lava-lamp.tsx, com as seguintes modificacoes:

1. DIRETIVA: "use client" na primeira linha

2. VERTEX SHADER: Copiar exatamente de lava-lamp.tsx (passthrough)

3. FRAGMENT SHADER: Implementar 3D simplex noise
   - Usar implementacao completa do stegu/webgl-noise (ver 01-RESEARCH.md linhas 158-235)
   - Uniforms: uTime (float), uResolution (vec2)
   - Calcular aspect ratio: `float aspect = uResolution.x / uResolution.y`
   - UV correction: `vec2 uvAspect = vec2(uv.x * aspect, uv.y)`
   - Noise sampling: `snoise(vec3(uvAspect * 2.0, uTime * 0.1))` - usar time como Z para morphing
   - Cores (VISL-01):
     - bgColor: vec3(0.96, 0.96, 0.94) // #F5F5F0
     - blobColor: vec3(0.90, 0.90, 0.86) // #E5E5DC
   - Color mixing (VISL-03): `mix(bgColor, blobColor, smoothstep(0.4, 0.6, noise))`

4. INTERFACE: `FluidBackgroundProps { className?: string }`

5. COMPONENT BODY:
   - containerRef = useRef<HTMLDivElement>(null)
   - useEffect com array de dependencias vazio []
   - Dentro do useEffect:
     a. Guard: if (!container) return
     b. Renderer setup: WebGLRenderer({ antialias: true, alpha: true })
     c. Append canvas, set styles (position absolute, inset 0, 100% width/height)
     d. setPixelRatio: Math.min(window.devicePixelRatio || 1, 2)
     e. Scene: new THREE.Scene()
     f. Camera: OrthographicCamera(-1, 1, 1, -1, 0, 1)
     g. Geometry: PlaneGeometry(2, 2)
     h. Uniforms object: { uTime: {value: 0}, uResolution: {value: new THREE.Vector2(1, 1)} }
     i. Material: ShaderMaterial with uniforms, vertexShader, fragmentShader
     j. Mesh: add to scene

6. RESIZE HANDLER (LIFE-04):
   - Funcao resize() que obtem getBoundingClientRect()
   - Guard para width/height === 0
   - renderer.setSize(width, height, false)
   - uniforms.uResolution.value.set(width, height)
   - Chamar resize() inicialmente
   - window.addEventListener("resize", resize)

7. ANIMATION LOOP (PERF-03, SHDR-03):
   - const startTime = performance.now()
   - funcao animate() que:
     - Calcula uniforms.uTime.value = (performance.now() - startTime) * 0.001
     - Chama renderer.render(scene, camera)
     - animationId = requestAnimationFrame(animate)
   - Chamar animate() para iniciar

8. CLEANUP (LIFE-02):
   - return () => { ... } no useEffect
   - Ordem EXATA:
     1. cancelAnimationFrame(animationId)
     2. window.removeEventListener("resize", resize)
     3. renderer.dispose()
     4. geometry.dispose()
     5. material.dispose()
     6. if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement)

9. JSX RETURN:
   - div com ref={containerRef}
   - className com overflow-hidden e prop className
   - style com isolation: "isolate" e contain: "layout style paint"

IMPORTANTE: NAO incluir mouse interaction neste componente (sera adicionado na Phase 3).
Manter simplicidade - apenas o necessario para Phase 1.
  </action>
  <verify>
Verificacoes:
1. Arquivo existe: `ls components/portfolio/fluid-background.tsx`
2. Tem "use client": `head -1 components/portfolio/fluid-background.tsx`
3. Tem 3D snoise: `grep -c "snoise(vec3" components/portfolio/fluid-background.tsx` (deve retornar 1+)
4. Tem cleanup: `grep -c "dispose" components/portfolio/fluid-background.tsx` (deve retornar 3+)
5. Tem resize handler: `grep -c "addEventListener.*resize" components/portfolio/fluid-background.tsx` (deve retornar 1)
6. Sem erros TypeScript: `bunx tsc --noEmit 2>&1 | grep fluid-background || echo "No TS errors"`
  </verify>
  <done>
Componente fluid-background.tsx criado com:
- 3D simplex noise shader com paleta low-contrast
- SSR-safe via "use client"
- Cleanup completo no unmount
- Resize handler atualizando uResolution
- Animation loop com requestAnimationFrame
  </done>
</task>

<task type="auto">
  <name>Task 2: Verify component renders correctly in isolation</name>
  <files>components/portfolio/fluid-background.tsx</files>
  <action>
Verificar que o componente pode ser importado sem erros:

1. Criar arquivo de teste temporario para validar import:
   - Nao e necessario - bunx tsc --noEmit ja valida imports

2. Verificar que o servidor de dev nao quebra:
   - Usar curl ou similar para verificar que localhost:3000 ainda responde
   - Se houver erros de hidratacao, aparecerao no console do browser

3. Verificar estrutura do arquivo:
   - Linha 1: "use client"
   - Imports de react e three
   - vertexShader const
   - fragmentShader const com snoise(vec3...)
   - Interface FluidBackgroundProps
   - export function FluidBackground
   - useEffect com cleanup
   - JSX com div ref

Se alguma verificacao falhar, corrigir o componente antes de prosseguir.
  </action>
  <verify>
1. TypeScript compila: `bunx tsc --noEmit` sem erros relacionados ao componente
2. Dev server ok: `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000` retorna 200
3. Arquivo tem export: `grep -c "export function FluidBackground" components/portfolio/fluid-background.tsx` retorna 1
  </verify>
  <done>
Componente valido - TypeScript compila, pode ser importado, estrutura correta.
  </done>
</task>

</tasks>

<verification>
Verificacao geral do plan:
1. Arquivo criado: `test -f components/portfolio/fluid-background.tsx && echo "OK"`
2. SSR-safe: Primeira linha e "use client"
3. 3D noise: Shader usa snoise(vec3...) com time como Z
4. Cores corretas: bgColor ~0.96, blobColor ~0.90
5. Cleanup completo: 3 dispose() calls, removeEventListener, cancelAnimationFrame
6. Resize handler: window.addEventListener("resize", ...)
7. TypeScript ok: bunx tsc --noEmit sem erros
</verification>

<success_criteria>
- [ ] fluid-background.tsx existe em components/portfolio/
- [ ] Componente usa "use client" (SSR-safe)
- [ ] Shader implementa 3D simplex noise (snoise com vec3)
- [ ] Paleta low-contrast aplicada (#F5F5F0 background, #E5E5DC blobs)
- [ ] Cleanup disposes renderer, geometry, material
- [ ] Resize handler atualiza uResolution uniform
- [ ] Animation loop usa requestAnimationFrame
- [ ] TypeScript compila sem erros
</success_criteria>

<output>
Apos completar, criar `.planning/phases/01-component-foundation/01-01-SUMMARY.md`
</output>
