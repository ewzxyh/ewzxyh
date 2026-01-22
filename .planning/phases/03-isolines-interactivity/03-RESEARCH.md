# Phase 3: Isolines & Interactivity - Research

**Researched:** 2026-01-22
**Domain:** GLSL isolines, mouse tracking, shader interactivity, performance optimization
**Confidence:** HIGH

## Summary

Phase 3 builds on the existing noise field implementation to add topographic isolines (contour lines) and subtle mouse-driven distortion. The current implementation already has 3 isolines with anti-aliasing using `smoothstep + fwidth`, so the primary work involves adding 5 more isolines and implementing mouse tracking.

Mouse interactivity in shaders requires three components: (1) a `vec2 uMouse` uniform passed from JavaScript, (2) normalization of mouse coordinates to match shader UV space, and (3) smooth interpolation (lerping) of the mouse position to prevent jitter. The standard pattern uses `requestAnimationFrame` throttling for mouse events and GLSL `mix()` for smooth tracking in the shader.

For mouse distortion of the noise field, the established technique is to add a small offset to the noise sampling coordinates based on distance from the mouse. Keeping the influence at 2-5% requires careful scaling of the distortion amount, typically using `distance()` and inverse falloff patterns.

**Primary recommendation:** Use `requestAnimationFrame` throttling for mouse events, add a smoothed `uMouse` uniform, and apply radial distortion to noise coordinates with 2-5% maximum influence. Expand isolines by calling the existing `isoline()` function 8 times with different thresholds.

## Standard Stack

### Core (Already Available)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Three.js | r169+ | WebGL/uniform management | Already in project, provides ShaderMaterial.uniforms |
| Browser APIs | Native | Mouse events, rAF | Standard DOM APIs for input handling |

### Patterns (No Additional Libraries Needed)
| Pattern | Purpose | Source |
|---------|---------|--------|
| fwidth() anti-aliasing | Smooth contour lines | Already implemented in Phase 2 |
| requestAnimationFrame throttling | Mouse event performance | Standard web performance pattern |
| Normalized Device Coordinates | Mouse-to-shader coordinate mapping | Three.js/WebGL standard |
| mix() lerping | Smooth mouse tracking | GLSL built-in function |
| Radial distance falloff | Mouse influence area | Standard shader technique |

**Installation:** No additional packages required. All implementation is GLSL code and vanilla JavaScript mouse event handling.

## Architecture Patterns

### Pattern 1: Mouse Uniform Setup (Three.js)
**What:** Add vec2 uniform for mouse position and update it on pointer events
**When to use:** Any shader that needs to respond to mouse/pointer input
**Example:**
```typescript
// TypeScript side - add to uniforms object
const uniforms = {
  uTime: { value: 0 },
  uResolution: { value: new THREE.Vector2(1, 1) },
  uMouse: { value: new THREE.Vector2(0.5, 0.5) },  // NEW - centered initially
}

// Smoothed mouse tracking (lerping happens in JS)
let targetMouse = new THREE.Vector2(0.5, 0.5)
let currentMouse = new THREE.Vector2(0.5, 0.5)

function handlePointerMove(event: PointerEvent) {
  const container = containerRef.current
  if (!container) return

  const rect = container.getBoundingClientRect()
  // Normalize to 0-1 range (matches shader UV coordinates)
  targetMouse.x = (event.clientX - rect.left) / rect.width
  targetMouse.y = 1.0 - ((event.clientY - rect.top) / rect.height)  // Flip Y
}

// In animation loop
function animate() {
  // Lerp for smooth tracking (prevents jitter)
  currentMouse.lerp(targetMouse, 0.1)  // 0.1 = smoothing factor
  uniforms.uMouse.value.copy(currentMouse)

  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}
```

### Pattern 2: Normalized Mouse Coordinates
**What:** Convert screen pixels to 0-1 UV space that matches shader coordinates
**When to use:** Full-screen shader effects on a plane
**Key insight:** Y-axis must be flipped (HTML: 0 at top, GLSL: 0 at bottom)

