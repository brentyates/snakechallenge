import { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { useGameStore } from '../store/gameStore';

export function CodeEditor() {
  const {
    userCode,
    activeScript,
    isRunning,
    setUserCode,
    compileAndSetScript,
    applyScriptToRunningGame
  } = useGameStore();
  const debounceTimerRef = useRef<number | null>(null);

  // Check if there are unsaved changes
  const hasUnsavedChanges = userCode.trim() !== activeScript.trim();

  const handleCodeChange = (value: string | undefined) => {
    const newCode = value || '';
    setUserCode(newCode);

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Only auto-compile if game is NOT running
    // When running, user must explicitly click "Apply Changes"
    if (!isRunning) {
      debounceTimerRef.current = setTimeout(() => {
        compileAndSetScript();
      }, 1000);
    }
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* PROMINENT STATUS BANNER */}
      {isRunning && hasUnsavedChanges && (
        <div className="bg-orange-900 border-2 border-orange-500 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">⚠️</div>
              <div>
                <div className="text-lg font-bold text-orange-200">You have unsaved changes</div>
                <div className="text-sm text-orange-300">
                  The code you're editing is NOT what's currently running in the game
                </div>
              </div>
            </div>
            <button
              onClick={applyScriptToRunningGame}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg text-lg transition-colors"
            >
              Apply Changes to Running Game
            </button>
          </div>
        </div>
      )}

      {isRunning && !hasUnsavedChanges && (
        <div className="bg-green-900 border-2 border-green-500 px-4 py-2">
          <div className="flex items-center gap-3">
            <div className="text-xl">✅</div>
            <div>
              <div className="text-base font-bold text-green-200">This script is actively running</div>
              <div className="text-sm text-green-300">
                Any changes you make will need to be applied with the button above
              </div>
            </div>
          </div>
        </div>
      )}

      {!isRunning && hasUnsavedChanges && (
        <div className="bg-yellow-900 border-2 border-yellow-500 px-4 py-2">
          <div className="flex items-center gap-3">
            <div className="text-xl">📝</div>
            <div>
              <div className="text-base font-bold text-yellow-200">Script modified - auto-saving...</div>
              <div className="text-sm text-yellow-300">
                Will be ready when you click Play
              </div>
            </div>
          </div>
        </div>
      )}

      {!isRunning && !hasUnsavedChanges && (
        <div className="bg-blue-900 border-2 border-blue-500 px-4 py-2">
          <div className="flex items-center gap-3">
            <div className="text-xl">💾</div>
            <div>
              <div className="text-base font-bold text-blue-200">Script ready</div>
              <div className="text-sm text-blue-300">
                Click Play to run this script
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gray-800 px-4 py-3 border-b border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-snake-primary">Your Script</h3>
          <a
            href="#documentation"
            className="text-sm text-gray-400 hover:text-snake-primary transition-colors"
          >
            View API Documentation
          </a>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>💡</span>
          <span>
            Check browser console (F12) for your <code className="px-1 py-0.5 bg-gray-700 rounded">console.log()</code> output
          </span>
        </div>
      </div>
      <div className="flex-1 bg-gray-900">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          value={userCode}
          onChange={handleCodeChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
          }}
        />
      </div>
    </div>
  );
}
