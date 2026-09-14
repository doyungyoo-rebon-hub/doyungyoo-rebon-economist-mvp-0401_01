/**
 * Naver Finance Research Helper
 * Resolves direct company_read individual report URLs
 */

export interface NaverLinkableItem {
  nid?: string | number;
  reportUrl?: string;
  stockCode?: string;
  stockName?: string;
  title?: string;
  reportTitle?: string;
  brokerName?: string;
  analystName?: string;
  publishDate?: string;
}

/**
 * Returns the exact direct URL for an individual analyst research report on Naver Finance.
 * Uses 4-Factor Matching (Stock Code + Publish Date + Broker Name + Analyst/Title)
 * to resolve the exact individual company_read page.
 */
export function getNaverReportUrl(item: NaverLinkableItem | null | undefined): string {
  if (!item) return 'https://finance.naver.com/research/company_list.naver';

  // If item has a verified nid and stockCode is known, we can construct direct URL or redirect with verification
  const title = item.title || item.reportTitle || '';
  const params = new URLSearchParams();
  if (item.stockCode) params.set('stockCode', item.stockCode);
  if (item.stockName) params.set('stockName', item.stockName);
  if (item.brokerName) params.set('brokerName', item.brokerName);
  if (item.analystName) params.set('analystName', item.analystName);
  if (item.publishDate) params.set('publishDate', item.publishDate);
  if (title) params.set('title', title);
  if (item.nid) params.set('nid', String(item.nid));

  // If all key factors (stockCode and brokerName or publishDate) are present, use the 4-factor resolver
  if (item.stockCode && (item.brokerName || item.publishDate)) {
    return `/api/naver-report-redirect?${params.toString()}`;
  }

  // Direct NID if available and no conflicting stockCode
  if (item.nid && String(item.nid).trim().length > 0) {
    return `https://finance.naver.com/research/company_read.naver?nid=${item.nid}`;
  }

  // Direct read URL already in reportUrl
  if (item.reportUrl && item.reportUrl.includes('company_read.naver')) {
    return item.reportUrl;
  }

  if (params.toString().length > 0) {
    return `/api/naver-report-redirect?${params.toString()}`;
  }

  return 'https://finance.naver.com/research/company_list.naver';
}

/**
 * Returns the overall company research list URL for a stock code (if user explicitly wants the whole list)
 */
export function getNaverCompanyListUrl(stockCode?: string): string {
  if (stockCode && stockCode.trim().length > 0) {
    return `https://finance.naver.com/research/company_list.naver?searchType=itemCode&itemCode=${stockCode.trim()}`;
  }
  return 'https://finance.naver.com/research/company_list.naver';
}
