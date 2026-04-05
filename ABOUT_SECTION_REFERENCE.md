# About page migration reference — ServicesSection & ProcessSection

This document reverse-engineers **`ServicesSection`** and **`ProcessSection`** from the legacy portfolio (`port-front`) for a future migration into a new project’s **About** page. It intentionally **excludes Framer Motion and scroll/hover motion behaviors** from the migration target; those are listed separately for awareness.

---

## 1. Overview

### What `ServicesSection` is

A **three-column services grid** that presents core offerings as elevated **glassmorphism-style cards**. Each card has a **stroke icon** in a rounded square, **subtitle + title + body copy**, and a row of **technology tags** (chips). A **soft radial wash** sits behind the section. It communicates breadth of expertise (full-stack, 3D web, UI/UX) in a scannable, premium layout.

### What `ProcessSection` is

A **four-step workflow** (“Discovery → Design → Build → Deploy”) rendered as a **horizontal timeline on desktop** (with a connector line through the step nodes) and a **vertical stack on mobile** (with short vertical gradient connectors between steps). Each step uses a **circular glass node** with an inline SVG icon, a **mono “STEP 01” label**, title, and description.

### Role on the old Home page

Both live on **`src/pages/Home.tsx`**, inside a single **`Suspense`** boundary with other below-fold sections, **after** `WhatIDoSection` and **before** `TechMarquee`:

1. `WhatIDoSection`
2. **`ServicesSection`**
3. **`ProcessSection`**
4. `TechMarquee`

They are **lazy-loaded** (code-split) with the rest of that group. On the marketing narrative, **Services** answers *what* you deliver; **Process** answers *how* you work—natural **About** page material.

---

## 2. Source files

| Kind | Path |
|------|------|
| **ServicesSection** | `src/components/public/ServicesSection.tsx` |
| **ProcessSection** | `src/components/public/ProcessSection.tsx` |
| **Home composition** | `src/pages/Home.tsx` (lazy imports + order) |

### Shared dependencies (not separate React components)

| Dependency | Path | Usage |
|------------|------|--------|
| **Global theme variables** | `src/index.css` (`[data-theme="dark"]`) | `--color-primary`, `--color-accent`, `--color-border`, `--color-surface`, `--color-surface-2`, `--color-text`, `--color-text-muted`, fonts |
| **Utility classes** | `src/index.css` | `.text-gradient` (headline accent word), `.glass` (Process step circles) |
| **Tailwind theme bridge** | `tailwind.config.ts` | Maps `primary`, `accent`, `text`, `text-muted`, `border`, `surface-2`, etc. to `rgb(var(--color-*) / <alpha-value>)` |

### Constants / content

- **All** service and process **copy, icons, and styling tokens** are **co-located** in the same files as the components (`ICONS`, `SERVICE_META`, `STEP_ICONS`, `STEPS`). There is **no** external `constants/` or `content/` file for these sections.

### Icons / helpers

- **Inline SVG** elements only (no `lucide-react` or icon components).
- **Services**: `ICONS` map (`fullstack`, `web3d`, `uiux`) embedded in `ServicesSection.tsx`.
- **Process**: `STEP_ICONS` array of four SVGs in `ProcessSection.tsx`.

---

## 3. Visual purpose

### ServicesSection

| Aspect | Description |
|--------|-------------|
| **Communicates** | Three pillars of work with concrete tech stacks. |
| **Why it exists** | Converts abstract “full stack / 3D / design” into **card-sized proof** with tags. |
| **Hierarchy** | Eyebrow → large H2 (one gradient word) → muted intro line → **three equal cards** (no single hero card). |

### ProcessSection

| Aspect | Description |
|--------|-------------|
| **Communicates** | A **linear, trustworthy methodology** from discovery to deploy. |
| **Why it exists** | Reduces perceived risk by showing **structure** after **capabilities** (Services). |
| **Hierarchy** | Same header pattern as Services → **four equal steps** tied together by a **spine** (line) on large screens. |

---

## 4. Layout structure

### ServicesSection

