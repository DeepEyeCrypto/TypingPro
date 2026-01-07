const fs = require('fs');
const path = require('path');

const version = process.argv[2];
if (!version) {
    console.error("Usage: node set-version.js <version>");
    process.exit(1);
}

console.log(`🚀 Setting project version to: ${version}`);

const files = [
    'package.json',
    'apps/desktop/package.json',
    'apps/desktop/src-tauri/tauri.conf.json'
];

files.forEach(file => {
    const filePath = path.resolve(__dirname, '..', file);
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        const json = JSON.parse(content);

        const oldVersion = json.version;
        json.version = version;

        fs.writeFileSync(filePath, JSON.stringify(json, null, 2) + '\n');
        console.log(`✅ ${file}: ${oldVersion} -> ${version}`);
    } else {
        console.warn(`⚠️  File not found: ${file}`);
    }
});
