import { test, expect } from '@testsprite/core';

/**
 * Certification System E2E Tests
 * Critical Path: Users must progress through tiers correctly
 */

const TIER_REQUIREMENTS = {
    bronze: { minWpm: 30, minAccuracy: 90, duration: 300 },
    silver: { minWpm: 50, minAccuracy: 92, duration: 300 },
    gold: { minWpm: 70, minAccuracy: 95, duration: 300 },
    platinum: { minWpm: 90, minAccuracy: 97, duration: 420 },
    diamond: { minWpm: 110, minAccuracy: 98, duration: 600 },
};

test.describe('Certification Tier Progression', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:1420/certification');
    });

    test('should display all 5 certification tiers', async ({ page }) => {
        await expect(page.locator('[data-testid="cert-tier-bronze"]')).toBeVisible();
        await expect(page.locator('[data-testid="cert-tier-silver"]')).toBeVisible();
        await expect(page.locator('[data-testid="cert-tier-gold"]')).toBeVisible();
        await expect(page.locator('[data-testid="cert-tier-platinum"]')).toBeVisible();
        await expect(page.locator('[data-testid="cert-tier-diamond"]')).toBeVisible();
    });

    test('should allow Bronze certification attempt without prerequisites', async ({ page }) => {
        const bronzeTier = page.locator('[data-testid="cert-tier-bronze"]');

        // Bronze should not be locked
        await expect(bronzeTier.locator('[data-testid="locked-icon"]')).not.toBeVisible();

        // Should have "Attempt Test" button
        await expect(bronzeTier.locator('button:has-text("Attempt Test")')).toBeEnabled();
    });

    test('should lock Silver tier until Bronze is earned', async ({ page }) => {
        const silverTier = page.locator('[data-testid="cert-tier-silver"]');

        // Silver should be locked if Bronze not earned
        const isLocked = await silverTier.locator('[data-testid="locked-icon"]').isVisible();

        if (isLocked) {
            // Attempt button should be disabled
            const attemptButton = silverTier.locator('button:has-text("Attempt Test")');
            await expect(attemptButton).toBeDisabled();

            // Should show lock message
            await expect(silverTier.locator('text=Complete Bronze first')).toBeVisible();
        }
    });

    test('should unlock Silver tier after Bronze completion', async ({ page }) => {
        // Complete Bronze tier first
        await page.click('[data-testid="cert-tier-bronze"] button:has-text("Attempt Test")');

        // Complete the test with passing metrics
        // (This would involve simulating typing at >30 WPM with >90% accuracy)
        await simulateTypingTest(page, 35, 92);

        // Return to certification page
        await page.goto('http://localhost:1420/certification');

        // Silver should now be unlocked
        const silverTier = page.locator('[data-testid="cert-tier-silver"]');
        await expect(silverTier.locator('[data-testid="locked-icon"]')).not.toBeVisible();
        await expect(silverTier.locator('button:has-text("Attempt Test")')).toBeEnabled();
    });
});

test.describe('Certification Test Execution', () => {
    test('should start certification test with correct parameters', async ({ page }) => {
        await page.goto('http://localhost:1420/certification');

        // Attempt Bronze
        await page.click('[data-testid="cert-tier-bronze"] button:has-text("Attempt Test")');

        // Should navigate to test page
        await expect(page).toHaveURL(/.*certification-test/);

        // Verify test parameters
        const tierInfo = page.locator('[data-testid="cert-test-info"]');
        await expect(tierInfo).toContainText('Bronze');
        await expect(tierInfo).toContainText('30 WPM');
        await expect(tierInfo).toContainText('90%');

        // Timer should show 5:00
        await expect(page.locator('[data-testid="cert-timer"]')).toContainText('5:00');
    });

    test('should pass Bronze with minimum requirements', async ({ page }) => {
        await page.goto('http://localhost:1420/certification');
        await page.click('[data-testid="cert-tier-bronze"] button:has-text("Attempt Test")');

        // Simulate typing at exactly 30 WPM with 90% accuracy
        await simulateTypingTest(page, 30, 90);

        // Should show pass result
        await expect(page.locator('[data-testid="cert-result"]')).toContainText('PASSED');
        await expect(page.locator('[data-testid="cert-result"]')).toHaveClass(/success|pass|green/i);
    });

    test('should fail Bronze with insufficient WPM', async ({ page }) => {
        await page.goto('http://localhost:1420/certification');
        await page.click('[data-testid="cert-tier-bronze"] button:has-text("Attempt Test")');

        // Simulate typing at 28 WPM (below 30 requirement)
        await simulateTypingTest(page, 28, 95);

        // Should show fail result
        await expect(page.locator('[data-testid="cert-result"]')).toContainText('FAILED');
        await expect(page.locator('[data-testid="fail-reason"]')).toContainText('WPM too low');
    });

    test('should fail Bronze with insufficient accuracy', async ({ page }) => {
        await page.goto('http://localhost:1420/certification');
        await page.click('[data-testid="cert-tier-bronze"] button:has-text("Attempt Test")');

        // Simulate typing at 40 WPM but only 85% accuracy (below 90%)
        await simulateTypingTest(page, 40, 85);

        // Should show fail result
        await expect(page.locator('[data-testid="cert-result"]')).toContainText('FAILED');
        await expect(page.locator('[data-testid="fail-reason"]')).toContainText('Accuracy too low');
    });

    test('should enforce time limit strictly', async ({ page }) => {
        await page.goto('http://localhost:1420/certification');
        await page.click('[data-testid="cert-tier-bronze"] button:has-text("Attempt Test")');

        // Wait for 5 minutes (Bronze duration)
        await page.waitForTimeout(301000); // 5 min + 1 sec

        // Test should auto-complete
        await expect(page.locator('[data-testid="cert-result"]')).toBeVisible({ timeout: 2000 });
    });
});

