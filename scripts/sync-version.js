import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fs = require('fs');

const packageJsonPath = path.resolve(__dirname, '../package.json');
const tauriConfPath = path.resolve(__dirname, '../src-tauri/tauri.conf.json');

const packageJson = require(packageJsonPath);
const tauriConf = require(tauriConfPath);

const newVersion = packageJson.version;

console.log(`Syncing version ${newVersion} to tauri.conf.json...`);

tauriConf.package.version = newVersion;

fs.writeFileSync(tauriConfPath, JSON.stringify(tauriConf, null, 2));

console.log('Done.');
