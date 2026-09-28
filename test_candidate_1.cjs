const https = require('https');
const fs = require('fs');

const startUrl = "https://onedrive.live.com/download?resid=3C0A0BFF7739F51B!sae171b0fd7594b10adb15f2c508d42d4";

function follow(u, redirects = 5) {
  if (redirects <= 0) return console.log('Too many redirects');
  console.log('Fetching:', u);
  https.get(u, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
  }, res => {
    console.log('Status:', res.statusCode, 'Location:', res.headers.location, 'Content-Type:', res.headers['content-type'], 'Len:', res.headers['content-length']);
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      let next = res.headers.location;
      if (!next.startsWith('http')) {
        next = new URL(next, u).href;
      }
      follow(next, redirects - 1);
    } else if (res.statusCode === 200) {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        const buf = Buffer.concat(chunks);
        console.log('Received 200 OK! Bytes:', buf.length);
        fs.writeFileSync('candidate1_download.bin', buf);
      });
    } else {
      let b = '';
      res.on('data', c => b += c);
      res.on('end', () => console.log('Body:', b.slice(0, 200)));
    }
  });
}

follow(startUrl);
