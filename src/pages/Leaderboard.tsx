import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// Mock data - in a real app, this comes from Supabase
const LEADERBOARD_DATA = [
  { rank: 1, name: "Virat_K", points: 2450, winRate: "78%" },
  { rank: 2, name: "Hitman45", points: 2100, winRate: "72%" },
  { rank: 3, name: "Smriti_18", points: 1950, winRate: "68%" },
  { rank: 4, name: "BoomBoom", points: 1800, winRate: "65%" },
  { rank: 5, name: "CaptainCool", points: 1750, winRate: "64%" },
  { rank: 6, name: "KingKohli", points: 1600, winRate: "60%" },
  { rank: 7, name: "You (Guest)", points: 50, winRate: "100%" }, // Mocking the user's current score
];

const Leaderboard = () => {
  return (
    <div className="min-h-screen bg-background p-6 flex flex-col items-center">
      <header className="w-full max-w-2xl flex justify-between items-center mb-8">
        <h1 className="font-display text-4xl text-nb-blue">GLOBAL RANKINGS</h1>
        <Link to="/lobby" className="nb-tag bg-nb-red">BACK TO LOBBY</Link>
      </header>

      <div className="w-full max-w-2xl space-y-4">
        {/* Podium for Top 3 */}
        <div className="flex justify-center items-end gap-2 mb-12 h-48">
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: '70%' }}
            className="w-24 bg-zinc-300 nb-border-thick flex flex-col items-center justify-start pt-4"
          >
            <span className="font-display text-2xl">2</span>
            <span className="text-xs font-bold mt-2 truncate w-full px-1 text-center">{LEADERBOARD_DATA[1].name}</span>
          </motion.div>
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: '100%' }}
            className="w-24 bg-nb-yellow nb-border-thick flex flex-col items-center justify-start pt-4"
          >
            <span className="font-display text-4xl">1</span>
            <span className="text-xs font-bold mt-2 truncate w-full px-1 text-center">{LEADERBOARD_DATA[0].name}</span>
          </motion.div>
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: '50%' }}
            className="w-24 bg-orange-400 nb-border-thick flex flex-col items-center justify-start pt-4"
          >
            <span className="font-display text-2xl">3</span>
            <span className="text-xs font-bold mt-2 truncate w-full px-1 text-center">{LEADERBOARD_DATA[2].name}</span>
          </motion.div>
        </div>

        {/* List for rest */}
        <div className="nb-card bg-card p-0 overflow-hidden">
          <div className="grid grid-cols-4 bg-foreground text-background p-3 font-display text-sm">
            <div>RANK</div>
            <div className="col-span-2">PLAYER</div>
            <div className="text-right">POINTS</div>
          </div>
          <div className="divide-y-2 divide-black">
            {LEADERBOARD_DATA.map((player) => (
              <motion.div 
                key={player.rank}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: player.rank * 0.1 }}
                className={`grid grid-cols-4 p-3 items-center ${player.name.includes('You') ? 'bg-nb-green' : 'bg-white'}`}
              >
                <div className="font-display text-xl">{player.rank}</div>
                <div className="col-span-2 font-bold flex flex-col">
                  {player.name}
                  <span className="text-xs text-muted-foreground font-normal">Win Rate: {player.winRate}</span>
                </div>
                <div className="text-right font-display text-lg text-nb-blue">{player.points}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
