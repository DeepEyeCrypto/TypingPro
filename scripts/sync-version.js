import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const packageJsonPath = resolve(__dirname, '../package.json');
const tauriConfPath = resolve(__dirname, '../src-tauri/tauri.conf.json');
const cargoTomlPath = resolve(__dirname, '../src-tauri/Cargo.toml');

console.log('🔄 STRICT SYNC: Starting version synchronization...');

try {
    // 1. Read Truth (package.json)
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
    const targetVersion = packageJson.version;
    console.log(`📍 Source of Truth (package.json): v${targetVersion}`);

    // 2. Sync Tauri Config
    if (existsSync(tauriConfPath)) {
        const tauriConf = JSON.parse(readFileSync(tauriConfPath, 'utf8'));
        const currentTauriVersion = tauriConf.package.version;

        if (currentTauriVersion !== targetVersion) {
            console.log(`⚠️  Mismatch found in tauri.conf.json (v${currentTauriVersion}). Fixing...`);
            tauriConf.package.version = targetVersion;
            writeFileSync(tauriConfPath, JSON.stringify(tauriConf, null, 2));
            console.log(`✅ Updated tauri.conf.json to v${targetVersion}`);
        } else {
            console.log(`✅ tauri.conf.json is already matched (v${targetVersion})`);
        }
    } else {
        console.error('❌ tauri.conf.json NOT FOUND!');
        process.exit(1);
    }

    // 3. Sync Cargo.toml (Optional but recommended)
    if (existsSync(cargoTomlPath)) {
        let cargoToml = readFileSync(cargoTomlPath, 'utf8');
        const versionRegex = /^version\s*=\s*"[^"]+"/m;
        if (versionRegex.test(cargoToml)) {
            const currentCargoVersion = cargoToml.match(versionRegex)[0].split('"')[1];
            if (currentCargoVersion !== targetVersion) {
                console.log(`⚠️  Mismatch found in Cargo.toml (v${currentCargoVersion}). Fixing...`);
                cargoToml = cargoToml.replace(versionRegex, `version = "${targetVersion}"`);
                writeFileSync(cargoTomlPath, cargoToml);
                console.log(`✅ Updated Cargo.toml to v${targetVersion}`);
            } else {
                console.log(`✅ Cargo.toml is already matched (v${targetVersion})`);
            }
        }
    }

    console.log('✨ Strict Sync Complete. Build can proceed.');

} catch (error) {
    console.error('❌ FATAL ERROR during version sync:', error);
    process.exit(1);
}