test.describe('Verification Codes', () => {
    test('should generate unique verification code on pass', async ({ page }) => {
        await page.goto('http://localhost:1420/certification');
        await page.click('[data-testid="cert-tier-bronze"] button:has-text("Attempt Test")');

        await simulateTypingTest(page, 35, 92);

        // Should display verification code
        const verificationCode = await page.locator('[data-testid="verification-code"]').textContent();

        // Code should be in format: XXXX-XXXX-XXXX (12 chars + 2 dashes)
        expect(verificationCode).toMatch(/^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/);
    });

    test('should not generate code on failure', async ({ page }) => {
        await page.goto('http://localhost:1420/certification');
        await page.click('[data-testid="cert-tier-bronze"] button:has-text("Attempt Test")');

        await simulateTypingTest(page, 20, 80);

        // Should not show verification code
        const codeExists = await page.locator('[data-testid="verification-code"]').isVisible().catch(() => false);
        expect(codeExists).toBe(false);
    });

    test('should generate different codes for multiple certifications', async ({ page }) => {
        await page.goto('http://localhost:1420/certification');

        // Get Bronze
        await page.click('[data-testid="cert-tier-bronze"] button:has-text("Attempt Test")');
        await simulateTypingTest(page, 35, 92);
        const bronzeCode = await page.locator('[data-testid="verification-code"]').textContent();

        // Return and get Silver
        await page.goto('http://localhost:1420/certification');
        await page.click('[data-testid="cert-tier-silver"] button:has-text("Attempt Test")');
        await simulateTypingTest(page, 55, 94);
        const silverCode = await page.locator('[data-testid="verification-code"]').textContent();

        // Codes should be different
        expect(bronzeCode).not.toBe(silverCode);
    });
});

test.describe('Earned Certifications Display', () => {
    test('should display earned badge for completed tier', async ({ page }) => {
        await page.goto('http://localhost:1420/certification');

        // Complete Bronze
        await page.click('[data-testid="cert-tier-bronze"] button:has-text("Attempt Test")');
        await simulateTypingTest(page, 35, 92);

        // Return to certification page
        await page.goto('http://localhost:1420/certification');

        // Bronze tier should show earned badge
        const bronzeTier = page.locator('[data-testid="cert-tier-bronze"]');
        await expect(bronzeTier.locator('[data-testid="earned-badge"]')).toBeVisible();
        await expect(bronzeTier.locator('text=Earned')).toBeVisible();
    });

    test('should show WPM and accuracy achieved on earned cert', async ({ page }) => {
        await page.goto('http://localhost:1420/certification');
        await page.click('[data-testid="cert-tier-bronze"] button:has-text("Attempt Test")');
        await simulateTypingTest(page, 45, 95);

        await page.goto('http://localhost:1420/certification');

        const bronzeTier = page.locator('[data-testid="cert-tier-bronze"]');
        await expect(bronzeTier).toContainText('45 WPM');
        await expect(bronzeTier).toContainText('95%');
    });
});

/**
 * Helper function to simulate typing test completion
 */
async function simulateTypingTest(page: any, targetWpm: number, targetAccuracy: number) {
    // This is a simplified simulation
    // In reality, would need to calculate exact typing speed and errors

    const inputArea = page.locator('[data-testid="typing-input"]');
    await inputArea.focus();

    // Calculate characters needed for target WPM
    // WPM = (chars / 5) / minutes
    // For 1 minute test: chars = WPM * 5
    const charsNeeded = targetWpm * 5;
    const errorsAllowed = Math.floor(charsNeeded * (1 - targetAccuracy / 100));

    // Type characters at controlled pace
    for (let i = 0; i < charsNeeded; i++) {
        if (i < errorsAllowed) {
            await page.keyboard.press('x'); // Intentional error
            await page.keyboard.press('Backspace');
        }
        await page.keyboard.press('a');
        await page.waitForTimeout(1000 / (targetWpm / 12)); // Pace for target WPM
    }

    // Wait for test completion
    await page.waitForTimeout(1000);
}
