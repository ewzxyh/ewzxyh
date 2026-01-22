---
phase: 01-component-foundation
plan: 02
type: execute
wave: 2
depends_on:
  - "01-01"
files_modified:
  - components/portfolio/index.ts
  - app/page.tsx
autonomous: true

must_haves:
  truths:
    - "FluidBackground e exportado do barrel file"
    - "Pagina importa FluidBackground em vez de LavaLamp"
    - "Secao demo exibe FluidBackground no lugar do LavaLamp"
    - "Navegacao para pagina e volta funciona sem erros"
  artifacts:
    - path: "components/portfolio/index.ts"
      provides: "Export do FluidBackground"
      contains:
        - "FluidBackground"
    - path: "app/page.tsx"
      provides: "Pagina usando FluidBackground"
      contains:
        - "FluidBackground"
  key_links:
    - from: "app/page.tsx"
      to: "components/portfolio/index.ts"
      via: "import { FluidBackground }"
      pattern: "import.*FluidBackground.*from.*@/components/portfolio"
    - from: "components/portfolio/index.ts"
      to: "components/portfolio/fluid-background.tsx"
      via: "export { FluidBackground }"
      pattern: "export.*FluidBackground.*from.*fluid-background"
---

<objective>
Integrar FluidBackground na pagina substituindo o LavaLamp na secao demo.

Purpose: Completar a integracao do componente na pagina, tornando-o visivel e testavel
Output: Pagina exibindo FluidBackground animado na secao demo
</objective>

<execution_context>
@~/.claude/get-shit-done/workflows/execute-plan.md
@~/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/phases/01-component-foundation/01-01-SUMMARY.md

# Arquivos a modificar
@components/portfolio/index.ts
@app/page.tsx
</context>

<tasks>

<task type="auto">
  <name>Task 1: Add FluidBackground export to barrel file</name>
  <files>components/portfolio/index.ts</files>
  <action>
Adicionar export do FluidBackground ao arquivo index.ts:

1. Abrir components/portfolio/index.ts
2. Adicionar linha: `export { FluidBackground } from "./fluid-background"`
3. Posicionar apos a linha do LavaLamp para manter organizacao alfabetica aproximada

O arquivo deve ficar similar a:
```typescript
export { Hero } from "./hero"
export { About } from "./about"
// ... outros exports ...
export { LavaLamp } from "./lava-lamp"
export { FluidBackground } from "./fluid-background"
```

NAO remover o export do LavaLamp - manter ambos disponiveis por enquanto.
  </action>
  <verify>
1. Export existe: `grep -c "FluidBackground" components/portfolio/index.ts` retorna 1+
2. Sintaxe correta: `bunx tsc --noEmit` sem erros
  </verify>
  <done>
FluidBackground exportado do barrel file components/portfolio/index.ts
  </done>
</task>

<task type="auto">
  <name>Task 2: Replace LavaLamp with FluidBackground in page</name>
  <files>app/page.tsx</files>
  <action>
Modificar app/page.tsx para usar FluidBackground:

1. IMPORT: Substituir LavaLamp por FluidBackground na linha de import
   De: `import { ..., LavaLamp } from "@/components/portfolio"`
   Para: `import { ..., FluidBackground } from "@/components/portfolio"`

2. JSX: Substituir o componente na secao demo
   De: `<LavaLamp className="absolute inset-0" />`
   Para: `<FluidBackground className="absolute inset-0" />`

3. TITULO (opcional mas recomendado): Atualizar texto da secao
   De: "Contour Effect"
   Para: "Fluid Background"

   De: "Passe o mouse para interagir"
   Para: "Background fluido animado" (mouse interaction vem na Phase 3)

4. COMENTARIO: Atualizar comentario da secao
   De: `{/* Lava Lamp Demo Section */}`
   Para: `{/* Fluid Background Demo Section */}`

O resultado deve ser:
```tsx
{/* Fluid Background Demo Section */}
<section className="relative h-screen">
  <FluidBackground className="absolute inset-0" />
  <div className="relative z-10 flex items-center justify-center h-full pointer-events-none">
    <div className="text-center">
      <h2 className="text-4xl sm:text-6xl font-bold text-foreground mb-4">
        Fluid Background
      </h2>
      <p className="text-muted-foreground text-lg">
        Background fluido animado
      </p>
    </div>
  </div>
</section>
```
  </action>
  <verify>
1. Import correto: `grep -c "FluidBackground" app/page.tsx` retorna 2+ (import + uso)
2. LavaLamp removido do uso: `grep -c "<LavaLamp" app/page.tsx` retorna 0
3. TypeScript ok: `bunx tsc --noEmit` sem erros
4. Pagina carrega: `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000` retorna 200
  </verify>
  <done>
Pagina usando FluidBackground na secao demo, LavaLamp substituido
  </done>
</task>

<task type="auto">
  <name>Task 3: Verify integration works end-to-end</name>
  <files>app/page.tsx</files>
  <action>
Verificar que a integracao funciona corretamente:

1. Verificar que nao ha erros no build:
   - `bun run build` ou verificar que dev server nao tem erros

2. Verificar estrutura final:
   - page.tsx importa FluidBackground
   - page.tsx usa FluidBackground na secao
   - index.ts exporta FluidBackground
   - fluid-background.tsx existe e e valido

3. Se houver erros de TypeScript ou runtime, corrigir antes de concluir.

NOTA: Verificacao visual sera feita pelo usuario - aqui apenas garantimos que o codigo esta correto.
  </action>
  <verify>
1. Build funciona: `bun run build 2>&1 | tail -5` (deve completar sem erros)
2. Ou dev server ok: Sem erros no console do servidor
3. Imports resolvem: `bunx tsc --noEmit` sem erros
  </verify>
  <done>
Integracao completa - FluidBackground visivel na pagina, build funciona
  </done>
</task>

</tasks>

<verification>
Verificacao geral do plan:
1. Export adicionado: `grep "FluidBackground" components/portfolio/index.ts`
2. Import na pagina: `grep "FluidBackground" app/page.tsx`
3. Componente usado: `grep "<FluidBackground" app/page.tsx`
4. LavaLamp nao usado: `grep "<LavaLamp" app/page.tsx` (deve retornar vazio)
5. Build ok: `bun run build` completa
</verification>

<success_criteria>
- [ ] FluidBackground exportado em components/portfolio/index.ts
- [ ] app/page.tsx importa FluidBackground (nao LavaLamp)
- [ ] Secao demo usa <FluidBackground /> (nao <LavaLamp />)
- [ ] TypeScript compila sem erros
- [ ] Build completa sem erros
- [ ] Pagina carrega no browser sem erros de hidratacao
</success_criteria>

<output>
Apos completar, criar `.planning/phases/01-component-foundation/01-02-SUMMARY.md`
</output>
