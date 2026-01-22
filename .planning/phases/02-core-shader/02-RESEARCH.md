# Phase 2: Core Shader - Research

**Researched:** 2026-01-22
**Domain:** GLSL domain warping, multi-layer noise, organic blob effects
**Confidence:** HIGH

## Summary

Domain warping is the established technique for creating organic, flowing blob effects in shaders. The technique works by distorting noise function inputs with other noise values, creating complex organic patterns from simple building blocks. For multi-layer effects, each layer uses different spatial offsets, scales, and time multipliers to produce visually distinct patterns rather than simple displaced copies.

The existing `fluid-background.tsx` already has the foundational 3D simplex noise implementation. The core shader work involves:
1. Implementing the domain warping pattern `f(p + fbm(p))` for organic movement
2. Creating three layers with distinct scales, speeds, and offsets
3. Blending layers with appropriate opacities using mix/smoothstep
4. Maintaining low contrast (<30%) through careful color value selection

**Primary recommendation:** Use the Inigo Quilez domain warping pattern with offset vectors to create three distinct layers, each with unique spatial scale, time multiplier, and domain warp intensity.

## Standard Stack

The established approach for this domain.

### Core (Already Available)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Three.js | r169+ | WebGL abstraction | Already in project, provides ShaderMaterial |
| 3D Simplex Noise | N/A | Organic noise generation | Already implemented in fluid-background.tsx |

### Patterns (No Additional Libraries Needed)
| Pattern | Purpose | Source |
|---------|---------|--------|
| Domain Warping | Organic blob distortion | Inigo Quilez - iquilezles.org |
| fBM (Fractal Brownian Motion) | Layer detail variation | The Book of Shaders |
| Offset-based differentiation | Unique patterns per layer | Standard GLSL technique |

**Installation:** No additional packages required. All implementation is GLSL code within the existing shader.

## Architecture Patterns

### Shader Structure
```glsl
// Existing snoise() function remains unchanged

// NEW: Domain warp helper
vec2 domainWarp(vec2 p, float scale, float time, vec2 offset) {
  return vec2(
    snoise(vec3(p * scale + offset.x, time)),
    snoise(vec3(p * scale + offset.y, time))
  );
}

// NEW: Single layer function
float blobLayer(vec2 uv, float scale, float speed, vec2 warpOffset, vec2 noiseOffset, float warpStrength) {
  float time = uTime * speed;
  vec2 warp = domainWarp(uv, scale * 0.5, time * 0.5, warpOffset) * warpStrength;
  vec2 warped = uv * scale + warp + noiseOffset;
  float n = snoise(vec3(warped, time));
  return smoothstep(0.3, 0.7, n * 0.5 + 0.5);
}

// Main: Compose layers with distinct parameters
void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  float aspect = uResolution.x / uResolution.y;
  vec2 uvAspect = vec2(uv.x * aspect, uv.y);

  // Layer 1: Large, slow, background (opacity 0.4)
  float layer1 = blobLayer(uvAspect, 1.5, 0.05, vec2(0.0), vec2(0.0), 0.3);

  // Layer 2: Medium, medium speed (opacity ~0.5)
  float layer2 = blobLayer(uvAspect, 2.5, 0.08, vec2(5.2, 1.3), vec2(10.0, 20.0), 0.4);

  // Layer 3: Small, faster, foreground (opacity ~0.6)
  float layer3 = blobLayer(uvAspect, 4.0, 0.12, vec2(1.7, 9.2), vec2(30.0, 40.0), 0.5);

  // Blend with background
  vec3 bgColor = vec3(0.96, 0.96, 0.94);   // #F5F5F0
  vec3 blobColor = vec3(0.90, 0.90, 0.86); // #E5E5DC

  // Composite layers back-to-front
  vec3 color = bgColor;
  color = mix(color, blobColor, layer1 * 0.4);  // Back layer
  color = mix(color, blobColor, layer2 * 0.5);  // Middle layer
  color = mix(color, blobColor, layer3 * 0.6);  // Front layer

  gl_FragColor = vec4(color, 1.0);
}
```

