# 🐛 Debugging Your Snake AI Scripts

## Overview

The new implementation makes debugging your AI scripts much easier, even though they run in a Web Worker for performance. Here's everything you need to know:

---

## 🎯 Debugging Features

### 1. **Console Forwarding** (Automatic)

All your `console.log()`, `console.error()`, `console.warn()`, and `console.info()` calls are automatically forwarded from the Web Worker to your browser's DevTools console.

**Example:**
```javascript
function main(ctx) {
  const head = ctx.getHead();
  const food = ctx.getFood();

  console.log('Head position:', head);
  console.log('Food position:', food);
  console.log('Distance to food:', Math.abs(head.x - food.x) + Math.abs(head.y - food.y));

  if (head.x < food.x) return 'RIGHT';
  return 'LEFT';
}
```

**In DevTools Console:**
```
🤖 [Your Script] Head position: { x: 20, y: 15 }
🤖 [Your Script] Food position: { x: 25, y: 15 }
🤖 [Your Script] Distance to food: 5
```

The `🤖 [Your Script]` prefix helps you identify your debug messages among other console output.

---

### 2. **Visual Error Display** (Automatic)

When your script throws an error, you'll see:
- **Red toast notification** in the bottom-right corner with the error details
- **Error message** in the browser console
- **Stack trace** showing which line caused the problem
- **Helpful debugging tips** in the error notification

**Example Error:**
```javascript
function main(ctx) {
  const head = ctx.getHead();
  return head.direction; // Oops! head doesn't have a 'direction' property
}
```

**You'll see:**
```
⚠️ Script Error
Cannot read properties of undefined (reading 'direction')
at main (eval at <anonymous>)

💡 Debugging tips:
• Check browser console for your console.log() messages (prefixed with 🤖)
• Errors show line numbers to help locate issues
• Make sure your function returns a valid direction
```

---

### 3. **Real-Time Feedback**

- Your script **auto-compiles** 1 second after you stop typing
- **No "Set Script" button** needed - just write code and hit Start!
- Errors appear **immediately** when your script runs
- Script errors **don't crash the game** - it continues running

---

## 🛠️ How to Debug Step-by-Step

### Basic Debugging Workflow

1. **Open DevTools** (Press `F12` or right-click → Inspect)
2. **Go to Console tab**
3. **Write your script** with `console.log()` statements
4. **Click Start** to run the game
5. **Watch console output** prefixed with `🤖 [Your Script]`

### Example Debugging Session

**Problem:** Snake is going the wrong direction

```javascript
function main(ctx) {
  const head = ctx.getHead();
  const food = ctx.getFood();

  // Debug: Check what we're getting
  console.log('=== DEBUG INFO ===');
  console.log('Head:', head);
  console.log('Food:', food);

  // Debug: Check our logic
  const shouldGoRight = head.x < food.x;
  const shouldGoDown = head.y < food.y;

  console.log('Should go right?', shouldGoRight);
  console.log('Should go down?', shouldGoDown);

  // Your AI logic
  if (shouldGoRight) {
    console.log('Decision: Going RIGHT');
    return 'RIGHT';
  }
  if (shouldGoDown) {
    console.log('Decision: Going DOWN');
    return 'DOWN';
  }

  console.log('Decision: Going UP (default)');
  return 'UP';
}
```

**Console Output:**
```
🤖 [Your Script] === DEBUG INFO ===
🤖 [Your Script] Head: {x: 20, y: 15}
🤖 [Your Script] Food: {x: 25, y: 20}
🤖 [Your Script] Should go right? true
🤖 [Your Script] Should go down? true
🤖 [Your Script] Decision: Going RIGHT
```

---

## 🔍 Common Debugging Patterns