**Two approaches:**
```typescript
// Approach A: Simple 0-1 normalization (for full-screen plane)
const x = (event.clientX - rect.left) / rect.width        // 0 to 1
const y = 1.0 - ((event.clientY - rect.top) / rect.height)  // 0 to 1, flipped

// Approach B: NDC -1 to +1 (for raycasting)
const x = ((event.clientX - rect.left) / rect.width) * 2 - 1   // -1 to 1
const y = -(((event.clientY - rect.top) / rect.height) * 2 - 1)  // -1 to 1, flipped
```

**For this project:** Use Approach A (0-1 range) since the shader uses `gl_FragCoord.xy / uResolution` which produces 0-1 UV coordinates.

### Pattern 3: Mouse Event Performance
**What:** Throttle mouse events using requestAnimationFrame to prevent performance degradation
**When to use:** High-frequency events (mousemove, pointermove) that update shader uniforms
**Example:**
```typescript
// Option 1: Manual rAF throttling
let rafPending = false

function handlePointerMove(event: PointerEvent) {
  if (rafPending) return

  rafPending = true
  requestAnimationFrame(() => {
    rafPending = false
    updateMousePosition(event)
  })
}

// Option 2: Direct update (simpler, rAF already runs for animation)
// Just update targetMouse directly, let animation loop handle smoothing
function handlePointerMove(event: PointerEvent) {
  const rect = containerRef.current?.getBoundingClientRect()
  if (!rect) return

  targetMouse.x = (event.clientX - rect.left) / rect.width
  targetMouse.y = 1.0 - ((event.clientY - rect.top) / rect.height)
}
```

**Recommendation:** Use Option 2 (direct update) since the animation loop already runs at 60fps and performs lerping, which naturally throttles visual updates.

### Pattern 4: Mouse Distortion in Shader
**What:** Apply subtle distortion to noise field based on distance from mouse
**When to use:** Creating interactive "push" or "warp" effects on procedural patterns
**Example:**
```glsl
// Fragment shader
uniform vec2 uMouse;        // 0-1 normalized coordinates
uniform float uMouseInfluence;  // Strength control (0.02-0.05 for 2-5%)

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  float aspect = uResolution.x / uResolution.y;
  vec2 uvAspect = vec2(uv.x * aspect, uv.y);

  // Calculate distance from mouse
  vec2 mouseAspect = vec2(uMouse.x * aspect, uMouse.y);
  float dist = distance(uvAspect, mouseAspect);

  // Radial falloff (influence decreases with distance)
  float radius = 0.3;  // Influence radius
  float influence = smoothstep(radius, 0.0, dist);  // 1.0 at center, 0.0 at radius

  // Direction from mouse
  vec2 direction = normalize(uvAspect - mouseAspect);

  // Apply distortion offset to noise sampling
  vec2 distortion = direction * influence * uMouseInfluence;
  vec2 distortedUV = uvAspect + distortion;

  // Sample noise with distorted coordinates
  float noise = getNoiseField(distortedUV);

  // Continue with isoline rendering...
}
```

**Alternative approach (simpler, push-away effect):**
```glsl
// Add small offset based on proximity to mouse
float mouseDist = distance(uvAspect, mouseAspect);
float mouseEffect = exp(-mouseDist * 3.0) * uMouseInfluence;  // Exponential falloff
vec2 offset = (uvAspect - mouseAspect) * mouseEffect;
float noise = getNoiseField(uvAspect + offset);
```

### Pattern 5: Efficient Multi-Isoline Rendering
**What:** Render multiple isolines without performance penalty
**When to use:** Creating topographic/contour line effects
**Key insight:** GLSL loops must have constant iteration count

**Current implementation (3 lines):**
```glsl
float outline1 = isoline(noise, 0.40, 1.5);
float outline2 = isoline(noise, 0.55, 1.5);
float outline3 = isoline(noise, 0.70, 1.5);
float allOutlines = max(max(outline1, outline2), outline3);
```