### Pattern 1: Domain Warping (Inigo Quilez Method)
**What:** Distort input coordinates with noise before sampling noise again
**When to use:** Creating organic, flowing blob shapes instead of regular noise patterns
**Formula:** `f(p + fbm(p))` or nested `f(p + fbm(p + fbm(p)))`
**Source:** https://iquilezles.org/articles/warp/

```glsl
// Single-level domain warp
vec2 warp = vec2(
  snoise(vec3(p * scale + offset1, time)),
  snoise(vec3(p * scale + offset2, time))
);
float result = snoise(vec3(p + warp * strength, time));
```

### Pattern 2: Layer Differentiation via Offsets
**What:** Use different offset vectors to sample different "regions" of noise space
**When to use:** Creating visually distinct layers from the same noise function
**Key insight:** Arbitrary offset values (5.2, 1.3, 1.7, 9.2) access completely different noise values

```glsl
// Layer 1: base noise region
float n1 = snoise(vec3(uv * scale1 + vec2(0.0), time * speed1));

// Layer 2: offset to different region (not just displaced!)
float n2 = snoise(vec3(uv * scale2 + vec2(5.2, 1.3), time * speed2));

// Layer 3: another unique region
float n3 = snoise(vec3(uv * scale3 + vec2(1.7, 9.2), time * speed3));
```

### Pattern 3: Smoothstep Blob Shaping
**What:** Convert continuous noise to blob-like shapes with soft edges
**When to use:** Creating defined blob boundaries instead of gradient noise

```glsl
// Raw noise: -1 to 1, remap to 0-1 range
float noise = snoise(...) * 0.5 + 0.5;

// Create soft blob edges
float blob = smoothstep(0.3, 0.7, noise);  // Adjust thresholds for blob size
```

### Anti-Patterns to Avoid
- **Identical layers with position offset only:** Using `noise(uv + offset)` produces visibly similar patterns that just move together
- **Linear noise blending:** Using raw noise values without smoothstep creates muddy, indistinct blobs
- **Over-warping:** Excessive warp strength creates chaotic patterns instead of organic blobs
- **Same time multiplier:** All layers moving at same speed looks artificial

## Don't Hand-Roll

Problems that look simple but have existing solutions.

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| 3D Simplex Noise | Custom noise function | Existing snoise() | Already implemented, well-tested, performant |
| Layer blending | Custom blend modes | GLSL mix() | GPU-optimized, mathematically correct |
| Soft edges | Manual interpolation | smoothstep() | Hardware-accelerated, produces Hermite curves |
| Aspect correction | Complex transforms | Simple `uv.x * aspect` | Keep it simple, matches existing code |

**Key insight:** The existing shader infrastructure is solid. The work is in the shader algorithm, not the Three.js setup.

## Common Pitfalls

### Pitfall 1: Layers Look Like Copies
**What goes wrong:** All three layers have the same visual pattern, just at different sizes
**Why it happens:** Using only scale differences without unique noise regions
**How to avoid:** Each layer needs:
  - Different spatial offset (samples different noise region)
  - Different warp offset (different warp pattern)
  - Different time multiplier (different movement speed)
  - Different warp strength (different organic intensity)
**Warning signs:** Zoom in/out and patterns look identical

### Pitfall 2: Contrast Too High
**What goes wrong:** Blobs are too visible, not subtle background effect
**Why it happens:** Color difference too large, opacity too high
**How to avoid:**
  - Background: #F5F5F0 (RGB: 0.96, 0.96, 0.94)
  - Blob color: #E5E5DC (RGB: 0.90, 0.90, 0.86)
  - Contrast = 6% per color channel
  - Layer opacities: 0.4, 0.5, 0.6 keep cumulative effect subtle
