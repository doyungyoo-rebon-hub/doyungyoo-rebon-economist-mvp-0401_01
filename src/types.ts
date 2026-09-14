export const STANDARD_12_SECTORS = [
  '반도체/디스플레이',
  '2차전지/배터리/소재',
  '바이오/제약/헬스케어',
  '자동차/모빌리티',
  '조선/중공업/방산',
  'IT/모바일/전자',
  '플랫폼/게임/엔터',
  '금융/지주',
  '화학/정유/에너지',
  '철강/금속/소재',
  '소비재/유통/음식료',
  '건설/물류/기타',
] as const;

export type Standard12Sector = typeof STANDARD_12_SECTORS[number];

export type SectorCategory =
  | Standard12Sector
  | '섹터 구분 필요'
  | '미분류'
  | '기타';

export function getCanonicalSector(sector: string | undefined): SectorCategory {
  if (!sector || sector === '미분류' || sector === '섹터 구분 필요' || sector === '기타') {
    return '섹터 구분 필요';
  }
  const norm = sector.replace(/\s+/g, '').toLowerCase();

  // 1. 반도체/디스플레이
  if (norm.includes('반도체') || norm.includes('디스플레이') || norm.includes('hbm') || norm.includes('파운드리') || norm.includes('메모리') || norm.includes('oled') || norm.includes('웨이퍼') || norm.includes('fab')) {
    return '반도체/디스플레이';
  }
  // 2. 2차전지/배터리/소재
  if (norm.includes('2차전지') || norm.includes('배터리') || norm.includes('양극재') || norm.includes('음극재') || norm.includes('리튬') || norm.includes('분리막') || norm.includes('전해액') || norm.includes('전고체')) {
    return '2차전지/배터리/소재';
  }
  // 3. 바이오/제약/헬스케어
  if (norm.includes('바이오') || norm.includes('제약') || norm.includes('헬스케어') || norm.includes('cdmo') || norm.includes('의료') || norm.includes('신약') || norm.includes('임상') || norm.includes('의약품') || norm.includes('진단')) {
    return '바이오/제약/헬스케어';
  }
  // 4. 자동차/모빌리티
  if (norm.includes('자동차') || norm.includes('모빌리티') || norm.includes('완성차') || norm.includes('전장') || norm.includes('자율주행') || norm.includes('현대차') || norm.includes('기아') || norm.includes('모비스') || norm.includes('타이어') || norm.includes('부품')) {
    return '자동차/모빌리티';
  }
  // 5. 조선/중공업/방산
  if (norm.includes('조선') || norm.includes('중공업') || norm.includes('방산') || norm.includes('해양엔지니어링') || norm.includes('함정') || norm.includes('mro') || norm.includes('한화에어로') || norm.includes('한국항공우주') || norm.includes('lignex1') || norm.includes('현대로템') || norm.includes('hd현대')) {
    return '조선/중공업/방산';
  }
  // 6. IT/모바일/전자
  if (norm.includes('it/모바일') || norm.includes('모바일') || norm.includes('전자') || norm.includes('스마트폰') || norm.includes('pcb') || norm.includes('fpcb') || norm.includes('통신장비') || norm.includes('하드웨어') || norm.includes('네트워크') || norm.includes('ai서버')) {
    return 'IT/모바일/전자';
  }
  // 7. 플랫폼/게임/엔터
  if (norm.includes('플랫폼') || norm.includes('게임') || norm.includes('엔터') || norm.includes('미디어') || norm.includes('콘텐츠') || norm.includes('포털') || norm.includes('웹툰') || norm.includes('드라마') || norm.includes('음원') || norm.includes('소프트웨어') || norm.includes('sw')) {
    return '플랫폼/게임/엔터';
  }
  // 8. 금융/지주
  if (norm.includes('금융') || norm.includes('지주') || norm.includes('지주사') || norm.includes('은행') || norm.includes('증권') || norm.includes('보험') || norm.includes('카드') || norm.includes('캐피탈') || norm.includes('홀딩스')) {
    return '금융/지주';
  }
  // 9. 화학/정유/에너지
  if (norm.includes('화학') || norm.includes('정유') || norm.includes('석유화학') || norm.includes('에너지') || norm.includes('태양광') || norm.includes('풍력') || norm.includes('s-oil') || norm.includes('sk이노') || norm.includes('원자력')) {
    return '화학/정유/에너지';
  }
  // 10. 철강/금속/소재
  if (norm.includes('철강') || norm.includes('금속') || norm.includes('제철') || norm.includes('알루미늄') || norm.includes('동박') || norm.includes('광물') || norm.includes('포스코') || norm.includes('고려아연')) {
    return '철강/금속/소재';
  }
  // 11. 소비재/유통/음식료
  if (norm.includes('소비재') || norm.includes('유통') || norm.includes('음식료') || norm.includes('식품') || norm.includes('화장품') || norm.includes('패션') || norm.includes('의류') || norm.includes('백화점') || norm.includes('면세점') || norm.includes('마트') || norm.includes('편의점') || norm.includes('면류') || norm.includes('라면')) {
    return '소비재/유통/음식료';
  }
  // 12. 건설/물류/기타
  if (norm.includes('건설') || norm.includes('물류') || norm.includes('운송') || norm.includes('해운') || norm.includes('항공') || norm.includes('건자재') || norm.includes('시멘트') || norm.includes('인프라')) {
    return '건설/물류/기타';
  }

  return '섹터 구분 필요';
}

