import { test, expect } from '@testsprite/core';

/**
 * Glass UI Components E2E Tests
 * Tests theme switching and visual consistency
 */

test.describe('Theme Switching', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:1420/settings');
    });

    test('should display all available themes', async ({ page }) => {
        await page.click('[data-testid="theme-selector"]');

        // Should show theme options
        const themeOptions = page.locator('[data-testid="theme-option"]');
        const count = await themeOptions.count();

        // Should have multiple themes available
        expect(count).toBeGreaterThan(1);
    });

    test('should switch to different theme and persist', async ({ page }) => {
        // Get current theme
        const currentTheme = await page.getAttribute('[data-testid="app-root"]', 'data-theme');

        // Open theme selector
        await page.click('[data-testid="theme-selector"]');

        // Select different theme
        const themeOptions = page.locator('[data-testid="theme-option"]');
        const newTheme = await themeOptions.first().textContent();

        if (newTheme !== currentTheme) {
            await themeOptions.first().click();

            // Wait for theme to apply
            await page.waitForTimeout(500);

            // Verify theme changed
            const updatedTheme = await page.getAttribute('[data-testid="app-root"]', 'data-theme');
            expect(updatedTheme).toBe(newTheme);

            // Reload page and verify persistence
            await page.reload();
            const persistedTheme = await page.getAttribute('[data-testid="app-root"]', 'data-theme');
            expect(persistedTheme).toBe(newTheme);
        }
    });

    test('should update all glass components when theme changes', async ({ page }) => {
        await page.goto('http://localhost:1420/dashboard');

        // Get initial glass card style
        const initialStyle = await page.locator('[data-testid="glass-card"]').first().evaluate(
            el => window.getComputedStyle(el).backgroundColor
        );

        // Change theme
        await page.click('[data-testid="settings-button"]');
        await page.click('[data-testid="theme-selector"]');
        await page.locator('[data-testid="theme-option"]').nth(1).click();

        // Return to dashboard
        await page.click('[data-testid="nav-dashboard"]');

        // Glass card style should have changed
        const updatedStyle = await page.locator('[data-testid="glass-card"]').first().evaluate(
            el => window.getComputedStyle(el).backgroundColor
        );

        expect(updatedStyle).not.toBe(initialStyle);
    });
});

test.describe('Glass Effects Rendering', () => {
    test('should render glass blur effects correctly', async ({ page }) => {
        await page.goto('http://localhost:1420/dashboard');

        // Check glass components have backdrop-filter
        const glassCard = page.locator('[data-testid="glass-card"]').first();
        const backdropFilter = await glassCard.evaluate(
            el => window.getComputedStyle(el).backdropFilter || window.getComputedStyle(el).webkitBackdropFilter
        );

        // Should have blur effect
        expect(backdropFilter).toContain('blur');
    });

    test('should show wallpaper behind glass elements', async ({ page }) => {
        await page.goto('http://localhost:1420/dashboard');

        // Background should be visible
        const backgroundImage = await page.evaluate(() => {
            const body = document.body;
            return window.getComputedStyle(body).backgroundImage;
        });

        expect(backgroundImage).not.toBe('none');
    });

    test('should maintain glass effect opacity', async ({ page }) => {
        await page.goto('http://localhost:1420/dashboard');

        const glassCard = page.locator('[data-testid="glass-card"]').first();
        const opacity = await glassCard.evaluate(
            el => {
                const bg = window.getComputedStyle(el).backgroundColor;
                // Extract alpha value from rgba
                const match = bg.match(/rgba?\([\d\s,]+,\s*([\d.]+)\)/);
                return match ? parseFloat(match[1]) : 1;
            }
        );

        // Glass should be semi-transparent
        expect(opacity).toBeLessThan(1);
        expect(opacity).toBeGreaterThan(0);
    });
});

test.describe('Responsive UI', () => {
    test('should adapt layout for different screen sizes', async ({ page }) => {
        // Desktop view
        await page.setViewportSize({ width: 1920, height: 1080 });
        await page.goto('http://localhost:1420/dashboard');

        const sidebarDesktop = await page.locator('[data-testid="sidebar"]').isVisible();
        expect(sidebarDesktop).toBe(true);

        // Mobile view
        await page.setViewportSize({ width: 375, height: 667 });
        await page.waitForTimeout(500);

        // Sidebar might be hidden or collapsed
        const sidebarMobile = await page.locator('[data-testid="sidebar"]').isVisible().catch(() => false);
        // Mobile menu button should be visible
        const mobileMenu = await page.locator('[data-testid="mobile-menu-button"]').isVisible();

        expect(mobileMenu || !sidebarMobile).toBe(true);
    });
});

test.describe('Navigation', () => {
    test('should navigate between pages using sidebar', async ({ page }) => {
        await page.goto('http://localhost:1420/dashboard');

        // Click Dashboard
        await page.click('[data-testid="nav-dashboard"]');
        await expect(page).toHaveURL(/.*dashboard/);

        // Click Typing Test
        await page.click('[data-testid="nav-typing-test"]');
        await expect(page).toHaveURL(/.*typing-test/);

        // Click Certification
        await page.click('[data-testid="nav-certification"]');
        await expect(page).toHaveURL(/.*certification/);

        // Click Leaderboard
        await page.click('[data-testid="nav-leaderboard"]');
        await expect(page).toHaveURL(/.*leaderboard/);
    });

    test('should highlight active nav item', async ({ page }) => {
        await page.goto('http://localhost:1420/dashboard');

        // Dashboard nav should be active
        const dashboardNav = page.locator('[data-testid="nav-dashboard"]');
        await expect(dashboardNav).toHaveClass(/active|selected/i);

        // Navigate to typing test
        await page.click('[data-testid="nav-typing-test"]');

        // Typing test nav should now be active
        const typingNav = page.locator('[data-testid="nav-typing-test"]');
        await expect(typingNav).toHaveClass(/active|selected/i);

        // Dashboard should no longer be active
        await expect(dashboardNav).not.toHaveClass(/active|selected/i);
    });
});

test.describe('Animations', () => {
    test('should have smooth page transitions', async ({ page }) => {
        await page.goto('http://localhost:1420/dashboard');

        // Navigate to different page
        await page.click('[data-testid="nav-typing-test"]');

        // Page should transition smoothly without white flash
        await page.waitForTimeout(500);

        // New page should be visible
        await expect(page.locator('[data-testid="typing-test-page"]')).toBeVisible();
    });

    test('should animate modal overlays', async ({ page }) => {
        await page.goto('http://localhost:1420/dashboard');

        // Open a modal (e.g., settings)
        await page.click('[data-testid="open-modal-button"]');

        // Modal should fade in
        const modal = page.locator('[data-testid="modal"]');
        await expect(modal).toBeVisible();

        // Should have animation class
        await expect(modal).toHaveClass(/fade|slide|animate/i);
    });
});
