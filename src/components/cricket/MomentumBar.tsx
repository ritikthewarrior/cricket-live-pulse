export const MomentumBar = ({ value, teamA, teamB }: { value: number; teamA: string; teamB: string }) => (
  <div className="nb-card p-4">
    <div className="flex items-center justify-between mb-2">
      <h3 className="font-display text-lg">MOMENTUM</h3>
      <span className="nb-tag bg-nb-yellow">LIVE</span>
    </div>
    <div className="flex items-center justify-between text-xs font-bold mb-1">
      <span>{teamA} {value}%</span>
      <span>{100 - value}% {teamB}</span>
    </div>
    <div className="nb-border-thick h-6 bg-card flex overflow-hidden">
      <div
        className="bg-nb-green transition-all duration-700"
        style={{ width: `${value}%` }}
      />
      <div
        className="bg-nb-red transition-all duration-700"
        style={{ width: `${100 - value}%` }}
      />
    </div>
  </div>
);