**Expanded to 8 lines:**
```glsl
// Option A: Manual unrolling (clearest, best performance)
float line1 = isoline(noise, 0.20, 1.5);
float line2 = isoline(noise, 0.30, 1.5);
float line3 = isoline(noise, 0.40, 1.5);
float line4 = isoline(noise, 0.50, 1.5);
float line5 = isoline(noise, 0.60, 1.5);
float line6 = isoline(noise, 0.70, 1.5);
float line7 = isoline(noise, 0.80, 1.5);
float line8 = isoline(noise, 0.90, 1.5);

float allLines = max(max(max(max(max(max(max(
  line1, line2), line3), line4), line5), line6), line7), line8);

// Option B: Loop with const iterations (more compact)
float allLines = 0.0;
const int numLines = 8;
const float thresholds[8] = float[8](0.20, 0.30, 0.40, 0.50, 0.60, 0.70, 0.80, 0.90);

for (int i = 0; i < numLines; i++) {
  allLines = max(allLines, isoline(noise, thresholds[i], 1.5));
}
```

**Recommendation:** Use Option A (manual unrolling) for maximum clarity and compatibility. The `isoline()` function is already optimized with `fwidth()`, so calling it 8 times has negligible performance impact.

### Pattern 6: Smooth Mouse Tracking (Lerping)
**What:** Interpolate between current and target mouse position to prevent jitter
**When to use:** Any real-time mouse tracking in animations
**Example:**
```typescript
// JavaScript lerping
let currentMouse = new THREE.Vector2(0.5, 0.5)
let targetMouse = new THREE.Vector2(0.5, 0.5)

function animate() {
  // Linear interpolation: current + (target - current) * alpha
  currentMouse.lerp(targetMouse, 0.1)  // 0.1 = 10% per frame
  uniforms.uMouse.value.copy(currentMouse)

  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}
```

**Lerp factor tuning:**
- `0.05` - Very smooth, slow following (laggy feel)
- `0.1` - Smooth, responsive (recommended)
- `0.2` - Quick, minimal smoothing
- `0.5` - Very responsive, some smoothing
- `1.0` - No smoothing (instant, can jitter)

**GLSL alternative (if lerping in shader):**
```glsl
// mix() is GLSL's lerp function
vec2 smoothMouse = mix(uMousePrev, uMouse, 0.1);
```

**Recommendation:** Perform lerping in JavaScript (animation loop) rather than shader. This requires only one uniform update and is simpler to implement.

### Anti-Patterns to Avoid
- **Throttling with setTimeout/setInterval:** Use `requestAnimationFrame` instead, it's synchronized with display refresh
- **Updating uniforms directly in event handler:** Updates can happen 100+ times/second, overwhelming the GPU
- **Not flipping Y coordinate:** Will cause inverted mouse tracking
- **Using Raycaster for fullscreen plane:** Overkill, simple normalization is sufficient
- **High lerp factor with jittery input:** Use lower factor (0.05-0.15) for smooth tracking

## Don't Hand-Roll

Problems that look simple but have existing solutions.

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Event throttling | Custom debounce/throttle | requestAnimationFrame pattern | Already runs at 60fps, prevents excess updates |
| Linear interpolation | Manual lerp calculation | THREE.Vector2.lerp() | Built-in, optimized, handles edge cases |
| Mouse normalization | Complex coordinate math | Simple division + flip | Keep it simple, direct calculation |
| Smooth transitions | Custom easing | GLSL smoothstep() | Hardware-accelerated, mathematically perfect |
| Array max value | Loop with if statements | Nested max() calls | Faster, no branching penalty |

**Key insight:** The existing infrastructure (Three.js, GLSL built-ins) provides everything needed. Focus on integration, not reinventing primitives.

## Common Pitfalls

### Pitfall 1: Mouse Y-Axis Inversion
**What goes wrong:** Mouse tracking is vertically flipped
**Why it happens:** HTML canvas Y starts at top (0), GLSL Y starts at bottom (0)
**How to avoid:**
  - When normalizing: `y = 1.0 - (event.clientY - rect.top) / rect.height`
  - Or in shader: flip when using `uMouse.y`
  - Check by logging values: mouse at top should give `y ≈ 1.0`, bottom should give `y ≈ 0.0`
**Warning signs:** Mouse effect appears upside down

### Pitfall 2: Aspect Ratio Mismatch
**What goes wrong:** Mouse influence area is elliptical instead of circular
**Why it happens:** Applying distance calculation to UVs without aspect correction
**How to avoid:**
  - Apply aspect ratio to both `uv` and `uMouse` before distance calculation
  - `vec2 uvAspect = vec2(uv.x * aspect, uv.y)`
  - `vec2 mouseAspect = vec2(uMouse.x * aspect, uMouse.y)`
  - Then: `distance(uvAspect, mouseAspect)`
