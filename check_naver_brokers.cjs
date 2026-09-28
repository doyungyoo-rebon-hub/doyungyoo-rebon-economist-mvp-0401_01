const https = require('https');
const iconv = require('iconv-lite');

// Check Naver Finance company_list search or pages
// Naver url: https://finance.naver.com/research/company_list.naver?keyword=&brokerCode=&searchType=write_date&writeFromDate=2026-01-01&writeToDate=2026-06-30
// Or inspect broker dropdown / search results

async function fetchPage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    }, res => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        const buf = Buffer.concat(chunks);
        const decoded = iconv.decode(buf, 'euc-kr');
        resolve(decoded);
      });
    }).on('error', reject);
  });
}

async function run() {
  try {
    const html = await fetchPage('https://finance.naver.com/research/company_list.naver');
    console.log('Fetched Naver page length:', html.length);
    
    // Check if there is a broker select or list
    const brokerMatches = html.match(/<option[^>]*value="(\d+)"[^>]*>([^<]+)<\/option>/gi) || [];
    console.log('Found option tags:', brokerMatches.length);
    brokerMatches.forEach(o => {
      const m = o.match(/value="([^"]+)"[^>]*>([^<]+)/);
      if (m) {
        console.log(`Broker code: ${m[1]} -> ${m[2].trim()}`);
      }
    });

    // Also check table rows for broker names
    const rowBrokers = new Set();
    const rows = html.match(/<td[^>]*class="col_write"[^>]*>([^<]+)<\/td>/gi) || [];
    rows.forEach(r => {
      const m = r.match(/<td[^>]*class="col_write"[^>]*>([^<]+)<\/td>/);
      if (m) rowBrokers.add(m[1].trim());
    });
    console.log('Brokers in latest table page:', Array.from(rowBrokers));
  } catch (e) {
    console.error('Error fetching Naver:', e.message);
  }
}

run();
