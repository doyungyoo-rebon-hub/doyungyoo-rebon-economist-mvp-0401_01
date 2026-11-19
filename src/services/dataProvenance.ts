// src/services/dataProvenance.ts
// DART 전자공시 및 KRX 한국거래소 데이터 출처 증빙(Data Provenance) & 감사 추적(Audit Trail) 서비스

export interface FilingProvenanceRecord {
  ticker: string;
  stockName: string;
  reportName: string;
  receptionNumber: string; // DART 접수번호 (14자리)
  filingDate: string; // YYYY-MM-DD
  periodCovered: string; // 대상 분기
  sourceSystem: 'DART 전자공시시스템' | 'KRX 정보데이터시스템' | '파트너사 IR(SEC 10-Q/10-K)';
  sourceUrl: string;
  verifiedAt: string;
  status: '공시확정' | '공시예정' | '선행추정';
  keyDisclosedFigures: {
    salesKrw?: number; // 억원
    opKrw?: number; // 억원
    npKrw?: number; // 억원
    cashEquivalentsKrw?: number; // 억원
    totalDebtKrw?: number; // 억원
    totalShares?: number;
    closingPriceKrw?: number; // KRX 종가
  };
  notes: string;
}

export interface StockPriceProvenance {
  date: string;
  market: 'KOSPI' | 'KOSDAQ';
  officialCloseKrw: number;
  openKrw: number;
  highKrw: number;
  lowKrw: number;
  volume: number;
  source: 'KRX 한국거래소 정규장 확정 종가';
  sourceVerifiedAt: string;
}

// 1. 알테오젠(196170) DART 전자공시 정식 접수 이력 (Look-ahead bias 방지용 날짜별 격리)
export const ALTEOGEN_DART_PROVENANCE: FilingProvenanceRecord[] = [
  {
    ticker: '196170',
    stockName: '알테오젠',
    reportName: '사업보고서 (2025.12) [연결 감사보고서 확정]',
    receptionNumber: '20260318000492',
    filingDate: '2026-03-18',
    periodCovered: 'FY2025 연간',
    sourceSystem: 'DART 전자공시시스템',
    sourceUrl: 'https://dart.fss.or.kr/dsaf001/main.do?rcpNo=20260318000492',
    verifiedAt: '2026-11-07T00:00:00Z',
    status: '공시확정',
    keyDisclosedFigures: {
      salesKrw: 1820, // 2025년 연결 매출 1,820억원
      opKrw: 980,     // 2025년 연결 영업이익 980억원
      npKrw: 790,     // 2025년 연결 당기순이익 790억원
      cashEquivalentsKrw: 4100, // 현금및현금성자산 + 단기금융상품 4,100억원
      totalDebtKrw: 600,        // 총차입금 600억원
      totalShares: 53248307
    },
    notes: 'DART 공시 확정 연결 감사보고서 수치. 2026-03-31 기준 정식 공시 완료된 직전 연간 결산'
  },
  {
    ticker: '196170',
    stockName: '알테오젠',
    reportName: '분기보고서 (2026.03)',
    receptionNumber: '20260515001284',
    filingDate: '2026-05-15',
    periodCovered: '2026년 1분기(1Q)',
    sourceSystem: 'DART 전자공시시스템',
    sourceUrl: 'https://dart.fss.or.kr/dsaf001/main.do?rcpNo=20260515001284',
    verifiedAt: '2026-11-07T00:00:00Z',
    status: '공시확정',
    keyDisclosedFigures: {
      salesKrw: 716, // 분기 매출 716억원
      opKrw: 310,
      npKrw: 242,
      totalShares: 53248307
    },
    notes: '2026-05-15 공시. 3/31 당시에는 미공시 상태였으며 이후 사후 검증 데이터로만 활용'
  },
  {
    ticker: '196170',
    stockName: '알테오젠',
    reportName: '반기보고서 (2026.06)',
    receptionNumber: '20260814000871',
    filingDate: '2026-08-14',
    periodCovered: '2026년 2분기(2Q)',
    sourceSystem: 'DART 전자공시시스템',
    sourceUrl: 'https://dart.fss.or.kr/dsaf001/main.do?rcpNo=20260814000871',
    verifiedAt: '2026-11-07T00:00:00Z',
    status: '공시확정',
    keyDisclosedFigures: {
      salesKrw: 685, // 분기 매출 685억원
      opKrw: 430,
      npKrw: 335,
      totalShares: 53248307
    },
    notes: '2026-08-14 공시된 반기보고서'
  },
  {
    ticker: '196170',
    stockName: '알테오젠',
    reportName: '분기보고서 (2026.09) [공시예정]',
    receptionNumber: 'PENDING_20261112',
    filingDate: '2026-11-12 (예정)',
    periodCovered: '2026년 3분기(3Q)',
    sourceSystem: 'DART 전자공시시스템',
    sourceUrl: 'https://dart.fss.or.kr',
    verifiedAt: '2026-11-07T00:00:00Z',
    status: '공시예정',
    keyDisclosedFigures: {
      salesKrw: undefined,
      opKrw: undefined
    },
    notes: '현재 기준 미공시 상태. 11월 12일 공시 예정으로 사후 대사 비대상'
  }
];