**Warning signs:** Circular mouse effect appears stretched on non-square canvases

### Pitfall 3: Mouse Influence Too Strong
**What goes wrong:** Distortion is obvious and distracting, not subtle
**Why it happens:** `uMouseInfluence` value too high, or radius too large
**How to avoid:**
  - Start with `uMouseInfluence = 0.02` (2%)
  - Test with `0.05` (5%) as maximum
  - Use radius `0.2-0.3` for localized effect
  - Apply exponential or smoothstep falloff for smooth transition
**Warning signs:** Blobs look "pushed" in obvious way, draws attention from content

### Pitfall 4: Jittery Mouse Tracking
**What goes wrong:** Mouse movement appears stuttery or nervous
**Why it happens:** No smoothing applied, or lerp factor too high
**How to avoid:**
  - Apply `lerp()` with factor `0.05-0.15`
  - Lower factor = smoother but slower
  - Test on actual device, not just dev machine
**Warning signs:** Mouse effect "vibrates" or has micro-jitters during movement

### Pitfall 5: Performance Degradation
**What goes wrong:** Animation framerate drops when moving mouse
**Why it happens:** Mouse events fire faster than rAF, updating uniforms excessively
**How to avoid:**
  - Update `targetMouse` in event handler (lightweight)
  - Update `uniforms.uMouse` only in animation loop (once per frame)
  - Don't call `renderer.render()` in mouse event handler
  - Consider passive event listener: `{ passive: true }`
**Warning signs:** FPS drops from 60 to 30-40 during mouse movement

### Pitfall 6: Too Many Isolines
**What goes wrong:** Lines are too dense, create visual noise instead of topographic effect
**Why it happens:** Thresholds too close together (e.g., every 0.05 instead of 0.10)
**How to avoid:**
  - Use spacing of 0.10-0.15 between thresholds
  - For 8 lines: 0.20, 0.30, 0.40, 0.50, 0.60, 0.70, 0.80, 0.90
  - Or slightly irregular: 0.15, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 0.85
**Warning signs:** Lines merge into solid areas, lose topographic appearance

### Pitfall 7: Mouse Leaves Canvas
**What goes wrong:** Mouse position "sticks" at edge when pointer leaves canvas
**Why it happens:** No `pointerleave` event handler to reset position
**How to avoid:**
  - Optional: Add `pointerleave` listener to smoothly return to center
  - Or: Accept the behavior (mouse influence naturally fades at edges)
  - Ensure distortion uses falloff so edge "sticking" isn't obvious
**Warning signs:** Effect persists at canvas edge after mouse exits

## Code Examples

Verified patterns from official documentation and established practices.

### Complete Mouse Uniform Integration
```typescript
// Source: Three.js ShaderMaterial uniforms pattern + Web APIs

"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export function FluidBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    container.appendChild(renderer.domElement)
    renderer.domElement.style.position = "absolute"
    renderer.domElement.style.inset = "0"
    renderer.domElement.style.width = "100%"
    renderer.domElement.style.height = "100%"
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const geometry = new THREE.PlaneGeometry(2, 2)

    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },  // NEW
      uMouseInfluence: { value: 0.03 },  // NEW - 3% influence
    }

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,   // unchanged
      fragmentShader, // updated with mouse distortion
    })

    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    // Mouse tracking
    const targetMouse = new THREE.Vector2(0.5, 0.5)
    const currentMouse = new THREE.Vector2(0.5, 0.5)

    function handlePointerMove(event: PointerEvent) {
      const rect = container.getBoundingClientRect()
      // Normalize to 0-1, flip Y
      targetMouse.x = (event.clientX - rect.left) / rect.width
      targetMouse.y = 1.0 - ((event.clientY - rect.top) / rect.height)
    }

    container.addEventListener('pointermove', handlePointerMove, { passive: true })

    function resize() {
      if (!container) return
      const { width, height } = container.getBoundingClientRect()
      if (width === 0 || height === 0) return
      renderer.setSize(width, height, false)
      uniforms.uResolution.value.set(width, height)
    }

    resize()
    window.addEventListener("resize", resize)

    let animationId: number
    const startTime = performance.now()

    function animate() {
      // Smooth mouse tracking (lerp)
      currentMouse.lerp(targetMouse, 0.1)
      uniforms.uMouse.value.copy(currentMouse)

      uniforms.uTime.value = (performance.now() - startTime) * 0.001
      renderer.render(scene, camera)
      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      container.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener("resize", resize)
      renderer.dispose()
      geometry.dispose()
      material.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="overflow-hidden"
      style={{
        isolation: "isolate",
        contain: "layout style paint",
      }}
    />
  )
}
```

