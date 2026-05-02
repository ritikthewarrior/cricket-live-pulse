import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { INITIAL_MATCH, MatchState, PLAYERS, Player } from "@/lib/cricket-data";
import { Scoreboard } from "@/components/cricket/Scoreboard";
import { MomentumBar } from "@/components/cricket/MomentumBar";
import { WicketBanner } from "@/components/cricket/WicketBanner";
import { PlayerEntryCard } from "@/components/cricket/PlayerEntryCard";
import { EventFeed, FeedEvent } from "@/components/cricket/EventFeed";
import { Notifications, Notif } from "@/components/cricket/Notifications";

const Index = () => {
  const [match, setMatch] = useState<MatchState>(INITIAL_MATCH);
  const [events, setEvents] = useState<FeedEvent[]>([
    { id: 1, over: "11.3", text: "FOUR! Driven through cover-point.", type: "boundary" },
    { id: 2, over: "11.2", text: "Single, pushed to mid-on.", type: "run" },
    { id: 3, over: "11.1", text: "Dot ball, beaten outside off.", type: "info" },
  ]);
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [wicketActive, setWicketActive] = useState(false);
  const [boundaryEvent, setBoundaryEvent] = useState<{runs: number, text: string} | null>(null);
  const [shake, setShake] = useState(false);
  const [dismissedPlayer, setDismissedPlayer] = useState<Player | null>(null);
  const [newPlayer, setNewPlayer] = useState<Player | null>(null);
  const eventIdRef = useRef(100);
  const notifIdRef = useRef(0);

  const pushEvent = (e: Omit<FeedEvent, "id">) =>
    setEvents((prev) => [{ ...e, id: ++eventIdRef.current }, ...prev].slice(0, 30));

  const pushNotif = (n: Omit<Notif, "id">) => {
    const id = ++notifIdRef.current;
    setNotifs((prev) => [...prev, { ...n, id }]);
    setTimeout(() => setNotifs((prev) => prev.filter((x) => x.id !== id)), 4000);
  };

  // Simulated live tick — replace with WebSocket/Firebase in production
  useEffect(() => {
    const tick = setInterval(() => {
      setMatch((m) => {
        const roll = Math.random();
        let runs = 0;
        let evType: FeedEvent["type"] = "run";
        let text = "";

        if (roll < 0.08 && m.wickets < 9) {
          // WICKET
          const dismissed = m.striker;
          const remaining = PLAYERS.filter((p) => p.id !== m.striker.id && p.id !== m.nonStriker.id);
          const next = remaining[Math.floor(Math.random() * remaining.length)] || PLAYERS[2];
          setDismissedPlayer(dismissed);
          setNewPlayer(next);
          setNewPlayer(next);
          setWicketActive(true);
          setShake(true);
          setTimeout(() => setShake(false), 500);
          pushEvent({ over: nextOver(m.overs), text: `WICKET! ${dismissed.name} caught at mid-off.`, type: "wicket" });
          pushNotif({ text: `🚨 WICKET! ${dismissed.name} departs.`, tone: "alert" });
          return {
            ...m,
            wickets: m.wickets + 1,
            overs: bumpOver(m.overs),
            lastBall: "W",
            striker: next,
            momentum: Math.max(20, m.momentum - 18),
          };
        } else if (roll < 0.22) {
          runs = 4;
          evType = "boundary";
          text = "FOUR! Cracked through the covers.";
          setBoundaryEvent({ runs, text });
          setTimeout(() => setBoundaryEvent(null), 2500);
        } else if (roll < 0.28) {
          runs = 6;
          evType = "boundary";
          text = "SIX! Launched over long-on!";
          pushNotif({ text: "💥 MAXIMUM! Huge hit!", tone: "success" });
          setBoundaryEvent({ runs, text });
          setShake(true);
          setTimeout(() => setShake(false), 500);
          setTimeout(() => setBoundaryEvent(null), 2500);
        } else if (roll < 0.55) {
          runs = 1;
          text = "Single taken.";
        } else if (roll < 0.7) {
          runs = 2;
          text = "Couple of runs.";
        } else {
          runs = 0;
          evType = "info";
          text = "Dot ball.";
        }

        pushEvent({ over: nextOver(m.overs), text, type: evType });
        return {
          ...m,
          runs: m.runs + runs,
          overs: bumpOver(m.overs),
          lastBall: String(runs),
          momentum: Math.max(5, Math.min(95, m.momentum + (runs >= 4 ? 4 : runs === 0 ? -3 : 1))),
          striker: runs % 2 === 1 ? m.nonStriker : m.striker,
          nonStriker: runs % 2 === 1 ? m.striker : m.nonStriker,
        };
      });
    }, 3500);
    return () => clearInterval(tick);
  }, []);

  return (
    <div className={`min-h-screen bg-background overflow-x-hidden ${shake ? "animate-shake" : ""}`}>
      {/* Top ticker */}
      <div className="bg-foreground text-background nb-border-thick border-x-0 border-t-0 overflow-hidden">
        <div className="flex animate-ticker whitespace-nowrap py-2 font-display text-sm">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex gap-8 px-4 shrink-0">
              <span>● LIVE T20 · IND vs AUS</span>
              <span>★ NEOBRUTAL CRICKET</span>
              <span>⚡ AI-POWERED INSIGHTS</span>
              <span>● BALL-BY-BALL UPDATES</span>
              <span>★ WICKET ALERTS</span>
              <span>⚡ MOMENTUM TRACKER</span>
            </div>
          ))}
        </div>
      </div>

      {/* Header */}
      <header className="max-w-7xl mx-auto px-4 md:px-6 pt-6 pb-4 flex items-end justify-between flex-wrap gap-3">
        <div>
          <div className="inline-block nb-border-thick bg-nb-yellow px-3 py-1 nb-shadow-sm rotate-[-2deg] mb-2">
            <span className="font-display text-xs uppercase">Live Cricket</span>
          </div>
          <h1 className="font-display text-4xl md:text-6xl leading-none">
            BOLD<span className="text-nb-red">.</span>BALL<span className="text-nb-blue">.</span>
          </h1>
        </div>
        <div className="flex gap-2">
          <span className="nb-tag bg-nb-green">● CONNECTED</span>
          <span className="nb-tag bg-card">v1.0</span>
        </div>
      </header>

      {/* Main grid */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 pb-16 grid grid-cols-1 lg:grid-cols-3 gap-5">
        <section className="lg:col-span-2 space-y-5">
          <Scoreboard match={match} />
          <MomentumBar value={match.momentum} teamA={match.battingTeam} teamB={match.bowlingTeam} />

          {/* Current batters strip */}
          <div className="grid grid-cols-2 gap-4">
            <BatterStrip player={match.striker} striker />
            <BatterStrip player={match.nonStriker} />
          </div>

          {/* New player entry card lives here after a wicket */}
          {newPlayer && dismissedPlayer && (
            <PlayerEntryCard player={newPlayer} dismissed={dismissedPlayer} />
          )}
        </section>

        <aside className="space-y-5">
          <EventFeed events={events} />
          <div className="nb-card p-4 bg-nb-pink">
            <h3 className="font-display text-lg mb-2">QUICK ACTIONS</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => simulateWicket(match, setMatch, setDismissedPlayer, setNewPlayer, setWicketActive, pushEvent, pushNotif)}
                className="nb-border-thick bg-nb-red text-white py-2 font-display text-sm nb-shadow-sm nb-hover"
              >
                FORCE WICKET
              </button>
              <Link to="/lobby" className="nb-border-thick bg-nb-blue text-white py-2 font-display text-sm nb-shadow-sm nb-hover text-center leading-loose">
                PLAY WITH FRIENDS
              </Link>
            </div>
          </div>
        </aside>
      </main>

      {wicketActive && dismissedPlayer && (
        <WicketBanner playerName={dismissedPlayer.name} onClose={() => setWicketActive(false)} />
      )}

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

      <Notifications items={notifs} />
    </div>
  );
};

