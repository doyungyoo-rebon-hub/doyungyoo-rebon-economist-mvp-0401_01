export interface PdfDownloadOptions {
  url?: string;
  pdfUrl?: string;
  stockName?: string;
  brokerName?: string;
  stockCode?: string;
  publishDate?: string;
  title?: string;
  analystName?: string;
  summary?: string;
  targetPrice?: number;
  currentPrice?: number;
  rating?: string;
  sector?: string;
  objectivityScore?: number;
  fileName?: string;
}

/**
 * Robust in-browser blob downloader compatible with iframe sandboxes
 */
export async function downloadBlobFile(
  url: string,
  defaultFileName: string
): Promise<{ success: boolean; error?: string; fileName?: string }> {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      let errMsg = `다운로드 실패 (HTTP ${res.status})`;
      try {
        const errJson = await res.json();
        if (errJson.error) errMsg = errJson.error;
      } catch {}
      throw new Error(errMsg);
    }

    // Check if the response returned an error JSON payload
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json') && !defaultFileName.endsWith('.json')) {
      const errJson = await res.json();
      throw new Error(errJson.error || '서버 오류로 인해 파일을 생성할 수 없습니다.');
    }

    // Extract filename from Content-Disposition if present
    let finalFileName = defaultFileName;
    const disposition = res.headers.get('content-disposition');
    if (disposition) {
      const utf8Match = disposition.match(/filename\*=UTF-8''([^;]+)/i);
      const quotedMatch = disposition.match(/filename="?([^";]+)"?/i);
      if (utf8Match && utf8Match[1]) {
        try {
          finalFileName = decodeURIComponent(utf8Match[1]);
        } catch {}
      } else if (quotedMatch && quotedMatch[1]) {
        try {
          finalFileName = decodeURIComponent(quotedMatch[1]);
        } catch {
          finalFileName = quotedMatch[1];
        }
      }
    }

    const blob = await res.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = finalFileName;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(() => {
      window.URL.revokeObjectURL(blobUrl);
    }, 15000);

    return { success: true, fileName: finalFileName };
  } catch (err: any) {
    console.error('downloadBlobFile error:', err);
    return { success: false, error: err.message || '파일 다운로드 중 오류가 발생했습니다.' };
  }
}

export async function triggerPdfDownload(
  arg1: string | PdfDownloadOptions,
  arg2?: string
): Promise<void> {
  let downloadUrl = '';
  let fileName = 'report.pdf';

  if (typeof arg1 === 'string') {
    downloadUrl = arg1;
    fileName = arg2 || 'report.pdf';
  } else {
    const opts = arg1;
    const stockName = opts.stockName || '종목';
    const brokerName = opts.brokerName || '증권사';
    const stockCode = opts.stockCode || '000000';
    const publishDate = (opts.publishDate || '2026-01-15').replace(/[\.\/]/g, '-');
    fileName = opts.fileName || `${stockName}_${brokerName}_${stockCode}_${publishDate}.pdf`;

    const queryParams = new URLSearchParams({
      url: opts.url || opts.pdfUrl || '',
      stockName,
      brokerName,
      stockCode,
      publishDate,
      title: opts.title || '',
      analystName: opts.analystName || '',
      summary: opts.summary || '',
      targetPrice: String(opts.targetPrice || 0),
      currentPrice: String(opts.currentPrice || 0),
      rating: opts.rating || 'BUY',
      sector: opts.sector || '',
      objectivityScore: String(opts.objectivityScore || 92)
    });

    downloadUrl = `/api/download-report-pdf?${queryParams.toString()}`;
  }

  const result = await downloadBlobFile(downloadUrl, fileName);
  if (!result.success) {
    throw new Error(result.error || 'PDF 파일을 다운로드하지 못했습니다.');
  }
}

