# Praan Health — Premium Website Ideation Plan

> **Status:** Pre-implementation · Source of truth for direction, scope, and decisions
> **Last updated:** 2026-04-15
> **Owner:** admissions@mesaschool.co

---

## 0. North Star

Build a **cinematic, scroll-driven storytelling website** for Praan Health that feels like **Apple × Headspace × Levels Health × Oura** — not a clinic site, not a generic SaaS landing page.

**One-line positioning:**
> India's premium longevity platform for parents — doctor-led, family-visible, results-driven.

**Primary emotion we must land (in order):**
1. Relief (someone finally gets this problem)
2. Trust (doctors, data, proof)
3. Guilt-resolution (I can actually help my parents from far away)
4. Desire (this is the premium tier — worth paying for)

**Primary audience:**
Sons and daughters (28–45), usually tier-1 city or NRI, whose parents (55–75) live elsewhere and are declining in health. Secondary: the parents themselves.

**Primary conversion action:**
"Book Free Assessment" → calendar lead → CRM follow-up.

---

## 1. Brand System (locked inputs)

### 1.1 Color tokens

| Role | Hex | OKLCH (Tailwind v4) | Usage |
|---|---|---|---|
| Primary / Emerald | `#0D5C4A` | `oklch(0.40 0.07 165)` approx | Buttons, emphasis, logo lockup |
| Primary Dark | `#0A4538` | — | Hover / pressed |
| Warm Bg | `#FAF9F7` | `oklch(0.975 0.004 85)` | Default page background |
| Ivory | `#F3F1EA` | — | Section alt background |
| Premium Black | `#101010` | `oklch(0.15 0 0)` | Dark cinematic sections |
| Gold Accent | `#C9A227` | `oklch(0.73 0.13 85)` | Sparingly — dividers, awards, accents |
| Trust Blue | `#DDEFF4` | — | Stat chips, callout backgrounds |
| Ink | `#111111` | — | Body text |
| Muted | `#6B6B66` | — | Secondary text |

Theme must live in `globals.css` under Tailwind v4's `@theme` block (Tailwind v4 uses CSS-first config — **no `tailwind.config.ts`**).

### 1.2 Typography

- **Display / Headings:** Clash Display (or Satoshi as fallback) — via `next/font/local` or Google Fonts if available. Weights: 500, 600.
- **Body:** Inter — `next/font/google`. Weights: 400, 500, 600.
- **Scale (desktop):** 96 / 72 / 56 / 40 / 28 / 20 / 16 / 14. Mobile scale halves the top three.
- **Rules:** Tight tracking on display (-0.02em), generous leading on body (1.6), no all-caps except micro-labels.

### 1.3 Spacing / Radius / Shadow

- Section vertical padding: `py-24 md:py-40` minimum.
- Card radius: `rounded-[24px]` default, `rounded-[40px]` for hero cards.
- Shadows: soft, layered — `shadow-[0_20px_60px_-20px_rgba(13,92,74,0.15)]` for primary cards.
- Max content width: `max-w-[1280px]` with `px-6 md:px-10`.

### 1.4 Motion principles

- Default easing: `[0.22, 1, 0.36, 1]` (Apple-ish quart out).
- Fade-up distance: 24px, duration 0.8s, stagger 0.08s.
- Always respect `prefers-reduced-motion` — strip parallax and heavy scroll effects, keep opacity fades.
- Lenis-driven smooth scroll globally, but **only on desktop**; disable on touch to avoid fighting native momentum.

### 1.5 Imagery direction

- Warm, natural light, real Indian elderly (not stock hospital imagery).
- Lifestyle over clinical: walking, laughing, with family, cooking, yoga mats.
- Soft film-grain overlay on hero imagery (optional).
- Zero emoji in UI. Icons: Lucide only, 1.5px stroke.

---

## 2. Current Codebase Audit

