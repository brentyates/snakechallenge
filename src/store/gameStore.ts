import { create } from 'zustand';
import { Direction } from '../types/game';
import type { GameConfig, GameState } from '../types/game';

interface GameStore {
  worker: Worker | null;
  gameState: GameState | null;
  isRunning: boolean;
  speed: number;
  userCode: string;
  animationFrameId: number | null;
  tick: number;
  isSkipping: boolean;
  skipProgress: number;
  scriptError: string | null;

  initGame: (config: GameConfig) => void;
  startGame: () => void;
  stopGame: () => void;
  resetGame: () => void;
  setSpeed: (speed: number) => void;
  setDirection: (direction: Direction) => void;
  setUserCode: (code: string) => void;
  compileAndSetScript: () => void;
  skipMoves: (count: number) => void;
  clearScriptError: () => void;
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
//
// 💡 Debugging: Your console.log() messages appear in browser console (F12)
// prefixed with 🤖 [Your Script]

function main(ctx) {
  const head = ctx.getHead();
  const food = ctx.getFood();

  // Uncomment to see debug output:
  // console.log('Head:', head, 'Food:', food);

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
  worker: null,
  gameState: null,
  isRunning: false,
  speed: DEFAULT_CONFIG.speed,
  userCode: DEFAULT_USER_CODE,
  animationFrameId: null,
  tick: 0,
  isSkipping: false,
  skipProgress: 0,
  scriptError: null,

  initGame: (config: GameConfig) => {
    // Terminate existing worker if any (prevent memory leaks)
    const existingWorker = get().worker;
    if (existingWorker) {
      existingWorker.terminate();
    }

    // Create worker
    const worker = new Worker(
      new URL('../workers/gameWorker.ts', import.meta.url),
      { type: 'module' }
    );

    // Set up message handler
    worker.onmessage = (event) => {
      const { type, state, current, total, payload } = event.data;

      switch (type) {
        case 'INITIALIZED':
          console.log('Worker initialized');
          break;

        case 'CONSOLE_LOG':
          // Forward console messages from worker to main thread
          const { level, args } = payload;
          const prefix = '🤖 [Your Script]';
          if (level === 'error') {
            console.error(prefix, ...args);
          } else if (level === 'warn') {
            console.warn(prefix, ...args);
          } else if (level === 'info') {
            console.info(prefix, ...args);
          } else {
            console.log(prefix, ...args);
          }
          break;

        case 'SCRIPT_ERROR':
          // Display script errors in UI
          const errorMsg = `${payload.message}\n${payload.stack || ''}`;
          set({ scriptError: errorMsg });
          console.error('🤖 [Your Script] Error:', payload.message);
          if (payload.stack) {
            console.error(payload.stack);
          }
          break;

        case 'STARTED':
        case 'STATE_UPDATE':
        case 'RESET_COMPLETE':
          set({ gameState: state, tick: get().tick + 1, scriptError: null });
          if (state.isGameOver) {
            set({ isRunning: false });
          }
          break;

        case 'SKIP_PROGRESS':
          set({
            gameState: state,
            skipProgress: Math.floor((current / total) * 100),
            tick: get().tick + 1,
          });
          break;

        case 'SKIP_COMPLETE':
          set({
            gameState: state,
            isSkipping: false,
            skipProgress: 100,
            tick: get().tick + 1,
          });
          // Resume normal game loop if was running before skip
          // Check both isRunning flag and that game isn't over
          if (get().isRunning && !state.isGameOver) {
            // Small delay to ensure state is settled
            setTimeout(() => {
              // Double-check still running (user might have clicked stop)
              if (get().isRunning) {
                const { startGame } = get();
                startGame();
              }
            }, 100);
          }
          break;

        case 'SCRIPT_SET':
          console.log('Script compiled successfully');
          break;

        default:
          console.warn('Unknown message type:', type);
      }
    };

    worker.onerror = (error) => {
      console.error('Worker error:', error);
    };

    // Initialize worker
    worker.postMessage({ type: 'INIT', payload: { config } });

    set({ worker });
  },

  startGame: () => {
    const { worker, animationFrameId, isSkipping } = get();
    if (!worker || isSkipping) return;

    // Cancel any existing animation frame
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }

    // Reset game
    worker.postMessage({ type: 'START' });
    set({ isRunning: true, tick: 0 });

    const gameLoop = () => {
      const { worker, isRunning, speed, isSkipping } = get();
      if (!worker || !isRunning || isSkipping) return;

      // Send update message to worker
      worker.postMessage({ type: 'UPDATE' });

      // Continue loop based on speed
      const delay = 1000 / speed;
      setTimeout(() => {
        const frameId = requestAnimationFrame(gameLoop);
        set({ animationFrameId: frameId });
      }, delay);
    };

    const frameId = requestAnimationFrame(gameLoop);
    set({ animationFrameId: frameId });
  },

  stopGame: () => {
    const { animationFrameId } = get();
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    set({ isRunning: false, animationFrameId: null });
  },

  resetGame: () => {
    const { worker, animationFrameId } = get();
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    if (worker) {
      worker.postMessage({ type: 'RESET' });
    }
    set({ isRunning: false, animationFrameId: null, tick: 0 });
  },

  setSpeed: (speed: number) => {
    set({ speed });
  },

  setDirection: (direction: Direction) => {
    const { worker } = get();
    if (worker) {
      worker.postMessage({ type: 'SET_DIRECTION', payload: { direction } });
    }
  },

  setUserCode: (code: string) => {
    set({ userCode: code });
  },

  compileAndSetScript: () => {
    const { worker, userCode } = get();
    if (!worker) return;

    worker.postMessage({ type: 'SET_SCRIPT', payload: { code: userCode } });
  },

  skipMoves: (count: number) => {
    const { worker, animationFrameId, isSkipping } = get();
    if (!worker || isSkipping) return; // Prevent double skip

    // Stop game loop temporarily
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      set({ animationFrameId: null });
    }

    set({ isSkipping: true, skipProgress: 0 });

    // Send skip message to worker (runs in background thread)
    worker.postMessage({ type: 'SKIP_MOVES', payload: { count } });
  },

  clearScriptError: () => {
    set({ scriptError: null });
  },
}));