### Pattern 1: Trace Every Move
```javascript
let moveCount = 0;

function main(ctx) {
  moveCount++;
  console.log(`Move #${moveCount}`);

  // Your logic here...
}
```

### Pattern 2: Conditional Debugging
```javascript
function main(ctx) {
  const head = ctx.getHead();

  // Only log when something interesting happens
  if (head.x === 0 || head.y === 0) {
    console.warn('Near edge!', head);
  }

  // Your logic here...
}
```

### Pattern 3: Debug Complex Calculations
```javascript
function main(ctx) {
  const head = ctx.getHead();
  const food = ctx.getFood();
  const snake = ctx.getSnake();

  // Calculate danger zones
  const dangerZones = snake.slice(1).map(segment => ({
    x: segment.x,
    y: segment.y
  }));

  console.log('Danger zones:', dangerZones.length);
  console.table(dangerZones); // Nice table view in console!

  // Your logic here...
}
```

---

## ⚡ Performance Tips

### ✅ Good: Selective Logging
```javascript
function main(ctx) {
  // Only log errors or important events
  if (someErrorCondition) {
    console.error('Something went wrong!');
  }
}
```

### ❌ Avoid: Excessive Logging
```javascript
function main(ctx) {
  // This will flood your console with thousands of messages!
  console.log('Running...'); // Called every frame
  console.log('Head:', ctx.getHead());
  console.log('Food:', ctx.getFood());
  console.log('Snake:', ctx.getSnake());
}
```

**Tip:** Use the Skip feature to test many moves without console spam:
- Click "Options"
- Enter number of moves to skip (e.g., 1000)
- Click "Skip"
- The game runs fast in the background
- Your console.log() calls still work but are less frequent

---

## 🚫 Limitations & Workarounds

### ❌ Cannot Use Breakpoints Directly

**Why:** Your script runs in a Web Worker, so DevTools breakpoints don't work on your code.

**Workaround:** Use `console.log()` extensively or add conditional alerts:

```javascript
function main(ctx) {
  const head = ctx.getHead();

  // Pause execution when needed (for serious debugging)
  if (head.x === 10 && head.y === 10) {
    debugger; // This won't work in worker, but error will pause execution
    throw new Error('Debug breakpoint'); // This will stop execution
  }
}
```

### ❌ Cannot Access DOM or Window

**Why:** Web Workers don't have access to `document`, `window`, or DOM APIs.

**Available:**
- ✅ `console.*`
- ✅ `Math.*`
- ✅ `JSON.*`
- ✅ All JavaScript built-ins (Array, Object, etc.)

**Not Available:**
- ❌ `document`
- ❌ `window`
- ❌ `localStorage`
- ❌ `fetch` (but you don't need it for the game)

---

## 📊 Advanced: Performance Profiling

Want to know if your AI is slow?

```javascript
function main(ctx) {
  const start = performance.now();

  // Your complex AI logic here...

  const end = performance.now();
  const duration = end - start;

  if (duration > 1) {
    console.warn(`Slow frame: ${duration.toFixed(2)}ms`);
  }
}
```

---

## 🎓 Quick Reference

| Task | How To |
|------|--------|
| Print variable | `console.log('Name:', value)` |
| Print error | `console.error('Oh no!', error)` |
| Print warning | `console.warn('Careful!', warning)` |
| Print table | `console.table(arrayOfObjects)` |
| Check type | `console.log(typeof value)` |
| Stop on condition | `if (condition) throw new Error('Stop!')` |
| Clear console | Click 🚫 in DevTools console |
| Filter messages | Type `🤖` in DevTools filter box |

---

## 💡 Pro Tips

1. **Use descriptive log messages:**
   ```javascript
   // ✅ Good
   console.log('Distance to food:', distance);

   // ❌ Less helpful
   console.log(distance);
   ```

2. **Group related logs:**
   ```javascript
   console.log('=== MOVE START ===');
   console.log('Head:', head);
   console.log('Food:', food);
   console.log('=== MOVE END ===');
   ```

3. **Use console.table() for arrays:**
   ```javascript
   console.table(ctx.getSnake()); // Beautiful table view!
   ```

4. **Test with Skip moves:**
   - Write script with minimal logging
   - Use Skip to run 1000+ moves quickly
   - Check if errors appear
   - Add more logging if needed

5. **Read error stack traces:**
   ```
   Error: Invalid direction
     at main (eval at <anonymous>) <- Your main() function
     at WorkerSnakeGame.update <- Game engine
   ```
   The first line shows where YOUR code failed.

---

## 🎯 Summary

**Before (Old Version):**
- ❌ Confusing Web Worker debugging
- ❌ console.log() didn't show up
- ❌ Errors only in worker console
- ❌ Had to manually set script

**After (New Version):**
- ✅ console.log() auto-forwarded to DevTools
- ✅ Visual error notifications
- ✅ Clear `🤖 [Your Script]` prefix
- ✅ Auto-compile on code change
- ✅ Helpful debugging tips
- ✅ Game continues even with errors

**Happy Debugging!** 🐛🔨