| Item | State | Action |
|---|---|---|
| Next.js version | **16.2.3** (breaking changes vs. training data — see `AGENTS.md`) | **MUST** read `node_modules/next/dist/docs/` before writing routes, metadata, fonts, image config, or server-component patterns |
| React | 19.2.4 | Use server components by default; `'use client'` only for motion/interactive |
| Tailwind | v4 + `@tailwindcss/postcss` | CSS-first config in `globals.css`; no `tailwind.config.js` |
| Existing primitives | [src/components/ui/button.tsx](src/components/ui/button.tsx) (shadcn) | Reuse; extend variants for `primary-emerald` and `ghost-ivory` |
| Existing animation | [src/components/animated/ScrollStack.tsx](src/components/animated/ScrollStack.tsx) | ✅ Ready — use as-is for Section 3 |
| Home components | [src/components/home/](src/components/home/) — empty | Will populate (see §4) |
| Smooth scroll | `lenis` installed, not globally mounted | Mount once in `layout.tsx` via a client wrapper |
| Motion | `framer-motion@12`, `gsap@3.15` installed | Framer for section-level, GSAP ScrollTrigger for complex pinning |
| Assets | [public/](public/) only has Next.js starter SVGs | Need: hero video placeholder, parent imagery, dashboard mockup, doctor portraits, logos |
| Current page | [src/app/page.tsx](src/app/page.tsx) is Next starter | Replace entirely |

**Critical Next 16 unknowns to resolve before coding** (read docs first):
- Metadata / `generateMetadata` API shape
- `next/font` usage (confirm `next/font/google` still works)
- `next/image` props and `remotePatterns`
- Any new Route Handler / Server Action conventions
- Turbopack vs Webpack defaults

---

## 3. Information Architecture

```
/                       Home (this plan's focus)
/programs/[slug]        Individual program detail (Phase 2)
/results                Outcomes & case studies (Phase 2)
/how-it-works           Process deep dive (Phase 2)
/about                  Team, doctors, mission (Phase 2)
/book                   Assessment booking (Phase 2 — Calendly/custom)
```

**Phase 1 (this plan) = Home only + global shell (nav, footer, smooth-scroll).**

---

## 4. Homepage Section Plan (8 sections)

Every section has: (a) purpose, (b) emotional beat, (c) layout, (d) motion, (e) component name.

### Section 1 — Hero Cinematic
- **Purpose:** Plant the thesis in one screen.
- **Emotional beat:** Warmth + authority.
- **Layout:** Split — left copy 55%, right media 45%. Full-height (min `100svh`). Transparent nav overlay.
- **Copy:**
  - H1: *Your parents deserve to age stronger — not just older.*
  - Sub: *Doctor-led programs for pain, diabetes, mobility & longevity — with family visibility built in.*
  - CTA primary: **Book Free Assessment**  · secondary: **See how it works ↓**
  - Micro trust row: "1,500+ families · 4.9★ · India-wide"
- **Media:** Looping muted MP4 (parent + child, 10–15s loop). Poster frame fallback. Under a warm gradient scrim.
- **Motion:** H1 word-by-word reveal (stagger 60ms); media fades + slight scale-in; scroll-hint chevron.
- **Component:** `HeroCinematic` in `src/components/home/`.

### Section 2 — Emotional Scroll Narrative
- **Purpose:** Name the pain before selling.
- **Emotional beat:** Recognition — "that's us."
- **Layout:** Pinned viewport with center text morphing through 4 states, then a resolve line.
- **Copy beats (sequential):**
  1. "They say they're fine."
  2. "But pain becomes routine."
  3. "Energy quietly fades."
  4. "And health slowly declines."
  5. **Resolve:** "Praan changes that story."
- **Motion:** GSAP ScrollTrigger pin, opacity + y crossfade between lines based on scroll progress. Background gently darkens toward the resolve line.
- **Component:** `EmotionalScroll`.

### Section 3 — ScrollStack Feature Deck ⭐
- **Purpose:** Show the product surface without a boring list.
- **Layout:** Use existing [ScrollStack](src/components/animated/ScrollStack.tsx). 5 cards.
- **Cards:**
  1. **Doctor-led Assessment** — MBBS + physio review within 48h.
  2. **Personalised Care Plan** — diet, movement, sleep, meds.
  3. **Daily Guided Sessions** — live + recorded.
  4. **Progress Dashboard** — sugar, pain, mobility trends.
  5. **Family Updates, Anywhere** — weekly WhatsApp digest.