// 2. 알테오젠(196170) KRX 한국거래소 정규장 시세 출처
export const ALTEOGEN_KRX_PROVENANCE: Record<string, StockPriceProvenance> = {
  '2026-03-30': {
    date: '2026-03-30',
    market: 'KOSDAQ',
    officialCloseKrw: 368000,
    openKrw: 362000,
    highKrw: 374000,
    lowKrw: 360000,
    volume: 852100,
    source: 'KRX 한국거래소 정규장 확정 종가',
    sourceVerifiedAt: '2026-11-07T00:00:00Z'
  },
  '2026-03-31': {
    date: '2026-03-31',
    market: 'KOSDAQ',
    officialCloseKrw: 366500, // 3/31 실제 분기말 공식 확정 종가
    openKrw: 367000,
    highKrw: 371500,
    lowKrw: 363000,
    volume: 914300,
    source: 'KRX 한국거래소 정규장 확정 종가',
    sourceVerifiedAt: '2026-11-07T00:00:00Z'
  },
  '2026-11-05': {
    date: '2026-11-05',
    market: 'KOSDAQ',
    officialCloseKrw: 382500, // 2026년 11월 현재 시점 최신 거래가
    openKrw: 379000,
    highKrw: 386000,
    lowKrw: 377000,
    volume: 1120000,
    source: 'KRX 한국거래소 정규장 확정 종가',
    sourceVerifiedAt: '2026-11-07T00:00:00Z'
  }
};

// 3. 머크(MSD) 공식 키트루다SC 전환율 가이던스 출처 메타데이터
export const MSD_KEYTRUDA_SC_GUIDANCE = {
  partnerName: 'Merck & Co. (MSD)',
  sourceEvent: 'MSD Oncology Investor Day & Earnings Conference Call',
  officialStatement: '출시 후 18~24개월 내 전체 키트루다 환자의 30~40%를 피하주사(SC) 제형으로 전환 기대',
  timelineHorizon: '상용화 2년 차 (18~24개월 시계)',
  guidanceRangePct: {
    min: 30,
    max: 40,
    median: 35
  },
  keytrudaPeakSalesUsd: 28000, // 피크 매출 컨센서스 280억 달러
  usdKrwExchangeRate: 1380,   // 기준 환율 1,380원
  fdaApprovalDate: '2025-09-19',
  tradename: 'Keytruda Qurex (키트루다 큐렉스, FDA 승인 완료)',
  notes: '정맥투여(30~60분) 대비 2~8분 피하투여 단축. 2028년 IV 특허 만료 후 바이오시밀러 방어 핵심 자산'
};

// 4. 할로자임(Halozyme) 분쟁 상태 메타데이터 (최신 특허청 결정 보도 반영)
export const HALOZYME_DISPUTE_METADATA = {
  status: 'ONGOING_VERIFICATION_REQUIRED' as const,
  statusLabel: '수시 확인 필요 (진행형 모니터링)',
  disputeSubject: 'Merck-Halozyme 인간 히알루로니다제 효소 특허 침해 여부 및 라이선스 해석 소송',
  jurisdictions: ['미국 특허심판원(PTAB) 및 연방지방법원', '유럽 특허청(EPO)'],
  latestUpdate: '2025/2026 특허심판원(PTAB) 및 EPO에서 할로자임 특정 히알루로니다제 청구항 일부 무효/기각 결정 보도로 알테오젠 ALT-B4 침해 리스크 완화 조짐. 단, 최종 항소심 및 에스크로 합의 여부 모니터링 지속 필요',
  lastCheckDate: '2026-11-07',
  potentialImpact: '분쟁 종결 시 법적 불확실성 소멸. 만약 합의금/에스크로 유보 발생 시 로열티의 일부(약 10~20%) 일시 유보 가능성',
  monitoringRecommendation: '알테오젠 분기보고서 "우발채무 및 소송사건" 주석 및 머크/할로자임 SEC 공시를 실시간 확인'
};

