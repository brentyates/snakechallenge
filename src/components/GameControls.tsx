import { useState } from 'react';
import { useGameStore } from '../store/gameStore';

export function GameControls() {
  const { isRunning, speed, startGame, stopGame, resetGame, setSpeed, compileAndSetScript, skipMoves } = useGameStore();
  const [movesToSkip, setMovesToSkip] = useState(100);
  const [showOptions, setShowOptions] = useState(false);

  const handleStart = () => {
    compileAndSetScript();
    startGame();
  };

  const handleSkipMoves = () => {
    if (!isRunning) {
      compileAndSetScript();
    }
    skipMoves(movesToSkip);
  };

  return (
    <div className="space-y-4 w-full">
      <div className="flex flex-wrap gap-3">
        <button
          onClick={isRunning ? stopGame : handleStart}
          className="btn-primary"
        >
          {isRunning ? 'Stop' : 'Start'}
        </button>

        <button
          onClick={resetGame}
          className="btn-secondary"
          disabled={isRunning}
        >
          Reset
        </button>

        <button
          onClick={() => setShowOptions(!showOptions)}
          className="btn-secondary"
        >
          Options {showOptions ? '▲' : '▼'}
        </button>

        <button
          onClick={compileAndSetScript}
          className="btn-secondary"
          disabled={isRunning}
        >
          Set Script
        </button>
      </div>

      {showOptions && (
        <div className="stat-card space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Game Speed: <span className="text-snake-primary font-bold">{speed}</span>
            </label>
            <input
              type="range"
              min="1"
              max="100"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              disabled={isRunning}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Slow</span>
              <span>Fast</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Skip Moves
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={movesToSkip}
                onChange={(e) => setMovesToSkip(Number(e.target.value))}
                className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-snake-primary"
                min="1"
                max="10000"
              />
              <button
                onClick={handleSkipMoves}
                className="btn-secondary whitespace-nowrap"
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
