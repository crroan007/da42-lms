# DA42 LMS — Component API Reference

## Layout Components

### Sidebar (`src/components/layout/Sidebar.tsx`)
- **Type**: Client component
- **Props**: None
- **Behavior**: Collapsible navigation sidebar with DA42 branding, 4 nav items (Dashboard, Modules, Progress, Profile). Active state uses left gold border. Collapse button at bottom.
- **Dependencies**: `next/link`, `next/navigation`, `lucide-react`, `cn()`

### Header (`src/components/layout/Header.tsx`)
- **Type**: Client component
- **Props**: None
- **Behavior**: Top bar with page title, DA42-VI badge, search/notification icons, user avatar.
- **Dependencies**: `lucide-react`

## UI Components

### Button (`src/components/ui/Button.tsx`)
- **Type**: Client component
- **Props**: `variant: "primary" | "secondary" | "ghost"`, `size: "sm" | "md" | "lg"`, `loading: boolean`, `icon: ReactNode`, standard button attrs
- **Styling**: Primary = solid gold bg. 4px radius. CSS transitions only (no Framer Motion scale).

### Card (`src/components/ui/Card.tsx`)
- **Type**: Client component
- **Props**: `hoverable: boolean`, `glowing: boolean` (deprecated — use transition-lift), `className`, `children`
- **Styling**: Uses `.panel` class. Hover = translateY(-1px).

### Badge (`src/components/ui/Badge.tsx`)
- **Type**: Server component
- **Props**: `variant: "success" | "warning" | "danger" | "info" | "gold"`, `children`
- **Styling**: 2px border-radius. Desaturated backgrounds.

### Progress (`src/components/ui/Progress.tsx`)
- **Type**: Client component
- **Props**: `value: number (0-100)`, `size: "sm" | "md" | "lg"`, `showLabel: boolean`
- **Styling**: Solid gold bar (no gradient). 2px radius.

## Dashboard Components

### FlightGauge (`src/components/dashboard/FlightGauge.tsx`)
- **Type**: Client component
- **Props**: `value: number (0-100)`, `label: string`, `size: number (px, default 200)`
- **Behavior**: SVG circular gauge with tick marks, solid gold arc, monospace center value.

### CourseMap (`src/components/dashboard/CourseMap.tsx`)
- **Type**: Client component
- **Props**: `modules: Module[]`, `progress: UserProgress[]` (planned)
- **Behavior**: Vertical timeline with module status indicators.

### RecentActivity (`src/components/dashboard/RecentActivity.tsx`)
- **Type**: Client component
- **Props**: None (placeholder data)
- **Styling**: Data table format.

## Module Components

### ModuleCard (`src/components/modules/ModuleCard.tsx`)
- **Type**: Client component
- **Props**: `module: Module`, `progress?: UserProgress`
- **Styling**: `.panel` with `.accent-strip-top`. Monospace module number. Dense padding.

### ContentRenderer (`src/components/modules/ContentRenderer.tsx`)
- **Type**: Client component
- **Props**: `content: string`
- **Behavior**: Parses content string. `[FIGURE: ...]` → placeholder boxes. Detects section headers and technical acronyms.

### QuizEngine (`src/components/modules/QuizEngine.tsx`)
- **Type**: Client component
- **Props**: `questions: QuizQuestion[]`, `moduleSlug: string`
- **Behavior**: One question at a time, A/B/C/D options, submit/feedback, score summary. 80% pass threshold.
