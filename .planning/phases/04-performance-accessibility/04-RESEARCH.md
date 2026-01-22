# Phase 4: Performance & Accessibility - Research

**Researched:** 2026-01-22
**Domain:** WebGL performance optimization, accessibility, and mobile compatibility
**Confidence:** HIGH

## Summary

This research covers the critical aspects of achieving 60fps on mid-range devices, implementing proper reduced-motion support, handling WebGL context loss/restoration, and managing high-DPI displays efficiently.

The current implementation using Three.js r182 with a ShaderMaterial and simplex noise is well-suited for optimization. The shader is relatively lightweight (single noise field with 3 isolines), but several optimizations are needed: devicePixelRatio is already capped at 2, but context loss handling, reduced-motion support, and mobile-specific optimizations are missing.

**Primary recommendation:** Implement a layered performance strategy: detect reduced-motion preference first (skip WebGL entirely if set), add context loss/restore handlers, implement adaptive resolution scaling based on device capability detection, and add FPS monitoring with automatic quality reduction.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Three.js | 0.182.0 | WebGL abstraction | Already in use, handles context events internally |
| window.matchMedia | Native | Reduced-motion detection | Standard browser API, no dependencies |
| ResizeObserver | Native | Canvas sizing with devicePixelContentBoxSize | Most accurate DPI-aware sizing |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| stats.js | Latest | FPS/memory monitoring | Development only, for performance debugging |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| stats.js | Chrome DevTools FPS counter | DevTools built-in, no bundle size, but less precise |
| Manual RAF loop | GSAP ticker | GSAP already in project, but adds dependency to background |

**Installation:**
```bash
# Already have Three.js installed
# stats.js is dev-only, use via CDN or npm
bun add -D stats.js
```

## Architecture Patterns

### Recommended Module Structure
```
components/portfolio/
├── fluid-background.tsx     # Main component (exists)
├── fluid-background-static.tsx  # Reduced-motion fallback (NEW)
└── lib/
    └── webgl-utils.ts       # Context handlers, capability detection (NEW)
```

### Pattern 1: Reduced-Motion Detection with Fallback
**What:** Check system preference before initializing WebGL
**When to use:** Always, as first check in component mount
**Example:**
```typescript
// Source: MDN prefers-reduced-motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (event: MediaQueryListEvent) => setReducedMotion(event.matches);

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return reducedMotion;
}

// In component:
if (prefersReducedMotion.matches) {
  // Render static fallback or simplified version
  return <StaticBackground />;
}
```

### Pattern 2: WebGL Context Loss/Restore Handling
**What:** Listen for context events and recover gracefully
**When to use:** Always with WebGL content
**Example:**
```typescript
// Source: Khronos WebGL Wiki - HandlingContextLost
const canvas = renderer.domElement;

function handleContextLost(event: WebGLContextEvent) {
  event.preventDefault(); // REQUIRED to enable restore
  cancelAnimationFrame(animationId);
  // Optionally show "Recovering..." message
}

function handleContextRestored() {
  // All WebGL resources are invalid, recreate everything
  setupWebGLStateAndResources();
  animate(); // Resume animation loop
}

canvas.addEventListener('webglcontextlost', handleContextLost, false);
canvas.addEventListener('webglcontextrestored', handleContextRestored, false);
```

### Pattern 3: Adaptive Resolution Scaling
**What:** Adjust render resolution based on device capability
**When to use:** For mobile and mid-range device support
**Example:**
```typescript
// Source: Khronos HandlingHighDPI, Three.js best practices
function getOptimalPixelRatio(): number {
  const dpr = window.devicePixelRatio || 1;

  // Mobile devices: cap more aggressively
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (isMobile) {
    return Math.min(dpr, 1.5); // 1.5 max for mobile
  }

  // Desktop: cap at 2
  return Math.min(dpr, 2);
}

// With ResizeObserver for accurate sizing:
const resizeObserver = new ResizeObserver((entries) => {
  for (const entry of entries) {
    if (entry.devicePixelContentBoxSize) {
      const boxSize = entry.devicePixelContentBoxSize[0];
      canvas.width = boxSize.inlineSize;
      canvas.height = boxSize.blockSize;
    } else {
      // Fallback
      const rect = entry.contentRect;
      const dpr = getOptimalPixelRatio();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    }
  }
});
```

### Pattern 4: Throttled Animation with FPS Monitoring
**What:** Detect performance issues and reduce quality
**When to use:** Production builds for adaptive quality
**Example:**
```typescript
// Source: Three.js Journey Performance Tips
let lastFrameTime = performance.now();
let frameCount = 0;
let currentFps = 60;
const FPS_SAMPLE_INTERVAL = 1000;

function animate() {
  const now = performance.now();
  frameCount++;

  if (now - lastFrameTime >= FPS_SAMPLE_INTERVAL) {
    currentFps = frameCount;
    frameCount = 0;
    lastFrameTime = now;

    // Adaptive quality reduction
    if (currentFps < 30) {
      reduceQuality(); // Lower resolution, simplify shader
    }
  }

  // Render...
  animationId = requestAnimationFrame(animate);
}
```

