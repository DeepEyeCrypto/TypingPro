import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '..');
const RELEASE_DIR = path.join(ROOT_DIR, 'release');
const TARGET_DIR = path.join(ROOT_DIR, 'src-tauri', 'target', 'release', 'bundle');

async function organizeArtifacts() {
    try {
        console.log('📦 Organizing artifacts...');

        // Ensure release directory exists
        await fs.mkdir(RELEASE_DIR, { recursive: true });

        // Define platforms to check (including universal)
        const platforms = [
            // Mac Universal (priority on mac)
            { name: 'macOS (Universal)', path: '../../universal-apple-darwin/release/bundle/dmg', ext: '.dmg' },
            // Standard paths
            { name: 'macOS', path: 'dmg', ext: '.dmg' },
            { name: 'Windows', path: 'nsis', ext: '.exe' },
            { name: 'Linux', path: 'deb', ext: '.deb' },
            { name: 'Linux', path: 'appimage', ext: '.AppImage' }
        ];

        let foundCount = 0;

        for (const platform of platforms) {
            const platformDir = path.join(TARGET_DIR, platform.path);

            try {
                await fs.access(platformDir);
                const files = await fs.readdir(platformDir);

                for (const file of files) {
                    if (file.endsWith(platform.ext)) {
                        const srcPath = path.join(platformDir, file);
                        const destPath = path.join(RELEASE_DIR, file);

                        await fs.copyFile(srcPath, destPath);
                        console.log(`✅ Copied ${platform.name} artifact: ${file}`);
                        foundCount++;
                    }
                }
            } catch (err) {
                // Ignore if directory doesn't exist (platform not built)
                // console.log(`Skipping ${platform.name} (not found)`);
            }
        }

        if (foundCount === 0) {
            console.warn('⚠️ No artifacts found! Did the build succeed?');
        } else {
            console.log(`🎉 Successfully moved ${foundCount} artifacts to /release`);
        }

    } catch (error) {
        console.error('❌ Error organizing artifacts:', error);
        process.exit(1);
    }
}

organizeArtifacts();