### Fragment Shader with Mouse Distortion
```glsl
// Source: Established GLSL patterns + existing implementation

precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;          // NEW
uniform float uMouseInfluence; // NEW

// ... existing snoise(), domainWarp(), getNoiseField() functions ...

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  float aspect = uResolution.x / uResolution.y;
  vec2 uvAspect = vec2(uv.x * aspect, uv.y);

  // Mouse distortion
  vec2 mouseAspect = vec2(uMouse.x * aspect, uMouse.y);
  float mouseDist = distance(uvAspect, mouseAspect);

  // Radial influence with smooth falloff
  float influence = smoothstep(0.3, 0.0, mouseDist);  // 0.3 = radius
  vec2 mouseOffset = (uvAspect - mouseAspect) * influence * uMouseInfluence;

  // Sample noise with mouse-distorted coordinates
  float noise = getNoiseField(uvAspect + mouseOffset);

  // 8 isolines (expanded from 3)
  float line1 = isoline(noise, 0.20, 1.5);
  float line2 = isoline(noise, 0.30, 1.5);
  float line3 = isoline(noise, 0.40, 1.5);
  float line4 = isoline(noise, 0.50, 1.5);
  float line5 = isoline(noise, 0.60, 1.5);
  float line6 = isoline(noise, 0.70, 1.5);
  float line7 = isoline(noise, 0.80, 1.5);
  float line8 = isoline(noise, 0.90, 1.5);

  float allLines = max(max(max(max(max(max(max(
    line1, line2), line3), line4), line5), line6), line7), line8);

  // Colors
  vec3 bgColor = vec3(0.96, 0.96, 0.94);
  vec3 lineColor = vec3(0.78, 0.78, 0.75);

  vec3 color = bgColor;
  color = mix(color, lineColor, allLines);

  gl_FragColor = vec4(color, 1.0);
}
```

### Isoline Threshold Selection
```glsl
// Evenly spaced (every 0.10)
const float thresholds[8] = float[8](
  0.20, 0.30, 0.40, 0.50, 0.60, 0.70, 0.80, 0.90
);

// Slightly irregular (more natural topographic look)
const float thresholds[8] = float[8](
  0.15, 0.25, 0.38, 0.47, 0.55, 0.65, 0.78, 0.88
);

// Denser at low values (emphasize outer contours)
const float thresholds[8] = float[8](
  0.15, 0.25, 0.35, 0.45, 0.60, 0.70, 0.80, 0.90
);
```

**Recommendation:** Start with evenly spaced (every 0.10), adjust based on visual feedback.

