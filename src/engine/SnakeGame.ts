import { Direction } from '../types/game';
import type { Position, GameState, GameConfig, ScriptContext, UserScriptFunction } from '../types/game';

export class SnakeGame {
  private config: GameConfig;
  private state: GameState;
  private userScript: UserScriptFunction | null = null;
  private lastMoveTime: number = 0;

  constructor(config: GameConfig) {
    this.config = config;
    this.state = this.initializeGame();
  }

  private initializeGame(): GameState {
    const centerX = Math.floor(this.config.boardWidth / 2);
    const centerY = Math.floor(this.config.boardHeight / 2);

    const snake: Position[] = [];
    for (let i = 0; i < 5; i++) {
      snake.push({ x: centerX + i, y: centerY });
    }

    return {
      snake,
      food: this.generateFood(snake),
      direction: Direction.LEFT,
      nextDirection: Direction.LEFT,
      score: 0,
      moves: 0,
      isGameOver: false,
      isPaused: false,
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

  public setUserScript(script: UserScriptFunction | null): void {
    this.userScript = script;
  }

  public setDirection(direction: Direction): void {
    // Prevent reversing
    const opposites: Record<Direction, Direction> = {
      [Direction.UP]: Direction.DOWN,
      [Direction.DOWN]: Direction.UP,
      [Direction.LEFT]: Direction.RIGHT,
      [Direction.RIGHT]: Direction.LEFT,
    };

    if (opposites[this.state.direction] !== direction) {
      this.state.nextDirection = direction;
    }
  }

  public getState(): GameState {
    return { ...this.state };
  }

  public getConfig(): GameConfig {
    return { ...this.config };
  }

  public reset(): void {
    this.state = this.initializeGame();
    this.lastMoveTime = 0;
  }

  public pause(): void {
    this.state.isPaused = true;
  }

  public resume(): void {
    this.state.isPaused = false;
  }

  private createScriptContext(): ScriptContext {
    const head = this.state.snake[0];
    return {
      getHead: () => ({ ...head }),
      getFood: () => ({ ...this.state.food }),
      getDirection: () => this.state.direction,
      getSnake: () => this.state.snake.map(pos => ({ ...pos })),
      getBoardSize: () => ({
        width: this.config.boardWidth,
        height: this.config.boardHeight,
      }),
      setDirection: (direction: Direction) => this.setDirection(direction),
    };
  }

  public update(timestamp: number): boolean {
    if (this.state.isGameOver || this.state.isPaused) {
      return false;
    }

    const timeSinceLastMove = timestamp - this.lastMoveTime;
    const moveInterval = 1000 / this.config.speed;

    if (timeSinceLastMove < moveInterval) {
      return false;
    }

    this.lastMoveTime = timestamp;

    // Execute user script if available
    if (this.userScript) {
      try {
        const ctx = this.createScriptContext();
        const result = this.userScript(ctx);
        if (result) {
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
      case Direction.UP:
        newHead = { x: head.x, y: head.y - 1 };
        break;
      case Direction.DOWN:
        newHead = { x: head.x, y: head.y + 1 };
        break;
      case Direction.LEFT:
        newHead = { x: head.x - 1, y: head.y };
        break;
      case Direction.RIGHT:
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

  public skipMoves(count: number, onProgress?: (current: number, total: number) => void): void {
    for (let i = 0; i < count && !this.state.isGameOver; i++) {
      this.update(performance.now());
      if (onProgress && i % 10 === 0) {
        onProgress(i, count);
      }
    }
    if (onProgress) {
      onProgress(count, count);
    }
  }
}
