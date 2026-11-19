/**
 * dateAndReportUtils.ts
 * 
 * 평가 기간 및 네이버 증권 리포트 데이터 파싱·결측치 처리·통계 유틸리티
 * 
 * [요구 사항 준수]
 * 1. 전체 타겟 기간: 2025년 11월 1일 ~ 2026년 10월 30일 (장 마감)
 * 2. 현재 수집 조건: 2025년 11월 1일 ~ 2026년 9월 30일 (경계값 11/1 및 9/30 엄수)
 * 3. 날짜 형식(YYYY-MM-DD) 변환 및 예외 처리
 * 4. 증권사/애널리스트 결측치 보정 (미상/누락 방지)
 * 5. 원본 리포트 링크(URL) 및 3대 핵심 지표(총 리포트 수, 고유 애널리스트 수, 고유 증권사 수) 계산
 */

export const TARGET_COLLECTION_CONFIG = {
  totalTargetPeriod: '2025년 11월 1일 ~ 2026년 10월 30일 (장 마감)',
  currentCollectionPeriod: '2025년 11월 1일 ~ 2026년 10월 30일 (장 마감 전수)',
  minAllowedDate: '2025-11-01',
  maxAllowedDate: '2026-10-30',
  fullTargetEndDate: '2026-10-30',
  allowedMonths: [
    '2025-11',
    '2025-12',
    '2026-01',
    '2026-02',
    '2026-03',
    '2026-04',
    '2026-05',
    '2026-06',
    '2026-07',
    '2026-08',
    '2026-09',
    '2026-10'
  ],
  pendingMonths: []
};

/**
 * 날짜 문자열을 엄격한 YYYY-MM-DD 형식으로 변환 및 예외 처리
 */
export function normalizeDateToStandard(d: any): string {
  if (!d) return '2025-11-01';
  const str = String(d).trim();
  
  // 1. 이미 YYYY-MM-DD 형식인 경우
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    return str;
  }
  // 2. ISO 포맷 (2025-11-01T...)
  if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
    return str.slice(0, 10);
  }
  // 3. 점 구분자 (2025.11.01 또는 25.11.01)
  const dotParts = str.split('.');
  if (dotParts.length === 3) {
    const yrRaw = dotParts[0].trim();
    const yr = yrRaw.length === 2 ? `20${yrRaw}` : yrRaw;
    const mo = dotParts[1].trim().padStart(2, '0');
    const da = dotParts[2].trim().padStart(2, '0');
    return `${yr}-${mo}-${da}`;
  }
  // 4. 슬래시 구분자 (2025/11/01)
  const slashParts = str.split('/');
  if (slashParts.length === 3) {
    const yrRaw = slashParts[0].trim();
    const yr = yrRaw.length === 2 ? `20${yrRaw}` : yrRaw;
    const mo = slashParts[1].trim().padStart(2, '0');
    const da = slashParts[2].trim().padStart(2, '0');
    return `${yr}-${mo}-${da}`;
  }
  // 5. 숫자 연속형 (YYYYMMDD: 20251101, YYMMDD: 251101)
  const digits = str.replace(/[^0-9]/g, '');
  if (digits.length === 8) {
    return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
  }
  if (digits.length === 6) {
    return `20${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(4, 6)}`;
  }

  // 예외 상황 fallback
  return '2025-11-01';
}

/**
 * 증권사명 결측치 및 표기 정규화
 */
export function cleanseBrokerName(broker: any): string {
  if (!broker || typeof broker !== 'string') return '독립리서치';
  const trimmed = broker.trim();
  if (
    trimmed === '' || 
    trimmed === '증권사' || 
    trimmed === 'N/A' || 
    trimmed === 'null' || 
    trimmed === 'undefined' ||
    trimmed === '미상'
  ) {
    return '독립리서치';
  }
  return trimmed;
}

/**
 * 애널리스트명 결측치 및 표기 정규화
 */
export function cleanseAnalystName(analyst: any): string {
  if (!analyst || typeof analyst !== 'string') return '기업분석팀';
  const trimmed = analyst.trim();
  if (
    trimmed === '' || 
    trimmed === '연구원' || 
    trimmed === 'N/A' || 
    trimmed === 'null' || 
    trimmed === 'undefined' ||
    trimmed === '미상' ||
    trimmed === '-'
  ) {
    return '기업분석팀';
  }
  return trimmed;
}

/**
 * 구형 외부 네이버 리서치 단건/목록 URL 여부 판별
 */
