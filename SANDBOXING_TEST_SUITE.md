# 🧪 Sandboxing Test Suite

## How to Test

Copy each test script into the code editor and click "Set Script" then "Start". Observe console for any errors or warnings.

---

## ✅ Test 1: Direct Object Modification (Should Fail Silently)

```javascript
function main(ctx) {
  const head = ctx.getHead();
  console.log('Original head:', head.x, head.y);

  // Attempt to modify - should fail in strict mode or be silently ignored
  try {
    head.x = 999;
    head.y = 999;
    console.log('Modified head:', head.x, head.y); // Should still be original values
  } catch (e) {
    console.log('✅ Caught modification attempt:', e.message);
  }

  // Game should continue with original values
  const food = ctx.getFood();
  if (head.x < food.x) return 'RIGHT';
  if (head.x > food.x) return 'LEFT';
  if (head.y < food.y) return 'DOWN';
  return 'UP';
}
```

**Expected Result**: Object remains frozen, modification fails silently or throws error. Game continues normally.

---

## ✅ Test 2: Prototype Pollution Attack (Should Fail)

```javascript
function main(ctx) {
  const pos = ctx.getHead();

  // Attempt prototype pollution
  try {
    pos.__proto__.hacked = true;
    pos.__proto__.toString = () => 'PWNED';
    console.log('Prototype pollution:', pos.__proto__.hacked);
  } catch (e) {
    console.log('✅ Caught prototype pollution:', e.message);
  }

  // Check if pollution affected other objects
  const food = ctx.getFood();
  console.log('Food object hacked?', (food as any).hacked); // Should be undefined

  // Normal behavior
  if (pos.x < food.x) return 'RIGHT';
  if (pos.x > food.x) return 'LEFT';
  if (pos.y < food.y) return 'DOWN';
  return 'UP';
}
```

**Expected Result**: Prototype modification fails or is isolated. Other objects are not affected.

---

## ✅ Test 3: Context Function Replacement (Should Fail)

```javascript
function main(ctx) {
  // Attempt to replace context functions
  try {
    ctx.getHead = () => ({ x: 999, y: 999 });
    console.log('Context replacement succeeded?', ctx.getHead());
  } catch (e) {
    console.log('✅ Caught context modification:', e.message);
  }

  // Context should still work normally
  const head = ctx.getHead();
  const food = ctx.getFood();

  if (head.x < food.x) return 'RIGHT';
  if (head.x > food.x) return 'LEFT';
  if (head.y < food.y) return 'DOWN';
  return 'UP';
}
```

**Expected Result**: Context object is frozen, modification throws error. Original functions still work.

---

## ✅ Test 4: Invalid Return Value (Should Be Ignored)

```javascript
function main(ctx) {
  const head = ctx.getHead();
  const food = ctx.getFood();

  // Return invalid direction
  if (Math.random() < 0.5) {
    console.log('Returning invalid direction');
    return 'INVALID_DIRECTION'; // Should be validated and ignored
  }

  // Sometimes return valid
  if (head.x < food.x) return 'RIGHT';
  return 'LEFT';
}
```

**Expected Result**: Invalid return values are caught by validation. Snake continues in current direction or ignores bad input.

---

## ✅ Test 5: Array Modification (Should Fail)

```javascript
function main(ctx) {
  const snake = ctx.getSnake();
  console.log('Original snake length:', snake.length);

  // Attempt to modify snake array
  try {
    snake[0].x = 999;
    snake[0].y = 999;
    console.log('Modified snake[0]:', snake[0]);
  } catch (e) {
    console.log('✅ Caught array modification:', e.message);
  }

  // Attempt to modify array itself
  try {
    snake.push({ x: 100, y: 100 });
    console.log('Snake length after push:', snake.length);
  } catch (e) {
    console.log('✅ Caught array push:', e.message);
  }

  // Normal behavior
  const head = ctx.getHead();
  const food = ctx.getFood();
  if (head.x < food.x) return 'RIGHT';
  if (head.x > food.x) return 'LEFT';
  if (head.y < food.y) return 'DOWN';
  return 'UP';
}
```