| Layer | Classes / notes |
|-------|------------------|
| **Outer `<section>`** | `py-28 relative overflow-hidden` — vertical section rhythm, positioning context for background wash. |
| **Background wash** | `absolute inset-0 pointer-events-none` — radial gradient: `ellipse 60% 50% at 80% 50%`, `rgb(var(--color-accent)/0.06)` → transparent. |
| **Inner container** | `container mx-auto px-6 max-w-6xl` — centered, horizontal padding, **max width 72rem** (`max-w-6xl`). |
| **Header block** | `text-center mb-16` — centered stack, **4rem** margin below before grid. |
| **Grid** | `grid md:grid-cols-3 gap-6` — **1 column** default, **3 columns** from `md` up; **1.5rem** gap. |

**Card (each service)**  
`group relative rounded-2xl p-7 flex flex-col gap-5 cursor-default overflow-hidden` + inline `background` (diagonal gradient), `border`, `backdropFilter` / `WebkitBackdropFilter` blur **16px**.

**Responsive behavior**

- Below `md`: single column, full width of container.
- `md` and up: three equal columns.

**Spacing rhythm**

- Section: `py-28` (7rem top/bottom).
- Header to grid: `mb-16`.
- Card interior: `p-7`, vertical rhythm `gap-5` between icon block, text block, and tags.

### ProcessSection

| Layer | Classes / notes |
|-------|------------------|
| **Outer `<section>`** | `py-28 relative overflow-hidden` (same vertical rhythm as Services). |
| **Background wash** | `absolute inset-0 pointer-events-none` — radial: `ellipse 70% 60% at 20% 50%`, `rgb(var(--color-primary)/0.05)` → transparent. |
| **Inner container** | `container mx-auto px-6 max-w-6xl` (identical to Services). |
| **Header block** | `text-center mb-16`. |
| **Steps wrapper** | `relative` — contains absolutely positioned **desktop connector**. |
| **Desktop connector** | `hidden md:block absolute top-[2.8rem] left-[calc(12.5%+1.75rem)] right-[calc(12.5%+1.75rem)] h-px` — horizontal **1px** line aligned with icon row; inset from edges using **12.5% + 1.75rem** to visually line up with a **4-column** grid’s node centers. |
| **Grid** | `grid md:grid-cols-4 gap-8 relative` — **4 columns** on `md+`, **1 column** on small screens; **2rem** gap. |

**Each step column**  
`flex flex-col items-center text-center group`.

**Mobile vertical connector**  
Between steps (not after last): `md:hidden w-px h-8 mb-6` with vertical linear gradient (primary → accent).

**Responsive behavior**

- Mobile: stacked steps, **vertical** gradient bars between items.
- Desktop: **four** columns, **horizontal** gradient spine behind icons.

**Description width**  
`max-w-[220px] md:max-w-none` — caps line length on small screens, full column width on desktop.

---

## 5. Section header treatment

There is **no** shared `SectionHeader` React component. Both sections repeat the **same pattern**:

| Element | Markup pattern | Styling |
|---------|----------------|---------|
| **Eyebrow** | `<p>` | `text-xs font-mono uppercase tracking-[0.25em] text-primary mb-3` |
| **Title** | `<h2>` | `text-3xl md:text-4xl font-bold text-text mb-4` — contains one `<span className="text-gradient">` for the emphasized word |
| **Subtitle** | `<p>` | `text-text-muted max-w-xl mx-auto leading-relaxed` |

**Services** eyebrow text: `Services`. Title: `What I` + gradient `Offer`.  
**Process** eyebrow: `Workflow`. Title: `How I` + gradient `Work`.

**`.text-gradient`** (from `src/index.css`): `linear-gradient(135deg, rgb(var(--color-primary)), rgb(var(--color-accent)))` with `background-clip: text` and transparent fill — **indigo → purple** on the accent word.

---

## 6. ServicesSection breakdown

### Cards

- **Count:** 3 (from `SERVICE_META.map`).
- **Shape:** `rounded-2xl`, heavy padding `p-7`, column flex with `gap-5`.
- **Surface:** `linear-gradient(135deg, gradientFrom, gradientTo)` per service + **frosted** effect via `backdrop-filter: blur(16px)` (and webkit prefix).
- **Default border:** `1px solid rgb(var(--color-border) / 0.5)` (inline style).

### Icon treatment

- **Container:** `w-14 h-14 rounded-xl flex items-center justify-center` with `transition-transform duration-300 group-hover:scale-110`.
- **Icon container background:** Same 135° gradient as card (`gradientFrom` → `gradientTo`).
- **Icon container border:** `1px solid` using each service’s `borderHover` color.
- **Icon size:** SVG `className="w-7 h-7"`; stroke icons `strokeWidth="1.5"`, round caps/joins.

