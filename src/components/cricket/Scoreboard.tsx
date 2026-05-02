import { MatchState } from "@/lib/cricket-data";
import { AnimatedCounter } from "./AnimatedCounter";

export const Scoreboard = ({ match }: { match: MatchState }) => {
  const rrr = ((match.target - match.runs) / (20 - match.overs)).toFixed(2);
  const crr = (match.runs / match.overs).toFixed(2);

  return (
    <div className="nb-card p-5 md:p-7 bg-nb-yellow nb-glow relative overflow-hidden">
      {/* Decorative noise */}
      <div className="noise-bg"></div>
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <span className="nb-tag bg-nb-red text-white animate-pulse-bold">
          <span className="w-2 h-2 rounded-full bg-white mr-2 inline-block"></span>
          LIVE
        </span>
        <span className="nb-tag bg-card text-foreground border-transparent backdrop-blur-sm bg-white/50">T20 · MATCH 14</span>
      </div>

      <div className="grid grid-cols-2 gap-3 md:gap-5 items-center relative z-10">
        <div className="nb-border-thick bg-card p-4 nb-shadow-sm transition-transform hover:-translate-y-1 duration-300">
          <div className="text-xs font-bold uppercase tracking-widest opacity-70">Batting</div>
          <div className="font-display text-3xl md:text-5xl mt-1 text-gradient">{match.battingTeam}</div>
          <div className="font-display text-4xl md:text-6xl mt-2 leading-none flex items-baseline">
            <AnimatedCounter value={match.runs} />
            <span className="text-2xl md:text-4xl text-muted-foreground ml-1">/<AnimatedCounter value={match.wickets} /></span>
          </div>
          <div className="text-sm font-bold mt-1 tracking-wider">OVERS {match.overs.toFixed(1)}</div>
        </div>

        <div className="nb-border-thick bg-nb-blue text-white p-4 nb-shadow-sm transition-transform hover:-translate-y-1 duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
          <div className="text-xs font-bold uppercase tracking-widest opacity-90 relative z-10">Target</div>
          <div className="font-display text-4xl md:text-6xl mt-1 leading-none drop-shadow-md relative z-10">
            <AnimatedCounter value={match.target} />
          </div>
          <div className="text-sm font-bold mt-3 space-y-1 relative z-10">
            <div>NEED <AnimatedCounter value={match.target - match.runs} /> IN <AnimatedCounter value={Math.round((20 - match.overs) * 6)} /></div>
            <div className="flex gap-3 pt-1 border-t border-white/20 mt-2">
              <span>CRR <b>{crr}</b></span>
              <span>RRR <b>{rrr}</b></span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-4 relative z-10">
        <Stat label="Striker" value={`${match.striker.name.split(" ")[1]} *`} color="bg-nb-green text-black" />
        <Stat label="Non-Striker" value={match.nonStriker.name.split(" ")[1]} color="bg-card text-foreground" />
        <Stat label="Last Ball" value={match.lastBall} color="bg-nb-pink text-black" />
      </div>
    </div>
  );
};

const Stat = ({ label, value, color }: { label: string; value: string; color: string }) => (
  <div className={`nb-border ${color} p-2 text-center nb-shadow-sm overflow-hidden relative group cursor-default`}>
    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
    <div className="text-[10px] font-bold uppercase opacity-80 tracking-widest relative z-10">{label}</div>
    <div className="font-display text-base md:text-lg truncate drop-shadow-sm relative z-10">{value}</div>
  </div>
);
