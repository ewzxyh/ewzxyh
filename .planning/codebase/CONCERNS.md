# Codebase Concerns

**Analysis Date:** 2026-01-21

## Performance Bottlenecks

**Heavy Animation Libraries & Multiple Instances:**
- Problem: Multiple GSAP animations running simultaneously across hero, projects, and shape overlays components. Each component registers its own ScrollTrigger and timelines.
- Files: `C:\Users\enzo\ewzxyh\components\portfolio\hero.tsx`, `C:\Users\enzo\ewzxyh\components\portfolio\projects.tsx`, `C:\Users\enzo\ewzxyh\components\portfolio\bento-gallery.tsx`, `C:\Users\enzo\ewzxyh\components\portfolio\shape-overlays.tsx`
- Cause: GSAP context creation per component without centralized animation coordination. ScrollTrigger instances not properly deduped. Canvas rendering on every frame with 99 particles.
- Improvement path: Centralize GSAP animation orchestration through GsapProvider. Implement animation debouncing on resize. Consider requestAnimationFrame throttling.

**Canvas Particles with High Particle Count:**
- Problem: 99 particles rendering on canvas with complex image loading and transforms every frame
- Files: `C:\Users\enzo\ewzxyh\components\portfolio\canvas-particles.tsx`
- Cause: Particle count hardcoded to 99 with external image loads (CodePen assets). No optimization for viewport visibility or device capabilities.
- Improvement path: Implement adaptive particle count based on device/performance metrics. Preload images in advance. Use TextureCache pattern.

**Three.js WebGL Rendering with Complex Shaders:**
- Problem: LavaLamp component runs continuous shader animation with mouse tracking and smooth transitions via requestAnimationFrame
- Files: `C:\Users\enzo\ewzxyh\components\portfolio\lava-lamp.tsx`
- Cause: No visibility detection. Shader recalculation every frame even when off-screen. No requestAnimationFrame throttling.
- Improvement path: Implement Intersection Observer to pause animation when not visible. Use `contain: content` CSS containment. Consider precomputed shader paths.

**Bento Gallery FLIP Animation with Resize Listener:**
- Problem: FLIP animation recomputes on every window resize without debouncing
- Files: `C:\Users\enzo\ewzxyh\components\portfolio\bento-gallery.tsx`
- Cause: `createFlipAnimation` called directly on resize. No throttling mechanism.
- Improvement path: Debounce resize handler. Use ResizeObserver instead of window resize.

**Layout Thrashing in Hero Component:**
- Problem: Multiple DOM queries and gsap.set calls on children arrays within animation timeline
- Files: `C:\Users\enzo\ewzxyh\components\portfolio\hero.tsx` (lines 65, 88-89)
- Cause: `statsRef.current?.children || []` and `socialsRef.current?.children || []` called in animation setup causing forced reflows
- Improvement path: Cache DOM references on mount. Use MutationObserver if children change dynamically.

## Fragile Areas

**IntroLoader Logo Animation - Unsafe Ref Indexing:**
- Files: `C:\Users\enzo\ewzxyh\components\portfolio\intro-loader.tsx`
- Why fragile: Lines 130-131 use callback ref with unchecked array assignment `pathsRef.current[i] = el`. No bounds checking. If SVG paths don't render in expected order, array indices won't align.
- Safe modification: Add explicit ref naming or useCallback refs. Validate pathsRef.current.length before animation starts (line 57).
- Test coverage: No tests validating ref array initialization or handling missing paths.

**I18n Context Timing Issues:**
- Files: `C:\Users\enzo\ewzxyh\lib\i18n.tsx` (lines 148-152)
- Why fragile: Locale switching uses nested setTimeout calls (400ms + 800ms delays). Race conditions possible if setLocale called twice rapidly. isTransitioning state could get stuck if second call interrupts first.
- Safe modification: Implement AbortController to cancel pending transitions. Clear timeouts on unmount and re-entry.
- Test coverage: No tests for rapid locale switching or state cleanup.

**Shape Overlays Ref Array with Conditional Initialization:**
- Files: `C:\Users\enzo\ewzxyh\components\portfolio\shape-overlays.tsx` (lines 102-113)
- Why fragile: `allPointsRef` initialized in useEffect with `initializedRef` guard (line 99), but `toggle` function called before initialization could be complete. Line 30-33 checks `if (!path || !points)` but doesn't validate array bounds.
- Safe modification: Move initialization outside effect or guarantee it runs synchronously. Add explicit null checks.
- Test coverage: No tests for SVG path rendering order or array initialization timing.

**BentoGallery Image Loading - Fallback with Hardcoded External URLs:**
- Files: `C:\Users\enzo\ewzxyh\components\portfolio\bento-gallery.tsx` (lines 12-33)
- Why fragile: Lines 44-49 use `fetch` HEAD request with `.catch(() => {})` silently failing. External CodePen images used as fallback (lines 24-32) - if CodePen domain changes or images are removed, gallery breaks silently with broken images.
- Safe modification: Add error boundaries. Implement retry logic with exponential backoff. Use local placeholder SVGs instead of external assets.
- Test coverage: No tests for image loading failure scenarios.

