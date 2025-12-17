const { execSync } = require('child_process');
const os = require('os');
const fs = require('fs');
const path = require('path');

console.log("🚀 Starting Desktop Build...");

const platform = os.platform();

try {
    if (platform === 'darwin') {
        console.log("🍎 macOS detected. Building Universal Binary (Intel + Apple Silicon)...");

        // 1. Add targets if missing
        try {
            execSync('rustup target add x86_64-apple-darwin aarch64-apple-darwin', { stdio: 'inherit' });
        } catch (e) {
            console.warn("⚠️  Could not add rust targets. Assuming they exist.");
        }

        // 2. Build .app only (DMG removed from tauri.conf to avoid script errors)
        // Note: 'updater' target might still trigger some bundling, but 'app' is key.
        execSync('tauri build --target universal-apple-darwin', { stdio: 'inherit' });

        // 3. Manually Package DMG using hdiutil
        const version = require('../package.json').version;
        const appName = "TypingPro";
        const dmgName = `TypingPro-${version}-universal.dmg`;

        const bundleDir = path.join(__dirname, '../src-tauri/target/universal-apple-darwin/release/bundle/macos');
        const artifactDir = path.join(__dirname, '../src-tauri/target/universal-apple-darwin/release/bundle/dmg'); // Target dir for organization script
        const appPath = path.join(bundleDir, `${appName}.app`);
        const dmgPath = path.join(artifactDir, dmgName);

        console.log(`📦 Packaging DMG manually: ${dmgName}...`);

        // Ensure outcome directory exists
        fs.mkdirSync(artifactDir, { recursive: true });

        // Remove existing DMG if any
        if (fs.existsSync(dmgPath)) {
            fs.unlinkSync(dmgPath);
        }

        // Create DMG
        // -volname: Volume name when mounted
        // -srcfolder: The .app to package
        // -ov: Overwrite existing
        // -format UDZO: Compressed
        execSync(`hdiutil create -volname "${appName}" -srcfolder "${appPath}" -ov -format UDZO "${dmgPath}"`, { stdio: 'inherit' });

        console.log(`✅ DMG Created successfully: ${dmgPath}`);

    } else if (platform === 'win32') {
        console.log("🪟 Windows detected. Building for x64...");
        execSync('tauri build', { stdio: 'inherit' });

    } else if (platform === 'linux') {
        console.log("🐧 Linux detected. Building Deb and AppImage...");
        execSync('tauri build', { stdio: 'inherit' });

    } else {
        console.log(`❓ Unknown platform: ${platform}. Running default build...`);
        execSync('tauri build', { stdio: 'inherit' });
    }

    console.log("✅ Desktop Build Complete.");

} catch (error) {
    console.error("❌ Build Failed:", error.message);
    process.exit(1);
}
