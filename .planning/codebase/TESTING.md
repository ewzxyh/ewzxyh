# Testing Patterns

**Analysis Date:** 2026-01-21

## Test Framework

**Runner:** Not configured

**Assertion Library:** Not detected

**Test Configuration:** No test configuration files found (`jest.config.*`, `vitest.config.*`, etc.)

**Status:** Testing infrastructure is not currently set up in this codebase.

## Test File Organization

**Location:** Not applicable - no test files exist

**Naming Convention:** Not established (recommended: `*.test.ts`, `*.test.tsx`, `*.spec.ts`, `*.spec.tsx`)

**Status:** No test files found in project directories (`app/`, `components/`, `hooks/`, `lib/`, `scripts/`)

## Test Structure

**Current State:** No test infrastructure

**Recommendation for Future Implementation:**
When testing is added, follow these patterns based on codebase architecture:

### Recommended Test Structure

**For React Components:**
```typescript
// Example: components/ui/button.test.tsx
import { render, screen } from '@testing-library/react'
import { Button } from './button'

describe('Button', () => {
  it('renders with default variant', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('applies variant styles correctly', () => {
    render(<Button variant="outline">Click me</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('border-border')
  })
})
```

**For Hooks:**
```typescript
// Example: hooks/use-parallax.test.ts
import { renderHook } from '@testing-library/react'
import { useParallax } from './use-parallax'

describe('useParallax', () => {
  it('returns a ref', () => {
    const { result } = renderHook(() => useParallax())
    expect(result.current).toBeDefined()
    expect(result.current.current).toBeNull()
  })
})
```

**For Utilities:**
```typescript
// Example: lib/utils.test.ts
import { cn } from './utils'

describe('cn', () => {
  it('merges classnames correctly', () => {
    const result = cn('px-2', 'px-4')
    expect(result).toContain('px-4')
    expect(result).not.toContain('px-2')
  })
})
```

## Mocking

**Framework Recommendation:** MSW (Mock Service Worker) for API calls, Vitest for mocking

**Patterns to Follow:**

### Module Mocks
```typescript
vi.mock('@/lib/utils', () => ({
  cn: vi.fn((inputs) => inputs.join(' '))
}))
```

### Context Mocks
```typescript
// For testing components that use I18nProvider or LoadingProvider
const mockI18nValue = {
  locale: 'pt-BR',
  setLocale: vi.fn(),
  t: (key) => key,
  isTransitioning: false
}

vi.mocked(useI18n).mockReturnValue(mockI18nValue)
```

### GSAP Mocks
```typescript
vi.mock('gsap', () => ({
  gsap: {
    to: vi.fn(),
    context: vi.fn((callback) => {
      callback()
      return { revert: vi.fn() }
    }),
    utils: {
      toArray: Array.from
    }
  }
}))
```

**What to Mock:**
- Third-party animations (GSAP)
- External API calls
- Context providers when testing isolated components
- Module imports with side effects

**What NOT to Mock:**
- React hooks (render them in test containers)
- Utility functions like `cn()` (test actual behavior)
- Custom hooks (use `renderHook` from @testing-library/react)
- Component DOM rendering

## Fixtures and Factories

**Test Data Pattern:**

### Translation Fixtures
```typescript
// tests/fixtures/i18n.ts
export const mockTranslations = {
  'pt-BR': {
    'hero.role': 'PRODUCT ENGINEER',
    'hero.subtitle': 'Transformando ideias em produtos de alta performance'
  },
  'en-US': {
    'hero.role': 'PRODUCT ENGINEER',
    'hero.subtitle': 'Turning ideas into high-performance products'
  }
}
```

### Component Props Factories
```typescript
// tests/factories/button.ts
export function createButtonProps(overrides = {}) {
  return {
    variant: 'default' as const,
    size: 'default' as const,
    className: '',
    ...overrides
  }
}
```

**Location:** Recommended `tests/fixtures/` and `tests/factories/` directories (when testing is implemented)

## Coverage

**Requirements:** Not currently enforced

