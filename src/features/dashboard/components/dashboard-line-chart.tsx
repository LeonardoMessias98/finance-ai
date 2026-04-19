type DashboardLineChartSeries = {
  label: string;
  color: string;
  dashed?: boolean;
  values: number[];
};

type DashboardLineChartProps = {
  ariaLabel: string;
  labels: string[];
  series: DashboardLineChartSeries[];
};

const chartWidth = 320;
const chartHeight = 180;
const chartPaddingX = 8;
const chartPaddingTop = 12;
const chartPaddingBottom = 18;
const gridLineCount = 4;

function buildSeriesPoints(values: number[], maxValue: number): string {
  const availableWidth = chartWidth - chartPaddingX * 2;
  const availableHeight = chartHeight - chartPaddingTop - chartPaddingBottom;
  const horizontalStep = values.length > 1 ? availableWidth / (values.length - 1) : 0;

  return values
    .map((value, index) => {
      const x = chartPaddingX + horizontalStep * index;
      const y = chartHeight - chartPaddingBottom - (value / maxValue) * availableHeight;

      return `${x},${y}`;
    })
    .join(" ");
}

export function DashboardLineChart({ ariaLabel, labels, series }: DashboardLineChartProps) {
  const maxValue = Math.max(1, ...series.flatMap((item) => item.values));
  const availableHeight = chartHeight - chartPaddingTop - chartPaddingBottom;

  return (
    <div>
      <svg
        aria-label={ariaLabel}
        className="h-44 w-full overflow-visible"
        role="img"
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
      >
        {Array.from({ length: gridLineCount }, (_, index) => {
          const y = chartPaddingTop + (availableHeight / (gridLineCount - 1)) * index;

          return (
            <line
              key={y}
              stroke="hsl(var(--border))"
              strokeDasharray={index === gridLineCount - 1 ? undefined : "4 8"}
              strokeWidth="1"
              x1={chartPaddingX}
              x2={chartWidth - chartPaddingX}
              y1={y}
              y2={y}
            />
          );
        })}

        {series.map((item) => {
          const points = buildSeriesPoints(item.values, maxValue);

          return (
            <g key={item.label}>
              <polyline
                fill="none"
                points={points}
                stroke={item.color}
                strokeDasharray={item.dashed ? "6 6" : undefined}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
              />
              {points.split(" ").map((point) => {
                const [x, y] = point.split(",");

                return (
                  <circle
                    cx={Number(x)}
                    cy={Number(y)}
                    fill="hsl(var(--background))"
                    key={`${item.label}-${point}`}
                    r="3.5"
                    stroke={item.color}
                    strokeWidth="2"
                  />
                );
              })}
            </g>
          );
        })}
      </svg>

      <div
        className="mt-3 grid gap-2 text-center text-[11px] text-muted-foreground"
        style={{
          gridTemplateColumns: `repeat(${labels.length}, minmax(0, 1fr))`
        }}
      >
        {labels.map((label) => (
          <span className="truncate" key={label}>
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
