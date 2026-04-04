# DA42 LMS Anti-AI-Slop Design Guide
## Aviation-Grade Interface Design System

This document defines the visual language for the DA42 LMS. The goal is an interface
that looks like it was designed by aviation professionals -- dense, precise, functional,
and unmistakably human-crafted. Not another purple-gradient SaaS template.

---

## Part 1: What to Eliminate (AI-Slop Patterns)

These are the specific visual markers that signal "an AI made this." Every one of
them must be identified and removed or replaced.

### 1.1 The AI Color Palette (AVOID)

```css
/* THE AI SLOP PALETTE -- do not use */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);  /* purple-blue gradient */
color: #9CA3AF;          /* generic gray text */
background: #0F172A;     /* Tailwind slate-900 dark mode */
accent: #A855F7;         /* purple-violet */
accent: #38BDF8;         /* cyan-on-dark-mode */
accent: #818CF8;         /* indigo glow */
```

Why it happens: LLMs are statistical pattern matchers trained on Tailwind tutorials
from 2019-2024. When you ask for "dark mode dashboard," you get the median of every
Dribbble shot scraped from the internet: dark blue background, purple accents, cyan highlights.

### 1.2 Glassmorphism / Frosted Glass (AVOID)

```css
/* THE AI GLASS CARD -- do not use */
backdrop-filter: blur(10px);
background: rgba(255, 255, 255, 0.1);
border: 1px solid rgba(255, 255, 255, 0.2);
border-radius: 1rem;     /* or worse, 9999px */
```

Glass effects are the single biggest tell of AI-generated UI in 2025-2026. They add
visual noise without communicating information. Real cockpit instruments do not frost.

### 1.3 Border-Radius Abuse (AVOID)

| Value | Usage | Verdict |
|-------|-------|---------|
| `rounded-full` / `9999px` | Pills everywhere | NEVER except actual avatar circles |
| `rounded-xl` / `12px` | Cards, containers | AVOID -- too soft |
| `rounded-2xl` / `16px` | Hero sections | AVOID -- marshmallow aesthetic |
| `rounded-lg` / `8px` | Generic everything | AVOID as default |

### 1.4 Typography Red Flags (AVOID)

- Inter as the only font (it is the default of defaults)
- Roboto, Open Sans, Arial as body text
- No monospace anywhere in a data-heavy app
- All headings the same weight, just different sizes
- Gradient text on headings or metrics

### 1.5 Layout Red Flags (AVOID)

- Perfectly symmetrical 3-column or 4-column card grids
- Every card the same height with the same padding
- Excessive whitespace hiding lack of content
- "Trusted by" logo bars
- Hero sections with a gradient heading, subtitle, and two buttons
- Cards floating in space with soft shadows and no visual connection

### 1.6 Animation Red Flags (AVOID)

- Every element has the same `transition-all duration-300`
- Hover: scale-105 + shadow-lg on every card
- Fade-in-up on scroll for every section
- Pulse animations on badges

---

## Part 2: The Aviation Design Language (USE THIS)

### 2.1 Color System: Cockpit-Derived

Based on FAA Human Factors guidelines (DOT/FAA/AM-01/17), NASA Color Usage Research
(colorusage.arc.nasa.gov), and Garmin G1000 display conventions.

#### Primary Background Tiers

```css
/* Dark instrument panel backgrounds -- NOT Tailwind slate */
--panel-black:    #0D1117;   /* Primary background, like instrument bezel */
--panel-dark:     #141B27;   /* Secondary panels */
--panel-mid:      #1C2333;   /* Elevated surfaces, active panels */
--panel-border:   #2D3548;   /* Hard borders between panels */
--panel-border-lt:#3D4558;   /* Lighter borders for subdivision */
```

These are NOT the Tailwind slate/navy defaults. They are warmer and greener than
pure blue-gray, matching real avionics panel finishes.

#### Functional Colors (FAA Standard)

