# 🐍 Snake Challenge - Modern TypeScript Rewrite

A complete modern rewrite of the Snake Scripting Challenge game using cutting-edge web technologies.

## ✨ Tech Stack

- **Frontend Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **Code Editor**: Monaco Editor (VS Code's editor)
- **Backend Ready**: Supabase integration prepared for auth & leaderboards

## 🚀 Features

- **Scriptable AI**: Write JavaScript code to control the snake
- **Real-time Game Engine**: Smooth 60 FPS gameplay with TypeScript
- **Code Editor**: Full-featured Monaco editor with syntax highlighting
- **Game Controls**:
  - Adjustable speed (1-100)
  - Skip moves for testing long-running strategies
  - Pause/Resume functionality
- **Live Stats**: Track direction, moves, food eaten, score, and completion percentage
- **Responsive Design**: Works on desktop and mobile devices
- **Documentation**: Complete API reference for writing snake AI scripts

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎮 How to Play

1. **Write Your AI**: Use the Monaco editor to write JavaScript code that controls the snake
2. **Set Script**: Click "Set Script" to compile and load your code
3. **Start Game**: Click "Start" to begin the game
4. **Watch**: See your AI navigate the snake to collect food

## 🧠 API Documentation

Your script should define a `main` function that receives a context object:

```javascript
function main(ctx) {
  const head = ctx.getHead();     // {x: number, y: number}
  const food = ctx.getFood();     // {x: number, y: number}
  const direction = ctx.getDirection(); // 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'
  const snake = ctx.getSnake();   // Array of positions
  const board = ctx.getBoardSize(); // {width: 40, height: 30}

  // Return new direction or use ctx.setDirection(direction)
  return 'UP';
}
```

### Available Methods

- `ctx.getHead()` - Returns snake head position
- `ctx.getFood()` - Returns food position
- `ctx.getDirection()` - Returns current direction
- `ctx.getSnake()` - Returns full snake body array
- `ctx.getBoardSize()` - Returns board dimensions
- `ctx.setDirection(direction)` - Sets the snake's direction

### Example: Simple Chase Algorithm

```javascript
function main(ctx) {
  const head = ctx.getHead();
  const food = ctx.getFood();

  if (head.x < food.x) return 'RIGHT';
  if (head.x > food.x) return 'LEFT';
  if (head.y < food.y) return 'DOWN';
  return 'UP';
}
```

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── CodeEditor.tsx   # Monaco code editor
│   ├── GameBoard.tsx    # Canvas-based game rendering
│   ├── GameControls.tsx # Game control buttons
│   ├── GameStats.tsx    # Live game statistics
│   ├── Navigation.tsx   # App navigation
│   ├── Documentation.tsx # API documentation
│   └── Leaderboard.tsx  # Leaderboard view
├── engine/              # Game logic
│   └── SnakeGame.ts     # Core game engine
├── store/               # State management
│   └── gameStore.ts     # Zustand store
├── types/               # TypeScript types
│   └── game.ts          # Game-related types
└── App.tsx              # Main app component
```

## 🎯 Game Rules

- Board size: 40 x 30 cells
- Snake starts with length 5
- Cannot reverse direction (e.g., from LEFT to RIGHT)
- Game ends on wall collision or self-collision
- Score = foodEaten + (foodEaten / moves)

## 🔧 Development

### Type Safety
The entire codebase is written in TypeScript with strict type checking enabled.

### Code Quality
- ESLint configured for React + TypeScript
- Vite for fast hot module replacement (HMR)
- Monaco Editor for professional code editing experience

## 🚀 Future Enhancements

- [ ] Supabase authentication integration
- [ ] Online leaderboard with real-time updates
- [ ] Multiplayer mode with WebSocket support
- [ ] Pre-built AI algorithms library
- [ ] Code sharing and community scripts
- [ ] Replay system for analyzing runs
- [ ] Advanced visualizations and heatmaps

## 📝 License

MIT License - feel free to use this for learning or your own projects!

## 🤝 Contributing

Contributions are welcome! This is a modern, clean codebase perfect for:
- Adding new features
- Improving the AI scripting API
- Creating example algorithms
- Enhancing the UI/UX

---

Built with ❤️ using React, TypeScript, and Tailwind CSS
