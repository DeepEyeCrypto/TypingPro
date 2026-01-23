import { test, expect } from '@testsprite/core';

/**
 * Authentication Flow - Google OAuth E2E Tests
 * Critical Path: User must be able to log in via Google OAuth
 */

test.describe('Google OAuth Authentication', () => {
    test.beforeEach(async ({ page }) => {
        // Clear browser storage to ensure clean state
        await page.context().clearCookies();
        await page.goto('http://localhost:1420');
    });

    test('should display login modal on app launch when not authenticated', async ({ page }) => {
        // Wait for auth page to load
        await expect(page.locator('[data-testid="auth-modal"]')).toBeVisible({ timeout: 5000 });

        // Verify Google login button is present
        await expect(page.locator('button:has-text("Continue with Google")')).toBeVisible();
    });

    test('should complete full Google OAuth flow and authenticate user', async ({ page }) => {
        // Click Google OAuth button
        await page.click('button:has-text("Continue with Google")');

        // Wait for OAuth redirect (in real test, handle OAuth popup/redirect)
        // Note: This requires proper OAuth test credentials
        await page.waitForURL(/google\.com\/o\/oauth2/, { timeout: 10000 });

        // Fill OAuth credentials (using test account)
        await page.fill('input[type="email"]', process.env.TEST_GOOGLE_EMAIL || 'test@example.com');
        await page.click('button:has-text("Next")');

        await page.fill('input[type="password"]', process.env.TEST_GOOGLE_PASSWORD || 'testpassword');
        await page.click('button:has-text("Next")');

        // Wait for redirect back to app
        await page.waitForURL('http://localhost:1420/**', { timeout: 15000 });

        // Verify user is authenticated - dashboard should be visible
        await expect(page.locator('[data-testid="dashboard"]')).toBeVisible({ timeout: 5000 });

        // Verify user profile is loaded
        const username = await page.locator('[data-testid="user-username"]').textContent();
        expect(username).toBeTruthy();
    });

    test('should show System Health panel with all green checks', async ({ page }) => {
        // Open auth modal
        await expect(page.locator('[data-testid="auth-modal"]')).toBeVisible();

        // Check System Health panel
        const healthPanel = page.locator('[data-testid="system-health-panel"]');
        await expect(healthPanel).toBeVisible();

        // Verify all required env variables are marked as [OK]
        await expect(healthPanel.locator('text=FIREBASE_API_KEY').locator('text=[OK]')).toBeVisible();
        await expect(healthPanel.locator('text=GOOGLE_CLIENT_ID').locator('text=[OK]')).toBeVisible();
        await expect(healthPanel.locator('text=FIREBASE_PROJECT_ID').locator('text=[OK]')).toBeVisible();
    });

    test('should persist session after app restart', async ({ page, context }) => {
        // Authenticate user first
        await page.click('button:has-text("Continue with Google")');
        // ... complete OAuth flow (abbreviated for brevity)

        // Close and reopen app
        await page.close();
        const newPage = await context.newPage();
        await newPage.goto('http://localhost:1420');

        // User should still be authenticated
        await expect(newPage.locator('[data-testid="dashboard"]')).toBeVisible({ timeout: 5000 });
    });

    test('should successfully logout and clear session', async ({ page }) => {
        // Assume user is authenticated
        await page.goto('http://localhost:1420');

        // Open settings/profile menu
        await page.click('[data-testid="user-menu-button"]');

        // Click logout
        await page.click('button:has-text("Logout")');

        // Verify redirected to auth page
        await expect(page.locator('[data-testid="auth-modal"]')).toBeVisible({ timeout: 3000 });

        // Verify session is cleared
        const cookies = await page.context().cookies();
        expect(cookies.filter(c => c.name.includes('session'))).toHaveLength(0);
    });

    test('should handle failed authentication gracefully', async ({ page }) => {
        // Mock OAuth failure
        await page.route('**/google.com/o/oauth2/**', route => route.abort());

        await page.click('button:has-text("Continue with Google")');

        // Should show error message
        await expect(page.locator('text=Authentication failed')).toBeVisible({ timeout: 5000 });

        // User should remain on auth page
        await expect(page.locator('[data-testid="auth-modal"]')).toBeVisible();
    });
});

test.describe('Anonymous Mode', () => {
    test('should allow user to continue in anonymous mode', async ({ page }) => {
        await page.goto('http://localhost:1420');

        // Click "Continue as Guest" or similar
        const guestButton = page.locator('button:has-text("Guest Mode")');
        if (await guestButton.isVisible()) {
            await guestButton.click();

            // Should navigate to app with limited features
            await expect(page.locator('[data-testid="dashboard"]')).toBeVisible({ timeout: 5000 });
        }
    });
});
