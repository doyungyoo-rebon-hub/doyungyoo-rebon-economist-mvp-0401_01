const fs = require('fs');
const c1 = JSON.parse(fs.readFileSync('m_excelWebRenderer_ewaCtl_m_ewa_m_postOpenWorkbookContextJson.json', 'utf-8'));
console.log('ActiveSheetName:', c1.ActiveSheetName);
console.log('SheetTabs:', JSON.stringify(c1.SheetTabs, null, 2));
console.log('SessionId:', c1.SessionId);
console.log('InitialBlockAreaTopLeft:', c1.InitialBlockAreaTopLeft);
console.log('PrefetchViewportDetails:', JSON.stringify(c1.PrefetchViewportDetails, null, 2));
console.log('ActiveSheetProcessedDataResult:', JSON.stringify(c1.ActiveSheetProcessedDataResult, null, 2));
