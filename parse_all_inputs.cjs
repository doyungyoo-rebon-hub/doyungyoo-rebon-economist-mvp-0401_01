const fs = require('fs');
const html = fs.readFileSync('excel_viewer_resp.html', 'utf-8');

const regex = /<input[^>]+id="([^"]+)"[^>]*value="([^"]*)"/gi;
let m;
while ((m = regex.exec(html)) !== null) {
  console.log(`Input id: ${m[1]}, length: ${m[2].length}`);
  if (m[2].length > 0 && m[2].length < 1000) {
    console.log(`  value: ${m[2].slice(0, 200)}`);
  }
}