### Mouse Influence Tuning
```glsl
// Subtle push-away (2-5% influence)
float radius = 0.3;  // Localized effect
float influence = smoothstep(radius, 0.0, mouseDist);
vec2 offset = (uvAspect - mouseAspect) * influence * 0.03;  // 3%

// More pronounced (for testing)
float influence = smoothstep(0.4, 0.0, mouseDist);
vec2 offset = (uvAspect - mouseAspect) * influence * 0.05;  // 5%

// Very subtle (barely noticeable)
float influence = exp(-mouseDist * 4.0);  // Exponential falloff
vec2 offset = (uvAspect - mouseAspect) * influence * 0.02;  // 2%
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| mousemove events | pointermove events | 2015+ | Unified mouse/touch handling, better mobile support |
| Manual throttling | requestAnimationFrame | Standard | Synchronized with display refresh, better performance |
| NDC for all cases | Simple 0-1 for fullscreen | Standard | Simpler code, direct UV mapping |
| Shader-side lerping | JavaScript-side lerping | Standard | Simpler uniform management, one less shader operation |
| Fixed contour count | Dynamic/configurable | Standard | Easier to tune visually |

**Current best practices (2026):**
- Use `pointermove` instead of `mousemove` for unified touch/mouse support
- Perform lerping in JavaScript animation loop, not in shader
- Normalize mouse to 0-1 for fullscreen effects (simpler than NDC -1 to +1)
- Use `passive: true` for event listeners that don't call `preventDefault()`
- Apply mouse distortion as coordinate offset, not as separate noise layer

## Open Questions

Things that couldn't be fully resolved.

1. **Exact mouse influence percentage (2-5%)**
   - What we know: `uMouseInfluence` value of 0.02-0.05 provides subtle distortion
   - What's unclear: Optimal value for "noticeable but not distracting"
   - Recommendation: Start at 0.03 (3%), test on actual content, adjust based on feel

2. **Optimal lerp factor for smooth tracking**
   - What we know: 0.1 is standard, 0.05-0.15 range is common
   - What's unclear: Best value for this specific subtle effect
   - Recommendation: Start at 0.1, reduce to 0.08 if jitter observed, increase to 0.15 if feels laggy

3. **Isoline threshold spacing**
   - What we know: 8 total lines required, even spacing (0.10) is standard
   - What's unclear: Whether irregular spacing improves topographic appearance
   - Recommendation: Use even spacing initially, consider slight irregularity if too "digital"

4. **Mouse influence radius**
   - What we know: 0.3 provides localized effect, larger values affect more area
   - What's unclear: Optimal radius for subtle interaction
   - Recommendation: Start at 0.3, increase to 0.4 if effect too concentrated

## Sources

### Primary (HIGH confidence)
- [Three.js ShaderMaterial Documentation](https://threejs.org/docs/#api/en/materials/ShaderMaterial) - Official uniform management
- [Three.js Raycaster Documentation](https://threejs.org/docs/api/en/core/Raycaster.html) - Coordinate normalization patterns
- [MDN: Element pointermove event](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointermove_event) - Standard event handling
- [OpenGL fwidth Reference](https://registry.khronos.org/OpenGL-Refpages/gl4/html/fwidth.xhtml) - Anti-aliasing technique already in use
- [The Book of Shaders: mix](https://thebookofshaders.com/glossary/?search=mix) - GLSL lerp function
- Existing `fluid-background.tsx` - Working shader infrastructure

### Secondary (MEDIUM confidence)
- [Codrops: Creating an Interactive Mouse Effect with Instancing in Three.js](https://tympanus.net/codrops/2023/12/13/creating-an-interactive-mouse-effect-with-instancing-in-three-js/) - Mouse tracking and lerping patterns
- [Codrops: Animating WebGL Shaders with GSAP](https://tympanus.net/codrops/2025/10/08/how-to-animate-webgl-shaders-with-gsap-ripples-reveals-and-dynamic-blur-effects/) - Mouse-distance distortion pattern
- [High-performance input handling on the web](https://nolanlawson.com/2019/08/11/high-performance-input-handling-on-the-web/) - requestAnimationFrame throttling
- [Drawing antialiased circles in OpenGL](https://rubendv.be/posts/fwidth/) - fwidth() usage patterns
- [The Book of Shaders: Noise](https://thebookofshaders.com/12/) - Domain offset techniques
- [Observable: GLSL Contour Lines](https://observablehq.com/@stwind/glsl-contour-lines) - Multi-isoline rendering

### Tertiary (LOW confidence)
- [Three.js Journey: Raycaster and Mouse Events](https://threejs-journey.com/lessons/raycaster-and-mouse-events) - Tutorial content, not official docs
- Various WebSearch results on throttling and lerping - General patterns, not shader-specific

## Metadata

**Confidence breakdown:**
- Mouse uniform setup: HIGH - Official Three.js patterns, well-documented
- Coordinate normalization: HIGH - Standard WebGL/Three.js approach
- Event handling/performance: HIGH - Established web performance patterns
- Mouse distortion technique: MEDIUM - Pattern is clear, exact parameters need tuning
- Isoline expansion: HIGH - Straightforward extension of existing code
- Lerping/smoothing: HIGH - Standard technique with Three.js Vector2.lerp()

**Research date:** 2026-01-22
**Valid until:** 2026-03-22 (stable domain, fundamental techniques)
