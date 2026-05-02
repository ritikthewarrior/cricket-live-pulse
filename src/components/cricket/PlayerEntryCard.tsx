import { Player } from "@/lib/cricket-data";
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from "framer-motion";

export const PlayerEntryCard = ({ player, dismissed }: { player: Player; dismissed: Player }) => {
  const riskColor =
    player.prediction.risk === "Low" ? "bg-nb-green" :
    player.prediction.risk === "Medium" ? "bg-nb-yellow" : "bg-nb-red text-white";

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], [0, 100]);
  const background = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 80%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div className="perspective-[1000px] w-full">
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="nb-card p-5 relative overflow-hidden group cursor-pointer"
      >
        {/* Holographic foil glare */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 mix-blend-overlay"
          style={{ background }}
        />

        {/* Content wrapper with Z-translation for parallax */}
        <div style={{ transform: "translateZ(40px)" }}>
          {/* Stamp */}
          <div className="absolute -top-2 -right-2 z-10 rotate-12 drop-shadow-md">
            <span className="inline-block nb-border-thick bg-nb-red text-white px-3 py-1 font-display text-sm nb-shadow-sm">
              NEW BATTER
            </span>
          </div>

          {/* Header */}
          <div className="flex gap-4 items-center">
            <div className="nb-border-thick nb-shadow-sm shrink-0 bg-white">
              <img
                src={player.image}
                alt={player.name}
                width={96}
                height={96}
                loading="lazy"
                className="w-20 h-20 md:w-24 md:h-24 object-cover block"
              />
            </div>
            <div className="min-w-0">
              <h2 className="font-display text-2xl md:text-3xl leading-tight">{player.name}</h2>
              <div className="text-sm font-bold uppercase tracking-wider opacity-70">{player.role}</div>
              <div className="flex gap-2 mt-2 flex-wrap">
                <span className="nb-tag bg-nb-blue text-white">AVG {player.battingAvg}</span>
                <span className="nb-tag bg-nb-green">SR {player.strikeRate}</span>
              </div>
            </div>
          </div>

          {/* Vs Spin / Pace */}
          <div className="grid grid-cols-2 gap-3 mt-5">
            <StatBlock label="VS SPIN" value={player.vsSpin} color="bg-nb-pink" />
            <StatBlock label="VS PACE" value={player.vsPace} color="bg-nb-yellow" />
          </div>

          {/* Recent form */}
          <div className="mt-4 nb-border bg-card p-3">
            <div className="text-xs font-bold uppercase opacity-70 mb-2">Last 5 Innings</div>
            <div className="flex gap-2">
              {player.recentForm.map((s, i) => {
                const c = s >= 50 ? "bg-nb-green" : s >= 25 ? "bg-nb-yellow" : "bg-nb-red text-white";
                return (
                  <div key={i} className={`flex-1 nb-border ${c} text-center py-2 font-display text-lg`}>
                    {s}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Boundary % */}
          <div className="mt-4 nb-border bg-card p-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold uppercase opacity-70">Boundary %</span>
              <span className="font-display text-lg">{player.boundaryPct}%</span>
            </div>
            <div className="nb-border h-3 bg-background overflow-hidden">
              <div className="bg-nb-blue h-full" style={{ width: `${player.boundaryPct}%` }} />
            </div>
          </div>

          {/* AI Prediction */}
          <div className="mt-5 nb-border-thick bg-foreground text-background p-4 nb-shadow-sm transition-transform hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-3">
              <span className="font-display text-lg">🤖 AI PREDICTION</span>
              <span className={`nb-tag ${riskColor} border-background`}>
                {player.prediction.risk} RISK
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="nb-border border-background p-2">
                <div className="text-[10px] font-bold uppercase opacity-70">Expected Runs</div>
                <div className="font-display text-2xl">
                  {player.prediction.expectedRunsMin}–{player.prediction.expectedRunsMax}
                </div>
              </div>
              <div className="nb-border border-background p-2">
                <div className="text-[10px] font-bold uppercase opacity-70">Boundary Prob</div>
                <div className="font-display text-2xl">{player.prediction.boundaryProb}%</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const StatBlock = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className={`nb-border-thick ${color} p-3 nb-shadow-sm text-center transition-transform hover:-translate-y-1`}>
    <div className="text-[10px] font-bold uppercase opacity-70">{label} (SR)</div>
    <div className="font-display text-3xl">{value}</div>
  </div>
);

const PhaseBox = ({ label, data, color }: { label: string; data: { avg: number; sr: number }; color: string }) => (
  <div className={`nb-border ${color} p-2 text-center`}>
    <div className="text-[10px] font-bold">{label}</div>
    <div className="font-display text-sm leading-tight mt-1">{data.avg}</div>
    <div className="text-[10px] opacity-80">SR {data.sr}</div>
  </div>
);

const CompareRow = ({ label, a, b }: { label: string; a: number; b: number }) => {
  const aWins = a >= b;
  return (
    <div className="flex items-center gap-2 text-xs font-bold py-1">
      <span className={`flex-1 text-right ${aWins ? "font-display text-base" : "opacity-60"}`}>{a}</span>
      <span className="nb-border px-2 py-0.5 bg-card uppercase tracking-wider text-[10px]">{label}</span>
      <span className={`flex-1 ${!aWins ? "font-display text-base" : "opacity-60"}`}>{b}</span>
    </div>
  );
};
