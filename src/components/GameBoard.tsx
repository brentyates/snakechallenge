import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import type { Position } from '../types/game';

export function GameBoard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameState = useGameStore((state) => state.gameState);
  const tick = useGameStore((state) => state.tick);

  const boardWidth = 40;
  const boardHeight = 30;
  const cellSize = 8;

  // Redraw canvas whenever tick changes
  useEffect(() => {
    if (!canvasRef.current || !gameState) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= boardWidth; x++) {
      ctx.beginPath();
      ctx.moveTo(x * cellSize, 0);
      ctx.lineTo(x * cellSize, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y <= boardHeight; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * cellSize);
      ctx.lineTo(canvas.width, y * cellSize);
      ctx.stroke();
    }

    const drawCell = (pos: Position, color: string, rounded = false) => {
      const x = pos.x * cellSize;
      const y = pos.y * cellSize;
      const size = cellSize;

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
    drawCell(gameState.food, '#ef4444', true);

    // Draw snake with gradient
    gameState.snake.forEach((segment, index) => {
      const brightness = 255 - Math.floor((index / gameState.snake.length) * 100);
      const color = index === 0
        ? '#10b981' // Head
        : `rgb(${Math.floor(brightness * 0.06)}, ${brightness}, ${Math.floor(brightness * 0.5)})`;
      drawCell(segment, color);
    });

    // Draw game over message
    if (gameState.isGameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 20);

      ctx.font = '16px sans-serif';
      ctx.fillText(`Score: ${gameState.score.toFixed(2)}`, canvas.width / 2, canvas.height / 2 + 10);
      ctx.fillText(`Food Eaten: ${gameState.foodEaten}`, canvas.width / 2, canvas.height / 2 + 35);
    }
  }, [gameState, tick]);

  return (
    <div className="flex flex-col items-center">
      <canvas
        ref={canvasRef}
        width={boardWidth * cellSize}
        height={boardHeight * cellSize}
        className="game-board"
      />
    </div>
  );
}
