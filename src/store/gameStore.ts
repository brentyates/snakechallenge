import { create } from 'zustand';
import { SnakeGame } from '../engine/SnakeGame';
import { Direction } from '../types/game';
import type { GameConfig, UserScriptFunction } from '../types/game';

interface GameStore {
  game: SnakeGame | null;
  isRunning: boolean;
  speed: number;
  userCode: string;
  animationFrameId: number | null;
  tick: number; // Increments on each game loop to trigger re-renders

  initGame: (config: GameConfig) => void;
  startGame: () => void;
  stopGame: () => void;
  resetGame: () => void;
  setSpeed: (speed: number) => void;
  setDirection: (direction: Direction) => void;
  setUserCode: (code: string) => void;
  compileAndSetScript: () => void;
  skipMoves: (count: number) => void;
}

const DEFAULT_CONFIG: GameConfig = {
  boardWidth: 40,
  boardHeight: 30,
  cellSize: 8,
  speed: 10,
};

const DEFAULT_USER_CODE = `// Welcome to Snake Challenge!
// Write your AI here to control the snake
//
// Available functions:
// - ctx.getHead() - returns {x, y} of snake head
// - ctx.getFood() - returns {x, y} of food
// - ctx.getDirection() - returns current direction
// - ctx.getSnake() - returns array of {x, y} positions
// - ctx.getBoardSize() - returns {width, height}
//
// Return Direction.UP, Direction.DOWN, Direction.LEFT, or Direction.RIGHT
// Or use ctx.setDirection(direction)

function main(ctx) {
  const head = ctx.getHead();
  const food = ctx.getFood();

  // Simple AI: move towards food
  if (head.x < food.x) {
    return 'RIGHT';
  } else if (head.x > food.x) {
    return 'LEFT';
  } else if (head.y < food.y) {
    return 'DOWN';
  } else {
    return 'UP';
  }
}
`;

export const useGameStore = create<GameStore>((set, get) => ({
  game: null,
  isRunning: false,
  speed: DEFAULT_CONFIG.speed,
  userCode: DEFAULT_USER_CODE,
  animationFrameId: null,
  tick: 0,

  initGame: (config: GameConfig) => {
    const game = new SnakeGame(config);
    set({ game });
  },

  startGame: () => {
    const { game, animationFrameId } = get();
    if (!game) return;

    // Cancel any existing animation frame
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }

    game.reset();
    game.resume();
    set({ isRunning: true });

    const gameLoop = (timestamp: number) => {
      const { game, isRunning } = get();
      if (!game || !isRunning) return;

      game.update(timestamp);
      set({ tick: get().tick + 1 }); // Increment tick to trigger re-renders

      if (!game.getState().isGameOver) {
        const frameId = requestAnimationFrame(gameLoop);
        set({ animationFrameId: frameId });
      } else {
        set({ isRunning: false, animationFrameId: null });
      }
    };

    const frameId = requestAnimationFrame(gameLoop);
    set({ animationFrameId: frameId });
  },

  stopGame: () => {
    const { game, animationFrameId } = get();
    if (game) {
      game.pause();
    }
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    set({ isRunning: false, animationFrameId: null });
  },

  resetGame: () => {
    const { game, animationFrameId } = get();
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    if (game) {
      game.reset();
    }
    set({ isRunning: false, animationFrameId: null, tick: 0 });
  },

  setSpeed: (speed: number) => {
    const { game } = get();
    if (game) {
      const config = game.getConfig();
      config.speed = speed;
      set({ speed });
    }
  },

  setDirection: (direction: Direction) => {
    const { game } = get();
    if (game) {
      game.setDirection(direction);
    }
  },

  setUserCode: (code: string) => {
    set({ userCode: code });
  },

  compileAndSetScript: () => {
    const { game, userCode } = get();
    if (!game) return;

    try {
      // Create a safe function from user code
      const scriptFunction = new Function('ctx', 'Direction', `
        ${userCode}
        return main(ctx);
      `) as (ctx: any, Direction: any) => string;

      const wrappedFunction: UserScriptFunction = (ctx) => {
        const result = scriptFunction(ctx, Direction);
        return result as Direction;
      };

      game.setUserScript(wrappedFunction);
    } catch (error) {
      console.error('Error compiling script:', error);
      alert('Error in your script: ' + (error as Error).message);
    }
  },

  skipMoves: (count: number) => {
    const { game } = get();
    if (!game) return;

    game.skipMoves(count);
  },
}));
