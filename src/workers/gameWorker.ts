// Web Worker for running game logic off the main thread
// This prevents UI freezing during skip moves

import type { GameConfig, Direction } from '../types/game';

// Security: Deep freeze helper to prevent user scripts from modifying game state
function deepFreeze<T>(obj: T): T {
  Object.freeze(obj);
  Object.getOwnPropertyNames(obj).forEach(prop => {
    const value = (obj as any)[prop];
    if (value && typeof value === 'object' && !Object.isFrozen(value)) {
      deepFreeze(value);
    }
  });
  return obj;
}

interface Position {
  x: number;
  y: number;
}

interface WorkerGameState {
  snake: Position[];
  food: Position;
  direction: Direction;
  nextDirection: Direction;
  score: number;
  moves: number;
  isGameOver: boolean;
  foodEaten: number;
}

class WorkerSnakeGame {
  private config: GameConfig;
  private state: WorkerGameState;
  private userScript: Function | null = null;

  constructor(config: GameConfig) {
    this.config = config;
    this.state = this.initializeGame();
  }

  // Security: Validate direction to prevent invalid values
  private isValidDirection(value: any): value is Direction {
    return value === 'UP' || value === 'DOWN' || value === 'LEFT' || value === 'RIGHT';
  }

  private initializeGame(): WorkerGameState {
    const centerX = Math.floor(this.config.boardWidth / 2);
    const centerY = Math.floor(this.config.boardHeight / 2);

    const snake: Position[] = [];
    for (let i = 0; i < 5; i++) {
      snake.push({ x: centerX + i, y: centerY });
    }

    return {
      snake,
      food: this.generateFood(snake),
      direction: 'LEFT' as Direction,
      nextDirection: 'LEFT' as Direction,
      score: 0,
      moves: 0,
      isGameOver: false,
      foodEaten: 0,
    };
  }

  private generateFood(snake: Position[]): Position {
    let food: Position;
    do {
      food = {
        x: Math.floor(Math.random() * this.config.boardWidth),
        y: Math.floor(Math.random() * this.config.boardHeight),
      };
    } while (this.isPositionInSnake(food, snake));
    return food;
  }

  private isPositionInSnake(pos: Position, snake: Position[]): boolean {
    return snake.some(segment => segment.x === pos.x && segment.y === pos.y);
  }

  public setUserScript(code: string): void {
    try {
      // Create function from user code
      const scriptFunction = new Function('ctx', 'Direction', `
        ${code}
        return main(ctx);
      `);
      this.userScript = scriptFunction;
    } catch (error) {
      throw new Error(`Script compilation error: ${(error as Error).message}`);
    }
  }

  public setDirection(direction: Direction): void {
    const opposites: Record<Direction, Direction> = {
      UP: 'DOWN',
      DOWN: 'UP',
      LEFT: 'RIGHT',
      RIGHT: 'LEFT',
    };

    if (opposites[this.state.direction] !== direction) {
      this.state.nextDirection = direction;
    }
  }

  public getState(): WorkerGameState {
    return { ...this.state };
  }

  public reset(): void {
    this.state = this.initializeGame();
  }

