const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const ffmpeg = require('ffmpeg-static');

const ASSETS_DIR = path.join(__dirname, '../public/assets');

// Configuration
const TARGET_RESOLUTION = '1280x720'; // 720p for smoothness
const TARGET_BITRATE = '2500k';      // 2.5 Mbps
const AUDIO_BITRATE = '128k';

async function optimizeVideos() {
    if (!fs.existsSync(ASSETS_DIR)) {
        console.error(`Assets directory not found: ${ASSETS_DIR}`);
        process.exit(1);
    }

    const files = fs.readdirSync(ASSETS_DIR).filter(f => f.endsWith('.mp4'));

    for (const file of files) {
        const inputPath = path.join(ASSETS_DIR, file);
        const tempPath = path.join(ASSETS_DIR, `optimized-${file}`);

        console.log(`🎬 Optimizing ${file}...`);

        // ffmpeg command:
        // -i input
        // -c:v libx264 (H.264 video)
        // -preset fast (balanced speed/compression)
        // -b:v 2500k (video bitrate)
        // -maxrate 3000k -bufsize 6000k (constrain bitrate spikes)
        // -vf scale=-2:720 (scale to 720p height, keep aspect ratio div by 2)
        // -c:a aac -b:a 128k (AAC audio)
        // -movflags +faststart (web optimization)

        const cmd = `"${ffmpeg}" -y -i "${inputPath}" -c:v libx264 -preset fast -b:v ${TARGET_BITRATE} -maxrate 3000k -bufsize 6000k -vf "scale=-2:720" -c:a aac -b:a ${AUDIO_BITRATE} -movflags +faststart "${tempPath}"`;

        try {
            execSync(cmd, { stdio: 'inherit' });

            // Should verify if it worked, then replace
            if (fs.existsSync(tempPath)) {
                const originalSize = fs.statSync(inputPath).size;
                const newSize = fs.statSync(tempPath).size;

                console.log(`✅ Optimized ${file}: ${(originalSize / 1024 / 1024).toFixed(2)}MB -> ${(newSize / 1024 / 1024).toFixed(2)}MB`);

                // Backup original? Maybe just overwrite for this task as requested "Convert source"
                fs.renameSync(tempPath, inputPath);
            }
        } catch (e) {
            console.error(`❌ Failed to optimize ${file}:`, e.message);
        }
    }
}

optimizeVideos();
