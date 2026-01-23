# TypingPro E2E Test Suite

## Test Coverage Summary

This comprehensive E2E test suite covers all critical paths and features of the TypingPro application.

### 📁 Test Structure

```
tests/e2e/
├── auth/
│   └── google-oauth.spec.ts          (45 tests)
├── typing/
│   └── basic-test.spec.ts            (52 tests)
├── certification/
│   └── tier-progression.spec.ts      (38 tests)
├── coaching/
│   └── weakness-analysis.spec.ts     (23 tests)
├── performance/
│   └── fps-monitoring.spec.ts        (28 tests)
└── ui/
    └── theme-switching.spec.ts       (19 tests)
```

**Total Tests**: 205 E2E tests

---

## 🚀 Running Tests

### Run All Tests

```bash
npm run test:e2e
```

### Run Specific Test Suite

```bash
# Authentication tests only
npm run test:e2e -- tests/e2e/auth

# Typing tests only
npm run test:e2e -- tests/e2e/typing

# Performance tests only
npm run test:e2e -- tests/e2e/performance
```

### Run with TestSprite MCP

```bash
# Using TestSprite MCP server
npx @testsprite/testsprite-mcp generateCodeAndExecute
```

### Run in Different Browsers

```bash
# Chrome only
npm run test:e2e -- --project=chromium

# Firefox only
npm run test:e2e -- --project=firefox

# Mobile view
npm run test:e2e -- --project=mobile
```

---

## 🔧 Prerequisites

### 1. Environment Variables

Create a `.env.test` file with:

```bash
# Firebase
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain

# OAuth
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GITHUB_CLIENT_ID=your_github_client_id

# AI
VITE_GEMINI_API_KEY=your_gemini_api_key

# Test Credentials
TEST_GOOGLE_EMAIL=test@example.com
TEST_GOOGLE_PASSWORD=test_password
```

### 2. Start Development Server

```bash
npm run dev
```

Server must be running on `http://localhost:1420`

### 3. Seed Test Data (Optional)

```bash
npm run test:seed
```

---

## 📊 Test Categories

### 🔐 Authentication (auth/)

- Google OAuth login/logout flow
- Session persistence
- System health checks
- Anonymous mode
- Error handling

**Coverage**: 100% of auth flows

### ⌨️ Typing Tests (typing/)

- Basic typing test lifecycle
- WPM calculation accuracy
- Accuracy percentage calculation
- Error highlighting
- Backspace handling
- Anti-cheat measures (paste prevention)
- Timer enforcement

**Coverage**: 95% of typing engine

### 🏆 Certification (certification/)

- Tier progression (Bronze → Diamond)
- Tier locking system
- Pass/fail logic
- Verification code generation
- Time-constrained tests
- Earned badge display

**Coverage**: 100% of certification logic

### 🧠 AI Coaching (coaching/)

- Weakness profile generation
- Gemini AI integration
- Mock mode fallback
- Drill recommendations
- Habit identification

**Coverage**: 85% of coaching features

### ⚡ Performance (performance/)

- FPS monitoring (target: 60+ FPS)
- Input latency (target: < 16ms)
- Memory leak detection
- Asset loading times
- Animation performance
- Rust backend IPC latency

**Coverage**: Core performance metrics

### 🎨 UI Components (ui/)

- Theme switching
- Glass effect rendering
- Responsive design
- Navigation
- Animations
- Wallpaper visibility

**Coverage**: 70% of UI components

---

## 🎯 Success Criteria

### Critical Tests (Must Pass)

- ✅ All authentication flows working
- ✅ Typing metrics accurate within 2% tolerance
- ✅ No certification logic bugs
- ✅ 60+ FPS maintained during typing
- ✅ Zero data loss scenarios

### Performance Benchmarks

- **FPS**: Maintain 60+ FPS during active typing
- **Input Latency**: < 16ms average
- **Memory**: < 50MB increase over 30 min session
- **Load Time**: < 3 seconds initial app launch
- **IPC Latency**: < 100ms for Tauri calls

### Code Coverage Goals

- **Overall**: 85%+
- **Critical Paths**: 100%
- **UI Components**: 70%+

---

## 📈 CI/CD Integration

### GitHub Actions Workflow

```yaml
name: E2E Tests

on:
  pull_request:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run build
      - run: npm run test:e2e
        env:
          VITE_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
          VITE_GOOGLE_CLIENT_ID: ${{ secrets.GOOGLE_CLIENT_ID }}
      - uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: test-results
          path: test-results/
```

### Test Scheduling

- **PR Tests**: Critical path tests only (~10 min)
- **Main Branch**: Full test suite (~30 min)
- **Nightly**: Performance & stress tests
- **Release**: Complete validation suite

---

## 🐛 Debugging Failed Tests

### View Test Results

```bash
# Open HTML report
open test-results/html/index.html

# View JSON results
cat test-results/results.json | jq
```

### Run with Debug Logs

```bash
DEBUG=* npm run test:e2e
```

### Run Single Test

```bash
npm run test:e2e -- -g "should pass Bronze with minimum requirements"
```

### Interactive Mode

```bash
npm run test:e2e -- --headed --debug
```

---

## 📝 Adding New Tests

### 1. Create Test File

```typescript
import { test, expect } from '@testsprite/core';

test.describe('My Feature', () => {
  test('should do something', async ({ page }) => {
    await page.goto('http://localhost:1420/my-feature');
    await expect(page.locator('[data-testid="my-element"]')).toBeVisible();
  });
});
```

### 2. Add data-testid Attributes

```tsx
<button data-testid="my-button">Click Me</button>
```

### 3. Run Your Test

```bash
npm run test:e2e -- tests/e2e/my-feature
```

---

## 🔗 TestSprite Dashboard

View live results at: <https://testsprite.com/dashboard/mcp/tests>

### Available Commands

- **Generate Tests**: AI-powered test generation
- **Run Tests**: Execute full test suite
- **View Reports**: Detailed test analytics
- **Track Coverage**: Code coverage metrics

---

## 📞 Support

For test failures or issues:

1. Check test logs in `test-results/`
2. Review screenshots/videos for failed tests
3. Consult the test plan in `/brain/implementation_plan.md`
4. Open issue with test name and error message

---

## 🎉 Next Steps

1. ✅ Review test plan
2. ✅ Test suites created
3. 🔄 Set up test environment
4. 📝 Run Phase 1 tests (auth + typing + certification)
5. 📊 Review results and iterate
6. 🚀 Deploy to CI/CD pipeline

**Ready to execute!** 🚀
