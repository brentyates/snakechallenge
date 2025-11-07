import { useGameStore } from '../store/gameStore';

export function GameStats() {
  const gameState = useGameStore((state) => state.gameState);
  useGameStore((state) => state.tick); // Subscribe to tick for updates

  if (!gameState) {
    return (
      <div className="stat-card w-full">
        <h3 className="text-lg font-bold mb-4 text-snake-primary">Game Stats</h3>
        <div className="space-y-2">
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">Start the game to see stats</p>
          </div>
        </div>
      </div>
    );
  }

  const boardWidth = 40;
  const boardHeight = 30;
  const percentComplete = ((gameState.snake.length / (boardWidth * boardHeight)) * 100).toFixed(2);

  const stats = [
    { label: 'Direction', value: gameState.direction },
    { label: 'Board Size', value: `${boardWidth} x ${boardHeight}` },
    { label: 'Head', value: `${gameState.snake[0]?.x ?? 0}, ${gameState.snake[0]?.y ?? 0}` },
    { label: 'Food', value: `${gameState.food.x}, ${gameState.food.y}` },
    { label: 'Moves', value: gameState.moves },
    { label: 'Food Eaten', value: gameState.foodEaten },
    { label: 'Score', value: gameState.score.toFixed(2) },
    { label: 'Snake Length', value: gameState.snake.length },
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
