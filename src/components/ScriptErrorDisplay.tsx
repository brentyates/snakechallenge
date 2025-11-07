import { useGameStore } from '../store/gameStore';

export function ScriptErrorDisplay() {
  const { scriptError, clearScriptError } = useGameStore();

  if (!scriptError) return null;

  return (
    <div className="fixed bottom-4 right-4 max-w-lg bg-red-900 border-2 border-red-500 rounded-lg shadow-2xl p-4 z-50 animate-shake">
      <div className="flex items-start gap-3">
        <div className="text-2xl">⚠️</div>
        <div className="flex-1">
          <h4 className="font-bold text-white mb-2">Script Error</h4>
          <pre className="text-sm text-red-100 whitespace-pre-wrap font-mono bg-red-950 p-3 rounded overflow-auto max-h-48">
            {scriptError}
          </pre>
          <div className="mt-3 text-xs text-red-200">
            💡 <strong>Debugging tips:</strong>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Check browser console for your console.log() messages (prefixed with 🤖)</li>
              <li>Errors show line numbers to help locate issues</li>
              <li>Make sure your function returns a valid direction</li>
            </ul>
          </div>
        </div>
        <button
          onClick={clearScriptError}
          className="text-red-200 hover:text-white transition-colors text-xl font-bold"
          aria-label="Close error"
        >
          ×
        </button>
      </div>
    </div>
  );
}