### Title stack

- **Subtitle** (above title): `text-xs font-mono tracking-widest uppercase mb-1`, color = `service.iconColor`.
- **Title:** `h3` `text-xl font-bold text-text mb-3`.
- **Description:** `text-sm text-text-muted leading-relaxed`.

### Tags / chips

- **Container:** `flex flex-wrap gap-2`.
- **Chip:** `span` with `text-xs font-mono px-3 py-1 rounded-full transition-colors duration-200`.
- **Chip surface:** `background: rgb(var(--color-surface-2) / 0.8)`, `color: rgb(var(--color-text-muted))`, `border: 1px solid rgb(var(--color-border) / 0.4)`.

### Gradients / glows / borders

- **Per-card gradient** comes from `SERVICE_META` (`gradientFrom` / `gradientTo`). First two services use **CSS variables**; third uses **fixed pink** `rgba(244, 114, 182, …)` for a third accent lane.
- **Hover (JS):** `onMouseEnter` sets `borderColor` to `borderHover` and `boxShadow` to `0 0 24px ${glowColor}`; `onMouseLeave` clears both. **`glowColor`** is keyed to primary, accent, or pink per card.

### Responsive behavior

- Grid collapses to one column below `md`; chips wrap naturally.

---

## 7. ProcessSection breakdown

### Steps layout

- **4 steps**, `md:grid-cols-4`, each column **center-aligned** text and icons.

### Numbering style

- Label format: `STEP {number}` where `number` is `'01'` … `'04'` from data.
- Typography: `text-xs font-mono tracking-[0.2em] mb-2`.
- Color: steps **0–1** use **primary** RGB; steps **2–3** use **accent** RGB (matches icon circle split).

### Connector line / spine

- **Desktop:** Single horizontal rule, **gradient** left→right: `linear-gradient(90deg, rgb(var(--color-primary)/0.4), rgb(var(--color-accent)/0.4))`.
- **Mobile:** Vertical `w-px h-8` between steps with `linear-gradient(180deg, primary 0.4, accent 0.3)`.

### Circles / panels

- **Outer wrapper:** `relative mb-6 z-10` around the circle.
- **Hover glow (behind circle):** Absolutely positioned `rounded-full`, radial gradient `rgb(var(--color-primary)/0.25)` fading to transparent, `scale(1.8)`, `opacity-0` → `group-hover:opacity-100`, `transition-opacity duration-300`. *(CSS transition, not Framer.)*
- **Circle:** `w-14 h-14 rounded-full flex items-center justify-center relative glass border transition-all duration-300 group-hover:scale-110`.
- **Circle border/background/icon color:** Index `i < 2` → **primary** family; else **accent** family (135° linear gradient fills, semi-transparent).
- **`.glass`** adds base frosted surface + border (see §8).

### Title & description

- **Title:** `h3` `text-lg font-bold text-text mb-3`.
- **Description:** `text-sm text-text-muted leading-relaxed` with responsive max-width as in §4.

### Responsive behavior

- Connector line hidden on small screens; vertical segments shown instead.
- Four columns only from `md` breakpoint up.

---

## 8. Design system extraction (relevant to these sections only)

### Colors (CSS variables — dark theme)

Defined on `[data-theme="dark"]` in `src/index.css`:

| Token | RGB tuple (space-separated) | Role in these sections |
|-------|----------------------------|-------------------------|
| `--color-primary` | `129 140 248` | Eyebrow (`text-primary`), primary-tinted gradients, process steps 1–2, left side of connectors |
| `--color-accent` | `192 132 252` | Gradient text stop, accent-tinted cards/connectors, process steps 3–4 |
| `--color-text` | `240 244 255` | Headings `text-text` |
| `--color-text-muted` | `148 163 184` | Body copy, chip text |
| `--color-border` | `51 65 85` | Default card border, chip border |
| `--color-surface` | `30 41 59` | `.glass` background base |
| `--color-surface-2` | `51 65 85` | Chip backgrounds |

**Third service lane:** explicit **pink** `#f472b6` / `rgba(244, 114, 182, …)` — not from `--color-accent`.

### Gradients