### Anti-Patterns to Avoid
- **Creating/destroying WebGLRenderer frequently:** Keep renderer stable across route changes
- **Not disposing resources:** Always call geometry.dispose(), material.dispose(), renderer.dispose()
- **Ignoring context loss:** App should recover, not stay black
- **Using highp when mediump suffices:** Mobile GPUs are 2x faster with mediump

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| FPS monitoring | Custom timer | stats.js or browser DevTools | Accurate sampling, memory tracking |
| Reduced motion detection | Check once | matchMedia with listener | User can change preference mid-session |
| Context restore | Full page reload | Event listeners + resource recreation | Better UX, preserves page state |
| High-DPI sizing | window.innerWidth * dpr | ResizeObserver with devicePixelContentBoxSize | Handles fractional scaling correctly |

**Key insight:** Browser APIs handle edge cases (system preference changes, fractional DPRs, context churn) that custom solutions miss.

## Common Pitfalls

### Pitfall 1: Ignoring requestAnimationFrame Throttling
**What goes wrong:** Animation assumes 60fps, but iOS Low-Power Mode caps to 30fps
**Why it happens:** RAF is a request, not a guarantee; browsers throttle for battery/heat
**How to avoid:** Use delta-time animation, not frame-count animation
**Warning signs:** Animations "slow down" on mobile or background tabs

```typescript
// BAD: Frame-dependent
uniforms.uTime.value += 0.016; // Assumes 60fps

// GOOD: Time-dependent
uniforms.uTime.value = (performance.now() - startTime) * 0.001;
```

### Pitfall 2: Not Preventing Default on Context Loss
**What goes wrong:** Canvas goes black and never recovers
**Why it happens:** Default behavior doesn't trigger restore event
**How to avoid:** Always call event.preventDefault() in webglcontextlost handler
**Warning signs:** Black canvas after system sleep, GPU driver update, or memory pressure

### Pitfall 3: Using highp in Fragment Shader on Mobile
**What goes wrong:** Shader runs 2x slower than needed
**Why it happens:** Mobile GPUs (ARM Mali, Adreno) process mediump much faster
**How to avoid:** Use mediump for positions/colors, reserve highp for precision-critical math
**Warning signs:** Low FPS on mobile but fine on desktop

```glsl
// Current (potentially slow):
precision highp float;

// Better for mobile:
precision mediump float;
// Only use highp where needed:
// highp float for time accumulation to prevent precision loss over time
```

### Pitfall 4: fwidth() Dependency Without Extension Check
**What goes wrong:** Shader fails on some devices
**Why it happens:** fwidth requires OES_standard_derivatives in WebGL1
**How to avoid:** WebGL2 has it built-in (Three.js uses WebGL2 by default now); add fallback for WebGL1
**Warning signs:** Shader compilation errors on older devices

```typescript
// Check WebGL version
const gl = renderer.getContext();
const isWebGL2 = gl instanceof WebGL2RenderingContext;
// fwidth() is built-in for WebGL2, no extension needed
```

### Pitfall 5: Passive Event Listeners Not Applied
**What goes wrong:** Scroll/touch events cause jank
**Why it happens:** Browser waits for handler to potentially call preventDefault()
**How to avoid:** Add { passive: true } to pointermove/touchmove/scroll handlers
**Warning signs:** "Violation: Added non-passive event listener" console warning

## Code Examples

Verified patterns from official sources:

### Complete Reduced Motion Implementation
```typescript
// Source: MDN, W3C WCAG Techniques
export function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Check on mount
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(query.matches);

    // Listen for changes
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    query.addEventListener('change', handler);

    return () => query.removeEventListener('change', handler);
  }, []);

  return reducedMotion;
}

// Usage in component:
export function FluidBackground() {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    // Return static version: single frame, no animation
    return <StaticFluidBackground />;
  }

  // Full animated version...
}
```

### Complete Context Loss Handler
```typescript
// Source: Khronos WebGL Wiki, Three.js forums
export function setupContextHandlers(
  renderer: THREE.WebGLRenderer,
  onLost: () => void,
  onRestore: () => void
): () => void {
  const canvas = renderer.domElement;

  function handleLost(event: Event) {
    event.preventDefault(); // CRITICAL
    onLost();
  }

  function handleRestore() {
    onRestore();
  }

  canvas.addEventListener('webglcontextlost', handleLost, false);
  canvas.addEventListener('webglcontextrestored', handleRestore, false);

  // Return cleanup function
  return () => {
    canvas.removeEventListener('webglcontextlost', handleLost);
    canvas.removeEventListener('webglcontextrestored', handleRestore);
  };
}
```

