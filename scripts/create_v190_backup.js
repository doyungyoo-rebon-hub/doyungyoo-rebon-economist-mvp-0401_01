import AdmZip from 'adm-zip';
import fs from 'fs';
import path from 'path';

console.log('🚀 Starting VERSION 1.9.0 Full Backup Generation...');
const rootDir = process.cwd();
const zip = new AdmZip();

// 1. Add src directory recursively
const srcDir = path.join(rootDir, 'src');
if (fs.existsSync(srcDir)) {
  zip.addLocalFolder(srcDir, 'src');
  console.log('✅ Added src/ directory');
}

// 2. Add downloads/database directory recursively
const dbDir = path.join(rootDir, 'downloads', 'database');
if (fs.existsSync(dbDir)) {
  zip.addLocalFolder(dbDir, 'downloads/database');
  console.log('✅ Added downloads/database/ directory');
}

// 3. Add other downloads json files if present
const dlDir = path.join(rootDir, 'downloads');
['extracted_roster.json', 'final_master_roster.json'].forEach(f => {
  const fp = path.join(dlDir, f);
  if (fs.existsSync(fp)) {
    zip.addLocalFile(fp, 'downloads');
  }
});

// 4. Add root configuration and code files
const rootFiles = [
  'package.json',
  'tsconfig.json',
  'vite.config.ts',
  'server.ts',
  'index.html',
  'metadata.json',
  'SYSTEM_RECOVERY_POLICY_v1.9.0.md',
  'LOCAL_SERVER_MIGRATION_GUIDE.md',
  'firebase-applet-config.json',
  'firestore.rules'
];

rootFiles.forEach(f => {
  const fp = path.join(rootDir, f);
  if (fs.existsSync(fp)) {
    zip.addLocalFile(fp, '');
    console.log(`✅ Added root file: ${f}`);
  }
});

// 5. Add manifest.json from backups/v1.9.0/
const manifestPath = path.join(rootDir, 'backups', 'v1.9.0', 'manifest.json');
if (fs.existsSync(manifestPath)) {
  zip.addLocalFile(manifestPath, '');
  console.log('✅ Added manifest.json');
}

// 6. Add artifacts directory
const artifactsDir = path.join(rootDir, '.aistudio', 'artifacts');
if (fs.existsSync(artifactsDir)) {
  zip.addLocalFolder(artifactsDir, '.aistudio/artifacts');
  console.log('✅ Added .aistudio/artifacts/ directory');
}

// Ensure target directories exist
const targetDl = path.join(rootDir, 'downloads', 'backups');
const targetBkp = path.join(rootDir, 'backups', 'v1.9.0');
fs.mkdirSync(targetDl, { recursive: true });
fs.mkdirSync(targetBkp, { recursive: true });

const zipName = 'analyst_report_eval_v1.9.0_full_backup.zip';
const outDlPath = path.join(targetDl, zipName);
const outBkpPath = path.join(targetBkp, zipName);

console.log('📦 Compressing archive...');
zip.writeZip(outDlPath);
console.log(`✅ Written to: ${outDlPath}`);

// Copy to backups/v1.9.0/
fs.copyFileSync(outDlPath, outBkpPath);
console.log(`✅ Mirrored to: ${outBkpPath}`);

const stat = fs.statSync(outDlPath);
const sizeMb = (stat.size / (1024 * 1024)).toFixed(2);
console.log(`🎉 VERSION 1.9.0 Full Backup Completed! File size: ${sizeMb} MB (${stat.size} bytes)`);
