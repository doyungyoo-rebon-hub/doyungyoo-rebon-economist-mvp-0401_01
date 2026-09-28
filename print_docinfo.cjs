const fs = require('fs');
const c1 = JSON.parse(fs.readFileSync('m_excelWebRenderer_ewaCtl_m_ewa_m_postOpenWorkbookContextJson.json', 'utf-8'));
console.log('FullDocumentInfo:', JSON.stringify(c1.FullDocumentInfo, null, 2));