export function isSectorMatch(sectorInReport: string | undefined, filterCategoryKey: string): boolean {
  if (!filterCategoryKey || filterCategoryKey === 'ALL' || filterCategoryKey === '전체' || filterCategoryKey === '전체 분야' || filterCategoryKey === '전체 섹터') return true;
  if (!sectorInReport) return filterCategoryKey === '섹터 구분 필요' || filterCategoryKey === '미분류';

  if (filterCategoryKey === '섹터 구분 필요' || filterCategoryKey === '미분류') {
    return !sectorInReport || sectorInReport === '섹터 구분 필요' || sectorInReport === '미분류' || sectorInReport === '기타';
  }

  if (sectorInReport === filterCategoryKey) return true;
  const canonical = getCanonicalSector(sectorInReport);
  if (canonical === filterCategoryKey) return true;

  const normR = sectorInReport.replace(/\s+/g, '').toLowerCase();
  const normF = filterCategoryKey.replace(/\s+/g, '').toLowerCase();
  return normR.includes(normF) || normF.includes(normR);
}

export type IndustryCyclicalPhase = 'RECOVERY' | 'EXPANSION' | 'PEAK' | 'SLOWDOWN';
export type MarketPosition = 'LEADER' | 'CHALLENGER' | 'NICHE' | 'NEUTRAL';

export interface SectorAnalysisInfo {
  sectorName: SectorCategory;
  subIndustry: string; // 세부 산업 (예: HBM 메모리, 함정/MRO, 양극재, ADC 신약)
  marketPosition?: MarketPosition; // 업종 내 기업 위치 (선도/추격/틈새 등)
  industryCyclicalPhase?: IndustryCyclicalPhase; // 산업 주기 (회복기/확장기/호황기/둔화기)
  sectorMomentumScore?: number; // 0 - 100
  sectorKeyDrivers?: string[]; // 핵심 섹터 드라이버
  sectorKeywords?: string[]; // 추출된 도메인 키워드
  extractionConfidence?: number; // 0 - 100%
  extractionMethod?: 'AI_LLM' | 'HEURISTIC_RULE' | 'HYBRID';
}

export type InvestmentRating = 'STRONG_BUY' | 'BUY' | 'HOLD' | 'SELL';

export interface Broker {
  id: string;
  name: string; // e.g. 미래에셋증권, 한국투자증권
  logoUrl?: string;
  reportCount: number;
  lastSyncTime: string;
  status: 'active' | 'syncing' | 'idle' | 'error';
  accuracyRate: number; // e.g. 84.5%
}

