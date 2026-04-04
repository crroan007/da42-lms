# DA42 LMS — Theming Guide

## Design Philosophy

Premium airline training aesthetic. Anti-AI-slop design — no frosted glass, no glow effects, no uniform rounded corners, no gradient text. Inspired by Tokyn design system and real aviation instrument panels.

## Color Palette

### Surfaces (blue-tinted neutrals)
| Token | Value | Use |
|-------|-------|-----|
| `--color-surface-base` | `#0b1120` | Page background |
| `--color-surface-raised` | `#111827` | Cards, panels |
| `--color-surface-overlay` | `#1a2332` | Hover states, nested sections |
| `--color-surface-sunken` | `#070d18` | Inset areas |

### Borders
| Token | Value | Use |
|-------|-------|-----|
| `--color-border-subtle` | `rgba(148,163,184,0.08)` | Panel borders |
| `--color-border-default` | `rgba(148,163,184,0.14)` | Dividers |
| `--color-border-strong` | `rgba(148,163,184,0.22)` | Active borders |

### Text
| Token | Value | Use |
|-------|-------|-----|
| `--color-text-primary` | `#f1f5f9` | Headings, body |
| `--color-text-secondary` | `#94a3b8` | Descriptions |
| `--color-text-muted` | `#64748b` | Labels, metadata |
| `--color-text-faint` | `#475569` | Disabled |

### Status (FAA standard)
| Token | Value | Meaning |
|-------|-------|---------|
| `--color-status-operational` | `#22c55e` | Complete, pass, operational |
| `--color-status-caution` | `#eab308` | Warning, attention needed |
| `--color-status-warning` | `#ef4444` | Error, fail, critical |
| `--color-status-advisory` | `#38bdf8` | Info, advisory |

### Gold Accent
| Token | Value | Use |
|-------|-------|-----|
| `--color-gold` | `#c9a84c` | Primary accent, active states |
| `--color-gold-dim` | `rgba(201,168,76,0.12)` | Subtle backgrounds |
| `--color-gold-muted` | `rgba(201,168,76,0.6)` | Secondary accent |

## Typography

- **Body**: IBM Plex Sans (400, 500, 600, 700)
- **Data/Numbers**: IBM Plex Mono (400, 500, 600) — all numeric values
- **Base size**: 14px
- **Headings**: negative letter-spacing (-0.02em)
- **Labels**: 11px, uppercase, tracking-wide (0.1em)

## Border Radius Rules

| Element | Radius | Tailwind |
|---------|--------|----------|
| Panels/cards | 4px | `rounded` |
| Nested elements | 2px | `rounded-sm` |
| Inputs/buttons | 4px | `rounded` |
| Avatars | 9999px | `rounded-full` |
| Status badges | 2px | `rounded-sm` |

**BANNED**: `rounded-xl`, `rounded-2xl`, `rounded-lg`, `rounded-3xl`

## Custom CSS Classes

| Class | Purpose |
|-------|---------|
| `.panel` | Primary container — hard border, raised bg, 4px radius |
| `.panel-elevated` | Panel with Tokyn layered shadow stacking |
| `.surface-sunken` | Inset background for nested sections |
| `.label-caps` | 11px uppercase wide-tracking label |
| `.data-value` | Monospace tabular-nums for data |
| `.data-table` | Table with uppercase headers, subtle row dividers |
| `.text-gold` | Solid gold color (NOT gradient) |
| `.transition-lift` | Hover: translateY(-1px) with shadow increase |
| `.accent-strip-top` | 3px colored top bar (data-status attribute) |

## What NOT to Use

- `backdrop-blur` — AI-slop pattern
- `bg-clip-text text-transparent` — gradient text is AI-slop
- `box-shadow` glow effects — no colored glows
- Decorative scale animations on hover
- Uniform rounded corners on everything
- Soft shadows (`shadow-md`, `shadow-lg`)
