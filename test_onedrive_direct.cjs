const https = require('https');
const fs = require('fs');

const candidates = [
  "https://onedrive.live.com/download?cid=3C0A0BFF7739F51B&resid=3C0A0BFF7739F51B!sae171b0fd7594b10adb15f2c508d42d4&authkey=!sae171b0fd7594b10adb15f2c508d42d4",
  "https://onedrive.live.com/download?resid=3C0A0BFF7739F51B!sae171b0fd7594b10adb15f2c508d42d4",
  "https://api.onedrive.com/v1.0/shares/u!aHR0cHM6Ly8xZHJ2Lm1zL3gvYy8zYzBhMGJmZjc3MzlmNTFiL0lRQVBHeGV1V2RjUVM2MnhYeXhRalVMVUFRODZnYWVKc2g4dUNOUnFnZXBxTm1vP2U9MjkwdkJx/driveitem/content",
  "https://onedrive.live.com/download.aspx?cid=3C0A0BFF7739F51B&resid=3C0A0BFF7739F51B!sae171b0fd7594b10adb15f2c508d42d4&authkey=!APGxeuWdcQS62xXyxQjULUAQ86gaeJsh8uCNRqgepqNmo",
  "https://onedrive.live.com/download?cid=3c0a0bff7739f51b&resid=3C0A0BFF7739F51B%2191831&authkey=!APGxeuWdcQS62xXyxQjULUAQ86gaeJsh8uCNRqgepqNmo",
  "https://onedrive.live.com/download?resid=3C0A0BFF7739F51B%2191831"
];

candidates.forEach((u, i) => {
  https.get(u, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
  }, res => {
    console.log(`[${i}] Status: ${res.statusCode}, Loc: ${res.headers.location}, Len: ${res.headers['content-length']}`);
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      https.get(res.headers.location, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
      }, res2 => {
        console.log(`[${i} -> 2] Status: ${res2.statusCode}, Len: ${res2.headers['content-length']}, Loc: ${res2.headers.location}`);
        if (res2.statusCode === 200 && Number(res2.headers['content-length']) > 1000) {
          const f = fs.createWriteStream(`download_success_${i}.xlsx`);
          res2.pipe(f);
          f.on('finish', () => console.log(`SUCCESS! Saved download_success_${i}.xlsx`));
        }
      });
    }
  });
});
