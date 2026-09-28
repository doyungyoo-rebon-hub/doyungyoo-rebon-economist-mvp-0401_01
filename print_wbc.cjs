const fs = require('fs');
const wbc = JSON.parse(fs.readFileSync('m_excelWebRenderer_ewaCtl_m_workbookContextJson.json', 'utf-8'));
for (const [k, v] of Object.entries(wbc)) {
  if (v !== null && v !== '' && v !== false) {
    console.log(`${k}:`, typeof v === 'object' ? JSON.stringify(v).slice(0, 300) : v);
  }
}
