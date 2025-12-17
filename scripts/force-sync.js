import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageJsonPath = path.resolve(__dirname, '../package.json');
const tauriConfPath = path.resolve(__dirname, '../src-tauri/tauri.conf.json');

console.log('🔄 STRICT SYNC: Starting version synchronization...');

try {
    // 1. Read package.json version
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const targetVersion = packageJson.version;

    // 2. Read tauri.conf.json
    let tauriConf = JSON.parse(fs.readFileSync(tauriConfPath, 'utf8'));
    const oldVersion = tauriConf.package.version;

    // 3. Overwrite version
    console.log(`OLD Version: ${oldVersion}`);
    tauriConf.package.version = targetVersion;

    // 4. Write back to disk
    fs.writeFileSync(tauriConfPath, JSON.stringify(tauriConf, null, 2));

    console.log(`✅ Updated tauri.conf.json from ${oldVersion} to ${targetVersion}`);

} catch (error) {
    console.error("❌ Force sync failed:", error);
    process.exit(1);
}
