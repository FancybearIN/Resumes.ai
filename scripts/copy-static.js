const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');

if (!fs.existsSync(dist)) {
  fs.mkdirSync(dist, { recursive: true });
}

const filesToCopy = ['manifest.json', 'background.js', 'content.js'];

for (const file of filesToCopy) {
  fs.copyFileSync(path.join(root, file), path.join(dist, file));
}

console.log('Copied manifest/background/content into dist');
