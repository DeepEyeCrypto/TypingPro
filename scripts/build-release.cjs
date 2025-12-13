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

// 1. Version Bump
console.log("Step 1: Version Bump");
try {
    execSync('npm run version:bump', { stdio: 'inherit' });
} catch (e) {
    console.error("Version bump failed.");
    process.exit(1);
}

// 2. Define Targets
// Note: This relies on the host having cross-compilation toolchains installed.
const targets = [
    { name: 'macOS (Intel)', target: 'x86_64-apple-darwin', bundleDir: 'bundle/dmg', ext: '.dmg' },
    { name: 'macOS (Apple Silicon)', target: 'aarch64-apple-darwin', bundleDir: 'bundle/dmg', ext: '.dmg' },
    { name: 'Windows', target: 'x86_64-pc-windows-msvc', bundleDir: 'bundle/nsis', ext: '.exe' },
    { name: 'Linux', target: 'x86_64-unknown-linux-gnu', bundleDir: 'bundle/deb', ext: '.deb' },
    // Add AppImage for Linux as well
    { name: 'Linux (AppImage)', target: 'x86_64-unknown-linux-gnu', bundleDir: 'bundle/appimage', ext: '.AppImage' }
];

// 3. Build & Collect
for (const t of targets) {
    console.log(`\nBuilding for ${t.name} (${t.target})...`);
    try {
        // Run Tauri Build (Release mode by default)
        // SKIP BUMPING version here since we did it once at start
        execSync(`tauri build --target ${t.target}`, { stdio: 'inherit' });

        // Find Artifact
        // Path: src-tauri/target/<target>/release/bundle/<type>/<filename>
        // Exception: Universal-apple-darwin might be different, but we are doing explicit targets.
        // For 'macOS', tauri might output to `target/release/` if no target specified, but with --target it goes to specific folder.

        const bundlePath = path.join(SRC_TAURI_TARGET, t.target, 'release', t.bundleDir);

        if (fs.existsSync(bundlePath)) {
            const files = fs.readdirSync(bundlePath).filter(f => f.endsWith(t.ext));
            for (const file of files) {
                const src = path.join(bundlePath, file);
                const dest = path.join(RELEASE_DIR, file);
                console.log(`-> Copying ${file} to release/`);
                fs.copyFileSync(src, dest);
            }
        } else {
            console.warn(`Warning: Bundle directory not found for ${t.name}: ${bundlePath}`);
        }

    } catch (e) {
        console.error(`Build failed for ${t.name}. Continuing...`);
        // We continue to try other targets (e.g. if windows fails on mac)
    }
}

console.log("\n-------------------------------------------");
console.log("Build Process Complete.");
console.log(`Artifacts are in: ${RELEASE_DIR}`);
const artifacts = fs.readdirSync(RELEASE_DIR);
artifacts.forEach(a => console.log(` - ${a}`));
console.log("-------------------------------------------");
