const fs = require('fs');
const c1 = JSON.parse(fs.readFileSync('m_excelWebRenderer_ewaCtl_m_ewa_m_postOpenWorkbookContextJson.json', 'utf-8'));
const c2 = JSON.parse(fs.readFileSync('m_excelWebRenderer_ewaCtl_m_workbookContextJson.json', 'utf-8'));

console.log('=== Keys in c1 ===', Object.keys(c1));
console.log('=== Keys in c2 ===', Object.keys(c2));

if (c1.SheetNames || c1.Sheets || c1.WorkbookName) {
  console.log('c1 Sheets:', c1.SheetNames, c1.Sheets, c1.WorkbookName);
}
if (c2.SheetNames || c2.Sheets || c2.WorkbookName) {
  console.log('c2 Sheets:', c2.SheetNames, c2.Sheets, c2.WorkbookName);
}

console.log('c2 sample:', JSON.stringify(c2, null, 2).slice(0, 1500));
