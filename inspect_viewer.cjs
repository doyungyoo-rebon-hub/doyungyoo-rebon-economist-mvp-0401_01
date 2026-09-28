const fs = require('fs');
const html = fs.readFileSync('excel_viewer_resp.html', 'utf-8');
console.log('Length:', html.length);

const koreanMatches = html.match(/[\uAC00-\uD7A3]+/g);
if (koreanMatches) {
  const uniq = Array.from(new Set(koreanMatches));
  console.log('Total unique Korean words:', uniq.length);
  console.log('Sample:', uniq.slice(0, 100).join(', '));
}

// Check scripts for JSON payloads
const scripts = html.match(/<script[^>]*>([\s\S]*?)<\/script>/gi) || [];
console.log('Scripts:', scripts.length);
scripts.forEach((s, idx) => {
  if (s.includes('SessionId') || s.includes('Workbook') || s.includes('Wac') || s.includes('FileGetUrl') || s.includes('download')) {
    console.log(`Script ${idx} has keywords, length:`, s.length);
  }
});
