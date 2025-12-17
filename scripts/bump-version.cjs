const fs = require('fs');
const path = require('path');

const packageJsonPath = path.resolve(__dirname, '../package.json');
const tauriConfPath = path.resolve(__dirname, '../src-tauri/tauri.conf.json');
const cargoTomlPath = path.resolve(__dirname, '../src-tauri/Cargo.toml');

const args = process.argv.slice(2);
const shouldBump = !args.includes('check') && !args.includes('sync-only');

function getPackageVersion() {
    return JSON.parse(fs.readFileSync(packageJsonPath, 'utf8')).version;
}

function bumpPackageVersion() {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const currentVersion = packageJson.version;
    const [major, minor, patch] = currentVersion.split('.').map(Number);
    const newVersion = `${major}.${minor}.${patch + 1}`;

    console.log(`📈 Bumping package.json: ${currentVersion} -> ${newVersion}`);
    packageJson.version = newVersion;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
    return newVersion;
}

function syncVersion(version) {
    // 1. Sync Tauri Config
    if (fs.existsSync(tauriConfPath)) {
        const tauriConf = JSON.parse(fs.readFileSync(tauriConfPath, 'utf8'));
        if (tauriConf.package.version !== version) {
            console.log(`🔄 Syncing tauri.conf.json to ${version}...`);
            tauriConf.package.version = version;
            fs.writeFileSync(tauriConfPath, JSON.stringify(tauriConf, null, 2));
        } else {
            console.log(`✅ tauri.conf.json is up to date (${version})`);
        }
    }

    // 2. Sync Cargo.toml
    if (fs.existsSync(cargoTomlPath)) {
        let cargoToml = fs.readFileSync(cargoTomlPath, 'utf8');
        const versionRegex = /^version\s*=\s*"[^"]+"/m;
        if (versionRegex.test(cargoToml)) {
            const currentCargoVersion = cargoToml.match(versionRegex)[0].split('"')[1];
            if (currentCargoVersion !== version) {
                console.log(`🔄 Syncing Cargo.toml to ${version}...`);
                cargoToml = cargoToml.replace(versionRegex, `version = "${version}"`);
                fs.writeFileSync(cargoTomlPath, cargoToml);
            } else {
                console.log(`✅ Cargo.toml is up to date (${version})`);
            }
        }
    }
}

// Main execution
try {
    let version;
    if (shouldBump) {
        version = bumpPackageVersion();
    } else {
        version = getPackageVersion();
        console.log(`🔍 Checking/Syncing version: ${version}`);
    }

    syncVersion(version);
    console.log("✨ Version sync complete.");

} catch (e) {
    console.error("❌ Version sync failed:", e);
    process.exit(1);
}
