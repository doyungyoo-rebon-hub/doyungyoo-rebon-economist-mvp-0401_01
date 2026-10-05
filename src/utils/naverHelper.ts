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
  if (!item) return 'https://stock.naver.com/research/company';

  // Build query params for 4-Factor Matching (StockCode + PublishDate + BrokerName + Title)
  const title = item.title || item.reportTitle || '';
  const params = new URLSearchParams();
  if (item.stockCode) params.set('stockCode', item.stockCode);
  if (item.stockName) params.set('stockName', item.stockName);
  if (item.brokerName) params.set('brokerName', item.brokerName);
  if (item.analystName) params.set('analystName', item.analystName);
  if (item.publishDate) params.set('publishDate', item.publishDate);
  if (title) params.set('title', title);
  if (item.nid) params.set('nid', String(item.nid));

  // If stockCode or stockName is present, always route through the server-side validator
  // to ensure the user lands on the EXACT stock's verified report or the stock's official research page
  if (item.stockCode || item.stockName) {
    return `/api/naver-report-redirect?${params.toString()}`;
  }

  // Fallback to stock research page if stockCode is known
  if (item.stockCode) {
    return `https://stock.naver.com/domestic/stock/${item.stockCode}/research`;
  }

  return 'https://stock.naver.com/research/company';
}

/**
 * Returns the overall company research list URL for a stock code (Modern responsive Naver page)
 */
export function getNaverCompanyListUrl(stockCode?: string): string {
  if (stockCode && stockCode.trim().length > 0) {
    return `https://stock.naver.com/domestic/stock/${stockCode.trim()}/research`;
  }
  return 'https://stock.naver.com/research/company';
}
