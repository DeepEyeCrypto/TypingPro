/**
 * check-env.cjs
 * Hardened build-time validation for critical environment variables.
 * Usage: node scripts/check-env.cjs
 */

const fs = require('fs');
const path = require('path');

const REQUIRED_VARS = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_APP_ID'
];

console.log("\n🚀 [BUILD GUARD] Validating environment variables...");

let missing = [];

const isCI = !!process.env.GITHUB_ACTIONS;

REQUIRED_VARS.forEach(v => {
    const val = process.env[v];
    if (!val || val.trim() === "") {
        missing.push(v);
    }
});

if (missing.length > 0) {
    console.error("\n❌ [CRITICAL ERROR] Missing Environment Variables for Production Build:");
    missing.forEach(v => console.error(`   - ${v}`));
    console.error("\n💡 Hint: Ensure these are set as Secrets in GitHub Actions or in your local .env file.");
    process.exit(1);
} else {
    console.log("✅ All critical environment variables are present.\n");
}
