import { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { useGameStore } from '../store/gameStore';

export function CodeEditor() {
  const { userCode, setUserCode, compileAndSetScript } = useGameStore();
  const debounceTimerRef = useRef<number | null>(null);

  const handleCodeChange = (value: string | undefined) => {
    const newCode = value || '';
    setUserCode(newCode);

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer to auto-compile after 1 second of no changes
    debounceTimerRef.current = setTimeout(() => {
      compileAndSetScript();
    }, 1000);
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
