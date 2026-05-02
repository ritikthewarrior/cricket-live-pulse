import { motion } from "framer-motion";

interface Shot {
  id: number;
  angle: number; // 0-360 degrees (0 is straight down the ground)
  distance: number; // 0-100%
  runs: number;
}

// Generate some random simulated shots for visual effect
const MOCK_SHOTS: Shot[] = Array.from({ length: 15 }).map((_, i) => {
  const isBoundary = Math.random() > 0.6;
  return {
    id: i,
    angle: Math.random() * 360,
    distance: isBoundary ? (Math.random() > 0.5 ? 100 : 90) : Math.random() * 60 + 20,
    runs: isBoundary ? (Math.random() > 0.5 ? 6 : 4) : Math.floor(Math.random() * 3) + 1,
  };
});

export const WagonWheel = () => {
  const getColor = (runs: number) => {
    if (runs === 6) return "var(--nb-red)";
    if (runs === 4) return "var(--nb-yellow)";
    if (runs === 2 || runs === 3) return "var(--nb-blue)";
    return "var(--foreground)";
  };

  return (
    <div className="nb-card p-4 bg-background relative overflow-hidden group">
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="font-display text-lg uppercase">Wagon Wheel</h3>
        <span className="nb-tag bg-card">LIVE</span>
      </div>

      <div className="relative w-full aspect-square max-w-[280px] mx-auto">
        {/* Field Boundary */}
        <div className="absolute inset-0 rounded-full border-4 border-dashed border-muted-foreground/30 animate-[spin_60s_linear_infinite]" />
        <div className="absolute inset-2 rounded-full border border-muted-foreground/20" />
        
        {/* Pitch Area */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-16 bg-[#e6d5a7] border-2 border-foreground z-10" />

        {/* Shots */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
          {MOCK_SHOTS.map((shot, i) => {
            // Convert polar to cartesian (center is 50,50)
            const rad = (shot.angle - 90) * (Math.PI / 180);
            const radius = (shot.distance / 100) * 50;
            const x2 = 50 + radius * Math.cos(rad);
            const y2 = 50 + radius * Math.sin(rad);

            return (
              <motion.line
                key={shot.id}
                x1="50"
                y1="50"
                x2={x2}
                y2={y2}
                stroke={getColor(shot.runs)}
                strokeWidth={shot.runs >= 4 ? "1.5" : "1"}
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1, delay: i * 0.1, type: "spring" }}
                className="hover:stroke-white hover:stroke-[3px] transition-all cursor-crosshair drop-shadow-md"
              />
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-3 mt-4 text-[10px] font-bold uppercase relative z-10">
        <div className="flex items-center gap-1"><div className="w-2 h-2 bg-foreground rounded-full" /> 1s</div>
        <div className="flex items-center gap-1"><div className="w-2 h-2 bg-nb-blue rounded-full" /> 2s/3s</div>
        <div className="flex items-center gap-1"><div className="w-2 h-2 bg-nb-yellow rounded-full" /> 4s</div>
        <div className="flex items-center gap-1"><div className="w-2 h-2 bg-nb-red rounded-full" /> 6s</div>
      </div>
    </div>
  );
};