  public update(): boolean {
    if (this.state.isGameOver) return false;

    // Execute user script if available
    if (this.userScript) {
      try {
        // Security: Create sandboxed context with deep-frozen objects
        const ctx = Object.freeze({
          getHead: () => deepFreeze({ ...this.state.snake[0] }),
          getFood: () => deepFreeze({ ...this.state.food }),
          getDirection: () => this.state.direction, // Primitive, already immutable
          getSnake: () => deepFreeze(this.state.snake.map(pos => ({ ...pos }))),
          getBoardSize: () => deepFreeze({
            width: this.config.boardWidth,
            height: this.config.boardHeight,
          }),
          setDirection: (dir: Direction) => this.setDirection(dir),
        });

        const Direction = Object.freeze({
          UP: 'UP' as const,
          DOWN: 'DOWN' as const,
          LEFT: 'LEFT' as const,
          RIGHT: 'RIGHT' as const,
        });

        const result = this.userScript(ctx, Direction);
        // Security: Validate return value before applying
        if (result && this.isValidDirection(result)) {
          this.setDirection(result);
        }
      } catch (error) {
        console.error('Error executing user script:', error);
      }
    }

    // Update direction
    this.state.direction = this.state.nextDirection;

    // Move snake
    const head = this.state.snake[0];
    let newHead: Position;

    switch (this.state.direction) {
      case 'UP':
        newHead = { x: head.x, y: head.y - 1 };
        break;
      case 'DOWN':
        newHead = { x: head.x, y: head.y + 1 };
        break;
      case 'LEFT':
        newHead = { x: head.x - 1, y: head.y };
        break;
      case 'RIGHT':
        newHead = { x: head.x + 1, y: head.y };
        break;
    }

    // Check collision with walls
    if (
      newHead.x < 0 ||
      newHead.x >= this.config.boardWidth ||
      newHead.y < 0 ||
      newHead.y >= this.config.boardHeight
    ) {
      this.state.isGameOver = true;
      return true;
    }

    // Check collision with self
    if (this.isPositionInSnake(newHead, this.state.snake)) {
      this.state.isGameOver = true;
      return true;
    }

    // Add new head
    this.state.snake.unshift(newHead);
    this.state.moves++;

    // Check if food is eaten
    if (newHead.x === this.state.food.x && newHead.y === this.state.food.y) {
      this.state.foodEaten++;
      this.state.score = this.calculateScore();
      this.state.food = this.generateFood(this.state.snake);
    } else {
      // Remove tail if no food eaten
      this.state.snake.pop();
    }

    return true;
  }

  private calculateScore(): number {
    if (this.state.moves === 0) return 0;
    return this.state.foodEaten + (this.state.foodEaten / this.state.moves);
  }

  public skipMoves(count: number): void {
    for (let i = 0; i < count && !this.state.isGameOver; i++) {
      this.update();

      // Send progress updates every 100 moves
      if (i % 100 === 0) {
        self.postMessage({
          type: 'SKIP_PROGRESS',
          current: i,
          total: count,
          state: this.getState(),
        });
      }
    }

    // Send final state
    self.postMessage({
      type: 'SKIP_COMPLETE',
      state: this.getState(),
    });
  }
}

// Worker instance
let game: WorkerSnakeGame | null = null;

// Message handler
self.addEventListener('message', (event) => {
  const { type, payload } = event.data;

  switch (type) {
    case 'INIT':
      game = new WorkerSnakeGame(payload.config);
      self.postMessage({ type: 'INITIALIZED' });
      break;

    case 'START':
      if (game) {
        game.reset();
        self.postMessage({
          type: 'STARTED',
          state: game.getState(),
        });
      }
      break;

    case 'RESET':
      if (game) {
        game.reset();
        self.postMessage({
          type: 'RESET_COMPLETE',
          state: game.getState(),
        });
      }
      break;

    case 'UPDATE':
      if (game) {
        game.update();
        self.postMessage({
          type: 'STATE_UPDATE',
          state: game.getState(),
        });
      }
      break;

    case 'SET_SCRIPT':
      if (game) {
        try {
          game.setUserScript(payload.code);
          self.postMessage({ type: 'SCRIPT_SET' });
        } catch (error) {
          self.postMessage({
            type: 'SCRIPT_ERROR',
            error: (error as Error).message,
          });
        }
      }
      break;

    case 'SET_DIRECTION':
      if (game) {
        game.setDirection(payload.direction);
      }
      break;

    case 'SKIP_MOVES':
      if (game) {
        game.skipMoves(payload.count);
      }
      break;

    case 'GET_STATE':
      if (game) {
        self.postMessage({
          type: 'STATE_UPDATE',
          state: game.getState(),
        });
      }
      break;

    default:
      console.warn('Unknown message type:', type);
  }
});

// Export empty object to make TypeScript happy
export {};
