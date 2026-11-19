const fs = require("fs");
const path = require("path");

const rootDir = process.cwd();
const backupMasterPath = path.join(rootDir, "backups/v1.9.0/downloads/database/reports_master_db.json");
const liveMasterPath = path.join(rootDir, "downloads/database/reports_master_db.json");
const naverBaseDir = path.join(rootDir, "downloads/naver_pdfs");
const backupNaverBaseDir = path.join(rootDir, "backups/v1.9.0/downloads/naver_pdfs");

function isSyntheticOrKwak(r) {
  const analystStr = String(r.analystName || r.writer || r.author || "");
  const analystsArr = Array.isArray(r.analysts) ? r.analysts.map(String) : [];
  const hasKwak =
    analystStr.includes("곽민정") ||
    analystsArr.some((a) => a.includes("곽민정"));
  const hasRetired =
    analystStr.includes("백광제") ||
    analystsArr.some((a) => a.includes("백광제"));
  const stockName = String(r.stockName || "").trim();
  const isSyntheticStock = /^K-.*-\d+$/.test(stockName);
  const isNoTitle = !r.title && !r.reportTitle;
  return {
    remove: hasKwak || hasRetired || isSyntheticStock || isNoTitle,
    reason: hasKwak
      ? "kwak_simulation"
      : hasRetired
      ? "retired_baek"
      : isSyntheticStock || isNoTitle
      ? "synthetic_k_stock"
      : null,
  };
}

console.log("=== [v1.9.1] Restoring & Surgically Purging Simulation Data ===");

if (!fs.existsSync(backupMasterPath)) {
  throw new Error(`Backup master DB not found at ${backupMasterPath}`);
}

const rawMaster = JSON.parse(fs.readFileSync(backupMasterPath, "utf-8"));
let masterKwakRemoved = 0;
let masterSynthRemoved = 0;
const cleanMaster = [];

for (const rec of rawMaster) {
  const check = isSyntheticOrKwak(rec);
  if (check.remove) {
    if (check.reason === "kwak_simulation") masterKwakRemoved++;
    else masterSynthRemoved++;
  } else {
    cleanMaster.push(rec);
  }
}

fs.writeFileSync(liveMasterPath, JSON.stringify(cleanMaster, null, 2), "utf-8");
console.log(
  `[Master DB] Raw v1.9.0: ${rawMaster.length} -> Clean: ${cleanMaster.length} (Kwak removed: ${masterKwakRemoved}, Synthetic K-stocks removed: ${masterSynthRemoved})`
);

let naverRawTotal = 0;
let naverKwakRemoved = 0;
let naverSynthRemoved = 0;
let naverCleanTotal = 0;

if (fs.existsSync(naverBaseDir)) {
  const dirs = fs.readdirSync(naverBaseDir).sort();
  for (const dir of dirs) {
    const liveBatchPath = path.join(naverBaseDir, dir, "batch_reports.json");
    if (!fs.existsSync(liveBatchPath)) continue;

    // Preserve pristine v1.9.0 backup of batch_reports.json if not already backed up
    const backupDir = path.join(backupNaverBaseDir, dir);
    const backupBatchPath = path.join(backupDir, "batch_reports.json");
    if (!fs.existsSync(backupBatchPath)) {
      fs.mkdirSync(backupDir, { recursive: true });
      fs.copyFileSync(liveBatchPath, backupBatchPath);
    }

    const sourceBatch = JSON.parse(fs.readFileSync(backupBatchPath, "utf-8"));
    naverRawTotal += sourceBatch.length;
    const cleanBatch = [];

    for (const rec of sourceBatch) {
      const check = isSyntheticOrKwak(rec);
      if (check.remove) {
        if (check.reason === "kwak_simulation") naverKwakRemoved++;
        else naverSynthRemoved++;
      } else {
        cleanBatch.push(rec);
      }
    }

    naverCleanTotal += cleanBatch.length;
    fs.writeFileSync(liveBatchPath, JSON.stringify(cleanBatch, null, 2), "utf-8");
    console.log(
      `[Naver PDFs ${dir}] Raw: ${sourceBatch.length} -> Clean: ${cleanBatch.length}`
    );
  }
}

// Compute unique combined count exactly as server.ts does
const combinedMap = new Map();
for (const item of cleanMaster) {
  const key = item.id || `rep_${item.nid}`;
  combinedMap.set(key, item);
}
if (fs.existsSync(naverBaseDir)) {
  for (const dir of fs.readdirSync(naverBaseDir).sort()) {
    const p = path.join(naverBaseDir, dir, "batch_reports.json");
    if (!fs.existsSync(p)) continue;
    const arr = JSON.parse(fs.readFileSync(p, "utf-8"));
    for (const item of arr) {
      const key = item.id || `${item.stockCode}_${item.publishDate}_${item.brokerName}`;
      combinedMap.set(key, item);
    }
  }
}

const totalVerifiedCleanReports = combinedMap.size;
console.log("=== Summary ===");
console.log({
  rawTargetV184: 9518,
  retiredBaekPurgedV190: 83,
  kwakSimulationPurged: masterKwakRemoved + naverKwakRemoved,
  syntheticKStockPurged: masterSynthRemoved + naverSynthRemoved,
  totalPurgedFrom9518: 9518 - totalVerifiedCleanReports,
  totalVerifiedCleanReports,
});

const scopeConfigPath = path.join(rootDir, "downloads/database/collection_scope_config.json");
const scopeConfig = {
  version: "VERSION 1.9.1",
  scopePeriod: "2025-11-01 ~ 2026-10-30",
  rawTargetReports: 9518,
  retiredExcludedReports: 83,
  kwakSimulationRemoved: masterKwakRemoved + naverKwakRemoved,
  syntheticPlaceholderRemoved: masterSynthRemoved + naverSynthRemoved,
  totalPurgedReports: 9518 - totalVerifiedCleanReports,
  totalReports: totalVerifiedCleanReports,
  verifiedCleanReports: totalVerifiedCleanReports,
  simulationPurged: true,
  updatedAt: new Date().toISOString(),
};
fs.writeFileSync(scopeConfigPath, JSON.stringify(scopeConfig, null, 2), "utf-8");
console.log("Updated collection_scope_config.json successfully.");
require("./purify_report_urls_v191.cjs");
