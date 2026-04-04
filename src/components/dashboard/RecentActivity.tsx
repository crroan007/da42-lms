"use client";

import { BookOpen, CheckCircle2, Trophy, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityItem {
  id: string;
  type: "module_complete" | "quiz_score" | "module_started" | "study_session";
  title: string;
  detail: string;
  timestamp: string;
}

const iconMap = {
  module_complete: {
    icon: CheckCircle2,
    color: "text-[var(--color-status-operational)]",
  },
  quiz_score: { icon: Trophy, color: "text-gold" },
  module_started: {
    icon: BookOpen,
    color: "text-[var(--color-status-advisory)]",
  },
  study_session: { icon: Clock, color: "text-[var(--color-text-muted)]" },
};

// Placeholder data
const placeholderActivity: ActivityItem[] = [
  {
    id: "1",
    type: "module_complete",
    title: "Module 1 Completed",
    detail: "General Description & Specifications",
    timestamp: "2 hours ago",
  },
  {
    id: "2",
    type: "quiz_score",
    title: "Quiz Score: 92%",
    detail: "Module 1 Knowledge Check",
    timestamp: "2 hours ago",
  },
  {
    id: "3",
    type: "module_started",
    title: "Module 2 Started",
    detail: "Airframe Structure",
    timestamp: "1 hour ago",
  },
  {
    id: "4",
    type: "study_session",
    title: "Study Session",
    detail: "45 min session completed",
    timestamp: "30 min ago",
  },
  {
    id: "5",
    type: "quiz_score",
    title: "Quiz Score: 85%",
    detail: "Module 2 Knowledge Check",
    timestamp: "15 min ago",
  },
];

interface RecentActivityProps {
  activities?: ActivityItem[];
  className?: string;
}

export function RecentActivity({
  activities = placeholderActivity,
  className,
}: RecentActivityProps) {
  return (
    <table className={cn("data-table", className)}>
      <thead>
        <tr>
          <th>Event</th>
          <th>Detail</th>
          <th className="text-right">Time</th>
        </tr>
      </thead>
      <tbody>
        {activities.map((activity) => {
          const { icon: Icon, color } = iconMap[activity.type];
          return (
            <tr key={activity.id}>
              <td>
                <div className="flex items-center gap-2">
                  <Icon className={cn("h-3.5 w-3.5 flex-shrink-0", color)} />
                  <span className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                    {activity.title}
                  </span>
                </div>
              </td>
              <td>
                <span className="meta truncate">{activity.detail}</span>
              </td>
              <td className="text-right">
                <span className="font-mono text-xs text-[var(--color-text-faint)] whitespace-nowrap">
                  {activity.timestamp}
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
