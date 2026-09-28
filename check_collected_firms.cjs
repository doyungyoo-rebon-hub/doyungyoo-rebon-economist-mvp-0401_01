const fs = require('fs');
const path = require('path');

const masterDbFile = 'downloads/database/reports_master_db.json';
if (!fs.existsSync(masterDbFile)) {
  console.log('masterDbFile does not exist');
  process.exit(0);
}

const list = JSON.parse(fs.readFileSync(masterDbFile, 'utf-8'));
console.log('Total records in master DB:', list.length);

const firmCounts = {};
list.forEach(item => {
  const firm = item.firm || item.company || item.source || item.broker || '미상';
  firmCounts[firm] = (firmCounts[firm] || 0) + 1;
});

console.log('=== Collected Securities Firms (총', Object.keys(firmCounts).length, '개) ===');
const sorted = Object.entries(firmCounts).sort((a, b) => b[1] - a[1]);
sorted.forEach(([f, c]) => console.log(`${f}: ${c}건`));
