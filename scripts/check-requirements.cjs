const { execSync } = require('child_process');
const os = require('os');

console.log("🔍 Checking build prerequisites...");

function checkCommand(command, errorMsg) {
    try {
        execSync(command, { stdio: 'ignore' });
        return true;
    } catch (e) {
        if (errorMsg) console.error(`❌ ${errorMsg}`);
        return false;
    }
}

let hasErrors = false;

// 1. Check Node.js & NPM
if (!checkCommand('node --version', 'Node.js is missing')) hasErrors = true;
if (!checkCommand('npm --version', 'NPM is missing')) hasErrors = true;

// 2. Check Rust Toolchain
if (!checkCommand('cargo --version', 'Rust/Cargo is missing. Install via https://rustup.rs')) hasErrors = true;

// 3. Platform Specific Checks
const platform = os.platform();

if (platform === 'darwin') {
    // macOS Requirements
    console.log("Creating prerequisites for macOS Universal build...");

    // Check for universal targets
    try {
        const targets = execSync('rustup target list --installed').toString();
        if (!targets.includes('aarch64-apple-darwin') || !targets.includes('x86_64-apple-darwin')) {
            console.error("❌ Missing macOS targets for Universal build.");
            console.log("   Run: rustup target add aarch64-apple-darwin x86_64-apple-darwin");
            hasErrors = true;
        }
    } catch (e) {
        console.error("❌ Failed to check rustup targets.");
        hasErrors = true;
    }

} else if (platform === 'win32') {
    // Windows Requirements
    // (Simplified check, assuming NSIS is handled by Tauri/system)
    try {
        const targets = execSync('rustup target list --installed').toString();
        if (!targets.includes('x86_64-pc-windows-msvc')) {
            console.error("❌ Missing Windows target.");
            console.log("   Run: rustup target add x86_64-pc-windows-msvc");
            hasErrors = true;
        }
    } catch (e) {
        // Ignored
    }
} else if (platform === 'linux') {
    // Linux Requirements
    if (!checkCommand('dpkg --version', 'dpkg is missing (needed for .deb)')) {
        console.warn("⚠️  dpkg not found, .deb build might fail.");
    }
}

if (hasErrors) {
    console.error("\n💥 Prerequisites check FAILED. Please fix the above errors.");
    process.exit(1);
} else {
    console.log("✅ All requirements met.");
}
