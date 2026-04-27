type Node = { x: number; y: number; r: number; focused?: boolean };

const nodes: Node[] = [
  { x: 120, y: 80, r: 5 },
  { x: 360, y: 60, r: 4 },
  { x: 600, y: 110, r: 6 },
  { x: 240, y: 200, r: 7, focused: true },
  { x: 480, y: 220, r: 5 },
  { x: 720, y: 200, r: 4 },
  { x: 160, y: 320, r: 4 },
  { x: 400, y: 340, r: 5 },
  { x: 640, y: 320, r: 5 },
];

const edges: Array<[number, number]> = [
  [0, 3],
  [1, 3],
  [3, 4],
  [4, 2],
  [4, 5],
  [3, 6],
  [3, 7],
  [4, 8],
  [7, 8],
  [1, 4],
  [2, 5],
];

const HomeConstellation = () => {
  return (
    <div className="relative mt-20 w-full max-w-4xl">
      <div className="absolute inset-0 -z-10 rounded-3xl bg-primary-glow/5 blur-3xl" />
      <div className="card-glow rounded-2xl border border-primary-light/15 bg-card/55 p-2">
        <div className="flex items-center justify-between border-b border-border/60 px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
            <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
            <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-primary-light/55">
            a glimpse into someone's world
          </span>
          <span className="text-xs text-muted-foreground/60">9 pieces · 11 connections</span>
        </div>
        <svg viewBox="0 0 800 400" className="h-auto w-full">
          {edges.map(([a, b], i) => {
            const n1 = nodes[a];
            const n2 = nodes[b];
            return (
              <line
                key={i}
                x1={n1.x}
                y1={n1.y}
                x2={n2.x}
                y2={n2.y}
                stroke="hsl(var(--primary-light))"
                strokeOpacity="0.2"
                strokeWidth="1"
              />
            );
          })}
          {nodes.map((n, i) => (
            <g key={i}>
              {n.focused && (
                <circle cx={n.x} cy={n.y} r={n.r + 8} fill="hsl(var(--primary-glow))" fillOpacity="0.18">
                  <animate
                    attributeName="r"
                    values={`${n.r + 6};${n.r + 12};${n.r + 6}`}
                    dur="3s"
                    repeatCount="indefinite"
                  />
                </circle>
              )}
              <circle
                cx={n.x}
                cy={n.y}
                r={n.r}
                fill={n.focused ? "hsl(var(--primary-light))" : "hsl(var(--card))"}
                stroke="hsl(var(--primary-light))"
                strokeOpacity={n.focused ? 1 : 0.5}
                strokeWidth="1.2"
              />
            </g>
          ))}
        </svg>
        <div className="border-t border-border/60 px-4 py-2.5 text-center">
          <span className="text-xs italic text-muted-foreground/70">
            Every dot is something. Every line is a connection.
          </span>
        </div>
      </div>
    </div>
  );
};

export default HomeConstellation;
