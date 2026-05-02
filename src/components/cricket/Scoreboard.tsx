import { MatchState } from "@/lib/cricket-data";

export const Scoreboard = ({ match }: { match: MatchState }) => {
  const rrr = ((match.target - match.runs) / (20 - match.overs)).toFixed(2);
  const crr = (match.runs / match.overs).toFixed(2);

  return (
    <div className="nb-card p-5 md:p-7 bg-nb-yellow">
      <div className="flex items-center justify-between mb-4">
        <span className="nb-tag bg-nb-red text-white">● LIVE</span>
        <span className="nb-tag bg-card">T20 · MATCH 14</span>
      </div>

      <div className="grid grid-cols-2 gap-3 md:gap-5 items-center">
        <div className="nb-border-thick bg-card p-4 nb-shadow-sm">
          <div className="text-xs font-bold uppercase tracking-widest opacity-70">Batting</div>
          <div className="font-display text-3xl md:text-5xl mt-1">{match.battingTeam}</div>
          <div className="font-display text-4xl md:text-6xl mt-2 leading-none">
            {match.runs}<span className="text-2xl md:text-4xl">/{match.wickets}</span>
          </div>
          <div className="text-sm font-bold mt-1">OVERS {match.overs.toFixed(1)}</div>
        </div>

        <div className="nb-border-thick bg-nb-blue text-white p-4 nb-shadow-sm">
          <div className="text-xs font-bold uppercase tracking-widest opacity-90">Target</div>
          <div className="font-display text-4xl md:text-6xl mt-1 leading-none">{match.target}</div>
          <div className="text-sm font-bold mt-3 space-y-1">
            <div>NEED {match.target - match.runs} IN {Math.round((20 - match.overs) * 6)}</div>
            <div className="flex gap-3">
              <span>CRR <b>{crr}</b></span>
              <span>RRR <b>{rrr}</b></span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-4">
        <Stat label="Striker" value={`${match.striker.name.split(" ")[1]} *`} color="bg-nb-green" />
        <Stat label="Non-Striker" value={match.nonStriker.name.split(" ")[1]} color="bg-card" />
        <Stat label="Last Ball" value={match.lastBall} color="bg-nb-pink" />
      </div>
    </div>
  );
};

const Stat = ({ label, value, color }: { label: string; value: string; color: string }) => (
  <div className={`nb-border ${color} p-2 text-center nb-shadow-sm`}>
    <div className="text-[10px] font-bold uppercase opacity-70">{label}</div>
    <div className="font-display text-base md:text-lg truncate">{value}</div>
  </div>
);
