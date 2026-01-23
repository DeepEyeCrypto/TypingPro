const fs = require('fs');
const path = require('path');

// Required environment variables
const REQUIRED_VARS = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID',
    'VITE_GOOGLE_CLIENT_ID',
    'VITE_GITHUB_CLIENT_ID',
];

const OPTIONAL_VARS = [
    'VITE_FIREBASE_MEASUREMENT_ID',
    'VITE_API_URL',
    'GEMINI_API_KEY',
];

// Check multiple possible .env locations
const possibleEnvPaths = [
    path.join(__dirname, '../.env'),
    path.join(__dirname, '../apps/desktop/.env'),
];

function loadEnvFile(filePath) {
    if (!fs.existsSync(filePath)) {
        return {};
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const vars = {};

    content.split('\n').forEach(line => {
        line = line.trim();
        if (line && !line.startsWith('#')) {
            const [key, ...valueParts] = line.split('=');
            if (key) {
                vars[key.trim()] = valueParts.join('=').trim();
            }
        }
    });

    return vars;
}

// Load all .env files and merge
let allEnvVars = {};
possibleEnvPaths.forEach(envPath => {
    const vars = loadEnvFile(envPath);
    allEnvVars = { ...allEnvVars, ...vars };
});

console.log('\n🔍 Validating environment variables...\n');

const missing = [];
const present = [];

REQUIRED_VARS.forEach(varName => {
    if (allEnvVars[varName] && allEnvVars[varName].length > 0) {
        console.log(`✅ ${varName}`);
        present.push(varName);
    } else {
        console.log(`❌ Missing required environment variable: ${varName}`);
        missing.push(varName);
    }
});

console.log('\n📋 Optional variables:');
OPTIONAL_VARS.forEach(varName => {
    if (allEnvVars[varName] && allEnvVars[varName].length > 0) {
        console.log(`✅ ${varName}`);
    } else {
        console.log(`⚠️  ${varName} (not set)`);
    }
});

console.log(`\n📊 Summary: ${present.length}/${REQUIRED_VARS.length} required variables present\n`);

if (missing.length > 0) {
    console.log('❌ Build failed: Missing required environment variables\n');
    console.log('💡 Fix: Add the following to your .env file:\n');
    missing.forEach(varName => {
        console.log(`   ${varName}=<your-value>`);
    });
    console.log('\n📖 See .env.example for reference\n');
    process.exit(1);
} else {
    console.log('✅ All required environment variables are set\n');
    process.exit(0);
}
