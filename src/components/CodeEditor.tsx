import Editor from '@monaco-editor/react';
import { useGameStore } from '../store/gameStore';

export function CodeEditor() {
  const { userCode, setUserCode } = useGameStore();

  return (
    <div className="flex flex-col h-full">
      <div className="bg-gray-800 px-4 py-3 border-b border-gray-700 flex items-center justify-between">
        <h3 className="text-lg font-bold text-snake-primary">Your Script</h3>
        <a
          href="#documentation"
          className="text-sm text-gray-400 hover:text-snake-primary transition-colors"
        >
          View API Documentation
        </a>
      </div>
      <div className="flex-1 bg-gray-900">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          value={userCode}
          onChange={(value) => setUserCode(value || '')}
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