export const NAVER_BROKER_LIST = [
  'BNK투자증권',
  'DB금융투자',
  'DS투자증권',
  'IBK투자증권',
  'iM증권',
  'KB증권',
  'KTB투자증권',
  'NH투자증권',
  'NICE평가정보',
  'SCI평가정보',
  'SK증권',
  '골든브릿지투자증권',
  '교보증권',
  '나이스디앤비',
  '다올투자증권',
  '대신증권',
  '메리츠증권',
  '미래에셋증권',
  '부국증권',
  '삼성증권',
  '상상인증권',
  '신영증권',
  '신한투자증권',
  '유진투자증권',
  '유안타증권',
  '이베스트투자증권',
  '키움증권',
  '하나증권',
  '하이투자증권',
  '한국투자증권',
  '한화투자증권',
  '현대차증권',
] as const;

export interface Analyst {
  id: string;
  name: string; // e.g. 김선우
  brokerId: string;
  brokerName: string;
  sector: SectorCategory;
  avatarUrl: string;
  totalReports: number;
  
  // Profile & Status
  jobTitle?: string; // e.g. 수석연구원, 리서치센터장, 팀장
  yearsOfExperience?: number; // e.g. 14
  badgeTitle?: string; // e.g. 2026 베스트 애널리스트 1위
  isBookmarked?: boolean; // 관심 애널리스트 등록 여부
  
  // Evaluation Metrics
  overallRank: number; // 종합 순위
  sectorRank: number;  // 부문별 순위
  overallScore: number; // 0 - 100
  
  returnRate: number; // 평균 수익률 %
  totalProfitAmount: number; // 가상 누적 수익금액 (억원)
  targetPriceHitRate: number; // 목표가 적중률 %
  aiObjectivityScore: number; // AI 객관성/공정성 점수 (0 - 100)
  logicIntegrityScore: number; // 논리 정밀도 점수 (0 - 100)
  innovationScore: number; // 혁신성 점수 (0 - 100)

  // 5대 요소: 투자의견 분포 (도넛 차트)
  ratingDistribution?: {
    buy: number; // e.g. 78 (%)
    hold: number; // e.g. 18 (%)
    sell: number; // e.g. 4 (%)
    strongBuy?: number;
  };

  // 5대 요소: 커버리지 종목 리스트
  coverages?: Array<{
    stockCode: string;
    stockName: string;
    currentPrice: number;
    targetPrice: number;
    accuracyRate: number;
    sector: string;
    logoUrl?: string;
    returnRate: number;
    isTopPick?: boolean;
  }>;

  // 5대 요소: 미디어 활동 (유튜브, 기사, 인터뷰)
  mediaActivities?: Array<{
    id: string;
    type: 'youtube' | 'article' | 'broadcast';
    title: string;
    publisher: string;
    date: string;
    url?: string;
    duration?: string;
    thumbnail?: string;
    views?: string;
  }>;

  // 5대 요소: 발간 리포트
  recentReports?: Report[];

  // 5대 요소: 트랙레코드 주가 vs 목표가 오버레이 시계열
  priceHistoryChartData?: Record<string, Array<{
    date: string; // e.g. 26.01, 26.02, 26.03...
    actualPrice: number; // 실제 주가
    targetPrice?: number; // 제시 목표주가
    reportEvent?: string; // e.g. "목표가 상향 리포트 발간 (BUY)"
  }>>;

  // Strengths & AI evaluation summary
  aiReviewSummary: string;
  topStockRecommendations: Array<{
    stockCode: string;
    stockName: string;
    targetPrice: number;
    achievedPrice: number;
    returnPercent: number;
    status: 'ACHIEVED' | 'IN_PROGRESS' | 'EXPIRED';
  }>;
}

