import { Player } from "./cricket-data";

export type Phase = "POWERPLAY" | "MIDDLE" | "DEATH";
export type PitchType = "FLAT" | "DUSTY" | "GREEN";

export interface TurnOutcome {
  runs: number;
  isWicket: boolean;
  message: string;
}

export const calculateTurnOutcome = (
  batsman: Player,
  bowler: Player,
  phase: Phase,
  pitch: PitchType,
  isFreeHit: boolean = false,
  randomFactor: number = Math.random()
): TurnOutcome => {
  // Base wicket chance
  let wicketChance = (100 - batsman.consistency) / 100 * 0.15;
  let runMultiplier = 1;

  // Apply Phase Modifiers
  if (phase === "POWERPLAY") {
    runMultiplier = 1.2;
    wicketChance *= 1.5;
  } else if (phase === "DEATH") {
    runMultiplier = 1.5;
    wicketChance *= 2.0;
  }

  // Apply Pitch Modifiers
  if (pitch === "FLAT") {
    runMultiplier *= 1.2; // High scoring
    wicketChance *= 0.8;
  } else if (pitch === "DUSTY") {
    wicketChance *= 1.3; // Harder to play
    runMultiplier *= 0.9;
  } else if (pitch === "GREEN") {
    if (phase === "POWERPLAY") {
      wicketChance *= 1.4; // Very dangerous early on
    }
  }

  // Check Wicket
  if (randomFactor < wicketChance) {
    if (isFreeHit) {
      // Free hit negates the wicket and gives a guaranteed boundary
      return {
        runs: 4,
        isWicket: false,
        message: `CAUGHT! But it's a FREE HIT! ${batsman.name} survives and smashes it for 4!`
      };
    }
    return {
      runs: 0,
      isWicket: true,
      message: `WICKET! ${batsman.name} is out!`
    };
  }

  // Calculate Runs
  const potentialRuns = [0, 1, 2, 4, 6];
  let runIndex = 0;
  if (randomFactor > 0.8) runIndex = 4;
  else if (randomFactor > 0.6) runIndex = 3;
  else if (randomFactor > 0.3) runIndex = 2;
  else if (randomFactor > 0.1) runIndex = 1;

  let finalRuns = Math.round(potentialRuns[runIndex] * runMultiplier);
  // Normalize runs to cricket scores
  if (finalRuns >= 6) finalRuns = 6;
  else if (finalRuns >= 4) finalRuns = 4;
  else if (finalRuns === 3) finalRuns = 2;

  let message = `${batsman.name} takes ${finalRuns} runs!`;
  if (finalRuns === 4) message = `FOUR! Beautiful shot by ${batsman.name}!`;
  if (finalRuns === 6) message = `SIX! ${batsman.name} launches it into the stands!`;
  if (finalRuns === 0) message = `Dot ball. Good defense by ${batsman.name}.`;

  if (isFreeHit) {
    message = `FREE HIT! ` + message;
  }

  return {
    runs: finalRuns,
    isWicket: false,
    message
  };
};
