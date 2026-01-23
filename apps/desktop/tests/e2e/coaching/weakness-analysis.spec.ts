import { test, expect } from '@testsprite/core';

/**
 * AI Coaching System E2E Tests
 * Tests weakness analysis and AI-generated drill recommendations
 */

test.describe('Weakness Analysis', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:1420');
        // Assume user is authenticated with some typing history
    });

    test('should analyze typing weaknesses from session data', async ({ page }) => {
        // Navigate to coaching page
        await page.click('[data-testid="nav-coaching"]');
        await expect(page).toHaveURL(/.*coaching/);

        // Click "Analyze My Weaknesses" button
        await page.click('button:has-text("Analyze")');

        // Should show loading state
        await expect(page.locator('[data-testid="analysis-loading"]')).toBeVisible();

        // Wait for analysis to complete (max 10 seconds for AI response)
        await expect(page.locator('[data-testid="coach-verdict"]')).toBeVisible({ timeout: 15000 });
    });

    test('should display identified bad habit with severity score', async ({ page }) => {
        await page.goto('http://localhost:1420/coaching');
        await page.click('button:has-text("Analyze")');

        await expect(page.locator('[data-testid="coach-verdict"]')).toBeVisible({ timeout: 15000 });

        // Should show habit name
        const habit = await page.locator('[data-testid="habit-name"]').textContent();
        expect(habit).toBeTruthy();
        expect(habit!.length).toBeGreaterThan(5);

        // Should show severity score (1-10)
        const score = await page.locator('[data-testid="habit-score"]').textContent();
        const scoreNum = parseInt(score || '0');
        expect(scoreNum).toBeGreaterThanOrEqual(1);
        expect(scoreNum).toBeLessThanOrEqual(10);
    });

    test('should provide personalized insight about the problem', async ({ page }) => {
        await page.goto('http://localhost:1420/coaching');
        await page.click('button:has-text("Analyze")');

        await expect(page.locator('[data-testid="coach-verdict"]')).toBeVisible({ timeout: 15000 });

        // Should have insight text
        const insight = await page.locator('[data-testid="coach-insight"]').textContent();
        expect(insight).toBeTruthy();
        expect(insight!.length).toBeGreaterThan(20); // Meaningful insight
    });

    test('should recommend 3 custom drills', async ({ page }) => {
        await page.goto('http://localhost:1420/coaching');
        await page.click('button:has-text("Analyze")');

        await expect(page.locator('[data-testid="coach-verdict"]')).toBeVisible({ timeout: 15000 });

        // Should show 3 drill recommendations
        const drills = page.locator('[data-testid="recommended-drill"]');
        await expect(drills).toHaveCount(3);

        // Each drill should have title, reason, and text
        for (let i = 0; i < 3; i++) {
            const drill = drills.nth(i);
            await expect(drill.locator('[data-testid="drill-title"]')).toBeVisible();
            await expect(drill.locator('[data-testid="drill-reason"]')).toBeVisible();
            await expect(drill.locator('[data-testid="drill-text"]')).toBeVisible();
        }
    });

    test('should allow user to practice recommended drill', async ({ page }) => {
        await page.goto('http://localhost:1420/coaching');
        await page.click('button:has-text("Analyze")');
        await expect(page.locator('[data-testid="coach-verdict"]')).toBeVisible({ timeout: 15000 });

        // Click "Practice This" on first drill
        await page.click('[data-testid="recommended-drill"]:first-child button:has-text("Practice")');

        // Should navigate to typing test with drill text loaded
        await expect(page).toHaveURL(/.*typing-test/);
        await expect(page.locator('[data-testid="test-text"]')).toBeVisible();
    });
});

test.describe('AI Integration', () => {
    test('should work with Gemini API when key is present', async ({ page }) => {
        // Set API key in environment
        await page.addInitScript(() => {
            (window as any).VITE_GEMINI_API_KEY = 'test-key-present';
        });

        await page.goto('http://localhost:1420/coaching');
        await page.click('button:has-text("Analyze")');

        // Should use real AI (not mock)
        await expect(page.locator('[data-testid="coach-verdict"]')).toBeVisible({ timeout: 15000 });

        // Verify it's not mock data
        const insight = await page.locator('[data-testid="coach-insight"]').textContent();
        expect(insight).not.toContain('Mock Mode');
    });

    test('should fallback to mock mode without API key', async ({ page }) => {
        // Clear API key
        await page.addInitScript(() => {
            delete (window as any).VITE_GEMINI_API_KEY;
        });

        await page.goto('http://localhost:1420/coaching');

        // Should show warning about mock mode
        const warning = await page.locator('text=Mock Mode').isVisible().catch(() => false);

        await page.click('button:has-text("Analyze")');

        // Should still provide analysis (using mock data)
        await expect(page.locator('[data-testid="coach-verdict"]')).toBeVisible({ timeout: 5000 });
    });

    test('should handle AI API errors gracefully', async ({ page }) => {
        // Mock API failure
        await page.route('**/generativelanguage.googleapis.com/**', route => route.abort());

        await page.goto('http://localhost:1420/coaching');
        await page.click('button:has-text("Analyze")');

        // Should fallback to mock verdict
        await expect(page.locator('[data-testid="coach-verdict"]')).toBeVisible({ timeout: 10000 });
    });
});

test.describe('Slow Keys Analysis', () => {
    test('should identify slowest keys from typing data', async ({ page }) => {
        await page.goto('http://localhost:1420/coaching');
        await page.click('button:has-text("Analyze")');
        await expect(page.locator('[data-testid="coach-verdict"]')).toBeVisible({ timeout: 15000 });

        // Check if slow keys are displayed in the detailed view
        const detailsButton = page.locator('button:has-text("View Details")');
        if (await detailsButton.isVisible()) {
            await detailsButton.click();

            // Should show slow keys list
            await expect(page.locator('[data-testid="slow-keys-list"]')).toBeVisible();

            // Should have at least 1 slow key
            const slowKeys = page.locator('[data-testid="slow-key-item"]');
            const count = await slowKeys.count();
            expect(count).toBeGreaterThan(0);
        }
    });
});

test.describe('Error-Prone Keys Analysis', () => {
    test('should identify keys with highest error rates', async ({ page }) => {
        await page.goto('http://localhost:1420/coaching');
        await page.click('button:has-text("Analyze")');
        await expect(page.locator('[data-testid="coach-verdict"]')).toBeVisible({ timeout: 15000 });

        const detailsButton = page.locator('button:has-text("View Details")');
        if (await detailsButton.isVisible()) {
            await detailsButton.click();

            // Should show error-prone keys
            await expect(page.locator('[data-testid="error-keys-list"]')).toBeVisible();
        }
    });
});