- **Text accent:** 135° primary → accent (`.text-gradient`).
- **Services cards:** 135° from/to per meta (variable or pink).
- **Services radial wash:** accent at **80% 50%**, low alpha.
- **Process radial wash:** primary at **20% 50%**, low alpha.
- **Process horizontal spine:** 90deg primary → accent (horizontal).
- **Process mobile spine:** 180deg primary → accent (vertical).
- **Process icon circles:** 135° tinted fills from primary or accent.

### Border style

- Default: **1px** semi-transparent `border` token.
- Cards: `rgb(var(--color-border) / 0.5)` baseline; hover strengthens to meta `borderHover`.

### Card / surface style

- **Services:** gradient fill + **16px** backdrop blur + rounded **2xl**.
- **Process circles:** **`.glass`** (≈70% surface opacity, 16px blur, border) + inline gradient overlay and colored border.

### Chip / tag style

- Pill: `rounded-full`, mono **xs**, horizontal padding **0.75rem**, vertical **0.25rem**, muted surface + subtle border.

### Typography scale (these sections)

| Use | Classes |
|-----|---------|
| Eyebrow | `text-xs font-mono uppercase tracking-[0.25em]` |
| Section H2 | `text-3xl md:text-4xl font-bold` |
| Service H3 | `text-xl font-bold` |
| Process H3 | `text-lg font-bold` |
| Body (cards/steps) | `text-sm` + `leading-relaxed` |
| Step label | `text-xs font-mono tracking-[0.2em]` |

**Fonts:** `Inter` (main), `JetBrains Mono` (mono) via CSS variables.

### Spacing system

- Section vertical: **`py-28`**.
- Header margin below: **`mb-16`**.
- Services grid gap: **`gap-6`**; Process grid gap: **`gap-8`**.
- Card padding: **`p-7`**; internal **`gap-5`**.

### Max width

- Content: **`max-w-6xl`** inside `container mx-auto px-6`.
- Header blurb: **`max-w-xl`** centered.
- Process descriptions (mobile): **`max-w-[220px]`**.

---

## 9. Data / content structures

### `SERVICE_META` — `src/components/public/ServicesSection.tsx`

Array of **3** objects:

| Field | Type | Meaning |
|-------|------|---------|
| `id` | `'fullstack' \| '3dweb' \| 'uiux'` (const) | React `key` and identity |
| `subtitle` | `string` | Short line above title (mono, uppercase styling) |
| `title` | `string` | Card heading |
| `description` | `string` | Body paragraph |
| `tags` | `string[]` | Tech labels rendered as chips |
| `gradientFrom` / `gradientTo` | CSS color string | Card + icon tray 135° gradient stops |
| `glowColor` | CSS color string | Box-shadow color on hover |
| `borderHover` | CSS color string | Icon tray border + hover card border |
| `iconColor` | CSS color string | SVG `currentColor` target via wrapper + subtitle color |
| `icon` | `ReactNode` | Prebuilt SVG from `ICONS` |

### `ICONS` — same file

Keys: **`fullstack`**, **`web3d`**, **`uiux`** — each value is an inline `<svg>`.

### `STEPS` — `src/components/public/ProcessSection.tsx`

Array of **4** objects:

| Field | Type | Meaning |
|-------|------|---------|
| `number` | `string` | Displayed as `STEP 01` etc. |
| `icon` | `ReactNode` | Entry from `STEP_ICONS` |
| `title` | `string` | Step heading |
| `description` | `string` | Step body |

### `STEP_ICONS` — same file

**Fixed-length array of 4** inline SVGs (`w-5 h-5`), order matches `STEPS`.

---

## 10. Excluded animation notes

All of the following are **present in the old implementation** and are **out of scope for the current migration pass** (implement as static layout first; reintroduce later if desired).

### Framer Motion (`framer-motion`)

| Location | Behavior |
|----------|----------|
| **ServicesSection** | Header `motion.div`: `initial` opacity/y, `whileInView` reveal, `viewport` once ~10% visible, 0.6s transition. |
| **ServicesSection** | Grid `motion.div`: `variants` container with **staggerChildren 0.15s**; each card `variants` fade/slide up (opacity, y: 40→0, 0.6s easeOut). |
| **ServicesSection** | Per-card **`whileHover={{ y: -6 }}`** over 0.25s (lift on hover). |
| **ProcessSection** | Header: same pattern as Services (opacity/y, whileInView). |
| **ProcessSection** | Container: **staggerChildren 0.18s**; each step **fade + y: 30→0**, 0.55s easeOut. |

