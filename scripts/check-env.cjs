/**
 * check-env.cjs
 * Hardened build-time validation for TypingPro.
 * Supports --env=development|production
 */

const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const CYAN = "\x1b[36m";

const args = process.argv.slice(2);
const envMode = args.find(arg => arg.startsWith('--env='))?.split('=')[1] || 'development';

const REQUIRED_COMMON = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_APP_ID'
];

const REQUIRED_PROD = [
    ...REQUIRED_COMMON,
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID'
];

const targetVars = envMode === 'production' ? REQUIRED_PROD : REQUIRED_COMMON;

console.log(`\n${CYAN}${BOLD}🚀 [BUILD GUARD] Validating environment for mode: ${envMode.toUpperCase()}...${RESET}`);

let missing = [];

targetVars.forEach(v => {
    const val = process.env[v];
    if (!val || val.trim() === "") {
        missing.push(v);
    }
});

if (missing.length > 0) {
    console.error(`\n${RED}${BOLD}❌ [CRITICAL ERROR] Missing Environment Variables for ${envMode} Build:${RESET}`);
    missing.forEach(v => console.error(`   ${RED}- ${v}${RESET}`));
    console.error(`\n${BOLD}💡 Hint:${RESET} Ensure these are set as Secrets in GitHub Actions or in your local ${CYAN}.env.local${RESET} file.`);
    process.exit(1);
} else {
    console.log(`${GREEN}${BOLD}✅ All critical environment variables are present for ${envMode.toUpperCase()}.${RESET}\n`);
}
