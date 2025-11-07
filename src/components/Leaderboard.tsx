export function Leaderboard() {
  // Placeholder leaderboard - will be connected to Supabase later
  const mockData = [
    { rank: 1, username: 'SnakeMaster', score: 125.5, moves: 1250, foodEaten: 95, snakeLength: 100 },
    { rank: 2, username: 'CodeNinja', score: 98.3, moves: 1100, foodEaten: 82, snakeLength: 87 },
    { rank: 3, username: 'AIWizard', score: 87.2, moves: 980, foodEaten: 75, snakeLength: 80 },
    { rank: 4, username: 'PyThon', score: 76.8, moves: 890, foodEaten: 68, snakeLength: 73 },
    { rank: 5, username: 'AlgoExpert', score: 65.4, moves: 750, foodEaten: 58, snakeLength: 63 },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="stat-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-snake-primary">🏆 Leaderboard</h2>
          <button className="btn-secondary text-sm">
            Refresh
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-gray-700">
                <th className="py-3 px-4 text-gray-400 font-semibold">Rank</th>
                <th className="py-3 px-4 text-gray-400 font-semibold">Player</th>
                <th className="py-3 px-4 text-gray-400 font-semibold text-right">Score</th>
                <th className="py-3 px-4 text-gray-400 font-semibold text-right">Moves</th>
                <th className="py-3 px-4 text-gray-400 font-semibold text-right">Food</th>
                <th className="py-3 px-4 text-gray-400 font-semibold text-right">Length</th>
              </tr>
            </thead>
            <tbody>
              {mockData.map((entry) => (
                <tr
                  key={entry.rank}
                  className="border-b border-gray-700 hover:bg-gray-800 transition-colors"
                >
                  <td className="py-3 px-4">
                    <span className={`font-bold ${
                      entry.rank === 1 ? 'text-yellow-400' :
                      entry.rank === 2 ? 'text-gray-300' :
                      entry.rank === 3 ? 'text-orange-400' :
                      'text-gray-400'
                    }`}>
                      #{entry.rank}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-white">{entry.username}</td>
                  <td className="py-3 px-4 text-right text-snake-primary font-bold">{entry.score}</td>
                  <td className="py-3 px-4 text-right text-gray-300">{entry.moves}</td>
                  <td className="py-3 px-4 text-right text-gray-300">{entry.foodEaten}</td>
                  <td className="py-3 px-4 text-right text-gray-300">{entry.snakeLength}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 p-4 bg-gray-900 rounded-lg">
          <p className="text-gray-400 text-sm text-center">
            Sign in to submit your scores and compete on the leaderboard!
          </p>
        </div>
      </div>
    </div>
  );
}
