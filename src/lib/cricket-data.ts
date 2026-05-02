import player1 from "@/assets/player-1.png";
import player2 from "@/assets/player-2.png";
import player3 from "@/assets/player-3.png";

export type Player = {
  id: string;
  name: string;
  role: string;
  image: string;
  battingAvg: number;
  strikeRate: number;
  vsSpin: number;
  vsPace: number;
  recentForm: number[]; // last 5 scores
  boundaryPct: number;
  phaseStats: {
    powerplay: { avg: number; sr: number };
    middle: { avg: number; sr: number };
    death: { avg: number; sr: number };
  };
  prediction: {
    expectedRunsMin: number;
    expectedRunsMax: number;
    risk: "Low" | "Medium" | "High";
    boundaryProb: number; // 0-100
  };
  type?: string;
  average?: number;
  consistency?: number;
};

export const PLAYERS: Player[] = [
  {
    id: "p1",
    name: "R. SHARMA",
    role: "Opener · RHB",
    image: player1,
    battingAvg: 48.7,
    strikeRate: 142.3,
    vsSpin: 138,
    vsPace: 146,
    recentForm: [64, 28, 92, 14, 71],
    boundaryPct: 62,
    phaseStats: {
      powerplay: { avg: 52.1, sr: 158.2 },
      middle: { avg: 41.3, sr: 128.4 },
      death: { avg: 38.0, sr: 172.6 },
    },
    prediction: { expectedRunsMin: 35, expectedRunsMax: 60, risk: "Medium", boundaryProb: 68 },
    type: "BATSMAN",
    average: 48.7,
    consistency: 85,
  },
  {
    id: "p2",
    name: "V. KOHLI",
    role: "Top Order · RHB",
    image: player2,
    battingAvg: 53.4,
    strikeRate: 138.9,
    vsSpin: 144,
    vsPace: 134,
    recentForm: [82, 45, 11, 103, 56],
    boundaryPct: 54,
    phaseStats: {
      powerplay: { avg: 44.0, sr: 132.1 },
      middle: { avg: 58.2, sr: 138.6 },
      death: { avg: 47.5, sr: 168.3 },
    },
    prediction: { expectedRunsMin: 40, expectedRunsMax: 75, risk: "Low", boundaryProb: 58 },
    type: "BATSMAN",
    average: 53.4,
    consistency: 90,
  },
  {
    id: "p3",
    name: "S. GILL",
    role: "Middle Order · RHB",
    image: player3,
    battingAvg: 42.1,
    strikeRate: 134.6,
    vsSpin: 128,
    vsPace: 142,
    recentForm: [38, 76, 22, 49, 88],
    boundaryPct: 49,
    phaseStats: {
      powerplay: { avg: 36.8, sr: 124.0 },
      middle: { avg: 45.2, sr: 132.8 },
      death: { avg: 40.1, sr: 164.2 },
    },
    prediction: { expectedRunsMin: 25, expectedRunsMax: 55, risk: "High", boundaryProb: 52 },
    type: "BATSMAN",
    average: 42.1,
    consistency: 75,
  },
  {
    id: "p4",
    name: "S. SURYA",
    role: "Middle Order · RHB",
    image: player1,
    battingAvg: 45.2,
    strikeRate: 172.5,
    vsSpin: 155,
    vsPace: 168,
    recentForm: [12, 104, 65, 33, 89],
    boundaryPct: 68,
    phaseStats: {
      powerplay: { avg: 25.0, sr: 130.0 },
      middle: { avg: 48.5, sr: 165.2 },
      death: { avg: 55.0, sr: 210.5 },
    },
    prediction: { expectedRunsMin: 30, expectedRunsMax: 80, risk: "High", boundaryProb: 75 },
    type: "BATSMAN",
    average: 45.2,
    consistency: 65,
  },
  {
    id: "p5",
    name: "H. PANDYA",
    role: "All Rounder · RHB",
    image: player2,
    battingAvg: 31.5,
    strikeRate: 145.8,
    vsSpin: 125,
    vsPace: 155,
    recentForm: [45, 12, 0, 38, 55],
    boundaryPct: 58,
    phaseStats: {
      powerplay: { avg: 15.0, sr: 110.0 },
      middle: { avg: 35.2, sr: 135.8 },
      death: { avg: 42.5, sr: 185.0 },
    },
    prediction: { expectedRunsMin: 20, expectedRunsMax: 50, risk: "High", boundaryProb: 65 },
    type: "ALL ROUNDER",
    average: 31.5,
    consistency: 60,
  },
  {
    id: "p6",
    name: "J. BUMRAH",
    role: "Bowler · RHB",
    image: player3,
    battingAvg: 10.5,
    strikeRate: 95.5,
    vsSpin: 85,
    vsPace: 110,
    recentForm: [5, 2, 14, 0, 8],
    boundaryPct: 25,
    phaseStats: {
      powerplay: { avg: 5.0, sr: 80.0 },
      middle: { avg: 8.0, sr: 90.0 },
      death: { avg: 15.0, sr: 120.0 },
    },
    prediction: { expectedRunsMin: 5, expectedRunsMax: 15, risk: "High", boundaryProb: 30 },
    type: "BOWLER",
    average: 10.5,
    consistency: 30,
  },
  {
    id: "p7",
    name: "R. PANT",
    role: "Wk Batsman · LHB",
    image: player1,
    battingAvg: 34.8,
    strikeRate: 148.2,
    vsSpin: 158,
    vsPace: 142,
    recentForm: [56, 18, 92, 4, 35],
    boundaryPct: 65,
    phaseStats: {
      powerplay: { avg: 28.5, sr: 140.0 },
      middle: { avg: 38.2, sr: 155.5 },
      death: { avg: 45.0, sr: 175.2 },
    },
    prediction: { expectedRunsMin: 25, expectedRunsMax: 65, risk: "High", boundaryProb: 70 },
    type: "BATSMAN",
    average: 34.8,
    consistency: 60,
  },
];

export type MatchState = {
  teamA: string;
  teamB: string;
  battingTeam: string;
  bowlingTeam: string;
  runs: number;
  wickets: number;
  overs: number; // e.g. 12.4
  target: number;
  striker: Player;
  nonStriker: Player;
  lastBall: string;
  momentum: number; // 0-100, batting team momentum
};

export const INITIAL_MATCH: MatchState = {
  teamA: "IND",
  teamB: "AUS",
  battingTeam: "IND",
  bowlingTeam: "AUS",
  runs: 87,
  wickets: 1,
  overs: 11.3,
  target: 184,
  striker: PLAYERS[0],
  nonStriker: PLAYERS[1],
  lastBall: "4",
  momentum: 64,
};