export function isLegacyExternalNaverUrl(url?: string | null): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  return (
    trimmed.includes('finance.naver.com/research/') ||
    trimmed.includes('stock.naver.com/research/company/')
  );
}

/**
 * 앱 내부 정규 PDF 원문 뷰어/다운로드 스트림 URL 생성
 */
export function buildInternalReportPdfUrl(
  report: {
    id?: string;
    nid?: string | number;
    stockName?: string;
    stockCode?: string;
    brokerName?: string;
    analystName?: string;
    sector?: string;
    reportTitle?: string;
    title?: string;
    publishDate?: string;
    date?: string;
    targetPrice?: number;
    currentPrice?: number;
    currentPriceAtPublish?: number;
    investmentOpinion?: string;
    rating?: string;
    pdfUrl?: string;
  },
  mode: 'inline' | 'download' = 'inline'
): string {
  if (
    report.pdfUrl &&
    report.pdfUrl.startsWith('http') &&
    !isLegacyExternalNaverUrl(report.pdfUrl)
  ) {
    return report.pdfUrl;
  }

  const endpoint =
    mode === 'download'
      ? '/api/pipeline-01/download-pdf-stream'
      : '/api/pipeline-01/view-pdf-stream';

  const existingQuery =
    report.pdfUrl && report.pdfUrl.startsWith('/api/') && report.pdfUrl.includes('?')
      ? report.pdfUrl.slice(report.pdfUrl.indexOf('?') + 1)
      : '';

  const params = new URLSearchParams(existingQuery);
  const setIfValid = (key: string, val?: string | number | null) => {
    if (val === undefined || val === null) return;
    const str = String(val).trim();
    if (!str || str === 'undefined' || str === 'null') return;
    params.set(key, str);
  };

  const rawNid =
    report.nid ||
    (report.id ? String(report.id).replace(/^rep_/, '') : '');
  const pubDate = report.publishDate || report.date || '';
  const stdDate = pubDate ? normalizeDateToStandard(pubDate) : '';
  const yymmdd = stdDate ? stdDate.replace(/-/g, '').slice(2, 8) : '';
  const title = report.reportTitle || report.title || '';

  setIfValid('nid', rawNid);
  setIfValid('stockName', report.stockName);
  setIfValid('stockCode', report.stockCode);
  setIfValid('brokerName', report.brokerName);
  setIfValid('title', title);
  setIfValid('date', stdDate);
  setIfValid('yymmdd', yymmdd);
  if (report.targetPrice && Number(report.targetPrice) > 0) {
    setIfValid('targetPrice', report.targetPrice);
  }
  const curPrice = report.currentPrice || report.currentPriceAtPublish;
  if (curPrice && Number(curPrice) > 0) {
    setIfValid('currentPrice', curPrice);
  }
  setIfValid('investmentOpinion', report.investmentOpinion || report.rating);
  setIfValid('analystName', report.analystName);
  setIfValid('sector', report.sector);
  if (report.stockName && report.brokerName && title) {
    setIfValid(
      'fileName',
      `${yymmdd || '260228'}_${report.brokerName}_${report.stockName}_${title}.pdf`
    );
  }

  const qs = params.toString();
  return qs ? `${endpoint}?${qs}` : endpoint;
}

/**
 * 리포트 원문 스트림 링크(URL) 보장 생성 (구형 외부 빈 화면 링크 차단)
 */
export function buildNaverReportUrl(
  nid: any,
  stockCode?: string,
  extra?: {
    stockName?: string;
    brokerName?: string;
    reportTitle?: string;
    publishDate?: string;
    targetPrice?: number;
    analystName?: string;
    sector?: string;
  }
): string {
  const nidStr =
    nid && String(nid).trim() !== 'undefined' && String(nid).trim() !== 'null'
      ? String(nid).trim()
      : '';
  const codeStr =
    stockCode &&
    String(stockCode).trim() !== 'undefined' &&
    String(stockCode).trim() !== 'null' &&
    String(stockCode).trim() !== '000000'
      ? String(stockCode).trim()
      : '';

  return buildInternalReportPdfUrl(
    {
      nid: nidStr,
      stockCode: codeStr,
      ...(extra || {}),
    },
    'inline'
  );
}

/**
 * 표준 리포트 PDF 저장 파일명 생성 (YYMMDD_증권사_종목명_제목.pdf)
 */
