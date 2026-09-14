const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const iconv = require('iconv-lite');

// 1. Fetch Naver Finance Company Reports List
function fetchNaverPage(page = 1) {
  return new Promise((resolve) => {
    https.get({
      hostname: 'finance.naver.com',
      path: '/research/company_list.naver?page=' + page,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7'
      },
      timeout: 6000
    }, (res) => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        try {
          const html = iconv.decode(Buffer.concat(chunks), 'EUC-KR');
          const rows = html.match(/<tr[\s\S]*?<\/tr>/g) || [];
          const reports = [];

          for (const row of rows) {
            const itemMatch = row.match(/<a[^>]*class="stock_item"[^>]*>([\s\S]*?)<\/a>/);
            const titleMatch = row.match(/<a[^>]*href="company_read\.naver\?[^"]*nid=(\d+)[^"]*"[^>]*>([\s\S]*?)<\/a>/);
            const brokerMatch = row.match(/<td[^>]*>([가-힣A-Za-z0-9]+(?:증권|투자증권|선물|리서치|홀딩스))<\/td>/);
            const fileMatch = row.match(/href="([^"]*(?:upload\/research\/company|stock-research\/company)[^"]*)"/);
            const dateMatch = row.match(/<td[^>]*class="date"[^>]*>([\d\.]+)<\/td>/);

            if (titleMatch && itemMatch) {
              const stockName = itemMatch[1].replace(/<[^>]+>/g, '').trim();
              const reportTitle = titleMatch[2].replace(/<[^>]+>/g, '').trim();
              const nid = titleMatch[1];
              const brokerName = brokerMatch ? brokerMatch[1].trim() : '증권사';
              const rawDate = dateMatch ? dateMatch[1].trim() : '26.08.10';
              
              // Normalize Date to YYMMDD (e.g. "26.08.10" -> "260810", "2026.08.10" -> "260810")
              const dateDigits = rawDate.replace(/[^0-9]/g, '');
              const yymmdd = dateDigits.length === 8 ? dateDigits.slice(2) : (dateDigits.length === 6 ? dateDigits : '260810');

              let pdfUrl = '';
              if (fileMatch) {
                const rawUrl = fileMatch[1].replace(/^\.?\/?/, '');
                if (rawUrl.startsWith('http')) {
                  pdfUrl = rawUrl;
                } else if (rawUrl.startsWith('stock-research') || rawUrl.startsWith('/stock-research')) {
                  pdfUrl = `https://stock.pstatic.net/${rawUrl.replace(/^\/+/, '')}`;
                } else {
                  pdfUrl = `https://ssl.pstatic.net/imgstock/${rawUrl.replace(/^\/+/, '')}`;
                }
              }

              reports.push({
                nid,
                stockName,
                reportTitle,
                brokerName,
                rawDate,
                yymmdd,
                pdfUrl
              });
            }
          }
          resolve(reports);
        } catch (err) {
          console.error('HTML parse error:', err);
          resolve([]);
        }
      });
    }).on('error', (err) => {
      console.error('Fetch error:', err);
      resolve([]);
    });
  });
}