### Non-Framer interaction (still “motion” in a broad sense)

Document for parity; you may keep as **CSS-only** in the new project without Framer:

| Location | Behavior |
|----------|----------|
| **ServicesSection** | `group-hover:scale-110` on icon tray; **`onMouseEnter` / `onMouseLeave`** for border color + **24px glow** shadow. |
| **ProcessSection** | `group-hover:scale-110` on step circle; radial **hover glow** behind circle (opacity transition); connector lines are static. |

**3D:** Neither section imports Three.js or Spline; **no 3D** in these files.

---

## 11. Code appendix

### 11.1 Required global CSS (`src/index.css` excerpts)

These utilities are **required** for visual parity (theme must set variables on a parent, e.g. `[data-theme="dark"]`).

```css
/* Theme fragment — full block lives under [data-theme="dark"] */
--color-primary:    129 140 248;
--color-bg:          15  23  42;
--color-surface:     30  41  59;
--color-surface-2:   51  65  85;
--color-text:       240 244 255;
--color-text-muted: 148 163 184;
--color-accent:     192 132 252;
--color-border:      51  65  85;
--font-main: 'Inter';
--font-mono: 'JetBrains Mono';

.glass {
  background: rgb(var(--color-surface) / 0.7);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgb(var(--color-border) / 0.5);
}

.text-gradient {
  background: linear-gradient(
    135deg,
    rgb(var(--color-primary)),
    rgb(var(--color-accent))
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

### 11.2 Tailwind color bridge (`tailwind.config.ts` excerpt)

```ts
colors: {
  primary: 'rgb(var(--color-primary) / <alpha-value>)',
  bg: 'rgb(var(--color-bg) / <alpha-value>)',
  surface: 'rgb(var(--color-surface) / <alpha-value>)',
  'surface-2': 'rgb(var(--color-surface-2) / <alpha-value>)',
  text: 'rgb(var(--color-text) / <alpha-value>)',
  'text-muted': 'rgb(var(--color-text-muted) / <alpha-value>)',
  accent: 'rgb(var(--color-accent) / <alpha-value>)',
  border: 'rgb(var(--color-border) / <alpha-value>)',
},
fontFamily: {
  sans: ['var(--font-main)', 'Inter', 'system-ui', 'sans-serif'],
  mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
},
```

### 11.3 `ServicesSection.tsx` — **static migration stub** (no `framer-motion`)

Below: same layout, gradients, chips, and JS hover border/glow as the original, but **`motion.*` removed** and **no `whileHover` lift**. Replace `div` wrappers if you re-add animation later.

```tsx
// ServicesSection.static.tsx — migration stub (no framer-motion)
const ICONS = {
  fullstack: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  web3d: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  ),
  uiux: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
    </svg>
  ),
}

const SERVICE_META = [
  {
    id: 'fullstack' as const,
    subtitle: 'End-to-end web applications',
    title: 'Full-Stack Development',
    description:
      'From database schema to pixel-perfect UI, I architect and deliver complete products. Clean APIs, reactive frontends, and infrastructure that scales.',
    tags: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
    gradientFrom: 'rgb(var(--color-primary) / 0.15)',
    gradientTo: 'rgb(var(--color-primary) / 0.03)',
    glowColor: 'rgb(var(--color-primary) / 0.18)',
    borderHover: 'rgb(var(--color-primary) / 0.4)',
    iconColor: 'rgb(var(--color-primary))',
    icon: ICONS.fullstack,
  },
  {
    id: '3dweb' as const,
    subtitle: 'Immersive digital experiences',
    title: '3D Web & WebGL',
    description:
      'Interactive 3D scenes and real-time animations that turn websites into experiences. Three.js, React Three Fiber, WebGL shaders, and Spline integration.',
    tags: ['Three.js', 'React Three Fiber', 'WebGL', 'Spline'],
    gradientFrom: 'rgb(var(--color-accent) / 0.15)',
    gradientTo: 'rgb(var(--color-accent) / 0.03)',
    glowColor: 'rgb(var(--color-accent) / 0.18)',
    borderHover: 'rgb(var(--color-accent) / 0.4)',
    iconColor: 'rgb(var(--color-accent))',
    icon: ICONS.web3d,
  },
  {
    id: 'uiux' as const,
    subtitle: 'Design systems & user experience',
    title: 'UI / UX Design',
    description:
      'Intuitive interfaces built on solid design systems. Token-based theming, motion design, and accessibility-first component architecture.',
    tags: ['Figma', 'Tailwind CSS', 'Framer Motion', 'A11y'],
    gradientFrom: 'rgba(244, 114, 182, 0.15)',
    gradientTo: 'rgba(244, 114, 182, 0.03)',
    glowColor: 'rgba(244, 114, 182, 0.18)',
    borderHover: 'rgba(244, 114, 182, 0.4)',
    iconColor: '#f472b6',
    icon: ICONS.uiux,
  },
]

