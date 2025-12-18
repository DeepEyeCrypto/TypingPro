import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageJsonPath = path.resolve(__dirname, '../package.json');

function run(command, msg) {
    console.log(`\n🚀 ${msg}...`);
    try {
        execSync(command, { stdio: 'inherit' });
    } catch (error) {
        console.error(`\n❌ Error during: ${msg}`);
        process.exit(1);
    }
}

// 1. Check Code
run('npm run lint', 'Running type-check (tsc)');

// 2. Bump Version
run('node scripts/bump-version.js', 'Incrementing version');

// 3. Get New Version
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const version = packageJson.version;
const tagName = `v${version}`;

// 4. Local Build (Fast - current machine only)
console.log('\n📦 Building local installers for verification...');
run('npm run build', 'Building Vite frontend');
run('npm run tauri build', 'Generating standard installers');

// 5. Git Operations
run('git add .', 'Staging changes');
run(`git commit -m "chore(release): ${tagName}"`, `Committing release ${tagName}`);
run(`git tag ${tagName}`, `Creating tag ${tagName}`);

// 6. Push
console.log('\n📡 Pushing to GitHub...');
run('git push origin main', 'Pushing code');
run('git push origin --tags', 'Pushing tags');

console.log(`\n✅ SHIPMENT COMPLETE: ${tagName}`);
console.log(`🔗 CI/CD will build other architectures: https://github.com/DeepEyeCrypto/TypingPro/actions`);
