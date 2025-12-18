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

// 1. Type-Check
run('npm run lint', 'Running type-check (tsc)');

// 2. Clean
run('npm run clean', 'Cleaning old build artifacts');

// 3. Version Bump
run('node scripts/bump-version.js', 'Incrementing version');

// 4. Get New Version
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const version = packageJson.version;
const tagName = `v${version}`;

// 5. Build
run('npm run build', 'Building frontend');
run('npm run build:desktop', 'Building desktop installers');

// 6. Git Operations
run('git add .', 'Staging changes');
run(`git commit -m "chore(release): ${tagName}"`, `Committing release ${tagName}`);
run(`git tag ${tagName}`, `Creating tag ${tagName}`);

// 7. Push
run('git push', 'Pushing code to GitHub');
run('git push --tags', 'Pushing tags to GitHub');

console.log(`\n✅ RELEASE ${tagName} PUSHED SUCCESSFULLY!`);
console.log(`🔗 Monitor GitHub Actions at: https://github.com/enayat/TypingPro/actions`);