export function ServicesSection() {
  return (
    <section className="py-28 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 80% 50%, rgb(var(--color-accent)/0.06), transparent)' }}
      />

      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-16">
          <p className="text-xs font-mono uppercase tracking-[0.25em] text-primary mb-3">Services</p>
          <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">
            What I <span className="text-gradient">Offer</span>
          </h2>
          <p className="text-text-muted max-w-xl mx-auto leading-relaxed">
            Three core service pillars, each backed by years of hands-on production experience and a relentless focus on quality.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {SERVICE_META.map(service => (
            <div
              key={service.id}
              className="group relative rounded-2xl p-7 flex flex-col gap-5 cursor-default overflow-hidden transition-[border-color,box-shadow] duration-300"
              style={{
                background: `linear-gradient(135deg, ${service.gradientFrom}, ${service.gradientTo})`,
                border: '1px solid rgb(var(--color-border) / 0.5)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
              }}
              onMouseEnter={e => {
                ;(e.currentTarget as HTMLElement).style.borderColor = service.borderHover
                ;(e.currentTarget as HTMLElement).style.boxShadow = `0 0 24px ${service.glowColor}`
              }}
              onMouseLeave={e => {
                ;(e.currentTarget as HTMLElement).style.borderColor = ''
                ;(e.currentTarget as HTMLElement).style.boxShadow = ''
              }}
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                style={{
                  background: `linear-gradient(135deg, ${service.gradientFrom}, ${service.gradientTo})`,
                  border: `1px solid ${service.borderHover}`,
                  color: service.iconColor,
                }}
              >
                {service.icon}
              </div>

              <div className="flex-1">
                <p className="text-xs font-mono tracking-widest uppercase mb-1" style={{ color: service.iconColor }}>
                  {service.subtitle}
                </p>
                <h3 className="text-xl font-bold text-text mb-3">{service.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{service.description}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {service.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-xs font-mono px-3 py-1 rounded-full transition-colors duration-200"
                    style={{
                      background: 'rgb(var(--color-surface-2) / 0.8)',
                      color: 'rgb(var(--color-text-muted))',
                      border: '1px solid rgb(var(--color-border) / 0.4)',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

### 11.4 `ProcessSection.tsx` — **static migration stub** (no `framer-motion`)

```tsx
// ProcessSection.static.tsx — migration stub (no framer-motion)
const STEP_ICONS = [
  (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  ),
  (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M22 2L11 13" />
      <path d="M22 2L15 22 11 13 2 9l20-7z" />
    </svg>
  ),
]

const STEPS = [
  {
    number: '01',
    icon: STEP_ICONS[0]!,
    title: 'Discovery',
    description:
      'Deep-dive into goals, users, and constraints. Competitive research, architecture planning, and scope definition — before writing a single line of code.',
  },
  {
    number: '02',
    icon: STEP_ICONS[1]!,
    title: 'Design',
    description:
      'Wireframes, component libraries, and design tokens. Establishing the visual language and interaction patterns before the build phase begins.',
  },
  {
    number: '03',
    icon: STEP_ICONS[2]!,
    title: 'Build',
    description:
      'Full-stack development with clean, maintainable code. Iterative delivery with continuous feedback, code reviews, and integration testing throughout.',
  },
  {
    number: '04',
    icon: STEP_ICONS[3]!,
    title: 'Deploy',
    description:
      'CI/CD pipelines, monitoring, and a smooth launch. Post-deployment performance tuning, observability setup, and ongoing support as the product grows.',
  },
]

export function ProcessSection() {
  return (
    <section className="py-28 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 20% 50%, rgb(var(--color-primary)/0.05), transparent)' }}
      />

      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-16">
          <p className="text-xs font-mono uppercase tracking-[0.25em] text-primary mb-3">Workflow</p>
          <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">
            How I <span className="text-gradient">Work</span>
          </h2>
          <p className="text-text-muted max-w-xl mx-auto leading-relaxed">
            A structured, transparent process from first conversation to production launch — and everything in between.
          </p>
        </div>

        <div className="relative">
          <div
            className="hidden md:block absolute top-[2.8rem] left-[calc(12.5%+1.75rem)] right-[calc(12.5%+1.75rem)] h-px pointer-events-none"
            style={{ background: 'linear-gradient(90deg, rgb(var(--color-primary)/0.4), rgb(var(--color-accent)/0.4))' }}
            aria-hidden="true"
          />

          <div className="grid md:grid-cols-4 gap-8 relative">
            {STEPS.map((step, i) => (
              <div key={step.number} className="flex flex-col items-center text-center group">
                <div className="relative mb-6 z-10">
                  <div
                    className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `radial-gradient(circle, rgb(var(--color-primary)/0.25), transparent 70%)`,
                      transform: 'scale(1.8)',
                    }}
                  />
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center relative glass border transition-all duration-300 group-hover:scale-110"
                    style={{
                      borderColor: i < 2 ? 'rgb(var(--color-primary)/0.5)' : 'rgb(var(--color-accent)/0.5)',
                      background: i < 2
                        ? 'linear-gradient(135deg, rgb(var(--color-primary)/0.15), rgb(var(--color-primary)/0.05))'
                        : 'linear-gradient(135deg, rgb(var(--color-accent)/0.15), rgb(var(--color-accent)/0.05))',
                      color: i < 2 ? 'rgb(var(--color-primary))' : 'rgb(var(--color-accent))',
                    }}
                  >
                    {step.icon}
                  </div>
                </div>

                {i < STEPS.length - 1 && (
                  <div
                    className="md:hidden w-px h-8 mb-6"
                    style={{ background: 'linear-gradient(180deg, rgb(var(--color-primary)/0.4), rgb(var(--color-accent)/0.3))' }}
                    aria-hidden="true"
                  />
                )}

                <p
                  className="text-xs font-mono tracking-[0.2em] mb-2"
                  style={{ color: i < 2 ? 'rgb(var(--color-primary))' : 'rgb(var(--color-accent))' }}
                >
                  STEP {step.number}
                </p>
                <h3 className="text-lg font-bold text-text mb-3">{step.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed max-w-[220px] md:max-w-none">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
```

---

## 12. Migration guidance

### Preserve exactly

- **Header pattern** (eyebrow / H2 + `text-gradient` word / muted subcopy) and **typography classes**.
- **`max-w-6xl` + `container` + `px-6` + `py-28` + `mb-16`** section rhythm.
- **`SERVICE_META` / `STEPS` structure** and **inline SVG** assets.
- **Gradient math** on cards, circles, background washes, and connector lines (including **primary vs accent split** at step index 2).
- **Chip** and **glass circle** styling tokens (borders, surface-2 chips, `.glass` definition).
- **Tailwind ↔ CSS variable** mapping for `text-primary`, `text-text`, `text-text-muted`, etc.

### Can be adapted

- **Lazy loading / Suspense**: optional on About; was a Home performance choice.
- **JS hover** on service cards: can move to **pure CSS** (`:hover`) for border/shadow if you want fewer DOM listeners.
- **Copy** and **tag lists**: expected to change per portfolio; keep field shape for easy content swaps.
- **Third-card pink lane**: could be re-mapped to a theme token later for stricter design-system purity.

### Exclude for now (per this doc)

- All **`framer-motion`** imports, **`motion.*` elements**, **`variants`**, **`whileInView`**, **`whileHover` y-lift**, and **stagger** timings.
- Any future **3D** embeds — not part of these components.

### Fitting an About page in a new project

- **Order suggestion:** Short intro / bio → **`ServicesSection`** (what you offer) → **`ProcessSection`** (how you work) → testimonials or CTA. Mirrors the old Home narrative after “What I Do.”
- **Theming:** Ensure the new app root applies the same **CSS variables** (or equivalent) and includes **`.text-gradient`** and **`.glass`** (or Tailwind `@apply` equivalents).
- **Single page vs routes:** Both sections are **self-contained**; they can be composed as `<ServicesSection />` and `<ProcessSection />` on one About route or split with anchors.

---

*Generated from the `port-front` codebase. UI was not modified.*