**Warning signs:** Blobs draw attention away from content

### Pitfall 3: All Layers Same Speed
**What goes wrong:** Animation looks mechanical, not organic
**Why it happens:** Using single time uniform directly for all layers
**How to avoid:** Multiply time by different factors per layer:
  - Layer 1 (large/back): `uTime * 0.05` (slowest)
  - Layer 2 (medium): `uTime * 0.08`
  - Layer 3 (small/front): `uTime * 0.12` (fastest)
**Warning signs:** Movement feels synchronized rather than natural

### Pitfall 4: Domain Warp Creates Artifacts
**What goes wrong:** Harsh edges, tearing, or discontinuities in blobs
**Why it happens:** Warp strength too high, or warp scale mismatched with noise scale
**How to avoid:**
  - Warp strength: 0.2-0.5 range (start low)
  - Warp scale: typically 0.5x the main noise scale
  - Warp time: typically 0.5x the main time for slower morph
**Warning signs:** Sharp edges or "folding" in blob shapes

### Pitfall 5: Mobile Performance
**What goes wrong:** Shader runs slowly on mobile devices
**Why it happens:** Complex noise functions, too many noise calls, highp precision
**How to avoid:**
  - Keep noise calls minimal (6-9 total for 3 layers)
  - Use mediump precision if acceptable visual quality
  - Consider reducing layer count on mobile via uniform
**Warning signs:** Choppy animation on phones, battery drain

## Code Examples

Verified patterns from research.

### Complete Layer Implementation
```glsl
// Source: Inigo Quilez domain warping + The Book of Shaders fBM patterns

// Domain warp function - creates organic distortion
vec2 domainWarp(vec2 p, float scale, float time, vec2 offset) {
  return vec2(
    snoise(vec3(p * scale + offset.x, time)),
    snoise(vec3(p * scale + offset.y, time))
  );
}

// Single blob layer with all differentiation parameters
float blobLayer(
  vec2 uv,           // Input coordinates (aspect-corrected)
  float scale,       // Spatial frequency (larger = smaller blobs)
  float speed,       // Time multiplier (larger = faster)
  vec2 warpOffset,   // Offset for warp noise sampling
  vec2 noiseOffset,  // Offset for main noise sampling
  float warpStrength // How much domain warping (0.2-0.5)
) {
  float time = uTime * speed;

  // Domain warp for organic shape
  vec2 warp = domainWarp(uv, scale * 0.5, time * 0.5, warpOffset);

  // Warped coordinates for final noise
  vec2 warped = uv * scale + warp * warpStrength + noiseOffset;

  // 3D noise with time for morphing
  float n = snoise(vec3(warped, time));

  // Remap and shape into soft blobs
  return smoothstep(0.3, 0.7, n * 0.5 + 0.5);
}
```

### Layer Composition with Proper Blending
```glsl
// Source: Standard alpha compositing

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  float aspect = uResolution.x / uResolution.y;
  vec2 uvAspect = vec2(uv.x * aspect, uv.y);

  // Three distinct layers
  float layer1 = blobLayer(uvAspect, 1.5, 0.05, vec2(0.0, 0.0), vec2(0.0, 0.0), 0.3);
  float layer2 = blobLayer(uvAspect, 2.5, 0.08, vec2(5.2, 1.3), vec2(10.0, 20.0), 0.4);
  float layer3 = blobLayer(uvAspect, 4.0, 0.12, vec2(1.7, 9.2), vec2(30.0, 40.0), 0.5);

  // Colors for subtle effect
  vec3 bgColor = vec3(0.96, 0.96, 0.94);   // #F5F5F0
  vec3 blobColor = vec3(0.90, 0.90, 0.86); // #E5E5DC

  // Composite back-to-front with opacity
  vec3 color = bgColor;
  color = mix(color, blobColor, layer1 * 0.4);  // Large, slow, back
  color = mix(color, blobColor, layer2 * 0.5);  // Medium, middle
  color = mix(color, blobColor, layer3 * 0.6);  // Small, fast, front

  gl_FragColor = vec4(color, 1.0);
}
```

