import { ParticleBackground } from "./ParticleBackground";

export const MomentumBar = ({ value, teamA, teamB }: { value: number; teamA: string; teamB: string }) => {
  const isAWinning = value > 50;
  
  return (
    <div className="nb-card p-4 relative overflow-hidden bg-background">
      <ParticleBackground momentum={isAWinning ? value : 100 - value} teamColor={isAWinning ? '#22c55e' : '#ef4444'} />
      
      <div className="flex items-center justify-between mb-2 relative z-10">
        <h3 className="font-display text-lg tracking-wider">MOMENTUM</h3>
        <span className="nb-tag bg-nb-yellow animate-pulse-bold">LIVE</span>
      </div>
      
      <div className="flex items-center justify-between text-xs font-bold mb-2 relative z-10">
        <span className={`transition-colors ${isAWinning ? 'text-nb-green' : 'text-foreground'}`}>{teamA} {value}%</span>
        <span className={`transition-colors ${!isAWinning ? 'text-nb-red' : 'text-foreground'}`}>{100 - value}% {teamB}</span>
      </div>
      
      <div className="nb-border-thick h-8 bg-card flex overflow-hidden relative z-10 nb-shadow-sm p-1 rounded-sm">
        <div
          className="bg-gradient-to-r from-green-500 to-green-400 transition-all duration-700 ease-out relative overflow-hidden"
          style={{ width: `${value}%` }}
        >
          <div className="absolute inset-0 bg-white/20 w-[200%] animate-ticker"></div>
        </div>
        <div className="w-1 bg-foreground shrink-0 skew-x-12 mx-[-2px] z-10"></div>
        <div
          className="bg-gradient-to-l from-red-500 to-red-400 transition-all duration-700 ease-out relative overflow-hidden"
          style={{ width: `${100 - value}%` }}
        >
          <div className="absolute inset-0 bg-white/20 w-[200%] animate-ticker" style={{ animationDirection: 'reverse' }}></div>
        </div>
      </div>
    </div>
  );
};