export interface Report {
  id: string;
  title: string;
  analystId: string;
  analystName: string;
  brokerName: string;
  brokerId?: string;
  sector: SectorCategory;
  subSector?: string; // 세부분야 (e.g. HBM 메모리, 함정/MRO)
  stockCode: string;
  stockName: string;
  publishDate: string; // YYYY-MM-DD
  pdfUrl?: string;
  reportUrl?: string; // 네이버 증권 종목분석 상세페이지 URL
  nid?: string | number; // 네이버 증권 개별 리포트 고유 NID
  naverMatchedTitle?: string; // 네이버 증권 리서치 실제 게시판 제목 (e.g. "AI 경쟁력이 요구")
  naverArticleTitle?: string; // 네이버 증권 리서치 실제 게시판 제목
  coreThesis?: string; // LLM/분석 핵심 투자 포인트 & 실적 전망 테마 (e.g. "생성형 AI 서비스 본격화 및 서치 플랫폼 매출 회복")
  dataSourceCategory?: string; // 네이버 증권 > 리서치 > 종목분석 리포트
  dataSourceUrl?: string; // https://finance.naver.com/research/company_list.naver
  isSourceVerified?: boolean; // 데이터 원천 검증 여부

  // Detailed PDF Management & Download Verification
  pdfStatus?: OriginalPdfStatus; // 증권사 발행리포트원문 확보, 부재, 다운로드 불가 등 7가지
  pdfUnobtainedCategory?: PdfUnobtainedCategory; // 원문부재, 다운로드불가, 일시적실패 3가지 상위분류
  pdfFailReason?: string; // 실패 또는 미확보 세부 사유
  lastDownloadAttempt?: string; // 마지막 다운로드 시도 일시 (ISO string 또는 YYYY-MM-DD HH:mm)
  pdfFileSize?: string; // KB 단위
  pdfTypeTag?: '첨부_PDF' | '원문_PDF' | '증권사_발행리포트원문' | 'none';

  // Extracted Sector Analytics
  sectorAnalysis?: SectorAnalysisInfo;

  // Key Financial Targets
  currentPriceAtPublish: number; // 원
  currentPrice?: number; // 원 (별칭)
  targetPrice: number; // 원
  rating: InvestmentRating;
  opinion?: string; // 투자의견 (매수, Hold, 중립 등)
  disparityRate?: number; // 괴리율 (%)
  accuracyScore?: number; // 적중률 스코어

  // AI Analyzed Fields
  aiAnalyzed: boolean;
  aiAnalysis?: any;
  aiSummary: {
    keyTakeaways: string[]; // 3줄 핵심 요약
    financialForecast?: string; // LLM 실적 및 재무 전망 요약 (매출/영업이익 추정 등)
    bullishArguments: string[]; // 상승 정당화 요인
    bearishArguments: string[]; // 리스크 및 하방 요인
    fairnessRating: 'VERY_HIGH' | 'HIGH' | 'MODERATE' | 'LOW';
    objectivityScore: number; // 0 - 100
    logicIntegrityScore: number; // 0 - 100
    biasCheckNote: string; // 과도한 긍정 표명 여부, 객관적 수치 제시 여부
    catalystTimeline: string; // 주가 모멘텀 예상 시기
  };

  // Target Price History & Performance
  performanceHistory?: Array<{
    month: string;
    targetPrice: number;
    actualStockPrice: number;
  }>;
}

export interface PipelineLog {
  id: string;
  timestamp: string;
  brokerName: string;
  reportTitle: string;
  step: 'FETCH' | 'PARSE' | 'LLM_SUMMARY' | 'SCORE_EVAL' | 'SYNC_COMPLETE' | 'FILE_INGEST' | 'ERROR';
  message: string;
  status: 'success' | 'running' | 'failed';
}

export interface PipelineMetrics {
  activeBrokersCount: number;
  todayProcessedReports: number;
  avgObjectivityScore: number;
  pipelineStatus: 'RUNNING' | 'IDLE' | 'PAUSED';
  lastRunTimestamp: string;
  throughputPerMinute: number;
}

export interface NotificationSetting {
  enableAlerts: boolean;
  targetPriceChangeThresholdPercent: number; // e.g., 10% 이상 변경 시
  notifyRatingChanges: boolean; // 매수/중립 변경 시
  notifyLowObjectivityAlert: boolean; // 객관성 점수 60점 미만 시 Warning
  subscribedSectors: SectorCategory[];
  followedAnalystIds: string[];
  emailDigestFrequency: 'IMMEDIATE' | 'DAILY' | 'WEEKLY';
}

