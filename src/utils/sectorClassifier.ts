import { STANDARD_10_SECTORS, getCanonicalSector } from '../types.ts';
import { KOREAN_ALL_STOCKS } from '../data/koreanStocks.ts';

export { STANDARD_10_SECTORS };

export function classifyKrxStockSector(stockName: string, stockCode?: string): string {
  if (stockCode) {
    const found = KOREAN_ALL_STOCKS.find(s => s.code === stockCode);
    if (found) return found.sector;
  }
  if (stockName) {
    const foundByName = KOREAN_ALL_STOCKS.find(s => s.name.toLowerCase() === stockName.toLowerCase());
    if (foundByName) return foundByName.sector;
  }
  return getCanonicalSector(stockName);
}
