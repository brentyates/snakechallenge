import { useState } from 'react';
import { useGameStore } from '../store/gameStore';

export function GameControls() {
  const { isRunning, speed, isSkipping, skipProgress, startGame, stopGame, resetGame, setSpeed, compileAndSetScript, skipMoves } = useGameStore();
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
          disabled={isSkipping}
        >
          {isRunning ? 'Stop' : 'Start'}
        </button>

        <button
          onClick={resetGame}
          className="btn-secondary"
          disabled={isRunning || isSkipping}
        >
          Reset
        </button>

        <button
          onClick={() => setShowOptions(!showOptions)}
          className="btn-secondary"
          disabled={isSkipping}
        >
          Options {showOptions ? '▲' : '▼'}
        </button>

        <button
          onClick={compileAndSetScript}
          className="btn-secondary"
          disabled={isRunning || isSkipping}
        >
          Set Script
        </button>
      </div>

      {/* Skip Progress Bar */}
      {isSkipping && (
        <div className="stat-card">
          <div className="mb-2 text-sm text-gray-300">
            Skipping moves... {skipProgress}%
          </div>
          <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
            <div
              className="bg-snake-primary h-full transition-all duration-200 flex items-center justify-center text-xs font-bold"
              style={{ width: `${skipProgress}%` }}
            >
              {skipProgress > 10 && <span className="text-white">{skipProgress}%</span>}
            </div>
          </div>
        </div>
      )}

      {showOptions && !isSkipping && (
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
            <p className="text-xs text-gray-500 mt-2">
              💡 Skip runs in background - UI stays responsive!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