### Mobile-Optimized Shader Precision
```glsl
// Source: ARM Mali docs, Three.js Journey
#ifdef GL_ES
  // Use mediump by default for mobile performance
  precision mediump float;
  precision mediump int;
#else
  precision highp float;
  precision highp int;
#endif

// For time accumulation (to prevent precision loss over hours):
uniform highp float uTime;

// Rest of shader uses mediump implicitly
uniform vec2 uResolution;
uniform vec2 uMouse;
```

### Adaptive Resolution Component
```typescript
// Source: Khronos HandlingHighDPI, Three.js forums
function getAdaptivePixelRatio(): number {
  const dpr = window.devicePixelRatio || 1;

  // Detect device class
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');

  if (!gl) return 1;

  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
  const renderer = debugInfo
    ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
    : '';

  // Known low-power GPUs
  const isLowPower = /Mali-4|Adreno 3|Intel HD 4|PowerVR/i.test(renderer);
  const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);

  if (isLowPower) return 1;
  if (isMobile) return Math.min(dpr, 1.5);
  return Math.min(dpr, 2);
}
```

### Proper Cleanup Pattern
```typescript
// Source: Three.js Discourse forums
useEffect(() => {
  // ... setup code ...

  return () => {
    cancelAnimationFrame(animationId);

    // Remove event listeners
    window.removeEventListener('resize', resize);
    container.removeEventListener('pointermove', handlePointerMove);

    // Dispose GPU resources
    geometry.dispose();
    material.dispose();
    renderer.dispose();

    // Remove DOM element
    if (container.contains(renderer.domElement)) {
      container.removeChild(renderer.domElement);
    }
  };
}, []);
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| WebGL1 + extensions | WebGL2 default | Three.js r118+ | fwidth built-in, better performance |
| window.innerWidth | ResizeObserver | 2020+ | Handles fractional DPR correctly |
| Single pixelRatio | Adaptive per device | Current best practice | 60fps on mid-range |
| Ignore reduced-motion | Always detect | Accessibility requirement | Legal compliance, better UX |

**Deprecated/outdated:**
- Using `gl.getExtension('OES_standard_derivatives')`: Not needed in WebGL2
- Using `window.onresize`: ResizeObserver is more accurate and efficient

## Open Questions

Things that couldn't be fully resolved:

1. **Exact threshold for quality reduction**
   - What we know: 30fps is the lower bound for acceptable experience
   - What's unclear: Should we reduce at 45fps? 40fps? Hysteresis to prevent thrashing?
   - Recommendation: Start with 40fps threshold with 5-second averaging to avoid flicker

2. **Static fallback visual design**
   - What we know: Need non-animated version for reduced-motion
   - What's unclear: Should it be a single frame capture, or CSS gradient approximation?
   - Recommendation: Render one frame of the noise and save as static image, or use CSS gradient

3. **iOS Safari WebGL memory limits**
   - What we know: iOS has stricter memory limits than desktop
   - What's unclear: Exact limits, and whether current shader exceeds them
   - Recommendation: Test on real iOS devices, monitor for context loss

## Sources

### Primary (HIGH confidence)
- [MDN prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion) - Full API reference
- [Khronos WebGL Wiki - HandlingContextLost](https://wikis.khronos.org/webgl/HandlingContextLost) - Official context handling guide
- [Khronos WebGL Wiki - HandlingHighDPI](https://www.khronos.org/webgl/wiki/HandlingHighDPI) - Official DPI guidance
- [MDN OES_standard_derivatives](https://developer.mozilla.org/en-US/docs/Web/API/OES_standard_derivatives) - Extension reference
- [W3C WCAG Techniques SCR40](https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR40) - Accessibility technique

### Secondary (MEDIUM confidence)
- [Three.js Journey Performance Tips](https://threejs-journey.com/lessons/performance-tips) - Bruno Simon's guide
- [Three.js Discourse forums](https://discourse.threejs.org/t/how-to-fix-three-webglrenderer-context-lost/66395) - Context handling discussion
- [Motion.dev blog](https://motion.dev/blog/when-browsers-throttle-requestanimationframe) - RAF throttling behaviors
- [Medium - Optimizing Three.js for Mobile](https://javascript.plainenglish.io/how-we-optimized-our-three-js-application-to-run-on-mobile-devices-4a3bc9e572f4) - Mobile optimization case study
- [stats.js GitHub](https://github.com/mrdoob/stats.js) - FPS monitoring tool

### Tertiary (LOW confidence)
- Various blog posts on shader optimization (need verification on real devices)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - using native APIs and established Three.js patterns
- Architecture: HIGH - patterns verified against official documentation
- Pitfalls: MEDIUM - some mobile-specific issues need device testing to confirm
- Reduced-motion: HIGH - W3C WCAG techniques are authoritative
- Context handling: HIGH - Khronos WebGL wiki is the authoritative source

**Research date:** 2026-01-22
**Valid until:** 60 days (stable APIs, not fast-moving)
