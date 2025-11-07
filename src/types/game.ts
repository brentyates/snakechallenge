export interface Position {
  x: number;
  y: number;
}

export const Direction = {
  UP: 'UP',
  DOWN: 'DOWN',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT'
} as const;

export type Direction = typeof Direction[keyof typeof Direction];

export interface GameConfig {
  boardWidth: number;
  boardHeight: number;
  cellSize: number;
  speed: number;
}

export interface GameState {
  snake: Position[];
  food: Position;
  direction: Direction;
  nextDirection: Direction;
  score: number;
  moves: number;
  isGameOver: boolean;
  isPaused: boolean;
  foodEaten: number;
}

export interface GameStats {
  score: number;
  moves: number;
  foodEaten: number;
  snakeLength: number;
  percentComplete: number;
  direction: Direction;
  head: Position;
  food: Position;
}

export interface LeaderboardEntry {
  id: string;
  username: string;
  score: number;
  moves: number;
  foodEaten: number;
  snakeLength: number;
  createdAt: string;
}

export interface UserScript {
  code: string;
  name: string;
}

// User script context that will be passed to the script
export interface ScriptContext {
  getHead: () => Position;
  getFood: () => Position;
  getDirection: () => Direction;
  getSnake: () => Position[];
  getBoardSize: () => { width: number; height: number };
  setDirection: (direction: Direction) => void;
}

export type UserScriptFunction = (ctx: ScriptContext) => Direction | void;