**ProjectCard Hover Event Listeners - Memory Leaks:**
- Files: `C:\Users\enzo\ewzxyh\components\portfolio\projects.tsx` (lines 81-88)
- Why fragile: Event listeners added in gsap.context but not explicitly removed. Only gsap.context revert() removes them. If component unmounts while animation is running, listeners persist.
- Safe modification: Use card.addEventListener with explicit cleanup in useEffect return or store listener references to remove them.
- Test coverage: No tests for component unmounting during hover state.

**Hero Component - Unsafe DOM Selectors:**
- Files: `C:\Users\enzo\ewzxyh\components\portfolio\hero.tsx` (lines 122, 124)
- Why fragile: Uses `gsap.utils.toArray<HTMLElement>(".corner-decoration")` selecting by class. If styling changes or elements aren't rendered, array is empty but animation proceeds silently.
- Safe modification: Use refs for corner-decoration elements instead of class selectors. Validate array.length before animation.
- Test coverage: No tests for missing or reordered DOM elements.

## Test Coverage Gaps

**No Unit Tests for Animation Logic:**
- What's not tested: GSAP timeline sequences, ScrollTrigger setup/teardown, animation timing
- Files: `C:\Users\enzo\ewzxyh\components\portfolio\hero.tsx`, `C:\Users\enzo\ewzxyh\components\portfolio\projects.tsx`, `C:\Users\enzo\ewzxyh\components\portfolio\bento-gallery.tsx`
- Risk: Animation breaking silently. Timing regressions undetected. ScrollTrigger leaks accumulating on re-render.
- Priority: High - animations are core to UX

**No Tests for Context Providers:**
- What's not tested: LoadingProvider state transitions, I18nProvider locale switching, error states when using hooks outside provider
- Files: `C:\Users\enzo\ewzxyh\lib\i18n.tsx`, `C:\Users\enzo\ewzxyh\components\portfolio\loading-context.tsx`
- Risk: Provider errors propagate to page. Stale context values affect component behavior. Missing provider crashes undetected until runtime.
- Priority: High - providers are critical infrastructure

**No Tests for Canvas Rendering:**
- What's not tested: Canvas initialization, image loading in CanvasParticles, resize handling, cleanup on unmount
- Files: `C:\Users\enzo\ewzxyh\components\portfolio\canvas-particles.tsx`
- Risk: Canvas context errors silent. Memory leaks from uncleaned-up refs. Particle rendering bugs undetected.
- Priority: Medium - canvas is a leaf component but performance-critical

**No Tests for Shader Rendering:**
- What's not tested: LavaLamp WebGL initialization, shader compilation, mouse tracking, resize handling, resource cleanup
- Files: `C:\Users\enzo\ewzxyh\components\portfolio\lava-lamp.tsx`
- Risk: WebGL errors silent. Three.js resources not freed. Mouse tracking broken on mobile.
- Priority: Medium - shader is complex but currently demo-only

**No Integration Tests:**
- What's not tested: Full page load sequence (PageLoader → IntroLoader → Hero animations), animation coordination
- Files: `C:\Users\enzo\ewzxyh\app\page.tsx`, `C:\Users\enzo\ewzxyh\app\providers.tsx`
- Risk: Provider order issues undetected. Animation timing conflicts emerge only at runtime. Page load sequences untested.
- Priority: High - affects user experience on first load

## Missing Critical Features

**Gallery Image Dependencies Not Codified:**
- Problem: Script `C:\Users\enzo\ewzxyh\scripts\generate-blur.ts` generates `lib/gallery-blur.ts` but this file is not version-controlled or generated in CI. BentoGallery fallback to external assets when script not run.
- Blocks: Reproducible builds. CI deployments. Blur data consistency.
- Impact: Production deployment could ship without blur data if script not run locally before commit.

**No Error Boundaries for Animation Components:**
- Problem: Animation errors in GSAP or Three.js crash the page. No error boundary catches them.
- Blocks: Graceful degradation. Fallback UI. Error reporting.
- Impact: Animation library bug crashes entire portfolio site.

**Mobile Performance Not Optimized:**
- Problem: Canvas particles, WebGL shader, and heavy GSAP animations run identically on mobile devices with no device capability detection.
- Blocks: Mobile usability. Performance on low-end devices.
- Impact: Portfolio unusable on mobile devices with poor animation performance.

## Known Bugs

**BentoGallery Image Index Mismatch:**
- Symptoms: Gallery displays wrong image for one position (index 2 has empty src, line 15)
- Files: `C:\Users\enzo\ewzxyh\components\portfolio\bento-gallery.tsx` (line 15)
- Trigger: Gallery render with localImages array
- Workaround: None - index 2 always renders CanvasParticles instead of image

**Shape Overlays SVG Fill Colors Hard-coded:**
- Symptoms: SVG overlay colors don't respond to theme changes
- Files: `C:\Users\enzo\ewzxyh\components\portfolio\shape-overlays.tsx` (lines 137, 142, 149)
- Trigger: Theme toggle after page load
- Workaround: Reload page to see color change

