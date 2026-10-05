const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const backupDir = path.join(rootDir, 'backups', 'v1.6-current-full-backup');

console.log('====================================================');
console.log(' [Restore Engine] Starting v1.6 Full Restoration...');
console.log(' Source directory:', backupDir);
console.log(' Target directory:', rootDir);
console.log('====================================================');

if (!fs.existsSync(backupDir)) {
  console.error('[Restore Error] Backup directory not found at:', backupDir);
  console.error('Please verify that backups/v1.6-current-full-backup exists or extract backup_v1.6_current_full.tar.gz');
  process.exit(1);
}

const manifestPath = path.join(backupDir, 'BACKUP_MANIFEST.json');
if (fs.existsSync(manifestPath)) {
  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    console.log(`[Restore Notice] Restoring from backup created on: ${manifest.localTime || manifest.backupDate}`);
    console.log(`[Restore Notice] Backup Version: ${manifest.backupVersion} (${manifest.totalFiles} files, ${manifest.totalSizeMB})`);
  } catch (e) {}
}

function copyRecursiveSync(src, dest) {
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const child of fs.readdirSync(src)) {
      copyRecursiveSync(path.join(src, child), path.join(dest, child));
    }
  } else {
    const parentDir = path.dirname(dest);
    if (!fs.existsSync(parentDir)) fs.mkdirSync(parentDir, { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

let restoredCount = 0;
const items = fs.readdirSync(backupDir);
items.forEach((item) => {
  if (item === 'BACKUP_MANIFEST.json') return;
  const src = path.join(backupDir, item);
  const dest = path.join(rootDir, item);
  console.log(` - Restoring: ${item}`);
  copyRecursiveSync(src, dest);
  restoredCount++;
});

console.log('\n====================================================');
console.log(' ✅ [Restore Completed Successfully!]');
console.log(` - ${restoredCount} top-level items restored.`);
console.log(' - You can now run "npm run dev" or "npm start" to verify.');
console.log('====================================================\n');