```css
/* These have SPECIFIC meanings. Never use decoratively. */
--status-green:   #00CC66;   /* Normal/active/operational */
--status-amber:   #FFB020;   /* Caution -- requires attention */
--status-red:     #FF3B3B;   /* Warning -- immediate action */
--status-cyan:    #00B4D8;   /* Advisory/informational/data-unavailable */
--status-magenta: #E040A0;   /* Commanded values, active navigation */
--status-white:   #E8ECF0;   /* Nominal data display (NASA convention) */
```

#### Text Hierarchy

```css
--text-primary:   #E8ECF0;   /* Primary content -- near-white, not pure white */
--text-secondary: #94A3B8;   /* Labels, descriptions */
--text-tertiary:  #64748B;   /* Disabled, placeholder */
--text-data:      #B8C4D4;   /* Numerical data in tables */
```

#### Accent (Used SPARINGLY)

```css
--accent-gold:    #C9A84C;   /* Brand accent -- DA42 gold. Buttons, active states ONLY */
--accent-gold-h:  #B89530;   /* Gold hover state */
--accent-gold-dim:#8B7A3A;   /* Gold disabled/muted */
```

Gold is the ONLY decorative color. Everything else is functional.

### 2.2 Typography System

#### Font Stack

```css
/* Primary UI font -- NOT Inter */
--font-ui: "IBM Plex Sans", "Segoe UI", system-ui, sans-serif;

/* Data display font -- monospace is NON-NEGOTIABLE for a data app */
--font-data: "IBM Plex Mono", "JetBrains Mono", "Consolas", monospace;

/* Headings -- tighter, more authoritative */
--font-heading: "IBM Plex Sans Condensed", "IBM Plex Sans", sans-serif;
```

Why IBM Plex: It was designed for technical interfaces at IBM. It has a monospace
companion that shares the same design DNA. It reads as "engineered" not "designed."
It is NOT in the AI training data median.

#### Type Scale (Strict)

```
Label/Caption:    12px / 0.75rem   weight 500   UPPERCASE   letter-spacing: 0.05em   font-ui
Body:             14px / 0.875rem  weight 400                                         font-ui
Data Value:       14px / 0.875rem  weight 500   tabular-nums                          font-data
Data Value Large: 20px / 1.25rem   weight 600   tabular-nums                          font-data
Section Heading:  14px / 0.875rem  weight 600   UPPERCASE   letter-spacing: 0.08em   font-heading
Page Heading:     18px / 1.125rem  weight 600                                         font-heading
Page Title:       24px / 1.5rem    weight 700                                         font-heading
```

Key rules:
- Labels are ALWAYS uppercase, always smaller, always tracked out
- Data values are ALWAYS monospace with tabular-nums
- Headings use weight and tracking to establish hierarchy, not just size
- Maximum heading size is 24px. Nothing bigger. This is not a marketing page.
- Line height for data: 1.2. For body text: 1.5. For labels: 1.0.

### 2.3 Border-Radius Values (Precise)

```css
--radius-none: 0px;      /* Tables, data grids, instrument panels */
--radius-sm:   2px;       /* Buttons, inputs, badges, tags */
--radius-md:   4px;       /* Cards, dropdown menus, modals */
--radius-pill: 9999px;    /* ONLY: avatar images, status dots */
```

Rules:
- Default for ALL components: 2px
- Cards and containers: 4px maximum
- NEVER use 8px, 12px, or 16px border-radius
- Square corners (0px) are preferred for data tables, panels, and instrument displays
- The difference between 0 and 2px is subtle but intentional: it prevents pixel artifacts
  while maintaining a sharp, technical appearance

### 2.4 Borders, Not Shadows

```css
/* YES -- hard borders like instrument panel bezels */
border: 1px solid var(--panel-border);

/* For emphasis/elevation, use a LIGHTER border, not a shadow */
border: 1px solid var(--panel-border-lt);

/* For active/selected states, use the accent border */
border: 1px solid var(--accent-gold);
border-left: 3px solid var(--accent-gold);   /* Left accent bar, like a sidebar indicator */
```