**I18n Locale Cookie Not Persisted:**
- Symptoms: Switching locale on page reload resets to "pt-BR"
- Files: `C:\Users\enzo\ewzxyh\lib\i18n.tsx` (line 140)
- Trigger: Language toggle → page reload
- Workaround: User must toggle language again after reload

## Security Considerations

**External Image Dependencies on CodePen:**
- Risk: CodePen assets used as fallback (lines 24-32 of bento-gallery.tsx). If CodePen domain compromised or assets removed, gallery displays broken images or could load malicious content.
- Files: `C:\Users\enzo\ewzxyh\components\portfolio\bento-gallery.tsx`
- Current mitigation: Fallback only used when local images missing. External URLs hard-coded in source.
- Recommendations: Use data URIs or local placeholder SVGs. If external assets required, use Subresource Integrity (SRI). Implement Content Security Policy (CSP) header.

**No CSP Headers Configured:**
- Risk: Inline scripts and event handlers used throughout. Script injection possible.
- Files: Multiple components use inline event listeners (hero.tsx, projects.tsx)
- Current mitigation: None detected
- Recommendations: Add CSP headers via Next.js. Migrate event listeners to proper ref callbacks. Use trusted types.

## Dependencies at Risk

**Unmaintained GSAP Plugin Dependencies:**
- Risk: ScrambleTextPlugin and MorphSVGPlugin are GSAP Club features. Requires ClubGSAP subscription. If subscription lapses, imports fail.
- Files: `C:\Users\enzo\ewzxyh\components\portfolio\hero.tsx`, `C:\Users\enzo\ewzxyh\components\portfolio\intro-loader.tsx`
- Impact: Hero text animation and logo morphing break
- Migration plan: Replace with CSS animations or Web Animations API equivalents. Consider Framer Motion for text scrambling.

**Three.js Major Version Dependency:**
- Risk: Three.js is at v0.182.0. Major version changes break shader code. No lock on version behavior.
- Files: `C:\Users\enzo\ewzxyh\components\portfolio\lava-lamp.tsx`
- Impact: Shaders may fail on Three.js upgrade
- Migration plan: Pin Three.js version. Test shaders on new versions before upgrading.

**External Asset CDN Dependency:**
- Risk: Particle images loaded from CodePen CDN (`assets.codepen.io`)
- Files: `C:\Users\enzo\ewzxyh\components\portfolio\canvas-particles.tsx` (lines 6-8)
- Impact: Particles fail to load if CodePen CDN is down or slow
- Migration plan: Host particle images locally. Implement image caching.

## Scaling Limits

**GSAP ScrollTrigger Accumulation:**
- Current capacity: ~15-20 ScrollTrigger instances before noticeable performance degradation
- Files: Multiple components register ScrollTriggers (hero, projects, bento-gallery, gsap-provider)
- Limit: Adding sections with heavy scroll animations will compound performance issues
- Scaling path: Implement ScrollTrigger pooling. Use Intersection Observer instead for simple reveal animations. Profile with DevTools before adding more scroll animations.

**Canvas Particle Count:**
- Current capacity: 99 particles on desktop, 0 optimization for mobile/low-end devices
- Files: `C:\Users\enzo\ewzxyh\components\portfolio\canvas-particles.tsx`
- Limit: Frame rate drops below 60fps on low-end devices. Mobile unusable.
- Scaling path: Detect device capability. Use reduced particle count on mobile (20-30). Implement requestAnimationFrame throttling.

**SVG Path Morphing Complexity:**
- Current capacity: 6 logo paths morphing simultaneously
- Files: `C:\Users\enzo\ewzxyh\components\portfolio\intro-loader.tsx`
- Limit: Adding more paths increases animation complexity exponentially. SVG rendering blocks main thread.
- Scaling path: Use Canvas path rendering. Batch morphing updates. Limit to 3-4 simultaneous morphs.

## Code Organization Issues

**No Centralized Animation Configuration:**
- Problem: Timing constants (durations, delays, easing) scattered across components
- Files: hero.tsx, projects.tsx, bento-gallery.tsx, shape-overlays.tsx, intro-loader.tsx
- Impact: Inconsistent animation behavior. Hard to maintain global timing changes. Difficult to tune performance.
- Fix approach: Create `lib/animation-config.ts` with exported constants and easing presets.

**Mixed Concerns in Components:**
- Problem: Components mix animation logic, DOM queries, event handling, and state management
- Files: `C:\Users\enzo\ewzxyh\components\portfolio\hero.tsx` (230+ lines), `C:\Users\enzo\ewzxyh\components\portfolio\bento-gallery.tsx` (120+ lines)
- Impact: Hard to test. Hard to reuse animation logic. Cognitive overhead when reading code.
- Fix approach: Extract animation orchestration to hooks (useHeroAnimation, useBentoAnimation). Keep components focused on rendering.

---

*Concerns audit: 2026-01-21*
