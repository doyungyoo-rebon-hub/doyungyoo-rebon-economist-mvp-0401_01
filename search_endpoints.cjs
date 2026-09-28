const fs = require('fs');
const html = fs.readFileSync('excel_viewer_resp.html', 'utf-8');
const scripts = html.match(/<script[^>]*>([\s\S]*?)<\/script>/gi) || [];
const s27 = scripts[27];
const eps = s27.match(/\/x\/[a-zA-Z0-9_\/]+\.json\/[a-zA-Z0-9_]+/gi);
console.log('Endpoints in script 27:', Array.from(new Set(eps || [])));
const asmx = s27.match(/[a-zA-Z0-9_]+\.asmx\/[a-zA-Z0-9_]+/gi);
console.log('asmx in script 27:', Array.from(new Set(asmx || [])));
