import { motion } from "framer-motion";

export const WicketBanner = ({ playerName, onClose }: { playerName: string; onClose: () => void }) => {
  // Split name for staggered animation
  const nameChars = playerName.split("");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md cursor-pointer"
      onClick={onClose}
    >
      {/* Red vignette effect */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(239,68,68,0.5)]"></div>
      
      <div className="text-center px-6 relative z-10">
        <motion.div 
          initial={{ scale: 0.5, rotate: 10, y: 50 }}
          animate={{ scale: 1, rotate: -2, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className="inline-block bg-nb-red text-white nb-border-thick nb-shadow-lg px-8 md:px-16 py-6 md:py-10 animate-shake relative overflow-hidden"
        >
          {/* Glitch overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-30 mix-blend-overlay pointer-events-none"></div>
          
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-display text-6xl md:text-9xl leading-none tracking-tighter drop-shadow-md"
          >
            WICKET!
          </motion.div>
          <div className="font-display text-xl md:text-4xl mt-2 flex justify-center mt-4">
            {nameChars.map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.05, type: "spring" }}
                className="inline-block"
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + nameChars.length * 0.05 + 0.2 }}
              className="ml-2 text-nb-yellow"
            >
              OUT
            </motion.span>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-8 inline-block nb-border bg-nb-yellow px-6 py-3 nb-shadow-sm rotate-2 font-bold uppercase tracking-widest animate-pulse-bold"
        >
          Tap anywhere to continue
        </motion.div>
      </div>
    </motion.div>
  );
};
