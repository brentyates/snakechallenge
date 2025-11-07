export function Documentation() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="stat-card">
        <h2 className="text-3xl font-bold mb-4 text-snake-primary">API Documentation</h2>
        <p className="text-gray-300 mb-4">
          Write JavaScript code to control the snake. Your script should define a <code className="bg-gray-900 px-2 py-1 rounded">main</code> function
          that accepts a context object with helpful methods.
        </p>
      </div>

      <div className="stat-card">
        <h3 className="text-2xl font-bold mb-3 text-snake-primary">Context Methods</h3>
        <div className="space-y-4">
          <div className="bg-gray-900 p-4 rounded">
            <code className="text-green-400">ctx.getHead()</code>
            <p className="text-gray-300 mt-2">Returns the position of the snake's head as <code>{'{x: number, y: number}'}</code></p>
          </div>

          <div className="bg-gray-900 p-4 rounded">
            <code className="text-green-400">ctx.getFood()</code>
            <p className="text-gray-300 mt-2">Returns the position of the food as <code>{'{x: number, y: number}'}</code></p>
          </div>

          <div className="bg-gray-900 p-4 rounded">
            <code className="text-green-400">ctx.getDirection()</code>
            <p className="text-gray-300 mt-2">Returns the current direction: 'UP', 'DOWN', 'LEFT', or 'RIGHT'</p>
          </div>

          <div className="bg-gray-900 p-4 rounded">
            <code className="text-green-400">ctx.getSnake()</code>
            <p className="text-gray-300 mt-2">Returns an array of positions representing the entire snake</p>
          </div>

          <div className="bg-gray-900 p-4 rounded">
            <code className="text-green-400">ctx.getBoardSize()</code>
            <p className="text-gray-300 mt-2">Returns the board dimensions as <code>{'{width: number, height: number}'}</code></p>
          </div>

          <div className="bg-gray-900 p-4 rounded">
            <code className="text-green-400">ctx.setDirection(direction)</code>
            <p className="text-gray-300 mt-2">Sets the snake's direction. Pass 'UP', 'DOWN', 'LEFT', or 'RIGHT'</p>
          </div>
        </div>
      </div>

      <div className="stat-card">
        <h3 className="text-2xl font-bold mb-3 text-snake-primary">Example Scripts</h3>

        <div className="space-y-4">
          <div>
            <h4 className="text-lg font-semibold mb-2 text-gray-200">Simple Chase Algorithm</h4>
            <pre className="bg-gray-900 p-4 rounded overflow-x-auto">
              <code className="text-sm text-gray-300">{`function main(ctx) {
  const head = ctx.getHead();
  const food = ctx.getFood();

  // Move towards food
  if (head.x < food.x) {
    return 'RIGHT';
  } else if (head.x > food.x) {
    return 'LEFT';
  } else if (head.y < food.y) {
    return 'DOWN';
  } else {
    return 'UP';
  }
}`}</code>
            </pre>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-2 text-gray-200">Avoid Walls</h4>
            <pre className="bg-gray-900 p-4 rounded overflow-x-auto">
              <code className="text-sm text-gray-300">{`function main(ctx) {
  const head = ctx.getHead();
  const food = ctx.getFood();
  const board = ctx.getBoardSize();
  const dir = ctx.getDirection();

  // Check if we're about to hit a wall
  const willHitWall = (direction) => {
    if (direction === 'UP' && head.y <= 0) return true;
    if (direction === 'DOWN' && head.y >= board.height - 1) return true;
    if (direction === 'LEFT' && head.x <= 0) return true;
    if (direction === 'RIGHT' && head.x >= board.width - 1) return true;
    return false;
  };

  // Try to move towards food, but avoid walls
  let nextDir = dir;
  if (head.x < food.x && !willHitWall('RIGHT')) nextDir = 'RIGHT';
  else if (head.x > food.x && !willHitWall('LEFT')) nextDir = 'LEFT';
  else if (head.y < food.y && !willHitWall('DOWN')) nextDir = 'DOWN';
  else if (head.y > food.y && !willHitWall('UP')) nextDir = 'UP';

  return nextDir;
}`}</code>
            </pre>
          </div>
        </div>
      </div>

      <div className="stat-card">
        <h3 className="text-2xl font-bold mb-3 text-snake-primary">Tips</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-300">
          <li>The snake cannot reverse direction (e.g., from LEFT to RIGHT)</li>
          <li>The board is 40 units wide and 30 units tall by default</li>
          <li>Your script runs on every frame, so keep it efficient</li>
          <li>Use the "Skip Moves" feature to test long-running strategies</li>
          <li>The score is calculated as: foodEaten + (foodEaten / moves)</li>
        </ul>
      </div>
    </div>
  );
}