```css
/* NO -- soft shadows */
box-shadow: 0 4px 6px rgba(0,0,0,0.1);        /* generic AI shadow */
box-shadow: 0 0 20px rgba(201, 168, 76, 0.15); /* glow effect */
```

The only permitted shadow is a subtle drop on dropdown menus and modals that float
above the page:

```css
/* ONLY for floating overlays (dropdowns, modals, tooltips) */
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
```

### 2.5 Layout Patterns

#### Panel-Based Layout (Not Card-Based)

Think of the interface as an instrument panel divided into functional zones, not
floating cards in space.

```
+--[ NAV PANEL ]--+--[ MAIN CONTENT PANEL ]--+--[ SIDE PANEL ]--+
|                  |                           |                   |
|  Module list     |  +--[ HEADER BAR ]-----+ |  Progress gauges  |
|  Dense, compact  |  | Breadcrumb > Path   | |  Performance data |
|  No icons        |  +---------------------+ |  Instrument-style |
|  Text only       |  |                     | |                   |
|  Active = gold   |  |  Content area       | |                   |
|  left border     |  |  Dense, no floaty   | |                   |
|                  |  |  cards              | |                   |
+------------------+--+-----------------------+-------------------+
```

Rules:
- Panels are separated by 1px borders, NOT gaps with shadows
- Panels go edge-to-edge within their container
- No "floating card" aesthetic -- panels are ATTACHED to each other
- Navigation panels are compact (240px max width)
- Content areas use the full available width

#### Data Tables (Not Card Grids)

For any list of items (modules, lessons, quiz results, student records), use a
TABLE, not a card grid.

```css
/* Table styling */
.data-table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--font-data);
  font-size: 0.875rem;
  font-variant-numeric: tabular-nums;
}

.data-table th {
  font-family: var(--font-ui);
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-secondary);
  padding: 8px 12px;
  border-bottom: 2px solid var(--panel-border);
  text-align: left;
}

.data-table td {
  padding: 8px 12px;
  border-bottom: 1px solid var(--panel-border);
  color: var(--text-data);
}

.data-table tr:hover {
  background: var(--panel-mid);        /* subtle, no transition */
}
```

#### Grid Layouts (Asymmetric, Intentional)

When you must use a grid (dashboard overview), make it ASYMMETRIC:

```css
/* YES -- intentional asymmetry */
grid-template-columns: 2fr 1fr;
grid-template-columns: 1fr 1fr 2fr;
grid-template-columns: 300px 1fr;

/* NO -- perfect symmetry */
grid-template-columns: repeat(3, 1fr);
grid-template-columns: repeat(4, 1fr);
```

### 2.6 Component Design Rules

#### Buttons

```css
/* Primary action button */
.btn-primary {
  background: var(--accent-gold);
  color: var(--panel-black);
  font-family: var(--font-ui);
  font-size: 0.8125rem;          /* 13px */
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 8px 16px;
  border: none;
  border-radius: 2px;
  cursor: pointer;
}

.btn-primary:hover {
  background: var(--accent-gold-h);
  /* NO transform, NO shadow, NO transition-all */
}

/* Secondary / ghost button */
.btn-secondary {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid var(--panel-border);
  border-radius: 2px;
  padding: 8px 16px;
  font-size: 0.8125rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.btn-secondary:hover {
  border-color: var(--panel-border-lt);
  background: var(--panel-mid);
}
```

#### Status Badges

```css
/* Status badges -- small, square, monospace */
.badge {
  font-family: var(--font-data);
  font-size: 0.6875rem;           /* 11px */
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 2px 6px;
  border-radius: 2px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.badge-complete  { background: rgba(0, 204, 102, 0.15); color: var(--status-green); }
.badge-active    { background: rgba(0, 180, 216, 0.15);  color: var(--status-cyan); }
.badge-caution   { background: rgba(255, 176, 32, 0.15); color: var(--status-amber); }
.badge-failed    { background: rgba(255, 59, 59, 0.15);  color: var(--status-red); }
```

