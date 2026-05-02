import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { PLAYERS, Player } from "@/lib/cricket-data";
import { useMatchmaking } from "@/hooks/useMatchmaking";
import { calculateTurnOutcome, Phase } from "@/lib/gameEngine";
import { motion, AnimatePresence } from "framer-motion";
import { useGameAudio } from "@/hooks/useGameAudio";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

const Game = () => {
  const [searchParams] = useSearchParams();
  const roomCode = searchParams.get("room") || "TEST";
  
  const { gameState, playCardSync, playerId } = useMatchmaking(roomCode);
  const [hand, setHand] = useState<Player[]>([]);
  const [playedCard, setPlayedCard] = useState<Player | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [freeHitActive, setFreeHitActive] = useState(false);
  const [freeHitUsed, setFreeHitUsed] = useState(false);
  const [shake, setShake] = useState(false);
  const [boundaryEvent, setBoundaryEvent] = useState<{runs: number, text: string} | null>(null);
  
  const { width, height } = useWindowSize();
  useGameAudio(gameState.turnResult, gameOver);

  useEffect(() => {
    // Deal 5 random players to hand
    const shuffled = [...PLAYERS].sort(() => 0.5 - Math.random());
    setHand(shuffled.slice(0, 5));
  }, []);

  const playCard = async (card: Player) => {
    if (playedCard) return; // Wait for turn to resolve
    setPlayedCard(card);

    // AI opponent card for simulation
    const opponentCard = PLAYERS[Math.floor(Math.random() * PLAYERS.length)];
    
    // Calculate outcome
    const outcome = calculateTurnOutcome(card, opponentCard, gameState.phase as Phase, gameState.pitch, freeHitActive);
    
    if (freeHitActive) {
      setFreeHitUsed(true);
      setFreeHitActive(false);
    }
    
    // Sync to network
    await playCardSync(card, outcome);

    // Handle cinematic effects
    if (outcome.runs >= 4) {
      setBoundaryEvent({ runs: outcome.runs, text: outcome.message });
      if (outcome.runs === 6) {
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
      setTimeout(() => setBoundaryEvent(null), 2500);
    } else if (outcome.isWicket) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }

    // Remove played card and draw new after a delay
    setTimeout(() => {
      setHand(prev => {
        const newHand = prev.filter(c => c.id !== card.id);
        const nextDraw = PLAYERS[Math.floor(Math.random() * PLAYERS.length)];
        return [...newHand, nextDraw];
      });
      setPlayedCard(null);
    }, 2500);
  };

  const isPlayer1 = gameState.player1Id === playerId;
  const myScore = isPlayer1 ? gameState.player1Score : gameState.player2Score;
  const oppScore = isPlayer1 ? gameState.player2Score : gameState.player1Score;

  const pitchThemes: Record<string, string> = {
    FLAT: "bg-[#FFF9E6]", // Soft sunny yellow
    DUSTY: "bg-[#F5F2EA]", // Earthy cream
    GREEN: "bg-[#F2F9F2]", // Pale grass green
  };

  return (
    <div className={`min-h-screen bg-background flex flex-col overflow-hidden ${shake ? "animate-shake" : ""}`}>
      <header className="p-4 border-b-4 border-black bg-foreground text-background flex justify-between items-center z-10">
        <div>
          <h1 className="font-display text-2xl tracking-widest">ROOM: {roomCode}</h1>
          <div className="flex items-center gap-2 mt-1">
             <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
             <p className="text-sm font-bold text-nb-yellow">PHASE: {gameState.phase}</p>
             <span className="text-muted-foreground">|</span>
             <p className="text-sm font-bold text-nb-pink">PITCH: {gameState.pitch}</p>
          </div>
        </div>
        <Link to="/lobby" className="nb-tag bg-nb-red">LEAVE GAME</Link>
      </header>

      <main className={`flex-1 p-6 flex flex-col justify-between relative transition-colors duration-1000 ${pitchThemes[gameState.pitch] || 'bg-background'}`}>
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        {/* Opponent Area */}
        <div className="flex justify-between items-center z-10">
          <div className="text-left">
            <h2 className="font-display text-xl text-muted-foreground">OPPONENT</h2>
            <div className="font-display text-4xl">{oppScore}</div>
          </div>
          <div className="flex gap-2 opacity-50 pointer-events-none">
             {Array.from({length: 5}).map((_, i) => (
                <div key={i} className="w-16 h-24 bg-card nb-border-thick rounded-md translate-y-[-10px]"></div>
             ))}
          </div>
        </div>

        {/* Center Arena */}
        <div className="flex flex-col items-center justify-center my-8 z-10 relative">
          <AnimatePresence>
            {playedCard && (
              <motion.div 
                initial={{ scale: 0, y: 100, rotate: -20 }}
                animate={{ scale: 1, y: 0, rotate: 0 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute z-20 w-48 h-72 nb-card bg-card flex flex-col"
              >
                <div className="h-1/2 w-full border-b-2 border-black overflow-hidden relative">
                   <img src={playedCard.image} alt={playedCard.name} className="object-cover w-full h-full" />
                </div>
                <div className="p-3 flex-1 flex flex-col justify-center items-center text-center bg-nb-yellow">
                  <span className="font-display text-xl">{playedCard.name}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="nb-card p-6 bg-nb-pink min-h-[140px] w-full max-w-xl text-center flex items-center justify-center mt-32 relative z-10">
            {gameState.turnResult ? (
              <motion.h2 
                key={gameState.turnResult}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="font-display text-3xl"
              >
                {gameState.turnResult}
              </motion.h2>
            ) : (
              <h2 className="font-display text-xl text-muted-foreground">Select a card to play...</h2>
            )}
          </div>
        </div>

        {/* Player Area */}
        <div className="flex justify-between items-end z-10">
          <div className="text-left shrink-0 mr-4">
            <h2 className="font-display text-xl">YOUR SCORE</h2>
            <div className="font-display text-6xl text-nb-blue">{myScore}</div>
            
            <button 
              onClick={() => setFreeHitActive(!freeHitActive)}
              disabled={freeHitUsed || !!playedCard || gameOver}
              className={`mt-2 nb-border-thick py-1 px-3 font-display text-sm nb-shadow-sm nb-hover w-full ${freeHitActive ? 'bg-nb-yellow' : 'bg-card'}`}
            >
              {freeHitUsed ? 'FREE HIT USED' : 'USE FREE HIT'}
            </button>

            <button 
              onClick={() => setGameOver(true)}
              className="mt-4 block w-full text-xs font-bold underline text-muted-foreground hover:text-nb-red"
            >
              END MATCH EARLY
            </button>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-4 px-4 w-full justify-start snap-x">
            {hand.map((card) => (
              <motion.button 
                key={card.id}
                onClick={() => playCard(card)}
                disabled={!!playedCard || gameOver}
                whileHover={{ y: -20, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-36 h-56 nb-card bg-card flex flex-col relative group shrink-0 snap-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="h-1/2 w-full border-b-2 border-black overflow-hidden relative">
                   <img src={card.image} alt={card.name} className="object-cover w-full h-full" />
                   <div className="absolute top-1 left-1 bg-nb-green nb-border px-2 py-1 text-xs font-bold shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                     SR: {card.strikeRate}
                   </div>
                </div>
                <div className="p-3 flex-1 flex flex-col bg-white">
                  <span className="font-display text-base leading-tight text-left">{card.name}</span>
                  <div className="mt-auto flex justify-between items-end">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">
                      {card.type}
                    </span>
                    <span className="text-xs font-bold px-1 bg-nb-yellow border border-black">
                      AVG: {card.average}
                    </span>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Cinematic Boundary Overlay */}
        <AnimatePresence>
          {boundaryEvent && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              className={`fixed inset-0 z-50 flex items-center justify-center mix-blend-exclusion pointer-events-none ${
                boundaryEvent.runs === 6 ? 'bg-nb-yellow' : 'bg-nb-blue'
              }`}
            >
              <motion.h1 
                initial={{ x: -1000, skewX: 45 }}
                animate={{ x: 0, skewX: 0 }}
                exit={{ x: 1000, skewX: -45 }}
                transition={{ type: "spring", damping: 12, mass: 0.5 }}
                className="font-display text-[15vw] md:text-[20vw] leading-none uppercase text-white drop-shadow-lg"
              >
                {boundaryEvent.runs === 6 ? "SIX!" : "FOUR!"}
              </motion.h1>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Match Summary Overlay */}
        <AnimatePresence>
          {gameOver && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            >
              {myScore > oppScore && <Confetti width={width} height={height} numberOfPieces={500} recycle={false} gravity={0.15} />}
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="nb-card bg-background max-w-lg w-full p-8 text-center space-y-6"
              >
                <h2 className="font-display text-4xl uppercase text-nb-blue">MATCH SUMMARY</h2>
                
                <div className="flex justify-between items-center px-4 py-6 bg-card nb-border-thick">
                  <div>
                    <p className="text-sm text-muted-foreground font-bold">YOU</p>
                    <p className="font-display text-5xl">{myScore}</p>
                  </div>
                  <div className="font-display text-2xl text-muted-foreground">VS</div>
                  <div>
                    <p className="text-sm text-muted-foreground font-bold">OPPONENT</p>
                    <p className="font-display text-5xl">{oppScore}</p>
                  </div>
                </div>

                <div className="py-4">
                  <h3 className="font-display text-2xl text-nb-green animate-pulse">
                    {myScore > oppScore ? "YOU WON!" : myScore < oppScore ? "YOU LOST!" : "IT'S A TIE!"}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2">+50 Match Points Earned</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => {
                      setGameOver(false);
                      // Reset logic would go here
                    }}
                    className="nb-border-thick bg-nb-yellow py-3 font-display text-lg nb-hover"
                  >
                    REMATCH
                  </button>
                  <Link 
                    to="/lobby"
                    className="nb-border-thick bg-nb-red text-white py-3 font-display text-lg nb-hover flex items-center justify-center"
                  >
                    RETURN TO LOBBY
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Game;
