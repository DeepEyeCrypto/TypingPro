import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageJsonPath = path.resolve(__dirname, '../package.json');
const tauriConfPath = path.resolve(__dirname, '../src-tauri/tauri.conf.json');
const cargoTomlPath = path.resolve(__dirname, '../src-tauri/Cargo.toml');

console.log('📈 STARTING AUTO-INCREMENT...');

try {
    // 1. Read and Bump package.json
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const oldVersion = packageJson.version;
    const parts = oldVersion.split('.').map(Number);
    parts[2] += 1; // Increment Patch
    const newVersion = parts.join('.');

    packageJson.version = newVersion;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log(`✅ package.json: ${oldVersion} -> ${newVersion}`);

    // 2. Sync tauri.conf.json
    if (fs.existsSync(tauriConfPath)) {
        const tauriConf = JSON.parse(fs.readFileSync(tauriConfPath, 'utf8'));
        tauriConf.package.version = newVersion;
        fs.writeFileSync(tauriConfPath, JSON.stringify(tauriConf, null, 2));
        console.log(`✅ tauri.conf.json synced to ${newVersion}`);
    }

    // 3. Sync Cargo.toml
    if (fs.existsSync(cargoTomlPath)) {
        let cargoToml = fs.readFileSync(cargoTomlPath, 'utf8');
        const versionRegex = /^version\s*=\s*"[^"]+"/m;
        if (versionRegex.test(cargoToml)) {
            cargoToml = cargoToml.replace(versionRegex, `version = "${newVersion}"`);
            fs.writeFileSync(cargoTomlPath, cargoToml);
            console.log(`✅ Cargo.toml synced to ${newVersion}`);
        }
    }

} catch (error) {
    console.error("❌ Version bump failed:", error);
    process.exit(1);
}
