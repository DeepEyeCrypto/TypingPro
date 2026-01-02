const fs = require('fs');
const path = require('path');

const rootPackagePath = path.resolve(__dirname, '../package.json');
const appPackagePath = path.resolve(__dirname, '../apps/desktop/package.json');
const tauriConfigPath = path.resolve(__dirname, '../apps/desktop/src-tauri/tauri.conf.json');

// 1. Read Root Version (Source of Truth)
const rootPackage = JSON.parse(fs.readFileSync(rootPackagePath, 'utf-8'));
const newVersion = rootPackage.version;

console.log(`\n🔄 Syncing version: ${newVersion}...`);

// 2. Update App package.json
if (fs.existsSync(appPackagePath)) {
    const appPackage = JSON.parse(fs.readFileSync(appPackagePath, 'utf-8'));
    appPackage.version = newVersion;
    fs.writeFileSync(appPackagePath, JSON.stringify(appPackage, null, 2) + '\n');
    console.log(`✅ Updated apps/desktop/package.json to ${newVersion}`);
} else {
    console.error(`❌ Could not find ${appPackagePath}`);
}

// 3. Update Tauri Config
if (fs.existsSync(tauriConfigPath)) {
    const tauriConfig = JSON.parse(fs.readFileSync(tauriConfigPath, 'utf-8'));
    tauriConfig.version = newVersion;
    fs.writeFileSync(tauriConfigPath, JSON.stringify(tauriConfig, null, 2)); // Tauri config usually 2 spaces
    console.log(`✅ Updated tauri.conf.json to ${newVersion}`);
} else {
    console.error(`❌ Could not find ${tauriConfigPath}`);
}

console.log(`\n✨ Version sync complete! Ready to build.\n`);
