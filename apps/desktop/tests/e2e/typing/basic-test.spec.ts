import { test, expect } from '@testsprite/core';

/**
 * Typing Test Engine E2E Tests
 * Critical Path: Core typing functionality must be accurate and responsive
 */

test.describe('Basic Typing Test Flow', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:1420');
        // Assume user is authenticated or in guest mode
    });

    test('should start and complete a basic typing test', async ({ page }) => {
        // Navigate to typing test page
        await page.click('[data-testid="nav-typing-test"]');
        await expect(page).toHaveURL(/.*typing-test/);

        // Verify initial state
        await expect(page.locator('[data-testid="typing-area"]')).toBeVisible();
        await expect(page.locator('[data-testid="start-test-button"]')).toBeVisible();

        // Start test
        await page.click('[data-testid="start-test-button"]');

        // Verify timer started
        const timer = page.locator('[data-testid="timer"]');
        await expect(timer).toBeVisible();

        // Get test text
        const testText = await page.locator('[data-testid="test-text"]').textContent();
        expect(testText).toBeTruthy();

        // Type the text (simulate typing)
        const inputArea = page.locator('[data-testid="typing-input"]');
        await inputArea.focus();

        // Type first 50 characters
        const textToType = testText!.substring(0, 50);
        for (const char of textToType) {
            await page.keyboard.press(char);
            await page.waitForTimeout(50); // Simulate human typing speed
        }

        // Verify real-time stats are updating
        const wpmDisplay = page.locator('[data-testid="current-wpm"]');
        const wpmValue = await wpmDisplay.textContent();
        expect(parseInt(wpmValue || '0')).toBeGreaterThan(0);
    });

    test('should calculate WPM accurately', async ({ page }) => {
        await page.goto('http://localhost:1420/typing-test');
        await page.click('[data-testid="start-test-button"]');

        const startTime = Date.now();

        // Type exactly "hello world" (11 characters including space)
        const inputArea = page.locator('[data-testid="typing-input"]');
        await inputArea.focus();

        const testPhrase = 'hello world';
        for (const char of testPhrase) {
            await page.keyboard.press(char);
        }

        const endTime = Date.now();
        const elapsedMinutes = (endTime - startTime) / 60000;

        // WPM = (characters / 5) / minutes
        // Expected WPM = (11 / 5) / elapsedMinutes = 2.2 / elapsedMinutes
        const expectedWPM = Math.round(2.2 / elapsedMinutes);

        // Get displayed WPM
        const displayedWPM = parseInt(await page.locator('[data-testid="current-wpm"]').textContent() || '0');

        // Allow ±2 WPM tolerance
        expect(Math.abs(displayedWPM - expectedWPM)).toBeLessThanOrEqual(2);
    });

    test('should calculate accuracy percentage correctly', async ({ page }) => {
        await page.goto('http://localhost:1420/typing-test');
        await page.click('[data-testid="start-test-button"]');

        // Get expected text
        const expectedText = await page.locator('[data-testid="test-text"]').textContent();
        const firstWord = expectedText!.split(' ')[0];

        const inputArea = page.locator('[data-testid="typing-input"]');
        await inputArea.focus();

        // Type with intentional error
        // If first word is "hello", type "hallo" (1 error out of 5 chars)
        const correctChars = firstWord.substring(0, 2); // "he"
        const errorChar = 'x'; // Wrong char
        const restChars = firstWord.substring(3); // "lo"

        for (const char of correctChars) await page.keyboard.press(char);
        await page.keyboard.press(errorChar);
        for (const char of restChars) await page.keyboard.press(char);

        // Expected accuracy = 4/5 = 80%
        const accuracy = await page.locator('[data-testid="accuracy"]').textContent();
        const accuracyPercent = parseInt(accuracy || '0');

        // Should be around 80% (±5% tolerance)
        expect(accuracyPercent).toBeGreaterThanOrEqual(75);
        expect(accuracyPercent).toBeLessThanOrEqual(85);
    });

    test('should highlight errors in real-time', async ({ page }) => {
        await page.goto('http://localhost:1420/typing-test');
        await page.click('[data-testid="start-test-button"]');

        const inputArea = page.locator('[data-testid="typing-input"]');
        await inputArea.focus();

        // Type an incorrect character
        await page.keyboard.press('x'); // Assuming first char is not 'x'

        // Verify error highlighting
        const errorHighlight = page.locator('[data-testid="error-char"]');
        await expect(errorHighlight).toBeVisible({ timeout: 1000 });
        await expect(errorHighlight).toHaveCSS('color', /red|#ff0000|rgb\(255,\s*0,\s*0\)/i);
    });

    test('should handle backspace correctly', async ({ page }) => {
        await page.goto('http://localhost:1420/typing-test');
        await page.click('[data-testid="start-test-button"]');

        const inputArea = page.locator('[data-testid="typing-input"]');
        await inputArea.focus();

        // Type some characters
        await page.keyboard.press('h');
        await page.keyboard.press('e');
        await page.keyboard.press('l');

        // Get current cursor position
        const beforeBackspace = await inputArea.inputValue();
        expect(beforeBackspace).toBe('hel');

        // Press backspace
        await page.keyboard.press('Backspace');

        // Verify character removed
        const afterBackspace = await inputArea.inputValue();
        expect(afterBackspace).toBe('he');
    });

    test('should prevent paste/copy cheating', async ({ page }) => {
        await page.goto('http://localhost:1420/typing-test');
        await page.click('[data-testid="start-test-button"]');

        const inputArea = page.locator('[data-testid="typing-input"]');
        await inputArea.focus();

        // Try to paste
        await page.keyboard.press('Control+V');

        // Input should remain empty or show warning
        const inputValue = await inputArea.inputValue();
        expect(inputValue).toBe('');

        // May show anti-cheat warning
        const warningExists = await page.locator('text=Paste detected').isVisible().catch(() => false);
        // If warning system exists, it should be visible
        if (warningExists) {
            await expect(page.locator('text=Paste detected')).toBeVisible();
        }
    });

    test('should enforce timer correctly', async ({ page }) => {
        await page.goto('http://localhost:1420/typing-test');

        // Set test to 10 seconds for testing
        await page.selectOption('[data-testid="duration-select"]', '10');

        await page.click('[data-testid="start-test-button"]');

        const timer = page.locator('[data-testid="timer"]');
        const initialTime = await timer.textContent();

        // Wait 2 seconds
        await page.waitForTimeout(2000);

        const timeAfter2Sec = await timer.textContent();

        // Timer should have decreased
        expect(timeAfter2Sec).not.toBe(initialTime);

        // Wait for timer to complete (remaining ~8 seconds)
        await page.waitForTimeout(8500);

        // Test should auto-complete
        await expect(page.locator('[data-testid="test-results"]')).toBeVisible({ timeout: 2000 });
    });
});

test.describe('Edge Cases & Error Handling', () => {
    test('should handle no input gracefully', async ({ page }) => {
        await page.goto('http://localhost:1420/typing-test');
        await page.click('[data-testid="start-test-button"]');

        // Wait for test to auto-complete without typing
        await page.waitForTimeout(11000); // Assuming 10s test

        // Should show 0 WPM results
        await expect(page.locator('[data-testid="final-wpm"]')).toContainText('0');
    });

    test('should handle rapid key presses', async ({ page }) => {
        await page.goto('http://localhost:1420/typing-test');
        await page.click('[data-testid="start-test-button"]');

        const inputArea = page.locator('[data-testid="typing-input"]');
        await inputArea.focus();

        // Type very rapidly
        for (let i = 0; i < 20; i++) {
            await page.keyboard.press('a');
            await page.waitForTimeout(10); // 100 chars/sec
        }

        // All keystrokes should be registered
        const inputValue = await inputArea.inputValue();
        expect(inputValue.length).toBe(20);
    });
});
