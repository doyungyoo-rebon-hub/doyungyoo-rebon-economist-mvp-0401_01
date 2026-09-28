const fs = require('fs');
const html = fs.readFileSync('excel_viewer_resp.html', 'utf-8');
const scripts = html.match(/<script[^>]*>([\s\S]*?)<\/script>/gi) || [];
[1, 4, 13, 31, 33].forEach(idx => {
  console.log(`=== SCRIPT ${idx} ===`);
  console.log(scripts[idx]);
});
