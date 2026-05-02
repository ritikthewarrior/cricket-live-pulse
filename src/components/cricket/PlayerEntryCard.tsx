import { Player } from "@/lib/cricket-data";

export const PlayerEntryCard = ({ player, dismissed }: { player: Player; dismissed: Player }) => {
  const riskColor =
    player.prediction.risk === "Low" ? "bg-nb-green" :
    player.prediction.risk === "Medium" ? "bg-nb-yellow" : "bg-nb-red text-white";

  return (
    <div className="nb-card p-5 animate-slide-up relative overflow-hidden">
      {/* Stamp */}
      <div className="absolute -top-2 -right-2 z-10 rotate-12">
        <span className="inline-block nb-border-thick bg-nb-red text-white px-3 py-1 font-display text-sm nb-shadow-sm">
          NEW BATTER
        </span>
      </div>

      {/* Header */}
      <div className="flex gap-4 items-center">
        <div className="nb-border-thick nb-shadow-sm shrink-0">
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

      {/* Phase stats */}
      <div className="mt-4">
        <div className="text-xs font-bold uppercase opacity-70 mb-2">Phase Splits (AVG / SR)</div>
        <div className="grid grid-cols-3 gap-2">
          <PhaseBox label="P-PLAY" data={player.phaseStats.powerplay} color="bg-nb-yellow" />
          <PhaseBox label="MIDDLE" data={player.phaseStats.middle} color="bg-nb-pink" />
          <PhaseBox label="DEATH" data={player.phaseStats.death} color="bg-nb-red text-white" />
        </div>
      </div>

      {/* AI Prediction */}
      <div className="mt-5 nb-border-thick bg-foreground text-background p-4 nb-shadow-sm">
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

      {/* Comparison */}
      <div className="mt-4 nb-border bg-secondary p-3">
        <div className="text-xs font-bold uppercase opacity-70 mb-2">vs Dismissed Batter ({dismissed.name})</div>
        <CompareRow label="Avg" a={player.battingAvg} b={dismissed.battingAvg} />
        <CompareRow label="SR" a={player.strikeRate} b={dismissed.strikeRate} />
        <CompareRow label="Boundary %" a={player.boundaryPct} b={dismissed.boundaryPct} />
      </div>
    </div>
  );
};

const StatBlock = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className={`nb-border-thick ${color} p-3 nb-shadow-sm text-center`}>
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
