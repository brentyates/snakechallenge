import { useState } from 'react';

interface NavigationProps {
  currentView: 'game' | 'leaderboard' | 'documentation';
  onViewChange: (view: 'game' | 'leaderboard' | 'documentation') => void;
}

export function Navigation({ currentView, onViewChange }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: 'game' as const, label: 'Game' },
    { id: 'documentation' as const, label: 'Documentation' },
    { id: 'leaderboard' as const, label: 'Leaderboard' },
  ];

  return (
    <nav className="bg-gray-900 border-b border-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-2xl font-bold text-snake-primary">
                🐍 Snake Challenge
              </h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                    currentView === item.id
                      ? 'border-snake-primary text-white'
                      : 'border-transparent text-gray-400 hover:text-white hover:border-gray-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center">
            <button className="btn-secondary text-sm">
              Sign In
            </button>
          </div>
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onViewChange(item.id);
                  setIsMenuOpen(false);
                }}
                className={`block w-full text-left pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  currentView === item.id
                    ? 'bg-gray-800 border-snake-primary text-white'
                    : 'border-transparent text-gray-400 hover:bg-gray-800 hover:border-gray-700 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