#### Input Fields

```css
.input {
  background: var(--panel-dark);
  border: 1px solid var(--panel-border);
  border-radius: 2px;
  color: var(--text-primary);
  font-family: var(--font-ui);
  font-size: 0.875rem;
  padding: 8px 12px;
}

.input:focus {
  border-color: var(--accent-gold);
  outline: none;
  /* NO glow, NO ring, NO shadow */
}

.input::placeholder {
  color: var(--text-tertiary);
}
```

#### Navigation Items

```css
/* Sidebar nav item */
.nav-item {
  padding: 6px 12px;
  font-size: 0.8125rem;
  font-weight: 400;
  color: var(--text-secondary);
  border-left: 3px solid transparent;
  cursor: pointer;
}

.nav-item:hover {
  color: var(--text-primary);
  background: var(--panel-mid);
}

.nav-item.active {
  color: var(--accent-gold);
  border-left-color: var(--accent-gold);
  font-weight: 500;
}
```

#### Progress Indicators (Instrument-Style)

Instead of generic progress bars, use instrument-inspired displays:

```css
/* Numeric progress display -- like a cockpit readout */
.progress-readout {
  font-family: var(--font-data);
  font-size: 1.25rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: var(--text-primary);
}

.progress-readout .unit {
  font-size: 0.75rem;
  font-weight: 400;
  color: var(--text-secondary);
  margin-left: 2px;
}

/* Linear progress bar -- thin, sharp, no border-radius */
.progress-bar {
  height: 4px;
  background: var(--panel-border);
  border-radius: 0;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: var(--status-green);
  border-radius: 0;
  /* NO gradient, NO glow, NO animation */
}

/* Color changes based on value (like an engine gauge) */
.progress-bar-fill.caution { background: var(--status-amber); }
.progress-bar-fill.warning { background: var(--status-red); }
```

### 2.7 Icons

- Use Lucide icons but sparingly -- not on every single list item
- Prefer TEXT LABELS over icons wherever possible
- Status should be communicated by COLOR, not by icon
- If an icon is used, it should be 16px, stroke-width 1.5, color matches text
- NEVER use colored/filled icons decoratively
- Navigation: text only, no icons (cockpit MFD softkeys are text-only)

### 2.8 Whitespace and Density

Aviation UIs are DENSE. Information density is a feature, not a bug.

```css
/* Component spacing */
--space-xs:  4px;
--space-sm:  8px;
--space-md:  12px;
--space-lg:  16px;
--space-xl:  24px;

/* Panel padding: 12-16px, not 24-32px */
/* Table row height: 36-40px, not 48-56px */
/* Button height: 32-36px, not 40-48px */
/* Gap between sections: 16px, not 32-48px */
```

The AI default is to add too much padding and too many gaps. Real instrument panels
pack information tightly because pilots need to see everything at once.

---

## Part 3: Tailwind v4 Implementation

### 3.1 Recommended globals.css

```css
@import "tailwindcss";

@theme {
  /* Panel backgrounds */
  --color-panel-black:    #0D1117;
  --color-panel-dark:     #141B27;
  --color-panel-mid:      #1C2333;
  --color-panel-border:   #2D3548;
  --color-panel-border-lt:#3D4558;

  /* Functional status colors (FAA standard) */
  --color-status-green:   #00CC66;
  --color-status-amber:   #FFB020;
  --color-status-red:     #FF3B3B;
  --color-status-cyan:    #00B4D8;
  --color-status-magenta: #E040A0;

  /* Text */
  --color-text-primary:   #E8ECF0;
  --color-text-secondary: #94A3B8;
  --color-text-tertiary:  #64748B;
  --color-text-data:      #B8C4D4;

  /* Brand accent */
  --color-gold:           #C9A84C;
  --color-gold-hover:     #B89530;
  --color-gold-dim:       #8B7A3A;

  /* Typography */
  --font-sans: "IBM Plex Sans", "Segoe UI", system-ui, sans-serif;
  --font-mono: "IBM Plex Mono", "JetBrains Mono", "Consolas", monospace;
  --font-heading: "IBM Plex Sans Condensed", "IBM Plex Sans", sans-serif;

  /* Border radius -- tight values only */
  --radius-sm: 2px;
  --radius-md: 4px;
}
```

