const fs = require("fs");
const path = require("path");

const rootDir = process.cwd();
const masterDbPath = path.join(rootDir, "downloads/database/reports_master_db.json");
const naverBaseDir = path.join(rootDir, "downloads/naver_pdfs");

function buildCanonicalInternalPdfUrl(rec) {
  const params = new URLSearchParams();
  const setParam = (k, v) => {
    if (v === undefined || v === null) return;
    const s = String(v).trim();
    if (!s || s === "undefined" || s === "null") return;
    params.set(k, s);
  };

  const nid =
    rec.nid ||
    (rec.id ? String(rec.id).replace(/^rep_/, "") : "") ||
    (rec.reportUrl && String(rec.reportUrl).match(/nid=(\d+)/)?.[1]) ||
    "";
  const stockCode =
    rec.stockCode && String(rec.stockCode).trim() !== "000000"
      ? String(rec.stockCode).trim()
      : "";
  const pubDate = String(rec.publishDate || rec.date || rec.writeDate || "").trim();
  const yymmdd =
    rec.yymmdd ||
    (pubDate ? pubDate.replace(/[-.]/g, "").slice(2, 8) : "");
  const title = String(rec.reportTitle || rec.title || "").trim();

  setParam("nid", nid);
  setParam("stockName", rec.stockName);
  setParam("stockCode", stockCode);
  setParam("brokerName", rec.brokerName || rec.broker);
  setParam("title", title);
  setParam("date", pubDate);
  setParam("yymmdd", yymmdd);
  if (rec.targetPrice && Number(rec.targetPrice) > 0) {
    setParam("targetPrice", rec.targetPrice);
  }
  const curPrice = rec.currentPrice || rec.currentPriceAtPublish;
  if (curPrice && Number(curPrice) > 0) {
    setParam("currentPrice", curPrice);
  }
  setParam("investmentOpinion", rec.investmentOpinion || rec.rating);
  setParam("analystName", rec.analystName || rec.analyst);
  setParam("sector", rec.sector);
  if (rec.stockName && (rec.brokerName || rec.broker) && title) {
    setParam(
      "fileName",
      `${yymmdd || "260228"}_${rec.brokerName || rec.broker}_${rec.stockName}_${title}.pdf`
    );
  }

  return `/api/pipeline-01/view-pdf-stream?${params.toString()}`;
}

function purifyRecordUrls(rec) {
  let updated = false;
  const canonicalPdfStreamUrl = buildCanonicalInternalPdfUrl(rec);

  if (
    !rec.reportUrl ||
    String(rec.reportUrl).includes("finance.naver.com/research/") ||
    String(rec.reportUrl).includes("stock.naver.com/research/company/") ||
    String(rec.reportUrl) !== canonicalPdfStreamUrl
  ) {
    rec.reportUrl = canonicalPdfStreamUrl;
    updated = true;
  }

  if (
    !rec.pdfUrl ||
    String(rec.pdfUrl).startsWith("/api/pipeline-01/view-pdf-stream")
  ) {
    if (rec.pdfUrl !== canonicalPdfStreamUrl) {
      rec.pdfUrl = canonicalPdfStreamUrl;
      updated = true;
    }
  }

  if (
    rec.dataSourceUrl &&
    String(rec.dataSourceUrl).includes("finance.naver.com/research/")
  ) {
    const code =
      rec.stockCode && String(rec.stockCode).trim() !== "000000"
        ? String(rec.stockCode).trim()
        : "";
    rec.dataSourceUrl = code
      ? `https://stock.naver.com/domestic/stock/${code}/research`
      : "https://stock.naver.com/research/company";
    updated = true;
  }

  return updated;
}

console.log("=== [v1.9.1] Purifying Legacy finance.naver.com URLs Across All 8,033 Records ===");

let masterTotal = 0;
let masterUpdated = 0;
if (fs.existsSync(masterDbPath)) {
  const masterArr = JSON.parse(fs.readFileSync(masterDbPath, "utf-8"));
  masterTotal = masterArr.length;
  for (const rec of masterArr) {
    if (purifyRecordUrls(rec)) masterUpdated++;
  }
  fs.writeFileSync(masterDbPath, JSON.stringify(masterArr, null, 2), "utf-8");
  console.log(`[Master DB] Total: ${masterTotal}, Updated URLs: ${masterUpdated}`);
}

let batchTotal = 0;
let batchUpdated = 0;
if (fs.existsSync(naverBaseDir)) {
  for (const dir of fs.readdirSync(naverBaseDir).sort()) {
    const batchPath = path.join(naverBaseDir, dir, "batch_reports.json");
    if (!fs.existsSync(batchPath)) continue;
    const batchArr = JSON.parse(fs.readFileSync(batchPath, "utf-8"));
    let localUpdated = 0;
    for (const rec of batchArr) {
      if (purifyRecordUrls(rec)) localUpdated++;
    }
    batchTotal += batchArr.length;
    batchUpdated += localUpdated;
    fs.writeFileSync(batchPath, JSON.stringify(batchArr, null, 2), "utf-8");
    console.log(`[Batch ${dir}] Total: ${batchArr.length}, Updated URLs: ${localUpdated}`);
  }
}

console.log("=== URL Purification Complete ===");
console.log({
  masterTotal,
  masterUpdated,
  batchTotal,
  batchUpdated,
  combinedRecords: masterTotal + batchTotal,
});