export interface NotificationItem {
  id: string;
  timestamp: string;
  type: 'TARGET_PRICE_CHANGE' | 'RATING_CHANGE' | 'NEW_REPORT' | 'OBJECTIVITY_WARNING' | 'BEST_ANALYST_UPDATE';
  title: string;
  message: string;
  relatedReportId?: string;
  relatedAnalystId?: string;
  read: boolean;
}

// 7 Detailed PDF States
export type OriginalPdfStatus =
  | 'OBTAINED'           // 원문 PDF 확보 (정상 바이너리 헤더 %PDF 검증 완료)
  | 'MISSING_ORIGINAL'   // 원문 PDF 부재 (네이버/증권사 내 첨부/원문 링크 없음)
  | 'UNDOWNLOADABLE'     // PDF 다운로드 불가 (로그인/DRM/세션/제공 방식 제약)
  | 'DOWNLOAD_FAILED'    // PDF 다운로드 실패 (타임아웃/네트워크 오리진 오류)
  | 'ACCESS_RESTRICTED'  // 접근 제한 (HTTP 403 / IP 차단)
  | 'INVALID_URL'        // URL 오류 (HTTP 404 / 빗나간 주소)
  | 'CORRUPTED_PDF';     // PDF 파일 오류 (0바이트 또는 손상된 파일)

// 3 High-level Unobtained Categories
export type PdfUnobtainedCategory =
  | 'NO_ORIGINAL'         // 원문 자체가 없는 경우 (MISSING_ORIGINAL)
  | 'RESTRICTED_DIRECT'   // 원문은 있지만 다운로드 불가능한 경우 (UNDOWNLOADABLE, ACCESS_RESTRICTED)
  | 'TEMPORARY_FAILURE';  // 다운로드를 시도했지만 일시적으로 실패한 경우 (DOWNLOAD_FAILED, INVALID_URL, CORRUPTED_PDF)