// 2. Download Original PDF Binary from URL
function downloadOriginalPdfBinary(url) {
  return new Promise((resolve) => {
    if (!url || !url.startsWith('http')) {
      return resolve({ success: false, reason: '유효하지 않은 첨부파일 URL' });
    }

    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/pdf,application/octet-stream,*/*',
        'Referer': 'https://finance.naver.com/'
      },
      timeout: 8000
    }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307) {
        if (res.headers.location) {
          return downloadOriginalPdfBinary(res.headers.location).then(resolve);
        }
      }

      if (res.statusCode !== 200) {
        return resolve({ success: false, reason: `서버 응답 오류 (HTTP ${res.statusCode})` });
      }

      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        if (buffer.length < 100) {
          return resolve({ success: false, reason: '파일 크기 부족 (유효하지 않은 바이너리)' });
        }
        // Verify Magic Header
        if (buffer.toString('ascii', 0, 4) !== '%PDF') {
          return resolve({ success: false, reason: 'PDF 헤더 불일치 (DRM 또는 HTML 응답)' });
        }
        resolve({ success: true, buffer, size: buffer.length });
      });
    });

    req.on('error', (err) => {
      resolve({ success: false, reason: `네트워크 오류 (${err.message})` });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ success: false, reason: '다운로드 시간 초과' });
    });
  });
}

// 3. Main Collection & Archive Process
async function main() {
  const targetDir = path.join(process.cwd(), 'downloads/naver_pdfs/260810');
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  console.log('[1/3] 네이버 증권 종목분석 리포트 메타데이터 및 원본 PDF URL 추출 중...');
  const reports = await fetchNaverPage(1);

  if (reports.length === 0) {
    console.log('수집된 리포트가 없습니다.');
    return;
  }

  console.log(`[2/3] 총 ${reports.length}건의 리포트 메타데이터 식별 완료. 원본 첨부파일(PDF) 다운로드 및 네이밍 룰 적용 시작...`);

  const savedList = [];
  const failList = [];

  for (let i = 0; i < reports.length; i++) {
    const r = reports[i];

    // Naming rule: [발행일(YYMMDD)]_[증권사명]_[종목명]_[리포트제목].pdf
    const cleanBroker = r.brokerName.replace(/[/\\?%*:|"<>]/g, '').trim();
    const cleanStock = r.stockName.replace(/[/\\?%*:|"<>]/g, '').trim();
    const cleanTitle = r.reportTitle
      .replace(/[/\\?%*:|"<>]/g, '_')
      .replace(/[\r\n\t]+/g, ' ')
      .replace(/\s+/g, '_')
      .trim();

    const fileName = `${r.yymmdd}_${cleanBroker}_${cleanStock}_${cleanTitle}.pdf`;
    const targetFilePath = path.join(targetDir, fileName);

    if (!r.pdfUrl) {
      failList.push({
        stockName: r.stockName,
        brokerName: r.brokerName,
        title: r.reportTitle,
        reason: '첨부파일(PDF) 링크 미존재'
      });
      continue;
    }

    const downloadResult = await downloadOriginalPdfBinary(r.pdfUrl);

    if (downloadResult.success && downloadResult.buffer) {
      // Save Original PDF Binary directly without modification
      fs.writeFileSync(targetFilePath, downloadResult.buffer);
      savedList.push({
        fileName,
        sizeKb: (downloadResult.size / 1024).toFixed(1),
        url: r.pdfUrl
      });
    } else {
      failList.push({
        fileName,
        stockName: r.stockName,
        brokerName: r.brokerName,
        title: r.reportTitle,
        reason: downloadResult.reason || '첨부파일 URL 접근 불가'
      });
    }

    // Small delay to prevent rate limiting
    await new Promise(res => setTimeout(res, 120));
  }

  console.log('\n=============================================');
  console.log(`[처리 결과 보고서]`);
  console.log(`- 처리 건수: ${savedList.length + failList.length}건 (성공: ${savedList.length}건, 실패: ${failList.length}건)`);
  console.log(`- 저장 디렉토리: /downloads/naver_pdfs/260810/`);
  console.log('\n- 저장 완료 파일명 목록:');
  savedList.forEach((item, idx) => {
    console.log(`  ${idx + 1}. ${item.fileName} (${item.sizeKb} KB)`);
  });

  if (failList.length > 0) {
    console.log('\n- 실패 내역:');
    failList.forEach((item, idx) => {
      console.log(`  ${idx + 1}. [${item.brokerName}] ${item.stockName} - ${item.reason}`);
    });
  } else {
    console.log('\n- 실패 내역: 없음');
  }
  console.log('=============================================\n');
}

main().catch(console.error);
