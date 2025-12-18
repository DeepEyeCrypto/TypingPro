const { execSync } = require('child_process');
const os = require('os');

const platform = os.platform();
// Capture all arguments passed after --
const args = process.argv.slice(2).join(' ');

console.log(`🚀 Starting Desktop Build for ${platform}...`);
if (args) console.log(`📋 Additional arguments: ${args}`);

try {
    // Just run tauri build with passed arguments. 
    // Tauri will handle DMG/NSIS/DEB creation based on tauri.conf.json
    console.log(`📦 Running Tauri build...`);
    execSync(`npx tauri build ${args}`, { stdio: 'inherit' });

    console.log("✅ Desktop Build Complete.");

} catch (error) {
    console.error("❌ Build Failed:", error.message);
    process.exit(1);
}
