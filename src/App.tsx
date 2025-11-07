import { useEffect, useState } from 'react';
import { Navigation } from './components/Navigation';
import { GameBoard } from './components/GameBoard';
import { GameStats } from './components/GameStats';
import { GameControls } from './components/GameControls';
import { CodeEditor } from './components/CodeEditor';
import { Documentation } from './components/Documentation';
import { Leaderboard } from './components/Leaderboard';
import { ScriptErrorDisplay } from './components/ScriptErrorDisplay';
import { useGameStore } from './store/gameStore';

type View = 'game' | 'leaderboard' | 'documentation';

function App() {
  const [currentView, setCurrentView] = useState<View>('game');
  const initGame = useGameStore((state) => state.initGame);

  useEffect(() => {
    initGame({
      boardWidth: 40,
      boardHeight: 30,
      cellSize: 8,
      speed: 10,
    });
  }, [initGame]);

  return (
    <div className="min-h-screen bg-snake-bg">
      <Navigation currentView={currentView} onViewChange={setCurrentView} />

      {currentView === 'game' && (
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Game */}
            <div className="space-y-6">
              <GameBoard />
              <GameControls />
              <GameStats />
            </div>

            {/* Right Column - Code Editor */}
            <div className="h-[800px] lg:sticky lg:top-8">
              <div className="stat-card h-full p-0 overflow-hidden">
                <CodeEditor />
              </div>
            </div>
          </div>
        </div>
      )}

      {currentView === 'documentation' && <Documentation />}
      {currentView === 'leaderboard' && <Leaderboard />}

      {/* Script Error Display - shows as toast notification */}
      <ScriptErrorDisplay />

      <footer className="bg-gray-900 border-t border-gray-800 mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
          <p>Snake Challenge - Modern TypeScript Rewrite</p>
          <p className="mt-2">Built with React, TypeScript, Tailwind CSS, and Vite</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