- **Visual:** Each card has a left copy block + right mini-UI mock (sketchy, not real product screens yet — use Figma-style illustrations).
- **Component:** `FeatureStack` (wraps `ScrollStack`).

### Section 4 — Why Families Need This
- **Purpose:** Contrast Praan vs. doing-nothing / fragmented care.
- **Layout:** Two-column split. Left: emotional image (parent alone at home). Right: problem list → solution pivot.
- **Copy:** Problems as muted text ("skips checkups", "no routine", "ignores pain") → strike-through on scroll → replaced with "structured care > random advice".
- **Motion:** Strike-through animates on `whileInView`.
- **Component:** `WhyFamilies`.

### Section 5 — Metrics Reveal (Dark)
- **Purpose:** Proof via numbers.
- **Layout:** Full-bleed dark section (`#101010`) with ivory type. 4 counters in a row (stack on mobile).
- **Counters:**
  - 1,500+ Families
  - 50,000+ Sessions
  - 92% Consistency
  - 4.9 Avg Rating
- **Motion:** Count-up on enter (Framer Motion `useMotionValue` + `animate`). Subtle gold underline accent sweeps under active number.
- **Component:** `MetricsReveal`.

### Section 6 — Programs (Horizontal Scroll)
- **Purpose:** Let users find themselves.
- **Layout:** Horizontal scroll section pinned vertically — 5 program cards slide left as user scrolls down. Fallback on mobile: vertical stack.
- **Programs:**
  - Diabetes Reversal
  - Knee & Back Pain Recovery
  - Strength & Mobility 50+
  - Longevity Preventive
  - Weight Management
- **Motion:** GSAP ScrollTrigger horizontal pin. Each card: image + title + 2-line desc + "Learn more →".
- **Component:** `ProgramsHorizontal`.

### Section 7 — Dashboard Showcase
- **Purpose:** Show the "family visibility" moat.
- **Layout:** Sticky mockup on right, scrolling copy callouts on left that highlight different dashboard zones. Laptop-frame mockup.
- **Callouts:**
  - Sugar trend ↓
  - Session streak ✓
  - Pain score ↓
  - Weekly family digest
- **Headline:** *See their progress — without asking them every day.*
- **Motion:** Callouts fade-up & highlight a region of the mockup (overlayed glow rectangles).
- **Component:** `DashboardShowcase`.

### Section 8 — Testimonials Reel
- **Purpose:** Social proof with faces.
- **Layout:** Horizontal auto-scrolling marquee of video cards (muted, captioned). Click = unmute & expand.
- **Content:** 6–8 testimonials. Mix: NRI son, Bangalore daughter, parent direct-to-camera.
- **Component:** `TestimonialsReel`. Use `<video>` with `poster`, `playsInline`, `loop`, `muted`.

### Section 9 — Trust (Doctors + Press)
- **Purpose:** Final credibility stamp.
- **Layout:** Warm ivory section. 3 doctor cards (photo, name, creds). Below: monochrome press logo strip.
- **Component:** `TrustSection`.

### Section 10 — Final Emotional CTA
- **Purpose:** Convert.
- **Layout:** Full-bleed emerald. Giant display headline center.
- **Copy:** *They took care of you for years. Now it's your turn.* · **Book Free Consultation**
- **Motion:** Gentle parallax on background texture; button micro-interact on hover.
- **Component:** `FinalCTA`.

---

## 5. Global Shell

### 5.1 Navbar
- Sticky, transparent over hero, flips to blurred-white (`backdrop-blur-md bg-white/70`) once scrolled past 80px.
- Logo left · links center (Programs / Results / How it Works / About) · CTA right (**Book Assessment** pill).
- Mobile: hamburger → full-screen emerald sheet.
- **Component:** `SiteNav`.

