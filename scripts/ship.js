import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageJsonPath = path.resolve(__dirname, '../package.json');
const tauriConfPath = path.resolve(__dirname, '../src-tauri/tauri.conf.json');
const cargoTomlPath = path.resolve(__dirname, '../src-tauri/Cargo.toml');

function run(command, msg) {
    console.log(`\n🚀 ${msg}...`);
    try {
        execSync(command, { stdio: 'inherit' });
    } catch (error) {
        console.error(`\n❌ Error during: ${msg}`);
        process.exit(1);
    }
}

// 1. Sync & Bump Version
console.log('\n📈 VERSION SYNC & BUMP...');
try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const oldVersion = packageJson.version;
    const parts = oldVersion.split('.').map(Number);
    parts[2] += 1; // Increment Patch
    const newVersion = parts.join('.');

    packageJson.version = newVersion;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
} catch (e) {
    console.error('❌ Version sync failed:', e);
    process.exit(1);
}

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const tagName = `v${packageJson.version}`;

// 2. Clean Build
run('npm run clean', 'Cleaning old artifacts');

// 3. Lint Check
run('npm run lint', 'Checking code stability (tsc)');

// 4. Local Build Check (Fast)
run('npm run build', 'Verifying Frontend build');

// 5. Git Operations
run('git add .', 'Staging clean slate');
run(`git commit -m "chore(release): ${tagName} - project rewrite"`, `Committing ${tagName}`);
run(`git tag ${tagName}`, `Tagging ${tagName}`);

// 6. Push & Release
console.log('\n📡 TRIGGERING SHIPMENT...');
run('git push origin main', 'Pushing code');
run('git push origin --tags', 'Pushing tags');

// 7. Organize Local artifacts (Optional helper)
run('npm run organize', 'Organizing local artifacts into /release');

console.log(`\n✅ PROJECT REWRITE SHIPPED: ${tagName}`);
console.log(`🔗 Monitor builds here: https://github.com/DeepEyeCrypto/TypingPro/actions`);
