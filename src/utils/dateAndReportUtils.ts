/**
 * dateAndReportUtils.ts
 * 
 * 평가 기간 및 네이버 증권 리포트 데이터 파싱·결측치 처리·통계 유틸리티
 * 
 * [요구 사항 준수]
 * 1. 전체 타겟 기간: 2025년 11월 1일 ~ 2026년 10월 31일
 * 2. 현재 수집 조건: 2025년 11월 1일 ~ 2026년 9월 30일 (경계값 11/1 및 9/30 엄수)
 * 3. 날짜 형식(YYYY-MM-DD) 변환 및 예외 처리
 * 4. 증권사/애널리스트 결측치 보정 (미상/누락 방지)
 * 5. 원본 리포트 링크(URL) 및 3대 핵심 지표(총 리포트 수, 고유 애널리스트 수, 고유 증권사 수) 계산
 */

export const TARGET_COLLECTION_CONFIG = {
  totalTargetPeriod: '2025년 11월 1일 ~ 2026년 10월 31일',
  currentCollectionPeriod: '2025년 11월 1일 ~ 2026년 9월 30일',
  minAllowedDate: '2025-11-01',
  maxAllowedDate: '2026-09-30',
  fullTargetEndDate: '2026-10-31',
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
    '2026-09'
  ],
  pendingMonths: ['2026-10']
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
 * 네이버 증권 원본 리포트 링크(URL) 보장 생성
 */
export function buildNaverReportUrl(nid: any, stockCode?: string): string {
  const nidStr = nid ? String(nid).trim() : '';
  if (nidStr && nidStr !== 'undefined' && nidStr !== 'null') {
    return `https://finance.naver.com/research/company_read.naver?nid=${encodeURIComponent(nidStr)}`;
  }
  const codeStr = stockCode ? String(stockCode).trim() : '';
  if (codeStr && codeStr !== 'undefined' && codeStr !== 'null' && codeStr !== '000000') {
    return `https://finance.naver.com/research/company_list.naver?searchType=itemCode&itemCode=${encodeURIComponent(codeStr)}`;
  }
  return 'https://finance.naver.com/research/company_list.naver';
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
 * 날짜가 수집 조건(2025-11-01 <= date <= 2026-09-30)에 포함되는지 검증 (경계값 포함)
 */
export function isWithinCollectionScope(publishDate: string): boolean {
  const stdDate = normalizeDateToStandard(publishDate);
  return (
    stdDate >= TARGET_COLLECTION_CONFIG.minAllowedDate && 
    stdDate <= TARGET_COLLECTION_CONFIG.maxAllowedDate
  );
}
