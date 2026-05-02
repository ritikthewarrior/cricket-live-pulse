import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Lobby = () => {
  const [roomCode, setRoomCode] = useState("");
  const navigate = useNavigate();

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomCode.trim()) {
      navigate(`/game?room=${roomCode}`);
    }
  };

  const handleCreate = () => {
    const newRoom = Math.random().toString(36).substring(2, 8).toUpperCase();
    navigate(`/game?room=${newRoom}`);
  };

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col items-center justify-center">
      <div className="nb-card p-8 max-w-md w-full text-center space-y-6">
        <h1 className="font-display text-4xl text-nb-blue">CRICKET CLASH</h1>
        <p className="text-muted-foreground">Challenge your friends to a strategic card battle.</p>
        
        <button 
          onClick={handleCreate}
          className="w-full nb-border-thick bg-nb-green text-black py-4 font-display text-xl nb-shadow-sm nb-hover"
        >
          CREATE NEW ROOM
        </button>

        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-border"></div>
          <span className="flex-shrink-0 mx-4 text-muted-foreground text-sm uppercase">Or join</span>
          <div className="flex-grow border-t border-border"></div>
        </div>

        <form onSubmit={handleJoin} className="space-y-4">
          <input 
            type="text" 
            placeholder="ENTER ROOM CODE" 
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            className="w-full nb-border-thick p-3 font-display text-center uppercase tracking-widest bg-card"
            maxLength={6}
          />
          <button 
            type="submit"
            className="w-full nb-border-thick bg-nb-yellow text-black py-4 font-display text-xl nb-shadow-sm nb-hover"
          >
            JOIN GAME
          </button>
        </form>

        <Link to="/" className="block mt-4 text-sm underline hover:text-nb-red">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Lobby;