// Helper labels for UI rendering
export const PDF_STATUS_LABELS: Record<OriginalPdfStatus, { label: string; badgeColor: string; category: PdfUnobtainedCategory | 'SECURED' }> = {
  OBTAINED: { label: '증권사 발행리포트원문 확보', badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-800', category: 'SECURED' },
  MISSING_ORIGINAL: { label: '증권사 발행리포트원문 부재', badgeColor: 'bg-slate-900 text-slate-400 border-slate-700', category: 'NO_ORIGINAL' },
  UNDOWNLOADABLE: { label: '리포트원문 다운로드 불가', badgeColor: 'bg-amber-950 text-amber-300 border-amber-800', category: 'RESTRICTED_DIRECT' },
  DOWNLOAD_FAILED: { label: '리포트원문 다운로드 실패', badgeColor: 'bg-rose-950 text-rose-300 border-rose-800', category: 'TEMPORARY_FAILURE' },
  ACCESS_RESTRICTED: { label: '접근 제한 (403)', badgeColor: 'bg-purple-950 text-purple-300 border-purple-800', category: 'RESTRICTED_DIRECT' },
  INVALID_URL: { label: 'URL 오류 (404)', badgeColor: 'bg-orange-950 text-orange-300 border-orange-800', category: 'TEMPORARY_FAILURE' },
  CORRUPTED_PDF: { label: '리포트 파일 오류', badgeColor: 'bg-red-950 text-red-300 border-red-800', category: 'TEMPORARY_FAILURE' },
};

// Broker-level PDF Stats
export interface BrokerPdfStats {
  brokerName: string;
  totalReports: number;
  pdfSecuredCount: number;      // 원문 PDF 확보
  pdfUnobtainedCount: number;   // 원문 미확보 (부재 + 다운로드불가 + 실패 전체)
  noOriginalCount: number;      // 원문 부재
  undownloadableCount: number;  // 다운로드 불가 (제공방식 제한/접근제한)
  downloadFailedCount: number;  // 다운로드 실패 (일시적)
  acquisitionRate: number;      // 원문 확보율 (%)
  accessMethod: string;         // '공식 API / 크롤러 / 원문링크 / 세션인가'
}

// Global Admin Dashboard KPI Metrics
export interface OverallPdfDashboardStats {
  totalReports: number;
  pdfSecuredCount: number;       // PDF 원문 확보
  pdfUnobtainedCount: number;    // PDF 원문 미확보
  noOriginalCount: number;       // 원문 부재
  undownloadableCount: number;   // 다운로드 불가
  downloadFailedCount: number;   // 다운로드 실패
  overallAcquisitionRate: number;// 전체 원문 확보율 (%)
}

export interface VersionInfo {
  version: string;
  releaseDate: string;
  title: string;
  summary: string;
  highlights: string[];
  isCurrent?: boolean;
}

export type AttachmentStatus = 'SUCCESS' | 'NOT_FOUND' | 'FAILED';

export interface Pipeline01NaverReport {
  nid: string;
  stockName: string;
  stockCode: string;
  reportTitle: string;
  brokerName: string;
  analystName?: string;
  rawDate: string;
  publishDate: string;
  yymmdd: string;
  month?: string; // e.g. '2026-01'
  hits: number;
  pdfUrl: string;
  hasPdf: boolean;
  targetPrice?: number;
  currentPrice?: number;
  investmentOpinion?: string;
  sector?: string;
  attachment_status: 'SUCCESS' | 'NOT_FOUND' | 'FAILED';
  attachment_error?: string | null;
  reportUrl: string;
  standardFileName: string;
  is2026First?: boolean;
  isEarliestOf2026?: boolean;
  dataSourceCategory?: string;
  dataSourceUrl?: string;
  isDownloaded?: boolean;
  localFilePath?: string;
  fileSizeBytes?: number;
  bodyText?: string;
  paragraphs?: string[];
  characterCount?: number;
  contentHash?: string;
  dbVersion?: number;
  dbSyncStatus?: 'INSERTED' | 'UPDATED' | 'UNCHANGED' | 'NOT_SAVED';
  dbSavedAt?: string;
  isAIAnalyzed?: boolean;
  aiSummary?: string;
  objectivityScore?: number;
}

export type DbSyncStatus = 'INSERTED' | 'UPDATED' | 'UNCHANGED';

export interface ReportDbRecord {
  id: string;
  nid: string;
  stockCode: string;
  stockName: string;
  sector: string;
  reportTitle: string;
  brokerName: string;
  analystName: string;
  publishDate: string;
  rawDate: string;
  yymmdd: string;
  month: string;
  targetPrice: number;
  currentPrice: number;
  investmentOpinion: string;
  hits: number;
  hasPdf: boolean;
  pdfUrl: string;
  reportUrl: string;
  standardFileName: string;
  pdfStatus: OriginalPdfStatus;
  pdfStoragePath?: string;
  bodyText?: string;
  paragraphs?: string[];
  characterCount?: number;
  contentHash: string;
  version: number;
  syncStatus: DbSyncStatus;
  firstSavedAt: string;
  lastUpdatedAt: string;
  changeLog?: Array<{
    timestamp: string;
    version: number;
    changedFields: string[];
    prevHash: string;
    newHash: string;
    reason?: string;
  }>;
  embeddingVector?: number[]; // AI Vector embeddings (768-dim)
  aiSummary?: string;
  objectivityScore?: number;
  sentimentScore?: number;
  isAIAnalyzed: boolean;
  isSourceVerified: boolean;
}

export interface DbSyncResult {
  success: boolean;
  targetMonth: string;
  totalChecked: number;
  insertedCount: number;
  updatedCount: number;
  skippedCount: number;
  durationMs: number;
  syncedAt: string;
  syncLogId: string;
  message: string;
  details: Array<{
    nid: string;
    stockName: string;
    stockCode: string;
    brokerName: string;
    reportTitle: string;
    syncStatus: DbSyncStatus;
    version: number;
    reason: string;
    changedFields?: string[];
  }>;
}

export interface DbStorageStats {
  totalStoredRecords: number;
  totalUniqueStocks: number;
  totalBrokers: number;
  pdfSecuredCount: number;
  bodyTextExtractedCount: number;
  aiReadyIndex: number; // 0-100% score
  lastSyncedAt: string;
  versionStats: {
    v1Count: number;
    updatedVersionsCount: number;
  };
  monthlyBreakdown: Record<string, {
    total: number;
    pdfSecured: number;
    hasBodyText: number;
    lastUpdated: string;
  }>;
}


export interface MonthlyCollectionStatus {
  month: string; // '2026-01', '2026-02', etc.
  monthLabel: string; // '2026년 1월 (전수 815건)'
  totalReports: number;
  securedPdfs: number;
  totalHits: number;
  collectionRate: number; // 0 - 100
  status: 'COMPLETED' | 'IN_PROGRESS' | 'SCHEDULED' | 'READY';
  topBrokers: Array<{ brokerName: string; count: number }>;
  earliestDate: string;
  latestDate: string;
  sampleHighlights: string[];
  pageRange: string;
}

export interface CollectionScopeConfig {
  blockPostJuly: boolean;
  maxAllowedDate: string;
  minAllowedDate: string;
  modeName: string;
  lockedMonths: string[];
  allowedMonths: string[];
  lastUpdated: string;
  reason: string;
}

export interface Pipeline01CollectionOverview {
  totalReportsCollected: number;
  totalPdfsSecured: number;
  pdfSecuredRate: number;
  totalPdfSizeBytes: number;
  activeBrokersCount: number;
  first2026ReportDate: string;
  latest2026ReportDate: string;
  lastCollectedAt: string;
  monthlyBreakdown: MonthlyCollectionStatus[];
  scopeConfig?: CollectionScopeConfig;
}

export interface Pipeline01SelectionEstimate {
  targetKey: string;
  title: string;
  subtitle: string;
  estimatedCount: number;
  pageRange: string;
  estimatedPagesCount: number;
  estimatedPdfSizeMb: number;
  estimatedDurationSec: string;
  topLikelyBrokers: string[];
  keyHighlight: string;
  badge: string;
  badgeColor?: string;
  description: string;
}

export interface DartDisclosure {
  rcept_no: string;        // 접수번호 (14자리)
  corp_code?: string;      // DART 고유번호 (8자리)
  corp_name: string;       // 회사명 (예: 삼성전자)
  stock_code: string;      // 종목코드 (예: 005930)
  corp_cls?: string;       // 법인구분 (Y: 유가, K: 코스닥, N: 코넥스, E: 기타)
  rpt_nm: string;          // 공시제목 (예: [기재정정]분기보고서 (2026.03), 연결재무제표기준영업(잠정)실적(공정공시))
  flr_nm: string;          // 제출인/보고자명
  rcept_dt: string;        // 접수일자 (YYYYMMDD or YYYY-MM-DD)
  rm?: string;             // 비고 (유: 유가증권, 코: 코스닥, 채: 채권, 공: 공정공시 등)
  url: string;             // DART 원문 바로가기 URL
  category: 'EARNINGS' | 'PERIODIC' | 'CONTRACT' | 'EQUITY' | 'CAPITAL' | 'MATERIAL' | 'GENERAL';
  categoryLabel: string;
  categoryBadgeColor: string;
  daysDiffWithReport?: number; // 리포트 발간일과의 일수 차이 (-3 = 리포트 발간 3일 전 공시)
  isKeyMaterial?: boolean;     // 중대 공시 여부
  aiFactCheckNote?: string;    // AI 크로스체크/팩트체크 메모
}

export interface DartCorrelationAnalysis {
  stockName: string;
  stockCode: string;
  reportPublishDate: string;
  isLiveApi: boolean;
  totalDisclosures: number;
  closestDisclosure?: DartDisclosure | null;
  earningsSurpriseRate?: string | null;
  factCheckSummary: string;
  correlationScore: number; // 0 - 100
  disclosures: DartDisclosure[];
}

