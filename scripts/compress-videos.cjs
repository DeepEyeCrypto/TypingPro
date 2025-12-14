const ffmpegPath = require('ffmpeg-static');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const FILES = [
    { input: 'learn-teach-1.mp4', output: 'learn-teach-1-opt.mp4' },
    { input: 'learn-teach-2.mp4', output: 'learn-teach-2-opt.mp4' }
];

const ASSETS_DIR = path.join(__dirname, '../public/assets');

async function compressVideo(file) {
    const inputPath = path.join(ASSETS_DIR, file.input);
    const outputPath = path.join(ASSETS_DIR, file.output);

    console.log(`Processing: ${file.input} -> ${file.output}`);

    if (!fs.existsSync(inputPath)) {
        console.error(`Error: Input file not found: ${inputPath}`);
        return;
    }

    // FFmpeg args:
    // -i input
    // -vcodec libx264 (H.264 video)
    // -crf 28 (Constant Rate Factor, higher = more compression/lower quality. 23 is default, 28 is good for web)
    // -preset veryslow (Best compression efficiency)
    // -acodec aac (AAC audio)
    // -b:a 128k (Audio bitrate)
    // -movflags +faststart (Web optimization for streaming)
    // -vf "scale='min(1280,iw)':-2" (Downscale to 720p width if larger, keep aspect ratio. -2 ensures even height)

    const args = [
        '-y', // Overwrite output
        '-i', inputPath,
        '-vcodec', 'libx264',
        '-crf', '32', // Higher CRF = lower quality/size (was 28)
        '-preset', 'veryfast',
        '-pix_fmt', 'yuv420p', // Ensure max compatibility
        '-acodec', 'aac',
        '-b:a', '96k', // Lower audio bitrate
        '-movflags', '+faststart',
        '-vf', "scale='min(854,iw)':-2", // Downscale to 480p width (approx) if larger
        outputPath
    ];

    return new Promise((resolve, reject) => {
        const proc = spawn(ffmpegPath, args);

        proc.stderr.on('data', (data) => {
            // FFmpeg logs to stderr
            const s = data.toString();
            // Minimal logging to not flood
            if (s.includes('time=')) {
                process.stdout.write(`.`);
            }
        });

        proc.on('close', (code) => {
            console.log('\nDone.');
            if (code === 0) {
                // Determine sizes
                const oldSize = (fs.statSync(inputPath).size / 1024 / 1024).toFixed(2);
                const newSize = (fs.statSync(outputPath).size / 1024 / 1024).toFixed(2);
                console.log(`Success! ${oldSize}MB -> ${newSize}MB`);

                // Replace original with optimized
                fs.unlinkSync(inputPath);
                fs.renameSync(outputPath, inputPath);
                console.log(`Replaced ${file.input} with optimized version.`);

                resolve();
            } else {
                console.error(`FFmpeg finished with code ${code}`);
                reject(new Error(`FFmpeg failed with code ${code}`));
            }
        });
    });
}

(async () => {
    try {
        for (const file of FILES) {
            await compressVideo(file);
        }
        console.log('All videos processed.');
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();
