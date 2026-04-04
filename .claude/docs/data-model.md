# DA42 LMS — Data Model

## TypeScript Types (src/types/index.ts)

```typescript
interface Module {
  slug: string;           // URL-safe ID: "14-powerplant"
  title: string;          // "Powerplant"
  orderIndex: number;     // 1-20
  description: string;    // Brief summary
  estimatedMinutes: number;
  subsections: Subsection[];
}

interface Subsection {
  title: string;
  content: string;        // Raw text with [FIGURE:] placeholders
  pageRange: string;      // "95-110"
}

interface QuizQuestion {
  id: string;
  question: string;
  options: { text: string; isCorrect: boolean }[];
  explanation: string;
}

interface UserProgress {
  moduleId: string;
  moduleSlug: string;
  status: "not_started" | "in_progress" | "completed";
  score?: number;
  completedAt?: string;
}
```

## Module JSON Schema (content/modules/*.json)

```json
{
  "slug": "14-powerplant",
  "title": "Powerplant",
  "orderIndex": 14,
  "description": "Austro AE300 turbocharged diesel engines...",
  "estimatedMinutes": 48,
  "subsections": [
    {
      "title": "Powerplant",
      "content": "The DA42-VI engines are Austro AE300-E4C...",
      "pageRange": "95-110"
    }
  ]
}
```

## Quiz JSON Schema (content/quizzes/*.json)

```json
{
  "moduleSlug": "14-powerplant",
  "questions": [
    {
      "id": "q1",
      "question": "What engine model powers the DA42-VI?",
      "options": [
        { "text": "Lycoming IO-360", "isCorrect": false },
        { "text": "Austro AE300-E4C", "isCorrect": true },
        { "text": "Continental IO-550", "isCorrect": false },
        { "text": "Rotax 912", "isCorrect": false }
      ],
      "explanation": "The DA42-VI uses Austro AE300-E4C turbocharged diesel engines."
    }
  ]
}
```

## Content Loading Functions (src/lib/content/)

### modules.ts
- `getAllModules(): Module[]` — Reads index.json, loads each module JSON
- `getModuleBySlug(slug): Module | null` — Find by slug
- `getAdjacentModules(slug): { prev, next }` — For prev/next navigation

### quizzes.ts
- `getQuizByModuleSlug(slug): QuizQuestion[]` — Load quiz for a module

## Planned Database Schema (Supabase)

```sql
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  module_id UUID,
  module_slug TEXT NOT NULL,
  status TEXT CHECK (status IN ('not_started','in_progress','completed')),
  score INTEGER,
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, module_slug)
);
```
