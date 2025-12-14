const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const RELEASE_DIR = path.resolve(__dirname, '../release');
const SRC_TAURI_TARGET = path.resolve(__dirname, '../src-tauri/target');

// Ensure release directory exists
if (fs.existsSync(RELEASE_DIR)) {
    console.log(`Cleaning clean release directory: ${RELEASE_DIR}`);
    fs.rmSync(RELEASE_DIR, { recursive: true, force: true });
}
fs.mkdirSync(RELEASE_DIR);

console.log("Starting Production Build Process...");

const pkg = require('../package.json');
let version = pkg.version;

// 1. Version Bump (Optional)
const args = process.argv.slice(2);
const skipBump = args.includes('--no-bump');

if (!skipBump) {
    console.log("Step 1: Version Bump");
    try {
        execSync('npm run version:bump', { stdio: 'inherit' });
        // Reload package.json to get new version
        delete require.cache[require.resolve('../package.json')];
        version = require('../package.json').version;
    } catch (e) {
        console.error("Version bump failed.");
        process.exit(1);
    }
} else {
    console.log("Skipping version bump...");
}

// 2. Define Targets
const targets = [
    {
        name: 'macOS (Intel)',
        target: 'x86_64-apple-darwin',
        bundleDir: 'bundle/dmg',
        ext: '.dmg',
        renameTo: (v) => `TypingPro-${v}-mac-x64.dmg`
    },
    {
        name: 'macOS (Apple Silicon)',
        target: 'aarch64-apple-darwin',
        bundleDir: 'bundle/dmg',
        ext: '.dmg',
        renameTo: (v) => `TypingPro-${v}-mac-arm64.dmg`
    },
    {
        name: 'Windows',
        target: 'x86_64-pc-windows-msvc',
        bundleDir: 'bundle/nsis',
        ext: '.exe',
        renameTo: (v) => `TypingPro-${v}-win-x64.exe`
    },
    {
        name: 'Linux (Deb)',
        target: 'x86_64-unknown-linux-gnu',
        bundleDir: 'bundle/deb',
        ext: '.deb',
        renameTo: (v) => `typingpro_${v}_amd64.deb`
    },
    {
        name: 'Linux (AppImage)',
        target: 'x86_64-unknown-linux-gnu',
        bundleDir: 'bundle/appimage',
        ext: '.AppImage',
        renameTo: (v) => `TypingPro-${v}-linux-x64.AppImage`
    }
];

// 3. Build & Collect
for (const t of targets) {
    console.log(`\nBuilding for ${t.name} (${t.target})...`);

    // Check if we can build this target on current OS
    const currentPlatform = process.platform;
    if (currentPlatform === 'darwin' && t.name.includes('Windows')) {
        console.warn(`⚠️  Skipping Windows build on macOS. Use CI or a VM.`);
        continue;
    }
    if (currentPlatform === 'darwin' && t.name.includes('Linux')) {
        console.warn(`⚠️  Skipping Linux build on macOS. Use CI or a VM.`);
        continue;
    }

    try {
        // Run Tauri Build
        // Note: For Linux AppImage/Deb, running tauri build ONCE produces BOTH if configured.
        // But we iterate targets here. If we run for linux-gnu, it might produce both.
        // We'll just run the build command once per unique target triple if optimization is needed, 
        // but simple iteration is safer for clarity.

        execSync(`tauri build --target ${t.target}`, { stdio: 'inherit' });

        const bundlePath = path.join(SRC_TAURI_TARGET, t.target, 'release', t.bundleDir);

        if (fs.existsSync(bundlePath)) {
            // Find the generated file (it typically has version number in it)
            const files = fs.readdirSync(bundlePath).filter(f => f.endsWith(t.ext));
            if (files.length > 0) {
                const srcFile = files[0]; // Take the first matching one
                const srcPath = path.join(bundlePath, srcFile);
                const destName = t.renameTo(version);
                const destPath = path.join(RELEASE_DIR, destName);

                console.log(`-> Copied to release/${destName}`);
                fs.copyFileSync(srcPath, destPath);
            }
        } else {
            console.warn(`Warning: Bundle directory not found for ${t.name}`);
        }

    } catch (e) {
        console.error(`Build failed for ${t.name}. Continuing...`);
    }
}

console.log("\n-------------------------------------------");
console.log("Build Process Complete.");
console.log(`Artifacts are in: ${RELEASE_DIR}`);
const artifacts = fs.readdirSync(RELEASE_DIR);
artifacts.forEach(a => console.log(` - ${a}`));
console.log("-------------------------------------------");
