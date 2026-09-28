const fs = require('fs');
const html = fs.readFileSync('excel_viewer_resp.html', 'utf-8');
const ajaxMatches = html.match(/\/x\/[a-zA-Z0-9_\/.]+/gi) || [];
console.log('Unique /x/ paths in viewer:', Array.from(new Set(ajaxMatches)));
