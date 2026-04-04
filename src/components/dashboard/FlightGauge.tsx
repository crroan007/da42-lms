"use client";

import { cn } from "@/lib/utils";

interface FlightGaugeProps {
  value: number; // 0-100
  label: string;
  size?: number; // px, default 200
  className?: string;
}

export function FlightGauge({
  value,
  label,
  size = 200,
  className,
}: FlightGaugeProps) {
  const clamped = Math.min(100, Math.max(0, value));

  // SVG dimensions
  const cx = 100;
  const cy = 100;
  const radius = 80;
  const strokeWidth = 6;

  // Arc spans from 135deg to 405deg (270deg sweep)
  const startAngle = 135;
  const sweepAngle = 270;
  const circumference = 2 * Math.PI * radius;
  const arcLength = (sweepAngle / 360) * circumference;
  const filledLength = (clamped / 100) * arcLength;

  // Helper to convert value (0-100) to angle on the gauge
  function valueToAngle(v: number): number {
    return startAngle + (v / 100) * sweepAngle;
  }

  // Convert degrees to radians
  function degToRad(deg: number): number {
    return (deg * Math.PI) / 180;
  }

  // Get point on circle
  function pointOnCircle(angleDeg: number, r: number) {
    const rad = degToRad(angleDeg);
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  }

  // Generate tick marks
  const majorTicks: number[] = [];
  const minorTicks: number[] = [];
  const labelValues = [0, 25, 50, 75, 100];

  for (let i = 0; i <= 100; i += 5) {
    if (i % 10 === 0) {
      majorTicks.push(i);
    } else {
      minorTicks.push(i);
    }
  }

  return (
    <div className={cn("inline-flex flex-col items-center", className)}>
      <svg width={size} height={size} viewBox="0 0 200 200">
        {/* Outer bezel ring */}
        <circle
          cx={cx}
          cy={cy}
          r={95}
          fill="none"
          stroke="var(--color-border-default)"
          strokeWidth="2"
        />
        <circle
          cx={cx}
          cy={cy}
          r={93}
          fill="none"
          stroke="var(--color-border-subtle)"
          strokeWidth="1"
        />

        {/* Instrument face */}
        <circle cx={cx} cy={cy} r={91} fill="var(--color-surface-sunken)" />

        {/* Minor tick marks (every 5%) */}
        {minorTicks.map((v) => {
          const angle = valueToAngle(v);
          const outer = pointOnCircle(angle, 85);
          const inner = pointOnCircle(angle, 79);
          return (
            <line
              key={`minor-${v}`}
              x1={outer.x}
              y1={outer.y}
              x2={inner.x}
              y2={inner.y}
              stroke="var(--color-border-default)"
              strokeWidth="1"
            />
          );
        })}

        {/* Major tick marks (every 10%) — hard, no round caps */}
        {majorTicks.map((v) => {
          const angle = valueToAngle(v);
          const outer = pointOnCircle(angle, 85);
          const inner = pointOnCircle(angle, 74);
          return (
            <line
              key={`major-${v}`}
              x1={outer.x}
              y1={outer.y}
              x2={inner.x}
              y2={inner.y}
              stroke="var(--color-gold)"
              strokeWidth="1.5"
            />
          );
        })}

        {/* Number labels at 0, 25, 50, 75, 100 */}
        {labelValues.map((v) => {
          const angle = valueToAngle(v);
          const pos = pointOnCircle(angle, 65);
          return (
            <text
              key={`label-${v}`}
              x={pos.x}
              y={pos.y}
              fill="var(--color-gold)"
              fontSize="9"
              fontWeight="500"
              fontFamily="'IBM Plex Mono', monospace"
              textAnchor="middle"
              dominantBaseline="central"
            >
              {v}
            </text>
          );
        })}

        {/* Background arc track */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="var(--color-border-subtle)"
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeDashoffset={0}
          transform={`rotate(${startAngle} ${cx} ${cy})`}
        />

        {/* Filled arc — solid gold, no glow filter */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="var(--color-gold)"
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeDashoffset={arcLength - filledLength}
          transform={`rotate(${startAngle} ${cx} ${cy})`}
          style={{
            transition: "stroke-dashoffset 0.8s ease-out",
          }}
        />

        {/* Center value text — IBM Plex Mono */}
        <text
          x={cx}
          y={cy - 4}
          fill="var(--color-text-primary)"
          fontSize="28"
          fontWeight="600"
          fontFamily="'IBM Plex Mono', monospace"
          textAnchor="middle"
          dominantBaseline="central"
        >
          {Math.round(clamped)}
        </text>
        <text
          x={cx}
          y={cy + 16}
          fill="var(--color-gold-muted)"
          fontSize="9"
          fontWeight="500"
          textAnchor="middle"
          dominantBaseline="central"
          letterSpacing="0.1em"
          fontFamily="'IBM Plex Sans', sans-serif"
        >
          PERCENT
        </text>

        {/* Small center dot */}
        <circle cx={cx} cy={cy + 30} r="2" fill="var(--color-border-default)" />
      </svg>

      {/* Label below gauge */}
      <span className="mt-1 label-caps">{label}</span>
    </div>
  );
}
