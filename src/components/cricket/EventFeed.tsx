import { motion, AnimatePresence } from "framer-motion";

export type FeedEvent = { id: number; over: string; text: string; type: "run" | "boundary" | "wicket" | "info" };

export const EventFeed = ({ events }: { events: FeedEvent[] }) => (
  <div className="nb-card p-4 relative overflow-hidden bg-background">
    <div className="noise-bg"></div>
    <div className="flex items-center justify-between mb-3 relative z-10">
      <h3 className="font-display text-lg uppercase tracking-wider">BALL-BY-BALL</h3>
      <span className="nb-tag bg-nb-green animate-pulse-bold">REAL-TIME</span>
    </div>
    
    <div className="space-y-3 max-h-72 overflow-y-auto pr-2 relative z-10 custom-scrollbar">
      <AnimatePresence initial={false}>
        {events.map((e) => {
          const isWicket = e.type === "wicket";
          const isBoundary = e.type === "boundary";
          
          const color =
            isWicket ? "bg-nb-red text-white nb-glow" :
            isBoundary ? "bg-nb-yellow border-nb-yellow nb-glow" :
            e.type === "info" ? "bg-secondary/50" : "bg-card";
            
          return (
            <motion.div 
              key={e.id} 
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={`nb-border-thick ${color} p-3 flex gap-3 items-start relative overflow-hidden group`}
            >
              {isBoundary && (
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
              )}
              
              <span className={`font-display text-sm shrink-0 nb-border px-2 py-0.5 ${isWicket ? 'bg-white text-nb-red' : 'bg-background text-foreground'}`}>
                {e.over}
              </span>
              <span className={`text-sm ${isWicket || isBoundary ? 'font-bold' : 'font-medium'}`}>
                {e.text}
              </span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  </div>
);