**Recommendation for Setup:**
```bash
# When Vitest is configured:
vitest --coverage

# Target coverage thresholds (recommended):
# - Lines: 80%
# - Functions: 80%
# - Branches: 75%
```

## Test Types

**Unit Tests (Recommended Focus):**
- Individual components: `Button.test.tsx`, `Card.test.tsx`
- Utility functions: `utils.test.ts`, `gallery-blur.test.ts`
- Custom hooks: `use-parallax.test.ts`, `use-i18n.test.ts`
- Context providers: `loading-context.test.tsx`
- Scope: Single function/component, isolated from dependencies

**Integration Tests (Recommended):**
- Component composition: Test Hero section with all child components
- Context usage: Test components consuming multiple providers
- Animation sequences: Verify GSAP timelines execute correctly
- Scope: Multiple components working together

**E2E Tests (Not Currently Used):**
- Framework: Playwright configured (`.playwright-mcp/` exists)
- Potential scenarios:
  - Hero section animations play on page load
  - Navigation between sections works smoothly
  - Language switching updates UI correctly
  - Theme toggling applies styles

## Common Patterns

**Async Testing:**
```typescript
// For components with animations/loading states
it('completes hero animation', async () => {
  const { rerender } = render(<Hero isAlmostComplete={false} />)
  expect(screen.getByRole('heading')).toHaveClass('opacity-0')

  rerender(<Hero isAlmostComplete={true} />)

  await waitFor(() => {
    expect(screen.getByRole('heading')).toHaveClass('opacity-1')
  }, { timeout: 1000 })
})
```

**Error Testing:**
```typescript
// Test error boundaries and fallbacks
it('throws when useI18n used outside provider', () => {
  expect(() => {
    renderHook(() => useI18n())
  }).toThrow('useI18n must be used within I18nProvider')
})
```

**Props Variation Testing:**
```typescript
// Test component variants
describe('Button variants', () => {
  const variants = ['default', 'outline', 'secondary', 'ghost', 'destructive', 'link'] as const

  variants.forEach((variant) => {
    it(`renders ${variant} variant`, () => {
      render(<Button variant={variant}>Click</Button>)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })
  })
})
```

**Ref Testing:**
```typescript
// Test components that expose refs
it('forwards ref to underlying button', () => {
  const ref = React.createRef<HTMLButtonElement>()
  render(<Button ref={ref}>Click</Button>)
  expect(ref.current).toBeInstanceOf(HTMLButtonElement)
})
```

## Recommended Setup

**To implement testing, add to `package.json`:**
```json
{
  "devDependencies": {
    "vitest": "^2.0.0",
    "@testing-library/react": "^15.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@vitest/ui": "^2.0.0",
    "jsdom": "^24.0.0"
  },
  "scripts": {
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --coverage"
  }
}
```

**Create `vitest.config.ts`:**
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'tests/']
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    }
  }
})
```

**Create `tests/setup.ts`:**
```typescript
import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock Next.js router
vi.mock('next/router', () => ({
  useRouter: () => ({
    push: vi.fn(),
    pathname: '/',
    asPath: '/',
    query: {}
  })
}))

// Mock GSAP if needed globally
vi.mock('gsap', () => ({
  gsap: {
    context: vi.fn((callback) => {
      callback()
      return { revert: vi.fn() }
    }),
    to: vi.fn(),
    fromTo: vi.fn(),
    timeline: vi.fn(() => ({
      to: vi.fn().mockReturnThis(),
      fromTo: vi.fn().mockReturnThis()
    })),
    set: vi.fn(),
    utils: {
      toArray: Array.from
    },
    registerPlugin: vi.fn()
  }
}))
```

## Current Testing Status

**Testing Framework:** Not installed
**Test Files:** None present
**Coverage:** Not configured
**Run Commands:** Not available

**Next Steps for Implementation:**
1. Install Vitest and Testing Library dependencies
2. Create `vitest.config.ts` configuration
3. Set up `tests/setup.ts` with mocks and globals
4. Create first test file for utility (`lib/utils.test.ts`)
5. Add test coverage monitoring to CI/CD pipeline
6. Establish minimum coverage threshold (recommend 70%)

---

*Testing analysis: 2026-01-21*