### 3.2 Tailwind Class Mapping

Instead of:                          Use:
`rounded-xl`                         `rounded-sm` (2px)
`rounded-lg`                         `rounded-sm` (2px)
`rounded-2xl`                        `rounded-md` (4px) for containers only
`bg-slate-900`                       `bg-panel-dark`
`bg-slate-800/60 backdrop-blur-md`   `bg-panel-mid` (no blur)
`shadow-lg`                          `border border-panel-border`
`shadow-xl`                          `border border-panel-border`
`text-blue-400`                      `text-status-cyan` (only if semantically correct)
`text-purple-400`                    DO NOT USE
`bg-gradient-to-r`                   DO NOT USE (except progress-bar fills by value)
`hover:scale-105`                    DO NOT USE
`transition-all duration-300`        `transition-colors duration-150` (if any)
`p-6` or `p-8`                       `p-3` or `p-4`
`gap-6`                              `gap-3` or `gap-4`
`space-y-6`                          `space-y-3` or `space-y-4`
`text-4xl font-bold`                 `text-2xl font-bold` (maximum heading size)
`font-sans` (Inter)                  `font-sans` (IBM Plex Sans after config change)

### 3.3 Component Class Patterns

```html
<!-- Panel (replaces "glass card") -->
<div class="bg-panel-mid border border-panel-border rounded-sm p-3">

<!-- Data table -->
<table class="w-full font-mono text-sm tabular-nums">
  <thead>
    <tr class="border-b-2 border-panel-border">
      <th class="font-sans text-xs font-medium uppercase tracking-wider text-text-secondary text-left p-2">

<!-- Status badge -->
<span class="font-mono text-xs font-semibold uppercase tracking-wide
             bg-status-green/15 text-status-green rounded-sm px-1.5 py-0.5">
  COMPLETE
</span>

<!-- Button primary -->
<button class="bg-gold text-panel-black font-semibold text-sm uppercase tracking-wider
               rounded-sm px-4 py-2 hover:bg-gold-hover">

<!-- Nav item active -->
<a class="block px-3 py-1.5 text-sm text-gold font-medium
          border-l-3 border-gold bg-panel-mid">

<!-- Section label -->
<h3 class="font-heading text-sm font-semibold uppercase tracking-widest text-text-secondary mb-2">

<!-- Data readout -->
<span class="font-mono text-xl font-semibold tabular-nums text-text-primary">87.5</span>
<span class="font-mono text-xs text-text-secondary ml-0.5">%</span>
```

---

## Part 4: Aviation UI References to Emulate

### 4.1 Garmin G1000 PFD/MFD Design Principles

The G1000 Primary Flight Display uses:
- Near-black background with high-contrast foreground data
- Cyan for navigation data (BRG pointers, tuning boxes)
- Green for normal/operational states, flight mode annunciations
- Magenta for commanded values (course, altitude targets)
- White for primary flight data (airspeed, altitude, heading numbers)
- Amber/yellow for caution states
- Red for warnings only
- Softkey menus: text-only labels at bottom of screen, no icons
- Tape-style vertical indicators for airspeed and altitude
- Dense numerical readouts with monospaced digits

Apply to LMS: Use the same color discipline. Green means "complete/go." Cyan means
"informational." Magenta means "active target/current lesson." White means "data."

### 4.2 Boeing/Airbus EFB Design Principles