export function buildStandardPdfFileName(report: {
  stockName?: string;
  brokerName?: string;
  reportTitle?: string;
  title?: string;
  publishDate?: string;
  date?: string;
}): string {
  const pubDate = report.publishDate || report.date || '';
  const stdDate = pubDate ? normalizeDateToStandard(pubDate) : '2026-02-28';
  const yymmdd = stdDate.replace(/-/g, '').slice(2, 8) || '260228';
  const broker = cleanseBrokerName(report.brokerName);
  const stock = (report.stockName || '종목').trim();
  const rawTitle = (report.reportTitle || report.title || '종목분석_리포트')
    .replace(/[\\/:*?"<>|]+/g, '_')
    .replace(/\s+/g, '_')
    .slice(0, 48);
  return `${yymmdd}_${broker}_${stock}_${rawTitle}.pdf`;
}

/**
 * 새 탭 이탈 및 크롬 샌드박스 플러그인 차단 없이 즉시 로컬 PDF 파일 다운로드 실행
 */
export async function downloadReportPdfDirectly(report: {
  id?: string;
  nid?: string | number;
  stockName?: string;
  stockCode?: string;
  brokerName?: string;
  analystName?: string;
  sector?: string;
  reportTitle?: string;
  title?: string;
  publishDate?: string;
  date?: string;
  targetPrice?: number;
  currentPrice?: number;
  currentPriceAtPublish?: number;
  investmentOpinion?: string;
  rating?: string;
  pdfUrl?: string;
}): Promise<boolean> {
  const downloadUrl = buildInternalReportPdfUrl(report, 'download');
  const fileName = buildStandardPdfFileName(report);
  try {
    const res = await fetch(downloadUrl, {
      method: 'GET',
      credentials: 'include',
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const arrayBuffer = await res.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
    const blobUrl = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = blobUrl;
    anchor.download = fileName;
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
    }, 10000);
    return true;
  } catch (err) {
    console.error('Direct PDF Blob download failed:', err);
    return false;
  }
}

export interface NaverOriginalLinkInfo {
  url: string;
  matchedType: 'EXACT_REPORT' | 'STOCK_RESEARCH_TAB';
  matchedNid?: string;
  matchedTitle?: string;
  matchedDate?: string;
  matchedBroker?: string;
  loading?: boolean;
}

export function getNaverLinkButtonMeta(
  info: NaverOriginalLinkInfo,
  stockName?: string,
  brokerName?: string
): {
  label: string;
  tooltip: string;
  colorClass: string;
} {
  if (info.loading) {
    return {
      label: '네이버 링크 확인 중...',
      tooltip: `${stockName || '해당 종목'} 네이버페이 증권 등재 원문 매칭 여부를 확인 중입니다.`,
      colorClass:
        'bg-slate-800/85 hover:bg-slate-700/85 text-slate-300 border border-slate-700',
    };
  }
  if (info.matchedType === 'EXACT_REPORT') {
    const brokerLabel = info.matchedBroker || brokerName || '증권사';
    const titleLabel = info.matchedTitle || '단건 리포트 원문';
    const dateSuffix = info.matchedDate ? ` · ${info.matchedDate}` : '';
    return {
      label: '네이버 단건 원문',
      tooltip: `네이버페이 증권 단건 원문 직결: [${brokerLabel}] ${titleLabel}${dateSuffix} (새 탭)`,
      colorClass:
        'bg-[#03C75A]/20 hover:bg-[#03C75A]/30 text-[#22e57a] border border-[#03C75A]/45',
    };
  }
  return {
    label: '네이버 종목 리서치 목록',
    tooltip: `해당 증권사 단건 미등재 — ${stockName || '해당 종목'} 네이버페이 증권 종목별 리서치 목록 열기 (새 탭)`,
    colorClass:
      'bg-slate-800/90 hover:bg-slate-700/90 text-cyan-300 border border-cyan-500/35',
  };
}

const naverOriginalLinkClientCache = new Map<string, NaverOriginalLinkInfo>();

/**
 * 종목별 네이버페이 증권 리서치 탭 목록 기본 URL 생성 (빈 화면 0% 보장 폴백)
 */
export function buildNaverStockResearchTabUrl(stockCode?: string | null): string {
  const cleaned = stockCode ? String(stockCode).trim() : '';
  if (
    cleaned &&
    cleaned !== '000000' &&
    cleaned !== 'undefined' &&
    cleaned !== 'null'
  ) {
    return `https://stock.naver.com/domestic/stock/${encodeURIComponent(cleaned)}/research`;
  }
  return 'https://stock.naver.com/research/company';
}

/**
 * 실시간 네이버페이 증권 v2 단건 매칭 및 종목별 리서치 목록 폴백 URL 해석기
 */
export async function resolveNaverOriginalUrl(
  report: {
    id?: string;
    nid?: string | number;
    stockCode?: string;
    stockName?: string;
    brokerName?: string;
    publishDate?: string;
    date?: string;
    reportTitle?: string;
    title?: string;
  },
  signal?: AbortSignal
): Promise<NaverOriginalLinkInfo> {
  const fallbackUrl = buildNaverStockResearchTabUrl(report.stockCode);
  const rawNid =
    report.nid || (report.id ? String(report.id).replace(/^rep_/, '') : '');
  const pubDate = report.publishDate || report.date || '';
  const stdDate = pubDate ? normalizeDateToStandard(pubDate) : '';
  const title = report.reportTitle || report.title || '';
  const cacheKey = `v2|${report.stockCode || ''}|${rawNid}|${report.brokerName || ''}|${stdDate}|${title}`;

  const cached = naverOriginalLinkClientCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const params = new URLSearchParams();
    if (rawNid) params.set('nid', String(rawNid));
    if (report.stockCode) params.set('stockCode', String(report.stockCode).trim());
    if (report.stockName) params.set('stockName', String(report.stockName).trim());
    if (report.brokerName) params.set('brokerName', String(report.brokerName).trim());
    if (stdDate) params.set('publishDate', stdDate);
    if (title) params.set('title', title);

    const res = await fetch(`/api/naver-original-url?${params.toString()}`, {
      method: 'GET',
      credentials: 'include',
      signal,
    });
    if (res.ok) {
      const data = await res.json();
      if (data && typeof data.url === 'string' && data.url.startsWith('https://')) {
        const resolved: NaverOriginalLinkInfo = {
          url: data.url,
          matchedType:
            data.matchedType === 'EXACT_REPORT'
              ? 'EXACT_REPORT'
              : 'STOCK_RESEARCH_TAB',
          matchedNid: data.matchedNid,
          matchedTitle: data.matchedTitle,
          matchedDate: data.matchedDate,
          matchedBroker: data.matchedBroker,
          loading: false,
        };
        naverOriginalLinkClientCache.set(cacheKey, resolved);
        return resolved;
      }
    }
  } catch (err: any) {
    if (err?.name === 'AbortError') {
      return {
        url: fallbackUrl,
        matchedType: 'STOCK_RESEARCH_TAB',
        loading: false,
      };
    }
  }

  const fallbackInfo: NaverOriginalLinkInfo = {
    url: fallbackUrl,
    matchedType: 'STOCK_RESEARCH_TAB',
    loading: false,
  };
  naverOriginalLinkClientCache.set(cacheKey, fallbackInfo);
  return fallbackInfo;
}

/**
 * 리포트 목록으로부터 요구 지표 3종(총 리포트 수, 고유 애널리스트 수, 고유 증권사 수) 산출
 */
export function calculateReportMetrics(reports: Array<{
  analystName?: string;
  brokerName?: string;
  publishDate?: string;
  [key: string]: any;
}>) {
  const totalReports = reports.length;
  const uniqueAnalysts = new Set<string>();
  const uniqueBrokers = new Set<string>();

  reports.forEach(r => {
    const a = cleanseAnalystName(r.analystName);
    if (a && a !== '기업분석팀' && a !== '리서치센터') {
      uniqueAnalysts.add(a);
    } else if (a) {
      uniqueAnalysts.add(a);
    }
    const b = cleanseBrokerName(r.brokerName);
    if (b) {
      uniqueBrokers.add(b);
    }
  });

  return {
    totalReports,
    activeAnalystsCount: uniqueAnalysts.size,
    activeBrokersCount: uniqueBrokers.size,
    targetPeriod: TARGET_COLLECTION_CONFIG
  };
}

/**
 * 날짜가 수집 조건(2025-11-01 <= date <= 2026-10-30)에 포함되는지 검증 (경계값 포함)
 */
export function isWithinCollectionScope(publishDate: string): boolean {
  const stdDate = normalizeDateToStandard(publishDate);
  return (
    stdDate >= TARGET_COLLECTION_CONFIG.minAllowedDate && 
    stdDate <= TARGET_COLLECTION_CONFIG.maxAllowedDate
  );
}
