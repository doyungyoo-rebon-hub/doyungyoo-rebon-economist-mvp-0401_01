const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const backupDir = path.join(rootDir, 'backups', 'v1.5-final');

console.log('[Restore v1.5] Starting restoration to VERSION 1.5 Final baseline...');

if (!fs.existsSync(backupDir)) {
  console.error('[Restore v1.5 Error] Backup directory not found at:', backupDir);
  process.exit(1);
}

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach((child) => copyRecursiveSync(path.join(src, child), path.join(dest, child)));
  } else {
    fs.copyFileSync(src, dest);
  }
}

const items = fs.readdirSync(backupDir);
items.forEach((item) => {
  if (item === 'BACKUP_INFO.json') return;
  copyRecursiveSync(path.join(backupDir, item), path.join(rootDir, item));
});

console.log('[Restore v1.5] Successfully restored all files to VERSION 1.5 Final baseline!');
