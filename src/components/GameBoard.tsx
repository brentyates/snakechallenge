import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import type { Position } from '../types/game';

export function GameBoard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const game = useGameStore((state) => state.game);

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

    // Draw food
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

    // Draw snake
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

  }, [game]);

  // Animation loop
  useEffect(() => {
    let animationId: number;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      // Trigger re-render which will redraw canvas
      if (canvasRef.current && game) {
        const event = new CustomEvent('game-tick');
        canvasRef.current.dispatchEvent(event);
      }
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [game]);

  // Listen for game ticks to trigger re-renders
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleTick = () => {
      // Force re-render by updating a dummy state
      if (game) {
        // The component will re-render and the useEffect above will redraw
      }
    };

    canvas.addEventListener('game-tick', handleTick);
    return () => canvas.removeEventListener('game-tick', handleTick);
  }, [game]);

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