### 5.2 Footer
- 3-column: brand + mission blurb · sitemap · contact (phone, email, WhatsApp).
- Legal row: © Praan Health · Privacy · Terms.
- **Component:** `SiteFooter`.

### 5.3 Smooth scroll wrapper
- Client component mounting a single Lenis instance on `<body>`, respecting `prefers-reduced-motion` and disabling on touch.
- **Component:** `SmoothScrollProvider`.

### 5.4 Sticky mobile CTA
- Bottom-fixed on mobile only, appears after scrolling past hero.
- **Component:** `MobileStickyCTA`.

---

## 6. Component Tree

```
src/
  app/
    layout.tsx                  # fonts, metadata, SmoothScrollProvider, SiteNav, SiteFooter
    page.tsx                    # composes homepage sections
    globals.css                 # Tailwind v4 @theme tokens
  components/
    ui/
      button.tsx                # extend with emerald & ghost-ivory variants
      container.tsx             # NEW — max-width wrapper
      eyebrow.tsx               # NEW — micro-label
    animated/
      ScrollStack.tsx           # existing
      SmoothScrollProvider.tsx  # NEW
      RevealText.tsx            # NEW — word-by-word fade-up
      Counter.tsx               # NEW — animated number
      MarqueeRow.tsx            # NEW — testimonial marquee
    layout/
      SiteNav.tsx               # NEW
      SiteFooter.tsx            # NEW
      MobileStickyCTA.tsx       # NEW
    home/
      HeroCinematic.tsx
      EmotionalScroll.tsx
      FeatureStack.tsx
      WhyFamilies.tsx
      MetricsReveal.tsx
      ProgramsHorizontal.tsx
      DashboardShowcase.tsx
      TestimonialsReel.tsx
      TrustSection.tsx
      FinalCTA.tsx
  lib/
    motion.ts                   # shared easings, variants
    cn.ts                       # existing
  content/
    home.ts                     # ALL copy lives here — easy to tweak without touching JSX
    programs.ts
    testimonials.ts
    doctors.ts
```

**Content-as-data rule:** every string visible on the homepage lives in `src/content/*.ts`. Components consume from there. Makes future CMS migration trivial.

---

## 7. Tech Decisions

| Concern | Decision | Why |
|---|---|---|
| Smooth scroll | Lenis, desktop only | Already installed; plays well with GSAP ScrollTrigger |
| Section-level motion | Framer Motion `whileInView` | Declarative, low code |
| Complex pinning / horizontal | GSAP ScrollTrigger | Industry standard for these patterns |
| ScrollStack cards | Existing component | Don't reinvent |
| Fonts | `next/font/google` (Inter) + local Clash Display | Avoid FOUT, self-host display face |
| Images | `next/image` w/ AVIF/WebP, blur placeholders | Core Web Vitals |
| Video | Self-hosted MP4 (H.264) in `/public/video/` — <2MB hero loop | No 3rd-party dependency |
| Icons | `lucide-react` | Already installed |
| Forms / booking | Phase 1: link out to Calendly; Phase 2: custom | Ship faster |
| Analytics | Defer to Phase 2 (likely PostHog or Plausible) | Not blocking |
| CMS | None for Phase 1; local content files | Speed |

**No new dependencies** for Phase 1. Everything needed is in `package.json`.

---

## 8. Copy Principles

- Short sentences. Max 12 words per headline.
- Use "your parents", not "elderly" or "senior citizens".
- Never say "patients" — say "members" or "families".
- Active voice. Present tense.
- Avoid medical jargon unless trust-building (e.g., "HbA1c tracked weekly" is fine in dashboard section).
- Tamil / Hindi phrase tastefully in one testimonial quote is acceptable; nowhere else.

---

## 9. Accessibility & Performance Budget

- Lighthouse mobile targets: Perf ≥ 85, A11y ≥ 95, SEO ≥ 95.
- All motion gated on `prefers-reduced-motion`.
- Color contrast: 4.5:1 minimum for body text.
- Every `<video>` has captions track and `aria-label`.
- Keyboard: nav, CTAs, horizontal scroll section must work without mouse.
- Hero LCP image/video <200KB compressed poster + lazy video.
- Fonts preloaded; no CLS.

