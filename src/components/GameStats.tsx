import { useGameStore } from '../store/gameStore';

export function GameStats() {
  const game = useGameStore((state) => state.game);
  const state = game?.getState();
  const config = game?.getConfig();

  if (!state || !config) return null;

  const percentComplete = ((state.snake.length / (config.boardWidth * config.boardHeight)) * 100).toFixed(2);

  const stats = [
    { label: 'Direction', value: state.direction },
    { label: 'Board Size', value: `${config.boardWidth} x ${config.boardHeight}` },
    { label: 'Head', value: `${state.snake[0]?.x ?? 0}, ${state.snake[0]?.y ?? 0}` },
    { label: 'Food', value: `${state.food.x}, ${state.food.y}` },
    { label: 'Moves', value: state.moves },
    { label: 'Food Eaten', value: state.foodEaten },
    { label: 'Score', value: state.score.toFixed(2) },
    { label: 'Snake Length', value: state.snake.length },
    { label: '% Complete', value: `${percentComplete}%` },
  ];

  return (
    <div className="stat-card w-full">
      <h3 className="text-lg font-bold mb-4 text-snake-primary">Game Stats</h3>
      <div className="space-y-2">
        {stats.map((stat) => (
          <div key={stat.label} className="flex justify-between items-center py-1 border-b border-gray-700">
            <span className="text-gray-400 text-sm">{stat.label}</span>
            <span className="text-white font-semibold">{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
