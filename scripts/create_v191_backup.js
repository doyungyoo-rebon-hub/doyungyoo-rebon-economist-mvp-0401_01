import AdmZip from 'adm-zip';
import fs from 'fs';
import path from 'path';

console.log('🚀 Starting VERSION 1.9.1 Clean Backup Generation...');
const rootDir = process.cwd();
const zip = new AdmZip();

// 1. Add src directory recursively
const srcDir = path.join(rootDir, 'src');
if (fs.existsSync(srcDir)) {
  zip.addLocalFolder(srcDir, 'src');
  console.log('✅ Added src/ directory');
}

// 2. Add downloads/database directory (exclude .bak backup files so clean archive stays lean & pure)
const dbDir = path.join(rootDir, 'downloads', 'database');
if (fs.existsSync(dbDir)) {
  for (const f of fs.readdirSync(dbDir)) {
    if (f.includes('.bak.')) continue;
    const fp = path.join(dbDir, f);
    if (fs.statSync(fp).isFile()) {
      zip.addLocalFile(fp, 'downloads/database');
    }
  }
  console.log('✅ Added clean downloads/database/ files');
}

// 3. Add cleaned downloads/naver_pdfs/*/batch_reports.json
const naverDir = path.join(rootDir, 'downloads', 'naver_pdfs');
if (fs.existsSync(naverDir)) {
  for (const sub of fs.readdirSync(naverDir).sort()) {
    const bp = path.join(naverDir, sub, 'batch_reports.json');
    if (fs.existsSync(bp)) {
      zip.addLocalFile(bp, `downloads/naver_pdfs/${sub}`);
    }
  }
  console.log('✅ Added clean downloads/naver_pdfs/*/batch_reports.json');
}

// 4. Add other downloads json files if present
const dlDir = path.join(rootDir, 'downloads');
['extracted_roster.json', 'final_master_roster.json'].forEach(f => {
  const fp = path.join(dlDir, f);
  if (fs.existsSync(fp)) {
    zip.addLocalFile(fp, 'downloads');
  }
});

// 5. Create v1.9.1 manifest
const v191Manifest = {
  version: "VERSION 1.9.1",
  releaseDate: "2026-11-12",
  type: "CLEAN_MASTER_RELEASE",
  description: "원시 수집 9,518건 중 합성 시뮬레이션(1,402건) 및 퇴사 제외(83건) 정제 완료 → 실물 검증 8,033건 확정 · 곽민정 시뮬레이션 제외 · 조선/방산 1위 이지호(메리츠증권 퇴사) 시상 제외 및 2위 이한결(키움증권, 93.45점, 실물 83편) 공식 1위 챔피언 승계 확정",
  simulationPurged: true,
  shipbuildingSector: {
    resignedRank1Excluded: "이지호 (메리츠증권 퇴사, 93.68점, 24편 실물 - 정량 원장 보존 및 공식 시상 제외)",
    officialChampionSucceeded: "이한결 (키움증권, 93.45점, 83편 실물 - ※ 1위 이지호 메리츠증권 퇴사 시상 제외에 따른 2위 공식 수상 승계)",
    thirdPlace: "허준서 (유진투자증권, 92.93점, 64편 실물)",
    excludedSimulationOnly: ["곽민정 (평가 기간 내 실물 리포트 0건 · 합성 시뮬레이션 130건 전량 삭제)"]
  },
  constructionSector: {
    champion: "이상호 (교보증권, 93.52점, 16편 실물)"
  },
  databaseStatus: {
    rawTargetReportsCount: 9518,
    retiredExcludedCount: 83,
    kwakSimulationRemovedCount: 130,
    syntheticPlaceholderRemovedCount: 1272,
    verifiedRealReportsCount: 8033,
    synthetic2026DataRemoved: true,
    internalOriginalPdfUrlPurified: true
  },
  timestamp: new Date().toISOString()
};

const v191Dir = path.join(rootDir, 'backups', 'v1.9.1');
if (!fs.existsSync(v191Dir)) {
  fs.mkdirSync(v191Dir, { recursive: true });
}
const manifestPath = path.join(v191Dir, 'manifest.json');
fs.writeFileSync(manifestPath, JSON.stringify(v191Manifest, null, 2), 'utf8');
zip.addLocalFile(manifestPath, '');
console.log('✅ Added manifest.json');

// 6. Add root configuration and code files
const rootFiles = [
  'package.json',
  'tsconfig.json',
  'vite.config.ts',
  'server.ts',
  'index.html',
  'metadata.json',
  'SYSTEM_RECOVERY_POLICY_v1.9.1.md',
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

// 7. Ensure destination directories exist
const targetBackupsDir = path.join(rootDir, 'downloads', 'backups');
if (!fs.existsSync(targetBackupsDir)) {
  fs.mkdirSync(targetBackupsDir, { recursive: true });
}

// 8. Write clean ZIP
const zipPathPrimary = path.join(targetBackupsDir, 'analyst_report_eval_v1.9.1_clean_backup.zip');
const zipPathMirror = path.join(v191Dir, 'analyst_report_eval_v1.9.1_clean_backup.zip');

zip.writeZip(zipPathPrimary);
console.log(`🎉 Successfully created v1.9.1 clean backup zip at: ${zipPathPrimary}`);

// Mirror to backups/v1.9.1/
fs.copyFileSync(zipPathPrimary, zipPathMirror);
console.log(`🎉 Mirrored to: ${zipPathMirror}`);

const stats = fs.statSync(zipPathPrimary);
console.log(`📦 Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