### Parameter Reference Table
| Layer | Scale | Speed | Warp Offset | Noise Offset | Warp Strength | Opacity |
|-------|-------|-------|-------------|--------------|---------------|---------|
| 1 (back) | 1.5 | 0.05 | (0, 0) | (0, 0) | 0.3 | 0.4 |
| 2 (mid) | 2.5 | 0.08 | (5.2, 1.3) | (10, 20) | 0.4 | 0.5 |
| 3 (front) | 4.0 | 0.12 | (1.7, 9.2) | (30, 40) | 0.5 | 0.6 |

**Tuning notes:**
- Scale: Higher = smaller blobs, lower = larger blobs
- Speed: Multiplied by uTime, keep all under 0.15 for subtle movement
- Offsets: Arbitrary non-round numbers work best for unique patterns
- Warp strength: Start at 0.3, increase for more organic shapes
- Opacity: Cumulative effect, keep individual layers subtle

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Perlin noise | Simplex noise | 2001+ | Better performance, fewer artifacts |
| Static noise | 3D noise with time | Standard | Enables smooth morphing animation |
| Simple noise layers | Domain warping | Standard | Organic flowing shapes vs regular patterns |
| Manual blending | mix() with smoothstep | Standard | GPU-optimized, smooth results |

**Current best practices (2025):**
- Simplex noise preferred over Perlin for GLSL (fewer directional artifacts)
- Domain warping is the standard technique for organic effects
- Use offset vectors to differentiate layers (not just scale)
- smoothstep for blob edges, mix for layer blending

## Open Questions

Things that couldn't be fully resolved.

1. **Exact smoothstep thresholds for blob size**
   - What we know: 0.3-0.7 range creates medium blobs
   - What's unclear: Optimal values for "large blobs" vs "small details" in spec
   - Recommendation: Start with suggested values, tune visually to match spec

2. **Optimal noise call count for performance**
   - What we know: Each layer needs 2-3 snoise calls (warp x, warp y, main)
   - What's unclear: Performance impact on low-end mobile
   - Recommendation: Test on target devices, consider reducing layers if needed

3. **Exact opacity values for spec compliance**
   - What we know: Layer 1 opacity 0.4 per spec, contrast <30% required
   - What's unclear: Optimal values for layers 2 and 3
   - Recommendation: Use 0.4, 0.5, 0.6 progression, verify visually

## Sources

### Primary (HIGH confidence)
- [Inigo Quilez - Domain Warping](https://iquilezles.org/articles/warp/) - Authoritative domain warping technique and formulas
- [The Book of Shaders - fBM](https://thebookofshaders.com/13/) - Fractal Brownian Motion and warping patterns
- [The Book of Shaders - Noise](https://thebookofshaders.com/11/) - Noise fundamentals and parameter variations
- Existing `fluid-background.tsx` - Working 3D simplex noise implementation

### Secondary (MEDIUM confidence)
- [GLSL Noise Algorithms Gist](https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83) - Reference noise implementations
- [CS184 Lava Lamp Project](https://jessicaplotkin.github.io/lavalamp/) - Academic implementation with metaball approach
- [Three.js Performance Discussion](https://github.com/mrdoob/three.js/issues/14570) - Precision qualifier considerations

### Tertiary (LOW confidence)
- Various Shadertoy examples - Visual references but code not directly accessible

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Domain warping is well-documented, authoritative sources
- Architecture: HIGH - Pattern is established, code examples from authoritative sources
- Pitfalls: MEDIUM - Based on general shader development experience and documentation
- Parameter values: MEDIUM - Starting points from examples, will need visual tuning

**Research date:** 2026-01-22
**Valid until:** 2026-03-22 (stable domain, techniques don't change frequently)
