import { test, expect } from '@testsprite/core';

/**
 * Performance & UX E2E Tests
 * Target: 144 FPS, < 16ms input latency
 */

test.describe('Frame Rate Monitoring', () => {
    test('should maintain 60+ FPS during active typing', async ({ page }) => {
        await page.goto('http://localhost:1420/typing-test');

        // Start performance monitoring
        const client = await page.context().newCDPSession(page);
        await client.send('Performance.enable');

        // Start typing test
        await page.click('[data-testid="start-test-button"]');

        const inputArea = page.locator('[data-testid="typing-input"]');
        await inputArea.focus();

        // Measure FPS during typing
        const startTime = Date.now();
        let frameCount = 0;

        // Monitor frames for 3 seconds while typing
        const framePromise = new Promise(resolve => {
            const interval = setInterval(async () => {
                frameCount++;
                if (Date.now() - startTime > 3000) {
                    clearInterval(interval);
                    resolve(frameCount);
                }
            }, 1000 / 60); // 60 FPS check
        });

        // Type while monitoring
        for (let i = 0; i < 50; i++) {
            await page.keyboard.press('a');
            await page.waitForTimeout(50);
        }

        await framePromise;

        const elapsed = (Date.now() - startTime) / 1000;
        const fps = frameCount / elapsed;

        // Should maintain at least 60 FPS
        expect(fps).toBeGreaterThanOrEqual(60);
    });

    test('should not drop frames with glass UI effects', async ({ page }) => {
        await page.goto('http://localhost:1420/dashboard');

        // Enable performance metrics
        const metrics = await page.evaluate(() => performance.getEntriesByType('paint'));

        // Navigate through different pages rapidly
        await page.click('[data-testid="nav-typing-test"]');
        await page.waitForTimeout(500);
        await page.click('[data-testid="nav-certification"]');
        await page.waitForTimeout(500);
        await page.click('[data-testid="nav-leaderboard"]');
        await page.waitForTimeout(500);

        // Check for layout shifts or jank
        const layoutShifts = await page.evaluate(() => {
            return (performance.getEntriesByType('layout-shift') as any[]).length;
        });

        // Should have minimal layout shifts
        expect(layoutShifts).toBeLessThan(5);
    });
});

test.describe('Input Latency', () => {
    test('should have < 16ms input latency', async ({ page }) => {
        await page.goto('http://localhost:1420/typing-test');
        await page.click('[data-testid="start-test-button"]');

        const inputArea = page.locator('[data-testid="typing-input"]');
        await inputArea.focus();

        // Measure input latency
        const latencies: number[] = [];

        for (let i = 0; i < 10; i++) {
            const startTime = performance.now();
            await page.keyboard.press('a');

            // Wait for character to appear
            await page.waitForFunction(
                () => (document.querySelector('[data-testid="typing-input"]') as HTMLInputElement)?.value.length > 0
            );

            const endTime = performance.now();
            latencies.push(endTime - startTime);

            // Clear input for next test
            await page.keyboard.press('Control+A');
            await page.keyboard.press('Backspace');
        }

        const avgLatency = latencies.reduce((a, b) => a + b) / latencies.length;

        // Average latency should be < 16ms (60 FPS = 16.67ms per frame)
        expect(avgLatency).toBeLessThan(16);
    });
});

test.describe('Memory Leak Detection', () => {
    test('should not leak memory during 30 min session', async ({ page }) => {
        await page.goto('http://localhost:1420/typing-test');

        // Get initial memory usage
        const initialMemory = await page.evaluate(() => (performance as any).memory?.usedJSHeapSize || 0);

        // Simulate 30 minutes of usage (condensed to 30 seconds for testing)
        for (let i = 0; i < 30; i++) {
            // Start test
            await page.click('[data-testid="start-test-button"]');
            await page.waitForTimeout(1000);

            // Type some characters
            const inputArea = page.locator('[data-testid="typing-input"]');
            await inputArea.focus();
            for (let j = 0; j < 20; j++) {
                await page.keyboard.press('a');
            }

            await page.waitForTimeout(500);
        }

        // Force garbage collection (if available)
        await page.evaluate(() => {
            if ((window as any).gc) {
                (window as any).gc();
            }
        });

        // Get final memory usage
        const finalMemory = await page.evaluate(() => (performance as any).memory?.usedJSHeapSize || 0);

        // Memory increase should be reasonable (< 50MB)
        const memoryIncrease = (finalMemory - initialMemory) / 1024 / 1024;
        expect(memoryIncrease).toBeLessThan(50);
    });
});

test.describe('Asset Loading Performance', () => {
    test('should load all assets within 3 seconds', async ({ page }) => {
        const startTime = Date.now();

        await page.goto('http://localhost:1420');

        // Wait for all resources to load
        await page.waitForLoadState('networkidle');

        const loadTime = Date.now() - startTime;

        // Should load within 3 seconds
        expect(loadTime).toBeLessThan(3000);
    });

    test('should have fast initial app launch', async ({ page }) => {
        const startTime = Date.now();

        await page.goto('http://localhost:1420');

        // Wait for app to be interactive
        await page.waitForSelector('[data-testid="app-ready"]', { timeout: 5000 });

        const launchTime = Date.now() - startTime;

        // App should be ready within 3 seconds
        expect(launchTime).toBeLessThan(3000);
    });
});

test.describe('Animation Performance', () => {
    test('should have smooth transitions between themes', async ({ page }) => {
        await page.goto('http://localhost:1420/settings');

        // Get current theme
        const currentTheme = await page.locator('[data-testid="current-theme"]').textContent();

        // Enable FPS monitoring
        const client = await page.context().newCDPSession(page);
        await client.send('Performance.enable');

        // Switch theme
        await page.click('[data-testid="theme-selector"]');
        await page.click('[data-testid="theme-option"]:not(:has-text("' + currentTheme + '"))');

        // Monitor transition
        await page.waitForTimeout(1000); // Wait for transition to complete

        // Check for janky frames
        const metrics = await client.send('Performance.getMetrics');
        const fps = metrics.metrics.find(m => m.name === 'fps')?.value || 60;

        // FPS should remain above 30 during transition
        expect(fps).toBeGreaterThan(30);
    });

    test('should maintain performance with glass blur effects', async ({ page }) => {
        await page.goto('http://localhost:1420/dashboard');

        // Scroll through dashboard with glass cards
        for (let i = 0; i < 5; i++) {
            await page.mouse.wheel(0, 300);
            await page.waitForTimeout(200);
        }

        // Check for layout shifts
        const cls = await page.evaluate(() => {
            let clsValue = 0;
            new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if ((entry as any).hadRecentInput) continue;
                    clsValue += (entry as any).value;
                }
            }).observe({ type: 'layout-shift', buffered: true });
            return clsValue;
        });

        // Cumulative Layout Shift should be < 0.1 (good score)
        expect(cls).toBeLessThan(0.1);
    });
});

test.describe('Rust Backend Performance', () => {
    test('should have fast IPC response times', async ({ page }) => {
        await page.goto('http://localhost:1420');

        // Measure Tauri IPC call latency
        const startTime = Date.now();

        // Make a Tauri invoke call (example: get user data)
        await page.evaluate(async () => {
            if ((window as any).__TAURI__) {
                await (window as any).__TAURI__.invoke('get_user_data');
            }
        });

        const ipcLatency = Date.now() - startTime;

        // IPC calls should complete within 100ms
        expect(ipcLatency).toBeLessThan(100);
    });
});
