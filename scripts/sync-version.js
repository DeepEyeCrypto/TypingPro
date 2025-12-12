const fs = require('fs');
const path = require('path');

const packageJsonPath = path.resolve(__dirname, '../package.json');
const tauriConfPath = path.resolve(__dirname, '../src-tauri/tauri.conf.json');

const packageJson = require(packageJsonPath);
const tauriConf = require(tauriConfPath);

const newVersion = packageJson.version;

console.log(`Syncing version ${newVersion} to tauri.conf.json...`);

tauriConf.package.version = newVersion;

fs.writeFileSync(tauriConfPath, JSON.stringify(tauriConf, null, 2));

console.log('Done.');
