# DA42 LMS — Architecture

## System Overview

Custom LMS for Diamond DA42-VI multi-engine pilot training. Built on Next.js 15 (App Router) with static content extracted from a 131-page ERAU PDF.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15.5 (App Router, React 19) |
| Language | TypeScript 5.7 |
| Styling | Tailwind CSS 4.0 (@theme tokens) |
| Fonts | IBM Plex Sans + IBM Plex Mono |
| Icons | Lucide React |
| Animation | Framer Motion 11 |
| Components | Radix UI primitives |
| Database | Supabase (planned) |
| Auth | Supabase Auth (planned) |

## Directory Structure

```
DA42-LMS/
├── .claude/docs/          # Technical documentation (this directory)
├── content/
│   ├── modules/           # 20 JSON files extracted from PDF + index.json
│   └── quizzes/           # Quiz question JSON files (5 modules)
├── scripts/
│   └── extract-pdf.py     # One-time PDF → JSON extraction
├── src/
│   ├── app/               # Next.js App Router pages
│   │   ├── (auth)/        # Login/register route group
│   │   ├── api/quiz/      # Quiz API route
│   │   ├── modules/       # Module listing + [slug] detail + quiz
│   │   ├── progress/      # Progress dashboard
│   │   └── profile/       # User profile
│   ├── components/
│   │   ├── layout/        # Sidebar, Header
│   │   ├── ui/            # Button, Card, Badge, Progress
│   │   ├── modules/       # ModuleCard, ContentRenderer, QuizEngine
│   │   └── dashboard/     # FlightGauge, CourseMap, RecentActivity
│   ├── lib/
│   │   ├── content/       # modules.ts, quizzes.ts (content loaders)
│   │   └── utils.ts       # cn() utility
│   ├── hooks/             # useProgress, useAuth (planned)
│   └── types/             # TypeScript interfaces
└── public/aircraft/       # DA42 images (placeholder)
```

## Data Flow

```
PDF (131 pages)
  → extract-pdf.py (pdfplumber)
  → content/modules/*.json (20 files)
  → src/lib/content/modules.ts (fs.readFileSync at build time)
  → Next.js Server Components (SSG)
  → Static HTML (prerendered at build)
```

All module content is loaded at build time via `generateStaticParams()`. No runtime database needed for content — only for user progress tracking (Supabase, planned).

## Routing

| Path | Type | Description |
|------|------|-------------|
| `/` | Static | Dashboard with stats + first 6 modules |
| `/modules` | Static | All 20 modules listed |
| `/modules/[slug]` | SSG | Module detail with subsections |
| `/modules/[slug]/quiz` | Dynamic | Interactive quiz |
| `/progress` | Static | Progress gauge + checklist |
| `/profile` | Static | User profile (placeholder) |
| `/login` | Static | Auth login page |
| `/register` | Static | Auth register page |
| `/api/quiz/[slug]` | API | Quiz data endpoint |

## Key Decisions

1. **Custom build over Open edX/Canvas** — Single-course training doesn't justify a multi-service LMS platform.
2. **Static content** — PDF content doesn't change frequently. SSG gives best performance.
3. **JSON over MDX** — Module content is structured data (subsections, metadata), not free-form markdown.
4. **No Supabase yet** — Auth and progress tracking are UI-ready but not wired to a backend. Keeps dev simple during content/UI iteration.