**Expected Result**: Array and elements are frozen. Modifications fail. Game continues with original state.

---

## ✅ Test 6: Direction Object Modification (Should Fail)

```javascript
function main(ctx, Direction) {
  // Attempt to modify Direction constants
  try {
    Direction.UP = 'HACKED';
    Direction.TURBO = 'SUPER_FAST';
    console.log('Direction modified?', Direction.UP);
  } catch (e) {
    console.log('✅ Caught Direction modification:', e.message);
  }

  // Direction should still work normally
  const head = ctx.getHead();
  const food = ctx.getFood();

  if (head.x < food.x) return Direction.RIGHT;
  if (head.x > food.x) return Direction.LEFT;
  if (head.y < food.y) return Direction.DOWN;
  return Direction.UP;
}
```

**Expected Result**: Direction object is frozen. Modifications fail. Constants still work.

---

## ✅ Test 7: Legitimate Complex AI (Should Work Perfectly)

```javascript
function main(ctx) {
  const head = ctx.getHead();
  const food = ctx.getFood();
  const snake = ctx.getSnake();
  const board = ctx.getBoardSize();

  // All reads should work fine
  console.log('Head:', head);
  console.log('Food:', food);
  console.log('Snake length:', snake.length);
  console.log('Board:', board.width, 'x', board.height);

  // Check for walls
  const dangerZones = [
    { x: head.x, y: head.y - 1 }, // UP
    { x: head.x, y: head.y + 1 }, // DOWN
    { x: head.x - 1, y: head.y }, // LEFT
    { x: head.x + 1, y: head.y }, // RIGHT
  ];

  // Safe directions
  const safe = [];
  if (head.y > 0) safe.push('UP');
  if (head.y < board.height - 1) safe.push('DOWN');
  if (head.x > 0) safe.push('LEFT');
  if (head.x < board.width - 1) safe.push('RIGHT');

  // Move towards food if safe
  if (head.x < food.x && safe.includes('RIGHT')) return 'RIGHT';
  if (head.x > food.x && safe.includes('LEFT')) return 'LEFT';
  if (head.y < food.y && safe.includes('DOWN')) return 'DOWN';
  if (head.y > food.y && safe.includes('UP')) return 'UP';

  // Default to any safe direction
  return safe[0] || 'RIGHT';
}
```

**Expected Result**: Everything works perfectly. AI can read all game state. Snake plays intelligently.

---

## 🎯 Test Results Summary

After running all tests, you should observe:

| Test | Expected Behavior | Status |
|------|------------------|--------|
| Direct Modification | ✅ Fails/Ignored | - |
| Prototype Pollution | ✅ Fails/Isolated | - |
| Context Replacement | ✅ Throws Error | - |
| Invalid Return | ✅ Validated/Ignored | - |
| Array Modification | ✅ Fails/Frozen | - |
| Direction Modification | ✅ Fails/Frozen | - |
| Legitimate AI | ✅ Works Perfect | - |

---

## 🔍 Console Monitoring

Open browser DevTools console while testing. You should see:

**Good Signs** ✅:
- "Caught modification attempt: Cannot assign to read only property"
- "Caught prototype pollution: Cannot add property"
- "Caught context modification: Cannot assign to read only property"

**Bad Signs** ❌:
- "Modified head: 999, 999" (modification succeeded)
- "Food object hacked? true" (prototype pollution worked)
- No error messages when trying to modify frozen objects

---

## 📊 Security Level

With deep freezing implemented:
- ✅ **Direct Modification**: BLOCKED
- ✅ **Array Modification**: BLOCKED
- ✅ **Context Tampering**: BLOCKED
- ✅ **Invalid Returns**: VALIDATED
- ⚠️ **Prototype Pollution**: MITIGATED (frozen but not 100% prevented)
- ❌ **VM Escape**: Not possible to prevent in browser (would need backend sandbox)

**Overall Security**: 🛡️ **STRONG** - Sufficient for preventing both accidents and most cheating attempts.
