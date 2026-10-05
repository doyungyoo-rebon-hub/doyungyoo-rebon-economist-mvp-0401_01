const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = process.cwd();
const backupBaseDir = path.join(rootDir, 'backups');
const backupDirName = 'v1.6-current-full-backup';
const targetBackupDir = path.join(backupBaseDir, backupDirName);
const tarGzName = 'backup_v1.6_current_full.tar.gz';
const tarGzPath = path.join(backupBaseDir, tarGzName);

console.log('====================================================');
console.log(' [Full Backup Engine] Starting v1.6 Full Backup...');
console.log(' Target directory:', targetBackupDir);
console.log('====================================================');

if (!fs.existsSync(backupBaseDir)) {
  fs.mkdirSync(backupBaseDir, { recursive: true });
}

if (fs.existsSync(targetBackupDir)) {
  console.log('[Notice] Cleaning existing target directory...');
  fs.rmSync(targetBackupDir, { recursive: true, force: true });
}
fs.mkdirSync(targetBackupDir, { recursive: true });

function copyRecursiveSync(src, dest, ignoreList = []) {
  if (!fs.existsSync(src)) return;
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const child of fs.readdirSync(src)) {
      if (ignoreList.includes(child)) continue;
      copyRecursiveSync(path.join(src, child), path.join(dest, child), ignoreList);
    }
  } else {
    const parentDir = path.dirname(dest);
    if (!fs.existsSync(parentDir)) fs.mkdirSync(parentDir, { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

// 1. Core directories
const directoriesToBackup = [
  'src',
  'downloads',
  'fonts',
  'scripts',
  'dist',
  'assets',
  'api'
];

// 2. Core configuration and root files
const filesToBackup = [
  'server.ts',
  'package.json',
  'package-lock.json',
  'metadata.json',
  'index.html',
  'tsconfig.json',
  'vite.config.ts',
  '.env.example',
  '.gitignore',
  '.gcloudignore',
  'firebase-applet-config.json',
  'firestore.rules',
  'firebase-blueprint.json',
  'vercel.json',
  'docker-compose.yml',
  'Dockerfile.onprem',
  'nginx-onprem.conf',
  'onprem-start.sh',
  'onprem-start.bat',
  'ONPREM_MIGRATION_GUIDE.md'
];

console.log('\n[1/4] Copying directories...');
directoriesToBackup.forEach((dir) => {
  const srcPath = path.join(rootDir, dir);
  const destPath = path.join(targetBackupDir, dir);
  if (fs.existsSync(srcPath)) {
    console.log(` - Backing up dir: ${dir}/`);
    copyRecursiveSync(srcPath, destPath, ['node_modules', '.git']);
  } else {
    console.log(` - Skipping (not found): ${dir}`);
  }
});

console.log('\n[2/4] Copying root files & configs...');
filesToBackup.forEach((file) => {
  const srcPath = path.join(rootDir, file);
  const destPath = path.join(targetBackupDir, file);
  if (fs.existsSync(srcPath)) {
    console.log(` - Backing up file: ${file}`);
    copyRecursiveSync(srcPath, destPath);
  } else {
    console.log(` - Skipping (not found): ${file}`);
  }
});

// 3. Count total files and size
function getDirStats(dir) {
  let count = 0;
  let bytes = 0;
  if (!fs.existsSync(dir)) return { count, bytes };
  for (const item of fs.readdirSync(dir)) {
    const p = path.join(dir, item);
    const s = fs.statSync(p);
    if (s.isDirectory()) {
      const sub = getDirStats(p);
      count += sub.count;
      bytes += sub.bytes;
    } else {
      count++;
      bytes += s.size;
    }
  }
  return { count, bytes };
}

const stats = getDirStats(targetBackupDir);

// 4. Create BACKUP_MANIFEST.json
const manifest = {
  backupVersion: '1.6.0',
  backupName: '리본-이코노미스트 2026 애널리스트 어워즈 - v1.6 Full Backup',
  backupDate: new Date().toISOString(),
  localTime: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
  totalFiles: stats.count,
  totalSizeBytes: stats.bytes,
  totalSizeMB: (stats.bytes / (1024 * 1024)).toFixed(2) + ' MB',
  databaseStats: {
    hasReportsMasterDb: fs.existsSync(path.join(targetBackupDir, 'downloads/database/reports_master_db.json')),
    hasHallOfFameDb: fs.existsSync(path.join(targetBackupDir, 'downloads/database/hall_of_fame_db.json')),
    hasStockReportsCache: fs.existsSync(path.join(targetBackupDir, 'downloads/naver_stock_reports_cache.json')),
    hasAllAnalystsList: fs.existsSync(path.join(targetBackupDir, 'downloads/all_240_analysts.json'))
  },
  restoreCommand: 'npm run restore:v1.6'
};

fs.writeFileSync(
  path.join(targetBackupDir, 'BACKUP_MANIFEST.json'),
  JSON.stringify(manifest, null, 2),
  'utf-8'
);
console.log('\n[3/4] Created BACKUP_MANIFEST.json');

// 5. Create compressed .tar.gz archive
console.log('\n[4/4] Creating compressed archive (.tar.gz)...');
try {
  if (fs.existsSync(tarGzPath)) fs.unlinkSync(tarGzPath);
  execSync(`tar -czf "${tarGzPath}" -C "${backupBaseDir}" "${backupDirName}"`, { stdio: 'inherit' });
  const tarStats = fs.statSync(tarGzPath);
  console.log(` - Archive created: backups/${tarGzName} (${(tarStats.size / (1024 * 1024)).toFixed(2)} MB)`);
} catch (tarErr) {
  console.warn(' - Notice: tar archive creation skipped or had notice:', tarErr.message);
}

console.log('\n====================================================');
console.log(' ✅ [Full Backup Complete!]');
console.log(` - Folder Backup: backups/${backupDirName}`);
console.log(` - Archive File: backups/${tarGzName}`);
console.log(` - Total Files: ${stats.count} files`);
console.log(` - Uncompressed Size: ${(stats.bytes / (1024 * 1024)).toFixed(2)} MB`);
console.log(' - Restore Command: npm run restore:v1.6');
console.log('====================================================\n');