Electronic Flight Bags prioritize:
- Maximum information density on limited screen real estate
- Tab-based navigation (not sidebar drawers)
- Tables over cards for all list data
- Systematic color coding matching cockpit conventions
- Clear typographic hierarchy: labels small/uppercase, data large/monospace
- Minimal decoration -- every pixel communicates information

Apply to LMS: The module list, lesson list, and quiz results should all be dense
tables or compact lists, not card grids. Tabs for navigation between sections.

### 4.3 NASA Display Design Standards

From NASA Ames Color Usage Research:
- Nominal data in WHITE (not green), for maximum contrast on dark backgrounds
- Green reserved for "crew-changeable" elements (interactive controls)
- Magenta for commanded messages / alerts requiring action
- Cyan for data-unavailable / advisory states
- Minimize color count: 6-8 distinct colors maximum across the entire display
- Background must be the darkest element; all data lighter

Apply to LMS: Limit the total color palette to 8 functional colors. Every color has a
specific meaning documented here. No decorative color use.

### 4.4 Summary: Aviation vs. AI-Slop Comparison

| Property           | AI-Slop Default              | Aviation-Grade               |
|--------------------|------------------------------|------------------------------|
| Border radius      | 12-16px everywhere           | 0-2px for data, 4px max      |
| Shadows            | Soft multi-layer shadows     | None. Hard 1px borders.      |
| Background         | Frosted glass, blur, opacity | Solid opaque dark panels      |
| Typography         | Inter 400/600 only           | IBM Plex Sans + Mono family   |
| Data display       | Same font as UI text         | Monospace, tabular-nums       |
| Color usage        | Purple/blue gradient accent  | FAA standard functional only  |
| Decorative color   | Gradients on text/bg         | Gold accent, used sparingly   |
| Layout             | Floating cards, even grid    | Attached panels, asymmetric   |
| Density            | 32px+ padding everywhere     | 8-16px padding, tight rows    |
| Icons              | On every element              | Minimal, text labels preferred|
| Animations         | Hover:scale + shadow + glow  | Instant state change or none  |
| Labels             | Sentence case, same weight   | UPPERCASE, tracked, smaller   |
| Progress bars      | Rounded, gradient fill       | Square, solid color by value  |
| Empty state        | Illustration + "Get started" | Dashed border + brief text    |
| Lists              | Card grid                    | Data table                    |

---

## Part 5: Design Audit Checklist

Before shipping any page, verify:

- [ ] No `backdrop-blur` or `backdrop-filter` anywhere
- [ ] No `rounded-lg`, `rounded-xl`, `rounded-2xl` -- only `rounded-sm` (2px) or `rounded` (4px)
- [ ] No `shadow-*` classes except on floating overlays (modals, dropdowns)
- [ ] No purple, violet, or indigo colors
- [ ] No gradient text (`bg-clip-text text-transparent`)
- [ ] No `hover:scale-*` transforms
- [ ] All data values use monospace font with `tabular-nums`
- [ ] All labels are uppercase with letter-spacing
- [ ] Heading max size is `text-2xl` (24px)
- [ ] Padding on panels/cards is `p-3` or `p-4` (12-16px), not `p-6` or `p-8`
- [ ] Every color used has a documented semantic meaning
- [ ] Tables used for list data, not card grids
- [ ] Maximum 8 distinct colors visible on any single screen
- [ ] No decorative icons -- every icon communicates a specific function
- [ ] Font stack is IBM Plex Sans / Mono, not Inter / Roboto

---

## Sources

Research informing this guide was drawn from:

- FAA Human Factors Design Guidelines for Multifunction Displays (DOT/FAA/AM-01/17)
- NASA Ames Color Usage Research Laboratory (colorusage.arc.nasa.gov)
- Garmin G1000 Cockpit Reference Guide for Diamond DA42
- Canva 2026 Design Trends Report ("Imperfect by Design")
- Anti-AI Crafting movement analysis (designmagazine.com.au)
- AI Purple Problem analysis (dev.to, prg.sh)
- AI-Generated UI Anti-Patterns Guide (docs.bswen.com)