const BatterStrip = ({ player, striker }: { player: Player; striker?: boolean }) => (
  <div className={`nb-card p-3 flex gap-3 items-center ${striker ? "bg-nb-green" : ""}`}>
    <img src={player.image} alt={player.name} width={56} height={56} loading="lazy" className="w-14 h-14 nb-border object-cover" />
    <div className="min-w-0">
      <div className="font-display text-sm md:text-base truncate">
        {player.name}{striker ? " *" : ""}
      </div>
      <div className="text-[11px] font-bold uppercase opacity-70">SR {player.strikeRate}</div>
    </div>
  </div>
);

const bumpOver = (o: number) => {
  const balls = Math.round((o % 1) * 10) + 1;
  const completed = Math.floor(o);
  if (balls >= 6) return completed + 1;
  return completed + balls / 10;
};
const nextOver = (o: number) => bumpOver(o).toFixed(1);

const simulateWicket = (
  m: MatchState,
  setM: (fn: (m: MatchState) => MatchState) => void,
  setDismissed: (p: Player) => void,
  setNew: (p: Player) => void,
  setBanner: (b: boolean) => void,
  pushEvent: (e: Omit<FeedEvent, "id">) => void,
  pushNotif: (n: Omit<Notif, "id">) => void
) => {
  setM((cur) => {
    const dismissed = cur.striker;
    const remaining = PLAYERS.filter((p) => p.id !== cur.striker.id && p.id !== cur.nonStriker.id);
    const next = remaining[Math.floor(Math.random() * remaining.length)] || PLAYERS[2];
    setDismissed(dismissed);
    setNew(next);
    setBanner(true);
    pushEvent({ over: nextOver(cur.overs), text: `WICKET! ${dismissed.name} bowled.`, type: "wicket" });
    pushNotif({ text: `🚨 WICKET! ${dismissed.name} departs.`, tone: "alert" });
    return { ...cur, wickets: cur.wickets + 1, overs: bumpOver(cur.overs), lastBall: "W", striker: next, momentum: Math.max(20, cur.momentum - 18) };
  });
};

export default Index;
