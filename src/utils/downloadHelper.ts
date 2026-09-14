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

  try {
    const res = await fetch(downloadUrl);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const blob = await res.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(() => {
      window.URL.revokeObjectURL(blobUrl);
    }, 10000);
  } catch (err) {
    console.warn('Blob download failed, attempting direct link fallback:', err);
    window.open(downloadUrl, '_blank');
  }
}
