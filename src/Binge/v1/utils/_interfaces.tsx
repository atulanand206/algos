export type Player = {
  id: string;
  name: string;
  email: string;
};

export type TeamMini = {
  id: string;
  name: string;
  score: number;
};

export type Team = {
  id: string;
  name: string;
  players: Player[];
};

export type TeamRoster = {
  id: string;
  name: string;
  score: number;
  players: Player[];
};

export type Specs = {
  name: string;
  teams: number;
  players: number;
  questions: number;
  rounds: number;
};

export type Game = {
  id: string;
  quizmaster: Player;
  tags: string[];
  specs: Specs;
  active: boolean;
  can_join: boolean;
  players_joined: number;
};

export type Answer = {
  id: string;
  question_id: string;
  answer: string[];
  hints: string[];
};

export type Snap = {
  quiz_id: string;
  round_no: number;
  teams: TeamRoster[];
  question_no: number;
  question_id: string;
  team_s_turn: string;
  event_type: string;
  score: number;
  timestamp: string;
  question: string[];
  answer: string[];
  hint: string[];
  can_pass: boolean;
};

export type Score = {
  quiz_id: string;
  snapshots: Snap[];
};

export type GoogleProfile = {
  email: string;
  familyName: string;
  givenName: string;
  googleId: string;
  imageUrl: string;
  name: string;
};