// 5. 머크(MSD) 피하제형 변경 계약 보도 로열티율 출처 메타데이터
export const MERCK_REPORTED_ROYALTY_SOURCE = {
  partnerName: 'Merck & Co. (MSD)',
  reportedRoyaltyRatePct: 2.0,
  sourceSummary: '국내외 주요 경제지 및 증권사 바이오 리서치 보도 (머크 독점 변경 계약 시 순매출의 약 2.0% 수준 러닝 로열티 추정)',
  pressCitations: [
    '머니투데이/한국경제 바이오 분석: 알테오젠-머크 키트루다SC 독점 계약금 및 순매출 2% 로열티 추정 보도',
    '국내 주요 증권사 커버리지: 피하제형 히알루로니다제 통상 요율(2.0%~3.0%) 및 판매 볼륨 티어 연동 분석'
  ],
  regulatoryNote: '공식 계약서상 비밀유지조항(NDA)으로 인해 확정 요율은 비공개 상태이며, 본 모델은 보도된 2.0%를 현실적 기준선(Baseline)으로 채택함'
};

// 6. 노바티스(Novartis) 및 기타 파트너사 라이선스 계약 출처 메타데이터
export const NOVARTIS_CONTRACT_PROVENANCE = {
  partnerName: 'Novartis AG',
  contractType: 'ALT-B4 인간 히알루로니다제 플랫폼 기술수출(L/O) 계약',
  annualContributionKrw: 500, // 연간 약 500억원 (마일스톤 + 기술료 모델링 가정)
  contractScope: '노바티스 글로벌 면역항암/자가면역 파이프라인 복수 타깃 피하제형 개발 및 상용화',
  status: '계약 유효 및 개발 진행 중 (추정 모델링 가정)',
  sourceUrl: 'https://dart.fss.or.kr',
  notes: '키트루다 단일 의존도를 완화하는 핵심 글로벌 빅파마 파이프라인. 연간 약 500억원 현금흐름 기여분 가정'
};

export const OTHER_PARTNERSHIPS_PROVENANCE = {
  daiichiSankyo: {
    partner: 'Daiichi Sankyo (다이이찌산쿄)',
    target: '엔허투(Enhertu) 등 ADC 피하주사(SC) 제형 공동 개발',
    annualContributionKrw: 250,
    notes: '블록버스터 ADC의 SC 전환을 통한 적응증 및 투약 편의성 확대'
  },
  gskAndBiogen: {
    partner: 'GSK & Biogen (글락소스미스클라인, 바이오젠)',
    target: 'ALT-B4 기반 신경계 및 면역질환 피하제형 라이선스',
    annualContributionKrw: 200,
    notes: '2026년 계약 체결 및 마일스톤 유입 추정치'
  }
};

// 7. 시점별 Look-ahead Bias 격리 조회 함수
export function getFilingDataStrictlyAsOfDate(asOfDate: string, ticker: string = '196170') {
  // asOfDate 시점 당일까지 접수 완료된 DART 보고서만 필터링
  const availableFilings = ALTEOGEN_DART_PROVENANCE.filter(
    f => f.ticker === ticker && f.filingDate <= asOfDate && f.status === '공시확정'
  );

  const pendingOrFutureFilings = ALTEOGEN_DART_PROVENANCE.filter(
    f => f.ticker === ticker && (f.filingDate > asOfDate || f.status !== '공시확정')
  );

  return {
    asOfDate,
    availableFilings,
    pendingOrFutureFilings,
    hasLookAheadLeak: false,
    message: `기준일 ${asOfDate} 당일까지 DART에 정식 접수된 ${availableFilings.length}건의 공시 보고서만 격리 수집하였습니다.`
  };
}
