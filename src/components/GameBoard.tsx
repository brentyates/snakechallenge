import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import type { Position } from '../types/game';

export function GameBoard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const game = useGameStore((state) => state.game);
  const tick = useGameStore((state) => state.tick); // Subscribe to tick for updates

  // Redraw canvas whenever tick changes (i.e., on every game update)
  useEffect(() => {
    if (!canvasRef.current || !game) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const config = game.getConfig();
    const state = game.getState();

    // Clear canvas
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= config.boardWidth; x++) {
      ctx.beginPath();
      ctx.moveTo(x * config.cellSize, 0);
      ctx.lineTo(x * config.cellSize, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y <= config.boardHeight; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * config.cellSize);
      ctx.lineTo(canvas.width, y * config.cellSize);
      ctx.stroke();
    }

    const drawCell = (pos: Position, color: string, rounded = false) => {
      const x = pos.x * config.cellSize;
      const y = pos.y * config.cellSize;
      const size = config.cellSize;

      if (rounded) {
        const radius = size / 2;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x + radius, y + radius, radius - 1, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = color;
        ctx.fillRect(x + 1, y + 1, size - 2, size - 2);
      }
    };

    // Draw food
    drawCell(state.food, '#ef4444', true);

    // Draw snake with gradient
    state.snake.forEach((segment, index) => {
      const brightness = 255 - Math.floor((index / state.snake.length) * 100);
      const color = index === 0
        ? '#10b981' // Head
        : `rgb(${Math.floor(brightness * 0.06)}, ${brightness}, ${Math.floor(brightness * 0.5)})`;
      drawCell(segment, color);
    });

    // Draw game over message
    if (state.isGameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 20);

      ctx.font = '16px sans-serif';
      ctx.fillText(`Score: ${state.score.toFixed(2)}`, canvas.width / 2, canvas.height / 2 + 10);
      ctx.fillText(`Food Eaten: ${state.foodEaten}`, canvas.width / 2, canvas.height / 2 + 35);
    }
  }, [game, tick]); // Redraw when game or tick changes

  const config = game?.getConfig() || { boardWidth: 40, boardHeight: 30, cellSize: 8 };

  return (
    <div className="flex flex-col items-center">
      <canvas
        ref={canvasRef}
        width={config.boardWidth * config.cellSize}
        height={config.boardHeight * config.cellSize}
        className="game-board"
      />
    </div>
  );
}