---

## 10. SEO & Metadata

- Title: `Praan Health — Premium Longevity Care for Parents`
- Description: 155ch, benefit-led, contains "doctor-led" and "parents".
- OG image: custom 1200×630 — emerald bg, display type, one real photo.
- `robots.txt` + `sitemap.xml` via Next 16 conventions (confirm exact API).
- Schema.org `MedicalBusiness` JSON-LD in layout.

---

## 11. Asset Checklist (to source before build)

- [ ] Hero loop video (10–15s, 1080p, <2MB)
- [ ] Hero poster still (1920×1080)
- [ ] 5× program cover images (square, 1:1, 800px)
- [ ] 3× doctor portraits (800×1000, warm tone)
- [ ] Dashboard mockup (designed in Figma → exported as layered PNG/SVG)
- [ ] 6× testimonial videos (720p, <10MB each, captioned)
- [ ] 6–8× press/partner logos (SVG, monochrome)
- [ ] Brand logo lockup (SVG, light + dark)
- [ ] OG image (1200×630)
- [ ] Favicon set

Missing assets in Phase 1 = use tasteful placeholders from Unsplash (warm, real elderly Indian people) + Figma-built UI mockups. Every placeholder tagged `TODO: replace asset`.

---

## 12. Build Sequence (when we move to implementation)

1. **Foundations** — read Next 16 docs for fonts/metadata/image; set tokens in `globals.css`; build `Container`, extend `Button`, add `Eyebrow`, `RevealText`, `Counter`.
2. **Shell** — `SmoothScrollProvider`, `SiteNav`, `SiteFooter`, `MobileStickyCTA`; wire into `layout.tsx`.
3. **Content layer** — populate `src/content/*.ts`.
4. **Section 1 (Hero)** — ship first, get directional sign-off before continuing.
5. **Sections 2 → 10** — in order; each section reviewed as a standalone deliverable.
6. **Polish pass** — reduced-motion audit, Lighthouse run, keyboard test, mobile pass.
7. **Sign-off** — deploy preview, gather feedback, iterate.

Every step ends with a visual review. No batch building.

---

## 13. Explicit Non-Goals (Phase 1)

- Auth, user accounts, member dashboard.
- Payments / checkout.
- CMS integration.
- Blog.
- Multi-language (English only).
- Internal tooling / admin.
- Program detail pages (stubbed link only).
- A/B testing framework.

---

## 14. Open Questions (block before coding)

1. **Brand name lockup** — do we have a logo SVG, or should we typeset "Praan" in Clash Display for now?
2. **Hero video** — supplied, or use a placeholder Pexels clip?
3. **Doctor photos & names** — real team to feature, or placeholder cards?
4. **Metrics** — are 1,500 families / 50,000 sessions / 92% / 4.9 the real verified numbers, or directional?
5. **Booking flow** — Calendly link available? If yes, share URL.
6. **WhatsApp number** for sticky CTA — share number.
7. **Testimonials** — any existing video clips, or mocked for Phase 1?
8. **Domain / deployment target** — Vercel? Custom domain?

**Recommendation:** proceed with tasteful placeholders where answers are pending, clearly marked as `TODO`. Do not let missing assets block shell + motion work.

---

## 15. Success Criteria for Phase 1

A visitor on desktop, scrolling top → bottom, should:

1. In **3 seconds**, understand this is for their parents and feels premium.
2. By Section 3, have seen at least one "oh, that's cool" animation moment.
3. By Section 5, believe the numbers.
4. By Section 8, have seen real faces.
5. Reach Section 10 with clear intent to click the final CTA.

And on mobile: the same story, condensed, with a sticky CTA always one thumb-tap away.

---

## Next step

Once open questions in §14 are answered (even partially), proceed to Step 1 of §12 — **Foundations**. Start with reading `node_modules/next/dist/docs/` for the Next 16 APIs we'll touch, then lock the design tokens in `globals.css`.
