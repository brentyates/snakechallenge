# Control Tests - Edge Cases

## Test Scenarios to Validate

### Speed Control Tests
- [ ] Test 1: Change speed before starting game
- [ ] Test 2: Start game, change speed while running
- [ ] Test 3: Change speed multiple times rapidly
- [ ] Test 4: Stop game, change speed, start again
- [ ] Test 5: Change speed during skip (should be disabled)

### Skip Control Tests
- [ ] Test 6: Skip without starting game first
- [ ] Test 7: Start game, then skip
- [ ] Test 8: Skip, wait for completion, skip again
- [ ] Test 9: Skip while game is running
- [ ] Test 10: Try to skip during another skip (should prevent)
- [ ] Test 11: Skip large number (1000+)
- [ ] Test 12: Skip after game over

### Reset Control Tests
- [ ] Test 13: Reset before starting
- [ ] Test 14: Reset while running (should be disabled)
- [ ] Test 15: Reset during skip (should be disabled)
- [ ] Test 16: Reset after game over

### Combined Edge Cases
- [ ] Test 17: Start → Stop → Start again quickly
- [ ] Test 18: Start → Skip → Stop during skip
- [ ] Test 19: Multiple resets in a row
- [ ] Test 20: Speed changes + skip + stop in sequence

## Known Issues to Watch For
1. **State not resetting properly** - Controls staying disabled
2. **Animation frame leaks** - Game loop continuing when it shouldn't
3. **Worker message queue** - Messages getting out of sync
4. **React state updates** - UI not reflecting actual state

## How to Test Manually
1. Open http://localhost:5173/
2. Open DevTools Console (F12)
3. Try each test scenario
4. Watch for:
   - Buttons staying disabled when they shouldn't be
   - Game continuing when stopped
   - Console errors
   - UI freezing
   - Stats not updating
