import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Player } from "@/lib/cricket-data";
import { TurnOutcome } from "@/lib/gameEngine";

import { PitchType } from "@/lib/gameEngine";

export type GameState = {
  phase: string;
  pitch: PitchType;
  player1Score: number;
  player2Score: number;
  player1Id: string | null;
  player2Id: string | null;
  turnResult: string | null;
};

const PITCHES: PitchType[] = ["FLAT", "DUSTY", "GREEN"];
const getRandomPitch = () => PITCHES[Math.floor(Math.random() * PITCHES.length)];

export const useMatchmaking = (roomCode: string) => {
  const [gameState, setGameState] = useState<GameState>({
    phase: "POWERPLAY",
    pitch: getRandomPitch(),
    player1Score: 0,
    player2Score: 0,
    player1Id: null,
    player2Id: null,
    turnResult: null,
  });

  const [playerId, setPlayerId] = useState<string>("");

  useEffect(() => {
    // Generate a temporary ID for the user if they don't have one (for guest mode)
    const id = localStorage.getItem("temp_player_id") || Math.random().toString(36).substring(2, 9);
    localStorage.setItem("temp_player_id", id);
    setPlayerId(id);

    const channel = supabase.channel(`room:${roomCode}`, {
      config: {
        broadcast: { ack: true },
        presence: { key: id },
      },
    });

    channel
      .on("broadcast", { event: "game_state_update" }, ({ payload }) => {
        setGameState((prev) => ({ ...prev, ...payload }));
      })
      .on("broadcast", { event: "turn_played" }, ({ payload }) => {
        // Here we could handle when the opponent plays a card
        // We'll sync this securely through the channel
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({ online_at: new Date().toISOString() });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomCode]);

  const sendGameStateUpdate = async (newState: Partial<GameState>) => {
    setGameState((prev) => ({ ...prev, ...newState }));
    await supabase.channel(`room:${roomCode}`).send({
      type: "broadcast",
      event: "game_state_update",
      payload: newState,
    });
  };

  const playCardSync = async (card: Player, outcome: TurnOutcome) => {
    // Determine if we are player1 or player2
    const isPlayer1 = gameState.player1Id === playerId;
    
    const newState: Partial<GameState> = {
      turnResult: outcome.message
    };

    if (isPlayer1) {
      newState.player1Score = gameState.player1Score + outcome.runs;
    } else {
      newState.player2Score = gameState.player2Score + outcome.runs;
    }

    await sendGameStateUpdate(newState);
  };

  return { gameState, playCardSync, playerId };
};
