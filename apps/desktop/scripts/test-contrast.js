/**
 * test-contrast.js
 * Manual verification script for the Auto Contrast System.
 */

const colors = [
    { hex: '#FFFFFF', expected: '#000000', label: 'White' },
    { hex: '#000000', expected: '#FFFFFF', label: 'Black' },
    { hex: '#4A90E2', expected: '#FFFFFF', label: 'Blue (Standard)' },
    { hex: '#FFD700', expected: '#000000', label: 'Gold (Bright)' },
    { hex: '#22C55E', expected: '#000000', label: 'Green (Vibrant)' },
    { hex: '#1A1A1A', expected: '#FFFFFF', label: 'Dark Gray' },
    { hex: '#F3F4F6', expected: '#000000', label: 'Light Gray' }
];

function getContrastText(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    // YIQ formula (same as frontend fallback)
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? '#000000' : '#FFFFFF';
}

console.log('🧪 Running Auto Contrast Text Tests...\n');
let passed = 0;

colors.forEach(({ hex, expected, label }) => {
    const result = getContrastText(hex);
    const status = result === expected ? '✅ PASS' : '❌ FAIL';
    if (result === expected) passed++;

    console.log(`${status} | ${label.padEnd(15)} | Hex: ${hex} | Result: ${result} | Expected: ${expected}`);
});

console.log(`\n📊 Results: ${passed}/${colors.length} tests passed.`);
process.exit(passed === colors.length ? 0 : 1);
