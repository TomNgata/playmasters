const assert = require('assert');

// The algorithm extracted from page.tsx
const calculateRunningTotals = (currentRolls) => {
    const totals = [];
    let cumulative = 0;
    
    const flatRolls = [];
    for (const frame of currentRolls) {
        flatRolls.push(...frame);
    }
    
    let rollIndex = 0;
    for (let frameIndex = 0; frameIndex < 10; frameIndex++) {
        const frame = currentRolls[frameIndex];
        if (!frame || frame.length === 0) {
            totals.push(cumulative);
            continue;
        }
        
        if (frameIndex === 9) {
            const frameSum = frame.reduce((a, b) => a + b, 0);
            cumulative += frameSum;
            totals.push(cumulative);
            break;
        }
        
        const isStrike = frame[0] === 10;
        const isSpare = !isStrike && frame.length > 1 && frame[0] + frame[1] === 10;
        
        if (isStrike) {
            let bonus = 0;
            const next1 = flatRolls[rollIndex + 1];
            const next2 = flatRolls[rollIndex + 2];
            if (next1 !== undefined) bonus += next1;
            if (next2 !== undefined) bonus += next2;
            cumulative += 10 + bonus;
            rollIndex += 1; 
        } else if (isSpare) {
            let bonus = 0;
            const next1 = flatRolls[rollIndex + 2];
            if (next1 !== undefined) bonus += next1;
            cumulative += 10 + bonus;
            rollIndex += 2;
        } else {
            const frameSum = frame.reduce((a, b) => a + b, 0);
            cumulative += frameSum;
            rollIndex += frame.length; 
        }
        totals.push(cumulative);
    }
    
    return totals;
};

// Tests
console.log("Running Bowling Scoring Tests...");

try {
    // 1. Perfect Game
    const perfectGame = [[10],[10],[10],[10],[10],[10],[10],[10],[10],[10,10,10]];
    const perfTotals = calculateRunningTotals(perfectGame);
    assert.strictEqual(perfTotals[9], 300, `Perfect game failed. Got ${perfTotals[9]}`);

    // 2. All Spares (9/ repeatedly, and 9 on the 10th bonus ball)
    const allSpares = [[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1,9]];
    const spareTotals = calculateRunningTotals(allSpares);
    assert.strictEqual(spareTotals[9], 190, `All spares failed. Got ${spareTotals[9]}`);

    // 3. Open Frames (all 9s: 4, 5 every frame)
    const openGame = [[4,5],[4,5],[4,5],[4,5],[4,5],[4,5],[4,5],[4,5],[4,5],[4,5]];
    const openTotals = calculateRunningTotals(openGame);
    assert.strictEqual(openTotals[9], 90, `Open game failed. Got ${openTotals[9]}`);

    // 4. Incomplete Game (e.g. 5 frames)
    const incomplete = [[10], [7,3], [5,2]];
    const incTotals = calculateRunningTotals(incomplete);
    assert.strictEqual(incTotals[0], 20, 'Incomplete Frame 1 failed');
    assert.strictEqual(incTotals[1], 35, 'Incomplete Frame 2 failed');
    assert.strictEqual(incTotals[2], 42, 'Incomplete Frame 3 failed');
    assert.strictEqual(Math.max(...incTotals), 42, 'Max of incomplete failed');

    console.log("ALL TESTS PASSED SUCCESSFULLY! 🎳");
} catch(e) {
    console.error("TEST FAILED: ", e.message);
    process.exit(1);
}
